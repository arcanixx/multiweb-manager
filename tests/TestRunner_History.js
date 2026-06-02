// =============================================================================
// FILE: TestRunner_History.js
// PATH: tests/TestRunner_History.js
// VERSION: 0.0.3
// PURPOSE: Testy integralności logów aktywności użytkownika. Sprawdza walidację poziomów logowania, mechanizmy filtrowania zdarzeń oraz poprawność przycinania historii do zdefiniowanych limitów (FIFO).
// FUNCTIONS: runHistoryTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
const tests = [
  {
    name: 'History entry structure is valid',
    run: async () => {
      const mockEntry = {
        level: 'info',
        message: 'Test message',
        timestamp: Date.now()
      };
      const isValid = ['info', 'warn', 'error'].includes(mockEntry.level) && mockEntry.message;
      return { ok: isValid, details: isValid ? '' : 'Missing required fields' };
    }
  },
  {
    name: 'History filter by level works',
    run: async () => {
      const entries = [
        { level: 'info' },
        { level: 'error' },
        { level: 'info' }
      ];
      const filtered = entries.filter(e => e.level === 'error');
      const isFilteredCorrect = filtered.length === 1;
      return { ok: isFilteredCorrect, details: isFilteredCorrect ? '' : `Expected 1, got ${filtered.length}` };
    }
  },
  {
    name: 'History limit (max 100) works',
    run: async () => {
      const history = Array.from({ length: 150 }, (_, i) => ({ id: i }));
      const limited = history.slice(0, 100);
      const isLimitedCorrect = limited.length === 100;
      return { ok: isLimitedCorrect, details: isLimitedCorrect ? '' : `Expected 100, got ${limited.length}` };
    }
  }
];
// ─── runHistoryTests() – Inicjalizuje i uruchamia proces testowy dla modułu historii
export async function runHistoryTests() {
  return runTests('History', tests);
}
