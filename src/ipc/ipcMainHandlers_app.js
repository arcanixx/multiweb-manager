// =============================================================================
// FILE:       ipcMainHandlers_app.js
// PATH:       src/ipc/ipcMainHandlers_app.js
// VERSION:    0.0.3
// PURPOSE:    IPC handlery cyklu życia aplikacji – potwierdzenie zamknięcia.
// FUNCTIONS:  app:confirmQuit
// DEPENDS ON: electron, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain, app } from 'electron';
import { logInfo, logError } from '../utils/logger.js';

// ─── app:confirmQuit – potwierdza zamknięcie aplikacji po zgodzie użytkownika
//   Wywoływane przez useMainLayout po kliknięciu "Potwierdź" w ConfirmModal
//   Aliasy: 'confirm-quit' (legacy — do usunięcia po migracji preloadu)
ipcMain.handle('app:confirmQuit', async () => {
  try {
    logInfo('ipc', 'app:confirmQuit – zamykanie aplikacji');
    app.quit();
    return { ok: true };
  } catch (err) {
    logError('ipc', 'app:confirmQuit failed', err);
    return { ok: false, error: err.message };
  }
});

// Alias legacy — preload.cjs używa jeszcze 'confirm-quit'
ipcMain.handle('confirm-quit', async () => {
  try {
    logInfo('ipc', 'confirm-quit (legacy alias) – zamykanie aplikacji');
    app.quit();
    return { ok: true };
  } catch (err) {
    logError('ipc', 'confirm-quit (legacy alias) failed', err);
    return { ok: false, error: err.message };
  }
});
