// =============================================================================
// FILE: TestRunner_IPC.js
// PATH: tests/TestRunner_IPC.js
// VERSION: 0.0.3
// PURPOSE: Testy dostępności i typów dla nowych handlerów IPC
// FUNCTIONS: runIPCTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
const tests = [
  {
    name: 'electronAPI.openExternal is function',
    run: async () => {
      const api = window.electronAPI;
      const ok = api && typeof api.openExternal === 'function';
      return { ok, details: ok ? '' : 'openExternal missing or not a function' };
    }
  },
  {
    name: 'electronAPI.appendLogFile is function',
    run: async () => {
      const api = window.electronAPI;
      const ok = api && typeof api.appendLogFile === 'function';
      return { ok, details: ok ? '' : 'appendLogFile missing' };
    }
  },
  {
    name: 'electronAPI.getHotkeys is function',
    run: async () => {
      const api = window.electronAPI;
      const ok = api && typeof api.getHotkeys === 'function';
      return { ok, details: ok ? '' : 'getHotkeys missing' };
    }
  },
  {
    name: 'electronAPI.saveHotkeys is function',
    run: async () => {
      const api = window.electronAPI;
      const ok = api && typeof api.saveHotkeys === 'function';
      return { ok, details: ok ? '' : 'saveHotkeys missing' };
    }
  },
  {
    name: 'electronAPI.setGlobalAdBlocker is function',
    run: async () => {
      const api = window.electronAPI;
      const ok = api && typeof api.setGlobalAdBlocker === 'function';
      return { ok, details: ok ? '' : 'setGlobalAdBlocker missing' };
    }
  }
];

export async function runIPCTests() {
  return runTests('IPC', tests);
}