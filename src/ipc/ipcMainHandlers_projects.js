// =============================================================================
// FILE: ipcMainHandlers_projects.js
// PATH: src/ipc/ipcMainHandlers_projects.js
// VERSION: 0.0.3
// PURPOSE: IPC handlers dla Project Manager – CRUD projektów z walidacją i integracją z tasksStore.
//          projects:getAll       – pobiera wszystkie projekty
//          projects:getWithTasks – pobiera projekt wraz z jego zadaniami
//          projects:create       – tworzy nowy projekt
//          projects:update       – aktualizuje projekt (patch)
//          projects:archive      – archiwizuje projekt
//          projects:delete       – usuwa projekt
// FUNCTIONS: const:IPC_CHANNELS.PROJECTS.GET_ALL, const:IPC_CHANNELS.PROJECTS.GET_WITH_TASKS, const:IPC_CHANNELS.PROJECTS.CREATE, const:IPC_CHANNELS.PROJECTS.UPDATE, const:IPC_CHANNELS.PROJECTS.ARCHIVE, const:IPC_CHANNELS.PROJECTS.DELETE
// DEPENDS ON: electron, projectsStore.js, taskPanelStore.js, logger.js, ipcChannels.js
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
} from "../stores/projectsStore.js";
import { loadTasksByProject } from "../stores/taskPanelStore.js";
import { logError } from "../utils/logger.js";
import { IPC_CHANNELS } from '../constants/ipcChannels.js';
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
ipcMain.handle(IPC_CHANNELS.PROJECTS.GET_ALL, async () => {
  try {
    const projects = loadProjects();
    return { ok: true, data: projects };
  } catch (err) {
    logError('ipc', "projects:getAll failed", err);
    return { ok: false, error: err.message };
  }
});
// Pobiera projekt + jego zadania
ipcMain.handle(IPC_CHANNELS.PROJECTS.GET_WITH_TASKS, async (_, projectId) => {
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
ipcMain.handle(IPC_CHANNELS.PROJECTS.CREATE, async (_, payload) => {
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
ipcMain.handle(IPC_CHANNELS.PROJECTS.UPDATE, async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'object' || !('id' in payload) || !('patch' in payload)) {
      throw new Error('INVALID_PAYLOAD');
    }
    const { id, patch } = payload;
    if (!id) throw new Error("PROJECT_ID_REQUIRED");
    if (!patch || typeof patch !== 'object') throw new Error("INVALID_PATCH");
    const updated = updateProject(id, patch);
    saveProjects(updated);
    return { ok: true, data: updated };
  } catch (err) {
    logError('ipc', "projects:update failed", err);
    return { ok: false, error: err.message };
  }
});

// Archiwizuje projekt
ipcMain.handle(IPC_CHANNELS.PROJECTS.ARCHIVE, async (_, id) => {
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
ipcMain.handle(IPC_CHANNELS.PROJECTS.DELETE, async (_, id) => {
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