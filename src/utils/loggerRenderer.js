// =============================================================================
// FILE: loggerRenderer.js
// PATH: src/utils/loggerRenderer.js
// VERSION: 0.0.3
// UWAGA: Nie usuwaj komentarzy nagłówkowych — opisują przeznaczenie modułu.
// PURPOSE: Cienki wrapper re-eksportujący logger.js dla procesu renderera (React).
//          Istnieje po to, żeby komponenty mogły importować z 'loggerRenderer'
//          bez znajomości szczegółów implementacji.
//          Wszystkie faktyczne funkcje logowania są w logger.js.
// DEPENDS ON: ./logger.js
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

// =============================================================================
// END OF FILE
// =============================================================================
