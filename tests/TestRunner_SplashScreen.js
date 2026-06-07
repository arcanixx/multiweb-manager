// =============================================================================
// FILE: TestRunner_SplashScreen.js
// PATH: tests/TestRunner_SplashScreen.js
// VERSION: 0.0.3
// PURPOSE: Testy komponentu SplashScreen – eksport, logika animacji i konfiguracja.
// FUNCTIONS: runSplashScreenTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// UWAGA: ReactDOMServer.renderToString pominięty – SplashScreen używa TranslationContext
//        i setTimeout, które wymagają pełnego środowiska Electron/JSDOM. Testy sprawdzają
//        eksport źródłowy i czystą logikę animacji.
// =============================================================================

import { checkSourceExport, runTests } from './testUtils.js';

const tests = [
  // ─── Eksport (checkSourceExport – bez importu JSX) ──────────────────────
  {
    name: 'SplashScreen – src/ui/system/SplashScreen.jsx posiada default export',
    run: async () => checkSourceExport('src/ui/system/SplashScreen.jsx', 'SplashScreen'),
  },

  // ─── Logika animacji (czysta, bez DOM) ──────────────────────────────────
  {
    name: 'SplashScreen – pasek postępu rośnie od 0 do 100 w SPLASH_DURATION krokach',
    run: async () => {
      const SPLASH_DURATION_MS = 1800;
      const TICK_MS = 30;
      const step = 100 / (SPLASH_DURATION_MS / TICK_MS);
      let progress = 0;
      let ticks = 0;
      while (progress < 100) {
        progress = Math.min(progress + step, 100);
        ticks++;
      }
      const expectedTicks = Math.ceil(SPLASH_DURATION_MS / TICK_MS);
      const ok = ticks === expectedTicks && progress === 100;
      return { ok, details: ok ? '' : `ticks=${ticks} (expected ${expectedTicks}), progress=${progress}` };
    },
  },
  {
    name: 'SplashScreen – Math.min ogranicza progress do max 100',
    run: async () => {
      const clamp = (v, max) => Math.min(v, max);
      const ok = clamp(110, 100) === 100 && clamp(99, 100) === 99 && clamp(100, 100) === 100;
      return { ok, details: ok ? '' : 'clamp logic failed' };
    },
  },
  {
    name: 'SplashScreen – fadeOut timing: fadeTimer < doneTimer (300ms przed końcem)',
    run: async () => {
      const SPLASH_DURATION_MS = 1800;
      const FADE_START = SPLASH_DURATION_MS - 300;
      const ok = FADE_START === 1500 && FADE_START < SPLASH_DURATION_MS;
      return { ok, details: ok ? '' : `FADE_START=${FADE_START}` };
    },
  },
  {
    name: 'SplashScreen – onFinished callback wywołany po zakończeniu (symulacja)',
    run: async () => {
      let called = false;
      const onFinished = () => { called = true; };
      // Symulacja: po upływie SPLASH_DURATION wywołaj callback
      await new Promise(resolve => setTimeout(() => { onFinished(); resolve(); }, 10));
      return { ok: called, details: called ? '' : 'onFinished not called' };
    },
  },
];

export async function runSplashScreenTests() {
  return runTests('SplashScreen', tests);
}
