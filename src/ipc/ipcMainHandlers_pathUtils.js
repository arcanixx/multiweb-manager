// =============================================================================
// FILE: ipcMainHandlers_pathUtils.js
// PATH: src/ipc/ipcMainHandlers_pathUtils.js
// VERSION: 0.0.3
// PURPOSE: IPC helpers dla operacji na ścieżkach (path.join, path.dirname)
// FUNCTIONS: ipc:path:join, ipc:path:dirname
// DEPENDS ON: electron, path, logger.js, ipcChannels.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from 'electron';
import path from 'path';
import { logError } from '../utils/logger.js';
import { IPC_CHANNELS } from '../constants/ipcChannels.js';
ipcMain.handle('path:join', async (_, payload) => { // legacy alias - no constant in IPC_CHANNELS
  try {
    if (!payload || !Array.isArray(payload)) {
      throw new Error('INVALID_PAYLOAD');
    }
    const parts = payload;
    const result = path.join(...parts);
    return { ok: true, data: result };
  } catch (err) {
    logError('ipc', 'path:join failed', err);
    return { ok: false, error: err.message };
  }
});
ipcMain.handle('path:dirname', async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'string') {
      throw new Error('INVALID_PAYLOAD');
    }
    const filePath = payload;
    return { ok: true, data: path.dirname(filePath) };
  } catch (err) {
    logError('ipc', 'path:dirname failed', err);
    return { ok: false, error: err.message };
  }
});