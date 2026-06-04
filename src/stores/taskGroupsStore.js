// =============================================================================
// FILE: taskGroupsStore.js
// PATH: src/stores/taskGroupsStore.js
// VERSION: 0.0.3
// PURPOSE: Zarządzanie grupami zadań (TaskGroup) — mapowanie profili WebView na wspólny panel zadań. Każda grupa to osobny panel TaskPanel współdzielony przez 1..N profili.
// FUNCTIONS: loadTaskGroups, saveTaskGroups, createTaskGroup, updateTaskGroup, deleteTaskGroup, getGroupForProfile, ensureDefaultGroup
// DEPENDS ON: persistence.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { getUserDataPath, readJsonFile, writeJsonFile } from './persistence.js';
import { logInfo, logError, logWarn } from '../utils/logger.js';

// ─── GROUPS_FILE() – ścieżka do pliku task_groups.json w userData
const GROUPS_FILE = () => {
  try {
    return getUserDataPath('task_groups.json');
  } catch (err) {
    logError('store', 'taskGroupsStore.GROUPS_FILE failed', err.message);
    return 'task_groups.json';
  }
};

// ─── loadTaskGroups() – ładuje wszystkie grupy zadań
//   @returns {Array<TaskGroup>}
export function loadTaskGroups() {
  try {
    const stored = readJsonFile(GROUPS_FILE(), null);
    if (Array.isArray(stored)) return stored;
    if (stored?.data && Array.isArray(stored.data)) return stored.data;
    return [];
  } catch (err) {
    logError('store', 'taskGroupsStore.loadTaskGroups failed', err.message);
    return [];
  }
}

// ─── saveTaskGroups() – zapisuje grupy zadań do pliku
//   @param {Array<TaskGroup>} groups
//   @returns {Array<TaskGroup>}
export function saveTaskGroups(groups) {
  try {
    if (!Array.isArray(groups)) throw new Error('GROUPS_MUST_BE_ARRAY');
    writeJsonFile(GROUPS_FILE(), { version: '0.0.3', data: groups });
    logInfo('store', 'taskGroupsStore.saveTaskGroups', groups.length);
    return groups;
  } catch (err) {
    logError('store', 'taskGroupsStore.saveTaskGroups failed', err.message);
    return groups;
  }
}

// ─── createTaskGroup() – tworzy nową grupę zadań
//   @param {Object} group – { id, name, profileIds[] }
//   @returns {Array<TaskGroup>} – zaktualizowana lista
export function createTaskGroup(group) {
  try {
    const list = loadTaskGroups();
    if (!group.id || !group.name) throw new Error('GROUP_MISSING_ID_OR_NAME');
    // Upewnij się, że profileIds jest tablicą
    const normalized = { ...group, profileIds: group.profileIds || [] };
    const next = [...list, normalized];
    logInfo('store', 'taskGroupsStore.createTaskGroup', group.id);
    return saveTaskGroups(next);
  } catch (err) {
    logError('store', 'taskGroupsStore.createTaskGroup failed', err.message);
    return loadTaskGroups();
  }
}

// ─── updateTaskGroup() – aktualizuje grupę (patch)
//   @param {string} id
//   @param {Object} patch
//   @returns {Array<TaskGroup>}
export function updateTaskGroup(id, patch) {
  try {
    const list = loadTaskGroups();
    const next = list.map(g => g.id === id ? { ...g, ...patch } : g);
    logInfo('store', 'taskGroupsStore.updateTaskGroup', id);
    return saveTaskGroups(next);
  } catch (err) {
    logError('store', 'taskGroupsStore.updateTaskGroup failed', err.message);
    return loadTaskGroups();
  }
}

// ─── deleteTaskGroup() – usuwa grupę zadań (zadania w tasksStore pozostają)
//   @param {string} id
//   @returns {Array<TaskGroup>}
export function deleteTaskGroup(id) {
  try {
    const next = loadTaskGroups().filter(g => g.id !== id);
    logInfo('store', 'taskGroupsStore.deleteTaskGroup', id);
    return saveTaskGroups(next);
  } catch (err) {
    logError('store', 'taskGroupsStore.deleteTaskGroup failed', err.message);
    return loadTaskGroups();
  }
}

// ─── getGroupForProfile() – zwraca grupę przypisaną do profilu
//   Jeśli profil nie ma grupy → zwraca null (caller tworzy domyślną)
//   @param {string} profileId
//   @returns {TaskGroup|null}
export function getGroupForProfile(profileId) {
  try {
    const groups = loadTaskGroups();
    return groups.find(g => g.profileIds.includes(profileId)) || null;
  } catch (err) {
    logError('store', 'taskGroupsStore.getGroupForProfile failed', err.message);
    return null;
  }
}

// ─── ensureDefaultGroup() – tworzy lub zwraca domyślną grupę dla profilu (1:1)
//   Wywoływane gdy profil nie ma jeszcze przypisanej grupy
//   @param {Object} profile – { id, name }
//   @returns {TaskGroup}
export function ensureDefaultGroup(profile) {
  try {
    const existing = getGroupForProfile(profile.id);
    if (existing) return existing;

    // Utwórz grupę 1:1 z profilem
    const newGroup = {
      id:         `tg_${profile.id}`,
      name:       profile.name,
      profileIds: [profile.id],
      createdAt:  new Date().toISOString(),
    };
    createTaskGroup(newGroup);
    logInfo('store', 'taskGroupsStore.ensureDefaultGroup created for', profile.id);
    return newGroup;
  } catch (err) {
    logError('store', 'taskGroupsStore.ensureDefaultGroup failed', err.message);
    return { id: `tg_${profile.id}`, name: profile.name, profileIds: [profile.id] };
  }
}