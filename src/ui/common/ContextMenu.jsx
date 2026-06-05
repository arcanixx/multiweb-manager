// =============================================================================
// FILE: ContextMenu.jsx
// PATH: src/ui/common/ContextMenu.jsx
// VERSION: 0.0.3
// PURPOSE: Reużywalny komponent menu kontekstowego (PPM) – używany przez Sidebar, Notepad, TaskPanel i inne moduły. Renderuje listę akcji z obsługą separatorów, ikon i trybu danger.
// FUNCTIONS: ContextMenu
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useRef, useEffect } from 'react';
import { logDebug } from '../../utils/loggerRenderer.js';

// ─── ContextMenu() – menu kontekstowe zamykane kliknięciem poza obszar
//   @param {number}   props.x       – pozycja X (clientX z MouseEvent)
//   @param {number}   props.y       – pozycja Y (clientY z MouseEvent)
//   @param {Array}    props.items   – elementy menu: obiekt { icon, label, action, danger? } lub '---' (separator)
//   @param {Function} props.onClose – callback zamknięcia (klik poza menu lub po akcji)
//   @returns {JSX.Element}
export default function ContextMenu({ x, y, items, onClose }) {
  const ref = useRef();

  useEffect(() => {
    logDebug('ui', 'ContextMenu: opened', { x, y, itemCount: items?.length });
    return () => logDebug('ui', 'ContextMenu: closed');
  }, [x, y, items?.length]);

  // ─── Zamknij po kliknięciu poza obszar menu
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed', left: x, top: y, zIndex: 2000,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 8, boxShadow: 'var(--shadow-md)', minWidth: 160,
        padding: '4px 0', fontSize: 13,
      }}
    >
      {items.map((item, i) =>
        item === '---'
          ? <div key={i} style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
          : (
            <div
              key={i}
              style={{
                padding: '6px 14px', cursor: 'pointer',
                color: item.danger ? 'var(--danger)' : 'var(--text-primary)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              onClick={() => { item.action(); onClose(); }}
            >
              {item.icon} {item.label}
            </div>
          )
      )}
    </div>
  );
}
