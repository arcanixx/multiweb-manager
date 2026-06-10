// =============================================================================
// FILE: notepadStore.js
// PATH: src/stores/notepadStore.js
// VERSION: 0.0.3
// PURPOSE: Zarządzanie notatkami użytkownika – ładowanie, zapisywanie oraz operacje CRUD na danych notatek.
// FUNCTIONS: getAllNotepad, addNote, updateNote, deleteNote
// DEPENDS ON: fs, path, electron, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

//
// ARCHITEKTURA NOTATEK — dwa osobne systemy, celowy podział:
//
//   notepadStore.js  (src/stores/ — ten plik, main process)
//   → Zapis/odczyt notatek przez fs do notepad.json w userData
//   → Używany przez: ipcMainHandlers_notepad.js (CRUD przez IPC)
//                    ipcMainHandlers_search.js (globalne wyszukiwanie Ctrl+K)
//   → NIE importować w renderer process
//
//   notepadStorage.js (src/utils/ — renderer process)
//   → Cache zakładek notatnika w localStorage (fallback gdy IPC niedostępne)
//   → Używany przez: useNotepadContent.js, useNotepadTabs.js
//   → Docelowo zostanie zastąpiony przez StorageService
//
// =============================================================================

import fs from "fs";
import path from "path";
import { app } from "electron";
import { logInfo, logError, logWarn } from "../utils/logger.js";

// ─── notepad_FILE – ścieżka do notepad.json w userData
//   try/catch – app.getPath() może rzucić przed pełną inicjalizacją Electrona
let notepad_FILE;
try {
  notepad_FILE = path.join(app.getPath("userData"), "notepad.json");
} catch (err) {
  logError("store", "notepadStore: nie można ustalić ścieżki userData – używam fallback", err.message);
  notepad_FILE = path.join(".", "notepad.json");
}

// ─── loadStore() – Wczytuje i deserializuje dane notatek z pliku notepad.json; w przypadku błędu lub braku pliku zwraca domyślną strukturę z pustą listą
function loadStore() {
  try {
    if (!fs.existsSync(notepad_FILE)) {
      return { version: "0.0.3", data: [] };
    }
    return JSON.parse(fs.readFileSync(notepad_FILE, "utf8"));
  } catch (err) {
    logError("store", "notepadStore.loadStore failed", err.message);
    return { version: "0.0.3", data: [] };
  }
}

// ─── saveStore() – Zapisuje aktualną strukturę notatek do pliku notepad.json w katalogu danych użytkownika; zwraca true w przypadku powodzenia lub false przy błędzie
function saveStore(store) {
  try {
    // Walidacja przed zapisem
    if (!store.data.every(n => n.id && typeof n.title === 'string')) {
      throw new Error("Validation failed: Note missing ID or Title");
    }
    // Atomic save: zapis do pliku tymczasowego + rename (zapobiega korupcji przy przerwaniu)
    const tmpFile = notepad_FILE + '.tmp';
    fs.writeFileSync(tmpFile, JSON.stringify(store, null, 2), "utf8");
    fs.renameSync(tmpFile, notepad_FILE);
    logInfo("store", "notepadStore.saveStore success");
    return true;
  } catch (err) {
    logError("store", "notepadStore.saveStore failed", err.message);
    return false;
  }
}

// ─── getAllNotepad() – Pobiera i zwraca tablicę wszystkich zarejestrowanych notatek użytkownika
export function getAllNotepad() {
  try {
    return loadStore().data || [];
  } catch (err) {
    logError("store", "notepadStore.getAllNotepad failed", err.message);
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