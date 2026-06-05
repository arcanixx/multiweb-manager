// =============================================================================
// FILE: ipcMainHandlers_files.js
// PATH: src/ipc/ipcMainHandlers_files.js
// VERSION: 0.0.3
// PURPOSE: IPC handlery zapisu plików – tekst i dane binarne przez dialog systemowy.
// FUNCTIONS: ipc:files:saveText, ipc:save-text-to-file, ipc:files:saveBinary, ipc:save-file
// DEPENDS ON: electron, fs, path, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain, dialog } from 'electron';
import fs from 'fs';
import path from 'path';
import { logInfo, logError } from '../utils/logger.js';
import { IPC_CHANNELS } from '../constants/ipcChannels.js';

// ─── files:saveText – otwiera dialog zapisu i zapisuje tekst do pliku
//   @param {string} content – treść do zapisania
//   @param {string} name    – sugerowana nazwa pliku
//   @param {string} folder  – sugerowany katalog (opcjonalny)
//   Alias: 'save-text-to-file' (legacy — do usunięcia po migracji preloadu)
ipcMain.handle(IPC_CHANNELS.FILES.SAVE_TEXT, async (_, content, name, folder) => {
  try {
    const dialogOptions = {
      defaultPath: folder ? path.join(folder, name || 'plik.txt') : (name || 'plik.txt'),
      filters: [{ name: 'Pliki tekstowe', extensions: ['txt', 'md', 'json', 'log'] }, { name: 'Wszystkie', extensions: ['*'] }]
    };
    const { canceled, filePath } = await dialog.showSaveDialog(dialogOptions);
    if (canceled || !filePath) return { ok: false, error: 'CANCELLED' };
    fs.writeFileSync(filePath, content, 'utf8');
    logInfo('ipc', 'files:saveText success', filePath);
    return { ok: true, data: { filePath } };
  } catch (err) {
    logError('ipc', 'files:saveText failed', err);
    return { ok: false, error: err.message };
  }
});

// Alias legacy
ipcMain.handle('save-text-to-file', async (_, content, name, folder) => { // legacy alias
  try {
    const dialogOptions = {
      defaultPath: folder ? path.join(folder, name || 'plik.txt') : (name || 'plik.txt'),
      filters: [{ name: 'Pliki tekstowe', extensions: ['txt', 'md', 'json', 'log'] }, { name: 'Wszystkie', extensions: ['*'] }]
    };
    const { canceled, filePath } = await dialog.showSaveDialog(dialogOptions);
    if (canceled || !filePath) return { ok: false, error: 'CANCELLED' };
    fs.writeFileSync(filePath, content, 'utf8');
    logInfo('ipc', 'save-text-to-file (legacy alias) success', filePath);
    return { ok: true, data: { filePath } };
  } catch (err) {
    logError('ipc', 'save-text-to-file (legacy alias) failed', err);
    return { ok: false, error: err.message };
  }
});

// ─── files:saveBinary – zapisuje dane binarne (Buffer/Uint8Array) do pliku przez dialog
//   @param {Object} payload – { data: Buffer|Uint8Array, name?: string, folder?: string }
//   Alias: 'save-file' (legacy — do usunięcia po migracji preloadu)
ipcMain.handle(IPC_CHANNELS.FILES.SAVE_BINARY, async (_, payload) => {
  try {
    if (!payload || !payload.data) return { ok: false, error: 'INVALID_PAYLOAD' };
    const dialogOptions = {
      defaultPath: payload.folder
        ? path.join(payload.folder, payload.name || 'plik')
        : (payload.name || 'plik'),
      filters: [{ name: 'Wszystkie', extensions: ['*'] }]
    };
    const { canceled, filePath } = await dialog.showSaveDialog(dialogOptions);
    if (canceled || !filePath) return { ok: false, error: 'CANCELLED' };
    fs.writeFileSync(filePath, Buffer.from(payload.data));
    logInfo('ipc', 'files:saveBinary success', filePath);
    return { ok: true, data: { filePath } };
  } catch (err) {
    logError('ipc', 'files:saveBinary failed', err);
    return { ok: false, error: err.message };
  }
});

// Alias legacy
ipcMain.handle('save-file', async (_, payload) => { // legacy alias
  try {
    if (!payload || !payload.data) return { ok: false, error: 'INVALID_PAYLOAD' };
    const dialogOptions = {
      defaultPath: payload.folder
        ? path.join(payload.folder, payload.name || 'plik')
        : (payload.name || 'plik'),
      filters: [{ name: 'Wszystkie', extensions: ['*'] }]
    };
    const { canceled, filePath } = await dialog.showSaveDialog(dialogOptions);
    if (canceled || !filePath) return { ok: false, error: 'CANCELLED' };
    fs.writeFileSync(filePath, Buffer.from(payload.data));
    logInfo('ipc', 'save-file (legacy alias) success', filePath);
    return { ok: true, data: { filePath } };
  } catch (err) {
    logError('ipc', 'save-file (legacy alias) failed', err);
    return { ok: false, error: err.message };
  }
});