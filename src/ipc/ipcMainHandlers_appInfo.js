// =============================================================================
// FILE: ipcMainHandlers_appInfo.js
// PATH: src/ipc/ipcMainHandlers_appInfo.js
// VERSION: 0.0.3
// PURPOSE: IPC handler do pobierania informacji o aplikacji
// FUNCTIONS: ipc:app:getInfo
// DEPENDS ON: electron, logger.js, ipcChannels.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain, app } from 'electron';
import { logError } from '../utils/logger.js';
import { IPC_CHANNELS } from '../constants/ipcChannels.js';
ipcMain.handle('app:getInfo', async () => { // legacy alias
  try {
    return {
      ok: true,
      data: {
        name:       app.getName(),
        version:    app.getVersion(),
        path:       app.getAppPath(),
        isPackaged: app.isPackaged
      }
    };
  } catch (err) {
    logError('ipc', 'app:getInfo failed', err);
    return { ok: false, error: err.message };
  }
});