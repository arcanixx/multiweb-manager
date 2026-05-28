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
import { logInfo, logError, logWarn } from '../../utils/loggerRenderer.js';

// ─── NotepadToolbar() – pasek narzędzi notatnika z przyciskami akcji
//   @param {Object} props – właściwości komponentu
//   @param {Function} props.onSave – callback zapisu aktywnej zakładki
//   @param {Function} props.onSaveAs – callback zapisu do pliku
//   @param {Function} props.onToggleFind – callback przełączania wyszukiwania
//   @param {boolean} props.wordWrap – stan zawijania wierszy
//   @param {Function} props.onToggleWordWrap – callback przełączania zawijania
//   @param {string} props.toast – komunikat toast
//   @param {boolean} props.dirty – czy są niezapisane zmiany
//   @returns {JSX.Element} – renderowany pasek narzędzi
export default function NotepadToolbar({ onSave, onSaveAs, onToggleFind, wordWrap, onToggleWordWrap, toast, dirty }) {
  const { t } = useContext(TranslationContext);

  

  // ─── handleSave() – obsługa zapisu z logowaniem
  //   @returns {void}
  const handleSave = () => {
    try {
      logInfo('NotepadToolbar: save triggered');
      onSave?.();
    } catch (err) {
      logError('NotepadToolbar: save failed', err);
      logWarn('Wystąpił błąd podczas zapisu');
    }
  };

  

  // ─── handleSaveAs() – obsługa zapisu do pliku z logowaniem
  //   @returns {void}
  const handleSaveAs = () => {
    try {
      logInfo('NotepadToolbar: save as triggered');
      onSaveAs?.();
    } catch (err) {
      logError('NotepadToolbar: save as failed', err);
      logWarn('Wystąpił błąd podczas zapisu do pliku');
    }
  };

  

  // ─── handleToggleFind() – obsługa przełączania wyszukiwania z logowaniem
  //   @returns {void}
  const handleToggleFind = () => {
    try {
      logInfo('NotepadToolbar: toggle find triggered');
      onToggleFind?.();
    } catch (err) {
      logError('NotepadToolbar: toggle find failed', err);
      logWarn('Wystąpił błąd podczas przełączania wyszukiwania');
    }
  };

  

  // ─── handleToggleWordWrap() – obsługa przełączania zawijania wierszy z logowaniem
  //   @returns {void}
  const handleToggleWordWrap = () => {
    try {
      logInfo('NotepadToolbar: toggle word wrap triggered');
      onToggleWordWrap?.();
    } catch (err) {
      logError('NotepadToolbar: toggle word wrap failed', err);
      logWarn('Wystąpił błąd podczas przełączania zawijania wierszy');
    }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      padding: '4px 8px', background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)', flexShrink: 0, flexWrap: 'wrap'
    }}>
        <button className="btn btn-secondary" style={{ fontSize: 12 }} onClick={handleSave}>
        {ICONS.SAVE} {t('notepad.save')}
      </button>
        <button className="btn btn-secondary" style={{ fontSize: 12 }} onClick={handleSaveAs}>
        {ICONS.EXPORT} {t('notepad.save_as')}
      </button>
        <button className={`btn btn-secondary`} style={{ fontSize: 12 }} onClick={handleToggleFind}>
        {ICONS.SEARCH} {t('notepad.find_replace')}
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('notepad.word_wrap')}</span>
        <label className="toggle" style={{ transform: 'scale(0.8)' }}>
           <input type="checkbox" checked={wordWrap} onChange={handleToggleWordWrap} />
          <span className="toggle-slider"></span>
        </label>
      </div>
      {toast && <span style={{ fontSize: 11, color: 'var(--success)', marginLeft: 8 }}>{toast}</span>}
      {dirty && !toast && <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>{ICONS.NOTEPAD} {t('notepad.autosaved')}</span>}
    </div>
  );
}
