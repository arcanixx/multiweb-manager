// =============================================================================
// FILE: StepTheme.jsx
// PATH: src/ui/onboarding/StepTheme.jsx
// VERSION: 0.0.3
// PURPOSE: Krok onboardingu 1/5 – wybór motywu (dark/light/system) z podglądem live
// FUNCTIONS: StepTheme
// DEPENDS ON: react, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React from 'react';
import { ICONS } from '../../utils/icons.js';

// ─── THEMES – dostępne motywy z ikonami i kluczami tłumaczeń
const THEMES = [
  { id: 'dark',   labelKey: 'onboarding.theme_dark',   icon: ICONS.ONBOARDING_THEME_DARK  },
  { id: 'light',  labelKey: 'onboarding.theme_light',  icon: ICONS.ONBOARDING_THEME_LIGHT },
  { id: 'system', labelKey: 'onboarding.theme_system', icon: ICONS.ONBOARDING_LANGUAGE    },
];

// ─── StepTheme() – krok 1: wybór motywu
//   @param {string}   props.theme         – aktualnie wybrany motyw
//   @param {Function} props.onThemeChange – callback zmiany motywu
//   @param {Function} props.t             – funkcja tłumaczeń
//   @returns {JSX.Element}
export default function StepTheme({ theme, onThemeChange, t }) {
  return (
    <div>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24, textAlign: 'center' }}>
        {t('onboarding.theme_label')}
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        {THEMES.map(th => (
          <button
            key={th.id}
            onClick={() => onThemeChange(th.id)}
            style={{
              padding: '16px 24px', borderRadius: 12, cursor: 'pointer',
              border: `2px solid ${theme === th.id ? 'var(--accent, #6c63ff)' : 'var(--border, #333)'}`,
              background: theme === th.id ? 'var(--accent-subtle, rgba(108,99,255,0.1))' : 'var(--bg-secondary, #16213e)',
              color: 'var(--text-primary)',
              fontWeight: theme === th.id ? 600 : 400,
              transition: 'all 0.2s',
              minWidth: 100, textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 6 }}>{th.icon}</div>
            <div style={{ fontSize: 12 }}>{t(th.labelKey)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}