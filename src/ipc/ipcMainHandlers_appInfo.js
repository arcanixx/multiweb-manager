// =============================================================================
// FILE: ipcMainHandlers_appInfo.js
// PATH: src/ipc/ipcMainHandlers_appInfo.js
// VERSION: 0.0.3
// PURPOSE: IPC handlery informacji o aplikacji – wersja, sprawdzanie aktualizacji, info diagnostyczne.
// FUNCTIONS: const:IPC_CHANNELS.APP_INFO.GET_INFO, const:IPC_CHANNELS.APP.GET_VERSION, const:IPC_CHANNELS.APP.CHECK_UPDATES
// DEPENDS ON: electron, logger.js, ipcChannels.js, updateService.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain, app } from 'electron';
import { logError, logInfo } from '../utils/logger.js';
import { IPC_CHANNELS } from '../constants/ipcChannels.js';
import { checkForUpdates } from '../engine/updateService.js';

// ─── app:getInfo – pełne informacje diagnostyczne o aplikacji
ipcMain.handle(IPC_CHANNELS.APP_INFO.GET_INFO, async () => {
  try {
    return {
      ok: true,
      data: {
        name:       app.getName(),
        version:    app.getVersion(),
        path:       app.getAppPath(),
        isPackaged: app.isPackaged,
      },
    };
  } catch (err) {
    logError('ipc', 'app:getInfo failed', err);
    return { ok: false, error: err.message };
  }
});

// ─── app:getVersion – zwraca samą wersję aplikacji (używane przez UpdateChecker)
ipcMain.handle(IPC_CHANNELS.APP.GET_VERSION, async () => {
  try {
    const version = app.getVersion();
    logInfo('ipc', 'app:getVersion', version);
    return { ok: true, data: version };
  } catch (err) {
    logError('ipc', 'app:getVersion failed', err);
    return { ok: false, error: err.message };
  }
});

// ─── app:checkUpdates – sprawdza dostępność aktualizacji przez updateService
ipcMain.handle(IPC_CHANNELS.APP.CHECK_UPDATES, async () => {
  try {
    const result = await checkForUpdates();
    logInfo('ipc', 'app:checkUpdates result', result);
    return { ok: true, data: result };
  } catch (err) {
    logError('ipc', 'app:checkUpdates failed', err);
    return { ok: false, error: err.message };
  }
});