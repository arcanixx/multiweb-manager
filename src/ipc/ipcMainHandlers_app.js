// =============================================================================
// FILE: ipcMainHandlers_app.js
// PATH: src/ipc/ipcMainHandlers_app.js
// VERSION: 0.0.3
// PURPOSE: IPC handlery cyklu życia aplikacji – potwierdzenie zamknięcia.
// FUNCTIONS: ipc:app:confirmQuit
// DEPENDS ON: electron, logger.js, ipcChannels.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain, app } from 'electron';
import { logInfo, logError } from '../utils/logger.js';
import { IPC_CHANNELS } from '../constants/ipcChannels.js';

// ─── app:confirmQuit – potwierdza zamknięcie aplikacji po zgodzie użytkownika
//   Wywoływane przez useMainLayout po kliknięciu "Potwierdź" w ConfirmModal
ipcMain.handle(IPC_CHANNELS.APP.CONFIRM_QUIT, async () => {
  try {
    logInfo('ipc', 'app:confirmQuit – zamykanie aplikacji');
    app.quit();
    return { ok: true };
  } catch (err) {
    logError('ipc', 'app:confirmQuit failed', err);
    return { ok: false, error: err.message };
  }
});