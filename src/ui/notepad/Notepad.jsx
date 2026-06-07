// =============================================================================
// FILE: Notepad.jsx
// PATH: src/ui/notepad/Notepad.jsx
// VERSION: 0.0.3
// PURPOSE: Główny komponent notatnika – czysty orkiestrator. Koordynuje zakładki, edytor, wyszukiwanie i statusbar przez useNotepadUI i useNotepadHandlers.
// FUNCTIONS: Notepad
// DEPENDS ON: react, useNotepadUI.js, useNotepadFindReplace.js, useNotepadHandlers.js, NotepadTabs, NotepadToolbar, NotepadFindReplace, NotepadStatusBar, translations.js, ConfirmModal
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useRef, useContext } from 'react';
import { useNotepadUI }          from '../../hooks/useNotepadUI.js';
import { useNotepadFindReplace } from '../../hooks/useNotepadFindReplace.js';
import { useNotepadHandlers }    from '../../hooks/notepad/useNotepadHandlers.js';
import NotepadTabs               from './NotepadTabs';
import NotepadToolbar            from './NotepadToolbar';
import NotepadFindReplace        from './NotepadFindReplace';
import NotepadStatusBar          from './NotepadStatusBar';
import { TranslationContext }    from '../../utils/translations.js';
import ConfirmModal              from '../modals/ConfirmModal';

// ─── Notepad() – główny komponent notatnika z zakładkami, paskiem narzędzi i wyszukiwaniem
//   @returns {JSX.Element}
export default function Notepad() {
  const textareaRef = useRef(null);
  const { t }       = useContext(TranslationContext);

  // ─── Główny hook orkiestrator notatnika (zakładki, treść, autosave)
  const notepad = useNotepadUI({ textareaRef });

  // ─── Hook funkcjonalności znajdź/zastąp
  const findReplace = useNotepadFindReplace({
    contentRef:  notepad.contentRef,
    textareaRef,
    setContent:  notepad.setContent,
    setDirty:    notepad.setDirty,
  });

  // ─── Hook lokalnego stanu UI (wordWrap, showFind, closeTab confirm)
  const ui = useNotepadHandlers({ closeTab: notepad.closeTab });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>
      <NotepadTabs
        tabs={notepad.notepad.tabs}
        activeId={notepad.notepad.activeTab}
        dirty={notepad.dirty}
        onSwitch={notepad.switchTab}
        onClose={ui.handleTabCloseClick}
        onRename={notepad.renameTab}
        onAdd={notepad.addTab}
        onEdit={notepad.editTab}
      />

      <NotepadToolbar
        onSave={notepad.saveCurrentTab}
        onSaveAs={notepad.saveToFile}
        onToggleFind={ui.handleToggleFind}
        wordWrap={ui.wordWrap}
        onToggleWordWrap={ui.handleToggleWordWrap}
        toast={notepad.toast}
        dirty={notepad.dirty}
      />

      {ui.showFind && (
        <NotepadFindReplace
          findText={findReplace.findText}
          onFindTextChange={findReplace.setFindText}
          replaceText={findReplace.replaceText}
          onReplaceTextChange={findReplace.setReplaceText}
          onFind={findReplace.handleFind}
          onReplace={findReplace.handleReplace}
          findCount={findReplace.findCount}
          onClose={() => ui.setShowFind(false)}
        />
      )}

      <textarea
        ref={textareaRef}
        className="selectable"
        style={{
          flex: 1, padding: 16, resize: 'none',
          border: 'none', outline: 'none',
          background: 'var(--bg-primary)', color: 'var(--text-primary)',
          fontFamily: "'Cascadia Code', monospace", fontSize: 13, lineHeight: 1.7,
          whiteSpace: ui.wordWrap ? 'pre-wrap' : 'pre',
        }}
        value={notepad.content}
        onChange={notepad.handleContentChange}
        onKeyDown={(e) => notepad.handleKeyDown(e, ui.handleToggleFind)}
        spellCheck={false}
      />

      <NotepadStatusBar
        title={notepad.activeTabObj?.title}
        content={notepad.content}
        lastSaved={notepad.activeTabObj?.lastSaved}
      />

      {ui.showDeleteConfirm && (
        <ConfirmModal
          isOpen={ui.showDeleteConfirm}
          title={t('notepad.deleteTabTitle')}
          message={t('notepad.deleteTabMessage')}
          onConfirm={ui.handleTabCloseConfirm}
          onCancel={ui.cancelTabClose}
        />
      )}
    </div>
  );
}