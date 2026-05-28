// =============================================================================
// FILE: NotepadFindReplace.jsx
// PATH: src/ui/notepad/NotepadFindReplace.jsx
// VERSION: 0.0.3
// PURPOSE: Panel znajdź/zastąp w notatniku
// FUNCTIONS: NotepadFindReplace
// DEPENDS ON: react, translations.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import { logInfo, logError, logWarn } from '../../utils/loggerRenderer.js';

// ─── NotepadFindReplace() – panel znajdź/zastąp w notatniku
//   @param {Object} props – właściwości komponentu
//   @param {string} props.findText – bieżący tekst do wyszukania
//   @param {Function} props.onFindTextChange – callback zmiany tekstu wyszukiwania
//   @param {string} props.replaceText – tekst zastępujący
//   @param {Function} props.onReplaceTextChange – callback zmiany tekstu zastępującego
//   @param {Function} props.onFind – callback wyszukiwania
//   @param {Function} props.onReplace – callback zastępowania
//   @param {number} props.findCount – liczba znalezionych wyników
//   @param {Function} props.onClose – callback zamknięcia panelu
//   @returns {JSX.Element} – renderowany panel znajdź/zastąp
export default function NotepadFindReplace({ findText, onFindTextChange, replaceText, onReplaceTextChange, onFind, onReplace, findCount, onClose }) {
  const { t } = useContext(TranslationContext);

  

  // ─── handleFind() – obsługa wyszukiwania z logowaniem
  //   @returns {void}
  const handleFind = () => {
    try {
      logInfo('NotepadFindReplace: find triggered');
      onFind?.();
    } catch (err) {
      logError('NotepadFindReplace: find failed', err);
      logWarn('Wystąpił błąd podczas wyszukiwania');
    }
  };

  

  // ─── handleReplace() – obsługa zastępowania z logowaniem
  //   @returns {void}
  const handleReplace = () => {
    try {
      logInfo('NotepadFindReplace: replace triggered');
      onReplace?.();
    } catch (err) {
      logError('NotepadFindReplace: replace failed', err);
      logWarn('Wystąpił błąd podczas zastępowania');
    }
  };

  

  // ─── handleClose() – obsługa zamknięcia panelu z logowaniem
  //   @returns {void}
  const handleClose = () => {
    try {
      logInfo('NotepadFindReplace: panel closed');
      onClose?.();
    } catch (err) {
      logError('NotepadFindReplace: close failed', err);
      logWarn('Wystąpił błąd podczas zamykania panelu');
    }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px',
      background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
      flexShrink: 0, flexWrap: 'wrap'
    }}>
        <input className="form-input" style={{ width: 200, height: 28, fontSize: 12 }}
          placeholder={t('notepad.search_placeholder')}
          value={findText} onChange={e => onFindTextChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleFind()} />
      <input className="form-input" style={{ width: 180, height: 28, fontSize: 12 }}
        placeholder={t('notepad.replace_placeholder')}
        value={replaceText} onChange={e => onReplaceTextChange(e.target.value)} />
        <button className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }} onClick={handleFind}>
        {ICONS.SEARCH}
      </button>
        <button className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }} onClick={handleReplace}>
        {ICONS.REFRESH}
      </button>
      {findCount > 0 && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{findCount} wyników</span>}
        <button className="btn-icon" style={{ marginLeft: 'auto' }} onClick={handleClose}>{ICONS.CLOSE}</button>
    </div>
  );
}
