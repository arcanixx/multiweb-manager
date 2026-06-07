// =============================================================================
// FILE: ipcMainHandlers_workspaces.js
// PATH: src/ipc/ipcMainHandlers_workspaces.js
// VERSION: 0.0.3
// PURPOSE: IPC dla workspace (Sidebar, useWorkspaces).
// FUNCTIONS: const:IPC_CHANNELS.WORKSPACES.GET_ALL, const:IPC_CHANNELS.WORKSPACES.SAVE, const:IPC_CHANNELS.WORKSPACES.DELETE
// DEPENDS ON: electron, workspacesStore.js, logger.js, ipcChannels.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from "electron";
import {
  getAllWorkspaces,
  saveWorkspace,
  saveWorkspaces,
  deleteWorkspace
} from "../stores/workspacesStore.js";
import { logError } from "../utils/logger.js";
import { IPC_CHANNELS } from '../constants/ipcChannels.js';

ipcMain.handle(IPC_CHANNELS.WORKSPACES.GET_ALL, async () => {
  try {
    return { ok: true, data: getAllWorkspaces() };
  } catch (err) {
    logError('ipc', "workspaces:getAll", err);
    return { ok: false, error: err.message };
  }
});

// ─── workspaces:save – zapisuje workspace(y) do pliku
//   Obsługuje dwa tryby wywołania:
//   1. Tablica  → saveWorkspaces(array) – pełna podmiana listy (używane np. przy imporcie)
//   2. Obiekt   → saveWorkspace(object) – upsert pojedynczego workspace po id (używane przez useWorkspaces.save())
//
//   UWAGA: useWorkspaces.save() wysyła zawsze pojedynczy obiekt workspace.
//          Nie owijamy go w tablicę po stronie hooka, żeby nie tracić pozostałych workspace'ów przy saveWorkspaces.
ipcMain.handle(IPC_CHANNELS.WORKSPACES.SAVE, async (_, payload) => {
  try {
    if (!payload) {
      return { ok: false, error: "INVALID_WORKSPACES" };
    }

    if (Array.isArray(payload)) {
      // Pełna podmiana listy (np. import, bulk save)
      saveWorkspaces(payload);
      return { ok: true, data: getAllWorkspaces() };
    }

    if (typeof payload === 'object' && payload.id) {
      // Upsert pojedynczego workspace — nie traci pozostałych
      saveWorkspace(payload);
      return { ok: true, data: getAllWorkspaces() };
    }

    return { ok: false, error: "INVALID_WORKSPACES" };
  } catch (err) {
    logError('ipc', "workspaces:save", err);
    return { ok: false, error: err.message };
  }
});

ipcMain.handle(IPC_CHANNELS.WORKSPACES.DELETE, async (_, payload) => {
  try {
    if (!payload || typeof payload !== "object" || !payload.id) {
      return { ok: false, error: "INVALID_WORKSPACE_ID" };
    }
    const id = payload.id;
    const result = deleteWorkspace(id);
    if (result) {
      return { ok: true, data: { id } };
    } else {
      return { ok: false, error: "DELETE_FAILED" };
    }
  } catch (err) {
    logError('ipc', "workspaces:delete", err);
    return { ok: false, error: err.message };
  }
});
