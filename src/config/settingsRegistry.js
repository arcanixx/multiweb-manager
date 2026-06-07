// =============================================================================
// FILE: settingsRegistry.js
// PATH: src/config/settingsRegistry.js
// VERSION: 0.0.3
// PURPOSE: Centralny rejestr widoków ustawień i narzędzi systemowych (SettingsContainer). Eliminuje switch-case — nowy widok = nowy wpis w rejestrze. Wzorzec analogiczny do toolsRegistry.js.
// FUNCTIONS: getSettingsComponent
// DEPENDS ON: react, config.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { lazy } from 'react';
import { isFeatureEnabled } from '../config.js';
import { logWarn } from '../utils/logger.js';

// ─── SETTINGS_REGISTRY – mapa id widoku → konfiguracja
//   id:          string  — zgodne z activeItem.id (Sidebar)
//   component:   lazy()  — lazy import komponentu
//   featureFlag: string? — klucz w FEATURES; brak = zawsze dostępne
//   getProps:    fn?     — (context) => Object – dynamiczne propsy z kontekstu
export const SETTINGS_REGISTRY = [
  {
    id:       'settings',
    component: lazy(() => import('../ui/settings/Settings.jsx')),
    getProps:  ({ settings, onSaveSettings }) => ({ settings, onSave: onSaveSettings }),
  },
  {
    id:          'help',
    component:   lazy(() => import('../ui/help/Help.jsx')),
    featureFlag: 'helpScreen',
  },
  {
    id:        'aggregatedTasks',
    component: lazy(() => import('../ui/aggregated/AggregatedTasks.jsx')),
  },
  {
    id:        'history',
    component: lazy(() => import('../ui/history/HistoryLog.jsx')),
  },
];

// ─── getSettingsComponent() – zwraca wpis z rejestru dla podanego id
//   @param {string} id – activeItem.id
//   @returns {{ component, featureFlag, getProps, disabled }|null}
export function getSettingsComponent(id) {
  const entry = SETTINGS_REGISTRY.find(e => e.id === id);
  if (!entry) {
    logWarn('ui', `settingsRegistry: unknown id "${id}"`);
    return null;
  }

  if (entry.featureFlag && !isFeatureEnabled(entry.featureFlag)) {
    return { ...entry, disabled: true };
  }

  return { ...entry, disabled: false };
}