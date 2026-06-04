// =============================================================================
// FILE: notesStore.js
// PATH: src/stores/notesStore.js
// VERSION: 0.0.3
// PURPOSE: Zarządzanie notatkami użytkownika – ładowanie, zapisywanie oraz operacje CRUD na danych notatek.
// FUNCTIONS: getAllNotes, addNote, updateNote, deleteNote
// DEPENDS ON: fs, path, electron, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

//
// ARCHITEKTURA NOTATEK — dwa osobne systemy, celowy podział:
//
//   notepadStore.js  (src/stores/ — ten plik, main process)
//   → Zapis/odczyt notatek przez fs do notes.json w userData
//   → Używany przez: ipcMainHandlers_notes.js (CRUD przez IPC)
//                    ipcMainHandlers_search.js (globalne wyszukiwanie Ctrl+K)
//   → NIE importować w renderer process
//
//   notesStorage.js (src/utils/ — renderer process)
//   → Cache zakładek notatnika w localStorage (fallback gdy IPC niedostępne)
//   → Używany przez: useNotepadContent.js, useNotepadTabs.js
//   → Docelowo zostanie zastąpiony przez StorageService
//
// =============================================================================

import fs from "fs";
import path from "path";
import { app } from "electron";
import { logInfo, logError, logWarn } from "../utils/logger.js";
const NOTES_FILE = path.join(app.getPath("userData"), "notes.json");

// ─── loadStore() – Wczytuje i deserializuje dane notatek z pliku notes.json; w przypadku błędu lub braku pliku zwraca domyślną strukturę z pustą listą
function loadStore() {
  try {
    if (!fs.existsSync(NOTES_FILE)) {
      return { version: "0.0.3", data: [] };
    }
    return JSON.parse(fs.readFileSync(NOTES_FILE, "utf8"));
  } catch (err) {
    logError("store", "notepadStore.loadStore failed", err.message);
    return { version: "0.0.3", data: [] };
  }
}

// ─── saveStore() – Zapisuje aktualną strukturę notatek do pliku notes.json w katalogu danych użytkownika; zwraca true w przypadku powodzenia lub false przy błędzie
function saveStore(store) {
  try {
    // Walidacja przed zapisem
    if (!store.data.every(n => n.id && typeof n.title === 'string')) {
      throw new Error("Validation failed: Note missing ID or Title");
    }
    fs.writeFileSync(NOTES_FILE, JSON.stringify(store, null, 2), "utf8");
    logInfo("store", "notepadStore.saveStore success");
    return true;
  } catch (err) {
    logError("store", "notepadStore.saveStore failed", err.message);
    return false;
  }
}

// ─── getAllNotes() – Pobiera i zwraca tablicę wszystkich zarejestrowanych notatek użytkownika
export function getAllNotes() {
  try {
    return loadStore().data || [];
  } catch (err) {
    logError("store", "notepadStore.getAllNotes failed", err.message);
    return [];
  }
}

// ─── addNote() – Rejestruje nowy obiekt notatki w sklepie danych, zapisuje zmiany na dysku i zwraca nowo utworzoną notatkę
export function addNote(note) {
  try {
    const store = loadStore();
    store.data.push(note);
    saveStore(store);
    logInfo("store", "notepadStore.addNote success", note.id);
    return note;
  } catch (err) {
    logError("store", "notepadStore.addNote failed", err.message);
    return note;
  }
}

// ─── updateNote() – Aktualizuje dane istniejącej notatki o określonym ID za pomocą merge'a z obiektem patch, zapisuje zmiany i zwraca zaktualizowaną notatkę
export function updateNote(id, patch) {
  try {
    const store = loadStore();
    const idx = store.data.findIndex(n => n.id === id);
    if (idx === -1) {
      logWarn("store", "notepadStore.updateNote: Note not found", id);
      return null;
    }
    store.data[idx] = { ...store.data[idx], ...patch };
    saveStore(store);
    logInfo("store", "notepadStore.updateNote success", id);
    return store.data[idx];
  } catch (err) {
    logError("store", "notepadStore.updateNote failed", err.message);
    return null;
  }
}

// ─── deleteNote() – Usuwa notatkę o podanym ID ze sklepu danych, zapisuje zaktualizowany stan na dysku i zwraca true
export function deleteNote(id) {
  try {
    const store = loadStore();
    store.data = store.data.filter(n => n.id !== id);
    saveStore(store);
    logInfo("store", "notepadStore.deleteNote success", id);
    return true;
  } catch (err) {
    logError("store", "notepadStore.deleteNote failed", err.message);
    return false;
  }
}