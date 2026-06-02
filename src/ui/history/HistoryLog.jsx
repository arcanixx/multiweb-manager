// =============================================================================
// FILE: HistoryLog.jsx
// PATH: src/ui/history/HistoryLog.jsx
// VERSION: 0.0.3
// PURPOSE: Historia przeglądania – lista ostatnio odwiedzonych profili
// FUNCTIONS: HistoryLog
// DEPENDS ON: react, historyStore.js, translations.js, loggerRenderer.js, icons.js, ConfirmModal.jsx, HistoryFilters.jsx, HistoryList.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect, useContext } from 'react';
import { loadHistory, clearHistory, addHistoryEntry } from '../../core/historyStore.js';
import { TranslationContext } from '../../utils/translations.js';
import { logInfo, logError } from '../../utils/loggerRenderer.js';
import { ICONS } from '../../utils/icons.js';
import ConfirmModal from '../modals/ConfirmModal.jsx';
import HistoryFilters from './HistoryFilters.jsx';
import HistoryList from './HistoryList.jsx';

export default function HistoryLog() {
  const { t } = useContext(TranslationContext);
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  // ─── loadData() – Pobiera wpisy historii za pomocą funkcji loadHistory(), aktualizuje stan lokalny oraz obsługuje flagę ładowania (loading)
  const loadData = async () => {
    try {
      setLoading(true);
      const historyData = await loadHistory();
      setHistory(historyData);
      setFilteredHistory(historyData);
      logInfo('HistoryLog: loaded history');
    } catch (error) {
      logError('HistoryLog: failed to load history', error);
    } finally {
      setLoading(false);
    }
  };

  // ─── handleClearHistory() – Obsługuje proces czyszczenia całej historii przeglądania użytkownika, resetuje stany filtrowania oraz zamyka modal potwierdzający
  const handleClearHistory = async () => {
    try {
      await clearHistory();
      setHistory([]);
      setFilteredHistory([]);
      logInfo('HistoryLog: cleared history');
    } catch (error) {
      logError('HistoryLog: failed to clear history', error);
    }
    setShowClearConfirm(false);
  };

  // ─── handleFilter() – Filtruje dane historii na podstawie przekazanych kryteriów wyszukiwania (nazwa profilu lub adres URL) i aktualizuje stan przefiltrowanej historii
  const handleFilter = (filters) => {
    let filtered = [...history];
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

      <HistoryList history={filteredHistory} />

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