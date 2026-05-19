// =============================================================================
// FILE: src/utils/logger.js
// PATH: multiweb-manager/src/utils/logger.js
// VERSION: 0.0.3
// UWAGA: Nie usuwaj komentarzy nagłówkowych — opisują przeznaczenie modułu.
// PURPOSE: Moduł logowania dla procesu renderera (React). Loguje tylko gdy
//          debugMode=true. Eksponuje log(), warn(), error() oraz initLogger()
//          do załadowania ustawień debugMode z electron-store.
//          Niezależny od innych modułów aplikacji.
// DEPENDS ON: window.electronAPI.getSettings (preload.js)
// =============================================================================

// Stan wewnętrzny modułu
let debugMode = false;
let initialized = false;

// ----------------------------------------------------------------
// initLogger() – ładuje ustawienie debugMode z settings przez IPC
//   Wywołaj raz przy starcie App.jsx (useEffect)
// ----------------------------------------------------------------
export async function initLogger() {
  try {
    if (window.electronAPI) {
      const settings = await window.electronAPI.getSettings();
      debugMode = settings.debugMode || false;
      initialized = true;
      if (debugMode) {
        console.log('[LOG] Logger initialized, debugMode=true');
      }
    }
  } catch (e) {
    console.warn('[LOG] Could not init logger:', e.message);
  }
}

// ----------------------------------------------------------------
// setDebugMode() – natychmiastowa zmiana trybu debug bez reload
//   Wywołaj w Settings.jsx po zmianie ustawienia
// ----------------------------------------------------------------
export function setDebugMode(value) {
  debugMode = !!value;
}

// ----------------------------------------------------------------
// log() – loguje standardowe informacje (poziom INFO)
// ----------------------------------------------------------------
export function log(...args) {
  if (debugMode) {
    console.log(`[${timestamp()}] [LOG]`, ...args);
  }
}

// ----------------------------------------------------------------
// warn() – loguje ostrzeżenia (poziom WARN)
// ----------------------------------------------------------------
export function warn(...args) {
  if (debugMode) {
    console.warn(`[${timestamp()}] [WARN]`, ...args);
  }
}

// ----------------------------------------------------------------
// error() – loguje błędy (poziom ERROR) – zawsze widoczne gdy debug
// ----------------------------------------------------------------
export function error(...args) {
  if (debugMode) {
    console.error(`[${timestamp()}] [ERROR]`, ...args);
  }
}

// ----------------------------------------------------------------
// timestamp() – pomocnicza, zwraca czytelny znacznik czasu
// ----------------------------------------------------------------
function timestamp() {
  return new Date().toLocaleTimeString('pl-PL', { hour12: false });
}

// Eksport stanu (do odczytu w komponentach np. Settings)
export function isDebugMode() {
  return debugMode;
}

// --- API procesu głównego (main) i wspólne aliasy ---
export function logDebug(...args) {
  log(...args);
}

export function logInfo(...args) {
  if (debugMode || typeof window === "undefined") {
    console.log(`[${timestamp()}] [INFO]`, ...args);
  }
}

export function logWarn(...args) {
  warn(...args);
}

export function logError(msg, meta) {
  console.error(`[${timestamp()}] [ERROR]`, msg, meta ?? "");
}

export function getLogFilePath() {
  try {
    const { app } = require("electron");
    const path = require("path");
    return path.join(app.getPath("userData"), "logs", "app.log");
  } catch {
    return null;
  }
}
