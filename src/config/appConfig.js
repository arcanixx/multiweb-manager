// =============================================================================
// FILE: appConfig.js
// PATH: src/config/appConfig.js
// VERSION: 0.0.3
// PURPOSE: Podstawowe stałe aplikacji – środowisko, język, zoom UI, limity UI i stałe profili.
// FUNCTIONS: -
// DEPENDS ON: -
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// Środowisko aplikacji
export const APP_ENV = process.env.NODE_ENV || 'production';

// Globalny debug (fallback gdy store niedostępny)
// UWAGA: true tylko na czas developmentu – przed release zmienić na:
//   export const DEBUG_DEFAULT = APP_ENV !== 'production';
export const DEBUG_DEFAULT = true;

// =============================================================================
// JĘZYKI
// =============================================================================

export const LANGUAGES = ['pl', 'en'];

// Domyślny język – fallback przy pierwszym uruchomieniu
export const DEFAULT_LANGUAGE = 'pl';

// =============================================================================
// UI ZOOM
// =============================================================================

export const UI_ZOOM = {
  DEFAULT: 0.9,
  MIN:     0.5,
  MAX:     1.5,
  STEP:    0.1,
};

// =============================================================================
// STAŁE RÓŻNE
// =============================================================================

// UWAGA: CLIPBOARD_HISTORY_MAX, SLEEP_TABS_TIMEOUT_DEFAULT, RESOURCE_WARN_AT,
//        RESOURCE_CRITICAL_AT zostały usunięte – kanoniczne wartości w:
//          • limitsConfig.js → LIMITS.maxClipboardItems
//          • settingsConfig.js → DEFAULT_SETTINGS.sleepTabsTimeout
//          • settingsConfig.js → DEFAULT_SETTINGS.resourceMonitor.warnAt / criticalAt

export const MAX_LAST_USED_PROFILES   = 10;
export const CPU_WARN_AT              = 50;
export const CPU_CRITICAL_AT          = 80;
export const DEFAULT_PROFILE_CATEGORY = 'AI';
