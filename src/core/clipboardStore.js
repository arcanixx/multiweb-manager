// =============================================================================
// FILE: clipboardStore.js
// PATH: src/core/clipboardStore.js
// VERSION: 0.0.3
// PURPOSE: Zarządzanie historią schowka systemowego – dodawanie, pobieranie i czyszczenie wpisów tekstowych.
// FUNCTIONS: addClipboardEntry, getClipboardHistory, clearClipboardHistory
// DEPENDS ON: electron, config.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { clipboard } from "electron";
import { LIMITS } from "../../config.js";
import { logInfo, logError } from "../utils/logger.js";
// In-memory historia (nie jest persystowana między restartami)
let history = [];

// ─── addClipboardEntry() – Dodaje nowy wpis tekstowy na początek historii schowka, przycina ją do maksymalnego limitu z konfiguracji oraz aktualizuje zawartość systemowego schowka
export function addClipboardEntry(text) {
  if (!text || typeof text !== "string") return;
  try {
    history.unshift({
      id:        Date.now(),
      text,
      timestamp: new Date().toISOString()
    });
    // Przycinaj do limitu (FIFO)
    if (history.length > LIMITS.maxClipboardItems) {
      history = history.slice(0, LIMITS.maxClipboardItems);
    }
    clipboard.writeText(text);
    logInfo("store", "clipboardStore.addClipboardEntry success", { length: text.length });
  } catch (err) {
    logError("store", "clipboardStore.addClipboardEntry failed", err.message);
  }
}

// ─── getClipboardHistory() – Pobiera i zwraca pełną listę in-memory wpisów z historii schowka (od najnowszych do najstarszych)
export function getClipboardHistory() {
  try {
    return history;
  } catch (err) {
    logError("store", "clipboardStore.getClipboardHistory failed", err.message);
    return [];
  }
}

// ─── clearClipboardHistory() – Czyści całą zapisaną w pamięci (in-memory) listę historii schowka i zwraca true
export function clearClipboardHistory() {
  try {
    history = [];
    logInfo("store", "clipboardStore.clearClipboardHistory success");
    return true;
  } catch (err) {
    logError("store", "clipboardStore.clearClipboardHistory failed", err.message);
    return false;
  }
}
