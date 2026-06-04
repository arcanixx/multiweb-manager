// =============================================================================
// FILE: TestRunner_IPC.js
// PATH: tests/TestRunner_IPC.js
// VERSION: 0.0.3
// PURPOSE: Testy dostępności wszystkich kanałów IPC przez window.electronAPI – profiles, settings, history, workspaces, tasks, terminal, notes, hotkeys, adBlocker, webview, tools, search, logs.
// FUNCTIONS: runIPCTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';

// ─── Pomocnik: sprawdza czy metoda istnieje i jest funkcją
function hasMethod(name) {
  return typeof window.electronAPI?.[name] === 'function';
}

// ─── Pomocnik: sprawdza grupę metod, zwraca brakujące
function checkMethods(methods) {
  const brakujace = methods.filter(m => !hasMethod(m));
  return { ok: brakujace.length === 0, details: brakujace.length ? `Brakujące: ${brakujace.join(', ')}` : '' };
}

const tests = [
  // ─── Podstawa
  {
    name: 'electronAPI – obiekt istnieje',
    run: async () => {
      const ok = typeof window !== 'undefined' && !!window.electronAPI;
      return { ok, details: ok ? '' : 'window.electronAPI nie istnieje' };
    }
  },
  {
    name: 'electronAPI – invoke dostępne',
    run: async () => {
      const ok = hasMethod('invoke');
      return { ok, details: ok ? '' : 'invoke missing – preload niezaktualizowany?' };
    }
  },

  // ─── Profiles
  {
    name: 'IPC profiles – getProfiles, createProfile, updateProfile, deleteProfile',
    run: async () => checkMethods(['getProfiles', 'createProfile', 'updateProfile', 'deleteProfile'])
  },

  // ─── Settings
  {
    name: 'IPC settings – getSettings, saveSettings',
    run: async () => checkMethods(['getSettings', 'saveSettings'])
  },

  // ─── History
  {
    name: 'IPC history – getHistory, addHistory, clearHistory',
    run: async () => checkMethods(['getHistory', 'addHistory', 'clearHistory'])
  },

  // ─── Workspaces
  {
    name: 'IPC workspaces – getWorkspaces, saveWorkspace, deleteWorkspace',
    run: async () => checkMethods(['getWorkspaces', 'saveWorkspace', 'deleteWorkspace'])
  },

  // ─── Notes
  {
    name: 'IPC notes – getNotes, saveNotes',
    run: async () => checkMethods(['getNotes', 'saveNotes'])
  },

  // ─── Tasks
  {
    name: 'IPC tasks – getTasks/invoke tasks:getAll',
    run: async () => {
      // Tasks używają invoke() z kanałem tasks:getAll
      const ok = hasMethod('invoke');
      return { ok, details: ok ? '' : 'invoke missing – tasks:getAll niedostępne' };
    }
  },

  // ─── Terminal (nowe multi-session API)
  {
    name: 'IPC terminal – createTerminal, terminalWrite, terminalResize, killTerminal',
    run: async () => checkMethods(['createTerminal', 'terminalWrite', 'terminalResize', 'killTerminal'])
  },
  {
    name: 'IPC terminal – onTerminalData, onTerminalExit (event listeners)',
    run: async () => checkMethods(['onTerminalData', 'onTerminalExit'])
  },

  // ─── Hotkeys
  {
    name: 'IPC hotkeys – getHotkeys, saveHotkeys',
    run: async () => checkMethods(['getHotkeys', 'saveHotkeys'])
  },

  // ─── AdBlocker
  {
    name: 'IPC adBlocker – setGlobalAdBlocker, getGlobalAdBlocker',
    run: async () => checkMethods(['setGlobalAdBlocker', 'getGlobalAdBlocker'])
  },

  // ─── WebView
  {
    name: 'IPC webview – openSingleWindow, captureWebView, getWebViewResourceInfo',
    run: async () => checkMethods(['openSingleWindow', 'captureWebView', 'getWebViewResourceInfo'])
  },

  // ─── Logs
  {
    name: 'IPC logs – appendLogFile, getLogsFile, clearLogsFile',
    run: async () => checkMethods(['appendLogFile', 'getLogsFile', 'clearLogsFile'])
  },

  // ─── Shell
  {
    name: 'IPC shell – openExternal',
    run: async () => checkMethods(['openExternal'])
  },

  // ─── App info
  {
    name: 'IPC app – getAppInfo',
    run: async () => checkMethods(['getAppInfo'])
  },

  // ─── Debug
  {
    name: 'IPC debug – getDebugMode',
    run: async () => checkMethods(['getDebugMode'])
  },

  // ─── Legacy terminal – powinny być usunięte
  {
    name: 'IPC terminal – brak legacy metod (terminalWriteLegacy itp.)',
    run: async () => {
      const legacy = ['terminalStart', 'terminalWriteLegacy', 'terminalResizeLegacy', 'terminalKillLegacy'];
      const obecne = legacy.filter(m => hasMethod(m));
      const ok = obecne.length === 0;
      return {
        ok,
        details: ok ? '' : `Legacy metody wciąż w preload: ${obecne.join(', ')} – można usunąć po potwierdzeniu`
      };
    }
  },

  // ─── Wyniki IPC – poprawna struktura odpowiedzi { ok, data/error }
  {
    name: 'IPC settings:get – zwraca { ok: true, data: object }',
    run: async () => {
      if (!hasMethod('getSettings')) return { ok: false, details: 'getSettings missing' };
      try {
        const res = await window.electronAPI.getSettings();
        const ok = res?.ok === true && typeof res?.data === 'object';
        return { ok, details: ok ? '' : `Nieoczekiwana odpowiedź: ${JSON.stringify(res)}` };
      } catch (e) {
        return { ok: false, details: `Wyjątek: ${e.message}` };
      }
    }
  },
  {
    name: 'IPC profiles:getAll – zwraca { ok: true, data: array }',
    run: async () => {
      if (!hasMethod('getProfiles')) return { ok: false, details: 'getProfiles missing' };
      try {
        const res = await window.electronAPI.getProfiles();
        const ok = res?.ok === true && Array.isArray(res?.data);
        return { ok, details: ok ? '' : `Nieoczekiwana odpowiedź: ${JSON.stringify(res)}` };
      } catch (e) {
        return { ok: false, details: `Wyjątek: ${e.message}` };
      }
    }
  },
  {
    name: 'IPC history:getAll – zwraca { ok: true, data: array }',
    run: async () => {
      if (!hasMethod('getHistory')) return { ok: false, details: 'getHistory missing' };
      try {
        const res = await window.electronAPI.getHistory();
        const ok = res?.ok === true && Array.isArray(res?.data);
        return { ok, details: ok ? '' : `Nieoczekiwana odpowiedź: ${JSON.stringify(res)}` };
      } catch (e) {
        return { ok: false, details: `Wyjątek: ${e.message}` };
      }
    }
  },
  {
    name: 'IPC workspaces:getAll – zwraca { ok: true, data: array }',
    run: async () => {
      if (!hasMethod('getWorkspaces')) return { ok: false, details: 'getWorkspaces missing' };
      try {
        const res = await window.electronAPI.getWorkspaces();
        const ok = res?.ok === true && Array.isArray(res?.data);
        return { ok, details: ok ? '' : `Nieoczekiwana odpowiedź: ${JSON.stringify(res)}` };
      } catch (e) {
        return { ok: false, details: `Wyjątek: ${e.message}` };
      }
    }
  },
];

export async function runIPCTests() {
  return runTests('IPC', tests);
}
