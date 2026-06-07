// =============================================================================
// FILE: useTaskPanelHandlers.js
// PATH: src/hooks/taskpanel/useTaskPanelHandlers.js
// VERSION: 0.0.3
// PURPOSE: Hook logiki TaskPanel – CRUD zadań, zmiany sekcji/statusu, stan modali (TaskModal, ConfirmModal, CommentModal). Oddziela handlery od JSX orkiestratora TaskPanel.
// FUNCTIONS: useTaskPanelHandlers
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useCallback } from 'react';
import { logInfo, logError, logDebug } from '../../utils/loggerRenderer.js';

// ─── Mapowanie status → sekcja (mirror backendu — bez IPC roundtrip na UI)
const STATUS_TO_SECTION = {
  in_progress: 'active',
  todo:        'backlog',
  blocked:     'backlog',
  done:        'done',
  cancelled:   'done',
};

// ─── useTaskPanelHandlers() – logika TaskPanel; oddziela handlery od JSX
//   @param {Object}   params
//   @param {string}   params.taskGroupId  – ID grupy zadań
//   @param {Object}   params.sections     – { active[], backlog[], done[] }
//   @param {Function} params.addTask      – z useTasks
//   @param {Function} params.updateTask   – z useTasks
//   @param {Function} params.deleteTask   – z useTasks
//   @returns {Object} – stan modali + handlery + mapowanie statusów

export function useTaskPanelHandlers({ taskGroupId, sections, addTask, updateTask, deleteTask }) {
  // ─── Stan modali ───
  const [selectedTask,      setSelectedTask]      = useState(null);
  const [showTaskModal,     setShowTaskModal]      = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm]  = useState(false);
  const [taskToDelete,      setTaskToDelete]       = useState(null);
  const [showCommentModal,  setShowCommentModal]   = useState(false);
  const [commentTask,       setCommentTask]        = useState(null);

  // ─── handleSaveTask() – dodaje lub aktualizuje zadanie przez IPC
  const handleSaveTask = useCallback(async (taskData) => {
    try {
      let res;
      if (taskData.id) {
        res = await updateTask(taskData.id, taskData);
      } else {
        const status = taskData.status || 'todo';
        res = await addTask({
          ...taskData,
          taskGroupId,
          status,
          section: STATUS_TO_SECTION[status] || 'backlog',
          createdAt: new Date().toISOString(),
        });
      }
      if (!res?.ok) logError('tasks', 'useTaskPanelHandlers: handleSaveTask failed', res?.error);
      else logInfo('tasks', `useTaskPanelHandlers: task ${taskData.id ? 'updated' : 'added'}`);
    } catch (err) {
      logError('tasks', 'useTaskPanelHandlers: handleSaveTask exception', err.message);
    }
  }, [taskGroupId, addTask, updateTask]);

  // ─── handleStatusChange() – zmiana statusu → automatyczna zmiana sekcji
  const handleStatusChange = useCallback(async (task, newStatus) => {
    try {
      const res = await updateTask(task.id, { status: newStatus });
      if (!res?.ok) logError('tasks', 'useTaskPanelHandlers: handleStatusChange failed', res?.error);
      else logInfo('tasks', `useTaskPanelHandlers: task ${task.id} status→${newStatus}`);
    } catch (err) {
      logError('tasks', 'useTaskPanelHandlers: handleStatusChange exception', err.message);
    }
  }, [updateTask]);

  // ─── handlePinTask() – toggle pinned dla zadania
  const handlePinTask = useCallback(async (task) => {
    try {
      await updateTask(task.id, { pinned: !task.pinned });
    } catch (err) {
      logError('tasks', 'useTaskPanelHandlers: handlePinTask exception', err.message);
    }
  }, [updateTask]);

  // ─── handleDeleteClick() – ustawia zadanie do usunięcia i otwiera modal
  const handleDeleteClick = useCallback((task) => {
    setTaskToDelete(task);
    setShowDeleteConfirm(true);
  }, []);

  // ─── handleDeleteConfirm() – usuwa zadanie przez IPC
  const handleDeleteConfirm = useCallback(async () => {
    if (!taskToDelete) return;
    try {
      const res = await deleteTask(taskToDelete.id);
      if (!res?.ok) logError('tasks', 'useTaskPanelHandlers: delete failed', res?.error);
      else logInfo('tasks', `useTaskPanelHandlers: deleted task ${taskToDelete.id}`);
    } catch (err) {
      logError('tasks', 'useTaskPanelHandlers: handleDeleteConfirm exception', err.message);
    } finally {
      setShowDeleteConfirm(false);
      setTaskToDelete(null);
    }
  }, [taskToDelete, deleteTask]);

  // ─── handlers – obiekt akcji dla TaskSectionList / TaskItem
  //   Zmiany sekcji przez zmianę statusu (reguły domenowe po stronie backendu)
  const handlers = {
    onMoveToDone: (id) => {
      const task = [...sections.active, ...sections.backlog].find(t => t.id === id);
      if (task) handleStatusChange(task, 'done');
    },
    onMoveToBacklog: (id) => {
      const task = sections.active.find(t => t.id === id);
      if (task) handleStatusChange(task, 'todo');
    },
    onMoveToActive: (id) => {
      const task = [...sections.backlog, ...sections.done].find(t => t.id === id);
      if (task) handleStatusChange(task, 'in_progress');
    },
    onPin: (id) => {
      const task = [...sections.active, ...sections.backlog, ...sections.done].find(t => t.id === id);
      if (task) handlePinTask(task);
    },
    onDelete: (id) => {
      const task = [...sections.active, ...sections.backlog, ...sections.done].find(t => t.id === id);
      if (task) handleDeleteClick(task);
    },
    onEdit:        (task) => { setSelectedTask(task); setShowTaskModal(true); },
    onOpenComment: (task) => { setCommentTask(task);  setShowCommentModal(true); },
  };

  // ─── Closery modali ───
  const openAddTaskModal   = useCallback(() => { setSelectedTask(null); setShowTaskModal(true); }, []);
  const closeTaskModal     = useCallback(() => { setShowTaskModal(false); setSelectedTask(null); }, []);
  const cancelDelete       = useCallback(() => { setShowDeleteConfirm(false); setTaskToDelete(null); }, []);
  const closeCommentModal  = useCallback(() => { setShowCommentModal(false); setCommentTask(null); }, []);

  return {
    // Stan modali
    selectedTask, showTaskModal,
    showDeleteConfirm,
    commentTask, showCommentModal,

    // Handlers dla TaskSectionList
    handlers,

    // Handlery modali
    handleSaveTask, handleDeleteConfirm,
    openAddTaskModal, closeTaskModal,
    cancelDelete, closeCommentModal,
  };
}
