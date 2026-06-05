// =============================================================================
// FILE: ipcMainHandlers_webview_registry.js
// PATH: src/ipc/ipcMainHandlers_webview_registry.js
// VERSION: 0.0.3
// PURPOSE: Handlery IPC dla rejestru WebView – mapowanie tabId ↔ webContentsId. Wymagane przez Screenshot, Resource Monitor i AdBlocker.
// FUNCTIONS: const:IPC_CHANNELS.WEBVIEW.REGISTER, const:IPC_CHANNELS.WEBVIEW.UNREGISTER
// DEPENDS ON: electron, logger.js, webviewRegistry.js, ipcChannels.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from 'electron';
import { logInfo, logError } from '../utils/logger.js';
import { registerWebView, unregisterWebView } from '../engine/webviewRegistry.js';
import { IPC_CHANNELS } from '../constants/ipcChannels.js';

// ─── webview:register – rejestruje mapowanie tabId → webContentsId w rejestrze WebView
//   Wywoływany przez renderer (WebViewTab) po zamontowaniu elementu <webview>
//   Używany przez: ipcMainHandlers_webview_tools (capture, getResource), adBlocker
//   @param {string} tabId         – identyfikator zakładki (React)
//   @param {number} webContentsId – ID z Electron: webview.getWebContentsId()
ipcMain.handle(IPC_CHANNELS.WEBVIEW.REGISTER, async (_, tabId, webContentsId) => {
  try {
    if (!tabId || !webContentsId) throw new Error('INVALID_PAYLOAD');
    registerWebView(tabId, webContentsId);
    logInfo('ipc', `webview:register tabId=${tabId} wcId=${webContentsId}`);
    return { ok: true };
  } catch (err) {
    logError('ipc', 'webview:register failed', err.message);
    return { ok: false, error: err.message };
  }
});

// ─── webview:unregister – usuwa mapowanie tabId z rejestru WebView
//   Wywoływany przez renderer (WebViewTab) przy odmontowywaniu zakładki (cleanup)
//   @param {string} tabId – identyfikator zakładki do wyrejestrowania
ipcMain.handle(IPC_CHANNELS.WEBVIEW.UNREGISTER, async (_, tabId) => {
  try {
    if (!tabId) throw new Error('INVALID_PAYLOAD');
    unregisterWebView(tabId);
    logInfo('ipc', `webview:unregister tabId=${tabId}`);
    return { ok: true };
  } catch (err) {
    logError('ipc', 'webview:unregister failed', err.message);
    return { ok: false, error: err.message };
  }
});