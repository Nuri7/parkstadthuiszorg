"use client";

import { useId, useState } from "react";

export function Tabs({
  tabs,
  initial = 0,
}: {
  tabs: { label: string; content: React.ReactNode }[];
  initial?: number;
}) {
  const [active, setActive] = useState(initial);
  const uid = useId();
  const tabId = (i: number) => `${uid}-tab-${i}`;
  const panelId = (i: number) => `${uid}-panel-${i}`;

  // Pijltjestoets-navigatie tussen tabs (WAI-ARIA tabs-patroon)
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    let next = active;
    if (e.key === "ArrowRight") next = (active + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (active - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    setActive(next);
    document.getElementById(tabId(next))?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        className="flex flex-wrap gap-1 border-b border-[#ede7db] dark:border-[#086370]"
      >
        {tabs.map((t, i) => (
          <button
            key={t.label}
            id={tabId(i)}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={panelId(i)}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={onKeyDown}
            className={
              "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors " +
              (i === active
                ? "border-[#064a54] text-[#064a54] dark:border-[#5cb0bd] dark:text-white"
                : "border-transparent text-[#8a9a8a] hover:text-[#064a54] dark:hover:text-white")
            }
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.label}
          id={panelId(i)}
          role="tabpanel"
          aria-labelledby={tabId(i)}
          tabIndex={0}
          hidden={i !== active}
          className="pt-6 focus:outline-none"
        >
          {/* Alleen het actieve tabblad mounten (forms/effects hangen daarvan af) */}
          {i === active ? t.content : null}
        </div>
      ))}
    </div>
  );
}
