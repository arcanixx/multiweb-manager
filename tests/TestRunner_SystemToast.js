// =============================================================================
// FILE: TestRunner_SystemToast.js
// PATH: tests/TestRunner_SystemToast.js
// VERSION: 0.0.3
// PURPOSE: Testy systemu toastów – reducer, konfiguracja, stałe, kolejkowanie
// FUNCTIONS: runToastTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { checkSourceExport, safeImport, runTests } from './testUtils.js';

const tests = [
  // ─── Eksporty modułów (checkSourceExport – nie importuje JSX/React.lazy) ──
  {
    name: 'ToastContainer – src/ui/system/ToastContainer.jsx posiada default export',
    run: async () => checkSourceExport('src/ui/system/ToastContainer.jsx', 'ToastContainer'),
  },
  {
    name: 'ToastItem – src/ui/system/toast/ToastItem.jsx posiada default export',
    run: async () => checkSourceExport('src/ui/system/toast/ToastItem.jsx', 'ToastItem'),
  },

  // ─── toastConfig – czyste stałe, można importować w Node ─────────────────
  {
    name: 'toastConfig – MAX_ACTIVE wynosi 3',
    run: async () => {
      const mod = await safeImport('src/ui/system/toast/toastConfig.js');
      const ok = mod.MAX_ACTIVE === 3;
      return { ok, details: ok ? '' : `MAX_ACTIVE: ${mod.MAX_ACTIVE}` };
    },
  },
  {
    name: 'toastConfig – VISIBLE_MS wynosi 2000',
    run: async () => {
      const mod = await safeImport('src/ui/system/toast/toastConfig.js');
      const ok = mod.VISIBLE_MS === 2000;
      return { ok, details: ok ? '' : `VISIBLE_MS: ${mod.VISIBLE_MS}` };
    },
  },
  {
    name: 'toastConfig – TOAST_EVENT to "mwm:toast"',
    run: async () => {
      const mod = await safeImport('src/ui/system/toast/toastConfig.js');
      const ok = mod.TOAST_EVENT === 'mwm:toast';
      return { ok, details: ok ? '' : `TOAST_EVENT: ${mod.TOAST_EVENT}` };
    },
  },
  {
    name: 'toastConfig – TOAST_CONFIG zawiera typy success/error/warning/info',
    run: async () => {
      const mod = await safeImport('src/ui/system/toast/toastConfig.js');
      const required = ['success', 'error', 'warning', 'info'];
      const missing = required.filter(k => !mod.TOAST_CONFIG?.[k]);
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Brakuje typów: ${missing.join(', ')}` };
    },
  },

  // ─── toastReducer – czysta funkcja, testowalny w Node ─────────────────────
  {
    name: 'toastReducer – PUSH dodaje toast do active gdy jest miejsce',
    run: async () => {
      const { toastReducer, initialState } = await safeImport('src/ui/system/toast/toastReducer.js');
      const toast = { id: '1', type: 'info', message: 'test' };
      const state = toastReducer(initialState, { type: 'PUSH', payload: toast });
      const ok = state.active.length === 1 && state.queue.length === 0;
      return { ok, details: ok ? '' : `active: ${state.active.length}, queue: ${state.queue.length}` };
    },
  },
  {
    name: 'toastReducer – PUSH trafia do kolejki gdy active jest pełne (MAX_ACTIVE=3)',
    run: async () => {
      const { toastReducer, initialState } = await safeImport('src/ui/system/toast/toastReducer.js');
      let state = initialState;
      for (let i = 1; i <= 4; i++) {
        state = toastReducer(state, { type: 'PUSH', payload: { id: String(i), type: 'info', message: `msg${i}` } });
      }
      const ok = state.active.length === 3 && state.queue.length === 1;
      return { ok, details: ok ? '' : `active: ${state.active.length}, queue: ${state.queue.length}` };
    },
  },
  {
    name: 'toastReducer – DISMISS ustawia exiting: true na toaście',
    run: async () => {
      const { toastReducer, initialState } = await safeImport('src/ui/system/toast/toastReducer.js');
      let state = toastReducer(initialState, { type: 'PUSH', payload: { id: 'x', type: 'success', message: 'ok' } });
      state = toastReducer(state, { type: 'DISMISS', id: 'x' });
      const ok = state.active[0]?.exiting === true;
      return { ok, details: ok ? '' : `exiting: ${state.active[0]?.exiting}` };
    },
  },
  {
    name: 'toastReducer – REMOVE usuwa toast i promuje z kolejki',
    run: async () => {
      const { toastReducer, initialState } = await safeImport('src/ui/system/toast/toastReducer.js');
      let state = initialState;
      for (let i = 1; i <= 4; i++) {
        state = toastReducer(state, { type: 'PUSH', payload: { id: String(i), type: 'info', message: `msg${i}` } });
      }
      // Usuń pierwszy z active (id='1') – powinien wejść z queue (id='4')
      state = toastReducer(state, { type: 'REMOVE', id: '1' });
      const ids = state.active.map(t => t.id);
      const ok = state.active.length === 3 && ids.includes('4') && state.queue.length === 0;
      return { ok, details: ok ? '' : `active ids: ${ids}, queue: ${state.queue.length}` };
    },
  },

  // ─── useToastQueue – eksport (checkSourceExport, nie importuje w Node przez useEffect) ──
  {
    name: 'useToastQueue – src/ui/system/toast/useToastQueue.js eksportuje hook',
    run: async () => checkSourceExport('src/ui/system/toast/useToastQueue.js', 'useToastQueue'),
  },
];

export async function runToastTests() {
  return runTests('Toast', tests);
}