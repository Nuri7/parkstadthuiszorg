// Scoring en weekselectie voor de verwijzerpijplijn. Pure functies (geen
// server-only imports), dus veilig te importeren in "use server"-bestanden,
// pagina's én client-componenten. Achtergrond: business/sales/sales_pipeline_plan.md.

import type { LeadStatus, LevertRoute, VerwijzerType } from "@prisma/client";

export const DAG = 86_400_000;

/** Na zoveel dagen stilte na een eerste contact is opvolging achterstallig. */
export const OPVOLG_DAGEN = 21;

/** Hoeveel acties de weeklijst maximaal toont (het weekritme: 2–3 per week). */
export const WEEK_ACTIES = 3;

/**
 * Hoeveel een verwijzertype gemiddeld oplevert voor thuiszorg in Parkstad.
 * Huisartsen en transferverpleegkundigen sturen structureel door; een buurthuis
 * levert hooguit incidenteel iets op.
 */
export const typeGewicht: Record<VerwijzerType, number> = {
  HUISARTS: 10,
  ZIEKENHUIS_TRANSFER: 10,
  WMO_LOKET: 9,
  WIJKTEAM: 9,
  CASEMANAGER_DEMENTIE: 9,
  POH: 8,
  PGB_BEMIDDELAAR: 8,
  INDICATIESTELLER: 8, // dubbel doel: verwijzer én de gezochte niveau-5-koppeling
  CIZ: 7,
  APOTHEEK: 6,
  WOONZORG: 6,
  FYSIO_ERGO: 5,
  BELANGENVERENIGING: 5,
  WELZIJN_BUURTHUIS: 4,
  GELOOFSGEMEENSCHAP: 4,
  OVERIG: 2,
};

/**
 * Welke financieringsroute een verwijzer aanlevert. ZVW_ZIN staat negatief:
 * zolang er geen niveau-5-indicatiesteller gekoppeld is, kan dat werk niet
 * omgezet worden (CZ wees ZIN-wijkverpleging af, juli 2026). Records blijven
 * wel bestaan — ze zakken alleen in de weeklijst.
 */
export const routeBonus: Record<LevertRoute, number> = {
  PGB: 4,
  WMO: 4,
  PARTICULIER: 2,
  ONBEKEND: 0,
  ZVW_ZIN: -3,
};

/** Statussen waarbij niet meer benaderd wordt. */
export const geslotenStatussen: LeadStatus[] = ["GEEN_INTERESSE", "UITGESCHREVEN"];

/** Statussen waarbij een eerste contact is gelegd en opvolging hoort te komen. */
const inGesprek: LeadStatus[] = ["BENADERD", "GESPROKEN", "MATERIAAL"];

/** Minimale vorm waarop de pipeline rekent (los van Prisma's include-vorm). */
export type PipelineVerwijzer = {
  id: string;
  naam: string;
  type: VerwijzerType;
  status: LeadStatus;
  levertRoute: LevertRoute;
  plaats: string | null;
  postcode: string | null;
  telefoon: string | null;
  afstandKm: number | null;
  optOut: boolean;
  laatsteContactOp: Date | null;
  volgendeActieOp: Date | null;
  volgendeActie: string | null;
  aantalClienten: number;
};

export const dagenGeleden = (d: Date | null | undefined, now: Date): number | null =>
  d == null ? null : Math.floor((now.getTime() - new Date(d).getTime()) / DAG);

/** Postcodegebied (eerste 4 cijfers) — gebruikt om bezoeken in één rit te clusteren. */
export const pcGebied = (postcode: string | null): string | null => {
  const m = (postcode ?? "").replace(/\s+/g, "").match(/^\d{4}/);
  return m ? m[0] : null;
};

export function berekenScore(v: PipelineVerwijzer, now: Date): number {
  let s = typeGewicht[v.type] ?? 2;

  if (v.afstandKm != null) {
    if (v.afstandKm <= 3) s += 3;
    else if (v.afstandKm <= 7) s += 2;
    else if (v.afstandKm <= 12) s += 1;
  }

  s += routeBonus[v.levertRoute] ?? 0;

  // Een bestaande relatie onderhouden levert meer op dan een nieuwe koud benaderen.
  if (v.aantalClienten > 0) s += 10;

  // Net benaderd? Even laten rusten.
  const d = dagenGeleden(v.laatsteContactOp, now);
  if (d != null && d < 30) s -= 5;

  return s;
}

const eindeVandaag = (now: Date) => {
  const d = new Date(now);
  d.setHours(23, 59, 59, 999);
  return d;
};

/** Opvolging die is blijven liggen: contact gelegd, daarna stilte, geen actie gepland. */
export function isAchterstallig(v: PipelineVerwijzer, now: Date): boolean {
  if (v.optOut || geslotenStatussen.includes(v.status)) return false;
  if (v.volgendeActieOp && new Date(v.volgendeActieOp) > eindeVandaag(now)) return false;
  if (!inGesprek.includes(v.status)) return false;
  const d = dagenGeleden(v.laatsteContactOp, now);
  return d == null || d >= OPVOLG_DAGEN;
}

/** Staat er vandaag iets te doen? (nieuw, actie vervallen, of opvolging blijven liggen) */
export function heeftOpenActie(v: PipelineVerwijzer, now: Date): boolean {
  if (v.optOut || geslotenStatussen.includes(v.status)) return false;
  if (v.status === "KANDIDAAT") return false; // eerst beoordelen in de lead-inbox (fase 2)
  if (v.status === "NIEUW") return true;
  if (v.volgendeActieOp && new Date(v.volgendeActieOp) <= eindeVandaag(now)) return true;
  return isAchterstallig(v, now);
}

/** Waarom staat dit record op de lijst? Korte uitleg voor op het scherm. */
export function redenVoorActie(v: PipelineVerwijzer, now: Date): string {
  if (v.status === "NIEUW") return "Nog niet benaderd";
  if (v.volgendeActieOp && new Date(v.volgendeActieOp) <= eindeVandaag(now)) {
    return v.volgendeActie ?? "Geplande actie staat open";
  }
  const d = dagenGeleden(v.laatsteContactOp, now);
  return d == null ? "Nog geen contact vastgelegd" : `${d} dagen geen contact`;
}

/**
 * De weeklijst: de hoogst scorende openstaande acties, waarbij een tweede actie
 * in hetzelfde postcodegebied voorrang krijgt — twee bezoeken in één rit.
 */
export function weeklijst(
  verwijzers: PipelineVerwijzer[],
  now: Date,
  limit: number = WEEK_ACTIES,
): PipelineVerwijzer[] {
  const rest = verwijzers
    .filter((v) => heeftOpenActie(v, now))
    .sort((a, b) => berekenScore(b, now) - berekenScore(a, now) || a.naam.localeCompare(b.naam, "nl"));

  const gekozen: PipelineVerwijzer[] = [];
  while (gekozen.length < limit && rest.length > 0) {
    const eerste = rest.shift()!;
    gekozen.push(eerste);
    if (gekozen.length >= limit) break;

    const gebied = pcGebied(eerste.postcode);
    if (!gebied) continue;
    const buurIdx = rest.findIndex((r) => pcGebied(r.postcode) === gebied);
    if (buurIdx >= 0) gekozen.push(...rest.splice(buurIdx, 1));
  }
  return gekozen;
}

/**
 * Kanalen waarmee je iemand ongevraagd benadert. Bij opt-out zijn deze
 * geblokkeerd (Tw art. 11.7 / AVG); binnenkomend contact mag wél vastgelegd.
 */
export const pushKanalen = ["EMAIL", "WHATSAPP", "POST"];
