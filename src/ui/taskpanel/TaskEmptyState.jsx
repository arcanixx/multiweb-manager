// =============================================================================
// FILE: TaskEmptyState.jsx
// PATH: src/ui/taskpanel/TaskEmptyState.jsx
// VERSION: 0.0.3
// PURPOSE: Komponent wyświetlający stan braku zadań w danej sekcji.
// FUNCTIONS: TaskEmptyState
// DEPENDS ON: react, translations.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';

export default function TaskEmptyState() {
  const { t } = useContext(TranslationContext);
  return (
    <div className="empty-state" style={{ fontSize: 11, color: 'var(--text-muted)', padding: '4px 8px', fontStyle: 'italic' }}>
      {t('tasks.no_tasks')}
    </div>
  );
}