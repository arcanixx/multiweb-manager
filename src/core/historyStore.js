// =============================================================================
// FILE: historyStore.js
// PATH: src/core/historyStore.js
// VERSION: 0.0.3
// PURPOSE: Historia akcji użytkownika (HistoryLog, Sidebar).
// FUNCTIONS: loadHistory, addHistoryEntry, clearHistory, getRecentHistory
// DEPENDS ON: persistence.js, config.js (LIMITS), logger.js
// =============================================================================

import { LIMITS } from "../config.js";
import { getUserDataPath, readJsonFile, writeJsonFile } from "./persistence.js";
import { logInfo } from "../utils/logger.js";

const HISTORY_FILE = () => getUserDataPath("history.json");

function loadRaw() {
  const stored = readJsonFile(HISTORY_FILE(), { version: "0.0.3", data: [] });
  return Array.isArray(stored) ? stored : stored.data || [];
}

function saveRaw(entries) {
  const trimmed = entries.slice(0, LIMITS.maxHistoryEntries || 5000);
  writeJsonFile(HISTORY_FILE(), { version: "0.0.3", data: trimmed });
  return trimmed;
}

export function loadHistory() {
  return loadRaw();
}

export function addHistoryEntry(entry) {
  const list = loadRaw();
  const row = {
    id: entry.id || `h-${Date.now()}`,
    ts: entry.ts || Date.now(),
    level: entry.level || "info",
    ...entry
  };
  const next = [row, ...list];
  saveRaw(next);
  logInfo("historyStore.add", row.id);
  return next;
}

export function clearHistory() {
  saveRaw([]);
  return [];
}

export function getRecentHistory(limit = 100) {
  return loadRaw().slice(0, limit);
}
