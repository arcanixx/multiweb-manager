// =============================================================================
// FILE: Shortcut.jsx
// PATH: src/ui/help/Shortcut.jsx
// VERSION: 0.0.3
// PURPOSE: Wiersz skrótu klawiaturowego
// FUNCTIONS: Shortcut
// DEPENDS ON: react, translations.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
export default function Shortcut({ keys, descKey }) {
  const { t } = useContext(TranslationContext);
  const parts = keys.split('+');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', gap: 4, minWidth: 140, flexShrink: 0 }}>
        {parts.map((k, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>+</span>}
            <kbd style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 4,
              padding: '2px 7px', fontSize: 12, fontFamily: 'monospace', color: 'var(--text-primary)',
              boxShadow: '0 1px 0 var(--border)'
            }}>{k}</kbd>
          </React.Fragment>
        ))}
      </div>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t(descKey)}</span>
    </div>
  );
}
