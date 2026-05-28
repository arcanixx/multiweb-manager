// =============================================================================
// FILE: ipcMainHandlers_tasks.js
// PATH: src/ipc/ipcMainHandlers_tasks.js
// VERSION: 0.0.3
// PURPOSE: IPC namespaced dla zadań (ui/taskpanel).
// FUNCTIONS: ipc:tasks:getAll, ipc:tasks:saveSections
// DEPENDS ON: electron, tasksStore.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from "electron";
import {
  loadTasksSections,
  saveTasksForProject,
  loadAllTasksGrouped
} from "../core/tasksStore.js";
import { logError } from "../utils/logger.js";
ipcMain.handle("tasks:getAll", async (_, projectName) => {
  try {
    if (projectName) {
      return { ok: true, data: loadTasksSections(projectName) };
    }
    return { ok: true, data: loadAllTasksGrouped() };
  } catch (err) {
    logError("tasks:getAll", err);
    return { ok: false, error: err.message };
  }
});
ipcMain.handle("tasks:saveSections", async (_, { projectName, sections }) => {
  try {
    saveTasksForProject(projectName, { tasks: sections });
    return { ok: true };
  } catch (err) {
    logError("tasks:saveSections", err);
    return { ok: false, error: err.message };
  }
});
