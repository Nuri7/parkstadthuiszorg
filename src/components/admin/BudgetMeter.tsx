import type { BudgetKleur } from "@/lib/budget";
import { uur as u } from "@/lib/format";

const BAR: Record<BudgetKleur, string> = {
  groen: "bg-[#4A9C6E]",
  oranje: "bg-[#d97706]",
  rood: "bg-[#dc2626]",
};
const TXT: Record<BudgetKleur, string> = {
  groen: "text-[#4A9C6E]",
  oranje: "text-[#b56a00] dark:text-[#e0913a]",
  rood: "text-[#dc2626]",
};

export function BudgetMeter({
  label,
  gebruiktUren,
  toegestaanUren,
  kleur,
  tarief,
}: {
  label: string;
  gebruiktUren: number;
  toegestaanUren: number | null;
  kleur: BudgetKleur;
  tarief?: number | null;
}) {
  const pct =
    toegestaanUren && toegestaanUren > 0
      ? Math.min(100, (gebruiktUren / toegestaanUren) * 100)
      : gebruiktUren > 0
        ? 100
        : 0;
  const over = toegestaanUren != null && gebruiktUren > toegestaanUren + 0.0001;
  const restUren = toegestaanUren != null ? toegestaanUren - gebruiktUren : null;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="text-[#4f6b6f] dark:text-[#9fc7b5]">{label}</span>
        <span className={`font-medium ${TXT[kleur]}`}>
          {u(gebruiktUren)}
          {toegestaanUren != null ? ` / ${u(toegestaanUren)}` : ""}
          {tarief ? <span className="text-[#8a9a8a] font-normal"> · €{Math.round(gebruiktUren * tarief)}</span> : null}
        </span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-[#eef2ec] dark:bg-[#0b2b30] overflow-hidden">
        <div className={`h-full rounded-full ${BAR[kleur]}`} style={{ width: `${pct}%` }} />
      </div>
      {toegestaanUren != null ? (
        <div className={`mt-1 text-xs ${over ? TXT.rood : "text-[#8a9a8a]"}`}>
          {over
            ? `${u(gebruiktUren - toegestaanUren)} over budget`
            : `nog ${u(Math.max(0, restUren ?? 0))} beschikbaar`}
        </div>
      ) : (
        <div className="mt-1 text-xs text-[#8a9a8a]">geen budgetgrens ingesteld</div>
      )}
    </div>
  );
}
