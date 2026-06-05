// =============================================================================
// FILE: ipcMainHandlers_webview_tools.js
// PATH: src/ipc/ipcMainHandlers_webview_tools.js
// VERSION: 0.0.3
// PURPOSE: Handlery IPC dla narzędzi WebView: tryb Single App, zrzuty ekranu i monitor zasobów.
// FUNCTIONS: registerWebViewExtraHandlers, ipc:webview:openSingle, ipc:webview:capture, ipc:webview:getResource
// DEPENDS ON: electron, path, logger.js, webviewRegistry.js, ipcChannels.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain, BrowserWindow } from 'electron';
import path from 'path';
import { logError } from '../utils/logger.js';
import { getWebViewEntry, getAllWebContents } from '../engine/webviewRegistry.js';
import { IPC_CHANNELS } from '../constants/ipcChannels.js';
const PRELOAD_PATH = path.join(__dirname, '../../preload.cjs');

// ─── registerWebViewExtraHandlers() – Rejestruje dodatkowe handlery IPC dedykowane dla WebView:
//   Single App Mode (nowe okno), screenshot strony oraz monitor zasobów sprzętowych
export function registerWebViewExtraHandlers() {

  // ─── webview:openSingle – otwiera URL w osobnym oknie (Single App Mode)
  ipcMain.handle(IPC_CHANNELS.WEBVIEW.OPEN_SINGLE, async (_, payload) => {
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
      logError('ipc', 'webview:openSingle error', err);
      return { ok: false, error: err.message };
    }
  });
      await win.loadURL(payload.url);
      if (payload.debug) win.webContents.openDevTools();
      return { ok: true };
    } catch (err) {
  });

  // ─── webview:capture – wykonuje screenshot widocznego obszaru WebView
  ipcMain.handle(IPC_CHANNELS.WEBVIEW.CAPTURE, async (_, payload) => {
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
      logError('ipc', 'webview:capture error', err);
      return { ok: false, error: err.message };
    }
  });

  // ─── webview:getResource – zwraca dane o zasobach WebView (pamięć, CPU)
  ipcMain.handle(IPC_CHANNELS.WEBVIEW.GET_RESOURCE, async (_, payload) => {
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
      logError('ipc', 'webview:getResource error', err);
      return { ok: false, error: err.message };
    }
  });
}

registerWebViewExtraHandlers();