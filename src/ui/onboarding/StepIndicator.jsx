// =============================================================================
// FILE: StepIndicator.jsx
// PATH: src/ui/onboarding/StepIndicator.jsx
// VERSION: 0.0.3
// PURPOSE: Wskaźnik postępu onboardingu – animowane dot-y u góry wizarda
// FUNCTIONS: StepIndicator
// DEPENDS ON: react
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React from 'react';

// ─── StepIndicator() – wskaźnik aktualnego kroku (dot-y u góry)
//   @param {number} props.currentStep – indeks aktualnego kroku (0-based)
//   @param {number} props.total       – łączna liczba kroków
//   @returns {JSX.Element}
export default function StepIndicator({ currentStep, total }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === currentStep ? 24 : 8,
            height: 8, borderRadius: 4,
            background: i === currentStep
              ? 'var(--accent, #6c63ff)'
              : i < currentStep
                ? 'var(--accent-muted, #a78bfa)'
                : 'var(--border, #333)',
            transition: 'all 0.3s ease',
          }}
        />
      ))}
    </div>
  );
}