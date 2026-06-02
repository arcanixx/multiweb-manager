// =============================================================================
// FILE: TabsSection.jsx
// PATH: src/ui/settings/TabsSection.jsx
// VERSION: 0.0.3
// PURPOSE: Sekcja konfiguracji zarządzania kartami – pozwala na ustawienie czasu bezczynności, po którym nieaktywne WebView są uśpiane w celu oszczędzania zasobów systemowych (RAM/CPU).
// FUNCTIONS: TabsSection
// DEPENDS ON: react, config.js, translations.js, loggerRenderer, icons
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect } from 'react';
import { isFeatureEnabled } from '../../config.js';
import { TranslationContext } from '../../utils/translations.js';
import { logDebug, logInfo, logError, logWarn } from '../../utils/loggerRenderer';
import { ICONS } from '../../utils/icons';

// ─── TabsSection() – sekcja ustawień zakładek (timeout usypiania nieaktywnych kart)
//   @returns {JSX.Element} – renderowana sekcja ustawień zakładek

export default function TabsSection() {
  const { t } = React.useContext(TranslationContext);
  const [sleepTimeoutMinutes, setSleepTimeoutMinutes] = useState(15);

  // ─── useEffect – ładowanie timeoutu przy montowaniu
  useEffect(() => {
    // ─── loadTimeout() – Ładuje zapisany timeout usypiania zakładek z procesu głównego przez electronAPI i ustawia wartość domyślną 15 minut jeśli brak
    const loadTimeout = async () => {
      try {
        if (window.electronAPI?.getSleepTimeout) {
          const result = await window.electronAPI.getSleepTimeout();
          setSleepTimeoutMinutes(result.data || 15);
          logInfo('settings', 'TabsSection: sleep timeout loaded');
        }
      } catch (err) {
        logError('settings', 'TabsSection: failed to load timeout', err.message);
        logWarn('settings', 'Nie można załadować timeoutu usypiania zakładek');
      }
    };
    loadTimeout();
  }, []);

  // ─── handleTimeoutChange() – zmienia timeout usypiania zakładek
  //   @param {number} minutes – nowy timeout w minutach
  //   @returns {Promise<void>}
  const handleTimeoutChange = async (minutes) => {
    try {
      setSleepTimeoutMinutes(minutes);
      if (window.electronAPI?.setSleepTimeout) {
        await window.electronAPI.setSleepTimeout(minutes);
      }
      logInfo('settings', `TabsSection: timeout set to ${minutes} minutes`);
    } catch (err) {
      logError('settings', 'TabsSection: failed to set timeout', err.message);
      logWarn('settings', 'Wystąpił błąd podczas ustawiania timeoutu');
    }
  };

  if (!isFeatureEnabled('sleepTabs')) return null;

  return (
    <section className="settings-section">
      <h2>{ICONS.TABS} {t('settings.tabs')}</h2>
      <div className="setting-item">
        <label>{t('settings.sleepTabsTimeout')}</label>
        <select
          value={sleepTimeoutMinutes}
          onChange={(e) => handleTimeoutChange(parseInt(e.target.value))}
        >
          <option value="5">5 {t('common.minutes')}</option>
          <option value="15">15 {t('common.minutes')}</option>
          <option value="30">30 {t('common.minutes')}</option>
          <option value="60">60 {t('common.minutes')}</option>
          <option value="0">{t('settings.never')}</option>
        </select>
        <span className="setting-description">{t('settings.sleepTabsDesc')}</span>
      </div>
    </section>
  );
}