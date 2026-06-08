// =============================================================================
// FILE: TestRunner_IPC.js
// PATH: tests/TestRunner_IPC.js
// VERSION: 0.0.3
// PURPOSE: Testy dostępności wszystkich kanałów IPC przez window.electronAPI – profiles, settings, history, workspaces, tasks, terminal, notes, hotkeys, adBlocker, webview, tools, search, logs. Testy IPC_CHANNELS (stałe) działają w Node; testy window.electronAPI wymagają React/Electron (env:'react').
// FUNCTIONS: runIPCTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';

function hasMethod(name) {
  return typeof window?.electronAPI?.[name] === 'function';
}

function checkMethods(methods) {
  const brakujace = methods.filter(m => !hasMethod(m));
  return { ok: brakujace.length === 0, details: brakujace.length ? `Brakujące: ${brakujace.join(', ')}` : '' };
}

const tests = [

  // ─── Podstawa (react-only – wymaga window.electronAPI) ────────────────────
  {
    name: 'electronAPI – obiekt istnieje',
    env: 'react',
    run: async () => {
      const ok = typeof window !== 'undefined' && !!window.electronAPI;
      return { ok, details: ok ? '' : 'window.electronAPI nie istnieje' };
    }
  },
  {
    name: 'electronAPI – invoke dostępne',
    env: 'react',
    run: async () => ({ ok: hasMethod('invoke'), details: hasMethod('invoke') ? '' : 'invoke missing' })
  },

  // ─── Dostępność metod IPC (react-only) ────────────────────────────────────
  { name: 'IPC profiles – getProfiles, createProfile, updateProfile, deleteProfile', env: 'react',
    run: async () => checkMethods(['getProfiles', 'createProfile', 'updateProfile', 'deleteProfile']) },
  { name: 'IPC settings – getSettings, saveSettings', env: 'react',
    run: async () => checkMethods(['getSettings', 'saveSettings']) },
  { name: 'IPC history – getHistory, addHistory, clearHistory', env: 'react',
    run: async () => checkMethods(['getHistory', 'addHistory', 'clearHistory']) },
  { name: 'IPC workspaces – getWorkspaces, saveWorkspace, deleteWorkspace', env: 'react',
    run: async () => checkMethods(['getWorkspaces', 'saveWorkspace', 'deleteWorkspace']) },
  { name: 'IPC notes – getNotes, saveNotes', env: 'react',
    run: async () => checkMethods(['getNotes', 'saveNotes']) },
  { name: 'IPC tasks – invoke tasks:getAll dostępne', env: 'react',
    run: async () => ({ ok: hasMethod('invoke'), details: hasMethod('invoke') ? '' : 'invoke missing' }) },
  { name: 'IPC terminal – createTerminal, terminalWrite, terminalResize, killTerminal', env: 'react',
    run: async () => checkMethods(['createTerminal', 'terminalWrite', 'terminalResize', 'killTerminal']) },
  { name: 'IPC terminal – onTerminalData, onTerminalExit (event listeners)', env: 'react',
    run: async () => checkMethods(['onTerminalData', 'onTerminalExit']) },
  { name: 'IPC hotkeys – getHotkeys, saveHotkeys', env: 'react',
    run: async () => checkMethods(['getHotkeys', 'saveHotkeys']) },
  { name: 'IPC adBlocker – setGlobalAdBlocker, getGlobalAdBlocker', env: 'react',
    run: async () => checkMethods(['setGlobalAdBlocker', 'getGlobalAdBlocker']) },
  { name: 'IPC webview – openSingleWindow, captureWebView, getWebViewResourceInfo', env: 'react',
    run: async () => checkMethods(['openSingleWindow', 'captureWebView', 'getWebViewResourceInfo']) },
  { name: 'IPC logs – appendLogFile, getLogsFile, clearLogsFile', env: 'react',
    run: async () => checkMethods(['appendLogFile', 'getLogsFile', 'clearLogsFile']) },
  { name: 'IPC shell – openExternal', env: 'react',
    run: async () => checkMethods(['openExternal']) },
  { name: 'IPC app – getAppInfo', env: 'react',
    run: async () => checkMethods(['getAppInfo']) },
  { name: 'IPC debug – getDebugMode', env: 'react',
    run: async () => checkMethods(['getDebugMode']) },
  {
    name: 'IPC terminal – brak legacy metod (terminalWriteLegacy itp.)',
    env: 'react',
    run: async () => {
      const legacy = ['terminalStart', 'terminalWriteLegacy', 'terminalResizeLegacy', 'terminalKillLegacy'];
      const obecne = legacy.filter(m => hasMethod(m));
      return { ok: obecne.length === 0, details: obecne.length ? `Legacy wciąż w preload: ${obecne.join(', ')}` : '' };
    }
  },
  // ─── Kształt odpowiedzi IPC (react-only) ──────────────────────────────────
  { name: 'IPC settings:get – zwraca { ok: true, data: object }', env: 'react',
    run: async () => {
      if (!hasMethod('getSettings')) return { ok: false, details: 'getSettings missing' };
      try { const res = await window.electronAPI.getSettings();
        return { ok: res?.ok === true && typeof res?.data === 'object', details: `Odpowiedź: ${JSON.stringify(res)}` };
      } catch (e) { return { ok: false, details: e.message }; }
    }
  },
  { name: 'IPC profiles:getAll – zwraca { ok: true, data: array }', env: 'react',
    run: async () => {
      if (!hasMethod('getProfiles')) return { ok: false, details: 'getProfiles missing' };
      try { const res = await window.electronAPI.getProfiles();
        return { ok: res?.ok === true && Array.isArray(res?.data), details: `Odpowiedź: ${JSON.stringify(res)}` };
      } catch (e) { return { ok: false, details: e.message }; }
    }
  },
  { name: 'IPC history:getAll – zwraca { ok: true, data: array }', env: 'react',
    run: async () => {
      if (!hasMethod('getHistory')) return { ok: false, details: 'getHistory missing' };
      try { const res = await window.electronAPI.getHistory();
        return { ok: res?.ok === true && Array.isArray(res?.data), details: `Odpowiedź: ${JSON.stringify(res)}` };
      } catch (e) { return { ok: false, details: e.message }; }
    }
  },
  { name: 'IPC workspaces:getAll – zwraca { ok: true, data: array }', env: 'react',
    run: async () => {
      if (!hasMethod('getWorkspaces')) return { ok: false, details: 'getWorkspaces missing' };
      try { const res = await window.electronAPI.getWorkspaces();
        return { ok: res?.ok === true && Array.isArray(res?.data), details: `Odpowiedź: ${JSON.stringify(res)}` };
      } catch (e) { return { ok: false, details: e.message }; }
    }
  },
  { name: 'IPC adBlocker – setAdBlockerForProfile, getAdBlockerForProfile', env: 'react',
    run: async () => {
      const hasSet = hasMethod('setAdBlockerForProfile');
      const hasGet = hasMethod('getAdBlockerForProfile');
      return { ok: hasSet && hasGet, details: `set=${hasSet}, get=${hasGet}` };
    }
  },

  // ─── IPC_CHANNELS – testy CZYSTO NODE (importują stałe, zero window) ──────
  { name: 'IPC_CHANNELS – ADBLOCKER channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['SET_GLOBAL', 'GET_GLOBAL', 'SET_FOR_PROFILE', 'GET_FOR_PROFILE'];
      const missing = keys.filter(k => !IPC_CHANNELS.ADBLOCKER?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  { name: 'IPC_CHANNELS – AGGREGATED_TASKS channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['GET_ALL', 'FILTER', 'SORT'];
      const missing = keys.filter(k => !IPC_CHANNELS.AGGREGATED_TASKS?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  { name: 'IPC_CHANNELS – APP channels defined (CONFIRM_QUIT, GET_VERSION, CHECK_UPDATES)',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['CONFIRM_QUIT', 'GET_VERSION', 'CHECK_UPDATES'];
      const missing = keys.filter(k => !IPC_CHANNELS.APP?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  { name: 'IPC_CHANNELS – APP_INFO.GET_INFO defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      return { ok: !!IPC_CHANNELS.APP_INFO?.GET_INFO, details: 'APP_INFO.GET_INFO missing' };
    }
  },
  { name: 'IPC_CHANNELS – APP_LIBRARY channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['GET_ALL', 'SEARCH', 'GET_BY_CATEGORY'];
      const missing = keys.filter(k => !IPC_CHANNELS.APP_LIBRARY?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  { name: 'IPC_CHANNELS – COOKIES.GET_ALL defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      return { ok: !!IPC_CHANNELS.COOKIES?.GET_ALL, details: 'COOKIES.GET_ALL missing' };
    }
  },
  { name: 'IPC_CHANNELS – DIALOGS channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['OPEN_FILE', 'SAVE_FILE'];
      const missing = keys.filter(k => !IPC_CHANNELS.DIALOGS?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  { name: 'IPC_CHANNELS – EVENTS channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['APPEND', 'GET_FILE', 'CLEAR'];
      const missing = keys.filter(k => !IPC_CHANNELS.EVENTS?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  { name: 'IPC_CHANNELS – FS channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['READ_FILE', 'WRITE_FILE'];
      const missing = keys.filter(k => !IPC_CHANNELS.FS?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  { name: 'IPC_CHANNELS – FILES channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['SAVE_TEXT', 'SAVE_BINARY'];
      const missing = keys.filter(k => !IPC_CHANNELS.FILES?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  { name: 'IPC_CHANNELS – TOOLS channels defined (FILE_PREVIEW, API_REQUEST, FORMAT_JSON, IMAGE_*...)',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['FILE_PREVIEW', 'API_REQUEST', 'CLIPBOARD_GET',
        'FORMAT_JSON', 'YAML_TO_JSON', 'JSON_TO_YAML',
        'REGEX_TEST', 'MARKDOWN_RENDER', 'SVG_TO_PNG',
        'IMAGE_RESIZE', 'IMAGE_CONVERT', 'IMAGE_COMPRESS'];
      const missing = keys.filter(k => !IPC_CHANNELS.TOOLS?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  { name: 'IPC_CHANNELS – LOGS channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['APPEND', 'GET', 'CLEAR'];
      const missing = keys.filter(k => !IPC_CHANNELS.LOGS?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  { name: 'IPC_CHANNELS – NOTIFICATIONS.SHOW_SYSTEM defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      return { ok: !!IPC_CHANNELS.NOTIFICATIONS?.SHOW_SYSTEM, details: 'NOTIFICATIONS.SHOW_SYSTEM missing' };
    }
  },
  { name: 'IPC_CHANNELS – SHELL.OPEN_EXTERNAL defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      return { ok: !!IPC_CHANNELS.SHELL?.OPEN_EXTERNAL, details: 'SHELL.OPEN_EXTERNAL missing' };
    }
  },
  { name: 'IPC_CHANNELS – PATH channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['JOIN', 'DIRNAME'];
      const missing = keys.filter(k => !IPC_CHANNELS.PATH?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  { name: 'IPC_CHANNELS – SEARCH.GLOBAL defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      return { ok: !!IPC_CHANNELS.SEARCH?.GLOBAL, details: 'SEARCH.GLOBAL missing' };
    }
  },
  { name: 'IPC_CHANNELS – SETTINGS full (GET, UPDATE, RESET, EXPORT, IMPORT, GET_DEFAULTS)',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['GET', 'UPDATE', 'RESET', 'EXPORT', 'IMPORT', 'GET_DEFAULTS'];
      const missing = keys.filter(k => !IPC_CHANNELS.SETTINGS?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  { name: 'IPC_CHANNELS – TASK_GROUPS full channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['GET_ALL', 'CREATE', 'UPDATE', 'DELETE', 'GET_FOR_PROFILE',
        'ENSURE_FOR_PROFILE', 'ASSIGN_PROFILE', 'UNASSIGN_PROFILE'];
      const missing = keys.filter(k => !IPC_CHANNELS.TASK_GROUPS?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  { name: 'IPC_CHANNELS – TASKS full channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['GET_ALL', 'GET_ALL_GROUPED', 'ADD', 'UPDATE', 'DELETE', 'SAVE_SECTIONS'];
      const missing = keys.filter(k => !IPC_CHANNELS.TASKS?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  { name: 'IPC_CHANNELS – TERMINAL full channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['CREATE', 'WRITE', 'RESIZE', 'GET_BUFFER', 'KILL', 'RESTART'];
      const missing = keys.filter(k => !IPC_CHANNELS.TERMINAL?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  { name: 'IPC_CHANNELS – WEBVIEW full channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['NAVIGATE', 'RELOAD', 'GO_BACK', 'GO_FORWARD', 'GET_URL',
        'REGISTER', 'UNREGISTER', 'SCREENSHOT', 'CLEAR_CACHE',
        'SET_USER_AGENT', 'OPEN_IN_WINDOW', 'GET_USAGE', 'SLEEP', 'WAKE',
        'SCHEDULE_INJECTION', 'REMOVE_INJECTION', 'START_HTTP_MONITOR',
        'OPEN_SINGLE', 'CAPTURE', 'GET_RESOURCE'];
      const missing = keys.filter(k => !IPC_CHANNELS.WEBVIEW?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  { name: 'IPC_CHANNELS – PROJECTS full channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['GET_ALL', 'GET_WITH_TASKS', 'CREATE', 'UPDATE', 'ARCHIVE', 'DELETE'];
      const missing = keys.filter(k => !IPC_CHANNELS.PROJECTS?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  { name: 'IPC_CHANNELS – HOTKEYS.REGISTER defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      return { ok: !!IPC_CHANNELS.HOTKEYS?.REGISTER, details: 'HOTKEYS.REGISTER missing' };
    }
  },
  { name: 'IPC_CHANNELS – WORKSPACES full channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['GET_ALL', 'SAVE', 'DELETE'];
      const missing = keys.filter(k => !IPC_CHANNELS.WORKSPACES?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
];

export async function runIPCTests() {
  return runTests('IPC', tests);
}
