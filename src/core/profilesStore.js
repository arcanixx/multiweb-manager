// =============================================================================
// FILE: profilesStore.js
// PATH: src/core/profilesStore.js
// VERSION: 0.0.3
// PURPOSE: Zarządzanie profilami WebView — odczyt z pliku, zapis, tworzenie, aktualizacja i usuwanie (loadProfiles, saveProfiles, createProfile, updateProfile, deleteProfile).
// FUNCTIONS: loadProfiles, saveProfiles, createProfile, updateProfile, deleteProfile
// DEPENDS ON: fs, path, url, persistence.js, logger.js, config.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getUserDataPath, readJsonFile, writeJsonFile } from "./persistence.js";
import { logInfo, logError, logWarn } from "../utils/logger.js";

import { DEFAULT_PROFILE_CATEGORY } from '../config.js'; // Obecnie profil domyślny, moduł jest placeholderem, do użycia w VERSION 0.0.4
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// ─── PROFILES_FILE() – zwraca ścieżkę do pliku profili w userData
//   @returns {string} – pełna ścieżka do profiles.json (lub fallback)
const PROFILES_FILE = () => {
  try {
    return getUserDataPath("profiles.json");
  } catch (err) {
    logError("store", "profilesStore.PROFILES_FILE: Failed to get user data path", err.message);
    return "profiles.json"; // fallback
  }
};

// ─── defaultProfiles() – ładuje domyślne profile z pliku JSON
//   @returns {Array} – tablica domyślnych profili
function defaultProfiles() {
  try {
    const raw = fs.readFileSync(
      path.join(__dirname, "../data/defaultProfiles.json"),
      "utf8"
    );
    return JSON.parse(raw).data || [];
  } catch (err) {
    logError("store", "profilesStore.defaultProfiles failed", err.message);
    logWarn("store", "Nie można załadować domyślnych profili – używam pustej tablicy");
    return [];
  }
}

// ─── loadProfiles() – ładuje profile z pliku lub zwraca domyślne
//   @returns {Array} – tablica profili
export function loadProfiles() {
  try {
    const stored = readJsonFile(PROFILES_FILE(), null);
    if (Array.isArray(stored)) return stored;
    if (stored?.data && Array.isArray(stored.data)) return stored.data;

    const defaults = defaultProfiles();
    if (defaults.length) saveProfiles(defaults);
    return defaults;
  } catch (err) {
    logError("store", "profilesStore.loadProfiles failed", err.message);
    return [];
  }
}

// ─── saveProfiles() – zapisuje profile do pliku
//   @param {Array} profiles – tablica profili do zapisania
//   @returns {Array} – zapisana tablica profili
export function saveProfiles(profiles) {
  try {
    if (!Array.isArray(profiles)) throw new Error("Profiles must be an array");
    profiles.forEach(p => {
      if (!p.id || !p.url) throw new Error(`Profile ${p.name || 'unknown'} missing ID or URL`);
    });
    writeJsonFile(PROFILES_FILE(), { version: "0.0.3", data: profiles });
    logInfo("store", "profilesStore.saveProfiles success", profiles.length);
    return profiles;
  } catch (err) {
    logError("store", "profilesStore.saveProfiles failed: " + err.message);
    return profiles;
  }
}

// ─── createProfile() – dodaje nowy profil
//   @param {Object} profile – obiekt profilu do dodania
//   @returns {Array} – zaktualizowana tablica profili
export function createProfile(profile) {
  try {
    const list = loadProfiles();
    const next = [...list, profile];
    saveProfiles(next);
    logInfo("store", "profilesStore.createProfile success", profile.id);
    return next;
  } catch (err) {
    logError("store", "profilesStore.createProfile failed", err.message);
    return loadProfiles();
  }
}

// ─── updateProfile() – aktualizuje istniejący profil
//   @param {string} id – identyfikator profilu
//   @param {Object} patch – obiekt z polami do zaktualizowania
//   @returns {Array} – zaktualizowana tablica profili
export function updateProfile(id, patch) {
  try {
    const list = loadProfiles();
    const next = list.map((p) => (p.id === id ? { ...p, ...patch } : p));
    saveProfiles(next);
    logInfo("store", "profilesStore.updateProfile success", id);
    return next;
  } catch (err) {
    logError("store", "profilesStore.updateProfile failed", err.message);
    return loadProfiles();
  }
}

// ─── deleteProfile() – usuwa profil po ID
//   @param {string} id – identyfikator profilu do usunięcia
//   @returns {Array} – zaktualizowana tablica profili
export function deleteProfile(id) {
  try {
    const next = loadProfiles().filter((p) => p.id !== id);
    saveProfiles(next);
    logInfo("store", "profilesStore.deleteProfile success", id);
    return next;
  } catch (err) {
    logError("store", "profilesStore.deleteProfile failed", err.message);
    return loadProfiles();
  }
}