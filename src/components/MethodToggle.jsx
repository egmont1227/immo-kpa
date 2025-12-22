import React from 'react';
import { Home, TrendingUp, BarChart3 } from 'lucide-react';

export const MethodToggle = ({ method, setMethod }) => (
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
