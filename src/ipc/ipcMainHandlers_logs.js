// =============================================================================
// FILE: ipcMainHandlers_logs.js
// PATH: src/ipc/ipcMainHandlers_logs.js
// VERSION: 0.0.3
// PURPOSE: Handlery IPC dla logów testów (LogWriter) i dziennika zdarzeń (EventLogger). append-log-file – błędy testów; events:append – zdarzenia aplikacji (ARCH_REQ-044).
// FUNCTIONS: registerLogsHandlers, ipc:append-log-file, ipc:get-logs-file, ipc:clear-logs-file, ipc:logs:getFile, ipc:logs:append, ipc:logs:get, ipc:logs:clear, ipc:events:append, ipc:events:getFile, ipc:events:clear
// DEPENDS ON: electron, fs, path, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain, app } from 'electron';
import fs from 'fs';
import path from 'path';
import { logError, logInfo } from '../utils/logger.js';

// ─── MAX_LOG_SIZE – maksymalny rozmiar pliku logu przed rotacją (1MB)
// UWAGA: Ta stała celowo pozostaje w tym pliku – dotyczy wyłącznie logiki rotacji.
const MAX_LOG_SIZE = 1 * 1024 * 1024; // 1MB

// ─── MAX_LOG_SIZE_EVENTS – limit dla dziennika zdarzeń (2MB per ARCH_REQ-044)
const MAX_LOG_SIZE_EVENTS = 2 * 1024 * 1024; // 2MB

// ─── MAX_ARCHIVES – maksymalna liczba archiwów rotacyjnych (test-fails.log.1, .log.2, .log.3)
const MAX_ARCHIVES = 3;

// ─── MAX_ARCHIVES_EVENTS – archiwa dziennika zdarzeń (max 2 per ARCH_REQ-044)
const MAX_ARCHIVES_EVENTS = 2;

// ─── getLogFile() – zwraca pełną ścieżkę do aktualnego pliku logów testów
//   @returns {string}
function getLogFile() {
  return path.join(app.getPath('userData'), 'logs', 'test-fails.log');
}

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

// ─── rotateLogs() – rotuje pliki logów gdy aktualny przekracza limit
//   Schemat rotacji: .log → .log.1 → .log.2 → .log.N (najstarszy usuwany)
//   @param {string} logFile    – ścieżka do aktualnego pliku logu
//   @param {number} maxArchives – maksymalna liczba archiwów
//   @returns {void}
function rotateLogs(logFile, maxArchives = MAX_ARCHIVES) {
  try {
    const oldest = `${logFile}.${maxArchives}`;
    if (fs.existsSync(oldest)) fs.unlinkSync(oldest);

    for (let i = maxArchives - 1; i >= 1; i--) {
      const src = `${logFile}.${i}`;
      const dst = `${logFile}.${i + 1}`;
      if (fs.existsSync(src)) fs.renameSync(src, dst);
    }

    if (fs.existsSync(logFile)) fs.renameSync(logFile, `${logFile}.1`);
    logInfo('ipc', `rotateLogs: rotated ${logFile}`);
  } catch (err) {
    logError('ipc', 'rotateLogs failed', err.message);
  }
}

