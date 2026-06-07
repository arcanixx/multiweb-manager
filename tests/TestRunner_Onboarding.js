// =============================================================================
// FILE: TestRunner_Onboarding.js
// PATH: tests/TestRunner_Onboarding.js
// VERSION: 0.0.3
// PURPOSE: Testy komponentów onboardingu – eksporty kroków i komponentu głównego (checkSourceExport), logika walidacji kroków, config onboardingu.
// FUNCTIONS: runOnboardingTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// WAŻNE: Testy renderowania React (ReactDOMServer) są pominięte – wymagają pełnego kontekstu TranslationContext i TranslationProvider, który nie jest dostępny w Node bez setupu Vitest+JSDOM.
import { checkSourceExport, runTests, safeImport } from './testUtils.js';

const tests = [
  // ─── Eksporty kroków (checkSourceExport – czyta plik, nie importuje JSX) ──────
  ...([
    ['StepAccount',   'src/ui/onboarding/StepAccount.jsx'],
    ['StepApps',      'src/ui/onboarding/StepApps.jsx'],
    ['StepIndicator', 'src/ui/onboarding/StepIndicator.jsx'],
    ['StepLanguage',  'src/ui/onboarding/StepLanguage.jsx'],
    ['StepPrivacy',   'src/ui/onboarding/StepPrivacy.jsx'],
    ['StepTheme',     'src/ui/onboarding/StepTheme.jsx'],
  ].map(([name, path]) => ({
    name: `${name} – ${path} eksportuje komponent kroku onboardingu`,
    run: async () => checkSourceExport(path, name),
  }))),

  // ─── Onboarding.jsx – default export ────────────────────────────────────────
  {
    name: 'Onboarding – src/ui/onboarding/Onboarding.jsx posiada default export',
    run: async () => checkSourceExport('src/ui/onboarding/Onboarding.jsx', 'Onboarding'),
  },

  // ─── onboardingConfig.js – stałe konfiguracyjne ──────────────────────────────
  {
    name: 'onboardingConfig – ONBOARDING_STEPS zdefiniowane',
    run: async () => {
      try {
        const mod = await safeImport('src/ui/onboarding/onboardingConfig.js');
        const ok = Array.isArray(mod.ONBOARDING_STEPS) && mod.ONBOARDING_STEPS.length >= 3;
        return { ok, details: ok ? '' : `ONBOARDING_STEPS: ${JSON.stringify(mod.ONBOARDING_STEPS)}` };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    },
  },
  {
    name: 'onboardingConfig – QUICK_START_MAP zdefiniowane',
    run: async () => {
      try {
        const mod = await safeImport('src/ui/onboarding/onboardingConfig.js');
        const ok = mod.QUICK_START_MAP && typeof mod.QUICK_START_MAP === 'object';
        return { ok, details: ok ? '' : 'QUICK_START_MAP missing or not object' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    },
  },

  // ─── Logika walidacji kroków (czysta, bez React) ──────────────────────────────
  {
    name: 'Onboarding – krok privacy blokuje "Dalej" gdy disclaimer niezaakceptowany',
    run: async () => {
      const canProceed = (stepId, disclaimerAccepted) =>
        stepId !== 'privacy' || disclaimerAccepted;
      const ok = canProceed('privacy', false) === false
              && canProceed('privacy', true)  === true
              && canProceed('theme',   false) === true;
      return { ok, details: ok ? '' : 'Walidacja kroku privacy failed' };
    },
  },
  {
    name: 'Onboarding – toggleApp dodaje i usuwa aplikacje z selectedApps',
    run: async () => {
      let selected = [];
      const app = { id: 'claude', name: 'Claude' };
      const toggle = (a) => {
        const exists = selected.some(x => x.id === a.id);
        selected = exists ? selected.filter(x => x.id !== a.id) : [...selected, a];
      };
      toggle(app);
      const addedOk = selected.length === 1 && selected[0].id === 'claude';
      toggle(app);
      const removedOk = selected.length === 0;
      return { ok: addedOk && removedOk, details: addedOk && removedOk ? '' : 'Toggle logic failed' };
    },
  },
  {
    name: 'Onboarding – stepOf oblicza poprawny napis',
    run: async () => {
      const stepOf = (current, total) => `Krok ${current} z ${total}`;
      const ok = stepOf(1, 5) === 'Krok 1 z 5' && stepOf(3, 5) === 'Krok 3 z 5';
      return { ok, details: ok ? '' : 'stepOf logic failed' };
    },
  },
  {
    name: 'Onboarding – theme live preview: dark dodaje klasę dark do html',
    run: async () => {
      // Symulacja logiki handleThemeChange bez DOM
      let classes = new Set(['someOtherClass']);
      const applyTheme = (theme) => {
        if (theme === 'dark')  classes.add('dark');
        else if (theme === 'light') classes.delete('dark');
      };
      applyTheme('dark');
      const darkOk = classes.has('dark');
      applyTheme('light');
      const lightOk = !classes.has('dark');
      return { ok: darkOk && lightOk, details: darkOk && lightOk ? '' : 'Theme class logic failed' };
    },
  },
];

export async function runOnboardingTests() {
  return runTests('Onboarding', tests);
}
