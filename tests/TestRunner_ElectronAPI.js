// =============================================================================
// FILE: TestRunner_ElectronAPI.js
// PATH: tests/TestRunner_ElectronAPI.js
// VERSION: 0.0.3
// PURPOSE: Testy dostępności i poprawności metod window.electronAPI (preload bridge). Weryfikuje obecność, typy i brak legacy metod.
// FUNCTIONS: runElectronAPITests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// ŚRODOWISKO: Wszystkie testy wymagają window.electronAPI (Electron renderer).
// W środowisku Node (pre-commit) są pomijane jako react-only – nie są failami.

import { runTests } from './testUtils.js';

const WYMAGANE_METODY = [
  'invoke',
  'getProfiles', 'createProfile', 'updateProfile', 'deleteProfile',
  'getSettings', 'saveSettings',
  'getHistory', 'addHistory', 'clearHistory',
  'getNotes', 'saveNotes',
  'getWorkspaces', 'saveWorkspace', 'deleteWorkspace',
  'createTerminal', 'terminalWrite', 'terminalResize', 'killTerminal',
  'onTerminalData', 'onTerminalExit',
  'getHotkeys', 'saveHotkeys',
  'setGlobalAdBlocker', 'getGlobalAdBlocker',
  'openSingleWindow', 'captureWebView', 'getWebViewResourceInfo',
  'appendLogFile', 'getLogsFile', 'clearLogsFile',
  'openExternal',
  'getAppInfo', 'getDebugMode',
];

const LEGACY_METODY = [
  'terminalStart', 'terminalKill',
  'terminalWriteLegacy', 'terminalResizeLegacy', 'terminalKillLegacy',
  'saveProfiles', 'getTasks', 'saveTasks',
];

const tests = [
  {
    name: 'window.electronAPI istnieje',
    env: 'react',
    run: async () => {
      const ok = typeof window !== 'undefined' && !!window.electronAPI;
      return { ok, details: ok ? '' : 'electronAPI nie zostało zainicjalizowane' };
    }
  },
  {
    name: 'Wszystkie wymagane metody są funkcjami',
    env: 'react',
    run: async () => {
      const api = window.electronAPI;
      if (!api) return { ok: false, details: 'electronAPI brak' };
      const brakujace = WYMAGANE_METODY.filter(m => typeof api[m] !== 'function');
      const ok = brakujace.length === 0;
      return { ok, details: ok ? '' : `Brakujące metody: ${brakujace.join(', ')}` };
    }
  },
  {
    name: 'Brak legacy metod (cleanup po W4)',
    env: 'react',
    run: async () => {
      const api = window.electronAPI;
      if (!api) return { ok: false, details: 'electronAPI brak' };
      const obecne = LEGACY_METODY.filter(m => typeof api[m] === 'function');
      const ok = obecne.length === 0;
      return { ok, details: ok ? '' : `Legacy metody do usunięcia z preload: ${obecne.join(', ')}` };
    }
  },
  {
    name: 'getSettings() – zwraca { ok: true, data: object }',
    env: 'react',
    run: async () => {
      if (typeof window.electronAPI?.getSettings !== 'function') return { ok: false, details: 'getSettings missing' };
      try {
        const res = await window.electronAPI.getSettings();
        const ok = res?.ok === true && typeof res?.data === 'object';
        return { ok, details: ok ? '' : `Zły kształt: ${JSON.stringify(res)}` };
      } catch (e) { return { ok: false, details: e.message }; }
    }
  },
  {
    name: 'getProfiles() – zwraca { ok: true, data: array }',
    env: 'react',
    run: async () => {
      if (typeof window.electronAPI?.getProfiles !== 'function') return { ok: false, details: 'getProfiles missing' };
      try {
        const res = await window.electronAPI.getProfiles();
        const ok = res?.ok === true && Array.isArray(res?.data);
        return { ok, details: ok ? '' : `Zły kształt: ${JSON.stringify(res)}` };
      } catch (e) { return { ok: false, details: e.message }; }
    }
  },
  {
    name: 'getHistory() – zwraca { ok: true, data: array }',
    env: 'react',
    run: async () => {
      if (typeof window.electronAPI?.getHistory !== 'function') return { ok: false, details: 'getHistory missing' };
      try {
        const res = await window.electronAPI.getHistory();
        const ok = res?.ok === true && Array.isArray(res?.data);
        return { ok, details: ok ? '' : `Zły kształt: ${JSON.stringify(res)}` };
      } catch (e) { return { ok: false, details: e.message }; }
    }
  },
];

export async function runElectronAPITests() {
  return runTests('ElectronAPI', tests);
}
