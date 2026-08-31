// De gereedschapskist van de assistent: volledige lees- én schrijftoegang tot
// het dossier, plus mail lezen en versturen.
//
// Twee acties zijn bewust "gated": verwijderen en mail versturen. Die zijn niet
// terug te draaien, dus daar vraagt de assistent eerst om een klik van Meyrem
// (zie route.ts / het bevestigingskaartje in de chat). Al het andere gaat
// meteen door — dat is het punt van deze assistent.

import type Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import {
  coerceer,
  delegate,
  modelNamen,
  schrijfbareVelden,
  serialiseer,
  vindModel,
} from "./schema";
import {
  leesMail,
  lijstMail,
  lijstMappen,
  markeerMail,
  stuurMail,
  type MailUit,
} from "./mail";

/** Tools die pas draaien nadat Meyrem in de chat op "Ja" heeft geklikt. */
export const BEVESTIGING_NODIG = new Set(["db_verwijder", "mail_stuur"]);

/** Tools die data wijzigen of naar buiten treden (voor het auditspoor). */
const SCHRIJFT = new Set([
  "db_maak",
  "db_wijzig",
  "db_verwijder",
  "mail_stuur",
  "mail_markeer",
]);

const modelEnum = { type: "string" as const, enum: modelNamen };

export const tools: Anthropic.Tool[] = [
  {
    name: "db_zoek",
    description:
      "Zoek records op in de database. Geeft de gevonden records terug als JSON. " +
      "Gebruik dit vóór elke wijziging om het juiste id te vinden. " +
      "`waar` is een Prisma where-object, dus filters als " +
      '{"achternaam":{"contains":"Jans","mode":"insensitive"}} of ' +
      '{"datum":{"gte":"2026-09-01","lt":"2026-09-08"}} werken. ' +
      "Met `meenemen` haal je gekoppelde records op, bv. {\"financieringen\":true}.",
    input_schema: {
      type: "object",
      properties: {
        model: modelEnum,
        waar: { type: "object", description: "Prisma where-filter (optioneel)." },
        meenemen: {
          type: "object",
          description: "Prisma include voor relaties (optioneel).",
        },
        sorteren: {
          type: "object",
          description: 'Prisma orderBy, bv. {"createdAt":"desc"} (optioneel).',
        },
        aantal: {
          type: "integer",
          description: "Maximum aantal records (standaard 25, hoogstens 100).",
        },
        overslaan: { type: "integer", description: "Sla de eerste N records over." },
        metBsn: {
          type: "boolean",
          description:
            "Alleen op true zetten als Meyrem uitdrukkelijk om het BSN vraagt. Standaard blijft dat veld weg.",
        },
      },
      required: ["model"],
    },
  },
  {
    name: "db_tel",
    description: "Tel hoeveel records aan een filter voldoen. Sneller dan alles ophalen.",
    input_schema: {
      type: "object",
      properties: {
        model: modelEnum,
        waar: { type: "object", description: "Prisma where-filter (optioneel)." },
      },
      required: ["model"],
    },
  },
  {
    name: "db_maak",
    description:
      "Maak een nieuw record aan. `gegevens` bevat de velden uit het schema. " +
      "Datums als \"2026-09-01\" of \"2026-09-01T09:30\". Verplichte velden moeten erin; " +
      "vraag het aan Meyrem als je iets verplichts niet weet. " +
      "Koppel aan een cliënt met clientId (zoek dat eerst op met db_zoek).",
    input_schema: {
      type: "object",
      properties: {
        model: modelEnum,
        gegevens: { type: "object", description: "De veldwaarden van het nieuwe record." },
      },
      required: ["model", "gegevens"],
    },
  },
  {
    name: "db_wijzig",
    description:
      "Wijzig een bestaand record. Alleen de velden in `gegevens` veranderen; " +
      "de rest blijft staan. Geef een leeg veld door als null om het te wissen.",
    input_schema: {
      type: "object",
      properties: {
        model: modelEnum,
        id: { type: "string", description: "Het id van het record." },
        gegevens: { type: "object", description: "De velden die je wilt wijzigen." },
      },
      required: ["model", "id", "gegevens"],
    },
  },
  {
    name: "db_verwijder",
    description:
      "Verwijder een record definitief. Let op: een cliënt verwijderen wist ook " +
      "zijn financieringen, bezoeken, zorgplannen en wonden. Meyrem moet dit eerst " +
      "bevestigen. Overweeg of status wijzigen (bv. AFGESLOTEN) niet beter is.",
    input_schema: {
      type: "object",
      properties: {
        model: modelEnum,
        id: { type: "string" },
        reden: {
          type: "string",
          description: "Waarom dit weg mag — wordt aan Meyrem getoond bij de bevestiging.",
        },
      },
      required: ["model", "id"],
    },
  },
  {
    name: "mail_inbox",
    description:
      "Bekijk de mailbox van Parkstad Thuiszorg: geeft afzender, onderwerp, datum en " +
      "of een bericht gelezen is. Geeft niet de inhoud — gebruik daarvoor mail_lees.",
    input_schema: {
      type: "object",
      properties: {
        map: { type: "string", description: 'Mailmap, standaard "INBOX".' },
        aantal: { type: "integer", description: "Hoeveel berichten (standaard 15, max 50)." },
        ongelezen: { type: "boolean", description: "Alleen ongelezen berichten." },
        zoek: { type: "string", description: "Zoekterm in afzender, onderwerp of tekst." },
        sinds: { type: "string", description: 'Alleen mail vanaf deze datum, "2026-08-01".' },
      },
      required: [],
    },
  },
  {
    name: "mail_lees",
    description: "Lees één bericht volledig, op uid uit mail_inbox.",
    input_schema: {
      type: "object",
      properties: {
        uid: { type: "integer" },
        map: { type: "string", description: 'Standaard "INBOX".' },
      },
      required: ["uid"],
    },
  },
  {
    name: "mail_mappen",
    description: "Welke mailmappen bestaan er (INBOX, Verzonden, Archief, ...).",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "mail_markeer",
    description: "Zet een bericht op gelezen of ongelezen.",
    input_schema: {
      type: "object",
      properties: {
        uid: { type: "integer" },
        gelezen: { type: "boolean" },
        map: { type: "string" },
      },
      required: ["uid", "gelezen"],
    },
  },
  {
    name: "mail_stuur",
    description:
      "Verstuur een e-mail namens Parkstad Thuiszorg. Meyrem krijgt de volledige mail " +
      "te zien en moet op versturen klikken. Schrijf een complete, nette Nederlandse " +
      "mail — geen plaatshouders zoals [naam]. Zet nooit een BSN of medische details " +
      "in een mail aan iemand die daar geen recht op heeft.",
    input_schema: {
      type: "object",
      properties: {
        aan: { type: "string", description: "Ontvanger(s), komma-gescheiden." },
        onderwerp: { type: "string" },
        tekst: { type: "string", description: "De volledige mailtekst, platte tekst." },
        cc: { type: "string" },
        bcc: { type: "string" },
        antwoordOpUid: {
          type: "integer",
          description: "Uid van het bericht waarop dit een antwoord is (optioneel).",
        },
      },
      required: ["aan", "onderwerp", "tekst"],
    },
  },
];

