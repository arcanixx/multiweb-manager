// =============================================================================
// FILE: ipcMainHandlers_dialogs.js
// PATH: src/ipc/ipcMainHandlers_dialogs.js
// VERSION: 0.0.3
// PURPOSE: IPC handlers dla natywnych okien dialogowych (open/save)
// FUNCTIONS: const:IPC_CHANNELS.DIALOGS.OPEN_FILE, const:IPC_CHANNELS.DIALOGS.SAVE_FILE
// DEPENDS ON: electron, logger.js, ipcChannels.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain, dialog } from 'electron';
import { logError } from '../utils/logger.js';
import { IPC_CHANNELS } from '../constants/ipcChannels.js';
ipcMain.handle(IPC_CHANNELS.DIALOGS.OPEN_FILE, async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'object') {
      throw new Error('INVALID_PAYLOAD');
    }
    const options = payload;
    const result = await dialog.showOpenDialog(options || {});
    return { ok: true, data: result };
  } catch (err) {
    logError('ipc', 'dialog:openFile failed', err);
    return { ok: false, error: err.message };
  }
});
ipcMain.handle(IPC_CHANNELS.DIALOGS.SAVE_FILE, async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'object') {
      throw new Error('INVALID_PAYLOAD');
    }
    const options = payload;
    const result = await dialog.showSaveDialog(options || {});
    return { ok: true, data: result };
  } catch (err) {
    logError('ipc', 'dialog:saveFile failed', err);
    return { ok: false, error: err.message };
  }
});