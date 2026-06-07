// =============================================================================
// FILE: UpdateChecker.jsx
// PATH: src/ui/system/UpdateChecker.jsx
// VERSION: 0.0.3
// PURPOSE: Komponent sprawdzania aktualizacji. Używa globalnego showToast (UIUX_REQ-021) zamiast lokalnego stanu inline.
// FUNCTIONS: UpdateChecker
// DEPENDS ON: react, icons, translations.js, loggerRenderer, notificationsManager.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect } from 'react';
import { ICONS } from '../../utils/icons';
import { TranslationContext } from '../../utils/translations.js';
import { logInfo, logError } from '../../utils/loggerRenderer';
import { showToast } from '../../utils/notificationsManager.js';

export default function UpdateChecker() {
  const { t } = React.useContext(TranslationContext);
  const [checking,   setChecking]   = useState(false);
  const [appVersion, setAppVersion] = useState('...');

  // Pobierz aktualną wersję aplikacji przy montowaniu
  useEffect(() => {
    window.electronAPI.getAppVersion?.()
      .then(v => setAppVersion(v || '1.0.0'))
      .catch(() => setAppVersion('1.0.0'));
  }, []);

  // ─── checkForUpdates() – Wywołuje IPC check-for-updates; wynik przez globalny ToastContainer
  const checkForUpdates = async () => {
    setChecking(true);
    logInfo('ui', 'UpdateChecker: checking for updates...');
    try {
      const latestVersion = await window.electronAPI.checkForUpdates();
      logInfo('ui', 'UpdateChecker: latest version:', latestVersion);
      if (latestVersion && latestVersion !== appVersion) {
        showToast('success', t('updateChecker.new_version', { version: latestVersion }));
      } else {
        showToast('info', t('updateChecker.coming_soon'));
      }
    } catch (err) {
      logError('ui', 'UpdateChecker: check failed', err);
      showToast('error', t('notifications.error', { message: err.message }));
    } finally {
      setChecking(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Wersja */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 13, color: 'var(--text-secondary)'
      }}>
        {ICONS.VERSION}
        <span>{t('updateChecker.current_version')}:</span>
        <strong style={{ color: 'var(--text-primary)' }}>{appVersion}</strong>
      </div>

      {/* Przycisk sprawdź */}
      <button
        className="btn btn-secondary"
        style={{ fontSize: 13, alignSelf: 'flex-start' }}
        onClick={checkForUpdates}
        disabled={checking}>
        {checking
          ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span> {t('updateChecker.checking')}</>
          : <>{ICONS.UPDATE} {t('updateChecker.check')}</>
        }
      </button>
    </div>
  );
}