// =============================================================================
// FILE: useNotepadAutosave.js
// PATH: src/hooks/notepad/useNotepadAutosave.js
// VERSION: 0.0.4
// PURPOSE: Izolowana logika automatycznego zapisu dla notatnika.
// FUNCTIONS: useNotepadAutosave
// DEPENDS ON: react, loggerRenderer.js
// =============================================================================

import { useEffect } from 'react';
import { logInfo } from '../../utils/loggerRenderer.js';

//Hook zarządzający interwałem autosave.
export function useNotepadAutosave({ 
  isInitialized, 
  notepadRef, 
  contentRef, 
  markTabAsDirty, 
  setnotepadWithRef 
}) {
  useEffect(() => {
    if (!isInitialized) return;

    const interval = setInterval(() => {
      const currentNotepad = notepadRef.current;
      const currentContent = contentRef.current;
      const active = currentNotepad.tabs.find(tab => tab.id === currentNotepad.activeTab);
      
      // Zapisuj tylko jeśli treść się zmieniła względem stanu w pamięci
      if (!active || active.content === currentContent) return;

      const updatedTabs = currentNotepad.tabs.map(tab =>
        tab.id === active.id
          ? { ...tab, content: currentContent, updatedAt: new Date().toISOString(), lastSaved: Date.now() }
          : tab
      );

      const updatedNotepad = { ...currentNotepad, tabs: updatedTabs };
      setnotepadWithRef(updatedNotepad);
      markTabAsDirty(active.id, false); 
      logInfo('notepad', `useNotepadAutosave: autosaved tab ${active.id}`);
    }, 5000);

    return () => clearInterval(interval);
  }, [isInitialized, notepadRef, contentRef, markTabAsDirty, setnotepadWithRef]);
}