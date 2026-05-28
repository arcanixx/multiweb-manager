// =============================================================================
// FILE: ipcLoader.js
// PATH: src/loaders/ipcLoader.js
// VERSION: 0.0.3
// PURPOSE: Dynamicznie ładuje wszystkie handlery IPC z src/ipc/. Eliminuje konieczność ręcznego importowania każdego pliku w main.js. Pomija: ipcLegacyBridge.js (ładowany osobno jako most legacy).
// FUNCTIONS: loadAllIpcHandlers
// DEPENDS ON: komponenty z folderu ipc/
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { logInfo, logError } from "../utils/logger.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
// Pliki pomijane przy automatycznym ładowaniu
const EXCLUDED = new Set([
  "ipcLegacyBridge.js",  // ładowany ręcznie w main.js (legacy kanały)
]);
// ----------------------------------------------------------------
// loadAllIpcHandlers() – skanuje src/ipc/ i importuje każdy handler
//   Każdy plik rejestruje handlery przez side-effect przy imporcie.
//   Wywołaj raz w main.js przed app.whenReady().
// ----------------------------------------------------------------
export async function loadAllIpcHandlers() {
  const ipcDir = join(__dirname, "..", "ipc");
  let files;
  try {
    files = readdirSync(ipcDir).filter(
      (f) => f.startsWith("ipcMainHandlers_") && f.endsWith(".js")
    );
  } catch (err) {
    logError("ipcLoader: cannot read ipc directory", err.message);
    return { loaded: [], skipped: [], errors: [] };
  }
  const loaded = [];
  const skipped = [];
  const errors = [];
  for (const file of files) {
    if (EXCLUDED.has(file)) {
      skipped.push(file);
      continue;
    }
    try {
      const filePath = pathToFileURL(join(ipcDir, file)).href;
      await import(filePath);
      loaded.push(file);
      logInfo(`ipcLoader: loaded ${file}`);
    } catch (err) {
      errors.push({ file, error: err.message });
      logError(`ipcLoader: failed to load ${file}`, err.message);
    }
  }

  logInfo(`ipcLoader: ${loaded.length} handlers loaded, ${skipped.length} skipped, ${errors.length} errors`);
  return { loaded, skipped, errors };
}