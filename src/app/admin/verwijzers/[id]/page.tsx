import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { Tabs } from "@/components/admin/Tabs";
import { VerwijzerVelden } from "@/components/admin/VerwijzerVelden";
import {
  updateVerwijzer,
  deleteVerwijzer,
  addVerwijzerContact,
  deleteVerwijzerContact,
  logActiviteit,
  deleteActiviteit,
  setOptOut,
  snelLog,
} from "@/app/actions/verwijzers";
import { inputCls, labelCls, addBtn, delBtn, badge, leadStatusBadge } from "@/lib/adminUi";
import { nl } from "@/lib/format";
import {
  verwijzerTypeLabels,
  leadStatusKort,
  leadStatusLabels,
  levertRouteLabels,
  contactSoortLabels,
  clientStatusLabels,
} from "@/lib/labels";
import { berekenScore, redenVoorActie, heeftOpenActie, type PipelineVerwijzer } from "@/lib/pipeline";

const snelKnop = "rounded-lg border border-[#dce8de] dark:border-[#086370] px-3 py-2 text-sm text-[#064a54] dark:text-[#9fc7b5] hover:bg-[#f0f6f1] dark:hover:bg-[#0b2b30] transition-colors";

export default async function VerwijzerDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const v = await db.verwijzer.findUnique({
    where: { id },
    include: {
      contactpersonen: { orderBy: { createdAt: "asc" } },
      activiteiten: { orderBy: { datum: "desc" } },
      clienten: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!v) notFound();

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const p: PipelineVerwijzer = { ...v, aantalClienten: v.clienten.length };
  const open = heeftOpenActie(p, now);

  const gegevens = (
    // key op updatedAt: remount na opslaan, anders resetten de <select>-velden
    // (type, status, levertRoute) visueel naar leeg — bekende gotcha in dit project.
    <form key={v.updatedAt.getTime()} action={updateVerwijzer} className="space-y-5">
      <input type="hidden" name="id" value={v.id} />
      <VerwijzerVelden v={v} />
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="rounded-lg bg-[#064a54] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#053a42]">
          Opslaan
        </button>
        <span className="text-xs text-[#8a9a8a]">
          Bron: {v.bron ?? "handmatig"} · aangemaakt {nl(v.createdAt)}
        </span>
      </div>
    </form>
  );

  const logboek = (
    <div>
      {v.activiteiten.length > 0 ? (
        <ul className="space-y-2 mb-5">
          {v.activiteiten.map((a) => (
            <li key={a.id} className="flex items-start justify-between gap-3 text-sm border border-[#f0ece3] dark:border-[#0b3b42] rounded-lg px-3 py-2">
              <span className="text-[#064a54] dark:text-[#e5f2f4]">
                <strong>{nl(a.datum)}</strong> · {contactSoortLabels[a.soort] ?? a.soort} · {a.samenvatting}
                {a.resultaat ? (
                  <span className="block text-[#4f6b6f] dark:text-[#9fc7b5] mt-1">{a.resultaat}</span>
                ) : null}
              </span>
              <form action={deleteActiviteit}>
                <input type="hidden" name="id" value={a.id} />
                <input type="hidden" name="verwijzerId" value={v.id} />
                <button type="submit" className={delBtn}>Verwijderen</button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[#8a9a8a] mb-5">Nog niets vastgelegd. Gebruik de snelknoppen hierboven of het formulier.</p>
      )}

      <form action={logActiviteit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end border-t border-[#f0ece3] dark:border-[#0b3b42] pt-4">
        <input type="hidden" name="verwijzerId" value={v.id} />
        <label className={labelCls}>
          Soort
          <select name="soort" defaultValue="TELEFOON" className={inputCls}>
            {Object.entries(contactSoortLabels).map(([w, l]) => (
              <option key={w} value={w}>{l}</option>
            ))}
          </select>
        </label>
        <label className={labelCls}>Datum<input type="date" name="datum" required defaultValue={today} className={inputCls} /></label>
        <label className={labelCls}>
          Status na dit contact
          <select name="status" defaultValue={v.status} className={inputCls}>
            {Object.entries(leadStatusLabels).map(([w, l]) => (
              <option key={w} value={w}>{l}</option>
            ))}
          </select>
        </label>
        <label className={`${labelCls} sm:col-span-3`}>
          Wat is er gebeurd? *
          <input name="samenvatting" required placeholder="bijv. assistente gesproken, folders afgegeven" className={inputCls} />
        </label>
        <label className={`${labelCls} sm:col-span-3`}>
          Resultaat / afspraak
          <textarea name="resultaat" rows={2} className={inputCls} />
        </label>
        <label className={labelCls}>Volgende actie op<input type="date" name="volgendeActieOp" className={inputCls} /></label>
        <label className={`${labelCls} sm:col-span-2`}>Volgende actie<input name="volgendeActie" placeholder="bijv. terugbellen na vakantie" className={inputCls} /></label>
        <div className="sm:col-span-3">
          <button type="submit" className={addBtn}>+ Contact vastleggen</button>
        </div>
      </form>
    </div>
  );

  const contactpersonen = (
    <div>
      {v.contactpersonen.length > 0 ? (
        <ul className="space-y-2 mb-5">
          {v.contactpersonen.map((c) => (
            <li key={c.id} className="flex items-start justify-between gap-3 text-sm border border-[#f0ece3] dark:border-[#0b3b42] rounded-lg px-3 py-2">
              <span className="text-[#064a54] dark:text-[#e5f2f4]">
                <strong>{c.naam}</strong>
                {c.functie ? ` · ${c.functie}` : ""}
                {c.telefoon ? ` · ${c.telefoon}` : ""}
                {c.email ? ` · ${c.email}` : ""}
                {c.notitie ? <span className="block text-[#4f6b6f] dark:text-[#9fc7b5] mt-1">{c.notitie}</span> : null}
              </span>
              <form action={deleteVerwijzerContact}>
                <input type="hidden" name="id" value={c.id} />
                <input type="hidden" name="verwijzerId" value={v.id} />
                <button type="submit" className={delBtn}>Verwijderen</button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[#8a9a8a] mb-5">
          Nog geen contactpersonen. De praktijkassistente is meestal de poortwachter — noteer haar naam.
        </p>
      )}

      <form action={addVerwijzerContact} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end border-t border-[#f0ece3] dark:border-[#0b3b42] pt-4">
        <input type="hidden" name="verwijzerId" value={v.id} />
        <label className={labelCls}>Naam *<input name="naam" required className={inputCls} /></label>
        <label className={labelCls}>Functie<input name="functie" placeholder="praktijkassistente" className={inputCls} /></label>
        <label className={labelCls}>Telefoon<input name="telefoon" className={inputCls} /></label>
        <label className={labelCls}>E-mail<input type="email" name="email" className={inputCls} /></label>
        <label className={`${labelCls} sm:col-span-2`}>Notitie<input name="notitie" className={inputCls} /></label>
        <div className="sm:col-span-3">
          <button type="submit" className={addBtn}>+ Contactpersoon toevoegen</button>
        </div>
      </form>
    </div>
  );

  const clienten = (
    <div>
      <p className="text-sm text-[#4f6b6f] dark:text-[#9fc7b5] mb-4">
        Cliënten die via deze verwijzer binnenkwamen. Koppelen doe je op het cliëntscherm, bij <em>Herkomst</em>.
      </p>
      {v.clienten.length > 0 ? (
        <ul className="space-y-2">
          {v.clienten.map((c) => (
            <li key={c.id} className="text-sm border border-[#f0ece3] dark:border-[#0b3b42] rounded-lg px-3 py-2">
              <Link href={`/admin/clienten/${c.id}`} className="font-medium text-[#064a54] dark:text-[#5cb0bd] hover:underline">
                {c.voornaam} {c.achternaam}
              </Link>
              <span className="text-[#4f6b6f] dark:text-[#9fc7b5]">
                {" "}· {clientStatusLabels[c.status] ?? c.status} · aangemeld {nl(c.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[#8a9a8a]">Nog geen cliënten via deze verwijzer.</p>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <Link href="/admin/verwijzers" className="text-sm text-[#5b7f63] dark:text-[#5cb0bd] hover:underline">← Verwijzers</Link>
          <h1 className="text-2xl font-heading text-[#064a54] dark:text-white mt-2 flex flex-wrap items-center gap-3">
            {v.naam}
            <span className={`${badge} font-sans ${leadStatusBadge[v.status] ?? ""}`}>{leadStatusKort[v.status] ?? v.status}</span>
          </h1>
          <p className="text-sm text-[#4f6b6f] dark:text-[#9fc7b5] mt-1">
            {verwijzerTypeLabels[v.type] ?? v.type}
            {v.plaats ? ` · ${v.plaats}` : ""}
            {v.telefoon ? ` · ${v.telefoon}` : ""}
            {` · levert ${levertRouteLabels[v.levertRoute] ?? v.levertRoute}`}
            {` · score ${berekenScore(p, now)}`}
          </p>
        </div>
        <form action={deleteVerwijzer}>
          <input type="hidden" name="id" value={v.id} />
          <button type="submit" className="text-sm text-red-600 hover:underline border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
            Verwijderen
          </button>
        </form>
      </div>

      {v.optOut ? (
        <div className="rounded-xl border border-red-200 dark:border-red-900 bg-[#fdeaea] dark:bg-[#3a1414] px-4 py-3 mb-6 text-sm text-[#b02525] dark:text-[#f0a3a3] flex items-center justify-between gap-3">
          <span>Uitgeschreven op {nl(v.optOutOp)} — niet benaderen via e-mail, WhatsApp of post.</span>
          <form action={setOptOut}>
            <input type="hidden" name="id" value={v.id} />
            <input type="hidden" name="optOut" value="0" />
            <button type="submit" className="underline whitespace-nowrap">Opt-out opheffen</button>
          </form>
        </div>
      ) : (
        <div className="rounded-xl border border-[#ede7db] dark:border-[#086370] bg-white dark:bg-[#243029] px-4 py-3 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-[#4f6b6f] dark:text-[#9fc7b5] mr-1">
              {open ? redenVoorActie(p, now) : v.volgendeActieOp ? `Volgende actie ${nl(v.volgendeActieOp)}` : "Geen actie gepland"}
            </span>
            <form action={snelLog}>
              <input type="hidden" name="verwijzerId" value={v.id} />
              <input type="hidden" name="soort" value="TELEFOON" />
              <input type="hidden" name="samenvatting" value="Gebeld" />
              <button type="submit" className={snelKnop}>Gebeld</button>
            </form>
            <form action={snelLog}>
              <input type="hidden" name="verwijzerId" value={v.id} />
              <input type="hidden" name="soort" value="BEZOEK" />
              <input type="hidden" name="samenvatting" value="Langs geweest" />
              <input type="hidden" name="status" value="GESPROKEN" />
              <button type="submit" className={snelKnop}>Bezocht</button>
            </form>
            <form action={snelLog}>
              <input type="hidden" name="verwijzerId" value={v.id} />
              <input type="hidden" name="soort" value="BEZOEK" />
              <input type="hidden" name="samenvatting" value="Folders en visitekaartjes afgegeven" />
              <input type="hidden" name="status" value="MATERIAAL" />
              <button type="submit" className={snelKnop}>Folder gebracht</button>
            </form>
            <form action={setOptOut} className="ml-auto">
              <input type="hidden" name="id" value={v.id} />
              <input type="hidden" name="optOut" value="1" />
              <button type="submit" className="text-xs text-[#8a9a8a] hover:underline">Wil niet benaderd worden</button>
            </form>
          </div>
          <p className="text-xs text-[#8a9a8a] mt-2">
            Een snelknop legt het contact vast en zet de opvolging automatisch 21 dagen vooruit.
          </p>
        </div>
      )}

      <Tabs
        tabs={[
          { label: `Logboek (${v.activiteiten.length})`, content: logboek },
          { label: "Gegevens", content: gegevens },
          { label: `Contactpersonen (${v.contactpersonen.length})`, content: contactpersonen },
          { label: `Cliënten (${v.clienten.length})`, content: clienten },
        ]}
      />
    </div>
  );
}
