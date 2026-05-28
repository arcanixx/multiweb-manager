// =============================================================================
// FILE: ipcMainHandlers_webview_screenshot.js
// PATH: src/ipc/ipcMainHandlers_webview_screenshot.js
// VERSION: 0.0.3
// PURPOSE: IPC handler dla screenshot WebView
// FUNCTIONS: ipc:webview:screenshot
// DEPENDS ON: electron, logger.js, config.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain, BrowserWindow } from 'electron';
import { logError } from '../utils/logger.js';
import { FEATURES } from '../../config.js';
function getWebContentsById(id) {
  try {
    return BrowserWindow.getAllWindows()
      .flatMap((win) => win.webContents.getAllWebContents())
      .find((wc) => wc.id === id);
  } catch {
    return null;
  }
}
ipcMain.handle('webview:screenshot', async (_, id) => {
  try {
    if (!FEATURES.screenshotWebView) throw new Error('FEATURE_DISABLED');
    const wc = getWebContentsById(id);
    if (!wc) throw new Error('WEBVIEW_NOT_FOUND');
    const image = await wc.capturePage();
    return { ok: true, data: image.toPNG() };
  } catch (err) {
    logError('webview:screenshot failed', err);
    return { ok: false, error: err.message };
  }
});
