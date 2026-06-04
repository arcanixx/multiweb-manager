// =============================================================================
// FILE: TestRunner_ElectronAPI.js
// PATH: tests/TestRunner_ElectronAPI.js
// VERSION: 0.0.3
// PURPOSE: Testy dostępności i poprawności metod window.electronAPI (preload bridge). Weryfikuje obecność, typy i brak legacy metod.
// FUNCTIONS: runElectronAPITests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';

const WYMAGANE_METODY = [
  // Core
  'invoke',
  // Profiles
  'getProfiles', 'createProfile', 'updateProfile', 'deleteProfile',
  // Settings
  'getSettings', 'saveSettings',
  // History
  'getHistory', 'addHistory', 'clearHistory',
  // Notes
  'getNotes', 'saveNotes',
  // Workspaces
  'getWorkspaces', 'saveWorkspace', 'deleteWorkspace',
  // Terminal (nowe API)
  'createTerminal', 'terminalWrite', 'terminalResize', 'killTerminal',
  'onTerminalData', 'onTerminalExit',
  // Hotkeys
  'getHotkeys', 'saveHotkeys',
  // AdBlocker
  'setGlobalAdBlocker', 'getGlobalAdBlocker',
  // WebView
  'openSingleWindow', 'captureWebView', 'getWebViewResourceInfo',
  // Logs
  'appendLogFile', 'getLogsFile', 'clearLogsFile',
  // Shell
  'openExternal',
  // App
  'getAppInfo', 'getDebugMode',
];

const LEGACY_METODY = [
  'terminalStart', 'terminalKill',
  'terminalWriteLegacy', 'terminalResizeLegacy', 'terminalKillLegacy',
  // Stare kanały bez namespace
  'saveProfiles', 'getTasks', 'saveTasks',
];

const tests = [
  {
    name: 'window.electronAPI istnieje',
    run: async () => {
      const ok = typeof window !== 'undefined' && !!window.electronAPI;
      return { ok, details: ok ? '' : 'electronAPI nie zostało zainicjalizowane' };
    }
  },
  {
    name: 'Wszystkie wymagane metody są funkcjami',
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
    run: async () => {
      const api = window.electronAPI;
      if (!api) return { ok: false, details: 'electronAPI brak' };
      const obecne = LEGACY_METODY.filter(m => typeof api[m] === 'function');
      const ok = obecne.length === 0;
      return {
        ok,
        details: ok ? '' : `Legacy metody do usunięcia z preload: ${obecne.join(', ')}`
      };
    }
  },
  // ─── Spot check – kilka metod wywołujemy i sprawdzamy kształt odpowiedzi
  {
    name: 'getSettings() – zwraca { ok: true, data: object }',
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
