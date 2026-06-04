// =============================================================================
// FILE: ipcMainHandlers_aggregatedTasks.js
// PATH: src/ipc/ipcMainHandlers_aggregatedTasks.js
// VERSION: 0.0.3
// PURPOSE: IPC handlers dla widoku zbiorczego zadań (AggregatedTasks). Łączy zadania z grupami (TaskGroup) i profilami.
// FUNCTIONS: ipc:aggregatedTasks:getAll, ipc:aggregatedTasks:filter, ipc:aggregatedTasks:sort
// DEPENDS ON: electron, tasksStore.js, taskGroupsStore.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../constants/ipcChannels.js';
import { loadTasks } from '../stores/tasksStore.js';
import { loadTaskGroups } from '../stores/taskGroupsStore.js';
import { logError } from '../utils/logger.js';

// ─── enrich() – uzupełnia zadania o nazwę grupy (zamiast projectName)
function enrich(tasks, groups) {
  return tasks.map(t => {
    const group = groups.find(g => g.id === t.taskGroupId);
    return {
      ...t,
      groupName: group ? group.name : (t.taskGroupId || 'Bez grupy'),
    };
  });
}

// ─── aggregatedTasks:getAll – wszystkie zadania z groupName
ipcMain.handle(IPC_CHANNELS.AGGREGATED_TASKS.GET_ALL, async () => {
  try {
    const tasks  = loadTasks();
    const groups = loadTaskGroups();
    return { ok: true, data: enrich(tasks, groups) };
  } catch (err) {
    logError('ipc', 'aggregatedTasks:getAll failed', err);
    return { ok: false, error: err.message };
  }
});

// ─── aggregatedTasks:filter – filtruje po status i/lub priority
//   payload: { status?: string, priority?: string, section?: string }
ipcMain.handle(IPC_CHANNELS.AGGREGATED_TASKS.FILTER, async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'object') throw new Error('INVALID_PAYLOAD');
    const { status, priority, section } = payload;
    const groups = loadTaskGroups();
    let filtered = loadTasks();
    if (status)   filtered = filtered.filter(t => t.status === status);
    if (priority) filtered = filtered.filter(t => t.priority === priority);
    if (section)  filtered = filtered.filter(t => t.section === section);
    return { ok: true, data: enrich(filtered, groups) };
  } catch (err) {
    logError('ipc', 'aggregatedTasks:filter failed', err);
    return { ok: false, error: err.message };
  }
});

// ─── aggregatedTasks:sort – sortuje po priority lub date
//   payload: { by: 'priority' | 'date' | 'status' }
ipcMain.handle(IPC_CHANNELS.AGGREGATED_TASKS.SORT, async (_, payload) => {
  try {
    if (!payload?.by) throw new Error('INVALID_PAYLOAD');
    const groups   = loadTaskGroups();
    const enriched = enrich(loadTasks(), groups);
    const PRIORITY_ORDER = { A: 0, B: 1, C: 2, D: 3, E: 4 };
    if (payload.by === 'priority') {
      enriched.sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99));
    } else if (payload.by === 'date') {
      enriched.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (payload.by === 'status') {
      const STATUS_ORDER = { in_progress: 0, todo: 1, blocked: 2, done: 3, cancelled: 4 };
      enriched.sort((a, b) => (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99));
    }
    return { ok: true, data: enriched };
  } catch (err) {
    logError('ipc', 'aggregatedTasks:sort failed', err);
    return { ok: false, error: err.message };
  }
});
