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
import { logDebug, logInfo, logError, logWarn } from 'src/utils/loggerRenderer';
import { ICONS } from 'src/utils/icons';

// ─── GeneralSection() – sekcja ustawień ogólnych (język, tryb ciemny, debug)
//   @returns {JSX.Element} – renderowana sekcja ustawień ogólnych
export default function GeneralSection() {
  const { t, language, setLanguage } = React.useContext(TranslationContext);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [debugMode, setDebugMode] = useState(false);

  

  // ─── useEffect – ładowanie trybu debug przy montowaniu
  useEffect(() => {
    const loadDebugMode = async () => {
      try {
        if (window.electronAPI?.getDebugMode) {
          const result = await window.electronAPI.getDebugMode();
          setDebugMode(result.data === true);
          logInfo('GeneralSection: debug mode loaded');
        }
      } catch (err) {
        logError('GeneralSection: failed to load debug mode', err);
        logWarn('Nie można załadować trybu debug');
      }
    };
    loadDebugMode();
  }, []);
  
  // ─── handleDarkModeToggle() – przełącza tryb ciemny
  //   @returns {void}
  const handleDarkModeToggle = () => {
    try {
      const newMode = !darkMode;
      setDarkMode(newMode);
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', newMode);
      logDebug(`Dark mode toggled: ${newMode ? 'dark' : 'light'}`);
      logInfo(`GeneralSection: dark mode ${newMode ? 'enabled' : 'disabled'}`);
    } catch (err) {
      logError('GeneralSection: dark mode toggle failed', err);
      logWarn('Wystąpił błąd podczas przełączania trybu ciemnego');
    }
  };
  
  // ─── handleDebugModeToggle() – przełącza tryb debug
  //   @returns {Promise<void>}
  const handleDebugModeToggle = async () => {
    try {
      const newMode = !debugMode;
      setDebugMode(newMode);
      if (window.electronAPI?.setDebugMode) {
        await window.electronAPI.setDebugMode(newMode);
      }
      logDebug(`Debug mode toggled: ${newMode}`);
      logInfo(`GeneralSection: debug mode ${newMode ? 'enabled' : 'disabled'}`);
    } catch (err) {
      logError('GeneralSection: debug mode toggle failed', err);
      logWarn('Wystąpił błąd podczas przełączania trybu debug');
    }
  };
  
  // ─── handleLanguageChange() – zmienia język interfejsu
  //   @param {Event} e – zdarzenie zmiany selecta
  //   @returns {void}
  const handleLanguageChange = (e) => {
    try {
      const newLang = e.target.value;
      setLanguage(newLang);
      logDebug(`Language changed to: ${newLang}`);
      logInfo(`GeneralSection: language changed to ${newLang}`);
    } catch (err) {
      logError('GeneralSection: language change failed', err);
      logWarn('Wystąpił błąd podczas zmiany języka');
    }
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
