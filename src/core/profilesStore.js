// =============================================================================
// FILE: profilesStore.js
// PATH: src/core/profilesStore.js
// VERSION: 0.0.3
// PURPOSE: CRUD profili (Sidebar, WebView, App Library).
// FUNCTIONS: loadProfiles, saveProfiles, createProfile, updateProfile, deleteProfile
// DEPENDS ON: fs, path, url, persistence.js, logger.js, src
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getUserDataPath, readJsonFile, writeJsonFile } from "./persistence.js";
import { logInfo, logError, logWarn } from "../utils/logger.js";

import { DEFAULT_PROFILE_CATEGORY } from 'src/config.js'; // Obecnie profil domyślny, moduł jest placeholderem, do użycia w VERSION 0.0.4
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROFILES_FILE = () => getUserDataPath("profiles.json");

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
    logError('defaultProfiles failed', err);
    logWarn('Nie można załadować domyślnych profili – używam pustej tablicy');
    return [];
  }
}

// ─── loadProfiles() – ładuje profile z pliku lub zwraca domyślne
//   @returns {Array} – tablica profili
export function loadProfiles() {
  const stored = readJsonFile(PROFILES_FILE(), null);
  if (Array.isArray(stored)) return stored;
  if (stored?.data && Array.isArray(stored.data)) return stored.data;
  const defaults = defaultProfiles();
  if (defaults.length) saveProfiles(defaults);
  return defaults;
}

// ─── saveProfiles() – zapisuje profile do pliku
//   @param {Array} profiles – tablica profili do zapisania
//   @returns {Array} – zapisana tablica profili
export function saveProfiles(profiles) {
  writeJsonFile(PROFILES_FILE(), { version: "0.0.3", data: profiles });
  logInfo("profilesStore.saveProfiles", profiles.length);
  return profiles;
}

// ─── createProfile() – dodaje nowy profil
//   @param {Object} profile – obiekt profilu do dodania
//   @returns {Array} – zaktualizowana tablica profili
export function createProfile(profile) {
  const list = loadProfiles();
  const next = [...list, profile];
  saveProfiles(next);
  return next;
}

// ─── updateProfile() – aktualizuje istniejący profil
//   @param {string} id – identyfikator profilu
//   @param {Object} patch – obiekt z polami do zaktualizowania
//   @returns {Array} – zaktualizowana tablica profili
export function updateProfile(id, patch) {
  const list = loadProfiles();
  const next = list.map((p) => (p.id === id ? { ...p, ...patch } : p));
  saveProfiles(next);
  return next;
}

// ─── deleteProfile() – usuwa profil po ID
//   @param {string} id – identyfikator profilu do usunięcia
//   @returns {Array} – zaktualizowana tablica profili
export function deleteProfile(id) {
  const next = loadProfiles().filter((p) => p.id !== id);
  saveProfiles(next);
  return next;
}
