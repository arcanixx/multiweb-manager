// =============================================================================
// FILE: ToolCard.jsx
// PATH: src/ui/help/ToolCard.jsx
// VERSION: 0.0.3
// PURPOSE: Karta opisu narzędzia (ikona, tytuł, opis)
// FUNCTIONS: ToolCard
// DEPENDS ON: react, translations.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
export default function ToolCard({ icon, titleKey, descKey }) {
  const { t } = useContext(TranslationContext);
  return (
    <div style={{
      display: 'flex', gap: 12, padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 8,
      marginBottom: 8, border: '1px solid var(--border)'
    }}>
      <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', marginBottom: 3 }}>{t(titleKey)}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{t(descKey)}</div>
      </div>
    </div>
  );
}
