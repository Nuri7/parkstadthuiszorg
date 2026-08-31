// De assistent-lus, los van het transport. De webchat streamt hem via SSE, de
// WhatsApp-webhook verzamelt hem tot losse berichten — beide draaien dezelfde
// lus, met dezelfde tools en hetzelfde geheugen.

import Anthropic from "@anthropic-ai/sdk";
import {
  BEVESTIGING_NODIG,
  bevestigingsTekst,
  tools,
  voerToolUit,
} from "@/lib/assistent/tools";
import { systeemPrompt } from "@/lib/assistent/prompt";
import {
  bewaarBericht,
  laadBerichten,
  leesWachtOp,
  zetTitelIndienLeeg,
  zetWachtOp,
  type OpenBevestiging,
  type WachtOp,
} from "@/lib/assistent/gesprek";

export const MODEL = "claude-opus-5";
const MAX_RONDES = 20; // vangnet tegen een lus die niet tot rust komt

export interface Verzoek {
  gesprekId?: string;
  bericht?: string;
  besluiten?: { id: string; akkoord: boolean }[];
  /** Bepaalt de schrijfstijl; de tools en het geheugen zijn identiek. */
  kanaal?: "web" | "whatsapp";
}

export type Stuur = (data: Record<string, unknown>) => void;

