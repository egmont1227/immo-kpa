import React from 'react';

export const GlassCard = ({ children, className = "" }) => (
    <div className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 overflow-hidden ${className}`}>
        {children}
    </div>
);
