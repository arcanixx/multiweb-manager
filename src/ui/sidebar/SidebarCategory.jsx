// =============================================================================
// FILE: SidebarCategory.jsx
// PATH: src/ui/sidebar/SidebarCategory.jsx
// VERSION: 0.0.3
// PURPOSE: Nagłówek kategorii profilów (zwijanie/rozwijanie, menu kontekstowe)
// FUNCTIONS: SidebarCategory
// DEPENDS ON: react, translations.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
export default function SidebarCategory({ name, icon, isCollapsed, onToggle, onContextMenu }) {
  const { t } = useContext(TranslationContext);
  return (
    <div className="sidebar-category" onClick={onToggle} onContextMenu={onContextMenu}>
      <span>{icon || ICONS.FOLDER}</span>
      <span style={{ flex: 1 }}>{name || t('sidebar.all_profiles')}</span>
      <span style={{ fontSize: 10 }}>{isCollapsed ? ICONS.CHEVRON_RIGHT : ICONS.CHEVRON_DOWN}</span>
    </div>
  );
}
