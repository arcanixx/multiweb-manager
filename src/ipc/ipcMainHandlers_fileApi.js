// =============================================================================
// FILE: ipcMainHandlers_fileApi.js
// PATH: src/ipc/ipcMainHandlers_fileApi.js
// VERSION: 0.0.3
// PURPOSE: IPC handlers dla File Previewer, Mini Postman i Clipboard
// FUNCTIONS: ipc:tools:filePreview, ipc:tools:apiRequest, ipc:tools:clipboard:get
// DEPENDS ON: electron, fs, path, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain, clipboard } from 'electron';
import fs from 'fs';
import path from 'path';
import { logError } from '../utils/logger.js';
ipcMain.handle('tools:filePreview', async (_, filePath) => {
  try {
    if (!fs.existsSync(filePath)) throw new Error('FILE_NOT_FOUND');
    const ext = path.extname(filePath).toLowerCase();
    const buffer = fs.readFileSync(filePath);
    return { ok: true, data: { ext, base64: buffer.toString('base64') } };
  } catch (err) {
    logError('tools:filePreview failed', err);
    return { ok: false, error: err.message };
  }
});
ipcMain.handle('tools:apiRequest', async (_, { url, method, headers, body }) => {
  try {
    const res = await fetch(url, {
      method,
      headers,
      body: method !== 'GET' && method !== 'HEAD' ? body : undefined
    });
    const text = await res.text();
    return {
      ok: true,
      data: {
        status: res.status,
        headers: Object.fromEntries(res.headers.entries()),
        body: text
      }
    };
  } catch (err) {
    logError('tools:apiRequest failed', err);
    return { ok: false, error: err.message };
  }
});
ipcMain.handle('tools:clipboard:get', async () => {
  try {
    const text = clipboard.readText();
    const img = clipboard.readImage();
    return {
      ok: true,
      data: {
        text,
        image: img.isEmpty() ? null : img.toPNG().toString('base64')
      }
    };
  } catch (err) {
    logError('tools:clipboard:get failed', err);
    return { ok: false, error: err.message };
  }
});