import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { GradientButton } from './ui/GradientButton';

export const AICallToAction = ({ onAnalyze, isLoading }) => (
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
            <GradientButton variant="ai" onClick={onAnalyze} disabled={isLoading}>
                {isLoading ? 'Analysiere...' : 'Jetzt Analyse starten'}
            </GradientButton>
        </div>
    </div>
);
