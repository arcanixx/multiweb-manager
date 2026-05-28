// =============================================================================
// FILE: ipcMainHandlers_adBlocker.js
// PATH: src/ipc/ipcMainHandlers_adBlocker.js
// VERSION: 0.0.3
// PURPOSE: IPC handlery do zarządzania blokerem reklam – globalnie i per profil
// FUNCTIONS: ipc:adblocker:setGlobal, ipc:adblocker:getGlobal, ipc:adblocker:setForProfile, ipc:adblocker:getForProfile
// DEPENDS ON: electron, adBlocker.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from 'electron';
import { setGlobalAdBlocker, getGlobalAdBlocker, setProfileAdBlocker, getProfileAdBlocker } from '../engine/adBlocker.js';
import { logError } from '../utils/logger.js';
// -----------------------------------------------------------------------------
// Włącz / wyłącz blokadę globalnie (dla wszystkich profili)
// -----------------------------------------------------------------------------
ipcMain.handle('adblocker:setGlobal', (_, enabled) => {
  try {
    setGlobalAdBlocker(enabled);
    return { ok: true };
  } catch (err) {
    logError('adblocker:setGlobal failed', err);
    return { ok: false, error: err.message };
  }
});
// Zwróć aktualny stan globalny blokady
ipcMain.handle('adblocker:getGlobal', () => {
  try {
    return { ok: true, data: getGlobalAdBlocker() };
  } catch (err) {
    logError('adblocker:getGlobal failed', err);
    return { ok: false, error: err.message };
  }
});
// -----------------------------------------------------------------------------
// Włącz / wyłącz blokadę dla konkretnego profilu
// -----------------------------------------------------------------------------
ipcMain.handle('adblocker:setForProfile', (_, profileId, enabled) => {
  try {
    setProfileAdBlocker(profileId, enabled);
    return { ok: true };
  } catch (err) {
    logError('adblocker:setForProfile failed', err);
    return { ok: false, error: err.message };
  }
});
// Zwróć stan blokady dla konkretnego profilu
ipcMain.handle('adblocker:getForProfile', (_, profileId) => {
  try {
    return { ok: true, data: getProfileAdBlocker(profileId) };
  } catch (err) {
    logError('adblocker:getForProfile failed', err);
    return { ok: false, error: err.message };
  }
});