// =============================================================================
// FILE: sleepTabsManager.js
// PATH: src/engine/sleepTabsManager.js
// VERSION: 0.0.3
// PURPOSE: Logika zarządzania stanem bezczynności WebView – obliczanie timeoutów i weryfikacja gotowości do uśpienia.
// FUNCTIONS: getSleepTimeoutMs, shouldSleepTab, markTabActive, getSleepPlaceholderState
// DEPENDS ON: config.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { DEFAULT_SETTINGS, isFeatureEnabled } from "../config.js";
import { logError, logDebug } from "../utils/logger.js";

// ─── getSleepTimeoutMs() – pobiera timeout usypiania z ustawień lub domyślny
//   @param {Object} settings – obiekt ustawień
//   @returns {number} – timeout w milisekundach
export function getSleepTimeoutMs(settings = {}) {
  try {
    if (!isFeatureEnabled('sleepTabs')) return 0;
    return settings?.sleepTabsTimeout ?? DEFAULT_SETTINGS.sleepTabsTimeout;
  } catch (err) {
    logError("engine", "sleepTabsManager.getSleepTimeoutMs failed", err.message);
    return DEFAULT_SETTINGS.sleepTabsTimeout;
  }
}

// ─── shouldSleepTab() – sprawdza czy zakładka powinna zostać uśpiona
//   @param {number} lastActiveAt – timestamp ostatniej aktywności
//   @param {Object} settings – obiekt ustawień
//   @param {boolean} sleeping – czy zakładka jest już uśpiona
//   @returns {boolean} – true jeśli zakładka powinna zostać uśpiona
export function shouldSleepTab(lastActiveAt, settings = {}, sleeping = false) {
  try {
    if (sleeping) return false;
    if (!isFeatureEnabled('sleepTabs')) return false;

    const now = Date.now();
    const lastActive = lastActiveAt || now;
    const idle = now - lastActive;
    const timeout = getSleepTimeoutMs(settings);

    return timeout > 0 && idle > timeout;
  } catch (err) {
    logError("engine", "sleepTabsManager.shouldSleepTab failed", err.message);
    return false;
  }
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
