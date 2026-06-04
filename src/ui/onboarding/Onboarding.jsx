// =============================================================================
// FILE: Onboarding.jsx
// PATH: src/ui/onboarding/Onboarding.jsx
// VERSION: 0.0.3
// PURPOSE: Główny wizard onboardingu – zarządza stanem, nawigacją i logiką kroków. Importuje moduły kroków z tego samego folderu.
// FUNCTIONS: Onboarding
// DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js, onboardingConfig.js, StepIndicator.jsx, StepTheme.jsx, StepLanguage.jsx, StepPrivacy.jsx, StepApps.jsx, StepAccount.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useContext, useCallback } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import { logInfo, logDebug } from '../../utils/loggerRenderer.js';
import { ONBOARDING_STEPS, STEP_TITLE_KEYS } from './onboardingConfig.js';
import StepIndicator from './StepIndicator.jsx';
import StepTheme     from './StepTheme.jsx';
import StepLanguage  from './StepLanguage.jsx';
import StepPrivacy   from './StepPrivacy.jsx';
import StepApps      from './StepApps.jsx';
import StepAccount   from './StepAccount.jsx';

// =============================================================================
// ─── Onboarding() – główny wizard onboardingu
//   @param {Function} props.onFinish – callback po ukończeniu (przekazuje { theme, language, privacy, selectedApps })
//   @returns {JSX.Element}
// =============================================================================
export default function Onboarding({ onFinish }) {
  const { t, setLocale } = useContext(TranslationContext);

  const [step,               setStep]               = useState(0);
  const [theme,              setTheme]              = useState('dark');
  const [language,           setLanguage]           = useState('pl');
  const [privacy,            setPrivacy]            = useState({ logsEnabled: false, analyticsEnabled: false, toastsEnabled: true });
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [selectedApps,       setSelectedApps]       = useState([]);

  // ─── handleThemeChange() – zmiana motywu + zastosowanie live
  const handleThemeChange = useCallback((newTheme) => {
    setTheme(newTheme);
    const html = document.documentElement;
    if (newTheme === 'dark')       html.classList.add('dark');
    else if (newTheme === 'light') html.classList.remove('dark');
    else html.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
    logDebug('ui', `Onboarding: theme changed to ${newTheme}`);
  }, []);

  // ─── handleLanguageChange() – zmiana języka + zastosowanie live
  const handleLanguageChange = useCallback((lang) => {
    setLanguage(lang);
    setLocale?.(lang);
    logDebug('ui', `Onboarding: language changed to ${lang}`);
  }, [setLocale]);

  // ─── handlePrivacyChange() – zmiana ustawień prywatności
  const handlePrivacyChange = useCallback((key, value) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  }, []);

  // ─── handleToggleApp() – toggle wyboru aplikacji w szybkim starcie
  const handleToggleApp = useCallback((app, categoryId) => {
    setSelectedApps(prev => {
      const exists = prev.some(a => a.id === app.id);
      return exists
        ? prev.filter(a => a.id !== app.id)
        : [...prev, { ...app, categoryId }];
    });
  }, []);

  // ─── handleFinish() – zapisuje wybory + wywołuje onFinish
  const handleFinish = useCallback(() => {
    logInfo('ui', `Onboarding: finished – theme=${theme}, lang=${language}, apps=${selectedApps.length}`);
    onFinish?.({ theme, language, privacy, selectedApps });
  }, [theme, language, privacy, selectedApps, onFinish]);

  // ─── canProceed() – walidacja przed przejściem do następnego kroku
  const canProceed = () => {
    if (ONBOARDING_STEPS[step] === 'privacy' && !disclaimerAccepted) return false;
    return true;
  };

  // ─── handleNext() – przejście do następnego kroku lub zakończenie
  const handleNext = () => {
    if (!canProceed()) return;
    if (step < ONBOARDING_STEPS.length - 1) setStep(s => s + 1);
    else handleFinish();
  };

  const currentStepId = ONBOARDING_STEPS[step];
  const isLastStep    = step === ONBOARDING_STEPS.length - 1;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary, #1a1a2e)',
    }}>
      <div style={{
        width: '100%', maxWidth: 520,
        background: 'var(--bg-card, #0f172a)',
        borderRadius: 18, padding: '40px 40px 32px',
        border: '1px solid var(--border, #1e293b)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }}>
        {/* ── Logo + nagłówek ─────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 60, height: 60, margin: '0 auto 14px' }}>
            <img
              src="../../assets/splash_logo.png"
              alt={t('app.name')}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={e => { e.currentTarget.src = '../../assets/splash_logo.svg'; e.currentTarget.onerror = null; }}
            />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px', color: 'var(--text-primary)' }}>
            {t('onboarding.title')}
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
            {t('onboarding.step_of', { current: step + 1, total: ONBOARDING_STEPS.length })}
            {' — '}{t(STEP_TITLE_KEYS[currentStepId])}
          </p>
        </div>

        {/* ── Wskaźnik kroków ─────────────────────── */}
        <StepIndicator currentStep={step} total={ONBOARDING_STEPS.length} />

        {/* ── Zawartość kroku ─────────────────────── */}
        <div style={{ minHeight: 240 }}>
          {currentStepId === 'theme'    && <StepTheme    theme={theme}    onThemeChange={handleThemeChange}   t={t} />}
          {currentStepId === 'language' && <StepLanguage language={language} onLanguageChange={handleLanguageChange} t={t} />}
          {currentStepId === 'privacy'  && (
            <StepPrivacy
              privacy={privacy}                     onPrivacyChange={handlePrivacyChange}
              disclaimerAccepted={disclaimerAccepted} onDisclaimerAccept={setDisclaimerAccepted}
              t={t}
            />
          )}
          {currentStepId === 'apps'    && <StepApps    selectedApps={selectedApps} onToggleApp={handleToggleApp} t={t} />}
          {currentStepId === 'account' && <StepAccount t={t} />}
        </div>

        {/* ── Przyciski nawigacji ──────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28 }}>
          {/* Wstecz */}
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            style={{
              padding: '9px 20px', borderRadius: 8, cursor: step === 0 ? 'default' : 'pointer',
              border: '1px solid var(--border, #333)',
              background: 'transparent', color: step === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
              fontSize: 13, opacity: step === 0 ? 0.4 : 1, transition: 'opacity 0.2s',
            }}
          >
            {ICONS.ONBOARDING_ARROW} {t('onboarding.back')}
          </button>

          {/* Pomiń (tylko krok apps i account) */}
          {(currentStepId === 'apps' || currentStepId === 'account') && (
            <button
              onClick={isLastStep ? handleFinish : () => setStep(s => s + 1)}
              style={{
                padding: '9px 16px', borderRadius: 8, cursor: 'pointer',
                border: 'none', background: 'transparent',
                color: 'var(--text-muted)', fontSize: 12,
              }}
            >
              {t('onboarding.apps_skip')}
            </button>
          )}

          {/* Dalej / Zakończ */}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            style={{
              padding: '10px 24px', borderRadius: 8, cursor: canProceed() ? 'pointer' : 'not-allowed',
              border: 'none',
              background: canProceed() ? 'var(--accent, #6c63ff)' : 'var(--border, #333)',
              color: '#fff', fontSize: 13, fontWeight: 600,
              transition: 'background 0.2s', opacity: canProceed() ? 1 : 0.6,
            }}
          >
            {isLastStep ? t('onboarding.finish') : `${t('onboarding.next')} ${ICONS.ONBOARDING_ARROW}`}
          </button>
        </div>
      </div>
    </div>
  );
}