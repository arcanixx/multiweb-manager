// =============================================================================
// FILE: ipcMainHandlers_profiles.js
// PATH: src/ipc/ipcMainHandlers_profiles.js
// VERSION: 0.0.3
// PURPOSE: IPC dla profili (Sidebar / Profile Manager / App Library) pobieranie profili zapisywanie profili edycja profili usuwanie profili ostatnio używane walidacja danych
// FUNCTIONS: ipc:profiles:getAll, ipc:profiles:create, ipc:profiles:update, ipc:profiles:delete, ipc:profiles:touch
// DEPENDS ON: electron, profilesStore.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from "electron";
import {
  loadProfiles,
  saveProfiles,
  updateProfile,
  deleteProfile,
  createProfile
} from "../core/profilesStore.js";
import { logError } from "../utils/logger.js";
// =============================================================================
// VALIDATION HELPERS
// =============================================================================
function validateProfile(p) {
  if (!p) throw new Error("PROFILE_EMPTY");
  if (!p.id || typeof p.id !== "string") throw new Error("PROFILE_INVALID_ID");
  if (!p.name || typeof p.name !== "string") throw new Error("PROFILE_INVALID_NAME");
  if (!p.url || typeof p.url !== "string") throw new Error("PROFILE_INVALID_URL");
  if (!p.category || typeof p.category !== "string") throw new Error("PROFILE_INVALID_CATEGORY");
  return true;
}
// =============================================================================
// IPC HANDLERS
// =============================================================================
// Pobiera wszystkie profile
ipcMain.handle("profiles:getAll", async () => {
  try {
    const profiles = loadProfiles();
    return { ok: true, data: profiles };
  } catch (err) {
    logError("profiles:getAll failed", err);
    return { ok: false, error: err.message };
  }
});
// Tworzy nowy profil
ipcMain.handle("profiles:create", async (_, payload) => {
  try {
    validateProfile(payload);
    const newList = createProfile(payload);
    saveProfiles(newList);
    return { ok: true, data: newList };
  } catch (err) {
    logError("profiles:create failed", err);
    return { ok: false, error: err.message };
  }
});

// Aktualizuje istniejący profil
ipcMain.handle("profiles:update", async (_, { id, patch }) => {
  try {
    if (!id) throw new Error("PROFILE_ID_REQUIRED");
    const updated = updateProfile(id, patch);
    saveProfiles(updated);
    return { ok: true, data: updated };
  } catch (err) {
    logError("profiles:update failed", err);
    return { ok: false, error: err.message };
  }
});

// Usuwa profil
ipcMain.handle("profiles:delete", async (_, id) => {
  try {
    if (!id) throw new Error("PROFILE_ID_REQUIRED");
    const updated = deleteProfile(id);
    saveProfiles(updated);
    return { ok: true, data: updated };
  } catch (err) {
    logError("profiles:delete failed", err);
    return { ok: false, error: err.message };
  }
});

// Ustawia lastUsedAt
ipcMain.handle("profiles:touch", async (_, id) => {
  try {
    if (!id) throw new Error("PROFILE_ID_REQUIRED");
    const updated = updateProfile(id, { lastUsedAt: Date.now() });
    saveProfiles(updated);
    return { ok: true, data: updated };
  } catch (err) {
    logError("profiles:touch failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// END OF FILE
// =============================================================================