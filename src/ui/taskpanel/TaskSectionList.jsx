// =============================================================================
// FILE: TaskSectionList.jsx
// PATH: src/ui/taskpanel/TaskSectionList.jsx
// VERSION: 0.0.3
// PURPOSE: Renderuje pogrupowaną listę sekcji zadań (Active, Backlog, Done) w panelu bocznym.
// FUNCTIONS: TaskSectionList
// DEPENDS ON: react, translations.js, TaskSection.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import TaskSection from './TaskSection.jsx';

// ─── TaskSectionList() – renderuje trzy sekcje zadań (active / backlog / done)
//   @param {{ active, backlog, done }} props.tasks    – zadania per sekcja
//   @param {Object}                   props.handlers  – callbacks (onMoveToDone, onEdit, ...)
export default function TaskSectionList({ tasks, handlers }) {
  const { t } = useContext(TranslationContext);
  const { onMoveToDone, onMoveToBacklog, onMoveToActive, onPin, onDelete, onEdit, onOpenComment } = handlers;

  return (
    <div className="task-sections" style={{ flex: 1, overflowY: 'auto', padding: '0 4px' }}>
      <TaskSection
        title={t('tasks.section_active')}
        iconColor="#ef4444"
        section="active"
        tasks={tasks.active || []}
        onMoveToDone={onMoveToDone}
        onMoveToBacklog={onMoveToBacklog}
        onPin={onPin}
        onDelete={onDelete}
        onEdit={onEdit}
        onOpenComment={onOpenComment}
      />
      <TaskSection
        title={t('tasks.section_backlog')}
        iconColor="#eab308"
        section="backlog"
        tasks={tasks.backlog || []}
        onMoveToActive={onMoveToActive}
        onPin={onPin}
        onDelete={onDelete}
        onEdit={onEdit}
        onOpenComment={onOpenComment}
      />
      <TaskSection
        title={t('tasks.section_done')}
        iconColor="#22c55e"
        section="done"
        tasks={tasks.done || []}
        onMoveToBacklog={onMoveToBacklog}
        onPin={onPin}
        onDelete={onDelete}
        onEdit={onEdit}
        onOpenComment={onOpenComment}
      />
    </div>
  );
}
