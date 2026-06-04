// =============================================================================
// FILE: ipcMainHandlers_webview_extra.js
// PATH: src/ipc/ipcMainHandlers_webview_extra.js
// VERSION: 0.0.3
// PURPOSE: Dodatkowe handlery IPC dla WebView – tryb Single App, screenshot, monitor zasobów.
// FUNCTIONS: registerWebViewExtraHandlers, webview:openSingle, webview:capture, webview:getResource
// DEPENDS ON: electron, path, logger.js, webviewRegistry.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain, BrowserWindow } from 'electron';
import path from 'path';
import { logError } from '../utils/logger.js';
import { getWebViewEntry, getAllWebContents } from '../engine/webviewRegistry.js';
const PRELOAD_PATH = path.join(__dirname, '../../preload.cjs');

// ─── registerWebViewExtraHandlers() – Rejestruje dodatkowe handlery IPC dedykowane dla WebView:
//   Single App Mode (nowe okno), screenshot strony oraz monitor zasobów sprzętowych
export function registerWebViewExtraHandlers() {

  // ─── webview:openSingle – otwiera URL w osobnym oknie (Single App Mode)
  //   Alias: 'open-single-window' (legacy — do usunięcia po migracji preloadu)
  ipcMain.handle('webview:openSingle', async (_, payload) => {
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
  // Alias legacy — preload.cjs używa jeszcze 'open-single-window'
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
      logError('ipc', 'open-single-window (legacy alias) error', err);
      return { ok: false, error: err.message };
    }
  });

  // ─── webview:capture – wykonuje screenshot widocznego obszaru WebView
  //   Alias: 'capture-webview' (legacy — do usunięcia po migracji preloadu)
  ipcMain.handle('webview:capture', async (_, payload) => {
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
      logError('ipc', 'capture-webview (legacy alias) error', err);
      return { ok: false, error: err.message };
    }
  });

  // ─── webview:getResource – zwraca dane o zasobach WebView (pamięć, CPU)
  //   Alias: 'get-webview-resource' (legacy — do usunięcia po migracji preloadu)
  ipcMain.handle('webview:getResource', async (_, payload) => {
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
      logError('ipc', 'get-webview-resource (legacy alias) error', err);
      return { ok: false, error: err.message };
    }
  });
}
