"use client";

import { useEffect, useState } from "react";
import { weekBoundsUTC, budgetKleur } from "@/lib/budget";
import { uur as fmt } from "@/lib/format";

// Live vangrail: leest de datum + duur uit het bezoek-formulier en laat zien
// hoeveel uur die week gebruikt wordt ná dit bezoek. Waarschuwt vóór opslaan
// als het bezoek de weekgrens overschrijdt — geen stille overschrijding.
export function BezoekBudgetHint({
  urenPerWeek,
  weekMap,
  formId,
}: {
  urenPerWeek: number | null;
  weekMap: Record<string, number>;
  formId: string;
}) {
  const [st, setSt] = useState<{ used: number; extra: number } | null>(null);

  useEffect(() => {
    const form = document.getElementById(formId);
    if (!form) return;
    const datumEl = form.querySelector<HTMLInputElement>('[name="datum"]');
    const duurEl = form.querySelector<HTMLInputElement>('[name="duurMinuten"]');
    const recompute = () => {
      const dStr = datumEl?.value;
      const min = Number(duurEl?.value ?? "") || 0;
      if (!dStr) return setSt(null);
      const d = new Date(`${dStr}T00:00:00Z`);
      if (isNaN(d.getTime())) return setSt(null);
      const key = weekBoundsUTC(d).start.toISOString().slice(0, 10);
      setSt({ used: weekMap[key] ?? 0, extra: min / 60 });
    };
    recompute();
    datumEl?.addEventListener("input", recompute);
    duurEl?.addEventListener("input", recompute);
    return () => {
      datumEl?.removeEventListener("input", recompute);
      duurEl?.removeEventListener("input", recompute);
    };
  }, [formId, weekMap]);

  if (urenPerWeek == null || !st) return null;

  const totaal = st.used + st.extra;
  const kleur = budgetKleur(totaal, urenPerWeek);
  const over = totaal > urenPerWeek + 0.0001;
  const box =
    kleur === "rood"
      ? "border-[#dc2626] bg-[#fdecec] dark:bg-[#3a1414] text-[#b91c1c] dark:text-[#f2b8b8]"
      : kleur === "oranje"
        ? "border-[#d97706] bg-[#fdf4e7] dark:bg-[#3a2a12] text-[#b56a00] dark:text-[#e0913a]"
        : "border-[#cfe6d6] dark:border-[#0b3b42] bg-[#f0f6f1] dark:bg-[#0b2b30] text-[#4A9C6E]";

  return (
    <div className={`sm:col-span-3 rounded-lg border px-3 py-2 text-sm ${box}`}>
      Deze week inclusief dit bezoek: <strong>{fmt(totaal)}</strong> van {fmt(urenPerWeek)}
      {over ? " — let op: dit gaat over het weekbudget van de cliënt." : "."}
    </div>
  );
}
