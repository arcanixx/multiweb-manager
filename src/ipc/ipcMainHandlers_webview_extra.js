// =============================================================================
// FILE: ipcMainHandlers_webview_extra.js
// PATH: src/ipc/ipcMainHandlers_webview_extra.js
// VERSION: 0.0.3
// PURPOSE: Dodatkowe handlery IPC dla WebView (screenshot, single app, resource)
// FUNCTIONS: registerWebViewExtraHandlers, ipc:open-single-window, ipc:capture-webview, ipc:get-webview-resource
// DEPENDS ON: electron, path, logger.js, webviewRegistry.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain, BrowserWindow } from 'electron';
import path from 'path';
import { logError } from '../utils/logger.js';
import { getWebViewEntry, getAllWebContents } from '../engine/webviewRegistry.js';
const PRELOAD_PATH = path.join(__dirname, '../../preload.cjs');

// ─── registerWebViewExtraHandlers() – Rejestruje dodatkowe handlery IPC dedykowane dla WebView, w tym obsługę osobnych okien (Single App Mode), wykonywanie zrzutów ekranu oraz monitorowanie zasobów sprzętowych
export function registerWebViewExtraHandlers() {
  // Single App Mode – nowe okno
  ipcMain.handle('open-single-window', async (_, payload) => {
    try {
      if (!payload || typeof payload !== 'object') {
        throw new Error('INVALID_PAYLOAD');
      }
      const win = new BrowserWindow({
        width: payload.width || 1200,
        height: payload.height || 800,
        webPreferences: {
          preload: PRELOAD_PATH,
          contextIsolation: true,
          nodeIntegration: false
        }
      });
      await win.loadURL(payload.url);
      if (payload.debug) win.webContents.openDevTools();
      return { ok: true };
    } catch (err) {
      logError('ipc', 'Single App Mode error', err);
      return { ok: false, error: err.message };
    }
  });
  
  // Screenshot WebView
  ipcMain.handle('capture-webview', async (_, payload) => {
    try {
      if (!payload || typeof payload !== 'object' || !('tabId' in payload)) {
        throw new Error('INVALID_PAYLOAD');
      }
      const { tabId } = payload;
      const entry = getWebViewEntry(tabId);
      if (!entry || !entry.webContentsId) return { ok: false, error: 'WebView not found' };
      const all = getAllWebContents();
      const target = all.find(wc => wc.id === entry.webContentsId);
      if (!target) return { ok: false, error: 'WebContents not found' };
      const image = await target.capturePage();
      return { ok: true, data: image.toPNG() };
    } catch (err) {
      logError('ipc', 'Screenshot error', err);
      return { ok: false, error: err.message };
    }
  });

  // Resource Monitor
  ipcMain.handle('get-webview-resource', async (_, payload) => {
    try {
      if (!payload || typeof payload !== 'object' || !('tabId' in payload)) {
        throw new Error('INVALID_PAYLOAD');
      }
      const { tabId } = payload;
      const entry = getWebViewEntry(tabId);
      if (!entry || !entry.webContentsId) return { ok: false, error: 'WebView not found' };
      const all = getAllWebContents();
      const target = all.find(wc => wc.id === entry.webContentsId);
      if (!target) return { ok: false, error: 'WebContents not found' };
      const mem = await target.getProcessMemoryInfo();
      const cpu = Math.floor(Math.random() * 30); // placeholder
      return {
        ok: true,
        data: {
          memory: Math.round(mem.workingSetSize / 1024 / 1024),
          cpu
        }
      };
    } catch (err) {
      logError('ipc', 'Resource monitor error', err);
      return { ok: false, error: err.message };
    }
  });

}
 