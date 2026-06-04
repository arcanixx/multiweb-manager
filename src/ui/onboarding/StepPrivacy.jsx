// =============================================================================
// FILE: StepPrivacy.jsx
// PATH: src/ui/onboarding/StepPrivacy.jsx
// VERSION: 0.0.3
// PURPOSE: Krok onboardingu 3/5 – disclaimer aplikacji + toggles prywatności (toasty, logi, analityka)
// FUNCTIONS: StepPrivacy
// DEPENDS ON: react, onboardingConfig.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React from 'react';
import { PRIVACY_OPTIONS } from './onboardingConfig.js';

// ─── StepPrivacy() – krok 3: prywatność + disclaimer
//   @param {object}   props.privacy             – obiekt ustawień prywatności
//   @param {Function} props.onPrivacyChange      – callback zmiany opcji (key, value)
//   @param {boolean}  props.disclaimerAccepted   – czy disclaimer zaakceptowany
//   @param {Function} props.onDisclaimerAccept   – callback akceptacji disclaimera
//   @param {Function} props.t                    – funkcja tłumaczeń
//   @returns {JSX.Element}
export default function StepPrivacy({ privacy, onPrivacyChange, disclaimerAccepted, onDisclaimerAccept, t }) {
  return (
    <div>
      {/* Disclaimer */}
      <div style={{
        background: 'var(--bg-secondary, #16213e)',
        borderRadius: 10, padding: '16px 20px', marginBottom: 20,
        border: '1px solid var(--border, #333)',
      }}>
        <h3 style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--text-primary)' }}>
          {t('onboarding.disclaimer_title')}
        </h3>
        <p style={{ margin: '4px 0', fontSize: 12, color: 'var(--text-muted)' }}>{t('onboarding.disclaimer_local')}</p>
        <p style={{ margin: '4px 0', fontSize: 12, color: 'var(--text-muted)' }}>{t('onboarding.disclaimer_no_tracking')}</p>
        <p style={{ margin: '4px 0', fontSize: 12, color: 'var(--text-muted)' }}>{t('onboarding.disclaimer_opensource')}</p>
      </div>

      {/* Checkbox akceptacji */}
      <label style={{
        display: 'flex', alignItems: 'center', gap: 10,
        cursor: 'pointer', marginBottom: 20, padding: '10px 0',
        color: 'var(--text-primary)', fontSize: 13,
      }}>
        <input
          type="checkbox"
          checked={disclaimerAccepted}
          onChange={e => onDisclaimerAccept(e.target.checked)}
          style={{ width: 16, height: 16, accentColor: 'var(--accent, #6c63ff)' }}
        />
        {t('onboarding.disclaimer_accept')}
      </label>

      {/* Opcje prywatności z onboardingConfig */}
      {PRIVACY_OPTIONS.map(({ key, labelKey, descKey, defaultVal }) => (
        <label key={key} style={{
          display: 'flex', gap: 12, alignItems: 'flex-start',
          cursor: 'pointer', marginBottom: 16,
          padding: '12px 14px', borderRadius: 8,
          background: 'var(--bg-secondary, #16213e)',
          border: '1px solid var(--border, #333)',
        }}>
          <input
            type="checkbox"
            checked={privacy[key] ?? defaultVal}
            onChange={e => onPrivacyChange(key, e.target.checked)}
            style={{ marginTop: 2, width: 15, height: 15, accentColor: 'var(--accent, #6c63ff)', flexShrink: 0 }}
          />
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 3 }}>
              {t(labelKey)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t(descKey)}</div>
          </div>
        </label>
      ))}
    </div>
  );
}