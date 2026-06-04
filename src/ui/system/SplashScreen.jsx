// =============================================================================
// FILE: SplashScreen.jsx
// PATH: src/ui/system/SplashScreen.jsx
// VERSION: 0.0.3
// PURPOSE: Ekran ładowania aplikacji wyświetlany przy starcie przez 1.5–2s. Pokazuje logo (PNG z assets/ lub SVG fallback), nazwę aplikacji i pasek postępu.
// FUNCTIONS: SplashScreen
// DEPENDS ON: react, translations.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// UWAGA: Zastąp assets/splash_logo.svg plikiem assets/splash_logo.png gdy będzie dostępny.
// =============================================================================

import React, { useContext, useEffect, useState } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';

// ─── SPLASH_DURATION_MS – czas wyświetlania splash screenu (ms)
// UWAGA: Ta stała celowo pozostaje w tym pliku – dotyczy wyłącznie logiki SplashScreen.
const SPLASH_DURATION_MS = 1800;

// ─── SplashScreen() – ekran ładowania aplikacji
//   @param {Function} props.onFinished – callback wywoływany po zakończeniu animacji
//   @returns {JSX.Element}
export default function SplashScreen({ onFinished }) {
  const { t } = useContext(TranslationContext);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  // ─── useEffect – animacja paska postępu + fade out + callback onFinished
  useEffect(() => {
    // Krok 1: animuj pasek postępu od 0 do 100% przez SPLASH_DURATION_MS
    const step = 100 / (SPLASH_DURATION_MS / 30);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + step;
      });
    }, 30);

    // Krok 2: fade out przez ostatnie 300ms
    const fadeTimer = setTimeout(() => setFadeOut(true), SPLASH_DURATION_MS - 300);

    // Krok 3: wywołaj onFinished po zakończeniu
    const doneTimer = setTimeout(() => onFinished?.(), SPLASH_DURATION_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onFinished]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-primary, #1a1a2e)',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.3s ease',
        userSelect: 'none',
      }}
    >
      {/* ── Logo ─────────────────────────────────────── */}
      <div style={{ marginBottom: 24, width: 120, height: 120 }}>
        <img
          src="../../assets/splash_logo.png"
          alt={t('app.name')}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          onError={(e) => {
            // Fallback na SVG jeśli PNG nie istnieje
            e.currentTarget.src = '../../assets/splash_logo.svg';
            e.currentTarget.onerror = null;
          }}
        />
      </div>

      {/* ── Nazwa aplikacji ───────────────────────────── */}
      <h1 style={{
        fontSize: 28, fontWeight: 700, letterSpacing: 1,
        color: 'var(--text-primary, #fff)',
        margin: '0 0 6px',
      }}>
        {t('app.name')}
      </h1>

      {/* ── Tagline ───────────────────────────────────── */}
      <p style={{
        fontSize: 13, color: 'var(--text-muted, #888)',
        margin: '0 0 40px', letterSpacing: 0.5,
      }}>
        {t('splash.tagline')}
      </p>

      {/* ── Pasek postępu ────────────────────────────── */}
      <div style={{
        width: 200, height: 3,
        background: 'var(--border, #333)',
        borderRadius: 2, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${Math.min(progress, 100)}%`,
          background: 'var(--accent, #6c63ff)',
          borderRadius: 2,
          transition: 'width 0.03s linear',
        }} />
      </div>

      {/* ── Status ───────────────────────────────────── */}
      <p style={{
        marginTop: 12, fontSize: 11,
        color: 'var(--text-muted, #666)',
      }}>
        {t('splash.loading')}
      </p>
    </div>
  );
}
