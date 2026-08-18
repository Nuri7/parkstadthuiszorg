import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { inputCls, labelCls } from "@/lib/adminUi";
import { careTypeLabels, forWhomLabels, aanvraagStatusLabels } from "@/lib/labels";
import { convertToClient, setAanvraagStatus } from "@/app/actions/aanvragen";

export const metadata = { title: "Aanvraag | Parkstad Thuiszorg" };

const statusBadge: Record<string, string> = {
  new: "bg-[#e6eff5] text-[#3a6a8a] dark:bg-[#0b2b3a] dark:text-[#7fb4d4]",
  contacted: "bg-[#fdf4e7] text-[#b56a00] dark:bg-[#3a2a12] dark:text-[#e0913a]",
  resolved: "bg-[#e6f2ea] text-[#4A9C6E] dark:bg-[#0b3b42] dark:text-[#5cb0bd]",
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-2.5 border-b border-[#f0ece3] dark:border-[#0b3b42] last:border-0">
      <dt className="text-sm text-[#8a9a8a]">{label}</dt>
      <dd className="sm:col-span-2 text-sm text-[#064a54] dark:text-[#e5f2f4]">{value}</dd>
    </div>
  );
}

export default async function AanvraagDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const a = await db.contactRequest.findUnique({
    where: { id },
    include: { client: { select: { id: true, voornaam: true, achternaam: true } } },
  });
  if (!a) notFound();

  const ontvangen = new Date(a.createdAt).toLocaleString("nl-NL", {
    timeZone: "Europe/Amsterdam",
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-[#5b7f63] dark:text-[#5cb0bd] hover:underline">← Aanvragen</Link>
        <h1 className="text-2xl font-heading text-[#064a54] dark:text-white mt-2 flex flex-wrap items-center gap-3">
          {a.name}
          <span className={`text-xs font-sans font-medium rounded-full px-2.5 py-1 ${statusBadge[a.status] ?? "bg-[#f0ece3] text-[#8a9a8a]"}`}>
            {aanvraagStatusLabels[a.status] ?? a.status}
          </span>
        </h1>
      </div>

      <div className="rounded-2xl border border-[#ede7db] dark:border-[#086370] bg-white dark:bg-[#243029] p-5 sm:p-6">
        <dl>
          <Row label="Naam" value={a.name} />
          <Row label="Telefoon" value={<a href={`tel:${a.phone.replace(/\s/g, "")}`} className="text-[#064a54] dark:text-[#5cb0bd] hover:underline">{a.phone}</a>} />
          <Row label="E-mail" value={a.email ? <a href={`mailto:${a.email}`} className="text-[#064a54] dark:text-[#5cb0bd] hover:underline">{a.email}</a> : null} />
          <Row label="Postcode zorglocatie" value={a.zipCode} />
          <Row label="Zorgvraag" value={a.careType ? careTypeLabels[a.careType] ?? a.careType : null} />
          <Row label="Aangevraagd voor" value={a.forWhom ? forWhomLabels[a.forWhom] ?? a.forWhom : null} />
          <Row label="Voorkeursdagen intake" value={a.preferredDays} />
          <Row label="Voorkeursdagdeel" value={a.preferredTime} />
          <Row label="Situatie" value={a.situation ? <span className="whitespace-pre-wrap">{a.situation}</span> : null} />
          <Row label="Ontvangen" value={ontvangen} />
        </dl>
      </div>

      {/* Status wijzigen */}
      <form action={setAanvraagStatus} className="mt-5 flex flex-wrap items-end gap-3">
        <input type="hidden" name="id" value={a.id} />
        <label className={labelCls}>
          Status
          <select name="status" defaultValue={a.status} className={`${inputCls} sm:w-56`}>
            <option value="new">Nieuw</option>
            <option value="contacted">Gecontacteerd</option>
            <option value="resolved">Afgerond</option>
          </select>
        </label>
        <button type="submit" className="rounded-lg border border-[#dce8de] dark:border-[#086370] px-4 py-2 text-sm text-[#064a54] dark:text-[#5cb0bd] hover:bg-[#f0f6f1] dark:hover:bg-[#0b2b30]">
          Status opslaan
        </button>
      </form>

      {/* Omzetten naar cliënt */}
      <div className="mt-6 border-t border-[#f0ece3] dark:border-[#0b3b42] pt-5">
        {a.client ? (
          <p className="text-sm text-[#4f6b6f] dark:text-[#9fc7b5]">
            Al omgezet naar cliënt:{" "}
            <Link href={`/admin/clienten/${a.client.id}`} className="font-medium text-[#064a54] dark:text-[#5cb0bd] hover:underline">
              {a.client.voornaam} {a.client.achternaam} →
            </Link>
          </p>
        ) : (
          <form action={convertToClient} className="flex flex-wrap items-center gap-3">
            <input type="hidden" name="id" value={a.id} />
            <button type="submit" className="rounded-lg bg-[#4A9C6E] text-white px-4 py-2 text-sm font-medium hover:bg-[#3d8a5f]">
              Omzetten naar cliënt
            </button>
            <span className="text-xs text-[#8a9a8a]">Maakt een cliëntdossier aan met deze gegevens en markeert de aanvraag als afgerond.</span>
          </form>
        )}
      </div>
    </div>
  );
}
