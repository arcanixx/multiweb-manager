// =============================================================================
// FILE: useNotepadTabs.js
// PATH: src/hooks/useNotepadTabs.js
// VERSION: 0.0.3
// PURPOSE: Hook React do zarządzania zakładkami notatnika – tworzenie, przełączanie, zamykanie, zmiana nazw.
// FUNCTIONS: useNotepadTabs
// DEPENDS ON: react, notesStorage.js, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useCallback, useRef } from 'react';
import { createNewTab, loadNotesFromStorage, saveNotesToStorage } from '../utils/notesStorage.js';
import { logInfo, logError } from "../utils/loggerRenderer.js";

// ─── useNotepadTabs() – hook do zarządzania zakładkami notatnika
// @returns {Object} – stan zakładek i funkcje operacji na nich
export function useNotepadTabs() {
  const [notes, setNotes] = useState({ tabs: [], activeTab: null });

  // Ref dla aktualnego stanu (unikanie stale closure w callbackach)
  const notesRef = useRef(notes);
  const setNotesWithRef = useCallback((updater) => {
    setNotes(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      notesRef.current = next;
      return next;
    });
  }, []);

  // ─── loadNotes() – ładuje notatki z storage przy inicjalizacji
  const loadNotes = useCallback(() => {
    try {
      const saved = loadNotesFromStorage();
      if (saved && Array.isArray(saved.tabs) && saved.tabs.length > 0) {
        setNotesWithRef(saved);
        logInfo('notepad', 'useNotepadTabs: notes loaded from storage');
        return saved;
      } else {
        const firstTab = createNewTab();
        const initial = { tabs: [firstTab], activeTab: firstTab.id };
        setNotesWithRef(initial);
        saveNotesToStorage(initial);
        logInfo('notepad', 'useNotepadTabs: created default tab');
        return initial;
      }
    } catch (err) {
      logError('notepad', 'useNotepadTabs: failed to load notes', err.message);
      const firstTab = createNewTab();
      const fallback = { tabs: [firstTab], activeTab: firstTab.id };
      setNotesWithRef(fallback);
      return fallback;
    }
  }, [setNotesWithRef]);

  // ─── addTab() – dodaje nową zakładkę
  const addTab = useCallback((currentContent = '') => {
    const currentNotes = notesRef.current;
    const updatedTabs = currentNotes.tabs.map(tab =>
      tab.id === currentNotes.activeTab ? { ...tab, content: currentContent } : tab
    );
    const newTab = createNewTab();
    const updatedNotes = { tabs: [...updatedTabs, newTab], activeTab: newTab.id };
    setNotesWithRef(updatedNotes);
    saveNotesToStorage(updatedNotes);
    logInfo('notepad', `useNotepadTabs: added tab ${newTab.id}`);
    return newTab;
  }, [setNotesWithRef]);

  // ─── switchTab() – przełącza aktywną zakładkę
  const switchTab = useCallback((tabId, currentContent = '') => {
    const currentNotes = notesRef.current;
    const updatedTabs = currentNotes.tabs.map(tab =>
      tab.id === currentNotes.activeTab ? { ...tab, content: currentContent } : tab
    );
    const newActive = updatedTabs.find(tab => tab.id === tabId);
    const updatedNotes = { ...currentNotes, tabs: updatedTabs, activeTab: tabId };
    setNotesWithRef(updatedNotes);
    logInfo('notepad', `useNotepadTabs: switched to tab ${tabId}`);
    return newActive?.content ?? '';
  }, [setNotesWithRef]);

  // ─── closeTab() – zamyka zakładkę (zabezpieczenie: min. 1 zakładka)
  const closeTab = useCallback((tabId) => {
    const currentNotes = notesRef.current;
    if (currentNotes.tabs.length <= 1) return null;

    const updatedTabs = currentNotes.tabs.filter(tab => tab.id !== tabId);
    let nextActiveId = currentNotes.activeTab;

    if (currentNotes.activeTab === tabId) {
      const idx = currentNotes.tabs.findIndex(tab => tab.id === tabId);
      nextActiveId = updatedTabs[Math.max(0, idx - 1)]?.id ?? null;
    }

    const updatedNotes = { tabs: updatedTabs, activeTab: nextActiveId };
    setNotesWithRef(updatedNotes);
    saveNotesToStorage(updatedNotes);

    const nextContent = updatedTabs.find(tab => tab.id === nextActiveId)?.content ?? '';
    logInfo('notepad', `useNotepadTabs: closed tab ${tabId}, next active: ${nextActiveId}`);
    return { nextActiveId, nextContent };
  }, [setNotesWithRef]);

  // ─── renameTab() – zmienia nazwę zakładki
  const renameTab = useCallback((tabId, newTitle) => {
    if (!newTitle?.trim()) return;
    const currentNotes = notesRef.current;
    const updatedTabs = currentNotes.tabs.map(tab =>
      tab.id === tabId ? { ...tab, title: newTitle.trim() } : tab
    );
    const updatedNotes = { ...currentNotes, tabs: updatedTabs };
    setNotesWithRef(updatedNotes);
    saveNotesToStorage(updatedNotes);
    logInfo('notepad', `useNotepadTabs: renamed tab ${tabId} to "${newTitle.trim()}"`);
  }, [setNotesWithRef]);

  // ─── getActiveTab() – zwraca aktualną aktywną zakładkę
  const getActiveTab = useCallback(() => {
    return notesRef.current.tabs.find(tab => tab.id === notesRef.current.activeTab) ?? null;
  }, []);

  return {
    notes,
    notesRef,
    loadNotes,
    addTab,
    switchTab,
    closeTab,
    renameTab,
    getActiveTab,
  };
}
