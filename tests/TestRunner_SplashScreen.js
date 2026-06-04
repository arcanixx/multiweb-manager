// =============================================================================
// FILE: TestRunner_SplashScreen.js
// PATH: tests/TestRunner_SplashScreen.js
// VERSION: 0.0.3
// PURPOSE: Testy komponentu SplashScreen – sprawdza eksport i podstawowe renderowanie
// FUNCTIONS: runSplashScreenTests
// DEPENDS ON: react, testUtils.js, react-dom
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React from 'react';
import { runTests } from './testUtils.js';
import ReactDOMServer from 'react-dom/server';

const tests = [
  {
    name: 'SplashScreen component is a function',
    run: async () => {
      try {
        const { SplashScreen } = await import('../src/ui/system/SplashScreen.jsx');
        const ok = typeof SplashScreen === 'function';
        return { ok, details: ok ? '' : 'SplashScreen is not a function' };
      } catch (err) {
        return { ok: false, details: `Failed to import SplashScreen: ${err.message}` };
      }
    }
  },
  {
    name: 'SplashScreen renders without error',
    run: async () => {
      try {
        const { SplashScreen } = await import('../src/ui/system/SplashScreen.jsx');
        const html = ReactDOMServer.renderToString(React.createElement(SplashScreen));
        const ok = typeof html === 'string' && html.length > 0;
        return { ok, details: ok ? '' : 'SplashScreen did not render to a non-empty string' };
      } catch (err) {
        return { ok: false, details: `SplashScreen render failed: ${err.message}` };
      }
    }
  }
];

export async function runSplashScreenTests() {
  return runTests('SplashScreen', tests);
}