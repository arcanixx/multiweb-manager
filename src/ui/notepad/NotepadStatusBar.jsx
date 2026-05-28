// =============================================================================
// FILE: NotepadStatusBar.jsx
// PATH: src/ui/notepad/NotepadStatusBar.jsx
// VERSION: 0.0.3
// PURPOSE: Pasek statusu notatnika (tytuł, znaki, wiersze, ostatni zapis)
// FUNCTIONS: NotepadStatusBar
// DEPENDS ON: react, translations.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
export default function NotepadStatusBar({ title, content, lastSaved }) {
  const { t } = useContext(TranslationContext);
  const lines = content ? content.split('\n').length : 0;
  const chars = content ? content.length : 0;
  return (
    <div style={{
      display: 'flex', gap: 16, padding: '2px 12px',
      background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)',
      fontSize: 11, color: 'var(--text-muted)', flexShrink: 0
    }}>
      <span>{title}</span>
      <span>{t('notepad.chars')}: {chars}</span>
      <span>{t('notepad.lines')}: {lines}</span>
      {lastSaved && (
        <span style={{ marginLeft: 'auto' }}>
          {t('notepad.autosaved')}: {new Date(lastSaved).toLocaleTimeString('pl-PL')}
        </span>
      )}
    </div>
  );
}
