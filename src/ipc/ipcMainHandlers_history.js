// =============================================================================
// FILE: ipcMainHandlers_history.js
// PATH: src/ipc/ipcMainHandlers_history.js
// VERSION: 0.0.3
// PURPOSE: IPC dla historii odwiedzin/akcji. history:getAll    – zwraca pełną historię (max 5000 wpisów) history:add       – dodaje nowy wpis i zapisuje history:clear     – czyści historię history:getRecent – zwraca ostatnie 100 wpisów
// FUNCTIONS: ipc:history:getAll, ipc:history:add, ipc:history:clear, ipc:history:getRecent
// DEPENDS ON: electron, historyStore.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from "electron";
import {
  loadHistory,
  addHistoryEntry,
  clearHistory,
  getRecentHistory
} from "../core/historyStore.js";
import { logError } from "../utils/logger.js";
// ----------------------------------------------------------------
// history:getAll – zwraca pełną historię z historyStore
// ----------------------------------------------------------------
ipcMain.handle("history:getAll", async () => {
  try {
    const history = loadHistory();
    return { ok: true, data: history };
  } catch (err) {
    logError("history:getAll failed", err);
    return { ok: false, error: err.message };
  }
});
// ----------------------------------------------------------------
// history:add – dodaje nowy wpis i zapisuje do store
//   entry: { profileName, url, timestamp?, level? }
// ----------------------------------------------------------------
ipcMain.handle("history:add", async (_, entry) => {
  try {
    if (!entry || typeof entry !== "object") {
      throw new Error("INVALID_HISTORY_ENTRY");
    }
    const updated = addHistoryEntry(entry);
    return { ok: true, data: updated };
  } catch (err) {
    logError("history:add failed", err);
    return { ok: false, error: err.message };
  }
});
// ----------------------------------------------------------------
// history:clear – czyści historię, zwraca pustą tablicę
// ----------------------------------------------------------------
ipcMain.handle("history:clear", async () => {
  try {
    const empty = clearHistory();
    return { ok: true, data: empty };
  } catch (err) {
    logError("history:clear failed", err);
    return { ok: false, error: err.message };
  }
});

// ----------------------------------------------------------------
// history:getRecent – zwraca ostatnie 100 wpisów (quick access)
// ----------------------------------------------------------------
ipcMain.handle("history:getRecent", async () => {
  try {
    const recent = getRecentHistory(100);
    return { ok: true, data: recent };
  } catch (err) {
    logError("history:getRecent failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// END OF FILE
// =============================================================================