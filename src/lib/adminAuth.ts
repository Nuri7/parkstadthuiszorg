// Simpele wachtwoord-gate voor de testfase.
// Het wachtwoord staat ALLEEN in de ADMIN_PASSWORD env-variabele (in Vercel).
// De cookie bewaart een hash daarvan, nooit het wachtwoord zelf.

export const ADMIN_COOKIE = "pt_admin";

export async function adminToken(): Promise<string> {
  const secret = process.env.ADMIN_PASSWORD ?? "";
  const data = new TextEncoder().encode(`parkstad-admin::${secret}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
