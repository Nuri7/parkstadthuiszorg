"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { addWondFoto } from "@/app/actions/wondfotos";
import { ALLOWED_IMAGE_TYPES } from "@/lib/constants";

const MAX_BYTES = 8 * 1024 * 1024;
// Zelfde allowlist als de server (geen svg/html). Client-check is alleen een
// vriendelijke hint; de server dwingt het echt af.
const ALLOWED = new Set<string>(ALLOWED_IMAGE_TYPES);

const inputCls =
  "mt-1 w-full rounded-lg border border-[#dce8de] dark:border-[#086370] bg-white dark:bg-[#02191c] px-3 py-2 text-sm text-[#064a54] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4A9C6E]";
const labelCls = "block text-sm text-[#4f6b6f] dark:text-[#9fc7b5]";

// Verklein een afbeelding client-side naar max `max` px (langste zijde) als JPEG.
// Scheelt opslag/bandbreedte en houdt de upload ruim onder de server-limiet.
// Faalt de conversie (bv. onbekend formaat), dan valt hij terug op het origineel.
async function downscale(file: File, max = 1600, quality = 0.82): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  try {
    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;
    if (width > max || height > max) {
      const scale = max / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality),
    );
    if (!blob || blob.size === 0) return file;
    const base = (file.name || "foto").replace(/\.[^.]+$/, "") || "foto";
    return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export function WondFotoUpload({ wondId, clientId }: { wondId: string; clientId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [datum, setDatum] = useState("");
  const [opmerking, setOpmerking] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleUpload() {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Kies eerst een foto.");
      return;
    }
    if (file.type && !ALLOWED.has(file.type)) {
      setError("Kies een JPEG, PNG, WEBP, GIF of HEIC.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const small = await downscale(file);
      if (small.size > MAX_BYTES) {
        setError(
          "Foto is te groot en kon niet automatisch verkleind worden. Kies een JPEG/PNG of maak de foto kleiner.",
        );
        return;
      }
      const fd = new FormData();
      fd.set("wondId", wondId);
      fd.set("clientId", clientId);
      fd.set("foto", small);
      fd.set("bestandsnaam", file.name);
      if (datum) fd.set("datum", datum);
      if (opmerking) fd.set("opmerking", opmerking);
      await addWondFoto(fd);
      if (inputRef.current) inputRef.current.value = "";
      setFileName(null);
      setDatum("");
      setOpmerking("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Uploaden mislukt. Probeer opnieuw.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border-t border-[#f0ece3] dark:border-[#0b3b42] pt-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <label className={labelCls}>
          Foto
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setFileName(f?.name ?? null);
              setError(f && f.type && !ALLOWED.has(f.type) ? "Kies een JPEG, PNG, WEBP, GIF of HEIC." : null);
            }}
            className="mt-1 w-full text-sm text-[#4f6b6f] dark:text-[#9fc7b5] file:mr-3 file:rounded-lg file:border-0 file:bg-[#e6f2ea] dark:file:bg-[#0b3b42] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#4A9C6E] hover:file:bg-[#d7ebdd]"
          />
        </label>
        <label className={labelCls}>
          Datum foto
          <input type="date" value={datum} onChange={(e) => setDatum(e.target.value)} className={inputCls} />
        </label>
        <label className={labelCls}>
          Opmerking
          <input
            value={opmerking}
            onChange={(e) => setOpmerking(e.target.value)}
            placeholder="bijv. voor verzorging, dag 12…"
            className={inputCls}
          />
        </label>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleUpload}
          disabled={busy || !fileName}
          className="rounded-lg bg-[#4A9C6E] text-white px-4 py-2 text-sm font-medium hover:bg-[#3d8a5f] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? "Bezig met uploaden…" : "+ Foto uploaden"}
        </button>
        {fileName && !busy ? (
          <span className="text-xs text-[#8a9a8a] truncate max-w-[16rem]">{fileName}</span>
        ) : null}
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <p className="text-xs text-[#8a9a8a]">
        Foto&apos;s worden versleuteld opgeslagen in een private EU-opslag (Frankfurt) en zijn alleen zichtbaar
        na inloggen.
      </p>
    </div>
  );
}
