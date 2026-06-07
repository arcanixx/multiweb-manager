// =============================================================================
// FILE: App.jsx
// PATH: src/App.jsx
// VERSION: 0.0.3
// PURPOSE: Główny komponent root aplikacji React – zarządza przełączaniem widoków (Splash/Onboarding/Layout).
// FUNCTIONS: App
// DEPENDS ON: react, translations.js, useAppInitialization.js, MainLayout.jsx, Spinner.jsx, SplashScreen.jsx, OnboardingScreen.jsx, ToastContainer.jsx, ErrorBoundary.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from './utils/translations.js';
import { useAppInitialization } from './hooks/useAppInitialization.js';
import MainLayout from './ui/layout/MainLayout.jsx';
import { Spinner } from './ui/views/Spinner.jsx';
import SplashScreen from './ui/system/SplashScreen.jsx';
import OnboardingScreen from './ui/system/OnboardingScreen.jsx';
import ToastContainer from './ui/system/ToastContainer.jsx';
import AppErrorBoundary from './ui/system/ErrorBoundary.jsx';

export default function App() {
  const { t, loaded } = useContext(TranslationContext);
  const {
    settings, profiles, setProfiles, activeItem, setActiveItem,
    splashDone, setSplashDone, onboardingDone,
    handleSaveSettings, handleOnboardingFinish
  } = useAppInitialization();

  if (!loaded || !settings) return <Spinner />;
  if (!splashDone) return <SplashScreen onFinished={() => setSplashDone(true)} />;
  if (!onboardingDone) return <OnboardingScreen onFinish={handleOnboardingFinish} />;

  return (
    <AppErrorBoundary>
      <MainLayout profiles={profiles} activeItem={activeItem} settings={settings} onSelect={setActiveItem} onProfilesChange={setProfiles} onSaveSettings={handleSaveSettings} />
      <ToastContainer enabled={settings.toastsEnabled !== false} />
    </AppErrorBoundary>
  );
}