import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, adminToken } from "@/lib/adminAuth";

export async function isAdminAuthed(): Promise<boolean> {
  if (!process.env.ADMIN_PASSWORD) return false;
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return token === (await adminToken());
}

/** Gebruik in server-pagina's en -actions: stuurt door naar /login als niet ingelogd. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthed())) {
    redirect("/login");
  }
}
