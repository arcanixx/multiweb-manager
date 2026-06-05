// =============================================================================
// FILE: toolsRegistry.js
// PATH: src/config/toolsRegistry.js
// VERSION: 0.0.3
// PURPOSE: Centralny rejestr narzędzi (tools) używanych w ToolsContainer. Eliminuje switch-case z kontenera – nowe narzędzie = nowy wpis w rejestrze. Zawiera lazy import, featureFlag, propsy i opis.
// FUNCTIONS: getToolComponent
// DEPENDS ON: react, config.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { lazy } from 'react';
import { isFeatureEnabled } from '../config.js';
import { logWarn } from '../utils/logger.js';

// ─── TOOLS_REGISTRY – mapa id narzędzia → konfiguracja
//   id:          string  — zgodne z activeItem.id (Sidebar)
//   component:   lazy()  — lazy import komponentu
//   featureFlag: string? — klucz w FEATURES; brak = zawsze dostępne
//   getProps:    fn?     — (context) => Object – dynamiczne propsy z kontekstu
//   disabledMsg: string? — klucz tłumaczenia przy wyłączonym flagą
export const TOOLS_REGISTRY = [
  {
    id:        'notepad',
    component: lazy(() => import('../ui/notepad/Notepad.jsx')),
  },
  {
    id:          'projectManager',
    component:   lazy(() => import('../ui/projects/ProjectManager.jsx')),
    getProps:    ({ onOpenTasks }) => ({ onOpenTasks }),
  },
  {
    id:          'removebg',
    component:   lazy(() => import('../ui/tools/RemoveBgTool.jsx')),
    featureFlag: 'removeBg',
    getProps:    ({ settings }) => ({ apiKey: settings?.removeBgApiKey, plan: settings?.removeBgPlan || 'free' }),
  },
  {
    id:          'stringCombiner',
    component:   lazy(() => import('../ui/tools/StringCombiner.jsx')),
    featureFlag: 'stringCombiner',
  },
  {
    id:        'terminal',
    component: lazy(() => import('../ui/terminal/Terminal.jsx')),
    getProps:  ({ activeItem }) => ({ cwd: activeItem?.cwd }),
  },
  {
    id:          'appLibrary',
    component:   lazy(() => import('../ui/appLibrary/AppLibraryBrowser.jsx')),
    featureFlag: 'appLibrary',
  },
  {
    id:          'aggregatedTasks',
    component:   lazy(() => import('../ui/tasks/AggregatedTasks.jsx')),
    featureFlag: 'aggregatedTasks',
  },
];

// ─── getToolComponent() – zwraca wpis z rejestru dla podanego id
//   @param {string} id – activeItem.id
//   @returns {{ component, featureFlag, getProps, disabled }|null}
export function getToolComponent(id) {
  const entry = TOOLS_REGISTRY.find(t => t.id === id);
  if (!entry) {
    logWarn('ui', `toolsRegistry: unknown tool id "${id}"`);
    return null;
  }

  // Sprawdź feature flag
  if (entry.featureFlag && !isFeatureEnabled(entry.featureFlag)) {
    logWarn('ui', `toolsRegistry: tool "${id}" disabled by feature flag "${entry.featureFlag}"`);
    return { ...entry, disabled: true };
  }

  return { ...entry, disabled: false };
}
