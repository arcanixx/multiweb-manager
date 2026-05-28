// =============================================================================
// FILE: HistoryFilters.jsx
// PATH: src/ui/history/HistoryFilters.jsx
// VERSION: 0.0.3
// PURPOSE: Filtry historii (poziom, sortowanie, przycisk czyszczenia)
// FUNCTIONS: HistoryFilters
// DEPENDS ON: react, translations.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
export default function HistoryFilters({ filterLevel, onFilterChange, sortOrder, onSortChange, onClear, hasEntries }) {
  const { t } = useContext(TranslationContext);
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <select className="form-select" style={{ width: 100, fontSize: 12, height: 30 }}
        value={filterLevel} onChange={e => onFilterChange(e.target.value)}>
        <option value="all">Wszystkie</option>
        <option value="info">{ICONS.INFO} Info</option>
        <option value="warn">{ICONS.WARNING} Warn</option>
        <option value="error">{ICONS.ERROR} Error</option>
      </select>
      <select className="form-select" style={{ width: 100, fontSize: 12, height: 30 }}
        value={sortOrder} onChange={e => onSortChange(e.target.value)}>
        <option value="desc">{ICONS.CHEVRON_DOWN} Najnowsze</option>
        <option value="asc">{ICONS.CHEVRON_UP} Najstarsze</option>
      </select>
      <button className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }}
        onClick={onClear} disabled={!hasEntries}>
        {ICONS.DELETE} {t('history.clear')}
      </button>
    </div>
  );
}
