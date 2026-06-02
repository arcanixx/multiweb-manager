// =============================================================================
// FILE: useCategories.js
// PATH: src/hooks/useCategories.js
// VERSION: 0.0.3
// PURPOSE: Hook React do zarządzania kategoriami profilów – CRUD, stan zwinięcia, persistencja przez IPC.
// FUNCTIONS: useCategories
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useCallback, useEffect } from 'react';
import { logInfo, logError, logWarn, logDebug } from '../utils/loggerRenderer.js';

// ─── useCategories() – hook do zarządzania kategoriami profilów
// @returns {Object} – categories, collapsed, loading, saveCategories, addCategory, updateCategory, deleteCategory, toggleCollapse
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [collapsed, setCollapsed] = useState({});
  const [loading, setLoading] = useState(true);

  // ─── load() – ładuje kategorie i stan zwinięcia z settings
  useEffect(() => {
    const load = async () => {
      try {
        if (!window.electronAPI?.getSettings) {
          setCategories([]);
          setCollapsed({});
          setLoading(false);
          logWarn('settings', 'useCategories: electronAPI.getSettings unavailable');
          return;
        }
        const res = await window.electronAPI.getSettings();
        if (res?.ok) {
          setCategories(res.data?.categories || []);
          setCollapsed(res.data?.collapsedCategories || {});
          logInfo('settings', 'useCategories: loaded', res.data?.categories?.length);
        } else {
          logError('settings', 'useCategories: load failed', res?.error);
        }
      } catch (err) {
        logError('settings', 'useCategories: load exception', err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ─── saveCategories() – zapisuje kategorie i stan zwinięcia
  const saveCategories = useCallback(async (cats, cols = collapsed) => {
    try {
      setCategories(cats);
      if (window.electronAPI?.saveSettings) {
        await window.electronAPI.saveSettings({
          categories: cats,
          collapsedCategories: cols
        });
        logInfo('settings', 'useCategories: saved', cats.length);
      }
      return { ok: true };
    } catch (err) {
      logError('settings', 'useCategories: save failed', err.message);
      return { ok: false, error: err.message };
    }
  }, [collapsed]);

  // ─── addCategory() – dodaje nową kategorię
  const addCategory = useCallback(async (category) => {
    try {
      const newCategories = [...categories, category];
      await saveCategories(newCategories);
      logInfo('settings', 'useCategories: added', category.id);
      return { ok: true, categories: newCategories };
    } catch (err) {
      logError('settings', 'useCategories: add failed', err.message);
      return { ok: false, error: err.message };
    }
  }, [categories, saveCategories]);

  // ─── updateCategory() – aktualizuje kategorię
  const updateCategory = useCallback(async (id, patch) => {
    try {
      const newCategories = categories.map(c => c.id === id ? { ...c, ...patch } : c);
      await saveCategories(newCategories);
      logInfo('settings', 'useCategories: updated', id);
      return { ok: true, categories: newCategories };
    } catch (err) {
      logError('settings', 'useCategories: update failed', err.message);
      return { ok: false, error: err.message };
    }
  }, [categories, saveCategories]);

  // ─── deleteCategory() – usuwa kategorię
  const deleteCategory = useCallback(async (id) => {
    try {
      const newCategories = categories.filter(c => c.id !== id);
      await saveCategories(newCategories);
      logInfo('settings', 'useCategories: deleted', id);
      return { ok: true, categories: newCategories };
    } catch (err) {
      logError('settings', 'useCategories: delete failed', err.message);
      return { ok: false, error: err.message };
    }
  }, [categories, saveCategories]);

  // ─── toggleCollapse() – przełącza stan zwinięcia kategorii
  const toggleCollapse = useCallback(async (catId) => {
    try {
      const newCollapsed = { ...collapsed, [catId]: !collapsed[catId] };
      setCollapsed(newCollapsed);
      await saveCategories(categories, newCollapsed);
      logDebug('settings', 'useCategories: collapse toggled', catId);
      return { ok: true, collapsed: newCollapsed };
    } catch (err) {
      logError('settings', 'useCategories: toggleCollapse failed', err.message);
      return { ok: false, error: err.message };
    }
  }, [categories, collapsed, saveCategories]);

  return {
    categories,
    collapsed,
    loading,
    saveCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCollapse,
  };
}
