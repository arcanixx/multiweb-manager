// =============================================================================
// FILE: TestRunner_Toast.js
// PATH: tests/TestRunner_Toast.js
// VERSION: 0.0.3
// PURPOSE: Testy systemu toastów – hook useToastQueue i reducer toastReducer
// FUNCTIONS: runToastTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { checkSourceExport, runTests, safeImport } from './testUtils.js';

async function imp(relPath) {
  try { return { ok: true, mod: await safeImport(relPath) }; }
  catch (e) { return { ok: false, error: e.message }; }
}

const tests = [

  // ── Eksporty ──────────────────────────────────────────────────────────────
  {
    name: 'useToastQueue – src/hooks/useToastQueue.js eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useToastQueue.js', 'useToastQueue'),
  },
  {
    name: 'toastReducer – src/stores/toastReducerStore.js eksportuje reducer',
    run: async () => checkSourceExport('src/stores/toastReducerStore.js', 'toastReducer'),
  },
  {
    name: 'toastReducer – src/stores/toastReducerStore.js eksportuje initialState',
    run: async () => checkSourceExport('src/stores/toastReducerStore.js', 'initialState'),
  },

  // ── Testy czystej funkcji toastReducer ────────────────────────────────────
  {
    name: 'toastReducer – PUSH dodaje toast do active gdy miejsce dostępne',
    run: async () => {
      const r = await imp('src/stores/toastReducerStore.js');
      if (!r.ok) return { ok: false, details: r.error };
      const { toastReducer, initialState } = r.mod;
      const toast = { id: 't-1', type: 'info', message: 'Test' };
      const next = toastReducer(initialState, { type: 'PUSH', payload: toast });
      const ok = next.active.length === 1 && next.queue.length === 0 && next.active[0].id === 't-1';
      return { ok, details: ok ? '' : `active=${next.active.length}, queue=${next.queue.length}` };
    }
  },
  {
    name: 'toastReducer – PUSH trafia do queue gdy active pełne (MAX_ACTIVE)',
    run: async () => {
      const r = await imp('src/stores/toastReducerStore.js');
      if (!r.ok) return { ok: false, details: r.error };
      const { toastReducer, initialState } = r.mod;
      // Wypełnij active do MAX_ACTIVE (3)
      const stateWith3 = [
        { id: 't-1', type: 'info', message: 'A' },
        { id: 't-2', type: 'info', message: 'B' },
        { id: 't-3', type: 'info', message: 'C' },
      ].reduce(
        (s, toast) => toastReducer(s, { type: 'PUSH', payload: toast }),
        initialState
      );
      const overflow = toastReducer(stateWith3, { type: 'PUSH', payload: { id: 't-4', type: 'info', message: 'D' } });
      const ok = overflow.active.length === 3 && overflow.queue.length === 1 && overflow.queue[0].id === 't-4';
      return { ok, details: ok ? '' : `active=${overflow.active.length}, queue=${overflow.queue.length}` };
    }
  },
  {
    name: 'toastReducer – DISMISS ustawia exiting:true na wskazanym toaście',
    run: async () => {
      const r = await imp('src/stores/toastReducerStore.js');
      if (!r.ok) return { ok: false, details: r.error };
      const { toastReducer, initialState } = r.mod;
      const state = toastReducer(initialState, { type: 'PUSH', payload: { id: 't-1', type: 'info', message: 'A' } });
      const dismissed = toastReducer(state, { type: 'DISMISS', id: 't-1' });
      const toast = dismissed.active.find(t => t.id === 't-1');
      const ok = toast?.exiting === true;
      return { ok, details: ok ? '' : `exiting=${toast?.exiting}` };
    }
  },
  {
    name: 'toastReducer – REMOVE usuwa toast z active i promuje kolejny z queue',
    run: async () => {
      const r = await imp('src/stores/toastReducerStore.js');
      if (!r.ok) return { ok: false, details: r.error };
      const { toastReducer, initialState } = r.mod;
      // 3 w active + 1 w queue
      const full = [
        { id: 't-1', type: 'info', message: 'A' },
        { id: 't-2', type: 'info', message: 'B' },
        { id: 't-3', type: 'info', message: 'C' },
      ].reduce((s, toast) => toastReducer(s, { type: 'PUSH', payload: toast }), initialState);
      const withQueue = toastReducer(full, { type: 'PUSH', payload: { id: 't-4', type: 'info', message: 'D' } });
      const removed   = toastReducer(withQueue, { type: 'REMOVE', id: 't-1' });
      const ok = removed.active.length === 3
              && removed.queue.length === 0
              && removed.active.some(t => t.id === 't-4');
      return { ok, details: ok ? '' : `active=${removed.active.length}, queue=${removed.queue.length}, ids=${removed.active.map(t=>t.id).join(',')}` };
    }
  },
  {
    name: 'toastReducer – REMOVE bez queue nie dodaje nowego wpisu',
    run: async () => {
      const r = await imp('src/stores/toastReducerStore.js');
      if (!r.ok) return { ok: false, details: r.error };
      const { toastReducer, initialState } = r.mod;
      const state = toastReducer(initialState, { type: 'PUSH', payload: { id: 't-1', type: 'info', message: 'A' } });
      const removed = toastReducer(state, { type: 'REMOVE', id: 't-1' });
      const ok = removed.active.length === 0 && removed.queue.length === 0;
      return { ok, details: ok ? '' : `active=${removed.active.length}, queue=${removed.queue.length}` };
    }
  },
  {
    name: 'toastReducer – unknown action zwraca niezmieniony stan',
    run: async () => {
      const r = await imp('src/stores/toastReducerStore.js');
      if (!r.ok) return { ok: false, details: r.error };
      const { toastReducer, initialState } = r.mod;
      const next = toastReducer(initialState, { type: 'UNKNOWN_ACTION' });
      const ok = next === initialState;
      return { ok, details: ok ? '' : 'Reducer zmienił stan dla nieznanej akcji' };
    }
  },

  // ── Testy logiki kolejkowania FIFO (pure) ─────────────────────────────────
  {
    name: 'Toast – kolejka FIFO: pierwszy dodany pierwszy wychodzi',
    run: async () => {
      const queue = [];
      ['A', 'B', 'C'].forEach(msg => queue.push({ id: Date.now() + msg, msg }));
      const first = queue.shift();
      const ok = first.msg === 'A' && queue.length === 2;
      return { ok, details: ok ? '' : `Pierwszy: ${first?.msg}, pozostało: ${queue.length}` };
    }
  },
  {
    name: 'useToastQueue – eksportowany jako funkcja (safeImport)',
    run: async () => {
      const r = await imp('src/hooks/useToastQueue.js');
      if (!r.ok) return { ok: false, details: r.error };
      const ok = typeof r.mod.useToastQueue === 'function';
      return { ok, details: ok ? '' : 'useToastQueue nie jest funkcją' };
    }
  },

];

export async function runToastTests() {
  return runTests('Toast', tests);
}
