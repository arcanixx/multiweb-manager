// =============================================================================
// FILE: UpdateChecker.jsx
// PATH: src/ui/system/UpdateChecker.jsx
// VERSION: 0.0.3
// PURPOSE: Komponent sprawdzania aktualizacji. Placeholder – docelowo
// FUNCTIONS: UpdateChecker
// DEPENDS ON: react, icons, translations.js, loggerRenderer
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect } from 'react';
import { ICONS } from '../../utils/icons';
import { TranslationContext } from '../../utils/translations.js';
import { logInfo, logError, logWarn } from '../../utils/loggerRenderer';
export default function UpdateChecker() {
  const { t } = React.useContext(TranslationContext);
  const [checking,   setChecking]   = useState(false);
  const [appVersion, setAppVersion] = useState('...');
  const [toast,      setToast]      = useState('');
  const [toastType,  setToastType]  = useState('info'); // 'info' | 'success' | 'warn'
  // Pobierz aktualną wersję aplikacji przy montowaniu
  useEffect(() => {
    window.electronAPI.getAppVersion?.()
      .then(v => setAppVersion(v || '1.0.0'))
      .catch(() => setAppVersion('1.0.0'));
  }, []);
  // ─── showToast() – Wyświetla tymczasowy komunikat inline na 3 sekundy, ustawiając treść i typ (info/success/warn) a następnie automatycznie ukrywając
  const showToast = (msg, type = 'info') => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(''), 3000);
  };
  // ─── checkForUpdates() – Wywołuje IPC check-for-updates; jeśli nowa wersja jest dostępna, wyświetla powiadomienie z numerem wersji, w przeciwnym razie pokazuje komunikat "coming soon"
  const checkForUpdates = async () => {
    setChecking(true);
    logInfo('ui', 'UpdateChecker: checking for updates...');
    try {
      const latestVersion = await window.electronAPI.checkForUpdates();
      logInfo('ui', 'UpdateChecker: latest version:', latestVersion);
      if (latestVersion && latestVersion !== appVersion) {
        showToast(t('updateChecker.new_version', { version: latestVersion }), 'success');
      } else {
        // Placeholder – pokaż "coming soon" toast zamiast "up to date"
        showToast(t('updateChecker.coming_soon'), 'info');
      }
    } catch (err) {
      logError('ui', 'UpdateChecker: check failed', err);
      showToast(t('notifications.error', { message: err.message }), 'warn');
    } finally {
      setChecking(false);
    }
  };

  const toastColors = {
    info:    'var(--accent)',
    success: 'var(--success)',
    warn:    'var(--warning)',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          className="btn btn-secondary"
          style={{ fontSize: 13 }}
          onClick={checkForUpdates}
          disabled={checking}>
          {checking
            ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span> {t('updateChecker.checking')}</>
            : <>{ICONS.UPDATE} {t('updateChecker.check')}</>
          }
        </button>

        {/* Toast inline */}
        {toast && (
          <span style={{ fontSize: 12, color: toastColors[toastType] }}>
            {toastType === 'success' ? ICONS.DONE : toastType === 'warn' ? ICONS.WARNING : ICONS.INFO} {toast}
          </span>
        )}
      </div>
    </div>
  );
}