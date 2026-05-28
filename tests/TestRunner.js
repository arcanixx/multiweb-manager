// =============================================================================
// FILE: TestRunner.js
// PATH: tests/TestRunner.js
// VERSION: 0.0.3
// PURPOSE: Orchestrator testów – uruchamia wszystkie TestRunner_*.js
// FUNCTIONS: runAllTests
// DEPENDS ON: logger.js, icons.js, logWriter.js, testsLoader.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logInfo, logError } from '../src/utils/logger.js';
import { ICONS } from '../src/utils/icons.js';
import { initLogWriter } from '../src/utils/logWriter.js';
// Import wszystkich testów loaderem
import { loadAndRunAllTests } from '../src/loaders/testsLoader.js';
export async function runAllTests(options = {}) {
  // Inicjalizacja logWritera (tylko raz)
  await initLogWriter();
  logInfo(`${ICONS.DEBUG} Running tests via loader...`);
  const { passed, failed, results } = await loadAndRunAllTests(options);
  logInfo(`${ICONS.TEST_PASS} Tests completed: ${passed} passed, ${failed} failed`);
  return { passed, failed, results };
};
// Automatyczne uruchomienie jeśli debugMode
if (typeof window !== 'undefined' && window.electronAPI?.getDebugMode) {
  window.electronAPI.getDebugMode().then((debugMode) => {
    if (debugMode) {
      logInfo('🐛 Debug mode enabled – running tests...');
      runAllTests();
    }
  });
}

