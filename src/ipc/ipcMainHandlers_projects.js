// =============================================================================
// FILE: ipcMainHandlers_projects.js
// PATH: src/ipc/ipcMainHandlers_projects.js
// VERSION: v1.0
// PURPOSE: IPC dla Project Manager
//          - CRUD projektów
//          - archiwizacja
//          - integracja z AggregatedTasks
// =============================================================================

import { ipcMain } from "electron";
import {
  loadProjects,
  saveProjects,
  createProject,
  updateProject,
  deleteProject,
  archiveProject
} from "../core/projectsStore.js";

import { loadTasksByProject } from "../core/tasksStore.js";
import { logError } from "../utils/logger.js";

// =============================================================================
// VALIDATION
// =============================================================================

function validateProject(p) {
  if (!p) throw new Error("PROJECT_EMPTY");
  if (!p.id || typeof p.id !== "string") throw new Error("PROJECT_INVALID_ID");
  if (!p.name || typeof p.name !== "string") throw new Error("PROJECT_INVALID_NAME");
  return true;
}

// =============================================================================
// IPC HANDLERS
// =============================================================================

// Pobiera wszystkie projekty
ipcMain.handle("projects:getAll", async () => {
  try {
    const projects = loadProjects();
    return { ok: true, data: projects };
  } catch (err) {
    logError("projects:getAll failed", err);
    return { ok: false, error: err.message };
  }
});

// Pobiera projekt + jego zadania
ipcMain.handle("projects:getWithTasks", async (_, projectId) => {
  try {
    if (!projectId) throw new Error("PROJECT_ID_REQUIRED");

    const projects = loadProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) throw new Error("PROJECT_NOT_FOUND");

    const tasks = loadTasksByProject(projectId);

    return {
      ok: true,
      data: {
        project,
        tasks
      }
    };
  } catch (err) {
    logError("projects:getWithTasks failed", err);
    return { ok: false, error: err.message };
  }
});

// Tworzy projekt
ipcMain.handle("projects:create", async (_, payload) => {
  try {
    validateProject(payload);
    const updated = createProject(payload);
    saveProjects(updated);
    return { ok: true, data: updated };
  } catch (err) {
    logError("projects:create failed", err);
    return { ok: false, error: err.message };
  }
});

// Aktualizuje projekt
ipcMain.handle("projects:update", async (_, { id, patch }) => {
  try {
    if (!id) throw new Error("PROJECT_ID_REQUIRED");
    const updated = updateProject(id, patch);
    saveProjects(updated);
    return { ok: true, data: updated };
  } catch (err) {
    logError("projects:update failed", err);
    return { ok: false, error: err.message };
  }
});

// Archiwizuje projekt
ipcMain.handle("projects:archive", async (_, id) => {
  try {
    if (!id) throw new Error("PROJECT_ID_REQUIRED");
    const updated = archiveProject(id);
    saveProjects(updated);
    return { ok: true, data: updated };
  } catch (err) {
    logError("projects:archive failed", err);
    return { ok: false, error: err.message };
  }
});

// Usuwa projekt
ipcMain.handle("projects:delete", async (_, id) => {
  try {
    if (!id) throw new Error("PROJECT_ID_REQUIRED");
    const updated = deleteProject(id);
    saveProjects(updated);
    return { ok: true, data: updated };
  } catch (err) {
    logError("projects:delete failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// END OF FILE
// =============================================================================
