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

// ─── Verbose mode – activated by --verbose flag in process.argv ───────────────
const VERBOSE = process.argv.includes('--verbose');
if (VERBOSE) {
  setDebugMode(true);
  logInfo('ui', 'testsLoader: --verbose mode active');
}

// ─── Files excluded from test discovery ──────────────────────────────────────
// Wykluczamy tylko orchestrator i utility – wszystkie TestRunner_*.js są ładowane
const EXCLUDED = new Set([
  'TestRunner.js',   // orchestrator – nie zawiera testów
  'testUtils.js',    // utility – nie zawiera testów
]);

// =============================================================================
// loadAndRunAllTests() – scans tests/ for TestRunner_*.js modules, dynamically
//   imports each one, calls their run*() function and aggregates results.
//   @param {object} options – passed through to each test module
//   @returns {Promise<{ passed: number, failed: number, results: object }>}
//
// UWAGA: results[fileName].error zawiera komunikat błędu dla testów które failują
//        z przyczyn technicznych (import, błąd wykonania) lub gdy testy same
//        zwrócą error. Pozwala to na filtrowanie w build_structure.py.
// =============================================================================
export async function loadAndRunAllTests(options = {}) {
  const testsDir = join(__dirname, '..', '..', 'tests');

  // ── Read test file list ────────────────────────────────────────────────────
  let files;
  try {
    files = readdirSync(testsDir).filter(
      (f) => f.startsWith('TestRunner_') && f.endsWith('.js')
    );
  } catch (err) {
    logError('ui', 'testsLoader: cannot read tests directory', err.message);
    return { passed: 0, failed: 0, results: {} };
  }

  if (VERBOSE) logInfo('ui', `testsLoader: found ${files.length} test files`, files);

  let totalPassed = 0;
  let totalFailed = 0;
  const results = {};

  for (const file of files) {
    if (EXCLUDED.has(file)) {
      if (VERBOSE) logInfo('ui', `testsLoader: skipping ${file} (excluded)`);
      continue;
    }

    const filePath = pathToFileURL(join(testsDir, file)).href;

    // ── Dynamic import with precise error handling ─────────────────────────
    let module;
    try {
      module = await import(filePath);
    } catch (importErr) {
      const isSyntax = importErr instanceof SyntaxError;
      const errorMsg = importErr.message || String(importErr);
      logError('ui', `testsLoader: cannot load ${file} — ${isSyntax ? 'syntax error' : 'runtime error'}`, errorMsg);
      if (VERBOSE) logError('ui', `testsLoader: stack for ${file}:`, importErr.stack);
      // Zapisujemy błąd – przyda się przy filtrowaniu testów wymagających Electrona
      results[file] = { passed: 0, failed: 0, error: `import failed: ${errorMsg}` };
      totalFailed++;
      continue;
    }

    // ── Find exported run*() function ─────────────────────────────────────
    // Szukamy dowolnej funkcji eksportowanej której nazwa zaczyna się od 'run'
    // (np. runNotepadTests, runTasksTests, runAdBlockerTests)
    const runFn = Object.values(module).find(
      (v) => typeof v === 'function' && v.name?.startsWith('run')
    );

    if (!runFn) {
      logWarn('ui', `testsLoader: no run*() function found in ${file} — skipping`);
      results[file] = { passed: 0, failed: 0, error: 'no run*() function' };
      continue;
    }

    // ── Run tests ─────────────────────────────────────────────────────────
    try {
      if (VERBOSE) logInfo('ui', `testsLoader: running ${file} → ${runFn.name}()`);
      const result = await runFn({ ...options, verbose: VERBOSE });
      
      // Inicjalizacja wyników dla tego pliku
      const fileResults = {
        passed: result?.passed || 0,
        failed: result?.failed || 0
      };
      
      // === KRYTYCZNE: przekazujemy błędy do build_structure.py ===
      // Dzięki temu skrypt Python może odfiltrować testy wymagające Electrona
      // i oznaczyć je jako 'skipped' zamiast 'failed'
      
      // Sprawdź czy result bezpośrednio zawiera error
      if (result?.error) {
        fileResults.error = result.error;
      } 
      // Sprawdź czy result zawiera details z błędami (format z testrunner.js)
      else if (result?.failed > 0 && result?.details) {
        const errors = result.details
          .filter(d => !d.ok)
          .map(d => d.error || d.details || 'unknown error');
        if (errors.length) {
          fileResults.error = errors.join('; ');
        }
      } 
      // Fallback: testy failują bez szczegółów
      else if (result?.failed > 0 && !result?.error) {
        fileResults.error = `${result.failed} test(s) failed (no details)`;
      }
      
      results[file] = fileResults;
      totalPassed += result?.passed || 0;
      totalFailed += result?.failed || 0;
      
      logInfo('ui', `testsLoader: ${file} — ✅ ${result?.passed || 0} / ❌ ${result?.failed || 0}`);
      
      // W trybie verbose pokaż szczegóły failed testów
      if (VERBOSE && result?.failed > 0 && result?.details) {
        result.details.filter(d => !d.ok).forEach(d => {
          logError('ui', `  ❌ ${d.name}: ${d.details || d.error || 'failed'}`);
        });
      }
      
    } catch (runErr) {
      const errorMsg = runErr.message || String(runErr);
      logError('ui', `testsLoader: error running ${file}`, errorMsg);
      if (VERBOSE) logError('ui', `testsLoader: stack for ${file}:`, runErr.stack);
      results[file] = { passed: 0, failed: 0, error: `runtime error: ${errorMsg}` };
      totalFailed++;
    }
  }

  logInfo('ui', `testsLoader: done — ✅ ${totalPassed} / ❌ ${totalFailed} across ${files.length} modules`);
  return { passed: totalPassed, failed: totalFailed, results };
}

// =============================================================================
// END OF FILE
// =============================================================================