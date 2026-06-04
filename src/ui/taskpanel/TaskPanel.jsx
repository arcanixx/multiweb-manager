// =============================================================================
// FILE: TaskPanel.jsx
// PATH: src/ui/taskpanel/TaskPanel.jsx
// VERSION: 0.0.3
// PURPOSE: Główny komponent panelu zadań (TaskPanel) – orkiestruje stan i operacje CRUD przez hooki IPC (useTasks, useProjects).
// FUNCTIONS: TaskPanel
// DEPENDS ON: react, useTasks.js, useProjects.js, translations.js, loggerRenderer.js, icons.js, ConfirmModal.jsx, TaskModal.jsx, CommentModal.jsx, TaskSectionList.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect, useContext } from 'react';
import { useTasks } from '../../hooks/useTasks.js';
import { useProjects } from '../../hooks/useProjects.js';
import { TranslationContext } from '../../utils/translations.js';
import { logInfo, logError, logDebug } from '../../utils/loggerRenderer.js';
import { ICONS } from '../../utils/icons.js';
import ConfirmModal from '../modals/ConfirmModal.jsx';
import TaskModal from '../modals/TaskModal.jsx';
import CommentModal from './CommentModal.jsx';
import TaskSectionList from './TaskSectionList.jsx';

export default function TaskPanel({ projectId, onClose }) {
  const { t } = useContext(TranslationContext);

  // ─── hooki IPC – komunikacja z backendem przez invoke()
  const { tasks: allTasks, loading: tasksLoading, reloadTasks, addTask, updateTask, deleteTask } = useTasks();
  const { projects, loading: projectsLoading } = useProjects();

  // ─── stan lokalny – tylko UI, nie dane domenowe
  const [sections, setSections] = useState({ active: [], backlog: [], done: [] });
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentTask, setCommentTask] = useState(null);

  const loading = tasksLoading || projectsLoading;

  // ─── filtrowanie zadań po projectId przy każdej zmianie allTasks lub projectId
  useEffect(() => {
    logDebug('tasks', 'TaskPanel: filtering tasks for project', projectId);
    if (!allTasks || allTasks.length === 0) {
      setSections({ active: [], backlog: [], done: [] });
      return;
    }
    // allTasks to płaska lista – grupujemy po section
    const filtered = allTasks.filter(t => t.projectId === projectId || t.project === projectId);
    setSections({
      active:  filtered.filter(t => t.section === 'active'  || !t.section),
      backlog: filtered.filter(t => t.section === 'backlog'),
      done:    filtered.filter(t => t.section === 'done'),
    });
  }, [allTasks, projectId]);

  // ─── handleSaveTask() – dodaje lub aktualizuje zadanie przez IPC
  const handleSaveTask = async (taskData) => {
    try {
      let res;
      if (taskData.id) {
        res = await updateTask(taskData.id, taskData);
      } else {
        res = await addTask({
          ...taskData,
          projectId,
          section: taskData.section || 'active',
          createdAt: new Date().toISOString(),
        });
      }
      if (!res?.ok) {
        logError('tasks', 'TaskPanel: handleSaveTask failed', res?.error);
      } else {
        logInfo('tasks', `TaskPanel: task ${taskData.id ? 'updated' : 'added'}`);
      }
    } catch (error) {
      logError('tasks', 'TaskPanel: handleSaveTask exception', error.message);
    }
  };

  // ─── handleDeleteClick() – ustawia zadanie do usunięcia i otwiera modal potwierdzenia
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
    } catch (error) {
      logError('tasks', 'TaskPanel: handleDeleteConfirm exception', error.message);
    } finally {
      setShowDeleteConfirm(false);
      setTaskToDelete(null);
    }
  };

  // ─── handleMoveTask() – przenosi zadanie do innej sekcji przez IPC (update patch section)
  const handleMoveTask = async (task, newSection) => {
    try {
      const res = await updateTask(task.id, { section: newSection });
      if (!res?.ok) logError('tasks', 'TaskPanel: move failed', res?.error);
      else logInfo('tasks', `TaskPanel: moved task ${task.id} to ${newSection}`);
    } catch (error) {
      logError('tasks', 'TaskPanel: handleMoveTask exception', error.message);
    }
  };

  // ─── getProjectName() – znajduje nazwę projektu po ID
  const getProjectName = (pid) => {
    const project = projects.find(p => p.id === pid);
    return project ? project.name : t('tasks.unknown_project');
  };

  if (loading) return <div className="loading">{t('common.loading')}</div>;

  const handlers = {
    onMoveToDone:    (id) => handleMoveTask(sections.active.find(t => t.id === id), 'done'),
    onMoveToBacklog: (id) => handleMoveTask(sections.active.find(t => t.id === id), 'backlog'),
    onMoveToActive:  (id) => handleMoveTask([...sections.backlog, ...sections.done].find(t => t.id === id), 'active'),
    onPin:    (id, section) => {
      const task = sections[section]?.find(t => t.id === id);
      if (task) handleSaveTask({ ...task, pinned: !task.pinned });
    },
    onDelete:      handleDeleteClick,
    onEdit:        (task) => { setSelectedTask(task); setShowTaskModal(true); },
    onOpenComment: (task) => { setCommentTask(task); setShowCommentModal(true); },
  };

  return (
    <div className="task-panel">
      <div className="task-panel-header">
        <h2>{t('tasks.title')} – {getProjectName(projectId)}</h2>
        <button className="btn-icon" onClick={onClose}>{ICONS.CLOSE}</button>
      </div>

      <div className="task-panel-actions">
        <button className="btn-primary" onClick={() => handlers.onEdit(null)}>
          {ICONS.ADD} {t('tasks.add')}
        </button>
      </div>

      <TaskSectionList tasks={sections} handlers={handlers} />

      {showTaskModal && (
        <TaskModal
          task={selectedTask}
          projectId={projectId}
          onSave={handleSaveTask}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
        />
      )}

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title={t('tasks.delete')}
        message={t('tasks.delete_confirm_message')}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setTaskToDelete(null);
        }}
      />
      <CommentModal
        isOpen={showCommentModal}
        task={commentTask}
        onClose={() => {
          setShowCommentModal(false);
          setCommentTask(null);
        }}
      />
    </div>
  );
}
