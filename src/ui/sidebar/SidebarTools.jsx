// =============================================================================
// FILE: SidebarTools.jsx
// PATH: src/ui/sidebar/SidebarTools.jsx
// VERSION: 0.0.3
// PURPOSE: Sekcja narzędzi specjalnych w Sidebarze
// FUNCTIONS: SidebarTools
// DEPENDS ON: react, config.js, translations.js, icons.js, constants.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { isFeatureEnabled } from '../../config.js';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import { SIDEBAR_ICON_MAP } from '../../constants.js';

// ─── SPECIAL_TOOLS – stała z listą narzędzi specjalnych w sidebarze
//   @returns {Array} – tablica obiektów z id i kluczem tłumaczenia

const SPECIAL_TOOLS = [
  { id: 'notepad', labelKey: 'notepad.title' },
  { id: 'projectManager', labelKey: 'projectManager.title' },
  { id: 'aggregatedTasks', labelKey: 'aggregatedTasks.title' },
  { id: 'history', labelKey: 'history.title' },
  { id: 'removebg', labelKey: 'removebg.title' },
  { id: 'stringCombiner', labelKey: 'stringCombiner.title' },
  { id: 'terminal', labelKey: 'terminal.title' },
  { id: 'settings', labelKey: 'settings.title' },
  { id: 'help', labelKey: 'help.title', feature: 'helpScreen' },
];

// ─── SidebarTools() – sekcja narzędzi specjalnych w sidebarze
//   @param {Object} props – właściwości komponentu
//   @param {Object} props.activeItem – aktywny element
//   @param {Function} props.onSelect – callback wyboru narzędzia
//   @returns {JSX.Element} – renderowane narzędzia

export default function SidebarTools({ activeItem, onSelect }) {
  const { t } = useContext(TranslationContext);
  const visibleTools = SPECIAL_TOOLS.filter(tool => !tool.feature || isFeatureEnabled(tool.feature));
  const topSpecial = visibleTools.slice(0, 3);
  const sortedSpecial = visibleTools.slice(3).sort((a, b) => t(a.labelKey).localeCompare(t(b.labelKey)));
  return (
    <>
      {topSpecial.map(tool => {
        const icon = ICONS[SIDEBAR_ICON_MAP[tool.id]] || ICONS.DEFAULT;
        const isActive = activeItem?.id === tool.id;
        return (
          <div key={tool.id} className={`sidebar-item ${isActive ? 'active' : ''}`}
            onClick={() => onSelect({ id: tool.id, type: 'special' })}>
            <span style={{ fontSize: 15, flexShrink: 0, minWidth: 20, textAlign: 'center' }}>{icon}</span>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t(tool.labelKey)}</span>
          </div>
        );
      })}
      {sortedSpecial.map(tool => {
        const icon = ICONS[SIDEBAR_ICON_MAP[tool.id]] || ICONS.DEFAULT;
        const isActive = activeItem?.id === tool.id;
        return (
          <div key={tool.id} className={`sidebar-item ${isActive ? 'active' : ''}`}
            onClick={() => onSelect({ id: tool.id, type: 'special' })}>
            <span style={{ fontSize: 15, flexShrink: 0, minWidth: 20, textAlign: 'center' }}>{icon}</span>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t(tool.labelKey)}</span>
          </div>
        );
      })}
    </>
  );
}