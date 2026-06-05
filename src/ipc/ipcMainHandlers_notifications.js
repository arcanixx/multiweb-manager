// =============================================================================
// FILE: ipcMainHandlers_notifications.js
// PATH: src/ipc/ipcMainHandlers_notifications.js
// VERSION: 0.0.3
// PURPOSE: Handler IPC dla natywnych powiadomień systemowych OS (Windows/macOS). Przeniesione do procesu głównego — działa nawet gdy okno jest zminimalizowane lub ukryte w tray. Implementuje UIUX_REQ-022.
// FUNCTIONS: const:IPC_CHANNELS.NOTIFICATIONS.SHOW_SYSTEM
// DEPENDS ON: electron, path, logger.js, ipcChannels.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain, Notification, app } from 'electron';
import path from 'path';
import { logInfo, logError, logWarn } from '../utils/logger.js';
import { IPC_CHANNELS } from '../constants/ipcChannels.js';

// ─── Ikona aplikacji dla powiadomień systemowych
//   Ścieżka od root projektu (plik spakowany w asar lub bezpośrednio)
function getAppIcon() {
  try {
    return path.join(app.getAppPath(), 'assets', 'app-icon.png');
  } catch {
    return undefined;
  }
}

// ─── Rejestracja handlera — side-effect przy imporcie (ipcLoader.js ładuje automatycznie)
// ─── notifications:showSystem – wyświetla natywne powiadomienie OS
//   @param {Object} payload        – dane powiadomienia
//   @param {string} payload.title  – tytuł powiadomienia (wymagany)
//   @param {string} payload.body   – treść powiadomienia
//   @returns {{ ok: boolean, error?: string }}
ipcMain.handle(IPC_CHANNELS.NOTIFICATIONS.SHOW_SYSTEM, async (_event, payload) => {
  try {
    if (!payload || typeof payload !== 'object') {
      return { ok: false, error: 'INVALID_PAYLOAD' };
    }
    const { title, body } = payload;
    if (!title || typeof title !== 'string') {
      return { ok: false, error: 'INVALID_TITLE' };
    }

    if (!Notification.isSupported()) {
      logWarn('ipc', 'notifications:showSystem: Notification not supported on this platform');
      return { ok: false, error: 'NOT_SUPPORTED' };
    }

    const notification = new Notification({
      title,
      body: body || '',
      icon: getAppIcon(),
    });

    notification.show();
    logInfo('ipc', 'notifications:showSystem: shown', { title });
    return { ok: true };
  } catch (err) {
    logError('ipc', 'notifications:showSystem failed', err.message);
    return { ok: false, error: err.message };
  }
});