// ---------- Uitvoeren ----------

export interface ToolResultaat {
  tekst: string;
  fout: boolean;
  /** Korte regel voor in de chat: "3 cliënten gevonden". */
  samenvatting: string;
}

const MAX_UITVOER = 24000; // tekens; voorkomt dat één query het venster vult

function json(waarde: unknown): string {
  const s = JSON.stringify(serialiseer(waarde), null, 1);
  return s.length > MAX_UITVOER
    ? s.slice(0, MAX_UITVOER) + "\n… (afgekapt, verfijn je filter of vraag minder velden)"
    : s;
}

const label = (model: string, n: number) => `${n}× ${model}`;

/**
 * `gegevens` gaat rechtstreeks naar Prisma. Zonder deze zeef is
 * {"bezoeken":{"deleteMany":{}}} een geldige db_wijzig — en die wist alle
 * bezoeken van een cliënt zonder ooit langs de verwijder-bevestiging te komen.
 * Daarom: alleen gewone velden en enums van dit model, geen relaties, geen
 * geneste objecten.
 */
function zeefGegevens(
  modelNaam: string,
  gegevens: unknown,
): Record<string, unknown> {
  if (!gegevens || typeof gegevens !== "object" || Array.isArray(gegevens)) {
    throw new Error("`gegevens` moet een object met veldwaarden zijn.");
  }
  const toegestaan = schrijfbareVelden(modelNaam);
  const uit: Record<string, unknown> = {};
  const geweigerd: string[] = [];

  for (const [k, v] of Object.entries(gegevens as Record<string, unknown>)) {
    if (!toegestaan.has(k)) {
      geweigerd.push(k);
      continue;
    }
    if (v !== null && typeof v === "object") {
      geweigerd.push(k);
      continue;
    }
    uit[k] = v;
  }

  if (geweigerd.length > 0) {
    throw new Error(
      `Deze velden kunnen hier niet gezet worden: ${geweigerd.join(", ")}. ` +
        `Gebruik alleen gewone velden van ${modelNaam}; een gekoppeld record ` +
        `maak of verwijder je met een eigen db_maak / db_verwijder.`,
    );
  }
  return uit;
}

