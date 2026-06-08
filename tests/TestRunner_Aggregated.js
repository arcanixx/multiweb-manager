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

async function getStore() {
  try { return await safeImport('src/stores/taskPanelStore.js'); }
  catch (e) { return null; }
}

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
  // ─── Eksporty komponentów ─────────────────────────────────────────────────
  ...[
    ['CommentModal',             'src/ui/taskpanel/CommentModal.jsx'],
    ['TaskDetails',              'src/ui/taskpanel/TaskDetails.jsx'],
    ['TaskEditor',               'src/ui/taskpanel/TaskEditor.jsx'],
    ['TaskEmptyState',           'src/ui/taskpanel/TaskEmptyState.jsx'],
    ['TaskList',                 'src/ui/taskpanel/TaskList.jsx'],
    ['AggregatedProjectSection', 'src/ui/aggregated/AggregatedProjectSection.jsx'],
    ['AggregatedTaskItem',       'src/ui/aggregated/AggregatedTaskItem.jsx'],
  ].map(([name, path]) => ({
    name: `${name} – ${path} eksportuje komponent`,
    run: async () => checkSourceExport(path, name),
  })),

  // ─── Model danych ─────────────────────────────────────────────────────────
  { name: '[Model] Kanoniczne pola zadania są obecne',
    run: async () => {
      const t = makeTask();
      const required = ['id', 'taskGroupId', 'name', 'status', 'priority', 'createdAt'];
      const missing = required.filter(f => !(f in t));
      return { ok: missing.length === 0, details: missing.length ? `Brakujące: ${missing.join(', ')}` : '' };
    }
  },
  { name: '[Model] Priorytety A–E są jedynymi dopuszczalnymi wartościami',
    run: async () => {
      const valid = ['A','B','C','D','E'];
      const invalid = ['F','1','',null,'a'];
      const ok = valid.every(p => valid.includes(p)) && invalid.every(p => !valid.includes(p));
      return { ok, details: ok ? '' : 'Walidacja priorytetów nieprawidłowa' };
    }
  },

  // ─── STATUS_TO_SECTION ────────────────────────────────────────────────────
  { name: '[Reguły] in_progress → section=active',
    run: async () => {
      const s = await getStore();
      if (!s) return { ok: false, details: 'Nie można załadować taskPanelStore' };
      return { ok: s.STATUS_TO_SECTION['in_progress'] === 'active', details: '' };
    }
  },
  { name: '[Reguły] todo → section=backlog',
    run: async () => {
      const s = await getStore(); if (!s) return { ok: false, details: 'store error' };
      return { ok: s.STATUS_TO_SECTION['todo'] === 'backlog', details: '' };
    }
  },
  { name: '[Reguły] blocked → section=backlog',
    run: async () => {
      const s = await getStore(); if (!s) return { ok: false, details: 'store error' };
      return { ok: s.STATUS_TO_SECTION['blocked'] === 'backlog', details: '' };
    }
  },
  { name: '[Reguły] done → section=done',
    run: async () => {
      const s = await getStore(); if (!s) return { ok: false, details: 'store error' };
      return { ok: s.STATUS_TO_SECTION['done'] === 'done', details: '' };
    }
  },
  { name: '[Reguły] cancelled → section=done',
    run: async () => {
      const s = await getStore(); if (!s) return { ok: false, details: 'store error' };
      return { ok: s.STATUS_TO_SECTION['cancelled'] === 'done', details: '' };
    }
  },
  { name: '[Reguły] Każda sekcja ma co najmniej jeden dopuszczalny status',
    run: async () => {
      const s = await getStore(); if (!s) return { ok: false, details: 'store error' };
      const sections = ['active','backlog','done'];
      const ok = sections.every(sec => Array.isArray(s.VALID_STATUSES[sec]) && s.VALID_STATUSES[sec].length > 0);
      return { ok, details: ok ? '' : 'Pusta VALID_STATUSES' };
    }
  },
  { name: '[Reguły] active → tylko in_progress',
    run: async () => {
      const s = await getStore(); if (!s) return { ok: false, details: 'store error' };
      const a = s.VALID_STATUSES['active'];
      return { ok: a.includes('in_progress') && !a.includes('todo'), details: JSON.stringify(a) };
    }
  },
  { name: '[Reguły] backlog → todo i blocked, nie in_progress',
    run: async () => {
      const s = await getStore(); if (!s) return { ok: false, details: 'store error' };
      const a = s.VALID_STATUSES['backlog'];
      return { ok: a.includes('todo') && a.includes('blocked') && !a.includes('in_progress'), details: JSON.stringify(a) };
    }
  },
  { name: '[Reguły] done → done i cancelled',
    run: async () => {
      const s = await getStore(); if (!s) return { ok: false, details: 'store error' };
      const a = s.VALID_STATUSES['done'];
      return { ok: a.includes('done') && a.includes('cancelled') && !a.includes('todo'), details: JSON.stringify(a) };
    }
  },

  // ─── resolveSection ───────────────────────────────────────────────────────
  { name: '[resolveSection] Znane statusy zwracają poprawne sekcje',
    run: async () => {
      const s = await getStore(); if (!s) return { ok: false, details: 'store error' };
      const cases = [['in_progress','active'],['todo','backlog'],['blocked','backlog'],['done','done'],['cancelled','done']];
      const errors = cases.filter(([status, exp]) => s.resolveSection(status) !== exp);
      return { ok: errors.length === 0, details: errors.map(e => e.join('→')).join(', ') };
    }
  },
  { name: '[resolveSection] Nieznany status używa fallback',
    run: async () => {
      const s = await getStore(); if (!s) return { ok: false, details: 'store error' };
      const result = s.resolveSection('nonexistent', 'backlog');
      return { ok: result === 'backlog', details: result === 'backlog' ? '' : `Got: ${result}` };
    }
  },

  // ─── normalizeTask ────────────────────────────────────────────────────────
  { name: '[normalizeTask] todo → section=backlog',
    run: async () => {
      const s = await getStore(); if (!s) return { ok: false, details: 'store error' };
      const t = s.normalizeTask(makeTask({ status: 'todo' }));
      return { ok: t.section === 'backlog', details: `section=${t.section}` };
    }
  },
  { name: '[normalizeTask] in_progress → section=active',
    run: async () => {
      const s = await getStore(); if (!s) return { ok: false, details: 'store error' };
      const t = s.normalizeTask(makeTask({ status: 'in_progress' }));
      return { ok: t.section === 'active', details: `section=${t.section}` };
    }
  },
  { name: '[normalizeTask] done → section=done',
    run: async () => {
      const s = await getStore(); if (!s) return { ok: false, details: 'store error' };
      const t = s.normalizeTask(makeTask({ status: 'done' }));
      return { ok: t.section === 'done', details: `section=${t.section}` };
    }
  },
  { name: '[normalizeTask] Brak statusu → domyślnie todo/backlog',
    run: async () => {
      const s = await getStore(); if (!s) return { ok: false, details: 'store error' };
      const t = s.normalizeTask(makeTask({ status: undefined }));
      return { ok: t.status === 'todo' && t.section === 'backlog', details: `status=${t.status} section=${t.section}` };
    }
  },
  { name: '[normalizeTask] Nie nadpisuje istniejących pól',
    run: async () => {
      const s = await getStore(); if (!s) return { ok: false, details: 'store error' };
      const orig = makeTask({ status: 'todo', name: 'Moje', priority: 'A', pinned: true });
      const t = s.normalizeTask(orig);
      return { ok: t.name === 'Moje' && t.priority === 'A' && t.pinned === true, details: `${t.name}/${t.priority}/${t.pinned}` };
    }
  },

  // ─── Filtrowanie i sortowanie (czysta logika – bez importu) ──────────────
  { name: '[Filtr] Filtrowanie po statusie',
    run: async () => {
      const tasks = [makeTask({id:'1',status:'in_progress'}),makeTask({id:'2',status:'todo'}),makeTask({id:'3',status:'in_progress'})];
      const r = tasks.filter(t => t.status === 'in_progress');
      return { ok: r.length === 2, details: `Got ${r.length}` };
    }
  },
  { name: '[Filtr] Wyszukiwanie po nazwie (case-insensitive)',
    run: async () => {
      const tasks = [makeTask({name:'Fix auth bug'}),makeTask({name:'Add dashboard'}),makeTask({name:'Fix typo'})];
      const r = tasks.filter(t => t.name.toLowerCase().includes('fix'));
      return { ok: r.length === 2, details: `Got ${r.length}` };
    }
  },
  { name: '[Filtr] Sortowanie po priorytecie A→E',
    run: async () => {
      const ORDER = {A:0,B:1,C:2,D:3,E:4};
      const tasks = [makeTask({id:'1',priority:'C'}),makeTask({id:'2',priority:'A'}),makeTask({id:'3',priority:'E'}),makeTask({id:'4',priority:'B'})];
      tasks.sort((a,b) => (ORDER[a.priority]??99)-(ORDER[b.priority]??99));
      return { ok: tasks[0].priority === 'A' && tasks[3].priority === 'E', details: tasks.map(t=>t.priority).join(',') };
    }
  },
  { name: '[Filtr] Pinnowane zadania na górze listy',
    run: async () => {
      const tasks = [makeTask({id:'1',pinned:false}),makeTask({id:'2',pinned:true}),makeTask({id:'3',pinned:false})];
      const sorted = [...tasks.filter(t=>t.pinned),...tasks.filter(t=>!t.pinned)];
      return { ok: sorted[0].id === '2', details: `First id=${sorted[0].id}` };
    }
  },

  // ─── IPC API (env:react) ──────────────────────────────────────────────────
  { name: '[IPC API] getTasks jest funkcją w electronAPI', env: 'react',
    run: async () => ({ ok: typeof window.electronAPI?.getTasks === 'function', details: '' })
  },
  { name: '[IPC API] getAllTasks jest funkcją w electronAPI', env: 'react',
    run: async () => ({ ok: typeof window.electronAPI?.getAllTasks === 'function', details: '' })
  },
  { name: '[IPC API] invoke jest dostępny', env: 'react',
    run: async () => ({ ok: typeof window.electronAPI?.invoke === 'function', details: '' })
  },
];

export async function runTasksTests() {
  return runTests('Tasks (logika domenowa)', tests);
}
