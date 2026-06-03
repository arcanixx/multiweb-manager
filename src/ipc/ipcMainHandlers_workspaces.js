// =============================================================================
// FILE: ipcMainHandlers_workspaces.js
// PATH: src/ipc/ipcMainHandlers_workspaces.js
// VERSION: 0.0.3
// PURPOSE: IPC dla workspace (Sidebar, useWorkspaces).
// FUNCTIONS: ipc:workspaces:getAll, ipc:workspaces:save, ipc:workspaces:delete
// DEPENDS ON: electron, workspacesStore.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from "electron";
import {
  getAllWorkspaces,
  saveWorkspaces,
  deleteWorkspace
} from "../core/workspacesStore.js";
import { logError } from "../utils/logger.js";
ipcMain.handle("workspaces:getAll", async () => {
  try {
    return { ok: true, data: getAllWorkspaces() };
  } catch (err) {
    logError('ipc', "workspaces:getAll", err);
    return { ok: false, error: err.message };
  }
});
ipcMain.handle("workspaces:save", async (_, payload) => {
  try {
    if (!payload || !Array.isArray(payload)) {
      return { ok: false, error: "INVALID_WORKSPACES" };
    }
    const workspaces = payload;
    saveWorkspaces(workspaces);
    return { ok: true, data: workspaces };
  } catch (err) {
    logError('ipc', "workspaces:save", err);
    return { ok: false, error: err.message };
  }
});
ipcMain.handle("workspaces:delete", async (_, payload) => {
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
ipcMain.handle("workspaces:save", async (_, payload) => {
  try {
    if (!payload || !Array.isArray(payload)) {
      return { ok: false, error: "INVALID_WORKSPACES" };
    }
    const workspaces = payload;
    saveWorkspaces(workspaces);
    return { ok: true, data: workspaces };
  } catch (err) {
    logError('ipc', "workspaces:save", err);
    return { ok: false, error: err.message };
  }
});
