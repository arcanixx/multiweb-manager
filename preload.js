// =============================================================================
// FILE: preload.js
// PATH: multiweb-manager/preload.js
// VERSION: v1
// PURPOSE: Eksponuje API Electrona do renderera (React) przez contextBridge.
//          Każda metoda to cienka warstwa nad ipcRenderer.invoke/on.
//          Żadna logika biznesowa – tylko przepuszczenie wywołań.
// DEPENDS ON: electron (contextBridge, ipcRenderer)
// =============================================================================

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {

  // --- Profiles ---
  getProfiles: () => ipcRenderer.invoke('get-profiles'),
  saveProfiles: (profiles) => ipcRenderer.invoke('save-profiles', profiles),

  // --- Notes ---
  getNotes: () => ipcRenderer.invoke('get-notes'),
  saveNotes: (notes) => ipcRenderer.invoke('save-notes', notes),

  // --- Settings ---
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (patch) => ipcRenderer.invoke('save-settings', patch),  // patch – partial update

  // --- Tasks ---
  getTasks: (project) => ipcRenderer.invoke('get-tasks', project),
  saveTasks: (project, data) => ipcRenderer.invoke('save-tasks', project, data),
  getAllTasks: () => ipcRenderer.invoke('get-all-tasks'),

  // --- History ---
  getHistory: () => ipcRenderer.invoke('get-history'),
  addHistory: (entry) => ipcRenderer.invoke('add-history', entry),
  clearHistory: () => ipcRenderer.invoke('clear-history'),

  // --- Profile cache ---
  clearProfileCache: (id) => ipcRenderer.invoke('clear-profile-cache', id),

  // --- Updates & version ---
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),

  // --- File dialogs ---
  saveTextToFile: (content, name, folder) =>
    ipcRenderer.invoke('save-text-to-file', content, name, folder),

  // --- Terminal ---
  createTerminal: (cwd) => ipcRenderer.invoke('create-terminal', cwd),
  terminalWrite: (id, data) => ipcRenderer.invoke('terminal-write', id, data),
  terminalResize: (id, cols, rows) => ipcRenderer.invoke('terminal-resize', id, cols, rows),
  killTerminal: (id) => ipcRenderer.invoke('kill-terminal', id),
  onTerminalData: (cb) => ipcRenderer.on('terminal-data', (e, d) => cb(d)),

  // --- App lifecycle ---
  confirmQuit: () => ipcRenderer.invoke('confirm-quit'),
  onCheckBeforeQuit: (cb) => ipcRenderer.on('check-before-quit', () => cb()),
});
