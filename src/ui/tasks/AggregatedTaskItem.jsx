// =============================================================================
// FILE: AggregatedTaskItem.jsx
// PATH: src/ui/tasks/AggregatedTaskItem.jsx
// VERSION: 0.0.3
// PURPOSE: Wyspecjalizowany komponent prezentujący zadanie w widoku zagregowanym (dashboard). Obsługuje wizualizację priorytetów, znaczników wersji oraz statusu wykonania (skreślenie).
// FUNCTIONS: AggregatedTaskItem
// DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logError } from '../utils/loggerRenderer.js';
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
  
  // ─── getPriorityColor() – wyznacza kolor indykatora na podstawie priorytetu zadania
  const getPriorityColor = () => {
    try {
      return PRIORITY_COLORS[task.priority] || '#94a3b8';
    } catch (err) {
      logError('ui', 'AggregatedTaskItem: color resolution failed', err.message);
      return '#94a3b8';
    }
  };

  const pColor = getPriorityColor();
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