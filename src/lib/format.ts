// Gedeelde formatters. Pure (Date/Math/Intl), veilig in server- én client-code.
// Datums worden bewust in UTC geformatteerd (UTC-naïeve wandkloktijd, zoals de
// rest van de app), zodat invoer en weergave overeenkomen ongeacht server-TZ.

export const nl = (v: Date | null | undefined) =>
  v ? new Date(v).toLocaleDateString("nl-NL", { timeZone: "UTC" }) : "—";

export const isoDay = (v: Date | null | undefined) =>
  v ? new Date(v).toISOString().slice(0, 10) : "";

export const tijd = (v: Date | null | undefined) => {
  if (!v) return "";
  const hm = new Date(v).toISOString().slice(11, 16);
  return hm === "00:00" ? "" : hm;
};

// Decimale uren -> "Xu Ym" (of "Xu" als er geen minuten zijn)
export const uur = (n: number) => {
  const h = Math.floor(n);
  const m = Math.round((n - h) * 60);
  return m ? `${h}u ${m}m` : `${h}u`;
};

// Wondafmeting L×B×D
export const dim = (l: number | null, b: number | null, d: number | null) =>
  [l, b, d].some((x) => x != null) ? `${l ?? "?"}×${b ?? "?"}×${d ?? "?"} cm` : null;
