// =============================================================================
// FILE: useNotepadTabs.js
// PATH: src/hooks/notepad/useNotepadTabs.js
// VERSION: 0.0.3
// PURPOSE: Hook React do zarządzania zakładkami notatnika – tworzenie, przełączanie, zamykanie, zmiana nazw.
// FUNCTIONS: useNotepadTabs
// DEPENDS ON: react, notepadStorage.js, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useCallback, useRef } from 'react';
import { createNewTab, loadnotepadFromStorage, savenotepadToStorage } from '../../utils/notepadStorage.js';
import { logInfo, logError } from "../../utils/loggerRenderer.js";

// ─── useNotepadTabs() – hook do zarządzania zakładkami notatnika
// @returns {Object} – stan zakładek i funkcje operacji na nich
export function useNotepadTabs() {
  const [notepad, setnotepad] = useState({ tabs: [], activeTab: null });

  // Ref dla aktualnego stanu (unikanie stale closure w callbackach)
  const notepadRef = useRef(notepad);
  const setnotepadWithRef = useCallback((updater) => {
    setnotepad(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      notepadRef.current = next;
      return next;
    });
  }, []);

  // ─── updateTabProperty() – aktualizuje dowolną właściwość aktywnej zakładki
  const updateTabProperty = useCallback((tabId, property, value) => {
    setnotepadWithRef(prevnotepad => {
      const updatedTabs = prevnotepad.tabs.map(tab =>
        tab.id === tabId ? { ...tab, [property]: value } : tab
      );
      return { ...prevnotepad, tabs: updatedTabs };
    });
  }, [setnotepadWithRef]);

  // ─── markTabAsDirty() – ustawia flagę dirty dla danej zakładki
  const markTabAsDirty = useCallback((tabId, isDirty) => updateTabProperty(tabId, 'dirty', isDirty), [updateTabProperty]);

  // ─── loadnotepad() – ładuje notatki z storage przy inicjalizacji
  const loadnotepad = useCallback(() => {
    try {
      const saved = loadnotepadFromStorage();
      if (saved && Array.isArray(saved.tabs) && saved.tabs.length > 0) {
        setnotepadWithRef(saved);
        logInfo('notepad', 'useNotepadTabs: notepad loaded from storage');
        return { ...saved, tabs: saved.tabs.map(tab => ({ ...tab, dirty: false })) }; // Ensure loaded tabs are not dirty
      } else {
        const firstTab = createNewTab();
        const initial = { tabs: [firstTab], activeTab: firstTab.id };
        setnotepadWithRef(initial);
        savenotepadToStorage(initial);
        logInfo('notepad', 'useNotepadTabs: created default tab');
        return initial;
      }
    } catch (err) {
      logError('notepad', 'useNotepadTabs: failed to load notepad', err.message);
      const firstTab = createNewTab();
      const fallback = { tabs: [firstTab], activeTab: firstTab.id };
      setnotepadWithRef(fallback);
      return fallback;
    }
  }, [setnotepadWithRef]);

  // ─── addTab() – dodaje nową zakładkę
  const addTab = useCallback((currentContent = '') => {
    const currentnotepad = notepadRef.current;
    const updatedTabs = currentnotepad.tabs.map(tab => // Save content of current active tab and mark it clean
      tab.id === currentnotepad.activeTab ? { ...tab, content: currentContent, dirty: false } : tab
    );
    const newTab = { ...createNewTab(), dirty: false }; // New tab is not dirty
    const updatednotepad = { tabs: [...updatedTabs, newTab], activeTab: newTab.id };
    setnotepadWithRef(updatednotepad);
    savenotepadToStorage(updatednotepad);
    logInfo('notepad', `useNotepadTabs: added tab ${newTab.id}`);
    return newTab;
  }, [setnotepadWithRef]);

  // ─── switchTab() – przełącza aktywną zakładkę
  const switchTab = useCallback((tabId, currentContent = '') => {
    const currentnotepad = notepadRef.current;
    const oldActiveTab = currentnotepad.tabs.find(tab => tab.id === currentnotepad.activeTab);
    const oldTabDirty = oldActiveTab?.dirty ?? false;

    const updatedTabs = currentnotepad.tabs.map(tab => // Save content of current active tab and mark it clean
      tab.id === currentnotepad.activeTab ? { ...tab, content: currentContent, dirty: false } : tab
    );

    const newActive = updatedTabs.find(tab => tab.id === tabId);
    const updatednotepad = { ...currentnotepad, tabs: updatedTabs, activeTab: tabId };
    setnotepadWithRef(updatednotepad);
    logInfo('notepad', `useNotepadTabs: switched to tab ${tabId}`);
    return { newContent: newActive?.content ?? '', oldTabDirty };
  }, [setnotepadWithRef]);

  // ─── closeTab() – zamyka zakładkę (zabezpieczenie: min. 1 zakładka)
  const closeTab = useCallback((tabId) => {
    const currentnotepad = notepadRef.current;
    if (currentnotepad.tabs.length <= 1) return null;

    const tabToClose = currentnotepad.tabs.find(tab => tab.id === tabId);
    const oldTabDirty = tabToClose?.dirty ?? false;

    const updatedTabs = currentnotepad.tabs.filter(tab => tab.id !== tabId);
    let nextActiveId = currentnotepad.activeTab;

    if (currentnotepad.activeTab === tabId) {
      const idx = currentnotepad.tabs.findIndex(tab => tab.id === tabId);
      nextActiveId = updatedTabs[Math.max(0, idx - 1)]?.id ?? null;
    }

    const updatednotepad = { tabs: updatedTabs, activeTab: nextActiveId };
    setnotepadWithRef(updatednotepad);
    savenotepadToStorage(updatednotepad);

    const nextContent = updatedTabs.find(tab => tab.id === nextActiveId)?.content ?? '';
    logInfo('notepad', `useNotepadTabs: closed tab ${tabId}, next active: ${nextActiveId}`);
    return { nextActiveId, nextContent, oldTabDirty };
  }, [setnotepadWithRef]);

  // ─── renameTab() – zmienia nazwę zakładki
  const renameTab = useCallback((tabId, newTitle) => {
    if (!newTitle?.trim()) return;
    const currentnotepad = notepadRef.current;
    const updatedTabs = currentnotepad.tabs.map(tab =>
      tab.id === tabId ? { ...tab, title: newTitle.trim() } : tab
    );
    const updatednotepad = { ...currentnotepad, tabs: updatedTabs };
    setnotepadWithRef(updatednotepad);
    savenotepadToStorage(updatednotepad);
    logInfo('notepad', `useNotepadTabs: renamed tab ${tabId} to "${newTitle.trim()}"`);
  }, [setnotepadWithRef]);

  // ─── getActiveTab() – zwraca aktualną aktywną zakładkę
  const getActiveTab = useCallback(() => {
    return notepadRef.current.tabs.find(tab => tab.id === notepadRef.current.activeTab) ?? null;
  }, []);

  return {
    notepad,
    notepadRef,
    setnotepadWithRef,
    loadnotepad,
    addTab,
    switchTab,
    markTabAsDirty,
    closeTab,
    renameTab,
    getActiveTab,
  };
}