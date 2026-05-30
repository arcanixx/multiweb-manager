// =============================================================================
// FILE: useWorkspaces.js
// PATH: src/hooks/useWorkspaces.js
// VERSION: 0.0.3
// PURPOSE: Hook do workspacesStore – lista, zapis, usuwanie load()           pobiera wszystkie workspace'y (workspaces:getAll) save(workspace)  zapisuje workspace (workspaces:save) remove(id)       usuwa workspace (workspaces:delete)
// FUNCTIONS: useWorkspaces
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useEffect, useState } from "react";
import { logInfo, logError, logWarn, logDebug } from "../utils/loggerRenderer.js";

// ─── useWorkspaces() – hook do zarządzania workspace'ami
//   @returns {Object} – obiekt z workspaces, loading i funkcjami saveWorkspace, deleteWorkspace
export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── load() – ładuje wszystkie workspace'y z backendu
  //   @returns {Promise<void>}
  async function load() {
    try {
      setLoading(true);
      const res = await window.electronAPI.invoke("workspaces:getAll");
      if (res?.ok) {
        setWorkspaces(res.data);
        logInfo("useWorkspaces.load", res.data.length);
      } else {
        logError("useWorkspaces.load failed", res?.error);
        logWarn("Nie można załadować workspace'ów");
      }
      setLoading(false);
    } catch (err) {
      logError("useWorkspaces.load exception", err);
      logWarn("Wystąpił błąd podczas ładowania workspace'ów");
      setLoading(false);
    }
  }

  // ─── save() – zapisuje workspace do backendu
  //   @param {Object} workspace – obiekt workspace do zapisania
  //   @returns {Promise<Object>}
  async function save(workspace) {
    try {
      const res = await window.electronAPI.invoke("workspaces:save", workspace);
      if (res?.ok) {
        logInfo("useWorkspaces.save success");
        await load();
      } else {
        logError("useWorkspaces.save failed", res?.error);
        logWarn("Nie można zapisać workspace");
      }
      return res;
    } catch (err) {
      logError("useWorkspaces.save exception", err);
      logWarn("Wystąpił błąd podczas zapisu workspace");
      return { ok: false, error: err.message };
    }
  }

  // ─── remove() – usuwa workspace
  //   @param {string} id – identyfikator workspace do usunięcia
  //   @returns {Promise<Object>}
  async function remove(id) {
    try {
      const res = await window.electronAPI.invoke("workspaces:delete", { id });
      if (res?.ok) {
        logInfo("useWorkspaces.remove success");
        await load();
      } else {
        logError("useWorkspaces.remove failed", res?.error);
        logWarn("Nie można usunąć workspace");
      }
      return res;
    } catch (err) {
      logError("useWorkspaces.remove exception", err);
      logWarn("Wystąpił błąd podczas usuwania workspace");
      return { ok: false, error: err.message };
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { workspaces, loading, reloadWorkspaces: load, saveWorkspace: save, deleteWorkspace: remove };
}