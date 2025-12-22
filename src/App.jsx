import React, { useEffect, useState } from 'react';
import { Calculator } from 'lucide-react';
import { useCalculator } from './hooks/useCalculator';
import { useAIAnalysis } from './hooks/useAIAnalysis';
import { usePropertyManager } from './hooks/usePropertyManager';
import { InputSection } from './components/InputSection';
import { ResultsSection } from './components/ResultsSection';
import { AIAnalysisModal } from './components/AIAnalysisModal';
import { PropertySelector } from './components/PropertySelector';
import { PropertyDialog } from './components/PropertyDialog';
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog';

// --- TAILWIND SETUP & SAFETY CHECK ---
if (typeof window !== 'undefined') {
  if (!window.tailwind) {
    const script = document.createElement('script');
    script.src = "https://cdn.tailwindcss.com";
    script.async = true;
    script.onload = () => {
      window.tailwind.config = {
        theme: {
          extend: {
            animation: {
              'shimmer': 'shimmer 1.5s infinite',
              'scaleIn': 'scaleIn 0.2s ease-out',
            },
            keyframes: {
              shimmer: {
                '100%': { transform: 'translateX(100%)' },
              },
              scaleIn: {
                from: { opacity: '0', transform: 'scale(0.95)' },
                to: { opacity: '1', transform: 'scale(1)' },
              }
            }
          }
        }
      };
    };
    document.head.appendChild(script);
  }
}

export default function App() {
  // Property management
  const {
    properties,
    activePropertyId,
    activeProperty,
    isInitialized,
    addProperty,
    switchProperty,
    updatePropertyData,
    removeProperty,
    saveCurrentInputs
  } = usePropertyManager();

  // Calculator state - DON'T pass initial inputs here, we'll load them via useEffect
  const { inputs, updateInput, updateInputs, loadInputs, results, errors, hasErrors } = useCalculator();

  // AI Analysis
  const { aiAnalysis, isLoading, showModal, error: aiError, generateAnalysis, closeModal } = useAIAnalysis();

  // Dialog states
  const [showPropertyDialog, setShowPropertyDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');

  // Load Tailwind CSS
  useEffect(() => {
    if (!document.getElementById('tailwind-script')) {
      const script = document.createElement('script');
      script.id = 'tailwind-script';
      script.src = "https://cdn.tailwindcss.com";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // Load inputs when active property changes - FIXED VERSION
  useEffect(() => {
    if (isInitialized && activeProperty && activeProperty.inputs) {
      console.log('Loading inputs for property:', activeProperty.name, activeProperty.inputs);
      loadInputs(activeProperty.inputs);
    }
  }, [activePropertyId, isInitialized]);

  // Auto-save inputs when they change (debounced) - EXCLUDING activePropertyId from deps
  useEffect(() => {
    if (!isInitialized || !activePropertyId) return;

    const timeoutId = setTimeout(() => {
      console.log('Auto-saving inputs for property:', activePropertyId);
      saveCurrentInputs(inputs);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [inputs, isInitialized]);

  // Handlers
  const handleAIAnalysis = () => {
    if (results) {
      generateAnalysis(inputs, results);
    }
  };

  const handleAddProperty = () => {
    setDialogMode('create');
    setShowPropertyDialog(true);
  };

  const handleEditProperty = () => {
    setDialogMode('edit');
    setShowPropertyDialog(true);
  };

  const handleDeleteProperty = () => {
    setShowDeleteDialog(true);
  };

  const handlePropertyDialogSave = (name) => {
    if (dialogMode === 'create') {
      // Generate unique name if needed
      let finalName = name;
      let counter = 1;
      const existingNames = properties.map(p => p.name.toLowerCase());
      while (existingNames.includes(finalName.toLowerCase())) {
        finalName = `${name} (${counter})`;
        counter++;
      }

      const result = addProperty(finalName);
      if (!result.success) {
        return result;
      }
    } else {
      const result = updatePropertyData(activePropertyId, { name });
      if (!result.success) {
        return result;
      }
    }

    setShowPropertyDialog(false);
    return { success: true };
  };

  const handleConfirmDelete = () => {
    removeProperty(activePropertyId);
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Calculator className="w-12 h-12 text-indigo-600 mx-auto mb-3 animate-pulse" />
          <p className="text-slate-600">Lade Immobilien...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 relative overflow-x-hidden">

      {/* Ambient Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-200/30 blur-[100px]" />
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-200/30 blur-[120px]" />
      </div>

      <header className="relative z-50 backdrop-blur-md bg-white/70 border-b border-white/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/30">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                  Kaufpreis<span className="text-indigo-600">Aufteilung</span>
                </h1>
                <p className="text-xs text-slate-500 font-medium">Investoren Tool & Steuer-Optimierung</p>
              </div>
            </div>

            {/* Property Selector */}
            <div className="flex items-center gap-3">
              <PropertySelector
                properties={properties}
                activePropertyId={activePropertyId}
                onSwitch={switchProperty}
                onAdd={handleAddProperty}
                onEdit={handleEditProperty}
                onDelete={handleDeleteProperty}
              />

              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-indigo-50/50 rounded-full border border-indigo-100">
                <span className="text-xs font-semibold text-indigo-900">V 3.3 (Multi-Property)</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* INPUTS */}
          <div className="lg:col-span-4 space-y-6">
            <InputSection
              inputs={inputs}
              updateInput={updateInput}
              updateInputs={updateInputs}
              errors={errors}
            />
          </div>

          {/* RESULTS */}
          <div className="lg:col-span-8 space-y-6">
            <ResultsSection
              inputs={inputs}
              results={results}
              onAIAnalyze={handleAIAnalysis}
              isAILoading={isLoading}
            />
          </div>
        </div>
      </main>

      {/* AI MODAL */}
      <AIAnalysisModal
        show={showModal}
        isLoading={isLoading}
        error={aiError}
        analysis={aiAnalysis}
        onClose={closeModal}
      />

      {/* PROPERTY DIALOG */}
      <PropertyDialog
        show={showPropertyDialog}
        onClose={() => setShowPropertyDialog(false)}
        onSave={handlePropertyDialogSave}
        initialName={dialogMode === 'edit' ? activeProperty?.name : ''}
        mode={dialogMode}
      />

      {/* DELETE CONFIRMATION DIALOG */}
      <DeleteConfirmDialog
        show={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        propertyName={activeProperty?.name || ''}
      />

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}