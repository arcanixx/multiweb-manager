// =============================================================================
// FILE: ContextMenu.jsx
// PATH: src/ui/sidebar/ContextMenu.jsx
// VERSION: 0.0.3
// PURPOSE: Menu kontekstowe (PPM) dla profilu
// FUNCTIONS: ContextMenu
// DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useRef, useEffect, useContext } from 'react';
import { logInfo, logError, logWarn, logDebug } from '../../utils/loggerRenderer.js';
import { TranslationContext } from '../../utils/translations.js';
// ─── ContextMenu() – menu kontekstowe (PPM) dla profili i innych elementów
//   @param {Object} props – właściwości komponentu
//   @param {number} props.x – pozycja X menu
//   @param {number} props.y – pozycja Y menu
//   @param {Array} props.items – lista elementów menu
//   @param {Function} props.onClose – callback zamknięcia menu
//   @returns {JSX.Element} – renderowane menu kontekstowe
export default function ContextMenu({ x, y, items, onClose }) {
  const ref = useRef();
  const { t } = useContext(TranslationContext);

  useEffect(() => {
    logDebug('ui', 'ContextMenu mounted');
    return () => logDebug('ui', 'ContextMenu unmounted');
  }, []);

  useEffect(() => {
    if (x !== 0 || y !== 0) { // Menu jest otwarte
      logDebug('ui', 'ContextMenu opened at', { x, y });
    }
  }, [x, y]);

  useEffect(() => {
    // ─── close() – Zamyka menu kontekstowe po kliknięciu poza jego obszar (sprawdza, czy kliknięty element nie należy do menu)
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [onClose]);
  return (
    <div ref={ref} style={{
      position: 'fixed', left: x, top: y, zIndex: 2000,
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 8, boxShadow: 'var(--shadow-md)', minWidth: 160,
      padding: '4px 0', fontSize: 13
    }}>
      {items.map((item, i) => item === '---' ? <div key={i} style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} /> : (
        <div key={i}
          style={{ padding: '6px 14px', cursor: 'pointer', color: item.danger ? 'var(--danger)' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          onClick={() => { item.action(); onClose(); }}>
          {item.icon} {item.label}
        </div>
      ))}
    </div>
  );
}