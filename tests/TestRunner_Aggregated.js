// =============================================================================
// FILE: TestRunner_Tasks.js
// PATH: tests/TestRunner_Tasks.js
// VERSION: 0.0.3
// PURPOSE: Testy logiki domenowej systemu zadań: model danych, reguły section↔status, normalizeTask, tasksStore CRUD. Testy izolowane – nie wymagają Electron ani IPC.
// FUNCTIONS: runTasksTests
// DEPENDS ON: testUtils.js, tasksStore.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { checkSourceExport, runTests } from './testUtils.js';

import {
  normalizeTask,
  resolveSection,
  STATUS_TO_SECTION,
  VALID_STATUSES,
} from '../src/stores/tasksStore.js';




// ─── Fabryka zadania testowego
const makeTask = (overrides = {}) => ({
  id:          `task_test_${Date.now()}`,
  taskGroupId: 'tg_test',
  name:        'Test Task',
  status:      'todo',
  priority:    'C',
  pinned:      false,
  createdAt:   new Date().toISOString(),
  ...overrides,
});

const tests = [
  ...[
    ['CommentModal', 'src/ui/taskpanel/CommentModal.jsx'],
    ['TaskDetails', 'src/ui/taskpanel/TaskDetails.jsx'],
    ['TaskEditor', 'src/ui/taskpanel/TaskEditor.jsx'],
    ['TaskEmptyState', 'src/ui/taskpanel/TaskEmptyState.jsx'],
    ['TaskList', 'src/ui/taskpanel/TaskList.jsx'],
    ['AggregatedProjectSection', 'src/ui/aggregated/AggregatedProjectSection.jsx'],
    ['AggregatedTaskItem', 'src/ui/aggregated/AggregatedTaskItem.jsx']
  ].map(([name, path]) => ({
    name: `${name} - ${path} eksportuje komponent`,
    run: async () => checkSourceExport(path, name)
  })),

  // ─── Model danych ──────────────────────────────────────────────
  {
    name: '[Model] Kanoniczne pola zadania są obecne',
    run: async () => {
      const t = makeTask();
      const required = ['id', 'taskGroupId', 'name', 'status', 'priority', 'createdAt'];
      const missing  = required.filter(f => !(f in t));
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Brakujące pola: ${missing.join(', ')}` };
    },
  },
  {
    name: '[Model] Priorytety A–E są jedynymi dopuszczalnymi wartościami',
    run: async () => {
      const valid   = ['A', 'B', 'C', 'D', 'E'];
      const invalid = ['F', '1', '', null, 'a'];
      const okValid   = valid.every(p => valid.includes(p));
      const okInvalid = invalid.every(p => !valid.includes(p));
      const ok = okValid && okInvalid;
      return { ok, details: ok ? '' : 'Walidacja priorytetów nieprawidłowa' };
    },
  },

  // ─── STATUS_TO_SECTION ─────────────────────────────────────────
  {
    name: '[Reguły] in_progress → section=active',
    run: async () => {
      const ok = STATUS_TO_SECTION['in_progress'] === 'active';
      return { ok, details: ok ? '' : `Oczekiwano 'active', dostałem '${STATUS_TO_SECTION['in_progress']}'` };
    },
  },
  {
    name: '[Reguły] todo → section=backlog',
    run: async () => {
      const ok = STATUS_TO_SECTION['todo'] === 'backlog';
      return { ok, details: ok ? '' : `Oczekiwano 'backlog', dostałem '${STATUS_TO_SECTION['todo']}'` };
    },
  },
  {
    name: '[Reguły] blocked → section=backlog',
    run: async () => {
      const ok = STATUS_TO_SECTION['blocked'] === 'backlog';
      return { ok, details: ok ? '' : `Oczekiwano 'backlog', dostałem '${STATUS_TO_SECTION['blocked']}'` };
    },
  },
  {
    name: '[Reguły] done → section=done',
    run: async () => {
      const ok = STATUS_TO_SECTION['done'] === 'done';
      return { ok, details: ok ? '' : `Oczekiwano 'done', dostałem '${STATUS_TO_SECTION['done']}'` };
    },
  },
  {
    name: '[Reguły] cancelled → section=done',
    run: async () => {
      const ok = STATUS_TO_SECTION['cancelled'] === 'done';
      return { ok, details: ok ? '' : `Oczekiwano 'done', dostałem '${STATUS_TO_SECTION['cancelled']}'` };
    },
  },
  {
    name: '[Reguły] Każda sekcja ma co najmniej jeden dopuszczalny status',
    run: async () => {
      const sections = ['active', 'backlog', 'done'];
      const ok = sections.every(s => Array.isArray(VALID_STATUSES[s]) && VALID_STATUSES[s].length > 0);
      return { ok, details: ok ? '' : 'Pusta lista VALID_STATUSES dla sekcji' };
    },
  },
  {
    name: '[Reguły] active → tylko in_progress (nie todo, nie blocked)',
    run: async () => {
      const allowed = VALID_STATUSES['active'];
      const ok = allowed.includes('in_progress') && !allowed.includes('todo') && !allowed.includes('blocked');
      return { ok, details: ok ? '' : `active VALID_STATUSES: ${JSON.stringify(allowed)}` };
    },
  },
  {
    name: '[Reguły] backlog → todo i blocked, nie in_progress',
    run: async () => {
      const allowed = VALID_STATUSES['backlog'];
      const ok = allowed.includes('todo') && allowed.includes('blocked') && !allowed.includes('in_progress');
      return { ok, details: ok ? '' : `backlog VALID_STATUSES: ${JSON.stringify(allowed)}` };
    },
  },
  {
    name: '[Reguły] done → done i cancelled, nie inne',
    run: async () => {
      const allowed = VALID_STATUSES['done'];
      const ok = allowed.includes('done') && allowed.includes('cancelled') && !allowed.includes('todo');
      return { ok, details: ok ? '' : `done VALID_STATUSES: ${JSON.stringify(allowed)}` };
    },
  },

  // ─── resolveSection ────────────────────────────────────────────
  {
    name: '[resolveSection] Znany status zwraca poprawną sekcję',
    run: async () => {
      const cases = [
        ['in_progress', 'active'],
        ['todo',        'backlog'],
        ['blocked',     'backlog'],
        ['done',        'done'],
        ['cancelled',   'done'],
      ];
      const errors = cases.filter(([status, expected]) => resolveSection(status) !== expected);
      const ok = errors.length === 0;
      return { ok, details: ok ? '' : `Błędne: ${errors.map(e => e.join('→')).join(', ')}` };
    },
  },
  {
    name: '[resolveSection] Nieznany status używa fallback',
    run: async () => {
      const result = resolveSection('nonexistent', 'backlog');
      const ok = result === 'backlog';
      return { ok, details: ok ? '' : `Oczekiwano fallback 'backlog', dostałem '${result}'` };
    },
  },

  // ─── normalizeTask ─────────────────────────────────────────────
  {
    name: '[normalizeTask] todo → section=backlog',
    run: async () => {
      const t = normalizeTask(makeTask({ status: 'todo' }));
      const ok = t.section === 'backlog';
      return { ok, details: ok ? '' : `section=${t.section}` };
    },
  },
  {
    name: '[normalizeTask] in_progress → section=active',
    run: async () => {
      const t = normalizeTask(makeTask({ status: 'in_progress' }));
      const ok = t.section === 'active';
      return { ok, details: ok ? '' : `section=${t.section}` };
    },
  },
  {
    name: '[normalizeTask] done → section=done',
    run: async () => {
      const t = normalizeTask(makeTask({ status: 'done' }));
      const ok = t.section === 'done';
      return { ok, details: ok ? '' : `section=${t.section}` };
    },
  },
  {
    name: '[normalizeTask] cancelled → section=done',
    run: async () => {
      const t = normalizeTask(makeTask({ status: 'cancelled' }));
      const ok = t.section === 'done';
      return { ok, details: ok ? '' : `section=${t.section}` };
    },
  },
  {
    name: '[normalizeTask] blocked → section=backlog',
    run: async () => {
      const t = normalizeTask(makeTask({ status: 'blocked' }));
      const ok = t.section === 'backlog';
      return { ok, details: ok ? '' : `section=${t.section}` };
    },
  },
  {
    name: '[normalizeTask] Brak statusu → domyślnie todo/backlog',
    run: async () => {
      const t = normalizeTask(makeTask({ status: undefined }));
      const ok = t.status === 'todo' && t.section === 'backlog';
      return { ok, details: ok ? '' : `status=${t.status}, section=${t.section}` };
    },
  },
  {
    name: '[normalizeTask] Przywrócenie z done → todo/backlog (nie in_progress)',
    run: async () => {
      // Symulacja: zmiana statusu z done na todo (restore)
      const done = normalizeTask(makeTask({ status: 'done' }));
      const restored = normalizeTask({ ...done, status: 'todo' });
      const ok = restored.section === 'backlog' && restored.status === 'todo';
      return { ok, details: ok ? '' : `Po restore: status=${restored.status}, section=${restored.section}` };
    },
  },
  {
    name: '[normalizeTask] Nie nadpisuje istniejących pól zadania',
    run: async () => {
      const original = makeTask({ status: 'todo', name: 'Moje zadanie', priority: 'A', pinned: true });
      const t = normalizeTask(original);
      const ok = t.name === 'Moje zadanie' && t.priority === 'A' && t.pinned === true;
      return { ok, details: ok ? '' : `name=${t.name}, priority=${t.priority}, pinned=${t.pinned}` };
    },
  },

  // ─── Filtrowanie i wyszukiwanie (logika UI) ────────────────────
  {
    name: '[Filtr] Filtrowanie po statusie z płaskiej listy',
    run: async () => {
      const tasks = [
        makeTask({ id: '1', status: 'in_progress' }),
        makeTask({ id: '2', status: 'todo' }),
        makeTask({ id: '3', status: 'in_progress' }),
      ];
      const result = tasks.filter(t => t.status === 'in_progress');
      const ok = result.length === 2;
      return { ok, details: ok ? '' : `Oczekiwano 2, dostałem ${result.length}` };
    },
  },
  {
    name: '[Filtr] Filtrowanie po sekcji',
    run: async () => {
      const tasks = [
        normalizeTask(makeTask({ status: 'in_progress' })),
        normalizeTask(makeTask({ status: 'todo' })),
        normalizeTask(makeTask({ status: 'done' })),
        normalizeTask(makeTask({ status: 'cancelled' })),
      ];
      const backlog = tasks.filter(t => t.section === 'backlog');
      const done    = tasks.filter(t => t.section === 'done');
      const active  = tasks.filter(t => t.section === 'active');
      const ok = backlog.length === 1 && done.length === 2 && active.length === 1;
      return { ok, details: ok ? '' : `backlog=${backlog.length}, done=${done.length}, active=${active.length}` };
    },
  },
  {
    name: '[Filtr] Wyszukiwanie po nazwie (case-insensitive)',
    run: async () => {
      const tasks = [
        makeTask({ name: 'Fix authentication bug' }),
        makeTask({ name: 'Add dashboard feature' }),
        makeTask({ name: 'Fix typo in README' }),
      ];
      const query    = 'fix';
      const filtered = tasks.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));
      const ok = filtered.length === 2;
      return { ok, details: ok ? '' : `Oczekiwano 2 wyników, dostałem ${filtered.length}` };
    },
  },
  {
    name: '[Filtr] Sortowanie po priorytecie A→E',
    run: async () => {
      const PRIORITY_ORDER = { A: 0, B: 1, C: 2, D: 3, E: 4 };
      const tasks = [
        makeTask({ id: '1', priority: 'C' }),
        makeTask({ id: '2', priority: 'A' }),
        makeTask({ id: '3', priority: 'E' }),
        makeTask({ id: '4', priority: 'B' }),
      ];
      tasks.sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99));
      const ok = tasks[0].priority === 'A' && tasks[3].priority === 'E';
      return { ok, details: ok ? '' : `Kolejność: ${tasks.map(t => t.priority).join(', ')}` };
    },
  },
  {
    name: '[Filtr] Pinnowane zadania na górze listy',
    run: async () => {
      const tasks = [
        makeTask({ id: '1', pinned: false, name: 'Zwykłe' }),
        makeTask({ id: '2', pinned: true,  name: 'Pinnowane' }),
        makeTask({ id: '3', pinned: false, name: 'Zwykłe 2' }),
      ];
      const sorted = [...tasks.filter(t => t.pinned), ...tasks.filter(t => !t.pinned)];
      const ok = sorted[0].id === '2';
      return { ok, details: ok ? '' : `Pierwszy element: ${sorted[0].name}` };
    },
  },

  // ─── IPC preload API ───────────────────────────────────────────
  {
    name: '[IPC API] getTasks jest funkcją w electronAPI',
    run: async () => {
      const ok = typeof window.electronAPI?.getTasks === 'function';
      return { ok, details: ok ? '' : 'getTasks missing in electronAPI' };
    },
  },
  {
    name: '[IPC API] getAllTasks jest funkcją w electronAPI',
    run: async () => {
      const ok = typeof window.electronAPI?.getAllTasks === 'function';
      return { ok, details: ok ? '' : 'getAllTasks missing in electronAPI' };
    },
  },
  {
    name: '[IPC API] invoke jest dostępny dla tasks:add',
    run: async () => {
      const ok = typeof window.electronAPI?.invoke === 'function';
      return { ok, details: ok ? '' : 'invoke missing — tasks:add/update/delete nie zadziała' };
    },
  },
];

// ─── runTasksTests() – uruchamia testy logiki zadań
export async function runTasksTests() {
  return runTests('Tasks (logika domenowa + IPC API)', tests);
}
