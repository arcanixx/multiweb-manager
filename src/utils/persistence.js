// =============================================================================
// FILE: persistence.js
// PATH: src/utils/persistence.js
// VERSION: 0.0.3
// PURPOSE: Wspólne operacje I/O dla plików JSON – odczyt, zapis i zarządzanie ścieżkami w katalogu userData Electrona.
// FUNCTIONS: getUserDataPath, readJsonFile, writeJsonFile
// DEPENDS ON: fs, path, electron, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import fs from 'fs';
import path from 'path';
import { app } from 'electron';

import { logError, logInfo } from '../utils/logger.js';

// ─── getUserDataPath() – Wyznacza i zwraca pełną ścieżkę do zasobu w userData Electrona
//   @param {...string} segments – segmenty ścieżki do połączenia
//   @returns {string}
export function getUserDataPath(...segments) {
  try {
    return path.join(app.getPath('userData'), ...segments);
  } catch (err) {
    logError('store', 'persistence.getUserDataPath failed', err.message);
    return path.join('userData', ...segments);
  }
}

// ─── readJsonFile() – Odczytuje i parsuje plik JSON; przy braku pliku lub błędzie zwraca fallback
//   Pozostaje synchroniczny – wywoływany przy starcie aplikacji (single-thread, brak UI)
//   @param {string} filePath – ścieżka do pliku JSON
//   @param {any}    fallback – wartość domyślna przy błędzie lub braku pliku
//   @returns {any}
export function readJsonFile(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    logError('store', 'persistence.readJsonFile failed', { filePath, error: err.message });
    return fallback;
  }
}

// ─── writeJsonFile() – Serializuje dane do JSON i zapisuje atomowo (temp → rename)
//   ATOMIC SAVE: zapisuje do pliku .tmp, następnie rename → zapobiega korupcji
//   przy przerwaniu zapisu (crash, zamknięcie systemu).
//   Async – nie blokuje wątku main process przy dużych plikach.
//   @param {string} filePath – ścieżka docelowego pliku JSON
//   @param {any}    data     – dane do zapisu
//   @returns {Promise<boolean>} true przy sukcesie, false przy błędzie
export async function writeJsonFile(filePath, data) {
  const tempPath = `${filePath}.tmp`;
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const serialized = JSON.stringify(data, null, 2);

    // Zapisz do pliku tymczasowego, następnie atomowy rename
    await fs.promises.writeFile(tempPath, serialized, 'utf8');
    await fs.promises.rename(tempPath, filePath);

    logInfo('store', 'persistence.writeJsonFile success', { filePath });
    return true;
  } catch (err) {
    logError('store', 'persistence.writeJsonFile failed', { filePath, error: err.message });
    // Spróbuj posprzątać plik tymczasowy przy błędzie
    try { fs.unlinkSync(tempPath); } catch { /* ignoruj jeśli .tmp nie istnieje */ }
    return false;
  }
}
