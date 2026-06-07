// =============================================================================
// FILE: useSidebarSearch.js
// PATH: src/hooks/sidebar/useSidebarSearch.js
// VERSION: 0.0.3
// PURPOSE: Hook React do wyszukiwania i filtrowania profilów w sidebarze – tryb lokalny (profile/kategorie) i globalny (notepad, tasks, projects, profiles przez IPC).
// FUNCTIONS: useSidebarSearch
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { logDebug, logError } from '../../utils/loggerRenderer.js';

// ─── DEBOUNCE_MS – opóźnienie wyszukiwania globalnego (ms)
// UWAGA: Ta stała celowo pozostaje w tym pliku – dotyczy wyłącznie logiki tego hooka.
const DEBOUNCE_MS = 300;

// ─── useSidebarSearch() – hook do wyszukiwania i filtrowania profilów
// @param {Array}  profiles – lista wszystkich profili (z App/MainLayout)
// @returns {Object} – search, setSearch, filtered, favorites, byCategory, hasResults,
//                     globalEnabled, setGlobalEnabled, globalResults, isGlobalSearching
export function useSidebarSearch(profiles) {
  const [search, setSearch]               = useState('');
  const [globalEnabled, setGlobalEnabled] = useState(false);
  const [globalResults, setGlobalResults] = useState(null); // null = brak wyników globalnych
  const [isGlobalSearching, setIsGlobalSearching] = useState(false);

  const debounceRef = useRef(null);
  const searchLower = search.toLowerCase();

  // ─── filtered – profile pasujące do wyszukiwania (tryb lokalny)
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

  // ─── hasResults – czy są jakiekolwiek wyniki lokalne
  const hasResults = useMemo(
    () => favorites.length > 0 || Object.keys(byCategory).length > 0,
    [favorites, byCategory]
  );

  // ─── useEffect – globalne wyszukiwanie przez IPC z debounce
  useEffect(() => {
    if (!globalEnabled || !search.trim()) {
      setGlobalResults(null);
      return;
    }

    // Wyczyść poprzedni timer
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setIsGlobalSearching(true);
      try {
        logDebug('ui', `useSidebarSearch: global search "${search}"`);
        const res = await window.electronAPI.invoke('search:global', {
          query: search,
          profiles,
          types: ['notepad', 'tasks', 'projects', 'profiles'],
        });
        if (res?.ok) {
          setGlobalResults(res.data);
          const total = Object.values(res.data).reduce((s, a) => s + a.length, 0);
          logDebug('ui', `useSidebarSearch: global found ${total} results`);
        } else {
          logError('ui', 'useSidebarSearch: global search failed', res?.error);
          setGlobalResults(null);
        }
      } catch (err) {
        logError('ui', 'useSidebarSearch: global search exception', err.message);
        setGlobalResults(null);
      } finally {
        setIsGlobalSearching(false);
      }
    }, DEBOUNCE_MS);

    // Cleanup przy odmontowaniu lub zmianie zależności
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search, globalEnabled, profiles]);

  const clearSearch = useCallback(() => {
    setSearch('');
    setGlobalResults(null);
    logDebug('ui', 'useSidebarSearch: cleared');
  }, []);

  return {
    // Tryb lokalny
    search,
    setSearch,
    clearSearch,
    filtered,
    favorites,
    byCategory,
    hasResults,
    // Tryb globalny
    globalEnabled,
    setGlobalEnabled,
    globalResults,
    isGlobalSearching,
  };
}

