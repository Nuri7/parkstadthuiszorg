import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { snelLog, stelActieUit } from "@/app/actions/verwijzers";
import {
  weeklijst,
  isAchterstallig,
  redenVoorActie,
  berekenScore,
  heeftOpenActie,
  WEEK_ACTIES,
  OPVOLG_DAGEN,
  type PipelineVerwijzer,
} from "@/lib/pipeline";
import { badge, leadStatusBadge } from "@/lib/adminUi";
import { nl } from "@/lib/format";
import { verwijzerTypeLabels, leadStatusKort, levertRouteLabels } from "@/lib/labels";

export const metadata = { title: "Pipeline | Parkstad Thuiszorg" };

const knop =
  "rounded-lg border border-[#dce8de] dark:border-[#086370] px-3 py-1.5 text-sm text-[#064a54] dark:text-[#9fc7b5] hover:bg-[#f0f6f1] dark:hover:bg-[#0b2b30] transition-colors";

function Snelknoppen({ id }: { id: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <form action={snelLog}>
        <input type="hidden" name="verwijzerId" value={id} />
        <input type="hidden" name="soort" value="TELEFOON" />
        <input type="hidden" name="samenvatting" value="Gebeld" />
        <button type="submit" className={knop}>Gebeld</button>
      </form>
      <form action={snelLog}>
        <input type="hidden" name="verwijzerId" value={id} />
        <input type="hidden" name="soort" value="BEZOEK" />
        <input type="hidden" name="samenvatting" value="Langs geweest" />
        <input type="hidden" name="status" value="GESPROKEN" />
        <button type="submit" className={knop}>Bezocht</button>
      </form>
      <form action={snelLog}>
        <input type="hidden" name="verwijzerId" value={id} />
        <input type="hidden" name="soort" value="BEZOEK" />
        <input type="hidden" name="samenvatting" value="Folders en visitekaartjes afgegeven" />
        <input type="hidden" name="status" value="MATERIAAL" />
        <button type="submit" className={knop}>Folder gebracht</button>
      </form>
      <form action={stelActieUit}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="dagen" value="7" />
        <button type="submit" className="text-xs text-[#8a9a8a] hover:underline px-1">Later (+7 dagen)</button>
      </form>
    </div>
  );
}

