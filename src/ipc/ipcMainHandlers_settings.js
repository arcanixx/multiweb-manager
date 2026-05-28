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
  saveSettings,
  resetSettings,
  mergeSettings
} from "../core/settingsStore.js";
import { DEFAULT_SETTINGS } from "../../config.js";
// ----------------------------------------------------------------
// settings:get – zwraca aktualne ustawienia z settingsStore
// ----------------------------------------------------------------
ipcMain.handle("settings:get", async () => {
  try {
    const settings = loadSettings();
    return { ok: true, data: settings };
  } catch (err) {
    logError("settings:get failed", err);
    return { ok: false, error: err.message };
  }
});
// ----------------------------------------------------------------
// settings:update – merge patch z istniejącymi settings (nie nadpisuje!)
//   patch: Partial<Settings> – tylko zmieniane klucze
// ----------------------------------------------------------------
ipcMain.handle("settings:update", async (_, patch) => {
  try {
    if (!patch || typeof patch !== "object") {
      throw new Error("INVALID_SETTINGS_PATCH");
    }
    const updated = mergeSettings(patch);
    saveSettings(updated);
    return { ok: true, data: updated };
  } catch (err) {
    logError("settings:update failed", err);
    return { ok: false, error: err.message };
  }
});

// ----------------------------------------------------------------
// settings:reset – przywraca DEFAULT_SETTINGS i zapisuje
// ----------------------------------------------------------------
ipcMain.handle("settings:reset", async () => {
  try {
    const reset = resetSettings();
    return { ok: true, data: reset };
  } catch (err) {
    logError("settings:reset failed", err);
    return { ok: false, error: err.message };
  }
});

// ----------------------------------------------------------------
// settings:export – zapisuje ustawienia do pliku JSON pod exportPath
// ----------------------------------------------------------------
ipcMain.handle("settings:export", async (_, exportPath) => {
  try {
    const settings = loadSettings();
    const json = JSON.stringify(settings, null, 2);
    fs.writeFileSync(exportPath, json, "utf8");
    return { ok: true };
  } catch (err) {
    logError("settings:export failed", err);
    return { ok: false, error: err.message };
  }
});

// ----------------------------------------------------------------
// settings:import – wczytuje JSON z importPath i merge z istniejącymi
// ----------------------------------------------------------------
ipcMain.handle("settings:import", async (_, importPath) => {
  try {
    if (!fs.existsSync(importPath)) {
      throw new Error("IMPORT_FILE_NOT_FOUND");
    }
    const raw = fs.readFileSync(importPath, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      throw new Error("INVALID_IMPORT_DATA");
    }
    const merged = mergeSettings(parsed);
    saveSettings(merged);
    return { ok: true, data: merged };
  } catch (err) {
    logError("settings:import failed", err);
    return { ok: false, error: err.message };
  }
});

// ----------------------------------------------------------------
// settings:getDefaults – zwraca DEFAULT_SETTINGS z config.js
// ----------------------------------------------------------------
ipcMain.handle("settings:getDefaults", async () => {
  try {
    return { ok: true, data: DEFAULT_SETTINGS };
  } catch (err) {
    logError("settings:getDefaults failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// END OF FILE
// =============================================================================