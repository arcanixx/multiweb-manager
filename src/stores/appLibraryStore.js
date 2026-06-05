// =============================================================================
// FILE: appLibraryStore.js
// PATH: src/stores/appLibraryStore.js
// VERSION: 0.0.3
// PURPOSE: Statyczna App Library (WebCatalog-style) — udostępnia i filtruje aplikacje z prekompilowanej biblioteki.
// FUNCTIONS: loadAppLibrary, filterApps, searchAppLibrary, getAppById
// DEPENDS ON: logger.js, appLibrary
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logInfo, logError, logWarn } from "../utils/logger.js";
import { APP_LIBRARY } from '../data/appLibrary/index.js';

// ─── loadAppLibrary() – zwraca wszystkie kategorie aplikacji
//   @returns {Array} – tablica kategorii aplikacji
export function loadAppLibrary() {
  logInfo("store", "appLibraryStore.loadAppLibrary success", APP_LIBRARY.categories?.length || 0);
  return APP_LIBRARY.categories || [];
}

// ─── filterApps() – filtrowanie aplikacji po zapytaniu tekstowym
//   @param {string} query – fraza do wyszukania
//   @returns {Array} – tablica dopasowanych aplikacji
export function filterApps(query) {
  try {
    const q = String(query || "").toLowerCase().trim();
    if (!q) return [];
  
    return APP_LIBRARY.apps.filter(
      (app) =>
        app.name?.toLowerCase().includes(q) ||
        app.url?.toLowerCase().includes(q)
    );
  } catch (err) {
    logError("store", "appLibraryStore.filterApps failed", err.message);
    return [];
  }
}

// ─── searchAppLibrary() – alias dla filterApps (kompatybilność wsteczna)
//   @param {string} query – fraza do wyszukania
//   @returns {Array} – tablica dopasowanych aplikacji
export function searchAppLibrary(query) {
  return filterApps(query);
}

// ─── getAppById() – wyszukuje aplikację po ID
//   @param {string} appId – identyfikator aplikacji
//   @returns {Object|null} – obiekt aplikacji z dodanym categoryId lub null
export function getAppById(appId) {
  try {
    const found = APP_LIBRARY.apps.find((a) => a.id === appId);
    if (found) {
      return { ...found, categoryId: found.categoryId }; // Assuming categoryId is already part of the app object in the new structure
    }
    return null;
  } catch (err) {
    logError("store", "appLibraryStore.getAppById failed", err.message);
    return null;
  }
}