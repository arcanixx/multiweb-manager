// =============================================================================
// FILE: TaskSectionList.jsx
// PATH: src/ui/taskpanel/TaskSectionList.jsx
// VERSION: 0.0.3
// PURPOSE: Renderuje pogrupowaną listę sekcji zadań (Active, Backlog, Done) w panelu bocznym.
// FUNCTIONS: TaskSectionList
// DEPENDS ON: react, TaskSection.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React from 'react';
import TaskSection from './TaskSection.jsx';

export default function TaskSectionList({ tasks, handlers }) {
  const { onMoveToDone, onMoveToBacklog, onMoveToActive, onPin, onDelete, onEdit, onOpenComment } = handlers;

  return (
    <div className="task-sections" style={{ flex: 1, overflowY: 'auto', padding: '0 4px' }}>
      <TaskSection 
        title="Aktualne" iconColor="#ef4444" section="active"
        tasks={tasks.active} onMoveToDone={onMoveToDone} onMoveToBacklog={onMoveToBacklog}
        onPin={onPin} onDelete={onDelete} onEdit={onEdit} onOpenComment={onOpenComment}
      />
      
      <TaskSection 
        title="Backlog" iconColor="#eab308" section="backlog"
        tasks={tasks.backlog} onMoveToActive={onMoveToActive}
        onPin={onPin} onDelete={onDelete} onEdit={onEdit} onOpenComment={onOpenComment}
      />
      
      <TaskSection 
        title="Zrobione" iconColor="#22c55e" section="done"
        tasks={tasks.done} onMoveToActive={onMoveToActive}
        onPin={onPin} onDelete={onDelete} onEdit={onEdit} onOpenComment={onOpenComment}
      />
    </div>
  );
}