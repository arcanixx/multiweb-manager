// =============================================================================
// FILE:       testsLoader.js
// PATH:       src/loaders/testsLoader.js
// VERSION:    0.0.3
// PURPOSE:    Dynamicznie ładuje i uruchamia wszystkie testy z tests/TestRunner_*.js.
//             Eliminuje konieczność ręcznego importowania testów w TestRunner.js.
//             Pomija: TestRunner.js (orchestrator), testUtils.js, index.js.
//             Obsługuje flagę --verbose (process.argv) do szczegółowego logowania.
// FUNCTIONS:  loadAndRunAllTests
// DEPENDS ON: komponenty z folderu tests/
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { logInfo, logWarn, logError, setDebugMode } from '../utils/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Tryb verbose – aktywowany flagą --verbose w process.argv ─────────────────
//   Pozwala włączyć szczegółowe logowanie bez zmiany kodu
//   Przykład użycia: node TestRunner.js --verbose
const TRYB_VERBOSE = process.argv.includes('--verbose');
if (TRYB_VERBOSE) {
  setDebugMode(true);
  logInfo('ui', 'testsLoader: tryb --verbose aktywny — pełne logowanie włączone');
}

// ─── Pliki pomijane — nie są modułami testów, tylko infrastrukturą ────────────
const WYKLUCZONE = new Set([
  'TestRunner.js', // orchestrator — sam siebie nie testuje
  'testUtils.js',  // shared utils — nie zawiera testów
]);

// =============================================================================
// loadAndRunAllTests() – Skanuje katalog tests/ w poszukiwaniu modułów
//   testowych TestRunner_*.js, dynamicznie je wczytuje, wywołuje ich funkcje
//   testowe i agreguje sumaryczny wynik.
//
//   @param {object} opcje            – opcje przekazywane do każdego modułu testów
//   @returns {Promise<{ passed: number, failed: number, results: object }>}
// =============================================================================
export async function loadAndRunAllTests(opcje = {}) {
  const katalogTestów = join(__dirname, '..', '..', 'tests');

  // ── Odczyt listy plików testowych ──────────────────────────────────────────
  let pliki;
  try {
    pliki = readdirSync(katalogTestów).filter(
      (f) => f.startsWith('TestRunner_') && f.endsWith('.js')
    );
  } catch (błąd) {
    logError('ui', 'testsLoader: nie można odczytać katalogu tests/', błąd.message);
    return { passed: 0, failed: 0, results: {} };
  }

  if (TRYB_VERBOSE) {
    logInfo('ui', `testsLoader: znaleziono ${pliki.length} plików testowych`, pliki);
  }

  let łączniePrzeszło = 0;
  let łącznieNiePrzeszło = 0;
  const wyniki = {};

  // ── Iteracja po plikach testowych ─────────────────────────────────────────
  for (const plik of pliki) {
    if (WYKLUCZONE.has(plik)) {
      if (TRYB_VERBOSE) {
        logInfo('ui', `testsLoader: pominięto ${plik} (na liście wykluczeń)`);
      }
      continue;
    }

    const ścieżkaPlik = pathToFileURL(join(katalogTestów, plik)).href;

    // ── Dynamiczny import z dokładną obsługą błędów ──────────────────────────
    //   Każdy plik traktujemy osobno — błąd w jednym nie blokuje pozostałych
    let moduł;
    try {
      moduł = await import(ścieżkaPlik);
    } catch (błądImportu) {
      // Rozróżniamy błąd składni/parsowania od błędu runtime
      const czyBłądSkładni = błądImportu instanceof SyntaxError;
      logError(
        'ui',
        `testsLoader: nie można załadować ${plik} — ${czyBłądSkładni ? 'błąd składni' : 'błąd runtime'}`,
        błądImportu.message
      );
      if (TRYB_VERBOSE) {
        logError('ui', `testsLoader: stack trace dla ${plik}:`, błądImportu.stack);
      }
      wyniki[plik] = { passed: 0, failed: 0, error: `import failed: ${błądImportu.message}` };
      łącznieNiePrzeszło++;
      continue;
    }

    // ── Szukamy funkcji run*() w eksportach modułu ──────────────────────────
    //   Każdy TestRunner_*.js musi eksportować funkcję run*Tests()
    const funkcjaTestów = Object.values(moduł).find(
      (v) => typeof v === 'function' && v.name?.startsWith('run')
    );

    if (!funkcjaTestów) {
      logWarn('ui', `testsLoader: brak funkcji run*() w ${plik} — pominięto`);
      wyniki[plik] = { passed: 0, failed: 0, error: 'brak funkcji run*()' };
      continue;
    }

    // ── Uruchomienie testów z obsługą błędów runtime ─────────────────────────
    try {
      if (TRYB_VERBOSE) {
        logInfo('ui', `testsLoader: uruchamianie ${plik} → ${funkcjaTestów.name}()`);
      }

      const wynik = await funkcjaTestów(opcje);
      wyniki[plik] = wynik;
      łączniePrzeszło   += wynik?.passed || 0;
      łącznieNiePrzeszło += wynik?.failed || 0;

      logInfo(
        'ui',
        `testsLoader: ${plik} — ✅ ${wynik?.passed || 0} / ❌ ${wynik?.failed || 0}`
      );

    } catch (błądUruchomienia) {
      logError('ui', `testsLoader: błąd podczas uruchamiania ${plik}`, błądUruchomienia.message);
      if (TRYB_VERBOSE) {
        logError('ui', `testsLoader: stack trace dla ${plik}:`, błądUruchomienia.stack);
      }
      wyniki[plik] = { passed: 0, failed: 0, error: `runtime: ${błądUruchomienia.message}` };
      łącznieNiePrzeszło++;
    }
  }

  // ── Podsumowanie ───────────────────────────────────────────────────────────
  logInfo(
    'ui',
    `testsLoader: zakończono — łącznie ✅ ${łączniePrzeszło} / ❌ ${łącznieNiePrzeszło} w ${pliki.length} modułach`
  );

  return { passed: łączniePrzeszło, failed: łącznieNiePrzeszło, results: wyniki };
}

// =============================================================================
// END OF FILE
// =============================================================================
