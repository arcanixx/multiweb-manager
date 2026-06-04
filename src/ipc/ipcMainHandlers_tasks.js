// =============================================================================
// FILE: ipcMainHandlers_tasks.js
// PATH: src/ipc/ipcMainHandlers_tasks.js
// VERSION: 0.0.3
// PURPOSE: IPC handlers dla zadań (TaskPanel) – CRUD z walidacją section↔status i mapowaniem na taskGroupId.
// FUNCTIONS: ipc:tasks:getAll, ipc:tasks:getAllGrouped, ipc:tasks:add, ipc:tasks:update, ipc:tasks:delete, ipc:tasks:saveSections
// DEPENDS ON: electron, tasksStore.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../constants/ipcChannels.js';
import {
  loadTasksSections,
  loadTasksByGroup,
  saveTasksForGroup,
  loadTasks,
  loadAllTasksGrouped,
  normalizeTask,
  resolveSection,
} from '../stores/tasksStore.js';
import { logError, logInfo } from '../utils/logger.js';

// ─── tasks:getAll – płaska lista zadań dla grupy lub wszystkich
//   payload opcjonalny: string = taskGroupId → płaska lista dla grupy; brak = wszystkie
ipcMain.handle(IPC_CHANNELS.TASKS.GET_ALL, async (_, payload) => {
  try {
    if (payload !== undefined && typeof payload !== 'string') throw new Error('INVALID_PAYLOAD');

    if (payload) {
      // Zadania dla konkretnej grupy – płaska lista z section i status
      const tasks = loadTasksByGroup(payload);
      return { ok: true, data: tasks };
    }
    // Wszystkie zadania – płaska lista
    return { ok: true, data: loadTasks() };
  } catch (err) {
    logError('ipc', 'tasks:getAll', err);
    return { ok: false, error: err.message };
  }
});

// ─── tasks:getAllGrouped – dla AggregatedTasks: { taskGroupId: { active, backlog, done } }
ipcMain.handle(IPC_CHANNELS.TASKS.GET_ALL_GROUPED, async () => {
  try {
    return { ok: true, data: loadAllTasksGrouped() };
  } catch (err) {
    logError('ipc', 'tasks:getAllGrouped', err);
    return { ok: false, error: err.message };
  }
});

// ─── tasks:add – dodaje nowe zadanie do grupy
//   payload: { taskGroupId, name, status?, section?, priority?, desc?, comment?, version?, pinned? }
//   section jest WYZNACZANA ze status (nie podawana jawnie)
ipcMain.handle(IPC_CHANNELS.TASKS.ADD, async (_, payload) => {
  try {
    if (!payload || !payload.taskGroupId) throw new Error('TASKS_GROUP_ID_REQUIRED');
    if (!payload.name || !String(payload.name).trim()) throw new Error('TASKS_NAME_REQUIRED');

    const { taskGroupId, ...taskData } = payload;
    const newTask = normalizeTask({
      id:        `task_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      ...taskData,
      name:      String(taskData.name).trim(),
      status:    taskData.status || 'todo',
      priority:  taskData.priority || 'C',
      pinned:    taskData.pinned || false,
      taskGroupId,
      createdAt: taskData.createdAt || new Date().toISOString(),
    });

    const sections = loadTasksSections(taskGroupId);
    sections[newTask.section] = [...(sections[newTask.section] || []), newTask];
    saveTasksForGroup(taskGroupId, { tasks: sections });
    logInfo('ipc', `tasks:add → group=${taskGroupId} id=${newTask.id}`);
    return { ok: true, data: newTask };
  } catch (err) {
    logError('ipc', 'tasks:add', err);
    return { ok: false, error: err.message };
  }
});

// ─── tasks:update – aktualizuje zadanie (patch)
//   payload: { id, patch: { ...fields } }
//   Zmiana status → automatycznie przenosi między sekcjami
ipcMain.handle(IPC_CHANNELS.TASKS.UPDATE, async (_, payload) => {
  try {
    if (!payload?.id || !payload?.patch) throw new Error('TASKS_UPDATE_INVALID_PAYLOAD');
    const { id, patch } = payload;

    // Znajdź zadanie we wszystkich grupach
    const allTasks = loadTasks();
    const existing = allTasks.find(t => t.id === id);
    if (!existing) throw new Error(`TASK_NOT_FOUND:${id}`);

    const taskGroupId = existing.taskGroupId;
    const sections    = loadTasksSections(taskGroupId);
    const oldSection  = existing.section;

    // Scal patch z istniejącym zadaniem i znormalizuj (section wyznaczana ze status)
    const merged  = normalizeTask({ ...existing, ...patch });
    const newSection = merged.section;

    // Usuń z starej sekcji
    sections[oldSection] = (sections[oldSection] || []).filter(t => t.id !== id);
    // Zapisz do docelowej sekcji
    sections[newSection] = [...(sections[newSection] || []), merged];

    saveTasksForGroup(taskGroupId, { tasks: sections });
    logInfo('ipc', `tasks:update → id=${id} section=${oldSection}→${newSection} status=${merged.status}`);
    return { ok: true, data: merged };
  } catch (err) {
    logError('ipc', 'tasks:update', err);
    return { ok: false, error: err.message };
  }
});

// ─── tasks:delete – usuwa zadanie
//   payload: { id }
ipcMain.handle(IPC_CHANNELS.TASKS.DELETE, async (_, payload) => {
  try {
    if (!payload?.id) throw new Error('TASKS_DELETE_ID_REQUIRED');
    const { id } = payload;

    const allTasks = loadTasks();
    const existing = allTasks.find(t => t.id === id);
    if (!existing) throw new Error(`TASK_NOT_FOUND:${id}`);

    const taskGroupId = existing.taskGroupId;
    const sections    = loadTasksSections(taskGroupId);
    for (const sec of ['active', 'backlog', 'done']) {
      sections[sec] = (sections[sec] || []).filter(t => t.id !== id);
    }
    saveTasksForGroup(taskGroupId, { tasks: sections });
    logInfo('ipc', `tasks:delete → id=${id}`);
    return { ok: true };
  } catch (err) {
    logError('ipc', 'tasks:delete', err);
    return { ok: false, error: err.message };
  }
});

// ─── tasks:saveSections – bulk save (legacy / backup restore)
//   payload: { taskGroupId, sections: { active, backlog, done } }
ipcMain.handle(IPC_CHANNELS.TASKS.SAVE_SECTIONS, async (_, payload) => {
  try {
    if (!payload?.taskGroupId || !payload?.sections) throw new Error('INVALID_PAYLOAD');
    const { taskGroupId, sections } = payload;
    if (typeof sections !== 'object') throw new Error('SECTIONS_MUST_BE_OBJECT');
    saveTasksForGroup(taskGroupId, { tasks: sections });
    return { ok: true };
  } catch (err) {
    logError('ipc', 'tasks:saveSections', err);
    return { ok: false, error: err.message };
  }
});