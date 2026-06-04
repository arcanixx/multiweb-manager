// =============================================================================
// FILE: settingsStore.js
// PATH: src/stores/settingsStore.js
// VERSION: 0.0.3
// PURPOSE: Ustawienia użytkownika — merge partial updates, reset do domyślnych.
// FUNCTIONS: loadSettings, saveSettings, mergeSettings, updateSettings, resetSettings
// DEPENDS ON: lodash, fs, path, url, config.js, persistence.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import _ from 'lodash';

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { DEFAULT_SETTINGS } from "../config.js";
import { getUserDataPath, readJsonFile, writeJsonFile } from "./persistence.js";
import { logInfo, logError, logWarn } from "../utils/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// ─── SETTINGS_FILE() – zwraca ścieżkę do pliku ustawień w userData
//   @returns {string} – pełna ścieżka do settings.json
const SETTINGS_FILE = () => {
  try {
    return getUserDataPath("settings.json");
  } catch (err) {
    logError("settings", "settingsStore: Failed to resolve settings path", err.message);
    return "settings.json";
  }
};

// ─── baseDefaults() – ładuje domyślne ustawienia z pliku lub używa DEFAULT_SETTINGS
//   @returns {Object} – obiekt z domyślnymi ustawieniami
function baseDefaults() {
  let extra = {};
  try {
    const raw = fs.readFileSync(
      path.join(__dirname, "../data/defaultSettings.json"),
      "utf8"
    );
    extra = JSON.parse(raw).data || {};
  } catch (err) {
    logError('settings', 'baseDefaults failed', err.message);
    logWarn('Nie można załadować domyślnych ustawień – używam DEFAULT_SETTINGS');
  }
  return {
    ...DEFAULT_SETTINGS,
    ...extra,
    version: "0.0.3"
  };
}

// ─── loadSettings() – ładuje ustawienia z pliku lub zwraca domyślne
//   @returns {Object} – obiekt z ustawieniami
export function loadSettings() {
  try {
    const stored = readJsonFile(SETTINGS_FILE(), null);
    if (!stored || typeof stored !== "object") return baseDefaults();
    return { ...baseDefaults(), ...stored };
  } catch (err) {
    logError('settings', 'settingsStore.loadSettings failed', err.message);
    logWarn('settings', 'Nie można załadować ustawień – używam domyślnych');
    // In a real implementation, we would show a toast here for non-critical errors
    // For example: showToast(`Failed to load settings: ${err.message}. Using defaults.`, 'warn');
    return baseDefaults();
  }
}

// ─── saveSettings() – zapisuje ustawienia do pliku
//   @param {Object} settings – obiekt ustawień do zapisania
//   @returns {Object} – zapisany obiekt ustawień
export function saveSettings(settings) {
  try {
    writeJsonFile(SETTINGS_FILE(), settings);
    logInfo("settings", "settingsStore.saveSettings success", Object.keys(settings).length);
    return settings;
  } catch (err) {
    logError('settings', 'settingsStore.saveSettings failed', err.message);
    logWarn('settings', 'Nie można zapisać ustawień');
    // In a real implementation, we would show a toast here for non-critical errors
    // For example: showToast(`Failed to save settings: ${err.message}`, 'error');
    return settings;
  }
}

// ─── mergeSettings() – scala bieżące ustawienia z podanymi zmianami przez _.merge (deep merge)
//   @param {Object} patch – obiekt z polami do zaktualizowania
//   @returns {Object} – zaktualizowany obiekt ustawień
export function mergeSettings(patch) {
  try {
    const current = loadSettings();
    const merged = _.merge({}, current, patch);
    saveSettings(merged);
    return merged;
  } catch (err) {
    logError('settings', 'settingsStore.mergeSettings failed', err.message);
    // In a real implementation, we would show a modal here for critical errors
    // For example: showConfirm('Settings Error', `Failed to save settings: ${err.message}. Try again?`, () => mergeSettings(patch));
    // Return current settings as fallback
    return loadSettings();
  }
}

// ─── updateSettings() – alias dla mergeSettings (kompatybilność wsteczna)
//   @param {Object} partial – obiekt z polami do zaktualizowania
//   @returns {Object} – zaktualizowany obiekt ustawień
export function updateSettings(partial) {
  return mergeSettings(partial);
}

// ─── resetSettings() – resetuje ustawienia do wartości domyślnych
//   @returns {Object} – obiekt z domyślnymi ustawieniami
export function resetSettings() {
  const reset = baseDefaults();
  saveSettings(reset);
  return reset;
}