import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { deleteClient } from "@/app/actions/clienten";
import { clientStatusLabels } from "@/lib/labels";

export const metadata = { title: "Cliënten | Parkstad Thuiszorg" };

export default async function ClientenPage() {
  await requireAdmin();
  const clienten = await db.client.findMany({
    orderBy: { createdAt: "desc" },
    include: { financieringen: true, _count: { select: { bezoeken: true } } },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading text-[#064a54] dark:text-white">Cliënten</h1>
        <Link
          href="/admin/clienten/nieuw"
          className="rounded-lg bg-[#064a54] text-white px-4 py-2 text-sm font-medium hover:bg-[#053a42] transition-colors"
        >
          + Nieuwe cliënt
        </Link>
      </div>

      {clienten.length === 0 ? (
        <p className="text-[#4f6b6f] dark:text-[#5cb0bd]">Nog geen cliënten. Voeg de eerste toe met &ldquo;Nieuwe cliënt&rdquo;.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#ede7db] dark:border-[#086370] bg-white dark:bg-[#243029]">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#8a9a8a] border-b border-[#ede7db] dark:border-[#086370]">
                <th scope="col" className="p-3 font-medium">Naam</th>
                <th scope="col" className="p-3 font-medium">Status</th>
                <th scope="col" className="p-3 font-medium">Financiering</th>
                <th scope="col" className="p-3 font-medium">Bezoeken</th>
                <th scope="col" className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {clienten.map((c) => (
                <tr key={c.id} className="border-b border-[#f0ece3] dark:border-[#0b3b42] last:border-0">
                  <td className="p-3">
                    <Link
                      href={`/admin/clienten/${c.id}`}
                      className="font-medium text-[#064a54] dark:text-[#5cb0bd] hover:underline"
                    >
                      {c.voornaam} {c.achternaam}
                    </Link>
                  </td>
                  <td className="p-3 text-[#4f6b6f] dark:text-[#9fc7b5]">{clientStatusLabels[c.status] ?? c.status}</td>
                  <td className="p-3 text-[#4f6b6f] dark:text-[#9fc7b5]">
                    {c.financieringen.map((f) => `${f.wet}/${f.vorm}`).join(", ") || "—"}
                  </td>
                  <td className="p-3 text-[#4f6b6f] dark:text-[#9fc7b5]">{c._count.bezoeken}</td>
                  <td className="p-3 text-right">
                    <form action={deleteClient}>
                      <input type="hidden" name="id" value={c.id} />
                      <button type="submit" className="text-red-600 hover:underline text-xs">
                        Verwijderen
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
