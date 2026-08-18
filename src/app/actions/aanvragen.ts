"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/adminGuard";
import { req } from "@/lib/formData";
import { careTypeLabels, forWhomLabels } from "@/lib/labels";
import { Herkomst, ClientStatus } from "@prisma/client";

export async function setAanvraagStatus(formData: FormData) {
  await requireAdmin();
  const id = req(formData.get("id"));
  const status = req(formData.get("status")) || "new";
  await db.contactRequest.update({ where: { id }, data: { status } });
  revalidatePath("/admin");
  revalidatePath(`/admin/aanvragen/${id}`);
}

// Zet een aanvraag om naar een cliëntdossier: maakt de cliënt aan (met de
// aanvraag-gegevens als context), koppelt de aanvraag eraan en markeert 'm afgerond.
export async function convertToClient(formData: FormData) {
  await requireAdmin();
  const id = req(formData.get("id"));
  const aanvraag = await db.contactRequest.findUnique({ where: { id } });
  if (!aanvraag) redirect("/admin");

  // Al eerder omgezet? Ga direct naar die cliënt (geen dubbele aanmaak).
  if (aanvraag.clientId) {
    const bestaat = await db.client.findUnique({ where: { id: aanvraag.clientId }, select: { id: true } });
    if (bestaat) redirect(`/admin/clienten/${aanvraag.clientId}`);
  }

  const parts = aanvraag.name.trim().split(/\s+/);
  const voornaam = parts[0] || aanvraag.name.trim() || "Onbekend";
  const achternaam = parts.slice(1).join(" ") || "—";

  const aandacht = [
    aanvraag.careType ? `Zorgvraag: ${careTypeLabels[aanvraag.careType] ?? aanvraag.careType}` : null,
    aanvraag.forWhom ? `Aangevraagd: ${forWhomLabels[aanvraag.forWhom] ?? aanvraag.forWhom}` : null,
    aanvraag.preferredDays || aanvraag.preferredTime
      ? `Voorkeur intake: ${[aanvraag.preferredDays, aanvraag.preferredTime].filter(Boolean).join(" · ")}`
      : null,
    aanvraag.situation ? `Situatie (uit aanvraag): ${aanvraag.situation}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const client = await db.client.create({
    data: {
      voornaam,
      achternaam,
      telefoon: aanvraag.phone,
      email: aanvraag.email,
      postcode: aanvraag.zipCode,
      status: ClientStatus.AANMELDING,
      herkomst: Herkomst.INTERN, // via de eigen website binnengekomen
      herkomstVia: "Website-aanvraag",
      aandachtspunten: aandacht || null,
    },
  });

  await db.contactRequest.update({
    where: { id },
    data: { status: "resolved", clientId: client.id },
  });

  revalidatePath("/admin");
  redirect(`/admin/clienten/${client.id}`);
}
