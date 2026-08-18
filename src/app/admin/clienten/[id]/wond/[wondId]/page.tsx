import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { Tabs } from "@/components/admin/Tabs";
import { updateWond, addTime, deleteTime } from "@/app/actions/wonden";
import { deleteWondFoto } from "@/app/actions/wondfotos";
import { WondFotoUpload } from "@/components/admin/WondFotoUpload";
import { DeelPdfKnop } from "@/components/admin/DeelPdfKnop";
import { inputCls, labelCls, addBtn, subHead } from "@/lib/adminUi";
import { nl, isoDay, dim } from "@/lib/format";

const has = (s: string | null | undefined, v: string) => (s ?? "").split(",").map((x) => x.trim()).includes(v);

const KLACHTEN = ["Pijn", "Jeuk", "Geur", "Lekkage/vocht", "Bloeding", "Zwelling", "Bewegingsbeperking"];
const IMPACT = ["Slaap", "Mobiliteit", "Zelfzorg", "Stemming/sociaal", "Werk"];
const COMORBIDITEIT = ["Diabetes mellitus", "Veneuze insufficiëntie", "Arterieel vaatlijden", "Hartfalen/oedeem", "Immobiliteit", "Neuropathie", "Reuma/auto-immuun", "Oncologie"];
const MEDICATIE = ["Antistolling", "Corticosteroïden", "Immunosuppressiva", "Chemo/bestraling"];
const INFECTIETEKENEN = ["Roodheid", "Warmte", "Zwelling", "Pus", "Toenemende pijn", "Koorts", "Geur"];

