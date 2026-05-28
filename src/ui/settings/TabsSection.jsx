// =============================================================================
// FILE: TabsSection.jsx
// PATH: src/ui/settings/TabsSection.jsx
// VERSION: 0.0.3
// PURPOSE: Sekcja ustawień zakładek (Sleep Tabs timeout)
// FUNCTIONS: TabsSection
// DEPENDS ON: react, translations.js, src
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect } from 'react';
import { TranslationContext } from '../utils/translations.js';
import { logDebug } from 'src/utils/loggerRenderer';
import { ICONS } from 'src/utils/icons';

export default function TabsSection() {
  const { t } = React.useContext(TranslationContext);
  const [sleepTimeoutMinutes, setSleepTimeoutMinutes] = useState(15);
  useEffect(() => {
    const loadTimeout = async () => {
      if (window.electronAPI?.getSleepTimeout) {
        const result = await window.electronAPI.getSleepTimeout();
        setSleepTimeoutMinutes(result.data || 15);
      }
    };
    loadTimeout();
  }, []);
  const handleTimeoutChange = async (minutes) => {
    setSleepTimeoutMinutes(minutes);
    if (window.electronAPI?.setSleepTimeout) {
      await window.electronAPI.setSleepTimeout(minutes);
    }
    logDebug(`Sleep tabs timeout set to ${minutes} minutes`);
  };
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
