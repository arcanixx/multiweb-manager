// =============================================================================
// FILE: src/index.jsx
// PATH: multiweb-manager/src/index.jsx
// VERSION: v1
// PURPOSE: Punkt wejścia aplikacji React. Montuje <App /> w #root,
//          owija TranslationProvider (kontekst i18n dla całej aplikacji).
//          Lazy loading głównych komponentów przez React.lazy().
// DEPENDS ON: React, ReactDOM, App.jsx, useTranslation.js, index.css
// =============================================================================

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { TranslationProvider } from './hooks/useTranslation';
import App from './App';

// Globalny fallback podczas lazy-load komponentów
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
