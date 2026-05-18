// =============================================================================
// FILE: clipboardStore.js
// PATH: src/core/clipboardStore.js
// VERSION: 0.0.3
// PURPOSE: Historia schowka (ostatnie 5 elementów)
//          - integracja z Notepad.jsx
//          - modal historii schowka
// =============================================================================

import { clipboard } from "electron";
import { CONFIG } from "../config.js";
import { logInfo } from "../utils/logger.js";

// ---------------------------------------------------------------------------
// Stan wewnętrzny – trzymany w pamięci przez czas życia procesu
// ---------------------------------------------------------------------------

let history = [];

// ---------------------------------------------------------------------------
// Publiczne API
// ---------------------------------------------------------------------------

/**
 * Dodaje nowy wpis do historii schowka i zapisuje tekst do systemowego clipboard.
 * Automatycznie przycina listę do CONFIG.maxClipboardHistory wpisów.
 */
export function addClipboardEntry(text) {
  if (!text || typeof text !== "string") return;

  history.unshift({
    id: Date.now(),
    text,
    timestamp: new Date().toISOString()
  });

  if (history.length > CONFIG.maxClipboardHistory) {
    history = history.slice(0, CONFIG.maxClipboardHistory);
  }

  clipboard.writeText(text);
  logInfo("Clipboard updated", text);
}

/** Zwraca aktualną historię schowka (max CONFIG.maxClipboardHistory wpisów). */
export function getClipboardHistory() {
  return history;
}

/** Czyści całą historię schowka. */
export function clearClipboardHistory() {
  history = [];
  logInfo("Clipboard history cleared");
  return true;
}

// =============================================================================
// END OF FILE
// =============================================================================
