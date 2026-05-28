// =============================================================================
// FILE: NotepadFindReplace.jsx
// PATH: src/ui/notepad/NotepadFindReplace.jsx
// VERSION: 0.0.3
// PURPOSE: Panel znajdź/zastąp w notatniku
// FUNCTIONS: NotepadFindReplace
// DEPENDS ON: react, translations.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
export default function NotepadFindReplace({ findText, onFindTextChange, replaceText, onReplaceTextChange, onFind, onReplace, findCount, onClose }) {
  const { t } = useContext(TranslationContext);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px',
      background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
      flexShrink: 0, flexWrap: 'wrap'
    }}>
      <input className="form-input" style={{ width: 200, height: 28, fontSize: 12 }}
        placeholder={t('notepad.search_placeholder')}
        value={findText} onChange={e => onFindTextChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onFind()} />
      <input className="form-input" style={{ width: 180, height: 28, fontSize: 12 }}
        placeholder={t('notepad.replace_placeholder')}
        value={replaceText} onChange={e => onReplaceTextChange(e.target.value)} />
      <button className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }} onClick={onFind}>
        {ICONS.SEARCH}
      </button>
      <button className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }} onClick={onReplace}>
        {ICONS.REFRESH}
      </button>
      {findCount > 0 && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{findCount} wyników</span>}
      <button className="btn-icon" style={{ marginLeft: 'auto' }} onClick={onClose}>{ICONS.CLOSE}</button>
    </div>
  );
}

