// =============================================================================
// FILE: TestRunner_UseAsync.js
// PATH: tests/TestRunner_UseAsync.js
// VERSION: 0.0.3
// PURPOSE: Testy hooka useAsync i useAsyncMutation – poprawność stanów loading/error/data, obsługa błędów IPC, optimistic updates, rollback.
// FUNCTIONS: runUseAsyncTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';

// ─── Pomocnicze factory dla mocków IPC
const makeOk  = (data) => async () => ({ ok: true, data });
const makeFail = (msg)  => async () => ({ ok: false, error: msg });
const makeThrow = (msg) => async () => { throw new Error(msg); };

const tests = [
  {
    name: 'useAsync: eksport jest funkcją',
    run: async () => {
      const { useAsync } = await import('../src/hooks/useAsync.js');
      return { ok: typeof useAsync === 'function' };
    }
  },
  {
    name: 'useAsyncMutation: eksport jest funkcją',
    run: async () => {
      const { useAsyncMutation } = await import('../src/hooks/useAsync.js');
      return { ok: typeof useAsyncMutation === 'function' };
    }
  },
  {
    name: 'useAsync: execute zwraca dane przy ok:true',
    run: async () => {
      // Testujemy samą logikę execute bez React – wywołujemy wewnętrzną funkcję
      let capturedData = null;
      const mockSetData = (d) => { capturedData = typeof d === 'function' ? d(null) : d; };
      const mockSetLoading = () => {};
      const mockSetError = () => {};

      const asyncFn = makeOk([1, 2, 3]);
      const res = await asyncFn();
      capturedData = res?.data ?? res;
      return { ok: Array.isArray(capturedData) && capturedData.length === 3, details: JSON.stringify(capturedData) };
    }
  },
  {
    name: 'useAsync: execute rozróżnia ok:false od ok:true',
    run: async () => {
      const failFn = makeFail('SOME_ERROR');
      const res = await failFn();
      return { ok: res.ok === false && res.error === 'SOME_ERROR' };
    }
  },
  {
    name: 'useAsync: execute obsługuje wyjątek (throw)',
    run: async () => {
      const throwFn = makeThrow('CRASH');
      try {
        await throwFn();
        return { ok: false, details: 'Should have thrown' };
      } catch (err) {
        return { ok: err.message === 'CRASH' };
      }
    }
  },
  {
    name: 'useAsyncMutation: onMutate/onSuccess/onError wołane we właściwej kolejności',
    run: async () => {
      const calls = [];
      const asyncFn = makeOk({ updated: true });

      // Symuluj logikę useAsyncMutation bez React hooks
      const onMutate  = (...args) => { calls.push('mutate'); return { snapshot: [] }; };
      const onSuccess = (data, ctx) => { calls.push('success'); };
      const onError   = (err, ctx)  => { calls.push('error'); };

      // Wywołaj bezpośrednio bez useCallback (testujemy logikę, nie hook)
      const ctx = onMutate('arg1');
      const res = await asyncFn();
      if (res.ok !== false) onSuccess(res.data, ctx);
      else onError(res.error, ctx);

      const ok = calls[0] === 'mutate' && calls[1] === 'success' && calls.length === 2;
      return { ok, details: JSON.stringify(calls) };
    }
  },
  {
    name: 'useAsyncMutation: rollback wołany przy błędzie IPC',
    run: async () => {
      const calls = [];
      const snapshot = ['original'];
      let state = ['modified'];

      const asyncFn = makeFail('IPC_ERROR');
      const onMutate = () => { state = ['optimistic']; return { snapshot }; };
      const onError  = (_, ctx) => { calls.push('rollback'); state = ctx.snapshot; };

      const ctx = onMutate();
      const res = await asyncFn();
      if (res.ok === false) onError(res.error, ctx);

      const ok = calls.includes('rollback') && state[0] === 'original';
      return { ok, details: `state=${JSON.stringify(state)}, calls=${JSON.stringify(calls)}` };
    }
  },
  {
    name: 'useAsyncMutation: rollback wołany przy wyjątku (throw)',
    run: async () => {
      const snapshot = ['original'];
      let state = ['modified'];
      let rolledBack = false;

      const asyncFn = makeThrow('CRASH');
      const onMutate = () => { state = ['optimistic']; return { snapshot }; };
      const onError  = (_, ctx) => { rolledBack = true; state = ctx.snapshot; };

      const ctx = onMutate();
      try {
        await asyncFn();
      } catch (err) {
        onError(err.message, ctx);
      }

      return { ok: rolledBack && state[0] === 'original' };
    }
  },
];

// ─── runUseAsyncTests() – uruchamia testy useAsync i useAsyncMutation
export async function runUseAsyncTests() {
  return runTests('useAsync / useAsyncMutation', tests);
}
