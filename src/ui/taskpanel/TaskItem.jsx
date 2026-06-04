// =============================================================================
// FILE: TaskItem.jsx
// PATH: src/ui/taskpanel/TaskItem.jsx
// VERSION: 0.0.3
// PURPOSE: Interaktywny element listy zadań w panelu projektu. Dostarcza pełny zestaw akcji CRUD (edycja, usuwanie, pinowanie) oraz szybkie przyciski zmiany stanu (Move to Active/Backlog/Done).
// FUNCTIONS: TaskItem
// DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { logInfo, logError, logWarn, logDebug } from '../../utils/loggerRenderer.js';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';

// ─── PRIORITY_COLORS – mapowanie kolorów dla priorytetów zadań
//   @returns {Object} – mapa priorytetu na kolor HEX

const PRIORITY_COLORS = { A: '#ef4444', B: '#f97316', C: '#eab308', D: '#3b82f6', E: '#22c55e' };

// ─── TaskItem() – pojedynczy element zadania z przyciskami akcji
//   @param {Object} props – właściwości komponentu
//   @param {Object} props.task – obiekt zadania
//   @param {string} props.section – nazwa sekcji (active/backlog/done)
//   @param {Function} props.onMoveToDone – callback przeniesienia do done
//   @param {Function} props.onMoveToBacklog – callback przeniesienia do backlog
//   @param {Function} props.onMoveToActive – callback przeniesienia do active
//   @param {Function} props.onPin – callback przypięcia/odpięcia zadania
//   @param {Function} props.onDelete – callback usunięcia zadania
//   @param {Function} props.onEdit – callback edycji zadania
//   @param {Function} props.onOpenComment – callback otwarcia komentarza
//   @returns {JSX.Element} – renderowany element zadania

export default function TaskItem({ task, section, onMoveToDone, onMoveToBacklog, onMoveToActive, onPin, onDelete, onEdit, onOpenComment }) {
  const { t } = useContext(TranslationContext);

  // ─── handleAction() – opakowuje wywołania akcji w try-catch i loguje moduł tasks
  const handleAction = (actionName, callback, ...args) => {
    try {
      logDebug('tasks', `TaskItem: performing action ${actionName}`, { taskId: task.id });
      callback(...args);
    } catch (err) {
      logError('tasks', `TaskItem: action ${actionName} failed`, err.message);
    }
  };

  const pColor = PRIORITY_COLORS[task.priority] || '#94a3b8';
  return (
    <div style={{
      border: '1px solid var(--border)', borderRadius: 6, padding: '6px 8px', marginBottom: 4,
      background: task.pinned ? 'var(--bg-active)' : 'var(--bg-card)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div className="priority-dot" style={{ background: pColor }} title={`Priorytet: ${task.priority}`} />
        <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={task.name}>
          {task.pinned && <span style={{ marginRight: 4, fontSize: 10 }}>{ICONS.PIN}</span>}{task.name}
        </span>
        {(task.comment || task.desc) && (
          <span style={{ fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => onOpenComment(task)} title={t('tasks.has_comment')}>{ICONS.COMMENT}</span>
        )}
        <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
          <button className="btn-icon" style={{ fontSize: 11, padding: '2px 5px' }} onClick={() => onPin(task.id, section)} title={task.pinned ? t('tasks.unpin') : t('tasks.pin')}>
            {task.pinned ? ICONS.PIN : ICONS.UNPIN}
          </button>
          <button className="btn-icon" style={{ fontSize: 11, padding: '2px 5px' }} onClick={() => onEdit(task)} title={t('tasks.edit')}>{ICONS.EDIT}</button>
          {section === 'active' && (
            <>
              <button className="btn-icon" style={{ fontSize: 11, padding: '2px 5px' }} onClick={() => onMoveToDone(task.id)} title={t('tasks.move_to_done')}>{ICONS.DONE}</button>
              <button className="btn-icon" style={{ fontSize: 11, padding: '2px 5px' }} onClick={() => onMoveToBacklog(task.id)} title={t('tasks.move_to_backlog')}>{ICONS.CHEVRON_LEFT}</button>
            </>
          )}
          {section === 'backlog' && (
            <button className="btn-icon" style={{ fontSize: 11, padding: '2px 5px' }} onClick={() => onMoveToActive(task.id)} title={t('tasks.move_to_active')}>{ICONS.CHEVRON_RIGHT}</button>
          )}
          {section === 'done' && (
            <button className="btn-icon" style={{ fontSize: 11, padding: '2px 5px' }} onClick={() => onMoveToActive(task.id)} title={t('tasks.restore')}>{ICONS.REFRESH}</button>
          )}
          <button className="btn-icon" style={{ fontSize: 11, padding: '2px 5px', color: 'var(--danger)' }} onClick={() => onDelete(task.id)} title={t('tasks.delete')}>{ICONS.DELETE}</button>
        </div>
      </div>
      {task.version && <div style={{ fontSize: 10, color: 'var(--text-muted)', paddingLeft: 16 }}>{ICONS.VERSION} v{task.version}</div>}
    </div>
  );
}