// ─── registerLogsHandlers() – rejestruje handlery IPC dla logów
export function registerLogsHandlers() {

  // ─── append-log-file – dopisuje wpis logu; rotuje plik jeśli przekracza MAX_LOG_SIZE
  ipcMain.handle('append-log-file', async (_, payload) => {
    try {
      if (!payload || typeof payload !== 'object' ||
          !('timestamp' in payload) || !('module' in payload) ||
          !('test' in payload) || !('details' in payload)) {
        throw new Error('INVALID_PAYLOAD');
      }

      ensureLogsDir();
      const logFile = getLogFile();

      if (fs.existsSync(logFile)) {
        const { size } = fs.statSync(logFile);
        if (size >= MAX_LOG_SIZE) rotateLogs(logFile, MAX_ARCHIVES);
      }

      const line = `[${new Date(payload.timestamp).toISOString()}] FAIL: ${payload.module} / ${payload.test} – ${payload.details}\n`;
      fs.appendFileSync(logFile, line, 'utf8');

      return { ok: true };
    } catch (err) {
      logError('ipc', 'append-log-file error', err);
      return { ok: false, error: err.message };
    }
  });

  // ─── get-logs-file – zwraca zawartość aktualnego pliku logów testów
  ipcMain.handle('get-logs-file', async () => {
    try {
      const logFile = getLogFile();
      if (!fs.existsSync(logFile)) return { ok: true, data: '' };
      return { ok: true, data: fs.readFileSync(logFile, 'utf8') };
    } catch (err) {
      logError('ipc', 'get-logs-file error', err);
      return { ok: false, error: err.message };
    }
  });

  // ─── clear-logs-file – usuwa aktualny plik logów testów (archiwa pozostają)
  ipcMain.handle('clear-logs-file', async () => {
    try {
      const logFile = getLogFile();
      if (fs.existsSync(logFile)) fs.unlinkSync(logFile);
      logInfo('ipc', 'clear-logs-file: log cleared');
      return { ok: true };
    } catch (err) {
      logError('ipc', 'clear-logs-file error', err);
      return { ok: false, error: err.message };
    }
  });

  // ─── logs:getFile – alias dla get-logs-file z rozszerzonym response (ścieżka + treść)
  ipcMain.handle('logs:getFile', async () => {
    try {
      const logFile = getLogFile();
      if (!fs.existsSync(logFile)) return { ok: true, data: { path: logFile, content: '' } };
      return { ok: true, data: { path: logFile, content: fs.readFileSync(logFile, 'utf8') } };
    } catch (err) {
      logError('ipc', 'logs:getFile failed', err);
      return { ok: false, error: err.message };
    }
  });

  // ─── logs:append – nowa nazwa dla 'append-log-file' (migracja Sprint 2)
  //   Alias kompatybilności — preload.cjs używa jeszcze 'append-log-file'
  ipcMain.handle('logs:append', async (_, payload) => {
    try {
      if (!payload || typeof payload !== 'object' ||
          !('timestamp' in payload) || !('module' in payload) ||
          !('test' in payload) || !('details' in payload)) {
        throw new Error('INVALID_PAYLOAD');
      }
      ensureLogsDir();
      const logFile = getLogFile();
      if (fs.existsSync(logFile)) {
        const { size } = fs.statSync(logFile);
        if (size >= MAX_LOG_SIZE) rotateLogs(logFile, MAX_ARCHIVES);
      }
      const line = `[${new Date(payload.timestamp).toISOString()}] FAIL: ${payload.module} / ${payload.test} – ${payload.details}\n`;
      fs.appendFileSync(logFile, line, 'utf8');
      return { ok: true };
    } catch (err) {
      logError('ipc', 'logs:append error', err);
      return { ok: false, error: err.message };
    }
  });

  // ─── logs:get – nowa nazwa dla 'get-logs-file' (migracja Sprint 2)
  ipcMain.handle('logs:get', async () => {
    try {
      const logFile = getLogFile();
      if (!fs.existsSync(logFile)) return { ok: true, data: { path: logFile, content: '' } };
      return { ok: true, data: { path: logFile, content: fs.readFileSync(logFile, 'utf8') } };
    } catch (err) {
      logError('ipc', 'logs:get error', err);
      return { ok: false, error: err.message };
    }
  });

  // ─── logs:clear – nowa nazwa dla 'clear-logs-file' (migracja Sprint 2)
  ipcMain.handle('logs:clear', async () => {
    try {
      const logFile = getLogFile();
      if (fs.existsSync(logFile)) fs.unlinkSync(logFile);
      logInfo('ipc', 'logs:clear: log cleared');
      return { ok: true };
    } catch (err) {
      logError('ipc', 'logs:clear error', err);
      return { ok: false, error: err.message };
    }
  });

  // ─── events:append – dopisuje zdarzenie do dziennika (ARCH_REQ-044)
  //   Format wpisu: NDJSON (jeden JSON per linia)
  //   Zapis tylko gdy settings.eventLogEnabled === true (guard po stronie renderera w eventLogger.js)
  //   @param {Object} payload – { ts, module, fn, action, params, source }
  ipcMain.handle('events:append', async (_, payload) => {
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
  ipcMain.handle('events:getFile', async () => {
    try {
      const eventsFile = getEventsFile();
      if (!fs.existsSync(eventsFile)) {
        return { ok: true, data: { path: eventsFile, content: '' } };
      }
      return {
        ok: true,
        data: { path: eventsFile, content: fs.readFileSync(eventsFile, 'utf8') },
      };
    } catch (err) {
      logError('ipc', 'events:getFile failed', err.message);
      return { ok: false, error: err.message };
    }
  });

  // ─── events:clear – usuwa aktualny plik dziennika zdarzeń (archiwa pozostają)
  ipcMain.handle('events:clear', async () => {
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

import { ipcMain, app } from 'electron';
import fs from 'fs';
import path from 'path';
import { logError, logInfo } from '../utils/logger.js';

// ─── MAX_LOG_SIZE – maksymalny rozmiar pliku logu przed rotacją (1MB)
// UWAGA: Ta stała celowo pozostaje w tym pliku – dotyczy wyłącznie logiki rotacji.
const MAX_LOG_SIZE = 1 * 1024 * 1024; // 1MB

// ─── MAX_ARCHIVES – maksymalna liczba archiwów rotacyjnych (test-fails.log.1, .log.2, .log.3)
const MAX_ARCHIVES = 3;

// ─── getLogFile() – zwraca pełną ścieżkę do aktualnego pliku logów
//   @returns {string}
function getLogFile() {
  return path.join(app.getPath('userData'), 'logs', 'test-fails.log');
}

// ─── ensureLogsDir() – tworzy katalog logów jeśli nie istnieje
//   @returns {string} – ścieżka do katalogu logów
function ensureLogsDir() {
  const dir = path.join(app.getPath('userData'), 'logs');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

// ─── rotateLogs() – rotuje pliki logów gdy aktualny przekracza MAX_LOG_SIZE
//   Schemat rotacji: .log → .log.1 → .log.2 → .log.3 (najstarszy usuwany)
//   @param {string} logFile – ścieżka do aktualnego pliku logu
//   @returns {void}
function rotateLogs(logFile) {
  try {
    // Usuń najstarsze archiwum jeśli istnieje
    const oldest = `${logFile}.${MAX_ARCHIVES}`;
    if (fs.existsSync(oldest)) fs.unlinkSync(oldest);

    // Przesuń archiwa: .log.2 → .log.3, .log.1 → .log.2
    for (let i = MAX_ARCHIVES - 1; i >= 1; i--) {
      const src = `${logFile}.${i}`;
      const dst = `${logFile}.${i + 1}`;
      if (fs.existsSync(src)) fs.renameSync(src, dst);
    }

    // Przesuń aktualny plik → .log.1
    if (fs.existsSync(logFile)) fs.renameSync(logFile, `${logFile}.1`);

    logInfo('ipc', `rotateLogs: rotated ${logFile}`);
  } catch (err) {
    logError('ipc', 'rotateLogs failed', err.message);
  }
}

// ─── registerLogsHandlers() – rejestruje handlery IPC dla logów
export function registerLogsHandlers() {

  // ─── append-log-file – dopisuje wpis logu; rotuje plik jeśli przekracza MAX_LOG_SIZE
  ipcMain.handle('append-log-file', async (_, payload) => {
    try {
      if (!payload || typeof payload !== 'object' ||
          !('timestamp' in payload) || !('module' in payload) ||
          !('test' in payload) || !('details' in payload)) {
        throw new Error('INVALID_PAYLOAD');
      }

      ensureLogsDir();
      const logFile = getLogFile();

      // Rotacja jeśli plik przekracza limit
      if (fs.existsSync(logFile)) {
        const { size } = fs.statSync(logFile);
        if (size >= MAX_LOG_SIZE) {
          rotateLogs(logFile);
        }
      }

      const line = `[${new Date(payload.timestamp).toISOString()}] FAIL: ${payload.module} / ${payload.test} – ${payload.details}\n`;
      fs.appendFileSync(logFile, line, 'utf8');

      return { ok: true };
    } catch (err) {
      logError('ipc', 'append-log-file error', err);
      return { ok: false, error: err.message };
    }
  });

  // ─── get-logs-file – zwraca zawartość aktualnego pliku logów
  ipcMain.handle('get-logs-file', async () => {
    try {
      const logFile = getLogFile();
      if (!fs.existsSync(logFile)) return { ok: true, data: '' };
      return { ok: true, data: fs.readFileSync(logFile, 'utf8') };
    } catch (err) {
      logError('ipc', 'get-logs-file error', err);
      return { ok: false, error: err.message };
    }
  });

  // ─── clear-logs-file – usuwa aktualny plik logów (archiwa pozostają)
  ipcMain.handle('clear-logs-file', async () => {
    try {
      const logFile = getLogFile();
      if (fs.existsSync(logFile)) fs.unlinkSync(logFile);
      logInfo('ipc', 'clear-logs-file: log cleared');
      return { ok: true };
    } catch (err) {
      logError('ipc', 'clear-logs-file error', err);
      return { ok: false, error: err.message };
    }
  });

}

// ─── Auto-rejestracja przy imporcie przez ipcLoader.js (side-effect pattern)
registerLogsHandlers();