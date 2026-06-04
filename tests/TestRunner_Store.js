// =============================================================================
// FILE: TestRunner_Store.js
// PATH: tests/TestRunner_Store.js
// VERSION: 0.0.3
// PURPOSE: Testy struktury danych pobieranych z store (settings, notepad, history)
// FUNCTIONS: runStoreTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
const tests = [
  {
    name: 'settings is object',
    run: async () => {
      if (!window.electronAPI) return { ok: false, details: 'electronAPI missing' };
      const settings = await window.electronAPI.getSettings().catch(() => null);
      const ok = settings && typeof settings === 'object';
      return { ok, details: ok ? '' : 'settings is not an object or null' };
    }
  },
  {
    name: 'settings has language',
    run: async () => {
      if (!window.electronAPI) return { ok: false, details: 'electronAPI missing' };
      const settings = await window.electronAPI.getSettings().catch(() => ({}));
      const ok = 'language' in settings;
      return { ok, details: ok ? '' : 'language key missing in settings' };
    }
  },
  {
    name: 'settings has theme',
    run: async () => {
      if (!window.electronAPI) return { ok: false, details: 'electronAPI missing' };
      const settings = await window.electronAPI.getSettings().catch(() => ({}));
      const ok = 'theme' in settings;
      return { ok, details: ok ? '' : 'theme key missing in settings' };
    }
  },
  {
    name: 'settings has debugMode',
    run: async () => {
      if (!window.electronAPI) return { ok: false, details: 'electronAPI missing' };
      const settings = await window.electronAPI.getSettings().catch(() => ({}));
      const ok = 'debugMode' in settings;
      return { ok, details: ok ? '' : 'debugMode key missing in settings' };
    }
  },
  {
    name: 'notepad is object',
    run: async () => {
      if (!window.electronAPI) return { ok: false, details: 'electronAPI missing' };
      const notepad = await window.electronAPI.getnotepad().catch(() => null);
      const ok = notepad && typeof notepad === 'object';
      return { ok, details: ok ? '' : 'notepad is not an object or null' };
    }
  },
  {
    name: 'notepad has tabs array',
    run: async () => {
      if (!window.electronAPI) return { ok: false, details: 'electronAPI missing' };
      const notepad = await window.electronAPI.getnotepad().catch(() => ({ tabs: [] }));
      const ok = Array.isArray(notepad.tabs);
      return { ok, details: ok ? '' : 'notepad.tabs is not an array' };
    }
  },
  {
    name: 'history is array and max 100 entries',
    run: async () => {
      if (!window.electronAPI) return { ok: false, details: 'electronAPI missing' };
      const history = await window.electronAPI.getHistory().catch(() => []);
      const ok = Array.isArray(history) && history.length <= 100;
      const details = ok ? '' : `history is ${Array.isArray(history) ? `array with ${history.length} entries` : 'not an array'}`;
      return { ok, details };
    }
  }
];

export async function runStoreTests() {
  return runTests('Store', tests);
}