import { BAUPREISINDEX, NHK_2010_DATA } from './constants';

/**
 * Formatting utilities
 */
export const fmtEuro = (val) => new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
}).format(val);

export const fmtPercent = (val) => new Intl.NumberFormat('de-DE', {
    style: 'percent',
    minimumFractionDigits: 2
}).format(val);

export const fmtDec = (val) => new Intl.NumberFormat('de-DE', {
    maximumFractionDigits: 2
}).format(val);

/**
 * Main calculation function
 * Returns all calculated values based on inputs
 */
export const calculateResults = (inputs) => {
    const {
        kaufpreis, grundstuecksflaeche, bodenrichtwert, wohnflaeche,
        baujahr, kaufjahr, gebaeudetyp, gesamtnutzungsdauer,
        meaZaehler, meaNenner, berechnungsmethode, standardstufe,
        regionalfaktor, sachwertfaktor,
        monatskaltmiete, anzahlWohnungen, anzahlGaragen, liegenschaftszinssatz,
        vergleichswertProQm
    } = inputs;

    // 1. Bodenwert (Identical for all methods)
    const meaAnteil = (meaZaehler && meaNenner) ? (meaZaehler / meaNenner) : 1;
    const relevanteGrundstuecksflaeche = grundstuecksflaeche * meaAnteil;
    const bodenwert = relevanteGrundstuecksflaeche * bodenrichtwert;

    // Age & remaining useful life
    const alter = Math.max(0, kaufjahr - baujahr);
    const restnutzungsdauer = Math.max(gesamtnutzungsdauer - alter, 0);

    let vorlaeufigerGebaeudewert = 0;
    let gesamtwertBerechnet = 0;
    let berechnungsDetails = {};

    if (berechnungsmethode === 'sachwert') {
        const result = calculateSachwert({
            kaufjahr, wohnflaeche, gebaeudetyp, standardstufe,
            regionalfaktor, anzahlGaragen, alter, gesamtnutzungsdauer,
            sachwertfaktor, bodenwert
        });
        vorlaeufigerGebaeudewert = result.vorlaeufigerGebaeudewert;
        gesamtwertBerechnet = result.gesamtwertBerechnet;
        berechnungsDetails = result.details;

    } else if (berechnungsmethode === 'ertragswert') {
        const result = calculateErtragswert({
            monatskaltmiete, anzahlWohnungen, anzahlGaragen,
            alter, wohnflaeche, bodenwert, liegenschaftszinssatz,
            restnutzungsdauer
        });
        vorlaeufigerGebaeudewert = result.vorlaeufigerGebaeudewert;
        gesamtwertBerechnet = result.gesamtwertBerechnet;
        berechnungsDetails = result.details;

    } else {
        const result = calculateVergleichswert({
            wohnflaeche, vergleichswertProQm, bodenwert
        });
        vorlaeufigerGebaeudewert = result.vorlaeufigerGebaeudewert;
        gesamtwertBerechnet = result.gesamtwertBerechnet;
        berechnungsDetails = result.details;
    }

    const quoteBoden = gesamtwertBerechnet > 0 ? (bodenwert / gesamtwertBerechnet) : 0;
    const quoteGebaeude = gesamtwertBerechnet > 0 ? (vorlaeufigerGebaeudewert / gesamtwertBerechnet) : 0;

    const finalBodenwert = kaufpreis * quoteBoden;
    const finalGebaeudewert = kaufpreis * quoteGebaeude;
    const afaBasis = finalGebaeudewert;
    const afaProJahr = afaBasis * 0.02;

    let ratioAlt = 0;
    if (bodenwert > 0) {
        ratioAlt = vorlaeufigerGebaeudewert / bodenwert;
    } else {
        ratioAlt = 999;
    }

    const ratioNeu = ratioAlt * 1.15;
    let quoteGebaeudeOptimiert = ratioNeu / (1 + ratioNeu);
    if (quoteGebaeudeOptimiert > 0.99) quoteGebaeudeOptimiert = 0.99;

    const rawGebaeudeOpt = kaufpreis * quoteGebaeudeOptimiert;
    const finalGebaeudewertOptimized = Math.round(rawGebaeudeOpt / 1000) * 1000;
    const finalBodenwertOptimized = kaufpreis - finalGebaeudewertOptimized;

    const quoteGebaeudeOptimiertVis = finalGebaeudewertOptimized / kaufpreis;
    const quoteBodenOptimiertVis = finalBodenwertOptimized / kaufpreis;

    return {
        bodenwert,
        relevanteGrundstuecksflaeche,
        vorlaeufigerGebaeudewert,
        gesamtwertBerechnet,
        quoteBoden,
        quoteGebaeude,
        finalBodenwert,
        finalGebaeudewert,
        finalGebaeudewertOptimized,
        finalBodenwertOptimized,
        quoteGebaeudeOptimiertVis,
        quoteBodenOptimiertVis,
        afaBasis,
        afaProJahr,
        alter,
        restnutzungsdauer,
        details: berechnungsDetails
    };
};

/**
 * Sachwertverfahren (Asset Value Method)
 */
