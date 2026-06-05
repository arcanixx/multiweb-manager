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
import { IPC_CHANNELS } from '../constants/ipcChannels.js';
ipcMain.handle(IPC_CHANNELS.SHELL.OPEN_EXTERNAL, async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'string') {
      throw new Error('INVALID_PAYLOAD');
    }
    const url = payload;
    await shell.openExternal(url);
    return { ok: true };
  } catch (err) {
    logError('ipc', 'shell:openExternal failed', err);
    return { ok: false, error: err.message };
  }
});
