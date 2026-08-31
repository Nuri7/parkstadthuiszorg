import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { Assistent } from "@/components/admin/Assistent";
import { naarRegels } from "@/lib/assistent/weergave";
import type { WachtOp } from "@/lib/assistent/gesprek";
import { mailLezenBeschikbaar } from "@/lib/assistent/mail";
import { nieuwGesprek, verwijderGesprek } from "@/app/actions/assistent";

export const metadata = { title: "Assistent | Parkstad Thuiszorg" };

export default async function AssistentPage({
  searchParams,
}: {
  searchParams: Promise<{ g?: string }>;
}) {
  await requireAdmin();
  const { g } = await searchParams;

  const gesprekken = await db.assistentGesprek.findMany({
    orderBy: { updatedAt: "desc" },
    take: 25,
    select: { id: true, titel: true, updatedAt: true },
  });

  const huidig = g
    ? await db.assistentGesprek.findUnique({
        where: { id: g },
        include: { berichten: { orderBy: { createdAt: "asc" } } },
      })
    : null;

  const wachtOp = (huidig?.wachtOp as unknown as WachtOp | null) ?? null;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <aside className="lg:w-60 lg:shrink-0 lg:border-r border-b lg:border-b-0 border-[#ede7db] dark:border-[#086370] p-3 lg:max-h-screen lg:overflow-y-auto">
        <form action={nieuwGesprek}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[#4A9C6E] text-white px-3 py-2 text-sm font-medium hover:bg-[#3d8a5f] transition-colors"
          >
            <Plus className="w-4 h-4" /> Nieuw gesprek
          </button>
        </form>

        <ul className="mt-3 space-y-0.5">
          {gesprekken.map((gesp) => {
            const actief = gesp.id === g;
            return (
              <li key={gesp.id} className="group flex items-center gap-1">
                <Link
                  href={`/admin/assistent?g=${gesp.id}`}
                  className={
                    "flex-1 min-w-0 rounded-lg px-2.5 py-2 text-[13px] truncate transition-colors " +
                    (actief
                      ? "bg-[#f0f6f1] dark:bg-[#0b2b30] text-[#064a54] dark:text-white font-medium"
                      : "text-[#4f6b6f] dark:text-[#9fc7b5] hover:bg-[#f0f6f1] dark:hover:bg-[#0b2b30]")
                  }
                >
                  {gesp.titel ?? "Nieuw gesprek"}
                </Link>
                <form action={verwijderGesprek} className="shrink-0">
                  <input type="hidden" name="id" value={gesp.id} />
                  <button
                    type="submit"
                    aria-label="Gesprek verwijderen"
                    className="p-1.5 rounded-lg text-[#c9d4cb] hover:text-red-600 hover:bg-[#f0f6f1] dark:hover:bg-[#0b2b30] lg:opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="flex-1 min-w-0">
        <Assistent
          key={g ?? "nieuw"}
          gesprekId={huidig?.id ?? null}
          beginRegels={naarRegels(huidig?.berichten ?? [])}
          beginOpen={wachtOp?.open ?? []}
          mailBeschikbaar={mailLezenBeschikbaar()}
        />
      </div>
    </div>
  );
}
