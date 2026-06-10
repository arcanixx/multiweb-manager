// =============================================================================
// FILE: useAggregatedGroups.js
// PATH: src/hooks/aggregated/useAggregatedGroups.js
// VERSION: 0.0.3
// PURPOSE: Hook React do zarządzania grupami zadań (TaskGroup) – CRUD + przypisanie profili przez IPC.
// FUNCTIONS: useTaskGroups
// DEPENDS ON: react, loggerRenderer.js, ipcChannels.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { logInfo, logError, logWarn } from '../../utils/loggerRenderer.js';
import { IPC_CHANNELS } from '../../constants/ipcChannels.js';

// ─── useTaskGroups() – zarządza grupami zadań
//   @returns {Object} – groups, loading, addGroup, updateGroup, deleteGroup,
//                       assignProfile, unassignProfile, ensureForProfile, reloadGroups
export function useTaskGroups() {
  const [groups,  setGroups]  = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── reload() – ładuje wszystkie grupy z backendu
  const reload = useCallback(async () => {
    try {
      setLoading(true);
      const res = await window.electronAPI.invoke(IPC_CHANNELS.TASK_GROUPS.GET_ALL);
      if (res?.ok) {
        setGroups(res.data || []);
        logInfo('tasks', 'useTaskGroups.reload', res.data?.length);
      } else {
        logError('tasks', 'useTaskGroups.reload failed', res?.error);
      }
    } catch (err) {
      logError('tasks', 'useTaskGroups.reload exception', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  // ─── ensureForProfile() – zwraca lub tworzy domyślną grupę 1:1 dla profilu
  //   Wywoływane przy otwarciu TaskPanel z kontekstu profilu
  //   @param {string} profileId
  //   @param {string} profileName
  //   @returns {Promise<TaskGroup|null>}
  const ensureForProfile = useCallback(async (profileId, profileName) => {
    try {
      const res = await window.electronAPI.invoke(IPC_CHANNELS.TASK_GROUPS.ENSURE_FOR_PROFILE, {
        profileId, profileName,
      });
      if (res?.ok) {
        await reload(); // odśwież listę (nowa grupa mogła zostać utworzona)
        return res.data;
      }
      logError('tasks', 'useTaskGroups.ensureForProfile failed', res?.error);
      return null;
    } catch (err) {
      logError('tasks', 'useTaskGroups.ensureForProfile exception', err.message);
      return null;
    }
  }, [reload]);

  // ─── addGroup() – tworzy nową grupę zadań
  //   @param {Object} groupData – { name, profileIds? }
  //   @returns {Promise<Object>}
  const addGroup = useCallback(async (groupData) => {
    try {
      const res = await window.electronAPI.invoke(IPC_CHANNELS.TASK_GROUPS.CREATE, groupData);
      if (res?.ok) {
        setGroups(res.data || []);
        logInfo('tasks', 'useTaskGroups.addGroup', groupData.name);
      } else {
        logError('tasks', 'useTaskGroups.addGroup failed', res?.error);
        logWarn('tasks', 'Nie można utworzyć grupy zadań');
      }
      return res;
    } catch (err) {
      logError('tasks', 'useTaskGroups.addGroup exception', err.message);
      return { ok: false, error: err.message };
    }
  }, []);

  // ─── updateGroup() – aktualizuje grupę
  //   @param {string} id
  //   @param {Object} patch
  //   @returns {Promise<Object>}
  const updateGroup = useCallback(async (id, patch) => {
    try {
      const res = await window.electronAPI.invoke(IPC_CHANNELS.TASK_GROUPS.UPDATE, { id, patch });
      if (res?.ok) {
        setGroups(res.data || []);
        logInfo('tasks', 'useTaskGroups.updateGroup', id);
      } else {
        logError('tasks', 'useTaskGroups.updateGroup failed', res?.error);
      }
      return res;
    } catch (err) {
      logError('tasks', 'useTaskGroups.updateGroup exception', err.message);
      return { ok: false, error: err.message };
    }
  }, []);

  // ─── deleteGroup() – usuwa grupę
  //   @param {string} id
  //   @returns {Promise<Object>}
  const deleteGroup = useCallback(async (id) => {
    try {
      const res = await window.electronAPI.invoke(IPC_CHANNELS.TASK_GROUPS.DELETE, { id });
      if (res?.ok) {
        setGroups(res.data || []);
        logInfo('tasks', 'useTaskGroups.deleteGroup', id);
      } else {
        logError('tasks', 'useTaskGroups.deleteGroup failed', res?.error);
      }
      return res;
    } catch (err) {
      logError('tasks', 'useTaskGroups.deleteGroup exception', err.message);
      return { ok: false, error: err.message };
    }
  }, []);

  // ─── assignProfile() – przypisuje profil do grupy (odłącza od poprzedniej)
  //   @param {string} groupId
  //   @param {string} profileId
  //   @returns {Promise<Object>}
  const assignProfile = useCallback(async (groupId, profileId) => {
    try {
      const res = await window.electronAPI.invoke(IPC_CHANNELS.TASK_GROUPS.ASSIGN_PROFILE, { groupId, profileId });
      if (res?.ok) {
        setGroups(res.data || []);
        logInfo('tasks', `useTaskGroups.assignProfile ${profileId} → ${groupId}`);
      } else {
        logError('tasks', 'useTaskGroups.assignProfile failed', res?.error);
      }
      return res;
    } catch (err) {
      logError('tasks', 'useTaskGroups.assignProfile exception', err.message);
      return { ok: false, error: err.message };
    }
  }, []);

  // ─── unassignProfile() – odłącza profil od grupy
  //   @param {string} profileId
  //   @returns {Promise<Object>}
  const unassignProfile = useCallback(async (profileId) => {
    try {
      const res = await window.electronAPI.invoke(IPC_CHANNELS.TASK_GROUPS.UNASSIGN_PROFILE, { profileId });
      if (res?.ok) {
        await reload();
        logInfo('tasks', 'useTaskGroups.unassignProfile', profileId);
      } else {
        logError('tasks', 'useTaskGroups.unassignProfile failed', res?.error);
      }
      return res;
    } catch (err) {
      logError('tasks', 'useTaskGroups.unassignProfile exception', err.message);
      return { ok: false, error: err.message };
    }
  }, [reload]);

  return {
    groups,
    loading,
    reloadGroups:    reload,
    ensureForProfile,
    addGroup,
    updateGroup,
    deleteGroup,
    assignProfile,
    unassignProfile,
  };
}
