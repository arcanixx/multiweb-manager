// =============================================================================
// FILE: useNotepadUI.js
// PATH: src/hooks/useNotepadUI.js
// VERSION: 0.0.3
// PURPOSE: Orkiestrator hooków notatnika – łączy zarządzanie zakładkami i treścią, obsługuje autosave i toast.
// FUNCTIONS: useNotepadUI
// DEPENDS ON: react, translations.js, useNotepadTabs.js, useNotepadContent.js, loggerRenderer.js, notificationsManager.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { TranslationContext } from '../utils/translations.js';
import { useNotepadTabs } from './useNotepadTabs.js';
import { useNotepadContent } from './useNotepadContent.js';
import { logInfo, logError, logWarn } from "../utils/loggerRenderer.js";
import { showToast as showGlobalToast } from '../utils/notificationsManager.js';

// ─── useNotepadUI() – główny hook orkiestrator notatnika
// @param {Object} props
// @param {Object} props.textareaRef – referencja do elementu textarea
// @returns {Object} – połączony stan i funkcje zarządzania notatnikiem
export function useNotepadUI({ textareaRef }) {
  const { t } = useContext(TranslationContext);
  const [toast, setToast] = useState('');
  const [confirmModal, setConfirmModal] = useState(null); // { title, message, onConfirm, onCancel }
  const [isInitialized, setIsInitialized] = useState(false);

  // Ref dla autosave (unikanie stale closure)
  const autosaveRef = useRef({ enabled: true });

  // ─── showConfirm() – wyświetla modal potwierdzenia
  const showConfirm = useCallback((title, message, onConfirm) => {
    setConfirmModal({ title, message, onConfirm, onCancel: () => setConfirmModal(null) });
  }, []);

  // ─── Hooki podrzędne ───
  const {
    notepad, notepadRef, setnotepadWithRef, // Expose setnotepadWithRef for useNotepadContent
    loadnotepad, addTab, switchTab, closeTab, renameTab, getActiveTab, markTabAsDirty,
  } = useNotepadTabs();

  // ─── Callbacks dla useNotepadContent do zarządzania dirty state
  const onContentChangeCallback = useCallback((isDirty) => {
    const activeTab = getActiveTab();
    if (activeTab) {
      markTabAsDirty(activeTab.id, isDirty);
    }
  }, [getActiveTab, markTabAsDirty]);

  const onContentSavedCallback = useCallback((isDirty) => {
    const activeTab = getActiveTab();
    if (activeTab) {
      markTabAsDirty(activeTab.id, isDirty);
    }
  }, [getActiveTab, markTabAsDirty]);

  const {
    content, contentRef, setContent, handleContentChange, handleKeyDown, saveCurrentTab, saveToFile,
  } = useNotepadContent({ notepadRef, setnotepad: setnotepadWithRef, textareaRef, onContentChangeCallback, onContentSavedCallback });

  // ─── showInlineToast() – mini feedback w toolbarze notatnika ("Zapisano")
  //   Celowo oddzielony od globalnego ToastContainer — mały komunikat w kontekście edytora.
  //   Dla błędów używamy showGlobalToast (globalny system UIUX_REQ-021).
  const showInlineToast = useCallback((msg) => {
    setToast(msg);
    const timer = setTimeout(() => setToast(''), 2000);
    return () => clearTimeout(timer);
  }, []);

  // ─── Inicjalizacja – ładowanie notatek przy montowaniu
  useEffect(() => {
    if (isInitialized) return;
    const loaded = loadnotepad();
    const active = loaded.tabs.find(tab => tab.id === loaded.activeTab) ?? loaded.tabs[0]; // Active tab might be dirty from previous session
    setContent(active?.content ?? '');
    setIsInitialized(true);
    logInfo('notepad', 'useNotepadUI: initialized');
  }, [loadnotepad, setContent, isInitialized]);

  // ─── AUTOSAVE – co 5 sekund, tylko gdy content faktycznie się zmienił
  useEffect(() => {
    if (!isInitialized) return;

    const interval = setInterval(() => {
      if (!autosaveRef.current.enabled) return;

      const currentnotepad = notepadRef.current;
      const currentContent = contentRef.current;
      const active = currentnotepad.tabs.find(tab => tab.id === currentnotepad.activeTab);
      if (!active || active.content === currentContent) return;

      const updatedTabs = currentnotepad.tabs.map(tab =>
        tab.id === active.id
          ? { ...tab, content: currentContent, updatedAt: new Date().toISOString(), lastSaved: Date.now() }
          : tab // Keep dirty state for other tabs
      );
      const updatednotepad = { ...currentnotepad, tabs: updatedTabs };
      setnotepadWithRef(updatednotepad); // Use the actual setter
      markTabAsDirty(active.id, false); // Mark active tab as clean after autosave
      logInfo('notepad', `useNotepadUI: autosaved tab ${active.id}`);
    }, 5000);

    return () => clearInterval(interval);
  }, [isInitialized, notepadRef, contentRef, markTabAsDirty, setnotepadWithRef]);

  // ─── Wrapper addTab z aktualizacją contentu
  const wrappedAddTab = useCallback(() => {
    const newTab = addTab(contentRef.current);
    setContent('');
    logInfo('notepad', `useNotepadUI: added tab ${newTab.id}`);
  }, [addTab, contentRef, setContent]);

  // ─── Wrapper switchTab z aktualizacją contentu
  const wrappedSwitchTab = useCallback((tabId) => {
    const currentActiveTab = getActiveTab();
    if (currentActiveTab && currentActiveTab.dirty) {
      showConfirm(
        t('notepad.unsaved_changes_title'),
        t('notepad.unsaved_changes_message'),
        () => {
          const { newContent } = switchTab(tabId, contentRef.current);
          setContent(newContent);
          setConfirmModal(null);
        }
      );
    } else {
      const { newContent } = switchTab(tabId, contentRef.current);
      setContent(newContent);
    }
  }, [switchTab, setContent, contentRef, getActiveTab, showConfirm, t]);

  // ─── Wrapper closeTab z aktualizacją contentu
  const wrappedCloseTab = useCallback((tabId) => {
    const tabToClose = notepadRef.current.tabs.find(tab => tab.id === tabId);
    if (tabToClose && tabToClose.dirty) {
      showConfirm(
        t('notepad.unsaved_changes_title'),
        t('notepad.unsaved_changes_message'),
        () => {
          const result = closeTab(tabId);
          if (result) {
            setContent(result.nextContent);
          }
          setConfirmModal(null);
        }
      );
    } else {
      const result = closeTab(tabId);
      if (result) {
        setContent(result.nextContent);
      }
    }
  }, [closeTab, setContent, notepadRef, getActiveTab, showConfirm, t]);

  // ─── Obsługa beforeunload dla niezapisanych zmian
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const anyDirtyTab = notepadRef.current.tabs.some(tab => tab.dirty);
      if (anyDirtyTab) {
        event.preventDefault();
        event.returnValue = ''; // Standard for showing a confirmation dialog
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [notepadRef]);

  // ─── Wrapper saveCurrentTab z tostem
  const wrappedSaveCurrentTab = useCallback(() => {
    const saved = saveCurrentTab();
    if (saved) {
      showInlineToast(t('notepad.saved'));
    }
  }, [saveCurrentTab, showInlineToast, t]);

  // ─── Wrapper saveToFile z tostem
  const wrappedSaveToFile = useCallback(async () => {
    const activeTab = getActiveTab();
    const result = await saveToFile(activeTab?.title);
    if (result.ok) {
      showInlineToast(t('notepad.saved_to_file'));
    } else if (result.error === 'SAVE_UNAVAILABLE') {
      showInlineToast(t('notepad.save_as_unavailable'));
    } else {
      showGlobalToast('error', t('notepad.save_failed'));
      logWarn('ui', 'useNotepadUI: saveToFile failed', result.error);
    }
  }, [saveToFile, getActiveTab, showInlineToast, t]);

  // ─── Wrapper handleKeyDown z tostem po zapisie
  const wrappedHandleKeyDown = useCallback((e, toggleFind) => {
    const result = handleKeyDown(e, toggleFind);
    if (result === 'saved') {
      showInlineToast(t('notepad.saved'));
    }
    return result;
  }, [handleKeyDown, showInlineToast, t]);

  // Aktywna zakładka jako obiekt (dla UI)
  const activeTabObj = notepad.tabs.find(tab => tab.id === notepad.activeTab) ?? null;

  return {
    // Stan (dirty jest teraz w activeTabObj.dirty)
    notepad, content, toast, activeTabObj,
    dirty: activeTabObj?.dirty ?? false,
    confirmModal, // Expose confirm modal state
    // Refy
    contentRef, textareaRef,
    // Settery
    setContent,
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