// =============================================================================
// FILE: useWorkspaces.js
// PATH: src/hooks/useWorkspaces.js
// VERSION: 0.0.3
// PURPOSE: Hook React do zarządzania przestrzeniami roboczymi (workspaces) użytkownika przez mostek IPC.
// FUNCTIONS: useWorkspaces
// DEPENDS ON: react, loggerRenderer.js, translations.js, ipcChannels.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useEffect, useState, useContext } from "react";
import { logInfo, logError, logWarn } from "../utils/loggerRenderer.js";
import { TranslationContext } from '../utils/translations.js';
import { IPC_CHANNELS } from '../constants/ipcChannels.js';

// ─── useWorkspaces() – hook do zarządzania workspace'ami
//   @returns {Object} – obiekt z workspaces, loading i funkcjami saveWorkspace, deleteWorkspace
export function useWorkspaces() {
  const { t } = useContext(TranslationContext);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── load() – ładuje wszystkie workspace'y z backendu
  //   @returns {Promise<void>}
  async function load() {
    try {
      setLoading(true);
      const res = await window.electronAPI.invoke(IPC_CHANNELS.WORKSPACES.GET_ALL);
      if (res?.ok) {
        setWorkspaces(res.data);
        logInfo("store", "useWorkspaces.load success", res.data.length);
      } else {
        logError("store", "useWorkspaces.load failed", res?.error);
        logWarn("store", "Nie można załadować workspace'ów");
      }
      setLoading(false);
    } catch (err) {
      logError("store", "useWorkspaces.load exception", err.message);
      logWarn("store", "Wystąpił błąd podczas ładowania workspace'ów");
      setLoading(false);
    }
  }

  // ─── save() – zapisuje workspace do backendu
  //   Handler IPC (workspaces:save) oczekuje tablicy workspace'ów.
  //   Hook wysyła pojedynczy workspace owinięty w tablicę – handler robi upsert.
  //   @param {Object} workspace – obiekt workspace do zapisania
  //   @returns {Promise<Object>}
  async function save(workspace) {
    try {
      // Handler IPC oczekuje Array – wysyłamy [workspace], handler robi upsert po id
      const res = await window.electronAPI.invoke(IPC_CHANNELS.WORKSPACES.SAVE, [workspace]);
      if (res?.ok) {
        logInfo("store", "useWorkspaces.save success", workspace.id);
        await load();
      } else {
        logError("store", "useWorkspaces.save failed", res?.error);
        logWarn("store", "Nie można zapisać workspace");
      }
      return res;
    } catch (err) {
      logError("store", "useWorkspaces.save exception", err.message);
      logWarn("store", "Wystąpił błąd podczas zapisu workspace");
      return { ok: false, error: err.message };
    }
  }

  // ─── remove() – usuwa workspace
  //   @param {string} id – identyfikator workspace do usunięcia
  //   @param {Function} [showConfirm] – opcjonalna funkcja do wyświetlania potwierdzenia
  //   @returns {Promise<Object>}
  async function remove(id, showConfirm) {
    try {
      // If we have a confirmation function, use it
      if (showConfirm) {
        const confirmed = await showConfirm(
          t('workspaces.deleteTitle'),
          t('workspaces.deleteMessage', { count: 1 })
        );
        if (!confirmed) {
          return { ok: false, error: 'USER_CANCELLED' };
        }
      }

      const res = await window.electronAPI.invoke(IPC_CHANNELS.WORKSPACES.DELETE, { id });
      if (res?.ok) {
        logInfo("store", "useWorkspaces.remove success", id);
        await load();
      } else {
        logError("store", "useWorkspaces.remove failed", res?.error);
        logWarn("store", "Nie można usunąć workspace");
      }
      return res;
    } catch (err) {
      logError("store", "useWorkspaces.remove exception", err.message);
      logWarn("store", "Wystąpił błąd podczas usuwania workspace");
      return { ok: false, error: err.message };
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { workspaces, loading, reloadWorkspaces: load, saveWorkspace: save, deleteWorkspace: remove };
}
