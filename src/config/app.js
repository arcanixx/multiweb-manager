// =============================================================================
// FILE:       app.js
// PATH:       src/config/app.js
// VERSION:    0.0.3
// PURPOSE:    Podstawowe stałe aplikacji – środowisko, język, zoom UI, limity UI i stałe profili.
// FUNCTIONS:  -
// DEPENDS ON: -
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// Środowisko aplikacji
export const APP_ENV = process.env.NODE_ENV || 'production';

// Globalny debug (fallback gdy store niedostępny)
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

export const CLIPBOARD_HISTORY_MAX      = 50;
export const SLEEP_TABS_TIMEOUT_DEFAULT = 15 * 60 * 1000; // 15 minut
export const MAX_LAST_USED_PROFILES     = 10;
export const RESOURCE_WARN_AT           = 70;
export const RESOURCE_CRITICAL_AT       = 90;
export const CPU_WARN_AT                = 50;
export const CPU_CRITICAL_AT            = 80;
export const DEFAULT_PROFILE_CATEGORY   = 'AI';
