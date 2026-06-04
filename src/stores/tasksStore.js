// =============================================================================
// FILE: tasksStore.js
// PATH: src/stores/tasksStore.js
// VERSION: 0.0.3
// PURPOSE: Zadania per TaskGroup (TaskPanel, AggregatedTasks). Jeden plik JSON per taskGroupId. Zawiera logikę mapowania section↔status.
// FUNCTIONS: resolveSection, normalizeTask, loadTasksSections, loadTasksByGroup, saveTasksForGroup, loadAllTasksGrouped, loadTasks
// DEPENDS ON: fs, persistence.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import fs from 'fs';
import { getUserDataPath, readJsonFile, writeJsonFile } from './persistence.js';
import { logInfo, logError, logWarn } from '../utils/logger.js';

// =============================================================================
// MAPOWANIE SECTION ↔ STATUS
// Reguły domenowe:
//   section='active'  → status może być tylko 'in_progress'
//   section='backlog'  → status: 'todo' | 'blocked'
//   section='done'     → status: 'done' | 'cancelled'
//
//   Zmiana statusu na done/cancelled → section='done'
//   Zmiana statusu na in_progress   → section='active'
//   Zmiana statusu na todo/blocked  → section='backlog'
// =============================================================================

// ─── VALID_STATUSES – dozwolone statusy w każdej sekcji
export const VALID_STATUSES = {
  active:  ['in_progress'],
  backlog: ['todo', 'blocked'],
  done:    ['done', 'cancelled'],
};

// ─── STATUS_TO_SECTION – mapowanie statusu na sekcję
export const STATUS_TO_SECTION = {
  in_progress: 'active',
  todo:        'backlog',
  blocked:     'backlog',
  done:        'done',
  cancelled:   'done',
};

// ─── resolveSection() – wyznacza sekcję na podstawie statusu
//   @param {string} status
//   @param {string} fallbackSection – używana gdy status nieznany
//   @returns {string} section
export function resolveSection(status, fallbackSection = 'backlog') {
  return STATUS_TO_SECTION[status] || fallbackSection;
}

// ─── normalizeTask() – normalizuje zadanie: zapewnia spójność section↔status
//   @param {Object} task
//   @returns {Object} – znormalizowane zadanie
export function normalizeTask(task) {
  const status = task.status || 'todo';
  const section = resolveSection(status, task.section || 'backlog');
  return { ...task, status, section };
}

// =============================================================================
// STORE I/O
// =============================================================================

// ─── TASKS_DIR() – ścieżka do folderu z plikami zadań
const TASKS_DIR = () => {
  try {
    return getUserDataPath('tasks');
  } catch (err) {
    logError('tasks', 'tasksStore.TASKS_DIR failed', err.message);
    return 'tasks';
  }
};

// ─── taskFile() – plik JSON dla grupy zadań (taskGroupId jako nazwa pliku)
//   @param {string} taskGroupId
//   @returns {string}
function taskFile(taskGroupId) {
  const safe = String(taskGroupId || 'default').replace(/[^\w.-]+/g, '_');
  return `${TASKS_DIR()}/${safe}.json`;
}

const EMPTY_SECTIONS = () => ({ active: [], backlog: [], done: [] });

// ─── loadTasksSections() – ładuje sekcje zadań dla grupy
//   @param {string} taskGroupId
//   @returns {{ active: Task[], backlog: Task[], done: Task[] }}
export function loadTasksSections(taskGroupId) {
  try {
    const data = readJsonFile(taskFile(taskGroupId), null);
    if (!data?.tasks) return EMPTY_SECTIONS();
    const t = data.tasks;
    if (Array.isArray(t)) {
      // Legacy: płaska tablica → wszystko do backlog (todo)
      return { active: [], backlog: t.map(x => normalizeTask({ ...x, status: x.status || 'todo' })), done: [] };
    }
    // Normalizuj każde zadanie przy odczycie
    return {
      active:  (t.active  || []).map(x => normalizeTask(x)),
      backlog: (t.backlog || []).map(x => normalizeTask(x)),
      done:    (t.done    || []).map(x => normalizeTask(x)),
    };
  } catch (err) {
    logError('tasks', 'tasksStore.loadTasksSections failed', err.message);
    return EMPTY_SECTIONS();
  }
}

// ─── loadTasksByGroup() – płaska lista zadań dla grupy z polem section i status
//   @param {string} taskGroupId
//   @returns {Task[]}
export function loadTasksByGroup(taskGroupId) {
  const sections = loadTasksSections(taskGroupId);
  return [
    ...sections.active.map(t => ({ ...t, section: 'active' })),
    ...sections.backlog.map(t => ({ ...t, section: 'backlog' })),
    ...sections.done.map(t => ({ ...t, section: 'done' })),
  ];
}

// ─── saveTasksForGroup() – zapisuje sekcje zadań dla grupy
//   @param {string} taskGroupId
//   @param {{ tasks: { active, backlog, done } | Task[] }} payload
//   @returns {Object}
export function saveTasksForGroup(taskGroupId, payload) {
  try {
    const dir = TASKS_DIR();
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const body = payload?.tasks && typeof payload.tasks === 'object'
      ? payload
      : { tasks: payload };

    const filePath = taskFile(taskGroupId);
    const tempPath = filePath + '.tmp';
    const data = JSON.stringify({ version: '0.0.3', taskGroupId, ...body }, null, 2);
    fs.writeFileSync(tempPath, data, 'utf8');
    fs.renameSync(tempPath, filePath);
    logInfo('tasks', 'tasksStore.saveTasksForGroup', taskGroupId);
    return body;
  } catch (err) {
    logError('tasks', 'tasksStore.saveTasksForGroup failed', err.message);
    return payload;
  }
}

// ─── loadAllTasksGrouped() – wszystkie zadania pogrupowane per taskGroupId
//   Używane przez AggregatedTasks (widok zbiorczy)
//   @returns {{ [taskGroupId]: { active, backlog, done } }}
export function loadAllTasksGrouped() {
  try {
    const dir = TASKS_DIR();
    if (!fs.existsSync(dir)) return {};
    const out = {};
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.json')) continue;
      const groupId = file.replace(/\.json$/, '');
      out[groupId] = loadTasksSections(groupId);
    }
    return out;
  } catch (err) {
    logError('tasks', 'tasksStore.loadAllTasksGrouped failed', err.message);
    return {};
  }
}

// ─── loadTasks() – płaska lista WSZYSTKICH zadań z metadanymi
//   @returns {Task[]} – każde zadanie ma taskGroupId i section
export function loadTasks() {
  try {
    const grouped = loadAllTasksGrouped();
    const flat = [];
    for (const [taskGroupId, sections] of Object.entries(grouped)) {
      for (const section of ['active', 'backlog', 'done']) {
        for (const task of sections[section] || []) {
          flat.push({ ...task, taskGroupId, section });
        }
      }
    }
    logInfo('tasks', 'tasksStore.loadTasks', flat.length);
    return flat;
  } catch (err) {
    logError('tasks', 'tasksStore.loadTasks failed', err.message);
    return [];
  }
}

// Backward-compat aliasy (używane w starym kodzie przez projectName)
export const loadTasksSectionsLegacy = loadTasksSections;
export const saveTasksForProject     = saveTasksForGroup;
export const loadTasksByProject      = loadTasksByGroup;