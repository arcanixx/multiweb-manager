// =============================================================================
// FILE: ipcMainHandlers_logs.js
// PATH: src/ipc/ipcMainHandlers_logs.js
// VERSION: 0.0.3
// PURPOSE: Handlery IPC dla logów testów (LogWriter) z rotacją plików.
//          append-log-file – dopisuje wpis; rotuje jeśli plik >1MB (max 3 archiwa)
//          get-logs-file   – zwraca zawartość aktualnego pliku logów
//          clear-logs-file – usuwa plik logów
//          logs:getFile    – alias dla get-logs-file (zachowanie kompatybilności)
// FUNCTIONS: registerLogsHandlers, rotateLogs
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
}
