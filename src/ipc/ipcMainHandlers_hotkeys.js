// =============================================================================
// FILE: ipcMainHandlers_hotkeys.js
// PATH: src/ipc/ipcMainHandlers_hotkeys.js
// VERSION: 0.0.3
// PURPOSE: IPC handlery do zarządzania skrótami klawiszowymi – pobieranie, zapis, rejestracja
// FUNCTIONS: ipc:hotkeys:getAll, ipc:hotkeys:save, ipc:hotkeys:register
// DEPENDS ON: electron, hotkeysManager.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from 'electron';
import { getAllHotkeys, saveHotkeys, registerHotkeysFromList } from '../engine/hotkeysManager.js';
import { logError } from '../utils/logger.js';
// -----------------------------------------------------------------------------
// Pobierz wszystkie zdefiniowane skróty klawiszowe
// -----------------------------------------------------------------------------
ipcMain.handle('hotkeys:getAll', async () => {
  try {
    return { ok: true, data: getAllHotkeys() };
  } catch (err) {
    logError('hotkeys:getAll failed', err);
    return { ok: false, error: err.message };
  }
});
// Zapisz listę skrótów do store (nie rejestruje ich globalnie)
ipcMain.handle('hotkeys:save', async (_, hotkeys) => {
  try {
    if (!Array.isArray(hotkeys)) throw new Error('HOTKEYS_MUST_BE_ARRAY');
    saveHotkeys(hotkeys);
    return { ok: true };
  } catch (err) {
    logError('hotkeys:save failed', err);
    return { ok: false, error: err.message };
  }
});
// -----------------------------------------------------------------------------
// Zarejestruj skróty globalnie w systemie operacyjnym
// -----------------------------------------------------------------------------
ipcMain.handle('hotkeys:register', async (_, hotkeys) => {
  try {
    if (!Array.isArray(hotkeys)) throw new Error('HOTKEYS_MUST_BE_ARRAY');
    registerHotkeysFromList(hotkeys);
    return { ok: true };
  } catch (err) {
    logError('hotkeys:register failed', err);
    return { ok: false, error: err.message };
  }
});
