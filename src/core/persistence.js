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

// ─── getUserDataPath() – Wyznacza i zwraca pełną ścieżkę bezwzględną do zasobu w katalogu userData aplikacji Electron, łącząc podane segmenty ścieżki
//   @param {...string} segments – Segmenty ścieżki do połączenia
//   @returns {string} Pełna ścieżka do pliku w katalogu danych użytkownika
export function getUserDataPath(...segments) {
  try {
    return path.join(app.getPath("userData"), ...segments);
  } catch (err) {
    logError("store", "persistence.getUserDataPath failed", err.message);
    // Fallback path for testing environments
    return path.join("userData", ...segments);
  }
}

// ─── readJsonFile() – Odczytuje z dysku i parsuje plik w formacie JSON; w przypadku braku pliku lub błędu parsowania zwraca przekazaną wartość domyślną (fallback)
//   @param {string} filePath – Ścieżka do pliku JSON
//   @param {any} fallback – Wartość zwracana w przypadku błędu lub braku pliku
//   @returns {any} Sparsowana zawartość pliku lub przekazany fallback
export function readJsonFile(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    logError("store", "persistence.readJsonFile failed", { filePath, error: err.message });
    return fallback;
  }
}

// ─── writeJsonFile() – Serializuje przekazane dane do formatu JSON i zapisuje je w pliku pod wskazaną ścieżką, tworząc w razie potrzeby wymagane foldery nadrzędne
//   @param {string} filePath – Ścieżka docelowego pliku JSON
//   @param {any} data – Dane do zserializowania i zapisu
//   @returns {boolean} True, jeśli operacja zapisu się powiodła, w przeciwnym razie false
export function writeJsonFile(filePath, data) {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    logInfo("store", "persistence.writeJsonFile success", { filePath });
    return true;
  } catch (err) {
    logError("store", "persistence.writeJsonFile failed", { filePath, error: err.message });
    return false;
  }
}
