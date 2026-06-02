// =============================================================================
// FILE: useProfiles.js
// PATH: src/hooks/useProfiles.js
// VERSION: 0.0.3
// PURPOSE: Hook React do zarządzania profilami WebView – CRUD, favorite, persistencja przez IPC.
// FUNCTIONS: useProfiles
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useCallback, useEffect } from 'react';
import { logInfo, logError, logWarn, logDebug } from '../utils/loggerRenderer.js';

// ─── useProfiles() – hook do zarządzania profilami z persistencją
// @returns {Object} – profiles, loading, saveProfiles, addProfile, updateProfile, deleteProfile, toggleFavorite
export function useProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── loadProfiles() – ładuje profile z backendu przy inicjalizacji
  useEffect(() => {
    const load = async () => {
      try {
        if (!window.electronAPI?.getProfiles) {
          setProfiles([]);
          setLoading(false);
          logWarn('store', 'useProfiles: electronAPI.getProfiles unavailable');
          return;
        }
        const res = await window.electronAPI.getProfiles();
        if (res?.ok) {
          setProfiles(res.data || []);
          logInfo('store', 'useProfiles: loaded', res.data?.length);
        } else {
          logError('store', 'useProfiles: load failed', res?.error);
        }
      } catch (err) {
        logError('store', 'useProfiles: load exception', err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ─── saveProfiles() – zapisuje listę profili przez IPC
  const saveProfiles = useCallback(async (newProfiles) => {
    try {
      setProfiles(newProfiles);
      if (window.electronAPI?.saveProfiles) {
        await window.electronAPI.saveProfiles(newProfiles);
        logInfo('store', 'useProfiles: saved', newProfiles.length);
      }
      return { ok: true };
    } catch (err) {
      logError('store', 'useProfiles: save failed', err.message);
      return { ok: false, error: err.message };
    }
  }, []);

  // ─── addProfile() – dodaje nowy profil
  const addProfile = useCallback(async (profileData) => {
    try {
      const newProfiles = [...profiles, profileData];
      await saveProfiles(newProfiles);
      logInfo('store', 'useProfiles: added', profileData.id);
      return { ok: true, profiles: newProfiles };
    } catch (err) {
      logError('store', 'useProfiles: add failed', err.message);
      return { ok: false, error: err.message };
    }
  }, [profiles, saveProfiles]);

  // ─── updateProfile() – aktualizuje istniejący profil
  const updateProfile = useCallback(async (id, patch) => {
    try {
      const newProfiles = profiles.map(p => p.id === id ? { ...p, ...patch } : p);
      await saveProfiles(newProfiles);
      logInfo('store', 'useProfiles: updated', id);
      return { ok: true, profiles: newProfiles };
    } catch (err) {
      logError('store', 'useProfiles: update failed', err.message);
      return { ok: false, error: err.message };
    }
  }, [profiles, saveProfiles]);

  // ─── deleteProfile() – usuwa profil po ID
  const deleteProfile = useCallback(async (id) => {
    try {
      const newProfiles = profiles.filter(p => p.id !== id);
      await saveProfiles(newProfiles);
      logInfo('store', 'useProfiles: deleted', id);
      return { ok: true, profiles: newProfiles };
    } catch (err) {
      logError('store', 'useProfiles: delete failed', err.message);
      return { ok: false, error: err.message };
    }
  }, [profiles, saveProfiles]);

  // ─── toggleFavorite() – przełącza status ulubionego
  const toggleFavorite = useCallback(async (id) => {
    try {
      const profile = profiles.find(p => p.id === id);
      if (!profile) return { ok: false, error: 'NOT_FOUND' };
      const newProfiles = profiles.map(p =>
        p.id === id ? { ...p, favorite: !p.favorite } : p
      );
      await saveProfiles(newProfiles);
      logDebug('store', 'useProfiles: favorite toggled', id);
      return { ok: true, profiles: newProfiles, favorite: !profile.favorite };
    } catch (err) {
      logError('store', 'useProfiles: toggleFavorite failed', err.message);
      return { ok: false, error: err.message };
    }
  }, [profiles, saveProfiles]);

  return {
    profiles,
    loading,
    saveProfiles,
    addProfile,
    updateProfile,
    deleteProfile,
    toggleFavorite,
  };
}
