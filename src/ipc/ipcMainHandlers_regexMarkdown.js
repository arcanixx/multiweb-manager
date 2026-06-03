// =============================================================================
// FILE: ipcMainHandlers_regexMarkdown.js
// PATH: src/ipc/ipcMainHandlers_regexMarkdown.js
// VERSION: 0.0.3
// PURPOSE: IPC handlers dla Regex Tester i Markdown Previewer
// FUNCTIONS: ipc:tools:regexTest, ipc:tools:markdownRender
// DEPENDS ON: electron, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from 'electron';
import { logError } from '../utils/logger.js';
ipcMain.handle('tools:regexTest', async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'object' || 
        !('pattern' in payload) || !('flags' in payload) || 
        !('text' in payload)) {
      throw new Error('INVALID_PAYLOAD');
    }
    const { pattern, flags, text } = payload;
    const regex = new RegExp(pattern, flags || '');
    const matches = [...text.matchAll(regex)];
    return { ok: true, data: matches };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});
ipcMain.handle('tools:markdownRender', async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'string') {
      throw new Error('INVALID_PAYLOAD');
    }
    const markdownText = payload;
    const { marked } = await import('marked');
    const html = marked(markdownText);
    return { ok: true, data: html };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});
ipcMain.handle('tools:markdownRender', async (_, markdownText) => {
  try {
    const { marked } = await import('marked');
    const html = marked(markdownText);
    return { ok: true, data: html };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});
