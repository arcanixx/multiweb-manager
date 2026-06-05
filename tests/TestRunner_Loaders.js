// =============================================================================
// FILE: TestRunner_Loaders.js
// PATH: tests/TestRunner_Loaders.js
// VERSION: 0.0.3
// PURPOSE: Testy loaderów dynamicznych — ipcLoader (loadAllIpcHandlers) i testsLoader (loadAndRunAllTests) — eksporty, kształt odpowiedzi, wykrywanie plików.
// FUNCTIONS: runLoadersTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
import { join } from 'path';
import { readdirSync } from 'fs';

const ROOT = process.cwd();

const tests = [
  // ── ipcLoader ─────────────────────────────────────────────────────────────
  {
    name: 'ipcLoader – loadAllIpcHandlers exported as function',
    run: async () => {
      const mod = await import(join(ROOT, 'src/loaders/ipcLoader.js'));
      const ok = typeof mod.loadAllIpcHandlers === 'function';
      return { ok, details: ok ? '' : 'loadAllIpcHandlers not exported' };
    }
  },
  {
    name: 'ipcLoader – src/ipc/ contains ipcMainHandlers_*.js files',
    run: async () => {
      const ipcDir = join(ROOT, 'src/ipc');
      let files;
      try {
        files = readdirSync(ipcDir).filter(f => f.startsWith('ipcMainHandlers_') && f.endsWith('.js'));
      } catch (e) {
        return { ok: false, details: `Cannot read src/ipc/: ${e.message}` };
      }
      const ok = files.length > 0;
      return { ok, details: ok ? `Found ${files.length} handlers` : 'No ipcMainHandlers_*.js found in src/ipc/' };
    }
  },
  {
    name: 'ipcLoader – EXCLUDED set contains ipcLegacyBridge.js',
    run: async () => {
      // Weryfikujemy przez treść pliku że legacy bridge jest w liście wykluczeń
      const { readFileSync } = await import('fs');
      const content = readFileSync(join(ROOT, 'src/loaders/ipcLoader.js'), 'utf-8');
      const ok = content.includes('ipcLegacyBridge.js');
      return { ok, details: ok ? '' : 'ipcLegacyBridge.js not in EXCLUDED list' };
    }
  },

  // ── testsLoader ────────────────────────────────────────────────────────────
  {
    name: 'testsLoader – loadAndRunAllTests exported as function',
    run: async () => {
      const mod = await import(join(ROOT, 'src/loaders/testsLoader.js'));
      const ok = typeof mod.loadAndRunAllTests === 'function';
      return { ok, details: ok ? '' : 'loadAndRunAllTests not exported' };
    }
  },
  {
    name: 'testsLoader – EXCLUDED contains TestRunner.js and testUtils.js',
    run: async () => {
      const { readFileSync } = await import('fs');
      const content = readFileSync(join(ROOT, 'src/loaders/testsLoader.js'), 'utf-8');
      const ok = content.includes('TestRunner.js') && content.includes('testUtils.js');
      return { ok, details: ok ? '' : 'Missing exclusions in testsLoader' };
    }
  },
  {
    name: 'testsLoader – tests/ contains at least 10 TestRunner_*.js files',
    run: async () => {
      const testsDir = join(ROOT, 'tests');
      let files;
      try {
        files = readdirSync(testsDir).filter(f => f.startsWith('TestRunner_') && f.endsWith('.js'));
      } catch (e) {
        return { ok: false, details: `Cannot read tests/: ${e.message}` };
      }
      const ok = files.length >= 10;
      return { ok, details: ok ? `Found ${files.length} test files` : `Only ${files.length} test files (expected ≥10)` };
    }
  },
  {
    name: 'testsLoader – returned shape has passed, failed, results',
    run: async () => {
      // Weryfikujemy kształt zwracanego obiektu przez sprawdzenie kodu źródłowego
      const { readFileSync } = await import('fs');
      const content = readFileSync(join(ROOT, 'src/loaders/testsLoader.js'), 'utf-8');
      const ok = content.includes('passed') && content.includes('failed') && content.includes('results');
      return { ok, details: ok ? '' : 'Return shape missing passed/failed/results' };
    }
  }
];

export async function runLoadersTests() {
  return runTests('Loaders', tests);
}
