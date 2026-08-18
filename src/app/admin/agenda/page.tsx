import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { addBezoek, deleteBezoek, setBezoekStatus } from "@/app/actions/clienten";
import { inputCls, labelCls, addBtn, navBtn } from "@/lib/adminUi";
import { DAY } from "@/lib/constants";

export const metadata = { title: "Agenda | Parkstad Thuiszorg" };

// We werken volledig in UTC-naïeve wandkloktijd: data worden opgeslagen zoals
// ingevoerd (zie dtTijd in actions) en hier ook in UTC geformatteerd, zodat
// invoer en weergave exact overeenkomen ongeacht de server-tijdzone.
const isoOf = (d: Date) => d.toISOString().slice(0, 10);
const parseDay = (s?: string) => {
  if (s && /^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = new Date(`${s}T00:00:00Z`);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
};
const mondayOf = (d: Date) => {
  const dow = d.getUTCDay(); // 0 = zondag
  const diff = (dow + 6) % 7; // dagen sinds maandag
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - diff));
};
const fmtDay = (d: Date) =>
  d.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const fmtRange = (a: Date, b: Date) =>
  `${a.toLocaleDateString("nl-NL", { day: "numeric", month: "long", timeZone: "UTC" })} – ${b.toLocaleDateString(
    "nl-NL",
    { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" },
  )}`;
const timeOf = (d: Date) => {
  const hm = new Date(d).toISOString().slice(11, 16);
  return hm === "00:00" ? "" : hm;
};

