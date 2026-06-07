// =============================================================================
// FILE: useTaskPanel.js
// PATH: src/hooks/aggregated/useTaskPanel.js
// VERSION: 0.0.3
// PURPOSE: Hook React do zarządzania zadaniami użytkownika per taskGroupId – CRUD przez IPC z optimistic update i rollbackiem.
// FUNCTIONS: useTasks
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useCallback, useEffect, useRef, useState } from 'react';
import { logInfo, logError, logWarn } from '../../utils/loggerRenderer.js';

// ─── useTasks() – hook do zarządzania zadaniami dla taskGroupId
//   @returns {Object} – tasks, loading, reloadTasks, addTask, updateTask, deleteTask
export function useTasks() {
  const [tasks,   setTasks]   = useState([]);
  const [loading, setLoading] = useState(false);
  // Ref na ostatni załadowany taskGroupId — zapobiega wyścigowi requestów
  const currentGroupRef = useRef(null);

  // ─── reloadTasks() – ładuje zadania dla grupy (płaska lista)
  //   @param {string} [taskGroupId] – opcjonalne; jeśli brak → wszystkie
  const reloadTasks = useCallback(async (taskGroupId) => {
    currentGroupRef.current = taskGroupId || null;
    setLoading(true);
    try {
      const res = await window.electronAPI.invoke('tasks:getAll', taskGroupId || undefined);
      // Ignoruj odpowiedź jeśli grupaz mienia się w trakcie
      if (currentGroupRef.current !== (taskGroupId || null)) return;
      if (res?.ok) {
        setTasks(res.data || []);
        logInfo('tasks', 'useTasks.reload', res.data?.length, taskGroupId || 'all');
      } else {
        logError('tasks', 'useTasks.reload failed', res?.error);
        logWarn('tasks', 'Nie można załadować zadań');
      }
    } catch (err) {
      logError('tasks', 'useTasks.reload exception', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Nie ładujemy przy montowaniu — TaskPanel jawnie wywołuje reloadTasks(taskGroupId)

  // ─── addTask() – dodaje zadanie z optimistic update
  //   @param {Object} task – { taskGroupId, name, status, priority, ... }
  //   @returns {Promise<Object>}
  const addTask = useCallback(async (task) => {
    const optimisticId = `optimistic_${Date.now()}`;
    const optimistic   = { ...task, id: optimisticId };
    setTasks(prev => [...prev, optimistic]);

    try {
      const res = await window.electronAPI.invoke('tasks:add', task);
      if (res?.ok) {
        // Zamień optimistic na rzeczywisty obiekt zwrócony z backendu
        setTasks(prev => prev.map(t => t.id === optimisticId ? res.data : t));
        logInfo('tasks', 'useTasks.add', res.data?.id);
      } else {
        setTasks(prev => prev.filter(t => t.id !== optimisticId)); // rollback
        logError('tasks', 'useTasks.add failed', res?.error);
        logWarn('tasks', 'Nie można dodać zadania');
      }
      return res;
    } catch (err) {
      setTasks(prev => prev.filter(t => t.id !== optimisticId));
      logError('tasks', 'useTasks.add exception', err.message);
      return { ok: false, error: err.message };
    }
  }, []);

  // ─── updateTask() – aktualizuje zadanie z optimistic update
  //   Zmiana status → backend wyznacza section (normalizeTask)
  //   @param {string} id
  //   @param {Object} patch
  //   @returns {Promise<Object>}
  const updateTask = useCallback(async (id, patch) => {
    const previous = tasks.find(t => t.id === id);
    // Optimistic: aplikuj patch lokalnie (section może być błędna — backend skoryguje)
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));

    try {
      const res = await window.electronAPI.invoke('tasks:update', { id, patch });
      if (res?.ok) {
        // Zastąp stanem z backendu (poprawna section z normalizeTask)
        setTasks(prev => prev.map(t => t.id === id ? res.data : t));
        logInfo('tasks', 'useTasks.update', id);
      } else {
        if (previous) setTasks(prev => prev.map(t => t.id === id ? previous : t)); // rollback
        logError('tasks', 'useTasks.update failed', res?.error);
        logWarn('tasks', 'Nie można zaktualizować zadania');
      }
      return res;
    } catch (err) {
      if (previous) setTasks(prev => prev.map(t => t.id === id ? previous : t));
      logError('tasks', 'useTasks.update exception', err.message);
      return { ok: false, error: err.message };
    }
  }, [tasks]);

  // ─── deleteTask() – usuwa zadanie z optimistic update
  //   @param {string} id
  //   @returns {Promise<Object>}
  const deleteTask = useCallback(async (id) => {
    const previous = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));

    try {
      const res = await window.electronAPI.invoke('tasks:delete', { id });
      if (res?.ok) {
        logInfo('tasks', 'useTasks.delete', id);
      } else {
        if (previous) setTasks(prev => [...prev, previous]); // rollback
        logError('tasks', 'useTasks.delete failed', res?.error);
        logWarn('tasks', 'Nie można usunąć zadania');
      }
      return res;
    } catch (err) {
      if (previous) setTasks(prev => [...prev, previous]);
      logError('tasks', 'useTasks.delete exception', err.message);
      return { ok: false, error: err.message };
    }
  }, [tasks]);

  return { tasks, loading, reloadTasks, addTask, updateTask, deleteTask };
}

