// =============================================================================
// FILE: ipcMainHandlers_openExternal.js
// PATH: src/ipc/ipcMainHandlers_openExternal.js
// VERSION: 0.0.3
// PURPOSE: IPC handler do otwierania URL w domyślnej przeglądarce systemowej
// FUNCTIONS: ipc:shell:openExternal
// DEPENDS ON: electron, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain, shell } from 'electron';
import { logError } from '../utils/logger.js';
ipcMain.handle('shell:openExternal', async (_, url) => {
  try {
    await shell.openExternal(url);
    return { ok: true };
  } catch (err) {
    logError('shell:openExternal failed', err);
    return { ok: false, error: err.message };
  }
});
