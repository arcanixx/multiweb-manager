// =============================================================================
// FILE: historyStore.js
// PATH: src/core/historyStore.js
// VERSION: 0.0.3
// PURPOSE: Zarządzanie historią akcji użytkownika – odczyt, zapis, dodawanie wpisów, czyszczenie i pobieranie ostatnich wpisów.
// FUNCTIONS: loadHistory, saveHistory, addHistoryEntry, clearHistory, getRecentHistory
// DEPENDS ON: config.js, persistence.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { LIMITS } from "../config.js";
import { getUserDataPath, readJsonFile, writeJsonFile } from "./persistence.js";
import { logInfo, logError } from "../utils/logger.js";

// Ścieżka do pliku historii w userData – stała (nie funkcja)
// Uwaga: getUserDataPath jest bezpieczne po app.whenReady()
let HISTORY_FILE_PATH;

try {
  HISTORY_FILE_PATH = getUserDataPath("history.json");
} catch (err) {
  logError("store", "historyStore: Failed to get user data path", err.message);
  HISTORY_FILE_PATH = "history.json"; // Fallback path
}

// ─── loadRaw() – wczytuje surowe dane z pliku historii
//   Obsługuje zarówno stary format (tablica) jak i nowy ({ data: [] })
//   @returns {Array} – tablica wpisów historii
function loadRaw() {
  try {
    const stored = readJsonFile(HISTORY_FILE_PATH, { version: "0.0.3", data: [] });
    return Array.isArray(stored) ? stored : stored.data || [];
  } catch (err) {
    logError("store", "historyStore.loadRaw failed", err.message);
    return [];
  }
}

// ─── saveRaw() – zapisuje tablicę wpisów do pliku, przycinając do limitu
//   @param {Array} entries – tablica wpisów do zapisania
//   @returns {Array} – przycięta tablica wpisów
function saveRaw(entries) {
  try {
    const trimmed = entries.slice(0, LIMITS.maxHistoryEntries || 5000);
    writeJsonFile(HISTORY_FILE_PATH, { version: "0.0.3", data: trimmed });
    return trimmed;
  } catch (err) {
    logError("store", "historyStore.saveRaw failed", err.message);
    return entries.slice(0, LIMITS.maxHistoryEntries || 5000);
  }
}

// ─── loadHistory() – publiczne API: zwraca pełną tablicę wpisów
//   @returns {Array} – tablica wpisów historii
export function loadHistory() {
  return loadRaw();
}

// ─── saveHistory() – publiczne API: zapisuje podaną tablicę wpisów
//   @param {Array} entries – tablica wpisów do zapisania
//   @returns {Array} – tablica wpisów po zapisie
export function saveHistory(entries) {
  if (!Array.isArray(entries)) return [];
  return saveRaw(entries);
}

// ─── addHistoryEntry() – dodaje nowy wpis na początek listy i zapisuje
//   @param {Object} entry – obiekt wpisu { profileName, url, timestamp?, level?, id? }
//   @returns {Array} – zaktualizowana tablica wpisów
export function addHistoryEntry(entry) {
  const list = loadRaw();
  const row = {
    id:          entry.id        || `h-${Date.now()}`,
    ts:          entry.ts        || Date.now(),
    timestamp:   entry.timestamp || new Date().toISOString(),
    level:       entry.level     || "info",
    profileName: entry.profileName || "",
    url:         entry.url       || "",
    ...entry
  };
  const next = [row, ...list];
  saveRaw(next);
  logInfo("store", "historyStore.addHistoryEntry success", row.id);
  return next;
}

// ─── clearHistory() – czyści całą historię
//   @returns {Array} – pusta tablica
export function clearHistory() {
  saveRaw([]);
  return [];
}

// ─── getRecentHistory() – ostatnie N wpisów (domyślnie 100)
//   @param {number} limit – maksymalna liczba wpisów do zwrócenia
//   @param {number} offset – punkt startowy dla paginacji
//   @returns {Array} – tablica ostatnich wpisów
export function getRecentHistory(limit = 100, offset = 0) {
  return loadRaw().slice(offset, offset + limit);
}
