// =============================================================================
// FILE: TestRunner.js
// PATH: tests/TestRunner.js
// VERSION: 0.0.3
// PURPOSE: Orchestrator testów przy starcie (debugMode + FEATURES.startupTests).
//          Uruchamia zarejestrowane testy i loguje wyniki.
// FUNCTIONS: runAllTests
// DEPENDS ON: logger.js, src/data/icons.js
// UWAGA: Nie usuwaj komentarzy — opisują przeznaczenie funkcji i sekcji.
// =============================================================================

import { logInfo, logError } from "../src/utils/logger.js";
import { ICONS } from "src/utils/icons.js";

// ----------------------------------------------------------------
// Lista testów startowych — dodawaj tutaj kolejne test-runnery
// ----------------------------------------------------------------
const tests = [
  {
    name: "config load",
    run: async () => {
      const { DEFAULT_SETTINGS } = await import("../src/config.js");
      // Weryfikuje, że konfiguracja domyślna jest dostępna i ma wymagane klucze
      return !!DEFAULT_SETTINGS?.language && !!DEFAULT_SETTINGS?.theme;
    }
  },
  {
    name: "icons registry",
    run: async () => {
      // Weryfikuje, że rejestr ikon zawiera kluczowe wpisy
      return !!ICONS.TEST_PASS && !!ICONS.TEST_FAIL && !!ICONS.SETTINGS;
    }
  }
];

// ----------------------------------------------------------------
// runAllTests() – uruchamia wszystkie testy i zwraca podsumowanie
//   options.logToFile  – czy logować do pliku (przyszłość)
//   options.verbose    – czy logować każdy test
// ----------------------------------------------------------------
export async function runAllTests(options = {}) {
  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    try {
      const ok = await t.run();
      const result = { ok: !!ok, name: t.name };

      // TEST_PASS = ✅, TEST_FAIL = ❌ z icons.js
      logInfo(`${result.ok ? ICONS.TEST_PASS : ICONS.TEST_FAIL} ${result.name}`);

      if (result.ok) passed++;
      else failed++;
    } catch (err) {
      logError(`${ICONS.TEST_FAIL} ${t.name}`, err);
      failed++;
    }
  }

  logInfo(`Tests: ${passed} passed, ${failed} failed`);
  return { passed, failed, skipped: false };
}

// =============================================================================
// END OF FILE
// =============================================================================
