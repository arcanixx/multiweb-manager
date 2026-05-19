// =============================================================================
// FILE: projectsStore.js
// PATH: src/core/projectsStore.js
// VERSION: 0.0.3
// PURPOSE: Projekty (ProjectManager, AggregatedTasks) — plik projects.json.
// FUNCTIONS: loadProjects, saveProjects, createProject, updateProject, archiveProject, deleteProject
// DEPENDS ON: persistence.js, settingsStore.js (fallback projects w settings), logger.js
// =============================================================================

import { getUserDataPath, readJsonFile, writeJsonFile } from "./persistence.js";
import { loadSettings, mergeSettings } from "./settingsStore.js";
import { logInfo } from "../utils/logger.js";

const PROJECTS_FILE = () => getUserDataPath("projects.json");

export function loadProjects() {
  const stored = readJsonFile(PROJECTS_FILE(), null);
  if (Array.isArray(stored)) return stored;
  if (stored?.data && Array.isArray(stored.data)) return stored.data;
  const fromSettings = loadSettings().projects;
  return Array.isArray(fromSettings) ? fromSettings : [];
}

export function saveProjects(projects) {
  writeJsonFile(PROJECTS_FILE(), { version: "0.0.3", data: projects });
  mergeSettings({ projects });
  logInfo("projectsStore.saveProjects", projects.length);
  return projects;
}

export function createProject(project) {
  const list = [...loadProjects(), project];
  return saveProjects(list);
}

export function updateProject(id, patch) {
  const list = loadProjects().map((p) =>
    p.id === id ? { ...p, ...patch } : p
  );
  return saveProjects(list);
}

export function archiveProject(id) {
  return updateProject(id, { status: "archived", archivedAt: Date.now() });
}

export function deleteProject(id) {
  return saveProjects(loadProjects().filter((p) => p.id !== id));
}
