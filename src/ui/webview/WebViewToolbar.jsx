// =============================================================================
// FILE: WebViewToolbar.jsx
// PATH: src/ui/webview/WebViewToolbar.jsx
// VERSION: 0.0.3
// PURPOSE: Pasek narzędzi WebView – przyciski i akcje (Back, Forward, Reload, Zoom, itp.)
// FUNCTIONS: WebViewToolbar
// DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import { logDebug } from '../../utils/loggerRenderer.js';

// ─── WebViewToolbar – pasek narzędzi dla WebView
//   @param {Object} props
//   @param {boolean} props.canGoBack – czy można wrócić
//   @param {boolean} props.canGoForward – czy można przejść do przodu
//   @param {boolean} props.isLoading – czy strona się ładuje
//   @param {string} props.url – aktualny URL
//   @param {function} props.onBack – callback dla przycisku Wstecz
//   @param {function} props.onForward – callback dla przycisku Dalej
//   @param {function} props.onReload – callback dla przycisku Odśwież
//   @param {function} props.onCopyUrl – callback dla kopiowania URL
//   @param {function} props.onOpenExternal – callback dla otwarcia w przeglądarce
//   @param {function} props.onZoomIn – callback dla przybliżenia
//   @param {function} props.onZoomOut – callback dla oddalenia
//   @param {function} props.onZoomReset – callback dla resetu zoomu
//   @param {function} props.onDevTools – callback dla DevTools
//   @param {function} props.onClearCache – callback dla czyszczenia cache
//   @param {function} props.onScreenshot – callback dla zrzutu ekranu
//   @param {function} props.onSingleAppMode – callback dla trybu Single App
//   @param {function} props.onResourceMonitor – callback dla monitora zasobów
//   @returns {JSX.Element}
export default function WebViewToolbar({
  canGoBack,
  canGoForward,
  isLoading,
  url,
  onBack,
  onForward,
  onReload,
  onCopyUrl,
  onOpenExternal,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onDevTools,
  onClearCache,
  onScreenshot,
  onSingleAppMode,
  onResourceMonitor
}) {
  const { t } = useContext(TranslationContext);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url);
    logDebug('webview', `WebViewToolbar: URL copied to clipboard`);
    if (onCopyUrl) onCopyUrl();
  };

  return (
    <div className="webview-toolbar">
      <button onClick={onBack} disabled={!canGoBack} title={t('webview.back')}>
        {ICONS.BACK}
      </button>
      <button onClick={onForward} disabled={!canGoForward} title={t('webview.forward')}>
        {ICONS.FORWARD}
      </button>
      <button onClick={onReload} title={isLoading ? t('webview.cancel') : t('webview.reload')}>
        {ICONS.REFRESH}
      </button>

      <div className="webview-address-bar">
        <input type="text" value={url} readOnly />
        <button onClick={handleCopyUrl} title={t('webview.copyUrl')}>{ICONS.COPY}</button>
        <button onClick={onOpenExternal} title={t('webview.openExternal')}>{ICONS.LINK}</button>
      </div>

      <div className="webview-zoom-controls">
        <button onClick={onZoomOut} title={t('webview.zoomOut')}>{ICONS.ZOOM_OUT}</button>
        <button onClick={onZoomReset} title={t('webview.zoom_reset')}>{ICONS.ZOOM_RESET}</button>
        <button onClick={onZoomIn} title={t('webview.zoomIn')}>{ICONS.ZOOM_IN}</button>
      </div>

      <button onClick={onDevTools} title={t('webview.devTools')}>{ICONS.DEVTOOLS}</button>
      <button onClick={onClearCache} title={t('webview.clearCache')}>{ICONS.CLEAR_CACHE}</button>
      <button onClick={onScreenshot} disabled={!onScreenshot} title={t('webview.screenshot')}>{ICONS.SCREENSHOT}</button>
      <button onClick={onSingleAppMode} disabled={!onSingleAppMode} title={t('webview.singleAppMode')}>{ICONS.SINGLE_APP}</button>
      <button onClick={onResourceMonitor} disabled={!onResourceMonitor} title={t('webview.resourceMonitor')}>{ICONS.RESOURCE_MONITOR}</button>
    </div>
  );
}