import React from 'react';

export const GradientButton = ({ onClick, disabled, children, icon: Icon, variant = "primary" }) => {
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
