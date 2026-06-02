// =============================================================================
// FILE: useNotepadContent.js
// PATH: src/hooks/useNotepadContent.js
// VERSION: 0.0.3
// PURPOSE: Hook React do zarządzania treścią notatnika – stan edycji, zapis ręczny, zapis do pliku, skróty klawiszowe.
// FUNCTIONS: useNotepadContent
// DEPENDS ON: react, translations.js, notesStorage.js, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useCallback, useRef } from 'react';
import { saveNotesToStorage } from '../utils/notesStorage.js';
import { logInfo, logError, logWarn } from "../utils/loggerRenderer.js";

// ─── useNotepadContent() – hook do zarządzania treścią i zapisem notatnika
// @param {Object} options
// @param {Object} options.notesRef – ref do stanu zakładek z useNotepadTabs
// @param {Function} options.setNotes – setter stanu zakładek
// @param {Object} options.textareaRef – ref do elementu textarea
// @returns {Object} – stan treści i funkcje edycji/zapisu
export function useNotepadContent({ notesRef, setNotes, textareaRef }) {
  const [content, setContent] = useState('');
  const [dirty, setDirty] = useState(false);

  // Ref dla aktualnej treści (unikanie stale closure)
  const contentRef = useRef(content);
  const setContentWithRef = useCallback((value) => {
    contentRef.current = value;
    setContent(value);
  }, []);

  // ─── handleContentChange() – obsługa zmiany treści (keystroke)
  const handleContentChange = useCallback((e) => {
    setContentWithRef(e.target.value);
    setDirty(true);
  }, [setContentWithRef]);

  // ─── saveCurrentTab() – zapis ręczny aktualnej zakładki
  const saveCurrentTab = useCallback(() => {
    const currentNotes = notesRef.current;
    const active = currentNotes.tabs.find(tab => tab.id === currentNotes.activeTab);
    if (!active) return false;

    const updatedTabs = currentNotes.tabs.map(tab =>
      tab.id === active.id
        ? { ...tab, content: contentRef.current, updatedAt: new Date().toISOString(), lastSaved: Date.now() }
        : tab
    );
    const updatedNotes = { ...currentNotes, tabs: updatedTabs };
    setNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
    setDirty(false);
    logInfo('notepad', `useNotepadContent: saved tab ${active.id}`);
    return true;
  }, [notesRef, setNotes]);

  // ─── saveToFile() – zapisuje zawartość do pliku przez electronAPI
  const saveToFile = useCallback(async (activeTabTitle) => {
    try {
      if (!window.electronAPI?.saveFile) {
        logWarn('ui', 'useNotepadContent.saveToFile: electronAPI.saveFile unavailable');
        return { ok: false, error: 'SAVE_UNAVAILABLE' };
      }

      const result = await window.electronAPI.saveFile({
        content: contentRef.current,
        defaultName: activeTabTitle || 'notatka',
        filters: [{ name: 'Text Files', extensions: ['txt', 'md'] }],
      });

      if (result?.ok) {
        logInfo('ui', 'useNotepadContent.saveToFile success');
        return { ok: true };
      } else {
        logError('ui', 'useNotepadContent.saveToFile failed', result?.error);
        return { ok: false, error: result?.error };
      }
    } catch (err) {
      logError('ui', 'useNotepadContent.saveToFile exception', err.message);
      return { ok: false, error: err.message };
    }
  }, []);

  // ─── handleKeyDown() – obsługa skrótów klawiszowych (Ctrl+S, Ctrl+F, Tab)
  const handleKeyDown = useCallback((e, toggleFind) => {
    // Ctrl+S → zapis ręczny
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      saveCurrentTab();
      return 'saved';
    }
    // Ctrl+F → przełączenie wyszukiwania
    if (e.ctrlKey && e.key === 'f') {
      e.preventDefault();
      toggleFind?.();
      return 'find';
    }
    // Tab → wstawia 2 spacje zamiast zmiany focusu
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef?.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newValue = contentRef.current.substring(0, start) + '  ' + contentRef.current.substring(end);
      setContentWithRef(newValue);
      requestAnimationFrame(() => {
        ta.selectionStart = start + 2;
        ta.selectionEnd = start + 2;
      });
      return 'tab';
    }
    return null;
  }, [saveCurrentTab, setContentWithRef, textareaRef]);

  return {
    content,
    dirty,
    contentRef,
    setContent: setContentWithRef,
    setDirty,
    handleContentChange,
    handleKeyDown,
    saveCurrentTab,
    saveToFile,
  };
}
