// Het datamodel zoals de assistent het ziet. Alles wordt afgeleid uit Prisma's
// DMMF (het schema zoals het op runtime bekend is), zodat een nieuw veld in
// schema.prisma automatisch beschikbaar is voor de assistent — geen tweede
// plek die je moet bijwerken.

import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

/** Modellen die de assistent NIET mag benaderen: zijn eigen gespreksopslag. */
const VERBORGEN = new Set([
  "AssistentGesprek",
  "AssistentBericht",
  "AssistentActie",
]);

const models = Prisma.dmmf.datamodel.models.filter((m) => !VERBORGEN.has(m.name));
const enums = Prisma.dmmf.datamodel.enums;

export const modelNamen = models.map((m) => m.name);

/** Model op naam, hoofdletterongevoelig (de assistent typt weleens "client"). */
export function vindModel(naam: string) {
  const n = String(naam ?? "").toLowerCase();
  return models.find((m) => m.name.toLowerCase() === n) ?? null;
}

/** Prisma's delegate (db.client, db.bezoek, ...) hoort bij de modelnaam. */
export function delegate(modelNaam: string) {
  const key = modelNaam.charAt(0).toLowerCase() + modelNaam.slice(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d = (db as any)[key];
  if (!d || typeof d.findMany !== "function") {
    throw new Error(`Onbekend model: ${modelNaam}`);
  }
  return d as {
    findMany: (a: unknown) => Promise<unknown[]>;
    findUnique: (a: unknown) => Promise<unknown>;
    count: (a: unknown) => Promise<number>;
    create: (a: unknown) => Promise<unknown>;
    update: (a: unknown) => Promise<unknown>;
    delete: (a: unknown) => Promise<unknown>;
  };
}

// ---------- Beschrijving voor de systeemprompt ----------

function veldRegel(f: Prisma.DMMF.Field): string | null {
  if (f.kind === "object") {
    // relatie: alleen noemen als je hem kunt meenemen via include
    return `  ${f.name}${f.isList ? "[]" : ""} -> ${f.type} (relatie)`;
  }
  const stukken: string[] = [f.type + (f.isList ? "[]" : "")];
  if (!f.isRequired) stukken.push("optioneel");
  if (f.isId) stukken.push("id");
  if (f.hasDefaultValue && typeof f.default !== "object") {
    stukken.push(`standaard ${String(f.default)}`);
  }
  return `  ${f.name}: ${stukken.join(", ")}`;
}

/**
 * Compacte tekstweergave van het hele datamodel. Staat in de systeemprompt, dus
 * hij moet stabiel zijn (zelfde volgorde bij elke request) — anders breekt de
 * prompt-cache.
 */
export function schemaBeschrijving(): string {
  const enumTekst = enums
    .map((e) => `${e.name}: ${e.values.map((v) => v.name).join(" | ")}`)
    .join("\n");

  const modelTekst = models
    .map((m) => {
      const velden = m.fields
        .map(veldRegel)
        .filter((x): x is string => x !== null)
        .join("\n");
      return `${m.name}\n${velden}`;
    })
    .join("\n\n");

  return `ENUMS\n${enumTekst}\n\nMODELLEN\n${modelTekst}`;
}

// ---------- Waardes omzetten ----------

/**
 * Datums worden in deze app UTC-naïef opgeslagen: "2026-09-01" en
 * "2026-09-01T09:30" betekenen exact die wandklokdatum/-tijd, ongeacht de
 * tijdzone van de server. Daarom plakken we 'Z' erachter als die ontbreekt —
 * hetzelfde wat dtTijd() in de formulieren doet.
 */
export function naarDatum(waarde: unknown): Date | null {
  if (waarde instanceof Date) return waarde;
  if (typeof waarde !== "string" || waarde.trim() === "") return null;
  let s = waarde.trim().replace(" ", "T");
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) s += "T00:00:00Z";
  else if (!/(Z|[+-]\d{2}:?\d{2})$/.test(s)) s += "Z";
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Zet de JSON die het model aanlevert om naar wat Prisma verwacht: datumstrings
 * -> Date, "12,5" -> 12.5, "true" -> true, "" -> null. Werkt recursief zodat
 * ook geneste where-filters ({ datum: { gte: "2026-09-01" } }) goed gaan.
 */
export function coerceer(
  modelNaam: string,
  waarde: unknown,
  veldNaam?: string,
): unknown {
  if (waarde === null || waarde === undefined) return waarde;

  const model = vindModel(modelNaam);
  const veld = veldNaam
    ? model?.fields.find((f) => f.name === veldNaam)
    : undefined;

  if (Array.isArray(waarde)) {
    return waarde.map((v) => coerceer(modelNaam, v, veldNaam));
  }

  if (typeof waarde === "object") {
    const uit: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(waarde as Record<string, unknown>)) {
      // Prisma-operators (gte, contains, AND, some, ...) erven het veld van hun ouder.
      const isOperator = !model?.fields.some((f) => f.name === k);
      uit[k] = coerceer(modelNaam, v, isOperator ? veldNaam : k);
    }
    return uit;
  }

  if (!veld) return waarde;

  if (veld.type === "DateTime") {
    const d = naarDatum(waarde);
    return d ?? waarde;
  }
  if (veld.type === "Float" || veld.type === "Decimal") {
    if (typeof waarde === "number") return waarde;
    if (typeof waarde === "string" && waarde.trim() !== "") {
      const n = parseFloat(waarde.replace(",", "."));
      if (!isNaN(n)) return n;
    }
    return waarde;
  }
  if (veld.type === "Int") {
    if (typeof waarde === "number") return Math.round(waarde);
    if (typeof waarde === "string" && waarde.trim() !== "") {
      const n = parseInt(waarde, 10);
      if (!isNaN(n)) return n;
    }
    return waarde;
  }
  if (veld.type === "Boolean") {
    if (typeof waarde === "boolean") return waarde;
    if (waarde === "true") return true;
    if (waarde === "false") return false;
    return waarde;
  }
  if (veld.kind === "enum" && typeof waarde === "string") {
    const e = enums.find((x) => x.name === veld.type);
    const treffer = e?.values.find(
      (v) => v.name.toLowerCase() === waarde.toLowerCase(),
    );
    return treffer ? treffer.name : waarde;
  }
  // Lege string in een optioneel tekstveld betekent "leegmaken".
  if (waarde === "" && !veld.isRequired) return null;

  return waarde;
}

/**
 * Datums terug naar leesbare strings vóór ze naar het model gaan. Bewust in
 * UTC, net als de rest van de app (zie lib/format.ts).
 */
export function serialiseer(waarde: unknown): unknown {
  if (waarde instanceof Date) {
    const iso = waarde.toISOString();
    return iso.endsWith("T00:00:00.000Z") ? iso.slice(0, 10) : iso.slice(0, 16);
  }
  if (Array.isArray(waarde)) return waarde.map(serialiseer);
  if (waarde && typeof waarde === "object") {
    const uit: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(waarde as Record<string, unknown>)) {
      uit[k] = serialiseer(v);
    }
    return uit;
  }
  return waarde;
}
