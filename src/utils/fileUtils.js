// =============================================================================
// FILE: fileUtils.js
// PATH: src/utils/fileUtils.js
// VERSION: 0.0.3
// PURPOSE: Bezpieczne operacje I/O dla plików JSON – odczyt z fallbackiem i zapis z wyfiltrowaniem danych (readJsonSafe, writeJsonSafe).
// FUNCTIONS: readJsonSafe, writeJsonSafe
// DEPENDS ON: fs
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import fs from "fs";
import { logInfo, logError, logWarn, logDebug } from './logger.js';

// ─── readJsonSafe() – odczytuje JSON z pliku, zwraca fallback przy błędzie
//   @param {string} filePath – ścieżka do pliku JSON
//   @param {any} fallback – wartość zwracana w przypadku błędu
//   @returns {any} sparsowane dane lub fallback

// ─── writeJsonSafe() – zapisuje dane jako JSON do pliku z obsługą błędów
//   @param {string} filePath – ścieżka do pliku
//   @param {any} data – dane do zapisania
//   @returns {boolean} true jeśli zapis się powiódł

export function readJsonSafe(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) {
      logDebug(`readJsonSafe: file not found ${filePath}`);
      return fallback;
    }
    const raw = fs.readFileSync(filePath, "utf8");
    logInfo("readJsonSafe", filePath);
    return JSON.parse(raw);
  } catch (err) {
    logError("readJsonSafe failed", { filePath, err });
    logWarn("Nie można odczytać pliku JSON");
    return fallback;
  }
}

export function writeJsonSafe(filePath, data) {
  try {
    const json = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, json, "utf8");
    logInfo("writeJsonSafe", filePath);
    return true;
  } catch (err) {
    logError("writeJsonSafe failed", { filePath, err });
    logWarn("Nie można zapisać pliku JSON");
    return false;
  }
}
