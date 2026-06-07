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
    GET_ALL:         'tasks:getAll',
    GET_ALL_GROUPED: 'tasks:getAllGrouped',
    ADD:             'tasks:add',
    UPDATE:          'tasks:update',
    DELETE:          'tasks:delete',
    SAVE_SECTIONS:   'tasks:saveSections',
  },

  // ─── Task Groups ───────────────────────────────────────────────
  TASK_GROUPS: {
    GET_ALL:            'taskGroups:getAll',
    CREATE:             'taskGroups:create',
    UPDATE:             'taskGroups:update',
    DELETE:             'taskGroups:delete',
    GET_FOR_PROFILE:    'taskGroups:getForProfile',
    ENSURE_FOR_PROFILE: 'taskGroups:ensureForProfile',
    ASSIGN_PROFILE:     'taskGroups:assignProfile',
    UNASSIGN_PROFILE:   'taskGroups:unassignProfile',
  },

  // ─── Aggregated Tasks ──────────────────────────────────────────
  AGGREGATED_TASKS: {
    GET_ALL: 'aggregatedTasks:getAll',
    FILTER:  'aggregatedTasks:filter',
    SORT:    'aggregatedTasks:sort',
  },

  // ─── Notepad ───────────────────────────────────────────────────
  // UWAGA: Klucz celowo małymi literami (notepad) – zachowanie kompatybilności z istniejącymi callsites
  NOTEPAD: {
    GET_ALL: 'notepad:getAll',
    ADD:     'notepad:add',
    UPDATE:  'notepad:update',
    DELETE:  'notepad:delete',
  },

  // ─── History ───────────────────────────────────────────────────
  HISTORY: {
    GET_ALL:    'history:getAll',
    GET_RECENT: 'history:getRecent',
    ADD:        'history:add',
    CLEAR:      'history:clear',
  },

  // ─── Workspaces ────────────────────────────────────────────────
  WORKSPACES: {
    GET_ALL: 'workspaces:getAll',
    SAVE:    'workspaces:save',
    DELETE:  'workspaces:delete',
  },

  // ─── Projects ──────────────────────────────────────────────────
  PROJECTS: {
    GET_ALL:        'projects:getAll',
    GET_WITH_TASKS: 'projects:getWithTasks',
    CREATE:         'projects:create',
    UPDATE:         'projects:update',
    ARCHIVE:        'projects:archive',
    DELETE:         'projects:delete',
  },

  // ─── Terminal ──────────────────────────────────────────────────
  // terminal:create, terminal:write, terminal:resize, terminal:kill są invoke()
  // TERMINAL.DATA i TERMINAL.EXIT są zdarzeniami (ipcRenderer.on) – nie invoke
  TERMINAL: {
    CREATE:     'terminal:create',
    WRITE:      'terminal:write',
    RESIZE:     'terminal:resize',
    GET_BUFFER: 'terminal:getBuffer',
    KILL:       'terminal:kill',
    RESTART:    'terminal:restart',
    DATA:       'terminal-data',  // event (ipcRenderer.on), nie invoke
    EXIT:       'terminal:exit',  // event (ipcRenderer.on), nie invoke
  },

  // ─── WebView ───────────────────────────────────────────────────
  WEBVIEW: {
    CLEAR_CACHE:        'webview:clearCache',
    SET_USER_AGENT:     'webview:setUserAgent',
    OPEN_IN_WINDOW:     'webview:openInWindow',
    GET_USAGE:          'webview:getUsage',
    SLEEP:              'webview:sleep',
    WAKE:               'webview:wake',
    SCHEDULE_INJECTION: 'webview:scheduleInjection',
    REMOVE_INJECTION:   'webview:removeInjection',
    NAVIGATE:           'webview:navigate',
    RELOAD:             'webview:reload',
    GO_BACK:            'webview:goBack',
    GO_FORWARD:         'webview:goForward',
    GET_URL:            'webview:getURL',
    SCREENSHOT:         'webview:screenshot',
    OPEN_SINGLE:        'webview:openSingle',
    CAPTURE:            'webview:capture',
    GET_RESOURCE:       'webview:getResource',
    REGISTER:           'webview:register',
    UNREGISTER:         'webview:unregister',
    START_HTTP_MONITOR: 'webview:startHttpMonitor',
    HTTP_ERROR:         'webview:http-error',  // event (ipcRenderer.on), nie invoke
  },

  // ─── Logs ──────────────────────────────────────────────────────
  LOGS: {
    APPEND: 'logs:append',
    GET:    'logs:get',
    CLEAR:  'logs:clear',
  },

  // ─── Events ────────────────────────────────────────────────────
  EVENTS: {
    APPEND:   'events:append',
    GET_FILE: 'events:getFile',
    CLEAR:    'events:clear',
  },

  // ─── App ───────────────────────────────────────────────────────
  APP: {
    GET_VERSION:   'app:getVersion',
    CHECK_UPDATES: 'app:checkUpdates',
    CONFIRM_QUIT:  'app:confirmQuit',
  },

  // ─── App Info ──────────────────────────────────────────────────
  APP_INFO: {
    GET_INFO: 'app:getInfo',
  },

  // ─── Files ─────────────────────────────────────────────────────
  FILES: {
    SAVE_TEXT:   'files:saveText',
    SAVE_BINARY: 'files:saveBinary',
  },

  // ─── File System (fs: read/write przez main) ───────────────────
  FS: {
    READ_FILE:  'fs:readFile',
    WRITE_FILE: 'fs:writeFile',
  },

  // ─── Hotkeys ───────────────────────────────────────────────────
  HOTKEYS: {
    GET_ALL:  'hotkeys:getAll',
    SAVE:     'hotkeys:save',
    REGISTER: 'hotkeys:register',
    TRIGGER:  'hotkey:trigger',  // event (ipcRenderer.on), nie invoke
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
    GET_ALL: 'cookies:getAll',
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

  // ─── Tools ─────────────────────────────────────────────────────
  TOOLS: {
    REGEX_TEST:      'tools:regexTest',
    MARKDOWN_RENDER: 'tools:markdownRender',
    SVG_TO_PNG:      'tools:svgToPng',
    IMAGE_RESIZE:    'tools:image:resize',
    IMAGE_CONVERT:   'tools:image:convert',
    IMAGE_COMPRESS:  'tools:image:compress',
    FORMAT_JSON:     'tools:formatJSON',
    YAML_TO_JSON:    'tools:yamlToJson',
    JSON_TO_YAML:    'tools:jsonToYaml',
    FILE_PREVIEW:    'tools:filePreview',
    API_REQUEST:     'tools:apiRequest',
    CLIPBOARD_GET:   'tools:clipboard:get',
  },

  // ─── Dialogs ───────────────────────────────────────────────────
  DIALOGS: {
    OPEN_FILE: 'dialog:openFile',
    SAVE_FILE: 'dialog:saveFile',
  },

  // ─── Notifications ─────────────────────────────────────────────
  NOTIFICATIONS: {
    SHOW_SYSTEM: 'notifications:showSystem',
  },

  // ─── Path Utilities ────────────────────────────────────────────
  PATH: {
    JOIN:    'path:join',
    DIRNAME: 'path:dirname',
  },
};
