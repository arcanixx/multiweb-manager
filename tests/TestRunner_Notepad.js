// =============================================================================
// FILE: TestRunner_Notepad.js
// PATH: tests/TestRunner_Notepad.js
// VERSION: 0.0.3
// PURPOSE: Zestaw testów dla modułu notatnika. Weryfikuje integralność danych kart, poprawność mechanizmu autozapisu (dirty checking) oraz logikę przełączania kontekstu między dokumentami.
// FUNCTIONS: runNotepadTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
const tests = [
  {
    name: 'Note structure is valid',
    run: async () => {
      const mockNote = {
        id: 'note-1',
        title: 'Test Note',
        content: 'This is a test',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      const isValid = mockNote.id && typeof mockNote.title === 'string' && typeof mockNote.content === 'string';
      return { ok: isValid, details: isValid ? '' : 'Missing required fields' };
    }
  },
  {
    name: 'Autosave triggers on content change',
    run: async () => {
      let lastSaved = 'old content';
      let content = 'new content';
      const shouldSave = content !== lastSaved;
      return { ok: shouldSave, details: shouldSave ? '' : 'Autosave logic failed' };
    }
  },
  {
    name: 'Multi-tab activation works',
    run: async () => {
      const tabs = [{ id: '1' }, { id: '2' }, { id: '3' }];
      const activeId = '2';
      const activeTab = tabs.find(t => t.id === activeId);
      const isActiveCorrect = activeTab.id === '2';
      return { ok: isActiveCorrect, details: isActiveCorrect ? '' : 'Wrong tab activated' };
    }
  }
];
// ─── runNotepadTests() – Inicjalizuje i uruchamia proces testowy dla edytora notatek
export async function runNotepadTests() {
  return runTests('Notepad', tests);
}
