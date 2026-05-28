// =============================================================================
// FILE: ConfirmModal.jsx
// PATH: src/ui/modals/ConfirmModal.jsx
// VERSION: 0.0.3
// PURPOSE: Modal potwierdzenia (zastępuje window.confirm)
// FUNCTIONS: ConfirmModal
// DEPENDS ON: react, translations.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React from 'react';
import { TranslationContext } from '../utils/translations.js';
export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  const { t } = React.useContext(TranslationContext);
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
          <button className="btn-primary" onClick={onConfirm}>
            {t('common.confirm')}
          </button>
          <button className="btn-secondary" onClick={onCancel}>
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}

