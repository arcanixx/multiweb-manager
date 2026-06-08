// =============================================================================
// FILE: testsLoader.js
// PATH: src/loaders/testsLoader.js
// VERSION: 0.0.3
// PURPOSE: Dynamicznie ładuje i uruchamia wszystkie testy z tests/TestRunner_*.js.
//          Eliminuje konieczność ręcznego importowania testów w TestRunner.js.
//          Pomija: TestRunner.js (orchestrator), testUtils.js.
//          Obsługuje flagę --verbose (process.argv) do szczegółowego logowania.
// FUNCTIONS: loadAndRunAllTests
// DEPENDS ON: komponenty z folderu tests/
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { logInfo, logWarn, logError, setDebugMode } from '../utils/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const VERBOSE = process.argv.includes('--verbose');
if (VERBOSE) {
  setDebugMode(true);
  logInfo('ui', 'testsLoader: --verbose mode active');
}

const EXCLUDED = new Set([
  'TestRunner.js',
  'testUtils.js',
]);

// ─── Wzorce identyfikujące błąd importu spowodowany zależnością od Electron ──
// Pliki których import failuje z tych powodów są oznaczane jako skipped (nie fail).
const ELECTRON_IMPORT_PATTERNS = [
  'electron',
  "Named export 'app' not found",
  "The requested module 'electron'",
];

function isElectronImportError(msg) {
  return ELECTRON_IMPORT_PATTERNS.some(p => msg.includes(p));
}

// =============================================================================
// loadAndRunAllTests()
//
// Obsługa wyników:
//   Import OK, testy OK           → { passed, failed }
//   Import OK, testy failują      → { passed, failed, error: "N test(s) failed: name1, name2" }
//   Import FAIL (Electron)        → { passed:0, failed:0, skipped:true, original_error: msg }
//   Import FAIL (inny)            → { passed:0, failed:0, error: "import failed: msg" }
//
// UWAGA: skipped NIE wlicza się do totalFailed.
// failedNames (z runTests w testUtils.js) → trafiają do error: "N test(s) failed: name1, ..."
// =============================================================================
export async function loadAndRunAllTests(options = {}) {
  const testsDir = join(__dirname, '..', '..', 'tests');

  let files;
  try {
    files = readdirSync(testsDir).filter(
      (f) => f.startsWith('TestRunner_') && f.endsWith('.js')
    );
  } catch (err) {
    logError('ui', 'testsLoader: cannot read tests directory', err.message);
    return { passed: 0, failed: 0, results: {} };
  }

  if (VERBOSE) logInfo('ui', `testsLoader: found ${files.length} test files`);

  let totalPassed = 0;
  let totalFailed = 0;
  const results = {};

  for (const file of files) {
    if (EXCLUDED.has(file)) continue;

    const filePath = pathToFileURL(join(testsDir, file)).href;

    let module;
    try {
      module = await import(filePath);
    } catch (importErr) {
      const errorMsg = importErr.message || String(importErr);

      // Import zakończony błędem Electron → SKIPPED (nie liczy się jako fail w skrypcie)
      if (isElectronImportError(errorMsg)) {
        logWarn('ui', `testsLoader: skipping ${file} — requires Electron (expected in Node env)`);
        results[file] = { passed: 0, failed: 0, skipped: true, original_error: errorMsg };
        continue;  // NIE inkrementujemy totalFailed
      }

      // Inny błąd importu → liczymy jako fail
      logError('ui', `testsLoader: cannot load ${file}`, errorMsg);
      results[file] = { passed: 0, failed: 0, error: `import failed: ${errorMsg}` };
      totalFailed++;
      continue;
    }

    const runFn = Object.values(module).find(
      (v) => typeof v === 'function' && v.name?.startsWith('run')
    );

    if (!runFn) {
      logWarn('ui', `testsLoader: no run*() function found in ${file}`);
      results[file] = { passed: 0, failed: 0, error: 'no run*() function' };
      continue;
    }

    try {
      if (VERBOSE) logInfo('ui', `testsLoader: running ${file} → ${runFn.name}()`);
      const result = await runFn({ ...options, verbose: VERBOSE });

      const fileResults = {
        passed: result?.passed || 0,
        failed: result?.failed || 0,
      };

      // Dołącz nazwy failujących testów do error – widoczne w JSON bez (no details)
      // Format: "2 test(s) failed: NazwaTestu1, NazwaTestu2"
      if (result?.error) {
        fileResults.error = result.error;
      } else if (result?.failed > 0) {
        const names = result?.failedNames?.length ? result.failedNames.join(', ') : null;
        fileResults.error = names
          ? `${result.failed} test(s) failed: ${names}`
          : `${result.failed} test(s) failed (no details)`;
      }

      results[file] = fileResults;
      totalPassed += result?.passed || 0;
      totalFailed += result?.failed || 0;

      logInfo('ui', `testsLoader: ${file} — ✅ ${result?.passed || 0} / ❌ ${result?.failed || 0}`);

      if (VERBOSE && result?.failedNames?.length) {
        result.failedNames.forEach(name => logError('ui', `  ❌ ${name}`));
      }

    } catch (runErr) {
      const errorMsg = runErr.message || String(runErr);
      logError('ui', `testsLoader: error running ${file}`, errorMsg);
      results[file] = { passed: 0, failed: 0, error: `runtime error: ${errorMsg}` };
      totalFailed++;
    }
  }

  logInfo('ui', `testsLoader: done — ✅ ${totalPassed} / ❌ ${totalFailed} across ${files.length} modules`);
  return { passed: totalPassed, failed: totalFailed, results };
}
