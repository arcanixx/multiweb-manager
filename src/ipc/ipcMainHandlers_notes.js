// =============================================================================
// FILE: ipcMainHandlers_notes.js
// PATH: src/ipc/ipcMainHandlers_notes.js
// VERSION: 0.0.3
// PURPOSE: IPC dla notatek (Notepad, hooks useNotepad).
// FUNCTIONS: ipc:notes:getAll, ipc:notes:add, ipc:notes:update, ipc:notes:delete
// DEPENDS ON: electron, notesStore.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from "electron";
import {
  getAllNotes,
  addNote,
  updateNote,
  deleteNote
} from "../core/notesStore.js";
import { logError } from "../utils/logger.js";
ipcMain.handle("notes:getAll", async () => {
  try {
    return { ok: true, data: getAllNotes() };
  } catch (err) {
    logError("notes:getAll", err);
    return { ok: false, error: err.message };
  }
});
ipcMain.handle("notes:add", async (_, note) => {
  try {
    return { ok: true, data: addNote(note) };
  } catch (err) {
    logError("notes:add", err);
    return { ok: false, error: err.message };
  }
});
ipcMain.handle("notes:update", async (_, { id, patch }) => {
  try {
    return { ok: true, data: updateNote(id, patch) };
  } catch (err) {
    logError("notes:update", err);
    return { ok: false, error: err.message };
  }
});
ipcMain.handle("notes:delete", async (_, id) => {
  try {
    deleteNote(id);
    return { ok: true };
  } catch (err) {
    logError("notes:delete", err);
    return { ok: false, error: err.message };
  }
});