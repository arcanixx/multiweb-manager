// =============================================================================
// FILE: HistoryList.jsx
// PATH: src/ui/history/HistoryList.jsx
// VERSION: 0.0.3
// PURPOSE: Lista wpisów historii (tabela)
// FUNCTIONS: HistoryList
// DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import { logError, logWarn } from '../../utils/loggerRenderer.js';

// ─── HistoryList() – komponent wyświetlający listę wpisów historii w formie tabeli
//   @param {Object} props – właściwości komponentu
//   @param {Array} props.entries – tablica wpisów historii
//   @returns {JSX.Element} – renderowana lista lub komunikat o braku historii
export default function HistoryList({ entries }) {
  const { t } = useContext(TranslationContext);

  // ─── formatTime() – Konwertuje i formatuje wejściowy łańcuch daty ISO na czytelny format daty i czasu zgodnie z polskimi ustawieniami regionalnymi (pl-PL)
  //   @param {string} iso – timestamp w formacie ISO
  //   @returns {string} – sformatowana data lub '–' dla pustych wartości
  const formatTime = (iso) => {
    if (!iso) return '–';
    try {
      return new Date(iso).toLocaleString('pl-PL', {
        day: '2-digit', month: '2-digit', year: '2-digit',
        hour: '2-digit', minute: '2-digit'
      });
    } catch (err) {
      logError('HistoryList.formatTime failed', err);
      logWarn('Wystąpił błąd podczas formatowania daty');
      return iso;
    }
  };
  if (entries.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)', fontSize: 14,
        border: '2px dashed var(--border)', borderRadius: 12 }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>{ICONS.HISTORY}</div>
        {t('history.no_history')}
      </div>
    );
  }
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '160px 1fr 1fr', gap: 12, padding: '8px 16px',
        background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
        fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)'
      }}>
        <span>{t('history.col_time')}</span>
        <span>{t('history.col_profile')}</span>
        <span>{t('history.col_url')}</span>
      </div>
      {entries.map((entry, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '160px 1fr 1fr', gap: 12, padding: '8px 16px',
          borderBottom: i < entries.length - 1 ? '1px solid var(--border)' : 'none',
          fontSize: 12, alignItems: 'center',
          background: i % 2 === 0 ? 'transparent' : 'var(--bg-secondary)',
          transition: 'background 0.1s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
        onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'var(--bg-secondary)'}>
          <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{formatTime(entry.timestamp)}</span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {entry.profileName || '–'}
          </span>
          <span style={{ color: 'var(--text-secondary)', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={entry.url}>
            {entry.url || '–'}
          </span>
        </div>
      ))}
    </div>
  );
}