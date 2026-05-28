// =============================================================================
// FILE: ipcMainHandlers_fileSystem.js
// PATH: src/ipc/ipcMainHandlers_fileSystem.js
// VERSION: 0.0.3
// PURPOSE: IPC handlers do odczytu i zapisu plików (przez main process)
// FUNCTIONS: ipc:fs:readFile, ipc:fs:writeFile
// DEPENDS ON: electron, fs, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from 'electron';
import fs from 'fs';
import { logError } from '../utils/logger.js';
ipcMain.handle('fs:readFile', async (_, filePath) => {
  try {
    if (!fs.existsSync(filePath)) throw new Error('FILE_NOT_FOUND');
    const data = fs.readFileSync(filePath, 'utf8');
    return { ok: true, data };
  } catch (err) {
    logError('fs:readFile failed', err);
    return { ok: false, error: err.message };
  }
});
ipcMain.handle('fs:writeFile', async (_, { filePath, content }) => {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return { ok: true };
  } catch (err) {
    logError('fs:writeFile failed', err);
    return { ok: false, error: err.message };
  }
});