async function draai(
  naam: string,
  invoer: Record<string, unknown>,
): Promise<ToolResultaat> {
  switch (naam) {
    case "db_zoek": {
      const model = vindModel(String(invoer.model));
      if (!model) throw new Error(`Onbekend model: ${invoer.model}`);
      // Het BSN blijft standaard in de database. Het is zelden nodig om een
      // vraag te beantwoorden, en alles wat hier uitkomt kan in een mail of een
      // WhatsApp-bericht belanden.
      const omit =
        model.name === "Client" && invoer.metBsn !== true
          ? { bsn: true as const }
          : undefined;
      const rijen = await delegate(model.name).findMany({
        where: coerceer(model.name, invoer.waar) ?? undefined,
        include: invoer.meenemen ?? undefined,
        orderBy: invoer.sorteren ?? undefined,
        omit,
        take: Math.min(Number(invoer.aantal) || 25, 100),
        skip: Number(invoer.overslaan) || 0,
      });
      return {
        tekst: json(rijen),
        fout: false,
        samenvatting: label(model.name, rijen.length) + " gevonden",
      };
    }

    case "db_tel": {
      const model = vindModel(String(invoer.model));
      if (!model) throw new Error(`Onbekend model: ${invoer.model}`);
      const n = await delegate(model.name).count({
        where: coerceer(model.name, invoer.waar) ?? undefined,
      });
      return { tekst: String(n), fout: false, samenvatting: `${n} ${model.name}` };
    }

    case "db_maak": {
      const model = vindModel(String(invoer.model));
      if (!model) throw new Error(`Onbekend model: ${invoer.model}`);
      const rij = await delegate(model.name).create({
        data: coerceer(
          model.name,
          zeefGegevens(model.name, invoer.gegevens),
        ) as Record<string, unknown>,
      });
      return {
        tekst: json(rij),
        fout: false,
        samenvatting: `${model.name} aangemaakt`,
      };
    }

    case "db_wijzig": {
      const model = vindModel(String(invoer.model));
      if (!model) throw new Error(`Onbekend model: ${invoer.model}`);
      const rij = await delegate(model.name).update({
        where: { id: String(invoer.id) },
        data: coerceer(
          model.name,
          zeefGegevens(model.name, invoer.gegevens),
        ) as Record<string, unknown>,
      });
      return {
        tekst: json(rij),
        fout: false,
        samenvatting: `${model.name} bijgewerkt`,
      };
    }

    case "db_verwijder": {
      const model = vindModel(String(invoer.model));
      if (!model) throw new Error(`Onbekend model: ${invoer.model}`);
      await delegate(model.name).delete({ where: { id: String(invoer.id) } });
      return {
        tekst: `${model.name} ${invoer.id} is verwijderd.`,
        fout: false,
        samenvatting: `${model.name} verwijderd`,
      };
    }

    case "mail_inbox": {
      const koppen = await lijstMail({
        map: invoer.map as string | undefined,
        aantal: invoer.aantal as number | undefined,
        ongelezen: invoer.ongelezen as boolean | undefined,
        zoek: invoer.zoek as string | undefined,
        sinds: invoer.sinds as string | undefined,
      });
      return {
        tekst: json(koppen),
        fout: false,
        samenvatting: `${koppen.length} berichten`,
      };
    }

    case "mail_lees": {
      const bericht = await leesMail(
        Number(invoer.uid),
        (invoer.map as string) || "INBOX",
      );
      return {
        tekst: json(bericht),
        fout: false,
        samenvatting: `mail gelezen: ${bericht.onderwerp}`,
      };
    }

    case "mail_mappen": {
      const mappen = await lijstMappen();
      return { tekst: json(mappen), fout: false, samenvatting: `${mappen.length} mappen` };
    }

    case "mail_markeer": {
      await markeerMail(
        Number(invoer.uid),
        Boolean(invoer.gelezen),
        (invoer.map as string) || "INBOX",
      );
      return {
        tekst: "Gelukt.",
        fout: false,
        samenvatting: invoer.gelezen ? "gemarkeerd als gelezen" : "op ongelezen gezet",
      };
    }

    case "mail_stuur": {
      const uit: MailUit = {
        aan: String(invoer.aan),
        onderwerp: String(invoer.onderwerp),
        tekst: String(invoer.tekst),
        cc: invoer.cc ? String(invoer.cc) : undefined,
        bcc: invoer.bcc ? String(invoer.bcc) : undefined,
      };
      // Antwoord netjes in de draad hangen als er een uid bij zit.
      if (invoer.antwoordOpUid) {
        try {
          const origineel = await leesMail(Number(invoer.antwoordOpUid));
          uit.antwoordOpMessageId = origineel.messageId;
        } catch {
          /* geen draadkoppeling; de mail gaat gewoon als nieuw bericht */
        }
      }
      const { messageId } = await stuurMail(uit);
      return {
        tekst: `Verstuurd aan ${uit.aan} (${messageId}).`,
        fout: false,
        samenvatting: `mail verstuurd aan ${uit.aan}`,
      };
    }

    default:
      throw new Error(`Onbekend gereedschap: ${naam}`);
  }
}

