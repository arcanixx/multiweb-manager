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
import { IPC_CHANNELS } from '../constants/ipcChannels.js';
// -----------------------------------------------------------------------------
// Włącz / wyłącz blokadę globalnie (dla wszystkich profili)
// -----------------------------------------------------------------------------
ipcMain.handle(IPC_CHANNELS.ADBLOCKER.SET_GLOBAL, (_, payload) => {
  try {
    if (!payload || typeof payload !== 'boolean') {
      throw new Error('INVALID_PAYLOAD');
    }
    const enabled = payload;
    setGlobalAdBlocker(enabled);
    return { ok: true };
  } catch (err) {
    logError('ipc', 'adblocker:setGlobal failed', err);
    return { ok: false, error: err.message };
  }
});
// Zwróć aktualny stan globalny blokady
ipcMain.handle(IPC_CHANNELS.ADBLOCKER.GET_GLOBAL, () => {
  try {
    return { ok: true, data: getGlobalAdBlocker() };
  } catch (err) {
    logError('ipc', 'adblocker:getGlobal failed', err);
    return { ok: false, error: err.message };
  }
});
// -----------------------------------------------------------------------------
// Włącz / wyłącz blokadę dla konkretnego profilu
// -----------------------------------------------------------------------------
ipcMain.handle(IPC_CHANNELS.ADBLOCKER.SET_FOR_PROFILE, (_, payload) => {
  try {
    if (!payload || typeof payload !== 'object' || 
        !('profileId' in payload) || !('enabled' in payload)) {
      throw new Error('INVALID_PAYLOAD');
    }
    const { profileId, enabled } = payload;
    setProfileAdBlocker(profileId, enabled);
    return { ok: true };
  } catch (err) {
    logError('ipc', 'adblocker:setForProfile failed', err);
    return { ok: false, error: err.message };
  }
});
// Zwróć stan blokady dla konkretnego profilu
ipcMain.handle(IPC_CHANNELS.ADBLOCKER.GET_FOR_PROFILE, (_, payload) => {
  try {
    if (!payload || typeof payload !== 'string') {
      throw new Error('INVALID_PAYLOAD');
    }
    const profileId = payload;
    return { ok: true, data: getProfileAdBlocker(profileId) };
  } catch (err) {
    logError('ipc', 'adblocker:getForProfile failed', err);
    return { ok: false, error: err.message };
  }
});