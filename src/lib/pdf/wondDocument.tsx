import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Wond, TimeRegistratie, Client } from "@prisma/client";
import { nl, dim } from "@/lib/format";
import { wondStatusLabels, wondDoelLabels } from "@/lib/labels";

const C = {
  teal: "#064a54",
  ink: "#1f2937",
  muted: "#4f6b6f",
  faint: "#9ca3af",
  line: "#e5e7eb",
};

const styles = StyleSheet.create({
  page: { paddingTop: 40, paddingBottom: 54, paddingHorizontal: 40, fontSize: 10, color: C.ink, lineHeight: 1.4, fontFamily: "Helvetica" },
  title: { fontSize: 17, fontFamily: "Helvetica-Bold", color: C.teal },
  sub: { fontSize: 9, color: C.faint, marginTop: 2 },
  section: { fontSize: 11, fontFamily: "Helvetica-Bold", color: C.teal, marginTop: 16, marginBottom: 5, paddingBottom: 2, borderBottomWidth: 1, borderBottomColor: C.line },
  row: { flexDirection: "row", marginBottom: 2 },
  label: { width: 130, color: C.muted },
  value: { flex: 1 },
  regBlock: { borderWidth: 1, borderColor: C.line, borderRadius: 4, padding: 8, marginBottom: 8 },
  regDate: { fontSize: 11, fontFamily: "Helvetica-Bold", color: C.teal, marginBottom: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: { width: "50%", marginBottom: 2, flexDirection: "row" },
  cellLabel: { fontFamily: "Helvetica-Bold" },
  beleid: { marginTop: 4 },
  footer: { position: "absolute", bottom: 22, left: 40, right: 40, fontSize: 8, color: C.faint, borderTopWidth: 1, borderTopColor: C.line, paddingTop: 6, flexDirection: "row", justifyContent: "space-between" },
});

function KV({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function Cell({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <View style={styles.cell}>
      <Text style={styles.cellLabel}>{label}: </Text>
      <Text>{value}</Text>
    </View>
  );
}

export interface WondPdfData {
  client: Pick<Client, "voornaam" | "achternaam" | "geboortedatum" | "plaats">;
  wond: Wond;
  registraties: TimeRegistratie[];
  gegenereerdOp: string;
}

export function WondDocument({ client, wond, registraties, gegenereerdOp }: WondPdfData) {
  const regs = [...registraties].sort(
    (a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime(),
  );
  const pijn = [wond.pijnRust, wond.pijnVerzorging, wond.pijnNacht].some((x) => x != null)
    ? `rust ${wond.pijnRust ?? "?"} · verzorging ${wond.pijnVerzorging ?? "?"} · nacht ${wond.pijnNacht ?? "?"} (0–10)`
    : null;

  return (
    <Document title={`Wondzorgrapportage ${client.voornaam} ${client.achternaam}`} author="Parkstad Thuiszorg">
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.title}>Wondzorgrapportage</Text>
          <Text style={styles.sub}>
            Parkstad Thuiszorg · gegenereerd op {gegenereerdOp} · vertrouwelijk — medische gegevens
          </Text>
        </View>

        <Text style={styles.section}>Cliënt & wond</Text>
        <KV label="Cliënt" value={`${client.voornaam} ${client.achternaam}`} />
        <KV label="Geboortedatum" value={client.geboortedatum ? nl(client.geboortedatum) : null} />
        <KV label="Plaats" value={client.plaats} />
        <KV label="Wond — locatie" value={`${wond.locatie}${wond.lokalisatieZijde ? ` (${wond.lokalisatieZijde})` : ""}`} />
        <KV label="Soort" value={wond.soort} />
        <KV label="Ontstaanswijze" value={wond.ontstaanswijze} />
        <KV label="Bestaat sinds" value={wond.startdatum ? nl(wond.startdatum) : null} />
        <KV label="Status / doel" value={`${wondStatusLabels[wond.status] ?? wond.status} · ${wondDoelLabels[wond.doel] ?? wond.doel}`} />

        <Text style={styles.section}>Anamnese (ALTIS)</Text>
        <KV label="Klachten" value={wond.klachten} />
        <KV label="Duur / beloop" value={[wond.tijdDuur, wond.tijdBeloop].filter(Boolean).join(" · ") || null} />
        <KV label="Pijn" value={pijn} />
        <KV label="Comorbiditeit" value={wond.comorbiditeit} />
        <KV label="Medicatie-invloed" value={wond.medicatieInvloed} />
        <KV label="Allergieën" value={wond.allergieen} />
        <KV label="Eerdere behandeling" value={wond.eerdereBehandeling} />
        <KV label="Doel/verwachting cliënt" value={wond.doelVerwachting} />

        <Text style={styles.section}>TIME-registraties ({regs.length})</Text>
        {regs.length === 0 ? (
          <Text style={{ color: C.muted }}>Nog geen registraties.</Text>
        ) : (
          regs.map((r) => (
            <View key={r.id} style={styles.regBlock} wrap={false}>
              <Text style={styles.regDate}>{nl(r.datum)}</Text>
              <View style={styles.grid}>
                <Cell label="Afmeting" value={dim(r.afmetingL, r.afmetingB, r.afmetingD)} />
                <Cell
                  label="Tissue (R/G/Z)"
                  value={
                    [r.tissueRood, r.tissueGeel, r.tissueZwart].some((x) => x != null)
                      ? `${r.tissueRood ?? 0}/${r.tissueGeel ?? 0}/${r.tissueZwart ?? 0}%`
                      : null
                  }
                />
                <Cell label="Debridement" value={r.debridement} />
                <Cell label="Infectie" value={r.infectietekenen} />
                <Cell label="Infectie-actie" value={r.infectieActie} />
                <Cell label="Exsudaat" value={r.exsudaat ? `${r.exsudaat}${r.exsudaatKleur ? ` (${r.exsudaatKleur})` : ""}` : null} />
                <Cell label="Wondrand" value={r.wondrand} />
                <Cell label="Omliggende huid" value={r.omliggendeHuid} />
                <Cell label="Pijn (0–10)" value={r.pijnNRS != null ? String(r.pijnNRS) : null} />
                <Cell label="Verband" value={r.verband} />
              </View>
              {r.opmerking ? (
                <View style={styles.beleid}>
                  <Text>
                    <Text style={styles.cellLabel}>Beleid: </Text>
                    {r.opmerking}
                  </Text>
                </View>
              ) : null}
            </View>
          ))
        )}

        <View style={styles.footer} fixed>
          <Text>Parkstad Thuiszorg — vertrouwelijk</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
