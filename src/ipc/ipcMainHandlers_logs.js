// =============================================================================
// FILE: ipcMainHandlers_logs.js
// PATH: src/ipc/ipcMainHandlers_logs.js
// VERSION: 0.0.3
// PURPOSE: Handlery IPC dla logów testów (LogWriter). Obsługuje zapis, odczyt i czyszczenie logów testów.
// FUNCTIONS: rotateLogs, registerLogsHandlers, const:IPC_CHANNELS.LOGS.APPEND, const:IPC_CHANNELS.LOGS.GET, const:IPC_CHANNELS.LOGS.CLEAR
// DEPENDS ON: electron, fs, path, logger.js, ipcChannels.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain, app } from 'electron';
import fs from 'fs';
import path from 'path';
import { logError, logInfo } from '../utils/logger.js';
import { IPC_CHANNELS } from '../constants/ipcChannels.js';

// ─── MAX_LOG_SIZE – maksymalny rozmiar pliku logu przed rotacją (1MB)
// UWAGA: Ta stała celowo pozostaje w tym pliku – dotyczy wyłącznie logiki rotacji.
const MAX_LOG_SIZE = 1 * 1024 * 1024; // 1MB

// ─── MAX_ARCHIVES – maksymalna liczba archiwów rotacyjnych (test-fails.log.1, .log.2, .log.3)
const MAX_ARCHIVES = 3;

// ─── getLogFile() – zwraca pełną ścieżkę do aktualnego pliku logów testów
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

// ─── rotateLogs() – rotuje pliki logów gdy aktualny przekracza limit
//   Schemat rotacji: .log → .log.1 → .log.2 → .log.N (najstarszy usuwany)
//   @param {string} logFile    – ścieżka do aktualnego pliku logu
//   @param {number} maxArchives – maksymalna liczba archiwów
//   @returns {void}
export function rotateLogs(logFile, maxArchives) {
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

// ─── appendLogFileLogic() – wspólna logika zapisu dla logów testów
async function appendLogFileLogic(payload) {
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
}

// ─── registerLogsHandlers() – rejestruje handlery IPC dla logów
export function registerLogsHandlers() {
  // ─── logs:append – dopisuje do pliku logów
  ipcMain.handle(IPC_CHANNELS.LOGS.APPEND, async (_, payload) => appendLogFileLogic(payload));

  // ─── logs:get – pobiera treść logów
  ipcMain.handle(IPC_CHANNELS.LOGS.GET, async () => {
    try {
      const logFile = getLogFile();
      if (!fs.existsSync(logFile)) return { ok: true, data: '' };
      return { ok: true, data: fs.readFileSync(logFile, 'utf8') };
    } catch (err) {
      logError('ipc', 'logs:get error', err);
      return { ok: false, error: err.message };
    }
  });

  // ─── logs:clear – czyści plik logów
  ipcMain.handle(IPC_CHANNELS.LOGS.CLEAR, async () => {
    try {
      const logFile = getLogFile();
      if (fs.existsSync(logFile)) fs.unlinkSync(logFile);
      logInfo('ipc', 'logs:clear success');
      return { ok: true };
    } catch (err) {
      logError('ipc', 'logs:clear error', err);
      return { ok: false, error: err.message };
    }
  });
}

registerLogsHandlers();