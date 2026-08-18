"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminGuard";
import { del } from "@vercel/blob";
import { str, req, dt, flt, intg, multi } from "@/lib/formData";
import { WondDoel, WondStatus } from "@prisma/client";

// ---------- Wond (incl. volledige ALTIS-anamnese) ----------
export async function addWond(formData: FormData) {
  await requireAdmin();
  const clientId = req(formData.get("clientId"));
  await db.wond.create({
    data: {
      clientId,
      locatie: req(formData.get("locatie")),
      soort: str(formData.get("soort")),
      doel: (str(formData.get("doel")) as WondDoel | null) ?? WondDoel.GENEZING,
    },
  });
  revalidatePath(`/admin/clienten/${clientId}`);
}

export async function deleteWond(formData: FormData) {
  await requireAdmin();
  const id = req(formData.get("id"));
  const clientId = req(formData.get("clientId"));
  // Foto-blobs ophalen vóór de cascade, daarna best-effort opruimen (geen wees-bestanden)
  const fotos = await db.wondFoto.findMany({ where: { wondId: id }, select: { url: true } });
  await db.wond.delete({ where: { id } });
  await Promise.allSettled(fotos.map((f) => del(f.url)));
  revalidatePath(`/admin/clienten/${clientId}`);
}

export async function updateWond(formData: FormData) {
  await requireAdmin();
  const id = req(formData.get("id"));
  const clientId = req(formData.get("clientId"));
  await db.wond.update({
    where: { id },
    data: {
      locatie: req(formData.get("locatie")),
      soort: str(formData.get("soort")),
      ontstaanswijze: str(formData.get("ontstaanswijze")),
      startdatum: dt(formData.get("startdatum")),
      doel: (str(formData.get("doel")) as WondDoel | null) ?? WondDoel.GENEZING,
      status: (str(formData.get("status")) as WondStatus | null) ?? WondStatus.ACTIEF,
      klachten: multi(formData, "klachten"),
      lokalisatieZijde: str(formData.get("lokalisatieZijde")),
      aantalWonden: str(formData.get("aantalWonden")),
      tijdDuur: str(formData.get("tijdDuur")),
      tijdBeloop: str(formData.get("tijdBeloop")),
      eerdereBehandeling: str(formData.get("eerdereBehandeling")),
      pijnRust: intg(formData.get("pijnRust")),
      pijnVerzorging: intg(formData.get("pijnVerzorging")),
      pijnNacht: intg(formData.get("pijnNacht")),
      impact: multi(formData, "impact"),
      comorbiditeit: multi(formData, "comorbiditeit"),
      medicatieInvloed: multi(formData, "medicatieInvloed"),
      allergieen: str(formData.get("allergieen")),
      voeding: str(formData.get("voeding")),
      leefstijl: str(formData.get("leefstijl")),
      socialeContext: str(formData.get("socialeContext")),
      watVerergert: str(formData.get("watVerergert")),
      watVerzacht: str(formData.get("watVerzacht")),
      doelVerwachting: str(formData.get("doelVerwachting")),
    },
  });
  revalidatePath(`/admin/clienten/${clientId}/wond/${id}`);
}

// ---------- TIME-registratie (volledig) ----------
export async function addTime(formData: FormData) {
  await requireAdmin();
  const wondId = req(formData.get("wondId"));
  const clientId = req(formData.get("clientId"));
  await db.timeRegistratie.create({
    data: {
      wondId,
      datum: dt(formData.get("datum")) ?? new Date(),
      afmetingL: flt(formData.get("afmetingL")),
      afmetingB: flt(formData.get("afmetingB")),
      afmetingD: flt(formData.get("afmetingD")),
      tissueRood: intg(formData.get("tissueRood")),
      tissueGeel: intg(formData.get("tissueGeel")),
      tissueZwart: intg(formData.get("tissueZwart")),
      debridement: str(formData.get("debridement")),
      infectietekenen: multi(formData, "infectietekenen"),
      infectieActie: str(formData.get("infectieActie")),
      exsudaat: str(formData.get("exsudaat")),
      exsudaatKleur: str(formData.get("exsudaatKleur")),
      wondrand: str(formData.get("wondrand")),
      omliggendeHuid: str(formData.get("omliggendeHuid")),
      pijnNRS: intg(formData.get("pijnNRS")),
      verband: str(formData.get("verband")),
      opmerking: str(formData.get("opmerking")),
    },
  });
  revalidatePath(`/admin/clienten/${clientId}/wond/${wondId}`);
}

export async function deleteTime(formData: FormData) {
  await requireAdmin();
  const id = req(formData.get("id"));
  const wondId = req(formData.get("wondId"));
  const clientId = req(formData.get("clientId"));
  await db.timeRegistratie.delete({ where: { id } });
  revalidatePath(`/admin/clienten/${clientId}/wond/${wondId}`);
}
