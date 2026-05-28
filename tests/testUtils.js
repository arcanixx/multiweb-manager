// =============================================================================
// FILE: testUtils.js
// PATH: tests/testUtils.js
// VERSION: 0.0.3
// PURPOSE: Wspólne funkcje dla wszystkich testów (runner, logowanie)
// FUNCTIONS: runTests
// DEPENDS ON: icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ICONS } from '../src/utils/icons.js';
export async function runTests(moduleName, testFunctions) {
  console.log(`\n${ICONS.TEST} Running ${moduleName} Tests...`);
  let passed = 0;
  let failed = 0;
  for (const { name, run } of testFunctions) {
    try {
      const result = await run();
      if (result.ok) {
        console.log(`${ICONS.TEST_PASS} ${name}`);
        passed++;
      } else {
        console.log(`${ICONS.TEST_FAIL} ${name} – ${result.details || 'failed'}`);
        failed++;
      }
    } catch (err) {
      console.log(`${ICONS.TEST_FAIL} ${name} – crashed: ${err.message}`);
      failed++;
    }
  }
  console.log(`\n${ICONS.LOGS} ${moduleName} Tests: ${passed} passed, ${failed} failed\n`);
  return { passed, failed };
}
