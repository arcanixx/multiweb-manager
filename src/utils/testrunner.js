// =============================================================================
// FILE: testrunner.js
// PATH: src/utils/testrunner.js
// VERSION: 0.0.3
// PURPOSE: Moduł pomocniczy dla testów – asercje i logowanie.
// FUNCTIONS: initTestResults, assert, assertThrows, getTestResults, logTestSummary
// DEPENDS ON: logger.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logInfo as log, logError, logWarn, logDebug } from './utils/logger.js';
import { ICONS } from '../utils/icons.js';

let passCount = 0;
let failCount = 0;
const results = [];

// ─── initTestResults() – resetuje liczniki testów do zera
//   @returns {void}

// ─── initTestResults() – TODO: opis funkcji
export function initTestResults() {
  passCount = 0;
  failCount = 0;
  results.length = 0;
}

// ─── assert() – asercja z logowaniem PASS/FAIL
//   @param {string} name – nazwa asercji
//   @param {boolean} condition – warunek do sprawdzenia
//   @param {string} detail – dodatkowy opis błędu
//   @returns {void}

// ─── assert() – TODO: opis funkcji
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

// ─── assertThrows() – asercja sprawdzająca czy funkcja rzuci wyjątek
//   @param {string} name – nazwa asercji
//   @param {Function} fn – funkcja do wykonania
//   @returns {void}

// ─── assertThrows() – TODO: opis funkcji
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

// ─── getTestResults() – zwraca aktualne wyniki testów
//   @returns {Object} – obiekt z passCount, failCount, total, results

// ─── getTestResults() – TODO: opis funkcji
export function getTestResults() {
  return { passCount, failCount, total: passCount + failCount, results };
}

// ─── logTestSummary() – wyświetla podsumowanie testów w konsoli
//   @returns {Object} – wyniki testów

// ─── logTestSummary() – TODO: opis funkcji
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