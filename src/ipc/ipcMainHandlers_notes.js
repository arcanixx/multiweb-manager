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
    logError('ipc', "notes:getAll", err);
    return { ok: false, error: err.message };
  }
});
ipcMain.handle("notes:add", async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'object') {
      throw new Error('NOTE_INVALID_PAYLOAD');
    }
    const note = payload;
    if (!note.id || typeof note.id !== 'string') {
      throw new Error('NOTE_INVALID_ID');
    }
    return { ok: true, data: addNote(note) };
  } catch (err) {
    logError('ipc', "notes:add", err);
    return { ok: false, error: err.message };
  }
});
ipcMain.handle("notes:update", async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'object' || !('id' in payload) || !('patch' in payload)) {
      throw new Error('INVALID_PAYLOAD');
    }
    const { id, patch } = payload;
    if (!id || typeof id !== 'string') throw new Error('NOTE_ID_REQUIRED');
    if (!patch || typeof patch !== 'object') throw new Error('NOTE_INVALID_PATCH');
    return { ok: true, data: updateNote(id, patch) };
  } catch (err) {
    logError('ipc', "notes:update", err);
    return { ok: false, error: err.message };
  }
});
ipcMain.handle("notes:delete", async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'string') {
      throw new Error('NOTE_ID_REQUIRED');
    }
    const id = payload;
    if (!id || typeof id !== 'string') {
      throw new Error('NOTE_ID_REQUIRED');
    }
    deleteNote(id);
    return { ok: true };
  } catch (err) {
    logError('ipc', "notes:delete", err);
    return { ok: false, error: err.message };
  }
});