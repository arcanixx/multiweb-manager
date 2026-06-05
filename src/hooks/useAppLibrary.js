// =============================================================================
// FILE: useAppLibrary.js
// PATH: src/hooks/useAppLibrary.js
// VERSION: 0.0.3
// PURPOSE: Hook React do pobierania i wyszukiwania w bibliotece aplikacji (App Library) przez IPC.
// FUNCTIONS: useAppLibrary
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useCallback, useEffect, useContext } from 'react';
import { logInfo, logError, logWarn } from '../utils/loggerRenderer.js';
import { TranslationContext } from '../utils/translations.js';

// ─── useAppLibrary() – hook do zarządzania biblioteką aplikacji przez IPC
// @returns {Object} – categories, loading, search, searchResults, getByCategory
export function useAppLibrary() {
  const { t } = useContext(TranslationContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);

  // ─── ładowanie wszystkich kategorii przy inicjalizacji
  useEffect(() => {
    const load = async () => {
      try {
        const res = await window.electronAPI.invoke('appLibrary:getAll');
        if (res?.ok) {
          const rawData = res.data || [];
          // Mapujemy surowe dane, tłumacząc klucze nazw kategorii na tekst UI
          const translated = rawData.map(cat => ({
            ...cat,
            name: t(cat.name)
          }));
          setCategories(translated);
          logInfo('ui', 'useAppLibrary: loaded and translated', translated.length);
        } else {
          logError('ui', 'useAppLibrary: load failed', res?.error);
          logWarn('ui', 'Nie można załadować biblioteki aplikacji');
        }
      } catch (err) {
        logError('ui', 'useAppLibrary: load exception', err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [t]);

  // ─── search() – wyszukuje aplikacje po frazie przez IPC
  //   @param {string} query – fraza do wyszukania
  const search = useCallback(async (query) => {
    if (!query?.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await window.electronAPI.invoke('appLibrary:search', query);
      if (res?.ok) {
        setSearchResults(res.data || []);
        logInfo('ui', `useAppLibrary: search "${query}" found`, res.data?.length);
      } else {
        logError('ui', 'useAppLibrary: search failed', res?.error);
        setSearchResults([]);
      }
    } catch (err) {
      logError('ui', 'useAppLibrary: search exception', err.message);
      setSearchResults([]);
    }
  }, []);

  // ─── getByCategory() – pobiera aplikacje dla konkretnej kategorii przez IPC
  //   @param {string} categoryId – ID kategorii
  const getByCategory = useCallback(async (categoryId) => {
    try {
      const res = await window.electronAPI.invoke('appLibrary:getByCategory', categoryId);
      if (res?.ok) {
        return res.data || [];
      }
      logError('ui', 'useAppLibrary: getByCategory failed', res?.error);
      return [];
    } catch (err) {
      logError('ui', 'useAppLibrary: getByCategory exception', err.message);
      return [];
    }
  }, []);

  return { categories, loading, search, searchResults, getByCategory };
}
