// =============================================================================
// FILE: useNotepad.js
// PATH: src/hooks/useNotepad.js
// VERSION: 0.0.3
// PURPOSE: Hook React do zarządzania notatkami użytkownika – obsługa operacji CRUD (Create, Read, Update, Delete) przez mostek IPC.
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
        logInfo("store", "useNotepad.load success", res.data.length);
      } else {
        logError("store", "useNotepad.load failed", res?.error);
        logWarn("store", "Nie można załadować notatek");
      }
      setLoading(false);
    } catch (err) {
      logError("store", "useNotepad.load exception", err.message);
      logWarn("store", "Wystąpił błąd podczas ładowania notatek");
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
        logInfo("store", "useNotepad.add success");
        await load();
      } else {
        logError("store", "useNotepad.add failed", res?.error);
        logWarn("store", "Nie można dodać notatki");
      }
      return res;
    } catch (err) {
      logError("store", "useNotepad.add exception", err.message);
      logWarn("store", "Wystąpił błąd podczas dodawania notatki");
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
        logInfo("store", "useNotepad.update success", id);
        await load();
      } else {
        logError("store", "useNotepad.update failed", res?.error);
        logWarn("store", "Nie można zaktualizować notatki");
      }
      return res;
    } catch (err) {
      logError("store", "useNotepad.update exception", err.message);
      logWarn("store", "Wystąpił błąd podczas aktualizacji notatki");
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
        logInfo("store", "useNotepad.remove success", id);
        await load();
      } else {
        logError("store", "useNotepad.remove failed", res?.error);
        logWarn("store", "Nie można usunąć notatki");
      }
      return res;
    } catch (err) {
      logError("store", "useNotepad.remove exception", err.message);
      logWarn("store", "Wystąpił błąd podczas usuwania notatki");
      return { ok: false, error: err.message };
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { notes, loading, reloadNotes: load, addNote: add, updateNote: update, deleteNote: remove };
}
