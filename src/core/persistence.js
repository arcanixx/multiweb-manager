// =============================================================================
// FILE: persistence.js
// PATH: src/core/persistence.js
// VERSION: 0.0.3
// PURPOSE: Wspólne operacje I/O dla plików JSON – odczyt, zapis i zarządzanie ścieżkami w katalogu userData Electrona.
// FUNCTIONS: getUserDataPath, readJsonFile, writeJsonFile
// DEPENDS ON: fs, path, electron, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import fs from "fs";
import path from "path";
import { app } from "electron";
import { logError, logInfo } from "../utils/logger.js";

// ─── getUserDataPath() – zwraca ścieżkę do katalogu userData Electrona
//   @param {...string} segments – segmenty ścieżki do połączenia
//   @returns {string} pełna ścieżka do pliku w userData
export function getUserDataPath(...segments) {
  try {
    return path.join(app.getPath("userData"), ...segments);
  } catch (err) {
    logError("persistence.getUserDataPath failed", err);
    // Fallback path for testing environments
    return path.join("userData", ...segments);
  }
}
// ─── readJsonFile() – odczytuje i parsuje plik JSON z fallbackiem
//   @param {string} filePath – ścieżka do pliku JSON
//   @param {any} fallback – wartość zwracana w przypadku błędu
//   @returns {any} sparsowana zawartość pliku lub fallback
export function readJsonFile(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    logError("persistence.readJsonFile", { filePath, err });
    return fallback;
  }
}
// ─── writeJsonFile() – zapisuje dane jako sformatowany JSON
//   @param {string} filePath – ścieżka docelowego pliku JSON
//   @param {any} data – dane do zapisania (zostaną zserializowane)
//   @returns {boolean} true jeśli zapis się powiódł, false w przypadku błędu
export function writeJsonFile(filePath, data) {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    logInfo("persistence.writeJsonFile success", { filePath });
    return true;
  } catch (err) {
    logError("persistence.writeJsonFile", { filePath, err });
    return false;
  }
}