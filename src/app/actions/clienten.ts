"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/adminGuard";
import { del } from "@vercel/blob";
import { str, req, dt, flt, intg, dtTijd } from "@/lib/formData";
import { Wet, Financieringsvorm, ClientStatus, BezoekStatus, Herkomst, BudgetBasis } from "@prisma/client";

// ---------- Cliënt ----------
export async function createClient(formData: FormData) {
  await requireAdmin();
  const c = await db.client.create({
    data: {
      voornaam: req(formData.get("voornaam")),
      achternaam: req(formData.get("achternaam")),
      status: (str(formData.get("status")) as ClientStatus | null) ?? ClientStatus.AANMELDING,
      geboortedatum: dt(formData.get("geboortedatum")),
      bsn: str(formData.get("bsn")),
      geslacht: str(formData.get("geslacht")),
      straat: str(formData.get("straat")),
      huisnummer: str(formData.get("huisnummer")),
      postcode: str(formData.get("postcode")),
      plaats: str(formData.get("plaats")),
      telefoon: str(formData.get("telefoon")),
      email: str(formData.get("email")),
      huisarts: str(formData.get("huisarts")),
      apotheek: str(formData.get("apotheek")),
      zorgverzekeraar: str(formData.get("zorgverzekeraar")),
      polisnummer: str(formData.get("polisnummer")),
      budgethouder: str(formData.get("budgethouder")),
      herkomst: str(formData.get("herkomst")) as Herkomst | null,
      herkomstVia: str(formData.get("herkomstVia")),
      verwijzerId: str(formData.get("verwijzerId")),
      aandachtspunten: str(formData.get("aandachtspunten")),
    },
  });
  redirect(`/admin/clienten/${c.id}`);
}

export async function updateClient(formData: FormData) {
  await requireAdmin();
  const id = req(formData.get("id"));
  await db.client.update({
    where: { id },
    data: {
      voornaam: req(formData.get("voornaam")),
      achternaam: req(formData.get("achternaam")),
      status: (str(formData.get("status")) as ClientStatus | null) ?? ClientStatus.AANMELDING,
      geboortedatum: dt(formData.get("geboortedatum")),
      bsn: str(formData.get("bsn")),
      geslacht: str(formData.get("geslacht")),
      straat: str(formData.get("straat")),
      huisnummer: str(formData.get("huisnummer")),
      postcode: str(formData.get("postcode")),
      plaats: str(formData.get("plaats")),
      telefoon: str(formData.get("telefoon")),
      email: str(formData.get("email")),
      huisarts: str(formData.get("huisarts")),
      apotheek: str(formData.get("apotheek")),
      zorgverzekeraar: str(formData.get("zorgverzekeraar")),
      polisnummer: str(formData.get("polisnummer")),
      budgethouder: str(formData.get("budgethouder")),
      herkomst: str(formData.get("herkomst")) as Herkomst | null,
      herkomstVia: str(formData.get("herkomstVia")),
      verwijzerId: str(formData.get("verwijzerId")),
      aandachtspunten: str(formData.get("aandachtspunten")),
    },
  });
  revalidatePath(`/admin/clienten/${id}`);
}

export async function deleteClient(formData: FormData) {
  await requireAdmin();
  const id = req(formData.get("id"));
  // Wondfoto-blobs ophalen vóór de cascade; daarna opruimen (best effort) zodat er
  // geen wees-bestanden in de opslag achterblijven.
  const fotos = await db.wondFoto.findMany({ where: { wond: { clientId: id } }, select: { url: true } });
  await db.client.delete({ where: { id } }); // cascade verwijdert financieringen + bezoeken + wonden + fotorecords
  await Promise.allSettled(fotos.map((f) => del(f.url)));
  redirect("/admin/clienten");
}

