// =============================================================================
// FILE: ConfirmModal.jsx
// PATH: src/ui/modals/ConfirmModal.jsx
// VERSION: 0.0.3
// PURPOSE: Generyczny komponent modalny służący do potwierdzania akcji krytycznych (np. usuwanie). Zapewnia spójność wizualną i zastępuje natywną funkcję window.confirm.
// FUNCTIONS: ConfirmModal
// DEPENDS ON: react, translations.js, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React from 'react';
import { TranslationContext } from '../utils/translations.js';
import { logInfo, logError, logWarn } from '../utils/loggerRenderer.js';

// ─── ConfirmModal() – modal potwierdzenia zastępujący window.confirm
//   @param {Object} props – właściwości komponentu
//   @param {boolean} props.isOpen – czy modal jest widoczny
//   @param {string} props.title – tytuł modala
//   @param {string} props.message – treść komunikatu
//   @param {Function} props.onConfirm – callback potwierdzenia
//   @param {Function} props.onCancel – callback anulowania
//   @returns {JSX.Element|null} – renderowany modal lub null
export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  const { t } = React.useContext(TranslationContext);

  // ─── handleConfirm() – obsługa potwierdzenia z logowaniem
  //   @returns {void}
  const handleConfirm = () => {
    try {
      logInfo('ui', 'ConfirmModal: user confirmed');
      onConfirm?.();
    } catch (err) {
      logError('ui', 'ConfirmModal: confirm failed', err.message);
      logWarn('ui', 'Wystąpił błąd podczas potwierdzania');
    }
  };

  // ─── handleCancel() – obsługa anulowania z logowaniem
  //   @returns {void}
  const handleCancel = () => {
    try {
      logInfo('ui', 'ConfirmModal: user cancelled');
      onCancel?.();
    } catch (err) {
      logError('ui', 'ConfirmModal: cancel failed', err.message);
      logWarn('ui', 'Wystąpił błąd podczas anulowania');
    }
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title || t('common.confirm')}</h3>
          <button className="modal-close" onClick={onCancel}>×</button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
        <button className="btn-primary" onClick={handleConfirm}>
            {t('common.confirm')}
          </button>
        <button className="btn-secondary" onClick={handleCancel}>
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}