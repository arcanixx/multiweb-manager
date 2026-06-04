// =============================================================================
// FILE: notepadStorage.js
// PATH: src/utils/notepadStorage.js
// VERSION: 0.0.3
// PURPOSE: Pomocnicze funkcje zapisu i odczytu notatek oraz fabryka zakładek
// FUNCTIONS: createNewTab, loadnotepadFromStorage, savenotepadToStorage
// DEPENDS ON: logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

//
// ARCHITEKTURA NOTATEK — dwa osobne systemy, celowy podział:
//
//   notepadStorage.js (src/utils/ — ten plik, renderer process)
//   → Cache zakładek notatnika w localStorage (fallback gdy IPC niedostępne)
//   → Używany przez: useNotepadContent.js, useNotepadTabs.js
//   → Docelowo zostanie zastąpiony przez StorageService
//
//   notepadStore.js  (src/stores/ — main process)
//   → Zapis/odczyt notatek przez fs do notepad.json w userData
//   → Używany przez: ipcMainHandlers_notepad.js (CRUD przez IPC)
//                    ipcMainHandlers_search.js (globalne wyszukiwanie Ctrl+K)
//   → NIE importować w renderer process
//
// =============================================================================

import { logError } from './logger.js';

// ─── notepad_STORAGE_KEY – klucz używany do zapisu/odczytu notatek w localStorage (fallback gdy IPC niedostępne)
const notepad_STORAGE_KEY = 'notepad_notepad';

// ─── createNewTab() – Tworzy nową zakładkę notatnika z domyślnymi wartościami (tytuł 'Notatka', pusta treść, timestamp założenia)
//   @param {string} id – opcjonalny identyfikator; jeśli brak, generowany na podstawie Date.now()
//   @returns {Object} – nowy obiekt zakładki
export function createNewTab(id) {
  // Basic validation
  if (id !== undefined && typeof id !== 'string') {
    throw new Error('notepadStorage.createNewTab: id must be a string or undefined');
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

// ─── loadnotepadFromStorage() – Ładuje notatki z procesu głównego przez electronAPI; jeśli niedostępne, czyta dane z localStorage jako fallback
//   @returns {Array|null} – tablica notatek lub null przy braku danych
export function loadnotepadFromStorage() {
  try {
    if (window.electronAPI?.loadnotepad) {
      return window.electronAPI.loadnotepad();
    }
    const raw = localStorage.getItem(notepad_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    logError('ui', 'notepadStorage.loadnotepadFromStorage failed', e.message);
  }
  return null;
}

// ─── savenotepadToStorage() – Zapisuje stan notatek przez electronAPI (IPC); jeśli niedostępne, zapisuje do localStorage jako fallback
//   @param {Object} notepadState – aktualny stan notatek (zakładki, treści)
//   @returns {void}
export function savenotepadToStorage(notepadState) {
  try {
    if (window.electronAPI?.savenotepad) {
      window.electronAPI.savenotepad(notepadState);
      return;
    }
    localStorage.setItem(notepad_STORAGE_KEY, JSON.stringify(notepadState));
  } catch (e) {
    logError('ui', 'notepadStorage.savenotepadToStorage failed', e.message);
  }
}