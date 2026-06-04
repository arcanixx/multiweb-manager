// =============================================================================
// FILE: settings.js
// PATH: src/config/settings.js
// VERSION: 0.0.3
// PURPOSE: Domyślne ustawienia aplikacji (DEFAULT_SETTINGS), per-modułowe flagi debugowania (DEBUG_MODULES) i helper getDefaultSetting.
// FUNCTIONS: getDefaultSetting
// DEPENDS ON: app.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { DEBUG_DEFAULT, DEFAULT_LANGUAGE } from './app.js';

// =============================================================================
// DEBUG MODULES — per-modułowe logowanie gdy debugMode === true
// =============================================================================

export const DEBUG_MODULES = {
  webview:  true,
  terminal: true,
  tasks:    true,
  tools:    true,
  settings: true,
  engine:   true,
  store:    true,
  ipc:      true,
  ui:       true,
};

// =============================================================================
// DOMYŚLNE USTAWIENIA APLIKACJI
// =============================================================================

export const DEFAULT_SETTINGS = {
  language:     DEFAULT_LANGUAGE,   // 'pl' | 'en'
  theme:        'dark',             // 'dark' | 'light' | 'system'
  debugMode:    DEBUG_DEFAULT,
  debugModules: { ...DEBUG_MODULES },
  firstRun:     true,
  logsEnabled:  false,
  logsMaxLines: 500,

  // WebView
  sleepTabsTimeout:    15 * 60 * 1000, // 15 minut
  addressBarEditable:  false,
  defaultZoom:         1.0,
  defaultUserAgent:    '',
  adBlockerEnabled:    true,

  // Resource Monitor
  resourceMonitor: {
    warnAt:     70,
    criticalAt: 90,
  },

  // Hotkeys
  hotkeysEnabled: true,

  // Powiadomienia UI / systemowe
  toastsEnabled:               true,
  systemNotificationsEnabled:  true,

  // Dziennik zdarzeń — opt-in, domyślnie wyłączony
  eventLogEnabled: false,

  // Profile defaults
  defaultProfileCategory:  'AI',
  defaultPartitionPrefix:  'profile-',
};

// ─── getDefaultSetting() – zwraca domyślną wartość ustawienia o podanym kluczu
//   @param {string} key – klucz ustawienia w obiekcie DEFAULT_SETTINGS
//   @returns {*}
export function getDefaultSetting(key) {
  return DEFAULT_SETTINGS[key];
}