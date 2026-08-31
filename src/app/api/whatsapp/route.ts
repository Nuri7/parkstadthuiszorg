// WhatsApp-ingang naar de assistent. Meyrem appt, de assistent doet hetzelfde
// als in /admin/assistent — zelfde tools, zelfde dossier, zelfde geheugen.
//
// Drie dingen die hier echt moeten:
// 1. Afzender bewijzen. Altijd de geheime `?s=` uit de URL; staat WA_APP_SECRET
//    ingesteld, dan óók Meta's HMAC-handtekening. Deze URL is publiek en er
//    hangt schrijftoegang tot het cliëntdossier achter.
// 2. Nummer-allowlist. Iedereen kan een zakelijk WhatsApp-nummer aanschrijven.
// 3. Snel 200 teruggeven en het echte werk in after() doen — de assistent doet
//    er soms een halve minuut over en Meta levert na ~20 s opnieuw.

import { after } from "next/server";
import { db } from "@/lib/db";
import { draaiLus } from "@/lib/assistent/lus";
import { leesWachtOp } from "@/lib/assistent/gesprek";
import {
  handtekeningKlopt,
  urlSleutelKlopt,
  leesWebhook,
  magSturen,
  markeerGelezen,
  stuurKeuze,
  stuurTekst,
  voorOnsNummer,
  waConfigured,
  type Binnen,
} from "@/lib/assistent/wa";

export const runtime = "nodejs";
export const maxDuration = 300;

/** Meta verifieert de webhook één keer met een GET. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (!urlSleutelKlopt(req.url)) {
    return new Response("Verificatie mislukt", { status: 403 });
  }

  const verwacht = process.env.WA_VERIFY_TOKEN;
  if (verwacht && mode === "subscribe" && token === verwacht) {
    return new Response(challenge ?? "", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
  return new Response("Verificatie mislukt", { status: 403 });
}

export async function POST(req: Request) {
  const ruw = await req.text();

  if (!urlSleutelKlopt(req.url)) {
    return new Response("Ongeldige sleutel", { status: 401 });
  }
  if (!handtekeningKlopt(ruw, req.headers.get("x-hub-signature-256"))) {
    return new Response("Ongeldige handtekening", { status: 401 });
  }
  if (!waConfigured()) {
    return Response.json({ error: "WhatsApp niet ingesteld" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = JSON.parse(ruw);
  } catch {
    return Response.json({ ok: true }); // niets te doen, maar Meta niet laten herleveren
  }

  const berichten = leesWebhook(body);

  for (const bericht of berichten) {
    if (!voorOnsNummer(bericht.naarNummerId)) {
      console.warn("[whatsapp] ander nummer van de app:", bericht.naarNummerId);
      continue;
    }
    if (!magSturen(bericht.van)) {
      console.warn("[whatsapp] genegeerd, nummer niet toegestaan:", bericht.van);
      continue;
    }
    if (await alVerwerkt(bericht.messageId)) continue;

    after(
      verwerk(bericht).catch(async (e) => {
        console.error("[whatsapp]", e);
        await stuurTekst(
          bericht.van,
          "Er ging iets mis aan mijn kant. Probeer het zo nog eens.",
        ).catch(() => undefined);
      }),
    );
  }

  return Response.json({ ontvangen: berichten.length });
}

/** Insert lukt maar één keer — dat is meteen de sluis tegen herlevering. */
async function alVerwerkt(messageId: string): Promise<boolean> {
  try {
    await db.waVerwerkt.create({ data: { messageId } });
    return false;
  } catch {
    return true;
  }
}

async function verwerk(bericht: Binnen) {
  await markeerGelezen(bericht.messageId);

  const gesprekId = await gesprekVoor(bericht);
  if (!gesprekId) {
    await stuurTekst(bericht.van, "Nieuw gesprek. Waar wil je mee beginnen?");
    return;
  }

  // Wat de lus produceert verzamelen we; WhatsApp wil hele berichten, geen stream.
  const stukken: string[] = [];
  const acties: string[] = [];
  let openstaand: { id: string; naam: string; invoer: Record<string, unknown>; omschrijving: string }[] = [];
  let fout: string | null = null;

  const stuur = (data: Record<string, unknown>) => {
    switch (data.type) {
      case "tekst":
        stukken.push(String(data.tekst));
        break;
      case "tool":
        if (data.fout) acties.push(`⚠︎ ${data.samenvatting}`);
        break;
      case "bevestiging":
        openstaand = data.open as typeof openstaand;
        break;
      case "fout":
        fout = String(data.bericht);
        break;
    }
  };

  await draaiLus(
    gesprekId,
    bericht.knop
      ? {
          kanaal: "whatsapp" as const,
          besluiten: [{ id: bericht.knop.toolUseId, akkoord: bericht.knop.akkoord }],
        }
      : { kanaal: "whatsapp" as const, bericht: bericht.tekst ?? "" },
    stuur,
  );

  const antwoord = [...acties, stukken.join("")].join("\n").trim();
  if (antwoord) await stuurTekst(bericht.van, antwoord);
  if (fout) await stuurTekst(bericht.van, fout);

  // Openstaande bevestiging wordt een ja/nee-knop. Bij mail eerst de tekst
  // zelf sturen — die past niet in de 1024 tekens van een knopbericht.
  for (const item of openstaand) {
    if (item.naam === "mail_stuur") {
      const inv = item.invoer as Record<string, string>;
      await stuurTekst(
        bericht.van,
        `*Concept-mail*\nAan: ${inv.aan}\nOnderwerp: ${inv.onderwerp}\n\n${inv.tekst}`,
      );
      await stuurKeuze(bericht.van, "Zal ik deze mail versturen?", "Versturen", item.id);
    } else {
      await stuurKeuze(
        bericht.van,
        `${item.omschrijving}. Dit kan niet ongedaan gemaakt worden.`,
        "Ja, verwijderen",
        item.id,
      );
    }
  }

  if (!antwoord && !fout && openstaand.length === 0) {
    await stuurTekst(bericht.van, "Klaar.");
  }
}

const VERS_MS = 12 * 60 * 60 * 1000; // draad van vandaag hervatten, niet die van vorige week

/**
 * Welk gesprek hoort bij dit nummer. "nieuw" begint een schone draad; verder
 * pakt hij de laatste van dit nummer op, zodat een gesprek op de telefoon
 * gewoon doorloopt.
 */
async function gesprekVoor(bericht: Binnen): Promise<string | null> {
  const opdracht = (bericht.tekst ?? "").trim().toLowerCase();
  const wilNieuw = !bericht.knop && ["nieuw", "opnieuw", "reset"].includes(opdracht);

  const laatste = await db.assistentGesprek.findFirst({
    where: { waVan: bericht.van },
    orderBy: { updatedAt: "desc" },
    select: { id: true, updatedAt: true },
  });

  if (wilNieuw) {
    // Schone draad klaarzetten; null betekent "nog geen vraag om te draaien".
    await db.assistentGesprek.create({ data: { waVan: bericht.van } });
    return null;
  }

  // Een knop hoort altijd bij de draad waarin hij gesteld is.
  if (bericht.knop && laatste) {
    const wacht = await leesWachtOp(laatste.id);
    if (wacht?.open.some((o) => o.id === bericht.knop!.toolUseId)) return laatste.id;
  }

  if (laatste && Date.now() - laatste.updatedAt.getTime() < VERS_MS) {
    return laatste.id;
  }

  const g = await db.assistentGesprek.create({ data: { waVan: bericht.van } });
  return g.id;
}
