// =============================================================================
// FILE: TestRunner_Onboarding.js
// PATH: tests/TestRunner_Onboarding.js
// VERSION: 0.0.3
// PURPOSE: Testy komponentu Onboarding – sprawdza eksport i podstawowe renderowanie
// FUNCTIONS: runOnboardingTests
// DEPENDS ON: testUtils.js, path, react, react-dom
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { checkSourceExport, runTests } from './testUtils.js';
import { join } from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

const tests = [
  ...[
    ['StepAccount', 'src/ui/onboarding/StepAccount.jsx'],
    ['StepApps', 'src/ui/onboarding/StepApps.jsx'],
    ['StepIndicator', 'src/ui/onboarding/StepIndicator.jsx'],
    ['StepLanguage', 'src/ui/onboarding/StepLanguage.jsx'],
    ['StepPrivacy', 'src/ui/onboarding/StepPrivacy.jsx'],
    ['StepTheme', 'src/ui/onboarding/StepTheme.jsx']
  ].map(([name, path]) => ({
    name: `${name} - ${path} eksportuje komponent kroku onboardingu`,
    run: async () => checkSourceExport(path, name)
  })),

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
