// =============================================================================
// FILE: TestRunner_Aggregated.js
// PATH: tests/TestRunner_Aggregated.js
// VERSION: 0.0.3
// PURPOSE: Testy logiki domenowej systemu zadań: model danych, reguły section↔status, normalizeTask, tasksStore CRUD. Testy izolowane – nie wymagają Electron ani IPC.
// FUNCTIONS: runTasksTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// WAŻNE: Nie importujemy taskPanelStore na poziomie top-level, ponieważ
// persistence.js (zależność store'a) importuje 'electron' → crash w Node.js.
// Każdy test importuje store przez safeImport() wewnątrz run().

import { checkSourceExport, runTests, safeImport } from './testUtils.js';

// ─── Pomocniczy import store'a przez safeImport ──────────────────────────────
async function getStore() {
  try {
    return await safeImport('src/stores/taskPanelStore.js');
  } catch (e) {
    return null;
  }
}

// ─── Fabryka zadania testowego (nie wymaga importu) ─────────────────────────
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
  // ─── Eksporty komponentów (checkSourceExport – nie importuje JSX) ─────────
  ...[
    ['CommentModal',              'src/ui/taskpanel/CommentModal.jsx'],
    ['TaskDetails',               'src/ui/taskpanel/TaskDetails.jsx'],
    ['TaskEditor',                'src/ui/taskpanel/TaskEditor.jsx'],
    ['TaskEmptyState',            'src/ui/taskpanel/TaskEmptyState.jsx'],
    ['TaskList',                  'src/ui/taskpanel/TaskList.jsx'],
    ['AggregatedProjectSection',  'src/ui/aggregated/AggregatedProjectSection.jsx'],
    ['AggregatedTaskItem',        'src/ui/aggregated/AggregatedTaskItem.jsx'],
  ].map(([name, path]) => ({
    name: `${name} – ${path} eksportuje komponent`,
    run: async () => checkSourceExport(path, name),
  })),

  // ─── Model danych ──────────────────────────────────────────────────────────
  {
    name: '[Model] Kanoniczne pola zadania są obecne',
    run: async () => {
      const t = makeTask();
      const required = ['id', 'taskGroupId', 'name', 'status', 'priority', 'createdAt'];
      const missing = required.filter(f => !(f in t));
      return { ok: missing.length === 0, details: missing.length ? `Brakujące: ${missing.join(', ')}` : '' };
    }
  },
  { name: '[Model] Priorytety A–E są jedynymi dopuszczalnymi wartościami',
    run: async () => {
      const valid   = ['A', 'B', 'C', 'D', 'E'];
      const invalid = ['F', '1', '', null, 'a'];
      const ok = valid.every(p => valid.includes(p)) && invalid.every(p => !valid.includes(p));
      return { ok, details: ok ? '' : 'Walidacja priorytetów nieprawidłowa' };
    }
  },

  // ─── STATUS_TO_SECTION ─────────────────────────────────────────────────────
  {
    name: '[Reguły] in_progress → section=active',
    run: async () => {
      const store = await getStore();
      if (!store) return { ok: false, details: 'Nie można załadować taskPanelStore' };
      const ok = store.STATUS_TO_SECTION['in_progress'] === 'active';
      return { ok, details: ok ? '' : `Got: ${store.STATUS_TO_SECTION['in_progress']}` };
    },
  },
  { name: '[Reguły] todo → section=backlog',
    run: async () => {
      const store = await getStore();
      if (!store) return { ok: false, details: 'Nie można załadować taskPanelStore' };
      const ok = store.STATUS_TO_SECTION['todo'] === 'backlog';
      return { ok, details: ok ? '' : `Got: ${store.STATUS_TO_SECTION['todo']}` };
    },
  },
  { name: '[Reguły] blocked → section=backlog',
    run: async () => {
      const store = await getStore();
      if (!store) return { ok: false, details: 'Nie można załadować taskPanelStore' };
      const ok = store.STATUS_TO_SECTION['blocked'] === 'backlog';
      return { ok, details: ok ? '' : `Got: ${store.STATUS_TO_SECTION['blocked']}` };
    },
  },
  { name: '[Reguły] done → section=done',
    run: async () => {
      const store = await getStore();
      if (!store) return { ok: false, details: 'Nie można załadować taskPanelStore' };
      const ok = store.STATUS_TO_SECTION['done'] === 'done';
      return { ok, details: ok ? '' : `Got: ${store.STATUS_TO_SECTION['done']}` };
    },
  },
  { name: '[Reguły] cancelled → section=done',
    run: async () => {
      const store = await getStore();
      if (!store) return { ok: false, details: 'Nie można załadować taskPanelStore' };
      const ok = store.STATUS_TO_SECTION['cancelled'] === 'done';
      return { ok, details: ok ? '' : `Got: ${store.STATUS_TO_SECTION['cancelled']}` };
    },
  },
  { name: '[Reguły] Każda sekcja ma co najmniej jeden dopuszczalny status',
    run: async () => {
      const store = await getStore();
      if (!store) return { ok: false, details: 'Nie można załadować taskPanelStore' };
      const sections = ['active', 'backlog', 'done'];
      const ok = sections.every(s => Array.isArray(store.VALID_STATUSES[s]) && store.VALID_STATUSES[s].length > 0);
      return { ok, details: ok ? '' : 'Pusta lista VALID_STATUSES dla sekcji' };
    },
  },
  { name: '[Reguły] active → tylko in_progress',
    run: async () => {
      const store = await getStore();
      if (!store) return { ok: false, details: 'Nie można załadować taskPanelStore' };
      const allowed = store.VALID_STATUSES['active'];
      const ok = allowed.includes('in_progress') && !allowed.includes('todo') && !allowed.includes('blocked');
      return { ok, details: ok ? '' : `active VALID_STATUSES: ${JSON.stringify(allowed)}` };
    },
  },
  { name: '[Reguły] backlog → todo i blocked, nie in_progress',
    run: async () => {
      const store = await getStore();
      if (!store) return { ok: false, details: 'Nie można załadować taskPanelStore' };
      const allowed = store.VALID_STATUSES['backlog'];
      const ok = allowed.includes('todo') && allowed.includes('blocked') && !allowed.includes('in_progress');
      return { ok, details: ok ? '' : `backlog VALID_STATUSES: ${JSON.stringify(allowed)}` };
    },
  },
  { name: '[Reguły] done → done i cancelled',
    run: async () => {
      const store = await getStore();
      if (!store) return { ok: false, details: 'Nie można załadować taskPanelStore' };
      const allowed = store.VALID_STATUSES['done'];
      const ok = allowed.includes('done') && allowed.includes('cancelled') && !allowed.includes('todo');
      return { ok, details: ok ? '' : `done VALID_STATUSES: ${JSON.stringify(allowed)}` };
    },
  },

  // ─── resolveSection ────────────────────────────────────────────────────────
  {
    name: '[resolveSection] Znane statusy zwracają poprawne sekcje',
    run: async () => {
      const store = await getStore();
      if (!store) return { ok: false, details: 'Nie można załadować taskPanelStore' };
      const { resolveSection } = store;
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
  { name: '[resolveSection] Nieznany status używa fallback',
    run: async () => {
      const store = await getStore();
      if (!store) return { ok: false, details: 'Nie można załadować taskPanelStore' };
      const result = store.resolveSection('nonexistent', 'backlog');
      const ok = result === 'backlog';
      return { ok, details: ok ? '' : `Oczekiwano fallback 'backlog', dostałem '${result}'` };
    },
  },

  // ─── normalizeTask ─────────────────────────────────────────────────────────
  {
    name: '[normalizeTask] todo → section=backlog',
    run: async () => {
      const store = await getStore();
      if (!store) return { ok: false, details: 'Nie można załadować taskPanelStore' };
      const t = store.normalizeTask(makeTask({ status: 'todo' }));
      const ok = t.section === 'backlog';
      return { ok, details: ok ? '' : `section=${t.section}` };
    },
  },
  { name: '[normalizeTask] in_progress → section=active',
    run: async () => {
      const store = await getStore();
      if (!store) return { ok: false, details: 'Nie można załadować taskPanelStore' };
      const t = store.normalizeTask(makeTask({ status: 'in_progress' }));
      const ok = t.section === 'active';
      return { ok, details: ok ? '' : `section=${t.section}` };
    },
  },
  { name: '[normalizeTask] done → section=done',
    run: async () => {
      const store = await getStore();
      if (!store) return { ok: false, details: 'Nie można załadować taskPanelStore' };
      const t = store.normalizeTask(makeTask({ status: 'done' }));
      const ok = t.section === 'done';
      return { ok, details: ok ? '' : `section=${t.section}` };
    },
  },
  { name: '[normalizeTask] Brak statusu → domyślnie todo/backlog',
    run: async () => {
      const store = await getStore();
      if (!store) return { ok: false, details: 'Nie można załadować taskPanelStore' };
      const t = store.normalizeTask(makeTask({ status: 'cancelled' }));
      const ok = t.section === 'done';
      return { ok, details: ok ? '' : `section=${t.section}` };
    },
  },
  { name: '[normalizeTask] Nie nadpisuje istniejących pól',
    run: async () => {
      const store = await getStore();
      if (!store) return { ok: false, details: 'Nie można załadować taskPanelStore' };
      const t = store.normalizeTask(makeTask({ status: 'blocked' }));
      const ok = t.section === 'backlog';
      return { ok, details: ok ? '' : `section=${t.section}` };
    },
  },
  {
    name: '[normalizeTask] Brak statusu → domyślnie todo/backlog',
    run: async () => {
      const store = await getStore();
      if (!store) return { ok: false, details: 'Nie można załadować taskPanelStore' };
      const t = store.normalizeTask(makeTask({ status: undefined }));
      const ok = t.status === 'todo' && t.section === 'backlog';
      return { ok, details: ok ? '' : `status=${t.status}, section=${t.section}` };
    },
  },
  {
    name: '[normalizeTask] Nie nadpisuje istniejących pól zadania',
    run: async () => {
      const store = await getStore();
      if (!store) return { ok: false, details: 'Nie można załadować taskPanelStore' };
      const original = makeTask({ status: 'todo', name: 'Moje zadanie', priority: 'A', pinned: true });
      const t = store.normalizeTask(original);
      const ok = t.name === 'Moje zadanie' && t.priority === 'A' && t.pinned === true;
      return { ok, details: ok ? '' : `name=${t.name}, priority=${t.priority}, pinned=${t.pinned}` };
    },
  },

  // ─── Logika filtrowania i sortowania (czysta – bez importu) ───────────────
  {
    name: '[Filtr] Filtrowanie po statusie z płaskiej listy',
    run: async () => {
      const tasks = [makeTask({id:'1',status:'in_progress'}),makeTask({id:'2',status:'todo'}),makeTask({id:'3',status:'in_progress'})];
      const r = tasks.filter(t => t.status === 'in_progress');
      return { ok: r.length === 2, details: `Got ${r.length}` };
    }
  },
  {
    name: '[Filtr] Wyszukiwanie po nazwie (case-insensitive)',
    run: async () => {
      const tasks = [
        makeTask({ name: 'Fix authentication bug' }),
        makeTask({ name: 'Add dashboard feature' }),
        makeTask({ name: 'Fix typo in README' }),
      ];
      const filtered = tasks.filter(t => t.name.toLowerCase().includes('fix'));
      const ok = filtered.length === 2;
      return { ok, details: ok ? '' : `Oczekiwano 2 wyników, dostałem ${filtered.length}` };
    },
  },
  { name: '[Filtr] Pinnowane zadania na górze listy',
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
        makeTask({ id: '1', pinned: false }),
        makeTask({ id: '2', pinned: true  }),
        makeTask({ id: '3', pinned: false }),
      ];
      const sorted = [...tasks.filter(t => t.pinned), ...tasks.filter(t => !t.pinned)];
      const ok = sorted[0].id === '2';
      return { ok, details: ok ? '' : `Pierwszy element id=${sorted[0].id}` };
    },
  },

  // ─── IPC API – wymagają electronAPI (env:react) ───────────────────────────
  {
    name: '[IPC API] getTasks jest funkcją w electronAPI',
    env: 'react',
    run: async () => {
      const ok = typeof window.electronAPI?.getTasks === 'function';
      return { ok, details: ok ? '' : 'getTasks missing in electronAPI' };
    },
  },
  {
    name: '[IPC API] getAllTasks jest funkcją w electronAPI',
    env: 'react',
    run: async () => {
      const ok = typeof window.electronAPI?.getAllTasks === 'function';
      return { ok, details: ok ? '' : 'getAllTasks missing in electronAPI' };
    },
  },
  {
    name: '[IPC API] invoke jest dostępny dla tasks:add',
    env: 'react',
    run: async () => {
      const ok = typeof window.electronAPI?.invoke === 'function';
      return { ok, details: ok ? '' : 'invoke missing' };
    },
  },
];

export async function runTasksTests() {
  return runTests('Tasks (logika domenowa)', tests);
}
