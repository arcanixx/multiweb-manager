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
import { logInfo } from "../utils/logger.js";
import { DEFAULT_PROFILE_CATEGORY } from 'src/config.js'; // Obecnie profil domyślny, moduł jest placeholderem, do użycia w VERSION 0.0.4
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROFILES_FILE = () => getUserDataPath("profiles.json");
function defaultProfiles() {
  try {
    const raw = fs.readFileSync(
      path.join(__dirname, "../data/defaultProfiles.json"),
      "utf8"
    );
    return JSON.parse(raw).data || [];
  } catch {
    return [];
  }
}
export function loadProfiles() {
  const stored = readJsonFile(PROFILES_FILE(), null);
  if (Array.isArray(stored)) return stored;
  if (stored?.data && Array.isArray(stored.data)) return stored.data;
  const defaults = defaultProfiles();
  if (defaults.length) saveProfiles(defaults);
  return defaults;
}
export function saveProfiles(profiles) {
  writeJsonFile(PROFILES_FILE(), { version: "0.0.3", data: profiles });
  logInfo("profilesStore.saveProfiles", profiles.length);
  return profiles;
}
export function createProfile(profile) {
  const list = loadProfiles();
  const next = [...list, profile];
  saveProfiles(next);
  return next;
}
export function updateProfile(id, patch) {
  const list = loadProfiles();
  const next = list.map((p) => (p.id === id ? { ...p, ...patch } : p));
  saveProfiles(next);
  return next;
}

export function deleteProfile(id) {
  const next = loadProfiles().filter((p) => p.id !== id);
  saveProfiles(next);
  return next;
}