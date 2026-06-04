// =============================================================================
// FILE: notesStorage.js
// PATH: src/utils/notesStorage.js
// VERSION: 0.0.3
// PURPOSE: Pomocnicze funkcje zapisu i odczytu notatek oraz fabryka zakładek
// FUNCTIONS: createNewTab, loadNotesFromStorage, saveNotesToStorage
// DEPENDS ON: logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

//
// ARCHITEKTURA NOTATEK — dwa osobne systemy, celowy podział:
//
//   notesStorage.js (src/utils/ — ten plik, renderer process)
//   → Cache zakładek notatnika w localStorage (fallback gdy IPC niedostępne)
//   → Używany przez: useNotepadContent.js, useNotepadTabs.js
//   → Docelowo zostanie zastąpiony przez StorageService
//
//   notepadStore.js  (src/stores/ — main process)
//   → Zapis/odczyt notatek przez fs do notes.json w userData
//   → Używany przez: ipcMainHandlers_notes.js (CRUD przez IPC)
//                    ipcMainHandlers_search.js (globalne wyszukiwanie Ctrl+K)
//   → NIE importować w renderer process
//
// =============================================================================

import { logError } from './logger.js';

// ─── NOTES_STORAGE_KEY – klucz używany do zapisu/odczytu notatek w localStorage (fallback gdy IPC niedostępne)
const NOTES_STORAGE_KEY = 'notepad_notes';

// ─── createNewTab() – Tworzy nową zakładkę notatnika z domyślnymi wartościami (tytuł 'Notatka', pusta treść, timestamp założenia)
//   @param {string} id – opcjonalny identyfikator; jeśli brak, generowany na podstawie Date.now()
//   @returns {Object} – nowy obiekt zakładki
export function createNewTab(id) {
  // Basic validation
  if (id !== undefined && typeof id !== 'string') {
    throw new Error('notesStorage.createNewTab: id must be a string or undefined');
  }

  return {
    id: id || `tab-${Date.now()}`,
    title: 'Notatka',
    content: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSaved: null,
  };
}

// ─── loadNotesFromStorage() – Ładuje notatki z procesu głównego przez electronAPI; jeśli niedostępne, czyta dane z localStorage jako fallback
//   @returns {Array|null} – tablica notatek lub null przy braku danych
export function loadNotesFromStorage() {
  try {
    if (window.electronAPI?.loadNotes) {
      return window.electronAPI.loadNotes();
    }
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    logError('ui', 'notesStorage.loadNotesFromStorage failed', e.message);
  }
  return null;
}

// ─── saveNotesToStorage() – Zapisuje stan notatek przez electronAPI (IPC); jeśli niedostępne, zapisuje do localStorage jako fallback
//   @param {Object} notesState – aktualny stan notatek (zakładki, treści)
//   @returns {void}
export function saveNotesToStorage(notesState) {
  try {
    if (window.electronAPI?.saveNotes) {
      window.electronAPI.saveNotes(notesState);
      return;
    }
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notesState));
  } catch (e) {
    logError('ui', 'notesStorage.saveNotesToStorage failed', e.message);
  }
}