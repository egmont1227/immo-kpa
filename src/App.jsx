import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, Building, MapPin, TrendingUp, Calendar, Euro, 
  FileText, Info, Sparkles, Bot, ArrowRight, CheckCircle2, AlertCircle, Loader2, X,
  Percent, Divide, Home, Car, Layers, HelpCircle, BarChart3, Wand2
} from 'lucide-react';

// --- API CONFIGURATION ---
// HINWEIS: Für die Docker/Vite Umgebung nutzen wir import.meta.env.
// Für die lokale Vorschau hier nutzen wir einen Fallback, damit der Code nicht abstürzt.
// Im Docker Container wird der Key über VITE_GOOGLE_API_KEY injiziert.
let apiKey = "";
try {
  // Versuche sicher auf import.meta.env zuzugreifen
  if (import.meta && import.meta.env && import.meta.env.VITE_GOOGLE_API_KEY) {
    apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  }
} catch (e) {
  console.log("Lokale Vorschau-Umgebung: Nutze Standard-Key Konfiguration");
}

// --- TAILWIND SETUP & SAFETY CHECK ---
if (typeof window !== 'undefined') {
  if (!window.tailwind) {
     const script = document.createElement('script');
     script.src = "https://cdn.tailwindcss.com";
     script.async = true;
     script.onload = () => {
       window.tailwind.config = {
         theme: {
           extend: {
             animation: {
               'shimmer': 'shimmer 1.5s infinite',
               'scaleIn': 'scaleIn 0.2s ease-out',
             },
             keyframes: {
               shimmer: {
                 '100%': { transform: 'translateX(100%)' },
               },
               scaleIn: {
                 from: { opacity: '0', transform: 'scale(0.95)' },
                 to: { opacity: '1', transform: 'scale(1)' },
               }
             }
           }
         }
       };
     };
     document.head.appendChild(script);
  }
}

// --- DATENBASIS ---

const BAUPREISINDEX = {
  2025: 187.2, 2024: 183.3, 2023: 177.9, 2022: 164.0, 2021: 141.0,
  2020: 136.0, 2019: 132.0, 2018: 127.0, 2017: 122.0, 2016: 118.0,
  2015: 114.0, 2014: 112.0, 2013: 110.0, 2012: 108.0, 2011: 104.0,
  2010: 100.0, 2009: 98.0,  2008: 97.0,  2005: 87.0,  2000: 84.0,
  1995: 80.0,  1990: 70.0,  1980: 55.0,  1970: 35.0,  1960: 20.0
};

const NHK_2010_DATA = {
  efh: { label: "Ein-/Zweifamilienhaus (freistehend)", costs: [660, 735, 845, 1020, 1275] },
  dhh: { label: "Doppelhaushälfte / Reihenendhaus", costs: [635, 705, 810, 975, 1215] },
  rmh: { label: "Reihenmittelhaus", costs: [545, 605, 695, 840, 1050] },
  etw_small: { label: "Eigentumswohnung (< 6 WE)", costs: [710, 820, 960, 1100, 1350] },
  etw_large: { label: "Eigentumswohnung (> 6 WE)", costs: [810, 940, 1100, 1250, 1500] },
  mfh: { label: "Mehrfamilienhaus (Mietwohngrundstück)", costs: [680, 780, 900, 1050, 1300] },
  buero: { label: "Büro-/Verwaltungsgebäude", costs: [850, 1000, 1150, 1300, 1600] },
};

const STANDARD_LABELS = [
  "1 - Sehr einfach (Behelfsbauten)",
  "2 - Einfach (bis 1950, keine Heizung/Bad)",
  "3 - Mittel (Standardbauweise)",
  "4 - Gehoben (Gute Ausstattung)",
  "5 - Stark gehoben (Luxus)"
];

// --- COMPONENTS ---

