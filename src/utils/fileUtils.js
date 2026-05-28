// =============================================================================
// FILE: fileUtils.js
// PATH: src/utils/fileUtils.js
// VERSION: 0.0.3
// PURPOSE: Helpers for reading/writing JSON files safely.
// FUNCTIONS: readJsonSafe, writeJsonSafe
// DEPENDS ON: fs
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
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

