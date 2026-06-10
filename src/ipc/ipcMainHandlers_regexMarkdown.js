// =============================================================================
// FILE: ipcMainHandlers_regexMarkdown.js
// PATH: src/ipc/ipcMainHandlers_regexMarkdown.js
// VERSION: 0.0.3
// PURPOSE: IPC handlers dla Regex Tester i Markdown Previewer
// FUNCTIONS: const:IPC_CHANNELS.TOOLS.REGEX_TEST, const:IPC_CHANNELS.TOOLS.MARKDOWN_RENDER
// DEPENDS ON: electron, logger.js, ipcChannels.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from 'electron';
import { logError } from '../utils/logger.js';
import { IPC_CHANNELS } from '../constants/ipcChannels.js';

// ─── MARKED_OPTIONS – opcje bezpieczeństwa dla marked (spójne z markdownRenderer.js)
// html: false – blokuje surowy HTML w treści markdown (ochrona przed XSS)
const MARKED_OPTIONS = {
  html:   false, // BEZPIECZEŃSTWO: blokuje <script>, <iframe> itp. w markdown
  breaks: true,  // \n → <br>
  gfm:    true,  // GitHub Flavored Markdown
};

// ─── tools:regexTest – testuje wyrażenie regularne na podanym tekście
//   payload: { pattern: string, flags: string, text: string }
ipcMain.handle(IPC_CHANNELS.TOOLS.REGEX_TEST, async (_, payload) => {
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

// ─── tools:markdownRender – konwertuje markdown na HTML po stronie main process
//   payload: string (tekst markdown)
//   Używa tych samych MARKED_OPTIONS co markdownRenderer.js (html: false)
ipcMain.handle(IPC_CHANNELS.TOOLS.MARKDOWN_RENDER, async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'string') {
      throw new Error('INVALID_PAYLOAD');
    }
    const { marked } = await import('marked');
    const html = marked(payload, MARKED_OPTIONS);
    return { ok: true, data: html };
  } catch (err) {
    logError('ipc', 'tools:markdownRender failed', err.message);
    return { ok: false, error: err.message };
  }
});
