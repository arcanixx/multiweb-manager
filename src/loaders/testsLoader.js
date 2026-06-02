// =============================================================================
// FILE: testsLoader.js
// PATH: src/loaders/testsLoader.js
// VERSION: 0.0.3
// PURPOSE: Dynamicznie ładuje i uruchamia wszystkie testy z tests/TestRunner_*.js. Eliminuje konieczność ręcznego importowania testów w TestRunner.js. Pomija: TestRunner.js (orchestrator), testUtils.js, index.js.
// FUNCTIONS: loadAndRunAllTests
// DEPENDS ON: komponenty z folderu tests/
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { logInfo, logError } from "../utils/logger.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
// Pliki pomijane — nie są modułami testów, tylko infrastrukturą
const EXCLUDED = new Set([
  "TestRunner.js",   // orchestrator — sam siebie nie testuje
  "testUtils.js",    // shared utils
]);

// ─── loadAndRunAllTests() – Skanuje katalog tests/ w poszukiwaniu modułów testowych TestRunner_*.js, dynamicznie je wczytuje i wywołuje ich funkcje testowe, a następnie agreguje i zwraca sumaryczny wynik
export async function loadAndRunAllTests(options = {}) {
  const testsDir = join(__dirname, "..", "..", "tests");
  let files;
  try {
    files = readdirSync(testsDir).filter(
      (f) => f.startsWith("TestRunner_") && f.endsWith(".js")
    );
  } catch (err) {
    logError('ui', "testsLoader: cannot read tests directory", err.message);
    return { passed: 0, failed: 0, results: {} };
  }
  let totalPassed = 0;
  let totalFailed = 0;
  const results = {};
  for (const file of files) {
    if (EXCLUDED.has(file)) continue;
    try {
      const filePath = pathToFileURL(join(testsDir, file)).href;
      const module = await import(filePath);
      // Każdy TestRunner_*.js eksportuje funkcję run*Tests()
      // Szukamy pierwszej eksportowanej funkcji zaczynającej się od "run"
      const runFn = Object.values(module).find(
        (v) => typeof v === "function" && v.name?.startsWith("run")
      );

      if (!runFn) {
        logError('ui', `testsLoader: no run* function found in ${file}`);
        results[file] = { passed: 0, failed: 0, error: "no run function" };
        continue;
      }

      logInfo('ui', `testsLoader: running ${file} → ${runFn.name}()`);
      const result = await runFn(options);
      results[file] = result;
      totalPassed += result?.passed || 0;
      totalFailed += result?.failed || 0;

    } catch (err) {
      logError('ui', `testsLoader: failed to load/run ${file}`, err.message);
      results[file] = { passed: 0, failed: 0, error: err.message };
      totalFailed++;
    }
  }

  logInfo('ui', `testsLoader: total ${totalPassed} passed, ${totalFailed} failed across ${files.length} modules`);
  return { passed: totalPassed, failed: totalFailed, results };
}