// =============================================================================
// FILE: OnboardingScreen.jsx
// PATH: src/ui/system/OnboardingScreen.jsx
// VERSION: 0.0.3
// PURPOSE: Ekran onboardingu przy pierwszym uruchomieniu – 5 kroków: motyw, język, prywatność/disclaimer, szybki start (wybór aplikacji z App Library), konto (placeholder).
// FUNCTIONS: OnboardingScreen, StepIndicator, StepTheme, StepLanguage, StepPrivacy, StepApps, StepAccount
// DEPENDS ON: react, config.js, translations.js, icons.js, loggerRenderer.js, app-library.json
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// UWAGA: Zastąp assets/splash_logo.svg plikiem assets/splash_logo.png gdy będzie dostępny.
// =============================================================================

import React, { useState, useContext, useCallback } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import { logInfo, logDebug } from '../../utils/loggerRenderer.js';
import appLibraryData from '../../data/app-library.json';

// ─── ONBOARDING_STEPS – definicja kroków wizarda
// UWAGA: Ta stała celowo pozostaje w tym pliku – dotyczy wyłącznie logiki OnboardingScreen.
const ONBOARDING_STEPS = ['theme', 'language', 'privacy', 'apps', 'account'];

// ─── QUICK_START_MAP – które aplikacje pokazać w onboardingu per kategoria
// Klucz = id kategorii z app-library.json, wartość = tablica id aplikacji do pokazania
const QUICK_START_MAP = {
  AI:          ['chatgpt', 'claude', 'deepseek', 'gemini'],
  DEV:         ['github', 'stackOverflow', 'npm', 'codesandbox'],
  PRODUCTIVITY:['notion', 'todoist', 'trello', 'calendar'],
  SOCIAL:      ['discord', 'messenger', 'whatsapp'],
};

// ─── StepIndicator() – wskaźnik aktualnego kroku (dot-y u góry)
function StepIndicator({ currentStep, total }) {
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

// ─── StepTheme() – krok 1: wybór motywu
function StepTheme({ theme, onThemeChange, t }) {
  const themes = [
    { id: 'dark',   labelKey: 'onboarding.theme_dark',   icon: ICONS.ONBOARDING_THEME_DARK },
    { id: 'light',  labelKey: 'onboarding.theme_light',  icon: ICONS.ONBOARDING_THEME_LIGHT },
    { id: 'system', labelKey: 'onboarding.theme_system', icon: ICONS.ONBOARDING_LANGUAGE },
  ];

  return (
    <div>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24, textAlign: 'center' }}>
        {t('onboarding.theme_label')}
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        {themes.map(th => (
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

// ─── StepLanguage() – krok 2: wybór języka
function StepLanguage({ language, onLanguageChange, t }) {
  const langs = [
    { id: 'pl', label: 'Polski', flag: '🇵🇱' },
    { id: 'en', label: 'English', flag: '🇬🇧' },
  ];

  return (
    <div>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24, textAlign: 'center' }}>
        {t('onboarding.language_label')}
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        {langs.map(lang => (
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

// ─── StepPrivacy() – krok 3: prywatność + disclaimer
function StepPrivacy({ privacy, onPrivacyChange, disclaimerAccepted, onDisclaimerAccept, t }) {
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

      {/* Opcje prywatności */}
      {[
        { key: 'toastsEnabled',   labelKey: 'onboarding.privacy_toasts_label',    descKey: 'onboarding.privacy_toasts_desc',    defaultVal: true  },
        { key: 'logsEnabled',     labelKey: 'onboarding.privacy_logs_label',       descKey: 'onboarding.privacy_logs_desc',      defaultVal: false },
        { key: 'analyticsEnabled',labelKey: 'onboarding.privacy_analytics_label',  descKey: 'onboarding.privacy_analytics_desc', defaultVal: false },
      ].map(({ key, labelKey, descKey, defaultVal }) => (
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

// ─── StepApps() – krok 4: szybki start – wybór aplikacji z App Library
function StepApps({ selectedApps, onToggleApp, t }) {
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

// ─── StepAccount() – krok 5: konto (placeholder – sync coming soon)
function StepAccount({ t }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{ICONS.ONBOARDING_ACCOUNT}</div>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>
        {t('onboarding.account_subtitle')}
      </p>

      {/* Placeholder przycisków logowania */}
      {['account_signin_google', 'account_signin_github'].map(key => (
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

// =============================================================================
// ─── OnboardingScreen() – główny wizard onboardingu
//   @param {Function} props.onFinish – callback po ukończeniu (przekazuje { theme, language, privacy, selectedApps })
//   @returns {JSX.Element}
// =============================================================================
export default function OnboardingScreen({ onFinish }) {
  const { t, setLocale } = useContext(TranslationContext);

  const [step, setStep]                       = useState(0);
  const [theme, setTheme]                     = useState('dark');
  const [language, setLanguage]               = useState('pl');
  const [privacy, setPrivacy]                 = useState({ logsEnabled: false, analyticsEnabled: false, toastsEnabled: true });
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [selectedApps, setSelectedApps]       = useState([]);

  // ─── handleThemeChange() – zmiana motywu + zastosowanie live
  const handleThemeChange = useCallback((newTheme) => {
    setTheme(newTheme);
    const html = document.documentElement;
    if (newTheme === 'dark') html.classList.add('dark');
    else if (newTheme === 'light') html.classList.remove('dark');
    else html.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
    logDebug('ui', `OnboardingScreen: theme changed to ${newTheme}`);
  }, []);

  // ─── handleLanguageChange() – zmiana języka + zastosowanie live
  const handleLanguageChange = useCallback((lang) => {
    setLanguage(lang);
    setLocale?.(lang);
    logDebug('ui', `OnboardingScreen: language changed to ${lang}`);
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

  // ─── canProceed() – walidacja przed przejściem do następnego kroku
  const canProceed = () => {
    if (ONBOARDING_STEPS[step] === 'privacy' && !disclaimerAccepted) return false;
    return true;
  };

  // ─── handleNext() – przejście do następnego kroku lub zakończenie
  const handleNext = () => {
    if (!canProceed()) return;
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      handleFinish();
    }
  };

  // ─── handleFinish() – zapisuje wybory + wywołuje onFinish
  const handleFinish = useCallback(() => {
    logInfo('ui', `OnboardingScreen: finished – theme=${theme}, lang=${language}, apps=${selectedApps.length}`);
    onFinish?.({ theme, language, privacy, selectedApps });
  }, [theme, language, privacy, selectedApps, onFinish]);

  // Tytuły kroków
  const stepTitleKeys = {
    theme:    'onboarding.step_theme',
    language: 'onboarding.step_language',
    privacy:  'onboarding.step_privacy',
    apps:     'onboarding.step_apps',
    account:  'onboarding.step_account',
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
            {' — '}{t(stepTitleKeys[currentStepId])}
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
              privacy={privacy}           onPrivacyChange={handlePrivacyChange}
              disclaimerAccepted={disclaimerAccepted} onDisclaimerAccept={setDisclaimerAccepted}
              t={t}
            />
          )}
          {currentStepId === 'apps'     && <StepApps     selectedApps={selectedApps} onToggleApp={handleToggleApp} t={t} />}
          {currentStepId === 'account'  && <StepAccount  t={t} />}
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
