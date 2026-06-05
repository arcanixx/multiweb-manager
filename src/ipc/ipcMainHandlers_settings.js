// =============================================================================
// FILE: ipcMainHandlers_settings.js
// PATH: src/ipc/ipcMainHandlers_settings.js
// VERSION: 0.0.3
// PURPOSE: IPC handlers dla Settings. settings:get        – pobiera aktualne ustawienia settings:update     – aktualizuje (merge patch, nie nadpisuje) settings:reset      – reset do DEFAULT_SETTINGS settings:export     – eksport do pliku JSON settings:import     – import z pliku JSON (merge) settings:getDefaults – zwraca DEFAULT_SETTINGS z config.js
// FUNCTIONS: ipc:settings:get, ipc:settings:update, ipc:settings:reset, ipc:settings:export, ipc:settings:import, ipc:settings:getDefaults
// DEPENDS ON: electron, fs, logger.js, settingsStore.js, config.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from "electron";
import fs from "fs";
import { logError } from "../utils/logger.js";
import {
  loadSettings,
  resetSettings,
  mergeSettings
} from "../stores/settingsStore.js";
import { DEFAULT_SETTINGS } from "../../config.js";
import { IPC_CHANNELS } from '../constants/ipcChannels.js';
// ----------------------------------------------------------------
// settings:get – zwraca aktualne ustawienia z settingsStore
// ----------------------------------------------------------------
ipcMain.handle(IPC_CHANNELS.SETTINGS.GET, async () => {
  try {
    const settings = loadSettings();
    return { ok: true, data: settings };
  } catch (err) {
    logError('ipc', "settings:get failed", err);
    return { ok: false, error: err.message };
  }
});
// ----------------------------------------------------------------
// settings:update – merge patch z istniejącymi settings (nie nadpisuje!)
//   patch: Partial<Settings> – tylko zmieniane klucze
// ----------------------------------------------------------------
ipcMain.handle(IPC_CHANNELS.SETTINGS.UPDATE, async (_, payload) => {
  try {
    if (!payload || typeof payload !== "object") {
      throw new Error("INVALID_SETTINGS_PATCH");
    }
    const patch = payload;
    const updated = mergeSettings(patch);
    // mergeSettings() wewnętrznie wywołuje saveSettings() — nie zapisujemy drugi raz
    return { ok: true, data: updated };
  } catch (err) {
    logError('ipc', "settings:update failed", err);
    return { ok: false, error: err.message };
  }
});

// ----------------------------------------------------------------
// settings:reset – przywraca DEFAULT_SETTINGS i zapisuje
// ----------------------------------------------------------------
ipcMain.handle(IPC_CHANNELS.SETTINGS.RESET, async () => {
  try {
    const reset = resetSettings();
    return { ok: true, data: reset };
  } catch (err) {
    logError('ipc', "settings:reset failed", err);
    return { ok: false, error: err.message };
  }
});

// ----------------------------------------------------------------
// settings:export – zapisuje ustawienia do pliku JSON pod exportPath
// ----------------------------------------------------------------
ipcMain.handle(IPC_CHANNELS.SETTINGS.EXPORT, async (_, exportPath) => {
  try {
    if (!exportPath || typeof exportPath !== 'string' || exportPath.trim() === '') {
      throw new Error('INVALID_EXPORT_PATH');
    }
    const settings = loadSettings();
    const json = JSON.stringify(settings, null, 2);
    fs.writeFileSync(exportPath, json, "utf8");
    return { ok: true };
  } catch (err) {
    logError('ipc', "settings:export failed", err);
    return { ok: false, error: err.message };
  }
});

// ----------------------------------------------------------------
// settings:import – wczytuje JSON z importPath i merge z istniejącymi
// ----------------------------------------------------------------
ipcMain.handle(IPC_CHANNELS.SETTINGS.IMPORT, async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'string') {
      throw new Error('INVALID_PAYLOAD');
    }
    const importPath = payload;
    if (!fs.existsSync(importPath)) {
      throw new Error("IMPORT_FILE_NOT_FOUND");
    }
    const raw = fs.readFileSync(importPath, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      throw new Error("INVALID_IMPORT_DATA");
    }
    const merged = mergeSettings(parsed);
    // mergeSettings() wewnętrznie wywołuje saveSettings() — nie zapisujemy drugi raz
    return { ok: true, data: merged };
  } catch (err) {
    logError('ipc', "settings:import failed", err);
    return { ok: false, error: err.message };
  }
});

// ----------------------------------------------------------------
// settings:getDefaults – zwraca DEFAULT_SETTINGS z config.js
// ----------------------------------------------------------------
ipcMain.handle(IPC_CHANNELS.SETTINGS.GET_DEFAULTS, async () => {
  try {
    return { ok: true, data: DEFAULT_SETTINGS };
  } catch (err) {
    logError('ipc', "settings:getDefaults failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// END OF FILE
// =============================================================================