// =============================================================================
// FILE: ipcMainHandlers_webview_controls.js
// PATH: src/ipc/ipcMainHandlers_webview_controls.js
// VERSION: 0.0.3
// PURPOSE: IPC handlers dla User Agent, Single App Mode, Resource Monitor, Sleep Tabs. Używa ESM import path/url zamiast require() (ES module context).
// FUNCTIONS: ipc:webview:setUserAgent, ipc:webview:openInWindow, ipc:webview:getUsage, ipc:webview:sleep, ipc:webview:wake
// DEPENDS ON: electron, logger.js, config.js, path
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain, BrowserWindow } from 'electron';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { logError } from '../utils/logger.js';
import { FEATURES, DEFAULT_SETTINGS } from '../../config.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
function getWebContentsById(id) {
  try {
    return BrowserWindow.getAllWindows()
      .flatMap((win) => win.webContents.getAllWebContents())
      .find((wc) => wc.id === id);
  } catch {
    return null;
  }
}
ipcMain.handle('webview:setUserAgent', async (_, { id, userAgent }) => {
  try {
    const wc = getWebContentsById(id);
    if (!wc) throw new Error('WEBVIEW_NOT_FOUND');
    wc.setUserAgent(userAgent || DEFAULT_SETTINGS.defaultUserAgent);
    return { ok: true };
  } catch (err) {
    logError('webview:setUserAgent failed', err);
    return { ok: false, error: err.message };
  }
});
ipcMain.handle('webview:openInWindow', async (_, { url, userAgent }) => {
  try {
    if (!FEATURES.singleAppMode) throw new Error('FEATURE_DISABLED');
    const win = new BrowserWindow({
      width: 1200,
      height: 800,
      backgroundColor: '#1e1e1e',
      webPreferences: {
        preload: join(__dirname, '../preload.cjs'),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        webviewTag: false,
        spellcheck: false
      }
    });
    if (userAgent) win.webContents.setUserAgent(userAgent);
    await win.loadURL(url);
    return { ok: true };
  } catch (err) {
    logError('webview:openInWindow failed', err);
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('webview:getUsage', async (_, id) => {
  try {
    if (!FEATURES.resourceMonitor) throw new Error('FEATURE_DISABLED');
    const wc = getWebContentsById(id);
    if (!wc) throw new Error('WEBVIEW_NOT_FOUND');
    const mem = wc.getResourceUsage();
    return { ok: true, data: mem };
  } catch (err) {
    logError('webview:getUsage failed', err);
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('webview:sleep', async (_, id) => {
  try {
    if (!FEATURES.sleepTabs) throw new Error('FEATURE_DISABLED');
    const wc = getWebContentsById(id);
    if (!wc) throw new Error('WEBVIEW_NOT_FOUND');
    wc.setAudioMuted(true);
    wc.stop();
    return { ok: true };
  } catch (err) {
    logError('webview:sleep failed', err);
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('webview:wake', async (_, id) => {
  try {
    if (!FEATURES.sleepTabs) throw new Error('FEATURE_DISABLED');
    const wc = getWebContentsById(id);
    if (!wc) throw new Error('WEBVIEW_NOT_FOUND');
    wc.reload();
    wc.setAudioMuted(false);
    return { ok: true };
  } catch (err) {
    logError('webview:wake failed', err);
    return { ok: false, error: err.message };
  }
});