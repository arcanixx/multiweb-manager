// =============================================================================
// FILE: TaskItem.jsx
// PATH: src/ui/taskpanel/TaskItem.jsx
// VERSION: 0.0.3
// PURPOSE: Pojedynczy element zadania w panelu. Wyświetla status, priorytet, nazwę i przyciski akcji. Przyciski ruchu między sekcjami są kontekstowe (zależą od section i status zadania).
// FUNCTIONS: TaskItem
// DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { logDebug, logError } from '../../utils/loggerRenderer.js';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';

// ─── Kolory priorytetów A–E
const PRIORITY_COLORS = { A: '#ef4444', B: '#f97316', C: '#eab308', D: '#3b82f6', E: '#22c55e' };

// ─── Mapowanie status → ikona z ICONS (nie hardcoded)
const STATUS_ICON_MAP = {
  in_progress: 'STATUS_IN_PROGRESS',
  todo:        'STATUS_TODO',
  blocked:     'STATUS_BLOCKED',
  done:        'STATUS_DONE',
  cancelled:   'STATUS_CANCELLED',
};

// ─── TaskItem() – element zadania z akcjami kontekstowymi
//   @param {Object}   props.task            – obiekt zadania
//   @param {string}   props.section         – 'active' | 'backlog' | 'done'
//   @param {Function} props.onMoveToDone    – (id) => void
//   @param {Function} props.onMoveToBacklog – (id) => void
//   @param {Function} props.onMoveToActive  – (id) => void
//   @param {Function} props.onPin           – (id) => void
//   @param {Function} props.onDelete        – (id) => void
//   @param {Function} props.onEdit          – (task) => void
//   @param {Function} props.onOpenComment   – (task) => void
export default function TaskItem({
  task, section,
  onMoveToDone, onMoveToBacklog, onMoveToActive,
  onPin, onDelete, onEdit, onOpenComment
}) {
  const { t } = useContext(TranslationContext);

  const handle = (name, fn, ...args) => {
    try {
      logDebug('tasks', `TaskItem: ${name}`, task.id);
      fn(...args);
    } catch (err) {
      logError('tasks', `TaskItem: ${name} failed`, err.message);
    }
  };

  const pColor     = PRIORITY_COLORS[task.priority] || '#94a3b8';
  const statusIcon = ICONS[STATUS_ICON_MAP[task.status]] || ICONS.STATUS_TODO;

  return (
    <div style={{
      border: '1px solid var(--border)', borderRadius: 6, padding: '6px 8px', marginBottom: 4,
      background: task.pinned ? 'var(--bg-active)' : 'var(--bg-card)',
    }}>
      {/* ─── Wiersz główny ─── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Priorytet */}
        <div style={{
          width: 8, height: 8, borderRadius: 2, background: pColor, flexShrink: 0,
        }} title={`${t('tasks.field_priority')}: ${task.priority}`} />

        {/* Status */}
        <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}
          title={t(`tasks.status_${task.status}`)}>
          {statusIcon}
        </span>

        {/* Nazwa */}
        <span style={{
          flex: 1, fontSize: 12, fontWeight: 600, color: 'var(--text-primary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }} title={task.name}>
          {task.pinned && <span style={{ marginRight: 4, fontSize: 10 }}>{ICONS.PIN}</span>}
          {task.name}
        </span>

        {/* Ikona komentarza */}
        {(task.comment || task.desc) && (
          <span style={{ fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}
            onClick={() => handle('openComment', onOpenComment, task)}
            title={t('tasks.has_comment')}>
            {ICONS.COMMENT}
          </span>
        )}

        {/* ─── Przyciski akcji ─── */}
        <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
          {/* Pin */}
          <button className="btn-icon" style={{ fontSize: 11, padding: '2px 5px' }}
            onClick={() => handle('pin', onPin, task.id)}
            title={task.pinned ? t('tasks.unpin') : t('tasks.pin')}>
            {task.pinned ? ICONS.PIN : ICONS.UNPIN}
          </button>

          {/* Edycja */}
          <button className="btn-icon" style={{ fontSize: 11, padding: '2px 5px' }}
            onClick={() => handle('edit', onEdit, task)}
            title={t('tasks.edit')}>
            {ICONS.EDIT}
          </button>

          {/* ─── Przyciski kontekstowe per sekcja ─── */}
          {section === 'active' && (
            <>
              <button className="btn-icon" style={{ fontSize: 11, padding: '2px 5px' }}
                onClick={() => handle('moveToDone', onMoveToDone, task.id)}
                title={t('tasks.move_to_done')}>
                {ICONS.DONE}
              </button>
              <button className="btn-icon" style={{ fontSize: 11, padding: '2px 5px' }}
                onClick={() => handle('moveToBacklog', onMoveToBacklog, task.id)}
                title={t('tasks.move_to_backlog')}>
                {ICONS.CHEVRON_LEFT}
              </button>
            </>
          )}
          {section === 'backlog' && (
            <button className="btn-icon" style={{ fontSize: 11, padding: '2px 5px' }}
              onClick={() => handle('moveToActive', onMoveToActive, task.id)}
              title={t('tasks.move_to_active')}>
              {ICONS.CHEVRON_RIGHT}
            </button>
          )}
          {section === 'done' && (
            <button className="btn-icon" style={{ fontSize: 11, padding: '2px 5px' }}
              onClick={() => handle('moveToBacklog', onMoveToBacklog, task.id)}
              title={t('tasks.restore')}>
              {ICONS.REFRESH}
            </button>
          )}

          {/* Usuń */}
          <button className="btn-icon"
            style={{ fontSize: 11, padding: '2px 5px', color: 'var(--danger)' }}
            onClick={() => handle('delete', onDelete, task.id)}
            title={t('tasks.delete')}>
            {ICONS.DELETE}
          </button>
        </div>
      </div>

      {/* ─── Wiersz dodatkowy: wersja ─── */}
      {task.version && (
        <div style={{ fontSize: 10, color: 'var(--text-muted)', paddingLeft: 18, marginTop: 2 }}>
          {ICONS.VERSION} v{task.version}
        </div>
      )}
    </div>
  );
}
