// =============================================================================
// FILE: ipcMainHandlers_webview_controls.js
// PATH: src/ipc/ipcMainHandlers_webview_controls.js
// VERSION: 0.0.3
// PURPOSE: IPC handlers dla User Agent, Single App Mode, Resource Monitor, Sleep Tabs. Używa ESM import path/url zamiast require() (ES module context).
// FUNCTIONS: ipc:webview:setUserAgent, ipc:webview:openInWindow, ipc:webview:getUsage, ipc:webview:sleep, ipc:webview:wake, ipc:webview:scheduleInjection, ipc:webview:removeInjection
// DEPENDS ON: electron, path, url, logger.js, config.js, webviewScriptInjector.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain, BrowserWindow } from 'electron';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { logError, logInfo } from '../utils/logger.js';
import { FEATURES, DEFAULT_SETTINGS } from '../config.js';
import { scheduleInjectionOnLoad, removeInjectionListeners } from '../engine/webviewScriptInjector.js';
const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── getWebContentsById() – Wyszukuje i zwraca obiekt WebContents powiązany z podanym identyfikatorem w zestawie wszystkich aktywnych okien Electrona
function getWebContentsById(id) {
  try {
    return BrowserWindow.getAllWindows()
      .flatMap((win) => win.webContents.getAllWebContents())
      .find((wc) => wc.id === id);
  } catch {
    return null;
  }
}
ipcMain.handle('webview:setUserAgent', async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'object' || !('id' in payload)) {
      throw new Error('INVALID_PAYLOAD');
    }
    const { id, userAgent } = payload;
    const wc = getWebContentsById(id);
    if (!wc) throw new Error('WEBVIEW_NOT_FOUND');
    wc.setUserAgent(userAgent || DEFAULT_SETTINGS.defaultUserAgent);
    return { ok: true };
  } catch (err) {
    logError('ipc', 'webview:setUserAgent failed', err);
    return { ok: false, error: err.message };
  }
});
ipcMain.handle('webview:openInWindow', async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'object' || !('url' in payload)) {
      throw new Error('INVALID_PAYLOAD');
    }
    const { url, userAgent } = payload;
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
    logError('ipc', 'webview:openInWindow failed', err);
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('webview:getUsage', async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'object' || !('id' in payload)) {
      throw new Error('INVALID_PAYLOAD');
    }
    const { id } = payload;
    if (!FEATURES.resourceMonitor) throw new Error('FEATURE_DISABLED');
    const wc = getWebContentsById(id);
    if (!wc) throw new Error('WEBVIEW_NOT_FOUND');
    const mem = wc.getResourceUsage();
    return { ok: true, data: mem };
  } catch (err) {
    logError('ipc', 'webview:getUsage failed', err);
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('webview:sleep', async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'object' || !('id' in payload)) {
      throw new Error('INVALID_PAYLOAD');
    }
    const { id } = payload;
    if (!FEATURES.sleepTabs) throw new Error('FEATURE_DISABLED');
    const wc = getWebContentsById(id);
    if (!wc) throw new Error('WEBVIEW_NOT_FOUND');
    wc.setAudioMuted(true);
    wc.stop();
    return { ok: true };
  } catch (err) {
    logError('ipc', 'webview:sleep failed', err);
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('webview:wake', async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'object' || !('id' in payload)) {
      throw new Error('INVALID_PAYLOAD');
    }
    const { id } = payload;
    if (!FEATURES.sleepTabs) throw new Error('FEATURE_DISABLED');
    const wc = getWebContentsById(id);
    if (!wc) throw new Error('WEBVIEW_NOT_FOUND');
    wc.reload();
    wc.setAudioMuted(false);
    return { ok: true };
  } catch (err) {
    logError('ipc', 'webview:wake failed', err);
    return { ok: false, error: err.message };
  }
});

// ─── webview:scheduleInjection – rejestruje wstrzykiwanie CSS/skryptu dla profilu przy did-finish-load
//   Deleguje do webviewScriptInjector.scheduleInjectionOnLoad()
ipcMain.handle('webview:scheduleInjection', async (_, payload) => {
  try {
    if (!payload?.id) throw new Error('INVALID_PAYLOAD');
    const { id, profileId, userCSS, userScript } = payload;
    const wc = getWebContentsById(id);
    if (!wc) throw new Error('WEBVIEW_NOT_FOUND');
    scheduleInjectionOnLoad(wc, profileId ?? String(id), { userCSS, userScript });
    logInfo('ipc', `webview:scheduleInjection registered for wcId=${id}`);
    return { ok: true };
  } catch (err) {
    logError('ipc', 'webview:scheduleInjection failed', err.message);
    return { ok: false, error: err.message };
  }
});

// ─── webview:removeInjection – usuwa listener wstrzykiwania dla webContents (cleanup przy zamknięciu profilu)
//   Deleguje do webviewScriptInjector.removeInjectionListeners()
ipcMain.handle('webview:removeInjection', async (_, payload) => {
  try {
    if (!payload?.id) throw new Error('INVALID_PAYLOAD');
    const wc = getWebContentsById(payload.id);
    if (!wc) return { ok: true }; // już zamknięty – OK
    removeInjectionListeners(wc);
    logInfo('ipc', `webview:removeInjection cleaned for wcId=${payload.id}`);
    return { ok: true };
  } catch (err) {
    logError('ipc', 'webview:removeInjection failed', err.message);
    return { ok: false, error: err.message };
  }
});