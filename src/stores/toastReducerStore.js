// =============================================================================
// FILE: toastReducerStore.js
// PATH: src/stores/toastReducerStore.js
// VERSION: 0.0.3
// PURPOSE: Reducer zarządzający stanem kolejki toastów (active + queue FIFO)
// FUNCTIONS: toastReducer
// DEPENDS ON: toastConfig.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { MAX_ACTIVE } from './toastConfig.js';

export const initialState = {
  active: [],  // Aktualnie widoczne toasty (max MAX_ACTIVE)
  queue:  [],  // Czekające na wyświetlenie
};

// Obsługiwane akcje:
//   PUSH    – dodanie nowego toastu; jeśli miejsce → active, inaczej → queue
//   DISMISS – oznaczenie jako wychodzący (uruchamia CSS exit animation)
//   REMOVE  – usunięcie po animacji + promocja następnego z kolejki
export function toastReducer(state, action) {
  switch (action.type) {
    case 'PUSH': {
      const toast = action.payload;
      if (state.active.length < MAX_ACTIVE) {
        return { ...state, active: [...state.active, { ...toast, exiting: false }] };
      }
      return { ...state, queue: [...state.queue, toast] };
    }
    case 'DISMISS':
      return {
        ...state,
        active: state.active.map(t => t.id === action.id ? { ...t, exiting: true } : t),
      };
    case 'REMOVE': {
      const remaining = state.active.filter(t => t.id !== action.id);
      const [next, ...restQueue] = state.queue;
      return {
        active: next ? [...remaining, { ...next, exiting: false }] : remaining,
        queue: restQueue,
      };
    }
    default:
      return state;
  }
}