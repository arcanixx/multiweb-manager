// =============================================================================
// FILE: settingsStore.js
// PATH: src/core/settingsStore.js
// VERSION: 0.0.3
// PURPOSE: Ustawienia użytkownika — merge partial updates, reset do domyślnych.
// FUNCTIONS: loadSettings, saveSettings, mergeSettings, resetSettings, updateSettings
// DEPENDS ON: persistence.js, config.js (DEFAULT_SETTINGS), defaultSettings.json
// =============================================================================

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { DEFAULT_SETTINGS } from "../config.js";
import { getUserDataPath, readJsonFile, writeJsonFile } from "./persistence.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SETTINGS_FILE = () => getUserDataPath("settings.json");

function baseDefaults() {
  let extra = {};
  try {
    const raw = fs.readFileSync(
      path.join(__dirname, "../data/defaultSettings.json"),
      "utf8"
    );
    extra = JSON.parse(raw).data || {};
  } catch {
    /* fallback only DEFAULT_SETTINGS */
  }
  return {
    ...DEFAULT_SETTINGS,
    ...extra,
    version: "0.0.3"
  };
}

export function loadSettings() {
  const stored = readJsonFile(SETTINGS_FILE(), null);
  if (!stored || typeof stored !== "object") return baseDefaults();
  return { ...baseDefaults(), ...stored };
}

export function saveSettings(settings) {
  writeJsonFile(SETTINGS_FILE(), settings);
  return settings;
}

export function mergeSettings(patch) {
  const current = loadSettings();
  const merged = { ...current, ...patch };
  saveSettings(merged);
  return merged;
}

export function updateSettings(partial) {
  return mergeSettings(partial);
}

export function resetSettings() {
  const reset = baseDefaults();
  saveSettings(reset);
  return reset;
}
