// Mailtoegang voor de assistent: lezen via IMAP, versturen via SMTP.
//
// Lezen gebruikt een eigen set env-vars (IMAP_*), want de site verstuurt met
// noreply@ terwijl het postvak dat gelezen moet worden info@ is. Staan de
// IMAP_*-vars niet ingesteld, dan valt hij terug op de SMTP-gegevens.

import { ImapFlow, type FetchMessageObject } from "imapflow";
import { simpleParser, type ParsedMail } from "mailparser";
import nodemailer, { type Transporter } from "nodemailer";

export interface MailKop {
  uid: number;
  map: string;
  van: string;
  aan: string;
  onderwerp: string;
  datum: string | null;
  gelezen: boolean;
  beantwoord: boolean;
  bijlagen: boolean;
}

export interface MailBericht extends MailKop {
  tekst: string;
  cc?: string;
  antwoordAan?: string;
  messageId?: string;
  bijlagenamen: string[];
}

function imapConfig() {
  const smtpHost = process.env.SMTP_HOST ?? "";
  const host =
    process.env.IMAP_HOST ||
    (smtpHost.startsWith("smtp.") ? smtpHost.replace(/^smtp\./, "imap.") : "");
  const user = process.env.IMAP_USER || process.env.SMTP_USER;
  const pass = process.env.IMAP_PASS || process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return { host, port: Number(process.env.IMAP_PORT) || 993, user, pass };
}

export function mailLezenBeschikbaar(): boolean {
  return imapConfig() !== null;
}

async function metImap<T>(fn: (client: ImapFlow) => Promise<T>): Promise<T> {
  const cfg = imapConfig();
  if (!cfg) {
    throw new Error(
      "IMAP is niet ingesteld (IMAP_HOST/IMAP_USER/IMAP_PASS ontbreken), dus mail lezen kan nog niet.",
    );
  }
  const client = new ImapFlow({
    host: cfg.host,
    port: cfg.port,
    secure: true,
    auth: { user: cfg.user, pass: cfg.pass },
    logger: false,
    // Vercel-functies leven kort; niet blijven hangen op een trage server.
    socketTimeout: 20000,
    greetingTimeout: 10000,
  });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.logout().catch(() => client.close());
  }
}

const adres = (
  a: { name?: string; address?: string }[] | undefined | null,
): string =>
  (a ?? [])
    .map((x) => (x.name ? `${x.name} <${x.address ?? ""}>` : (x.address ?? "")))
    .filter(Boolean)
    .join(", ");

function naarKop(msg: FetchMessageObject, map: string): MailKop {
  const env = msg.envelope;
  const flags = msg.flags ?? new Set<string>();
  return {
    uid: msg.uid,
    map,
    van: adres(env?.from),
    aan: adres(env?.to),
    onderwerp: env?.subject ?? "(geen onderwerp)",
    datum: env?.date ? new Date(env.date).toISOString().slice(0, 16) : null,
    gelezen: flags.has("\\Seen"),
    beantwoord: flags.has("\\Answered"),
    bijlagen: heeftBijlagen(msg.bodyStructure),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function heeftBijlagen(bs: any): boolean {
  if (!bs) return false;
  if (bs.disposition === "attachment") return true;
  if (Array.isArray(bs.childNodes)) return bs.childNodes.some(heeftBijlagen);
  return false;
}

/** Lijst met mailkoppen. Standaard de nieuwste berichten uit INBOX. */
export async function lijstMail(opties: {
  map?: string;
  aantal?: number;
  ongelezen?: boolean;
  zoek?: string;
  sinds?: string;
}): Promise<MailKop[]> {
  const map = opties.map || "INBOX";
  const aantal = Math.min(Math.max(opties.aantal ?? 15, 1), 50);

  return metImap(async (client) => {
    const box = await client.mailboxOpen(map, { readOnly: true });
    if (!box.exists) return [];

    let uids: number[] | null = null;
    const zoek = opties.zoek?.trim();
    if (zoek || opties.ongelezen || opties.sinds) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: any = {};
      if (opties.ongelezen) query.seen = false;
      if (opties.sinds) query.since = new Date(opties.sinds);
      if (zoek) {
        query.or = [{ subject: zoek }, { from: zoek }, { to: zoek }, { body: zoek }];
      }
      const gevonden = await client.search(query, { uid: true });
      if (!gevonden || gevonden.length === 0) return [];
      uids = gevonden;
      uids = uids.slice(-aantal); // search levert oplopend; wij willen de nieuwste
    }

    const koppen: MailKop[] = [];
    const bereik = uids
      ? uids.join(",")
      : `${Math.max(1, box.exists - aantal + 1)}:*`;

    for await (const msg of client.fetch(
      bereik,
      { uid: true, envelope: true, flags: true, bodyStructure: true },
      { uid: Boolean(uids) },
    )) {
      koppen.push(naarKop(msg, map));
    }
    return koppen.sort((a, b) => (a.datum ?? "").localeCompare(b.datum ?? "")).reverse();
  });
}

/** Eén bericht volledig ophalen, inclusief platte tekst. */
export async function leesMail(
  uid: number,
  map = "INBOX",
  maxTekens = 12000,
): Promise<MailBericht> {
  return metImap(async (client) => {
    await client.mailboxOpen(map, { readOnly: true });

    const msg = await client.fetchOne(
      String(uid),
      { uid: true, envelope: true, flags: true, bodyStructure: true, source: true },
      { uid: true },
    );
    if (!msg) throw new Error(`Bericht ${uid} niet gevonden in ${map}.`);

    if (!msg.source) throw new Error(`Bericht ${uid} heeft geen inhoud.`);
    const parsed = (await simpleParser(msg.source)) as ParsedMail;
    let tekst = (parsed.text ?? "").trim();
    if (!tekst && parsed.html) {
      tekst = String(parsed.html)
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+\n/g, "\n")
        .replace(/[ \t]{2,}/g, " ")
        .trim();
    }
    if (tekst.length > maxTekens) {
      tekst = tekst.slice(0, maxTekens) + "\n\n[…afgekapt]";
    }

    return {
      ...naarKop(msg, map),
      tekst,
      cc: adres(msg.envelope?.cc),
      antwoordAan: adres(msg.envelope?.replyTo),
      messageId: msg.envelope?.messageId,
      bijlagenamen: (parsed.attachments ?? [])
        .map((a: { filename?: string }) => a.filename ?? "(naamloos)")
        .slice(0, 20),
    };
  });
}

