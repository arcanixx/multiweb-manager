// =============================================================================
// FILE: TestRunner_IPC.js
// PATH: tests/TestRunner_IPC.js
// VERSION: 0.0.3
// PURPOSE: Testy dostępności wszystkich kanałów IPC przez window.electronAPI – profiles, settings, history, workspaces, tasks, terminal, notes, hotkeys, adBlocker, webview, tools, search, logs.
// FUNCTIONS: runIPCTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// IPC.js ma już dużo testów - sprawdzam co brakuje według audytu i dołączam
// Brakuje: ADBLOCKER.SET_FOR_PROFILE/GET_FOR_PROFILE, AGGREGATED_TASKS, APP.CONFIRM_QUIT,
// APP_INFO.GET_INFO/GET_VERSION/CHECK_UPDATES, APP_LIBRARY, COOKIES, DIALOGS, EVENTS,
// TOOLS (FILE_PREVIEW/API_REQUEST/CLIPBOARD_GET), FS, FILES, HOTKEYS.REGISTER, 
// imageSharp (TOOLS.IMAGE_*), jsonYaml (TOOLS.FORMAT_JSON/YAML_*), LOGS, NOTIFICATIONS,
// SHELL, PATH, regexMarkdown (TOOLS.REGEX_TEST/MARKDOWN_RENDER), SEARCH, 
// SETTINGS full (RESET/EXPORT/IMPORT/GET_DEFAULTS), TASK_GROUPS full, TASKS full,
// TERMINAL full, WEBVIEW full, WORKSPACES
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
  // ─── IPC_CHANNELS kompletność — pokrycie per handler ──────────────────────
  // Weryfikujemy obecność kluczy w IPC_CHANNELS (static, bez Electron)

  {
    name: 'IPC_CHANNELS – ADBLOCKER channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['SET_GLOBAL', 'GET_GLOBAL', 'SET_FOR_PROFILE', 'GET_FOR_PROFILE'];
      const missing = keys.filter(k => !IPC_CHANNELS.ADBLOCKER?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'IPC_CHANNELS – AGGREGATED_TASKS channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['GET_ALL', 'FILTER', 'SORT'];
      const missing = keys.filter(k => !IPC_CHANNELS.AGGREGATED_TASKS?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'IPC_CHANNELS – APP channels defined (CONFIRM_QUIT, GET_VERSION, CHECK_UPDATES)',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['CONFIRM_QUIT', 'GET_VERSION', 'CHECK_UPDATES'];
      const missing = keys.filter(k => !IPC_CHANNELS.APP?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'IPC_CHANNELS – APP_INFO.GET_INFO defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const ok = !!IPC_CHANNELS.APP_INFO?.GET_INFO;
      return { ok, details: ok ? '' : 'APP_INFO.GET_INFO missing' };
    }
  },
  {
    name: 'IPC_CHANNELS – APP_LIBRARY channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['GET_ALL', 'SEARCH', 'GET_BY_CATEGORY'];
      const missing = keys.filter(k => !IPC_CHANNELS.APP_LIBRARY?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'IPC_CHANNELS – COOKIES.GET_ALL defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const ok = !!IPC_CHANNELS.COOKIES?.GET_ALL;
      return { ok, details: ok ? '' : 'COOKIES.GET_ALL missing' };
    }
  },
  {
    name: 'IPC_CHANNELS – DIALOGS channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['OPEN_FILE', 'SAVE_FILE'];
      const missing = keys.filter(k => !IPC_CHANNELS.DIALOGS?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'IPC_CHANNELS – EVENTS channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['APPEND', 'GET_FILE', 'CLEAR'];
      const missing = keys.filter(k => !IPC_CHANNELS.EVENTS?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'IPC_CHANNELS – FS channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['READ_FILE', 'WRITE_FILE'];
      const missing = keys.filter(k => !IPC_CHANNELS.FS?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'IPC_CHANNELS – FILES channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['SAVE_TEXT', 'SAVE_BINARY'];
      const missing = keys.filter(k => !IPC_CHANNELS.FILES?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'IPC_CHANNELS – TOOLS channels defined (FILE_PREVIEW, API_REQUEST, CLIPBOARD_GET, FORMAT_JSON, YAML_TO_JSON, JSON_TO_YAML, REGEX_TEST, MARKDOWN_RENDER, SVG_TO_PNG, IMAGE_*)',
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
  {
    name: 'IPC_CHANNELS – LOGS channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['APPEND', 'GET', 'CLEAR'];
      const missing = keys.filter(k => !IPC_CHANNELS.LOGS?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'IPC_CHANNELS – NOTIFICATIONS.SHOW_SYSTEM defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const ok = !!IPC_CHANNELS.NOTIFICATIONS?.SHOW_SYSTEM;
      return { ok, details: ok ? '' : 'NOTIFICATIONS.SHOW_SYSTEM missing' };
    }
  },
  {
    name: 'IPC_CHANNELS – SHELL.OPEN_EXTERNAL defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const ok = !!IPC_CHANNELS.SHELL?.OPEN_EXTERNAL;
      return { ok, details: ok ? '' : 'SHELL.OPEN_EXTERNAL missing' };
    }
  },
  {
    name: 'IPC_CHANNELS – PATH channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['JOIN', 'DIRNAME'];
      const missing = keys.filter(k => !IPC_CHANNELS.PATH?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'IPC_CHANNELS – SEARCH.GLOBAL defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const ok = !!IPC_CHANNELS.SEARCH?.GLOBAL;
      return { ok, details: ok ? '' : 'SEARCH.GLOBAL missing' };
    }
  },
  {
    name: 'IPC_CHANNELS – SETTINGS full (GET, UPDATE, RESET, EXPORT, IMPORT, GET_DEFAULTS)',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['GET', 'UPDATE', 'RESET', 'EXPORT', 'IMPORT', 'GET_DEFAULTS'];
      const missing = keys.filter(k => !IPC_CHANNELS.SETTINGS?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'IPC_CHANNELS – TASK_GROUPS full channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['GET_ALL', 'CREATE', 'UPDATE', 'DELETE', 'GET_FOR_PROFILE',
        'ENSURE_FOR_PROFILE', 'ASSIGN_PROFILE', 'UNASSIGN_PROFILE'];
      const missing = keys.filter(k => !IPC_CHANNELS.TASK_GROUPS?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'IPC_CHANNELS – TASKS full channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['GET_ALL', 'GET_ALL_GROUPED', 'ADD', 'UPDATE', 'DELETE', 'SAVE_SECTIONS'];
      const missing = keys.filter(k => !IPC_CHANNELS.TASKS?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'IPC_CHANNELS – TERMINAL full channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['CREATE', 'WRITE', 'RESIZE', 'GET_BUFFER', 'KILL', 'RESTART'];
      const missing = keys.filter(k => !IPC_CHANNELS.TERMINAL?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'IPC_CHANNELS – WEBVIEW full channels defined',
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
  {
    name: 'IPC_CHANNELS – PROJECTS full channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['GET_ALL', 'GET_WITH_TASKS', 'CREATE', 'UPDATE', 'ARCHIVE', 'DELETE'];
      const missing = keys.filter(k => !IPC_CHANNELS.PROJECTS?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'IPC_CHANNELS – HOTKEYS.REGISTER defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const ok = !!IPC_CHANNELS.HOTKEYS?.REGISTER;
      return { ok, details: ok ? '' : 'HOTKEYS.REGISTER missing' };
    }
  },
  {
    name: 'IPC_CHANNELS – WORKSPACES full channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import('../src/constants/ipcChannels.js');
      const keys = ['GET_ALL', 'SAVE', 'DELETE'];
      const missing = keys.filter(k => !IPC_CHANNELS.WORKSPACES?.[k]);
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'IPC adBlocker – setAdBlockerForProfile, getAdBlockerForProfile',
    run: async () => {
      if (typeof window === 'undefined' || !window.electronAPI) return { ok: false, details: 'electronAPI missing' };
      const hasSet = typeof window.electronAPI.setAdBlockerForProfile === 'function';
      const hasGet = typeof window.electronAPI.getAdBlockerForProfile === 'function';
      const ok = hasSet && hasGet;
      return { ok, details: ok ? '' : `setForProfile=${hasSet}, getForProfile=${hasGet}` };
    }
  },
];

export async function runIPCTests() {
  return runTests('IPC', tests);
}
