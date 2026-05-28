// =============================================================================
// FILE: TestRunner_Store.js
// PATH: tests/TestRunner_Store.js
// VERSION: 0.0.3
// PURPOSE: Testy struktury danych pobieranych z store (settings, notes, history)
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
    name: 'notes is object',
    run: async () => {
      if (!window.electronAPI) return { ok: false, details: 'electronAPI missing' };
      const notes = await window.electronAPI.getNotes().catch(() => null);
      const ok = notes && typeof notes === 'object';
      return { ok, details: ok ? '' : 'notes is not an object or null' };
    }
  },
  {
    name: 'notes has tabs array',
    run: async () => {
      if (!window.electronAPI) return { ok: false, details: 'electronAPI missing' };
      const notes = await window.electronAPI.getNotes().catch(() => ({ tabs: [] }));
      const ok = Array.isArray(notes.tabs);
      return { ok, details: ok ? '' : 'notes.tabs is not an array' };
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