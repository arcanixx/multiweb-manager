// =============================================================================
// FILE: sleepTabsManager.js
// PATH: src/engine/sleepTabsManager.js
// VERSION: 0.0.3
// PURPOSE: Logika usypiania nieaktywnych WebView (timeout z settings/config).
// FUNCTIONS: getSleepTimeoutMs, shouldSleepTab, markTabActive, getSleepPlaceholderState
// DEPENDS ON: config.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { DEFAULT_SETTINGS } from "../config.js";
import { logInfo, logError, logWarn } from "../utils/logger.js";
// ─── getSleepTimeoutMs() – pobiera timeout usypiania z ustawień lub domyślny
//   @param {Object} settings – obiekt ustawień
//   @returns {number} – timeout w milisekundach
export function getSleepTimeoutMs(settings = {}) {
  return settings.sleepTabsTimeout ?? DEFAULT_SETTINGS.sleepTabsTimeout;
}
// ─── shouldSleepTab() – sprawdza czy zakładka powinna zostać uśpiona
//   @param {number} lastActiveAt – timestamp ostatniej aktywności
//   @param {Object} settings – obiekt ustawień
//   @param {boolean} sleeping – czy zakładka jest już uśpiona
//   @returns {boolean} – true jeśli zakładka powinna zostać uśpiona
export function shouldSleepTab(lastActiveAt, settings = {}, sleeping = false) {
  if (sleeping) return false;
  const idle = Date.now() - (lastActiveAt || Date.now());
  return idle > getSleepTimeoutMs(settings);
}
// ─── markTabActive() – zwraca aktualny timestamp jako znak aktywności
//   @returns {number} – aktualny timestamp
export function markTabActive() {
  return Date.now();
}
// ─── getSleepPlaceholderState() – zwraca stan uśpionej zakładki
//   @returns {Object} – obiekt z flagą sleeping i pustym URL
export function getSleepPlaceholderState() {
  return { sleeping: true, url: "about:blank" };
}