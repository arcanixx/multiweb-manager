// =============================================================================
// FILE: TestRunner_TasksPanel.js
// PATH: tests/TestRunner_TasksPanel.js
// VERSION: 0.0.3
// PURPOSE: Testy integracyjne komponentów UI TaskPanel (src/ui/taskpanel) i AggregatedTasks (src/ui/tasks). Weryfikuje eksporty komponentów, stałe, IPC API dla TaskGroups oraz logikę AggregatedTasks.
// FUNCTIONS: runTasksPanelTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';

// ─── Mock electronAPI dla testów bez prawdziwego Electron
const _mockGroups = [
  { id: 'tg_p1', name: 'Claude AI', profileIds: ['p1', 'p2'], createdAt: '2024-01-01T00:00:00Z' },
  { id: 'tg_p3', name: 'DeepSeek',  profileIds: ['p3'],       createdAt: '2024-01-02T00:00:00Z' },
];
const _mockTasks = [
  { id: 't1', taskGroupId: 'tg_p1', groupName: 'Claude AI', name: 'Fix bug',        status: 'in_progress', section: 'active',  priority: 'A', pinned: true,  createdAt: '2024-01-01T00:00:00Z' },
  { id: 't2', taskGroupId: 'tg_p1', groupName: 'Claude AI', name: 'Write docs',     status: 'todo',        section: 'backlog', priority: 'C', pinned: false, createdAt: '2024-01-02T00:00:00Z' },
  { id: 't3', taskGroupId: 'tg_p1', groupName: 'Claude AI', name: 'Old task',       status: 'done',        section: 'done',    priority: 'E', pinned: false, createdAt: '2024-01-03T00:00:00Z' },
  { id: 't4', taskGroupId: 'tg_p3', groupName: 'DeepSeek',  name: 'Research API',   status: 'blocked',     section: 'backlog', priority: 'B', pinned: false, createdAt: '2024-01-04T00:00:00Z' },
  { id: 't5', taskGroupId: 'tg_p3', groupName: 'DeepSeek',  name: 'Deploy feature', status: 'cancelled',   section: 'done',    priority: 'D', pinned: false, createdAt: '2024-01-05T00:00:00Z' },
];

const mockElectronAPI = {
  invoke: async (channel, payload) => {
    switch (channel) {
      case 'taskGroups:getAll':
        return { ok: true, data: _mockGroups };
      case 'taskGroups:create':
        return { ok: true, data: [..._mockGroups, { id: `tg_${Date.now()}`, ...payload, profileIds: payload.profileIds || [] }] };
      case 'taskGroups:ensureForProfile':
        const existing = _mockGroups.find(g => g.profileIds.includes(payload.profileId));
        return { ok: true, data: existing || { id: `tg_${payload.profileId}`, name: payload.profileName, profileIds: [payload.profileId] } };
      case 'taskGroups:assignProfile':
        return { ok: true, data: _mockGroups };
      case 'taskGroups:unassignProfile':
        return { ok: true, data: _mockGroups };
      case 'aggregatedTasks:getAll':
        return { ok: true, data: _mockTasks };
      case 'aggregatedTasks:filter':
        let filtered = _mockTasks;
        if (payload?.status)   filtered = filtered.filter(t => t.status   === payload.status);
        if (payload?.section)  filtered = filtered.filter(t => t.section  === payload.section);
        if (payload?.priority) filtered = filtered.filter(t => t.priority === payload.priority);
        return { ok: true, data: filtered };
      case 'tasks:getAll':
        if (payload) return { ok: true, data: _mockTasks.filter(t => t.taskGroupId === payload) };
        return { ok: true, data: _mockTasks };
      case 'tasks:add':
        return { ok: true, data: { ...payload, id: `task_${Date.now()}`, section: 'backlog' } };
      case 'tasks:update':
        return { ok: true, data: { ...(_mockTasks.find(t => t.id === payload.id) || {}), ...payload.patch, id: payload.id } };
      case 'tasks:delete':
        return { ok: true };
      default:
        return { ok: false, error: `Nieznany kanał: ${channel}` };
    }
  },
  getSettings: async () => ({ ok: true, data: { hiddenTaskGroups: {}, collapsedTaskGroups: {} } }),
  saveSettings: async () => ({ ok: true }),
};

