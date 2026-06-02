// =============================================================================
// FILE: adBlocker.js
// PATH: src/engine/adBlocker.js
// VERSION: 0.0.3
// PURPOSE: Logika blokowania reklam (global + per profile)
// FUNCTIONS: isAdUrl, setGlobalAdBlocker, getGlobalAdBlocker, setProfileAdBlocker, getProfileAdBlocker, initAdBlocker
// DEPENDS ON: electron, config.js, logger.js, webviewRegistry.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { session } from 'electron';
import { isFeatureEnabled } from '../config.js';
import { logInfo, logDebug, logError, logWarn } from '../utils/logger.js';
import { webviewProfileMap } from './webviewRegistry.js';
let globalAdBlocker = true;
const profileAdBlockers = new Map();

// ─── isAdUrl() – sprawdza czy URL pasuje do wzorców reklam
//   @param {string} url – URL do sprawdzenia
//   @returns {boolean} – true jeśli URL jest reklamą
export function isAdUrl(url) {
  const patterns = [
    /doubleclick/i, /adservice/i, /googlesyndication/i,
    /googleadservices/i, /criteo/i, /outbrain/i, /taboola/i
  ];
  return patterns.some(p => p.test(url));
}

// ─── setGlobalAdBlocker() – ustawia globalny stan AdBlockera
//   @param {boolean} enabled – czy włączyć globalny adblocker
export function setGlobalAdBlocker(enabled) {
  globalAdBlocker = enabled;
  logDebug(`AdBlocker global set to: ${enabled}`);
}
/**
 * Zwraca globalny stan AdBlockera
 */
// ─── getGlobalAdBlocker() – zwraca globalny stan AdBlockera
//   @returns {boolean} – stan globalnego adblockera
export function getGlobalAdBlocker() {
  return globalAdBlocker;
}

// ─── setProfileAdBlocker() – ustawia stan AdBlockera dla konkretnego profilu
//   @param {string} profileId – ID profilu
//   @param {boolean} enabled – czy włączyć adblocker dla profilu
export function setProfileAdBlocker(profileId, enabled) {
  try {
    if (!profileId) throw new Error('setProfileAdBlocker: brak profileId');
    profileAdBlockers.set(profileId, enabled);
    logDebug(`AdBlocker for profile ${profileId} set to: ${enabled}`);
  } catch (err) {
    logError('setProfileAdBlocker failed', err);
    logWarn(`Nie można ustawić AdBlockera dla profilu ${profileId}`);
  }
}

// ─── getProfileAdBlocker() – zwraca stan AdBlockera dla profilu (lub globalny)
//   @param {string} profileId – ID profilu
//   @returns {boolean} – stan adblockera dla profilu
export function getProfileAdBlocker(profileId) {
  try {
    const value = profileAdBlockers.get(profileId);
    return value !== undefined ? value : globalAdBlocker;
  } catch (err) {
    logError('getProfileAdBlocker failed', err);
    return globalAdBlocker;
  }
}

// ─── initAdBlocker() – inicjalizuje AdBlockera (rejestruje onBeforeRequest)
export function initAdBlocker() {
  if (!isFeatureEnabled('adBlocker')) {
    logInfo('AdBlocker is disabled by feature flag.');
    return;
  }
  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    const profileId = webviewProfileMap.get(details.webContentsId);
    let shouldBlock = globalAdBlocker;
    if (profileId && profileAdBlockers.has(profileId)) {
      shouldBlock = profileAdBlockers.get(profileId);
    }
    if (shouldBlock && isAdUrl(details.url)) {
      logDebug(`AdBlocked: ${details.url} (profile: ${profileId || 'global'})`);
      return callback({ cancel: true });
    }
    callback({});
  });
  logDebug('AdBlocker initialized');
}