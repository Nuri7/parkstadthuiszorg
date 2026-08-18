"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminGuard";
import { str, req, dt } from "@/lib/formData";
import { DoelStatus, ZorgplanStatus, Prisma } from "@prisma/client";

const revalidate = (clientId: string) => revalidatePath(`/admin/clienten/${clientId}`);

// Een VERVALLEN plan is alleen-lezen historie (Wgbo). Verouderde formulier-
// inzendingen die zo'n plan willen wijzigen worden geweigerd (no-op + refresh).
async function planActief(zorgplanId: string) {
  const p = await db.zorgplan.findUnique({ where: { id: zorgplanId }, select: { status: true } });
  return p !== null && p.status !== ZorgplanStatus.VERVALLEN;
}

// ---------- Zorgplan (versie) ----------
export async function startZorgplan(formData: FormData) {
  await requireAdmin();
  const clientId = req(formData.get("clientId"));
  const bestaat = await db.zorgplan.count({ where: { clientId } });
  if (bestaat === 0) {
    try {
      await db.zorgplan.create({ data: { clientId } });
    } catch (e) {
      // Dubbele indiening: versie 1 bestaat al (unieke clientId+versie) → negeren.
      if (!(e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")) throw e;
    }
  }
  revalidate(clientId);
}

export async function updateZorgplan(formData: FormData) {
  await requireAdmin();
  const id = req(formData.get("id"));
  const clientId = req(formData.get("clientId"));
  if (!(await planActief(id))) return revalidate(clientId); // vervallen historie niet wijzigen
  await db.zorgplan.update({
    where: { id },
    data: {
      status: (str(formData.get("status")) as ZorgplanStatus | null) ?? ZorgplanStatus.CONCEPT,
      samenvatting: str(formData.get("samenvatting")),
      besprokenMetClientOp: dt(formData.get("besprokenMetClientOp")),
      besprokenMet: str(formData.get("besprokenMet")),
      evaluatiedatum: dt(formData.get("evaluatiedatum")),
    },
  });
  revalidate(clientId);
}

// Nieuwe versie: huidig plan wordt VERVALLEN (alleen-lezen historie), er komt een
// nieuwe CONCEPT-versie met de doelen gekopieerd zodat je vanaf de vorige verdergaat.
export async function nieuweZorgplanVersie(formData: FormData) {
  await requireAdmin();
  const clientId = req(formData.get("clientId"));
  const huidig = await db.zorgplan.findFirst({
    where: { clientId, status: { not: ZorgplanStatus.VERVALLEN } },
    orderBy: { versie: "desc" },
    include: { doelen: { orderBy: { createdAt: "asc" } } },
  });

  if (!huidig) {
    await db.zorgplan.create({ data: { clientId } });
    revalidate(clientId);
    return;
  }

  try {
    // Atomair: huidige versie vervalt + nieuwe versie met gekopieerde doelen.
    await db.$transaction([
      db.zorgplan.update({ where: { id: huidig.id }, data: { status: ZorgplanStatus.VERVALLEN } }),
      db.zorgplan.create({
        data: {
          clientId,
          versie: huidig.versie + 1,
          status: ZorgplanStatus.CONCEPT,
          samenvatting: huidig.samenvatting,
          doelen: {
            create: huidig.doelen.map((d) => ({
              omschrijving: d.omschrijving,
              actie: d.actie,
              status: d.status,
              streefdatum: d.streefdatum,
            })),
          },
        },
      }),
    ]);
  } catch (e) {
    // Dubbele indiening (bv. dubbelklik) → versienummer bestaat al: de eerste is al
    // gemaakt, transactie rolt terug, we verversen alleen. Andere fouten wél doorgeven.
    if (!(e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")) throw e;
  }
  revalidate(clientId);
}

// ---------- Zorgdoel ----------
export async function addZorgdoel(formData: FormData) {
  await requireAdmin();
  const zorgplanId = req(formData.get("zorgplanId"));
  const clientId = req(formData.get("clientId"));
  if (!(await planActief(zorgplanId))) return revalidate(clientId); // niet aan vervallen versie toevoegen
  await db.zorgdoel.create({
    data: {
      zorgplanId,
      omschrijving: req(formData.get("omschrijving")),
      actie: str(formData.get("actie")),
      status: (str(formData.get("status")) as DoelStatus | null) ?? DoelStatus.OPEN,
      streefdatum: dt(formData.get("streefdatum")),
    },
  });
  revalidate(clientId);
}

export async function deleteZorgdoel(formData: FormData) {
  await requireAdmin();
  const id = req(formData.get("id"));
  const clientId = req(formData.get("clientId"));
  const doel = await db.zorgdoel.findUnique({ where: { id }, select: { zorgplan: { select: { status: true } } } });
  if (doel && doel.zorgplan.status === ZorgplanStatus.VERVALLEN) return revalidate(clientId);
  await db.zorgdoel.delete({ where: { id } });
  revalidate(clientId);
}
