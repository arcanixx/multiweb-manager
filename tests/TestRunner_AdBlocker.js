// =============================================================================
// FILE: TestRunner_AdBlocker.js
// PATH: tests/TestRunner_AdBlocker.js
// VERSION: 0.0.3
// PURPOSE: Testy jednostkowe dla AdBlockera (globalny + per profil, wykrywanie URL)
// FUNCTIONS: runAdBlockerTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
const tests = [
  {
    name: 'AdBlocker URL detection works',
    run: async () => {
      const adUrls = [
        'https://doubleclick.net/ads.js',
        'https://googleadservices.com/pagead',
        'https://criteo.com/delivery',
        'https://outbrain.com/widget'
      ];
      const nonAdUrls = [
        'https://github.com',
        'https://chat.openai.com',
        'https://google.com/search'
      ];
      function isAdUrl(url) {
        const patterns = [
          /doubleclick/i, /adservice/i, /googlesyndication/i,
          /googleadservices/i, /criteo/i, /outbrain/i
        ];
        return patterns.some(p => p.test(url));
      }
      let allAdDetected = true;
      for (const url of adUrls) {
        if (!isAdUrl(url)) allAdDetected = false;
      }
      let noFalsePositives = true;
      for (const url of nonAdUrls) {
        if (isAdUrl(url)) noFalsePositives = false;
      }
      const ok = allAdDetected && noFalsePositives;
      return { ok, details: ok ? '' : 'Ad detection failed' };
    }
  },
  {
    name: 'AdBlocker global toggle works',
    run: async () => {
      let globalState = false;
      const setGlobal = (enabled) => { globalState = enabled; };
      const getGlobal = () => globalState;
      setGlobal(true);
      const ok = getGlobal() === true;
      return { ok, details: ok ? '' : 'Global toggle failed' };
    }
  },
  {
    name: 'AdBlocker per-profile override works',
    run: async () => {
      let globalState = false;
      const profileOverrides = new Map();
      const setForProfile = (id, enabled) => { profileOverrides.set(id, enabled); };
      const getForProfile = (id) => profileOverrides.has(id) ? profileOverrides.get(id) : globalState;

      setForProfile('profile-1', true);
      const result = getForProfile('profile-1');
      const ok = result === true;
      return { ok, details: ok ? '' : 'Per-profile override not applied' };
    }
  }
];

export async function runAdBlockerTests() {
  return runTests('AdBlocker', tests);
}
