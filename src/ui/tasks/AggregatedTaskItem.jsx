// =============================================================================
// FILE: AggregatedTaskItem.jsx
// PATH: src/ui/tasks/AggregatedTaskItem.jsx
// VERSION: 0.0.3
// PURPOSE: Pojedyncze zadanie w widoku zbiorczym
// FUNCTIONS: AggregatedTaskItem
// DEPENDS ON: react, translations.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
const PRIORITY_COLORS = { A: '#ef4444', B: '#f97316', C: '#eab308', D: '#3b82f6', E: '#22c55e' };
export default function AggregatedTaskItem({ task, section }) {
  const { t } = useContext(TranslationContext);
  const pColor = PRIORITY_COLORS[task.priority] || '#94a3b8';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', borderRadius: 4, fontSize: 12,
      color: section === 'done' ? 'var(--text-muted)' : 'var(--text-primary)',
      textDecoration: section === 'done' ? 'line-through' : 'none'
    }}>
      <div className="priority-dot" style={{ background: pColor, flexShrink: 0 }} />
      {task.pinned && <span style={{ fontSize: 10 }}>{ICONS.PIN}</span>}
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.name}</span>
      {task.comment && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{ICONS.COMMENT}</span>}
      {task.version && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>v{task.version}</span>}
    </div>
  );
}
