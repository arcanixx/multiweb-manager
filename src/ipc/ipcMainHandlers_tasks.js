// =============================================================================
// FILE: ipcMainHandlers_tasks.js
// PATH: src/ipc/ipcMainHandlers_tasks.js
// VERSION: 0.0.3
// PURPOSE: IPC namespaced dla zadań (ui/taskpanel).
// FUNCTIONS: ipc:tasks:getAll, ipc:tasks:add, ipc:tasks:update, ipc:tasks:delete, ipc:tasks:saveSections
// DEPENDS ON: electron, tasksStore.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from "electron";
import {
  loadTasksSections,
  loadTasksByProject,
  saveTasksForProject,
  loadTasks,
  loadAllTasksGrouped,
} from "../core/tasksStore.js";
import { logError, logInfo } from "../utils/logger.js";

// ─── tasks:getAll – zwraca płaską listę zadań (wszystkich lub dla projektu)
//   payload opcjonalny: string = projektName → sekcje; brak = płaska lista wszystkich
ipcMain.handle("tasks:getAll", async (_, payload) => {
  try {
    if (payload !== undefined && typeof payload !== "string") {
      throw new Error("INVALID_PAYLOAD");
    }
    if (payload) {
      // Zwracamy płaską listę dla konkretnego projektu z polem section i projectId
      const tasks = loadTasksByProject(payload).map((t) => ({
        ...t,
        projectId: t.projectId || payload,
        section: t.section || "active",
      }));
      return { ok: true, data: tasks };
    }
    // Bez payload → płaska lista WSZYSTKICH zadań (loadTasks dodaje projectName i section)
    // Mapujemy projectName → projectId dla spójności z filtrowaniem w TaskPanel
    const flat = loadTasks().map((t) => ({
      ...t,
      projectId: t.projectId || t.projectName,
    }));
    return { ok: true, data: flat };
  } catch (err) {
    logError("ipc", "tasks:getAll", err);
    return { ok: false, error: err.message };
  }
});

// ─── tasks:add – dodaje nowe zadanie do projektu
//   payload: { projectId, section?, ...taskFields }
ipcMain.handle("tasks:add", async (_, payload) => {
  try {
    if (!payload || typeof payload !== "object" || !payload.projectId) {
      throw new Error("TASKS_PROJECT_ID_REQUIRED");
    }
    const { projectId, ...taskData } = payload;
    const sections = loadTasksSections(projectId);
    const section = taskData.section || "active";
    const newTask = {
      id: taskData.id || `task_${Date.now()}`,
      ...taskData,
      projectId,
      section,
      createdAt: taskData.createdAt || new Date().toISOString(),
    };
    sections[section] = [...(sections[section] || []), newTask];
    saveTasksForProject(projectId, { tasks: sections });
    logInfo("ipc", `tasks:add → projekt=${projectId} id=${newTask.id}`);
    return { ok: true, data: newTask };
  } catch (err) {
    logError("ipc", "tasks:add", err);
    return { ok: false, error: err.message };
  }
});

// ─── tasks:update – aktualizuje zadanie (patch) w projekcie
//   payload: { id, patch: { ...pola } }
ipcMain.handle("tasks:update", async (_, payload) => {
  try {
    if (!payload || !payload.id || !payload.patch) {
      throw new Error("TASKS_UPDATE_INVALID_PAYLOAD");
    }
    const { id, patch } = payload;
    // Szukamy zadania we wszystkich projektach
    const allTasks = loadTasks();
    const existing = allTasks.find((t) => t.id === id);
    if (!existing) throw new Error(`TASK_NOT_FOUND:${id}`);

    const projectId = existing.projectId || existing.projectName;
    const sections = loadTasksSections(projectId);
    const oldSection = existing.section || "active";
    const newSection = patch.section || oldSection;

    // Usuń z starej sekcji
    sections[oldSection] = (sections[oldSection] || []).filter((t) => t.id !== id);
    // Zapisz do docelowej sekcji (może być inna przy przenoszeniu)
    const updated = { ...existing, ...patch, id, section: newSection };
    sections[newSection] = [...(sections[newSection] || []), updated];

    saveTasksForProject(projectId, { tasks: sections });
    logInfo("ipc", `tasks:update → id=${id}`);
    return { ok: true, data: updated };
  } catch (err) {
    logError("ipc", "tasks:update", err);
    return { ok: false, error: err.message };
  }
});

// ─── tasks:delete – usuwa zadanie z projektu
//   payload: { id }
ipcMain.handle("tasks:delete", async (_, payload) => {
  try {
    if (!payload || !payload.id) throw new Error("TASKS_DELETE_ID_REQUIRED");
    const { id } = payload;

    const allTasks = loadTasks();
    const existing = allTasks.find((t) => t.id === id);
    if (!existing) throw new Error(`TASK_NOT_FOUND:${id}`);

    const projectId = existing.projectId || existing.projectName;
    const sections = loadTasksSections(projectId);
    for (const sec of ["active", "backlog", "done"]) {
      sections[sec] = (sections[sec] || []).filter((t) => t.id !== id);
    }
    saveTasksForProject(projectId, { tasks: sections });
    logInfo("ipc", `tasks:delete → id=${id}`);
    return { ok: true };
  } catch (err) {
    logError("ipc", "tasks:delete", err);
    return { ok: false, error: err.message };
  }
});

// ─── tasks:getAllGrouped – zwraca wszystkie zadania pogrupowane per projekt
//   Używane przez AggregatedTasks.jsx (dashboard view)
//   Format: { projectName: { active: [], backlog: [], done: [] } }
ipcMain.handle("tasks:getAllGrouped", async () => {
  try {
    return { ok: true, data: loadAllTasksGrouped() };
  } catch (err) {
    logError("ipc", "tasks:getAllGrouped", err);
    return { ok: false, error: err.message };
  }
});

//   payload: { projectName, sections }
ipcMain.handle("tasks:saveSections", async (_, payload) => {
  try {
    if (
      !payload ||
      typeof payload !== "object" ||
      !("projectName" in payload) ||
      !("sections" in payload)
    ) {
      throw new Error("INVALID_PAYLOAD");
    }
    const { projectName, sections } = payload;
    if (!projectName || typeof projectName !== "string")
      throw new Error("TASKS_PROJECT_NAME_REQUIRED");
    if (!Array.isArray(sections)) throw new Error("TASKS_SECTIONS_MUST_BE_ARRAY");
    saveTasksForProject(projectName, { tasks: sections });
    return { ok: true };
  } catch (err) {
    logError("ipc", "tasks:saveSections", err);
    return { ok: false, error: err.message };
  }
});
