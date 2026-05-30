// =============================================================================
// FILE: TaskPanel.jsx
// PATH: src/ui/taskpanel/TaskPanel.jsx
// VERSION: 0.0.3
// PURPOSE: Panel zadań projektu z filtrowaniem, przypinaniem i sekcjami
// FUNCTIONS: TaskPanel
// DEPENDS ON: react, tasksStore.js, projectsStore.js, translations.js, loggerRenderer.js, icons.js, ConfirmModal.jsx, TaskItem.jsx, TaskModal.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect, useContext } from 'react';
import { loadTasksForProject, saveTasksForProject, deleteTask, updateTask } from '../../core/tasksStore.js';
import { loadProjects } from '../../core/projectsStore.js';
import { TranslationContext } from '../../utils/translations.js';
import { logInfo, logError } from '../../utils/loggerRenderer.js';
import { ICONS } from '../../utils/icons.js';
import ConfirmModal from '../modals/ConfirmModal.jsx';
import TaskItem from './TaskItem.jsx';
import TaskModal from './TaskModal.jsx';

export default function TaskPanel({ projectId, onClose }) {
  const { t } = useContext(TranslationContext);
  const [tasks, setTasks] = useState({ active: [], backlog: [], done: [] });
  const [projects, setProjects] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      logInfo(`TaskPanel: loaded tasks for project ${projectId}`);
    } catch (error) {
      logError('TaskPanel: failed to load data', error);
    } finally {
      setLoading(false);
    }
  };

  // ─── handleSaveTask() – zapisuje nowe lub aktualizuje istniejące zadanie
//   @param {Object} taskData – dane zadania do zapisania
//   @returns {Promise<void>}
  const handleSaveTask = async (taskData) => {
    try {
      const updatedTasks = { ...tasks };
      if (taskData.id) {
        // update existing
        for (const section of ['active', 'backlog', 'done']) {
          const index = updatedTasks[section].findIndex(t => t.id === taskData.id);
          if (index !== -1) {
            updatedTasks[section][index] = taskData;
            break;
          }
        }
      } else {
        // add new
        const newTask = { ...taskData, id: Date.now(), createdAt: new Date().toISOString() };
        updatedTasks[taskData.section || 'active'].push(newTask);
      }
      await saveTasksForProject(projectId, updatedTasks);
      setTasks(updatedTasks);
      logInfo(`TaskPanel: task ${taskData.id ? 'updated' : 'added'}`);
    } catch (error) {
      logError('TaskPanel: failed to save task', error);
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
      const updatedTasks = { ...tasks };
      for (const section of ['active', 'backlog', 'done']) {
        const index = updatedTasks[section].findIndex(t => t.id === taskToDelete.id);
        if (index !== -1) {
          updatedTasks[section].splice(index, 1);
          break;
        }
      }
      await saveTasksForProject(projectId, updatedTasks);
      setTasks(updatedTasks);
      logInfo(`TaskPanel: deleted task ${taskToDelete.id}`);
    } catch (error) {
      logError('TaskPanel: failed to delete task', error);
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
      const updatedTasks = { ...tasks };
      for (const section of ['active', 'backlog', 'done']) {
        const index = updatedTasks[section].findIndex(t => t.id === task.id);
        if (index !== -1) {
          updatedTasks[section].splice(index, 1);
          break;
        }
      }
      updatedTasks[newSection].push({ ...task, section: newSection });
      await saveTasksForProject(projectId, updatedTasks);
      setTasks(updatedTasks);
      logInfo(`TaskPanel: moved task ${task.id} to ${newSection}`);
    } catch (error) {
      logError('TaskPanel: failed to move task', error);
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

  return (
    <div className="task-panel">
      <div className="task-panel-header">
        <h2>{t('tasks.title')} – {getProjectName(projectId)}</h2>
        <button className="btn-icon" onClick={onClose}>{ICONS.CLOSE}</button>
      </div>

      <div className="task-panel-actions">
        <button className="btn-primary" onClick={() => {
          setSelectedTask(null);
          setShowTaskModal(true);
        }}>
          {ICONS.ADD} {t('tasks.add')}
        </button>
      </div>

      <div className="task-sections">
        {/* Active section */}
        <div className="task-section">
          <h3>{t('tasks.active')} ({tasks.active.length})</h3>
          {tasks.active.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={() => {
                setSelectedTask(task);
                setShowTaskModal(true);
              }}
              onDelete={() => handleDeleteClick(task)}
              onMove={(newSection) => handleMoveTask(task, newSection)}
              projectId={projectId}
            />
          ))}
          {tasks.active.length === 0 && <div className="empty-state">{t('tasks.no_tasks')}</div>}
        </div>

        {/* Backlog section */}
        <div className="task-section">
          <h3>{t('tasks.backlog')} ({tasks.backlog.length})</h3>
          {tasks.backlog.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={() => {
                setSelectedTask(task);
                setShowTaskModal(true);
              }}
              onDelete={() => handleDeleteClick(task)}
              onMove={(newSection) => handleMoveTask(task, newSection)}
              projectId={projectId}
            />
          ))}
          {tasks.backlog.length === 0 && <div className="empty-state">{t('tasks.no_tasks')}</div>}
        </div>

        {/* Done section */}
        <div className="task-section">
          <h3>{t('tasks.done')} ({tasks.done.length})</h3>
          {tasks.done.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={() => {
                setSelectedTask(task);
                setShowTaskModal(true);
              }}
              onDelete={() => handleDeleteClick(task)}
              onMove={(newSection) => handleMoveTask(task, newSection)}
              projectId={projectId}
            />
          ))}
          {tasks.done.length === 0 && <div className="empty-state">{t('tasks.no_tasks')}</div>}
        </div>
      </div>

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
    </div>
  );
}