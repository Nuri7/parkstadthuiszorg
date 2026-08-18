import type { Financiering, Bezoek } from "@prisma/client";
import { DAY } from "@/lib/constants";

// Budgetberekening. Net als de agenda werken we in UTC-naïeve wandkloktijd:
// bezoekdata zijn opgeslagen zoals ingevoerd en we groeperen ze in UTC.

export function weekBoundsUTC(d: Date) {
  const dow = new Date(d).getUTCDay(); // 0 = zondag
  const diff = (dow + 6) % 7; // dagen sinds maandag
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - diff));
  return { start, end: new Date(start.getTime() + 7 * DAY) };
}

export function monthBoundsUTC(d: Date) {
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
  const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));
  return { start, end };
}

/** Minuten van declarabele + uitgevoerde bezoeken binnen [van, tot). */
export function minutenUit(bezoeken: Bezoek[], van: Date, tot: Date): number {
  return bezoeken
    .filter(
      (b) =>
        b.declarabel &&
        b.status === "UITGEVOERD" &&
        new Date(b.datum) >= van &&
        new Date(b.datum) < tot,
    )
    .reduce((s, b) => s + (b.duurMinuten ?? 0), 0);
}

/** De op `now` lopende financiering (of de meest recente als er geen loopt). */
export function actieveFinanciering(fins: Financiering[], now: Date): Financiering | null {
  if (!fins.length) return null;
  const lopend = fins.filter(
    (f) =>
      (!f.geldigVan || new Date(f.geldigVan) <= now) &&
      (!f.geldigTot || new Date(f.geldigTot) >= now),
  );
  const pool = lopend.length ? lopend : fins;
  return [...pool].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
}

export type BudgetKleur = "groen" | "oranje" | "rood";

export function budgetKleur(gebruikt: number, toegestaan: number | null): BudgetKleur {
  if (!toegestaan || toegestaan <= 0) return "groen";
  const r = gebruikt / toegestaan;
  if (r > 1.0001) return "rood";
  if (r >= 0.8) return "oranje";
  return "groen";
}

/** Toegestane uren per week uit een financiering (of null als niet te bepalen). */
export function toegestaneUrenPerWeek(f: Financiering): number | null {
  if (f.budgetBasis === "PER_WEEK_UREN") return f.urenPerWeek ?? null;
  if (f.budgetBasis === "TOTAAL_BUDGET" && f.totaalBudget != null && f.tarief && f.geldigVan && f.geldigTot) {
    // geldigTot is inclusief → tel de laatste dag mee (+1 dag), net als budgetOverzicht
    const totExcl = new Date(new Date(f.geldigTot).getTime() + DAY);
    const weken = Math.max(1, (totExcl.getTime() - new Date(f.geldigVan).getTime()) / (7 * DAY));
    return f.totaalBudget / weken / f.tarief;
  }
  return null;
}

export interface BudgetVak {
  gebruiktUren: number;
  toegestaanUren: number | null;
  kleur: BudgetKleur;
}

export interface BudgetOverzicht {
  urenPerWeek: number | null;
  tarief: number | null;
  week: BudgetVak & { van: Date; tot: Date };
  maand: BudgetVak;
  periode:
    | (BudgetVak & { van: Date; tot: Date; totaalEur: number | null; gebruiktEur: number | null })
    | null;
}

function mkVak(gebruiktUren: number, toegestaanUren: number | null): BudgetVak {
  return { gebruiktUren, toegestaanUren, kleur: budgetKleur(gebruiktUren, toegestaanUren) };
}

export function budgetOverzicht(f: Financiering, bezoeken: Bezoek[], now: Date): BudgetOverzicht {
  const uPerWeek = toegestaneUrenPerWeek(f);
  const w = weekBoundsUTC(now);
  const m = monthBoundsUTC(now);

  // Grenzen van de beschikking (geldigTot is inclusief → exclusieve einddatum = +1 dag)
  const finVan = f.geldigVan ? new Date(f.geldigVan) : null;
  const finTotExcl = f.geldigTot ? new Date(new Date(f.geldigTot).getTime() + DAY) : null;
  // Knip een [start,end)-venster op de beschikkingsperiode, zodat verbruik én
  // toegestane uren over exact dezelfde dagen worden gerekend.
  const clip = (start: Date, end: Date) => {
    const s = finVan && finVan > start ? finVan : start;
    const e = finTotExcl && finTotExcl < end ? finTotExcl : end;
    return { start: s, end: e > s ? e : s };
  };

  const weekUren = minutenUit(bezoeken, w.start, w.end) / 60;

  // Maand geclipt op de beschikkingsperiode (voorkomt te hoge maandruimte bij
  // een beschikking die halverwege een maand start of eindigt).
  const mc = clip(m.start, m.end);
  const maandDagen = (mc.end.getTime() - mc.start.getTime()) / DAY;
  const maandUren = minutenUit(bezoeken, mc.start, mc.end) / 60;
  const maandToegestaan = uPerWeek != null ? (uPerWeek * maandDagen) / 7 : null;

  let periode: BudgetOverzicht["periode"] = null;
  if (f.geldigVan && f.geldigTot) {
    const van = new Date(f.geldigVan);
    const tot = new Date(f.geldigTot);
    const totExcl = new Date(tot.getTime() + DAY); // geldigTot is inclusief
    // Verbruik én toegestane dagen rekenen over hetzelfde venster [van, totExcl)
    const dagen = Math.max(0, (totExcl.getTime() - van.getTime()) / DAY);
    const periodeUren = minutenUit(bezoeken, van, totExcl) / 60;
    let toegestaanUren: number | null = null;
    let totaalEur: number | null = null;
    if (f.budgetBasis === "TOTAAL_BUDGET" && f.totaalBudget != null) {
      totaalEur = f.totaalBudget;
      toegestaanUren = f.tarief ? f.totaalBudget / f.tarief : null;
    } else if (uPerWeek != null) {
      toegestaanUren = (uPerWeek * dagen) / 7;
      totaalEur = f.tarief ? toegestaanUren * f.tarief : null;
    }
    periode = {
      ...mkVak(periodeUren, toegestaanUren),
      van,
      tot,
      totaalEur,
      gebruiktEur: f.tarief ? periodeUren * f.tarief : null,
    };
  }

  return {
    urenPerWeek: uPerWeek,
    tarief: f.tarief ?? null,
    week: { ...mkVak(weekUren, uPerWeek), van: w.start, tot: w.end },
    maand: mkVak(maandUren, maandToegestaan),
    periode,
  };
}

/** Map ISO-weekstart (YYYY-MM-DD) -> gebruikte uren die week (declarabel+uitgevoerd). */
export function urenPerWeekMap(bezoeken: Bezoek[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const b of bezoeken) {
    if (!b.declarabel || b.status !== "UITGEVOERD") continue;
    const { start } = weekBoundsUTC(new Date(b.datum));
    const key = start.toISOString().slice(0, 10);
    map[key] = (map[key] ?? 0) + (b.duurMinuten ?? 0) / 60;
  }
  return map;
}
