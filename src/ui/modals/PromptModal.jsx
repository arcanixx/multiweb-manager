// =============================================================================
// FILE: PromptModal.jsx
// PATH: src/ui/modals/PromptModal.jsx
// VERSION: 0.0.3
// PURPOSE: Modal z polem input – zastępuje window.prompt()
// FUNCTIONS: PromptModal
// DEPENDS ON: react, translations.js, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useContext } from 'react';
import { TranslationContext } from '../utils/translations.js';
import { logInfo, logError } from '../utils/loggerRenderer.js';

// ─── PromptModal() – modal z polem tekstowym (zastępuje prompt)
//   @param {Object} props – właściwości komponentu
//   @param {boolean} props.isOpen – czy modal jest widoczny
//   @param {string} props.title – tytuł modala
//   @param {string} props.message – komunikat (opcjonalny)
//   @param {string} props.defaultValue – domyślna wartość inputa
//   @param {string} props.placeholder – placeholder inputa
//   @param {Function} props.onConfirm – callback z wartością (value) => void
//   @param {Function} props.onCancel – callback anulowania
//   @returns {JSX.Element|null} – renderowany modal lub null
export default function PromptModal({
  isOpen,
  title,
  message,
  defaultValue = '',
  placeholder = '',
  onConfirm,
  onCancel
}) {
  const { t } = useContext(TranslationContext);
  const [value, setValue] = useState(defaultValue);

  // ─── reset value when modal opens with new defaultValue
  React.useEffect(() => {
    if (isOpen) {
      setValue(defaultValue);
    }
  }, [isOpen, defaultValue]);

  // ─── handleConfirm() – Zatwierdza wartość wpisaną przez użytkownika i przekazuje ją do callbacku onConfirm, logując operację
  const handleConfirm = () => {
    try {
      logInfo('ui', `PromptModal: confirmed with value: ${value}`);
      onConfirm?.(value);
    } catch (err) {
      logError('ui', 'PromptModal: confirm failed', err);
    }
  };

  // ─── handleCancel() – Anuluje modal bez przekazywania wartości, wywołując callback onCancel i logując zdarzenie
  const handleCancel = () => {
    try {
      logInfo('ui', 'PromptModal: cancelled');
      onCancel?.();
    } catch (err) {
      logError('ui', 'PromptModal: cancel failed', err);
    }
  };

  // ─── handleKeyDown() – Obsługuje klawisze Enter (potwierdza) i Escape (anuluje) wewnątrz pola tekstowego modala
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title || t('common.prompt')}</h3>
          <button className="modal-close" onClick={handleCancel}>×</button>
        </div>
        <div className="modal-body">
          {message && <p style={{ marginBottom: 12 }}>{message}</p>}
          <input
            type="text"
            className="prompt-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            autoFocus
          />
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