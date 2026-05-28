// =============================================================================
// FILE: FAQ.jsx
// PATH: src/ui/help/FAQ.jsx
// VERSION: 0.0.3
// PURPOSE: Pojedynczy wpis FAQ (pytanie + odpowiedź)
// FUNCTIONS: -
// DEPENDS ON: react, translations.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
export default function FAQ({ qKey, aKey }) {
  const { t } = useContext(TranslationContext);
  const q = t(qKey).replace(/^Q: |^Pytanie: /, '');
  const a = t(aKey).replace(/^A: |^Odpowiedź: /, '');
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
        {ICONS.HELP} {q}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', paddingLeft: 22, lineHeight: 1.6 }}>{a}</div>
    </div>
  );
}