/** Gelezen/ongelezen zetten. */
export async function markeerMail(
  uid: number,
  gelezen: boolean,
  map = "INBOX",
): Promise<void> {
  await metImap(async (client) => {
    const lock = await client.getMailboxLock(map);
    try {
      if (gelezen) {
        await client.messageFlagsAdd(String(uid), ["\\Seen"], { uid: true });
      } else {
        await client.messageFlagsRemove(String(uid), ["\\Seen"], { uid: true });
      }
    } finally {
      lock.release();
    }
  });
}

/** Beschikbare mappen (INBOX, Verzonden, ...). */
export async function lijstMappen(): Promise<string[]> {
  return metImap(async (client) => {
    const mappen = await client.list();
    return mappen.map((m) => m.path);
  });
}

// ---------- Versturen ----------

/**
 * Afzenders die de assistent mag gebruiken. Migadu staat niet toe dat een
 * postvak namens een ander adres verstuurt — zelfs niet namens een eigen alias
 * (550 sender address rejected) — dus elk afzenderadres heeft eigen
 * inloggegevens nodig.
 *
 * SMTP_AFZENDERS is JSON: {"info@...":"wachtwoord","meyrem@...":"wachtwoord"}
 * Niet ingesteld? Dan is SMTP_USER/SMTP_PASS de enige afzender.
 */
function afzenders(): Record<string, string> {
  const ruw = process.env.SMTP_AFZENDERS;
  if (ruw) {
    try {
      const uit = JSON.parse(ruw) as Record<string, string>;
      if (uit && typeof uit === "object" && Object.keys(uit).length > 0) return uit;
    } catch {
      console.error("[mail] SMTP_AFZENDERS is geen geldige JSON — genegeerd.");
    }
  }
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  return user && pass ? { [user]: pass } : {};
}

/** Adressen waaruit de assistent mag kiezen; de eerste is de standaard. */
export function beschikbareAfzenders(): string[] {
  return Object.keys(afzenders());
}

const transporters = new Map<string, Transporter>();

function getTransporter(van: string): Transporter | null {
  const host = process.env.SMTP_HOST;
  const pass = afzenders()[van];
  if (!host || !pass) return null;

  let tx = transporters.get(van);
  if (!tx) {
    const port = Number(process.env.SMTP_PORT) || 587;
    tx = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user: van, pass },
    });
    transporters.set(van, tx);
  }
  return tx;
}

export interface MailUit {
  /** Afzenderadres; moet in SMTP_AFZENDERS staan. Leeg = de standaard. */
  van?: string;
  aan: string;
  onderwerp: string;
  tekst: string;
  cc?: string;
  bcc?: string;
  antwoordOpMessageId?: string;
}

/** Verstuurt een mail namens Parkstad Thuiszorg. Alleen ná bevestiging. */
export async function stuurMail(m: MailUit): Promise<{ messageId: string; van: string }> {
  const lijst = beschikbareAfzenders();
  if (lijst.length === 0) {
    throw new Error(
      "Er is geen afzender ingesteld (SMTP_AFZENDERS of SMTP_USER/SMTP_PASS ontbreken).",
    );
  }
  const van = m.van?.trim().toLowerCase() || lijst[0];
  if (!lijst.includes(van)) {
    throw new Error(
      `Versturen namens ${van} kan niet. Beschikbaar: ${lijst.join(", ")}.`,
    );
  }
  const tx = getTransporter(van);
  if (!tx) throw new Error(`SMTP is niet ingesteld voor ${van}.`);

  const info = await tx.sendMail({
    from: van,
    to: m.aan,
    cc: m.cc || undefined,
    bcc: m.bcc || undefined,
    replyTo: van, // antwoorden komen terug bij de afzender zelf
    subject: m.onderwerp,
    text: m.tekst,
    inReplyTo: m.antwoordOpMessageId || undefined,
    references: m.antwoordOpMessageId || undefined,
  });
  return { messageId: String(info.messageId ?? ""), van };
}
