// =============================================================================
// FILE: WebViewTab.jsx
// PATH: src/ui/webview/WebViewTab.jsx
// VERSION: 0.0.3
// PURPOSE: Zakładka WebView – lifecycle, nawigacja, zoom, recovery, logowanie błędów
// FUNCTIONS: WebViewTab
// DEPENDS ON: react, config.js, translations.js, loggerRenderer.js, WebViewToolbar.jsx, useWebViewEvents.js, useWebViewActions.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect, useRef, useContext } from 'react';
import { isFeatureEnabled } from '../../config.js';
import { TranslationContext } from '../../utils/translations.js';
import { logDebug } from '../../utils/loggerRenderer.js';
import WebViewToolbar from './WebViewToolbar.jsx';
import { useWebViewEvents } from '../../hooks/useWebViewEvents.js';
import { useWebViewActions } from '../../hooks/useWebViewActions.js';

// ─── getErrorMessage() – zwraca zlokalizowany komunikat błędu WebView na podstawie kodu
//   @param {Object} error  – { code, description, isHttp }
//   @param {Function} t    – funkcja tłumaczeń
//   @param {string} url    – aktualny URL zakładki
//   @returns {string}
function getErrorMessage(error, t, url) {
  if (error.isHttp) {
    if (error.code === 404) return t('webview.error_http_404');
    if (error.code === 403) return t('webview.error_http_403');
    if (error.code === 401) return t('webview.error_http_401');
    if (error.code >= 500) return t('webview.error_http_5xx').replace('{code}', String(error.code));
    return t('webview.error_http_4xx').replace('{code}', String(error.code));
  }
  // Błędy sieciowe Chromium (did-fail-load)
  if (error.code === -106) return t('webview.error_offline');
  if (error.code === -105 || error.code === -2) return t('webview.error_bad_host');
  return t('webview.error_404').replace('{url}', url);
}

