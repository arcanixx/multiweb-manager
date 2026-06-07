// =============================================================================
// FILE: useWebViewEvents.js
// PATH: src/hooks/useWebViewEvents.js
// VERSION: 0.0.3
// PURPOSE: Hook zarządzający listenerami zdarzeń WebView (load, navigate, title, console)
// FUNCTIONS: useWebViewEvents
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useCallback } from 'react';
import { logDebug, logWarn, logError } from '../utils/loggerRenderer.js';

// ─── useWebViewEvents() – zwraca handlery zdarzeń WebView (memoized useCallback)
//   @param {Object}   params.profile              – aktywny profil (id)
//   @param {Function} params.setIsLoading          – setter stanu ładowania
//   @param {Function} params.setError              – setter błędu
//   @param {Function} params.setTitle              – setter tytułu strony
//   @param {Function} params.onTitleChange         – zewnętrzny callback zmiany tytułu
//   @param {Function} params.onLoadError           – zewnętrzny callback błędu ładowania
//   @param {Function} params.updateNavigationState – aktualizacja canGoBack/canGoForward
//   @returns {Object} – obiekt z handlerami zdarzeń
export function useWebViewEvents({
  profile,
  setIsLoading,
  setError,
  setTitle,
  onTitleChange,
  onLoadError,
  updateNavigationState,
}) {
  // ─── handleDidFinishLoad() – obsługuje zakończenie ładowania strony
  const handleDidFinishLoad = useCallback(() => {
    setIsLoading(false);
    setError(null);
    updateNavigationState();
    logDebug('webview', `useWebViewEvents: finished loading ${profile.id}`);
  }, [profile.id, setIsLoading, setError, updateNavigationState]);

   // ─── handleDidFailLoad() – obsługuje błąd ładowania strony
   const handleDidFailLoad = useCallback((event) => {
     const errorCode = event.errorCode;
     const errorDescription = event.errorDescription;

     // Pomijaj anulowane nawigacje (np. szybkie kliknięcia, cofnięcie przed załadowaniem)
     if (errorCode === -3) return; // ERR_ABORTED

     setIsLoading(false);
     setError({ code: errorCode, description: errorDescription, isHttp: false });
     logError('webview', `useWebViewEvents: fail load ${profile.id}`, { errorCode, errorDescription });
     if (onLoadError) onLoadError(profile.id, errorCode);
   }, [profile.id, setIsLoading, setError, onLoadError]);

  // ─── handleDidStartLoading() – obsługuje rozpoczęcie ładowania strony
  const handleDidStartLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
    logDebug('webview', `useWebViewEvents: started loading ${profile.id}`);
  }, [profile.id, setIsLoading, setError]);

  // ─── handleDidStopLoading() – obsługuje zatrzymanie ładowania
  const handleDidStopLoading = useCallback(() => {
    setIsLoading(false);
    updateNavigationState();
    logDebug('webview', `useWebViewEvents: stopped loading ${profile.id}`);
  }, [profile.id, setIsLoading, updateNavigationState]);

  // ─── handleDidNavigateInPage() – obsługuje nawigację wewnątrz tej samej strony
  const handleDidNavigateInPage = useCallback(() => {
    updateNavigationState();
    logDebug('webview', `useWebViewEvents: navigated in page ${profile.id}`);
  }, [profile.id, updateNavigationState]);

  // ─── handlePageTitleUpdated() – obsługuje zmianę tytułu strony
  const handlePageTitleUpdated = useCallback((event) => {
    const newTitle = event.title;
    setTitle(newTitle);
    if (onTitleChange) onTitleChange(profile.id, newTitle);
    logDebug('webview', `useWebViewEvents: title updated to "${newTitle}"`);
  }, [profile.id, setTitle, onTitleChange]);

  // ─── handleConsoleMessage() – przekazuje logi konsoli WebView do loggerRenderer
  const handleConsoleMessage = useCallback((event) => {
    const { level, message, line, sourceId } = event;
    if (level === 0)      logDebug('webview', `WebView console: ${message}`);
    else if (level === 1) logWarn('webview',  `WebView console warning: ${message}`);
    else if (level === 2) logError('webview', `WebView console error: ${message}`, { line, sourceId });
  }, []);

  return {
    handleDidFinishLoad,
    handleDidFailLoad,
    handleDidStartLoading,
    handleDidStopLoading,
    handleDidNavigateInPage,
    handlePageTitleUpdated,
    handleConsoleMessage,
  };
}
