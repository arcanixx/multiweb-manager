// =============================================================================
// FILE: fileUtils.js
// PATH: src/utils/fileUtils.js
// VERSION: 0.0.3
// PURPOSE: Uniwersalne i bezpieczne opakowanie natywnych funkcji I/O Node.js dla plików JSON z automatyczną obsługą błędów.
// FUNCTIONS: readJsonSafe, writeJsonSafe
// DEPENDS ON: fs, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import fs from "fs";
import { logInfo, logError, logWarn, logDebug } from './logger.js';

// ─── readJsonSafe() – odczytuje JSON z pliku, zwraca fallback przy błędzie
//   @param {string} filePath – ścieżka do pliku JSON
//   @param {any} fallback – wartość zwracana w przypadku błędu
//   @returns {any} sparsowane dane lub fallback
export function readJsonSafe(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) {
      logDebug("store", `readJsonSafe: file not found ${filePath}`);
      return fallback;
    }
    const raw = fs.readFileSync(filePath, "utf8");
    logInfo("store", "readJsonSafe success", filePath);
    return JSON.parse(raw);
  } catch (err) {
    logError("store", "readJsonSafe failed", { filePath, error: err.message });
    logWarn("store", "Nie można odczytać pliku JSON");
    return fallback;
  }
}

// ─── writeJsonSafe() – zapisuje dane jako JSON do pliku z obsługą błędów
//   @param {string} filePath – ścieżka do pliku
//   @param {any} data – dane do zapisania
//   @returns {boolean} true jeśli zapis się powiódł
export function writeJsonSafe(filePath, data) {
  try {
    const json = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, json, "utf8");
    logInfo("store", "writeJsonSafe success", filePath);
    return true;
  } catch (err) {
    logError("store", "writeJsonSafe failed", { filePath, error: err.message });
    logWarn("store", "Nie można zapisać pliku JSON");
    return false;
  }
}