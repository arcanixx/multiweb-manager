// =============================================================================
// FILE: WebViewTab.jsx
// PATH: src/ui/webview/WebViewTab.jsx
// VERSION: 0.0.3
// PURPOSE: Mini-przeglÄ…darka profilu (webview + toolbar). Partycja per profil,
//          zoom, DevTools, cache, bĹ‚Ä™dy inline, sleep tabs, userAgent.
// DEPENDS ON: icons.js, useTranslation.js, logger.js, config.js (FEATURES)
// UWAGA: Nie usuwaj komentarzy opisujÄ…cych sekcje i cleanup listenerĂłw.
// =============================================================================

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { ICONS } from '../../utils/icons';
import { useTranslation } from '../../hooks/useTranslation';
import { log, logError } from '../../utils/loggerRenderer';
import { normalizeWebUrl } from '../../utils/urlUtils';
import { FEATURES, DEFAULT_SETTINGS } from '../../config';

export default function WebViewTab({ profile, isActive = true, suspended = false }) {
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
  const { t } = useTranslation();

  const sleepTimeout = profile.sleepTabsTimeout ?? DEFAULT_SETTINGS.sleepTabsTimeout;

  useEffect(() => {
    setCurrentUrl(pageUrl || profile.url || '');
  }, [pageUrl, profile.url]);

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
      window.electronAPI?.addHistory?.({
        profileName: profile.name,
        url: wv.getURL?.() || pageUrl
      }).catch(() => {});
    };

    const onStartLoad = () => setLoading(true);
    const onStopLoad = () => setLoading(false);
    const onNavigate = (e) => {
      if (e.url) setCurrentUrl(e.url);
    };
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

  useEffect(() => {
    const wv = webviewRef.current;
    if (!wv || !domReady || sleeping) return;
    try {
      wv.setZoomFactor(zoom);
    } catch (e) {
      logError('WebView setZoomFactor failed', e);
    }
  }, [zoom, domReady, sleeping]);

  const openDevTools = useCallback(() => {
    webviewRef.current?.openDevTools();
  }, []);

  const clearCacheAndReload = useCallback(async () => {
    setLoading(true);
    await window.electronAPI?.clearProfileCache?.(profile.id);
    webviewRef.current?.reload();
  }, [profile.id]);

  const handleZoom = (delta) =>
    setZoom((z) => Math.min(3, Math.max(0.3, +(z + delta).toFixed(1))));

  const handleCopyUrl = () => {
    const url = webviewRef.current?.getURL?.() || currentUrl;
    if (url) navigator.clipboard.writeText(url);
  };

  const handleOpenExternal = () => {
    const url = webviewRef.current?.getURL?.() || currentUrl;
    if (url) window.electronAPI?.openExternal?.(url);
  };

  const wakeUp = () => {
    setSleeping(false);
    setLastActiveAt(Date.now());
    if (webviewRef.current && pageUrl) webviewRef.current.src = pageUrl;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }} className="webview-tab-root">
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px',
          background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', flexShrink: 0
        }}
      >
        <button type="button" className="btn-icon" onClick={() => webviewRef.current?.goBack()} title={t('webview.back')}>{ICONS.BACK}</button>
        <button type="button" className="btn-icon" onClick={() => webviewRef.current?.goForward()} title={t('webview.forward')}>{ICONS.FORWARD}</button>
        <button type="button" className="btn-icon" onClick={() => webviewRef.current?.reload()} title={t('webview.reload')}>
          <span style={loading ? { display: 'inline-block', animation: 'spin 1s linear infinite' } : {}}>{ICONS.REFRESH}</span>
        </button>
        <div
          style={{
            flex: 1, padding: '3px 10px', background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 6, fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}
          title={currentUrl}
        >
          {currentUrl}
        </div>
        <button type="button" className="btn-icon" onClick={handleCopyUrl} title={t('webview.copyUrl')}>{ICONS.COPY}</button>
        <button type="button" className="btn-icon" onClick={handleOpenExternal} title={t('webview.openExternal')}>{ICONS.LINK}</button>
        <button type="button" className="btn-icon" onClick={openDevTools} title={t('webview.devTools')}>{ICONS.DEVTOOLS}</button>
        <button type="button" className="btn-icon" onClick={clearCacheAndReload} title={t('webview.clearCache')}>{ICONS.CLEAR_CACHE}</button>
        <button type="button" className="btn-icon" onClick={() => handleZoom(-0.1)} title={t('webview.zoomOut')}>{ICONS.ZOOM_OUT}</button>
        <span onClick={() => setZoom(1)} style={{ fontSize: 11, minWidth: 38, textAlign: 'center', cursor: 'pointer' }}>
          {Math.round(zoom * 100)}%
        </span>
        <button type="button" className="btn-icon" onClick={() => handleZoom(0.1)} title={t('webview.zoomIn')}>{ICONS.ZOOM_IN}</button>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {profile.name}
        </span>
      </div>

      {netError && (
        <div style={{ padding: '8px 16px', background: 'var(--danger)', color: 'white', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
          {ICONS.WARNING} {netError}
          <button type="button" style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }} onClick={() => setNetError(null)}>{ICONS.CLOSE}</button>
        </div>
      )}

      {sleeping && (
        <div style={{ padding: 16, textAlign: 'center', background: 'var(--bg-secondary)' }}>
          <p>{t('webview.sleeping') || 'Tab is sleeping'}</p>
          <button type="button" className="btn btn-primary" onClick={wakeUp}>{t('webview.wakeUp') || 'Wake up'}</button>
        </div>
      )}

      {urlInvalid && (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: 24, textAlign: 'center', color: 'var(--text-secondary)', gap: 8
        }}>
          <span style={{ fontSize: 32 }}>{ICONS.WARNING}</span>
          <p style={{ margin: 0, fontSize: 14 }}>{t('webview.invalid_url')}</p>
          <code style={{ fontSize: 12, background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: 4 }}>
            {profile.url || '—'}
          </code>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>
            {t('webview.invalid_url_hint')}
          </p>
        </div>
      )}

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
