// =============================================================================
// FILE: useSidebarSearch.js
// PATH: src/hooks/useSidebarSearch.js
// VERSION: 0.0.3
// PURPOSE: Hook React do wyszukiwania i filtrowania profilów w sidebarze – search, favorites, grupowanie po kategoriach.
// FUNCTIONS: useSidebarSearch
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useMemo, useCallback } from 'react';
import { logDebug } from '../utils/loggerRenderer.js';

// ─── useSidebarSearch() – hook do wyszukiwania i filtrowania profilów
// @param {Array} profiles – lista wszystkich profili
// @returns {Object} – search, setSearch, filtered, favorites, byCategory, hasResults
export function useSidebarSearch(profiles) {
  const [search, setSearch] = useState('');

  const searchLower = search.toLowerCase();

  // ─── filtered – profile pasujące do wyszukiwania
  const filtered = useMemo(() => {
    if (!search.trim()) return profiles;
    return profiles.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      (p.category || '').toLowerCase().includes(searchLower)
    );
  }, [profiles, searchLower]);

  // ─── favorites – ulubione profile (zawsze na górze)
  const favorites = useMemo(() => filtered.filter(p => p.favorite), [filtered]);

  // ─── byCategory – profile pogrupowane po kategoriach
  const byCategory = useMemo(() => {
    const grouped = {};
    filtered.filter(p => !p.favorite).forEach(p => {
      const cat = p.category || '';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(p);
    });
    return grouped;
  }, [filtered]);

  // ─── hasResults – czy są jakiekolwiek wyniki
  const hasResults = useMemo(() => {
    return favorites.length > 0 || Object.keys(byCategory).length > 0;
  }, [favorites, byCategory]);

  const clearSearch = useCallback(() => {
    setSearch('');
    logDebug('ui', 'useSidebarSearch: cleared');
  }, []);

  return {
    search,
    setSearch,
    clearSearch,
    filtered,
    favorites,
    byCategory,
    hasResults,
  };
}
