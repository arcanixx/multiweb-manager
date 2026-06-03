// =============================================================================
// FILE: WebViewTab.jsx
// PATH: src/ui/webview/WebViewTab.jsx
// VERSION: 0.0.3
// PURPOSE: Zakładka WebView – lifecycle, nawigacja, zoom, recovery, logowanie błędów
// FUNCTIONS: WebViewTab
// DEPENDS ON: react, config.js, translations.js, loggerRenderer.js, WebViewToolbar.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect, useRef, useContext } from 'react';
import { isFeatureEnabled } from '../../config.js';
import { TranslationContext } from '../../utils/translations.js';
import { logDebug } from '../../utils/loggerRenderer.js';
import WebViewToolbar from './WebViewToolbar.jsx';
import { useWebViewEvents } from '../../hooks/useWebViewEvents.js';
import { useWebViewActions } from '../../hooks/useWebViewActions.js';

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
          <span>Error: {error.description || `Code ${error.code}`}</span>
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