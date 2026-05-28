// =============================================================================
// FILE: CommentModal.jsx
// PATH: src/ui/taskpanel/CommentModal.jsx
// VERSION: 0.0.3
// PURPOSE: Modal podglądu komentarza/kodu do zadania
// FUNCTIONS: CommentModal
// DEPENDS ON: react, translations.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
export default function CommentModal({ task, onClose }) {
  const { t } = useContext(TranslationContext);
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 560 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{ICONS.COMMENT} {task.name}</h3>
          <button className="btn-icon" onClick={onClose}>{ICONS.CLOSE}</button>
        </div>
        {task.desc && <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--text-secondary)' }}>{task.desc}</div>}
        {task.comment && (
          <pre style={{
            background: 'var(--bg-secondary)', padding: 12, borderRadius: 8,
            fontSize: 12, overflowX: 'auto', whiteSpace: 'pre-wrap',
            color: 'var(--text-primary)', fontFamily: "'Cascadia Code','Consolas',monospace"
          }}>{task.comment}</pre>
        )}
        {task.version && <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)' }}>{ICONS.VERSION} v{task.version}</div>}
      </div>
    </div>
  );
}
