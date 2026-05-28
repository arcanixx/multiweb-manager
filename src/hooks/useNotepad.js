// =============================================================================
// FILE: useNotepad.js
// PATH: src/hooks/useNotepad.js
// VERSION: 0.0.3
// PURPOSE: Hook do notesStore – lista notatek, dodawanie, edycja, usuwanie load()           pobiera wszystkie notatki (notes:getAll) add(note)        dodaje notatkę (notes:add) update(id,patch) aktualizuje notatkę (notes:update) remove(id)       usuwa notatkę (notes:delete)
// FUNCTIONS: useNotepad
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useEffect, useState } from "react";
import { logInfo, logError, logWarn } from "../utils/loggerRenderer.js";



// ─── useNotepad() – hook do zarządzania notatkami
//   @returns {Object} – obiekt z notes, loading i funkcjami CRUD
export function useNotepad() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ─── load() – ładuje wszystkie notatki z backendu
  //   @returns {Promise<void>}
  async function load() {
    try {
      setLoading(true);
      const res = await window.electronAPI.invoke("notes:getAll");
      if (res?.ok) {
        setNotes(res.data);
        logInfo("useNotepad.load", res.data.length);
      } else {
        logError("useNotepad.load failed", res?.error);
        logWarn("Nie można załadować notatek");
      }
      setLoading(false);
    } catch (err) {
      logError("useNotepad.load exception", err);
      logWarn("Wystąpił błąd podczas ładowania notatek");
      setLoading(false);
    }
  }
  
  // ─── add() – dodaje nową notatkę
  //   @param {Object} note – obiekt notatki
  //   @returns {Promise<Object>} – wynik operacji
  async function add(note) {
    try {
      const res = await window.electronAPI.invoke("notes:add", note);
      if (res?.ok) {
        logInfo("useNotepad.add success");
        await load();
      } else {
        logError("useNotepad.add failed", res?.error);
        logWarn("Nie można dodać notatki");
      }
      return res;
    } catch (err) {
      logError("useNotepad.add exception", err);
      logWarn("Wystąpił błąd podczas dodawania notatki");
      return { ok: false, error: err.message };
    }
  }

  

  // ─── update() – aktualizuje istniejącą notatkę
  //   @param {string} id – identyfikator notatki
  //   @param {Object} patch – obiekt z polami do zaktualizowania
  //   @returns {Promise<Object>} – wynik operacji
  async function update(id, patch) {
    try {
      const res = await window.electronAPI.invoke("notes:update", { id, patch });
      if (res?.ok) {
        logInfo("useNotepad.update success");
        await load();
      } else {
        logError("useNotepad.update failed", res?.error);
        logWarn("Nie można zaktualizować notatki");
      }
      return res;
    } catch (err) {
      logError("useNotepad.update exception", err);
      logWarn("Wystąpił błąd podczas aktualizacji notatki");
      return { ok: false, error: err.message };
    }
  }

  

  // ─── remove() – usuwa notatkę
  //   @param {string} id – identyfikator notatki
  //   @returns {Promise<Object>} – wynik operacji
  async function remove(id) {
    try {
      const res = await window.electronAPI.invoke("notes:delete", { id });
      if (res?.ok) {
        logInfo("useNotepad.remove success");
        await load();
      } else {
        logError("useNotepad.remove failed", res?.error);
        logWarn("Nie można usunąć notatki");
      }
      return res;
    } catch (err) {
      logError("useNotepad.remove exception", err);
      logWarn("Wystąpił błąd podczas usuwania notatki");
      return { ok: false, error: err.message };
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { notes, loading, reloadNotes: load, addNote: add, updateNote: update, deleteNote: remove };
}
