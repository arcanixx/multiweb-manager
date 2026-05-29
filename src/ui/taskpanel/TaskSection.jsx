// =============================================================================
// FILE: TaskSection.jsx
// PATH: src/ui/taskpanel/TaskSection.jsx
// VERSION: 0.0.3
// PURPOSE: Pojedyncza sekcja zadań (aktywne, backlog, done)
// FUNCTIONS: TaskSection
// DEPENDS ON: react, translations.js, icons.js, TaskItem
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useContext } from 'react';
import { logInfo, logError, logWarn, logDebug } from '../utils/loggerRenderer.js';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import TaskItem from './TaskItem';

// ─── TaskSection() – pojedyncza sekcja zadań (active/backlog/done)
//   @param {Object} props – właściwości komponentu
//   @param {string} props.title – tytuł sekcji
//   @param {string} props.iconColor – kolor indykatora sekcji
//   @param {Array} props.tasks – lista zadań w sekcji
//   @param {Function} props.onMoveToDone – callback przeniesienia do done
//   @param {Function} props.onMoveToBacklog – callback przeniesienia do backlog
//   @param {Function} props.onMoveToActive – callback przeniesienia do active
//   @param {Function} props.onPin – callback przypięcia zadania
//   @param {Function} props.onDelete – callback usunięcia zadania
//   @param {Function} props.onEdit – callback edycji zadania
//   @param {Function} props.onOpenComment – callback otwarcia komentarza
//   @param {string} props.section – nazwa sekcji
//   @returns {JSX.Element} – renderowana sekcja zadań

export default function TaskSection({ title, iconColor, tasks, onMoveToDone, onMoveToBacklog, onMoveToActive, onPin, onDelete, onEdit, onOpenComment, section }) {
  const { t } = useContext(TranslationContext);
  const [collapsed, setCollapsed] = useState(false);
  const sortedTasks = [...tasks].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', marginBottom: 6, padding: '2px 4px', borderRadius: 4 }} onClick={() => setCollapsed(!collapsed)}>
        <div style={{ width: 8, height: 8, borderRadius: 2, background: iconColor, flexShrink: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', flex: 1 }}>{title}</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{tasks.length}</span>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{collapsed ? ICONS.CHEVRON_RIGHT : ICONS.CHEVRON_DOWN}</span>
      </div>
      {!collapsed && (
        tasks.length === 0
          ? <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '4px 8px', fontStyle: 'italic' }}>{t('tasks.no_tasks')}</div>
          : sortedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                section={section}
                onMoveToDone={onMoveToDone}
                onMoveToBacklog={onMoveToBacklog}
                onMoveToActive={onMoveToActive}
                onPin={onPin}
                onDelete={onDelete}
                onEdit={onEdit}
                onOpenComment={onOpenComment}
              />
            ))
      )}
    </div>
  );
}