export async function draaiLus(gesprekId: string, body: Verzoek, stuur: Stuur) {
  // ---- 1. Afhandelen wat er nog openstond ----
  const wachtOp = await leesWachtOp(gesprekId);
  if (wachtOp && wachtOp.open.length > 0) {
    const besluiten = new Map(
      (body.besluiten ?? []).map((b) => [b.id, b.akkoord]),
    );
    // Stuurt Meyrem een nieuw bericht terwijl er nog iets openstaat, dan is dat
    // een impliciete afwijzing — anders blijft de draad voorgoed hangen.
    const nieuwBericht = Boolean(body.bericht?.trim());

    const nogOpen: OpenBevestiging[] = [];
    for (const item of wachtOp.open) {
      const akkoord = besluiten.get(item.id);
      if (akkoord === undefined && !nieuwBericht) {
        nogOpen.push(item);
        continue;
      }
      if (akkoord === true) {
        stuur({ type: "toolStart", naam: item.naam, omschrijving: item.omschrijving });
        const res = await voerToolUit(item.naam, item.invoer, gesprekId);
        wachtOp.klaar[item.id] = { tekst: res.tekst, fout: res.fout };
        stuur({ type: "tool", naam: item.naam, samenvatting: res.samenvatting, fout: res.fout });
      } else {
        wachtOp.klaar[item.id] = {
          tekst: "Meyrem heeft deze actie afgewezen. Voer hem niet opnieuw uit; vraag wat ze in plaats daarvan wil.",
          fout: false,
        };
        stuur({ type: "tool", naam: item.naam, samenvatting: "afgewezen", fout: false });
      }
    }

    if (nogOpen.length > 0) {
      wachtOp.open = nogOpen;
      await zetWachtOp(gesprekId, wachtOp);
      stuur({ type: "bevestiging", open: nogOpen });
      stuur({ type: "klaar" });
      return;
    }

    await bewaarBericht(
      gesprekId,
      "user",
      Object.entries(wachtOp.klaar).map(([id, r]) => ({
        type: "tool_result" as const,
        tool_use_id: id,
        content: r.tekst,
        is_error: r.fout,
      })),
    );
    await zetWachtOp(gesprekId, null);
  }

  // ---- 2. Nieuw bericht van Meyrem ----
  if (body.bericht?.trim()) {
    const tekst = body.bericht.trim();
    await bewaarBericht(gesprekId, "user", [{ type: "text", text: tekst }]);
    await zetTitelIndienLeeg(gesprekId, tekst);
  }

  // ---- 3. De lus ----
  const client = new Anthropic();
  const { vast, variabel } = systeemPrompt(new Date(), body.kanaal ?? "web");

  for (let ronde = 0; ronde < MAX_RONDES; ronde++) {
    const berichten = await laadBerichten(gesprekId);
    if (berichten.length === 0) {
      stuur({ type: "klaar" });
      return;
    }

    const antwoord = client.messages.stream({
      model: MODEL,
      max_tokens: 32000,
      thinking: { type: "adaptive", display: "summarized" },
      system: [
        { type: "text", text: vast, cache_control: { type: "ephemeral" } },
        { type: "text", text: variabel },
      ],
      tools,
      messages: berichten,
    });

    for await (const event of antwoord) {
      if (event.type === "content_block_delta") {
        if (event.delta.type === "text_delta") {
          stuur({ type: "tekst", tekst: event.delta.text });
        } else if (event.delta.type === "thinking_delta") {
          stuur({ type: "denken", tekst: event.delta.thinking });
        }
      }
    }

    const bericht = await antwoord.finalMessage();
    await bewaarBericht(
      gesprekId,
      "assistant",
      bericht.content as unknown as Anthropic.ContentBlockParam[],
    );

    if (bericht.stop_reason === "refusal") {
      stuur({
        type: "fout",
        bericht: "Dit verzoek is geweigerd. Vraag het op een andere manier of vraag Nuri om hulp.",
      });
      stuur({ type: "klaar" });
      return;
    }

    if (bericht.stop_reason !== "tool_use") {
      stuur({ type: "klaar" });
      return;
    }

    // Tools uitvoeren; wat bevestiging nodig heeft, parkeren we.
    const toolBlokken = bericht.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
    );
    const nieuweWacht: WachtOp = { klaar: {}, open: [] };

    for (const blok of toolBlokken) {
      const invoer = (blok.input ?? {}) as Record<string, unknown>;
      if (BEVESTIGING_NODIG.has(blok.name)) {
        nieuweWacht.open.push({
          id: blok.id,
          naam: blok.name,
          invoer,
          omschrijving: bevestigingsTekst(blok.name, invoer),
        });
        continue;
      }
      stuur({ type: "toolStart", naam: blok.name, omschrijving: kort(blok.name, invoer) });
      const res = await voerToolUit(blok.name, invoer, gesprekId);
      nieuweWacht.klaar[blok.id] = { tekst: res.tekst, fout: res.fout };
      stuur({ type: "tool", naam: blok.name, samenvatting: res.samenvatting, fout: res.fout });
    }

    if (nieuweWacht.open.length > 0) {
      await zetWachtOp(gesprekId, nieuweWacht);
      stuur({ type: "bevestiging", open: nieuweWacht.open });
      stuur({ type: "klaar" });
      return;
    }

    await bewaarBericht(
      gesprekId,
      "user",
      toolBlokken.map((b) => ({
        type: "tool_result" as const,
        tool_use_id: b.id,
        content: nieuweWacht.klaar[b.id].tekst,
        is_error: nieuweWacht.klaar[b.id].fout,
      })),
    );
  }

  stuur({
    type: "fout",
    bericht: `De assistent bleef doorwerken na ${MAX_RONDES} stappen en is gestopt. Stel je vraag kleiner.`,
  });
  stuur({ type: "klaar" });
}

/** Regel die in de chat verschijnt terwijl een tool draait. */
function kort(naam: string, invoer: Record<string, unknown>): string {
  switch (naam) {
    case "db_zoek":
    case "db_tel":
      return `${invoer.model} opzoeken`;
    case "db_maak":
      return `${invoer.model} aanmaken`;
    case "db_wijzig":
      return `${invoer.model} bijwerken`;
    case "mail_inbox":
      return "mailbox bekijken";
    case "mail_lees":
      return "mail lezen";
    case "mail_markeer":
      return "mail markeren";
    case "mail_mappen":
      return "mailmappen ophalen";
    default:
      return naam;
  }
}
