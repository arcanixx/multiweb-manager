// =============================================================================
// FILE: ipcMainHandlers_cookies.js
// PATH: src/ipc/ipcMainHandlers_cookies.js
// VERSION: 0.0.3
// PURPOSE: IPC handler do pobierania cookies (Cookie Grabber)
// FUNCTIONS: const:IPC_CHANNELS.COOKIES.GET_ALL
// DEPENDS ON: electron, logger.js, ipcChannels.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain, session } from 'electron';
import { logError } from '../utils/logger.js';
import { IPC_CHANNELS } from '../constants/ipcChannels.js';
ipcMain.handle(IPC_CHANNELS.COOKIES.GET_ALL, async (_, payload) => {
  try {
    // TODO: Add rate limiting for cookies (e.g., using timestamp map)
    if (!payload || typeof payload !== 'object' || !('partition' in payload)) {
      throw new Error('INVALID_PAYLOAD');
    }
    const { partition } = payload;
    const ses = partition ? session.fromPartition(partition) : session.defaultSession;
    const cookies = await ses.cookies.get({});
    return { ok: true, data: cookies };
  } catch (err) {
    logError('ipc', 'tools:getCookies failed', err);
    return { ok: false, error: err.message };
  }
});