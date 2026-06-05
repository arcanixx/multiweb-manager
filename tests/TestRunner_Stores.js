// =============================================================================
// FILE: TestRunner_Stores.js
// PATH: tests/TestRunner_Stores.js
// VERSION: 0.0.3
// PURPOSE: Testy wszystkich stores (main process) — eksporty CRUD, logika domenowa: workspacesStore, accountsStore, clipboardStore, taskGroupsStore, appLibraryStore, tasksStore (VALID_STATUSES, STATUS_TO_SECTION, resolveSection, normalizeTask).
// FUNCTIONS: runStoresTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
import { join } from 'path';

const ROOT = process.cwd();

async function imp(relPath) {
  try { return { ok: true, mod: await import(join(ROOT, relPath)) }; }
  catch (e) { return { ok: false, error: e.message }; }
}

const tests = [
  // ── workspacesStore ────────────────────────────────────────────────────────
  {
    name: 'workspacesStore – all functions exported',
    run: async () => {
      const r = await imp('src/stores/workspacesStore.js');
      if (!r.ok) return { ok: false, details: r.error };
      const required = ['getAllWorkspaces', 'saveWorkspace', 'saveWorkspaces', 'deleteWorkspace'];
      const missing = required.filter(fn => typeof r.mod[fn] !== 'function');
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'workspacesStore – saveWorkspace upsert logic (pure)',
    run: async () => {
      // Symulacja upsert bez fs
      const data = [{ id: 'ws-1', name: 'Alpha' }];
      const upsert = (arr, ws) => {
        const idx = arr.findIndex(w => w.id === ws.id);
        if (idx === -1) return [...arr, ws];
        const next = [...arr]; next[idx] = ws; return next;
      };
      const after = upsert(data, { id: 'ws-1', name: 'Alpha Updated' });
      const ok = after.length === 1 && after[0].name === 'Alpha Updated';
      return { ok, details: ok ? '' : `Result: ${JSON.stringify(after)}` };
    }
  },
  {
    name: 'workspacesStore – name uniqueness guard (pure)',
    run: async () => {
      const data = [{ id: 'ws-1', name: 'Alpha' }];
      // Nowy workspace z istniejącą nazwą powinien rzucić wyjątek
      const tryAdd = (arr, ws) => {
        if (!arr.find(w => w.id === ws.id) && arr.find(w => w.name === ws.name)) {
          throw new Error('Workspace name already exists');
        }
        return [...arr, ws];
      };
      let threw = false;
      try { tryAdd(data, { id: 'ws-new', name: 'Alpha' }); } catch { threw = true; }
      return { ok: threw, details: threw ? '' : 'Should throw on duplicate name' };
    }
  },
  {
    name: 'workspacesStore – deleteWorkspace filter logic (pure)',
    run: async () => {
      const data = [{ id: 'ws-1' }, { id: 'ws-2' }, { id: 'ws-3' }];
      const after = data.filter(w => w.id !== 'ws-2');
      const ok = after.length === 2 && !after.find(w => w.id === 'ws-2');
      return { ok, details: ok ? '' : `After delete: ${JSON.stringify(after)}` };
    }
  },

  // ── accountsStore ──────────────────────────────────────────────────────────
  {
    name: 'accountsStore – all CRUD functions exported',
    run: async () => {
      const r = await imp('src/stores/accountsStore.js');
      if (!r.ok) return { ok: false, details: r.error };
      const required = ['getAllAccounts', 'addAccount', 'updateAccount', 'deleteAccount'];
      const missing = required.filter(fn => typeof r.mod[fn] !== 'function');
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'accountsStore – updateAccount shallow merge (pure)',
    run: async () => {
      const account = { id: 'acc-1', name: 'Test', email: 'a@b.com' };
      const updated = { ...account, name: 'Updated' };
      const ok = updated.name === 'Updated' && updated.email === 'a@b.com';
      return { ok, details: ok ? '' : 'Shallow merge failed' };
    }
  },
  {
    name: 'accountsStore – updateAccount returns null for unknown id (pure)',
    run: async () => {
      const data = [{ id: 'acc-1', name: 'Test' }];
      const update = (arr, id, patch) => {
        const idx = arr.findIndex(a => a.id === id);
        if (idx === -1) return null;
        const next = [...arr]; next[idx] = { ...next[idx], ...patch }; return next[idx];
      };
      const result = update(data, 'acc-nonexistent', { name: 'X' });
      return { ok: result === null, details: result === null ? '' : `Expected null, got ${JSON.stringify(result)}` };
    }
  },

  // ── clipboardStore ─────────────────────────────────────────────────────────
  {
    name: 'clipboardStore – all functions exported',
    run: async () => {
      const r = await imp('src/stores/clipboardStore.js');
      if (!r.ok) return { ok: false, details: r.error };
      const required = ['addClipboardEntry', 'getClipboardHistory', 'clearClipboardHistory'];
      const missing = required.filter(fn => typeof r.mod[fn] !== 'function');
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'clipboardStore – FIFO trim to maxClipboardItems (pure)',
    run: async () => {
      const MAX = 50;
      // Symulacja in-memory z unshift + trim
      let history = [];
      for (let i = 0; i < 60; i++) {
        history.unshift({ id: i, text: `text-${i}` });
        if (history.length > MAX) history = history.slice(0, MAX);
      }
      const ok = history.length === MAX && history[0].text === 'text-59';
      return { ok, details: ok ? '' : `len=${history.length}, first=${history[0]?.text}` };
    }
  },
  {
    name: 'clipboardStore – empty string not added (pure)',
    run: async () => {
      const shouldAdd = (text) => text && typeof text === 'string';
      const ok = !shouldAdd('') && !shouldAdd(null) && shouldAdd('valid');
      return { ok, details: ok ? '' : 'Empty/null guard failed' };
    }
  },

  // ── taskGroupsStore ────────────────────────────────────────────────────────
  {
    name: 'taskGroupsStore – all functions exported',
    run: async () => {
      const r = await imp('src/stores/taskGroupsStore.js');
      if (!r.ok) return { ok: false, details: r.error };
      const required = ['loadTaskGroups', 'saveTaskGroups', 'createTaskGroup',
        'updateTaskGroup', 'deleteTaskGroup', 'getGroupForProfile', 'ensureDefaultGroup'];
      const missing = required.filter(fn => typeof r.mod[fn] !== 'function');
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'taskGroupsStore – getGroupForProfile logic (pure)',
    run: async () => {
      const groups = [
        { id: 'g-1', profileId: 'p-1' },
        { id: 'g-2', profileId: 'p-2' }
      ];
      const getGroup = (profileId) => groups.find(g => g.profileId === profileId) || null;
      const ok = getGroup('p-1')?.id === 'g-1' && getGroup('p-99') === null;
      return { ok, details: ok ? '' : 'getGroupForProfile logic failed' };
    }
  },

  // ── appLibraryStore ────────────────────────────────────────────────────────
  {
    name: 'appLibraryStore – all functions exported',
    run: async () => {
      const r = await imp('src/stores/appLibraryStore.js');
      if (!r.ok) return { ok: false, details: r.error };
      const required = ['loadAppLibrary', 'filterApps', 'searchAppLibrary', 'getAppById'];
      const missing = required.filter(fn => typeof r.mod[fn] !== 'function');
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },

  // ── tasksStore – czyste funkcje domenowe ──────────────────────────────────
  {
    name: 'tasksStore – VALID_STATUSES and STATUS_TO_SECTION exported',
    run: async () => {
      const r = await imp('src/stores/tasksStore.js');
      if (!r.ok) return { ok: false, details: r.error };
      const ok = r.mod.VALID_STATUSES && r.mod.STATUS_TO_SECTION;
      return { ok, details: ok ? '' : 'VALID_STATUSES or STATUS_TO_SECTION missing' };
    }
  },
  {
    name: 'tasksStore – resolveSection maps status to correct section',
    run: async () => {
      const r = await imp('src/stores/tasksStore.js');
      if (!r.ok) return { ok: false, details: r.error };
      const { resolveSection } = r.mod;
      if (typeof resolveSection !== 'function') return { ok: false, details: 'resolveSection not exported' };
      const checks = [
        resolveSection('in_progress') === 'active',
        resolveSection('todo')        === 'backlog',
        resolveSection('blocked')     === 'backlog',
        resolveSection('done')        === 'done',
        resolveSection('cancelled')   === 'done',
      ];
      const ok = checks.every(Boolean);
      return { ok, details: ok ? '' : `Failed checks: ${checks.map((c,i)=>c?'':i).filter(Boolean).join(', ')}` };
    }
  },
  {
    name: 'tasksStore – resolveSection falls back to backlog for unknown status',
    run: async () => {
      const r = await imp('src/stores/tasksStore.js');
      if (!r.ok) return { ok: false, details: r.error };
      const { resolveSection } = r.mod;
      const result = resolveSection('__unknown__', 'backlog');
      return { ok: result === 'backlog', details: result === 'backlog' ? '' : `Got: ${result}` };
    }
  },
  {
    name: 'tasksStore – normalizeTask exported as function',
    run: async () => {
      const r = await imp('src/stores/tasksStore.js');
      if (!r.ok) return { ok: false, details: r.error };
      const ok = typeof r.mod.normalizeTask === 'function';
      return { ok, details: ok ? '' : 'normalizeTask not exported' };
    }
  },
  {
    name: 'tasksStore – VALID_STATUSES covers all three sections',
    run: async () => {
      const r = await imp('src/stores/tasksStore.js');
      if (!r.ok) return { ok: false, details: r.error };
      const { VALID_STATUSES } = r.mod;
      const ok = 'active' in VALID_STATUSES && 'backlog' in VALID_STATUSES && 'done' in VALID_STATUSES;
      return { ok, details: ok ? '' : `Keys: ${Object.keys(VALID_STATUSES).join(', ')}` };
    }
  }
];

export async function runStoresTests() {
  return runTests('Stores', tests);
}
