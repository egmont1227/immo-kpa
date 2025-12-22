import React from 'react';
import { X, Loader2, AlertCircle, Bot } from 'lucide-react';

export const AIAnalysisModal = ({ show, isLoading, error, analysis, onClose }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
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
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                            <p className="text-slate-500 font-medium animate-pulse">Experte prüft die Zahlen...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    ) : (
                        <div className="prose prose-slate prose-sm max-w-none">
                            {analysis && analysis.split('\n').map((line, i) => (
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
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
                    >
                        Schließen
                    </button>
                </div>
            </div>
        </div>
    );
};
