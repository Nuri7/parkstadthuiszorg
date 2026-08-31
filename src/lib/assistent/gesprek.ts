// Opslag van gesprekken. De ruwe Anthropic-contentblokken gaan de database in,
// zodat een draad exact hervat kan worden — inclusief tool_use-blokken waarvan
// het resultaat pas na een bevestiging binnenkomt.

import type Anthropic from "@anthropic-ai/sdk";
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

/**
 * Haalt de draad op in het formaat dat de API verwacht. Lange gesprekken worden
 * vooraan afgekapt; we schuiven dan door tot een gebruikersbericht dat níet met
 * een tool_result begint, anders weigert de API de reeks.
 */
export async function laadBerichten(
  gesprekId: string,
): Promise<Anthropic.MessageParam[]> {
  const rijen = await db.assistentBericht.findMany({
    where: { gesprekId },
    orderBy: { createdAt: "asc" },
  });

  let berichten: Anthropic.MessageParam[] = rijen.map((r) => ({
    role: r.rol as "user" | "assistant",
    content: r.inhoud as unknown as Anthropic.ContentBlockParam[],
  }));

  if (berichten.length > MAX_BERICHTEN) {
    berichten = berichten.slice(-MAX_BERICHTEN);
    while (berichten.length > 0) {
      const eerste = berichten[0];
      const blokken = eerste.content;
      const begintMetToolResult =
        Array.isArray(blokken) &&
        blokken.some((b) => (b as { type?: string }).type === "tool_result");
      if (eerste.role === "user" && !begintMetToolResult) break;
      berichten = berichten.slice(1);
    }
  }

  return berichten;
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
