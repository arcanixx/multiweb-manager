// =============================================================================
// FILE: loggerRenderer.js
// PATH: src/utils/loggerRenderer.js
// VERSION: 0.0.3
// PURPOSE: Cienki wrapper re-eksportujący logger.js dla procesu renderera (React).
// FUNCTIONS: -
// DEPENDS ON: loggerRenderer, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// Re-eksport wszystkiego z logger.js
// Dzięki temu zarówno:
//   import { log, warn, error } from './loggerRenderer'
//   import { setDebugMode, logError, initLogger } from './loggerRenderer'
// ...działają poprawnie.
export {
  initLogger,       // App.jsx: initLogger() przy starcie
  setDebugMode,     // App.jsx, Settings.jsx: zmiana trybu debug bez reload
  isDebugMode,      // opcjonalny odczyt stanu debug
  log,              // standardowe INFO
  warn,             // ostrzeżenia WARN
  error,            // błędy ERROR
  logDebug,         // alias log()
  logInfo,          // alias log() (main-compatible)
  logWarn,          // alias warn()
  logError,         // WebViewTab.jsx: logError(msg, meta)
  getLogFilePath,   // Settings.jsx: ścieżka do pliku logów (zwraca null w rendererze)
} from "./logger.js";

