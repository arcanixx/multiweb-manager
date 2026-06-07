// =============================================================================
// FILE: useToastQueue.js
// PATH: src/ui/system/toast/useToastQueue.js
// VERSION: 0.0.3
// PURPOSE: Hook zarządzający cyklem życia toastów – subskrypcja eventu, timery, dispatch
// FUNCTIONS: useToastQueue
// DEPENDS ON: react, loggerRenderer.js, toastConfig.js, toastReducer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useReducer, useEffect, useRef, useCallback } from 'react';
import { logDebug } from '../../../utils/loggerRenderer.js';
import { TOAST_EVENT, VISIBLE_MS, ANIMATE_MS } from './toastConfig.js';
import { toastReducer, initialState } from './toastReducer.js';

// ─── useToastQueue() – zarządza kolejką toastów
//   @param {boolean} enabled – czy system toastów jest aktywny
//   @returns {{ active, handleDismiss }}
export function useToastQueue(enabled) {
  const [state, dispatch] = useReducer(toastReducer, initialState);
  const timersRef = useRef(new Map());

  // ─── scheduleToastLifecycle() – planuje DISMISS i REMOVE dla toastu
  const scheduleToastLifecycle = useCallback((id) => {
    const dismissTimer = setTimeout(() => {
      dispatch({ type: 'DISMISS', id });
      const removeTimer = setTimeout(() => {
        dispatch({ type: 'REMOVE', id });
        timersRef.current.delete(id);
        logDebug('ui', `useToastQueue: removed toast ${id}`);
      }, ANIMATE_MS);
      timersRef.current.set(id, removeTimer);
    }, VISIBLE_MS);
    timersRef.current.set(id, dismissTimer);
  }, []);

  // ─── handleDismiss() – natychmiastowe zamknięcie przez użytkownika
  const handleDismiss = useCallback((id) => {
    const timer = timersRef.current.get(id);
    if (timer) { clearTimeout(timer); timersRef.current.delete(id); }
    dispatch({ type: 'DISMISS', id });
    setTimeout(() => dispatch({ type: 'REMOVE', id }), ANIMATE_MS);
  }, []);

  // ─── Subskrypcja CustomEvent z notificationsManager
  useEffect(() => {
    const handleEvent = (event) => {
      if (!enabled) return;
      const { id, type, message } = event.detail;
      logDebug('ui', `useToastQueue: received [${type}] ${message}`);
      dispatch({ type: 'PUSH', payload: { id, type, message } });
    };
    window.addEventListener(TOAST_EVENT, handleEvent);
    return () => window.removeEventListener(TOAST_EVENT, handleEvent);
  }, [enabled]);

  // ─── Planowanie lifecycle dla nowo dodanych toastów
  useEffect(() => {
    state.active.forEach((toast) => {
      if (!toast.exiting && !timersRef.current.has(toast.id)) {
        scheduleToastLifecycle(toast.id);
      }
    });
  }, [state.active, scheduleToastLifecycle]);

  // ─── Cleanup timerów przy unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(t => clearTimeout(t));
      timersRef.current.clear();
    };
  }, []);

  return { active: state.active, handleDismiss };
}
