// =============================================================================
// FILE: sleepTabsManager.js
// PATH: src/engine/sleepTabsManager.js
// VERSION: 0.0.3
// PURPOSE: Logika usypiania nieaktywnych WebView (timeout z settings/config).
// FUNCTIONS: getSleepTimeoutMs, shouldSleepTab, markTabActive, getSleepPlaceholderState
// DEPENDS ON: config.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { DEFAULT_SETTINGS } from "../config.js";
export function getSleepTimeoutMs(settings = {}) {
  return settings.sleepTabsTimeout ?? DEFAULT_SETTINGS.sleepTabsTimeout;
}
export function shouldSleepTab(lastActiveAt, settings = {}, sleeping = false) {
  if (sleeping) return false;
  const idle = Date.now() - (lastActiveAt || Date.now());
  return idle > getSleepTimeoutMs(settings);
}
export function markTabActive() {
  return Date.now();
}
export function getSleepPlaceholderState() {
  return { sleeping: true, url: "about:blank" };
}
