// =============================================================================
// FILE: ipcMainHandlers_search.js
// PATH: src/ipc/ipcMainHandlers_search.js
// VERSION: 0.0.3
// PURPOSE: IPC handler globalnego wyszukiwania (Ctrl+K / sidebar global search).
//          search:global – buduje indeks ze store'ów i przeszukuje go wg query.
// FUNCTIONS: const:IPC_CHANNELS.SEARCH.GLOBAL
// DEPENDS ON: electron, searchIndex.js, notepadStore.js, taskPanelStore.js, projectsStore.js, logger.js, ipcChannels.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from 'electron';
import { buildSearchIndex, searchAll } from '../utils/searchIndex.js';
import { getAllnotepad } from '../stores/notepadStore.js';
import { loadTasks } from '../stores/taskPanelStore.js';
import { loadProjects } from '../stores/projectsStore.js';
import { logDebug, logError } from '../utils/logger.js';
import { IPC_CHANNELS } from '../constants/ipcChannels.js';

// ─── search:global – przeszukuje profile, projekty, zadania i notatki
//   @param {Object} _ – event IPC (nieużywany)
//   @param {Object} payload
//   @param {string} payload.query   – fraza wyszukiwania
//   @param {Array}  payload.profiles – lista profili (przekazana z renderera, bo profiles są w pamięci)
//   @param {Array}  [payload.types]  – opcjonalny filtr typów ['notepad','tasks','projects','profiles']
//   @returns {{ ok: boolean, data: Object }} – przefiltrowane wyniki pogrupowane wg typów
ipcMain.handle(IPC_CHANNELS.SEARCH.GLOBAL, async (_, { query, profiles = [], types }) => {
  try {
    logDebug('ipc', `search:global query="${query}" types=${JSON.stringify(types ?? 'all')}`);

    // Pobierz dane ze store'ów (main process ma do nich dostęp)
    const [notepad, tasks, projects] = await Promise.all([
      Promise.resolve(getAllnotepad()),
      Promise.resolve(loadTasks()),
      Promise.resolve(loadProjects()),
    ]);

    // Zbuduj indeks z aktualnych danych
    const index = buildSearchIndex({ profiles, projects, tasks, notepad });

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
    return { ok: false, error: err.message, data: { profiles: [], projects: [], tasks: [], notepad: [] } };
  }
});