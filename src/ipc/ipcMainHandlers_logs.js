// =============================================================================
// FILE: ipcMainHandlers_logs.js
// PATH: src/ipc/ipcMainHandlers_logs.js
// VERSION: 0.0.3
// PURPOSE: Handlery IPC dla logów testów (LogWriter). logs:getFile buduje ścieżkę lokalnie przez app.getPath('userData') — nie używa getLogFilePath() z renderer logger.js (zwraca null w main).
// FUNCTIONS: registerLogsHandlers, ipc:append-log-file, ipc:get-logs-file, ipc:clear-logs-file, ipc:logs:getFile
// DEPENDS ON: electron, fs, path, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain, app } from 'electron';
import fs from 'fs';
import path from 'path';
import { logError } from '../utils/logger.js';

// ─── registerLogsHandlers() – Rejestruje zestaw głównych handlerów komunikacji IPC odpowiedzialnych za dopisywanie, pobieranie i czyszczenie pliku logów błędów testów jednostkowych (test-fails.log)
export function registerLogsHandlers() {
  ipcMain.handle('append-log-file', async (_, payload) => {
    try {
      const logsDir = path.join(app.getPath('userData'), 'logs');
      if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
      const logFile = path.join(logsDir, 'test-fails.log');
      const maxLines = 500;
      const line = `[${new Date(payload.timestamp).toISOString()}] FAIL: ${payload.module} / ${payload.test} – ${payload.details}\n`;
      fs.appendFileSync(logFile, line, 'utf8');
      const content = fs.readFileSync(logFile, 'utf8');
      const lines = content.split(/\r?\n/).filter(l => l.trim());
      if (lines.length > maxLines) {
        const trimmed = lines.slice(-maxLines);
        fs.writeFileSync(logFile, trimmed.join('\n') + '\n', 'utf8');
      }
      return { ok: true };
    } catch (err) {
      logError('append-log-file error', err);
      return { ok: false, error: err.message };
    }
  });
  ipcMain.handle('get-logs-file', async () => {
    try {
      const logFile = path.join(app.getPath('userData'), 'logs', 'test-fails.log');
      if (!fs.existsSync(logFile)) return { ok: true, data: '' };
      const content = fs.readFileSync(logFile, 'utf8');
      return { ok: true, data: content };
    } catch (err) {
      logError('get-logs-file error', err);
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('clear-logs-file', async () => {
    try {
      const logFile = path.join(app.getPath('userData'), 'logs', 'test-fails.log');
      if (fs.existsSync(logFile)) fs.unlinkSync(logFile);
      return { ok: true };
    } catch (err) {
      logError('clear-logs-file error', err);
      return { ok: false, error: err.message };
    }
  });
	// =============================================================================
	// LOGS – odczyt pliku logów (z misc)
	// =============================================================================

 ipcMain.handle('logs:getFile', async () => {
  try {
    // getLogFilePath() z renderer logger.js zwraca null w main process.
    // Budujemy ścieżkę lokalnie — analogicznie do get-logs-file powyżej.
    const logPath = path.join(app.getPath('userData'), 'logs', 'test-fails.log');
    if (!fs.existsSync(logPath)) return { ok: true, data: { path: logPath, content: '' } };
    const content = fs.readFileSync(logPath, 'utf8');
    return { ok: true, data: { path: logPath, content } };
  } catch (err) {
    logError('logs:getFile failed', err);
    return { ok: false, error: err.message };
  }
});
  
  
}