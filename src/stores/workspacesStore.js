// =============================================================================
// FILE: workspacesStore.js
// PATH: src/stores/workspacesStore.js
// VERSION: 0.0.3
// PURPOSE: Zarządzanie przestrzeniami roboczymi (workspaces) użytkownika – ładowanie, zapisywanie oraz operacje typu upsert.
// FUNCTIONS: getAllWorkspaces, saveWorkspace, saveWorkspaces, deleteWorkspace
// DEPENDS ON: fs, path, electron, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import fs from "fs";
import path from "path";
import { app } from "electron";
import { logInfo, logError } from "../utils/logger.js";
const WORKSPACES_FILE = path.join(app.getPath("userData"), "workspaces.json");

// ─── loadStore() – Wczytuje i analizuje plik konfiguracyjny workspaces.json z katalogu użytkownika; przy błędzie lub braku pliku zwraca obiekt z pustą tablicą
function loadStore() {
  try {
    if (!fs.existsSync(WORKSPACES_FILE)) {
      return { version: "0.0.3", data: [] };
    }
    return JSON.parse(fs.readFileSync(WORKSPACES_FILE, "utf8"));
  } catch (err) {
    logError("store", "workspacesStore.loadStore failed", err.message);
    return { version: "0.0.3", data: [] };
  }
}

// ─── saveStore() – Zapisuje obiekt stanu przestrzeni roboczych (workspaces) do pliku workspaces.json w katalogu danych użytkownika; zwraca true przy sukcesie lub false przy błędzie
function saveStore(store) {
  try {
    fs.writeFileSync(WORKSPACES_FILE, JSON.stringify(store, null, 2), "utf8");
    logInfo("store", "workspacesStore.saveStore success");
    return true;
  } catch (err) {
    logError("store", "workspacesStore.saveStore failed", err.message);
    return false;
  }
}

// ─── getAllWorkspaces() – Pobiera i zwraca tablicę wszystkich zdefiniowanych przestrzeni roboczych użytkownika
export function getAllWorkspaces() {
  try {
    return loadStore().data || [];
  } catch (err) {
    logError("store", "workspacesStore.getAllWorkspaces failed", err.message);
    return [];
  }
}

// ─── saveWorkspace() – Zapisuje lub aktualizuje (upsert) pojedynczą przestrzeń roboczą na podstawie jej identyfikatora, zapisuje stan w pliku i zwraca ten obiekt
export function saveWorkspace(workspace) {
  try {
    const store = loadStore();

    // Check name uniqueness for new workspaces
    if (!store.data.find(w => w.id === workspace.id) && store.data.find(w => w.name === workspace.name)) {
      throw new Error("Workspace name already exists");
    }

    const idx = store.data.findIndex(w => w.id === workspace.id);

    if (idx === -1) {
      store.data.push(workspace);
    } else {
      store.data[idx] = workspace;
    }

    saveStore(store);
    logInfo("store", "workspacesStore.saveWorkspace success", workspace.id);
    return workspace;
  } catch (err) {
    logError("store", "workspacesStore.saveWorkspace failed", err.message);
    return workspace;
  }
}

// ─── saveWorkspaces() – Nadpisuje całą listę przestrzeni roboczych nową tablicą obiektów, zapisuje ją na dysku i zwraca przekazaną tablicę
export function saveWorkspaces(workspaces) {
  try {
    saveStore({ version: "0.0.3", data: workspaces });
    logInfo("store", "workspacesStore.saveWorkspaces success", workspaces.length);
    return workspaces;
  } catch (err) {
    logError("store", "workspacesStore.saveWorkspaces failed", err.message);
    return workspaces;
  }
}

// ─── deleteWorkspace() – Usuwa przestrzeń roboczą o podanym identyfikatorze ze sklepu danych, zapisuje zmiany na dysku i zwraca true
export function deleteWorkspace(id) {
  try {
    const store = loadStore();
    store.data = store.data.filter(w => w.id !== id);
    saveStore(store);
    logInfo("store", "workspacesStore.deleteWorkspace success", id);
    return true;
  } catch (err) {
    logError("store", "workspacesStore.deleteWorkspace failed", err.message);
    return false;
  }
}