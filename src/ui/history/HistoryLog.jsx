// =============================================================================
// FILE: HistoryLog.jsx
// PATH: src/ui/history/HistoryLog.jsx
// VERSION: 0.0.3
// PURPOSE: Historia przeglądania – lista ostatnio odwiedzonych profili, komunikacja przez hook IPC useHistoryLog.
// FUNCTIONS: HistoryLog
// DEPENDS ON: react, useHistoryLog.js, translations.js, loggerRenderer.js, icons.js, ConfirmModal.jsx, HistoryFilters.jsx, HistoryList.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useContext } from 'react';
import { useHistoryLog } from '../../hooks/useHistoryLog.js';
import { TranslationContext } from '../../utils/translations.js';
import { logInfo, logError } from '../../utils/loggerRenderer.js';
import { ICONS } from '../../utils/icons.js';
import ConfirmModal from '../modals/ConfirmModal.jsx';
import HistoryFilters from './HistoryFilters.jsx';
import HistoryList from './HistoryList.jsx';

export default function HistoryLog() {
  const { t } = useContext(TranslationContext);

  // ─── hook IPC – komunikacja z backendem przez invoke()
  const { entries, loading, reloadHistory } = useHistoryLog();

  // ─── stan lokalny – tylko UI
  const [filteredHistory, setFilteredHistory] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Wyświetlamy przefiltrowane lub wszystkie wpisy
  const displayedHistory = filteredHistory ?? entries;

  // ─── handleClearHistory() – czyści historię przez IPC
  const handleClearHistory = async () => {
    try {
      const res = await window.electronAPI.clearHistory();
      if (res?.ok) {
        setFilteredHistory(null);
        await reloadHistory();
        logInfo('ui', 'HistoryLog: cleared history');
      } else {
        logError('ui', 'HistoryLog: clear failed', res?.error);
      }
    } catch (error) {
      logError('ui', 'HistoryLog: handleClearHistory exception', error.message);
    } finally {
      setShowClearConfirm(false);
    }
  };

  // ─── handleFilter() – filtruje lokalnie wpisy historii po kryteriach wyszukiwania
  const handleFilter = (filters) => {
    let filtered = [...entries];
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.profileName?.toLowerCase().includes(searchLower) ||
        item.url?.toLowerCase().includes(searchLower)
      );
    }
    if (filters.profileId) {
      filtered = filtered.filter(item => item.profileId === filters.profileId);
    }
    setFilteredHistory(filtered);
  };

  if (loading) return <div className="loading">{t('common.loading')}</div>;

  return (
    <div className="history-log">
      <div className="history-header">
        <h2>{t('history.title')}</h2>
        <button className="btn-secondary" onClick={() => setShowClearConfirm(true)}>
          {ICONS.TRASH} {t('history.clear')}
        </button>
      </div>

      <HistoryFilters onFilter={handleFilter} />

      <HistoryList history={displayedHistory} />

      <ConfirmModal
        isOpen={showClearConfirm}
        title={t('history.clear')}
        message={t('history.clear_confirm')}
        onConfirm={handleClearHistory}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
}
