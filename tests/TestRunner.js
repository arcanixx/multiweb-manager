// =============================================================================
// FILE: TestRunner.js
// PATH: tests/TestRunner.js
// VERSION: 0.0.3
// PURPOSE: Orchestrator testów przy starcie (gdy debugMode + FEATURES.startupTests).
// FUNCTIONS: runAllTests
// DEPENDS ON: logger.js (main)
// =============================================================================

import { logInfo } from "../src/utils/logger.js";

export async function runAllTests() {
  logInfo("TestRunner: startup tests skipped (stub v0.0.3)");
  return { passed: 0, failed: 0, skipped: true };
}
