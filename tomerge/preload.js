// =============================================================================
// FILE: preload.js
// PATH: preload.js
// VERSION: 0.0.3
// PURPOSE: Most secure IPC bridge for Renderer.
//          - exposes safe API via contextBridge
//          - no direct Node access from renderer
//          - window.mw.invoke(channel, data) → ipcRenderer.invoke
//          - window.mw.on(channel, cb)       → ipcRenderer.on
//          - window.mw.removeListener(...)   → cleanup
// DEPENDS ON: electron (contextBridge, ipcRenderer)
// =============================================================================

import { contextBridge, ipcRenderer } from "electron";

// Safe wrapper for IPC – renderer sees only these 3 methods
const api = {
  // Invoke IPC handler in main process, returns Promise
  invoke: (channel, data) => ipcRenderer.invoke(channel, data),

  // Subscribe to events pushed from main process
  on: (channel, callback) =>
    ipcRenderer.on(channel, (_, payload) => callback(payload)),

  // Unsubscribe from events
  removeListener: (channel, callback) =>
    ipcRenderer.removeListener(channel, callback)
};

contextBridge.exposeInMainWorld("mw", api);

// =============================================================================
// END OF FILE
// =============================================================================
