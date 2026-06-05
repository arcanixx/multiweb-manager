// =============================================================================
// FILE: useProfiles.js
// PATH: src/hooks/useProfiles.js
// VERSION: 0.0.3
// PURPOSE: Hook React do zarządzania profilami WebView – CRUD, favorite, persistencja przez StorageService (cache + IPC). Optimistic updates z rollbackiem.
// FUNCTIONS: useProfiles
// DEPENDS ON: react, loggerRenderer.js, StorageService.js, useAsync.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useCallback, useEffect } from 'react';
import { logDebug, logWarn } from '../utils/loggerRenderer.js';
import { storageService } from '../utils/StorageService.js';
import { useAsyncMutation } from './useAsync.js';

// ─── useProfiles() – hook do zarządzania profilami z cache (StorageService) i optimistic updates
//   @returns {Object} – profiles, loading, error, reloadProfiles, addProfile, updateProfile, deleteProfile, toggleFavorite
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
  const { execute: addProfile, loading: adding } = useAsyncMutation(
    (profileData) => storageService.set('profiles', { action: 'create', profile: profileData }),
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
  //   @param {string} id    – ID profilu
  //   @param {Object} patch – pola do zaktualizowania
  const { execute: _updateExecute, loading: updating } = useAsyncMutation(
    ({ id, patch }) => storageService.set('profiles', { action: 'update', id, patch }),
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
  const { execute: deleteProfile, loading: deleting } = useAsyncMutation(
    (id) => storageService.set('profiles', { action: 'delete', id }),
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