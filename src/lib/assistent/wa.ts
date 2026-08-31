/**
 * WhatsApp Cloud API — heen en weer praten met Meta's Graph.
 *
 * Nodig in de omgeving:
 *   WA_TOKEN          permanent toegangstoken van de Meta-app (system user)
 *   WA_PHONE_ID       phone number id van het WhatsApp-nummer
 *   WA_VERIFY_TOKEN   zelfgekozen string, ook invullen bij de webhook in Meta
 *   WA_APP_SECRET     app secret; wordt gebruikt om de handtekening te checken
 *   WA_TOEGESTAAN     komma-gescheiden telefoonnummers die mogen sturen
 */

import { createHmac, timingSafeEqual } from "node:crypto";

const V = process.env.WA_GRAPH_VERSION ?? "v23.0";
// WA_GRAPH_BASE bestaat alleen om lokaal tegen een nep-Graph te kunnen testen.
const BASE = process.env.WA_GRAPH_BASE ?? `https://graph.facebook.com/${V}`;

export const waConfigured = () =>
  Boolean(process.env.WA_TOKEN && process.env.WA_PHONE_ID);

const auth = () => ({ Authorization: `Bearer ${process.env.WA_TOKEN}` });

async function graph(pad: string, init?: RequestInit) {
  const res = await fetch(`${BASE}/${pad}`, {
    ...init,
    headers: { ...auth(), ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    throw new Error(
      `WhatsApp ${pad}: ${res.status} ${(await res.text()).slice(0, 300)}`,
    );
  }
  return res;
}

async function send(payload: Record<string, unknown>) {
  const res = await graph(`${process.env.WA_PHONE_ID}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      ...payload,
    }),
  });
  return res.json();
}

/** WhatsApp kapt af boven 4096 tekens; knip op alinea's, anders op regels. */
export function knip(tekst: string, max = 3500): string[] {
  const uit: string[] = [];
  let rest = tekst.trim();
  while (rest.length > max) {
    let snee = rest.lastIndexOf("\n\n", max);
    if (snee < max * 0.5) snee = rest.lastIndexOf("\n", max);
    if (snee < max * 0.5) snee = rest.lastIndexOf(" ", max);
    if (snee <= 0) snee = max;
    uit.push(rest.slice(0, snee).trim());
    rest = rest.slice(snee).trim();
  }
  if (rest) uit.push(rest);
  return uit;
}

export async function stuurTekst(aan: string, tekst: string) {
  for (const stuk of knip(tekst)) {
    await send({ to: aan, type: "text", text: { preview_url: false, body: stuk } });
  }
}

/**
 * Ja/nee-knoppen. Zo werkt de bevestiging voor mail versturen en verwijderen
 * ook op de telefoon: het id van de knop draagt het tool_use_id mee terug.
 */
export async function stuurKeuze(
  aan: string,
  vraag: string,
  jaLabel: string,
  toolUseId: string,
) {
  await send({
    to: aan,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: vraag.slice(0, 1024) },
      action: {
        buttons: [
          // Knoplabels mogen maar 20 tekens zijn.
          { type: "reply", reply: { id: `ja:${toolUseId}`, title: jaLabel.slice(0, 20) } },
          { type: "reply", reply: { id: `nee:${toolUseId}`, title: "Nee, niet doen" } },
        ],
      },
    },
  });
}

export async function markeerGelezen(messageId: string) {
  await graph(`${process.env.WA_PHONE_ID}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
    }),
  }).catch(() => undefined);
}

// ---------- Binnenkomend ----------

export interface Binnen {
  van: string;
  messageId: string;
  tekst?: string;
  /** Op welk van onze nummers dit binnenkwam. Eén Meta-app kan er meerdere
   *  bedienen (FairCTO-portfolio: een nummer per bedrijf), dus hierop routeer
   *  je later naar het juiste dossier. */
  naarNummerId?: string;
  /** Ingevuld als er op een ja/nee-knop is getikt. */
  knop?: { toolUseId: string; akkoord: boolean };
}

/**
 * Afleverstatussen die Meta terugstuurt. Een 200 op /messages betekent alleen
 * "aangenomen"; of een bericht écht aankomt blijkt pas hieruit. Zonder dit is
 * een niet-afgeleverd bericht volledig onzichtbaar.
 */
export function leesStatussen(body: unknown): string[] {
  const b = body as {
    entry?: {
      changes?: {
        value?: {
          statuses?: {
            status?: string;
            recipient_id?: string;
            errors?: { code?: number; title?: string; message?: string }[];
          }[];
        };
      }[];
    }[];
  };
  const uit: string[] = [];
  for (const entry of b?.entry ?? []) {
    for (const change of entry.changes ?? []) {
      for (const st of change.value?.statuses ?? []) {
        const fout = st.errors?.[0];
        uit.push(
          `${st.status ?? "?"} -> ${st.recipient_id ?? "?"}` +
            (fout ? ` | ${fout.code} ${fout.title ?? ""} ${fout.message ?? ""}` : ""),
        );
      }
    }
  }
  return uit;
}

