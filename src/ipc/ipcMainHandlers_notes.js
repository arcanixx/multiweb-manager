// =============================================================================
// FILE: ipcMainHandlers_notepad.js
// PATH: src/ipc/ipcMainHandlers_notepad.js
// VERSION: 0.0.3
// PURPOSE: IPC dla notatek (Notepad, hooks useNotepad).
// FUNCTIONS: ipc:notepad:getAll, ipc:notepad:add, ipc:notepad:update, ipc:notepad:delete
// DEPENDS ON: electron, notepadStore.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from "electron";
import {
  getAllnotepad,
  addNote,
  updateNote,
  deleteNote
} from "../stores/notepadStore.js";
import { logError } from "../utils/logger.js";
ipcMain.handle("notepad:getAll", async () => {
  try {
    return { ok: true, data: getAllnotepad() };
  } catch (err) {
    logError('ipc', "notepad:getAll", err);
    return { ok: false, error: err.message };
  }
});
ipcMain.handle("notepad:add", async (_, payload) => {
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
    logError('ipc', "notepad:add", err);
    return { ok: false, error: err.message };
  }
});
ipcMain.handle("notepad:update", async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'object' || !('id' in payload) || !('patch' in payload)) {
      throw new Error('INVALID_PAYLOAD');
    }
    const { id, patch } = payload;
    if (!id || typeof id !== 'string') throw new Error('NOTE_ID_REQUIRED');
    if (!patch || typeof patch !== 'object') throw new Error('NOTE_INVALID_PATCH');
    return { ok: true, data: updateNote(id, patch) };
  } catch (err) {
    logError('ipc', "notepad:update", err);
    return { ok: false, error: err.message };
  }
});
ipcMain.handle("notepad:delete", async (_, payload) => {
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
    logError('ipc', "notepad:delete", err);
    return { ok: false, error: err.message };
  }
});