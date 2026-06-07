// =============================================================================
// FILE: useHistoryLog.js
// PATH: src/hooks/useHistoryLog.js
// VERSION: 0.0.3
// PURPOSE: Hook React do zarządzania i odświeżania logów historii aktywności użytkownika. Komunikuje się z historyStore przez mostek IPC.
// FUNCTIONS: useHistoryLog
// DEPENDS ON: react, loggerRenderer.js, useAsync.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useCallback } from 'react';
import { logWarn } from '../utils/loggerRenderer.js';
import { useAsync, useAsyncMutation } from './useAsync.js';

// ─── useHistoryLog() – hook do zarządzania historią akcji użytkownika
//   @returns {Object} – entries, loading, error, reloadHistory, clearHistory
export function useHistoryLog() {

  // ─── loadFn – ładuje wszystkie wpisy historii przez IPC
  const loadFn = useCallback(
    () => window.electronAPI.invoke('history:getAll'),
    []
  );

  const { data: entries = [], loading, error, execute: reloadHistory } = useAsync(loadFn, {
    key: 'useHistoryLog',
    initialData: [],
    runOnMount: true,
  });

  if (error) logWarn('store', `useHistoryLog: ${error}`);

  // ─── clearHistory – usuwa wszystkie wpisy historii
  const { execute: clearHistory, loading: clearing } = useAsyncMutation(
    () => window.electronAPI.invoke('history:clear'),
    {
      key: 'useHistoryLog.clear',
      onSuccess: () => reloadHistory(),
      onError: (err) => logWarn('store', `useHistoryLog.clear failed: ${err}`),
    }
  );

  return { entries, loading, error, reloadHistory, clearHistory, clearing };
}