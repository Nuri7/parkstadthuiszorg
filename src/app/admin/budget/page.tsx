import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { actieveFinanciering, budgetOverzicht, type BudgetKleur } from "@/lib/budget";
import { BudgetMeter } from "@/components/admin/BudgetMeter";
import { nl } from "@/lib/format";

export const metadata = { title: "Budget | Parkstad Thuiszorg" };

const DOT: Record<BudgetKleur, string> = {
  groen: "bg-[#4A9C6E]",
  oranje: "bg-[#d97706]",
  rood: "bg-[#dc2626]",
};
const rank: Record<BudgetKleur, number> = { rood: 0, oranje: 1, groen: 2 };

export default async function BudgetPage() {
  await requireAdmin();
  const now = new Date();

  const clienten = await db.client.findMany({
    orderBy: [{ achternaam: "asc" }, { voornaam: "asc" }],
    include: { financieringen: true, bezoeken: true },
  });

  const rijen = clienten.map((c) => {
    const fin = actieveFinanciering(c.financieringen, now);
    return { c, fin, budget: fin ? budgetOverzicht(fin, c.bezoeken, now) : null };
  });

  const metBudget = rijen.filter((r) => r.budget !== null);
  metBudget.sort((a, b) => rank[a.budget!.week.kleur] - rank[b.budget!.week.kleur]);
  const zonderBudget = rijen.filter((r) => !r.budget);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-heading text-[#064a54] dark:text-white">Budget</h1>
        <p className="text-sm text-[#4f6b6f] dark:text-[#9fc7b5] mt-1">
          Verbruik per cliënt t.o.v. de beschikking. Cliënten die aandacht nodig hebben, staan bovenaan.
        </p>
      </div>

      {clienten.length === 0 ? (
        <p className="text-sm text-[#8a9a8a]">Nog geen cliënten.</p>
      ) : (
        <div className="space-y-4">
          {metBudget.map((r) => {
            const { c, fin } = r;
            const budget = r.budget!;
            return (
              <div
                key={c.id}
                className="rounded-2xl border border-[#ede7db] dark:border-[#086370] bg-white dark:bg-[#243029] p-4"
              >
                <div className="flex items-center gap-2 mb-3 min-w-0">
                  <span className={`shrink-0 w-2.5 h-2.5 rounded-full ${DOT[budget.week.kleur]}`} aria-hidden />
                  <Link
                    href={`/admin/clienten/${c.id}`}
                    className="font-medium text-[#064a54] dark:text-[#5cb0bd] hover:underline truncate"
                  >
                    {c.voornaam} {c.achternaam}
                  </Link>
                  <span className="text-xs text-[#8a9a8a] shrink-0">
                    · {fin?.wet}/{fin?.vorm}
                    {budget.periode ? ` · t/m ${nl(budget.periode.tot)}` : ""}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <BudgetMeter label="Deze week" gebruiktUren={budget.week.gebruiktUren} toegestaanUren={budget.week.toegestaanUren} kleur={budget.week.kleur} tarief={budget.tarief} />
                  <BudgetMeter label="Deze maand" gebruiktUren={budget.maand.gebruiktUren} toegestaanUren={budget.maand.toegestaanUren} kleur={budget.maand.kleur} tarief={budget.tarief} />
                  {budget.periode ? (
                    <BudgetMeter label="Hele periode" gebruiktUren={budget.periode.gebruiktUren} toegestaanUren={budget.periode.toegestaanUren} kleur={budget.periode.kleur} tarief={budget.tarief} />
                  ) : (
                    <div className="text-xs text-[#8a9a8a] self-center">Stel <em>geldig van/tot</em> in voor het periodetotaal.</div>
                  )}
                </div>
              </div>
            );
          })}

          {zonderBudget.length > 0 ? (
            <div className="rounded-2xl border border-dashed border-[#ded7c9] dark:border-[#086370] p-4">
              <h2 className="text-sm font-semibold text-[#4f6b6f] dark:text-[#9fc7b5] mb-2">Zonder beschikking</h2>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {zonderBudget.map(({ c }) => (
                  <li key={c.id}>
                    <Link href={`/admin/clienten/${c.id}`} className="text-[#064a54] dark:text-[#5cb0bd] hover:underline">
                      {c.voornaam} {c.achternaam}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
