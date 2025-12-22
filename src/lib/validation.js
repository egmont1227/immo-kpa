/**
 * Input validation utilities for real estate calculator
 * Returns error messages or null if valid
 */

export const validateKaufpreis = (value) => {
    if (!value || value <= 0) return "Kaufpreis muss größer als 0 sein";
    if (value > 100000000) return "Kaufpreis zu hoch (max. 100 Mio EUR)";
    return null;
};

export const validateBaujahr = (value) => {
    if (!value) return "Baujahr erforderlich";
    if (value < 1800 || value > 2025) return "Baujahr muss zwischen 1800 und 2025 liegen";
    return null;
};

export const validateKaufjahr = (value, baujahr) => {
    if (!value) return "Kaufjahr erforderlich";
    if (value < 1800 || value > 2026) return "Kaufjahr muss zwischen 1800 und 2025 liegen";
    if (baujahr && value < baujahr) return "Kaufjahr kann nicht vor Baujahr liegen";
    return null;
};

export const validateWohnflaeche = (value) => {
    if (!value || value <= 0) return "Wohnfläche muss größer als 0 sein";
    if (value > 10000) return "Wohnfläche zu groß (max. 10.000 m²)";
    return null;
};

export const validateGrundstuecksflaeche = (value) => {
    if (!value || value <= 0) return "Grundstücksfläche muss größer als 0 sein";
    if (value > 1000000) return "Grundstücksfläche zu groß (max. 1 Mio m²)";
    return null;
};

export const validateBodenrichtwert = (value) => {
    if (value === null || value === undefined || value < 0) return "Bodenrichtwert muss ≥ 0 sein";
    if (value > 100000) return "Bodenrichtwert zu hoch (max. 100.000 EUR/m²)";
    return null;
};

export const validateMEA = (zaehler, nenner) => {
    if (!zaehler || zaehler <= 0) return "MEA Zähler muss größer als 0 sein";
    if (!nenner || nenner <= 0) return "MEA Nenner muss größer als 0 sein";
    if (zaehler > nenner) return "MEA Zähler kann nicht größer als Nenner sein";
    return null;
};

export const validateLiegenschaftszinssatz = (value) => {
    if (value === null || value === undefined) return "Liegenschaftszinssatz erforderlich";
    if (value < 0.1 || value > 20) return "Liegenschaftszinssatz muss zwischen 0,1% und 20% liegen";
    return null;
};

export const validateMonatskaltmiete = (value) => {
    if (!value || value <= 0) return "Monatskaltmiete muss größer als 0 sein";
    if (value > 1000000) return "Monatskaltmiete zu hoch";
    return null;
};

export const validatePositiveInteger = (value, fieldName) => {
    if (!value || value < 0) return `${fieldName} muss ≥ 0 sein`;
    return null;
};

export const validateVergleichswertProQm = (value) => {
    if (!value || value <= 0) return "Vergleichswert pro m² muss größer als 0 sein";
    if (value > 100000) return "Vergleichswert pro m² zu hoch";
    return null;
};

/**
 * Validates all inputs and returns an object with field-specific errors
 * Returns null if all inputs are valid
 */
export const validateInputs = (inputs) => {
    const errors = {};

    // Basic fields
    const kaufpreisError = validateKaufpreis(inputs.kaufpreis);
    if (kaufpreisError) errors.kaufpreis = kaufpreisError;

    const baujahrError = validateBaujahr(inputs.baujahr);
    if (baujahrError) errors.baujahr = baujahrError;

    const kaufjahrError = validateKaufjahr(inputs.kaufjahr, inputs.baujahr);
    if (kaufjahrError) errors.kaufjahr = kaufjahrError;

    const grundstuecksflaecheError = validateGrundstuecksflaeche(inputs.grundstuecksflaeche);
    if (grundstuecksflaecheError) errors.grundstuecksflaeche = grundstuecksflaecheError;

    const bodenrichtwertError = validateBodenrichtwert(inputs.bodenrichtwert);
    if (bodenrichtwertError) errors.bodenrichtwert = bodenrichtwertError;

    const meaError = validateMEA(inputs.meaZaehler, inputs.meaNenner);
    if (meaError) errors.mea = meaError;

    const wohnflaecheError = validateWohnflaeche(inputs.wohnflaeche);
    if (wohnflaecheError) errors.wohnflaeche = wohnflaecheError;

    // Method-specific validation
    if (inputs.berechnungsmethode === 'ertragswert') {
        const mieteError = validateMonatskaltmiete(inputs.monatskaltmiete);
        if (mieteError) errors.monatskaltmiete = mieteError;

        const zinssatzError = validateLiegenschaftszinssatz(inputs.liegenschaftszinssatz);
        if (zinssatzError) errors.liegenschaftszinssatz = zinssatzError;
    }

    if (inputs.berechnungsmethode === 'vergleichswert') {
        const vergleichswertError = validateVergleichswertProQm(inputs.vergleichswertProQm);
        if (vergleichswertError) errors.vergleichswertProQm = vergleichswertError;
    }

    // Return null if no errors, otherwise return errors object
    return Object.keys(errors).length > 0 ? errors : null;
};