/**
 * Voert één tool uit en legt hem vast in het auditspoor. Fouten worden
 * teruggegeven als tekst (met fout=true) in plaats van gegooid, zodat het model
 * ze kan lezen en zichzelf kan corrigeren.
 */
export async function voerToolUit(
  naam: string,
  invoer: Record<string, unknown>,
  gesprekId: string | null,
): Promise<ToolResultaat> {
  let uitkomst: ToolResultaat;
  try {
    uitkomst = await draai(naam, invoer);
  } catch (e) {
    const bericht = e instanceof Error ? e.message : String(e);
    uitkomst = {
      tekst: `FOUT: ${bericht}`,
      fout: true,
      samenvatting: `mislukt: ${bericht.slice(0, 120)}`,
    };
  }

  // Auditspoor — best effort, mag de chat nooit laten klappen.
  try {
    await db.assistentActie.create({
      data: {
        gesprekId,
        tool: naam,
        invoer: invoer as never,
        resultaat: uitkomst.samenvatting.slice(0, 500),
        gelukt: !uitkomst.fout,
        schrijft: SCHRIJFT.has(naam),
      },
    });
  } catch (e) {
    console.error("[assistent] auditspoor mislukt", e);
  }

  return uitkomst;
}

/** Menselijke omschrijving van een actie die bevestigd moet worden. */
export function bevestigingsTekst(
  naam: string,
  invoer: Record<string, unknown>,
): string {
  if (naam === "mail_stuur") {
    return `Mail versturen aan ${invoer.aan}`;
  }
  if (naam === "db_verwijder") {
    return `${invoer.model} definitief verwijderen`;
  }
  return naam;
}