const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 overflow-hidden ${className}`}>
    {children}
  </div>
);

const GradientButton = ({ onClick, disabled, children, icon: Icon, variant = "primary" }) => {
  const baseClass = "relative group overflow-hidden rounded-xl px-6 py-3 font-semibold transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg hover:shadow-indigo-500/30",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 shadow-sm",
    ai: "bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-lg hover:shadow-fuchsia-500/30",
    magic: "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg hover:shadow-orange-500/30"
  };
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseClass} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {Icon && <Icon className={`w-5 h-5 ${variant === 'ai' || variant === 'magic' ? 'animate-pulse' : ''}`} />}
      {children}
      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
    </button>
  );
};

const Tooltip = ({ text }) => (
  <div className="group relative flex items-center ml-1.5">
    <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help hover:text-indigo-600 transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden w-64 p-3 bg-slate-800 text-white text-xs font-normal rounded-lg shadow-xl group-hover:block z-50 pointer-events-none animate-[scaleIn_0.1s_ease-out] leading-relaxed">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

const InputField = ({ label, value, onChange, type = "number", icon: Icon, suffix, step = "1", hint, tooltip }) => (
  <div className="group">
    <label className="block text-sm font-medium text-slate-600 mb-1.5 flex justify-between items-center">
      <div className="flex items-center">
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </div>
      {hint && <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-400 rounded-full">{hint}</span>}
    </label>
    <div className="relative transition-all duration-300 focus-within:transform focus-within:scale-[1.01]">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
        step={step}
        className={`block w-full rounded-xl border-slate-200 pl-11 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 font-medium shadow-sm py-3 bg-white/50 hover:bg-white transition-all ${!value && value !== 0 ? 'bg-slate-50' : ''}`}
        placeholder="0"
      />
      {suffix && (
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <span className="text-slate-400 text-sm font-medium">{suffix}</span>
        </div>
      )}
    </div>
  </div>
);

const MethodToggle = ({ method, setMethod }) => (
  <div className="flex p-1 bg-slate-200/50 rounded-xl relative mb-6">
    {/* Animated Background Slider */}
    <div 
      className={`absolute h-[calc(100%-8px)] w-[calc(33.333%-5px)] top-1 bg-white rounded-lg shadow-sm transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]`}
      style={{
        left: method === 'sachwert' ? '4px' : method === 'ertragswert' ? 'calc(33.333% + 2px)' : 'calc(66.666%)'
      }}
    />
    
    <button 
      onClick={() => setMethod('sachwert')}
      className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-2 text-[13px] font-bold transition-colors ${method === 'sachwert' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
    >
      <Home className="w-3.5 h-3.5" /> Sachwert
    </button>
    <button 
      onClick={() => setMethod('ertragswert')}
      className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-2 text-[13px] font-bold transition-colors ${method === 'ertragswert' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
    >
      <TrendingUp className="w-3.5 h-3.5" /> Ertragswert
    </button>
    <button 
      onClick={() => setMethod('vergleichswert')}
      className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-2 text-[13px] font-bold transition-colors ${method === 'vergleichswert' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
    >
      <BarChart3 className="w-3.5 h-3.5" /> Vergleich
    </button>
  </div>
);

export default function App() {
  // --- STATE ---
  const [inputs, setInputs] = useState({
    // Grunddaten
    kaufpreis: 500000,
    baujahr: 1995,
    kaufjahr: 2024,
    gesamtnutzungsdauer: 80,
    
    // Grundstück & MEA
    grundstuecksflaeche: 800, 
    bodenrichtwert: 320,
    meaZaehler: 1000, 
    meaNenner: 1000,  
    
    // Methode
    berechnungsmethode: 'sachwert', // 'sachwert' | 'ertragswert' | 'vergleichswert'

    // Sachwert Spezifisch
    wohnflaeche: 140,
    gebaeudetyp: 'efh',
    standardstufe: 3, // 1-5 (Default: Mittel)
    regionalfaktor: 1.0, 
    sachwertfaktor: 1.0, 

    // Ertragswert / Allgemein
    monatskaltmiete: 1500, 
    anzahlWohnungen: 1, 
    anzahlGaragen: 1,   
    liegenschaftszinssatz: 4.5,

    // Vergleichswert Spezifisch
    vergleichswertProQm: 3500, // EUR/m²
  });

  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Load Tailwind CSS
  useEffect(() => {
    if (!document.getElementById('tailwind-script')) {
      const script = document.createElement('script');
      script.id = 'tailwind-script';
      script.src = "https://cdn.tailwindcss.com";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // --- BERECHNUNGSLOGIK ---
  const results = useMemo(() => {
    const {
      kaufpreis, grundstuecksflaeche, bodenrichtwert, wohnflaeche,
      baujahr, kaufjahr, gebaeudetyp, gesamtnutzungsdauer,
      meaZaehler, meaNenner, berechnungsmethode, standardstufe,
      regionalfaktor, sachwertfaktor,
      monatskaltmiete, anzahlWohnungen, anzahlGaragen, liegenschaftszinssatz,
      vergleichswertProQm
    } = inputs;

    // 1. Bodenwert (Identisch für alle Verfahren)
    const meaAnteil = (meaZaehler && meaNenner) ? (meaZaehler / meaNenner) : 1;
    const relevanteGrundstuecksflaeche = grundstuecksflaeche * meaAnteil;
    const bodenwert = relevanteGrundstuecksflaeche * bodenrichtwert;

    // Alter & RND
    const alter = Math.max(0, kaufjahr - baujahr);
    const restnutzungsdauer = Math.max(gesamtnutzungsdauer - alter, 0);

    let vorlaeufigerGebaeudewert = 0;
    let gesamtwertBerechnet = 0;
    let berechnungsDetails = {};

    if (berechnungsmethode === 'sachwert') {
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
      
      vorlaeufigerGebaeudewert = Math.max(0, herstellungskostenGesamt - wertminderungEuro); 
      const vorlaeufigerSachwert = bodenwert + vorlaeufigerGebaeudewert;
      const marktangepassterSachwert = vorlaeufigerSachwert * sachwertfaktor;
      
      gesamtwertBerechnet = vorlaeufigerSachwert; 

      berechnungsDetails = {
        typ: 'Sachwert',
        index: baupreisindexAktuell,
        nhkBasis: nhkBasis,
        hkGebaeude: herstellungskostenGebaeude,
        hkGaragen: herstellungskostenGaragen,
        herstellungskosten: herstellungskostenGesamt,
        wertminderung: wertminderungEuro,
        marktangepassterSachwert: marktangepassterSachwert 
      };

    } else if (berechnungsmethode === 'ertragswert') {
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

      vorlaeufigerGebaeudewert = gebaeudereinertrag * vervielfaeltiger;
      gesamtwertBerechnet = bodenwert + vorlaeufigerGebaeudewert;

      berechnungsDetails = {
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
      };
    } else {
      // --- VERGLEICHSWERTVERFAHREN ---
      const vergleichswertGesamt = wohnflaeche * vergleichswertProQm;
      
      // Beim VWV wird oft der Gesamtwert ermittelt. Der Bodenwertanteil ist fix (BRW).
      // Der Gebäudeanteil ist der Rest.
      gesamtwertBerechnet = vergleichswertGesamt;
      vorlaeufigerGebaeudewert = Math.max(0, gesamtwertBerechnet - bodenwert);

      berechnungsDetails = {
        typ: 'Vergleichswert',
        vergleichswertGesamt
      };
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
  }, [inputs]);


  // --- GEMINI: EXPERT ANALYSIS ---
  const generateAiAnalysis = async () => {
    setIsAiLoading(true);
    setAiError(null);
    setShowAiModal(true);

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
      setAiError("Verbindung zum KI-Experten fehlgeschlagen. Bitte API Key prüfen.");
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Formatters
  const fmtEuro = (val) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  const fmtPercent = (val) => new Intl.NumberFormat('de-DE', { style: 'percent', minimumFractionDigits: 2 }).format(val);
  const fmtDec = (val) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format(val);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 relative overflow-x-hidden">
      
      {/* Ambient Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-200/30 blur-[100px]" />
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-200/30 blur-[120px]" />
      </div>

      <header className="relative z-10 backdrop-blur-md bg-white/70 border-b border-white/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/30">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                Kaufpreis<span className="text-indigo-600">Manager</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">Investoren Tool & Steuer-Optimierung</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-indigo-50/50 rounded-full border border-indigo-100">
             <span className="text-xs font-semibold text-indigo-900">V 3.2 (Lean)</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* INPUTS */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="p-6 md:p-8">
              <div className="flex items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
                 <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-lg font-bold text-slate-800">Objektdaten</h2>
                 </div>
              </div>

              <MethodToggle method={inputs.berechnungsmethode} setMethod={(m) => setInputs({...inputs, berechnungsmethode: m})} />
              
              <div className="space-y-5">
                <InputField 
                  label="Kaufpreis (Gesamt)" 
                  value={inputs.kaufpreis} 
                  onChange={v => setInputs({...inputs, kaufpreis: v})} 
                  icon={Euro} 
                  suffix="EUR" 
                  tooltip="Der Gesamtkaufpreis gemäß notariellem Kaufvertrag (inkl. mitverkauftem Zubehör, ohne Erwerbsnebenkosten)."
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField 
                    label="Baujahr" 
                    value={inputs.baujahr} 
                    onChange={v => setInputs({...inputs, baujahr: v})} 
                    icon={Calendar} 
                    tooltip="Jahr der Bezugsfertigkeit des Gebäudes. Bei Kernsanierung kann ggf. ein fiktives (neueres) Baujahr angesetzt werden."
                  />
                  <InputField 
                    label="Kaufjahr" 
                    value={inputs.kaufjahr} 
                    onChange={v => setInputs({...inputs, kaufjahr: v})} 
                    icon={Calendar} 
                    tooltip="Jahr des wirtschaftlichen Übergangs (Nutzen-Lasten-Wechsel)."
                  />
                </div>

                <div className="pt-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> Lage & MEA
                  </h3>
                  <InputField 
                    label="Bodenrichtwert" 
                    value={inputs.bodenrichtwert} 
                    onChange={v => setInputs({...inputs, bodenrichtwert: v})} 
                    icon={TrendingUp} 
                    suffix="€/m²" 
                    tooltip="Amtlicher Wert für unbebauten Boden. Zu finden im Bodenrichtwertinformationssystem (BORIS) Ihres Bundeslandes oder beim Gutachterausschuss."
                  />
                  
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="grid grid-cols-12 gap-3">
                      <div className="col-span-12">
                        <InputField label="Grundstück (Gesamt)" value={inputs.grundstuecksflaeche} onChange={v => setInputs({...inputs, grundstuecksflaeche: v})} icon={MapPin} suffix="m²" tooltip="Die Gesamtfläche des Flurstücks laut Grundbuch oder Kaufvertrag." />
                      </div>
                      <div className="col-span-5"><InputField label="MEA Zähler" value={inputs.meaZaehler} onChange={v => setInputs({...inputs, meaZaehler: v})} icon={Divide} tooltip="Miteigentumsanteil Zähler (z.B. 150)" /></div>
                      <div className="col-span-2 flex items-center justify-center text-slate-400 font-bold text-xl pt-4">/</div>
                      <div className="col-span-5"><InputField label="MEA Nenner" value={inputs.meaNenner} onChange={v => setInputs({...inputs, meaNenner: v})} icon={Divide} tooltip="Miteigentumsanteil Nenner (z.B. 10.000)" /></div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2 mt-4">
                    <Building className="w-3 h-3" /> {inputs.berechnungsmethode === 'sachwert' ? 'Bausubstanz (Sachwert)' : (inputs.berechnungsmethode === 'ertragswert' ? 'Ertragssituation (Ertragswert)' : 'Vergleichsdaten (Vergleichswert)')}
                  </h3>

                  {/* SACHWERT INPUTS */}
                  {inputs.berechnungsmethode === 'sachwert' && (
                    <>
                       <div className="mb-4 group">
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">Gebäudeart</label>
                        <div className="relative">
                           <Building className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
                          <select
                            value={inputs.gebaeudetyp}
                            onChange={e => setInputs({...inputs, gebaeudetyp: e.target.value})}
                            className="block w-full rounded-xl border-slate-200 pl-11 py-3 bg-white/50 text-slate-800 text-sm font-medium shadow-sm"
                          >
                            {Object.entries(NHK_2010_DATA).map(([key, data]) => (
                              <option key={key} value={key}>{data.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-600 mb-1.5 flex justify-between">
                           <div className="flex items-center">
                              Ausstattungsstandard
                              <Tooltip text="Standardstufe gemäß Sachwertrichtlinie (SW-RL). 3 entspricht einer durchschnittlichen, zeitgemäßen Ausstattung." />
                           </div>
                           <span className="text-indigo-600 font-bold">{inputs.standardstufe}</span>
                        </label>
                        <input 
                           type="range" min="1" max="5" step="1"
                           value={inputs.standardstufe}
                           onChange={(e) => setInputs({...inputs, standardstufe: parseInt(e.target.value)})}
                           className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="text-[10px] text-slate-500 mt-1 text-center font-medium">
                           {STANDARD_LABELS[inputs.standardstufe - 1]}
                        </div>
                      </div>

                       <InputField label="Wohn-/Nutzfläche" value={inputs.wohnflaeche} onChange={v => setInputs({...inputs, wohnflaeche: v})} icon={Building} suffix="m²" tooltip="Fläche gemäß Wohnflächenverordnung (WoFlV) oder Kaufvertrag. Bei Gewerbe die Nutzfläche." />
                       <InputField label="Anzahl Garagen" value={inputs.anzahlGaragen} onChange={v => setInputs({...inputs, anzahlGaragen: v})} icon={Car} suffix="Stk" tooltip="Anzahl der Garagenstellplätze (Einzelgaragen oder Tiefgarage)." />
                       
                       <InputField 
                         label="Regionalfaktor" 
                         value={inputs.regionalfaktor} 
                         onChange={v => setInputs({...inputs, regionalfaktor: v})} 
                         icon={MapPin} 
                         step="0.01" 
                         tooltip="Anpassungsfaktor der Baukosten an das regionale Preisniveau. Zu finden im Grundstücksmarktbericht des lokalen Gutachterausschusses."
                       />
                       <InputField 
                         label="Sachwertfaktor" 
                         value={inputs.sachwertfaktor} 
                         onChange={v => setInputs({...inputs, sachwertfaktor: v})} 
                         icon={Layers} 
                         step="0.01" 
                         tooltip="Marktanpassungsfaktor (MAF) des Gutachterausschusses. Dient dazu, den rechnerischen Sachwert an die tatsächliche Marktlage anzupassen."
                       />
                    </>
                  )}

                  {/* ERTRAGSWERT INPUTS */}
                  {inputs.berechnungsmethode === 'ertragswert' && (
                    <>
                      <InputField label="Monatliche Nettokaltmiete" value={inputs.monatskaltmiete} onChange={v => setInputs({...inputs, monatskaltmiete: v})} icon={Euro} suffix="pro Monat" tooltip="Die nachhaltig erzielbare monatliche Nettokaltmiete (ohne Heizung/Betriebskosten)." />
                      <div className="grid grid-cols-2 gap-4">
                         <InputField label="Anzahl Wohnungen" value={inputs.anzahlWohnungen} onChange={v => setInputs({...inputs, anzahlWohnungen: v})} icon={Home} suffix="Eh" tooltip="Anzahl der Wohneinheiten (wichtig für Verwaltungskosten-Pauschale)." />
                        <InputField label="Anzahl Garagen" value={inputs.anzahlGaragen} onChange={v => setInputs({...inputs, anzahlGaragen: v})} icon={Car} suffix="Stk" tooltip="Anzahl der Stellplätze (wichtig für Instandhaltungs-Pauschale)." />
                      </div>
                      <InputField label="Wohnfläche" value={inputs.wohnflaeche} onChange={v => setInputs({...inputs, wohnflaeche: v})} icon={Building} suffix="m²" tooltip="Wohnfläche zur Berechnung der Instandhaltungskosten pro m²." />
                      <InputField label="Liegenschaftszinssatz" value={inputs.liegenschaftszinssatz} onChange={v => setInputs({...inputs, liegenschaftszinssatz: v})} icon={Percent} suffix="%" step="0.1" tooltip="Zinssatz zur Kapitalisierung der Reinerträge. Wird vom Gutachterausschuss im Marktbericht veröffentlicht." />
                    </>
                  )}

                  {/* VERGLEICHSWERT INPUTS */}
                  {inputs.berechnungsmethode === 'vergleichswert' && (
                    <>
                       <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 mb-4">
                         <p className="text-xs text-indigo-800">
                           Geeignet für Eigentumswohnungen (ETW), wenn im Marktbericht Vergleichspreise (Euro/m²) veröffentlicht werden.
                         </p>
                       </div>
                       <InputField label="Wohnfläche" value={inputs.wohnflaeche} onChange={v => setInputs({...inputs, wohnflaeche: v})} icon={Building} suffix="m²" tooltip="Wohnfläche der Eigentumswohnung gemäß Kaufvertrag." />
                       <InputField label="Vergleichswert pro m²" value={inputs.vergleichswertProQm} onChange={v => setInputs({...inputs, vergleichswertProQm: v})} icon={BarChart3} suffix="€/m²" tooltip="Durchschnittlicher Kaufpreis pro m² für vergleichbare Wohnungen aus dem Grundstücksmarktbericht oder einer Kaufpreissammlung." />
                    </>
                  )}

                </div>
              </div>
            </GlassCard>
          </div>

          {/* RESULTS */}
          <div className="lg:col-span-8 space-y-6">
             
             {/* AI CALL TO ACTION */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-1 shadow-xl">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Sparkles className="w-24 h-24" />
              </div>
              <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-fuchsia-500 to-purple-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/40">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">KI-Experten Check</h3>
                    <p className="text-slate-300 text-sm">Lass die Quote von Gemini prüfen und erhalte Steuertipps.</p>
                  </div>
                </div>
                <GradientButton variant="ai" onClick={generateAiAnalysis} disabled={isAiLoading}>
                  {isAiLoading ? 'Analysiere...' : 'Jetzt Analyse starten'}
                </GradientButton>
              </div>
            </div>

             {/* KPI Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GlassCard className="p-6 border-t-4 border-t-green-500 relative group">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity text-green-200">
                  <Building className="w-12 h-12" />
                </div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Abschreibbare Basis</div>
                <div className="text-3xl font-bold text-slate-900 tracking-tight">{fmtEuro(results.finalGebaeudewert)}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold">
                    {fmtPercent(results.quoteGebaeude)}
                  </span>
                  <span className="text-slate-400 text-xs">Gebäudeanteil</span>
                </div>
              </GlassCard>

              <GlassCard className="p-6 border-t-4 border-t-amber-500 relative group">
                 <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity text-amber-100">
                  <MapPin className="w-12 h-12" />
                </div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Bodenwert (Keine AfA)</div>
                <div className="text-3xl font-bold text-slate-900 tracking-tight">{fmtEuro(results.finalBodenwert)}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-bold">
                    {fmtPercent(results.quoteBoden)}
                  </span>
                  <span className="text-slate-400 text-xs">Bodenanteil</span>
                </div>
              </GlassCard>

              <GlassCard className="p-6 border-t-4 border-t-indigo-500 bg-gradient-to-br from-white to-indigo-50/50">
                <div className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">Steuervorteil (AfA p.a.)</div>
                <div className="text-3xl font-bold text-indigo-900 tracking-tight">{fmtEuro(results.afaProJahr)}</div>
                <div className="mt-2 text-xs text-indigo-600 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Linear 2% (Standard)
                </div>
              </GlassCard>
            </div>

            {/* VISUALIZATION */}
            <div className="grid grid-cols-1 gap-6">
              <GlassCard className="p-8">
                 <div className="flex justify-between items-end mb-6">
                  <h3 className="text-lg font-bold text-slate-800">Kaufpreisverteilung</h3>
                  <div className="text-sm font-medium text-slate-500">Gesamt: {fmtEuro(inputs.kaufpreis)}</div>
                </div>

                {/* Standard Bar */}
                <div className="mb-6">
                   <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
                      <span>Aktuelle Berechnung (Verhältnis {results.quoteGebaeude > 0 ? (results.finalGebaeudewert/results.finalBodenwert).toFixed(2) : 0}:1)</span>
                      <span className="text-slate-400 font-normal">Standard nach BMF</span>
                   </div>
                   <div className="relative h-14 w-full rounded-2xl overflow-hidden flex shadow-inner bg-slate-100 ring-4 ring-white">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-300 to-amber-400 flex items-center justify-center text-amber-900/80 font-bold text-lg transition-all duration-700 relative"
                      style={{ width: `${results.quoteBoden * 100}%` }}
                    >
                       <span className="z-10 drop-shadow-sm flex flex-col items-center leading-tight">
                          <span className="text-[10px] uppercase opacity-70">Boden</span>
                          <div className="flex items-center gap-1 text-sm">
                            <span>{Math.round(results.quoteBoden * 100)}%</span>
                            <span className="text-xs opacity-80">({fmtEuro(results.finalBodenwert)})</span>
                          </div>
                        </span>
                      <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
                    </div>
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg transition-all duration-700 relative"
                      style={{ width: `${results.quoteGebaeude * 100}%` }}
                    >
                        <span className="z-10 drop-shadow-md flex flex-col items-center leading-tight">
                          <span className="text-[10px] uppercase opacity-80">Gebäude</span>
                           <div className="flex items-center gap-1 text-sm">
                            <span>{Math.round(results.quoteGebaeude * 100)}%</span>
                            <span className="text-xs opacity-80">({fmtEuro(results.finalGebaeudewert)})</span>
                          </div>
                        </span>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                    </div>
                  </div>
                </div>

                {/* Optimized Bar */}
                <div className="mb-4 relative">
                   <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-12 bg-indigo-200 rounded-full hidden md:block"></div>
                   <div className="flex justify-between items-center mb-2">
                      <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Optimiert (Verhältnis +15%)
                      </div>
                   </div>
                   <div className="relative h-14 w-full rounded-2xl overflow-hidden flex shadow-inner bg-indigo-50 ring-4 ring-indigo-100/50 opacity-90">
                    <div 
                      className="h-full bg-amber-200/60 flex items-center justify-center text-amber-900/60 font-bold text-lg transition-all duration-700 relative border-r border-white/30"
                      style={{ width: `${results.quoteBodenOptimiertVis * 100}%` }}
                    >
                        <span className="z-10 drop-shadow-sm flex flex-col items-center leading-tight scale-90">
                          <span className="text-[10px] uppercase opacity-70">Boden</span>
                           <div className="flex items-center gap-1 text-sm">
                            <span>{Math.round(results.quoteBodenOptimiertVis * 100)}%</span>
                            <span className="text-xs opacity-80">({fmtEuro(results.finalBodenwertOptimized)})</span>
                           </div>
                        </span>
                    </div>
                    <div 
                      className="h-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg transition-all duration-700 relative"
                      style={{ width: `${results.quoteGebaeudeOptimiertVis * 100}%` }}
                    >
                        <span className="z-10 drop-shadow-md flex flex-col items-center leading-tight">
                           <span className="text-[10px] uppercase opacity-80">Gebäude (Optimiert)</span>
                            <div className="flex items-center gap-1 text-sm">
                             <span>{Math.round(results.quoteGebaeudeOptimiertVis * 100)}%</span>
                             <span className="text-xs opacity-80">({fmtEuro(results.finalGebaeudewertOptimized)})</span>
                           </div>
                        </span>
                      {/* Stripes Pattern */}
                      <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'linear-gradient(45deg, #fff 25%, transparent 25%, transparent 50%, #fff 50%, #fff 75%, transparent 75%, transparent)', backgroundSize: '20px 20px'}}></div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 text-right flex justify-end items-center gap-1">
                    <Info className="w-3 h-3" />
                    Rundung auf volle 1.000 EUR für Vertragsgestaltung
                  </p>
                </div>

                {/* Detail Table */}
                <div className="mt-8">
                   <div className="flex items-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-slate-100"></div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Berechnung ({inputs.berechnungsmethode === 'sachwert' ? 'Sachwertverfahren' : (inputs.berechnungsmethode === 'ertragswert' ? 'Ertragswertverfahren' : 'Vergleichswertverfahren')})
                    </span>
                    <div className="h-px flex-1 bg-slate-100"></div>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-slate-100">
                        {/* BODENWERT */}
                        <tr className="group hover:bg-white transition-colors">
                          <td className="px-6 py-3 text-slate-600">
                            Bodenwert (Anteilig: {results.relevanteGrundstuecksflaeche.toFixed(1)} m²)
                          </td>
                          <td className="px-6 py-3 text-right font-medium text-slate-900">{fmtEuro(results.bodenwert)}</td>
                        </tr>

                        {inputs.berechnungsmethode === 'sachwert' && (
                          /* SACHWERT DETAILS */
                          <>
                            <tr className="group hover:bg-white transition-colors">
                              <td className="px-6 py-3 text-slate-600">
                                Gebäude-HK (NHK {results.details.nhkBasis}€/m² × {inputs.wohnflaeche}m² + Index)
                              </td>
                              <td className="px-6 py-3 text-right font-medium text-slate-900">{fmtEuro(results.details.hkGebaeude)}</td>
                            </tr>
                            <tr className="group hover:bg-white transition-colors">
                              <td className="px-6 py-3 text-slate-600">
                                + Garagen/Außenanl. ({inputs.anzahlGaragen} Stk.)
                              </td>
                              <td className="px-6 py-3 text-right font-medium text-slate-900">{fmtEuro(results.details.hkGaragen)}</td>
                            </tr>
                            <tr className="group hover:bg-white transition-colors bg-slate-100/50">
                              <td className="px-6 py-3 text-slate-600 font-medium">
                                = Summe Herstellungskosten
                              </td>
                              <td className="px-6 py-3 text-right font-medium text-slate-900">{fmtEuro(results.details.herstellungskosten)}</td>
                            </tr>
                            <tr className="group hover:bg-white transition-colors">
                              <td className="px-6 py-3 text-slate-600 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                Alterswertminderung ({results.alter} Jahre)
                              </td>
                              <td className="px-6 py-3 text-right font-medium text-red-500">-{fmtEuro(results.details.wertminderung)}</td>
                            </tr>
                            <tr className="group hover:bg-white transition-colors bg-indigo-50/30">
                               <td className="px-6 py-3 text-slate-700 font-medium">
                                = Vorläufiger Gebäudesachwert
                              </td>
                              <td className="px-6 py-3 text-right font-bold text-indigo-700">{fmtEuro(results.vorlaeufigerGebaeudewert)}</td>
                            </tr>
                            <tr className="group hover:bg-white transition-colors">
                               <td className="px-6 py-3 text-slate-600 font-medium">
                                + Bodenwert
                              </td>
                              <td className="px-6 py-3 text-right font-medium text-slate-900">{fmtEuro(results.bodenwert)}</td>
                            </tr>
                            {inputs.sachwertfaktor !== 1 && (
                              <tr className="group hover:bg-white transition-colors bg-indigo-100/50">
                                 <td className="px-6 py-3 text-indigo-800 font-medium flex items-center gap-2">
                                  <Layers className="w-4 h-4" />
                                  Marktangepasster Sachwert (Faktor {fmtDec(inputs.sachwertfaktor)})
                                  <span className="text-xs font-normal text-slate-500 ml-auto mr-4">(Info)</span>
                                </td>
                                <td className="px-6 py-3 text-right font-bold text-indigo-900">{fmtEuro(results.details.marktangepassterSachwert)}</td>
                              </tr>
                            )}
                          </>
                        )}

                        {inputs.berechnungsmethode === 'ertragswert' && (
                          /* ERTRAGSWERT DETAILS */
                          <>
                            <tr className="group hover:bg-white transition-colors">
                              <td className="px-6 py-3 text-slate-600 font-medium">
                                Jahresrohertrag (Miete)
                              </td>
                              <td className="px-6 py-3 text-right font-medium text-slate-900">{fmtEuro(results.details.jahresrohertrag)}</td>
                            </tr>
                            <tr className="group hover:bg-white transition-colors">
                              <td className="px-6 py-3 text-slate-500 pl-10 text-xs">
                                - Verwaltung ({fmtEuro(results.details.bwk.verwaltung)}) & Instandhaltung ({fmtEuro(results.details.bwk.instandhaltung)})
                              </td>
                              <td className="px-6 py-3 text-right text-xs text-slate-500"></td>
                            </tr>
                            <tr className="group hover:bg-white transition-colors">
                              <td className="px-6 py-3 text-slate-500 pl-10 text-xs">
                                - Mietausfallwagnis (2%)
                              </td>
                              <td className="px-6 py-3 text-right text-xs text-slate-500">-{fmtEuro(results.details.bwk.mietausfall)}</td>
                            </tr>
                            <tr className="group hover:bg-white transition-colors bg-slate-100/50">
                              <td className="px-6 py-3 text-slate-600 font-medium">
                                = Reinertrag (Netto)
                              </td>
                              <td className="px-6 py-3 text-right font-medium text-slate-900">{fmtEuro(results.details.reinertrag)}</td>
                            </tr>
                            <tr className="group hover:bg-white transition-colors">
                               <td className="px-6 py-3 text-slate-600 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                Bodenwertverzinsung (Liegenschaftszins)
                              </td>
                              <td className="px-6 py-3 text-right font-medium text-red-500">-{fmtEuro(results.details.bodenwertverzinsung)}</td>
                            </tr>
                            <tr className="group hover:bg-white transition-colors bg-indigo-50/20">
                               <td className="px-6 py-3 text-slate-700 font-medium">
                                = Reinertragsanteil der baulichen Anlagen
                              </td>
                              <td className="px-6 py-3 text-right font-medium text-slate-900">{fmtEuro(results.details.gebaeudereinertrag)}</td>
                            </tr>
                             <tr className="group hover:bg-white transition-colors bg-indigo-50/30">
                               <td className="px-6 py-3 text-slate-700 font-medium">
                                = Vorläufiger Ertragswert der baulichen Anlagen
                                <span className="block text-xs font-normal text-slate-500">Reinertragsanteil x Vervielfältiger ({results.details.vervielfaeltiger.toFixed(2)})</span>
                              </td>
                              <td className="px-6 py-3 text-right font-bold text-indigo-700">{fmtEuro(results.vorlaeufigerGebaeudewert)}</td>
                            </tr>
                            <tr className="group hover:bg-white transition-colors">
                               <td className="px-6 py-3 text-slate-600 font-medium">
                                + Bodenwert
                              </td>
                              <td className="px-6 py-3 text-right font-medium text-slate-900">{fmtEuro(results.bodenwert)}</td>
                            </tr>
                          </>
                        )}

                        {inputs.berechnungsmethode === 'vergleichswert' && (
                          /* VERGLEICHSWERT DETAILS */
                          <>
                            <tr className="group hover:bg-white transition-colors">
                              <td className="px-6 py-3 text-slate-600 font-medium">
                                Vergleichswert (Gesamt)
                              </td>
                              <td className="px-6 py-3 text-right font-medium text-slate-900">{fmtEuro(results.details.vergleichswertGesamt)}</td>
                            </tr>
                            <tr className="group hover:bg-white transition-colors">
                              <td className="px-6 py-3 text-slate-500 pl-10 text-xs">
                                Basis: {inputs.wohnflaeche} m² x {fmtEuro(inputs.vergleichswertProQm)} / m²
                              </td>
                              <td className="px-6 py-3 text-right text-xs text-slate-500"></td>
                            </tr>
                             <tr className="group hover:bg-white transition-colors">
                               <td className="px-6 py-3 text-slate-600 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                Abzug Bodenwert
                              </td>
                              <td className="px-6 py-3 text-right font-medium text-red-500">-{fmtEuro(results.bodenwert)}</td>
                            </tr>
                            <tr className="group hover:bg-white transition-colors bg-indigo-50/30">
                               <td className="px-6 py-3 text-slate-700 font-medium">
                                = Vorläufiger Gebäudewert (Restwert)
                              </td>
                              <td className="px-6 py-3 text-right font-bold text-indigo-700">{fmtEuro(results.vorlaeufigerGebaeudewert)}</td>
                            </tr>
                             <tr className="group hover:bg-white transition-colors">
                               <td className="px-6 py-3 text-slate-600 font-medium">
                                + Bodenwert
                              </td>
                              <td className="px-6 py-3 text-right font-medium text-slate-900">{fmtEuro(results.bodenwert)}</td>
                            </tr>
                          </>
                        )}

                        <tr className="bg-indigo-50/30 font-semibold border-t border-slate-200">
                          <td className="px-6 py-3 text-indigo-900">
                             {inputs.berechnungsmethode === 'sachwert' ? 'Gesamtsachwert' : (inputs.berechnungsmethode === 'ertragswert' ? 'Gesamtertragswert' : 'Gesamtvergleichswert')} (Kalkuliert)
                          </td>
                          <td className="px-6 py-3 text-right text-indigo-900">{fmtEuro(results.gesamtwertBerechnet)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </GlassCard>
            </div>

            <div className="flex justify-end gap-4">
              <GradientButton variant="secondary" onClick={() => window.print()} icon={FileText}>
                PDF Export
              </GradientButton>
            </div>

          </div>
        </div>
      </main>

      {/* AI MODAL OVERLAY */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAiModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-[scaleIn_0.2s_ease-out]">
            
            {/* Modal Header */}
            <div className="bg-slate-900 p-6 text-white flex justify-between items-start">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-fuchsia-500 to-purple-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Gemini Analyse</h3>
                    <p className="text-slate-400 text-xs">Powered by Google AI</p>
                  </div>
              </div>
              <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {isAiLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                  <p className="text-slate-500 font-medium animate-pulse">Experte prüft die Zahlen...</p>
                </div>
              ) : aiError ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" />
                  {aiError}
                </div>
              ) : (
                <div className="prose prose-slate prose-sm max-w-none">
                   {aiAnalysis && aiAnalysis.split('\n').map((line, i) => (
                     <p key={i} className={`mb-2 ${line.startsWith('**') ? 'font-bold text-slate-800' : 'text-slate-600'}`}>
                       {line.replace(/\*\*/g, '')}
                     </p>
                   ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}