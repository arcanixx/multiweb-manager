// =============================================================================
// FILE: Settings.jsx
// PATH: src/ui/settings/Settings.jsx
// VERSION: 0.0.3
// PURPOSE: Główny kontener widoku ustawień aplikacji. Agreguje wszystkie sekcje konfiguracyjne w jeden ustrukturyzowany interfejs użytkownika.
// FUNCTIONS: Settings
// DEPENDS ON: react, GeneralSection, WebViewSection, TabsSection, NotificationsSection, HotkeysManager, DebugModulesSection, DataManagementSection, LogsSection, AccountSection, loggerRenderer.js, translations.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React from 'react';
import GeneralSection from './GeneralSection';
import WebViewSection from './WebViewSection';
import TabsSection from './TabsSection';
import NotificationsSection from './NotificationsSection';
import HotkeysManager from './HotkeysManager';
import DebugModulesSection from './DebugModulesSection';
import DataManagementSection from './DataManagementSection';
import LogsSection from './LogsSection';
import AccountSection from './AccountSection';
import { logError, logWarn, logInfo, logDebug } from '../../utils/loggerRenderer.js';
import { TranslationContext } from '../../utils/translations.js';

// ─── Settings() – kontener wszystkich sekcji ustawień aplikacji
// @returns {JSX.Element} – renderowany interfejs ustawień
export default function Settings() {
  const { t } = React.useContext(TranslationContext);
  React.useEffect(() => { logInfo('settings', 'Settings view opened'); }, []);
  return (
    <div className="settings-container">
      <h2>{t('settings.title')}</h2>
      <GeneralSection />
      <WebViewSection />
      <TabsSection />
      <NotificationsSection />
      <HotkeysManager />
      <DebugModulesSection />
      <DataManagementSection />
      <LogsSection />
      <AccountSection />
    </div>
  );
}