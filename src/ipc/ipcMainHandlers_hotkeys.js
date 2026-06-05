// =============================================================================
// FILE: ipcMainHandlers_hotkeys.js
// PATH: src/ipc/ipcMainHandlers_hotkeys.js
// VERSION: 0.0.3
// PURPOSE: IPC handlery do zarządzania skrótami klawiszowymi – pobieranie, zapis, rejestracja
// FUNCTIONS: const:IPC_CHANNELS.HOTKEYS.GET_ALL, const:IPC_CHANNELS.HOTKEYS.SAVE, const:IPC_CHANNELS.HOTKEYS.REGISTER
// DEPENDS ON: electron, hotkeysManager.js, logger.js, ipcChannels.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from 'electron';
import { getAllHotkeys, saveHotkeys, registerHotkeysFromList } from '../engine/hotkeysManager.js';
import { logError } from '../utils/logger.js';
import { IPC_CHANNELS } from '../constants/ipcChannels.js';
// -----------------------------------------------------------------------------
// Pobierz wszystkie zdefiniowane skróty klawiszowe
// -----------------------------------------------------------------------------
ipcMain.handle(IPC_CHANNELS.HOTKEYS.GET_ALL, async () => {
  try {
    return { ok: true, data: getAllHotkeys() };
  } catch (err) {
    logError('ipc', 'hotkeys:getAll failed', err);
    return { ok: false, error: err.message };
  }
});
// Zapisz listę skrótów do store (nie rejestruje ich globalnie)
ipcMain.handle(IPC_CHANNELS.HOTKEYS.SAVE, async (_, payload) => {
  try {
    if (!payload || !Array.isArray(payload)) {
      throw new Error('HOTKEYS_MUST_BE_ARRAY');
    }
    const hotkeys = payload;
    saveHotkeys(hotkeys);
    return { ok: true };
  } catch (err) {
    logError('ipc', 'hotkeys:save failed', err);
    return { ok: false, error: err.message };
  }
});
// -----------------------------------------------------------------------------
// Zarejestruj skróty globalnie w systemie operacyjnym
// -----------------------------------------------------------------------------
ipcMain.handle(IPC_CHANNELS.HOTKEYS.REGISTER, async (_, hotkeys) => {
  try {
    if (!Array.isArray(hotkeys)) throw new Error('HOTKEYS_MUST_BE_ARRAY');
    registerHotkeysFromList(hotkeys);
    return { ok: true };
  } catch (err) {
    logError('ipc', 'hotkeys:register failed', err);
    return { ok: false, error: err.message };
  }
});