// =============================================================================
// FILE: ToastContainer.jsx
// PATH: src/ui/system/ToastContainer.jsx
// VERSION: 0.0.3
// PURPOSE: Globalny kontener toastów – orkiestrator renderujący kolejkę. Logika w useToastQueue, konfiguracja w toastConfig.js, widok pojedynczego toastu w ToastItem.jsx.
// FUNCTIONS: ToastContainer
// DEPENDS ON: react, useToastQueue.js, ToastItem.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React from 'react';
import { useToastQueue } from './toast/useToastQueue.js';
import ToastItem        from './ToastItem.jsx';

// ─── ToastContainer() – renderuje stos aktywnych toastów
//   @param {boolean} props.enabled – czy toasty są włączone (z settings.toastsEnabled)
export default function ToastContainer({ enabled = true }) {
  const { active, handleDismiss } = useToastQueue(enabled);

  if (active.length === 0) return null;

  return (
    <div
      aria-label="Powiadomienia"
      style={{
        position:      'fixed',
        bottom:        '20px',
        right:         '20px',
        display:       'flex',
        flexDirection: 'column-reverse', // Nowe toasty wjeżdżają od dołu
        gap:           '8px',
        zIndex:        9000,             // Poniżej modali (20000), powyżej reszty UI
        pointerEvents: 'none',           // Kontener nie blokuje kliknięć — tylko ToastItem
      }}
    >
      {active.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => handleDismiss(toast.id)}
        />
      ))}
    </div>
  );
}
