// =============================================================================
// FILE: useAsyncMutation.js
// PATH: src/hooks/useAsyncMutation.js
// VERSION: 0.0.3
// PURPOSE: Hook do operacji mutacji z optimistic updates i rollbackiem.
// FUNCTIONS: useAsyncMutation
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useCallback, useEffect, useRef } from 'react';
import { logDebug, logError } from '../utils/loggerRenderer.js';

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