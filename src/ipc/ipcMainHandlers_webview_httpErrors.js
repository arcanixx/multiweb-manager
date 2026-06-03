// =============================================================================
// FILE: ipcMainHandlers_webview_httpErrors.js
// PATH: src/ipc/ipcMainHandlers_webview_httpErrors.js
// VERSION: 0.0.3
// PURPOSE: IPC handler monitorujący HTTP 4xx/5xx z WebView per partycja.
//          Uzupełnia did-fail-load (błędy sieciowe/DNS) o obsługę błędów HTTP,
//          których did-fail-load nie wychwytuje (strona się ładuje, ale zwraca błąd).
// FUNCTIONS: ipc:webview:startHttpMonitor
// DEPENDS ON: electron, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain, BrowserWindow, session } from 'electron';
import { logWarn, logInfo, logError } from '../utils/logger.js';

// Zbiór partycji aktualnie monitorowanych – zapobiega podwójnej rejestracji
const monitoredPartitions = new Set();

// ─── registerPartitionMonitor() – rejestruje nasłuch onCompleted dla danej partycji WebView
//   @param {string} partition – identyfikator partycji (np. "persist:profile-abc123")
function registerPartitionMonitor(partition) {
  if (monitoredPartitions.has(partition)) return;
  monitoredPartitions.add(partition);

  let partitionSession;
  try {
    partitionSession = session.fromPartition(partition);
  } catch (err) {
    logError('ipc', `webview HTTP monitor: nie można uzyskać sesji dla partycji: ${partition}`, err);
    monitoredPartitions.delete(partition);
    return;
  }

  // ─── Nasłuchuje zakończenia requestów HTTP w tej partycji
  partitionSession.webRequest.onCompleted({ urls: ['*://*/*'] }, (details) => {
    const { statusCode, url, resourceType } = details;

    // Pomijaj wszystko poza główną ramką strony (nie XHR, obrazki, CSS, fonty itp.)
    if (resourceType !== 'mainFrame') return;

    // Pomijaj przekierowania (3xx) i sukcesy (< 400)
    if (statusCode < 400) return;

    logWarn('ipc', `webview HTTP ${statusCode} dla: ${url} (partycja: ${partition})`);

    // Wyślij event do wszystkich okien renderera – renderer sam filtruje po partycji
    BrowserWindow.getAllWindows().forEach((win) => {
      if (!win.isDestroyed() && win.webContents) {
        win.webContents.send('webview:http-error', { statusCode, url, partition });
      }
    });
  });

  logInfo('ipc', `webview HTTP monitor zarejestrowany dla partycji: ${partition}`);
}

// ─── ipc:webview:startHttpMonitor – rejestruje monitor HTTP błędów dla partycji WebView
//   Wywoływany z renderera przy montowaniu WebViewTab.
//   Idempotentny – wielokrotne wywołanie dla tej samej partycji jest bezpieczne.
ipcMain.handle('webview:startHttpMonitor', async (_, partition) => {
  try {
    if (!partition || typeof partition !== 'string') {
      return { ok: false, error: 'Nieprawidłowa lub brakująca partycja' };
    }
    registerPartitionMonitor(partition);
    return { ok: true };
  } catch (err) {
    logError('ipc', `webview:startHttpMonitor error: ${err.message}`, err);
    return { ok: false, error: err.message };
  }
});