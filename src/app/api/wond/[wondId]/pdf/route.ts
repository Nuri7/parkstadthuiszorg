import { renderToBuffer } from "@react-pdf/renderer";
import { db } from "@/lib/db";
import { isAdminAuthed } from "@/lib/adminGuard";
import { WondDocument } from "@/lib/pdf/wondDocument";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ wondId: string }> }) {
  if (!(await isAdminAuthed())) {
    return new Response("Niet ingelogd", { status: 401 });
  }

  const { wondId } = await ctx.params;
  const wond = await db.wond.findUnique({
    where: { id: wondId },
    include: {
      registraties: { orderBy: { datum: "asc" } },
      client: { select: { voornaam: true, achternaam: true, geboortedatum: true, plaats: true } },
    },
  });
  if (!wond) return new Response("Niet gevonden", { status: 404 });

  const gegenereerdOp = new Date().toLocaleDateString("nl-NL", { timeZone: "Europe/Amsterdam" });
  const datumSlug = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Amsterdam" });

  const buffer = await renderToBuffer(
    WondDocument({
      client: wond.client,
      wond,
      registraties: wond.registraties,
      gegenereerdOp,
    }),
  );

  const naam = `${wond.client.achternaam}`.replace(/[^a-zA-Z0-9-]/g, "_") || "client";
  const filename = `TIME-${naam}-${datumSlug}.pdf`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
