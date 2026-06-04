// =============================================================================
// FILE: appLibraryStore.js
// PATH: src/stores/appLibraryStore.js
// VERSION: 0.0.3
// PURPOSE: Statyczna App Library (WebCatalog-style) — odczyt, cache'owanie i filtrowanie aplikacji z pliku JSON (loadAppLibrary, filterApps, searchAppLibrary, getAppById).
// FUNCTIONS: loadAppLibrary, filterApps, searchAppLibrary, getAppById
// DEPENDS ON: fs, path, url, logger.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logInfo, logError, logWarn } from "../utils/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let cached = null;

// ─── readLibrary() – odczytuje i cache'uje bibliotekę aplikacji z pliku JSON
//   @returns {Object} – sparsowany obiekt z biblioteką aplikacji
function readLibrary() {
  if (cached) return cached;

  try {
    const raw = fs.readFileSync(
      path.join(__dirname, "../data/app-library.json"),
      "utf8"
    );
    cached = JSON.parse(raw);
    return cached;
  } catch (err) {
    logError("store", "appLibraryStore.readLibrary failed", err.message);
    logWarn("store", "Nie można załadować biblioteki aplikacji – używam pustego obiektu");
    return { categories: [] };
  }
}

// ─── loadAppLibrary() – ładuje bibliotekę aplikacji z cache
//   @returns {Array} – tablica kategorii aplikacji
export function loadAppLibrary() {
  const lib = readLibrary();
  logInfo("store", "appLibraryStore.loadAppLibrary success", lib.categories?.length || 0);
  return lib.categories || [];
}

// ─── filterApps() – filtrowanie aplikacji po zapytaniu tekstowym
//   @param {string} query – fraza do wyszukania
//   @returns {Array} – tablica dopasowanych aplikacji
export function filterApps(query) {
  const q = String(query || "").toLowerCase().trim();
  if (!q) return [];

  return loadAppLibrary().flatMap((cat) =>
    (cat.apps || []).map((app) => ({ ...app, categoryId: cat.id }))
  ).filter(
    (app) =>
      app.name?.toLowerCase().includes(q) ||
      app.url?.toLowerCase().includes(q)
  );
}

// ─── searchAppLibrary() – alias dla filterApps (kompatybilność wsteczna)
//   @param {string} query – fraza do wyszukania
//   @returns {Array} – tablica dopasowanych aplikacji
export function searchAppLibrary(query) {
  return filterApps(query);
}

// ─── getAppById() – wyszukuje aplikację po ID
//   @param {string} appId – identyfikator aplikacji
//   @returns {Object|null} – obiekt aplikacji lub null
export function getAppById(appId) {
  for (const cat of loadAppLibrary()) {
    const found = (cat.apps || []).find((a) => a.id === appId);
    if (found) return { ...found, categoryId: cat.id };
  }
  return null;
}