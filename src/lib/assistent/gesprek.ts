// Opslag van gesprekken. De ruwe Anthropic-contentblokken gaan de database in,
// zodat een draad exact hervat kan worden — inclusief tool_use-blokken waarvan
// het resultaat pas na een bevestiging binnenkomt.

import type Anthropic from "@anthropic-ai/sdk";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

export interface OpenBevestiging {
  id: string; // tool_use_id
  naam: string;
  invoer: Record<string, unknown>;
  omschrijving: string;
}

export interface WachtOp {
  /** Al uitgevoerde tools uit dezelfde beurt: tool_use_id -> resultaattekst. */
  klaar: Record<string, { tekst: string; fout: boolean }>;
  /** Tools die nog op een klik van Meyrem wachten. */
  open: OpenBevestiging[];
}

export async function nieuwGesprek(): Promise<string> {
  const g = await db.assistentGesprek.create({ data: {} });
  return g.id;
}

export async function bewaarBericht(
  gesprekId: string,
  rol: "user" | "assistant",
  inhoud: Anthropic.ContentBlockParam[],
): Promise<void> {
  await db.assistentBericht.create({
    data: { gesprekId, rol, inhoud: inhoud as never },
  });
  await db.assistentGesprek.update({
    where: { id: gesprekId },
    data: { updatedAt: new Date() },
  });
}

const MAX_BERICHTEN = 30;

const blokkenVan = (m: Anthropic.MessageParam): Anthropic.ContentBlockParam[] =>
  Array.isArray(m.content)
    ? (m.content as Anthropic.ContentBlockParam[])
    : [{ type: "text", text: String(m.content) }];

const heeft = (m: Anthropic.MessageParam, type: string) =>
  blokkenVan(m).some((b) => (b as { type?: string }).type === type);

/** Een geldig beginpunt: een gebruikersbericht dat niet met tool_results opent. */
const magBeginnen = (m: Anthropic.MessageParam) =>
  m.role === "user" && !heeft(m, "tool_result");

/**
 * Haalt de draad op in het formaat dat de API verwacht — en repareert hem
 * onderweg. Er zijn vier manieren waarop een opgeslagen draad ongeldig kan
 * zijn, en alle vier zijn in productie waargenomen of aantoonbaar mogelijk:
 *
 *  1. afkappen laat een tool_result vooraan staan zonder zijn tool_use;
 *  2. afkappen laat niets over (een beurt met 15+ toolrondes vult het venster);
 *  3. een afgebroken run laat een tool_use achter zonder tool_result, waarna
 *     élke volgende beurt 400t — twaalf uur lang, want de draad wordt hervat;
 *  4. twee opeenvolgende gebruikersberichten (afgewezen bevestiging + nieuwe
 *     vraag) maken de rollen niet-alternerend.
 *
 * Liever een gerepareerde draad dan een dossier-assistent die stilvalt.
 */
