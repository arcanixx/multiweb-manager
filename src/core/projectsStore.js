// =============================================================================
// FILE: projectsStore.js
// PATH: src/core/projectsStore.js
// VERSION: 0.0.3
// PURPOSE: Projekty (ProjectManager, AggregatedTasks) — plik projects.json.
// FUNCTIONS: loadProjects, saveProjects, createProject, updateProject, archiveProject, deleteProject
// DEPENDS ON: persistence.js, settingsStore.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { getUserDataPath, readJsonFile, writeJsonFile } from "./persistence.js";
import { loadSettings, mergeSettings } from "./settingsStore.js";
import { logInfo, logError, logWarn } from "../utils/logger.js";

const PROJECTS_FILE = () => getUserDataPath("projects.json");

// ─── loadProjects() – ładuje projekty z pliku lub z ustawień
//   @returns {Array} – tablica projektów
export function loadProjects() {
  try {
    const stored = readJsonFile(PROJECTS_FILE(), null);
    if (Array.isArray(stored)) return stored;
    if (stored?.data && Array.isArray(stored.data)) return stored.data;
    const fromSettings = loadSettings().projects;
    return Array.isArray(fromSettings) ? fromSettings : [];
  } catch (err) {
    logError('loadProjects failed', err);
    logWarn('Nie można załadować projektów – używam pustej tablicy');
    return [];
  }
}

// ─── saveProjects() – zapisuje projekty do pliku i synchronizuje z ustawieniami
//   @param {Array} projects – tablica projektów do zapisania
//   @returns {Array} – zapisana tablica projektów
export function saveProjects(projects) {
  try {
    writeJsonFile(PROJECTS_FILE(), { version: "0.0.3", data: projects });
    mergeSettings({ projects });
    logInfo("projectsStore.saveProjects", projects.length);
    return projects;
  } catch (err) {
    logError('saveProjects failed', err);
    logWarn('Nie można zapisać projektów');
    return projects;
  }
}

// ─── createProject() – dodaje nowy projekt
//   @param {Object} project – obiekt projektu do dodania
//   @returns {Array} – zaktualizowana tablica projektów
export function createProject(project) {
  const list = [...loadProjects(), project];
  return saveProjects(list);
}

// ─── updateProject() – aktualizuje istniejący projekt
//   @param {string} id – identyfikator projektu
//   @param {Object} patch – obiekt z polami do zaktualizowania
//   @returns {Array} – zaktualizowana tablica projektów
export function updateProject(id, patch) {
  const list = loadProjects().map((p) =>
    p.id === id ? { ...p, ...patch } : p
  );
  return saveProjects(list);
}

// ─── archiveProject() – archiwizuje projekt
//   @param {string} id – identyfikator projektu do zarchiwizowania
//   @returns {Array} – zaktualizowana tablica projektów
export function archiveProject(id) {
  return updateProject(id, { status: "archived", archivedAt: Date.now() });
}

// ─── deleteProject() – usuwa projekt po ID
//   @param {string} id – identyfikator projektu do usunięcia
//   @returns {Array} – zaktualizowana tablica projektów
export function deleteProject(id) {
  return saveProjects(loadProjects().filter((p) => p.id !== id));
}
