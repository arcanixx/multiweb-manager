<!-- =============================================================================
 FILE: pending_updates_for_Definition_Mockups_UI_UX.md
 PATH: doc/pending_updates_for_Definition_Mockups_UI_UX.md
 VERSION: 0.0.3
 PURPOSE: 
 FUNCTIONS: -
 DEPENDS ON: -
 UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
 ============================================================================= -->

## [2026-05-28] Refaktor Notepad — podział na hooki i moduł storage
- **Plik:** `src/ui/notepad/Notepad.jsx`
- **Opis:** Plik zmieniony z monolitu (~400 linii) na czysty loader komponentów (~80 linii). Cała logika wyniesiona do hooków i utility.
- **Nowe zachowanie:** Notepad.jsx importuje `useNotepad` i `useNotepadFindReplace` — sam nie zawiera żadnej logiki biznesowej.
- **Wpływ na inne komponenty:**
  - Nowy plik: `src/hooks/useNotepad.js` — stan zakładek, autosave, zapis, skróty klawiszowe
  - Nowy plik: `src/hooks/useNotepadFindReplace.js` — logika znajdź/zastąp
  - Nowy plik: `src/utils/notesStorage.js` — `createNewTab`, `loadNotesFromStorage`, `saveNotesToStorage`
  - `NotepadTabs`, `NotepadToolbar`, `NotepadFindReplace`, `NotepadStatusBar` — bez zmian w API propsów
