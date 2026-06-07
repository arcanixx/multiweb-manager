// =============================================================================
// FILE: useWebViewActions.js
// PATH: src/hooks/useWebViewActions.js
// VERSION: 0.0.3
// PURPOSE: Hook akcji WebView – nawigacja, zoom, narzędzia (screenshot, single app, resource monitor)
// FUNCTIONS: useWebViewActions
// DEPENDS ON: react, config.js, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useCallback } from 'react';
import { isFeatureEnabled } from '../config.js';
import { logInfo, logWarn, logError, logDebug } from '../utils/loggerRenderer.js';

// ─── useWebViewActions() – zwraca funkcje akcji dla WebView (nawigacja, zoom, narzędzia)
//   @param {Object}   params.webviewRef   – ref do elementu <webview>
//   @param {string}   params.url          – aktualny URL
//   @param {Object}   params.profile      – aktywny profil
//   @param {number}   params.zoomFactor   – aktualny poziom zoom
//   @param {Function} params.setZoomFactor – setter poziomu zoom
//   @param {Function} params.reload       – funkcja przeładowania (z tego hooka)
//   @returns {Object} – obiekt z funkcjami akcji
export function useWebViewActions({ webviewRef, url, profile, setZoomFactor, reload }) {

  // ─── Nawigacja ────────────────────────────────────────────────────────────
  // ─── goBack() – nawiguje do poprzedniej strony w historii
  const goBack = useCallback(() => {
    webviewRef.current?.goBack();
  }, [webviewRef]);

  // ─── goForward() – nawiguje do następnej strony w historii
  const goForward = useCallback(() => {
    webviewRef.current?.goForward();
  }, [webviewRef]);

  // ─── reloadPage() – odświeża aktualną stronę
  const reloadPage = useCallback(() => {
    webviewRef.current?.reload();
  }, [webviewRef]);

  // ─── handleCopyUrl() – kopiuje aktualny URL do schowka
  const handleCopyUrl = useCallback(() => {
    navigator.clipboard.writeText(url);
    logDebug('webview', `useWebViewActions: URL copied to clipboard`);
  }, [url]);

  // ─── handleOpenExternal() – otwiera URL w domyślnej przeglądarce systemowej
  const handleOpenExternal = useCallback(() => {
    window.electronAPI?.openExternal?.(url);
    logInfo('webview', `useWebViewActions: opening external ${url}`);
  }, [url]);

  // ─── Zoom ─────────────────────────────────────────────────────────────────
  // ─── zoomIn() – zwiększa powiększenie o 10% (max 300%)
  const zoomIn = useCallback(() => {
    setZoomFactor(prev => Math.min(prev + 0.1, 3.0));
  }, [setZoomFactor]);

  // ─── zoomOut() – zmniejsza powiększenie o 10% (min 50%)
  const zoomOut = useCallback(() => {
    setZoomFactor(prev => Math.max(prev - 0.1, 0.5));
  }, [setZoomFactor]);

  // ─── zoomReset() – przywraca domyślne powiększenie 100%
  const zoomReset = useCallback(() => {
    setZoomFactor(1.0);
  }, [setZoomFactor]);

  // ─── handleZoomDelta() – obsługuje zoom kółkiem myszy z Ctrl
  const handleZoomDelta = useCallback((e) => {
    if (e.ctrlKey && e.deltaY) {
      e.preventDefault();
      if (e.deltaY < 0) zoomIn();
      else if (e.deltaY > 0) zoomOut();
    }
  }, [zoomIn, zoomOut]);

  // ─── Narzędzia ────────────────────────────────────────────────────────────
  // ─── openDevTools() – otwiera Chromium DevTools dla aktywnego WebView
  const openDevTools = useCallback(() => {
    webviewRef.current?.openDevTools();
    logInfo('webview', `useWebViewActions: DevTools opened for ${profile.id}`);
  }, [webviewRef, profile.id]);

  // ─── clearCache() – czyści cache profilu i przeładowuje stronę
  const clearCache = useCallback(async () => {
    try {
      await window.electronAPI?.clearProfileCache?.(profile.id);
      reloadPage();
      logInfo('webview', `useWebViewActions: cache cleared for ${profile.id}`);
    } catch (err) {
      logError('webview', 'useWebViewActions: clearCache failed', err);
    }
  }, [profile.id, reloadPage]);

  // ─── takeScreenshot() – wykonuje zrzut ekranu WebView (feature: screenshotWebView)
  const takeScreenshot = useCallback(async () => {
    if (!isFeatureEnabled('screenshotWebView')) return;
    try {
      const result = await window.electronAPI?.webviewCapture?.(
        webviewRef.current?.getWebContentsId()
      );
      if (result?.ok && result.data) {
        logInfo('webview', 'useWebViewActions: screenshot taken');
      } else {
        logWarn('webview', 'useWebViewActions: screenshot failed or empty result');
      }
    } catch (err) {
      logError('webview', 'useWebViewActions: screenshot error', err);
    }
  }, [webviewRef]);

  // ─── openSingleAppMode() – otwiera profil w osobnym oknie (feature: singleAppMode)
  const openSingleAppMode = useCallback(() => {
    if (!isFeatureEnabled('singleAppMode')) return;
    try {
      window.electronAPI?.webviewOpenSingle?.({ url, profile });
      logInfo('webview', `useWebViewActions: single app mode for ${profile.id}`);
    } catch (err) {
      logError('webview', 'useWebViewActions: openSingleAppMode failed', err);
    }
  }, [url, profile]);

  // ─── showResourceMonitor() – pobiera info o RAM/CPU WebView (feature: resourceMonitor)
  const showResourceMonitor = useCallback(async () => {
    if (!isFeatureEnabled('resourceMonitor')) return;
    try {
      const webContentsId = webviewRef.current?.getWebContentsId();
      const result = await window.electronAPI?.webviewGetResource?.(webContentsId);
      if (result?.ok && result.data) {
        logInfo('webview', `useWebViewActions: resources – RAM: ${result.data.ram}MB, CPU: ${result.data.cpu}%`);
        window.showToast?.(`RAM: ${result.data.ram}MB, CPU: ${result.data.cpu}%`, 'info');
      }
    } catch (err) {
      logError('webview', 'useWebViewActions: resource monitor failed', err);
    }
  }, [webviewRef]);

  return {
    goBack,
    goForward,
    reloadPage,
    handleCopyUrl,
    handleOpenExternal,
    zoomIn,
    zoomOut,
    zoomReset,
    handleZoomDelta,
    openDevTools,
    clearCache,
    takeScreenshot,
    openSingleAppMode,
    showResourceMonitor,
  };
}
