// =============================================================================
// FILE: AggregatedProjectSection.jsx
// PATH: src/ui/tasks/AggregatedProjectSection.jsx
// VERSION: 0.0.3
// PURPOSE: Pojedyncza sekcja grupy zadań (TaskGroup) w widoku zbiorczym. Wyświetla zadania per sekcja z pinem na górze.
// FUNCTIONS: AggregatedProjectSection
// DEPENDS ON: react, translations.js, icons.js, AggregatedTaskItem
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import AggregatedTaskItem from './AggregatedTaskItem.jsx';

// ─── AggregatedProjectSection() – sekcja grupy zadań w dashboardzie
//   @param {string}   props.groupId          – ID grupy
//   @param {string}   props.groupName        – wyświetlana nazwa grupy
//   @param {Task[]}   props.tasks            – zadania grupy (już przefiltrowane)
//   @param {boolean}  props.hidden           – czy grupa ukryta
//   @param {boolean}  props.collapsed        – czy sekcja zwinięta
//   @param {Function} props.onToggleHidden   – callback przełączenia widoczności
//   @param {Function} props.onToggleCollapse – callback przełączenia zwinięcia
export default function AggregatedProjectSection({
  groupId, groupName, tasks,
  hidden, collapsed,
  onToggleHidden, onToggleCollapse,
}) {
  const { t } = useContext(TranslationContext);

  const active  = tasks.filter(t => t.section === 'active');
  const backlog = tasks.filter(t => t.section === 'backlog');
  const done    = tasks.filter(t => t.section === 'done');

  // Zadania pinnowane wyróżnione na górze (niezależnie od sekcji)
  const pinned   = tasks.filter(t => t.pinned);
  const unpinned = tasks.filter(t => !t.pinned);

  // Widok ukryty — uproszczony pasek
  if (hidden) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '4px 8px', marginBottom: 4, borderRadius: 6,
        background: 'var(--bg-secondary)', opacity: 0.5,
      }}>
        <span style={{ fontSize: 12 }}>{ICONS.TASK_GROUP}</span>
        <span style={{ flex: 1, fontSize: 12, color: 'var(--text-muted)' }}>
          {groupName} — {t('aggregatedTasks.hidden')}
        </span>
        <button className="btn-icon" style={{ fontSize: 11 }}
          onClick={onToggleHidden} title={t('aggregatedTasks.show_project')}>
          {ICONS.EYE}
        </button>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, marginBottom: 10, overflow: 'hidden' }}>

      {/* ─── Nagłówek grupy ─── */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 12px', background: 'var(--bg-secondary)', cursor: 'pointer',
        }}
        onClick={onToggleCollapse}
      >
        <span style={{ fontSize: 11 }}>{collapsed ? ICONS.CHEVRON_RIGHT : ICONS.CHEVRON_DOWN}</span>
        <span style={{ fontSize: 14 }}>{ICONS.TASK_GROUP}</span>
        <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', flex: 1 }}>
          {groupName}
        </span>
        {/* Liczniki per sekcja */}
        <span style={{ fontSize: 11, color: '#ef4444' }}>{active.length} {t('tasks.section_active')}</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>· {backlog.length} {t('tasks.section_backlog')}</span>
        <span style={{ fontSize: 11, color: '#22c55e' }}>· {done.length} {t('tasks.section_done')}</span>
        <button className="btn-icon" style={{ fontSize: 11, marginLeft: 4 }}
          onClick={e => { e.stopPropagation(); onToggleHidden(); }}
          title={t('aggregatedTasks.hide_project')}>
          {ICONS.EYE_OFF}
        </button>
      </div>

      {/* ─── Treść grupy ─── */}
      {!collapsed && (
        <div style={{ padding: '6px 8px' }}>
          {/* Pinnowane na górze */}
          {pinned.length > 0 && (
            <div style={{ borderBottom: '1px solid var(--border)', marginBottom: 4, paddingBottom: 4 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2, paddingLeft: 8 }}>
                {ICONS.PIN} {t('tasks.pinned_label')}
              </div>
              {pinned.map(task => <AggregatedTaskItem key={task.id} task={task} />)}
            </div>
          )}

          {/* Active */}
          {active.filter(t => !t.pinned).map(task => (
            <AggregatedTaskItem key={task.id} task={task} />
          ))}

          {/* Backlog */}
          {backlog.filter(t => !t.pinned).length > 0 && (
            <div style={{ marginTop: 4, paddingTop: 4, borderTop: '1px dashed var(--border)' }}>
              {backlog.filter(t => !t.pinned).map(task => (
                <AggregatedTaskItem key={task.id} task={task} />
              ))}
            </div>
          )}

          {/* Done */}
          {done.length > 0 && (
            <div style={{ marginTop: 4, paddingTop: 4, borderTop: '1px dashed var(--border)' }}>
              {done.map(task => <AggregatedTaskItem key={task.id} task={task} />)}
            </div>
          )}

          {tasks.length === 0 && (
            <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '4px 8px', fontStyle: 'italic' }}>
              {t('aggregatedTasks.no_tasks')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
