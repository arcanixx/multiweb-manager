// =============================================================================
// FILE: src/components/WebViewTab.jsx
// PATH: multiweb-manager/src/components/WebViewTab.jsx
// VERSION: v1
// PURPOSE: Komponent przeglądarki oparty na <webview> Electrona.
//          Każdy profil ma niezależną partycję (persist:profile-ID) –
//          oddzielne cookies, sesję, cache. Obsługuje: zoom, DevTools,
//          czyszczenie cache, nawigację wstecz/dalej, reload, błędy sieci.
// DEPENDS ON: icons.js, useTranslation.js, logger.js
// FUNCTIONS: openDevTools, clearCacheAndReload, handleZoom,
//            handleLoadFail, handleDomReady
// =============================================================================

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ICONS } from '../utils/icons';
import { useTranslation } from '../hooks/useTranslation';
import { log, error as logError } from '../utils/logger';

export default function WebViewTab({ profile }) {
  const webviewRef  = useRef(null);
  const [zoom, setZoom]         = useState(profile.zoom || 1);
  const [loading, setLoading]   = useState(true);
  const [currentUrl, setCurrentUrl] = useState(profile.url);
  const { t } = useTranslation();

  // ----------------------------------------------------------------
  // Inicjalizacja webview – nasłuchiwanie zdarzeń ładowania i błędów
  // Cleanup: usuwa listenery przy odmontowaniu / zmianie profilu
  // ----------------------------------------------------------------
  useEffect(() => {
    const wv = webviewRef.current;
    if (!wv) return;

    // Ustaw zoom po załadowaniu DOM
    const onDomReady = () => {
      wv.setZoomFactor(zoom);
      setLoading(false);
      log(`WebView ready: ${profile.name} @ ${profile.url}`);

      // Zapisz do historii
      window.electronAPI.addHistory({
        profileName: profile.name,
        url: profile.url,
      }).catch(() => {});
    };

    const onStartLoad = () => setLoading(true);
    const onStopLoad  = () => setLoading(false);

    // Aktualizuj URL w toolbarze przy nawigacji wewnątrz strony
    const onNavigate = (e) => {
      if (e.url) setCurrentUrl(e.url);
      log(`WebView navigate: ${e.url}`);
    };

    // Obsługa błędów ładowania
    const onFailLoad = (e) => {
      setLoading(false);
      // -3 = ERR_ABORTED (anulowane przez stronę, ignoruj)
      if (e.errorCode === -3) return;
      logError(`WebView load failed: ${e.errorDescription} (${e.errorCode}) for ${profile.url}`);
      if (e.errorCode === -106 || e.errorCode === -2) {
        // Brak sieci
        showNetError(t('webview.error_offline'));
      } else if (e.errorCode === -105 || e.errorCode === -501) {
        showNetError(t('webview.error_404', { url: profile.url }));
      }
    };

    wv.addEventListener('dom-ready',         onDomReady);
    wv.addEventListener('did-start-loading', onStartLoad);
    wv.addEventListener('did-stop-loading',  onStopLoad);
    wv.addEventListener('did-navigate',      onNavigate);
    wv.addEventListener('did-navigate-in-page', onNavigate);
    wv.addEventListener('did-fail-load',     onFailLoad);

    return () => {
      wv.removeEventListener('dom-ready',         onDomReady);
      wv.removeEventListener('did-start-loading', onStartLoad);
      wv.removeEventListener('did-stop-loading',  onStopLoad);
      wv.removeEventListener('did-navigate',      onNavigate);
      wv.removeEventListener('did-navigate-in-page', onNavigate);
      wv.removeEventListener('did-fail-load',     onFailLoad);
    };
  }, [profile.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ----------------------------------------------------------------
  // Aktualizacja zoomu – osobny effect żeby nie resetować listenerów
  // ----------------------------------------------------------------
  useEffect(() => {
    const wv = webviewRef.current;
    if (wv) {
      wv.setZoomFactor(zoom);
      log(`WebView zoom: ${Math.round(zoom * 100)}% for ${profile.name}`);
    }
  }, [zoom]);

  // ----------------------------------------------------------------
  // showNetError() – wyświetla inline komunikat błędu (nie alert)
  // ----------------------------------------------------------------
  const [netError, setNetError] = useState(null);
  const showNetError = (msg) => {
    setNetError(msg);
    setTimeout(() => setNetError(null), 5000);
  };

  // ----------------------------------------------------------------
  // openDevTools() – otwiera Chromium DevTools dla tego webview
  // ----------------------------------------------------------------
  const openDevTools = useCallback(() => {
    webviewRef.current?.openDevTools();
    log(`DevTools opened for ${profile.name}`);
  }, [profile.name]);

  // ----------------------------------------------------------------
  // clearCacheAndReload() – czyści partycję profilu i przeładowuje
  // ----------------------------------------------------------------
  const clearCacheAndReload = useCallback(async () => {
    setLoading(true);
    await window.electronAPI.clearProfileCache(profile.id);
    webviewRef.current?.reload();
    log(`Cache cleared for ${profile.name}`);
  }, [profile.id, profile.name]);

  // ----------------------------------------------------------------
  // handleZoom() – zmiana zoomu (ograniczona do 0.3–3.0)
  // ----------------------------------------------------------------
  const handleZoom = (delta) => setZoom(z => Math.min(3, Math.max(0.3, +(z + delta).toFixed(1))));
  const resetZoom  = () => setZoom(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ─── Toolbar ─── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px',
        background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
        flexShrink: 0
      }}>
        {/* Nawigacja */}
        <button className="btn-icon" onClick={() => webviewRef.current?.goBack()}    title={t('webview.back')}>{ICONS.BACK}</button>
        <button className="btn-icon" onClick={() => webviewRef.current?.goForward()} title={t('webview.forward')}>{ICONS.FORWARD}</button>
        <button className="btn-icon" onClick={() => webviewRef.current?.reload()}    title={t('webview.reload')}
          style={{ color: loading ? 'var(--accent)' : undefined }}>
          <span style={loading ? { display: 'inline-block', animation: 'spin 1s linear infinite' } : {}}>
            {ICONS.REFRESH}
          </span>
        </button>

        {/* URL (tylko do odczytu) */}
        <div style={{
          flex: 1, padding: '3px 10px', background: 'var(--bg-card)',
          border: '1px solid var(--border)', borderRadius: 6,
          fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'default'
        }} title={currentUrl}>
          {currentUrl}
        </div>

        {/* Narzędzia */}
        <button className="btn-icon" onClick={openDevTools}       title={t('webview.devTools')}>{ICONS.DEVTOOLS}</button>
        <button className="btn-icon" onClick={clearCacheAndReload} title={t('webview.clearCache')}>{ICONS.CLEAR_CACHE}</button>

        {/* Zoom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 4 }}>
          <button className="btn-icon" onClick={() => handleZoom(-0.1)} title={t('webview.zoomOut')}>{ICONS.ZOOM_OUT}</button>
          <span onClick={resetZoom} style={{
            fontSize: 11, minWidth: 38, textAlign: 'center',
            cursor: 'pointer', color: 'var(--text-secondary)'
          }} title={t('webview.zoom_reset')}>
            {Math.round(zoom * 100)}%
          </span>
          <button className="btn-icon" onClick={() => handleZoom(+0.1)} title={t('webview.zoomIn')}>{ICONS.ZOOM_IN}</button>
        </div>

        {/* Nazwa profilu */}
        <span style={{
          fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)',
          maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
        }} title={profile.name}>
          {profile.icon && profile.icon.length <= 4 ? profile.icon + ' ' : ''}{profile.name}
        </span>
      </div>

      {/* ─── Błąd sieci – inline banner ─── */}
      {netError && (
        <div style={{
          padding: '8px 16px', background: 'var(--danger)', color: 'white',
          fontSize: 13, display: 'flex', alignItems: 'center', gap: 8
        }}>
          {ICONS.WARNING} {netError}
          <button style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            onClick={() => setNetError(null)}>{ICONS.CLOSE}</button>
        </div>
      )}

      {/* ─── WebView ─── */}
      <webview
        ref={webviewRef}
        src={profile.url}
        partition={`persist:profile-${profile.id}`}
        style={{ flex: 1, display: 'flex' }}
        allowpopups="true"
        webpreferences="contextIsolation=yes, nativeWindowOpen=yes, javascript=yes"
      />
    </div>
  );
}
