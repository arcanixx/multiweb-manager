// =============================================================================
// FILE: ContentRenderer.jsx
// PATH: src/ui/views/ContentRenderer.jsx
// VERSION: 0.0.3
// PURPOSE: Router widoków — deleguje do WebViewContainer, ToolsContainer lub SettingsContainer
// FUNCTIONS: ContentRenderer
// DEPENDS ON: react, icons.js, loggerRenderer.js, translations.js, WebViewContainer.jsx, ToolsContainer.jsx, SettingsContainer.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext, useEffect } from 'react';
import { ICONS } from '../../utils/icons.js';
import { logDebug } from '../../utils/loggerRenderer.js';
import { TranslationContext } from '../../utils/translations.js';
import WebViewContainer from './WebViewContainer.jsx';
import ToolsContainer from './ToolsContainer.jsx';
import SettingsContainer from './SettingsContainer.jsx';

// Narzędzia renderowane przez SettingsContainer (ustawienia, pomoc, historia, zadania)
const SETTINGS_IDS = ['settings', 'help', 'aggregatedTasks', 'history'];

// ─── ContentRenderer() – główny router widoków prawego panelu
//   @param {Object}   props.activeItem      – aktywny element (webview / special / null)
//   @param {Object}   props.settings        – ustawienia aplikacji
//   @param {Function} props.onSaveSettings  – callback zapisu ustawień
//   @param {Function} props.onOpenTasks     – callback otwierający TaskPanel
//   @param {boolean}  props.sidebarModalOpen – czy sidebar modal jest otwarty
//   @returns {JSX.Element}
export function ContentRenderer({ activeItem, settings, onSaveSettings, onOpenTasks, sidebarModalOpen }) {
  useEffect(() => { logDebug('ui', 'ContentRenderer mounted'); }, []);
  const { t } = useContext(TranslationContext);

  // Ekran powitalny — nic nie wybrano
  if (!activeItem) {
    return (
      <div className="flex flex-col items-center justify-center h-full" style={{ color: 'var(--text-muted)' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>{ICONS.DEFAULT}</div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>{t('app.welcome_title')}</div>
        <div style={{ fontSize: 13, marginTop: 6 }}>{t('app.welcome_subtitle')}</div>
      </div>
    );
  }

  // WebView
  if (activeItem.type === 'webview' || activeItem.url) {
    return <WebViewContainer activeItem={activeItem} sidebarModalOpen={sidebarModalOpen} />;
  }

  // Narzędzia specjalne
  if (activeItem.type === 'special') {
    if (SETTINGS_IDS.includes(activeItem.id)) {
      return (
        <SettingsContainer
          activeItem={activeItem}
          settings={settings}
          onSaveSettings={onSaveSettings}
        />
      );
    }
    return (
      <ToolsContainer
        activeItem={activeItem}
        settings={settings}
        onOpenTasks={onOpenTasks}
      />
    );
  }

  return <div style={{ padding: 32 }}>Nieznany element: {activeItem.name || activeItem.id}</div>;
}