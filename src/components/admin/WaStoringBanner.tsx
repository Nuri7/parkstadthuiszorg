import { AlertTriangle } from "lucide-react";
import { db } from "@/lib/db";

// Laat WhatsApp-storingen van de afgelopen 48 uur zien. Een mislukt bericht aan
// Meyrem is anders volledig onzichtbaar: de webhook geeft gewoon 200 terug en
// de fout verdwijnt in Vercels logs.
const VENSTER_MS = 48 * 60 * 60 * 1000;

// Apart van de component gehouden: Date.now() in een componentbody triggert de
// React-Compiler-purityregel, ook al is dit een server component.
async function recenteFouten() {
  const where = {
    tool: "whatsapp",
    gelukt: false,
    createdAt: { gte: new Date(Date.now() - VENSTER_MS) },
  };
  const [aantal, laatste] = await Promise.all([
    db.assistentActie.count({ where }),
    db.assistentActie.findFirst({
      where,
      orderBy: { createdAt: "desc" },
      select: { resultaat: true, createdAt: true },
    }),
  ]);
  return { aantal, laatste };
}

export async function WaStoringBanner() {
  const { aantal, laatste } = await recenteFouten();
  if (aantal === 0 || !laatste) return null;
  const wanneer = laatste.createdAt.toLocaleString("nl-NL", {
    timeZone: "Europe/Amsterdam",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      role="alert"
      className="m-4 mb-0 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-900 dark:text-amber-200"
    >
      <p className="font-semibold flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
        WhatsApp-koppeling: {aantal === 1 ? "1 fout" : `${aantal} fouten`} in de
        afgelopen 48 uur (laatste: {wanneer})
      </p>
      <p className="mt-1 break-words text-amber-800 dark:text-amber-300">
        {laatste.resultaat ?? "Onbekende fout"}
      </p>
    </div>
  );
}
