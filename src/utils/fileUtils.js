// =============================================================================
// FILE: fileUtils.js
// PATH: src/utils/fileUtils.js
// VERSION: 0.0.3
// PURPOSE: Helpers for reading/writing JSON files safely.
//          - readJsonSafe(filePath, fallback) – zwraca fallback gdy błąd/brak
//          - writeJsonSafe(filePath, data)    – zapisuje JSON z wcięciem 2
//          Używane przez wszystkie *Store.js w src/core/
// DEPENDS ON: fs
// =============================================================================

import fs from "fs";

// ----------------------------------------------------------------
// readJsonSafe() – odczytuje JSON z pliku, zwraca fallback przy błędzie
// ----------------------------------------------------------------
export function readJsonSafe(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// ----------------------------------------------------------------
// writeJsonSafe() – zapisuje dane jako JSON do pliku (wcięcie 2 spacje)
// ----------------------------------------------------------------
export function writeJsonSafe(filePath, data) {
  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, json, "utf8");
}

// =============================================================================
// END OF FILE
// =============================================================================
