// =============================================================================
// FILE: config.js
// PATH: src/config.js
// VERSION: 0.0.3
// PURPOSE: Centralna konfiguracja aplikacji – feature flags, API endpoints,
// FUNCTIONS: isFeatureEnabled, isToolEnabled, getDefaultSetting, getLimit
// DEPENDS ON: -
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// Środowisko aplikacji
export const APP_ENV = process.env.NODE_ENV || "production";
// Globalny debug (fallback, jeśli store nie istnieje)
export const DEBUG_DEFAULT = true;
// =============================================================================
// JĘZYKI – lista dostępnych języków w aplikacji
// =============================================================================
export const LANGUAGES = ['pl', 'en'];   // tu dodasz kolejne: 'de', 'fr', itp.
// -----------------------------------------------------------------------------
// I18N / LANGUAGE
// -----------------------------------------------------------------------------
// Domyślny język aplikacji.
// Używany przy pierwszym uruchomieniu oraz jako fallback,
// jeśli nie uda się odczytać ustawień użytkownika.
export const DEFAULT_LANGUAGE = "pl";
// -----------------------------------------------------------------------------
// UI ZOOM
// -----------------------------------------------------------------------------
// Konfiguracja powiększenia UI.
// - DEFAULT: startowa wartość (np. 0.9 = 90%)
// - MIN/MAX: zakres dopuszczalnych wartości
// - STEP: krok zmiany przy zoom in/out
export const UI_ZOOM = {
  DEFAULT: 0.9,
  MIN: 0.5,
  MAX: 1.5,
  STEP: 0.1
};
// =============================================================================
// DODATKOWE STAŁE KONFIGURACYJNE (używane przez różne moduły)
// =============================================================================
export const CLIPBOARD_HISTORY_MAX = 50;
export const SLEEP_TABS_TIMEOUT_DEFAULT = 15 * 60 * 1000; // 15 minut
export const MAX_LAST_USED_PROFILES = 10;
export const RESOURCE_WARN_AT = 70;
export const RESOURCE_CRITICAL_AT = 90;
export const CPU_WARN_AT = 50;
export const CPU_CRITICAL_AT = 80;
export const DEFAULT_PROFILE_CATEGORY = "AI";

// =============================================================================
// FEATURE FLAGS — włączanie/wyłączanie modułów
// =============================================================================

export const FEATURES = {
  // Core
  startupTests: true,
  helpScreen: true,
  appLibrary: true,
  unifiedSearch: true,       // Ctrl+K
  quickSwitcher: true,       // Ctrl+P

  // WebView
  tileView: true,
  singleAppMode: true,
  screenshotWebView: true,
  resourceMonitor: true,
  sleepTabs: true,
  adBlocker: true,
  devTools: false,

  // Notepad
  syntaxHighlight: true,
  richText: true,

  // Tools
  jsonYamlXmlFormatter: true,
  regexTester: true,
  markdownPreviewer: true,
  imageTools: true,
  svgToPng: true,
  filePreviewer: true,
  miniPostman: true,
  clipboardHistory: true,
  cookieGrabber: true,

  // Settings
  hotkeysManager: true,
  exportImport: true,
  darkMode: true,
  logsAccess: true
};

// =============================================================================
// ŚCIEŻKI
// =============================================================================

export const PATHS = {
  logsDir: "logs",
  startupTestLog: "logs/startup-tests.log",
  screenshotsDir: "screenshots",
  cookiesExportDir: "cookies",
  profilesDir: "profiles",
  settingsBackupDir: "backups/settings"
};

// =============================================================================
// LIMITY
// =============================================================================

export const LIMITS = {
  maxClipboardItems: 50,
  maxRecentApps: 20,
  maxNotes: 200,
  maxTasks: 2000,
  maxProjects: 200,
  maxHistoryEntries: 5000,
  maxWebviews: 20,
  maxTileViewColumns: 3
};

// =============================================================================
// DOMYŚLNE USTAWIENIA APLIKACJI
// =============================================================================

export const DEFAULT_SETTINGS = {
  language: DEFAULT_LANGUAGE,                 // 'pl' | 'en'
  theme: "dark",                  // 'dark' | 'light' | 'system'
  debugMode: DEBUG_DEFAULT,
  firstRun: true,
  logsEnabled: false,
  logsMaxLines: 500,

  // WebView
  sleepTabsTimeout: 15 * 60 * 1000, // 15 minut
  addressBarEditable: false,
  defaultZoom: 1.0,
  defaultUserAgent: "",
  adBlockerEnabled: true,

  // Resource Monitor
  resourceMonitor: {
    warnAt: 70,
    criticalAt: 90
  },

  // Hotkeys
  hotkeysEnabled: true,

  // Profile defaults
  defaultProfileCategory: "AI",
  defaultPartitionPrefix: "profile-"
};

// =============================================================================
// HELPERY
// =============================================================================

export function isFeatureEnabled(key) {
  return !!FEATURES[key];
}

export function isToolEnabled(key) {
  return !!FEATURES[key];
}

export function getDefaultSetting(key) {
  return DEFAULT_SETTINGS[key];
}

export function getLimit(key) {
  return LIMITS[key];
}


// -----------------------------------------------------------------------------
// API ENDPOINTS
// -----------------------------------------------------------------------------

export const API_ENDPOINTS = {
  removeBg: "https://api.remove.bg/v1.0/removebg"
};

