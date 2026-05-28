// =============================================================================
// FILE: testRunner.js
// PATH: src/utils/testRunner.js
// VERSION: 0.0.3
// PURPOSE: Moduł pomocniczy dla testów – asercje i logowanie.
// FUNCTIONS: initTestResults, assert, assertThrows, getTestResults, logTestSummary
// DEPENDS ON: logger.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { log, error as logError } from './utils/logger.js';
import { ICONS } from '../utils/icons.js';
let passCount = 0;
let failCount = 0;
const results = [];
export function initTestResults() {
  passCount = 0;
  failCount = 0;
  results.length = 0;
}
export function assert(name, condition, detail = '') {
  if (condition) {
    passCount++;
    results.push({ name, status: 'PASS', detail });
    log(`  ${ICONS.TEST_PASS} PASS: ${name}`);
  } else {
    failCount++;
    results.push({ name, status: 'FAIL', detail });
    logError(`  ${ICONS.TEST_FAIL} FAIL: ${name}${detail ? ' – ' + detail : ''}`);
  }
}
export function assertThrows(name, fn) {
  try {
    fn();
    failCount++;
    results.push({ name, status: 'FAIL', detail: 'Expected throw, got none' });
    logError(`  ${ICONS.TEST_FAIL} FAIL: ${name} – expected throw`);
  } catch (e) {
    passCount++;
    results.push({ name, status: 'PASS', detail: e.message });
    log(`  ${ICONS.TEST_PASS} PASS: ${name} (threw as expected)`);
  }
}
export function getTestResults() {
  return { passCount, failCount, total: passCount + failCount, results };
}
export function logTestSummary() {
  const total = passCount + failCount;
  log(`\n${ICONS.TEST} RESULTS: ${passCount}/${total} passed, ${failCount} failed`);
  if (failCount > 0) {
    logError('FAILED TESTS:');
    results.filter(r => r.status === 'FAIL').forEach(r =>
      logError(`  • ${r.name}${r.detail ? ': ' + r.detail : ''}`)
    );
  } else {
    log(`${ICONS.SUCCESS} All tests passed!`);
  }
  return { passCount, failCount, total, results };
}