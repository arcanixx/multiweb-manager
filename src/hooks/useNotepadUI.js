// =============================================================================
// FILE: useNotepadUI.js
// PATH: src/hooks/useNotepadUI.js
// VERSION: 0.0.3
// PURPOSE: Orkiestrator hooków notatnika – koordynuje zakładki, treść, modale i akcje użytkownika.
// FUNCTIONS: useNotepadUI
// DEPENDS ON: react, translations.js, useNotepadTabs.js, useNotepadContent.js, useNotepadAutosave.js, useNotepadModals.js, useNotepadTabActions.js, loggerRenderer.js, notificationsManager.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useEffect, useCallback, useContext } from 'react';
import { TranslationContext } from '../utils/translations.js';
import { useNotepadTabs } from './useNotepadTabs.js';
import { useNotepadContent } from './useNotepadContent.js';
import { useNotepadAutosave } from './notepad/useNotepadAutosave.js';
import { useNotepadModals } from './notepad/useNotepadModals.js';
import { useNotepadTabActions } from './notepad/useNotepadTabActions.js';
import { logInfo, logError, logWarn } from "../utils/loggerRenderer.js";
import { showToast as showGlobalToast } from '../utils/notificationsManager.js';

// ─── useNotepadUI() – główny hook orkiestrator notatnika
// @param {Object} props
// @param {Object} props.textareaRef – referencja do elementu textarea
// @returns {Object} – połączony stan i funkcje zarządzania notatnikiem
export function useNotepadUI({ textareaRef }) {
  const { t } = useContext(TranslationContext);
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    notepad, notepadRef, setnotepadWithRef,
    loadnotepad, addTab, switchTab, closeTab, renameTab, getActiveTab, markTabAsDirty,
  } = useNotepadTabs();

  const {
    toast, confirmModal, showConfirm, hideConfirm, showInlineToast
  } = useNotepadModals();

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

  const {
    addTab: wrappedAddTab,
    switchTab: wrappedSwitchTab,
    closeTab: wrappedCloseTab
  } = useNotepadTabActions({
    notepadRef, contentRef, setContent, addTab, switchTab, closeTab, getActiveTab, showConfirm, hideConfirm
  });

  useEffect(() => {
    if (isInitialized) return;
    const loaded = loadnotepad();
    const active = loaded.tabs.find(tab => tab.id === loaded.activeTab) ?? loaded.tabs[0];
    setContent(active?.content ?? '');
    setIsInitialized(true);
    logInfo('notepad', 'useNotepadUI: initialized');
  }, [loadnotepad, setContent, isInitialized]);

  useNotepadAutosave({
    isInitialized,
    notepadRef,
    contentRef,
    markTabAsDirty,
    setnotepadWithRef
  });

  const wrappedSaveCurrentTab = useCallback(() => {
    const saved = saveCurrentTab();
    if (saved) {
      showInlineToast(t('notepad.saved'));
    }
  }, [saveCurrentTab, showInlineToast, t]);

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

  const wrappedHandleKeyDown = useCallback((e, toggleFind) => {
    const result = handleKeyDown(e, toggleFind);
    if (result === 'saved') {
      showInlineToast(t('notepad.saved'));
    }
    return result;
  }, [handleKeyDown, showInlineToast, t]);

  const activeTabObj = notepad.tabs.find(tab => tab.id === notepad.activeTab) ?? null;

  return {
    notepad, content, toast, activeTabObj,
    dirty: activeTabObj?.dirty ?? false,
    confirmModal,
    contentRef, textareaRef,
    setContent,
    handleContentChange,
    handleKeyDown: wrappedHandleKeyDown,
    saveCurrentTab: wrappedSaveCurrentTab,
    saveToFile: wrappedSaveToFile,
    switchTab: wrappedSwitchTab,
    closeTab: wrappedCloseTab,
    renameTab,
    addTab: wrappedAddTab,
  };
}