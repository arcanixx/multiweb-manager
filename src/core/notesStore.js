// =============================================================================
// FILE: notesStore.js
// PATH: src/core/notesStore.js
// VERSION: 0.0.3
// PURPOSE: Zarządzanie notatkami użytkownika
// FUNCTIONS: getAllNotes, addNote, updateNote, deleteNote
// DEPENDS ON: fs, path, electron, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import fs from "fs";
import path from "path";
import { app } from "electron";
import { logInfo, logError } from "../utils/logger.js";
const NOTES_FILE = path.join(app.getPath("userData"), "notes.json");

// ─── loadStore() – Wczytuje i deserializuje dane notatek z pliku notes.json; w przypadku błędu lub braku pliku zwraca domyślną strukturę z pustą listą
function loadStore() {
  try {
    if (!fs.existsSync(NOTES_FILE)) {
      return { version: "0.0.3", data: [] };
    }
    return JSON.parse(fs.readFileSync(NOTES_FILE, "utf8"));
  } catch (err) {
    logError("notesStore.loadStore error", err);
    return { version: "0.0.3", data: [] };
  }
}

// ─── saveStore() – Zapisuje aktualną strukturę notatek do pliku notes.json w katalogu danych użytkownika; zwraca true w przypadku powodzenia lub false przy błędzie
function saveStore(store) {
  try {
    fs.writeFileSync(NOTES_FILE, JSON.stringify(store, null, 2), "utf8");
    return true;
  } catch (err) {
    logError("notesStore.saveStore error", err);
    return false;
  }
}

// ─── getAllNotes() – Pobiera i zwraca tablicę wszystkich zarejestrowanych notatek użytkownika
export function getAllNotes() {
  return loadStore().data;
}
/** Dodaje nową notatkę i zapisuje plik. */

// ─── addNote() – Rejestruje nowy obiekt notatki w sklepie danych, zapisuje zmiany na dysku i zwraca nowo utworzoną notatkę
export function addNote(note) {
  const store = loadStore();
  store.data.push(note);
  saveStore(store);
  logInfo("notesStore.addNote", note.id);
  return note;
}

/** Aktualizuje notatkę po id (patch). Zwraca zaktualizowany obiekt lub null. */

// ─── updateNote() – Aktualizuje dane istniejącej notatki o określonym ID za pomocą merge'a z obiektem patch, zapisuje zmiany i zwraca zaktualizowaną notatkę
export function updateNote(id, patch) {
  const store = loadStore();
  const idx = store.data.findIndex(n => n.id === id);
  if (idx === -1) return null;
  store.data[idx] = { ...store.data[idx], ...patch };
  saveStore(store);
  logInfo("notesStore.updateNote", id);
  return store.data[idx];
}

/** Usuwa notatkę po id. */

// ─── deleteNote() – Usuwa notatkę o podanym ID ze sklepu danych, zapisuje zaktualizowany stan na dysku i zwraca true
export function deleteNote(id) {
  const store = loadStore();
  store.data = store.data.filter(n => n.id !== id);
  saveStore(store);
  logInfo("notesStore.deleteNote", id);
  return true;
}
