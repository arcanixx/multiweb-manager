// =============================================================================
// FILE: useTasks.js
// PATH: src/hooks/useTasks.js
// VERSION: 0.0.3
// PURPOSE: Hook do tasksStore – pobieranie, dodawanie, aktualizacja, usuwanie load()        pobiera wszystkie taski (tasks:getAll) add(task)     dodaje task (tasks:add) update(id, patch) aktualizuje task (tasks:update) remove(id)    usuwa task (tasks:delete)
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
        logInfo("useTasks.load", res.data.length);
      } else {
        logError("useTasks.load failed", res?.error);
        logWarn("Nie można załadować zadań");
      }
      setLoading(false);
    } catch (err) {
      logError("useTasks.load exception", err);
      logWarn("Wystąpił błąd podczas ładowania zadań");
      setLoading(false);
    }
  }

  // ─── add() – dodaje nowe zadanie
  //   @param {Object} task – obiekt zadania
  //   @returns {Promise<Object>} – wynik operacji
  async function add(task) {
    try {
      const res = await window.electronAPI.invoke("tasks:add", task);
      if (res?.ok) {
        logInfo("useTasks.add success");
        await load();
      } else {
        logError("useTasks.add failed", res?.error);
        logWarn("Nie można dodać zadania");
      }
      return res;
    } catch (err) {
      logError("useTasks.add exception", err);
      logWarn("Wystąpił błąd podczas dodawania zadania");
      return { ok: false, error: err.message };
    }
  }

  // ─── update() – aktualizuje istniejące zadanie
  //   @param {string} id – identyfikator zadania
  //   @param {Object} patch – obiekt z polami do zaktualizowania
  //   @returns {Promise<Object>} – wynik operacji
  async function update(id, patch) {
    try {
      const res = await window.electronAPI.invoke("tasks:update", { id, patch });
      if (res?.ok) {
        logInfo("useTasks.update success");
        await load();
      } else {
        logError("useTasks.update failed", res?.error);
        logWarn("Nie można zaktualizować zadania");
      }
      return res;
    } catch (err) {
      logError("useTasks.update exception", err);
      logWarn("Wystąpił błąd podczas aktualizacji zadania");
      return { ok: false, error: err.message };
    }
  }

  // ─── remove() – usuwa zadanie
  //   @param {string} id – identyfikator zadania
  //   @returns {Promise<Object>} – wynik operacji
  async function remove(id) {
    try {
      const res = await window.electronAPI.invoke("tasks:delete", { id });
      if (res?.ok) {
        logInfo("useTasks.remove success");
        await load();
      } else {
        logError("useTasks.remove failed", res?.error);
        logWarn("Nie można usunąć zadania");
      }
      return res;
    } catch (err) {
      logError("useTasks.remove exception", err);
      logWarn("Wystąpił błąd podczas usuwania zadania");
      return { ok: false, error: err.message };
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { tasks, loading, reloadTasks: load, addTask: add, updateTask: update, deleteTask: remove };
}