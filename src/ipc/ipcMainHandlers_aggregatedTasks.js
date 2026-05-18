// =============================================================================
// FILE: ipcMainHandlers_aggregatedTasks.js
// PATH: src/ipc/ipcMainHandlers_aggregatedTasks.js
// VERSION: 0.0.3
// PURPOSE: IPC handlers dla widoku zbiorczego zadań.
//          - aggregatedTasks:getAll  – wszystkie taski z enrichedProjectName
//          - aggregatedTasks:filter  – filtrowanie po status i/lub priority
//          - aggregatedTasks:sort    – sortowanie po "priority" lub "date"
//          Każdy task wzbogacony o projectName z projectsStore.
// DEPENDS ON: electron (ipcMain), logger.js,
//             core/tasksStore.js, core/projectsStore.js
// =============================================================================

import { ipcMain } from "electron";
import { loadTasks } from "../core/tasksStore.js";
import { loadProjects } from "../core/projectsStore.js";
import { logError } from "../utils/logger.js";

// ----------------------------------------------------------------
// enrich() – helper: dodaje projectName do każdego taska
// ----------------------------------------------------------------
function enrich(tasks, projects) {
  return tasks.map((t) => {
    const project = projects.find((p) => p.id === t.projectId);
    return {
      ...t,
      projectName: project ? project.name : "Unknown Project"
    };
  });
}

// ----------------------------------------------------------------
// aggregatedTasks:getAll – zwraca wszystkie taski z projectName
// ----------------------------------------------------------------
ipcMain.handle("aggregatedTasks:getAll", async () => {
  try {
    const tasks    = loadTasks();
    const projects = loadProjects();
    return { ok: true, data: enrich(tasks, projects) };
  } catch (err) {
    logError("aggregatedTasks:getAll failed", err);
    return { ok: false, error: err.message };
  }
});

// ----------------------------------------------------------------
// aggregatedTasks:filter – filtruje po status i/lub priority
//   { status?: string, priority?: string }
// ----------------------------------------------------------------
ipcMain.handle("aggregatedTasks:filter", async (_, { status, priority }) => {
  try {
    const tasks    = loadTasks();
    const projects = loadProjects();

    let filtered = tasks;
    if (status)   filtered = filtered.filter((t) => t.status === status);
    if (priority) filtered = filtered.filter((t) => t.priority === priority);

    return { ok: true, data: enrich(filtered, projects) };
  } catch (err) {
    logError("aggregatedTasks:filter failed", err);
    return { ok: false, error: err.message };
  }
});

// ----------------------------------------------------------------
// aggregatedTasks:sort – sortuje po "priority" lub "date"
//   { by: "priority" | "date" }
// ----------------------------------------------------------------
ipcMain.handle("aggregatedTasks:sort", async (_, { by }) => {
  try {
    const tasks    = loadTasks();
    const projects = loadProjects();
    const enriched = enrich(tasks, projects);

    if (by === "priority") {
      enriched.sort((a, b) => a.priority.localeCompare(b.priority));
    }
    if (by === "date") {
      enriched.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    }

    return { ok: true, data: enriched };
  } catch (err) {
    logError("aggregatedTasks:sort failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// END OF FILE
// =============================================================================
