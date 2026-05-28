// =============================================================================
// FILE: tasksStore.js
// PATH: src/core/tasksStore.js
// VERSION: 0.0.3
// PURPOSE: Zadania per projekt (TaskPanel, AggregatedTasks).
// FUNCTIONS: loadTasksSections, loadTasksByProject, saveTasksForProject, loadAllTasksGrouped, loadTasks
// DEPENDS ON: fs, persistence.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import fs from "fs";
import { getUserDataPath, readJsonFile, writeJsonFile } from "./persistence.js";
import { logInfo } from "../utils/logger.js";
const TASKS_DIR = () => getUserDataPath("tasks");
function taskFile(projectName) {
  const safe = String(projectName || "default").replace(/[^\w.-]+/g, "_");
  return `${TASKS_DIR()}/${safe}.json`;
}
const EMPTY_SECTIONS = () => ({ active: [], backlog: [], done: [] });
export function loadTasksSections(projectName) {
  const data = readJsonFile(taskFile(projectName), null);
  if (!data?.tasks) return EMPTY_SECTIONS();
  const t = data.tasks;
  if (Array.isArray(t)) {
    return { active: t, backlog: [], done: [] };
  }
  return {
    active: t.active || [],
    backlog: t.backlog || [],
    done: t.done || []
  };
}
export function loadTasksByProject(projectName) {
  const sections = loadTasksSections(projectName);
  return [...sections.active, ...sections.backlog, ...sections.done];
}
export function saveTasksForProject(projectName, payload) {
  const body =
    payload?.tasks && typeof payload.tasks === "object"
      ? payload
      : { tasks: payload };
  writeJsonFile(taskFile(projectName), {
    version: "0.0.3",
    project: projectName,
    ...body
  });
  logInfo("tasksStore.saveTasksForProject", projectName);
  return body;
}

export function loadAllTasksGrouped() {
  const dir = TASKS_DIR();
  if (!fs.existsSync(dir)) return {};
  const out = {};
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const project = file.replace(/\.json$/, "");
    out[project] = loadTasksSections(project);
  }
  return out;
}

/** Płaska lista zadań (AggregatedTasks IPC). */
export function loadTasks() {
  const grouped = loadAllTasksGrouped();
  const flat = [];
  for (const [projectName, sections] of Object.entries(grouped)) {
    for (const section of ["active", "backlog", "done"]) {
      for (const t of sections[section] || []) {
        flat.push({ ...t, projectName, section });
      }
    }
  }
  return flat;
}