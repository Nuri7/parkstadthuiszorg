// Gedeelde FormData-parsers voor server actions. Pure functies (geen server-only
// imports), dus veilig te importeren in "use server"-bestanden.

export const str = (v: FormDataEntryValue | null) => {
  const x = String(v ?? "").trim();
  return x === "" ? null : x;
};

export const req = (v: FormDataEntryValue | null) => String(v ?? "").trim();

export const dt = (v: FormDataEntryValue | null) => {
  const x = str(v);
  return x ? new Date(x) : null;
};

export const flt = (v: FormDataEntryValue | null) => {
  const x = str(v);
  return x ? parseFloat(x) : null;
};

export const intg = (v: FormDataEntryValue | null) => {
  const x = str(v);
  return x ? parseInt(x, 10) : null;
};

// Meerdere aangevinkte keuzevakjes met dezelfde name -> komma-gescheiden string
export const multi = (fd: FormData, name: string) => {
  const v = fd.getAll(name).map(String).filter((x) => x.trim() !== "");
  return v.length ? v.join(", ") : null;
};

// Datum + optionele tijd (type="time") -> Date. Alles als UTC ('Z') zodat opslag
// en weergave exact round-trippen, ongeacht de server-tijdzone.
export const dtTijd = (d: FormDataEntryValue | null, t: FormDataEntryValue | null) => {
  const ds = str(d);
  const ts = str(t);
  if (!ds) return new Date();
  return new Date(ts ? `${ds}T${ts}:00Z` : ds);
};
