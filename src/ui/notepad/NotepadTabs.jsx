// =============================================================================
// FILE: NotepadTabs.jsx
// PATH: src/ui/notepad/NotepadTabs.jsx
// VERSION: 0.0.3
// PURPOSE: Pasek zakładek notatnika
// FUNCTIONS: NotepadTabs
// DEPENDS ON: react, translations.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
export default function NotepadTabs({ tabs, activeId, dirty, onSwitch, onClose, onRename, onAdd }) {
  const { t } = useContext(TranslationContext);
  const handleRename = (tabId, currentTitle) => {
    const newName = prompt(t('notepad.tab_rename'), currentTitle);
    if (newName?.trim()) onRename(tabId, newName);
  };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 2,
      padding: '4px 6px 0', background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)', overflowX: 'auto', flexShrink: 0
    }}>
      {tabs.map(tab => (
        <div key={tab.id}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '5px 10px', borderRadius: '6px 6px 0 0',
            cursor: 'pointer', fontSize: 12, flexShrink: 0, maxWidth: 140,
            background: tab.id === activeId ? 'var(--bg-card)' : 'var(--bg-hover)',
            color: tab.id === activeId ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: tab.id === activeId ? 600 : 400,
            borderTop: tab.id === activeId ? '2px solid var(--accent)' : '2px solid transparent',
          }}
          onClick={() => onSwitch(tab.id)}
          onDoubleClick={() => handleRename(tab.id, tab.title)}
          title={tab.title}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 100 }}>
            {tab.title}
            {tab.id === activeId && dirty && (
              <span style={{ color: 'var(--accent)', marginLeft: 3 }}>{ICONS.NOTEPAD}</span>
            )}
          </span>
          {tabs.length > 1 && (
            <span style={{ fontSize: 10, opacity: 0.5, cursor: 'pointer' }}
              onClick={(e) => { e.stopPropagation(); onClose(tab.id); }}>{ICONS.CLOSE}</span>
          )}
        </div>
      ))}
      <button className="btn-icon" style={{ marginLeft: 2, fontSize: 16, flexShrink: 0 }} onClick={onAdd} title={t('notepad.new_tab')}>
        {ICONS.PLUS}
      </button>
    </div>
  );
}
