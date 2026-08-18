"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminGuard";
import { put, del } from "@vercel/blob";
import { str, req, dt } from "@/lib/formData";
import { ALLOWED_IMAGE_TYPES } from "@/lib/constants";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB — sluit aan op serverActions.bodySizeLimit
const ALLOWED = new Set<string>(ALLOWED_IMAGE_TYPES);

export async function addWondFoto(formData: FormData) {
  await requireAdmin();
  const wondId = req(formData.get("wondId"));
  const clientId = req(formData.get("clientId"));
  const file = formData.get("foto");

  if (!(file instanceof File) || file.size === 0) return;
  if (!ALLOWED.has(file.type)) {
    throw new Error("Alleen JPEG, PNG, WEBP, GIF of HEIC toegestaan.");
  }
  if (file.size > MAX_BYTES) throw new Error("Bestand te groot (max 8 MB).");

  // Wond moet bestaan én bij deze cliënt horen — voorkomt wees-blobs onder een
  // onbekende wondId en een verkeerde koppeling.
  const wond = await db.wond.findUnique({ where: { id: wondId }, select: { clientId: true } });
  if (!wond || wond.clientId !== clientId) throw new Error("Onbekende wond.");

  const safeName =
    (file.name || "foto").replace(/[^a-zA-Z0-9._-]/g, "_").slice(-60) || "foto";

  // access: "private" → alleen leesbaar via onze afgeschermde proxy (/api/wond-foto/[id])
  const blob = await put(`wonden/${wondId}/${safeName}`, file, {
    access: "private",
    addRandomSuffix: true,
    contentType: file.type,
  });

  try {
    await db.wondFoto.create({
      data: {
        wondId,
        pathname: blob.pathname,
        url: blob.url,
        contentType: file.type,
        bestandsnaam: str(formData.get("bestandsnaam")) ?? file.name,
        datum: dt(formData.get("datum")),
        opmerking: str(formData.get("opmerking")),
      },
    });
  } catch (e) {
    // DB-schrijffout ná upload → ruim de zojuist geüploade blob op (geen wees-blob)
    try {
      await del(blob.url);
    } catch {
      /* best effort */
    }
    throw e;
  }

  revalidatePath(`/admin/clienten/${clientId}/wond/${wondId}`);
}

export async function deleteWondFoto(formData: FormData) {
  await requireAdmin();
  const id = req(formData.get("id"));
  const wondId = req(formData.get("wondId"));
  const clientId = req(formData.get("clientId"));

  const foto = await db.wondFoto.findUnique({ where: { id } });
  if (foto) {
    try {
      await del(foto.url);
    } catch {
      // blob al weg / niet bereikbaar — DB-record toch opruimen
    }
    await db.wondFoto.delete({ where: { id } });
  }

  revalidatePath(`/admin/clienten/${clientId}/wond/${wondId}`);
}
