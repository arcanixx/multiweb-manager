// =============================================================================
// FILE: CookieGrabber.jsx
// PATH: src/ui/tools/CookieGrabber.jsx
// VERSION: 0.0.3
// PURPOSE: Pobieranie cookies z aktywnego WebView – tabela, kopiowanie, eksport
// FUNCTIONS: CookieGrabber
// DEPENDS ON: react, config.js, translations.js, loggerRenderer, icons
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState } from 'react';
import { isFeatureEnabled } from '../../config.js';
import { TranslationContext } from '../../utils/translations.js';
import { logDebug, logError } from '../../utils/loggerRenderer';
import { ICONS } from '../../utils/icons';

export default function CookieGrabber({ activeWebViewId }) {
  const { t } = React.useContext(TranslationContext);
  const [cookies, setCookies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isFeatureEnabled('cookieGrabber')) return null;

  // ─── handleGrabCookies() – pobiera cookies z aktywnego WebView
//   @returns {Promise<void>}
  const handleGrabCookies = async () => {
  if (!activeWebViewId) {
    setError(t('cookieGrabber.noActiveWebView'));
    return;
  }
  setLoading(true);
  setError(null);
  try {
    // Pobieramy partition z profilu (zakładając, że mamy dostęp do profilu przez activeWebViewId)
    // Jeśli nie masz partition – możesz przekazać null (defaultSession)
    const partition = null; // lub pobierz z profilu: `profiles.find(p => p.id === activeWebViewId)?.partition`
    const result = await window.electronAPI?.getCookies?.(partition);
    if (!result?.ok) throw new Error(result?.error || 'Failed to get cookies');
    setCookies(result.data || []);
    logDebug(`CookieGrabber: grabbed ${result.data?.length || 0} cookies`);
  } catch (err) {
    logError('CookieGrabber failed', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
  // ─── handleCopyCookie() – kopiuję pojedynczy cookie do schowka
//   @param {Object} cookie – cookie do skopiowania
  const handleCopyCookie = (cookie) => {
    const text = `${cookie.name}=${cookie.value}`;
    navigator.clipboard.writeText(text);
    logDebug(`CookieGrabber: copied ${cookie.name}`);
  };

  // ─── handleCopyAll() – kopiuję wszystkie cookies do schowka
  const handleCopyAll = () => {
    const all = cookies.map(c => `${c.name}=${c.value}`).join('; ');
    navigator.clipboard.writeText(all);
    logDebug('CookieGrabber: copied all cookies');
  };

  // ─── handleExportJson() – eksportuje cookies do pliku JSON
  const handleExportJson = () => {
    const data = JSON.stringify(cookies, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cookies-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    logDebug('CookieGrabber: exported to JSON');
  };

  return (
    <div className="tool-container cookie-grabber">
      <h2>{ICONS.COOKIE} {t('cookieGrabber.title')}</h2>

      <div className="cookie-controls">
        <button onClick={handleGrabCookies} disabled={loading} className="btn-primary">
          {loading ? t('common.loading') : t('cookieGrabber.grab')}
        </button>
        {cookies.length > 0 && (
          <>
            <button onClick={handleCopyAll} className="btn-secondary">
              {ICONS.COPY} {t('cookieGrabber.copyAll')}
            </button>
            <button onClick={handleExportJson} className="btn-secondary">
              {ICONS.EXPORT} {t('cookieGrabber.exportJson')}
            </button>
          </>
        )}
      </div>

      {error && <div className="error-message">{ICONS.WARNING} {error}</div>}

      {cookies.length > 0 && (
        <div className="cookies-table-container">
          <table className="cookies-table">
            <thead>
              <tr>
                <th>{t('cookieGrabber.name')}</th>
                <th>{t('cookieGrabber.value')}</th>
                <th>{t('cookieGrabber.domain')}</th>
                <th>{t('cookieGrabber.path')}</th>
                <th>{t('cookieGrabber.expires')}</th>
                <th>{t('cookieGrabber.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {cookies.map((cookie, idx) => (
                <tr key={idx}>
                  <td>{cookie.name}</td>
                  <td className="cookie-value" title={cookie.value}>
                    {cookie.value.substring(0, 50)}...
                   </td>
                  <td>{cookie.domain}</td>
                  <td>{cookie.path}</td>
                  <td>{cookie.expirationDate ? new Date(cookie.expirationDate * 1000).toLocaleDateString() : 'Session'}</td>
                  <td>
                    <button onClick={() => handleCopyCookie(cookie)} className="btn-icon">
                      {ICONS.COPY}
                    </button>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && cookies.length === 0 && !error && (
        <div className="empty-state">{ICONS.COOKIE} {t('cookieGrabber.noCookies')}</div>
      )}
    </div>
  );
}