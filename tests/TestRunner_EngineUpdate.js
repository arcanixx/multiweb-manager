// =============================================================================
// FILE: TestRunner_EngineUpdate.js
// PATH: tests/TestRunner_EngineUpdate.js
// VERSION: 0.0.3
// PURPOSE: Testy serwisu aktualizacji (src/engine/updateService.js) — checkForUpdates stub + kształt odpowiedzi.
// FUNCTIONS: runUpdateTests
// DEPENDS ON: testUtils.js, path
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests, safeImport } from './testUtils.js';
import { join } from 'path';
const ROOT = process.cwd();

const tests = [
  {
    name: 'checkForUpdates – exported as function',
    run: async () => {
      const mod = await safeImport('src/engine/updateService.js');
      const ok = typeof mod.checkForUpdates === 'function';
      return { ok, details: ok ? '' : 'checkForUpdates not exported as function' };
    }
  },
  {
    name: 'checkForUpdates – returns object with "available" field',
    run: async () => {
      const { checkForUpdates } = await safeImport('src/engine/updateService.js');
      const result = await checkForUpdates();
      const ok = result !== null && typeof result === 'object' && 'available' in result;
      return { ok, details: ok ? '' : `Bad shape: ${JSON.stringify(result)}` };
    }
  },
  {
    name: 'checkForUpdates – "available" is boolean',
    run: async () => {
      const { checkForUpdates } = await safeImport('src/engine/updateService.js');
      const result = await checkForUpdates();
      const ok = typeof result.available === 'boolean';
      return { ok, details: ok ? '' : `available is ${typeof result.available}` };
    }
  },
  {
    name: 'checkForUpdates – stub returns available=false (no server in UAT)',
    run: async () => {
      const { checkForUpdates } = await safeImport('src/engine/updateService.js');
      const result = await checkForUpdates();
      // Stub zawsze zwraca false – to jest oczekiwane dopóki API nie jest gotowe
      const ok = result.available === false;
      return { ok, details: ok ? '' : 'Expected available=false from stub' };
    }
  },
  {
    name: 'checkForUpdates – does not throw',
    run: async () => {
      const { checkForUpdates } = await safeImport('src/engine/updateService.js');
      let threw = false;
      try { await checkForUpdates(); } catch { threw = true; }
      return { ok: !threw, details: threw ? 'checkForUpdates threw unexpectedly' : '' };
    }
  }
];

export async function runUpdateTests() {
  return runTests('Update', tests);
}