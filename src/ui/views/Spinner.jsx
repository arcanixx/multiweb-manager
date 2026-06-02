// =============================================================================
// FILE: Spinner.jsx
// PATH: src/ui/views/Spinner.jsx
// VERSION: 0.0.3
// PURPOSE: Współdzielony komponent wskaźnika ładowania (Suspense fallback)
// FUNCTIONS: Spinner
// DEPENDS ON: react
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React from 'react';

// ─── Spinner() – wskaźnik ładowania używany jako Suspense fallback
//   @returns {JSX.Element}
export function Spinner() {
  return (
    <div className="flex items-center justify-center h-full text-slate-400">
      <span style={{ fontSize: 28, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
    </div>
  );
}
