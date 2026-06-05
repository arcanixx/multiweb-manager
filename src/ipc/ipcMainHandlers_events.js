// =============================================================================
// FILE: ipcMainHandlers_events.js
// PATH: src/ipc/ipcMainHandlers_events.js
// VERSION: 0.0.3
// PURPOSE: Handlery IPC dla dziennika zdarzeń aplikacji (EventLogger). Obsługuje zapis, odczyt i czyszczenie zdarzeń.
// FUNCTIONS: registerEventLogsHandlers, ipc:events:append, ipc:events:getFile, ipc:events:clear
// DEPENDS ON: electron, fs, path, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain, app } from 'electron';
import fs from 'fs';
import path from 'path';
import { logError, logInfo } from '../utils/logger.js';
import { rotateLogs } from './ipcMainHandlers_logs.js';
import { IPC_CHANNELS } from '../constants/ipcChannels.js';

// ─── MAX_LOG_SIZE_EVENTS – limit dla dziennika zdarzeń (2MB per ARCH_REQ-044)
const MAX_LOG_SIZE_EVENTS = 2 * 1024 * 1024; // 2MB

// ─── MAX_ARCHIVES_EVENTS – archiwa dziennika zdarzeń (max 2 per ARCH_REQ-044)
const MAX_ARCHIVES_EVENTS = 2;

// ─── getEventsFile() – zwraca pełną ścieżkę do dziennika zdarzeń aplikacji
//   @returns {string}
function getEventsFile() {
  return path.join(app.getPath('userData'), 'logs', 'events.log');
}

// ─── ensureLogsDir() – tworzy katalog logów jeśli nie istnieje
//   @returns {string} – ścieżka do katalogu logów
function ensureLogsDir() {
  const dir = path.join(app.getPath('userData'), 'logs');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

// ─── registerEventLogsHandlers() – rejestruje handlery IPC dla dziennika zdarzeń
export function registerEventLogsHandlers() {
  // ─── events:append – dopisuje zdarzenie do dziennika (ARCH_REQ-044)
  //   Format wpisu: NDJSON (jeden JSON per linia)
  //   Zapis tylko gdy settings.eventLogEnabled === true (guard po stronie renderera w eventLogger.js)
  //   @param {Object} payload – { ts, module, fn, action, params, source }
  ipcMain.handle(IPC_CHANNELS.EVENTS.APPEND, async (_, payload) => {
    try {
      if (!payload || typeof payload !== 'object' || !payload.ts) {
        return { ok: false, error: 'INVALID_PAYLOAD' };
      }

      ensureLogsDir();
      const eventsFile = getEventsFile();

      // Rotacja jeśli plik przekracza MAX_LOG_SIZE_EVENTS (2MB)
      if (fs.existsSync(eventsFile)) {
        const { size } = fs.statSync(eventsFile);
        if (size >= MAX_LOG_SIZE_EVENTS) rotateLogs(eventsFile, MAX_ARCHIVES_EVENTS);
      }

      const line = JSON.stringify(payload) + '\n';
      fs.appendFileSync(eventsFile, line, 'utf8');

      return { ok: true };
    } catch (err) {
      logError('ipc', 'events:append failed', err.message);
      return { ok: false, error: err.message };
    }
  });

  // ─── events:getFile – zwraca zawartość i ścieżkę dziennika zdarzeń
  ipcMain.handle(IPC_CHANNELS.EVENTS.GET_FILE, async () => {
    try {
      const eventsFile = getEventsFile();
      if (!fs.existsSync(eventsFile)) return { ok: true, data: { path: eventsFile, content: '' } };
      return { ok: true, data: { path: eventsFile, content: fs.readFileSync(eventsFile, 'utf8') } };
    } catch (err) {
      logError('ipc', 'events:getFile failed', err.message);
      return { ok: false, error: err.message };
    }
  });

  // ─── events:clear – usuwa aktualny plik dziennika zdarzeń (archiwa pozostają)
  ipcMain.handle(IPC_CHANNELS.EVENTS.CLEAR, async () => {
    try {
      const eventsFile = getEventsFile();
      if (fs.existsSync(eventsFile)) fs.unlinkSync(eventsFile);
      logInfo('ipc', 'events:clear: event log cleared');
      return { ok: true };
    } catch (err) {
      logError('ipc', 'events:clear failed', err.message);
      return { ok: false, error: err.message };
    }
  });
}

registerEventLogsHandlers();