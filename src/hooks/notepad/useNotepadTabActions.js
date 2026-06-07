// =============================================================================
// FILE: useNotepadTabActions.js
// PATH: src/hooks/notepad/useNotepadTabActions.js
// VERSION: 0.0.3
// PURPOSE: Wrappery dla akcji na zakładkach z logiką walidacji i UI.
// FUNCTIONS: useNotepadTabActions
// DEPENDS ON: react, translations.js, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useCallback, useContext, useEffect } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { logInfo } from '../../utils/loggerRenderer.js';

//Hook integrujący akcje zakładek z logiką potwierdzeń.
export function useNotepadTabActions({
  notepadRef,
  contentRef,
  setContent,
  addTab,
  switchTab,
  closeTab,
  getActiveTab,
  showConfirm,
  hideConfirm
}) {
  const { t } = useContext(TranslationContext);

  // ─── wrappedAddTab
  const wrappedAddTab = useCallback(() => {
    addTab(contentRef.current);
    setContent('');
    logInfo('notepad', 'useNotepadTabActions: added tab');
  }, [addTab, contentRef, setContent]);

  // ─── wrappedSwitchTab
  const wrappedSwitchTab = useCallback((tabId) => {
    const currentActiveTab = getActiveTab();
    if (currentActiveTab && currentActiveTab.dirty) {
      showConfirm(
        t('notepad.unsaved_changes_title'),
        t('notepad.unsaved_changes_message'),
        () => {
          const { newContent } = switchTab(tabId, contentRef.current);
          setContent(newContent);
          hideConfirm();
        }
      );
    } else {
      const { newContent } = switchTab(tabId, contentRef.current);
      setContent(newContent);
    }
  }, [switchTab, setContent, contentRef, getActiveTab, showConfirm, hideConfirm, t]);

  // ─── wrappedCloseTab
  const wrappedCloseTab = useCallback((tabId) => {
    const tabToClose = notepadRef.current.tabs.find(tab => tab.id === tabId);
    if (tabToClose && tabToClose.dirty) {
      showConfirm(
        t('notepad.unsaved_changes_title'),
        t('notepad.unsaved_changes_message'),
        () => {
          const result = closeTab(tabId);
          if (result) setContent(result.nextContent);
          hideConfirm();
        }
      );
    } else {
      const result = closeTab(tabId);
      if (result) setContent(result.nextContent);
    }
  }, [closeTab, setContent, notepadRef, showConfirm, hideConfirm, t]);

  // ─── beforeunload listener
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const anyDirtyTab = notepadRef.current.tabs.some(tab => tab.dirty);
      if (anyDirtyTab) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [notepadRef]);

  return {
    addTab: wrappedAddTab,
    switchTab: wrappedSwitchTab,
    closeTab: wrappedCloseTab
  };
}
