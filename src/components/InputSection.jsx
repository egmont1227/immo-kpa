import React from 'react';
import {
    Euro, Calendar, MapPin, TrendingUp, Building, Car,
    Divide, Percent, Layers, BarChart3, Home, FileText
} from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { InputField } from './ui/InputField';
import { Tooltip } from './ui/Tooltip';
import { MethodToggle } from './MethodToggle';
import { NHK_2010_DATA, STANDARD_LABELS } from '../lib/constants';

export const InputSection = ({ inputs, updateInput, updateInputs, errors }) => {
    return (
        <GlassCard className="p-6 md:p-8">
            <div className="flex items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-lg font-bold text-slate-800">Objektdaten</h2>
                </div>
            </div>

            <MethodToggle
                method={inputs.berechnungsmethode}
                setMethod={(m) => updateInput('berechnungsmethode', m)}
            />

            <div className="space-y-5">
                <InputField
                    label="Kaufpreis (Gesamt)"
                    value={inputs.kaufpreis}
                    onChange={v => updateInput('kaufpreis', v)}
                    icon={Euro}
                    suffix="EUR"
                    tooltip="Der Gesamtkaufpreis gemäß notariellem Kaufvertrag (inkl. mitverkauftem Zubehör, ohne Erwerbsnebenkosten)."
                    error={errors?.kaufpreis}
                />

                <div className="grid grid-cols-2 gap-4">
                    <InputField
                        label="Baujahr"
                        value={inputs.baujahr}
                        onChange={v => updateInput('baujahr', v)}
                        icon={Calendar}
                        tooltip="Jahr der Bezugsfertigkeit des Gebäudes. Bei Kernsanierung kann ggf. ein fiktives (neueres) Baujahr angesetzt werden."
                        error={errors?.baujahr}
                    />
                    <InputField
                        label="Kaufjahr"
                        value={inputs.kaufjahr}
                        onChange={v => updateInput('kaufjahr', v)}
                        icon={Calendar}
                        tooltip="Jahr des wirtschaftlichen Übergangs (Nutzen-Lasten-Wechsel)."
                        error={errors?.kaufjahr}
                    />
                </div>

                <div className="pt-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Lage & MEA
                    </h3>
                    <InputField
                        label="Bodenrichtwert"
                        value={inputs.bodenrichtwert}
                        onChange={v => updateInput('bodenrichtwert', v)}
                        icon={TrendingUp}
                        suffix="€/m²"
                        tooltip="Amtlicher Wert für unbebauten Boden. Zu finden im Bodenrichtwertinformationssystem (BORIS) Ihres Bundeslandes oder beim Gutachterausschuss."
                        error={errors?.bodenrichtwert}
                    />

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mt-4">
                        <div className="grid grid-cols-12 gap-3">
                            <div className="col-span-12">
                                <InputField
                                    label="Grundstück (Gesamt)"
                                    value={inputs.grundstuecksflaeche}
                                    onChange={v => updateInput('grundstuecksflaeche', v)}
                                    icon={MapPin}
                                    suffix="m²"
                                    tooltip="Die Gesamtfläche des Flurstücks laut Grundbuch oder Kaufvertrag."
                                    error={errors?.grundstuecksflaeche}
                                />
                            </div>
                            <div className="col-span-5">
                                <InputField
                                    label="MEA Zähler"
                                    value={inputs.meaZaehler}
                                    onChange={v => updateInput('meaZaehler', v)}
                                    icon={Divide}
                                    tooltip="Miteigentumsanteil Zähler (z.B. 150)"
                                    error={errors?.mea}
                                />
                            </div>
                            <div className="col-span-2 flex items-center justify-center text-slate-400 font-bold text-xl pt-4">/</div>
                            <div className="col-span-5">
                                <InputField
                                    label="MEA Nenner"
                                    value={inputs.meaNenner}
                                    onChange={v => updateInput('meaNenner', v)}
                                    icon={Divide}
                                    tooltip="Miteigentumsanteil Nenner (z.B. 10.000)"
                                />
                            </div>
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
                                        onChange={e => updateInput('gebaeudetyp', e.target.value)}
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
                                    onChange={(e) => updateInput('standardstufe', parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                                <div className="text-[10px] text-slate-500 mt-1 text-center font-medium">
                                    {STANDARD_LABELS[inputs.standardstufe - 1]}
                                </div>
                            </div>

                            <InputField
                                label="Wohn-/Nutzfläche"
                                value={inputs.wohnflaeche}
                                onChange={v => updateInput('wohnflaeche', v)}
                                icon={Building}
                                suffix="m²"
                                tooltip="Fläche gemäß Wohnflächenverordnung (WoFlV) oder Kaufvertrag. Bei Gewerbe die Nutzfläche."
                                error={errors?.wohnflaeche}
                            />
                            <InputField
                                label="Anzahl Garagen"
                                value={inputs.anzahlGaragen}
                                onChange={v => updateInput('anzahlGaragen', v)}
                                icon={Car}
                                suffix="Stk"
                                tooltip="Anzahl der Garagenstellplätze (Einzelgaragen oder Tiefgarage)."
                            />

                            <InputField
                                label="Regionalfaktor"
                                value={inputs.regionalfaktor}
                                onChange={v => updateInput('regionalfaktor', v)}
                                icon={MapPin}
                                step="0.01"
                                tooltip="Anpassungsfaktor der Baukosten an das regionale Preisniveau. Zu finden im Grundstücksmarktbericht des lokalen Gutachterausschusses."
                            />
                            <InputField
                                label="Sachwertfaktor"
                                value={inputs.sachwertfaktor}
                                onChange={v => updateInput('sachwertfaktor', v)}
                                icon={Layers}
                                step="0.01"
                                tooltip="Marktanpassungsfaktor (MAF) des Gutachterausschusses. Dient dazu, den rechnerischen Sachwert an die tatsächliche Marktlage anzupassen."
                            />
                        </>
                    )}

                    {/* ERTRAGSWERT INPUTS */}
                    {inputs.berechnungsmethode === 'ertragswert' && (
                        <>
                            <InputField
                                label="Monatliche Nettokaltmiete"
                                value={inputs.monatskaltmiete}
                                onChange={v => updateInput('monatskaltmiete', v)}
                                icon={Euro}
                                suffix="pro Monat"
                                tooltip="Die nachhaltig erzielbare monatliche Nettokaltmiete (ohne Heizung/Betriebskosten)."
                                error={errors?.monatskaltmiete}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <InputField
                                    label="Anzahl Wohnungen"
                                    value={inputs.anzahlWohnungen}
                                    onChange={v => updateInput('anzahlWohnungen', v)}
                                    icon={Home}
                                    suffix="Eh"
                                    tooltip="Anzahl der Wohneinheiten (wichtig für Verwaltungskosten-Pauschale)."
                                />
                                <InputField
                                    label="Anzahl Garagen"
                                    value={inputs.anzahlGaragen}
                                    onChange={v => updateInput('anzahlGaragen', v)}
                                    icon={Car}
                                    suffix="Stk"
                                    tooltip="Anzahl der Stellplätze (wichtig für Instandhaltungs-Pauschale)."
                                />
                            </div>
                            <InputField
                                label="Wohnfläche"
                                value={inputs.wohnflaeche}
                                onChange={v => updateInput('wohnflaeche', v)}
                                icon={Building}
                                suffix="m²"
                                tooltip="Wohnfläche zur Berechnung der Instandhaltungskosten pro m²."
                                error={errors?.wohnflaeche}
                            />
                            <InputField
                                label="Liegenschaftszinssatz"
                                value={inputs.liegenschaftszinssatz}
                                onChange={v => updateInput('liegenschaftszinssatz', v)}
                                icon={Percent}
                                suffix="%"
                                step="0.1"
                                tooltip="Zinssatz zur Kapitalisierung der Reinerträge. Wird vom Gutachterausschuss im Marktbericht veröffentlicht."
                                error={errors?.liegenschaftszinssatz}
                            />
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
                            <InputField
                                label="Wohnfläche"
                                value={inputs.wohnflaeche}
                                onChange={v => updateInput('wohnflaeche', v)}
                                icon={Building}
                                suffix="m²"
                                tooltip="Wohnfläche der Eigentumswohnung gemäß Kaufvertrag."
                                error={errors?.wohnflaeche}
                            />
                            <InputField
                                label="Vergleichswert pro m²"
                                value={inputs.vergleichswertProQm}
                                onChange={v => updateInput('vergleichswertProQm', v)}
                                icon={BarChart3}
                                suffix="€/m²"
                                tooltip="Durchschnittlicher Kaufpreis pro m² für vergleichbare Wohnungen aus dem Grundstücksmarktbericht oder einer Kaufpreissammlung."
                                error={errors?.vergleichswertProQm}
                            />
                        </>
                    )}

                </div>
            </div>
        </GlassCard>
    );
};
