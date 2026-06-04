// =============================================================================
// FILE: TestRunner_Onboarding.js
// PATH: tests/TestRunner_Onboarding.js
// VERSION: 0.0.3
// PURPOSE: Testy komponentu Onboarding – sprawdza eksport i podstawowe renderowanie
// FUNCTIONS: runOnboardingTests
// DEPENDS ON: testUtils.js, react-dom
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
import ReactDOMServer from 'react-dom/server';

const tests = [
  {
    name: 'Onboarding component is a function',
    run: async () => {
      try {
        const { Onboarding } = await import('../src/ui/onboarding/Onboarding.jsx');
        const ok = typeof Onboarding === 'function';
        return { ok, details: ok ? '' : 'Onboarding is not a function' };
      } catch (err) {
        return { ok: false, details: `Failed to import Onboarding: ${err.message}` };
      }
    }
  },
  {
    name: 'Onboarding renders without error',
    run: async () => {
      try {
        const { Onboarding } = await import('../src/ui/onboarding/Onboarding.jsx');
        const props = { onFinish: () => {} };
        const html = ReactDOMServer.renderToString(React.createElement(Onboarding, props));
        const ok = typeof html === 'string' && html.length > 0;
        return { ok, details: ok ? '' : 'Onboarding did not render to a non-empty string' };
      } catch (err) {
        return { ok: false, details: `Onboarding render failed: ${err.message}` };
      }
    }
  },
  {
    name: 'Onboarding contains expected title',
    run: async () => {
      try {
        const { Onboarding } = await import('../src/ui/onboarding/Onboarding.jsx');
        const props = { onFinish: () => {} };
        const html = ReactDOMServer.renderToString(React.createElement(Onboarding, props));
        const ok = html.includes('Welcome to MultiWeb Manager'); // from onboarding.title
        return { ok, details: ok ? '' : 'Onboarding does not contain expected title' };
      } catch (err) {
        return { ok: false, details: `Onboarding title test failed: ${err.message}` };
      }
    }
  }
];

export async function runOnboardingTests() {
  return runTests('Onboarding', tests);
}