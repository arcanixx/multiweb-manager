// =============================================================================
// FILE: useNotepad.js
// PATH: src/hooks/useNotepad.js
// VERSION: 0.0.3
// PURPOSE: Hook do notesStore – lista notatek, dodawanie, edycja, usuwanie
//          - load()           pobiera wszystkie notatki (notes:getAll)
//          - add(note)        dodaje notatkę (notes:add)
//          - update(id,patch) aktualizuje notatkę (notes:update)
//          - remove(id)       usuwa notatkę (notes:delete)
// =============================================================================

import { useEffect, useState } from "react";

export function useNotepad() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await window.electronAPI.invoke("notes:getAll");
    if (res?.ok) setNotes(res.data);
    setLoading(false);
  }

  async function add(note) {
    const res = await window.electronAPI.invoke("notes:add", note);
    if (res?.ok) load();
    return res;
  }

  async function update(id, patch) {
    const res = await window.electronAPI.invoke("notes:update", { id, patch });
    if (res?.ok) load();
    return res;
  }

  async function remove(id) {
    const res = await window.electronAPI.invoke("notes:delete", { id });
    if (res?.ok) load();
    return res;
  }

  useEffect(() => {
    load();
  }, []);

  return { notes, loading, reloadNotes: load, addNote: add, updateNote: update, deleteNote: remove };
}

// =============================================================================
// END OF FILE
// =============================================================================
