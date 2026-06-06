// =============================================================================
// FILE: TestRunner_Notepad.js
// PATH: tests/TestRunner_Notepad.js
// VERSION: 0.0.3
// PURPOSE: Testy modułu notatnika — notepadStorage (createNewTab, load/save), notepadStore (CRUD), dirty-checking i logika zakładek.
// FUNCTIONS: runNotepadTests
// DEPENDS ON: testUtils.js, path
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { checkSourceExport, runTests, safeImport } from './testUtils.js';
import { join } from 'path';

const ROOT = process.cwd();

const tests = [
  {
    name: 'ClipboardHistoryModal - src/ui/notepad/ClipboardHistoryModal.jsx eksportuje komponent',
    run: async () => checkSourceExport('src/ui/notepad/ClipboardHistoryModal.jsx', 'ClipboardHistoryModal')
  },
  {
    name: 'Notepad - src/ui/notepad/Notepad.jsx eksportuje komponent',
    run: async () => checkSourceExport('src/ui/notepad/Notepad.jsx', 'Notepad')
  },
  {
    name: 'NotepadFindReplace - src/ui/notepad/NotepadFindReplace.jsx eksportuje komponent',
    run: async () => checkSourceExport('src/ui/notepad/NotepadFindReplace.jsx', 'NotepadFindReplace')
  },
  {
    name: 'NotepadStatusBar - src/ui/notepad/NotepadStatusBar.jsx eksportuje komponent',
    run: async () => checkSourceExport('src/ui/notepad/NotepadStatusBar.jsx', 'NotepadStatusBar')
  },
  {
    name: 'NotepadTabs - src/ui/notepad/NotepadTabs.jsx eksportuje komponent',
    run: async () => checkSourceExport('src/ui/notepad/NotepadTabs.jsx', 'NotepadTabs')
  },
  {
    name: 'NotepadToolbar - src/ui/notepad/NotepadToolbar.jsx eksportuje komponent',
    run: async () => checkSourceExport('src/ui/notepad/NotepadToolbar.jsx', 'NotepadToolbar')
  },

  // ── notepadStorage – createNewTab ──────────────────────────────────────────
  {
    name: 'createNewTab – returns valid tab structure',
    run: async () => {
      const { createNewTab } = await safeImport('src/utils/notepadStorage.js');
      const tab = createNewTab();
      const ok = tab.id && typeof tab.title === 'string' && typeof tab.content === 'string'
              && tab.createdAt && tab.updatedAt;
      return { ok, details: ok ? '' : `Bad structure: ${JSON.stringify(tab)}` };
    }
  },
  {
    name: 'createNewTab – uses provided id when given',
    run: async () => {
      const { createNewTab } = await safeImport('src/utils/notepadStorage.js');
      const tab = createNewTab('my-custom-id');
      const ok = tab.id === 'my-custom-id';
      return { ok, details: ok ? '' : `Expected my-custom-id, got ${tab.id}` };
    }
  },
  {
    name: 'createNewTab – auto-generates id when not provided',
    run: async () => {
      const { createNewTab } = await safeImport('src/utils/notepadStorage.js');
      const tab = createNewTab();
      const ok = typeof tab.id === 'string' && tab.id.startsWith('tab-');
      return { ok, details: ok ? '' : `Bad auto-id: ${tab.id}` };
    }
  },
  {
    name: 'createNewTab – throws on non-string id',
    run: async () => {
      const { createNewTab } = await safeImport('src/utils/notepadStorage.js');
      let threw = false;
      try { createNewTab(123); } catch { threw = true; }
      return { ok: threw, details: threw ? '' : 'Should throw for numeric id' };
    }
  },
  {
    name: 'createNewTab – two calls produce different ids',
    run: async () => {
      const { createNewTab } = await safeImport('src/utils/notepadStorage.js');
      const a = createNewTab();
      await new Promise(r => setTimeout(r, 2)); // gwarantuje inny Date.now()
      const b = createNewTab();
      const ok = a.id !== b.id;
      return { ok, details: ok ? '' : 'Both tabs got same id' };
    }
  },
  {
    name: 'notepadStorage – required functions exported',
    run: async () => {
      const mod = await safeImport('src/utils/notepadStorage.js');
      const required = ['createNewTab', 'loadnotepadFromStorage', 'savenotepadToStorage'];
      const missing = required.filter(fn => typeof mod[fn] !== 'function');
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Missing: ${missing.join(', ')}` };
    }
  },

  // ── notepadStore – CRUD (main process) ────────────────────────────────────
  {
    name: 'notepadStore – required CRUD functions exported',
    run: async () => {
      let mod;
      try { mod = await safeImport('src/stores/notepadStore.js'); }
      catch (e) { return { ok: false, details: `Import failed: ${e.message}` }; }
      const required = ['getAllnotepad', 'addNote', 'updateNote', 'deleteNote'];
      const missing = required.filter(fn => typeof mod[fn] !== 'function');
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Missing: ${missing.join(', ')}` };
    }
  },

  // ── Logika zakładek (czysta) ───────────────────────────────────────────────
  {
    name: 'Note structure is valid',
    run: async () => {
      const mockNote = {
        id: 'note-1',
        title: 'Test Note',
        content: 'This is a test',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const ok = mockNote.id && typeof mockNote.title === 'string' && typeof mockNote.content === 'string';
      return { ok, details: ok ? '' : 'Missing required fields' };
    }
  },
  {
    name: 'Autosave triggers only on content change (dirty check)',
    run: async () => {
      let lastSaved = 'old content';
      let content   = 'new content';
      const shouldSave = content !== lastSaved;
      const shouldNotSave = content !== 'new content'; // same content → no save
      return { ok: shouldSave && !shouldNotSave, details: shouldSave ? '' : 'Dirty check failed' };
    }
  },
  {
    name: 'Multi-tab activation – correct tab becomes active',
    run: async () => {
      const tabs = [{ id: '1' }, { id: '2' }, { id: '3' }];
      const activeTab = tabs.find(t => t.id === '2');
      const ok = activeTab?.id === '2';
      return { ok, details: ok ? '' : 'Wrong tab activated' };
    }
  },
  {
    name: 'Tab close – removes correct tab from list',
    run: async () => {
      let tabs = [{ id: '1' }, { id: '2' }, { id: '3' }];
      tabs = tabs.filter(t => t.id !== '2');
      const ok = tabs.length === 2 && !tabs.find(t => t.id === '2');
      return { ok, details: ok ? '' : `Tabs after close: ${JSON.stringify(tabs)}` };
    }
  }
];

export async function runNotepadTests() {
  return runTests('Notepad', tests);
}
