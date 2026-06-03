// =============================================================================
// FILE: TaskPanel.jsx
// PATH: src/ui/taskpanel/TaskPanel.jsx
// VERSION: 0.0.3
// PURPOSE: Główny komponent panelu zadań (TaskPanel) – orkiestruje stan, operacje IPC (ładowanie, zapisywanie, usuwanie zadań) oraz koordynuje renderowanie list sekcji zadań i modali.
// FUNCTIONS: TaskPanel
// DEPENDS ON: react, tasksStore.js, projectsStore.js, translations.js, loggerRenderer.js, icons.js, ConfirmModal.jsx, TaskSectionList.jsx, TaskModal.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect, useContext } from 'react';
import { loadTasksForProject, saveTasksForProject, deleteTask, updateTask } from '../../core/tasksStore.js';
import { loadProjects } from '../../core/projectsStore.js';
import { TranslationContext } from '../../utils/translations.js';
import { logInfo, logError, logDebug } from '../../utils/loggerRenderer.js';
import { ICONS } from '../../utils/icons.js';
import ConfirmModal from '../modals/ConfirmModal.jsx';
import TaskModal from '../modals/TaskModal.jsx';
import CommentModal from './CommentModal.jsx';
import TaskSectionList from './TaskSectionList.jsx';

export default function TaskPanel({ projectId, onClose }) {
  const { t } = useContext(TranslationContext);
  const [tasks, setTasks] = useState({ active: [], backlog: [], done: [] });
   const [projects, setProjects] = useState([]);
   const [selectedTask, setSelectedTask] = useState(null);
   const [showTaskModal, setShowTaskModal] = useState(false);
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
   const [taskToDelete, setTaskToDelete] = useState(null);
   const [showCommentModal, setShowCommentModal] = useState(false);
   const [commentTask, setCommentTask] = useState(null);
   const [loading, setLoading] = useState(true);

  useEffect(() => {
    logDebug('tasks', 'TaskPanel: mounting for project', projectId);
    loadData();
  }, [projectId]);

  // ─── loadData() – ładuję zadania i projekty dla danego projectId
  //   @returns {Promise<void>}
  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, projectsData] = await Promise.all([
        loadTasksForProject(projectId),
        loadProjects()
      ]);
      setTasks(tasksData || { active: [], backlog: [], done: [] });
      setProjects(projectsData);
      logInfo('tasks', `TaskPanel: loaded tasks for project ${projectId}`);
    } catch (error) {
      logError('tasks', 'TaskPanel: failed to load data', error.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── handleSaveTask() – zapisuje nowe lub aktualizuje istniejące zadanie
//   @param {Object} taskData – dane zadania do zapisania
//   @returns {Promise<void>}
  const handleSaveTask = async (taskData) => {
    try {
      let updatedTasks;
      if (taskData.id) {
        // update istniejącego – immutable map przez wszystkie sekcje
        updatedTasks = {
          active:  tasks.active.map(t  => t.id === taskData.id ? taskData : t),
          backlog: tasks.backlog.map(t => t.id === taskData.id ? taskData : t),
          done:    tasks.done.map(t   => t.id === taskData.id ? taskData : t),
        };
      } else {
        // dodaj nowe – immutable spread sekcji docelowej
        const newTask = { ...taskData, id: Date.now(), createdAt: new Date().toISOString() };
        const targetSection = taskData.section || 'active';
        updatedTasks = {
          ...tasks,
          [targetSection]: [...tasks[targetSection], newTask],
        };
      }
      await saveTasksForProject(projectId, updatedTasks);
      setTasks(updatedTasks);
      logInfo('tasks', `TaskPanel: task ${taskData.id ? 'updated' : 'added'}`);
    } catch (error) {
      logError('tasks', 'TaskPanel: failed to save task', error.message);
    }
  };

  // ─── handleDeleteClick() – ustawia zadanie do usunięcia i otwiera modal potwierdzenia
//   @param {Object} task – zadanie do usunięcia
  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setShowDeleteConfirm(true);
  };

  // ─── handleDeleteConfirm() – usuwa zadanie z listy
//   @returns {Promise<void>}
  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    try {
      // immutable filter – usuwa zadanie ze wszystkich sekcji bez mutacji
      const updatedTasks = {
        active:  tasks.active.filter(t  => t.id !== taskToDelete.id),
        backlog: tasks.backlog.filter(t => t.id !== taskToDelete.id),
        done:    tasks.done.filter(t   => t.id !== taskToDelete.id),
      };
      await saveTasksForProject(projectId, updatedTasks);
      setTasks(updatedTasks);
      logInfo('tasks', `TaskPanel: deleted task ${taskToDelete.id}`);
    } catch (error) {
      logError('tasks', 'TaskPanel: failed to delete task', error.message);
    } finally {
      setShowDeleteConfirm(false);
      setTaskToDelete(null);
    }
  };

  // ─── handleMoveTask() – przenosi zadanie do innej sekcji (active/backlog/done)
//   @param {Object} task – zadanie do przeniesienia
//   @param {string} newSection – docelowa sekcja
//   @returns {Promise<void>}
  const handleMoveTask = async (task, newSection) => {
    try {
      // immutable: najpierw usuwamy z wszystkich sekcji filtrem, potem dodajemy do docelowej
      const without = {
        active:  tasks.active.filter(t  => t.id !== task.id),
        backlog: tasks.backlog.filter(t => t.id !== task.id),
        done:    tasks.done.filter(t   => t.id !== task.id),
      };
      const updatedTasks = {
        ...without,
        [newSection]: [...without[newSection], { ...task, section: newSection }],
      };
      await saveTasksForProject(projectId, updatedTasks);
      setTasks(updatedTasks);
      logInfo('tasks', `TaskPanel: moved task ${task.id} to ${newSection}`);
    } catch (error) {
      logError('tasks', 'TaskPanel: failed to move task', error.message);
    }
  };

  // ─── getProjectName() – znajduje nazwę projektu po ID
//   @param {string|number} pid – ID projektu
//   @returns {string} – nazwa projektu lub napis "unknown project"
  const getProjectName = (pid) => {
    const project = projects.find(p => p.id === pid);
    return project ? project.name : t('tasks.unknown_project');
  };

  if (loading) return <div className="loading">{t('common.loading')}</div>;

   const handlers = {
     onMoveToDone: (id) => handleMoveTask(tasks.active.find(t => t.id === id), 'done'),
     onMoveToBacklog: (id) => handleMoveTask(tasks.active.find(t => t.id === id), 'backlog'),
     onMoveToActive: (id) => handleMoveTask([...tasks.backlog, ...tasks.done].find(t => t.id === id), 'active'),
     onPin: (id, section) => handleSaveTask({ ...tasks[section].find(t => t.id === id), pinned: !tasks[section].find(t => t.id === id).pinned }),
     onDelete: handleDeleteClick,
     onEdit: (task) => { setSelectedTask(task); setShowTaskModal(true); },
     onOpenComment: (task) => { setCommentTask(task); setShowCommentModal(true); }
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

      <TaskSectionList tasks={tasks} handlers={handlers} />

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