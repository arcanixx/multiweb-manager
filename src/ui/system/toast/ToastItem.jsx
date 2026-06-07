// =============================================================================
// FILE: ToastItem.jsx
// PATH: src/ui/system/toast/ToastItem.jsx
// VERSION: 0.0.3
// PURPOSE: Pojedynczy toast – wyświetla ikonę, treść i przycisk zamknięcia
// FUNCTIONS: ToastItem
// DEPENDS ON: react, icons.js, toastConfig.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React from 'react';
import { ICONS } from '../../../utils/icons.js';
import { TOAST_CONFIG } from './toastConfig.js';

// ─── ToastItem() – pojedynczy toast
export default function ToastItem({ toast, onDismiss }) {
  const config = TOAST_CONFIG[toast.type] ?? TOAST_CONFIG.info;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`toast-item ${toast.exiting ? 'toast-exit' : 'toast-enter'}`}
      style={{
        background:    config.bgVar,
        color:         config.textColor,
        borderRadius:  'var(--radius)',
        padding:       '10px 14px',
        boxShadow:     'var(--shadow-md)',
        display:       'flex',
        alignItems:    'center',
        gap:           '8px',
        fontSize:      '13px',
        fontWeight:    500,
        minWidth:      '220px',
        maxWidth:      '380px',
        pointerEvents: 'auto',
        cursor:        'default',
        userSelect:    'none',
      }}
    >
      <span style={{ fontSize: 15, flexShrink: 0 }}>{config.icon}</span>
      <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>
      <button
        onClick={onDismiss}
        aria-label="Zamknij powiadomienie"
        style={{
          background: 'transparent', border: 'none',
          color: 'inherit', cursor: 'pointer',
          padding: '0 2px', fontSize: 12,
          opacity: 0.7, flexShrink: 0,
        }}
      >
        {ICONS.CLOSE}
      </button>
    </div>
  );
}
