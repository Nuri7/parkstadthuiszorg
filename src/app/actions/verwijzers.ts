"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/adminGuard";
import { str, req, dt, flt } from "@/lib/formData";
import { pushKanalen, OPVOLG_DAGEN, DAG } from "@/lib/pipeline";
import { VerwijzerType, LeadStatus, LevertRoute, ContactSoort } from "@prisma/client";

// LET OP: dit bestand is "use server" — hier mogen UITSLUITEND async functies uit
// geëxporteerd worden. Constanten horen in @/lib/pipeline.

const ververs = (id?: string) => {
  revalidatePath("/admin/pipeline");
  revalidatePath("/admin/verwijzers");
  if (id) revalidatePath(`/admin/verwijzers/${id}`);
};

const velden = (fd: FormData) => ({
  naam: req(fd.get("naam")),
  type: (str(fd.get("type")) as VerwijzerType | null) ?? VerwijzerType.OVERIG,
  status: (str(fd.get("status")) as LeadStatus | null) ?? LeadStatus.NIEUW,
  levertRoute: (str(fd.get("levertRoute")) as LevertRoute | null) ?? LevertRoute.ONBEKEND,
  straat: str(fd.get("straat")),
  huisnummer: str(fd.get("huisnummer")),
  postcode: str(fd.get("postcode")),
  plaats: str(fd.get("plaats")),
  afstandKm: flt(fd.get("afstandKm")),
  telefoon: str(fd.get("telefoon")),
  email: str(fd.get("email")),
  website: str(fd.get("website")),
  agbCode: str(fd.get("agbCode")),
  notities: str(fd.get("notities")),
  volgendeActieOp: dt(fd.get("volgendeActieOp")),
  volgendeActie: str(fd.get("volgendeActie")),
});

// ---------- Verwijzer ----------
export async function createVerwijzer(formData: FormData) {
  await requireAdmin();
  const v = await db.verwijzer.create({
    data: { ...velden(formData), bron: "handmatig" },
  });
  ververs(v.id);
  redirect(`/admin/verwijzers/${v.id}`);
}

export async function updateVerwijzer(formData: FormData) {
  await requireAdmin();
  const id = req(formData.get("id"));
  await db.verwijzer.update({ where: { id }, data: velden(formData) });
  ververs(id);
}

export async function deleteVerwijzer(formData: FormData) {
  await requireAdmin();
  const id = req(formData.get("id"));
  await db.verwijzer.delete({ where: { id } }); // cascade: contactpersonen + activiteiten
  ververs();
  redirect("/admin/verwijzers");
}

/** Opt-out: niet meer benaderen. Zet ook de status, zodat het overal zichtbaar is. */
export async function setOptOut(formData: FormData) {
  await requireAdmin();
  const id = req(formData.get("id"));
  const uit = str(formData.get("optOut")) === "1";
  await db.verwijzer.update({
    where: { id },
    data: uit
      ? { optOut: true, optOutOp: new Date(), status: LeadStatus.UITGESCHREVEN, volgendeActieOp: null, volgendeActie: null }
      : { optOut: false, optOutOp: null, status: LeadStatus.SLAPEND },
  });
  ververs(id);
}

// ---------- Contactpersoon ----------
export async function addVerwijzerContact(formData: FormData) {
  await requireAdmin();
  const verwijzerId = req(formData.get("verwijzerId"));
  await db.verwijzerContact.create({
    data: {
      verwijzerId,
      naam: req(formData.get("naam")),
      functie: str(formData.get("functie")),
      telefoon: str(formData.get("telefoon")),
      email: str(formData.get("email")),
      notitie: str(formData.get("notitie")),
    },
  });
  ververs(verwijzerId);
}

export async function deleteVerwijzerContact(formData: FormData) {
  await requireAdmin();
  const id = req(formData.get("id"));
  const verwijzerId = req(formData.get("verwijzerId"));
  await db.verwijzerContact.delete({ where: { id } });
  ververs(verwijzerId);
}