// ---------- Financiering ----------
export async function addFinanciering(formData: FormData) {
  await requireAdmin();
  const clientId = req(formData.get("clientId"));
  await db.financiering.create({
    data: {
      clientId,
      wet: str(formData.get("wet")) as Wet,
      vorm: str(formData.get("vorm")) as Financieringsvorm,
      verstrekker: str(formData.get("verstrekker")),
      beschikkingsnummer: str(formData.get("beschikkingsnummer")),
      budgetBasis: (str(formData.get("budgetBasis")) as BudgetBasis | null) ?? BudgetBasis.PER_WEEK_UREN,
      urenPerWeek: flt(formData.get("urenPerWeek")),
      tarief: flt(formData.get("tarief")),
      totaalBudget: flt(formData.get("totaalBudget")),
      fase: str(formData.get("fase")),
      geldigVan: dt(formData.get("geldigVan")),
      geldigTot: dt(formData.get("geldigTot")),
    },
  });
  revalidatePath(`/admin/clienten/${clientId}`);
}

export async function deleteFinanciering(formData: FormData) {
  await requireAdmin();
  const id = req(formData.get("id"));
  const clientId = req(formData.get("clientId"));
  await db.financiering.delete({ where: { id } });
  revalidatePath(`/admin/clienten/${clientId}`);
}

// ---------- Bezoek ----------
export async function addBezoek(formData: FormData) {
  await requireAdmin();
  const clientId = req(formData.get("clientId"));
  await db.bezoek.create({
    data: {
      clientId,
      datum: dtTijd(formData.get("datum"), formData.get("tijd")),
      duurMinuten: intg(formData.get("duurMinuten")),
      zorgverlener: str(formData.get("zorgverlener")),
      typeZorg: str(formData.get("typeZorg")),
      rapportage: str(formData.get("rapportage")),
      status: (str(formData.get("status")) as BezoekStatus | null) ?? BezoekStatus.UITGEVOERD,
      declarabel: formData.get("declarabel") != null,
    },
  });
  revalidatePath(`/admin/clienten/${clientId}`);
  revalidatePath("/admin/agenda");
}

export async function setBezoekStatus(formData: FormData) {
  await requireAdmin();
  const id = req(formData.get("id"));
  const clientId = req(formData.get("clientId"));
  const status = (str(formData.get("status")) as BezoekStatus | null) ?? BezoekStatus.UITGEVOERD;
  await db.bezoek.update({ where: { id }, data: { status } });
  revalidatePath(`/admin/clienten/${clientId}`);
  revalidatePath("/admin/agenda");
}

export async function deleteBezoek(formData: FormData) {
  await requireAdmin();
  const id = req(formData.get("id"));
  const clientId = req(formData.get("clientId"));
  await db.bezoek.delete({ where: { id } });
  revalidatePath(`/admin/clienten/${clientId}`);
  revalidatePath("/admin/agenda");
}

// ---------- Contactpersoon ----------
export async function addContactpersoon(formData: FormData) {
  await requireAdmin();
  const clientId = req(formData.get("clientId"));
  await db.contactpersoon.create({
    data: {
      clientId,
      naam: req(formData.get("naam")),
      relatie: str(formData.get("relatie")),
      telefoon: str(formData.get("telefoon")),
      email: str(formData.get("email")),
      isBudgethouder: formData.get("isBudgethouder") != null,
      isWettelijkVertegenwoordiger: formData.get("isWettelijkVertegenwoordiger") != null,
    },
  });
  revalidatePath(`/admin/clienten/${clientId}`);
}

export async function deleteContactpersoon(formData: FormData) {
  await requireAdmin();
  const id = req(formData.get("id"));
  const clientId = req(formData.get("clientId"));
  await db.contactpersoon.delete({ where: { id } });
  revalidatePath(`/admin/clienten/${clientId}`);
}

// ---------- Medicatie ----------
export async function addMedicatie(formData: FormData) {
  await requireAdmin();
  const clientId = req(formData.get("clientId"));
  await db.medicatie.create({
    data: {
      clientId,
      naam: req(formData.get("naam")),
      dosering: str(formData.get("dosering")),
      frequentie: str(formData.get("frequentie")),
      sinds: dt(formData.get("sinds")),
      opmerking: str(formData.get("opmerking")),
    },
  });
  revalidatePath(`/admin/clienten/${clientId}`);
}

export async function deleteMedicatie(formData: FormData) {
  await requireAdmin();
  const id = req(formData.get("id"));
  const clientId = req(formData.get("clientId"));
  await db.medicatie.delete({ where: { id } });
  revalidatePath(`/admin/clienten/${clientId}`);
}
// Zorgdoel-acties zijn verhuisd naar actions/zorgplan.ts (doelen horen nu bij een zorgplanversie).
