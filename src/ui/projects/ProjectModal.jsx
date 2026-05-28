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
export default function ProjectModal({ onSave, onClose }) {
  const { t } = useContext(TranslationContext);
  const [name, setName] = useState('');
  const [path, setPath] = useState('');
  const handleSave = () => {
    if (name.trim() && path.trim()) onSave({ name: name.trim(), path: path.trim() });
  };
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 460 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
            {ICONS.FOLDER_ADD} {t('projectManager.add_project')}
          </h2>
          <button className="btn-icon" onClick={onClose}>{ICONS.CLOSE}</button>
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
          <button className="btn btn-secondary" onClick={onClose}>{t('common.cancel')}</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!name.trim() || !path.trim()}>
            {ICONS.SAVE} {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}