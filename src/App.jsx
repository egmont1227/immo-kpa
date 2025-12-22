import React, { useEffect } from 'react';
import { Calculator } from 'lucide-react';
import { useCalculator } from './hooks/useCalculator';
import { useAIAnalysis } from './hooks/useAIAnalysis';
import { InputSection } from './components/InputSection';
import { ResultsSection } from './components/ResultsSection';
import { AICallToAction } from './components/AICallToAction';
import { AIAnalysisModal } from './components/AIAnalysisModal';

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
  // Custom hooks for state management
  const { inputs, updateInput, updateInputs, results, errors, hasErrors } = useCalculator();
  const { aiAnalysis, isLoading, showModal, error: aiError, generateAnalysis, closeModal } = useAIAnalysis();

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

  const handleAIAnalysis = () => {
    if (results) {
      generateAnalysis(inputs, results);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 relative overflow-x-hidden">

      {/* Ambient Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-200/30 blur-[100px]" />
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-200/30 blur-[120px]" />
      </div>

      <header className="relative z-10 backdrop-blur-md bg-white/70 border-b border-white/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
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
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-indigo-50/50 rounded-full border border-indigo-100">
            <span className="text-xs font-semibold text-indigo-900">V 3.2 (Refactored)</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
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

            {/* AI CALL TO ACTION */}
            <AICallToAction
              onAnalyze={handleAIAnalysis}
              isLoading={isLoading}
            />

            <ResultsSection
              inputs={inputs}
              results={results}
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