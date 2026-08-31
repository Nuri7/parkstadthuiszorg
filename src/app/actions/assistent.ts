"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminGuard";
import { req } from "@/lib/formData";

export async function nieuwGesprek() {
  await requireAdmin();
  const g = await db.assistentGesprek.create({ data: {} });
  redirect(`/admin/assistent?g=${g.id}`);
}

export async function verwijderGesprek(formData: FormData) {
  await requireAdmin();
  const id = req(formData.get("id"));
  // Alleen de chat verdwijnt; het auditspoor (AssistentActie) blijft staan —
  // wijzigingen in het dossier moeten herleidbaar blijven.
  await db.assistentGesprek.delete({ where: { id } });
  revalidatePath("/admin/assistent");
  redirect("/admin/assistent");
}
