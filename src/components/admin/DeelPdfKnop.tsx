"use client";

import { useState } from "react";

// Haalt de PDF op en biedt 'm aan via het deel-menu van het toestel (Web Share,
// bv. WhatsApp op de telefoon). Kan dat niet, dan valt hij terug op downloaden.
export function DeelPdfKnop({ url, filename, titel }: { url: string; filename: string; titel: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handle() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Kon de PDF niet genereren.");
      const blob = await res.blob();
      const file = new File([blob], filename, { type: "application/pdf" });

      const nav = navigator as Navigator & {
        canShare?: (data?: { files?: File[] }) => boolean;
      };
      if (typeof nav.share === "function" && nav.canShare && nav.canShare({ files: [file] })) {
        try {
          await nav.share({ files: [file], title: titel });
          return;
        } catch (e) {
          if ((e as Error)?.name === "AbortError") return; // gebruiker annuleerde
          // anders: val terug op downloaden
        }
      }
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Er ging iets mis.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end">
      <button
        type="button"
        onClick={handle}
        disabled={busy}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#4A9C6E] text-[#4A9C6E] px-3 py-2 text-sm font-medium hover:bg-[#e6f2ea] dark:hover:bg-[#0b3b42] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {busy ? "Bezig…" : "Deel als PDF"}
      </button>
      {error ? <span className="text-xs text-red-600 mt-1">{error}</span> : null}
    </div>
  );
}
