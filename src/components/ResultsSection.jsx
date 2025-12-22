import React from 'react';
import { Building, MapPin, TrendingUp, Info, Sparkles, FileText, Layers } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { GradientButton } from './ui/GradientButton';
import { AICallToAction } from './AICallToAction';
import { fmtEuro, fmtPercent, fmtDec } from '../lib/calculations';

export const ResultsSection = ({ inputs, results, onAIAnalyze, isAILoading }) => {
    if (!results) {
        return (
            <div className="space-y-6">
                <GlassCard className="p-8">
                    <div className="text-center text-slate-500 py-12">
                        <Info className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p className="font-medium">Bitte korrigieren Sie die Eingabefehler</p>
                        <p className="text-sm mt-1">Die Berechnung wird angezeigt, sobald alle Felder korrekt ausgefüllt sind.</p>
                    </div>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="space-y-6">
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
            <GlassCard className="p-8">
                <div className="flex justify-between items-end mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Kaufpreisverteilung</h3>
                    <div className="text-sm font-medium text-slate-500">Gesamt: {fmtEuro(inputs.kaufpreis)}</div>
                </div>

                {/* Standard Bar */}
                <div className="mb-6">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
                        <span>Aktuelle Berechnung (Verhältnis {results.quoteGebaeude > 0 ? (results.finalGebaeudewert / results.finalBodenwert).toFixed(2) : 0}:1)</span>
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
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
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
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #fff 25%, transparent 25%, transparent 50%, #fff 50%, #fff 75%, transparent 75%, transparent)', backgroundSize: '20px 20px' }}></div>
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

            <div className="flex flex-col gap-4">
                <GradientButton variant="secondary" onClick={() => window.print()} icon={FileText}>
                    PDF Export
                </GradientButton>

                {/* AI Analysis */}
                <AICallToAction
                    onAnalyze={onAIAnalyze}
                    isLoading={isAILoading}
                />
            </div>
        </div>
    );
};
