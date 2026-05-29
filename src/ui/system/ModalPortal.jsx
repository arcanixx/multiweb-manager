// =============================================================================
// FILE: ModalPortal.jsx
// PATH: src/ui/system/ModalPortal.jsx
// VERSION: 0.0.3
// PURPOSE: Modal w portalu (document.body) — ponad natywnym <webview> w Electronie.
// FUNCTIONS: ModalPortal
// DEPENDS ON: react, react-dom
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useEffect } from 'react';
import { logInfo, logError, logWarn, logDebug } from '../utils/loggerRenderer.js';
import { createPortal } from 'react-dom';

// ─── ModalPortal() – portal modalny renderujący dzieci w document.body
//   @param {Object} props – właściwości komponentu
//   @param {ReactNode} props.children – zawartość modala
//   @param {Function} props.onClose – callback zamknięcia modala
//   @returns {JSX.Element} – portal z modal overlay

export default function ModalPortal({ children, onClose }) {
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, []);
  const handleBackdropMouseDown = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };
  return createPortal(
    <div
      className="modal-overlay"
      role="presentation"
      onMouseDown={handleBackdropMouseDown}
    >
      {children}
    </div>,
    document.body
  );
}
