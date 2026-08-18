// Gedeelde Tailwind-klassen voor admin-formulieren. Eén plek i.p.v. per pagina.

export const inputCls =
  "mt-1 w-full rounded-lg border border-[#dce8de] dark:border-[#086370] bg-white dark:bg-[#02191c] px-3 py-2 text-sm text-[#064a54] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4A9C6E]";

export const labelCls = "block text-sm text-[#4f6b6f] dark:text-[#9fc7b5]";

export const addBtn =
  "rounded-lg bg-[#4A9C6E] text-white px-4 py-2 text-sm font-medium hover:bg-[#3d8a5f]";

export const delBtn = "text-red-600 hover:underline text-xs ml-3";

export const subHead =
  "text-sm font-semibold text-[#064a54] dark:text-[#5cb0bd] pt-2 border-t border-[#f0ece3] dark:border-[#0b3b42]";

export const navBtn =
  "rounded-lg border border-[#dce8de] dark:border-[#086370] px-3 py-1.5 text-[#4f6b6f] dark:text-[#9fc7b5] hover:bg-[#f0f6f1] dark:hover:bg-[#0b2b30] transition-colors";

export const badge = "text-xs font-medium rounded-full px-2.5 py-1 whitespace-nowrap";

/** Kleuren per leadstatus (verwijzerpijplijn). */
export const leadStatusBadge: Record<string, string> = {
  KANDIDAAT: "bg-[#f3f1ea] text-[#6b6b5f] dark:bg-[#0b3b42] dark:text-[#9fc7b5]",
  NIEUW: "bg-[#e6eef2] text-[#064a54] dark:bg-[#0b3b42] dark:text-[#5cb0bd]",
  BENADERD: "bg-[#fdf3e3] text-[#8a5a12] dark:bg-[#3a2c12] dark:text-[#e2b96b]",
  GESPROKEN: "bg-[#e6f2ea] text-[#3d8a5f] dark:bg-[#0b3b42] dark:text-[#7fd0a3]",
  MATERIAAL: "bg-[#e6f2ea] text-[#3d8a5f] dark:bg-[#0b3b42] dark:text-[#7fd0a3]",
  ACTIEF: "bg-[#4A9C6E] text-white",
  SLAPEND: "bg-[#f3f1ea] text-[#8a9a8a] dark:bg-[#0b3b42] dark:text-[#9fc7b5]",
  GEEN_INTERESSE: "bg-[#f3f1ea] text-[#8a9a8a] dark:bg-[#0b3b42] dark:text-[#9fc7b5]",
  UITGESCHREVEN: "bg-[#fdeaea] text-[#b02525] dark:bg-[#3a1414] dark:text-[#f0a3a3]",
};
