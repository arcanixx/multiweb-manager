// =============================================================================
// FILE: TaskPanel.jsx
// PATH: src/ui/taskpanel/TaskPanel.jsx
// VERSION: 0.0.3
// PURPOSE: Główny komponent panelu zadań – zarządza zadaniami per TaskGroup. Otwierany z kontekstu profilu WebView (Sidebar). Obsługuje sekcje (active/backlog/done) i statusy zadań (todo/in_progress/blocked/done/cancelled) z automatycznym mapowaniem section↔status.
// FUNCTIONS: TaskPanel
// DEPENDS ON: react, useTasks.js, translations.js, loggerRenderer.js, icons.js, ConfirmModal.jsx, TaskModal.jsx, CommentModal.jsx, TaskSectionList.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect, useContext } from 'react';
import { useTasks } from '../../hooks/useTasks.js';
import { TranslationContext } from '../../utils/translations.js';
import { logInfo, logError, logDebug } from '../../utils/loggerRenderer.js';
import { ICONS } from '../../utils/icons.js';
import ConfirmModal from '../modals/ConfirmModal.jsx';
import TaskModal from '../modals/TaskModal.jsx';
import CommentModal from './CommentModal.jsx';
import TaskSectionList from './TaskSectionList.jsx';

// Mapowanie status → sekcja (mirror backendu — bez IPC roundtrip na UI)
const STATUS_TO_SECTION = {
  in_progress: 'active',
  todo:        'backlog',
  blocked:     'backlog',
  done:        'done',
  cancelled:   'done',
};