const tests = [

  // ─── Eksporty komponentów ─────────────────────────────────────
  {
    name: '[Export] TaskPanel.jsx eksportuje komponent default',
    run: async () => {
      const mod = await import('../src/ui/taskpanel/TaskPanel.jsx').catch(e => ({ error: e.message }));
      const ok  = !mod.error && (typeof mod.default === 'function');
      return { ok, details: ok ? '' : (mod.error || 'Brak default export') };
    },
  },
  {
    name: '[Export] TaskModal.jsx eksportuje komponent default',
    run: async () => {
      const mod = await import('../src/ui/taskpanel/TaskModal.jsx').catch(e => ({ error: e.message }));
      const ok  = !mod.error && typeof mod.default === 'function';
      return { ok, details: ok ? '' : (mod.error || 'Brak default export') };
    },
  },
  {
    name: '[Export] TaskItem.jsx eksportuje komponent default',
    run: async () => {
      const mod = await import('../src/ui/taskpanel/TaskItem.jsx').catch(e => ({ error: e.message }));
      const ok  = !mod.error && typeof mod.default === 'function';
      return { ok, details: ok ? '' : (mod.error || 'Brak default export') };
    },
  },
  {
    name: '[Export] TaskSection.jsx eksportuje komponent default',
    run: async () => {
      const mod = await import('../src/ui/taskpanel/TaskSection.jsx').catch(e => ({ error: e.message }));
      const ok  = !mod.error && typeof mod.default === 'function';
      return { ok, details: ok ? '' : (mod.error || 'Brak default export') };
    },
  },
  {
    name: '[Export] TaskSectionList.jsx eksportuje komponent default',
    run: async () => {
      const mod = await import('../src/ui/taskpanel/TaskSectionList.jsx').catch(e => ({ error: e.message }));
      const ok  = !mod.error && typeof mod.default === 'function';
      return { ok, details: ok ? '' : (mod.error || 'Brak default export') };
    },
  },
  {
    name: '[Export] AggregatedTasks.jsx eksportuje komponent default',
    run: async () => {
      const mod = await import('../src/ui/tasks/AggregatedTasks.jsx').catch(e => ({ error: e.message }));
      const ok  = !mod.error && typeof mod.default === 'function';
      return { ok, details: ok ? '' : (mod.error || 'Brak default export') };
    },
  },
  {
    name: '[Export] useTaskGroups.js eksportuje hook useTaskGroups',
    run: async () => {
      const mod = await import('../src/hooks/useTaskGroups.js').catch(e => ({ error: e.message }));
      const ok  = !mod.error && typeof mod.useTaskGroups === 'function';
      return { ok, details: ok ? '' : (mod.error || 'Brak eksportu useTaskGroups') };
    },
  },
  {
    name: '[Export] useTasks.js eksportuje hook useTasks',
    run: async () => {
      const mod = await import('../src/hooks/useTasks.js').catch(e => ({ error: e.message }));
      const ok  = !mod.error && typeof mod.useTasks === 'function';
      return { ok, details: ok ? '' : (mod.error || 'Brak eksportu useTasks') };
    },
  },

  // ─── IPC API (preload) ─────────────────────────────────────────
  {
    name: '[IPC API] getTaskGroups jest funkcją',
    run: async () => {
      const ok = typeof window.electronAPI?.getTaskGroups === 'function';
      return { ok, details: ok ? '' : 'getTaskGroups missing' };
    },
  },
  {
    name: '[IPC API] createTaskGroup jest funkcją',
    run: async () => {
      const ok = typeof window.electronAPI?.createTaskGroup === 'function';
      return { ok, details: ok ? '' : 'createTaskGroup missing' };
    },
  },
  {
    name: '[IPC API] ensureTaskGroupForProfile jest funkcją',
    run: async () => {
      const ok = typeof window.electronAPI?.ensureTaskGroupForProfile === 'function';
      return { ok, details: ok ? '' : 'ensureTaskGroupForProfile missing' };
    },
  },
  {
    name: '[IPC API] assignProfileToTaskGroup jest funkcją',
    run: async () => {
      const ok = typeof window.electronAPI?.assignProfileToTaskGroup === 'function';
      return { ok, details: ok ? '' : 'assignProfileToTaskGroup missing' };
    },
  },

  // ─── Mock IPC – logika TaskGroup ──────────────────────────────
  {
    name: '[TaskGroups Mock] getAll zwraca listę grup',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      const res = await window.electronAPI.invoke('taskGroups:getAll');
      const ok  = res.ok && Array.isArray(res.data) && res.data.length === 2;
      return { ok, details: ok ? '' : `Oczekiwano 2 grupy, dostałem: ${JSON.stringify(res)}` };
    },
  },
  {
    name: '[TaskGroups Mock] ensureForProfile zwraca istniejącą grupę dla przypisanego profilu',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      const res = await window.electronAPI.invoke('taskGroups:ensureForProfile', { profileId: 'p1', profileName: 'Claude' });
      const ok  = res.ok && res.data?.id === 'tg_p1';
      return { ok, details: ok ? '' : `Oczekiwano tg_p1, dostałem: ${JSON.stringify(res.data)}` };
    },
  },
  {
    name: '[TaskGroups Mock] ensureForProfile tworzy nową grupę dla nieprzypisanego profilu',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      const res = await window.electronAPI.invoke('taskGroups:ensureForProfile', { profileId: 'p_new', profileName: 'New App' });
      const ok  = res.ok && res.data?.id === 'tg_p_new';
      return { ok, details: ok ? '' : `Oczekiwano tg_p_new, dostałem: ${JSON.stringify(res.data)}` };
    },
  },
  {
    name: '[TaskGroups Mock] assignProfile zwraca ok',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      const res = await window.electronAPI.invoke('taskGroups:assignProfile', { groupId: 'tg_p1', profileId: 'p_new' });
      return { ok: res.ok, details: res.ok ? '' : res.error };
    },
  },

  // ─── Mock IPC – zadania per grupa ─────────────────────────────
  {
    name: '[Tasks Mock] tasks:getAll zwraca wszystkie zadania (bez payload)',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      const res = await window.electronAPI.invoke('tasks:getAll');
      const ok  = res.ok && res.data?.length === 5;
      return { ok, details: ok ? '' : `Oczekiwano 5, dostałem ${res.data?.length}` };
    },
  },
  {
    name: '[Tasks Mock] tasks:getAll filtruje per taskGroupId',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      const res = await window.electronAPI.invoke('tasks:getAll', 'tg_p1');
      const ok  = res.ok && res.data?.length === 3;
      return { ok, details: ok ? '' : `Oczekiwano 3 zadania dla tg_p1, dostałem ${res.data?.length}` };
    },
  },
  {
    name: '[Tasks Mock] tasks:add zwraca nowe zadanie z id',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      const res = await window.electronAPI.invoke('tasks:add', {
        taskGroupId: 'tg_p1', name: 'Nowe zadanie', status: 'todo', priority: 'B',
      });
      const ok = res.ok && !!res.data?.id && res.data.name === 'Nowe zadanie';
      return { ok, details: ok ? '' : JSON.stringify(res) };
    },
  },
  {
    name: '[Tasks Mock] tasks:update zwraca zaktualizowane zadanie',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      const res = await window.electronAPI.invoke('tasks:update', { id: 't1', patch: { status: 'done' } });
      const ok  = res.ok && res.data?.status === 'done';
      return { ok, details: ok ? '' : JSON.stringify(res) };
    },
  },
  {
    name: '[Tasks Mock] tasks:delete zwraca ok',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      const res = await window.electronAPI.invoke('tasks:delete', { id: 't2' });
      return { ok: res.ok, details: res.ok ? '' : res.error };
    },
  },

  // ─── AggregatedTasks – logika grupowania ──────────────────────
  {
    name: '[AggregatedTasks] Grupowanie płaskiej listy per taskGroupId',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      const res = await window.electronAPI.invoke('aggregatedTasks:getAll');
      const grouped = {};
      for (const t of (res.data || [])) {
        grouped[t.taskGroupId] = (grouped[t.taskGroupId] || 0) + 1;
      }
      const ok = grouped['tg_p1'] === 3 && grouped['tg_p3'] === 2;
      return { ok, details: ok ? '' : JSON.stringify(grouped) };
    },
  },
  {
    name: '[AggregatedTasks] Filtrowanie po statusie in_progress',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      const res = await window.electronAPI.invoke('aggregatedTasks:filter', { status: 'in_progress' });
      const ok  = res.ok && res.data?.length === 1 && res.data[0].id === 't1';
      return { ok, details: ok ? '' : `Wyniki: ${JSON.stringify(res.data?.map(t => t.id))}` };
    },
  },
  {
    name: '[AggregatedTasks] Filtrowanie po sekcji backlog',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      const res = await window.electronAPI.invoke('aggregatedTasks:filter', { section: 'backlog' });
      const ok  = res.ok && res.data?.length === 2;
      return { ok, details: ok ? '' : `Oczekiwano 2 (todo+blocked), dostałem ${res.data?.length}` };
    },
  },
  {
    name: '[AggregatedTasks] Filtrowanie po priorytecie A',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      const res = await window.electronAPI.invoke('aggregatedTasks:filter', { priority: 'A' });
      const ok  = res.ok && res.data?.length === 1 && res.data[0].id === 't1';
      return { ok, details: ok ? '' : `Wyniki: ${JSON.stringify(res.data?.map(t => t.id))}` };
    },
  },
  {
    name: '[AggregatedTasks] Pinnowane zadania identyfikowane poprawnie',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      const res = await window.electronAPI.invoke('aggregatedTasks:getAll');
      const pinned = (res.data || []).filter(t => t.pinned);
      const ok = pinned.length === 1 && pinned[0].id === 't1';
      return { ok, details: ok ? '' : `Pinnowane: ${JSON.stringify(pinned.map(t => t.id))}` };
    },
  },
  {
    name: '[AggregatedTasks] Widok sekcji done zawiera done i cancelled',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      const res    = await window.electronAPI.invoke('aggregatedTasks:filter', { section: 'done' });
      const ids    = (res.data || []).map(t => t.id).sort();
      const ok     = ids.length === 2 && ids.includes('t3') && ids.includes('t5');
      return { ok, details: ok ? '' : `Done section tasks: ${JSON.stringify(ids)}` };
    },
  },
];

// ─── runTasksPanelTests() – uruchamia testy UI/integracyjne TaskPanel
export async function runTasksPanelTests() {
  return runTests('TasksPanel (UI + integracja)', tests);
}