const statusBadge: Record<string, string> = {
  GEPLAND: "bg-[#e6eff5] text-[#3a6a8a] dark:bg-[#0b2b3a] dark:text-[#7fb4d4]",
  UITGEVOERD: "bg-[#e6f2ea] text-[#4A9C6E] dark:bg-[#0b3b42] dark:text-[#5cb0bd]",
  GEANNULEERD: "bg-[#f0ece3] text-[#8a9a8a] dark:bg-[#243029] dark:text-[#8a9a8a]",
};
const statusLabel: Record<string, string> = {
  GEPLAND: "Gepland",
  UITGEVOERD: "Uitgevoerd",
  GEANNULEERD: "Geannuleerd",
};

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  // "Vandaag" en de standaardweek in Nederlandse tijd (server draait in UTC).
  const todayIso = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Amsterdam" });
  const target = parseDay(sp.d) ?? parseDay(todayIso) ?? new Date();
  const monday = mondayOf(target);
  const sunday = new Date(monday.getTime() + 6 * DAY);
  const weekEnd = new Date(monday.getTime() + 7 * DAY);

  const [bezoeken, clienten] = await Promise.all([
    db.bezoek.findMany({
      where: { datum: { gte: monday, lt: weekEnd } },
      include: { client: { select: { id: true, voornaam: true, achternaam: true } } },
      orderBy: { datum: "asc" },
    }),
    db.client.findMany({
      orderBy: [{ achternaam: "asc" }, { voornaam: "asc" }],
      select: { id: true, voornaam: true, achternaam: true },
    }),
  ]);

  const byDay = new Map<string, typeof bezoeken>();
  for (const b of bezoeken) {
    const k = isoOf(b.datum);
    const arr = byDay.get(k);
    if (arr) arr.push(b);
    else byDay.set(k, [b]);
  }

  const days = Array.from({ length: 7 }, (_, i) => new Date(monday.getTime() + i * DAY));
  const gepland = bezoeken.filter((b) => b.status === "GEPLAND").length;
  const uitgevoerd = bezoeken.filter((b) => b.status === "UITGEVOERD").length;
  const prevIso = isoOf(new Date(monday.getTime() - 7 * DAY));
  const nextIso = isoOf(new Date(monday.getTime() + 7 * DAY));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-heading text-[#064a54] dark:text-white">Agenda</h1>
        <div className="flex items-center gap-2 text-sm">
          <Link href={`/admin/agenda?d=${prevIso}`} className={navBtn}>← Vorige</Link>
          <Link href="/admin/agenda" className={navBtn}>Deze week</Link>
          <Link href={`/admin/agenda?d=${nextIso}`} className={navBtn}>Volgende →</Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
        <div className="text-[#4f6b6f] dark:text-[#9fc7b5] font-medium">{fmtRange(monday, sunday)}</div>
        <div className="flex gap-2 text-xs">
          <span className="rounded-full bg-[#f0f6f1] dark:bg-[#0b2b30] px-2.5 py-1 text-[#4f6b6f] dark:text-[#9fc7b5]">
            {bezoeken.length} bezoeken
          </span>
          <span className="rounded-full bg-[#e6eff5] dark:bg-[#0b2b3a] px-2.5 py-1 text-[#3a6a8a] dark:text-[#7fb4d4]">
            {gepland} gepland
          </span>
          <span className="rounded-full bg-[#e6f2ea] dark:bg-[#0b3b42] px-2.5 py-1 text-[#4A9C6E] dark:text-[#5cb0bd]">
            {uitgevoerd} uitgevoerd
          </span>
        </div>
      </div>

      {clienten.length === 0 ? (
        <p className="text-sm text-[#8a9a8a] mb-6">
          Nog geen cliënten om in te plannen. Voeg eerst een cliënt toe.
        </p>
      ) : (
        <details className="mb-6 rounded-2xl border border-[#ede7db] dark:border-[#086370] bg-white dark:bg-[#243029]">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-[#064a54] dark:text-[#5cb0bd] select-none">
            + Bezoek inplannen
          </summary>
          <form action={addBezoek} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end px-4 pb-4">
            <input type="hidden" name="declarabel" value="1" />
            <label className={labelCls}>
              Cliënt *
              <select name="clientId" required defaultValue="" className={inputCls}>
                <option value="" disabled>
                  Kies cliënt…
                </option>
                {clienten.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.achternaam}, {c.voornaam}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelCls}>Datum<input type="date" name="datum" required defaultValue={todayIso} className={inputCls} /></label>
            <label className={labelCls}>Tijd<input type="time" name="tijd" className={inputCls} /></label>
            <label className={labelCls}>Duur (min)<input type="number" name="duurMinuten" required min="0" defaultValue={30} className={inputCls} /></label>
            <label className={labelCls}>Type zorg<input name="typeZorg" placeholder="wondzorg, verzorging…" className={inputCls} /></label>
            <label className={labelCls}>
              Status
              <select name="status" defaultValue="GEPLAND" className={inputCls}>
                <option value="GEPLAND">Gepland</option>
                <option value="UITGEVOERD">Uitgevoerd</option>
                <option value="GEANNULEERD">Geannuleerd</option>
              </select>
            </label>
            <div className="sm:col-span-3">
              <button type="submit" className={addBtn}>+ Inplannen</button>
            </div>
          </form>
        </details>
      )}

      <div className="space-y-4">
        {days.map((day) => {
          const k = isoOf(day);
          const items = byDay.get(k) ?? [];
          const isToday = k === todayIso;
          const dayMin = items
            .filter((b) => b.declarabel && b.status === "UITGEVOERD")
            .reduce((s, b) => s + (b.duurMinuten ?? 0), 0);
          return (
            <div
              key={k}
              className={
                "rounded-2xl border bg-white dark:bg-[#243029] " +
                (isToday
                  ? "border-[#4A9C6E] ring-1 ring-[#4A9C6E]/30"
                  : "border-[#ede7db] dark:border-[#086370]")
              }
            >
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#f0ece3] dark:border-[#0b3b42]">
                <span className="text-sm font-medium capitalize text-[#064a54] dark:text-white">
                  {fmtDay(day)}
                  {isToday ? (
                    <span className="ml-2 text-xs font-sans bg-[#4A9C6E] text-white rounded-full px-2 py-0.5 align-middle">
                      vandaag
                    </span>
                  ) : null}
                </span>
                <span className="text-xs text-[#8a9a8a]">
                  {items.length ? `${items.length} bezoek${items.length > 1 ? "en" : ""}` : "geen bezoeken"}
                  {dayMin > 0 ? ` · ${Math.floor(dayMin / 60)}u ${dayMin % 60}m` : ""}
                </span>
              </div>
              {items.length === 0 ? (
                <div className="px-4 py-3 text-sm text-[#b8bfb2] dark:text-[#5f7570]">—</div>
              ) : (
                <ul className="divide-y divide-[#f0ece3] dark:divide-[#0b3b42]">
                  {items.map((b) => {
                    const t = timeOf(b.datum);
                    return (
                      <li key={b.id} className="flex items-start gap-3 px-4 py-2.5 text-sm">
                        <span className="w-12 shrink-0 tabular-nums text-[#4f6b6f] dark:text-[#9fc7b5] pt-0.5">
                          {t || "—"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/admin/clienten/${b.client.id}`}
                            className={
                              "font-medium hover:underline " +
                              (b.status === "GEANNULEERD"
                                ? "line-through text-[#8a9a8a]"
                                : "text-[#064a54] dark:text-[#5cb0bd]")
                            }
                          >
                            {b.client.voornaam} {b.client.achternaam}
                          </Link>
                          <span className="text-[#4f6b6f] dark:text-[#9fc7b5]">
                            {b.duurMinuten != null ? ` · ${b.duurMinuten} min` : ""}
                            {b.typeZorg ? ` · ${b.typeZorg}` : ""}
                            {b.zorgverlener ? ` · ${b.zorgverlener}` : ""}
                          </span>
                        </div>
                        <span className={"shrink-0 text-xs rounded-full px-2 py-0.5 " + statusBadge[b.status]}>
                          {statusLabel[b.status]}
                        </span>
                        {b.status === "GEPLAND" ? (
                          <form action={setBezoekStatus} className="shrink-0">
                            <input type="hidden" name="id" value={b.id} />
                            <input type="hidden" name="clientId" value={b.client.id} />
                            <input type="hidden" name="status" value="UITGEVOERD" />
                            <button type="submit" className="text-xs text-[#4A9C6E] hover:underline" title="Markeer als uitgevoerd" aria-label={`Markeer bezoek van ${b.client.voornaam} ${b.client.achternaam} als uitgevoerd`}>
                              ✓ klaar
                            </button>
                          </form>
                        ) : null}
                        <form action={deleteBezoek} className="shrink-0">
                          <input type="hidden" name="id" value={b.id} />
                          <input type="hidden" name="clientId" value={b.client.id} />
                          <button type="submit" className="text-xs text-red-600 hover:underline" title="Verwijderen" aria-label={`Verwijder bezoek van ${b.client.voornaam} ${b.client.achternaam}`}>
                            ✕
                          </button>
                        </form>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
