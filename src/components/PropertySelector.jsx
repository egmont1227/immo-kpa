import React, { useState } from 'react';
import { ChevronDown, Plus, Edit2, Trash2 } from 'lucide-react';

export const PropertySelector = ({
    properties,
    activePropertyId,
    onSwitch,
    onAdd,
    onEdit,
    onDelete
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const activeProperty = properties.find(p => p.id === activePropertyId);

    const handleSelect = (id) => {
        onSwitch(id);
        setIsOpen(false);
    };

    return (
        <div className="flex items-center gap-2">
            {/* Dropdown */}
            <div className="relative min-w-[280px]">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-white/90 border border-slate-200 rounded-xl hover:bg-white hover:border-indigo-300 transition-all shadow-sm text-left group"
                >
                    <span className="font-semibold text-slate-800 truncate">
                        {activeProperty?.name || 'Keine Immobilie'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-all ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu - INCREASED Z-INDEX */}
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-[101] max-h-[300px] overflow-y-auto">
                            {properties.map(property => (
                                <button
                                    key={property.id}
                                    onClick={() => handleSelect(property.id)}
                                    className={`w-full px-4 py-3 text-left hover:bg-indigo-50 transition-colors border-b border-slate-100 last:border-0 ${property.id === activePropertyId ? 'bg-indigo-50 text-indigo-900 font-semibold' : 'text-slate-700'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="truncate">{property.name}</span>
                                        {property.id === activePropertyId && (
                                            <span className="ml-2 w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0" />
                                        )}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-0.5">
                                        {new Date(property.updatedAt).toLocaleDateString('de-DE')}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Action Buttons */}
            <button
                onClick={onEdit}
                className="p-2.5 bg-white/90 border border-slate-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm"
                title="Umbenennen"
            >
                <Edit2 className="w-4 h-4" />
            </button>

            <button
                onClick={onDelete}
                className="p-2.5 bg-white/90 border border-slate-200 rounded-xl hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all shadow-sm"
                title="Löschen"
                disabled={properties.length <= 1}
            >
                <Trash2 className="w-4 h-4" />
            </button>

            <button
                onClick={onAdd}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all font-semibold shadow-sm"
            >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Neue Immobilie</span>
            </button>
        </div>
    );
};
