import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

export const PropertyDialog = ({ show, onClose, onSave, initialName = '', mode = 'create' }) => {
    const [name, setName] = useState(initialName);
    const [error, setError] = useState('');

    useEffect(() => {
        if (show) {
            setName(initialName);
            setError('');
        }
    }, [show, initialName]);

    if (!show) return null;

    const handleSave = () => {
        const trimmedName = name.trim();

        if (!trimmedName) {
            setError('Name darf nicht leer sein');
            return;
        }

        if (trimmedName.length > 100) {
            setError('Name darf maximal 100 Zeichen lang sein');
            return;
        }

        const result = onSave(trimmedName);
        if (result && !result.success) {
            setError(result.error || 'Ein Fehler ist aufgetreten');
            return;
        }

        onClose();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-[scaleIn_0.2s_ease-out]">

                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white flex justify-between items-center">
                    <h3 className="font-bold text-lg">
                        {mode === 'create' ? 'Neue Immobilie' : 'Immobilie umbenennen'}
                    </h3>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                        Immobilien-Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setError('');
                        }}
                        onKeyPress={handleKeyPress}
                        className={`block w-full rounded-xl border ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'} px-4 py-3 focus:ring-2 text-slate-800 font-medium shadow-sm`}
                        placeholder="z.B. München Schwabing ETW"
                        autoFocus
                    />
                    {error && (
                        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}
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
                        onClick={handleSave}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                        {mode === 'create' ? 'Erstellen' : 'Speichern'}
                    </button>
                </div>
            </div>
        </div>
    );
};
