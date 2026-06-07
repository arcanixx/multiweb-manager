// =============================================================================
// FILE: notificationsManager.js
// PATH: src/utils/notificationsManager.js
// VERSION: 0.0.3
// PURPOSE: Fasada globalnego systemu powiadomień — dispatchuje toasty UI przez CustomEvent do ToastContainer oraz wywołuje systemowe powiadomienia OS przez IPC. Nie zarządza stanem React.
// FUNCTIONS: showToast, showSystemNotification
// DEPENDS ON: logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logInfo, logWarn, logDebug } from "./logger.js";

// ─── KANAŁ KOMUNIKACJI Z ToastContainer ─────────────────────────────────────
// CustomEvent zamiast callback'ów — ToastContainer subskrybuje się sam.
// Brak registerToastHandler(), brak globalnego stanu, łatwy do testowania.
const TOAST_EVENT = "mwm:toast";

// ─── showToast() – dispatchuje CustomEvent z danymi toastu do ToastContainer
//   @param {string} type    – 'success' | 'error' | 'warning' | 'info'
//   @param {string} message – treść wiadomości
//   @returns {void}
export function showToast(type, message) {
  logInfo("ui", "showToast", { type, message });
  const event = new CustomEvent(TOAST_EVENT, {
    detail: {
      type,
      message,
      id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    },
  });
  window.dispatchEvent(event);
}

// ─── showSystemNotification() – natywne powiadomienie OS przez IPC
//   Działa nawet gdy okno jest zminimalizowane/ukryte (proces główny Electrona).
//   @param {string} title – tytuł powiadomienia
//   @param {string} body  – treść powiadomienia
//   @returns {void}
export function showSystemNotification(title, body) {
  logDebug("ui", "showSystemNotification", { title });
  if (window.electronAPI?.invoke) {
    window.electronAPI
      .invoke("notifications:showSystem", { title, body })
      .catch((err) =>
        logWarn("ui", "showSystemNotification: IPC failed", err?.message)
      );
  } else {
    logWarn("ui", "showSystemNotification: electronAPI unavailable");
  }
}