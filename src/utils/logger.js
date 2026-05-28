// =============================================================================
// FILE: logger.js
// PATH: src/utils/logger.js
// VERSION: 0.0.3
// PURPOSE: Moduł logowania dla procesu renderera (React). Loguje tylko gdy
// FUNCTIONS: initLogger, setDebugMode, isDebugMode, log, warn, error, logDebug, logInfo, logWarn, logError, getLogFilePath
// DEPENDS ON: electron
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// Stan wewnętrzny modułu
let debugMode = false;
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
// isDebugMode() – odczyt aktualnego stanu (np. w Settings.jsx)
// ----------------------------------------------------------------
export function isDebugMode() {
  return debugMode;
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
// Aliasy kompatybilne z main process i core stores
// ----------------------------------------------------------------

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

/** logError – zawsze wypisuje błąd (niezależnie od debugMode). */
export function logError(msg, meta) {
  console.error(`[${timestamp()}] [ERROR]`, msg, meta ?? "");
}

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