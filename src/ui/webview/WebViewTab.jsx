// =============================================================================
// FILE: WebViewTab.jsx
// PATH: src/ui/webview/WebViewTab.jsx
// VERSION: 0.0.3
// PURPOSE: Mini-przeglądarka profilu (webview + toolbar). Partycja per profil,
// FUNCTIONS: WebViewTab
// DEPENDS ON: react, icons, translations.js, loggerRenderer, urlUtils, config
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useRef, useEffect, useState, useCallback, useMemo, useContext } from 'react';
import { ICONS } from '../../utils/icons';
import { TranslationContext } from '../../utils/translations.js';
import { logDebug as log, logError, logInfo, logWarn } from '../../utils/loggerRenderer';
import { normalizeWebUrl } from '../../utils/urlUtils';
import { FEATURES, DEFAULT_SETTINGS, isFeatureEnabled } from '../../config';

export default function WebViewTab({ profile, isActive = true, suspended = false }) {
  const { t } = useContext(TranslationContext);
  const webviewRef = useRef(null);
  const pageUrl = useMemo(() => normalizeWebUrl(profile.url), [profile.url]);
  const urlInvalid = !pageUrl;
  const [zoom, setZoom] = useState(profile.zoom || 1);
  const [loading, setLoading] = useState(!urlInvalid);
  const [currentUrl, setCurrentUrl] = useState(pageUrl || profile.url || '');
  const [netError, setNetError] = useState(null);
  const [sleeping, setSleeping] = useState(false);
  const [lastActiveAt, setLastActiveAt] = useState(Date.now());
  const [domReady, setDomReady] = useState(false);
  const [toast, setToast] = useState(null);
  const sleepTimeout = profile.sleepTabsTimeout ?? DEFAULT_SETTINGS.sleepTabsTimeout;

  // Pokazuje powiadomienie toast.
  // @param {string} type - typ powiadomienia (np. 'success', 'error', 'info')
  // @param {string} msg - wiadomość do wyświetlenia
  // @returns {void}
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };
  useEffect(() => {
    setCurrentUrl(pageUrl || profile.url || '');
  }, [pageUrl, profile.url]);
 
  // Cleanup WebView przy unmount
  useEffect(() => {
    return () => {
      const wv = webviewRef.current;
      if (!wv) return;
      try {
        wv.src = 'about:blank';
      } catch (e) {
        logError('WebView cleanup failed', e);
      }
    };
  }, []);

  const showNetError = useCallback((msg) => {
    setNetError(msg);
    setTimeout(() => setNetError(null), 5000);
  }, []);

  // Aktywacja / wake up
  useEffect(() => {
    if (isActive) {
      setLastActiveAt(Date.now());
      if (sleeping && webviewRef.current) {
        setSleeping(false);
        if (pageUrl) webviewRef.current.src = pageUrl;
        log(`WebView wake: ${profile.name}`);
      }
    }
  }, [isActive, pageUrl, profile.name, sleeping]);

  // Sleep Tabs
  useEffect(() => {
    if (!FEATURES.sleepTabs || isActive) return undefined;
    const interval = setInterval(() => {
      const idle = Date.now() - lastActiveAt;
      if (idle > sleepTimeout && !sleeping && webviewRef.current) {
        setSleeping(true);
        try {
          webviewRef.current.src = 'about:blank';
          log(`WebView sleep: ${profile.name}`);
        } catch (e) {
          logError('WebView sleep failed', e);
        }
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [lastActiveAt, sleeping, sleepTimeout, isActive, profile.name]);

  // Rejestracja WebView (dla screenshot/resource monitor)
  useEffect(() => {
    if (webviewRef.current && window.electronAPI?.registerWebView) {
      const id = `webview-${profile.id}-${Date.now()}`;
      webviewRef.current.setAttribute('data-tab-id', id);


      // Rejestruje webview po załadowaniu.
      // @param {Event} e - zdarzenie did-finish-load
      // @returns {void}
      const onLoad = () => {
        const webContentsId = webviewRef.current?.getWebContentsId();
        if (webContentsId) {
          window.electronAPI.registerWebView(id, webContentsId);
        }
      };
      webviewRef.current.addEventListener('did-finish-load', onLoad);
      return () => {
        webviewRef.current?.removeEventListener('did-finish-load', onLoad);
        window.electronAPI?.unregisterWebView?.(id);
      };
    }
  }, [profile.id]);

  // Eventy WebView
  useEffect(() => {
    const wv = webviewRef.current;
    if (!wv || sleeping || urlInvalid) return;

    setDomReady(false);

    const onDomReady = () => {
      setDomReady(true);
      try {
        wv.setZoomFactor(zoom);
      } catch (e) {
        logError('WebView setZoomFactor on dom-ready failed', e);
      }
      setLoading(false);
      log(`WebView ready: ${profile.name} @ ${pageUrl}`);
      window.electronAPI?.addHistory?.({ profileName: profile.name, url: wv.getURL?.() || pageUrl }).catch(() => {});
    };

    // Ustawia stan ładowania na true przy rozpoczęciu ładowania strony.
    // @returns {void}
    const onStartLoad = () => setLoading(true);

    // Ustawia stan ładowania na false po zakończeniu ładowania strony.
    // @returns {void}
    const onStopLoad = () => setLoading(false);

    // Aktualizuje bieżący URL przy nawigacji w WebView.
    // @param {Event} e - zdarzenie nawigacji zawierające właściwość url
    // @returns {void}
    const onNavigate = (e) => {
      if (e.url) setCurrentUrl(e.url);
    };

    // Obsługuje błąd ładowania WebView.
    // @param {Event} e - zdarzenie błędu ładowania zawierające errorCode i errorDescription
    // @returns {void}
    const onFailLoad = (e) => {
      setLoading(false);
      if (e.errorCode === -3) return;
      logError(`WebView load failed: ${e.errorDescription}`, e.errorCode);
      if (e.errorCode === -106 || e.errorCode === -2) {
        showNetError(t('webview.error_offline'));
      } else if (e.errorCode === -105 || e.errorCode === -501) {
        showNetError(t('webview.error_bad_host') || t('webview.error_404', { url: pageUrl || profile.url }));
      }
    };

    wv.addEventListener('dom-ready', onDomReady);
    wv.addEventListener('did-start-loading', onStartLoad);
    wv.addEventListener('did-stop-loading', onStopLoad);
    wv.addEventListener('did-navigate', onNavigate);
    wv.addEventListener('did-navigate-in-page', onNavigate);
    wv.addEventListener('did-fail-load', onFailLoad);

    return () => {
      wv.removeEventListener('dom-ready', onDomReady);
      wv.removeEventListener('did-start-loading', onStartLoad);
      wv.removeEventListener('did-stop-loading', onStopLoad);
      wv.removeEventListener('did-navigate', onNavigate);
      wv.removeEventListener('did-navigate-in-page', onNavigate);
      wv.removeEventListener('did-fail-load', onFailLoad);
    };
  }, [profile.id, sleeping, zoom, profile.name, pageUrl, urlInvalid, showNetError, t]);

  // Zoom – aktualizacja po DOM ready
  useEffect(() => {
    const wv = webviewRef.current;
    if (!wv || !domReady || sleeping) return;
    try {
      wv.setZoomFactor(zoom);
    } catch (e) {
      logError('WebView setZoomFactor failed', e);
    }
  }, [zoom, domReady, sleeping]);

  // =========================================================================
  // NOWE FUNKCJE (Single App, Screenshot, Resource Monitor)
  // =========================================================================

  // ─── handleSingleAppMode() – otwiera profil w trybie single app (oddzielne okno)
  //   @returns {Promise<void>}
  const handleSingleAppMode = async () => {
    try {
      if (!window.electronAPI?.openSingleWindow) {
        showToast('error', t('webview.singleAppModeNotSupported'));
        return;
      }
      await window.electronAPI.openSingleWindow({
        url: profile.url,
        width: 1200,
        height: 800,
        debug: false
      });
      showToast('success', t('webview.singleAppModeOpened'));
    } catch (err) {
      logError('Single App Mode failed', err);
      showToast('error', t('webview.singleAppModeFailed'));
    }
  };

  // ─── handleScreenshot() – robi screenshot aktywnego WebView i kopiuje do schowka
  //   @returns {Promise<void>}
  const handleScreenshot = async () => {
    try {
      if (!window.electronAPI?.captureWebView) {
        showToast('error', t('webview.screenshotNotSupported'));
        return;
      }
      const tabId = webviewRef.current?.getAttribute('data-tab-id');
      if (!tabId) {
        showToast('error', t('webview.screenshotFailed'));
        return;
      }
      const result = await window.electronAPI.captureWebView(tabId);
      if (!result.ok) throw new Error(result.error);
      const blob = new Blob([result.data], { type: 'image/png' });
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      showToast('success', t('webview.screenshotCopied'));
      log('Screenshot captured and copied to clipboard');
    } catch (err) {
      logError('Screenshot failed', err);
      showToast('error', t('webview.screenshotFailed'));
    }
  };

  // ─── handleResourceMonitor() – pobiera i wyświetla informacje o zużyciu zasobów WebView
  //   @returns {Promise<void>}
  const handleResourceMonitor = async () => {
    try {
      if (!window.electronAPI?.getWebViewResourceInfo) {
        showToast('error', t('webview.resourceMonitorNotSupported'));
        return;
      }
      const tabId = webviewRef.current?.getAttribute('data-tab-id');
      if (!tabId) {
        showToast('error', t('webview.resourceMonitorFailed'));
        return;
      }
      const result = await window.electronAPI.getWebViewResourceInfo(tabId);
      if (!result.ok) throw new Error(result.error);
      const { memory, cpu } = result.data;
      showToast('info', `${t('webview.ram')}: ${memory} MB | ${t('webview.cpu')}: ${cpu}%`);
      log(`Resource monitor: RAM=${memory}MB, CPU=${cpu}%`);
    } catch (err) {
      logError('Resource monitor failed', err);
      showToast('error', t('webview.resourceMonitorFailed'));
    }
  };

  // =========================================================================
  // Toolbar actions
  // =========================================================================

  const openDevTools = useCallback(() => {
    webviewRef.current?.openDevTools();
  }, []);

  const clearCacheAndReload = useCallback(async () => {
    setLoading(true);
    await window.electronAPI?.clearProfileCache?.(profile.id);
    webviewRef.current?.reload();
  }, [profile.id]);

  // ─── handleZoomDelta() – zmienia zoom WebView o podany krok
  //   @param {number} delta - wartość zmiany zoom (np. 0.1 dla zwiększenia)
  const handleZoomDelta = (delta) => setZoom((z) => Math.min(3, Math.max(0.3, +(z + delta).toFixed(1))));

  // ─── handleCopyUrl() – kopiuje bieżący URL WebView do schowka
  const handleCopyUrl = () => {
    const url = webviewRef.current?.getURL?.() || currentUrl;
    if (url) navigator.clipboard.writeText(url);
  };

  // ─── handleOpenExternal() – otwiera bieżący URL w zewnętrznej przeglądarce
  const handleOpenExternal = () => {
    const url = webviewRef.current?.getURL?.() || currentUrl;
    if (url) window.electronAPI?.openExternal?.(url);
  };

  // ─── wakeUp() – budzi śpiący WebView i przywraca jego źródło
  const wakeUp = () => {
    setSleeping(false);
    setLastActiveAt(Date.now());
    if (webviewRef.current && pageUrl) webviewRef.current.src = pageUrl;
  };


if (!isFeatureEnabled("webview")) return null;
 

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }} className="webview-tab-root">
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <button className="btn-icon" onClick={() => webviewRef.current?.goBack()} title={t('webview.back')}>{ICONS.BACK}</button>
        <button className="btn-icon" onClick={() => webviewRef.current?.goForward()} title={t('webview.forward')}>{ICONS.FORWARD}</button>
        <button className="btn-icon" onClick={() => webviewRef.current?.reload()} title={t('webview.reload')}>
          <span style={loading ? { display: 'inline-block', animation: 'spin 1s linear infinite' } : {}}>{ICONS.REFRESH}</span>
        </button>
        <div style={{ flex: 1, padding: '3px 10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={currentUrl}>
          {currentUrl}
        </div>
        <button className="btn-icon" onClick={handleCopyUrl} title={t('webview.copyUrl')}>{ICONS.COPY}</button>
        <button className="btn-icon" onClick={handleOpenExternal} title={t('webview.openExternal')}>{ICONS.LINK}</button>
        <button className="btn-icon" onClick={openDevTools} title={t('webview.devTools')}>{ICONS.DEVTOOLS}</button>
        <button className="btn-icon" onClick={clearCacheAndReload} title={t('webview.clearCache')}>{ICONS.CLEAR_CACHE}</button>
        <button className="btn-icon" onClick={() => handleZoomDelta(-0.1)} title={t('webview.zoomOut')}>{ICONS.ZOOM_OUT}</button>
        <span onClick={() => setZoom(1)} style={{ fontSize: 11, minWidth: 38, textAlign: 'center', cursor: 'pointer' }}>{Math.round(zoom * 100)}%</span>
        <button className="btn-icon" onClick={() => handleZoomDelta(0.1)} title={t('webview.zoomIn')}>{ICONS.ZOOM_IN}</button>

        {/* Nowe przyciski */}
        <button className="btn-icon" onClick={handleSingleAppMode} title={t('webview.singleAppMode')}>{ICONS.SINGLE_APP}</button>
        <button className="btn-icon" onClick={handleScreenshot} title={t('webview.screenshot')}>{ICONS.SCREENSHOT}</button>
        <button className="btn-icon" onClick={handleResourceMonitor} title={t('webview.resourceMonitor')}>{ICONS.RESOURCE_MONITOR}</button>

        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.name}</span>
      </div>

      {/* Error bar */}
      {netError && (
        <div style={{ padding: '8px 16px', background: 'var(--danger)', color: 'white', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
          {ICONS.WARNING} {netError}
          <button style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }} onClick={() => setNetError(null)}>{ICONS.CLOSE}</button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, padding: '8px 16px', borderRadius: 8, zIndex: 9999, background: toast.type === 'success' ? 'var(--success)' : toast.type === 'error' ? 'var(--danger)' : 'var(--accent)', color: 'white' }}>
          {toast.msg}
        </div>
      )}

      {/* Sleeping placeholder */}
      {sleeping && (
        <div style={{ padding: 16, textAlign: 'center', background: 'var(--bg-secondary)' }}>
          <p>{t('webview.sleeping') || 'Tab is sleeping'}</p>
          <button className="btn btn-primary" onClick={wakeUp}>{t('webview.wakeUp') || 'Wake up'}</button>
        </div>
      )}

      {/* Invalid URL */}
      {urlInvalid && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', color: 'var(--text-secondary)', gap: 8 }}>
          <span style={{ fontSize: 32 }}>{ICONS.WARNING}</span>
          <p style={{ margin: 0, fontSize: 14 }}>{t('webview.invalid_url')}</p>
          <code style={{ fontSize: 12, background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: 4 }}>{profile.url || '—'}</code>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>{t('webview.invalid_url_hint')}</p>
        </div>
      )}

      {/* WebView */}
      {!sleeping && !suspended && !urlInvalid && pageUrl && (
        <webview
          key={`wv-${profile.id}-${pageUrl}`}
          ref={webviewRef}
          src={pageUrl}
          partition={profile.partition || `persist:profile-${profile.id}`}
          useragent={profile.userAgent || undefined}
          style={{ flex: 1, display: 'flex' }}
          allowpopups="true"
          webpreferences="contextIsolation=yes, nativeWindowOpen=yes, javascript=yes"
        />
      )}
      {suspended && !sleeping && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
          {t('webview.paused_for_modal') || 'Podgląd wstrzymany (otwarty modal)'}
        </div>
      )}
    </div>
  );
}
