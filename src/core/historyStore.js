// =============================================================================
// FILE: historyStore.js
// PATH: src/core/historyStore.js
// VERSION: 0.0.3
// PURPOSE: Historia akcji użytkownika (HistoryLog, Sidebar).
//         Przechowuje odwiedzone URL-e, akcje, błędy.
//         W przyszłości: eksport/import, synchronizacja między urządzeniami.
// FUNCTIONS: loadHistory, saveHistory, addHistoryEntry, clearHistory, getRecentHistory
// DEPENDS ON: config.js, persistence.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { LIMITS } from "../config.js";
import { getUserDataPath, readJsonFile, writeJsonFile } from "./persistence.js";
import { logInfo, logError } from "../utils/logger.js";
// Ścieżka do pliku historii w userData – stała (nie funkcja)
// Uwaga: getUserDataPath jest bezpieczne po app.whenReady()
const HISTORY_FILE_PATH = getUserDataPath("history.json");
// ----------------------------------------------------------------
// loadRaw() – wczytuje surowe dane z pliku historii
//   Obsługuje zarówno stary format (tablica) jak i nowy ({ data: [] })
// ----------------------------------------------------------------
function loadRaw() {
  try {
    const stored = readJsonFile(HISTORY_FILE_PATH, { version: "0.0.3", data: [] });
    return Array.isArray(stored) ? stored : stored.data || [];
  } catch (err) {
    logError("historyStore.loadRaw failed", err);
    return [];
  }
}
// ----------------------------------------------------------------
// saveRaw() – zapisuje tablicę wpisów do pliku, przycinając do limitu
// ----------------------------------------------------------------
function saveRaw(entries) {
  const trimmed = entries.slice(0, LIMITS.maxHistoryEntries || 5000);
  writeJsonFile(HISTORY_FILE_PATH, { version: "0.0.3", data: trimmed });
  return trimmed;
}
// ----------------------------------------------------------------
// loadHistory() – publiczne API: zwraca pełną tablicę wpisów
// ----------------------------------------------------------------
export function loadHistory() {
  return loadRaw();
}
// ----------------------------------------------------------------
// saveHistory() – publiczne API: zapisuje podaną tablicę wpisów
//   TODO: przyszły use case – eksport/import historii, backup, sync
//   (na razie nieużywane, ale zachowane dla kompletności API)
// ----------------------------------------------------------------
export function saveHistory(entries) {
  if (!Array.isArray(entries)) return [];
  return saveRaw(entries);
}

// ----------------------------------------------------------------
// addHistoryEntry() – dodaje nowy wpis na początek listy i zapisuje
//   entry: { profileName, url, timestamp?, level?, id? }
// ----------------------------------------------------------------
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
  logInfo("historyStore.add", row.id);
  return next;
}

// ----------------------------------------------------------------
// clearHistory() – czyści całą historię
// ----------------------------------------------------------------
export function clearHistory() {
  saveRaw([]);
  return [];
}

// ----------------------------------------------------------------
// getRecentHistory() – ostatnie N wpisów (domyślnie 100)
// ----------------------------------------------------------------
export function getRecentHistory(limit = 100) {
  return loadRaw().slice(0, limit);
}

// =============================================================================
// END OF FILE
// =============================================================================