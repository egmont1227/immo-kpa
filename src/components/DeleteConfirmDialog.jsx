import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const DeleteConfirmDialog = ({ show, onClose, onConfirm, propertyName }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-[scaleIn_0.2s_ease-out]">

                {/* Header */}
                <div className="bg-red-600 p-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg">Immobilie löschen</h3>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-slate-700 mb-4">
                        Möchten Sie die Immobilie <span className="font-bold text-slate-900">"{propertyName}"</span> wirklich löschen?
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-800">
                            <strong>Achtung:</strong> Diese Aktion kann nicht rückgängig gemacht werden. Alle gespeicherten Daten dieser Immobilie gehen verloren.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors"
                    >
                        Abbrechen
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-lg"
                    >
                        Löschen
                    </button>
                </div>
            </div>
        </div>
    );
};
