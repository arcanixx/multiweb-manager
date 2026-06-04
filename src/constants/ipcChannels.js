// =============================================================================
// FILE: ipcChannels.js
// PATH: src/constants/ipcChannels.js
// VERSION: 0.0.3
// PURPOSE: Centralny rejestr nazw kanałów IPC – single source of truth.
//          Eliminuje string literals rozrzucone po handlerach, hookach i preloadzie.
//          Używać wszędzie zamiast ręcznych stringów np. 'profiles:getAll'.
// FUNCTIONS: -
// DEPENDS ON: -
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// Uwaga dla preload.cjs (CommonJS): ten plik jest ESM.
// Preload używa generycznego window.electronAPI.invoke(channel, ...args) – nie importuje tego pliku bezpośrednio.
// Renderer (React) i handlery IPC importują stałe z tego pliku.

export const IPC_CHANNELS = {

  // ─── Profiles ──────────────────────────────────────────────────
  PROFILES: {
    GET_ALL: 'profiles:getAll',
    CREATE:  'profiles:create',
    UPDATE:  'profiles:update',
    DELETE:  'profiles:delete',
    TOUCH:   'profiles:touch',
  },

  // ─── Settings ──────────────────────────────────────────────────
  SETTINGS: {
    GET:          'settings:get',
    UPDATE:       'settings:update',
    RESET:        'settings:reset',
    EXPORT:       'settings:export',
    IMPORT:       'settings:import',
    GET_DEFAULTS: 'settings:getDefaults',
  },

  // ─── Tasks ─────────────────────────────────────────────────────
  TASKS: {
    GET_ALL:       'tasks:getAll',
    ADD:           'tasks:add',
    UPDATE:        'tasks:update',
    DELETE:        'tasks:delete',
    SAVE_SECTIONS: 'tasks:saveSections',
  },

  // ─── notepad ─────────────────────────────────────────────────────
  notepad: {
    GET_ALL: 'notepad:getAll',
    ADD:     'notepad:add',
    UPDATE:  'notepad:update',
    DELETE:  'notepad:delete',
  },

  // ─── History ───────────────────────────────────────────────────
  HISTORY: {
    GET_ALL: 'history:getAll',
    ADD:     'history:add',
    CLEAR:   'history:clear',
  },

  // ─── Workspaces ────────────────────────────────────────────────
  WORKSPACES: {
    GET_ALL: 'workspaces:getAll',
    SAVE:    'workspaces:save',
    DELETE:  'workspaces:delete',
  },

  // ─── Projects ──────────────────────────────────────────────────
  PROJECTS: {
    GET_ALL: 'projects:getAll',
    CREATE:  'projects:create',
    UPDATE:  'projects:update',
    DELETE:  'projects:delete',
  },

  // ─── Terminal ──────────────────────────────────────────────────
  // terminal:create, terminal:write, terminal:resize, terminal:kill są invoke()
  // terminal-data i terminal:exit są zdarzeniami (ipcRenderer.on) – nie invoke
  TERMINAL: {
    CREATE:     'terminal:create',
    WRITE:      'terminal:write',
    RESIZE:     'terminal:resize',
    GET_BUFFER: 'terminal:getBuffer',
    KILL:       'terminal:kill',
    RESTART:    'terminal:restart',
    DATA:       'terminal-data',   // event (ipcRenderer.on), nie invoke
    EXIT:       'terminal:exit',   // event (ipcRenderer.on), nie invoke
  },

  // ─── WebView ───────────────────────────────────────────────────
  WEBVIEW: {
    CLEAR_CACHE:        'webview:clearCache',       // docelowy (Sprint 2), aktualnie 'clear-profile-cache'
    OPEN_SINGLE:        'webview:openSingle',       // docelowy (Sprint 2), aktualnie 'open-single-window'
    CAPTURE:            'webview:capture',          // docelowy (Sprint 2), aktualnie 'capture-webview'
    GET_RESOURCE:       'webview:getResource',      // docelowy (Sprint 2), aktualnie 'get-webview-resource'
    REGISTER:           'webview:register',         // docelowy (Sprint 2), aktualnie 'register-webview'
    UNREGISTER:         'webview:unregister',       // docelowy (Sprint 2), aktualnie 'unregister-webview'
    START_HTTP_MONITOR: 'webview:startHttpMonitor',
    HTTP_ERROR:         'webview:http-error',       // event (ipcRenderer.on)
  },

  // ─── Logs ──────────────────────────────────────────────────────
  LOGS: {
    APPEND: 'logs:append',   // docelowy (Sprint 2), aktualnie 'append-log-file'
    GET:    'logs:get',      // docelowy (Sprint 2), aktualnie 'get-logs-file'
    CLEAR:  'logs:clear',    // docelowy (Sprint 2), aktualnie 'clear-logs-file'
  },

  // ─── App ───────────────────────────────────────────────────────
  APP: {
    GET_VERSION:   'app:getVersion',    // docelowy, aktualnie 'get-app-version'
    CHECK_UPDATES: 'app:checkUpdates',  // docelowy, aktualnie 'check-for-updates'
    CONFIRM_QUIT:  'app:confirmQuit',   // docelowy (Sprint 2), aktualnie 'confirm-quit'
  },

  // ─── Files ─────────────────────────────────────────────────────
  FILES: {
    SAVE_TEXT:   'files:saveText',   // docelowy (Sprint 2), aktualnie 'save-text-to-file'
    SAVE_BINARY: 'files:saveBinary', // docelowy (Sprint 2), aktualnie 'save-file'
  },

  // ─── Hotkeys ───────────────────────────────────────────────────
  HOTKEYS: {
    GET_ALL:  'hotkeys:getAll',
    SAVE:     'hotkeys:save',
    REGISTER: 'hotkeys:register',
    TRIGGER:  'hotkey:trigger', // event (ipcRenderer.on)
  },

  // ─── AdBlocker ─────────────────────────────────────────────────
  ADBLOCKER: {
    SET_GLOBAL:      'adblocker:setGlobal',
    GET_GLOBAL:      'adblocker:getGlobal',
    SET_FOR_PROFILE: 'adblocker:setForProfile',
    GET_FOR_PROFILE: 'adblocker:getForProfile',
  },

  // ─── Sleep Tabs ────────────────────────────────────────────────
  SLEEP_TABS: {
    SET_TIMEOUT: 'sleeptabs:setTimeout',
    GET_TIMEOUT: 'sleeptabs:getTimeout',
  },

  // ─── Search ────────────────────────────────────────────────────
  SEARCH: {
    GLOBAL: 'search:global',
  },

  // ─── Cookies ───────────────────────────────────────────────────
  COOKIES: {
    GET_ALL: 'tools:getCookies',
  },

  // ─── Shell ─────────────────────────────────────────────────────
  SHELL: {
    OPEN_EXTERNAL: 'shell:openExternal',
  },

  // ─── App Library ───────────────────────────────────────────────
  APP_LIBRARY: {
    GET_ALL:         'appLibrary:getAll',
    SEARCH:          'appLibrary:search',
    GET_BY_CATEGORY: 'appLibrary:getByCategory',
  },
};