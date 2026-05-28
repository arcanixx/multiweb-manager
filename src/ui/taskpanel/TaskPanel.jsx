// =============================================================================
// FILE: TaskPanel.jsx
// PATH: src/ui/taskpanel/TaskPanel.jsx
// VERSION: 0.0.3
// PURPOSE: Główny panel zadań – sekcje, zarządzanie stanem, zapis
// FUNCTIONS: TaskPanel
// DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js, TaskModal, CommentModal, TaskSection
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import { log, logError } from '../../utils/loggerRenderer.js';
import TaskModal from './TaskModal';
import CommentModal from './CommentModal';
import TaskSection from './TaskSection';

export default function TaskPanel({ projectName, onClose, visible, availableProjects }) {
  const { t } = useContext(TranslationContext);
  const [tasks, setTasks] = useState({ active: [], backlog: [], done: [] });
  const [modal, setModal] = useState(null);
  const [comment, setComment] = useState(null);
  useEffect(() => {
    if (!visible || !projectName) return;
    window.electronAPI.getTasks(projectName)
      .then(data => { setTasks(data.tasks || { active: [], backlog: [], done: [] }); log('TaskPanel: loaded for', projectName); })
      .catch(err => logError('TaskPanel: load failed', err.message));
  }, [projectName, visible]);
  const saveFullState = useCallback((newTasks) => {
    setTasks(newTasks);
    window.electronAPI.saveTasks(projectName, { tasks: newTasks }).catch(err => logError('TaskPanel: save failed', err.message));
  }, [projectName]);
  const handleSaveTask = (taskData) => {
    const { section } = taskData;
    const cleaned = {
      active: tasks.active.filter(t => t.id !== taskData.id),
      backlog: tasks.backlog.filter(t => t.id !== taskData.id),
      done: tasks.done.filter(t => t.id !== taskData.id),
    };
    const sectionKey = section === 'done' ? 'done' : section === 'backlog' ? 'backlog' : 'active';
    const newTasks = { ...cleaned, [sectionKey]: taskData.pinned ? [taskData, ...cleaned[sectionKey]] : [...cleaned[sectionKey], taskData] };
    saveFullState(newTasks);
    setModal(null);
  };
  const moveTask = (taskId, from, to) => {
    const task = tasks[from].find(t => t.id === taskId);
    if (!task) return;
    const updatedTask = to === 'done' ? { ...task, priority: 'E', section: 'done' } : { ...task, section: to };
    const newTasks = {
      ...tasks,
      [from]: tasks[from].filter(t => t.id !== taskId),
      [to]: [...tasks[to], updatedTask],
    };
    saveFullState(newTasks);
  };

  const togglePin = (taskId, section) => {
    const newTasks = {
      ...tasks,
      [section]: tasks[section].map(t => t.id === taskId ? { ...t, pinned: !t.pinned } : t)
    };
    saveFullState(newTasks);
  };

  const deleteTask = (taskId) => {
    if (!window.confirm('Usunąć zadanie?')) return;
    const newTasks = {
      active: tasks.active.filter(t => t.id !== taskId),
      backlog: tasks.backlog.filter(t => t.id !== taskId),
      done: tasks.done.filter(t => t.id !== taskId),
    };
    saveFullState(newTasks);
  };

  if (!visible) return null;

  return (
    <>
      <div style={{ width: 'var(--taskpanel-width)', minWidth: 260, background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', height: '100vh', flexShrink: 0 }}>
        <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{ICONS.TASKS} {t('tasks.title')}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{projectName}</div>
          </div>
          <button className="btn-icon" onClick={onClose}>{ICONS.CLOSE}</button>
        </div>
        <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border)' }}>
          <button className="btn btn-primary" style={{ width: '100%', fontSize: 12 }} onClick={() => setModal({})}>{ICONS.PLUS} {t('tasks.add')}</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
          <TaskSection
            title={t('tasks.active')} iconColor="#3b82f6" tasks={tasks.active}
            onMoveToDone={(id) => moveTask(id, 'active', 'done')}
            onMoveToBacklog={(id) => moveTask(id, 'active', 'backlog')}
            onPin={togglePin} onDelete={deleteTask} onEdit={(task) => setModal({ task })}
            onOpenComment={(task) => setComment(task)} section="active"
          />
          <TaskSection
            title={t('tasks.backlog')} iconColor="#94a3b8" tasks={tasks.backlog}
            onMoveToActive={(id) => moveTask(id, 'backlog', 'active')}
            onPin={togglePin} onDelete={deleteTask} onEdit={(task) => setModal({ task })}
            onOpenComment={(task) => setComment(task)} section="backlog"
          />
          <TaskSection
            title={t('tasks.done')} iconColor="#22c55e" tasks={tasks.done}
            onMoveToActive={(id) => moveTask(id, 'done', 'active')}
            onPin={togglePin} onDelete={deleteTask} onEdit={(task) => setModal({ task })}
            onOpenComment={(task) => setComment(task)} section="done"
          />
        </div>
      </div>
      {modal !== null && <TaskModal task={modal.task || null} availableProjects={availableProjects} currentProject={projectName} onSave={handleSaveTask} onClose={() => setModal(null)} />}
      {comment && <CommentModal task={comment} onClose={() => setComment(null)} />}
    </>
  );
}
