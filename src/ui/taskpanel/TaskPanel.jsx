// =============================================================================
// FILE: TaskPanel.jsx
// PATH: src/ui/taskpanel/TaskPanel.jsx
// VERSION: 0.0.3
// PURPOSE: Główny komponent panelu zadań – czysty orkiestrator. Zarządza sekcjami zadań (active/backlog/done) i deleguje logikę do useTaskPanelHandlers.
// FUNCTIONS: TaskPanel
// DEPENDS ON: react, useTasks.js, useTaskPanelHandlers.js, translations.js, loggerRenderer.js, icons.js, ConfirmModal.jsx, TaskModal.jsx, CommentModal.jsx, TaskSectionList.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect, useContext } from 'react';
import { useTasks }               from '../../hooks/useTasks.js';
import { useTaskPanelHandlers }   from '../../hooks/taskpanel/useTaskPanelHandlers.js';
import { TranslationContext }     from '../../utils/translations.js';
import { logDebug }               from '../../utils/loggerRenderer.js';
import { ICONS }                  from '../../utils/icons.js';
import ConfirmModal               from '../modals/ConfirmModal.jsx';
import TaskModal    from '../modals/TaskModal.jsx';
import CommentModal from '../modals/CommentModal.jsx';
import TaskSectionList            from './TaskSectionList.jsx';

// ─── TaskPanel() – panel zadań dla grupy (taskGroupId)
//   @param {string}   props.taskGroupId – ID grupy zadań (wyznaczony z profilu)
//   @param {string}   props.groupName   – wyświetlana nazwa grupy
//   @param {boolean}  props.visible     – czy panel jest widoczny
//   @param {Function} props.onClose     – callback zamknięcia
export default function TaskPanel({ taskGroupId, groupName, visible, onClose }) {
  const { t } = useContext(TranslationContext);

  // ─── Dane zadań ───
  const { tasks: allTasks, loading, reloadTasks, addTask, updateTask, deleteTask } = useTasks();
  const [sections, setSections] = useState({ active: [], backlog: [], done: [] });

  // ─── Załaduj zadania gdy zmienia się taskGroupId lub widoczność ───
  useEffect(() => {
    if (taskGroupId && visible) {
      logDebug('tasks', 'TaskPanel: loading tasks for group', taskGroupId);
      reloadTasks(taskGroupId);
    }
  }, [taskGroupId, visible]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Filtruj i grupuj zadania po sekcjach ───
  useEffect(() => {
    if (!allTasks?.length) { setSections({ active: [], backlog: [], done: [] }); return; }
    const forGroup = allTasks.filter(t => t.taskGroupId === taskGroupId);
    setSections({
      active:  forGroup.filter(t => t.section === 'active'),
      backlog: forGroup.filter(t => t.section === 'backlog'),
      done:    forGroup.filter(t => t.section === 'done'),
    });
  }, [allTasks, taskGroupId]);

  // ─── Logika handlerów ───
  const h = useTaskPanelHandlers({ taskGroupId, sections, addTask, updateTask, deleteTask });

  if (!visible) return null;

  return (
    <div className="task-panel" style={{
      width: 300, minWidth: 260, maxWidth: 360,
      display: 'flex', flexDirection: 'column', height: '100%',
      borderLeft: '1px solid var(--border)', background: 'var(--bg-secondary)',
    }}>
      {/* ─── Nagłówek ─── */}
      <div className="task-panel-header" style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
        borderBottom: '1px solid var(--border)', flexShrink: 0,
      }}>
        <span style={{ fontSize: 14 }}>{ICONS.TASKS}</span>
        <span style={{ flex: 1, fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {groupName || t('tasks.title')}
        </span>
        {loading && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>⟳</span>}
        <button className="btn-icon" style={{ fontSize: 11, padding: '2px 6px' }}
          onClick={h.openAddTaskModal} title={t('tasks.add')}>
          {ICONS.ADD}
        </button>
        <button className="btn-icon" onClick={onClose} title={t('common.close')}>{ICONS.CLOSE}</button>
      </div>

      {/* ─── Lista sekcji ─── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 4px' }}>
        <TaskSectionList tasks={sections} handlers={h.handlers} />
      </div>

      {/* ─── Modale ─── */}
      {h.showTaskModal && (
        <TaskModal
          task={h.selectedTask}
          taskGroupId={taskGroupId}
          onSave={h.handleSaveTask}
          onClose={h.closeTaskModal}
        />
      )}

      <ConfirmModal
        isOpen={h.showDeleteConfirm}
        title={t('tasks.delete')}
        message={t('tasks.delete_confirm_message')}
        onConfirm={h.handleDeleteConfirm}
        onCancel={h.cancelDelete}
      />

      <CommentModal
        isOpen={h.showCommentModal}
        task={h.commentTask}
        onClose={h.closeCommentModal}
      />
    </div>
  );
}
