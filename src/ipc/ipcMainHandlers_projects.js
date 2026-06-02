// =============================================================================
// FILE: ipcMainHandlers_projects.js
// PATH: src/ipc/ipcMainHandlers_projects.js
// VERSION: 0.0.3
// PURPOSE: IPC dla Project Manager settings:get        – pobiera aktualne ustawienia settings:update     – aktualizuje (merge patch, nie nadpisuje) settings:reset      – reset do DEFAULT_SETTINGS settings:export     – eksport do pliku JSON settings:import     – import z pliku JSON (merge) settings:getDefaults – zwraca DEFAULT_SETTINGS z config.js
// FUNCTIONS: ipc:projects:getAll, ipc:projects:getWithTasks, ipc:projects:create, ipc:projects:update, ipc:projects:archive, ipc:projects:delete
// DEPENDS ON: electron, projectsStore.js, tasksStore.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
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

// ─── validateProject() – Waliduje poprawność obiektu projektu, sprawdzając obecność i prawidłowość typu podstawowych właściwości (id, name) i rzucając wyjątek w przypadku błędów
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
    logError('ipc', "projects:getAll failed", err);
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
    logError('ipc', "projects:getWithTasks failed", err);
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
    logError('ipc', "projects:create failed", err);
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
    logError('ipc', "projects:update failed", err);
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
    logError('ipc', "projects:archive failed", err);
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
    logError('ipc', "projects:delete failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// END OF FILE
// =============================================================================