/** Meta nest het bericht vier lagen diep; dit haalt eruit wat we nodig hebben. */
export function leesWebhook(body: unknown): Binnen[] {
  const b = body as {
    entry?: {
      changes?: {
        value?: {
          metadata?: { phone_number_id?: string };
          messages?: Record<string, unknown>[];
        };
      }[];
    }[];
  };
  const uit: Binnen[] = [];
  for (const entry of b?.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const naarNummerId = change.value?.metadata?.phone_number_id;
      for (const m of change.value?.messages ?? []) {
        const msg = m as {
          from: string;
          id: string;
          type: string;
          text?: { body: string };
          interactive?: { button_reply?: { id: string; title: string } };
        };

        const knopId = msg.interactive?.button_reply?.id;
        const knop = knopId?.includes(":")
          ? {
              toolUseId: knopId.slice(knopId.indexOf(":") + 1),
              akkoord: knopId.startsWith("ja:"),
            }
          : undefined;

        uit.push({
          van: msg.from,
          messageId: msg.id,
          naarNummerId,
          tekst: msg.text?.body ?? msg.interactive?.button_reply?.title,
          knop,
        });
      }
    }
  }
  return uit;
}

/**
 * Is dit bericht voor ons nummer? Zodra er meer nummers onder dezelfde Meta-app
 * hangen, komt hier de routering naar het juiste dossier — nu nog: alleen het
 * eigen nummer beantwoorden, de rest laten liggen.
 */
export function voorOnsNummer(naarNummerId?: string): boolean {
  if (!naarNummerId) return true; // oudere payloads zonder metadata
  return naarNummerId === process.env.WA_PHONE_ID;
}

/** Alleen deze nummers mogen de assistent aansturen. */
export function magSturen(nummer: string): boolean {
  const lijst = (process.env.WA_TOEGESTAAN ?? "")
    .split(",")
    .map((n) => n.replace(/\D/g, ""))
    .filter(Boolean);
  if (lijst.length === 0) return false; // fail closed: niets ingesteld = niemand
  return lijst.includes(nummer.replace(/\D/g, ""));
}

/**
 * Slot 1 — geheim in de webhook-URL. Meta roept exact de URL aan die in de
 * app-instellingen staat, dus wie `?s=` niet kent, komt hier niet binnen. Dit
 * staat er omdat het App Secret achter een wachtwoordprompt zit; het is een
 * gangbaar webhook-patroon, maar zwakker dan een handtekening (de URL kan in
 * logs belanden). Altijd vereist.
 */
export function urlSleutelKlopt(url: string): boolean {
  const verwacht = process.env.WA_WEBHOOK_SLEUTEL;
  if (!verwacht) return false; // fail closed
  const gekregen = new URL(url).searchParams.get("s") ?? "";
  const a = Buffer.from(verwacht);
  const b = Buffer.from(gekregen);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Slot 2 — Meta ondertekent elke webhook met het app secret. Dit is het slot dat
 * echt bewijst dat Meta de afzender is; de URL-sleutel is er alleen als extra
 * laag. Beide zijn verplicht.
 */
export function handtekeningKlopt(ruweBody: string, header: string | null): boolean {
  const secret = process.env.WA_APP_SECRET;
  if (!secret) {
    // BEWUSTE UITZONDERING, ALLEEN VOOR DE TESTFASE.
    //
    // Het app secret zit achter een wachtwoordprompt die alleen Nuri kan
    // invullen. Zonder secret is de URL-sleutel (?s=) de enige drempel. Dat is
    // zwakker dan een handtekening: die sleutel staat in Vercels request-logs,
    // en de nummer-allowlist compenseert dat níet — magSturen() toetst `from`
    // uit dezelfde JSON die de aanroeper zelf schrijft, dus die bewijst niets
    // over de afzender.
    //
    // Aanvaardbaar zolang er geen echte cliëntgegevens in staan (het dossier
    // bevat nu testrecords). Vóór de eerste echte cliënt moet WA_APP_SECRET
    // gezet worden; dan gaat deze tak vanzelf uit en geldt de handtekening.
    console.warn(
      "[whatsapp] WA_APP_SECRET ontbreekt — alleen de URL-sleutel bewaakt deze endpoint. Zet het app secret vóór er echte cliëntgegevens in staan.",
    );
    return true;
  }
  if (!header?.startsWith("sha256=")) return false;

  const verwacht = createHmac("sha256", secret).update(ruweBody).digest();
  const gekregen = Buffer.from(header.slice(7), "hex");
  return (
    verwacht.length === gekregen.length && timingSafeEqual(verwacht, gekregen)
  );
}
