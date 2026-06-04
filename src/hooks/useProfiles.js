// =============================================================================
// FILE: useProfiles.js
// PATH: src/hooks/useProfiles.js
// VERSION: 0.0.3
// PURPOSE: Hook React do zarządzania profilami WebView – CRUD, favorite, persistencja przez IPC (granularne kanały profiles:create/update/delete).
// FUNCTIONS: useProfiles
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useCallback, useEffect } from 'react';
import { logInfo, logError, logWarn, logDebug } from '../utils/loggerRenderer.js';

// ─── useProfiles() – hook do zarządzania profilami z persistencją przez IPC
// @returns {Object} – profiles, loading, addProfile, updateProfile, deleteProfile, toggleFavorite, reloadProfiles
export function useProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── reloadProfiles() – ładuje profile z backendu (używane przy inicjalizacji i po operacjach)
  const reloadProfiles = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    reloadProfiles();
  }, [reloadProfiles]);

  // ─── addProfile() – tworzy nowy profil przez IPC (profiles:create)
  const addProfile = useCallback(async (profileData) => {
    try {
      const res = await window.electronAPI.createProfile(profileData);
      if (res?.ok) {
        setProfiles(res.data || []);
        logInfo('store', 'useProfiles: added', profileData.id);
      } else {
        logError('store', 'useProfiles: add failed', res?.error);
      }
      return res;
    } catch (err) {
      logError('store', 'useProfiles: add exception', err.message);
      return { ok: false, error: err.message };
    }
  }, []);

  // ─── updateProfile() – aktualizuje istniejący profil przez IPC (profiles:update)
  const updateProfile = useCallback(async (id, patch) => {
    try {
      const res = await window.electronAPI.updateProfile(id, patch);
      if (res?.ok) {
        setProfiles(res.data || []);
        logInfo('store', 'useProfiles: updated', id);
      } else {
        logError('store', 'useProfiles: update failed', res?.error);
      }
      return res;
    } catch (err) {
      logError('store', 'useProfiles: update exception', err.message);
      return { ok: false, error: err.message };
    }
  }, []);

  // ─── deleteProfile() – usuwa profil przez IPC (profiles:delete)
  const deleteProfile = useCallback(async (id) => {
    try {
      const res = await window.electronAPI.deleteProfile(id);
      if (res?.ok) {
        setProfiles(res.data || []);
        logInfo('store', 'useProfiles: deleted', id);
      } else {
        logError('store', 'useProfiles: delete failed', res?.error);
      }
      return res;
    } catch (err) {
      logError('store', 'useProfiles: delete exception', err.message);
      return { ok: false, error: err.message };
    }
  }, []);

  // ─── toggleFavorite() – przełącza status ulubionego przez IPC (profiles:update)
  const toggleFavorite = useCallback(async (id) => {
    try {
      const profile = profiles.find(p => p.id === id);
      if (!profile) return { ok: false, error: 'NOT_FOUND' };
      const res = await window.electronAPI.updateProfile(id, { favorite: !profile.favorite });
      if (res?.ok) {
        setProfiles(res.data || []);
        logDebug('store', 'useProfiles: favorite toggled', id);
        return { ok: true, favorite: !profile.favorite };
      } else {
        logError('store', 'useProfiles: toggleFavorite failed', res?.error);
        return res;
      }
    } catch (err) {
      logError('store', 'useProfiles: toggleFavorite exception', err.message);
      return { ok: false, error: err.message };
    }
  }, [profiles]);

  return {
    profiles,
    loading,
    reloadProfiles,
    addProfile,
    updateProfile,
    deleteProfile,
    toggleFavorite,
  };
}
