// =============================================================================
// FILE: NotepadToolbar.jsx
// PATH: src/ui/notepad/NotepadToolbar.jsx
// VERSION: 0.0.3
// PURPOSE: Pasek narzędzi notatnika (zapisz, znajdź, word wrap)
// FUNCTIONS: NotepadToolbar
// DEPENDS ON: react, translations.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
export default function NotepadToolbar({ onSave, onSaveAs, onToggleFind, wordWrap, onToggleWordWrap, toast, dirty }) {
  const { t } = useContext(TranslationContext);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      padding: '4px 8px', background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)', flexShrink: 0, flexWrap: 'wrap'
    }}>
      <button className="btn btn-secondary" style={{ fontSize: 12 }} onClick={onSave}>
        {ICONS.SAVE} {t('notepad.save')}
      </button>
      <button className="btn btn-secondary" style={{ fontSize: 12 }} onClick={onSaveAs}>
        {ICONS.EXPORT} {t('notepad.save_as')}
      </button>
      <button className={`btn btn-secondary`} style={{ fontSize: 12 }} onClick={onToggleFind}>
        {ICONS.SEARCH} {t('notepad.find_replace')}
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('notepad.word_wrap')}</span>
        <label className="toggle" style={{ transform: 'scale(0.8)' }}>
          <input type="checkbox" checked={wordWrap} onChange={onToggleWordWrap} />
          <span className="toggle-slider"></span>
        </label>
      </div>
      {toast && <span style={{ fontSize: 11, color: 'var(--success)', marginLeft: 8 }}>{toast}</span>}
      {dirty && !toast && <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>{ICONS.NOTEPAD} {t('notepad.autosaved')}</span>}
    </div>
  );
}

