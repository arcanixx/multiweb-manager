// =============================================================================
// FILE: ipcMainHandlers_imageSharp.js
// PATH: src/ipc/ipcMainHandlers_imageSharp.js
// VERSION: 0.0.3
// PURPOSE: IPC handlery dla operacji na obrazach (resize, convert, compress)
// FUNCTIONS: ipc:tools:image:resize, ipc:tools:image:convert, ipc:tools:image:compress
// DEPENDS ON: electron, logger.js, sharpLoader.js, ipcChannels.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from 'electron';
import { logError } from '../utils/logger.js';
import { loadSharp } from '../utils/sharpLoader.js';
import { IPC_CHANNELS } from '../constants/ipcChannels.js';
// ─── ipc:tools:image:resize – zmienia rozmiar obrazu
//   Oczekuje: { inputPath, width, height, outputPath }
//   Zwraca: { ok: boolean, data?: string, error?: string }
ipcMain.handle('tools:image:resize', async (_, payload) => { // legacy alias - no constant in IPC_CHANNELS
  try {
    if (!payload || typeof payload !== 'object' ||
        !('inputPath' in payload) || !('width' in payload) ||
        !('height' in payload) || !('outputPath' in payload)) {
      throw new Error('INVALID_PAYLOAD');
    }
    const { inputPath, width, height, outputPath } = payload;
    const sharp = await loadSharp();
    if (!sharp) return { ok: false, error: 'SHARP_MODULE_MISSING' };
    await sharp(inputPath).resize(width, height).toFile(outputPath);
    return { ok: true, data: outputPath };
  } catch (err) {
    logError('ipc', 'tools:image:resize failed', err);
    return { ok: false, error: err.message };
  }
});
// ─── ipc:tools:image:convert – konwertuje obraz do wskazanego formatu
//   Oczekuje: { inputPath, format, outputPath }
//   Zwraca: { ok: boolean, data?: string, error?: string }
ipcMain.handle('tools:image:convert', async (_, payload) => { // legacy alias - no constant in IPC_CHANNELS
  try {
    if (!payload || typeof payload !== 'object' ||
        !('inputPath' in payload) || !('format' in payload) ||
        !('outputPath' in payload)) {
      throw new Error('INVALID_PAYLOAD');
    }
    const { inputPath, format, outputPath } = payload;
    const sharp = await loadSharp();
    if (!sharp) return { ok: false, error: 'SHARP_MODULE_MISSING' };
    await sharp(inputPath).toFormat(format).toFile(outputPath);
    return { ok: true, data: outputPath };
  } catch (err) {
    logError('ipc', 'tools:image:convert failed', err);
    return { ok: false, error: err.message };
  }
});
// ─── ipc:tools:image:compress – kompresuje obraz JPEG do podanej jakości
//   Oczekuje: { inputPath, quality, outputPath }
//   Zwraca: { ok: boolean, data?: string, error?: string }
ipcMain.handle('tools:image:compress', async (_, payload) => { // legacy alias - no constant in IPC_CHANNELS
  try {
    if (!payload || typeof payload !== 'object' ||
        !('inputPath' in payload) || !('quality' in payload) ||
        !('outputPath' in payload)) {
      throw new Error('INVALID_PAYLOAD');
    }
    const { inputPath, quality, outputPath } = payload;
    const sharp = await loadSharp();
    if (!sharp) return { ok: false, error: 'SHARP_MODULE_MISSING' };
    await sharp(inputPath).jpeg({ quality }).toFile(outputPath);
    return { ok: true, data: outputPath };
  } catch (err) {
    logError('ipc', 'tools:image:compress failed', err);
    return { ok: false, error: err.message };
  }
});