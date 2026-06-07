// =============================================================================
// FILE: useAsync.js
// PATH: src/hooks/useAsync.js
// VERSION: 0.0.3
// PURPOSE: Generyczny hook do obsługi operacji asynchronicznych (ładowanie danych). Eliminuje duplikację wzorca load() w hookach danych.
// FUNCTIONS: useAsync
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