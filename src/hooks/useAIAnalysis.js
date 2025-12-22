import { useState } from 'react';

// API key configuration
let apiKey = "";
try {
    if (import.meta && import.meta.env && import.meta.env.VITE_GOOGLE_API_KEY) {
        apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    }
} catch (e) {
    console.log("Lokale Vorschau-Umgebung: Nutze Standard-Key Konfiguration");
}

/**
 * Custom hook for AI analysis functionality
 */
export const useAIAnalysis = () => {
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);

    const generateAnalysis = async (inputs, results) => {
        setIsLoading(true);
        setError(null);
        setShowModal(true);

        const prompt = `
      Du bist ein Top-Experte für deutsche Immobilien-Steuerfragen.
      Analysiere diese Kaufpreisaufteilung für einen Investor.

      METHODE: ${inputs.berechnungsmethode === 'sachwert' ? 'Sachwertverfahren' : (inputs.berechnungsmethode === 'ertragswert' ? 'Ertragswertverfahren' : 'Vergleichswertverfahren')}
      
      DATEN:
      - Kaufpreis: ${inputs.kaufpreis} EUR
      - Baujahr: ${inputs.baujahr} (Alter: ${results.alter} Jahre)
      - Wohnfläche: ${inputs.wohnflaeche} m²
      - Bodenwertanteil: ${Math.round(results.quoteBoden * 100)}%
      - Gebäudeanteil: ${Math.round(results.quoteGebaeude * 100)}%
      
      AUFGABE:
      1. Bewerte die Quote von ${Math.round(results.quoteGebaeude * 100)}% Gebäudeanteil (AfA-Basis). Ist das für dieses Baujahr (${inputs.baujahr}) typisch oder auffällig?
      2. Gib eine kurze Empfehlung, ob sich ein Gutachten zur Restnutzungsdauer lohnen könnte (basierend auf Alter ${results.alter} Jahre).
      3. Bei ${inputs.berechnungsmethode === 'ertragswert' ? 'Ertragswert: Prüfe kritisch den Liegenschaftszinssatz von ' + inputs.liegenschaftszinssatz + '%.' : 'Sachwert: Wäre eine Ertragswertberechnung eventuell günstiger, wenn die Mieten niedrig sind?'}
      
      Antworte professionell, prägnant (max 150 Wörter) und formatiert mit Markdown.
    `;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message);
            }

            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            setAiAnalysis(text);
        } catch (err) {
            setError("Verbindung zum KI-Experten fehlgeschlagen. Bitte API Key prüfen.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        aiAnalysis,
        isLoading,
        showModal,
        error,
        generateAnalysis,
        closeModal: () => setShowModal(false)
    };
};