// ---------- Logboek ----------
/** Legt contact vast én verzet meteen de volgende actie — anders verdampt opvolging. */
export async function logActiviteit(formData: FormData) {
  await requireAdmin();
  const verwijzerId = req(formData.get("verwijzerId"));
  const soort = (str(formData.get("soort")) as ContactSoort | null) ?? ContactSoort.TELEFOON;

  const v = await db.verwijzer.findUnique({ where: { id: verwijzerId } });
  if (!v) throw new Error("Verwijzer niet gevonden");
  if (v.optOut && pushKanalen.includes(soort)) {
    throw new Error("Deze verwijzer heeft zich uitgeschreven — geen e-mail, WhatsApp of post meer versturen.");
  }

  const datum = dt(formData.get("datum")) ?? new Date();
  const nieuweStatus = str(formData.get("status")) as LeadStatus | null;
  const volgendeActieOp = dt(formData.get("volgendeActieOp"));
  const volgendeActie = str(formData.get("volgendeActie"));

  await db.verwijzerActiviteit.create({
    data: {
      verwijzerId,
      soort,
      datum,
      samenvatting: req(formData.get("samenvatting")),
      resultaat: str(formData.get("resultaat")),
    },
  });

  await db.verwijzer.update({
    where: { id: verwijzerId },
    data: {
      // Alleen vooruit: een nagetypt oud gesprek mag de laatste contactdatum niet terugzetten.
      laatsteContactOp: !v.laatsteContactOp || datum > v.laatsteContactOp ? datum : v.laatsteContactOp,
      ...(nieuweStatus ? { status: nieuweStatus } : {}),
      ...(volgendeActieOp || volgendeActie ? { volgendeActieOp, volgendeActie } : {}),
    },
  });
  ververs(verwijzerId);
}

/**
 * Snelknop vanaf de pipeline of het dossier: één klik = contact vastgelegd,
 * status bijgewerkt en de volgende actie automatisch over OPVOLG_DAGEN gezet.
 */
export async function snelLog(formData: FormData) {
  await requireAdmin();
  const verwijzerId = req(formData.get("verwijzerId"));
  const soort = (str(formData.get("soort")) as ContactSoort | null) ?? ContactSoort.TELEFOON;
  const samenvatting = str(formData.get("samenvatting")) ?? "Contact gehad";
  const nieuweStatus = str(formData.get("status")) as LeadStatus | null;

  const v = await db.verwijzer.findUnique({ where: { id: verwijzerId } });
  if (!v) throw new Error("Verwijzer niet gevonden");
  if (v.optOut && pushKanalen.includes(soort)) {
    throw new Error("Deze verwijzer heeft zich uitgeschreven — geen e-mail, WhatsApp of post meer versturen.");
  }

  const nu = new Date();
  await db.verwijzerActiviteit.create({
    data: { verwijzerId, soort, datum: nu, samenvatting },
  });
  await db.verwijzer.update({
    where: { id: verwijzerId },
    data: {
      laatsteContactOp: nu,
      status: nieuweStatus ?? (v.status === LeadStatus.NIEUW ? LeadStatus.BENADERD : v.status),
      volgendeActieOp: new Date(nu.getTime() + OPVOLG_DAGEN * DAG),
      volgendeActie: "Opvolgen",
    },
  });
  ververs(verwijzerId);
}

/** "Later" op de weeklijst: actie een aantal dagen vooruit schuiven. */
export async function stelActieUit(formData: FormData) {
  await requireAdmin();
  const id = req(formData.get("id"));
  const dagen = Number(str(formData.get("dagen")) ?? 7) || 7;
  await db.verwijzer.update({
    where: { id },
    data: { volgendeActieOp: new Date(Date.now() + dagen * DAG) },
  });
  ververs(id);
}

export async function deleteActiviteit(formData: FormData) {
  await requireAdmin();
  const id = req(formData.get("id"));
  const verwijzerId = req(formData.get("verwijzerId"));
  await db.verwijzerActiviteit.delete({ where: { id } });
  ververs(verwijzerId);
}
