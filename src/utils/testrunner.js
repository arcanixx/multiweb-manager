// =============================================================================
// FILE: testrunner.js
// PATH: src/utils/testrunner.js
// VERSION: 0.0.3
// PURPOSE: Silnik do uruchamiania testów jednostkowych i integracyjnych – asercje, liczniki wyników i raportowanie PASS/FAIL.
// FUNCTIONS: initTestResults, assert, assertThrows, getTestResults, logTestSummary
// DEPENDS ON: logger.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logInfo as log, logError } from "./logger.js";
import { ICONS } from '../utils/icons.js';

let passCount = 0;
let failCount = 0;
const results = [];

// ─── initTestResults() – resetuje liczniki testów do zera
export function initTestResults() {
  passCount = 0;
  failCount = 0;
  results.length = 0;
}

// ─── assert() – asercja z logowaniem PASS/FAIL
export function assert(name, condition, detail = '') {
  if (condition) {
    passCount++;
    results.push({ name, status: 'PASS', detail });
    log("engine", `  ${ICONS.TEST_PASS} PASS: ${name}`);
  } else {
    failCount++;
    results.push({ name, status: 'FAIL', detail });
    logError("engine", `  ${ICONS.TEST_FAIL} FAIL: ${name}${detail ? ' – ' + detail : ''}`);
  }
}

// ─── assertThrows() – asercja sprawdzająca czy funkcja rzuci wyjątek
export function assertThrows(name, fn) {
  try {
    fn();
    failCount++;
    results.push({ name, status: 'FAIL', detail: 'Expected throw, got none' });
    logError("engine", `  ${ICONS.TEST_FAIL} FAIL: ${name} – expected throw`);
  } catch (e) {
    passCount++;
    results.push({ name, status: 'PASS', detail: e.message });
    log("engine", `  ${ICONS.TEST_PASS} PASS: ${name} (threw as expected)`);
  }
}

// ─── getTestResults() – zwraca aktualne wyniki testów
export function getTestResults() {
  return { passCount, failCount, total: passCount + failCount, results };
}

// ─── logTestSummary() – wyświetla podsumowanie testów w konsoli
export function logTestSummary() {
  const total = passCount + failCount;
  log("engine", `\n${ICONS.TEST} RESULTS: ${passCount}/${total} passed, ${failCount} failed`);
  if (failCount > 0) {
    logError("engine", "FAILED TESTS:");
    results.filter(r => r.status === 'FAIL').forEach(r =>
      logError("engine", `  • ${r.name}${r.detail ? ': ' + r.detail : ''}`)
    );
  } else {
    log("engine", `${ICONS.SUCCESS} All tests passed!`);
  }
  return { passCount, failCount, total, results };
}