const calculateSachwert = ({
    kaufjahr, wohnflaeche, gebaeudetyp, standardstufe,
    regionalfaktor, anzahlGaragen, alter, gesamtnutzungsdauer,
    sachwertfaktor, bodenwert
}) => {
    let indexKey = kaufjahr;
    while (!BAUPREISINDEX[indexKey] && indexKey > 1960) indexKey--;
    const baupreisindexAktuell = BAUPREISINDEX[indexKey] || 100;

    const stufeIndex = Math.max(0, Math.min(standardstufe - 1, 4));
    const nhkBasis = NHK_2010_DATA[gebaeudetyp].costs[stufeIndex];

    const herstellungskostenProQm = nhkBasis * (baupreisindexAktuell / 100) * regionalfaktor;
    const herstellungskostenGebaeude = herstellungskostenProQm * wohnflaeche;

    const garageBasis = 9000;
    const herstellungskostenGaragen = (garageBasis * anzahlGaragen) * (baupreisindexAktuell / 100) * regionalfaktor;

    const herstellungskostenGesamt = herstellungskostenGebaeude + herstellungskostenGaragen;

    let wertminderungProzent = (alter / gesamtnutzungsdauer);
    if (wertminderungProzent > 1) wertminderungProzent = 1;
    const wertminderungEuro = herstellungskostenGesamt * wertminderungProzent;

    const vorlaeufigerGebaeudewert = Math.max(0, herstellungskostenGesamt - wertminderungEuro);
    const vorlaeufigerSachwert = bodenwert + vorlaeufigerGebaeudewert;
    const marktangepassterSachwert = vorlaeufigerSachwert * sachwertfaktor;

    const gesamtwertBerechnet = vorlaeufigerSachwert;

    return {
        vorlaeufigerGebaeudewert,
        gesamtwertBerechnet,
        details: {
            typ: 'Sachwert',
            index: baupreisindexAktuell,
            nhkBasis: nhkBasis,
            hkGebaeude: herstellungskostenGebaeude,
            hkGaragen: herstellungskostenGaragen,
            herstellungskosten: herstellungskostenGesamt,
            wertminderung: wertminderungEuro,
            marktangepassterSachwert: marktangepassterSachwert
        }
    };
};

/**
 * Ertragswertverfahren (Income Capitalization Method)
 */
const calculateErtragswert = ({
    monatskaltmiete, anzahlWohnungen, anzahlGaragen,
    alter, wohnflaeche, bodenwert, liegenschaftszinssatz,
    restnutzungsdauer
}) => {
    const jahresrohertrag = monatskaltmiete * 12;

    const verwaltungWohnung = 360 * (anzahlWohnungen || 1);
    const verwaltungGarage = 45 * (anzahlGaragen || 0);
    const verwaltungGesamt = verwaltungWohnung + verwaltungGarage;

    let instandhaltungQm = 11;
    if (alter >= 22 && alter <= 32) instandhaltungQm = 14;
    if (alter > 32) instandhaltungQm = 18;

    const instandhaltungWohnung = instandhaltungQm * wohnflaeche;
    const instandhaltungGarage = 100 * (anzahlGaragen || 0);
    const instandhaltungGesamt = instandhaltungWohnung + instandhaltungGarage;

    const mietausfall = jahresrohertrag * 0.02;

    const bewirtschaftungskostenGesamt = verwaltungGesamt + instandhaltungGesamt + mietausfall;
    const reinertrag = jahresrohertrag - bewirtschaftungskostenGesamt;

    const bodenwertverzinsung = bodenwert * (liegenschaftszinssatz / 100);
    const gebaeudereinertrag = Math.max(0, reinertrag - bodenwertverzinsung);

    const zins = liegenschaftszinssatz / 100;
    let vervielfaeltiger = 0;
    if (zins > 0 && restnutzungsdauer > 0) {
        const q = 1 + zins;
        const q_n = Math.pow(q, restnutzungsdauer);
        vervielfaeltiger = (q_n - 1) / (q_n * zins);
    } else if (zins === 0) {
        vervielfaeltiger = restnutzungsdauer;
    }

    const vorlaeufigerGebaeudewert = gebaeudereinertrag * vervielfaeltiger;
    const gesamtwertBerechnet = bodenwert + vorlaeufigerGebaeudewert;

    return {
        vorlaeufigerGebaeudewert,
        gesamtwertBerechnet,
        details: {
            typ: 'Ertragswert',
            jahresrohertrag,
            bwk: {
                gesamt: bewirtschaftungskostenGesamt,
                verwaltung: verwaltungGesamt,
                instandhaltung: instandhaltungGesamt,
                mietausfall: mietausfall
            },
            reinertrag,
            bodenwertverzinsung,
            gebaeudereinertrag,
            vervielfaeltiger
        }
    };
};

/**
 * Vergleichswertverfahren (Comparative Value Method)
 */
const calculateVergleichswert = ({
    wohnflaeche, vergleichswertProQm, bodenwert
}) => {
    const vergleichswertGesamt = wohnflaeche * vergleichswertProQm;

    const gesamtwertBerechnet = vergleichswertGesamt;
    const vorlaeufigerGebaeudewert = Math.max(0, gesamtwertBerechnet - bodenwert);

    return {
        vorlaeufigerGebaeudewert,
        gesamtwertBerechnet,
        details: {
            typ: 'Vergleichswert',
            vergleichswertGesamt
        }
    };
};
