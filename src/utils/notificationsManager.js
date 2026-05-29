// =============================================================================
// FILE: notificationsManager.js
// PATH: src/utils/notificationsManager.js
// VERSION: 0.0.3
// PURPOSE: Toasty w UI + opcjonalne powiadomienia systemowe (renderer).
// FUNCTIONS: registerToastHandler, showToast, showSystemNotification
// DEPENDS ON: logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logInfo, logWarn, logDebug } from "./logger.js";

// ─── toastHandler – referencja do handlera toastów z UI

// ─── registerToastHandler() – rejestruje funkcję obsługującą toast
//   @param {Function} fn – funkcja wyświetlająca toast

let toastHandler = null;

// ─── registerToastHandler() – rejestruje globalny handler toastów
//   @param {Function} fn – funkcja obsługująca toast (type, message)
//   @returns {void}
export function registerToastHandler(fn) {
  toastHandler = fn;
  logDebug("registerToastHandler: handler registered");
}

// ─── showToast() – wyświetla toast w UI i loguje
//   @param {string} type – typ toastu (success/error/warn/info)
//   @param {string} message – treść wiadomości
//   @returns {void}
export function showToast(type, message) {
  logInfo("showToast", { type, message });
  if (toastHandler) {
    toastHandler(type, message);
  } else {
    logWarn("showToast: no handler registered");
  }
}

// ─── showSystemNotification() – wyświetla powiadomienie systemowe
//   @param {string} title – tytuł powiadomienia
//   @param {string} body – treść powiadomienia
//   @returns {void}
export function showSystemNotification(title, body) {
  if (typeof Notification !== "undefined" && Notification.permission === "granted") {
    new Notification(title, { body });
    logDebug("showSystemNotification", { title });
  }
}
