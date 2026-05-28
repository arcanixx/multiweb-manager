// =============================================================================
// FILE: ProjectModal.jsx
// PATH: src/ui/projects/ProjectModal.jsx
// VERSION: 0.0.3
// PURPOSE: Modal dodawania nowego projektu (nazwa + ścieżka)
// FUNCTIONS: ProjectModal
// DEPENDS ON: react, translations.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import { logInfo, logError, logWarn } from '../../utils/loggerRenderer.js';
// ─── ProjectModal() – modal dodawania nowego projektu z walidacją
//   @param {Object} props – właściwości komponentu
//   @param {Function} props.onSave – callback zapisu nowego projektu
//   @param {Function} props.onClose – callback zamknięcia modala
//   @returns {JSX.Element} – renderowany modal dodawania projektu
export default function ProjectModal({ onSave, onClose }) {
  const { t } = useContext(TranslationContext);
  const [name, setName] = useState('');
  const [path, setPath] = useState('');

  // ─── handleSave() – obsługa zapisu projektu z walidacją i logowaniem
  //   @returns {void}
  const handleSave = () => {
    try {
      if (name.trim() && path.trim()) {
        logInfo(`ProjectModal: saving project ${name.trim()}`);
        onSave({ name: name.trim(), path: path.trim() });
      }
    } catch (err) {
      logError('ProjectModal: save failed', err);
      logWarn('Wystąpił błąd podczas zapisu projektu');
    }
  };

  // ─── handleClose() – obsługa zamknięcia modala z logowaniem
  //   @returns {void}
  const handleClose = () => {
    try {
      logInfo('ProjectModal: closed');
      onClose?.();
    } catch (err) {
      logError('ProjectModal: close failed', err);
      logWarn('Wystąpił błąd podczas zamykania modala');
    }
  };
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 460 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
            {ICONS.FOLDER_ADD} {t('projectManager.add_project')}
          </h2>
        <button className="btn-icon" onClick={handleClose}>{ICONS.CLOSE}</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="form-label">{t('projectManager.project_name')}</label>
            <input className="form-input" value={name} autoFocus placeholder="np. Unicorn" onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="form-label">{t('projectManager.project_path')}</label>
            <input className="form-input" value={path} placeholder="D:/projects/unicorn" onChange={e => setPath(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSave()} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 18, justifyContent: 'flex-end' }}>
        <button className="btn btn-secondary" onClick={handleClose}>{t('common.cancel')}</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!name.trim() || !path.trim()}>
            {ICONS.SAVE} {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}