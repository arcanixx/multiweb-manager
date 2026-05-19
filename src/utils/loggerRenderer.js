// =============================================================================
// FILE: src/utils/loggerRenderer.js
// PATH: multiweb-manager/src/utils/loggerRenderer.js
// VERSION: 0.0.3
// UWAGA: Nie usuwaj komentarzy nagłówkowych — opisują przeznaczenie modułu.
// PURPOSE: Logger dla renderer process (React) – bez Node.js API
// DEPENDS ON: window.electronAPI.getSettings (preload.js),
// =============================================================================


// src/utils/loggerRenderer.js
// Logger dla renderer process (React) – bez Node.js API
let debugMode = false;

export function initRendererLogger(debug) {
  debugMode = !!debug;
}

export function log(...args) {
  if (debugMode) console.log('[LOG]', ...args);
}

export function warn(...args) {
  if (debugMode) console.warn('[WARN]', ...args);
}

export function error(...args) {
  if (debugMode) console.error('[ERROR]', ...args);
}