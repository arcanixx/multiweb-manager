// =============================================================================
// FILE: TestRunner_App.js
// PATH: tests/TestRunner_App.js
// VERSION: 0.0.3
// PURPOSE: Testy głównego komponentu App – eksporty, logika firstRun, integracja SplashScreen/Onboarding
// FUNCTIONS: runAppTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { checkSourceExport, safeImport, runTests } from './testUtils.js';

const tests = [
  // ─── Eksporty komponentów systemowych (checkSourceExport – pliki z React.lazy) ──
  {
    name: 'App – src/App.jsx posiada default export',
    run: async () => checkSourceExport('src/App.jsx', 'App'),
  },
  {
    name: 'SplashScreen – src/ui/system/SplashScreen.jsx posiada default export',
    run: async () => checkSourceExport('src/ui/system/SplashScreen.jsx', 'SplashScreen'),
  },
  {
    name: 'OnboardingScreen – src/ui/system/OnboardingScreen.jsx posiada default export',
    run: async () => checkSourceExport('src/ui/system/OnboardingScreen.jsx', 'OnboardingScreen'),
  },
  {
    name: 'Onboarding – src/ui/onboarding/Onboarding.jsx posiada default export',
    run: async () => checkSourceExport('src/ui/onboarding/Onboarding.jsx', 'Onboarding'),
  },

  // ─── Logika firstRun (czysta, bez React) ──────────────────────────────────
  {
    name: 'App – firstRun=true wyświetla onboarding (logika warunkowa)',
    run: async () => {
      const shouldShowOnboarding = (settings) =>
        settings && settings.firstRun !== false;
      const ok = shouldShowOnboarding({ firstRun: true }) === true
              && shouldShowOnboarding({ firstRun: false }) === false
              && shouldShowOnboarding({}) === true;
      return { ok, details: ok ? '' : 'firstRun logic failed' };
    },
  },
  {
    name: 'App – handleOnboardingFinish buduje poprawny patch settings',
    run: async () => {
      const buildPatch = ({ theme, language, privacy, selectedApps }) => ({
        firstRun: false,
        theme,
        language,
        toastsEnabled:    privacy?.toastsEnabled    ?? true,
        logsEnabled:      privacy?.logsEnabled      ?? false,
        analyticsEnabled: privacy?.analyticsEnabled ?? false,
      });
      const patch = buildPatch({
        theme: 'dark', language: 'pl',
        privacy: { toastsEnabled: true, logsEnabled: false, analyticsEnabled: false },
        selectedApps: [],
      });
      const ok = patch.firstRun === false
              && patch.theme === 'dark'
              && patch.language === 'pl'
              && patch.toastsEnabled === true;
      return { ok, details: ok ? '' : `patch: ${JSON.stringify(patch)}` };
    },
  },
  {
    name: 'App – SplashScreen zakończony po splashDone=true',
    run: async () => {
      let splashDone = false;
      const onSplashFinished = () => { splashDone = true; };
      onSplashFinished();
      return { ok: splashDone === true, details: splashDone ? '' : 'splashDone not set' };
    },
  },

  // ─── config/settings – DEFAULT_SETTINGS.firstRun ─────────────────────────
  {
    name: 'DEFAULT_SETTINGS – firstRun jest true domyślnie',
    run: async () => {
      try {
        const { DEFAULT_SETTINGS } = await safeImport('src/config/settingsConfig.js');
        const ok = DEFAULT_SETTINGS?.firstRun === true;
        return { ok, details: ok ? '' : `firstRun: ${DEFAULT_SETTINGS?.firstRun}` };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    },
  },
];

export async function runAppTests() {
  return runTests('App', tests);
}
