// =============================================================================
// FILE: updateService.js
// PATH: src/engine/updateService.js
// VERSION: 0.0.3
// PURPOSE: Placeholder sprawdzania aktualizacji (UpdateChecker UI → docelowo API).
// FUNCTIONS: checkForUpdates
// DEPENDS ON: logger.js
// =============================================================================

import { logInfo } from "../utils/logger.js";

export async function checkForUpdates() {
  logInfo("updateService: checkForUpdates — coming soon");
  return { available: false, version: "0.0.3", message: "Coming soon" };
}