// ─── TaskPanel() – panel zadań dla grupy (taskGroupId)
//   @param {string}   props.taskGroupId   – ID grupy zadań (wyznaczony z profilu)
//   @param {string}   props.groupName     – wyświetlana nazwa grupy
//   @param {boolean}  props.visible       – czy panel jest widoczny
//   @param {Function} props.onClose       – callback zamknięcia
export default function TaskPanel({ taskGroupId, groupName, visible, onClose }) {
  const { t } = useContext(TranslationContext);

  // ─── hook IPC – wszystkie zadania grupy (płaska lista)
  const { tasks: allTasks, loading, reloadTasks, addTask, updateTask, deleteTask } = useTasks();

  // ─── stan lokalny – tylko UI, nie dane domenowe
  const [sections, setSections] = useState({ active: [], backlog: [], done: [] });
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentTask, setCommentTask] = useState(null);

  // ─── Załaduj zadania gdy zmienia się taskGroupId
  useEffect(() => {
    if (taskGroupId && visible) {
      logDebug('tasks', 'TaskPanel: loading tasks for group', taskGroupId);
      reloadTasks(taskGroupId);
    }
  }, [taskGroupId, visible]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Filtruj i grupuj zadania po sekcjach przy każdej zmianie allTasks
  useEffect(() => {
    if (!allTasks || allTasks.length === 0) {
      setSections({ active: [], backlog: [], done: [] });
      return;
    }
    // Filtruj tylko zadania tej grupy (hook zwraca wszystkie gdy reloadTasks() bez arg)
    const forGroup = allTasks.filter(t => t.taskGroupId === taskGroupId);
    setSections({
      active:  forGroup.filter(t => t.section === 'active'),
      backlog: forGroup.filter(t => t.section === 'backlog'),
      done:    forGroup.filter(t => t.section === 'done'),
    });
  }, [allTasks, taskGroupId]);

  // ─── handleSaveTask() – dodaje lub aktualizuje zadanie przez IPC
  const handleSaveTask = async (taskData) => {
    try {
      let res;
      if (taskData.id) {
        res = await updateTask(taskData.id, taskData);
      } else {
        // Przy tworzeniu: status określa sekcję
        const status = taskData.status || 'todo';
        res = await addTask({
          ...taskData,
          taskGroupId,
          status,
          section: STATUS_TO_SECTION[status] || 'backlog',
          createdAt: new Date().toISOString(),
        });
      }
      if (!res?.ok) logError('tasks', 'TaskPanel: handleSaveTask failed', res?.error);
      else logInfo('tasks', `TaskPanel: task ${taskData.id ? 'updated' : 'added'}`);
    } catch (err) {
      logError('tasks', 'TaskPanel: handleSaveTask exception', err.message);
    }
  };

  // ─── handleStatusChange() – zmiana statusu → automatyczna zmiana sekcji
  const handleStatusChange = async (task, newStatus) => {
    try {
      const res = await updateTask(task.id, { status: newStatus });
      if (!res?.ok) logError('tasks', 'TaskPanel: handleStatusChange failed', res?.error);
      else logInfo('tasks', `TaskPanel: task ${task.id} status→${newStatus}`);
    } catch (err) {
      logError('tasks', 'TaskPanel: handleStatusChange exception', err.message);
    }
  };

  // ─── handleDeleteClick() – ustawia zadanie do usunięcia i otwiera modal
  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setShowDeleteConfirm(true);
  };

  // ─── handleDeleteConfirm() – usuwa zadanie przez IPC
  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    try {
      const res = await deleteTask(taskToDelete.id);
      if (!res?.ok) logError('tasks', 'TaskPanel: delete failed', res?.error);
      else logInfo('tasks', `TaskPanel: deleted task ${taskToDelete.id}`);
    } catch (err) {
      logError('tasks', 'TaskPanel: handleDeleteConfirm exception', err.message);
    } finally {
      setShowDeleteConfirm(false);
      setTaskToDelete(null);
    }
  };

  // ─── handlePinTask() – toggle pinned dla zadania
  const handlePinTask = async (task) => {
    try {
      await updateTask(task.id, { pinned: !task.pinned });
    } catch (err) {
      logError('tasks', 'TaskPanel: handlePinTask exception', err.message);
    }
  };

  if (!visible) return null;

  // ─── handlers dla TaskSectionList / TaskItem
  const handlers = {
    // Zmiana sekcji przez zmianę statusu (reguły domenowe po stronie backendu)
    onMoveToDone:    (id) => {
      const task = [...sections.active, ...sections.backlog].find(t => t.id === id);
      if (task) handleStatusChange(task, 'done');
    },
    onMoveToBacklog: (id) => {
      const task = sections.active.find(t => t.id === id);
      if (task) handleStatusChange(task, 'todo');
    },
    onMoveToActive:  (id) => {
      const task = [...sections.backlog, ...sections.done].find(t => t.id === id);
      if (task) handleStatusChange(task, 'in_progress');
    },
    onPin:    (id) => {
      const task = [...sections.active, ...sections.backlog, ...sections.done].find(t => t.id === id);
      if (task) handlePinTask(task);
    },
    onDelete: (id) => {
      const task = [...sections.active, ...sections.backlog, ...sections.done].find(t => t.id === id);
      if (task) handleDeleteClick(task);
    },
    onEdit:        (task) => { setSelectedTask(task); setShowTaskModal(true); },
    onOpenComment: (task) => { setCommentTask(task); setShowCommentModal(true); },
  };

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
          onClick={() => { setSelectedTask(null); setShowTaskModal(true); }}
          title={t('tasks.add')}>
          {ICONS.ADD}
        </button>
        <button className="btn-icon" onClick={onClose} title={t('common.close')}>{ICONS.CLOSE}</button>
      </div>

      {/* ─── Lista sekcji ─── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 4px' }}>
        <TaskSectionList tasks={sections} handlers={handlers} />
      </div>

      {/* ─── Modale ─── */}
      {showTaskModal && (
        <TaskModal
          task={selectedTask}
          taskGroupId={taskGroupId}
          onSave={handleSaveTask}
          onClose={() => { setShowTaskModal(false); setSelectedTask(null); }}
        />
      )}

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title={t('tasks.delete')}
        message={t('tasks.delete_confirm_message')}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setShowDeleteConfirm(false); setTaskToDelete(null); }}
      />

      <CommentModal
        isOpen={showCommentModal}
        task={commentTask}
        onClose={() => { setShowCommentModal(false); setCommentTask(null); }}
      />
    </div>
  );
}
