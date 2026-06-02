// =============================================================================
// FILE: Settings.jsx
// PATH: src/ui/settings/Settings.jsx
// VERSION: 0.0.3
// PURPOSE: Główny kontener widoku ustawień aplikacji. Agreguje wszystkie sekcje konfiguracyjne (General, WebView, Tabs, Notifications, Hotkeys, Debug, Data) w jeden ustrukturyzowany interfejs użytkownika.
// FUNCTIONS: Settings
// DEPENDS ON: react, GeneralSection, WebViewSection, TabsSection, NotificationsSection, HotkeysManager, DebugModulesSection, DataLogsSection, AccountSection, translations.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React from 'react';
import GeneralSection from './GeneralSection';
import WebViewSection from './WebViewSection';
import TabsSection from './TabsSection';
import NotificationsSection from './NotificationsSection';
import HotkeysManager from './HotkeysManager';
import DebugModulesSection from './DebugModulesSection';
import DataLogsSection from './DataLogsSection';
import AccountSection from './AccountSection';
import { TranslationContext } from '../../utils/translations.js';

// ─── Settings() – kontener wszystkich sekcji ustawień aplikacji
//   @returns {JSX.Element} – renderowany interfejs ustawień

export default function Settings() {
  const { t } = React.useContext(TranslationContext);
  return (
    <div className="settings-container">
      <h1>{t('settings.title')}</h1>
      <GeneralSection />
      <WebViewSection />
      <TabsSection />
      <NotificationsSection />
      <HotkeysManager />
      <DebugModulesSection />
      <DataLogsSection />
      <AccountSection />
    </div>
  );
}