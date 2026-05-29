// =============================================================================
// FILE: SidebarSearch.jsx
// PATH: src/ui/sidebar/SidebarSearch.jsx
// VERSION: 0.0.3
// PURPOSE: Wyszukiwarka profili w Sidebarze
// FUNCTIONS: SidebarSearch
// DEPENDS ON: react, translations.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { logInfo, logError, logWarn, logDebug } from '../utils/loggerRenderer.js';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';

// ─── SidebarSearch() – wyszukiwarka profili w sidebarze
//   @param {Object} props – właściwości komponentu
//   @param {string} props.value – bieżąca wartość wyszukiwania
//   @param {Function} props.onChange – callback zmiany wartości
//   @returns {JSX.Element} – renderowany input wyszukiwania

export default function SidebarSearch({ value, onChange }) {
  const { t } = useContext(TranslationContext);
  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--text-muted)' }}>
        {ICONS.SEARCH}
      </span>
      <input className="form-input" style={{ paddingLeft: 26, fontSize: 12, height: 30 }}
        placeholder={t('sidebar.search_placeholder')} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}
