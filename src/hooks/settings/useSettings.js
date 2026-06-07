// =============================================================================
// FILE: useSettings.js
// PATH: src/hooks/settings/useSettings.js
// VERSION: 0.0.3
// PURPOSE: Hook React do zarządzania ustawieniami użytkownika – ładowanie przez StorageService (cache + IPC), zapis z notyfikacją subskrybentów.
// FUNCTIONS: useSettings
// DEPENDS ON: react, loggerRenderer.js, StorageService.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useCallback, useEffect } from 'react';
import { logDebug, logWarn } from '../../utils/loggerRenderer.js';
import { storageService } from '../../utils/StorageService.js';

// ─── useSettings() – hook do zarządzania ustawieniami z cache (StorageService)
//   @returns {Object} – settings, loading, error, reloadSettings, saveSettings
export function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [saving,   setSaving]   = useState(false);

  // ─── loadFromService() – ładuje ustawienia przez StorageService (cache → IPC)
  const loadFromService = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await storageService.get('settings', force);
      setSettings(data ?? {});
      logDebug('settings', `useSettings: loaded (${Object.keys(data ?? {}).length} keys, cache=${!force})`);
    } catch (err) {
      setError(err.message);
      logWarn('settings', `useSettings: load failed – ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── reloadSettings() – wymusza odświeżenie z pominięciem cache
  const reloadSettings = useCallback(() => loadFromService(true), [loadFromService]);

  // Załaduj przy montowaniu + subskrybuj zmiany
  useEffect(() => {
    loadFromService();
    const unsubscribe = storageService.subscribe('settings', (data) => {
      setSettings(data ?? {});
      logDebug('settings', 'useSettings: received update via subscribe');
    });
    return unsubscribe;
  }, [loadFromService]);

  // ─── saveSettings() – zapisuje patch ustawień przez StorageService
  //   @param {Object} patch – obiekt z polami do zaktualizowania (merge po stronie main)
  //   @returns {Promise<{ ok: boolean, data?: Object }>}
  const saveSettings = useCallback(async (patch) => {
    setSaving(true);
    try {
      const res = await storageService.set('settings', patch);
      if (res?.ok && res.data) {
        setSettings(res.data);
        logDebug('settings', `useSettings: saved (${Object.keys(patch).length} keys)`);
      } else {
        logWarn('settings', `useSettings: save failed – ${res?.error}`);
      }
      return res;
    } catch (err) {
      logWarn('settings', `useSettings: save exception – ${err.message}`);
      return { ok: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }, []);

  return { settings, loading, error, saving, reloadSettings, saveSettings };
}
