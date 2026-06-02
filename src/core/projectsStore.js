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

// ─── PROJECTS_FILE() – zwraca ścieżkę do pliku projektów w userData
//   @returns {string} – pełna ścieżka do projects.json
const PROJECTS_FILE = () => {
  try {
    return getUserDataPath("projects.json");
  } catch (err) {
    logError("store", "projectsStore.PROJECTS_FILE failed", err.message);
    return "projects.json";
  }
};

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
    logError("store", "projectsStore.loadProjects failed", err.message);
    logWarn("store", "Nie można załadować projektów – używam pustej tablicy");
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
    logInfo("store", "projectsStore.saveProjects success", projects.length);
    return projects;
  } catch (err) {
    logError("store", "projectsStore.saveProjects failed", err.message);
    logWarn("store", "Nie można zapisać projektów");
    return projects;
  }
}

// ─── createProject() – dodaje nowy projekt
//   @param {Object} project – obiekt projektu do dodania
//   @returns {Array} – zaktualizowana tablica projektów
export function createProject(project) {
  try {
    const list = [...loadProjects(), project];
    logInfo("store", "projectsStore.createProject success", project.id);
    return saveProjects(list);
  } catch (err) {
    logError("store", "projectsStore.createProject failed", err.message);
    return loadProjects();
  }
}

// ─── updateProject() – aktualizuje istniejący projekt
//   @param {string} id – identyfikator projektu
//   @param {Object} patch – obiekt z polami do zaktualizowania
//   @returns {Array} – zaktualizowana tablica projektów
export function updateProject(id, patch) {
  try {
    const list = loadProjects().map((p) =>
      p.id === id ? { ...p, ...patch } : p
    );
    logInfo("store", "projectsStore.updateProject success", id);
    return saveProjects(list);
  } catch (err) {
    logError("store", "projectsStore.updateProject failed", err.message);
    return loadProjects();
  }
}

// ─── archiveProject() – archiwizuje projekt (ustawia status: archived)
//   @param {string} id – identyfikator projektu do zarchiwizowania
//   @returns {Array} – zaktualizowana tablica projektów
export function archiveProject(id) {
  try {
    logInfo("store", "projectsStore.archiveProject", id);
    return updateProject(id, { status: "archived", archivedAt: Date.now() });
  } catch (err) {
    logError("store", "projectsStore.archiveProject failed", err.message);
    return loadProjects();
  }
}

// ─── deleteProject() – usuwa projekt po ID
//   @param {string} id – identyfikator projektu do usunięcia
//   @returns {Array} – zaktualizowana tablica projektów
export function deleteProject(id) {
  try {
    logInfo("store", "projectsStore.deleteProject success", id);
    return saveProjects(loadProjects().filter((p) => p.id !== id));
  } catch (err) {
    logError("store", "projectsStore.deleteProject failed", err.message);
    return loadProjects();
  }
}
