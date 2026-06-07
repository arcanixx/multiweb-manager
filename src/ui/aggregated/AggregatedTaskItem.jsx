// =============================================================================
// FILE: AggregatedTaskItem.jsx
// PATH: src/ui/aggregated/AggregatedTaskItem.jsx
// VERSION: 0.0.3
// PURPOSE: Pojedynczy element zadania w widoku zbiorczym. Wyświetla status (ikona), priorytet (kolor), nazwę, flagę pinned, komentarz, wersję.
// FUNCTIONS: AggregatedTaskItem
// DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import { logError } from '../../utils/loggerRenderer.js';

const PRIORITY_COLORS = { A: '#ef4444', B: '#f97316', C: '#eab308', D: '#3b82f6', E: '#22c55e' };

// Mapowanie status → ikona (przez ICONS, bez hardcoded emoji)
const STATUS_ICON_MAP = {
  in_progress: 'STATUS_IN_PROGRESS',
  todo:        'STATUS_TODO',
  blocked:     'STATUS_BLOCKED',
  done:        'STATUS_DONE',
  cancelled:   'STATUS_CANCELLED',
};

// ─── AggregatedTaskItem() – element zadania w dashboardzie zbiorczym
//   @param {Task} props.task – obiekt zadania (z taskGroupId, groupName, section, status, ...)
export default function AggregatedTaskItem({ task }) {
  const { t } = useContext(TranslationContext);

  let pColor;
  try {
    pColor = PRIORITY_COLORS[task.priority] || '#94a3b8';
  } catch (err) {
    logError('ui', 'AggregatedTaskItem: color error', err.message);
    pColor = '#94a3b8';
  }

  const isDone     = task.section === 'done';
  const statusIcon = ICONS[STATUS_ICON_MAP[task.status]] || ICONS.STATUS_TODO;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '4px 8px', borderRadius: 4, fontSize: 12,
      color:          isDone ? 'var(--text-muted)' : 'var(--text-primary)',
      textDecoration: isDone ? 'line-through'      : 'none',
    }}>
      {/* Priorytet */}
      <div style={{ width: 7, height: 7, borderRadius: 2, background: pColor, flexShrink: 0 }}
        title={`${t('tasks.field_priority')}: ${task.priority}`} />

      {/* Status */}
      <span style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}
        title={t(`tasks.status_${task.status}`)}>
        {statusIcon}
      </span>

      {/* Pin */}
      {task.pinned && (
        <span style={{ fontSize: 10, flexShrink: 0 }}>{ICONS.PIN}</span>
      )}

      {/* Nazwa */}
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {task.name}
      </span>

      {/* Komentarz */}
      {task.comment && (
        <span style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}
          title={t('tasks.has_comment')}>
          {ICONS.COMMENT}
        </span>
      )}

      {/* Wersja */}
      {task.version && (
        <span style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>
          v{task.version}
        </span>
      )}
    </div>
  );
}