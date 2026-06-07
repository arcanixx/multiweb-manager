// =============================================================================
// FILE: StepApps.jsx
// PATH: src/ui/onboarding/StepApps.jsx
// VERSION: 0.0.3
// PURPOSE: Krok onboardingu 4/5 – szybki start: wybór aplikacji z App Library per kategoria
// FUNCTIONS: StepApps
// DEPENDS ON: react, icons.js, onboardingConfig.js, app-library.json
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React from 'react';
import { ICONS } from '../../utils/icons.js';
import { QUICK_START_MAP } from '../../config/onboardingConfig.js';
import appLibraryData from '../../data/app-library.json';

// ─── StepApps() – krok 4: szybki start – wybór aplikacji z App Library
//   @param {Array}    props.selectedApps – lista wybranych aplikacji
//   @param {Function} props.onToggleApp  – callback toggle'owania aplikacji (app, categoryId)
//   @param {Function} props.t            – funkcja tłumaczeń
//   @returns {JSX.Element}
export default function StepApps({ selectedApps, onToggleApp, t }) {
  // Filtruj kategorie i aplikacje według QUICK_START_MAP
  const categories = (appLibraryData?.categories || [])
    .filter(cat => QUICK_START_MAP[cat.id])
    .map(cat => ({
      ...cat,
      apps: (cat.apps || []).filter(app => QUICK_START_MAP[cat.id].includes(app.id)),
    }));

  return (
    <div>
      <p style={{ color: 'var(--text-muted)', marginBottom: 16, textAlign: 'center', fontSize: 13 }}>
        {t('onboarding.apps_subtitle')}
      </p>
      {categories.map(cat => (
        <div key={cat.id} style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 8px' }}>
            {cat.label}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {cat.apps.map(app => {
              const isSelected = selectedApps.some(a => a.id === app.id);
              return (
                <button
                  key={app.id}
                  onClick={() => onToggleApp(app, cat.id)}
                  style={{
                    padding: '7px 14px', borderRadius: 20, cursor: 'pointer',
                    fontSize: 12, fontWeight: isSelected ? 600 : 400,
                    border: `1.5px solid ${isSelected ? 'var(--accent, #6c63ff)' : 'var(--border, #333)'}`,
                    background: isSelected ? 'var(--accent-subtle, rgba(108,99,255,0.12))' : 'var(--bg-secondary, #16213e)',
                    color: isSelected ? 'var(--accent, #6c63ff)' : 'var(--text-primary)',
                    transition: 'all 0.15s',
                  }}
                >
                  {isSelected && `${ICONS.ONBOARDING_CHECK} `}{app.name}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {selectedApps.length > 0 && (
        <p style={{ marginTop: 12, fontSize: 12, color: 'var(--accent, #6c63ff)', textAlign: 'center' }}>
          {t('onboarding.apps_selected', { count: selectedApps.length })}
        </p>
      )}
    </div>
  );
}