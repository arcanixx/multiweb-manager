// =============================================================================
// FILE: preload.cjs
// PATH: preload.cjs
// VERSION: 0.0.3
// PURPOSE: Bridge IPC – eksponuje bezpieczne API dla renderera (contextBridge). Zapewnia cleanup listenerów dla terminala, logów, hotkeys.
// FUNCTIONS: -
// DEPENDS ON: electron
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  
  // ─── Profiles ─────────────────────────────────────────────────
  getProfiles:    ()           => ipcRenderer.invoke('get-profiles'),
  saveProfiles:   (profiles)   => ipcRenderer.invoke('save-profiles', profiles),
  
  // ─── Notes ────────────────────────────────────────────────────
  getNotes:   ()      => ipcRenderer.invoke('get-notes'),
  saveNotes:  (notes) => ipcRenderer.invoke('save-notes', notes),
  
  // ─── Settings ─────────────────────────────────────────────────
  getSettings:  ()      => ipcRenderer.invoke('settings:get'),
  saveSettings: (patch) => ipcRenderer.invoke('settings:update', patch),
  resetSettings: () => ipcRenderer.invoke('settings:reset'),
  setDebugMode: (enabled) => ipcRenderer.invoke('settings:update', { debugMode: enabled }),
  setDebugModule: (moduleName, enabled) => ipcRenderer.invoke('settings:update', {
    debugModules: { [moduleName]: enabled }
  }),
  
  // ─── Tasks ────────────────────────────────────────────────────
  getTasks:    (project)       => ipcRenderer.invoke('get-tasks', project),
  saveTasks:   (project, data) => ipcRenderer.invoke('save-tasks', project, data),
  getAllTasks:  ()              => ipcRenderer.invoke('get-all-tasks'),
  
  // ─── History ──────────────────────────────────────────────────
  getHistory:   ()      => ipcRenderer.invoke('get-history'),
  addHistory:   (entry) => ipcRenderer.invoke('add-history', entry),
  clearHistory: ()      => ipcRenderer.invoke('clear-history'),
  
  // ─── WebView ──────────────────────────────────────────────────
  clearProfileCache: (id)  => ipcRenderer.invoke('clear-profile-cache', id),
  
  // ─── Updates & version ────────────────────────────────────────
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  getAppVersion:   () => ipcRenderer.invoke('get-app-version'),
  
  // ─── File dialogs ─────────────────────────────────────────────
  saveTextToFile: (content, name, folder) =>
    ipcRenderer.invoke('save-text-to-file', content, name, folder),
  saveFile: (payload) => ipcRenderer.invoke('save-file', payload),
  
  // ─── Terminal ─────────────────────────────────────────────────
  createTerminal: (cwd)          => ipcRenderer.invoke('create-terminal', cwd),
  terminalWrite:  (id, data)     => ipcRenderer.invoke('terminal-write', id, data),
  terminalResize: (id, cols, rows) => ipcRenderer.invoke('terminal-resize', id, cols, rows),
  killTerminal:   (id)           => ipcRenderer.invoke('kill-terminal', id),
  
  onTerminalData: (callback) => {
    const listener = (_, payload) => callback(payload);
    ipcRenderer.on('terminal-data', listener);
    return () => ipcRenderer.removeListener('terminal-data', listener);
  },
  onTerminalExit: (callback) => {
    const listener = (_, code) => callback(code);
    ipcRenderer.on('terminal:exit', listener);
    return () => ipcRenderer.removeListener('terminal:exit', listener);
  },

  terminalStart: () => ipcRenderer.invoke('terminal:start'),
  terminalWriteLegacy: (data) => ipcRenderer.invoke('terminal:write', data),
  terminalResizeLegacy: (cols, rows) => ipcRenderer.invoke('terminal:resize', cols, rows),
  terminalKillLegacy: () => ipcRenderer.invoke('terminal:kill'),

  // ─── Misc ─────────────────────────────────────────────────────
  openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url),

  // ─── App lifecycle ────────────────────────────────────────────
  confirmQuit: () => ipcRenderer.invoke('confirm-quit'),
  onCheckBeforeQuit: (callback) => {
    const listener = () => callback();
    ipcRenderer.on('check-before-quit', listener);
    return () => ipcRenderer.removeListener('check-before-quit', listener);
  },

  // ─── LogWriter ────────────────────────────────────────────────
  appendLogFile: (payload) => ipcRenderer.invoke('append-log-file', payload),
  getLogsFile: () => ipcRenderer.invoke('get-logs-file'),
  clearLogsFile: () => ipcRenderer.invoke('clear-logs-file'),

  // ─── Cookie Grabber ───────────────────────────────────────────
  getCookies: (partition) => ipcRenderer.invoke('tools:getCookies', partition),

  // ─── Single App Mode, Screenshot, Resource Monitor ───────────
  openSingleWindow: (payload) => ipcRenderer.invoke('open-single-window', payload),
  captureWebView: (tabId) => ipcRenderer.invoke('capture-webview', tabId),
  getWebViewResourceInfo: (tabId) => ipcRenderer.invoke('get-webview-resource', tabId),

  // ─── Hotkeys ──────────────────────────────────────────────────
  getHotkeys: () => ipcRenderer.invoke('hotkeys:getAll'),
  saveHotkeys: (hotkeys) => ipcRenderer.invoke('hotkeys:save', hotkeys),
  registerGlobalHotkeys: (hotkeys) => ipcRenderer.invoke('hotkeys:register', hotkeys),
  onHotkeyTrigger: (callback) => {
    const listener = (_, data) => callback(data);
    ipcRenderer.on('hotkey:trigger', listener);
    return () => ipcRenderer.removeListener('hotkey:trigger', listener);
  },

  // ─── AdBlocker ────────────────────────────────────────────────
  setGlobalAdBlocker: (enabled) => ipcRenderer.invoke('adblocker:setGlobal', enabled),
  getGlobalAdBlocker: () => ipcRenderer.invoke('adblocker:getGlobal'),
  setAdBlockerForProfile: (profileId, enabled) => ipcRenderer.invoke('adblocker:setForProfile', profileId, enabled),
  getAdBlockerForProfile: (profileId) => ipcRenderer.invoke('adblocker:getForProfile', profileId),

  // ─── Sleep Tabs ───────────────────────────────────────────────
  setSleepTimeout: (minutes) => ipcRenderer.invoke('sleeptabs:setTimeout', minutes),
  getSleepTimeout: () => ipcRenderer.invoke('sleeptabs:getTimeout'),

  // ─── WebView registry (dla screenshot/resource) ───────────────
  registerWebView: (tabId, webContentsId) => ipcRenderer.invoke('register-webview', tabId, webContentsId),
  unregisterWebView: (tabId) => ipcRenderer.invoke('unregister-webview', tabId),

  // ─── Generic invoke (dla nowych kanałów namespaced) ───────────
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args)
});
