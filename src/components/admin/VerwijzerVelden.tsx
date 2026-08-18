import type { Verwijzer } from "@prisma/client";
import { inputCls, labelCls } from "@/lib/adminUi";
import { isoDay } from "@/lib/format";
import { verwijzerTypeLabels, leadStatusLabels, levertRouteLabels } from "@/lib/labels";

const opties = (labels: Record<string, string>) =>
  Object.entries(labels).map(([waarde, label]) => (
    <option key={waarde} value={waarde}>
      {label}
    </option>
  ));

/**
 * Velden van een verwijzer — gedeeld door het aanmaak- en het bewerkformulier.
 * Bij bewerken hoort op het <form> een key={v.updatedAt.getTime()}, anders
 * resetten de selects na opslaan (bekende Next-16-gotcha in dit project).
 */
export function VerwijzerVelden({ v }: { v?: Verwijzer }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className={`${labelCls} sm:col-span-2`}>
          Naam praktijk / organisatie *
          <input name="naam" required defaultValue={v?.naam ?? ""} className={inputCls} />
        </label>

        <label className={labelCls}>
          Type
          <select name="type" defaultValue={v?.type ?? "HUISARTS"} className={inputCls}>
            {opties(verwijzerTypeLabels)}
          </select>
        </label>
        <label className={labelCls}>
          Status
          <select name="status" defaultValue={v?.status ?? "NIEUW"} className={inputCls}>
            {opties(leadStatusLabels)}
          </select>
        </label>

        <label className={labelCls}>
          Levert vooral
          <select name="levertRoute" defaultValue={v?.levertRoute ?? "ONBEKEND"} className={inputCls}>
            {opties(levertRouteLabels)}
          </select>
        </label>
        <label className={labelCls}>
          Afstand (km)
          <input
            type="number"
            step="0.1"
            min="0"
            name="afstandKm"
            defaultValue={v?.afstandKm ?? ""}
            placeholder="hemelsbreed vanaf Kerkrade"
            className={inputCls}
          />
        </label>

        <label className={labelCls}>Telefoon<input name="telefoon" defaultValue={v?.telefoon ?? ""} className={inputCls} /></label>
        <label className={labelCls}>E-mail<input type="email" name="email" defaultValue={v?.email ?? ""} placeholder="alleen algemeen zakelijk adres" className={inputCls} /></label>
        <label className={labelCls}>Website<input name="website" defaultValue={v?.website ?? ""} className={inputCls} /></label>
        <label className={labelCls}>AGB-code<input name="agbCode" defaultValue={v?.agbCode ?? ""} className={inputCls} /></label>

        <label className={labelCls}>Straat<input name="straat" defaultValue={v?.straat ?? ""} className={inputCls} /></label>
        <label className={labelCls}>Huisnummer<input name="huisnummer" defaultValue={v?.huisnummer ?? ""} className={inputCls} /></label>
        <label className={labelCls}>Postcode<input name="postcode" defaultValue={v?.postcode ?? ""} placeholder="6466 BH" className={inputCls} /></label>
        <label className={labelCls}>Plaats<input name="plaats" defaultValue={v?.plaats ?? ""} className={inputCls} /></label>

        <label className={labelCls}>
          Volgende actie op
          <input type="date" name="volgendeActieOp" defaultValue={isoDay(v?.volgendeActieOp)} className={inputCls} />
        </label>
        <label className={labelCls}>
          Volgende actie
          <input name="volgendeActie" defaultValue={v?.volgendeActie ?? ""} placeholder="bijv. folders langsbrengen" className={inputCls} />
        </label>
      </div>

      <label className={labelCls}>
        Notities
        <textarea name="notities" rows={3} defaultValue={v?.notities ?? ""} className={inputCls} />
        <span className="block text-xs text-[#8a9a8a] mt-1">
          Zakelijke aantekeningen. Géén cliëntgegevens hier — die horen in het cliëntdossier (AVG).
        </span>
      </label>
    </>
  );
}
