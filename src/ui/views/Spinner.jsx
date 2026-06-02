// =============================================================================
// FILE: Spinner.jsx
// PATH: src/ui/views/Spinner.jsx
// VERSION: 0.0.3
// PURPOSE: Współdzielony komponent wizualny wskaźnika ładowania (loader). Wykorzystywany jako fallback dla React Suspense oraz podczas asynchronicznych operacji I/O.
// FUNCTIONS: Spinner
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React from 'react';
import { logDebug } from '../../utils/loggerRenderer.js';

// ─── Spinner() – wskaźnik ładowania używany jako Suspense fallback
//   @returns {JSX.Element}
export function Spinner() {
  React.useEffect(() => logDebug('ui', 'Spinner mounted'), []);
  return (
    <div className="flex items-center justify-center h-full text-slate-400">
      <span style={{ fontSize: 28, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
    </div>
  );
}