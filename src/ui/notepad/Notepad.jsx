// =============================================================================
// FILE: Notepad.jsx
// PATH: src/ui/notepad/Notepad.jsx
// VERSION: 0.0.3
// PURPOSE: Główny komponent notatnika – loader podmodułów i integracja hooków
// FUNCTIONS: Notepad
// DEPENDS ON: react, useNotepadUI.js, useNotepadFindReplace.js, NotepadTabs, NotepadToolbar, NotepadFindReplace, NotepadStatusBar
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useRef } from 'react';
import { useNotepadUI } from '../../hooks/useNotepadUI.js';
import { useNotepadFindReplace } from '../../hooks/useNotepadFindReplace.js';
import NotepadTabs from './NotepadTabs';
import NotepadToolbar from './NotepadToolbar';
import NotepadFindReplace from './NotepadFindReplace';
import NotepadStatusBar from './NotepadStatusBar';
export default function Notepad() {
  const textareaRef = useRef(null);
  const [wordWrap, setWordWrap] = useState(true);
  const [showFind, setShowFind] = useState(false);
  const notepad = useNotepadUI({ textareaRef });
  const findReplace = useNotepadFindReplace({
    contentRef: notepad.contentRef,
    textareaRef,
    setContent: notepad.setContent,
    setDirty: notepad.setDirty,
    showToast: notepad.showToast,
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>
      <NotepadTabs
        tabs={notepad.notes.tabs}
        activeId={notepad.notes.activeTab}
        dirty={notepad.dirty}
        onSwitch={notepad.switchTab}
        onClose={notepad.closeTab}
        onRename={notepad.renameTab}
        onAdd={notepad.addTab}
      />
      <NotepadToolbar
        onSave={notepad.saveCurrentTab}
        onSaveAs={notepad.saveToFile}
        onToggleFind={() => setShowFind(v => !v)}
        wordWrap={wordWrap}
        onToggleWordWrap={() => setWordWrap(v => !v)}
        toast={notepad.toast}
        dirty={notepad.dirty}
      />

      {showFind && (
        <NotepadFindReplace
          findText={findReplace.findText}
          onFindTextChange={findReplace.setFindText}
          replaceText={findReplace.replaceText}
          onReplaceTextChange={findReplace.setReplaceText}
          onFind={findReplace.handleFind}
          onReplace={findReplace.handleReplace}
          findCount={findReplace.findCount}
          onClose={() => setShowFind(false)}
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
          whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
        }}
        value={notepad.content}
        onChange={notepad.handleContentChange}
        onKeyDown={(e) => notepad.handleKeyDown(e, () => setShowFind(v => !v))}
        spellCheck={false}
      />

      <NotepadStatusBar
        title={notepad.activeTabObj?.title}
        content={notepad.content}
        lastSaved={notepad.activeTabObj?.lastSaved}
      />

    </div>
  );
}