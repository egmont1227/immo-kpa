import React from 'react';
import { Tooltip } from './Tooltip';

export const InputField = ({
    label,
    value,
    onChange,
    type = "number",
    icon: Icon,
    suffix,
    step = "1",
    hint,
    tooltip,
    error
}) => (
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
                className={`block w-full rounded-xl border-slate-200 pl-11 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 font-medium shadow-sm py-3 bg-white/50 hover:bg-white transition-all ${!value && value !== 0 ? 'bg-slate-50' : ''} ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                placeholder="0"
            />
            {suffix && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-slate-400 text-sm font-medium">{suffix}</span>
                </div>
            )}
        </div>
        {error && (
            <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
        )}
    </div>
);
