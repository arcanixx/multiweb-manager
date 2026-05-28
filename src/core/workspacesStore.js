// =============================================================================
// FILE: workspacesStore.js
// PATH: src/core/workspacesStore.js
// VERSION: 0.0.3
// PURPOSE: Zarządzanie workspace'ami użytkownika
// FUNCTIONS: getAllWorkspaces, saveWorkspace, saveWorkspaces, deleteWorkspace
// DEPENDS ON: fs, path, electron, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import fs from "fs";
import path from "path";
import { app } from "electron";
import { logInfo, logError } from "../utils/logger.js";
const WORKSPACES_FILE = path.join(app.getPath("userData"), "workspaces.json");
// ---------------------------------------------------------------------------
// Wewnętrzne helpers – odczyt / zapis pliku JSON
// ---------------------------------------------------------------------------
function loadStore() {
  try {
    if (!fs.existsSync(WORKSPACES_FILE)) {
      return { version: "0.0.3", data: [] };
    }
    return JSON.parse(fs.readFileSync(WORKSPACES_FILE, "utf8"));
  } catch (err) {
    logError("workspacesStore.loadStore error", err);
    return { version: "0.0.3", data: [] };
  }
}
function saveStore(store) {
  try {
    fs.writeFileSync(WORKSPACES_FILE, JSON.stringify(store, null, 2), "utf8");
    return true;
  } catch (err) {
    logError("workspacesStore.saveStore error", err);
    return false;
  }
}
// ---------------------------------------------------------------------------
// Publiczne API
// ---------------------------------------------------------------------------
/** Zwraca listę wszystkich workspace'ów. */
export function getAllWorkspaces() {
  return loadStore().data;
}
/**
 * Zapisuje workspace (upsert po id).
 * Jeśli workspace o danym id nie istnieje – dodaje go.
 * Jeśli istnieje – nadpisuje.
 */
export function saveWorkspace(workspace) {
  const store = loadStore();
  const idx = store.data.findIndex(w => w.id === workspace.id);

  if (idx === -1) {
    store.data.push(workspace);
  } else {
    store.data[idx] = workspace;
  }

  saveStore(store);
  logInfo("workspacesStore.saveWorkspace", workspace.id);
  return workspace;
}

/** Zastępuje całą listę workspace'ów. */
export function saveWorkspaces(workspaces) {
  saveStore({ version: "0.0.3", data: workspaces });
  logInfo("workspacesStore.saveWorkspaces", workspaces.length);
  return workspaces;
}

/** Usuwa workspace po id. */
export function deleteWorkspace(id) {
  const store = loadStore();
  store.data = store.data.filter(w => w.id !== id);
  saveStore(store);
  logInfo("workspacesStore.deleteWorkspace", id);
  return true;
}

// =============================================================================
// END OF FILE
// =============================================================================