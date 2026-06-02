// =============================================================================
// FILE: ipcMainHandlers_webview_cache.js
// PATH: src/ipc/ipcMainHandlers_webview_cache.js
// VERSION: 0.0.3
// PURPOSE: IPC handler dla czyszczenia cache WebView
// FUNCTIONS: ipc:webview:clearCache
// DEPENDS ON: electron, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain, BrowserWindow } from 'electron';
import { logError } from '../utils/logger.js';

// ─── getWebContentsById() – Wyszukuje i zwraca obiekt WebContents powiązany z danym identyfikatorem liczbowym w obrębie wszystkich otwartych okien aplikacji
function getWebContentsById(id) {
  try {
    return BrowserWindow.getAllWindows()
      .flatMap((win) => win.webContents.getAllWebContents())
      .find((wc) => wc.id === id);
  } catch {
    return null;
  }
}
ipcMain.handle('webview:clearCache', async (_, id) => {
  try {
    const wc = getWebContentsById(id);
    if (!wc) throw new Error('WEBVIEW_NOT_FOUND');
    await wc.session.clearCache();
    return { ok: true };
  } catch (err) {
    logError('ipc', 'webview:clearCache failed', err);
    return { ok: false, error: err.message };
  }
});
