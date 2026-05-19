// =============================================================================
// FILE: ipcMainHandlers_workspaces.js
// PATH: src/ipc/ipcMainHandlers_workspaces.js
// VERSION: 0.0.3
// PURPOSE: IPC dla workspace (Sidebar, useWorkspaces).
// FUNCTIONS: workspaces:getAll, workspaces:save
// DEPENDS ON: workspacesStore.js, logger.js
// =============================================================================

import { ipcMain } from "electron";
import {
  getAllWorkspaces,
  saveWorkspaces
} from "../core/workspacesStore.js";
import { logError } from "../utils/logger.js";

ipcMain.handle("workspaces:getAll", async () => {
  try {
    return { ok: true, data: getAllWorkspaces() };
  } catch (err) {
    logError("workspaces:getAll", err);
    return { ok: false, error: err.message };
  }
});

ipcMain.handle("workspaces:save", async (_, workspaces) => {
  try {
    if (!Array.isArray(workspaces)) {
      return { ok: false, error: "INVALID_WORKSPACES" };
    }
    saveWorkspaces(workspaces);
    return { ok: true, data: workspaces };
  } catch (err) {
    logError("workspaces:save", err);
    return { ok: false, error: err.message };
  }
});
