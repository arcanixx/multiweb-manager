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
import { logInfo, logError, logWarn } from "../utils/logger.js";
const TASKS_DIR = () => getUserDataPath("tasks");
// ─── taskFile() – generuje bezpieczną ścieżkę do pliku zadań dla projektu
//   @param {string} projectName – nazwa projektu
//   @returns {string} – ścieżka do pliku JSON
function taskFile(projectName) {
  const safe = String(projectName || "default").replace(/[^\w.-]+/g, "_");
  return `${TASKS_DIR()}/${safe}.json`;
}
// ─── EMPTY_SECTIONS() – zwraca pusty szablon sekcji zadań
//   @returns {Object} – obiekt z pustymi tablicami dla active, backlog, done
const EMPTY_SECTIONS = () => ({ active: [], backlog: [], done: [] });
// ─── loadTasksSections() – ładuje sekcje zadań dla projektu
//   @param {string} projectName – nazwa projektu
//   @returns {Object} – obiekt z sekcjami active, backlog, done
export function loadTasksSections(projectName) {
  try {
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
  } catch (err) {
    logError('loadTasksSections failed', err);
    logWarn(`Nie można załadować zadań dla projektu ${projectName}`);
    return EMPTY_SECTIONS();
  }
}
// ─── loadTasksByProject() – ładuje wszystkie zadania dla projektu jako płaską listę
//   @param {string} projectName – nazwa projektu
//   @returns {Array} – tablica zadań
export function loadTasksByProject(projectName) {
  const sections = loadTasksSections(projectName);
  return [...sections.active, ...sections.backlog, ...sections.done];
}
// ─── saveTasksForProject() – zapisuje zadania dla projektu
//   @param {string} projectName – nazwa projektu
//   @param {Object} payload – dane zadań do zapisania
//   @returns {Object} – zapisany obiekt
export function saveTasksForProject(projectName, payload) {
  try {
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
  } catch (err) {
    logError('saveTasksForProject failed', err);
    logWarn(`Nie można zapisać zadań dla projektu ${projectName}`);
    return payload;
  }
}

// ─── loadAllTasksGrouped() – ładuje wszystkie zadania pogrupowane po projektach
//   @returns {Object} – obiekt z projektami jako kluczami i sekcjami jako wartościami
export function loadAllTasksGrouped() {
  try {
    const dir = TASKS_DIR();
    if (!fs.existsSync(dir)) return {};
    const out = {};
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".json")) continue;
      const project = file.replace(/\.json$/, "");
      out[project] = loadTasksSections(project);
    }
    return out;
  } catch (err) {
    logError('loadAllTasksGrouped failed', err);
    logWarn('Nie można załadować wszystkich zadań');
    return {};
  }
}

// ─── loadTasks() – ładuje wszystkie zadania jako płaską listę z metadanymi
//   @returns {Array} – tablica zadań z dodatkowymi polami projectName i section
export function loadTasks() {
  try {
    const grouped = loadAllTasksGrouped();
    const flat = [];
    for (const [projectName, sections] of Object.entries(grouped)) {
      for (const section of ["active", "backlog", "done"]) {
        for (const t of sections[section] || []) {
          flat.push({ ...t, projectName, section });
        }
      }
    }
    logInfo("tasksStore.loadTasks", flat.length);
    return flat;
  } catch (err) {
    logError('loadTasks failed', err);
    logWarn('Nie można załadować płaskiej listy zadań');
    return [];
  }
}
