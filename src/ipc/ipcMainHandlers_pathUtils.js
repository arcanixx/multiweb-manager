// =============================================================================
// FILE: ipcMainHandlers_pathUtils.js
// PATH: src/ipc/ipcMainHandlers_pathUtils.js
// VERSION: 0.0.3
// PURPOSE: IPC helpers dla operacji na ścieżkach (path.join, path.dirname)
// FUNCTIONS: ipc:path:join, ipc:path:dirname
// DEPENDS ON: electron, path, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from 'electron';
import path from 'path';
import { logError } from '../utils/logger.js';
ipcMain.handle('path:join', async (_, parts) => {
  try {
    const result = path.join(...parts);
    return { ok: true, data: result };
  } catch (err) {
    logError('path:join failed', err);
    return { ok: false, error: err.message };
  }
});
ipcMain.handle('path:dirname', async (_, filePath) => {
  try {
    return { ok: true, data: path.dirname(filePath) };
  } catch (err) {
    logError('path:dirname failed', err);
    return { ok: false, error: err.message };
  }
});
