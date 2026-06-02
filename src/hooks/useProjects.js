// =============================================================================
// FILE: useProjects.js
// PATH: src/hooks/useProjects.js
// VERSION: 0.0.3
// PURPOSE: Hook React do zarządzania projektami użytkownika – obsługa operacji CRUD przez mostek IPC.
// FUNCTIONS: useProjects
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useEffect, useState } from "react";
import { logInfo, logError, logWarn } from "../utils/loggerRenderer.js";

// ─── useProjects() – hook do zarządzania projektami
//   @returns {Object} – obiekt z projects, loading i funkcjami CRUD
export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── load() – ładuje wszystkie projekty z backendu
  //   @returns {Promise<void>}
  async function load() {
    try {
      setLoading(true);
      const res = await window.electronAPI.invoke("projects:getAll");
      if (res?.ok) {
        setProjects(res.data);
        logInfo("store", "useProjects.load success", res.data.length);
      } else {
        logError("store", "useProjects.load failed", res?.error);
        logWarn("store", "Nie można załadować projektów");
      }
      setLoading(false);
    } catch (err) {
      logError("store", "useProjects.load exception", err.message);
      logWarn("store", "Wystąpił błąd podczas ładowania projektów");
      setLoading(false);
    }
  }

  // ─── add() – dodaje nowy projekt
  //   @param {Object} project – obiekt projektu
  //   @returns {Promise<Object>} – wynik operacji
  async function add(project) {
    try {
      const res = await window.electronAPI.invoke("projects:add", project);
      if (res?.ok) {
        logInfo("store", "useProjects.add success", project.id);
        await load();
      } else {
        logError("store", "useProjects.add failed", res?.error);
        logWarn("store", "Nie można dodać projektu");
      }
      return res;
    } catch (err) {
      logError("store", "useProjects.add exception", err.message);
      logWarn("store", "Wystąpił błąd podczas dodawania projektu");
      return { ok: false, error: err.message };
    }
  }

  // ─── update() – aktualizuje istniejący projekt
  //   @param {string} id – identyfikator projektu
  //   @param {Object} patch – obiekt z polami do zaktualizowania
  //   @returns {Promise<Object>} – wynik operacji
  async function update(id, patch) {
    try {
      const res = await window.electronAPI.invoke("projects:update", { id, patch });
      if (res?.ok) {
        logInfo("store", "useProjects.update success", id);
        await load();
      } else {
        logError("store", "useProjects.update failed", res?.error);
        logWarn("store", "Nie można zaktualizować projektu");
      }
      return res;
    } catch (err) {
      logError("store", "useProjects.update exception", err.message);
      logWarn("store", "Wystąpił błąd podczas aktualizacji projektu");
      return { ok: false, error: err.message };
    }
  }

  // ─── remove() – usuwa projekt
  //   @param {string} id – identyfikator projektu
  //   @returns {Promise<Object>} – wynik operacji
  async function remove(id) {
    try {
      const res = await window.electronAPI.invoke("projects:delete", { id });
      if (res?.ok) {
        logInfo("store", "useProjects.remove success", id);
        await load();
      } else {
        logError("store", "useProjects.remove failed", res?.error);
        logWarn("store", "Nie można usunąć projektu");
      }
      return res;
    } catch (err) {
      logError("store", "useProjects.remove exception", err.message);
      logWarn("store", "Wystąpił błąd podczas usuwania projektu");
      return { ok: false, error: err.message };
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { projects, loading, reloadProjects: load, addProject: add, updateProject: update, deleteProject: remove };
}