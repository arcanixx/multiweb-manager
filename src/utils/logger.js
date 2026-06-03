// =============================================================================
// FILE: logger.js
// PATH: src/utils/logger.js
// VERSION: 0.0.3
// PURPOSE: Główna logika logowania z filtrowaniem per-modułowym. Obsługuje proces Main i Renderer.
// FUNCTIONS: initLogger, setDebugMode, setDebugModule, isDebugMode, log, warn, error, logDebug, logInfo, logWarn, logError, getLogFilePath, logUI, logWebview, logTerminal, logTasks, logTools, logSettings, logEngine, logStore, logIPC
// DEPENDS ON: config.js, electron
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { DEBUG_MODULES } from "../config.js";

// Stan wewnętrzny modułu
let debugMode = false;
let modulesState = { ...DEBUG_MODULES };
const DEBUG_MODULE_NAMES = new Set(Object.keys(DEBUG_MODULES));
// ----------------------------------------------------------------
// timestamp() – pomocnicza, zwraca czytelny znacznik czasu
// ----------------------------------------------------------------
function timestamp() {
  return new Date().toLocaleTimeString("pl-PL", { hour12: false });
}
// ----------------------------------------------------------------
// initLogger() – ładuje ustawienie debugMode z settings przez IPC
//   Wywołaj raz przy starcie App.jsx (useEffect)
// ----------------------------------------------------------------
export async function initLogger() {
  try {
    if (typeof window !== "undefined" && window.electronAPI) {
      const settings = await window.electronAPI.getSettings();
      debugMode = settings?.debugMode !== false;
      modulesState = { ...DEBUG_MODULES, ...(settings?.debugModules || {}) };
      if (debugMode) {
        console.log("[LOG] Logger initialized, debugMode=true");
      }
    }
  } catch (e) {
    console.warn("[LOG] Could not init logger:", e.message);
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
// setDebugModule() – przełącza logowanie dla pojedynczego modułu
//   @param {string} moduleName - nazwa modułu z DEBUG_MODULES
//   @param {boolean} enabled - czy moduł ma logować
// ----------------------------------------------------------------
export function setDebugModule(moduleName, enabled) {
  if (DEBUG_MODULE_NAMES.has(moduleName)) {
    modulesState = {
      ...modulesState,
      [moduleName]: enabled !== false
    };
  }
}
// ----------------------------------------------------------------
// isDebugMode() – odczyt aktualnego stanu (np. w Settings.jsx)
// ----------------------------------------------------------------
export function isDebugMode() {
  return debugMode;
}
// log() – loguje standardowe informacje (poziom INFO)
// ----------------------------------------------------------------
export function log(...args) {
  const { moduleName, values } = normalizeLogArgs(args);
  if (shouldLog(moduleName)) {
    console.log(buildPrefix("LOG", moduleName), ...values);
  }
}

// ----------------------------------------------------------------
// warn() – loguje ostrzeżenia (poziom WARN)
// ----------------------------------------------------------------
export function warn(...args) {
  const { moduleName, values } = normalizeLogArgs(args);
  if (shouldLog(moduleName)) {
    console.warn(buildPrefix("WARN", moduleName), ...values);
  }
}

// ----------------------------------------------------------------
// error() – loguje błędy (poziom ERROR) – zawsze widoczne gdy debug
// ----------------------------------------------------------------
export function error(...args) {
  const { moduleName, values } = normalizeLogArgs(args);
  if (shouldLog(moduleName)) {
    console.error(buildPrefix("ERROR", moduleName), ...values);
  }
}

// ----------------------------------------------------------------
// Aliasy kompatybilne z main process i core stores
// ----------------------------------------------------------------

// ─── normalizeLogArgs() – ustala moduł i argumenty wiadomości
//   @param {Array} args - argumenty przekazane do loggera
//   @returns {{ moduleName: string, values: Array }}
function normalizeLogArgs(args) {
  if (args.length >= 2 && typeof args[0] === "string" && DEBUG_MODULE_NAMES.has(args[0])) {
    return { moduleName: args[0], values: args.slice(1) };
  }
  return { moduleName: "ui", values: args };
}

// ─── shouldLog() – sprawdza, czy dany moduł ma prawo logować
//   @param {string} moduleName - nazwa modułu
//   @returns {boolean}
function shouldLog(moduleName) {
  if (typeof window === "undefined") {
    return modulesState[moduleName] !== false;
  }
  return debugMode && modulesState[moduleName] !== false;
}

// ─── buildPrefix() – buduje prefiks loga z czasem, poziomem i modułem
//   @param {string} level - poziom logu
//   @param {string} moduleName - nazwa modułu
//   @returns {string}
function buildPrefix(level, moduleName) {
  return `[${timestamp()}] [${level}][${moduleName}]`;
}

export function logDebug(...args) {
  const { moduleName, values } = normalizeLogArgs(args);
  if (shouldLog(moduleName)) {
    console.log(buildPrefix("DEBUG", moduleName), ...values);
  }
}

export function logInfo(...args) {
  const { moduleName, values } = normalizeLogArgs(args);
  if (shouldLog(moduleName)) {
    console.log(buildPrefix("INFO", moduleName), ...values);
  }
}

export function logWarn(...args) {
  const { moduleName, values } = normalizeLogArgs(args);
  if (shouldLog(moduleName)) {
    console.warn(buildPrefix("WARN", moduleName), ...values);
  }
}

/** logError – loguje błąd zgodnie z debugMode i stanem modułu. */
export function logError(...args) {
  const { moduleName, values } = normalizeLogArgs(args);
  if (shouldLog(moduleName)) {
    console.error(buildPrefix("ERROR", moduleName), ...values);
  }
}

// ─── Metody kategoryzowane (Szybki dostęp) ───
export const logUI = (...args) => logInfo('ui', ...args);
export const logWebview = (...args) => logInfo('webview', ...args);
export const logTerminal = (...args) => logInfo('terminal', ...args);
export const logTasks = (...args) => logInfo('tasks', ...args);
export const logTools = (...args) => logInfo('tools', ...args);
export const logSettings = (...args) => logInfo('settings', ...args);
export const logEngine = (...args) => logInfo('engine', ...args);
export const logStore = (...args) => logInfo('store', ...args);
export const logIPC = (...args) => logInfo('ipc', ...args);

// ----------------------------------------------------------------
// getLogFilePath() – ścieżka do pliku logów
//   W rendererze (React/webpack) zawsze zwraca null,
//   bo nie ma dostępu do Node.js/Electron.
//   Jeśli potrzebujesz ścieżki, pobierz ją przez window.electronAPI.
// ----------------------------------------------------------------
export function getLogFilePath() {
  // UWAGA: require("electron") zostało celowo usunięte.
  // Renderer nie może importować modułów Node.js — powoduje błąd webpacka.
  // Użyj: window.electronAPI.invoke("logger:getLogPath") jeśli potrzeba.
  return null;
}

// =============================================================================
// END OF FILE
// =============================================================================