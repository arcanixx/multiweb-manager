// =============================================================================
// FILE: ipcMainHandlers_cookies.js
// PATH: src/ipc/ipcMainHandlers_cookies.js
// VERSION: 0.0.3
// PURPOSE: IPC handler do pobierania cookies (Cookie Grabber)
// FUNCTIONS: ipc:tools:getCookies
// DEPENDS ON: electron, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain, session } from 'electron';
import { logError } from '../utils/logger.js';
ipcMain.handle('tools:getCookies', async (_, partition) => {
  try {
    const ses = partition ? session.fromPartition(partition) : session.defaultSession;
    const cookies = await ses.cookies.get({});
    return { ok: true, data: cookies };
  } catch (err) {
    logError('tools:getCookies failed', err);
    return { ok: false, error: err.message };
  }
});
