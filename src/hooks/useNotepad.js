// =============================================================================
// FILE:       useNotepad.js
// PATH:       src/hooks/useNotepad.js
// VERSION:    0.0.3
// PURPOSE:    Hook React do zarządzania notatkami użytkownika – obsługa operacji CRUD
//             (Create, Read, Update, Delete) przez mostek IPC.
//             PODZIAŁ ODPOWIEDZIALNOŚCI:
//               • useNotepad     → CRUD przez IPC (ten plik)
//               • useNotepadUI   → autosave co 5s, stan zakładek, toast (useNotepadUI.js)
//               • useNotepadTabs → logika zakładek (useNotepadTabs.js)
//             Nie dodawać tu autosave ani logiki zakładek — ta logika żyje w useNotepadUI.js.
// FUNCTIONS:  useNotepad
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useEffect, useState } from 'react';
import { logInfo, logError, logWarn } from '../utils/loggerRenderer.js';

// ─── useNotepad() – hook do zarządzania notatkami przez IPC
//
//   Odpowiada wyłącznie za operacje CRUD na notatkach.
//   NIE zawiera autosave (→ useNotepadUI.js) ani logiki zakładek (→ useNotepadTabs.js).
//
//   @returns {{ notes, loading, reloadNotes, addNote, updateNote, deleteNote }}
export function useNotepad() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── load() – ładuje wszystkie notatki z backendu przez IPC
  //   Wywołana automatycznie przy montowaniu hooka (useEffect poniżej).
  //   Dostępna też jako reloadNotes() do ręcznego odświeżenia po zewnętrznej zmianie.
  //   @returns {Promise<void>}
  async function load() {
    try {
      setLoading(true);
      const res = await window.electronAPI.invoke('notes:getAll');
      if (res?.ok) {
        setNotes(res.data);
        logInfo('store', 'useNotepad.load: załadowano notatki', res.data.length);
      } else {
        logError('store', 'useNotepad.load: błąd odpowiedzi IPC', res?.error);
        logWarn('store', 'Nie można załadować notatek');
      }
    } catch (err) {
      logError('store', 'useNotepad.load: wyjątek', err.message);
      logWarn('store', 'Wystąpił błąd podczas ładowania notatek');
    } finally {
      // finally zamiast powtarzanego setLoading(false) w catch/if
      setLoading(false);
    }
  }

  // ─── add() – tworzy nową notatkę i odświeża listę
  //   @param {Object} note – obiekt notatki (title, content, …)
  //   @returns {Promise<{ ok: boolean, error?: string }>}
  async function add(note) {
    try {
      const res = await window.electronAPI.invoke('notes:add', note);
      if (res?.ok) {
        logInfo('store', 'useNotepad.add: notatka dodana');
        await load();
      } else {
        logError('store', 'useNotepad.add: błąd IPC', res?.error);
        logWarn('store', 'Nie można dodać notatki');
      }
      return res;
    } catch (err) {
      logError('store', 'useNotepad.add: wyjątek', err.message);
      logWarn('store', 'Wystąpił błąd podczas dodawania notatki');
      return { ok: false, error: err.message };
    }
  }

  // ─── update() – aktualizuje istniejącą notatkę i odświeża listę
  //   Używaj do ręcznego zapisu. Autosave (co 5s) żyje w useNotepadUI.js.
  //   @param {string} id    – identyfikator notatki
  //   @param {Object} patch – pola do zaktualizowania (częściowy obiekt)
  //   @returns {Promise<{ ok: boolean, error?: string }>}
  async function update(id, patch) {
    try {
      const res = await window.electronAPI.invoke('notes:update', { id, patch });
      if (res?.ok) {
        logInfo('store', 'useNotepad.update: zaktualizowano notatkę', id);
        await load();
      } else {
        logError('store', 'useNotepad.update: błąd IPC', res?.error);
        logWarn('store', 'Nie można zaktualizować notatki');
      }
      return res;
    } catch (err) {
      logError('store', 'useNotepad.update: wyjątek', err.message);
      logWarn('store', 'Wystąpił błąd podczas aktualizacji notatki');
      return { ok: false, error: err.message };
    }
  }

  // ─── remove() – usuwa notatkę i odświeża listę
  //   @param {string} id – identyfikator notatki
  //   @returns {Promise<{ ok: boolean, error?: string }>}
  async function remove(id) {
    try {
      const res = await window.electronAPI.invoke('notes:delete', { id });
      if (res?.ok) {
        logInfo('store', 'useNotepad.remove: usunięto notatkę', id);
        await load();
      } else {
        logError('store', 'useNotepad.remove: błąd IPC', res?.error);
        logWarn('store', 'Nie można usunąć notatki');
      }
      return res;
    } catch (err) {
      logError('store', 'useNotepad.remove: wyjątek', err.message);
      logWarn('store', 'Wystąpił błąd podczas usuwania notatki');
      return { ok: false, error: err.message };
    }
  }

  // ─── Ładowanie przy montowaniu – jednorazowe, bez zależności
  useEffect(() => {
    load();
  }, []);

  return {
    notes,
    loading,
    reloadNotes:  load,
    addNote:      add,
    updateNote:   update,
    deleteNote:   remove,
  };
}

// =============================================================================
// END OF FILE
// =============================================================================
