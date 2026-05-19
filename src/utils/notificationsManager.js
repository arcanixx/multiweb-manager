// =============================================================================
// FILE: notificationsManager.js
// PATH: src/utils/notificationsManager.js
// VERSION: 0.0.3
// PURPOSE: Toasty w UI + opcjonalne powiadomienia systemowe (renderer).
// FUNCTIONS: showToast, showSystemNotification
// DEPENDS ON: logger.js
// =============================================================================

import { logInfo } from "./logger.js";

let toastHandler = null;

export function registerToastHandler(fn) {
  toastHandler = fn;
}

export function showToast(type, message) {
  logInfo("toast", type, message);
  if (toastHandler) toastHandler(type, message);
}

export function showSystemNotification(title, body) {
  if (typeof Notification !== "undefined" && Notification.permission === "granted") {
    new Notification(title, { body });
  }
}
