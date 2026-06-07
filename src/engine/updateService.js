// =============================================================================
// FILE: updateService.js
// PATH: src/engine/updateService.js
// VERSION: 0.0.3
// PURPOSE: Placeholder sprawdzania aktualizacji (UpdateChecker UI → docelowo API).
// FUNCTIONS: checkForUpdates
// DEPENDS ON: logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logInfo, logError } from "../utils/logger.js";

// ─── checkForUpdates() – Sprawdza dostępność nowej wersji aplikacji; obecnie działa jako zaślepka (mockup) zwracająca brak aktualizacji
export async function checkForUpdates() {
  try {
    logInfo('engine', "updateService: checkForUpdates — coming soon");
    return { available: false, version: "0.0.3", message: "Coming soon" };
  } catch (err) {
    logError('engine', "updateService: checkForUpdates failed", err.message);
    return { available: false, error: err.message };
  }
}
