// =============================================================================
// FILE: HelpSection.jsx
// PATH: src/ui/help/HelpSection.jsx
// VERSION: 0.0.3
// PURPOSE: Rozwijana sekcja pomocy (tytuł + treść)
// FUNCTIONS: HelpSection
// DEPENDS ON: react, translations.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
export default function HelpSection({ id, icon, titleKey, children }) {
  const { t } = useContext(TranslationContext);
  const [open, setOpen] = useState(id === 'profiles');
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 10, marginBottom: 12, overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', cursor: 'pointer',
          background: open ? 'var(--bg-active)' : 'var(--bg-secondary)',
          borderBottom: open ? '1px solid var(--border)' : 'none'
        }}
        onClick={() => setOpen(!open)}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', flex: 1 }}>{t(titleKey)}</span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{open ? ICONS.CHEVRON_DOWN : ICONS.CHEVRON_RIGHT}</span>
      </div>
      {open && <div style={{ padding: '16px 20px', background: 'var(--bg-card)' }}>{children}</div>}
    </div>
  );
}