export async function laadBerichten(
  gesprekId: string,
): Promise<Anthropic.MessageParam[]> {
  const rijen = await db.assistentBericht.findMany({
    where: { gesprekId },
    orderBy: { createdAt: "asc" },
  });

  const alles: Anthropic.MessageParam[] = rijen.map((r) => ({
    role: r.rol as "user" | "assistant",
    content: r.inhoud as unknown as Anthropic.ContentBlockParam[],
  }));

  // (1)+(2) Afkappen, maar nooit tot niets: zoek het laatste geldige beginpunt
  // binnen het venster; is er geen, neem dan het laatste beginpunt uit de hele
  // draad, ook als dat een langer venster oplevert.
  let berichten = alles;
  if (alles.length > MAX_BERICHTEN) {
    const venster = alles.slice(-MAX_BERICHTEN);
    const eersteGeldig = venster.findIndex(magBeginnen);
    if (eersteGeldig >= 0) {
      berichten = venster.slice(eersteGeldig);
    } else {
      let start = alles.length - 1;
      while (start > 0 && !magBeginnen(alles[start])) start--;
      berichten = alles.slice(start);
    }
  }

  // (3) Onbeantwoorde tool_use-blokken alsnog beantwoorden, anders weigert de
  // API de hele reeks.
  const uit: Anthropic.MessageParam[] = [];
  for (let i = 0; i < berichten.length; i++) {
    const m = berichten[i];
    uit.push(m);
    if (m.role !== "assistant") continue;
    const open = blokkenVan(m).filter(
      (b) => (b as { type?: string }).type === "tool_use",
    ) as Anthropic.ToolUseBlockParam[];
    if (open.length === 0) continue;

    const volgende = berichten[i + 1];
    const beantwoord = new Set(
      volgende && volgende.role === "user"
        ? blokkenVan(volgende)
            .filter((b) => (b as { type?: string }).type === "tool_result")
            .map((b) => (b as Anthropic.ToolResultBlockParam).tool_use_id)
        : [],
    );
    const missend = open.filter((b) => !beantwoord.has(b.id));
    if (missend.length === 0) continue;

    uit.push({
      role: "user",
      content: missend.map((b) => ({
        type: "tool_result" as const,
        tool_use_id: b.id,
        content: "Deze actie is afgebroken en niet uitgevoerd.",
        is_error: true,
      })),
    });
  }

  // (4) Opeenvolgende beurten van dezelfde rol samenvoegen.
  const samengevoegd: Anthropic.MessageParam[] = [];
  for (const m of uit) {
    const vorige = samengevoegd[samengevoegd.length - 1];
    if (vorige && vorige.role === m.role) {
      vorige.content = [...blokkenVan(vorige), ...blokkenVan(m)];
    } else {
      samengevoegd.push({ role: m.role, content: blokkenVan(m) });
    }
  }

  return samengevoegd;
}

/**
 * Claimt de openstaande bevestigingen atomair. Twee tikken op dezelfde knop
 * zijn twee losse binnenkomende berichten die allebei door de dedupe komen en
 * naast elkaar draaien; zonder deze claim wordt de mail twee keer verstuurd.
 * De eerste aanroep krijgt de inhoud, de tweede krijgt null.
 */
export async function claimWachtOp(gesprekId: string): Promise<WachtOp | null> {
  const g = await db.assistentGesprek.findUnique({
    where: { id: gesprekId },
    select: { wachtOp: true },
  });
  const wacht = (g?.wachtOp as unknown as WachtOp | null) ?? null;
  if (!wacht || wacht.open.length === 0) return null;

  // Eén UPDATE die alleen slaagt zolang er nog iets geparkeerd staat.
  const claim = await db.assistentGesprek.updateMany({
    where: { id: gesprekId, wachtOp: { not: Prisma.DbNull } },
    data: { wachtOp: Prisma.DbNull },
  });
  return claim.count === 1 ? wacht : null;
}

/** Welk gesprek heeft deze knop nog openstaan? Null = de knop is verlopen. */
export async function gesprekMetOpenBevestiging(
  waVan: string,
  toolUseId: string,
): Promise<string | null> {
  const kandidaten = await db.assistentGesprek.findMany({
    where: { waVan, wachtOp: { not: Prisma.DbNull } },
    orderBy: { updatedAt: "desc" },
    take: 20,
    select: { id: true, wachtOp: true },
  });
  for (const k of kandidaten) {
    const w = k.wachtOp as unknown as WachtOp | null;
    if (w?.open.some((o) => o.id === toolUseId)) return k.id;
  }
  return null;
}

export async function zetWachtOp(
  gesprekId: string,
  wachtOp: WachtOp | null,
): Promise<void> {
  await db.assistentGesprek.update({
    where: { id: gesprekId },
    data: { wachtOp: (wachtOp as never) ?? null },
  });
}

export async function leesWachtOp(gesprekId: string): Promise<WachtOp | null> {
  const g = await db.assistentGesprek.findUnique({ where: { id: gesprekId } });
  return (g?.wachtOp as unknown as WachtOp | null) ?? null;
}

/** Eerste zin van Meyrems eerste vraag wordt de titel in de zijbalk. */
export async function zetTitelIndienLeeg(
  gesprekId: string,
  vraag: string,
): Promise<void> {
  const g = await db.assistentGesprek.findUnique({
    where: { id: gesprekId },
    select: { titel: true },
  });
  if (g?.titel) return;
  const titel = vraag.replace(/\s+/g, " ").trim().slice(0, 70);
  if (!titel) return;
  await db.assistentGesprek.update({
    where: { id: gesprekId },
    data: { titel: titel.length === 70 ? titel + "…" : titel },
  });
}
