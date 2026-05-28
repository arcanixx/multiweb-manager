// =============================================================================
// FILE: HistoryExport.jsx
// PATH: src/ui/history/HistoryExport.jsx
// VERSION: 0.0.3
// PURPOSE: Eksport historii do CSV
// FUNCTIONS: HistoryExport
// DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import { logDebug } from '../../utils/loggerRenderer.js';
export default function HistoryExport({ entries }) {
  const { t } = useContext(TranslationContext);
  const exportToCSV = () => {
    if (entries.length === 0) return;
    const headers = ['Timestamp', 'Profile', 'URL'];
    const rows = entries.map(e => [
      e.timestamp ? new Date(e.timestamp).toISOString() : '',
      e.profileName || '',
      e.url || ''
    ]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `history_${new Date().toISOString().slice(0, 19)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    logDebug('History exported to CSV');
  };
  return (
    <div style={{ marginTop: 16, textAlign: 'right' }}>
      <button className="btn btn-secondary" style={{ fontSize: 12 }} onClick={exportToCSV} disabled={entries.length === 0}>
        {ICONS.EXPORT} {t('history.export') || 'Eksportuj CSV'}
      </button>
    </div>
  );
}
