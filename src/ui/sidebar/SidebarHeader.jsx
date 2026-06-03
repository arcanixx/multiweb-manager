// =============================================================================
// FILE: SidebarHeader.jsx
// PATH: src/ui/sidebar/SidebarHeader.jsx
// VERSION: 0.0.3
// PURPOSE: Główny komponent nagłówka paska bocznego (Sidebar) – udostępnia przyciski akcji do tworzenia nowych profili i kategorii oraz integruje komponent wyszukiwania SidebarSearch.
// FUNCTIONS: SidebarHeader
// DEPENDS ON: react, translations.js, icons.js, SidebarSearch.jsx, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext, useEffect } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import { logDebug } from '../../utils/loggerRenderer.js';
import SidebarSearch from './SidebarSearch';

// ─── SidebarHeader() – nagłówek sidebaru z akcjami i wyszukiwarką
// @param {Object} props
// @param {Function} props.onAddProfile – callback otwarcia modala profilu
// @param {Function} props.onAddCategory – callback otwarcia modala kategorii
// @param {string} props.searchValue – wartość wyszukiwania
// @param {Function} props.onSearchChange – callback zmiany wyszukiwania
// @returns {JSX.Element} – renderowany nagłówek sidebaru
export default function SidebarHeader({ onAddProfile, onAddCategory, searchValue, onSearchChange, globalEnabled, onGlobalToggle, globalResults, isGlobalSearching, onGlobalSelect }) {
  const { t } = useContext(TranslationContext);

  useEffect(() => { logDebug('ui', 'SidebarHeader mounted'); }, []);

  return (
    <div style={{ padding: '12px 10px 8px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
        <button className="btn btn-primary" style={{ flex: 1, fontSize: 12 }} onClick={onAddProfile}>
          {ICONS.PLUS} {t('sidebar.add_profile')}
        </button>
        <button className="btn-icon" onClick={onAddCategory} title={t('sidebar.add_category')}>
          {ICONS.FOLDER_ADD}
        </button>
      </div>
      <SidebarSearch
        value={searchValue}
        onChange={onSearchChange}
        globalEnabled={globalEnabled}
        onGlobalToggle={onGlobalToggle}
        globalResults={globalResults}
        isGlobalSearching={isGlobalSearching}
        onGlobalSelect={onGlobalSelect}
      />
    </div>
  );
}
