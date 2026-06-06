// =============================================================================
// FILE: TestRunner_IpcChannels.js
// PATH: tests/TestRunner_IpcChannels.js
// VERSION: 0.0.3
// PURPOSE: Testy rejestru kanałów IPC (src/constants/ipcChannels.js) — kompletność wszystkich grup, obecność każdej stałej, brak duplikatów wartości, format string 'group:action', rozróżnienie kanałów invoke vs event.
// FUNCTIONS: runIpcChannelsTests
// DEPENDS ON: testUtils.js, path
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
import { join } from 'path';
const ROOT = process.cwd();
// ─── Pomocnik: sprawdza obecność kluczy w grupie ─────────────────────────────
function checkKeys(group, groupName, required) {
  const missing = required.filter(k => !(k in group));
  return { ok: missing.length === 0, details: missing.length ? `${groupName} missing: ${missing.join(', ')}` : '' };
}

const tests = [

  // ── Eksport i struktura bazowa ─────────────────────────────────────────────
  {
    name: 'IPC_CHANNELS – exported from ipcChannels.js',
    run: async () => {
      const mod = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      const ok = mod.IPC_CHANNELS && typeof mod.IPC_CHANNELS === 'object';
      return { ok, details: ok ? '' : 'IPC_CHANNELS not exported' };
    }
  },
  {
    name: 'IPC_CHANNELS – wszystkie wymagane grupy najwyższego poziomu istnieją',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      const required = [
        'PROFILES', 'SETTINGS', 'TASKS', 'TASK_GROUPS', 'AGGREGATED_TASKS',
        'NOTEPAD', 'HISTORY', 'WORKSPACES', 'PROJECTS', 'TERMINAL',
        'WEBVIEW', 'LOGS', 'EVENTS', 'APP', 'APP_INFO', 'FILES', 'FS',
        'HOTKEYS', 'ADBLOCKER', 'SLEEP_TABS', 'SEARCH', 'COOKIES',
        'SHELL', 'APP_LIBRARY', 'TOOLS', 'DIALOGS', 'NOTIFICATIONS', 'PATH'
      ];
      const missing = required.filter(g => !(g in IPC_CHANNELS));
      return { ok: missing.length === 0, details: missing.length ? `Missing groups: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'IPC_CHANNELS – wszystkie leaf values są stringami',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      const errors = [];
      const walk = (obj, path) => {
        for (const [k, v] of Object.entries(obj)) {
          if (typeof v === 'object') walk(v, `${path}.${k}`);
          else if (typeof v !== 'string') errors.push(`${path}.${k} is ${typeof v}`);
        }
      };
      walk(IPC_CHANNELS, 'IPC_CHANNELS');
      return { ok: errors.length === 0, details: errors.join('; ') };
    }
  },
  {
    name: 'IPC_CHANNELS – wszystkie wartości mają format group:action',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      const invalid = [];
      const walk = (obj) => {
        for (const v of Object.values(obj)) {
          if (typeof v === 'object') walk(v);
          // Dozwolony format: 'group:action' lub 'group:subgroup:action' (np. tools:image:resize)
          else if (!/^[a-z][a-zA-Z]+:[a-zA-Z]/.test(v)) invalid.push(v);
        }
      };
      walk(IPC_CHANNELS);
      return { ok: invalid.length === 0, details: invalid.length ? `Bad format: ${invalid.slice(0,5).join(', ')}` : '' };
    }
  },
  {
    name: 'IPC_CHANNELS – brak duplikatów wartości kanałów',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      const values = [];
      const walk = (obj) => {
        for (const v of Object.values(obj)) {
          if (typeof v === 'object') walk(v);
          else values.push(v);
        }
      };
      walk(IPC_CHANNELS);
      const dupes = values.filter((v, i) => values.indexOf(v) !== i);
      return { ok: dupes.length === 0, details: dupes.length ? `Duplicates: ${[...new Set(dupes)].join(', ')}` : '' };
    }
  },

  // ── PROFILES ──────────────────────────────────────────────────────────────
  {
    name: 'IPC_CHANNELS.PROFILES – GET_ALL, CREATE, UPDATE, DELETE, TOUCH',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.PROFILES, 'PROFILES', ['GET_ALL', 'CREATE', 'UPDATE', 'DELETE', 'TOUCH']);
    }
  },
  {
    name: 'IPC_CHANNELS.PROFILES – wartości mają prefix profiles:',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      const bad = Object.values(IPC_CHANNELS.PROFILES).filter(v => !v.startsWith('profiles:'));
      return { ok: bad.length === 0, details: bad.length ? `Wrong prefix: ${bad.join(', ')}` : '' };
    }
  },

  // ── SETTINGS ──────────────────────────────────────────────────────────────
  {
    name: 'IPC_CHANNELS.SETTINGS – GET, UPDATE, RESET, EXPORT, IMPORT, GET_DEFAULTS',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.SETTINGS, 'SETTINGS', ['GET', 'UPDATE', 'RESET', 'EXPORT', 'IMPORT', 'GET_DEFAULTS']);
    }
  },

  // ── TASKS ─────────────────────────────────────────────────────────────────
  {
    name: 'IPC_CHANNELS.TASKS – GET_ALL, GET_ALL_GROUPED, ADD, UPDATE, DELETE, SAVE_SECTIONS',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.TASKS, 'TASKS', ['GET_ALL', 'GET_ALL_GROUPED', 'ADD', 'UPDATE', 'DELETE', 'SAVE_SECTIONS']);
    }
  },

  // ── TASK_GROUPS ───────────────────────────────────────────────────────────
  {
    name: 'IPC_CHANNELS.TASK_GROUPS – CRUD + profile operations',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.TASK_GROUPS, 'TASK_GROUPS', [
        'GET_ALL', 'CREATE', 'UPDATE', 'DELETE',
        'GET_FOR_PROFILE', 'ENSURE_FOR_PROFILE', 'ASSIGN_PROFILE', 'UNASSIGN_PROFILE'
      ]);
    }
  },

  // ── AGGREGATED_TASKS ──────────────────────────────────────────────────────
  {
    name: 'IPC_CHANNELS.AGGREGATED_TASKS – GET_ALL, FILTER, SORT',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.AGGREGATED_TASKS, 'AGGREGATED_TASKS', ['GET_ALL', 'FILTER', 'SORT']);
    }
  },

  // ── NOTEPAD ───────────────────────────────────────────────────────────────
  {
    name: 'IPC_CHANNELS.NOTEPAD – GET_ALL, ADD, UPDATE, DELETE',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.NOTEPAD, 'NOTEPAD', ['GET_ALL', 'ADD', 'UPDATE', 'DELETE']);
    }
  },

  // ── HISTORY ───────────────────────────────────────────────────────────────
  {
    name: 'IPC_CHANNELS.HISTORY – GET_ALL, GET_RECENT, ADD, CLEAR',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.HISTORY, 'HISTORY', ['GET_ALL', 'GET_RECENT', 'ADD', 'CLEAR']);
    }
  },

  // ── WORKSPACES ────────────────────────────────────────────────────────────
  {
    name: 'IPC_CHANNELS.WORKSPACES – GET_ALL, SAVE, DELETE',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.WORKSPACES, 'WORKSPACES', ['GET_ALL', 'SAVE', 'DELETE']);
    }
  },

  // ── PROJECTS ──────────────────────────────────────────────────────────────
  {
    name: 'IPC_CHANNELS.PROJECTS – GET_ALL, GET_WITH_TASKS, CREATE, UPDATE, ARCHIVE, DELETE',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.PROJECTS, 'PROJECTS', ['GET_ALL', 'GET_WITH_TASKS', 'CREATE', 'UPDATE', 'ARCHIVE', 'DELETE']);
    }
  },

  // ── TERMINAL ──────────────────────────────────────────────────────────────
  {
    name: 'IPC_CHANNELS.TERMINAL – invoke channels (CREATE, WRITE, RESIZE, GET_BUFFER, KILL, RESTART)',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.TERMINAL, 'TERMINAL', ['CREATE', 'WRITE', 'RESIZE', 'GET_BUFFER', 'KILL', 'RESTART']);
    }
  },
  {
    name: 'IPC_CHANNELS.TERMINAL – event channels (DATA, EXIT) zdefiniowane',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.TERMINAL, 'TERMINAL', ['DATA', 'EXIT']);
    }
  },

  // ── WEBVIEW ───────────────────────────────────────────────────────────────
  {
    name: 'IPC_CHANNELS.WEBVIEW – nawigacja (NAVIGATE, RELOAD, GO_BACK, GO_FORWARD, GET_URL)',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.WEBVIEW, 'WEBVIEW', ['NAVIGATE', 'RELOAD', 'GO_BACK', 'GO_FORWARD', 'GET_URL']);
    }
  },
  {
    name: 'IPC_CHANNELS.WEBVIEW – kontrola (SLEEP, WAKE, SET_USER_AGENT, OPEN_IN_WINDOW, GET_USAGE)',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.WEBVIEW, 'WEBVIEW', ['SLEEP', 'WAKE', 'SET_USER_AGENT', 'OPEN_IN_WINDOW', 'GET_USAGE']);
    }
  },
  {
    name: 'IPC_CHANNELS.WEBVIEW – rejestracja i narzędzia (REGISTER, UNREGISTER, SCREENSHOT, CAPTURE, OPEN_SINGLE, GET_RESOURCE)',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.WEBVIEW, 'WEBVIEW', ['REGISTER', 'UNREGISTER', 'SCREENSHOT', 'CAPTURE', 'OPEN_SINGLE', 'GET_RESOURCE']);
    }
  },
  {
    name: 'IPC_CHANNELS.WEBVIEW – iniekcja i monitor (SCHEDULE_INJECTION, REMOVE_INJECTION, CLEAR_CACHE, START_HTTP_MONITOR)',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.WEBVIEW, 'WEBVIEW', ['SCHEDULE_INJECTION', 'REMOVE_INJECTION', 'CLEAR_CACHE', 'START_HTTP_MONITOR']);
    }
  },
  {
    name: 'IPC_CHANNELS.WEBVIEW – event channel HTTP_ERROR zdefiniowany',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      const ok = 'HTTP_ERROR' in IPC_CHANNELS.WEBVIEW;
      return { ok, details: ok ? '' : 'HTTP_ERROR not defined' };
    }
  },

  // ── LOGS / EVENTS ─────────────────────────────────────────────────────────
  {
    name: 'IPC_CHANNELS.LOGS – APPEND, GET, CLEAR',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.LOGS, 'LOGS', ['APPEND', 'GET', 'CLEAR']);
    }
  },
  {
    name: 'IPC_CHANNELS.EVENTS – APPEND, GET_FILE, CLEAR',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.EVENTS, 'EVENTS', ['APPEND', 'GET_FILE', 'CLEAR']);
    }
  },

  // ── APP / APP_INFO ────────────────────────────────────────────────────────
  {
    name: 'IPC_CHANNELS.APP – GET_VERSION, CHECK_UPDATES, CONFIRM_QUIT',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.APP, 'APP', ['GET_VERSION', 'CHECK_UPDATES', 'CONFIRM_QUIT']);
    }
  },
  {
    name: 'IPC_CHANNELS.APP_INFO – GET_INFO',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.APP_INFO, 'APP_INFO', ['GET_INFO']);
    }
  },

  // ── FILES / FS ────────────────────────────────────────────────────────────
  {
    name: 'IPC_CHANNELS.FILES – SAVE_TEXT, SAVE_BINARY',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.FILES, 'FILES', ['SAVE_TEXT', 'SAVE_BINARY']);
    }
  },
  {
    name: 'IPC_CHANNELS.FS – READ_FILE, WRITE_FILE',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.FS, 'FS', ['READ_FILE', 'WRITE_FILE']);
    }
  },

  // ── HOTKEYS ───────────────────────────────────────────────────────────────
  {
    name: 'IPC_CHANNELS.HOTKEYS – GET_ALL, SAVE, REGISTER, TRIGGER (event)',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.HOTKEYS, 'HOTKEYS', ['GET_ALL', 'SAVE', 'REGISTER', 'TRIGGER']);
    }
  },

  // ── ADBLOCKER ─────────────────────────────────────────────────────────────
  {
    name: 'IPC_CHANNELS.ADBLOCKER – SET_GLOBAL, GET_GLOBAL, SET_FOR_PROFILE, GET_FOR_PROFILE',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.ADBLOCKER, 'ADBLOCKER', ['SET_GLOBAL', 'GET_GLOBAL', 'SET_FOR_PROFILE', 'GET_FOR_PROFILE']);
    }
  },

  // ── SLEEP_TABS ────────────────────────────────────────────────────────────
  {
    name: 'IPC_CHANNELS.SLEEP_TABS – SET_TIMEOUT, GET_TIMEOUT',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.SLEEP_TABS, 'SLEEP_TABS', ['SET_TIMEOUT', 'GET_TIMEOUT']);
    }
  },

  // ── SEARCH / COOKIES / SHELL ──────────────────────────────────────────────
  {
    name: 'IPC_CHANNELS.SEARCH – GLOBAL',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.SEARCH, 'SEARCH', ['GLOBAL']);
    }
  },
  {
    name: 'IPC_CHANNELS.COOKIES – GET_ALL',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.COOKIES, 'COOKIES', ['GET_ALL']);
    }
  },
  {
    name: 'IPC_CHANNELS.SHELL – OPEN_EXTERNAL',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.SHELL, 'SHELL', ['OPEN_EXTERNAL']);
    }
  },

  // ── APP_LIBRARY ───────────────────────────────────────────────────────────
  {
    name: 'IPC_CHANNELS.APP_LIBRARY – GET_ALL, SEARCH, GET_BY_CATEGORY',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.APP_LIBRARY, 'APP_LIBRARY', ['GET_ALL', 'SEARCH', 'GET_BY_CATEGORY']);
    }
  },

  // ── TOOLS ─────────────────────────────────────────────────────────────────
  {
    name: 'IPC_CHANNELS.TOOLS – regex i markdown (REGEX_TEST, MARKDOWN_RENDER)',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.TOOLS, 'TOOLS', ['REGEX_TEST', 'MARKDOWN_RENDER']);
    }
  },
  {
    name: 'IPC_CHANNELS.TOOLS – grafika (SVG_TO_PNG, IMAGE_RESIZE, IMAGE_CONVERT, IMAGE_COMPRESS)',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.TOOLS, 'TOOLS', ['SVG_TO_PNG', 'IMAGE_RESIZE', 'IMAGE_CONVERT', 'IMAGE_COMPRESS']);
    }
  },
  {
    name: 'IPC_CHANNELS.TOOLS – JSON/YAML (FORMAT_JSON, YAML_TO_JSON, JSON_TO_YAML)',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.TOOLS, 'TOOLS', ['FORMAT_JSON', 'YAML_TO_JSON', 'JSON_TO_YAML']);
    }
  },
  {
    name: 'IPC_CHANNELS.TOOLS – plik i API (FILE_PREVIEW, API_REQUEST, CLIPBOARD_GET)',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.TOOLS, 'TOOLS', ['FILE_PREVIEW', 'API_REQUEST', 'CLIPBOARD_GET']);
    }
  },

  // ── DIALOGS / NOTIFICATIONS / PATH ────────────────────────────────────────
  {
    name: 'IPC_CHANNELS.DIALOGS – OPEN_FILE, SAVE_FILE',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.DIALOGS, 'DIALOGS', ['OPEN_FILE', 'SAVE_FILE']);
    }
  },
  {
    name: 'IPC_CHANNELS.NOTIFICATIONS – SHOW_SYSTEM',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.NOTIFICATIONS, 'NOTIFICATIONS', ['SHOW_SYSTEM']);
    }
  },
  {
    name: 'IPC_CHANNELS.PATH – JOIN, DIRNAME',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      return checkKeys(IPC_CHANNELS.PATH, 'PATH', ['JOIN', 'DIRNAME']);
    }
  },

  // ── Wartości konkretnych kanałów ──────────────────────────────────────────
  {
    name: 'IPC_CHANNELS wartości string – kluczowe kanały mają oczekiwane wartości',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      const checks = [
        [IPC_CHANNELS.PROFILES.GET_ALL,    'profiles:getAll'],
        [IPC_CHANNELS.SETTINGS.GET,        'settings:get'],
        [IPC_CHANNELS.TASKS.GET_ALL,       'tasks:getAll'],
        [IPC_CHANNELS.HISTORY.GET_ALL,     'history:getAll'],
        [IPC_CHANNELS.WORKSPACES.GET_ALL,  'workspaces:getAll'],
        [IPC_CHANNELS.TERMINAL.CREATE,     'terminal:create'],
        [IPC_CHANNELS.SHELL.OPEN_EXTERNAL, 'shell:openExternal'],
        [IPC_CHANNELS.APP_INFO.GET_INFO,   'app:getInfo'],
      ];
      const failed = checks.filter(([actual, expected]) => actual !== expected)
        .map(([actual, expected]) => `expected '${expected}', got '${actual}'`);
      return { ok: failed.length === 0, details: failed.join('; ') };
    }
  },
];

export async function runIpcChannelsTests() {
  return runTests('IpcChannels', tests);
}