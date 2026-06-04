// =============================================================================
// FILE: ipcMainHandlers_appLibrary.js
// PATH: src/ipc/ipcMainHandlers_appLibrary.js
// VERSION: 0.0.3
// PURPOSE: IPC dla biblioteki aplikacji (App Library) – pobieranie kategorii, wyszukiwanie, filtrowanie po kategorii.
// FUNCTIONS: ipc:appLibrary:getAll, ipc:appLibrary:search, ipc:appLibrary:getByCategory
// DEPENDS ON: electron, appLibraryStore.js, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from "electron";
import { loadAppLibrary, filterApps, getAppById } from "../stores/appLibraryStore.js";
import { logError } from "../utils/logger.js";

// ─── appLibrary:getAll – zwraca wszystkie kategorie z aplikacjami
ipcMain.handle("appLibrary:getAll", async () => {
  try {
    const categories = loadAppLibrary();
    return { ok: true, data: categories };
  } catch (err) {
    logError('ipc', "appLibrary:getAll failed", err);
    return { ok: false, error: err.message };
  }
});

// ─── appLibrary:search – wyszukuje aplikacje po frazie tekstowej
ipcMain.handle("appLibrary:search", async (_, query) => {
  try {
    if (!query || typeof query !== 'string') {
      throw new Error('INVALID_QUERY');
    }
    const results = filterApps(query);
    return { ok: true, data: results };
  } catch (err) {
    logError('ipc', "appLibrary:search failed", err);
    return { ok: false, error: err.message };
  }
});

// ─── appLibrary:getByCategory – zwraca aplikacje dla konkretnej kategorii
ipcMain.handle("appLibrary:getByCategory", async (_, categoryId) => {
  try {
    if (!categoryId || typeof categoryId !== 'string') {
      throw new Error('INVALID_CATEGORY_ID');
    }
    const categories = loadAppLibrary();
    const category = categories.find(c => c.id === categoryId);
    if (!category) return { ok: true, data: [] };
    return { ok: true, data: category.apps || [] };
  } catch (err) {
    logError('ipc', "appLibrary:getByCategory failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// END OF FILE
// =============================================================================
