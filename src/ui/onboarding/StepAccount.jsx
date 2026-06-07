// =============================================================================
// FILE: StepAccount.jsx
// PATH: src/ui/onboarding/StepAccount.jsx
// VERSION: 0.0.3
// PURPOSE: Krok onboardingu 5/5 – placeholder konta użytkownika (sync coming soon)
// FUNCTIONS: StepAccount
// DEPENDS ON: react, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React from 'react';
import { ICONS } from '../../utils/icons.js';

// ─── ACCOUNT_BUTTONS – klucze tłumaczeń przycisków logowania (disabled – placeholder)
const ACCOUNT_BUTTONS = ['account_signin_google', 'account_signin_github'];

// ─── StepAccount() – krok 5: konto (placeholder – sync coming soon)
//   @param {Function} props.t – funkcja tłumaczeń
//   @returns {JSX.Element}
export default function StepAccount({ t }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{ICONS.ONBOARDING_ACCOUNT}</div>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>
        {t('onboarding.account_subtitle')}
      </p>

      {/* Placeholder przycisków logowania – disabled do czasu implementacji sync */}
      {ACCOUNT_BUTTONS.map(key => (
        <button
          key={key}
          disabled
          style={{
            display: 'block', width: '100%', maxWidth: 280,
            margin: '0 auto 10px', padding: '11px 0',
            borderRadius: 8, border: '1px solid var(--border, #333)',
            background: 'var(--bg-secondary, #16213e)',
            color: 'var(--text-muted)', cursor: 'not-allowed',
            fontSize: 13, fontWeight: 500,
          }}
        >
          {t(`onboarding.${key}`)}
        </button>
      ))}

      <p style={{ marginTop: 20, fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>
        {t('onboarding.account_coming_soon')}
      </p>
    </div>
  );
}