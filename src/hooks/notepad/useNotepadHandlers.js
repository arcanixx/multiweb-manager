// =============================================================================
// FILE: useNotepadHandlers.js
// PATH: src/hooks/notepad/useNotepadHandlers.js
// VERSION: 0.0.3
// PURPOSE: Hook lokalnych handlerów UI Notepad – zarządza stanem i callbackami dla word wrap, panelu find/replace oraz potwierdzenia zamknięcia zakładki. Oddziela stan UI od JSX orkiestratora Notepad.
// FUNCTIONS: useNotepadHandlers
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useCallback } from 'react';
import { logInfo, logError, logWarn } from '../../utils/loggerRenderer.js';

// ─── useNotepadHandlers() – lokalny stan UI i handlery Notepad
//   @param {Function} params.closeTab – z useNotepadUI (wrappedCloseTab)
//   @returns {Object}

export function useNotepadHandlers({ closeTab }) {
  const [wordWrap,         setWordWrap]         = useState(true);
  const [showFind,         setShowFind]         = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tabIdToDelete,    setTabIdToDelete]    = useState(null);

  // ─── handleToggleFind() – przełącza widoczność panelu Find/Replace
  const handleToggleFind = useCallback(() => {
    try {
      setShowFind(v => !v);
      logInfo('ui', 'Notepad: find panel toggled');
    } catch (err) {
      logError('ui', 'Notepad: toggle find failed', err.message);
      logWarn('ui', 'Wystąpił błąd podczas przełączania wyszukiwania');
    }
  }, []);

  // ─── handleToggleWordWrap() – przełącza zawijanie wierszy
  const handleToggleWordWrap = useCallback(() => {
    try {
      setWordWrap(v => !v);
      logInfo('ui', 'Notepad: word wrap toggled');
    } catch (err) {
      logError('ui', 'Notepad: toggle word wrap failed', err.message);
      logWarn('ui', 'Wystąpił błąd podczas przełączania zawijania wierszy');
    }
  }, []);

  // ─── handleTabCloseClick() – inicjuje zamknięcie zakładki (otwiera modal)
  //   @param {string} tabId
  const handleTabCloseClick = useCallback((tabId) => {
    setTabIdToDelete(tabId);
    setShowDeleteConfirm(true);
  }, []);

  // ─── handleTabCloseConfirm() – potwierdza zamknięcie zakładki
  const handleTabCloseConfirm = useCallback(async () => {
    if (tabIdToDelete) {
      closeTab(tabIdToDelete);
      setTabIdToDelete(null);
    }
    setShowDeleteConfirm(false);
  }, [tabIdToDelete, closeTab]);

  const cancelTabClose = useCallback(() => {
    setShowDeleteConfirm(false);
    setTabIdToDelete(null);
  }, []);

  return {
    wordWrap,
    showFind, setShowFind,
    showDeleteConfirm,
    handleToggleFind,
    handleToggleWordWrap,
    handleTabCloseClick,
    handleTabCloseConfirm,
    cancelTabClose,
  };
}
