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
import { logInfo, logError, logWarn, logDebug } from '../utils/loggerRenderer.js';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';

// ─── PRIORITY_COLORS – mapa kolorów priorytetów zadań
//   @returns {Object} – mapa priorytetu na kolor HEX

const PRIORITY_COLORS = { A: '#ef4444', B: '#f97316', C: '#eab308', D: '#3b82f6', E: '#22c55e' };

// ─── AggregatedTaskItem() – pojedynczy element zadania w widoku zbiorczym
//   @param {Object} props – właściwości komponentu
//   @param {Object} props.task – obiekt zadania
//   @param {string} props.section – nazwa sekcji (active/backlog/done)
//   @returns {JSX.Element} – renderowany element zadania

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
