// =============================================================================
// FILE: config.js
// PATH: src/config.js
// VERSION: 0.0.3
// PURPOSE: Centralna konfiguracja aplikacji – feature flags, API endpoints,
//          domyślne ustawienia, język, zoom UI.
//          Centralna konfiguracja aplikacji:
//          - feature flagi
//          - domyślne ustawienia
//          - limity, ścieżki, tryby
//          - wartości techniczne dla WebView, Tools, Settings, Sidebar, Terminal
//          Używane zarówno w main (Electron), jak i w renderer (React).
// =============================================================================

// Środowisko aplikacji
export const APP_ENV = process.env.NODE_ENV || "production";

// Globalny debug (fallback, jeśli store nie istnieje)
export const DEBUG_DEFAULT = true;


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
  language: "pl",                 // 'pl' | 'en'
  theme: "dark",                  // 'dark' | 'light' | 'system'
  debugMode: DEBUG_DEFAULT,

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

// =============================================================================
// END OF FILE
// =============================================================================