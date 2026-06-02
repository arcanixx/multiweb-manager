// =============================================================================
// FILE: SidebarWorkspaces.jsx
// PATH: src/ui/sidebar/SidebarWorkspaces.jsx
// VERSION: 0.0.3
// PURPOSE: Sekcja workspace'ów w Sidebarze
// FUNCTIONS: SidebarWorkspaces
// DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';

// ─── SidebarWorkspaces() – sekcja workspace'ów w sidebarze
//   @param {Object} props – właściwości komponentu
//   @param {Array} props.workspaces – lista workspace'ów
//   @param {Object} props.activeWorkspace – aktywny workspace
//   @param {Function} props.onSelect – callback wyboru workspace
//   @returns {JSX.Element|null} – renderowane workspace'y lub null

export default function SidebarWorkspaces({ workspaces, activeWorkspace, onSelect }) {
  const { t } = useContext(TranslationContext);
  if (!workspaces || workspaces.length === 0) return null;
  return (
    <div style={{ marginTop: 12 }}>
      <div className="sidebar-category">
        <span>{ICONS.APPS}</span>
        <span style={{ flex: 1 }}>{t('sidebar.workspaces') || 'Workspaces'}</span>
      </div>
      {workspaces.map(ws => (
        <div key={ws.id} className={`sidebar-item ${activeWorkspace?.id === ws.id ? 'active' : ''}`}
          onClick={() => onSelect(ws)}>
          <span style={{ fontSize: 15, minWidth: 20, textAlign: 'center' }}>{ICONS.FOLDER}</span>
          <span>{ws.name}</span>
        </div>
      ))}
    </div>
  );
}