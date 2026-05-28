// =============================================================================
// FILE: TestRunner_ElectronAPI.js
// PATH: tests/TestRunner_ElectronAPI.js
// VERSION: 0.0.3
// PURPOSE: Testy dostępności i typu metod window.electronAPI
// FUNCTIONS: runElectronAPITests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
const tests = [
  {
    name: 'window.electronAPI exists',
    run: async () => {
      const api = typeof window !== 'undefined' ? window.electronAPI : null;
      const ok = !!api;
      return { ok, details: ok ? '' : 'electronAPI not found' };
    }
  },
  {
    name: 'electronAPI.getProfiles is function',
    run: async () => {
      const api = window.electronAPI;
      const ok = api && typeof api.getProfiles === 'function';
      return { ok, details: ok ? '' : 'getProfiles missing or not a function' };
    }
  },
  {
    name: 'electronAPI.saveProfiles is function',
    run: async () => {
      const api = window.electronAPI;
      const ok = api && typeof api.saveProfiles === 'function';
      return { ok, details: ok ? '' : 'saveProfiles missing or not a function' };
    }
  },
  {
    name: 'electronAPI.getSettings is function',
    run: async () => {
      const api = window.electronAPI;
      const ok = api && typeof api.getSettings === 'function';
      return { ok, details: ok ? '' : 'getSettings missing or not a function' };
    }
  },
  {
    name: 'electronAPI.saveSettings is function',
    run: async () => {
      const api = window.electronAPI;
      const ok = api && typeof api.saveSettings === 'function';
      return { ok, details: ok ? '' : 'saveSettings missing or not a function' };
    }
  },
  {
    name: 'electronAPI.getTasks is function',
    run: async () => {
      const api = window.electronAPI;
      const ok = api && typeof api.getTasks === 'function';
      return { ok, details: ok ? '' : 'getTasks missing or not a function' };
    }
  },
  {
    name: 'electronAPI.saveTasks is function',
    run: async () => {
      const api = window.electronAPI;
      const ok = api && typeof api.saveTasks === 'function';
      return { ok, details: ok ? '' : 'saveTasks missing or not a function' };
    }
  },
  {
    name: 'electronAPI.getHistory is function',
    run: async () => {
      const api = window.electronAPI;
      const ok = api && typeof api.getHistory === 'function';
      return { ok, details: ok ? '' : 'getHistory missing or not a function' };
    }
  },
  {
    name: 'electronAPI.clearHistory is function',
    run: async () => {
      const api = window.electronAPI;
      const ok = api && typeof api.clearHistory === 'function';
      return { ok, details: ok ? '' : 'clearHistory missing or not a function' };
    }
  }
  {
  name: 'electronAPI.appendLogFile is function',
  run: async () => {
    const api = window.electronAPI;
    const ok = api && typeof api.appendLogFile === 'function';
    return { ok, details: ok ? '' : 'appendLogFile missing or not a function' };
  }
  },
  {
  name: 'electronAPI.getHotkeys is function',
  run: async () => {
    const api = window.electronAPI;
    const ok = api && typeof api.getHotkeys === 'function';
    return { ok, details: ok ? '' : 'getHotkeys missing or not a function' };
  }
  },
  {
  name: 'electronAPI.setGlobalAdBlocker is function',
  run: async () => {
    const api = window.electronAPI;
    const ok = api && typeof api.setGlobalAdBlocker === 'function';
    return { ok, details: ok ? '' : 'setGlobalAdBlocker missing or not a function' };
  }
];

export async function runElectronAPITests() {
  return runTests('ElectronAPI', tests);
}


