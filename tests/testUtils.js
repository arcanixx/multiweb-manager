// =============================================================================
// FILE: testUtils.js
// PATH: tests/testUtils.js
// VERSION: 0.0.3
// PURPOSE: Wspólne funkcje dla wszystkich testów (runner, logowanie, mocki)
// FUNCTIONS: safeImport, checkSourceExport, runTests, mockElectronAPI, mockTranslationContext
// DEPENDS ON: icons.js, url, path, fs
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ICONS } from '../src/utils/icons.js';
import { pathToFileURL } from 'url';
import { join } from 'path';
import { readFileSync } from 'fs';

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
// ============================================================================
export function checkSourceExport(relativePath, exportName) {
  try {
    const source = readFileSync(join(process.cwd(), relativePath), 'utf8');
    const patterns = [
      new RegExp(`export\\s+default\\s+(?:function\\s+)?${exportName}\\b`),
      new RegExp(`export\\s+function\\s+${exportName}\\b`),
      new RegExp(`export\\s+const\\s+${exportName}\\b`),
      new RegExp(`export\\s+let\\s+${exportName}\\b`),
      new RegExp(`export\\s*\\{\\s*${exportName}\\s*(?:,\\s*|\\})`),
      new RegExp(`export\\s*\\{[^}]*\\b${exportName}\\b[^}]*\\}`),
      new RegExp(`export\\s*\\{\\s*${exportName}\\s+as\\s+default\\s*\\}`),
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
  if (!globalThis.window) {
    globalThis.window = {};
  }
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
// runTests() – runner testów z logowaniem
// ============================================================================
export async function runTests(moduleName, testFunctions) {
  console.log(`\n${ICONS.TEST} Running ${moduleName} Tests...`);
  let passed = 0;
  let failed = 0;
  for (const { name, run } of testFunctions) {
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
  console.log(`\n${ICONS.LOGS} ${moduleName} Tests: ${passed} passed, ${failed} failed\n`);
  return { passed, failed };
}