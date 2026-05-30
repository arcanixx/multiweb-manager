// =============================================================================
// FILE: HistoryFilters.jsx
// PATH: src/ui/history/HistoryFilters.jsx
// VERSION: 0.0.3
// PURPOSE: Filtry historii (poziom, sortowanie, przycisk czyszczenia)
// FUNCTIONS: HistoryFilters
// DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import { logInfo, logError, logWarn } from '../../utils/loggerRenderer.js';

// ─── HistoryFilters() – komponent filtrów historii (poziom, sortowanie, czyszczenie)
//   @param {Object} props – właściwości komponentu
//   @param {string} props.filterLevel – bieżący poziom filtru
//   @param {Function} props.onFilterChange – callback zmiany filtru
//   @param {string} props.sortOrder – bieżący porządek sortowania
//   @param {Function} props.onSortChange – callback zmiany sortowania
//   @param {Function} props.onClear – callback czyszczenia historii
//   @param {boolean} props.hasEntries – czy są wpisy do wyczyszczenia
//   @returns {JSX.Element} – renderowany komponent filtrów
export default function HistoryFilters({ filterLevel, onFilterChange, sortOrder, onSortChange, onClear, hasEntries }) {
  const { t } = useContext(TranslationContext);

  // ─── handleFilterChange() – obsługa zmiany poziomu filtru
  //   @param {Event} e – zdarzenie zmiany selecta
  //   @returns {void}
  // ─── handleFilterChange() – TODO: opis funkcji
  const handleFilterChange = (e) => {
    try {
      onFilterChange(e.target.value);
      logInfo(`HistoryFilters: filter changed to ${e.target.value}`);
    } catch (err) {
      logError('HistoryFilters: filter change failed', err);
      logWarn('Wystąpił błąd podczas zmiany filtru');
    }
  };

  // ─── handleSortChange() – obsługa zmiany porządku sortowania
  //   @param {Event} e – zdarzenie zmiany selecta
  //   @returns {void}
  // ─── handleSortChange() – TODO: opis funkcji
  const handleSortChange = (e) => {
    try {
      onSortChange(e.target.value);
      logInfo(`HistoryFilters: sort changed to ${e.target.value}`);
    } catch (err) {
      logError('HistoryFilters: sort change failed', err);
      logWarn('Wystąpił błąd podczas zmiany sortowania');
    }
  };

  // ─── handleClear() – obsługa czyszczenia historii
  //   @returns {void}
  const handleClear = () => {
    try {
      onClear();
      logInfo('HistoryFilters: history cleared');
    } catch (err) {
      logError('HistoryFilters: clear failed', err);
      logWarn('Wystąpił błąd podczas czyszczenia historii');
    }
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
        <select className="form-select" style={{ width: 100, fontSize: 12, height: 30 }}
          value={filterLevel} onChange={handleFilterChange}>
        <option value="all">Wszystkie</option>
        <option value="info">{ICONS.INFO} Info</option>
        <option value="warn">{ICONS.WARNING} Warn</option>
        <option value="error">{ICONS.ERROR} Error</option>
      </select>
        <select className="form-select" style={{ width: 100, fontSize: 12, height: 30 }}
          value={sortOrder} onChange={handleSortChange}>
        <option value="desc">{ICONS.CHEVRON_DOWN} Najnowsze</option>
        <option value="asc">{ICONS.CHEVRON_UP} Najstarsze</option>
      </select>
        <button className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }}
          onClick={handleClear} disabled={!hasEntries}>
        {ICONS.DELETE} {t('history.clear')}
      </button>
    </div>
  );
}