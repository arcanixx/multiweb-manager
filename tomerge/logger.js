// =============================================================================
// FILE: logger.js
// PATH: src/utils/logger.js
// VERSION: 0.0.3
// PURPOSE: Simple file + console logger for the main (Electron) process.
//          - getLogFilePath() – zwraca ścieżkę do pliku logów w userData
//          - logInfo(message, meta)  – poziom INFO
//          - logError(message, error) – poziom ERROR z serializacją błędu
//          Logi zapisywane do pliku i wypisywane w konsoli.
// DEPENDS ON: fs, path, electron (app)
// =============================================================================

import fs from "fs";
import path from "path";
import { app } from "electron";

let logFilePath = null;

// ----------------------------------------------------------------
// getLogFilePath() – zwraca ścieżkę do pliku logów
//   Lazy init – ścieżka ustalana przy pierwszym wywołaniu
//   (app.getPath("userData") dostępne dopiero po app.ready)
// ----------------------------------------------------------------
export function getLogFilePath() {
  if (!logFilePath) {
    const dir = app ? app.getPath("userData") : process.cwd();
    logFilePath = path.join(dir, "multiweb-manager.log");
  }
  return logFilePath;
}

// ----------------------------------------------------------------
// write() – pomocnicza, formatuje i zapisuje linię logu
// ----------------------------------------------------------------
function write(level, message, meta) {
  const line =
    `[${new Date().toISOString()}] [${level}] ${message}` +
    (meta ? ` ${JSON.stringify(meta)}` : "") +
    "\n";

  try {
    fs.appendFileSync(getLogFilePath(), line, "utf8");
  } catch {
    // Ignoruj błędy zapisu (np. brak uprawnień) – nie przerywaj działania
  }

  // eslint-disable-next-line no-console
  console.log(line.trim());
}

// ----------------------------------------------------------------
// logInfo() – loguje informacje (poziom INFO)
// ----------------------------------------------------------------
export function logInfo(message, meta) {
  write("INFO", message, meta);
}

// ----------------------------------------------------------------
// logError() – loguje błędy (poziom ERROR)
//   Serializuje obiekt Error do { error: message }
// ----------------------------------------------------------------
export function logError(message, error) {
  write("ERROR", message, { error: error?.message || String(error) });
}

// =============================================================================
// END OF FILE
// =============================================================================
