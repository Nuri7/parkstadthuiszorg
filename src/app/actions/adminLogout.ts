"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE } from "@/lib/adminAuth";

export async function adminLogout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/login");
}
