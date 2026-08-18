"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, adminToken } from "@/lib/adminAuth";

export async function updateRequestStatus(id: string, newStatus: string) {
  try {
    // Alleen een ingelogde admin (geldige wachtwoord-cookie) mag de status wijzigen
    const token = (await cookies()).get(ADMIN_COOKIE)?.value;
    if (!process.env.ADMIN_PASSWORD || token !== (await adminToken())) {
      throw new Error("Unauthorized");
    }

    await db.contactRequest.update({
      where: { id },
      data: { status: newStatus },
    });

    // Revalidate the admin page so the table updates immediately
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { success: false, error: "Database error" };
  }
}
