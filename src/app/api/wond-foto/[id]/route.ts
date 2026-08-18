import { db } from "@/lib/db";
import { isAdminAuthed } from "@/lib/adminGuard";
import { get } from "@vercel/blob";

// Alleen deze content-types worden inline geserveerd. Onbekende/onveilige types
// (bv. svg/html) → als download i.p.v. inline, plus nosniff, zodat de browser
// nooit script uitvoert in onze origin.
const SAFE_INLINE = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
]);

// Afgeschermde proxy voor private wondfoto's. De Blob-store is 'private', dus de
// blob-url is niet publiek benaderbaar; alleen een ingelogde admin krijgt de
// bytes via deze route. Zo blijven medische foto's achter de wachtwoord-gate.
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthed())) {
    return new Response("Niet ingelogd", { status: 401 });
  }

  const { id } = await ctx.params;
  const foto = await db.wondFoto.findUnique({ where: { id } });
  if (!foto) return new Response("Niet gevonden", { status: 404 });

  const res = await get(foto.pathname, { access: "private" });
  if (!res || res.statusCode !== 200 || !res.stream) {
    return new Response("Niet gevonden", { status: 404 });
  }

  const stored = foto.contentType ?? res.blob.contentType ?? "";
  const safe = SAFE_INLINE.has(stored);
  const filename = (foto.bestandsnaam ?? "foto").replace(/[\r\n"]/g, "");

  return new Response(res.stream, {
    headers: {
      "Content-Type": safe ? stored : "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      // veilige rasterformaten inline tonen; alles anders alleen als download
      "Content-Disposition": `${safe ? "inline" : "attachment"}; filename="${filename}"`,
      // private: nooit in een gedeelde/CDN-cache belanden
      "Cache-Control": "private, max-age=60",
    },
  });
}
