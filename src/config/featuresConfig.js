// =============================================================================
// FILE: featuresConfig.js
// PATH: src/config/featuresConfig.js
// VERSION: 0.0.3
// PURPOSE: Feature flags – włączanie/wyłączanie modułów aplikacji (FEATURES) oraz helpery isFeatureEnabled, isToolEnabled.
// FUNCTIONS: isFeatureEnabled, isToolEnabled
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
  unifiedSearch: false,      // Ctrl+K — BACKLOG, brak implementacji
  quickSwitcher: false,      // Ctrl+P — BACKLOG, brak implementacji

  // WebView
  tileView: true,
  singleAppMode: true,
  screenshotWebView: true,
  resourceMonitor: true,
  sleepTabs: true,
  adBlocker: true,

  // WebView Script Injector — wstrzykiwanie custom CSS/JS do WebView
  // Stan: BACKLOG – implementacja gotowa (src/engine/webviewScriptInjector.js),
  //        brakuje UI konfiguracji. Ustaw true gdy UI będzie gotowe.
  webviewScriptInjector: false,
  devTools: false,

  // Notepad
  syntaxHighlight: false,    // BACKLOG, brak implementacji
  richText: false,           // BACKLOG, brak implementacji

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