// =============================================================================
// FILE: Settings.jsx
// PATH: src/ui/settings/Settings.jsx
// VERSION: 0.0.3
// PURPOSE: Import plików Settings w poszczególnych modułach, export settings-container
// FUNCTIONS: Settings
// DEPENDS ON: react, loggerRenderer.js, GeneralSection, WebViewSection, TabsSection, NotificationsSection, HotkeysManager, DataLogsSection, AccountSection, translations.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React from 'react';
import { logInfo, logError, logWarn, logDebug } from '../utils/loggerRenderer.js';
import GeneralSection from './GeneralSection';
import WebViewSection from './WebViewSection';
import TabsSection from './TabsSection';
import NotificationsSection from './NotificationsSection';
import HotkeysManager from './HotkeysManager';
import DataLogsSection from './DataLogsSection';
import AccountSection from './AccountSection';
import { TranslationContext } from '../utils/translations.js';

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
      <DataLogsSection />
      <AccountSection />
    </div>
  );
}