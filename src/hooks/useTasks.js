// =============================================================================
// FILE: useTasks.js
// PATH: src/hooks/useTasks.js
// VERSION: 0.0.3
// PURPOSE: Hook React do zarządzania zadaniami użytkownika – obsługa operacji CRUD przez mostek IPC.
// FUNCTIONS: useTasks
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useEffect, useState } from "react";
import { logInfo, logError, logWarn } from "../utils/loggerRenderer.js";

// ─── useTasks() – hook do zarządzania zadaniami
//   @returns {Object} – obiekt z tasks, loading i funkcjami CRUD
export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── load() – ładuje wszystkie zadania z backendu
  //   @returns {Promise<void>}
  async function load() {
    try {
      setLoading(true);
      const res = await window.electronAPI.invoke("tasks:getAll");
      if (res?.ok) {
        setTasks(res.data);
        logInfo("tasks", "useTasks.load success", res.data.length);
      } else {
        logError("tasks", "useTasks.load failed", res?.error);
        logWarn("tasks", "Nie można załadować zadań");
      }
      setLoading(false);
    } catch (err) {
      logError("tasks", "useTasks.load exception", err.message);
      logWarn("tasks", "Wystąpił błąd podczas ładowania zadań");
      setLoading(false);
    }
  }

  // ─── add() – dodaje nowe zadanie
  //   @param {Object} task – obiekt zadania
  //   @returns {Promise<Object>} – wynik operacji
  async function add(task) {
    const previousTasks = [...tasks];
    // Optimistic update
    setTasks(prev => [...prev, { ...task, section: task.section || 'active' }]);

    try {
      const res = await window.electronAPI.invoke("tasks:add", task);
      if (res?.ok) {
        logInfo("tasks", "useTasks.add success", task.id);
      } else {
        setTasks(previousTasks); // Rollback
        logError("tasks", "useTasks.add failed", res?.error);
        logWarn("tasks", "Nie można dodać zadania");
      }
      return res;
    } catch (err) {
      logError("tasks", "useTasks.add exception", err.message);
      logWarn("tasks", "Wystąpił błąd podczas dodawania zadania");
      return { ok: false, error: err.message };
    }
  }

  // ─── update() – aktualizuje istniejące zadanie
  //   @param {string} id – identyfikator zadania
  //   @param {Object} patch – obiekt z polami do zaktualizowania
  //   @returns {Promise<Object>} – wynik operacji
  async function update(id, patch) {
    const previousTasks = [...tasks];
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));

    try {
      const res = await window.electronAPI.invoke("tasks:update", { id, patch });
      if (res?.ok) {
        logInfo("tasks", "useTasks.update success", id);
      } else {
        setTasks(previousTasks); // Rollback
        logError("tasks", "useTasks.update failed", res?.error);
        logWarn("tasks", "Nie można zaktualizować zadania");
      }
      return res;
    } catch (err) {
      logError("tasks", "useTasks.update exception", err.message);
      logWarn("tasks", "Wystąpił błąd podczas aktualizacji zadania");
      return { ok: false, error: err.message };
    }
  }

  // ─── remove() – usuwa zadanie
  //   @param {string} id – identyfikator zadania
  //   @returns {Promise<Object>} – wynik operacji
  async function remove(id) {
    const previousTasks = [...tasks];
    // Optimistic update
    setTasks(prev => prev.filter(t => t.id !== id));

    try {
      const res = await window.electronAPI.invoke("tasks:delete", { id });
      if (res?.ok) {
        logInfo("tasks", "useTasks.remove success", id);
      } else {
        setTasks(previousTasks); // Rollback
        logError("tasks", "useTasks.remove failed", res?.error);
        logWarn("tasks", "Nie można usunąć zadania");
      }
      return res;
    } catch (err) {
      logError("tasks", "useTasks.remove exception", err.message);
      logWarn("tasks", "Wystąpił błąd podczas usuwania zadania");
      return { ok: false, error: err.message };
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { tasks, loading, reloadTasks: load, addTask: add, updateTask: update, deleteTask: remove };
}