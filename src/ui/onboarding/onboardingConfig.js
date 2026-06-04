// =============================================================================
// FILE: onboardingConfig.js
// PATH: src/ui/onboarding/onboardingConfig.js
// VERSION: 0.0.3
// PURPOSE: Stałe konfiguracyjne onboardingu – kroki wizarda i mapa aplikacji szybkiego startu
// FUNCTIONS: -
// DEPENDS ON: -
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// ─── ONBOARDING_STEPS – kolejność kroków wizarda
export const ONBOARDING_STEPS = ['theme', 'language', 'privacy', 'apps', 'account'];

// ─── STEP_TITLE_KEYS – klucze tłumaczeń tytułów kroków
export const STEP_TITLE_KEYS = {
  theme:    'onboarding.step_theme',
  language: 'onboarding.step_language',
  privacy:  'onboarding.step_privacy',
  apps:     'onboarding.step_apps',
  account:  'onboarding.step_account',
};

// ─── QUICK_START_MAP – które aplikacje pokazać w onboardingu per kategoria
// Klucz = id kategorii z app-library.json, wartość = tablica id aplikacji do pokazania
export const QUICK_START_MAP = {
  AI:          ['chatgpt', 'claude', 'deepseek', 'gemini'],
  DEV:         ['github', 'stackOverflow', 'npm', 'codesandbox'],
  PRODUCTIVITY:['notion', 'todoist', 'trello', 'calendar'],
  SOCIAL:      ['discord', 'messenger', 'whatsapp'],
};

// ─── PRIVACY_OPTIONS – opcje prywatności w kroku StepPrivacy
export const PRIVACY_OPTIONS = [
  { key: 'toastsEnabled',    labelKey: 'onboarding.privacy_toasts_label',    descKey: 'onboarding.privacy_toasts_desc',    defaultVal: true  },
  { key: 'logsEnabled',      labelKey: 'onboarding.privacy_logs_label',       descKey: 'onboarding.privacy_logs_desc',      defaultVal: false },
  { key: 'analyticsEnabled', labelKey: 'onboarding.privacy_analytics_label',  descKey: 'onboarding.privacy_analytics_desc', defaultVal: false },
];