// ─── WebViewTab – pojedyncza zakładka WebView z pełnym toolbar'em
//   @param {Object} props
//   @param {Object} props.profile – obiekt profilu (url, userAgent, adBlocker, partition)
//   @param {boolean} props.isActive – czy zakładka aktywna
//   @param {function} props.onTitleChange – callback po zmianie tytułu strony
//   @param {function} props.onLoadError – callback przy błędzie ładowania
//   @returns {JSX.Element}
export default function WebViewTab({ profile, isActive, onTitleChange, onLoadError }) {
  const { t } = useContext(TranslationContext);
  const webviewRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState(null);
  const [url, setUrl]             = useState(profile.url || '');
  const [title, setTitle]         = useState(profile.name || '');
  const [canGoBack, setCanGoBack]       = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [zoomFactor, setZoomFactor]     = useState(1.0);

  // ─── updateNavigationState() – aktualizuje stan przycisków nawigacji i URL
  const updateNavigationState = () => {
    if (webviewRef.current) {
      setCanGoBack(webviewRef.current.canGoBack());
      setCanGoForward(webviewRef.current.canGoForward());
      const currentUrl = webviewRef.current.getURL();
      if (currentUrl && currentUrl !== 'about:blank') setUrl(currentUrl);
    }
  };

  // ─── Hooki akcji i zdarzeń WebView
  const {
    goBack, goForward, reloadPage, handleCopyUrl, handleOpenExternal,
    zoomIn, zoomOut, zoomReset, handleZoomDelta,
    openDevTools, clearCache, takeScreenshot, openSingleAppMode, showResourceMonitor,
  } = useWebViewActions({ webviewRef, url, profile, setZoomFactor, reload: () => webviewRef.current?.reload() });

  const {
    handleDidFinishLoad, handleDidFailLoad, handleDidStartLoading,
    handleDidStopLoading, handleDidNavigateInPage,
    handlePageTitleUpdated, handleConsoleMessage,
  } = useWebViewEvents({
    profile, setIsLoading, setError, setTitle,
    onTitleChange, onLoadError, updateNavigationState,
  });

   // =========================================================================
   // ─── useEffect – zoom factor ─────────────────────────────────────────────
   // =========================================================================
   useEffect(() => {
     if (webviewRef.current) {
       webviewRef.current.setZoomFactor(zoomFactor);
       logDebug('webview', `WebViewTab: zoom factor set to ${zoomFactor} for ${profile.id}`);
     }
   }, [zoomFactor, profile.id]);

   // =========================================================================
   // ─── useEffect – rejestracja monitora HTTP 4xx/5xx dla tej partycji ─────
   // =========================================================================
   useEffect(() => {
     // Uruchom monitor HTTP błędów w main process dla partycji tego profilu
     window.electronAPI.startWebviewHttpMonitor?.(partition);

     // Nasłuchuj HTTP błędów – filtruj po partycji żeby obsłużyć tylko tę zakładkę
     const cleanup = window.electronAPI.onWebviewHttpError?.((payload) => {
       if (payload.partition !== partition) return;

       // Wyczyść stan ładowania i ustaw błąd HTTP
       setIsLoading(false);
       setError({ code: payload.statusCode, description: `HTTP ${payload.statusCode}`, isHttp: true });
       logDebug('webview', `WebViewTab: HTTP ${payload.statusCode} dla ${payload.url} (profil: ${profile.id})`);
       if (onLoadError) onLoadError(profile.id, payload.statusCode);
     });

     return () => cleanup?.();
   }, [partition, profile.id, onLoadError]);

   // =========================================================================
   // ─── useEffect – attach event listeners + cleanup ─────────────────────────
   // =========================================================================
  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    const events = [
      { name: 'did-finish-load',       handler: handleDidFinishLoad },
      { name: 'did-fail-load',         handler: handleDidFailLoad },
      { name: 'did-start-loading',     handler: handleDidStartLoading },
      { name: 'did-stop-loading',      handler: handleDidStopLoading },
      { name: 'did-navigate-in-page',  handler: handleDidNavigateInPage },
      { name: 'page-title-updated',    handler: handlePageTitleUpdated },
      { name: 'console-message',       handler: handleConsoleMessage },
    ];

    events.forEach(({ name, handler }) => webview.addEventListener(name, handler));
    window.addEventListener('wheel', handleZoomDelta, { passive: false });

    return () => {
      events.forEach(({ name, handler }) => webview.removeEventListener(name, handler));
      window.removeEventListener('wheel', handleZoomDelta);
      logDebug('webview', `WebViewTab: cleaned up events for ${profile.id}`);
    };
  }, [
    handleDidFinishLoad, handleDidFailLoad, handleDidStartLoading,
    handleDidStopLoading, handleDidNavigateInPage,
    handlePageTitleUpdated, handleConsoleMessage, handleZoomDelta,
    profile.id,
  ]);

  // =========================================================================
  // ─── useEffect – session cleanup przy unmount (W8: zapobiega session leak) ──
  // =========================================================================
  // Electron nie zwalnia automatycznie storage dla named partitions.
  // Przy zamknięciu WebView (unmount) czyścimy: cache, cookies, storage dla tej partycji.
  // UWAGA: clearStorageData() woła IPC do main process (clearProfileCache handler).
  //        Nie czyści storageData sesji zdalnych – to zamierzone (persist: = trwałe profile).
  useEffect(() => {
    return () => {
      // Cleanup tylko dla nietrwałych (in-memory) partycji – persist: zostawiamy celowo
      if (!partition.startsWith('persist:')) {
        window.electronAPI?.clearProfileCache?.(profile.id)
          .catch(err => logDebug('webview', `WebViewTab: session cleanup failed for ${profile.id}`, err));
        logDebug('webview', `WebViewTab: cleaned up non-persist session for ${profile.id}`);
      }
    };
  }, [partition, profile.id]);

  // =========================================================================
  // ─── Render ────────────────────────────────────────────────────────────────────────────
  // =========================================================================
  const webviewSrc        = profile.url || 'about:blank';
  const userAgent         = profile.userAgent || undefined;
  const partition         = profile.partition || `persist:profile-${profile.id}`;

  return (
    <div className="webview-tab" style={{ display: isActive ? 'flex' : 'none' }}>
      <WebViewToolbar
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        isLoading={isLoading}
        url={url}
        onBack={goBack}
        onForward={goForward}
        onReload={reloadPage}
        onCopyUrl={handleCopyUrl}
        onOpenExternal={handleOpenExternal}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onZoomReset={zoomReset}
        onDevTools={openDevTools}
        onClearCache={clearCache}
        onScreenshot={isFeatureEnabled('screenshotWebView') ? takeScreenshot : undefined}
        onSingleAppMode={isFeatureEnabled('singleAppMode') ? openSingleAppMode : undefined}
        onResourceMonitor={isFeatureEnabled('resourceMonitor') ? showResourceMonitor : undefined}
      />

       {error && (
         <div className="webview-error-bar">
           <span>{getErrorMessage(error, t, url)}</span>
           <button onClick={reloadPage}>{t('webview.reload')}</button>
         </div>
       )}

      {isLoading && !error && (
        <div className="webview-loading">
          <span>{t('webview.loading')}</span>
        </div>
      )}

      <webview
        ref={webviewRef}
        src={webviewSrc}
        useragent={userAgent}
        partition={partition}
        preload="file:///preload-webview.js"
        disablewebsecurity={false}
        allowpopups="false"
        webpreferences="contextIsolation=yes, nodeIntegration=no, sandbox=yes"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}