// =============================================================================
// FILE: useNotepadUI.js
// PATH: src/hooks/useNotepadUI.js
// VERSION: 0.0.3
// PURPOSE: Hook React do zarządzania interfejsem notatnika – obsługa zakładek, automatycznego zapisu oraz skrótów klawiszowych.
// FUNCTIONS: useNotepadUI
// DEPENDS ON: react, translations.js, notesStorage.js, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { TranslationContext } from '../utils/translations.js';
import { createNewTab, loadNotesFromStorage, saveNotesToStorage } from '../utils/notesStorage.js';
import { logInfo, logError, logWarn } from "../utils/loggerRenderer.js";

// ─── useNotepadUI() – hook do zarządzania stanem notatnika
//   @param {Object} props – obiekt z referencjami
//   @param {Object} props.textareaRef – referencja do elementu textarea
//   @returns {Object} – obiekt ze stanem i funkcjami zarządzania notatnikiem
export function useNotepadUI({ textareaRef }) {
  const { t } = useContext(TranslationContext);
  const [notes, setNotes] = useState({ tabs: [], activeTab: null });
  const [content, setContent] = useState('');
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState('');

  // Refy dla autosave — unikamy stale closure w setInterval
  const contentRef = useRef(content);
  const notesRef = useRef(notes);
  useEffect(() => { contentRef.current = content; }, [content]);
  useEffect(() => { notesRef.current = notes; }, [notes]);

  // Aktywna zakładka jako obiekt (do NotepadStatusBar i zapisu)
  const activeTabObj = notes.tabs.find(tab => tab.id === notes.activeTab) ?? null;

  // ─── showToast() – wyświetla komunikat przez 2 sekundy
  //   @param {string} msg – komunikat do wyświetlenia
  //   @returns {void}
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }, []);
  // -------------------------------------------------------------------------
  // ŁADOWANIE — przy pierwszym montowaniu komponentu
  // -------------------------------------------------------------------------
  useEffect(() => {
    const saved = loadNotesFromStorage();
    if (saved && Array.isArray(saved.tabs) && saved.tabs.length > 0) {
      setNotes(saved);
      const active = saved.tabs.find(tab => tab.id === saved.activeTab) ?? saved.tabs[0];
      setContent(active?.content ?? '');
    } else {
      // Brak zapisanych notatek — tworzenie pierwszej domyślnej zakładki
      const firstTab = createNewTab();
      setNotes({ tabs: [firstTab], activeTab: firstTab.id });
      setContent('');
    }
  }, []);

  // -------------------------------------------------------------------------
  // AUTOSAVE — co 5 sekund, tylko gdy content faktycznie się zmienił
  // -------------------------------------------------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      const currentNotes = notesRef.current;
      const currentContent = contentRef.current;
      const active = currentNotes.tabs.find(tab => tab.id === currentNotes.activeTab);
      if (!active || active.content === currentContent) return;

      const updatedTabs = currentNotes.tabs.map(tab =>
        tab.id === active.id
          ? { ...tab, content: currentContent, updatedAt: new Date().toISOString(), lastSaved: Date.now() }
          : tab
      );
      const updatedNotes = { ...currentNotes, tabs: updatedTabs };
      notesRef.current = updatedNotes;
      setNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);
      setDirty(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // -------------------------------------------------------------------------
  // ZMIANA ZAWARTOŚCI — przy każdym keystroke
  // -------------------------------------------------------------------------
  const handleContentChange = useCallback((e) => {
    setContent(e.target.value);
    setDirty(true);
  }, []);

  // -------------------------------------------------------------------------
  // KEYBOARD SHORTCUTS — Ctrl+S, Ctrl+F, Tab
  // -------------------------------------------------------------------------
  const handleKeyDown = useCallback((e, toggleFind) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      saveCurrentTab();
      return;
    }
    if (e.ctrlKey && e.key === 'f') {
      e.preventDefault();
      toggleFind();
      return;
    }
    // Tab → wstawia 2 spacje zamiast zmiany focusu
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newValue = contentRef.current.substring(0, start) + '  ' + contentRef.current.substring(end);
      setContent(newValue);
      requestAnimationFrame(() => {
        ta.selectionStart = start + 2;
        ta.selectionEnd = start + 2;
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // -------------------------------------------------------------------------
  // ZAPIS RĘCZNY
  // -------------------------------------------------------------------------
  const saveCurrentTab = useCallback(() => {
    const currentNotes = notesRef.current;
    const active = currentNotes.tabs.find(tab => tab.id === currentNotes.activeTab);
    if (!active) return;

    const updatedTabs = currentNotes.tabs.map(tab =>
      tab.id === active.id
        ? { ...tab, content: contentRef.current, updatedAt: new Date().toISOString(), lastSaved: Date.now() }
        : tab
    );
    const updatedNotes = { ...currentNotes, tabs: updatedTabs };
    setNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
    setDirty(false);
    showToast(t('notepad.saved'));
  }, [showToast, t]);

  // ─── saveToFile() – zapisuje zawartość do pliku przez electronAPI
  //   @returns {Promise<void>}
  const saveToFile = useCallback(async () => {
    try {
      if (!window.electronAPI?.saveFile) {
        logWarn('ui', "useNotepadUI.saveToFile: electronAPI.saveFile unavailable");
        showToast(t('notepad.save_as_unavailable'));
        return;
      }

      const result = await window.electronAPI.saveFile({
        content: contentRef.current,
        defaultName: activeTabObj?.title ?? 'notatka',
        filters: [{ name: 'Text Files', extensions: ['txt', 'md'] }],
      });

      if (result?.ok) {
        logInfo("ui", "useNotepadUI.saveToFile success");
        showToast(t('notepad.saved_to_file'));
      } else {
        logError("ui", "useNotepadUI.saveToFile failed", result?.error);
        logWarn("ui", "Nie można zapisać pliku");
      }
    } catch (err) {
      logError("ui", "useNotepadUI.saveToFile exception", err.message);
      logWarn("ui", "Wystąpił błąd podczas zapisu pliku");
    }
  }, [activeTabObj, showToast, t]);

  // -------------------------------------------------------------------------
  // PRZEŁĄCZANIE ZAKŁADKI
  // -------------------------------------------------------------------------
  const switchTab = useCallback((tabId) => {
    const currentNotes = notesRef.current;
    const updatedTabs = currentNotes.tabs.map(tab =>
      tab.id === currentNotes.activeTab ? { ...tab, content: contentRef.current } : tab
    );
    const newActive = updatedTabs.find(tab => tab.id === tabId);
    setNotes({ ...currentNotes, tabs: updatedTabs, activeTab: tabId });
    setContent(newActive?.content ?? '');
    setDirty(false);
  }, []);

  // -------------------------------------------------------------------------
  // ZAMYKANIE ZAKŁADKI
  // -------------------------------------------------------------------------
  const closeTab = useCallback((tabId) => {
    const currentNotes = notesRef.current;
    if (currentNotes.tabs.length <= 1) return;

    const updatedTabs = currentNotes.tabs.filter(tab => tab.id !== tabId);
    let nextActiveId = currentNotes.activeTab;

    if (currentNotes.activeTab === tabId) {
      const idx = currentNotes.tabs.findIndex(tab => tab.id === tabId);
      nextActiveId = updatedTabs[Math.max(0, idx - 1)]?.id ?? null;
    }

    const updatedNotes = { tabs: updatedTabs, activeTab: nextActiveId };
    setNotes(updatedNotes);
    setContent(updatedTabs.find(tab => tab.id === nextActiveId)?.content ?? '');
    saveNotesToStorage(updatedNotes);
    setDirty(false);
  }, []);

  // -------------------------------------------------------------------------
  // ZMIANA NAZWY ZAKŁADKI
  // -------------------------------------------------------------------------
  const renameTab = useCallback((tabId, newTitle) => {
    if (!newTitle?.trim()) return;
    const currentNotes = notesRef.current;
    const updatedTabs = currentNotes.tabs.map(tab =>
      tab.id === tabId ? { ...tab, title: newTitle.trim() } : tab
    );
    const updatedNotes = { ...currentNotes, tabs: updatedTabs };
    setNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
  }, []);

  // -------------------------------------------------------------------------
  // DODAWANIE NOWEJ ZAKŁADKI
  // -------------------------------------------------------------------------
  const addTab = useCallback(() => {
    const currentNotes = notesRef.current;
    const updatedTabs = currentNotes.tabs.map(tab =>
      tab.id === currentNotes.activeTab ? { ...tab, content: contentRef.current } : tab
    );
    const newTab = createNewTab();
    const updatedNotes = { tabs: [...updatedTabs, newTab], activeTab: newTab.id };
    setNotes(updatedNotes);
    setContent('');
    setDirty(false);
    saveNotesToStorage(updatedNotes);
  }, []);

  return {
    notes, content, dirty, toast, activeTabObj,
    contentRef, textareaRef,
    showToast, setContent, setDirty,
    handleContentChange, handleKeyDown,
    saveCurrentTab, saveToFile,
    switchTab, closeTab, renameTab, addTab,
  };
}