import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { Tabs } from "@/components/admin/Tabs";
import {
  updateClient,
  deleteClient,
  addFinanciering,
  deleteFinanciering,
  addBezoek,
  deleteBezoek,
  addContactpersoon,
  deleteContactpersoon,
  addMedicatie,
  deleteMedicatie,
} from "@/app/actions/clienten";
import { startZorgplan, updateZorgplan, nieuweZorgplanVersie, addZorgdoel, deleteZorgdoel } from "@/app/actions/zorgplan";
import { addWond, deleteWond } from "@/app/actions/wonden";
import { actieveFinanciering, toegestaneUrenPerWeek, urenPerWeekMap } from "@/lib/budget";
import { BezoekBudgetHint } from "@/components/admin/BezoekBudgetHint";
import { inputCls, labelCls, addBtn, delBtn } from "@/lib/adminUi";
import { nl, isoDay, tijd } from "@/lib/format";
import { clientStatusLabels, zorgdoelStatusLabels, zorgplanStatusLabels } from "@/lib/labels";

export default async function ClientDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const client = await db.client.findUnique({
    where: { id },
    include: {
      contactpersonen: { orderBy: { createdAt: "asc" } },
      financieringen: { orderBy: { createdAt: "desc" } },
      zorgplannen: {
        include: { doelen: { orderBy: { createdAt: "asc" } } },
        orderBy: { versie: "desc" },
      },
      medicatie: { orderBy: { createdAt: "asc" } },
      bezoeken: { orderBy: { datum: "desc" } },
      wonden: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!client) notFound();

  const verwijzers = await db.verwijzer.findMany({ orderBy: { naam: "asc" }, select: { id: true, naam: true } });

  const today = new Date().toISOString().slice(0, 10);
  const totaalMin = client.bezoeken
    .filter((b) => b.declarabel && b.status === "UITGEVOERD")
    .reduce((s, b) => s + (b.duurMinuten ?? 0), 0);

  const now = new Date();
  const actieveFin = actieveFinanciering(client.financieringen, now);
  const budgetUrenPerWeek = actieveFin ? toegestaneUrenPerWeek(actieveFin) : null;
  const weekMap = urenPerWeekMap(client.bezoeken);

  // Zorgplan: huidige (niet-vervallen) versie + de vervallen historie
  const huidigPlan = client.zorgplannen.find((p) => p.status !== "VERVALLEN") ?? null;
  const planHistorie = client.zorgplannen.filter((p) => p.status === "VERVALLEN");
  const evalVerlopen = !!huidigPlan?.evaluatiedatum && new Date(huidigPlan.evaluatiedatum) < now;

  const gegevens = (
    // key op updatedAt: remount na opslaan zodat de <select>-velden (status,
    // geslacht, herkomst) hun opgeslagen waarde blijven tonen i.p.v. te resetten.
    <form key={client.updatedAt.getTime()} action={updateClient} className="space-y-4">
      <input type="hidden" name="id" value={client.id} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className={labelCls}>Voornaam *<input name="voornaam" required defaultValue={client.voornaam} className={inputCls} /></label>
        <label className={labelCls}>Achternaam *<input name="achternaam" required defaultValue={client.achternaam} className={inputCls} /></label>
        <label className={labelCls}>Status
          <select name="status" defaultValue={client.status} className={inputCls}>
            <option value="AANMELDING">Aanmelding</option>
            <option value="INTAKE">Intake</option>
            <option value="WACHT_FINANCIERING">Wacht op financiering</option>
            <option value="ZORG_ACTIEF">Zorg actief</option>
            <option value="ON_HOLD">On hold</option>
            <option value="AFGESLOTEN">Afgesloten</option>
          </select>
        </label>
        <label className={labelCls}>Geboortedatum<input type="date" name="geboortedatum" defaultValue={isoDay(client.geboortedatum)} className={inputCls} /></label>
        <label className={labelCls}>BSN<input name="bsn" defaultValue={client.bsn ?? ""} className={inputCls} /></label>
        <label className={labelCls}>Geslacht
          <select name="geslacht" defaultValue={client.geslacht ?? ""} className={inputCls}>
            <option value="">—</option><option value="V">Vrouw</option><option value="M">Man</option><option value="X">Anders</option>
          </select>
        </label>
        <label className={labelCls}>Telefoon<input name="telefoon" defaultValue={client.telefoon ?? ""} className={inputCls} /></label>
        <label className={labelCls}>E-mail<input type="email" name="email" defaultValue={client.email ?? ""} className={inputCls} /></label>
        <label className={labelCls}>Straat<input name="straat" defaultValue={client.straat ?? ""} className={inputCls} /></label>
        <label className={labelCls}>Huisnummer<input name="huisnummer" defaultValue={client.huisnummer ?? ""} className={inputCls} /></label>
        <label className={labelCls}>Postcode<input name="postcode" defaultValue={client.postcode ?? ""} className={inputCls} /></label>
        <label className={labelCls}>Plaats<input name="plaats" defaultValue={client.plaats ?? ""} className={inputCls} /></label>
        <label className={labelCls}>Huisarts<input name="huisarts" defaultValue={client.huisarts ?? ""} className={inputCls} /></label>
        <label className={labelCls}>Apotheek<input name="apotheek" defaultValue={client.apotheek ?? ""} className={inputCls} /></label>
        <label className={labelCls}>Zorgverzekeraar<input name="zorgverzekeraar" defaultValue={client.zorgverzekeraar ?? ""} className={inputCls} /></label>
        <label className={labelCls}>Polisnummer<input name="polisnummer" defaultValue={client.polisnummer ?? ""} className={inputCls} /></label>
        <label className={labelCls}>Budgethouder<input name="budgethouder" defaultValue={client.budgethouder ?? ""} placeholder="cliënt zelf of naam" className={inputCls} /></label>
        <label className={labelCls}>Herkomst
          <select name="herkomst" defaultValue={client.herkomst ?? ""} className={inputCls}>
            <option value="">—</option><option value="INTERN">Zelf geworven</option><option value="EXTERN">Via iemand anders</option>
          </select>
        </label>
        <label className={labelCls}>Via wie / hoe<input name="herkomstVia" defaultValue={client.herkomstVia ?? ""} className={inputCls} /></label>
        <label className={labelCls}>Verwijzer
          <select name="verwijzerId" defaultValue={client.verwijzerId ?? ""} className={inputCls}>
            <option value="">— geen / onbekend</option>
            {verwijzers.map((v) => (
              <option key={v.id} value={v.id}>{v.naam}</option>
            ))}
          </select>
        </label>
      </div>
      <label className={labelCls}>Aandachtspunten<textarea name="aandachtspunten" rows={3} defaultValue={client.aandachtspunten ?? ""} className={inputCls} /></label>
      <button type="submit" className="rounded-lg bg-[#064a54] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#053a42]">Opslaan</button>
    </form>
  );

  const contactpersonen = (
    <div>
      {client.contactpersonen.length > 0 ? (
        <ul className="space-y-2 mb-5">
          {client.contactpersonen.map((p) => (
            <li key={p.id} className="flex items-center justify-between text-sm border border-[#f0ece3] dark:border-[#0b3b42] rounded-lg px-3 py-2">
              <span className="text-[#064a54] dark:text-[#e5f2f4]">
                <strong>{p.naam}</strong>{p.relatie ? ` · ${p.relatie}` : ""}{p.telefoon ? ` · ${p.telefoon}` : ""}{p.email ? ` · ${p.email}` : ""}
                {p.isBudgethouder ? <span className="ml-2 text-xs bg-[#e6f2ea] dark:bg-[#0b3b42] text-[#4A9C6E] rounded px-1.5 py-0.5">budgethouder</span> : null}
                {p.isWettelijkVertegenwoordiger ? <span className="ml-1 text-xs bg-[#e6f2ea] dark:bg-[#0b3b42] text-[#4A9C6E] rounded px-1.5 py-0.5">vertegenwoordiger</span> : null}
              </span>
              <form action={deleteContactpersoon}><input type="hidden" name="id" value={p.id} /><input type="hidden" name="clientId" value={client.id} /><button type="submit" className={delBtn}>Verwijderen</button></form>
            </li>
          ))}
        </ul>
      ) : (<p className="text-sm text-[#8a9a8a] mb-5">Nog geen contactpersonen.</p>)}
      <form action={addContactpersoon} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end border-t border-[#f0ece3] dark:border-[#0b3b42] pt-4">
        <input type="hidden" name="clientId" value={client.id} />
        <label className={labelCls}>Naam *<input name="naam" required className={inputCls} /></label>
        <label className={labelCls}>Relatie<input name="relatie" placeholder="partner, dochter, mantelzorger…" className={inputCls} /></label>
        <label className={labelCls}>Telefoon<input name="telefoon" className={inputCls} /></label>
        <label className={labelCls}>E-mail<input type="email" name="email" className={inputCls} /></label>
        <label className="flex items-center gap-2 text-sm text-[#4f6b6f] dark:text-[#9fc7b5] mt-6"><input type="checkbox" name="isBudgethouder" /> Budgethouder</label>
        <label className="flex items-center gap-2 text-sm text-[#4f6b6f] dark:text-[#9fc7b5] mt-6"><input type="checkbox" name="isWettelijkVertegenwoordiger" /> Wett. vertegenwoordiger</label>
        <div className="sm:col-span-3"><button type="submit" className={addBtn}>+ Contactpersoon toevoegen</button></div>
      </form>
    </div>
  );

  const financiering = (
    <div>
      {client.financieringen.length > 0 ? (
        <ul className="space-y-2 mb-5">
          {client.financieringen.map((f) => (
            <li key={f.id} className="flex items-center justify-between text-sm border border-[#f0ece3] dark:border-[#0b3b42] rounded-lg px-3 py-2">
              <span className="text-[#064a54] dark:text-[#e5f2f4]"><strong>{f.wet} / {f.vorm}</strong>{f.verstrekker ? ` · ${f.verstrekker}` : ""}{f.fase ? ` · fase: ${f.fase}` : ""}{f.urenPerWeek != null ? ` · ${f.urenPerWeek} u/wk` : ""}{f.tarief != null ? ` · €${f.tarief}/u` : ""}{f.totaalBudget != null ? ` · budget €${f.totaalBudget}` : ""}{(f.geldigVan || f.geldigTot) ? ` · ${nl(f.geldigVan)}–${nl(f.geldigTot)}` : ""}</span>
              <form action={deleteFinanciering}><input type="hidden" name="id" value={f.id} /><input type="hidden" name="clientId" value={client.id} /><button type="submit" className={delBtn}>Verwijderen</button></form>
            </li>
          ))}
        </ul>
      ) : (<p className="text-sm text-[#8a9a8a] mb-5">Nog geen financiering vastgelegd.</p>)}
      <form action={addFinanciering} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end border-t border-[#f0ece3] dark:border-[#0b3b42] pt-4">
        <input type="hidden" name="clientId" value={client.id} />
        <label className={labelCls}>Wet<select name="wet" required defaultValue="ZVW" className={inputCls}><option value="ZVW">Zvw (wijkverpleging)</option><option value="WMO">Wmo (gemeente)</option><option value="WLZ">Wlz (zorgkantoor)</option></select></label>
        <label className={labelCls}>Vorm<select name="vorm" required defaultValue="PGB" className={inputCls}><option value="PGB">PGB</option><option value="ZIN">Zorg in natura</option></select></label>
        <label className={labelCls}>Verstrekker<input name="verstrekker" className={inputCls} /></label>
        <label className={labelCls}>Beschikkings-/dossiernr<input name="beschikkingsnummer" className={inputCls} /></label>
        <label className={labelCls}>Budgetbasis<select name="budgetBasis" defaultValue="PER_WEEK_UREN" className={inputCls}><option value="PER_WEEK_UREN">Uren per week</option><option value="TOTAAL_BUDGET">Totaalbudget (periode)</option></select></label>
        <label className={labelCls}>Fase<input name="fase" placeholder="bijv. Toegekend, Zorg loopt" className={inputCls} /></label>
        <label className={labelCls}>Uren/week<input type="number" step="0.5" name="urenPerWeek" className={inputCls} /></label>
        <label className={labelCls}>Tarief €/u<input type="number" step="0.01" name="tarief" className={inputCls} /></label>
        <label className={labelCls}>Totaalbudget €<input type="number" step="0.01" name="totaalBudget" placeholder="alleen bij totaalbudget" className={inputCls} /></label>
        <label className={labelCls}>Geldig van<input type="date" name="geldigVan" className={inputCls} /></label>
        <label className={labelCls}>Geldig tot<input type="date" name="geldigTot" className={inputCls} /></label>
        <div className="sm:col-span-3"><button type="submit" className={addBtn}>+ Financiering toevoegen</button></div>
      </form>
    </div>
  );

  const zorgplan = (
    <div className="space-y-6">
      {huidigPlan ? (
        <>
          {/* Plan-header: afstemming met cliënt + evaluatie. key op updatedAt tegen select-reset. */}
          <form key={huidigPlan.updatedAt.getTime()} action={updateZorgplan} className="space-y-4">
            <input type="hidden" name="id" value={huidigPlan.id} />
            <input type="hidden" name="clientId" value={client.id} />
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-[#064a54] dark:text-[#5cb0bd]">Zorgplan · versie {huidigPlan.versie}</h3>
              <span className="text-xs bg-[#e6f2ea] dark:bg-[#0b3b42] text-[#4A9C6E] rounded-full px-2.5 py-0.5">{zorgplanStatusLabels[huidigPlan.status] ?? huidigPlan.status}</span>
              <span className="text-xs text-[#8a9a8a]">opgesteld {nl(huidigPlan.opgesteldOp)}</span>
              {evalVerlopen ? (
                <span className="text-xs bg-[#fdecec] dark:bg-[#3a1414] text-[#b91c1c] dark:text-[#f2b8b8] rounded-full px-2.5 py-0.5">evaluatie verlopen</span>
              ) : null}
            </div>
            <label className={labelCls}>Samenvatting / situatieschets<textarea name="samenvatting" rows={2} defaultValue={huidigPlan.samenvatting ?? ""} placeholder="korte omschrijving van de situatie en het hoofddoel" className={inputCls} /></label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className={labelCls}>Status
                <select name="status" defaultValue={huidigPlan.status} className={inputCls}>
                  <option value="CONCEPT">Concept</option>
                  <option value="VASTGESTELD">Vastgesteld (met cliënt)</option>
                </select>
              </label>
              <label className={labelCls}>Besproken met cliënt op<input type="date" name="besprokenMetClientOp" defaultValue={isoDay(huidigPlan.besprokenMetClientOp)} className={inputCls} /></label>
              <label className={labelCls}>Met wie<input name="besprokenMet" defaultValue={huidigPlan.besprokenMet ?? ""} placeholder="cliënt zelf / vertegenwoordiger" className={inputCls} /></label>
              <label className={labelCls}>Evaluatiedatum<input type="date" name="evaluatiedatum" defaultValue={isoDay(huidigPlan.evaluatiedatum)} className={inputCls} /></label>
            </div>
            <button type="submit" className="rounded-lg bg-[#064a54] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#053a42]">Zorgplan opslaan</button>
          </form>

          {/* Doelen van deze versie */}
          <div className="border-t border-[#f0ece3] dark:border-[#0b3b42] pt-5">
            <h3 className="text-sm font-semibold text-[#064a54] dark:text-[#5cb0bd] mb-3">Doelen</h3>
            {huidigPlan.doelen.length > 0 ? (
              <ul className="space-y-2 mb-5">
                {huidigPlan.doelen.map((z) => (
                  <li key={z.id} className="flex items-start justify-between text-sm border border-[#f0ece3] dark:border-[#0b3b42] rounded-lg px-3 py-2">
                    <span className="text-[#064a54] dark:text-[#e5f2f4]"><strong>{z.omschrijving}</strong> · {zorgdoelStatusLabels[z.status] ?? z.status}{z.streefdatum ? ` · streef ${nl(z.streefdatum)}` : ""}{z.actie ? <span className="block text-[#4f6b6f] dark:text-[#9fc7b5] mt-1">{z.actie}</span> : null}</span>
                    <form action={deleteZorgdoel}><input type="hidden" name="id" value={z.id} /><input type="hidden" name="clientId" value={client.id} /><button type="submit" className={delBtn}>Verwijderen</button></form>
                  </li>
                ))}
              </ul>
            ) : (<p className="text-sm text-[#8a9a8a] mb-5">Nog geen doelen.</p>)}
            <form action={addZorgdoel} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <input type="hidden" name="zorgplanId" value={huidigPlan.id} />
              <input type="hidden" name="clientId" value={client.id} />
              <label className={`${labelCls} sm:col-span-2`}>Doel *<input name="omschrijving" required placeholder="bijv. wond genezen, mobiliteit behouden" className={inputCls} /></label>
              <label className={labelCls}>Status<select name="status" defaultValue="OPEN" className={inputCls}><option value="OPEN">Open</option><option value="BEHAALD">Behaald</option><option value="GESTOPT">Gestopt</option></select></label>
              <label className={`${labelCls} sm:col-span-2`}>Actie / aanpak<input name="actie" className={inputCls} /></label>
              <label className={labelCls}>Streefdatum<input type="date" name="streefdatum" className={inputCls} /></label>
              <div className="sm:col-span-3"><button type="submit" className={addBtn}>+ Doel toevoegen</button></div>
            </form>
          </div>

          {/* Nieuwe versie */}
          <form action={nieuweZorgplanVersie} className="border-t border-[#f0ece3] dark:border-[#0b3b42] pt-4 flex flex-wrap items-center gap-3">
            <input type="hidden" name="clientId" value={client.id} />
            <button type="submit" className="rounded-lg border border-[#dce8de] dark:border-[#086370] px-4 py-2 text-sm text-[#064a54] dark:text-[#5cb0bd] hover:bg-[#f0f6f1] dark:hover:bg-[#0b2b30]">+ Nieuwe versie opstellen</button>
            <span className="text-xs text-[#8a9a8a]">Bewaart de huidige versie als historie en start een nieuwe met dezelfde doelen.</span>
          </form>
        </>
      ) : (
        <form action={startZorgplan}>
          <input type="hidden" name="clientId" value={client.id} />
          <p className="text-sm text-[#8a9a8a] mb-3">Nog geen zorgplan voor deze cliënt.</p>
          <button type="submit" className={addBtn}>+ Zorgplan starten</button>
        </form>
      )}

      {/* Historie (vervallen versies, alleen-lezen) */}
      {planHistorie.length > 0 ? (
        <details className="border-t border-[#f0ece3] dark:border-[#0b3b42] pt-4">
          <summary className="cursor-pointer text-sm font-medium text-[#4f6b6f] dark:text-[#9fc7b5] select-none">Eerdere versies ({planHistorie.length})</summary>
          <ul className="mt-3 space-y-3">
            {planHistorie.map((p) => (
              <li key={p.id} className="text-sm border border-[#f0ece3] dark:border-[#0b3b42] rounded-lg px-3 py-2">
                <div className="flex flex-wrap items-center gap-2 text-[#064a54] dark:text-[#e5f2f4]">
                  <strong>Versie {p.versie}</strong>
                  <span className="text-xs text-[#8a9a8a]">opgesteld {nl(p.opgesteldOp)}{p.besprokenMetClientOp ? ` · afgestemd ${nl(p.besprokenMetClientOp)}` : ""}{p.evaluatiedatum ? ` · evaluatie ${nl(p.evaluatiedatum)}` : ""}</span>
                </div>
                {p.samenvatting ? <p className="text-[#4f6b6f] dark:text-[#9fc7b5] mt-1">{p.samenvatting}</p> : null}
                {p.doelen.length > 0 ? (
                  <ul className="mt-1 list-disc pl-5 text-[#4f6b6f] dark:text-[#9fc7b5]">
                    {p.doelen.map((z) => <li key={z.id}>{z.omschrijving} · {zorgdoelStatusLabels[z.status] ?? z.status}</li>)}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );

  const wondzorg = (
    <div>
      {client.wonden.length > 0 ? (
        <ul className="space-y-2 mb-5">
          {client.wonden.map((w) => (
            <li key={w.id} className="flex items-center justify-between text-sm border border-[#f0ece3] dark:border-[#0b3b42] rounded-lg px-3 py-2">
              <Link href={`/admin/clienten/${client.id}/wond/${w.id}`} className="text-[#064a54] dark:text-[#5cb0bd] hover:underline"><strong>{w.locatie}</strong>{w.soort ? ` · ${w.soort}` : ""} · {w.status} · <span className="underline">openen →</span></Link>
              <form action={deleteWond}><input type="hidden" name="id" value={w.id} /><input type="hidden" name="clientId" value={client.id} /><button type="submit" className={delBtn}>Verwijderen</button></form>
            </li>
          ))}
        </ul>
      ) : (<p className="text-sm text-[#8a9a8a] mb-5">Nog geen wonden. Voeg er een toe voor de ALTIS-anamnese + TIME-registraties.</p>)}
      <form action={addWond} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end border-t border-[#f0ece3] dark:border-[#0b3b42] pt-4">
        <input type="hidden" name="clientId" value={client.id} />
        <label className={labelCls}>Locatie *<input name="locatie" required placeholder="bijv. onderbeen links" className={inputCls} /></label>
        <label className={labelCls}>Soort<input name="soort" placeholder="decubitus, ulcus cruris…" className={inputCls} /></label>
        <label className={labelCls}>Doel<select name="doel" defaultValue="GENEZING" className={inputCls}><option value="GENEZING">Genezing</option><option value="STABILISEREN">Stabiliseren</option><option value="PALLIATIEF">Palliatief</option></select></label>
        <div className="sm:col-span-3"><button type="submit" className={addBtn}>+ Wond toevoegen</button></div>
      </form>
    </div>
  );

  const medicatie = (
    <div>
      {client.medicatie.length > 0 ? (
        <ul className="space-y-2 mb-5">
          {client.medicatie.map((m) => (
            <li key={m.id} className="flex items-center justify-between text-sm border border-[#f0ece3] dark:border-[#0b3b42] rounded-lg px-3 py-2">
              <span className="text-[#064a54] dark:text-[#e5f2f4]"><strong>{m.naam}</strong>{m.dosering ? ` · ${m.dosering}` : ""}{m.frequentie ? ` · ${m.frequentie}` : ""}{m.sinds ? ` · sinds ${nl(m.sinds)}` : ""}{m.opmerking ? ` · ${m.opmerking}` : ""}</span>
              <form action={deleteMedicatie}><input type="hidden" name="id" value={m.id} /><input type="hidden" name="clientId" value={client.id} /><button type="submit" className={delBtn}>Verwijderen</button></form>
            </li>
          ))}
        </ul>
      ) : (<p className="text-sm text-[#8a9a8a] mb-5">Nog geen medicatie.</p>)}
      <form action={addMedicatie} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end border-t border-[#f0ece3] dark:border-[#0b3b42] pt-4">
        <input type="hidden" name="clientId" value={client.id} />
        <label className={labelCls}>Medicijn *<input name="naam" required className={inputCls} /></label>
        <label className={labelCls}>Dosering<input name="dosering" placeholder="bijv. 500 mg" className={inputCls} /></label>
        <label className={labelCls}>Frequentie<input name="frequentie" placeholder="bijv. 2x per dag" className={inputCls} /></label>
        <label className={labelCls}>Sinds<input type="date" name="sinds" className={inputCls} /></label>
        <label className={`${labelCls} sm:col-span-2`}>Opmerking<input name="opmerking" className={inputCls} /></label>
        <div className="sm:col-span-3"><button type="submit" className={addBtn}>+ Medicatie toevoegen</button></div>
      </form>
    </div>
  );

  const bezoeken = (
    <div>
      <div className="flex items-center justify-end mb-4">
        <span className="text-sm text-[#4f6b6f] dark:text-[#9fc7b5]">Declarabele tijd: <strong>{Math.floor(totaalMin / 60)}u {totaalMin % 60}m</strong></span>
      </div>
      {client.bezoeken.length > 0 ? (
        <ul className="space-y-2 mb-5">
          {client.bezoeken.map((b) => (
            <li key={b.id} className="flex items-start justify-between text-sm border border-[#f0ece3] dark:border-[#0b3b42] rounded-lg px-3 py-2">
              <span className="text-[#064a54] dark:text-[#e5f2f4]"><strong>{nl(b.datum)}</strong>{tijd(b.datum) ? ` · ${tijd(b.datum)}` : ""}{b.duurMinuten != null ? ` · ${b.duurMinuten} min` : ""}{b.zorgverlener ? ` · ${b.zorgverlener}` : ""}{b.typeZorg ? ` · ${b.typeZorg}` : ""}{` · ${b.status}`}{!b.declarabel ? " · niet-declarabel" : ""}{b.rapportage ? <span className="block text-[#4f6b6f] dark:text-[#9fc7b5] mt-1">{b.rapportage}</span> : null}</span>
              <form action={deleteBezoek}><input type="hidden" name="id" value={b.id} /><input type="hidden" name="clientId" value={client.id} /><button type="submit" className={delBtn}>Verwijderen</button></form>
            </li>
          ))}
        </ul>
      ) : (<p className="text-sm text-[#8a9a8a] mb-5">Nog geen bezoeken geregistreerd.</p>)}
      <form id="bezoek-add-form" action={addBezoek} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end border-t border-[#f0ece3] dark:border-[#0b3b42] pt-4">
        <input type="hidden" name="clientId" value={client.id} />
        <label className={labelCls}>Datum<input type="date" name="datum" required defaultValue={today} className={inputCls} /></label>
        <label className={labelCls}>Tijd<input type="time" name="tijd" className={inputCls} /></label>
        <label className={labelCls}>Duur (min)<input type="number" name="duurMinuten" required min="0" defaultValue={30} className={inputCls} /></label>
        <label className={labelCls}>Zorgverlener<input name="zorgverlener" defaultValue="Meyrem" className={inputCls} /></label>
        <label className={labelCls}>Type zorg<input name="typeZorg" placeholder="bijv. wondzorg, verzorging" className={inputCls} /></label>
        <label className={labelCls}>Status<select name="status" defaultValue="UITGEVOERD" className={inputCls}><option value="UITGEVOERD">Uitgevoerd</option><option value="GEPLAND">Gepland</option><option value="GEANNULEERD">Geannuleerd</option></select></label>
        <label className="flex items-center gap-2 text-sm text-[#4f6b6f] dark:text-[#9fc7b5] mt-6"><input type="checkbox" name="declarabel" defaultChecked /> Declarabel</label>
        <label className={`${labelCls} sm:col-span-3`}>Rapportage<textarea name="rapportage" rows={2} className={inputCls} /></label>
        <BezoekBudgetHint urenPerWeek={budgetUrenPerWeek} weekMap={weekMap} formId="bezoek-add-form" />
        <div className="sm:col-span-3"><button type="submit" className={addBtn}>+ Bezoek toevoegen</button></div>
      </form>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href="/admin/clienten" className="text-sm text-[#5b7f63] dark:text-[#5cb0bd] hover:underline">← Cliënten</Link>
          <h1 className="text-2xl font-heading text-[#064a54] dark:text-white mt-2 flex items-center gap-3">
            {client.voornaam} {client.achternaam}
            <span className="text-xs font-sans font-medium bg-[#e6f2ea] dark:bg-[#0b3b42] text-[#4A9C6E] rounded-full px-2.5 py-1">{clientStatusLabels[client.status] ?? client.status}</span>
          </h1>
        </div>
        <form action={deleteClient}>
          <input type="hidden" name="id" value={client.id} />
          <button type="submit" className="text-sm text-red-600 hover:underline border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">Cliënt verwijderen</button>
        </form>
      </div>

      <Tabs
        tabs={[
          { label: "Gegevens", content: gegevens },
          { label: "Contactpersonen", content: contactpersonen },
          { label: "Financiering", content: financiering },
          { label: "Zorgplan", content: zorgplan },
          { label: "Wondzorg", content: wondzorg },
          { label: "Medicatie", content: medicatie },
          { label: "Bezoeken", content: bezoeken },
        ]}
      />
    </div>
  );
}
