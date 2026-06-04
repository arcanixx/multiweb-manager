// =============================================================================
// FILE: useAsync.js
// PATH: src/hooks/useAsync.js
// VERSION: 0.0.3
// PURPOSE: Generyczny hook do obsługi operacji asynchronicznych (load/error/loading) oraz mutacji z optimistic updates i rollbackiem. Eliminuje duplikację wzorca load() w hookach danych.
// FUNCTIONS: useAsync, useAsyncMutation
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useCallback, useEffect, useRef } from 'react';
import { logDebug, logError } from '../utils/loggerRenderer.js';

// =============================================================================
// ─── useAsync() – hook do ładowania danych asynchronicznych
// =============================================================================
// Wzorzec zastępowany (przed):
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   async function load() {
//     try { setLoading(true); const res = await ...; setData(res.data); }
//     catch (err) { logError(...); }
//     finally { setLoading(false); }
//   }
//   useEffect(() => { load(); }, []);
//
// Wzorzec po:
//   const { data, loading, error, execute } = useAsync(
//     () => window.electronAPI.invoke('key:getAll'),
//     { key: 'useMyHook', initialData: [], runOnMount: true }
//   );
// =============================================================================

// ─── useAsync() – hook do zarządzania cyklem życia operacji asynchronicznej
//   @param {Function} asyncFn        – funkcja async zwracająca { ok, data, error }
//   @param {Object}   opts
//   @param {string}   opts.key         – nazwa do logowania (np. 'useHistoryLog')
//   @param {any}      opts.initialData – wartość początkowa danych (domyślnie null)
//   @param {boolean}  opts.runOnMount  – czy wykonać przy montowaniu (domyślnie true)
//   @returns {{ data, loading, error, execute, reset }}
export function useAsync(asyncFn, { key = 'useAsync', initialData = null, runOnMount = true } = {}) {
  const [data,    setData]    = useState(initialData);
  const [loading, setLoading] = useState(runOnMount);
  const [error,   setError]   = useState(null);

  // Ref zapobiega aktualizacji stanu po odmontowaniu komponentu
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ─── execute() – wykonuje asyncFn i aktualizuje stan
  //   @param {...any} args – argumenty przekazywane do asyncFn
  //   @returns {any} – dane z odpowiedzi lub null przy błędzie
  const execute = useCallback(async (...args) => {
    if (!mountedRef.current) return null;
    setLoading(true);
    setError(null);
    try {
      const res = await asyncFn(...args);
      if (!mountedRef.current) return null;

      if (res?.ok === false) {
        // Handler zwrócił { ok: false, error }
        const errMsg = res.error ?? 'UNKNOWN_ERROR';
        setError(errMsg);
        logError('store', `${key}: execute failed – ${errMsg}`);
        return null;
      }

      // Obsługa: { ok: true, data } lub zwykła wartość
      const result = res?.data !== undefined ? res.data : res;
      setData(result);
      logDebug('store', `${key}: execute success`, Array.isArray(result) ? result.length : typeof result);
      return result;
    } catch (err) {
      if (!mountedRef.current) return null;
      setError(err.message);
      logError('store', `${key}: execute exception – ${err.message}`);
      return null;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [asyncFn, key]);

  // ─── reset() – resetuje stan do wartości początkowej
  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  // Wykonaj przy montowaniu jeśli runOnMount=true
  useEffect(() => {
    if (runOnMount) execute();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, execute, reset };
}

// =============================================================================
// ─── useAsyncMutation() – hook do operacji mutacji z optimistic updates i rollbackiem
// =============================================================================
// Wzorzec:
//   const { execute, loading, error } = useAsyncMutation(
//     (id) => window.electronAPI.invoke('items:delete', { id }),
//     {
//       key: 'useMyHook.remove',
//       onMutate: (id) => ({ snapshot: [...items], next: items.filter(i => i.id !== id) }),
//       onSuccess: (res) => setItems(res.data),
//       onError:   (_err, ctx) => setItems(ctx.snapshot),
//     }
//   );
// =============================================================================

// ─── useAsyncMutation() – hook mutacji z opcjonalnym optimistic update
//   @param {Function} asyncFn  – funkcja async wykonująca mutację
//   @param {Object}   opts
//   @param {string}   opts.key       – nazwa do logowania
//   @param {Function} opts.onMutate  – (args) → { snapshot, next } dla optimistic update
//   @param {Function} opts.onSuccess – (result, ctx) → void po sukcesie
//   @param {Function} opts.onError   – (error, ctx) → void po błędzie (rollback)
//   @param {Function} opts.onSettled – () → void zawsze po zakończeniu
//   @returns {{ execute, loading, error }}
export function useAsyncMutation(asyncFn, {
  key = 'useAsyncMutation',
  onMutate,
  onSuccess,
  onError,
  onSettled,
} = {}) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ─── execute() – wykonuje mutację z opcjonalnym optimistic update i rollbackiem
  //   @param {...any} args – argumenty przekazywane do asyncFn
  //   @returns {{ ok: boolean, data?: any, error?: string }}
  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    // Optimistic update: wywołaj onMutate, zapamiętaj snapshot
    let ctx = null;
    if (onMutate) {
      try {
        ctx = onMutate(...args); // { snapshot, next }
      } catch (mutateErr) {
        logError('store', `${key}: onMutate failed – ${mutateErr.message}`);
      }
    }

    try {
      const res = await asyncFn(...args);
      if (!mountedRef.current) return { ok: false };

      if (res?.ok === false) {
        const errMsg = res.error ?? 'UNKNOWN_ERROR';
        setError(errMsg);
        logError('store', `${key}: mutation failed – ${errMsg}`);
        onError?.(errMsg, ctx);       // rollback
        return { ok: false, error: errMsg };
      }

      const result = res?.data !== undefined ? res.data : res;
      logDebug('store', `${key}: mutation success`);
      onSuccess?.(result, ctx);
      return { ok: true, data: result };
    } catch (err) {
      if (!mountedRef.current) return { ok: false };
      const errMsg = err.message;
      setError(errMsg);
      logError('store', `${key}: mutation exception – ${errMsg}`);
      onError?.(errMsg, ctx);         // rollback
      return { ok: false, error: errMsg };
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        onSettled?.();
      }
    }
  }, [asyncFn, key, onMutate, onSuccess, onError, onSettled]);

  return { execute, loading, error };
}