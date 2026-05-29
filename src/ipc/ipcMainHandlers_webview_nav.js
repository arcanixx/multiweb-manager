// =============================================================================
// FILE: ipcMainHandlers_webview_nav.js
// PATH: src/ipc/ipcMainHandlers_webview_nav.js
// VERSION: 0.0.3
// PURPOSE: IPC handlers dla nawigacji WebView. webview:navigate waliduje URL przez isSafeUrl() przed loadURL() — blokuje javascript:, data:, file: itp.
// FUNCTIONS: ipc:webview:navigate, ipc:webview:reload, ipc:webview:goBack, ipc:webview:goForward, ipc:webview:getURL
// DEPENDS ON: electron, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain, BrowserWindow } from 'electron';
import { logError } from '../utils/logger.js';
import { isSafeUrl } from '../utils/urlUtils.js';
function getWebContentsById(id) {
  try {
    return BrowserWindow.getAllWindows()
      .flatMap((win) => win.webContents.getAllWebContents())
      .find((wc) => wc.id === id);
  } catch {
    return null;
  }
}
ipcMain.handle('webview:navigate', async (_, { id, url }) => {
  try {
    if (!id) throw new Error('WEBVIEW_ID_REQUIRED');
    if (!url || typeof url !== 'string') throw new Error('WEBVIEW_URL_REQUIRED');
    if (!isSafeUrl(url)) throw new Error('WEBVIEW_URL_BLOCKED_UNSAFE_SCHEME');
    const wc = getWebContentsById(id);
    if (!wc) throw new Error('WEBVIEW_NOT_FOUND');
    await wc.loadURL(url);
    return { ok: true };
  } catch (err) {
    logError('webview:navigate failed', err);
    return { ok: false, error: err.message };
  }
});
ipcMain.handle('webview:reload', async (_, id) => {
  try {
    const wc = getWebContentsById(id);
    if (!wc) throw new Error('WEBVIEW_NOT_FOUND');
    wc.reload();
    return { ok: true };
  } catch (err) {
    logError('webview:reload failed', err);
    return { ok: false, error: err.message };
  }
});
ipcMain.handle('webview:goBack', async (_, id) => {
  try {
    const wc = getWebContentsById(id);
    if (!wc) throw new Error('WEBVIEW_NOT_FOUND');
    if (wc.canGoBack()) wc.goBack();
    return { ok: true };
  } catch (err) {
    logError('webview:goBack failed', err);
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('webview:goForward', async (_, id) => {
  try {
    const wc = getWebContentsById(id);
    if (!wc) throw new Error('WEBVIEW_NOT_FOUND');
    if (wc.canGoForward()) wc.goForward();
    return { ok: true };
  } catch (err) {
    logError('webview:goForward failed', err);
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('webview:getURL', async (_, id) => {
  try {
    const wc = getWebContentsById(id);
    if (!wc) throw new Error('WEBVIEW_NOT_FOUND');
    return { ok: true, data: wc.getURL() };
  } catch (err) {
    logError('webview:getURL failed', err);
    return { ok: false, error: err.message };
  }
});