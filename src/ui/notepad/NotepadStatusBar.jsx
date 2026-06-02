// =============================================================================
// FILE: NotepadStatusBar.jsx
// PATH: src/ui/notepad/NotepadStatusBar.jsx
// VERSION: 0.0.3
// PURPOSE: Pasek informacyjny u dołu notatnika – wyświetla metadane aktywnego dokumentu: statystyki znaków/wierszy oraz czas ostatniego autozapisu.
// FUNCTIONS: NotepadStatusBar
// DEPENDS ON: react, translations.js, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { logError, logWarn } from '../../utils/loggerRenderer.js';

// ─── NotepadStatusBar() – pasek statusu notatnika z informacjami o dokumencie
//   @param {Object} props – właściwości komponentu
//   @param {string} props.title – tytuł dokumentu
//   @param {string} props.content – zawartość dokumentu
//   @param {number} props.lastSaved – timestamp ostatniego zapisu
//   @returns {JSX.Element} – renderowany pasek statusu
export default function NotepadStatusBar({ title, content, lastSaved }) {
  const { t } = useContext(TranslationContext);

  // ─── lines – oblicza liczbę wierszy w dokumencie
  //   @returns {number} – liczba wierszy
  const lines = content ? content.split('\n').length : 0;

  // ─── chars – oblicza liczbę znaków w dokumencie
  //   @returns {number} – liczba znaków
  const chars = content ? content.length : 0;

  // ─── formatTime() – formatuje timestamp do czytelnej godziny
  //   @param {number} timestamp – timestamp do sformatowania
  //   @returns {string} – sformatowana godzina
  const formatTime = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleTimeString('pl-PL');
    } catch (err) {
      logError('ui', 'NotepadStatusBar: formatTime failed', err.message);
      logWarn('ui', 'Wystąpił błąd podczas formatowania godziny');
      return '–';
    }
  };
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
          {t('notepad.autosaved')}: {formatTime(lastSaved)}
        </span>
      )}
    </div>
  );
}