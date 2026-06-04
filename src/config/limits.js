// =============================================================================
// FILE:       limits.js
// PATH:       src/config/limits.js
// VERSION:    0.0.3
// PURPOSE:    Limity aplikacji – maksymalne liczby elementów w kolekcjach (LIMITS) i helper getLimit.
// FUNCTIONS:  getLimit
// DEPENDS ON: -
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// =============================================================================
// LIMITY
// =============================================================================

export const LIMITS = {
  maxClipboardItems:  50,
  maxRecentApps:      20,
  maxNotepadEntries:  200,
  maxTasks:           2000,
  maxProjects:        200,
  maxHistoryEntries:  5000,
  maxWebviews:        20,
  maxTileViewColumns: 3,
};

// ─── getLimit() – zwraca limit aplikacji o podanym kluczu
//   @param {string} key – klucz limitu w obiekcie LIMITS
//   @returns {number}
export function getLimit(key) {
  return LIMITS[key];
}
