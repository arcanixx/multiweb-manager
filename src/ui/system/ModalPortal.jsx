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
import { createPortal } from 'react-dom';
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
