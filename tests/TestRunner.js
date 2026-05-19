// =============================================================================
// FILE: TestRunner.js
// PATH: tests/TestRunner.js
// VERSION: 0.0.3
// PURPOSE: Orchestrator testów przy starcie (debugMode + FEATURES.startupTests).
// FUNCTIONS: runAllTests
// DEPENDS ON: logger.js, ui/icons.js (ICONS.testPass / testFail)
// =============================================================================

import { logInfo, logError } from "../src/utils/logger.js";
import { ICONS } from "../src/ui/icons.js";

const tests = [
  { name: "config load", run: async () => {
    const { DEFAULT_SETTINGS } = await import("../src/config.js");
    return !!DEFAULT_SETTINGS?.language;
  }},
  { name: "icons registry", run: async () => !!ICONS.TEST_PASS && !!ICONS.TEST_FAIL }
];

export async function runAllTests() {
  let passed = 0;
  let failed = 0;
  for (const t of tests) {
    try {
      const ok = await t.run();
      const result = { ok: !!ok, name: t.name };
      logInfo(`${result.ok ? ICONS.testPass : ICONS.testFail} ${result.name}`);
      if (result.ok) passed++; else failed++;
    } catch (err) {
      logError(`${ICONS.testFail} ${t.name}`, err);
      failed++;
    }
  }
  return { passed, failed, skipped: false };
}
