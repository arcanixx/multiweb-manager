// =============================================================================
// FILE: useProfiles.js
// PATH: src/hooks/useProfiles.js
// VERSION: 0.0.3
// PURPOSE: Hook React do zarządzania profilami WebView – CRUD, favorite, persistencja przez StorageService (cache + IPC). Optimistic updates z rollbackiem.
// FUNCTIONS: useProfiles
// DEPENDS ON: react, loggerRenderer.js, StorageService.js, useAsync.js, ipcChannels.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useCallback, useEffect } from 'react';
import { logDebug, logWarn } from '../utils/loggerRenderer.js';
import { storageService } from '../utils/StorageService.js';
import { useAsyncMutation } from './useAsync.js';
import { IPC_CHANNELS } from '../constants/ipcChannels.js';

// ─── useProfiles() – hook do zarządzania profilami z cache (StorageService) i optimistic updates
//   @returns {Object} – profiles, loading, error, reloadProfiles, addProfile, updateProfile, deleteProfile, toggleFavorite
//
//   ARCHITEKTURA MUTACJI PROFILI — routing IPC przez osobne kanały:
//   ┌─────────────────┬──────────────────────┬────────────────────────────┐
//   │ Operacja        │ Kanał IPC            │ Payload                    │
//   ├─────────────────┼──────────────────────┼────────────────────────────┤
//   │ Odczyt (cache)  │ profiles:getAll      │ (brak) — przez StorageService│
//   │ Tworzenie       │ profiles:create      │ profileData (cały obiekt)  │
//   │ Aktualizacja    │ profiles:update      │ { id, patch }              │
//   │ Usuwanie        │ profiles:delete      │ id (string)                │
//   │ Touch (lastUsed)│ profiles:touch       │ id (string)                │
//   └─────────────────┴──────────────────────┴────────────────────────────┘
//   UWAGA: StorageService.set('profiles', ...) zawsze trafia do profiles:update —
//          create i delete muszą używać bezpośredniego invoke() z właściwym kanałem.
//          Po mutacji invalidujemy cache StorageService przez storageService.invalidate().
export function useProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  // ─── loadFromService() – ładuje profile przez StorageService (cache → IPC)
  const loadFromService = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await storageService.get('profiles', force);
      setProfiles(data ?? []);
      logDebug('store', `useProfiles: loaded ${data?.length ?? 0} profiles (cache=${!force})`);
    } catch (err) {
      setError(err.message);
      logWarn('store', `useProfiles: load failed – ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── reloadProfiles() – wymusza odświeżenie z pominięciem cache
  const reloadProfiles = useCallback(() => loadFromService(true), [loadFromService]);

  // Załaduj przy montowaniu + subskrybuj zmiany (np. z innego komponentu)
  useEffect(() => {
    loadFromService();
    const unsubscribe = storageService.subscribe('profiles', (data) => {
      setProfiles(data ?? []);
      logDebug('store', `useProfiles: received update via subscribe (${data?.length ?? 0} profiles)`);
    });
    return unsubscribe;
  }, [loadFromService]);

  // ─── addProfile – dodaje nowy profil z optimistic update
  //   Używa IPC_CHANNELS.PROFILES.CREATE przez bezpośrednie invoke()
  const { execute: addProfile, loading: adding } = useAsyncMutation(
    async (profileData) => {
      const res = await window.electronAPI.invoke(IPC_CHANNELS.PROFILES.CREATE, profileData);
      if (!res?.ok) throw new Error(res?.error ?? 'CREATE_FAILED');
      // Invaliduj cache — następny get() pobierze świeże dane z IPC
      storageService.invalidate('profiles');
      return res.data;
    },
    {
      key: 'useProfiles.add',
      onMutate: (profileData) => {
        const snapshot = [...profiles];
        setProfiles(prev => [...prev, { ...profileData, _optimistic: true }]);
        return { snapshot };
      },
      onSuccess: (data) => { if (data) setProfiles(data); },
      onError:   (_, ctx) => setProfiles(ctx?.snapshot ?? profiles),
    }
  );

  // ─── updateProfile – aktualizuje profil z optimistic update
  //   Używa profiles:update przez StorageService (payload: { id, patch })
  //   @param {string} id    – ID profilu
  //   @param {Object} patch – pola do zaktualizowania
  const { execute: _updateExecute, loading: updating } = useAsyncMutation(
    ({ id, patch }) => storageService.set('profiles', { id, patch }),
    {
      key: 'useProfiles.update',
      onMutate: ({ id, patch }) => {
        const snapshot = [...profiles];
        setProfiles(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));
        return { snapshot };
      },
      onSuccess: (data) => { if (data) setProfiles(data); },
      onError:   (_, ctx) => setProfiles(ctx?.snapshot ?? profiles),
    }
  );
  const updateProfile = useCallback(
    (id, patch) => _updateExecute({ id, patch }),
    [_updateExecute]
  );

  // ─── deleteProfile – usuwa profil z optimistic update
  //   Używa IPC_CHANNELS.PROFILES.DELETE przez bezpośrednie invoke()
  //   Handler oczekuje id jako string (nie obiekt)
  const { execute: deleteProfile, loading: deleting } = useAsyncMutation(
    async (id) => {
      const res = await window.electronAPI.invoke(IPC_CHANNELS.PROFILES.DELETE, id);
      if (!res?.ok) throw new Error(res?.error ?? 'DELETE_FAILED');
      // Invaliduj cache — następny get() pobierze świeże dane z IPC
      storageService.invalidate('profiles');
      return res.data;
    },
    {
      key: 'useProfiles.delete',
      onMutate: (id) => {
        const snapshot = [...profiles];
        setProfiles(prev => prev.filter(p => p.id !== id));
        return { snapshot };
      },
      onSuccess: (data) => { if (data) setProfiles(data); },
      onError:   (_, ctx) => setProfiles(ctx?.snapshot ?? profiles),
    }
  );

  // ─── toggleFavorite – przełącza favorite z optimistic update
  const toggleFavorite = useCallback(async (id) => {
    const profile = profiles.find(p => p.id === id);
    if (!profile) return { ok: false, error: 'NOT_FOUND' };
    return updateProfile(id, { favorite: !profile.favorite });
  }, [profiles, updateProfile]);

  return {
    profiles, loading, error,
    reloadProfiles,
    addProfile,    adding,
    updateProfile, updating,
    deleteProfile, deleting,
    toggleFavorite,
  };
}
