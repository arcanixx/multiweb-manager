// =============================================================================
// FILE: index.jsx
// PATH: src/index.jsx
// VERSION: 0.0.3
// PURPOSE: Punkt wejścia aplikacji React. Montuje <App /> w #root,
// FUNCTIONS: -
// DEPENDS ON: react, react-dom, useTranslation, App
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './ui/index.css';
import { TranslationProvider } from './hooks/useTranslation';
import App from './App';

// ─── AppLoader() – Komponent fallback wyświetlający ekran ładowania podczas asynchronicznego wczytywania (lazy-loading) głównych komponentów aplikacji React
function AppLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-spin inline-block">⟳</div>
        <div className="text-slate-400 text-sm">MultiWeb Manager</div>
      </div>
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <TranslationProvider>
    <Suspense fallback={<AppLoader />}>
      <App />
    </Suspense>
  </TranslationProvider>
);
