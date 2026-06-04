// =============================================================================
// FILE: ipcMainHandlers_search.js
// PATH: src/ipc/ipcMainHandlers_search.js
// VERSION: 0.0.3
// PURPOSE: IPC handler globalnego wyszukiwania (Ctrl+K / sidebar global search).
//          search:global – buduje indeks ze store'ów i przeszukuje go wg query.
// FUNCTIONS: ipc:search:global
// DEPENDS ON: electron, searchIndex.js, notesStore.js, tasksStore.js, projectsStore.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from 'electron';
import { buildSearchIndex, searchAll } from '../utils/searchIndex.js';
import { getAllNotes } from '../stores/notesStore.js';
import { loadTasks } from '../stores/tasksStore.js';
import { loadProjects } from '../stores/projectsStore.js';
import { logDebug, logError } from '../utils/logger.js';

// ─── search:global – przeszukuje profile, projekty, zadania i notatki
//   @param {Object} _ – event IPC (nieużywany)
//   @param {Object} payload
//   @param {string} payload.query   – fraza wyszukiwania
//   @param {Array}  payload.profiles – lista profili (przekazana z renderera, bo profiles są w pamięci)
//   @param {Array}  [payload.types]  – opcjonalny filtr typów ['notes','tasks','projects','profiles']
//   @returns {{ ok: boolean, data: Object }} – przefiltrowane wyniki pogrupowane wg typów
ipcMain.handle('search:global', async (_, { query, profiles = [], types }) => {
  try {
    logDebug('ipc', `search:global query="${query}" types=${JSON.stringify(types ?? 'all')}`);

    // Pobierz dane ze store'ów (main process ma do nich dostęp)
    const [notes, tasks, projects] = await Promise.all([
      Promise.resolve(getAllNotes()),
      Promise.resolve(loadTasks()),
      Promise.resolve(loadProjects()),
    ]);

    // Zbuduj indeks z aktualnych danych
    const index = buildSearchIndex({ profiles, projects, tasks, notes });

    // Przeszukaj
    let results = searchAll(index, query);

    // Opcjonalny filtr typów
    if (Array.isArray(types) && types.length > 0) {
      const allowed = new Set(types);
      results = Object.fromEntries(
        Object.entries(results).filter(([key]) => allowed.has(key))
      );
    }

    const total = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);
    logDebug('ipc', `search:global found ${total} results`);

    return { ok: true, data: results };
  } catch (err) {
    logError('ipc', 'search:global failed', err.message);
    return { ok: false, error: err.message, data: { profiles: [], projects: [], tasks: [], notes: [] } };
  }
});