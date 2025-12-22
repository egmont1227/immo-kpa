import React from 'react';
import { HelpCircle } from 'lucide-react';

export const Tooltip = ({ text }) => (
    <div className="group relative flex items-center ml-1.5">
        <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help hover:text-indigo-600 transition-colors" />
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden w-64 p-3 bg-slate-800 text-white text-xs font-normal rounded-lg shadow-xl group-hover:block z-50 pointer-events-none animate-[scaleIn_0.1s_ease-out] leading-relaxed">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
        </div>
    </div>
);
