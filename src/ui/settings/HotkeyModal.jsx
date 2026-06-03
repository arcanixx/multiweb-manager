// =============================================================================
// FILE: HotkeyModal.jsx
// PATH: src/ui/settings/HotkeyModal.jsx
// VERSION: 0.0.3
// PURPOSE: Modal do dodawania i edycji skrótów klawiszowych – formularz z walidacją.
// FUNCTIONS: HotkeyModal
// DEPENDS ON: react, translations.js, Modal
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React from 'react';
import { TranslationContext } from '../../utils/translations.js';
import Modal from '../modals/Modal';

// ─── HotkeyModal() – modal edycji/dodawania skrótu klawiszowego
// @param {Object} props
// @param {boolean} props.isOpen – czy modal jest otwarty
// @param {Object} props.hotkey – edytowany skrót (lub null dla nowego)
// @param {Function} props.onClose – callback zamykania
// @param {Function} props.onSave – callback zapisu (hotkey) => void
// @param {Function} props.onChange – callback zmiany pola (field, value) => void
// @returns {JSX.Element|null} – renderowany modal lub null
export default function HotkeyModal({ isOpen, hotkey, onClose, onSave, onChange }) {
  const { t } = React.useContext(TranslationContext);

  if (!isOpen || !hotkey) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={hotkey?.id ? t('hotkeys.edit') : t('hotkeys.add')}>
      <div className="hotkey-modal-form">
        <div className="form-group">
          <label>{t('hotkeys.name')}</label>
          <input
            type="text"
            value={hotkey?.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder={t('hotkeys.namePlaceholder')}
          />
        </div>

        <div className="form-group">
          <label>{t('hotkeys.shortcut')}</label>
          <input
            type="text"
            value={hotkey?.shortcut || ''}
            onChange={(e) => onChange('shortcut', e.target.value)}
            placeholder="Ctrl+Shift+S"
          />
          <span className="form-hint">{t('hotkeys.shortcutHint')}</span>
        </div>

        <div className="form-group">
          <label>{t('hotkeys.text')}</label>
          <textarea
            value={hotkey?.text || ''}
            onChange={(e) => onChange('text', e.target.value)}
            rows={4}
            placeholder={t('hotkeys.textPlaceholder')}
          />
          <span className="form-hint">{t('hotkeys.textHint')}</span>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={hotkey?.enabled !== false}
              onChange={(e) => onChange('enabled', e.target.checked)}
            />
            {t('hotkeys.enabled')}
          </label>
        </div>

        <div className="form-actions">
          <button onClick={onClose}>{t('common.cancel')}</button>
          <button onClick={onSave} className="btn-primary">{t('common.save')}</button>
        </div>
      </div>
    </Modal>
  );
}