export default async function PipelinePage() {
  await requireAdmin();
  const now = new Date();

  const verwijzers = await db.verwijzer.findMany({
    include: { _count: { select: { clienten: true } } },
  });
  const alle: PipelineVerwijzer[] = verwijzers.map((v) => ({ ...v, aantalClienten: v._count.clienten }));

  const week = weeklijst(alle, now);
  const weekIds = new Set(week.map((v) => v.id));
  const achterstallig = alle.filter((v) => isAchterstallig(v, now) && !weekIds.has(v.id));
  const openTotaal = alle.filter((v) => heeftOpenActie(v, now)).length;

  const tellingen = alle.reduce<Record<string, number>>((acc, v) => {
    acc[v.status] = (acc[v.status] ?? 0) + 1;
    return acc;
  }, {});

  // Aanvragen die nog op opvolging wachten — de andere kant van de trechter.
  const openAanvragen = await db.contactRequest.count({ where: { status: "new" } });
  const clientenPerBron = await db.client.groupBy({
    by: ["verwijzerId"],
    _count: { _all: true },
    where: { verwijzerId: { not: null } },
  });
  const viaVerwijzer = clientenPerBron.reduce((s, r) => s + r._count._all, 0);

  const kaart = "rounded-2xl border border-[#ede7db] dark:border-[#086370] bg-white dark:bg-[#243029] p-4";

  const regel = (v: PipelineVerwijzer, rood: boolean) => (
    <div key={v.id} className={`${kaart} ${rood ? "border-l-4 border-l-[#dc2626]" : ""}`}>
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <Link href={`/admin/verwijzers/${v.id}`} className="font-medium text-[#064a54] dark:text-[#5cb0bd] hover:underline">
          {v.naam}
        </Link>
        <span className={`${badge} ${leadStatusBadge[v.status] ?? ""}`}>{leadStatusKort[v.status] ?? v.status}</span>
        <span className="text-xs text-[#8a9a8a]">
          {verwijzerTypeLabels[v.type] ?? v.type}
          {v.plaats ? ` · ${v.plaats}` : ""}
          {` · ${levertRouteLabels[v.levertRoute] ?? v.levertRoute}`}
          {` · score ${berekenScore(v, now)}`}
        </span>
      </div>
      <p className={"text-sm mb-3 " + (rood ? "text-[#b02525]" : "text-[#4f6b6f] dark:text-[#9fc7b5]")}>
        {redenVoorActie(v, now)}
        {v.telefoon ? ` · ${v.telefoon}` : ""}
        {v.laatsteContactOp ? ` · laatst ${nl(v.laatsteContactOp)}` : ""}
      </p>
      <Snelknoppen id={v.id} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading text-[#064a54] dark:text-white">Pipeline</h1>
          <p className="text-sm text-[#4f6b6f] dark:text-[#9fc7b5] mt-1">
            Verwijzers zijn de grootste bron van cliënten. Doe deze {WEEK_ACTIES} acties deze week.
          </p>
        </div>
        <Link
          href="/admin/verwijzers/nieuw"
          className="rounded-lg bg-[#064a54] text-white px-4 py-2 text-sm font-medium hover:bg-[#053a42] whitespace-nowrap"
        >
          + Nieuwe verwijzer
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Openstaande acties", waarde: openTotaal },
          { label: "Actieve verwijzers", waarde: tellingen.ACTIEF ?? 0 },
          { label: "Cliënten via verwijzer", waarde: viaVerwijzer },
          { label: "Nieuwe aanvragen", waarde: openAanvragen },
        ].map((t) => (
          <div key={t.label} className={kaart}>
            <div className="text-2xl font-heading text-[#064a54] dark:text-white">{t.waarde}</div>
            <div className="text-xs text-[#8a9a8a] mt-1">{t.label}</div>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-[#064a54] dark:text-[#5cb0bd] mb-3">Deze week</h2>
      {week.length > 0 ? (
        <div className="space-y-3 mb-8">{week.map((v) => regel(v, false))}</div>
      ) : (
        <p className="text-sm text-[#8a9a8a] mb-8">
          {alle.length === 0 ? (
            <>
              Nog geen verwijzers. Begin met de praktijken en loketten die Meyrem al kent —{" "}
              <Link href="/admin/verwijzers/nieuw" className="text-[#064a54] dark:text-[#5cb0bd] underline">
                voeg de eerste toe
              </Link>
              .
            </>
          ) : (
            "Niets openstaand. Alle opvolging is ingepland."
          )}
        </p>
      )}

      {achterstallig.length > 0 ? (
        <>
          <h2 className="text-sm font-semibold text-[#b02525] mb-3">
            Blijven liggen ({achterstallig.length}) — langer dan {OPVOLG_DAGEN} dagen geen contact
          </h2>
          <div className="space-y-3 mb-8">{achterstallig.map((v) => regel(v, true))}</div>
        </>
      ) : null}

      <div className={kaart}>
        <h2 className="text-sm font-semibold text-[#064a54] dark:text-[#5cb0bd] mb-2">Verdeling</h2>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#4f6b6f] dark:text-[#9fc7b5]">
          {Object.entries(tellingen).map(([status, aantal]) => (
            <li key={status}>
              <Link href={`/admin/verwijzers?status=${status}`} className="hover:underline">
                {leadStatusKort[status] ?? status}: <strong>{aantal}</strong>
              </Link>
            </li>
          ))}
          {alle.length === 0 ? <li>Nog geen verwijzers.</li> : null}
        </ul>
      </div>
    </div>
  );
}
