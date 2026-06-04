// =============================================================================
// FILE:       features.js
// PATH:       src/config/features.js
// VERSION:    0.0.3
// PURPOSE:    Feature flags – włączanie/wyłączanie modułów aplikacji (FEATURES) oraz helpery isFeatureEnabled, isToolEnabled.
// FUNCTIONS:  isFeatureEnabled, isToolEnabled
// DEPENDS ON: -
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// =============================================================================
// FEATURE FLAGS — włączanie/wyłączanie modułów dla DEBUG
// =============================================================================

export const FEATURES = {
  // Ogólne
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
  removeBg: true,
  stringCombiner: true,
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
  logsAccess: true,
};

// ─── isFeatureEnabled() – sprawdza czy dana funkcja jest włączona w FEATURES
//   @param {string} key – klucz funkcji w obiekcie FEATURES
//   @returns {boolean}
export function isFeatureEnabled(key) {
  return !!FEATURES[key];
}

// ─── isToolEnabled() – alias isFeatureEnabled dla narzędzi
//   @param {string} key – klucz narzędzia w obiekcie FEATURES
//   @returns {boolean}
export function isToolEnabled(key) {
  return !!FEATURES[key];
}
