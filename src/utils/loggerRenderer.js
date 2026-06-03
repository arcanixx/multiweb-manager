// =============================================================================
// FILE:       loggerRenderer.js
// PATH:       src/utils/loggerRenderer.js
// VERSION:    0.0.3
// PURPOSE:    Cienki wrapper re-eksportujący logger.js dla procesu renderera (React).
//             Eksportuje też LOG_CATEGORIES – stałą z nazwami dostępnych kategorii,
//             przydatną przy dynamicznym filtrowaniu logów w DebugModulesSection.jsx.
// FUNCTIONS:  -
// DEPENDS ON: loggerRenderer, logger.js, config.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// ─── Re-eksport wszystkiego z logger.js ───────────────────────────────────────
// Dzięki temu zarówno:
//   import { logInfo, logError } from './loggerRenderer'
//   import { setDebugMode, initLogger } from './loggerRenderer'
// ...działają poprawnie bez dodatkowych importów.
export {
  initLogger,       // App.jsx: wywołaj przy starcie aplikacji
  setDebugMode,     // Settings.jsx: zmiana trybu debug bez reload
  setDebugModule,   // DebugModulesSection.jsx: toggle per moduł
  isDebugMode,      // opcjonalny odczyt stanu debug
  log,              // standardowe INFO
  warn,             // ostrzeżenia WARN
  error,            // błędy ERROR
  logDebug,         // alias log()
  logInfo,          // alias log() — preferowany w nowym kodzie
  logWarn,          // alias warn()
  logError,         // alias error()
  getLogFilePath,   // Settings.jsx: ścieżka do pliku logów (zwraca null w rendererze)
} from './logger.js';

// ─── LOG_CATEGORIES – lista dostępnych kategorii logów ────────────────────────
//   Spójna z kluczami DEBUG_MODULES w config.js.
//   Używaj w komponentach do dropdownów, filtrów, dynamicznych wywołań loggera.
//
//   Przykład użycia w komponencie:
//     import { LOG_CATEGORIES, logInfo } from '../utils/loggerRenderer';
//     logInfo(LOG_CATEGORIES.WEBVIEW, 'Strona załadowana', url);
//
//   Przykład użycia przy filtrze:
//     LOG_CATEGORIES_LIST.forEach(cat => renderToggle(cat))
export const LOG_CATEGORIES = {
  WEBVIEW:  'webview',
  TERMINAL: 'terminal',
  TASKS:    'tasks',
  TOOLS:    'tools',
  SETTINGS: 'settings',
  ENGINE:   'engine',
  STORE:    'store',
  IPC:      'ipc',
  UI:       'ui',
};

// ─── LOG_CATEGORIES_LIST – tablica kategorii do iteracji (np. w pętlach UI) ───
export const LOG_CATEGORIES_LIST = Object.values(LOG_CATEGORIES);

// =============================================================================
// END OF FILE
// =============================================================================
