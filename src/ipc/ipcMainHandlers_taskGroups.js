// =============================================================================
// FILE: ipcMainHandlers_taskGroups.js
// PATH: src/ipc/ipcMainHandlers_taskGroups.js
// VERSION: 0.0.3
// PURPOSE: IPC handlers dla grup zadań (TaskGroup) — CRUD + przypisanie profili. Mapuje profile WebView na wspólne panele zadań.
// FUNCTIONS: -
// DEPENDS ON: electron, ipcChannels.js, taskGroupsStore.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../constants/ipcChannels.js';
import {
  loadTaskGroups,
  createTaskGroup,
  updateTaskGroup,
  deleteTaskGroup,
  getGroupForProfile,
  ensureDefaultGroup,
} from '../stores/taskGroupsStore.js';
import { logError, logInfo } from '../utils/logger.js';

// ─── taskGroups:getAll – wszystkie grupy zadań
ipcMain.handle(IPC_CHANNELS.TASK_GROUPS.GET_ALL, async () => {
  try {
    return { ok: true, data: loadTaskGroups() };
  } catch (err) {
    logError('ipc', 'taskGroups:getAll', err);
    return { ok: false, error: err.message };
  }
});

// ─── taskGroups:create – tworzy nową grupę zadań
//   payload: { id?, name, profileIds?: string[] }
ipcMain.handle(IPC_CHANNELS.TASK_GROUPS.CREATE, async (_, payload) => {
  try {
    if (!payload || !payload.name) throw new Error('GROUP_NAME_REQUIRED');
    const group = {
      id:         payload.id || `tg_${Date.now()}`,
      name:       payload.name.trim(),
      profileIds: Array.isArray(payload.profileIds) ? payload.profileIds : [],
      createdAt:  new Date().toISOString(),
    };
    const updated = createTaskGroup(group);
    logInfo('ipc', 'taskGroups:create', group.id);
    return { ok: true, data: updated };
  } catch (err) {
    logError('ipc', 'taskGroups:create', err);
    return { ok: false, error: err.message };
  }
});

// ─── taskGroups:update – aktualizuje grupę (patch)
//   payload: { id, patch: { name?, profileIds? } }
ipcMain.handle(IPC_CHANNELS.TASK_GROUPS.UPDATE, async (_, payload) => {
  try {
    if (!payload?.id || !payload?.patch) throw new Error('GROUP_UPDATE_INVALID_PAYLOAD');
    const updated = updateTaskGroup(payload.id, payload.patch);
    logInfo('ipc', 'taskGroups:update', payload.id);
    return { ok: true, data: updated };
  } catch (err) {
    logError('ipc', 'taskGroups:update', err);
    return { ok: false, error: err.message };
  }
});

// ─── taskGroups:delete – usuwa grupę (zadania pozostają w tasksStore)
//   payload: { id }
ipcMain.handle(IPC_CHANNELS.TASK_GROUPS.DELETE, async (_, payload) => {
  try {
    if (!payload?.id) throw new Error('GROUP_ID_REQUIRED');
    const updated = deleteTaskGroup(payload.id);
    logInfo('ipc', 'taskGroups:delete', payload.id);
    return { ok: true, data: updated };
  } catch (err) {
    logError('ipc', 'taskGroups:delete', err);
    return { ok: false, error: err.message };
  }
});

// ─── taskGroups:getForProfile – zwraca grupę dla profilu lub null
//   payload: { profileId }
ipcMain.handle(IPC_CHANNELS.TASK_GROUPS.GET_FOR_PROFILE, async (_, payload) => {
  try {
    if (!payload?.profileId) throw new Error('PROFILE_ID_REQUIRED');
    const group = getGroupForProfile(payload.profileId);
    return { ok: true, data: group };
  } catch (err) {
    logError('ipc', 'taskGroups:getForProfile', err);
    return { ok: false, error: err.message };
  }
});

// ─── taskGroups:ensureForProfile – zwraca lub tworzy domyślną grupę 1:1 dla profilu
//   payload: { profileId, profileName }
//   Wywoływane automatycznie przy otwarciu TaskPanel
ipcMain.handle(IPC_CHANNELS.TASK_GROUPS.ENSURE_FOR_PROFILE, async (_, payload) => {
  try {
    if (!payload?.profileId) throw new Error('PROFILE_ID_REQUIRED');
    const group = ensureDefaultGroup({
      id:   payload.profileId,
      name: payload.profileName || payload.profileId,
    });
    logInfo('ipc', 'taskGroups:ensureForProfile', payload.profileId, '→', group.id);
    return { ok: true, data: group };
  } catch (err) {
    logError('ipc', 'taskGroups:ensureForProfile', err);
    return { ok: false, error: err.message };
  }
});

// ─── taskGroups:assignProfile – dodaje profil do istniejącej grupy
//   payload: { groupId, profileId }
//   Przy przypisaniu profil jest usuwany z poprzedniej grupy (jeśli miał)
ipcMain.handle(IPC_CHANNELS.TASK_GROUPS.ASSIGN_PROFILE, async (_, payload) => {
  try {
    if (!payload?.groupId || !payload?.profileId) throw new Error('GROUP_ID_AND_PROFILE_ID_REQUIRED');
    const { groupId, profileId } = payload;
    const groups = loadTaskGroups();

    // Usuń profil z poprzedniej grupy (jeśli istnieje)
    const prevGroup = groups.find(g => g.profileIds.includes(profileId) && g.id !== groupId);
    if (prevGroup) {
      updateTaskGroup(prevGroup.id, {
        profileIds: prevGroup.profileIds.filter(id => id !== profileId),
      });
    }

    // Dodaj profil do nowej grupy
    const target = groups.find(g => g.id === groupId);
    if (!target) throw new Error(`GROUP_NOT_FOUND:${groupId}`);
    const updated = updateTaskGroup(groupId, {
      profileIds: [...new Set([...target.profileIds, profileId])],
    });
    logInfo('ipc', `taskGroups:assignProfile profileId=${profileId} → groupId=${groupId}`);
    return { ok: true, data: updated };
  } catch (err) {
    logError('ipc', 'taskGroups:assignProfile', err);
    return { ok: false, error: err.message };
  }
});

// ─── taskGroups:unassignProfile – odłącza profil od grupy (wraca do braku grupy)
//   payload: { profileId }
ipcMain.handle(IPC_CHANNELS.TASK_GROUPS.UNASSIGN_PROFILE, async (_, payload) => {
  try {
    if (!payload?.profileId) throw new Error('PROFILE_ID_REQUIRED');
    const { profileId } = payload;
    const group = getGroupForProfile(profileId);
    if (!group) return { ok: true, data: null }; // już brak przypisania

    const updated = updateTaskGroup(group.id, {
      profileIds: group.profileIds.filter(id => id !== profileId),
    });
    logInfo('ipc', 'taskGroups:unassignProfile', profileId);
    return { ok: true, data: updated };
  } catch (err) {
    logError('ipc', 'taskGroups:unassignProfile', err);
    return { ok: false, error: err.message };
  }
});