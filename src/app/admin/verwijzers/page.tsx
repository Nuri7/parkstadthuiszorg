import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { berekenScore, heeftOpenActie, type PipelineVerwijzer } from "@/lib/pipeline";
import { badge, leadStatusBadge, inputCls } from "@/lib/adminUi";
import { nl } from "@/lib/format";
import { verwijzerTypeLabels, leadStatusKort, leadStatusLabels, levertRouteLabels } from "@/lib/labels";
import type { LeadStatus, VerwijzerType } from "@prisma/client";

export const metadata = { title: "Verwijzers | Parkstad Thuiszorg" };

type Zoek = { type?: string; status?: string; plaats?: string; q?: string };

export default async function VerwijzersPage({ searchParams }: { searchParams: Promise<Zoek> }) {
  await requireAdmin();
  const { type, status, plaats, q } = await searchParams;

  const verwijzers = await db.verwijzer.findMany({
    where: {
      ...(type ? { type: type as VerwijzerType } : {}),
      ...(status ? { status: status as LeadStatus } : {}),
      ...(plaats ? { plaats } : {}),
      ...(q ? { naam: { contains: q, mode: "insensitive" as const } } : {}),
    },
    include: { _count: { select: { clienten: true, activiteiten: true } } },
    orderBy: { naam: "asc" },
  });

  const now = new Date();
  const rijen = verwijzers
    .map((v) => {
      const p: PipelineVerwijzer = { ...v, aantalClienten: v._count.clienten };
      return { v, p, score: berekenScore(p, now), open: heeftOpenActie(p, now) };
    })
    .sort((a, b) => Number(b.open) - Number(a.open) || b.score - a.score || a.v.naam.localeCompare(b.v.naam, "nl"));

  const plaatsen = [...new Set(verwijzers.map((v) => v.plaats).filter((p): p is string => !!p))].sort();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-heading text-[#064a54] dark:text-white">Verwijzers</h1>
          <p className="text-sm text-[#4f6b6f] dark:text-[#9fc7b5] mt-1">
            {verwijzers.length} contact{verwijzers.length === 1 ? "" : "en"} · openstaande acties bovenaan
          </p>
        </div>
        <Link
          href="/admin/verwijzers/nieuw"
          className="rounded-lg bg-[#064a54] text-white px-4 py-2 text-sm font-medium hover:bg-[#053a42] transition-colors whitespace-nowrap"
        >
          + Nieuwe verwijzer
        </Link>
      </div>

      <form className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
        <input name="q" defaultValue={q ?? ""} placeholder="Zoek op naam" className={inputCls} />
        <select name="type" defaultValue={type ?? ""} className={inputCls}>
          <option value="">Alle typen</option>
          {Object.entries(verwijzerTypeLabels).map(([w, l]) => (
            <option key={w} value={w}>{l}</option>
          ))}
        </select>
        <select name="status" defaultValue={status ?? ""} className={inputCls}>
          <option value="">Alle statussen</option>
          {Object.entries(leadStatusLabels).map(([w, l]) => (
            <option key={w} value={w}>{l}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <select name="plaats" defaultValue={plaats ?? ""} className={inputCls}>
            <option value="">Alle plaatsen</option>
            {plaatsen.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <button type="submit" className="mt-1 rounded-lg border border-[#dce8de] dark:border-[#086370] px-4 text-sm text-[#4f6b6f] dark:text-[#9fc7b5]">
            Filter
          </button>
        </div>
      </form>

      {rijen.length === 0 ? (
        <p className="text-[#4f6b6f] dark:text-[#5cb0bd]">
          Geen verwijzers gevonden. Voeg de eerste toe met &ldquo;Nieuwe verwijzer&rdquo;.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#ede7db] dark:border-[#086370] bg-white dark:bg-[#243029]">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#8a9a8a] border-b border-[#ede7db] dark:border-[#086370]">
                <th scope="col" className="p-3 font-medium">Naam</th>
                <th scope="col" className="p-3 font-medium">Type</th>
                <th scope="col" className="p-3 font-medium">Plaats</th>
                <th scope="col" className="p-3 font-medium">Status</th>
                <th scope="col" className="p-3 font-medium">Route</th>
                <th scope="col" className="p-3 font-medium">Laatste contact</th>
                <th scope="col" className="p-3 font-medium">Volgende actie</th>
                <th scope="col" className="p-3 font-medium text-right">Cliënten</th>
                <th scope="col" className="p-3 font-medium text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {rijen.map(({ v, score, open }) => (
                <tr key={v.id} className="border-b border-[#f0ece3] dark:border-[#0b3b42] last:border-0">
                  <td className="p-3">
                    <Link href={`/admin/verwijzers/${v.id}`} className="font-medium text-[#064a54] dark:text-[#5cb0bd] hover:underline">
                      {v.naam}
                    </Link>
                  </td>
                  <td className="p-3 text-[#4f6b6f] dark:text-[#9fc7b5]">{verwijzerTypeLabels[v.type] ?? v.type}</td>
                  <td className="p-3 text-[#4f6b6f] dark:text-[#9fc7b5]">{v.plaats ?? "—"}</td>
                  <td className="p-3">
                    <span className={`${badge} ${leadStatusBadge[v.status] ?? ""}`}>{leadStatusKort[v.status] ?? v.status}</span>
                  </td>
                  <td className="p-3 text-[#4f6b6f] dark:text-[#9fc7b5]">{levertRouteLabels[v.levertRoute] ?? v.levertRoute}</td>
                  <td className="p-3 text-[#4f6b6f] dark:text-[#9fc7b5]">{nl(v.laatsteContactOp)}</td>
                  <td className={"p-3 " + (open ? "text-[#b02525] font-medium" : "text-[#4f6b6f] dark:text-[#9fc7b5]")}>
                    {v.volgendeActieOp ? nl(v.volgendeActieOp) : open ? "openstaand" : "—"}
                  </td>
                  <td className="p-3 text-right text-[#4f6b6f] dark:text-[#9fc7b5]">{v._count.clienten}</td>
                  <td className="p-3 text-right text-[#8a9a8a]">{score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
