// =============================================================================
// FILE: Modal.jsx
// PATH: src/ui/modals/Modal.jsx
// VERSION: 0.0.3
// PURPOSE: Bazowy komponent modalny dla całej aplikacji
// FUNCTIONS: Modal
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useEffect } from 'react';
import { logInfo } from '../utils/loggerRenderer.js';

// ─── Modal() – bazowy komponent modalny dla całej aplikacji
//   @param {Object} props – właściwości komponentu
//   @param {boolean} props.isOpen – czy modal jest widoczny
//   @param {Function} props.onClose – callback zamknięcia modala
//   @param {string} props.title – tytuł modala
//   @param {ReactNode} props.children – zawartość modala
//   @param {string} props.size – rozmiar modala (small, medium, large, full)
//   @returns {JSX.Element|null} – renderowany modal lub null
export default function Modal({ isOpen, onClose, title, children, size = 'medium' }) {

  // ─── useEffect – obsługa klawisza Escape i blokowanie scrolla
  useEffect(() => {
    // ─── handleEscape() – Obsługuje naciśnięcie klawisza Escape i zamyka modal wywołując callback onClose, gdy modal jest aktualnie otwarty
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        logInfo('ui', 'Modal: closed via Escape key');
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      logInfo('ui', 'Modal: opened');
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      logInfo('ui', 'Modal: closed');
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const sizeClass = {
    small: 'modal-small',
    medium: 'modal-medium',
    large: 'modal-large',
    full: 'modal-full'
  }[size] || 'modal-medium';
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${sizeClass}`} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="modal-header">
            <h3>{title}</h3>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
        )}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}