// Gedeelde enum-labels (NL). Eén bron van waarheid voor statusteksten.

export const clientStatusLabels: Record<string, string> = {
  AANMELDING: "Aanmelding",
  INTAKE: "Intake",
  WACHT_FINANCIERING: "Wacht op financiering",
  ZORG_ACTIEF: "Zorg actief",
  ON_HOLD: "On hold",
  AFGESLOTEN: "Afgesloten",
};

// Zorgdoel-status (zorgplan)
export const zorgdoelStatusLabels: Record<string, string> = {
  OPEN: "Open",
  BEHAALD: "Behaald",
  GESTOPT: "Gestopt",
};

// Aanvraag (intakeformulier) — zorgtype
export const careTypeLabels: Record<string, string> = {
  verpleging: "Wijkverpleging (injecties, wondzorg, etc.)",
  verzorging: "Persoonlijke verzorging (wassen, aankleden)",
  herstelzorg: "Herstelzorg na operatie (tijdelijk)",
  palliatief: "Palliatieve / terminale zorg",
  begeleiding: "Individuele begeleiding",
  mantelzorg: "Mantelzorgondersteuning / respijtzorg",
  nachtzorg: "Nachtzorg",
  medicatie: "Medicatiebeheer",
  "weet-niet": "Weet het niet / anders",
};

// Aanvraag — voor wie
export const forWhomLabels: Record<string, string> = {
  myself: "Voor zichzelf",
  other: "Voor een naaste",
};

// Aanvraag — status
export const aanvraagStatusLabels: Record<string, string> = {
  new: "Nieuw",
  contacted: "Gecontacteerd",
  resolved: "Afgerond",
};

// Zorgplan-status
export const zorgplanStatusLabels: Record<string, string> = {
  CONCEPT: "Concept",
  VASTGESTELD: "Vastgesteld",
  VERVALLEN: "Vervallen",
};

// Wond — behandeldoel
export const wondDoelLabels: Record<string, string> = {
  GENEZING: "Genezing",
  STABILISEREN: "Stabiliseren",
  PALLIATIEF: "Palliatief",
};

// Wond — status
export const wondStatusLabels: Record<string, string> = {
  ACTIEF: "Actief",
  GENEZEN: "Genezen",
  GESTOPT: "Gestopt",
};

// ---------- Sales pipeline: verwijzers ----------

export const verwijzerTypeLabels: Record<string, string> = {
  HUISARTS: "Huisartsenpraktijk",
  POH: "POH (praktijkondersteuner)",
  APOTHEEK: "Apotheek",
  FYSIO_ERGO: "Fysio- / ergotherapie",
  ZIEKENHUIS_TRANSFER: "Transferbureau ziekenhuis",
  WMO_LOKET: "Wmo-loket gemeente",
  WIJKTEAM: "Wijkteam / buurtteam",
  CASEMANAGER_DEMENTIE: "Casemanager dementie",
  CIZ: "CIZ",
  WOONZORG: "Woonzorg / dagbesteding",
  WELZIJN_BUURTHUIS: "Welzijn / buurthuis",
  GELOOFSGEMEENSCHAP: "Kerk / moskee",
  BELANGENVERENIGING: "Belangenvereniging",
  PGB_BEMIDDELAAR: "PGB-bemiddelaar",
  INDICATIESTELLER: "Indicatiesteller (niveau 5)",
  OVERIG: "Overig",
};

export const leadStatusLabels: Record<string, string> = {
  KANDIDAAT: "Kandidaat (te beoordelen)",
  NIEUW: "Nieuw — nog niet benaderd",
  BENADERD: "Benaderd",
  GESPROKEN: "Gesproken",
  MATERIAAL: "Materiaal afgegeven",
  ACTIEF: "Actief — verwijst door",
  SLAPEND: "Slapend",
  GEEN_INTERESSE: "Geen interesse",
  UITGESCHREVEN: "Uitgeschreven (opt-out)",
};

/** Korte variant voor badges en tabellen. */
export const leadStatusKort: Record<string, string> = {
  KANDIDAAT: "Kandidaat",
  NIEUW: "Nieuw",
  BENADERD: "Benaderd",
  GESPROKEN: "Gesproken",
  MATERIAAL: "Materiaal",
  ACTIEF: "Actief",
  SLAPEND: "Slapend",
  GEEN_INTERESSE: "Geen interesse",
  UITGESCHREVEN: "Opt-out",
};

export const levertRouteLabels: Record<string, string> = {
  PGB: "PGB",
  WMO: "Wmo",
  ZVW_ZIN: "Zvw zorg in natura",
  PARTICULIER: "Particulier",
  ONBEKEND: "Onbekend",
};

export const contactSoortLabels: Record<string, string> = {
  BEZOEK: "Bezoek",
  TELEFOON: "Telefoon",
  EMAIL: "E-mail",
  WHATSAPP: "WhatsApp",
  POST: "Post",
  EVENEMENT: "Evenement",
};
