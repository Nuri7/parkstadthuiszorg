// Opgeslagen contentblokken -> regels zoals ze in de chat staan. Wordt gebruikt
// om een bewaard gesprek terug te tonen na een herlaad.

import type Anthropic from "@anthropic-ai/sdk";

export interface ChatActie {
  naam: string;
  samenvatting: string;
  fout?: boolean;
}

export interface ChatRegel {
  rol: "user" | "assistant";
  tekst: string;
  denken?: string;
  acties: ChatActie[];
}

interface RuwBericht {
  rol: string;
  inhoud: unknown;
}

const blokken = (b: RuwBericht): Anthropic.ContentBlockParam[] =>
  Array.isArray(b.inhoud) ? (b.inhoud as Anthropic.ContentBlockParam[]) : [];

export function naarRegels(berichten: RuwBericht[]): ChatRegel[] {
  const regels: ChatRegel[] = [];

  for (const bericht of berichten) {
    const bs = blokken(bericht);

    // Tool-resultaten horen bij de vorige assistent-regel, niet bij een eigen bubbel.
    const resultaten = bs.filter(
      (b) => (b as { type?: string }).type === "tool_result",
    ) as Anthropic.ToolResultBlockParam[];
    if (resultaten.length > 0) {
      const vorige = regels[regels.length - 1];
      if (vorige?.rol === "assistant") {
        resultaten.forEach((r, i) => {
          const actie = vorige.acties[vorige.acties.length - resultaten.length + i];
          if (actie && r.is_error) actie.fout = true;
        });
      }
      continue;
    }

    const tekst = bs
      .filter((b) => (b as { type?: string }).type === "text")
      .map((b) => (b as Anthropic.TextBlockParam).text)
      .join("\n")
      .trim();

    const denken = bs
      .filter((b) => (b as { type?: string }).type === "thinking")
      .map((b) => (b as { thinking?: string }).thinking ?? "")
      .join("\n")
      .trim();

    const acties = bs
      .filter((b) => (b as { type?: string }).type === "tool_use")
      .map((b) => {
        const t = b as Anthropic.ToolUseBlockParam;
        return { naam: t.name, samenvatting: t.name };
      });

    if (!tekst && !denken && acties.length === 0) continue;

    regels.push({
      rol: bericht.rol === "user" ? "user" : "assistant",
      tekst,
      denken: denken || undefined,
      acties,
    });
  }

  return regels;
}
