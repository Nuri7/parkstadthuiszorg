import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { createClient } from "@/app/actions/clienten";
import { inputCls, labelCls } from "@/lib/adminUi";

export const metadata = { title: "Nieuwe cliënt | Parkstad Thuiszorg" };

export default async function NieuweClientPage() {
  await requireAdmin();
  const verwijzers = await db.verwijzer.findMany({ orderBy: { naam: "asc" }, select: { id: true, naam: true } });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Link href="/admin/clienten" className="text-sm text-[#5b7f63] dark:text-[#5cb0bd] hover:underline">
          ← Terug naar cliënten
        </Link>
        <h1 className="text-2xl font-heading text-[#064a54] dark:text-white mt-2">Nieuwe cliënt</h1>
      </div>

      <form action={createClient} className="space-y-5 bg-white dark:bg-[#243029] p-6 rounded-2xl border border-[#ede7db] dark:border-[#086370]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className={labelCls}>Voornaam *<input name="voornaam" required className={inputCls} /></label>
          <label className={labelCls}>Achternaam *<input name="achternaam" required className={inputCls} /></label>
          <label className={labelCls}>Status
            <select name="status" defaultValue="AANMELDING" className={inputCls}>
              <option value="AANMELDING">Aanmelding</option>
              <option value="INTAKE">Intake</option>
              <option value="WACHT_FINANCIERING">Wacht op financiering</option>
              <option value="ZORG_ACTIEF">Zorg actief</option>
              <option value="ON_HOLD">On hold</option>
              <option value="AFGESLOTEN">Afgesloten</option>
            </select>
          </label>
          <label className={labelCls}>Geboortedatum<input type="date" name="geboortedatum" className={inputCls} /></label>
          <label className={labelCls}>BSN<input name="bsn" className={inputCls} /></label>
          <label className={labelCls}>Geslacht
            <select name="geslacht" defaultValue="" className={inputCls}>
              <option value="">—</option>
              <option value="V">Vrouw</option>
              <option value="M">Man</option>
              <option value="X">Anders</option>
            </select>
          </label>
          <label className={labelCls}>Telefoon<input name="telefoon" className={inputCls} /></label>
          <label className={labelCls}>E-mail<input type="email" name="email" className={inputCls} /></label>
          <label className={labelCls}>Straat<input name="straat" className={inputCls} /></label>
          <label className={labelCls}>Huisnummer<input name="huisnummer" className={inputCls} /></label>
          <label className={labelCls}>Postcode<input name="postcode" className={inputCls} /></label>
          <label className={labelCls}>Plaats<input name="plaats" className={inputCls} /></label>
          <label className={labelCls}>Huisarts<input name="huisarts" className={inputCls} /></label>
          <label className={labelCls}>Apotheek<input name="apotheek" className={inputCls} /></label>
          <label className={labelCls}>Zorgverzekeraar<input name="zorgverzekeraar" className={inputCls} /></label>
          <label className={labelCls}>Polisnummer<input name="polisnummer" className={inputCls} /></label>
          <label className={labelCls}>Budgethouder<input name="budgethouder" placeholder="cliënt zelf of naam" className={inputCls} /></label>
          <label className={labelCls}>Herkomst
            <select name="herkomst" defaultValue="" className={inputCls}>
              <option value="">—</option>
              <option value="INTERN">Zelf geworven</option>
              <option value="EXTERN">Via iemand anders</option>
            </select>
          </label>
          <label className={labelCls}>Via wie / hoe<input name="herkomstVia" placeholder="bij &lsquo;via iemand anders&rsquo;" className={inputCls} /></label>
          <label className={labelCls}>Verwijzer
            <select name="verwijzerId" defaultValue="" className={inputCls}>
              <option value="">— geen / onbekend</option>
              {verwijzers.map((v) => (
                <option key={v.id} value={v.id}>{v.naam}</option>
              ))}
            </select>
          </label>
        </div>
        <label className={labelCls}>Aandachtspunten<textarea name="aandachtspunten" rows={3} className={inputCls} /></label>

        <div className="flex gap-3">
          <button type="submit" className="rounded-lg bg-[#064a54] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#053a42]">
            Cliënt opslaan
          </button>
          <Link href="/admin/clienten" className="rounded-lg border border-[#dce8de] dark:border-[#086370] px-5 py-2.5 text-sm text-[#4f6b6f] dark:text-[#9fc7b5]">
            Annuleren
          </Link>
        </div>
      </form>
    </div>
  );
}
