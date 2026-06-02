// =============================================================================
// FILE: WebViewSection.jsx
// PATH: src/ui/settings/WebViewSection.jsx
// VERSION: 0.0.3
// PURPOSE: Sekcja ustawień WebView — AdBlocker globalny, User Agent, tryb Single App, edytowalny pasek adresu. Szkielet do rozbudowy wg Definition_Mockups_UI_UX.md sekcja 8.
// FUNCTIONS: WebViewSection
// DEPENDS ON: react, translations.js, loggerRenderer, icons
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect } from 'react';
import { TranslationContext } from '../utils/translations.js';
import { logDebug, logInfo, logError, logWarn } from '../../utils/loggerRenderer';
import { ICONS } from '../../utils/icons';

// ─── WebViewSection() – sekcja ustawień WebView (AdBlocker, User Agent, Single App)
//   @returns {JSX.Element} – renderowana sekcja ustawień WebView
// NOTE: Do rozbudowania wg Definition_Mockups_UI_UX.md sekcja 8 (pełna specyfikacja UI WebView)
// NOTE: Podpiąć pod window.electronAPI.setGlobalAdBlocker / getGlobalAdBlocker
// NOTE: Podpiąć User Agent przez window.electronAPI.invoke('webview:setUserAgent', ...)
// NOTE: Dodać opcję edytowalnego paska adresu (addressBarEditable)
export default function WebViewSection() {
  const { t } = React.useContext(TranslationContext);
  const [adBlockerEnabled, setAdBlockerEnabled] = useState(true);

  // ─── useEffect – ładowanie stanu AdBlockera z backendu
  useEffect(() => {
    // ─── load() – Ładuje aktualny stan globalnego AdBlockera z procesu głównego przez electronAPI
    const load = async () => {
      try {
        if (window.electronAPI?.getGlobalAdBlocker) {
          const res = await window.electronAPI.getGlobalAdBlocker();
          if (res?.ok) {
            setAdBlockerEnabled(res.data === true);
            logInfo('WebViewSection: adBlocker state loaded');
          }
        }
      } catch (err) {
        logError('WebViewSection: failed to load adBlocker state', err);
        logWarn('Nie można załadować stanu AdBlockera');
      }
    };
    load();
  }, []);

  // ─── handleAdBlockerToggle() – przełącza globalny AdBlocker
  //   @returns {Promise<void>}
  const handleAdBlockerToggle = async () => {
    try {
      const newState = !adBlockerEnabled;
      setAdBlockerEnabled(newState);
      if (window.electronAPI?.setGlobalAdBlocker) {
        await window.electronAPI.setGlobalAdBlocker(newState);
        logDebug(`WebViewSection: global adBlocker set to ${newState}`);
        logInfo(`WebViewSection: adBlocker ${newState ? 'enabled' : 'disabled'}`);
      }
    } catch (err) {
      logError('WebViewSection: adBlocker toggle failed', err);
      logWarn('Wystąpił błąd podczas przełączania AdBlockera');
    }
  };

  return (
    <section className="settings-section">
      <h2>{ICONS.BROWSER} {t('settings.webview') || 'WebView'}</h2>

      {/* NOTE: Rozbudować o pełną listę opcji wg mockupów */}
      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            checked={adBlockerEnabled}
            onChange={handleAdBlockerToggle}
          />
          {ICONS.CLEAR_CACHE} {t('settings.adBlocker') || 'AdBlocker'}
        </label>
        <span className="setting-description">
          {t('settings.adBlockerDesc') || 'Globalny blokad reklam dla wszystkich profili'}
        </span>
      </div>
    </section>
  );
}