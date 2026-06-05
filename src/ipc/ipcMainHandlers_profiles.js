// =============================================================================
// FILE: ipcMainHandlers_profiles.js
// PATH: src/ipc/ipcMainHandlers_profiles.js
// VERSION: 0.0.3
// PURPOSE: IPC dla profili (Sidebar / Profile Manager / App Library) pobieranie profili zapisywanie profili edycja profili usuwanie profili ostatnio używane walidacja danych
// FUNCTIONS: const:IPC_CHANNELS.PROFILES.GET_ALL, const:IPC_CHANNELS.PROFILES.CREATE, const:IPC_CHANNELS.PROFILES.UPDATE, const:IPC_CHANNELS.PROFILES.DELETE, const:IPC_CHANNELS.PROFILES.TOUCH
// DEPENDS ON: electron, profilesStore.js, logger.js, ipcChannels.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from "electron";
import {
  loadProfiles,
  saveProfiles,
  updateProfile,
  deleteProfile,
  createProfile
} from "../stores/profilesStore.js";
import { logError } from "../utils/logger.js";
import { IPC_CHANNELS } from '../constants/ipcChannels.js';
// =============================================================================
// VALIDATION HELPERS
// =============================================================================

// ─── validateProfile() – Waliduje poprawność danych obiektu profilu WebView, sprawdzając obecność i typ kluczowych pól (id, name, url, category) oraz zgłaszając wyjątek w razie niezgodności
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
ipcMain.handle(IPC_CHANNELS.PROFILES.GET_ALL, async () => {
  try {
    const profiles = loadProfiles();
    return { ok: true, data: profiles };
  } catch (err) {
    logError('ipc', "profiles:getAll failed", err);
    return { ok: false, error: err.message };
  }
});
// Tworzy nowy profil
ipcMain.handle(IPC_CHANNELS.PROFILES.CREATE, async (_, payload) => {
  try {
    validateProfile(payload);
    const newList = createProfile(payload);
    saveProfiles(newList);
    return { ok: true, data: newList };
  } catch (err) {
    logError('ipc', "profiles:create failed", err);
    return { ok: false, error: err.message };
  }
});

// Aktualizuje istniejący profil
ipcMain.handle(IPC_CHANNELS.PROFILES.UPDATE, async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'object' || !('id' in payload) || !('patch' in payload)) {
      throw new Error('INVALID_PAYLOAD');
    }
    const { id, patch } = payload;
    if (!id) throw new Error("PROFILE_ID_REQUIRED");
    if (!patch || typeof patch !== 'object') throw new Error("INVALID_PATCH");
    const updated = updateProfile(id, patch);
    saveProfiles(updated);
    return { ok: true, data: updated };
  } catch (err) {
    logError('ipc', "profiles:update failed", err);
    return { ok: false, error: err.message };
  }
});

// Usuwa profil
ipcMain.handle(IPC_CHANNELS.PROFILES.DELETE, async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'string') {
      throw new Error('INVALID_PAYLOAD');
    }
    const id = payload;
    if (!id) throw new Error("PROFILE_ID_REQUIRED");
    const updated = deleteProfile(id);
    saveProfiles(updated);
    return { ok: true, data: updated };
  } catch (err) {
    logError('ipc', "profiles:delete failed", err);
    return { ok: false, error: err.message };
  }
});

// Ustawia lastUsedAt
ipcMain.handle(IPC_CHANNELS.PROFILES.TOUCH, async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'string') {
      throw new Error('INVALID_PAYLOAD');
    }
    const id = payload;
    if (!id) throw new Error("PROFILE_ID_REQUIRED");
    const updated = updateProfile(id, { lastUsedAt: Date.now() });
    saveProfiles(updated);
    return { ok: true, data: updated };
  } catch (err) {
    logError('ipc', "profiles:touch failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// END OF FILE
// =============================================================================