// =============================================================================
// FILE: StepLanguage.jsx
// PATH: src/ui/onboarding/StepLanguage.jsx
// VERSION: 0.0.3
// PURPOSE: Krok onboardingu 2/5 – wybór języka interfejsu (pl/en) z zastosowaniem live
// FUNCTIONS: StepLanguage
// DEPENDS ON: react, config.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React from 'react';
import { LANGUAGES as LANG_CODES } from '../../../config.js';

// Map language codes to labels and flags
const LABELS = { pl: 'Polski', en: 'English' };
const FLAGS = { pl: '🇵🇱', en: '🇬🇧' };

const LANGUAGES = LANG_CODES.map(code => ({
  id: code,
  label: LABELS[code],
  flag: FLAGS[code]
}));

// ─── StepLanguage() – krok 2: wybór języka
//   @param {string}   props.language          – aktualnie wybrany język
//   @param {Function} props.onLanguageChange  – callback zmiany języka
//   @param {Function} props.t                 – funkcja tłumaczeń
//   @returns {JSX.Element}
export default function StepLanguage({ language, onLanguageChange, t }) {
  return (
    <div>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24, textAlign: 'center' }}>
        {t('onboarding.language_label')}
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        {LANGUAGES.map(lang => (
          <button
            key={lang.id}
            onClick={() => onLanguageChange(lang.id)}
            style={{
              padding: '16px 32px', borderRadius: 12, cursor: 'pointer',
              border: `2px solid ${language === lang.id ? 'var(--accent, #6c63ff)' : 'var(--border, #333)'}`,
              background: language === lang.id ? 'var(--accent-subtle, rgba(108,99,255,0.1))' : 'var(--bg-secondary, #16213e)',
              color: 'var(--text-primary)',
              fontWeight: language === lang.id ? 600 : 400,
              transition: 'all 0.2s',
              minWidth: 120, textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 6 }}>{lang.flag}</div>
            <div style={{ fontSize: 13 }}>{lang.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}