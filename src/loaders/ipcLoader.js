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

// ─── loadAllIpcHandlers() – Automatycznie skanuje katalog src/ipc/ w poszukiwaniu plików z prefiksem ipcMainHandlers_ i dynamicznie importuje każdy z nich, inicjalizując powiązane handlery IPC w procesie głównym
export async function loadAllIpcHandlers() {
  const ipcDir = join(__dirname, "..", "ipc");
  let files;
  try {
    files = readdirSync(ipcDir).filter(
      (f) => f.startsWith("ipcMainHandlers_") && f.endsWith(".js")
    );
  } catch (err) {
    logError('ipc', "ipcLoader: cannot read ipc directory", err.message);
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
      logInfo('ipc', `ipcLoader: loaded ${file}`);
    } catch (err) {
      errors.push({ file, error: err.message });
      logError('ipc', `ipcLoader: failed to load ${file}`, err.message);
    }
  }

  logInfo('ipc', `ipcLoader: ${loaded.length} handlers loaded, ${skipped.length} skipped, ${errors.length} errors`);
  return { loaded, skipped, errors };
}