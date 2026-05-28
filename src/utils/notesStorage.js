// =============================================================================
// FILE: notesStorage.js
// PATH: src/utils/notesStorage.js
// VERSION: 0.0.3
// PURPOSE: Pomocnicze funkcje zapisu i odczytu notatek oraz fabryka zakładek
// FUNCTIONS: createNewTab, loadNotesFromStorage, saveNotesToStorage
// DEPENDS ON: logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logError } from './logger.js';
const NOTES_STORAGE_KEY = 'notepad_notes';
// Tworzy nową zakładkę z domyślnymi wartościami
export function createNewTab(id) {
  return {
    id: id || `tab-${Date.now()}`,
    title: 'Notatka',
    content: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSaved: null,
  };
}
// Ładuje notatki z electronAPI (jeśli dostępne) lub localStorage jako fallback
export function loadNotesFromStorage() {
  try {
    if (window.electronAPI?.loadNotes) {
      return window.electronAPI.loadNotes();
    }
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    logError('notesStorage: loadNotesFromStorage error', e);
  }
  return null;
}
// Zapisuje notatki do electronAPI lub localStorage jako fallback
export function saveNotesToStorage(notesState) {
  try {
    if (window.electronAPI?.saveNotes) {
      window.electronAPI.saveNotes(notesState);
      return;
    }
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notesState));
  } catch (e) {
    logError('notesStorage: saveNotesToStorage error', e);
  }
}