function Cb({ name, value, label, defaultChecked }: { name: string; value: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-1.5 text-sm text-[#4f6b6f] dark:text-[#9fc7b5]">
      <input type="checkbox" name={name} value={value} defaultChecked={defaultChecked} /> {label}
    </label>
  );
}

function CbGroup({ label, name, options, selected }: { label: string; name: string; options: string[]; selected: string | null }) {
  return (
    <div>
      <span className={labelCls}>{label}</span>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
        {options.map((o) => <Cb key={o} name={name} value={o} label={o} defaultChecked={has(selected, o)} />)}
      </div>
    </div>
  );
}

export default async function WondDetail({ params }: { params: Promise<{ id: string; wondId: string }> }) {
  await requireAdmin();
  const { id, wondId } = await params;
  const wond = await db.wond.findUnique({
    where: { id: wondId },
    include: {
      registraties: { orderBy: { datum: "desc" } },
      fotos: { orderBy: [{ datum: "desc" }, { createdAt: "desc" }] },
      client: true,
    },
  });
  if (!wond || wond.clientId !== id) notFound();

  const today = new Date().toISOString().slice(0, 10);

  const anamnese = (
    // key op updatedAt: na opslaan remount het formulier zodat uncontrolled
    // <select>-velden hun opgeslagen waarde uit de database blijven tonen
    // (anders resetten ze visueel naar leeg en wist een tweede save ze).
    <form key={wond.updatedAt.getTime()} action={updateWond} className="space-y-5">
      <input type="hidden" name="id" value={wond.id} />
      <input type="hidden" name="clientId" value={id} />

      <h3 className={subHead + " border-t-0 pt-0"}>A — Aard</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className={labelCls}>Soort wond<input name="soort" defaultValue={wond.soort ?? ""} placeholder="decubitus, ulcus cruris, diabetische voet…" className={inputCls} /></label>
        <label className={labelCls}>Ontstaanswijze
          <select name="ontstaanswijze" defaultValue={wond.ontstaanswijze ?? ""} className={inputCls}>
            <option value="">—</option><option>Spontaan</option><option>Door druk/schuifkracht</option><option>Trauma/ongeval</option><option>Na operatie</option><option>Onbekend</option>
          </select>
        </label>
      </div>
      <CbGroup label="Klachten" name="klachten" options={KLACHTEN} selected={wond.klachten} />

      <h3 className={subHead}>L — Lokalisatie</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className={labelCls}>Locatie *<input name="locatie" required defaultValue={wond.locatie} className={inputCls} /></label>
        <label className={labelCls}>Zijde
          <select name="lokalisatieZijde" defaultValue={wond.lokalisatieZijde ?? ""} className={inputCls}><option value="">—</option><option>links</option><option>rechts</option><option>n.v.t.</option></select>
        </label>
        <label className={labelCls}>Aantal wonden<input name="aantalWonden" defaultValue={wond.aantalWonden ?? ""} className={inputCls} /></label>
      </div>

      <h3 className={subHead}>T — Tijd en tijdsbeloop</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className={labelCls}>Bestaat sinds<input type="date" name="startdatum" defaultValue={isoDay(wond.startdatum)} className={inputCls} /></label>
        <label className={labelCls}>Duur
          <select name="tijdDuur" defaultValue={wond.tijdDuur ?? ""} className={inputCls}><option value="">—</option><option>Acuut (&lt; 2–4 wk)</option><option>Chronisch (≥ 4–6 wk)</option></select>
        </label>
        <label className={labelCls}>Beloop
          <select name="tijdBeloop" defaultValue={wond.tijdBeloop ?? ""} className={inputCls}><option value="">—</option><option>Verbetert</option><option>Stabiel</option><option>Verslechtert</option><option>Wisselend</option></select>
        </label>
        <label className={`${labelCls} sm:col-span-3`}>Eerdere/huidige behandeling<input name="eerdereBehandeling" defaultValue={wond.eerdereBehandeling ?? ""} className={inputCls} /></label>
      </div>

      <h3 className={subHead}>I — Intensiteit / ernst</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <label className={labelCls}>Pijn in rust (0–10)<input type="number" min="0" max="10" name="pijnRust" defaultValue={wond.pijnRust ?? ""} className={inputCls} /></label>
        <label className={labelCls}>Pijn bij verzorging<input type="number" min="0" max="10" name="pijnVerzorging" defaultValue={wond.pijnVerzorging ?? ""} className={inputCls} /></label>
        <label className={labelCls}>Pijn &apos;s nachts<input type="number" min="0" max="10" name="pijnNacht" defaultValue={wond.pijnNacht ?? ""} className={inputCls} /></label>
      </div>
      <CbGroup label="Impact op dagelijks leven" name="impact" options={IMPACT} selected={wond.impact} />

      <h3 className={subHead}>S — Samenhang</h3>
      <CbGroup label="Comorbiditeit" name="comorbiditeit" options={COMORBIDITEIT} selected={wond.comorbiditeit} />
      <CbGroup label="Medicatie van invloed op wondgenezing" name="medicatieInvloed" options={MEDICATIE} selected={wond.medicatieInvloed} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className={labelCls}>Allergieën<input name="allergieen" defaultValue={wond.allergieen ?? ""} placeholder="pleister, jodium, zilver, latex…" className={inputCls} /></label>
        <label className={labelCls}>Voeding
          <select name="voeding" defaultValue={wond.voeding ?? ""} className={inputCls}><option value="">—</option><option>goed</option><option>risico op ondervoeding</option><option>ondervoed</option></select>
        </label>
        <label className={labelCls}>Leefstijl (roken/alcohol/beweging)<input name="leefstijl" defaultValue={wond.leefstijl ?? ""} className={inputCls} /></label>
        <label className={labelCls}>Sociale context / mantelzorg<input name="socialeContext" defaultValue={wond.socialeContext ?? ""} className={inputCls} /></label>
        <label className={labelCls}>Wat verergert<input name="watVerergert" defaultValue={wond.watVerergert ?? ""} className={inputCls} /></label>
        <label className={labelCls}>Wat verzacht<input name="watVerzacht" defaultValue={wond.watVerzacht ?? ""} className={inputCls} /></label>
        <label className={`${labelCls} sm:col-span-2`}>Doel/verwachting van de cliënt<input name="doelVerwachting" defaultValue={wond.doelVerwachting ?? ""} className={inputCls} /></label>
      </div>

      <h3 className={subHead}>Behandeldoel</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className={labelCls}>Doel<select name="doel" defaultValue={wond.doel} className={inputCls}><option value="GENEZING">Genezing</option><option value="STABILISEREN">Stabiliseren</option><option value="PALLIATIEF">Palliatief</option></select></label>
        <label className={labelCls}>Status wond<select name="status" defaultValue={wond.status} className={inputCls}><option value="ACTIEF">Actief</option><option value="GENEZEN">Genezen</option><option value="GESTOPT">Gestopt</option></select></label>
      </div>

      <button type="submit" className="rounded-lg bg-[#064a54] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#053a42]">Anamnese opslaan</button>
    </form>
  );

  const time = (
    <div className="space-y-6">
      <p className="text-xs text-[#8a9a8a]">Per meting: <strong>T</strong>issue · <strong>I</strong>nfection · <strong>M</strong>oisture · <strong>E</strong>dge. Nieuwste bovenaan.</p>

      {wond.registraties.length > 0 ? (
        <ul className="space-y-3">
          {wond.registraties.map((r) => (
            <li key={r.id} className="border border-[#f0ece3] dark:border-[#0b3b42] rounded-xl p-4 text-sm">
              <div className="flex items-center justify-between mb-2">
                <strong className="text-[#064a54] dark:text-white">{nl(r.datum)}</strong>
                <form action={deleteTime}><input type="hidden" name="id" value={r.id} /><input type="hidden" name="wondId" value={wond.id} /><input type="hidden" name="clientId" value={id} /><button type="submit" className="text-red-600 hover:underline text-xs">Verwijderen</button></form>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-[#4f6b6f] dark:text-[#9fc7b5]">
                {dim(r.afmetingL, r.afmetingB, r.afmetingD) ? <span><b>Afmeting:</b> {dim(r.afmetingL, r.afmetingB, r.afmetingD)}</span> : null}
                {[r.tissueRood, r.tissueGeel, r.tissueZwart].some((x) => x != null) ? <span><b>T (R/G/Z):</b> {r.tissueRood ?? 0}/{r.tissueGeel ?? 0}/{r.tissueZwart ?? 0}%</span> : null}
                {r.debridement ? <span><b>Debridement:</b> {r.debridement}</span> : null}
                {r.infectietekenen ? <span><b>Infectie:</b> {r.infectietekenen}</span> : null}
                {r.infectieActie ? <span><b>Actie:</b> {r.infectieActie}</span> : null}
                {r.exsudaat ? <span><b>Exsudaat:</b> {r.exsudaat}{r.exsudaatKleur ? ` (${r.exsudaatKleur})` : ""}</span> : null}
                {r.wondrand ? <span><b>Wondrand:</b> {r.wondrand}</span> : null}
                {r.omliggendeHuid ? <span><b>Huid:</b> {r.omliggendeHuid}</span> : null}
                {r.pijnNRS != null ? <span><b>Pijn:</b> {r.pijnNRS}/10</span> : null}
                {r.verband ? <span><b>Verband:</b> {r.verband}</span> : null}
              </div>
              {r.opmerking ? <p className="mt-2 text-[#4f6b6f] dark:text-[#9fc7b5]"><b>Beleid:</b> {r.opmerking}</p> : null}
            </li>
          ))}
        </ul>
      ) : (<p className="text-sm text-[#8a9a8a]">Nog geen registraties.</p>)}

      <form action={addTime} className="border-t border-[#f0ece3] dark:border-[#0b3b42] pt-4 space-y-4">
        <input type="hidden" name="wondId" value={wond.id} />
        <input type="hidden" name="clientId" value={id} />
        <label className={`${labelCls} max-w-xs`}>Datum<input type="date" name="datum" required defaultValue={today} className={inputCls} /></label>

        <h3 className={subHead}>T — Tissue (wondbed)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <label className={labelCls}>Lengte (cm)<input type="number" step="0.1" name="afmetingL" className={inputCls} /></label>
          <label className={labelCls}>Breedte (cm)<input type="number" step="0.1" name="afmetingB" className={inputCls} /></label>
          <label className={labelCls}>Diepte (cm)<input type="number" step="0.1" name="afmetingD" className={inputCls} /></label>
          <label className={labelCls}>Debridement<select name="debridement" defaultValue="" className={inputCls}><option value="">—</option><option>nee</option><option>ja</option></select></label>
          <label className={labelCls}>Rood %<input type="number" name="tissueRood" className={inputCls} /></label>
          <label className={labelCls}>Geel %<input type="number" name="tissueGeel" className={inputCls} /></label>
          <label className={labelCls}>Zwart %<input type="number" name="tissueZwart" className={inputCls} /></label>
        </div>

        <h3 className={subHead}>I — Infection (infectie)</h3>
        <CbGroup label="Tekenen" name="infectietekenen" options={INFECTIETEKENEN} selected={null} />
        <label className={labelCls}>Actie<input name="infectieActie" placeholder="geen / wondkweek / overleg arts…" className={inputCls} /></label>

        <h3 className={subHead}>M — Moisture (exsudaat)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className={labelCls}>Hoeveelheid<select name="exsudaat" defaultValue="" className={inputCls}><option value="">—</option><option>geen</option><option>weinig</option><option>matig</option><option>veel</option></select></label>
          <label className={labelCls}>Kleur / consistentie<input name="exsudaatKleur" className={inputCls} /></label>
        </div>

        <h3 className={subHead}>E — Edge (wondrand & huid)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className={labelCls}>Wondrand<input name="wondrand" placeholder="vitaal/vorderend, niet-vorderend, ondermijnd…" className={inputCls} /></label>
          <label className={labelCls}>Omliggende huid<input name="omliggendeHuid" placeholder="intact, rood, maceratie, eelt…" className={inputCls} /></label>
        </div>

        <h3 className={subHead}>Overig</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className={labelCls}>Pijn (0–10)<input type="number" min="0" max="10" name="pijnNRS" className={inputCls} /></label>
          <label className={`${labelCls} sm:col-span-2`}>Verbandmateriaal<input name="verband" className={inputCls} /></label>
        </div>
        <label className={labelCls}>Opmerking / beleid<textarea name="opmerking" rows={2} className={inputCls} /></label>

        <button type="submit" className={addBtn}>+ TIME-registratie toevoegen</button>
      </form>
    </div>
  );

  const fotos = (
    <div className="space-y-6">
      <p className="text-xs text-[#8a9a8a]">
        Foto&apos;s van de wond, nieuwste bovenaan. Klik om te vergroten.
      </p>

      {wond.fotos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {wond.fotos.map((f) => (
            <figure
              key={f.id}
              className="border border-[#f0ece3] dark:border-[#0b3b42] rounded-xl overflow-hidden bg-white dark:bg-[#243029]"
            >
              <a
                href={`/api/wond-foto/${f.id}`}
                target="_blank"
                rel="noreferrer"
                className="block aspect-square bg-[#f6f3ec] dark:bg-[#02191c]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/wond-foto/${f.id}`}
                  alt={f.opmerking ?? f.bestandsnaam ?? "Wondfoto"}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </a>
              <figcaption className="p-2 text-xs text-[#4f6b6f] dark:text-[#9fc7b5]">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-[#064a54] dark:text-white">
                    {nl(f.datum ?? f.createdAt)}
                  </span>
                  <form action={deleteWondFoto}>
                    <input type="hidden" name="id" value={f.id} />
                    <input type="hidden" name="wondId" value={wond.id} />
                    <input type="hidden" name="clientId" value={id} />
                    <button type="submit" className="text-red-600 hover:underline">
                      Verwijderen
                    </button>
                  </form>
                </div>
                {f.opmerking ? <p className="mt-0.5 break-words">{f.opmerking}</p> : null}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#8a9a8a]">Nog geen foto&apos;s.</p>
      )}

      <WondFotoUpload wondId={wond.id} clientId={id} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <Link href={`/admin/clienten/${id}`} className="text-sm text-[#5b7f63] dark:text-[#5cb0bd] hover:underline">← {wond.client.voornaam} {wond.client.achternaam}</Link>
          <h1 className="text-2xl font-heading text-[#064a54] dark:text-white mt-2 flex items-center gap-3">
            Wond — {wond.locatie}
            <span className="text-xs font-sans font-medium bg-[#e6f2ea] dark:bg-[#0b3b42] text-[#4A9C6E] rounded-full px-2.5 py-1">{wond.status}</span>
          </h1>
        </div>
        <DeelPdfKnop
          url={`/api/wond/${wond.id}/pdf`}
          filename={`TIME-${(wond.client.achternaam || "client").replace(/[^a-zA-Z0-9-]/g, "_")}-${today}.pdf`}
          titel={`Wondzorgrapportage ${wond.client.voornaam} ${wond.client.achternaam}`}
        />
      </div>

      <Tabs
        tabs={[
          { label: "Anamnese (ALTIS)", content: anamnese },
          { label: "TIME-registraties", content: time },
          { label: `Foto's${wond.fotos.length ? ` (${wond.fotos.length})` : ""}`, content: fotos },
        ]}
      />
    </div>
  );
}
