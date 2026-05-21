"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateRequestStatus(id: string, newStatus: string) {
  try {
    const { userId } = await auth();
    
    // Simple protection: only logged in users can update status for now
    // In the future, we can check for a specific 'admin' role in Clerk metadata
    if (!userId) {
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
