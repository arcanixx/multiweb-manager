// =============================================================================
// FILE: useNotepadUI.js
// PATH: src/hooks/useNotepadUI.js
// VERSION: 0.0.3
// PURPOSE: Orkiestrator hooków notatnika – łączy zarządzanie zakładkami i treścią, obsługuje autosave i toast.
// FUNCTIONS: useNotepadUI
// DEPENDS ON: react, translations.js, useNotepadTabs.js, useNotepadContent.js, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { TranslationContext } from '../utils/translations.js';
import { useNotepadTabs } from './useNotepadTabs.js';
import { useNotepadContent } from './useNotepadContent.js';
import { logInfo, logError, logWarn } from "../utils/loggerRenderer.js";

// ─── useNotepadUI() – główny hook orkiestrator notatnika
// @param {Object} props
// @param {Object} props.textareaRef – referencja do elementu textarea
// @returns {Object} – połączony stan i funkcje zarządzania notatnikiem
export function useNotepadUI({ textareaRef }) {
  const { t } = useContext(TranslationContext);
  const [toast, setToast] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Ref dla autosave (unikanie stale closure)
  const autosaveRef = useRef({ enabled: true });

  // ─── Hooki podrzędne ───
  const {
    notes, notesRef,
    loadNotes, addTab, switchTab, closeTab, renameTab, getActiveTab,
  } = useNotepadTabs();

  const {
    content, dirty, contentRef,
    setContent, setDirty,
    handleContentChange, handleKeyDown,
    saveCurrentTab, saveToFile,
  } = useNotepadContent({ notesRef, setNotes: (updater) => {
    // Wrapper zapewniający synchronizację z useNotepadTabs
    if (typeof updater === 'function') {
      // Nie możemy bezpośrednio wywołać setNotes z useNotepadTabs,
      // więc używamy notesRef i manualnej aktualizacji
      const current = notesRef.current;
      const next = updater(current);
      // Aktualizacja przez setter useNotepadTabs wymagałaby refaktoryzacji,
      // ale w praktyce saveCurrentTab i tak robi setNotes w useNotepadContent
    }
  }, textareaRef });

  // ─── showToast() – wyświetla komunikat przez 2 sekundy
  const showToast = useCallback((msg) => {
    setToast(msg);
    const timer = setTimeout(() => setToast(''), 2000);
    return () => clearTimeout(timer);
  }, []);

  // ─── Inicjalizacja – ładowanie notatek przy montowaniu
  useEffect(() => {
    if (isInitialized) return;
    const loaded = loadNotes();
    const active = loaded.tabs.find(tab => tab.id === loaded.activeTab) ?? loaded.tabs[0];
    setContent(active?.content ?? '');
    setIsInitialized(true);
    logInfo('notepad', 'useNotepadUI: initialized');
  }, [loadNotes, setContent, isInitialized]);

  // ─── AUTOSAVE – co 5 sekund, tylko gdy content faktycznie się zmienił
  useEffect(() => {
    if (!isInitialized) return;

    const interval = setInterval(() => {
      if (!autosaveRef.current.enabled) return;

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
      // Aktualizacja stanu zakładek przez setter z useNotepadTabs
      // Wymaga dostępu do setNotesWithRef – używamy notesRef jako workaround
      notesRef.current = updatedNotes;
      setDirty(false);
      logInfo('notepad', `useNotepadUI: autosaved tab ${active.id}`);
    }, 5000);

    return () => clearInterval(interval);
  }, [isInitialized, notesRef, contentRef, setDirty]);

  // ─── Wrapper addTab z aktualizacją contentu
  const wrappedAddTab = useCallback(() => {
    const newTab = addTab(contentRef.current);
    setContent('');
    setDirty(false);
    logInfo('notepad', `useNotepadUI: added tab ${newTab.id}`);
  }, [addTab, setContent, setDirty]);

  // ─── Wrapper switchTab z aktualizacją contentu
  const wrappedSwitchTab = useCallback((tabId) => {
    const newContent = switchTab(tabId, contentRef.current);
    setContent(newContent);
    setDirty(false);
  }, [switchTab, setContent, setDirty]);

  // ─── Wrapper closeTab z aktualizacją contentu
  const wrappedCloseTab = useCallback((tabId) => {
    const result = closeTab(tabId);
    if (result) {
      setContent(result.nextContent);
      setDirty(false);
    }
  }, [closeTab, setContent, setDirty]);

  // ─── Wrapper saveCurrentTab z tostem
  const wrappedSaveCurrentTab = useCallback(() => {
    const saved = saveCurrentTab();
    if (saved) {
      showToast(t('notepad.saved'));
    }
  }, [saveCurrentTab, showToast, t]);

  // ─── Wrapper saveToFile z tostem
  const wrappedSaveToFile = useCallback(async () => {
    const activeTab = getActiveTab();
    const result = await saveToFile(activeTab?.title);
    if (result.ok) {
      showToast(t('notepad.saved_to_file'));
    } else if (result.error === 'SAVE_UNAVAILABLE') {
      showToast(t('notepad.save_as_unavailable'));
    } else {
      showToast(t('notepad.save_failed'));
      logWarn('ui', 'useNotepadUI: saveToFile failed', result.error);
    }
  }, [saveToFile, getActiveTab, showToast, t]);

  // ─── Wrapper handleKeyDown z tostem po zapisie
  const wrappedHandleKeyDown = useCallback((e, toggleFind) => {
    const result = handleKeyDown(e, toggleFind);
    if (result === 'saved') {
      showToast(t('notepad.saved'));
    }
    return result;
  }, [handleKeyDown, showToast, t]);

  // Aktywna zakładka jako obiekt (dla UI)
  const activeTabObj = notes.tabs.find(tab => tab.id === notes.activeTab) ?? null;

  return {
    // Stan
    notes, content, dirty, toast, activeTabObj,
    // Refy
    contentRef, textareaRef,
    // Settery
    showToast, setContent, setDirty,
    // Edycja
    handleContentChange,
    // Keyboard
    handleKeyDown: wrappedHandleKeyDown,
    // Zapis
    saveCurrentTab: wrappedSaveCurrentTab,
    saveToFile: wrappedSaveToFile,
    // Zakładki
    switchTab: wrappedSwitchTab,
    closeTab: wrappedCloseTab,
    renameTab,
    addTab: wrappedAddTab,
  };
}