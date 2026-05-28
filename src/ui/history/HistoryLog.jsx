// =============================================================================
// FILE: HistoryLog.jsx
// PATH: src/ui/history/HistoryLog.jsx
// VERSION: 0.0.3
// PURPOSE: Główny komponent historii – łączy filtry, listę i eksport
// FUNCTIONS: HistoryLog
// DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js, HistoryFilters, HistoryList, HistoryExport
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect, useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import { log, logError, logInfo, logWarn } from '../../utils/loggerRenderer.js';
import HistoryFilters from './HistoryFilters';
import HistoryList from './HistoryList';
import HistoryExport from './HistoryExport';

// ─── HistoryLog() – główny komponent historii z filtrowaniem, listą i eksportem
//   @returns {JSX.Element} – renderowany widok historii
export default function HistoryLog() {
  const { t } = useContext(TranslationContext);
  const [history, setHistory] = useState([]);
  const [filterLevel, setFilterLevel] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  

  // ─── loadHistory() – ładuje historię z backendu przez IPC
  //   @returns {Promise<void>}
  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await window.electronAPI.getHistory();
      setHistory(Array.isArray(data) ? data : []);
      log('HistoryLog: loaded', data?.length || 0, 'entries');
      logInfo(`HistoryLog: loaded ${data?.length || 0} entries`);
    } catch (err) {
      setError(err.message);
      logError('HistoryLog: load failed', err);
      logWarn('Nie można załadować historii');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadHistory();
  }, []);
  const filtered = history.filter(entry =>
    filterLevel === 'all' || entry.level === filterLevel
  );
  const sorted = [...filtered].sort((a, b) =>
    sortOrder === 'desc' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp
  );
  
  // ─── handleClear() – obsługa czyszczenia historii po potwierdzeniu
  //   @returns {Promise<void>}
  const handleClear = async () => {
    try {
      if (!window.confirm(t('history.clear_confirm'))) return;
      await window.electronAPI.clearHistory();
      logInfo('HistoryLog: history cleared');
      await loadHistory();
    } catch (err) {
      logError('HistoryLog: clear failed', err);
      logWarn('Wystąpił błąd podczas czyszczenia historii');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        <span style={{ fontSize: 24, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '20px 24px', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
              {ICONS.HISTORY} {t('history.title')}
            </h1>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{t('history.subtitle')}</div>
          </div>
          <HistoryFilters
            filterLevel={filterLevel}
            onFilterChange={setFilterLevel}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            onClear={handleClear}
            hasEntries={history.length > 0}
          />
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', borderRadius: 8, color: 'var(--danger)', fontSize: 13, marginBottom: 16 }}>
            {ICONS.WARNING} {error}
          </div>
        )}

        <HistoryList entries={sorted} />
        <HistoryExport entries={sorted} />
      </div>
    </div>
  );
}
