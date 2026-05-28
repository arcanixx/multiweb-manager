// =============================================================================
// FILE: GeneralSection.jsx
// PATH: src/ui/settings/GeneralSection.jsx
// VERSION: 0.0.3
// PURPOSE: Sekcja ustawień ogólnych (język, dark mode, debug)
// FUNCTIONS: GeneralSection
// DEPENDS ON: react, translations.js, src
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect } from 'react';
import { TranslationContext } from '../utils/translations.js';
import { logDebug } from 'src/utils/loggerRenderer';
import { ICONS } from 'src/utils/icons';
export default function GeneralSection() {
  const { t, language, setLanguage } = React.useContext(TranslationContext);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [debugMode, setDebugMode] = useState(false);
  // Załaduj debugMode z electronAPI
  useEffect(() => {
    const loadDebugMode = async () => {
      if (window.electronAPI?.getDebugMode) {
        const result = await window.electronAPI.getDebugMode();
        setDebugMode(result.data === true);
      }
    };
    loadDebugMode();
  }, []);
  const handleDarkModeToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
    logDebug(`Dark mode toggled: ${newMode ? 'dark' : 'light'}`);
  };
  const handleDebugModeToggle = async () => {
    const newMode = !debugMode;
    setDebugMode(newMode);
    if (window.electronAPI?.setDebugMode) {
      await window.electronAPI.setDebugMode(newMode);
    }
    logDebug(`Debug mode toggled: ${newMode}`);
  };
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    logDebug(`Language changed to: ${newLang}`);
  };

  return (
    <section className="settings-section">
      <h2>{ICONS.SETTINGS} {t('settings.general')}</h2>

      <div className="setting-item">
        <label>{t('settings.language')}</label>
        <select value={language} onChange={handleLanguageChange}>
          <option value="pl">Polski</option>
          <option value="en">English</option>
        </select>
      </div>

      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={handleDarkModeToggle}
          />
          {ICONS.THEME_DARK} {t('settings.darkMode')}
        </label>
      </div>

      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            checked={debugMode}
            onChange={handleDebugModeToggle}
          />
          {ICONS.DEBUG} {t('settings.debugMode')}
        </label>
        <span className="setting-description">{t('settings.debugModeDesc')}</span>
      </div>
    </section>
  );
}