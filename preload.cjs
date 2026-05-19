// =============================================================================
// FILE: preload.cjs
// PATH: multiweb-manager/preload.cjs
// VERSION: 0.0.3
// PURPOSE: Eksponuje API Electrona do renderera (React) przez contextBridge.
//          WAŻNE: Ten plik MUSI być CommonJS (.cjs), bo Electron preload
//          nie obsługuje ESM. Projekt ma "type":"module" w package.json,
//          stąd rozszerzenie .cjs zamiast .js.
// DEPENDS ON: electron (contextBridge, ipcRenderer)
// UWAGA: Nie usuwaj komentarzy — opisują przeznaczenie każdej metody IPC.
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
  // patch = partial update; merge wykonuje main, nie overwrite
  getSettings:  ()      => ipcRenderer.invoke('get-settings'),
  saveSettings: (patch) => ipcRenderer.invoke('save-settings', patch),

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

  // ─── Terminal ─────────────────────────────────────────────────
  createTerminal: (cwd)          => ipcRenderer.invoke('create-terminal', cwd),
  terminalWrite:  (id, data)     => ipcRenderer.invoke('terminal-write', id, data),
  terminalResize: (id, cols, rows) => ipcRenderer.invoke('terminal-resize', id, cols, rows),
  killTerminal:   (id)           => ipcRenderer.invoke('kill-terminal', id),

  // onTerminalData zwraca cleanup — zawsze usuwaj listener przy unmount
  onTerminalData: (cb) => {
    const listener = (_, payload) => cb(payload);
    ipcRenderer.on('terminal-data', listener);
    return () => ipcRenderer.removeListener('terminal-data', listener);
  },

  // ─── Misc ─────────────────────────────────────────────────────
  openExternal: (url) => ipcRenderer.invoke('misc:openExternal', url),

  // ─── App lifecycle ────────────────────────────────────────────
  confirmQuit: () => ipcRenderer.invoke('confirm-quit'),

  // onCheckBeforeQuit: wywołuje cb gdy main pyta o zgodę na zamknięcie
  onCheckBeforeQuit: (cb) => ipcRenderer.on('check-before-quit', () => cb()),

  // ─── Generic invoke (dla nowych kanałów namespaced) ───────────
  // Używany przez hooki: useSettings, useTasks, useProjects itp.
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
});
