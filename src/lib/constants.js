// --- CONSTRUCTION PRICE INDEX (Baupreisindex) ---
export const BAUPREISINDEX = {
    2025: 187.2, 2024: 183.3, 2023: 177.9, 2022: 164.0, 2021: 141.0,
    2020: 136.0, 2019: 132.0, 2018: 127.0, 2017: 122.0, 2016: 118.0,
    2015: 114.0, 2014: 112.0, 2013: 110.0, 2012: 108.0, 2011: 104.0,
    2010: 100.0, 2009: 98.0, 2008: 97.0, 2005: 87.0, 2000: 84.0,
    1995: 80.0, 1990: 70.0, 1980: 55.0, 1970: 35.0, 1960: 20.0
};

// --- BASELINE COSTS (NHK 2010) ---
export const NHK_2010_DATA = {
    efh: { label: "Ein-/Zweifamilienhaus (freistehend)", costs: [660, 735, 845, 1020, 1275] },
    dhh: { label: "Doppelhaushälfte / Reihenendhaus", costs: [635, 705, 810, 975, 1215] },
    rmh: { label: "Reihenmittelhaus", costs: [545, 605, 695, 840, 1050] },
    etw_small: { label: "Eigentumswohnung (< 6 WE)", costs: [710, 820, 960, 1100, 1350] },
    etw_large: { label: "Eigentumswohnung (> 6 WE)", costs: [810, 940, 1100, 1250, 1500] },
    mfh: { label: "Mehrfamilienhaus (Mietwohngrundstück)", costs: [680, 780, 900, 1050, 1300] },
    buero: { label: "Büro-/Verwaltungsgebäude", costs: [850, 1000, 1150, 1300, 1600] },
};

// --- QUALITY LEVELS ---
export const STANDARD_LABELS = [
    "1 - Sehr einfach (Behelfsbauten)",
    "2 - Einfach (bis 1950, keine Heizung/Bad)",
    "3 - Mittel (Standardbauweise)",
    "4 - Gehoben (Gute Ausstattung)",
    "5 - Stark gehoben (Luxus)"
];

// --- DEFAULT VALUES ---
export const DEFAULT_INPUTS = {
    kaufpreis: 500000,
    baujahr: 1995,
    kaufjahr: 2024,
    gesamtnutzungsdauer: 80,
    grundstuecksflaeche: 800,
    bodenrichtwert: 320,
    meaZaehler: 1000,
    meaNenner: 1000,
    berechnungsmethode: 'sachwert',
    wohnflaeche: 140,
    gebaeudetyp: 'efh',
    standardstufe: 3,
    regionalfaktor: 1.0,
    sachwertfaktor: 1.0,
    monatskaltmiete: 1500,
    anzahlWohnungen: 1,
    anzahlGaragen: 1,
    liegenschaftszinssatz: 4.5,
    vergleichswertProQm: 3500,
};
