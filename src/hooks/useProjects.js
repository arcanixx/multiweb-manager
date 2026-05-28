// =============================================================================
// FILE: useProjects.js
// PATH: src/hooks/useProjects.js
// VERSION: 0.0.3
// PURPOSE: Hook do projectsStore – lista projektów, CRUD load()           pobiera wszystkie projekty (projects:getAll) add(project)     dodaje projekt (projects:add) update(id,patch) aktualizuje projekt (projects:update) remove(id)       usuwa projekt (projects:delete)
// FUNCTIONS: useProjects
// DEPENDS ON: react
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
        logInfo("useProjects.load", res.data.length);
      } else {
        logError("useProjects.load failed", res?.error);
        logWarn("Nie można załadować projektów");
      }
      setLoading(false);
    } catch (err) {
      logError("useProjects.load exception", err);
      logWarn("Wystąpił błąd podczas ładowania projektów");
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
        logInfo("useProjects.add success");
        await load();
      } else {
        logError("useProjects.add failed", res?.error);
        logWarn("Nie można dodać projektu");
      }
      return res;
    } catch (err) {
      logError("useProjects.add exception", err);
      logWarn("Wystąpił błąd podczas dodawania projektu");
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
        logInfo("useProjects.update success");
        await load();
      } else {
        logError("useProjects.update failed", res?.error);
        logWarn("Nie można zaktualizować projektu");
      }
      return res;
    } catch (err) {
      logError("useProjects.update exception", err);
      logWarn("Wystąpił błąd podczas aktualizacji projektu");
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
        logInfo("useProjects.remove success");
        await load();
      } else {
        logError("useProjects.remove failed", res?.error);
        logWarn("Nie można usunąć projektu");
      }
      return res;
    } catch (err) {
      logError("useProjects.remove exception", err);
      logWarn("Wystąpił błąd podczas usuwania projektu");
      return { ok: false, error: err.message };
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { projects, loading, reloadProjects: load, addProject: add, updateProject: update, deleteProject: remove };
}

