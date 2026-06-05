// =============================================================================
// FILE: ipcMainHandlers_svgToPng.js
// PATH: src/ipc/ipcMainHandlers_svgToPng.js
// VERSION: 0.0.3
// PURPOSE: IPC handler konwersji SVG → PNG przez sharp
// FUNCTIONS: ipc:tools:svgToPng
// DEPENDS ON: electron, fs, logger.js, sharpLoader.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from 'electron';
import fs from 'fs';
import { logError } from '../utils/logger.js';
import { loadSharp } from '../utils/sharpLoader.js';
import { IPC_CHANNELS } from '../constants/ipcChannels.js';
// ─── ipc:tools:svgToPng – konwertuje plik SVG na PNG o podanych wymiarach
//   Oczekuje: { svgPath, outputPath, width, height }
//   Zwraca: { ok: boolean, data?: string, error?: string }
ipcMain.handle('tools:svgToPng', async (_, payload) => { // legacy alias - no constant in IPC_CHANNELS
  try {
    if (!payload || typeof payload !== 'object' || !('svgPath' in payload) || !('outputPath' in payload) || !('width' in payload) || !('height' in payload)) {
      throw new Error('INVALID_PAYLOAD');
    }
    const { svgPath, outputPath, width, height } = payload;
    const sharp = await loadSharp();
    if (!sharp) return { ok: false, error: 'SHARP_MODULE_MISSING' };
    const svg = fs.readFileSync(svgPath, 'utf8');
    const png = await sharp(Buffer.from(svg)).resize(width, height).png().toBuffer();
    fs.writeFileSync(outputPath, png);
    return { ok: true, data: outputPath };
  } catch (err) {
    logError('ipc', 'tools:svgToPng failed', err);
    return { ok: false, error: err.message };
  }
});
