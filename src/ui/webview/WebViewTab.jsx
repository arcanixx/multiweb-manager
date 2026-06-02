// =============================================================================
// FILE: WebViewTab.jsx
// PATH: src/ui/webview/WebViewTab.jsx
// VERSION: 0.0.3
// PURPOSE: Zakładka WebView – lifecycle, nawigacja, zoom, recovery, logowanie błędów
// FUNCTIONS: WebViewTab
// DEPENDS ON: react, config.js, translations.js, loggerRenderer.js, WebViewToolbar.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { isFeatureEnabled } from '../../config.js';
import { TranslationContext } from '../../utils/translations.js';
import { logError, logInfo, logDebug, logWarn } from '../../utils/loggerRenderer.js';
import WebViewToolbar from './WebViewToolbar.jsx';

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
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(profile.url || '');
  const [title, setTitle] = useState(profile.name || '');
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [zoomFactor, setZoomFactor] = useState(1.0);

  // =========================================================================
  // ─── Helper: aktualizacja URL i stanu nawigacji ─────────────────────────
  // =========================================================================
  const updateNavigationState = useCallback(() => {
    if (webviewRef.current) {
      setCanGoBack(webviewRef.current.canGoBack());
      setCanGoForward(webviewRef.current.canGoForward());
      const currentUrl = webviewRef.current.getURL();
      if (currentUrl && currentUrl !== 'about:blank') {
        setUrl(currentUrl);
      }
    }
  }, []);

  // =========================================================================
  // ─── Nawigacja ──────────────────────────────────────────────────────────
  // =========================================================================
  const goBack = () => webviewRef.current?.goBack();
  const goForward = () => webviewRef.current?.goForward();
  const reload = () => webviewRef.current?.reload();

  // =========================================================================
  // ─── Zoom ───────────────────────────────────────────────────────────────
  // =========================================================================
  const zoomIn = () => setZoomFactor(prev => Math.min(prev + 0.1, 3.0));
  const zoomOut = () => setZoomFactor(prev => Math.max(prev - 0.1, 0.5));
  const zoomReset = () => setZoomFactor(1.0);

  const handleZoomDelta = useCallback((e) => {
    if (e.ctrlKey && e.deltaY) {
      e.preventDefault();
      if (e.deltaY < 0) zoomIn();
      else if (e.deltaY > 0) zoomOut();
    }
  }, []);

  // =========================================================================
  // ─── Narzędzia ──────────────────────────────────────────────────────────
  // =========================================================================
  const openDevTools = () => webviewRef.current?.openDevTools();

  const clearCache = async () => {
    try {
      await window.electronAPI?.clearProfileCache?.(profile.id);
      reload();
      logInfo(`WebViewTab: cache cleared for profile ${profile.id}`);
    } catch (err) {
      logError('WebViewTab: clearCache failed', err);
    }
  };

  const takeScreenshot = async () => {
    try {
      const result = await window.electronAPI?.captureWebView?.(webviewRef.current?.getWebContentsId());
      if (result?.ok && result.data) {
        // copy to clipboard
        logInfo('WebViewTab: screenshot taken');
      } else {
        logWarn('WebViewTab: screenshot failed');
      }
    } catch (err) {
      logError('WebViewTab: screenshot error', err);
    }
  };

  const openSingleAppMode = () => {
    try {
      window.electronAPI?.openSingleWindow?.({
        url: url,
        profile: profile
      });
      logInfo(`WebViewTab: opened in single app mode for ${profile.id}`);
    } catch (err) {
      logError('WebViewTab: openSingleAppMode failed', err);
    }
  };

  const showResourceMonitor = async () => {
    try {
      const webContentsId = webviewRef.current?.getWebContentsId();
      const result = await window.electronAPI?.getWebViewResourceInfo?.(webContentsId);
if (result?.ok && result.data) {
         logInfo(`WebViewTab: resource info: ${JSON.stringify(result.data)}`);
         window.showToast(`RAM: ${result.data.ram}MB, CPU: ${result.data.cpu}%`, 'info');
      }
    } catch (err) {
      logError('WebViewTab: resource monitor failed', err);
    }
  };

  // =========================================================================
  // ─── WebView event handlers ─────────────────────────────────────────────
  // =========================================================================
  const handleDidFinishLoad = useCallback(() => {
    setIsLoading(false);
    setError(null);
    updateNavigationState();
    webviewRef.current?.getTitle().then(setTitle).catch(() => {});
    logDebug(`WebViewTab: finished loading ${profile.id}`);
  }, [profile.id, updateNavigationState]);

  const handleDidFailLoad = useCallback((event) => {
    const errorCode = event.errorCode;
    const errorDescription = event.errorDescription;
    setIsLoading(false);
    setError({ code: errorCode, description: errorDescription });
    logError(`WebViewTab: fail load ${profile.id}`, { errorCode, errorDescription });
    if (onLoadError) onLoadError(profile.id, errorCode);
  }, [profile.id, onLoadError]);

  const handleDidStartLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
    logDebug(`WebViewTab: started loading ${profile.id}`);
  }, [profile.id]);

  const handleDidStopLoading = useCallback(() => {
    setIsLoading(false);
    updateNavigationState();
    logDebug(`WebViewTab: stopped loading ${profile.id}`);
  }, [profile.id, updateNavigationState]);

  const handleDidNavigateInPage = useCallback(() => {
    updateNavigationState();
    webviewRef.current?.getTitle().then(setTitle).catch(() => {});
    logDebug(`WebViewTab: navigated in page ${profile.id}`);
  }, [profile.id, updateNavigationState]);

  const handlePageTitleUpdated = useCallback((event) => {
    const newTitle = event.title;
    setTitle(newTitle);
    if (onTitleChange) onTitleChange(profile.id, newTitle);
    logDebug(`WebViewTab: title updated to ${newTitle}`);
  }, [profile.id, onTitleChange]);

  const handleConsoleMessage = useCallback((event) => {
    const { level, message, line, sourceId } = event;
    if (level === 0) logDebug(`WebView console: ${message}`);
    else if (level === 1) logWarn(`WebView console warning: ${message}`);
    else if (level === 2) logError(`WebView console error: ${message}`, { line, sourceId });
  }, []);

  // =========================================================================
  // ─── useEffect – zoom factor ────────────────────────────────────────────
  // =========================================================================
  useEffect(() => {
    if (webviewRef.current) {
      webviewRef.current.setZoomFactor(zoomFactor);
      logDebug(`WebViewTab: zoom factor set to ${zoomFactor} for ${profile.id}`);
    }
  }, [zoomFactor, profile.id]);

  // =========================================================================
  // ─── useEffect – attach event listeners + cleanup ───────────────────────
  // =========================================================================
  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    const events = [
      { name: 'did-finish-load', handler: handleDidFinishLoad },
      { name: 'did-fail-load', handler: handleDidFailLoad },
      { name: 'did-start-loading', handler: handleDidStartLoading },
      { name: 'did-stop-loading', handler: handleDidStopLoading },
      { name: 'did-navigate-in-page', handler: handleDidNavigateInPage },
      { name: 'page-title-updated', handler: handlePageTitleUpdated },
      { name: 'console-message', handler: handleConsoleMessage }
    ];

    events.forEach(({ name, handler }) => {
      webview.addEventListener(name, handler);
    });

    window.addEventListener('wheel', handleZoomDelta, { passive: false });

    return () => {
      events.forEach(({ name, handler }) => {
        webview.removeEventListener(name, handler);
      });
      window.removeEventListener('wheel', handleZoomDelta);
      logDebug(`WebViewTab: cleaned up events for ${profile.id}`);
    };
  }, [
    handleDidFinishLoad,
    handleDidFailLoad,
    handleDidStartLoading,
    handleDidStopLoading,
    handleDidNavigateInPage,
    handlePageTitleUpdated,
    handleConsoleMessage,
    handleZoomDelta,
    profile.id
  ]);

  // =========================================================================
  // ─── Render ──────────────────────────────────────────────────────────────
  // =========================================================================
  const webviewSrc = profile.url || 'about:blank';
  const userAgent = profile.userAgent || undefined;
  const partition = profile.partition || `persist:profile-${profile.id}`;
  const adBlockerEnabled = profile.adBlocker !== undefined ? profile.adBlocker : true;

  return (
    <div className="webview-tab" style={{ display: isActive ? 'flex' : 'none' }}>
      <WebViewToolbar
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        isLoading={isLoading}
        url={url}
        onBack={goBack}
        onForward={goForward}
        onReload={reload}
        onCopyUrl={() => navigator.clipboard.writeText(url)}
        onOpenExternal={() => window.electronAPI?.openExternal?.(url)}
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
          <button onClick={reload}>{t('webview.reload')}</button>
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