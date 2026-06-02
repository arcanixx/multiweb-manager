// =============================================================================
// FILE: clipboardStore.js
// PATH: src/core/clipboardStore.js
// VERSION: 0.0.3
// PURPOSE: Historia schowka systemowego – przechowuje ostatnie N wpisów.
// FUNCTIONS: addClipboardEntry, getClipboardHistory, clearClipboardHistory
// DEPENDS ON: electron, config.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { clipboard } from "electron";
import { LIMITS } from "../../config.js";
import { logInfo } from "../utils/logger.js";
// In-memory historia (nie jest persystowana między restartami)
let history = [];

// ─── addClipboardEntry() – Dodaje nowy wpis tekstowy na początek historii schowka, przycina ją do maksymalnego limitu z konfiguracji oraz aktualizuje zawartość systemowego schowka
export function addClipboardEntry(text) {
  if (!text || typeof text !== "string") return;
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
  logInfo("Clipboard updated", { length: text.length });
}

// ─── getClipboardHistory() – Pobiera i zwraca pełną listę in-memory wpisów z historii schowka (od najnowszych do najstarszych)
export function getClipboardHistory() {
  return history;
}

// ─── clearClipboardHistory() – Czyści całą zapisaną w pamięci (in-memory) listę historii schowka i zwraca true
export function clearClipboardHistory() {
  history = [];
  return true;
}

