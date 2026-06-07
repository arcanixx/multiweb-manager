// =============================================================================
// FILE: testUtils.js
// PATH: tests/testUtils.js
// VERSION: 0.0.3
// PURPOSE: Wspólne funkcje dla wszystkich testów (runner, logowanie, mocki, detekcja środowiska)
// FUNCTIONS: safeImport, checkSourceExport, mockElectronAPI, mockTranslationContext,
//            runTests, isReactEnv, isNodeEnv
// DEPENDS ON: icons.js, url, path, fs
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ICONS } from '../src/utils/icons.js';
import { pathToFileURL } from 'url';
import { join } from 'path';
import { readFileSync } from 'fs';

// ============================================================================
// isReactEnv() – wykrywa środowisko React/Electron (przeglądarka/renderer)
// Sprawdza obecność charakterystycznych obiektów dostępnych tylko w Electron
// lub przeglądarce: window.electronAPI, document, customElements.
// W środowisku Node.js (skrypt pre-commit) zwraca false.
// ============================================================================
export function isReactEnv() {
  if (typeof window === 'undefined') return false;
  if (typeof document === 'undefined') return false;
  if (window.electronAPI !== undefined) return true;
  if (typeof customElements !== 'undefined') return true;
  return false;
}

// ============================================================================
// isNodeEnv() – zwraca true gdy środowisko to czysty Node.js (bez DOM)
// Używane w testach z fallbackiem: if (isNodeEnv()) { /* logika Node */ }
// ============================================================================
export function isNodeEnv() {
  return !isReactEnv();
}

// ============================================================================
// safeImport() – bezpieczny import z względnej ścieżki (działa na Windows)
// ============================================================================
export function safeImport(relativePath) {
  const absolutePath = join(process.cwd(), relativePath);
  const url = pathToFileURL(absolutePath).href;
  return import(url);
}

// ============================================================================
// checkSourceExport() – lekki test eksportu bez parsowania JSX przez Node
// Wykrywa: default export, named export, export { X }, export { X as default }
//
// KIEDY UŻYWAĆ: TYLKO gdy nie ma sensu importować pliku (React.lazy,
// re-eksport, czyste stałe). Nie zastępuje prawdziwych testów logiki.
// ============================================================================
export function checkSourceExport(relativePath, exportName) {
  try {
    const source = readFileSync(join(process.cwd(), relativePath), 'utf8');
    const patterns = [
      new RegExp(`export\\s+default\\s+(?:function\\s+)?${exportName}\\b`),
      new RegExp(`export\\s+default\\s+class\\s+${exportName}\\b`),
      new RegExp(`export\\s+function\\s+${exportName}\\b`),
      new RegExp(`export\\s+const\\s+${exportName}\\b`),
      new RegExp(`export\\s+let\\s+${exportName}\\b`),
      new RegExp(`export\\s*\\{\\s*${exportName}\\s*(?:,\\s*|\\})`),
      new RegExp(`export\\s*\\{\\s*${exportName}\\s+as\\s+default\\s*\\}`),
      new RegExp(`export\\s*\\{[^}]*\\b${exportName}\\b[^}]*\\}\\s*from`),
      new RegExp(`export\\s*\\{[^}]*\\b${exportName}\\b[^}]*\\}`),
    ];
    const ok = patterns.some((pattern) => pattern.test(source));
    return { ok, details: ok ? '' : `${exportName} nie ma jawnego eksportu w ${relativePath}` };
  } catch (err) {
    return { ok: false, details: `Nie można odczytać ${relativePath}: ${err.message}` };
  }
}

// ============================================================================
// mockElectronAPI() – tymczasowy mock window.electronAPI dla testów
// ============================================================================
export function mockElectronAPI(overrides = {}) {
  const original = globalThis.window?.electronAPI;
  if (!globalThis.window) globalThis.window = {};
  globalThis.window.electronAPI = { ...globalThis.window.electronAPI, ...overrides };
  return () => {
    if (original !== undefined) {
      globalThis.window.electronAPI = original;
    } else {
      delete globalThis.window.electronAPI;
    }
  };
}

// ============================================================================
// mockTranslationContext() – mock React context dla TranslationContext
// ============================================================================
export function mockTranslationContext() {
  const originalReact = globalThis.React;
  globalThis.React = {
    ...originalReact,
    useContext: () => ({ t: (key) => key }),
    createContext: (val) => val,
    useState: (initial) => [initial, () => {}],
    useEffect: (cb) => cb(),
    useCallback: (fn) => fn,
    useMemo: (fn) => fn(),
  };
  return () => { globalThis.React = originalReact; };
}

// ============================================================================
// runTests() – runner testów z logowaniem i obsługą środowisk
//
// POLE env W DEFINICJI TESTU:
//   env: 'react'  → wymaga środowiska React/Electron
//                  W Node: POMINIĘTY (SKIP), NIE FAIL
//                  W React: wykonany normalnie
//   env: 'node'   → działa tylko w Node. W React pomijany.
//   (brak)        → uruchamiany w obu środowiskach
//
// Wynik: { passed, failed, skippedReact }
//   skippedReact NIE wlicza się do failed
// ============================================================================
export async function runTests(moduleName, testFunctions) {
  const inReact = isReactEnv();
  console.log(`
${ICONS.TEST} Running ${moduleName} Tests... [env: ${inReact ? 'React/Electron' : 'Node.js'}]`);

  let passed = 0;
  let failed = 0;
  let skippedReact = 0;

  for (const testDef of testFunctions) {
    const { name, run, env } = testDef;

    // Pomiń testy React w środowisku Node – nie są failami
    if (env === 'react' && !inReact) {
      console.log(`${ICONS.SKIP} [REACT-ONLY] ${name}`);
      skippedReact++;
      continue;
    }

    // Pomiń testy Node w środowisku React (rzadkie)
    if (env === 'node' && inReact) {
      console.log(`${ICONS.SKIP} [NODE-ONLY] ${name}`);
      continue;
    }

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

  const skippedInfo = skippedReact > 0 ? `, ${skippedReact} react-only (skipped in Node)` : '';
  console.log(`
${ICONS.LOGS} ${moduleName} Tests: ${passed} passed, ${failed} failed${skippedInfo}
`);

  return { passed, failed, skippedReact };
}
