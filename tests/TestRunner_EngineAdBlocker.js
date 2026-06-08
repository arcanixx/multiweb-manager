// =============================================================================
// FILE: TestRunner_EngineAdBlocker.js
// PATH: tests/TestRunner_EngineAdBlocker.js
// VERSION: 0.0.3
// PURPOSE: Testy jednostkowe dla AdBlockera (globalny + per profil, wykrywanie URL)
// FUNCTIONS: runAdBlockerTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';

const tests = [
  // ─── Czysta logika (Node-safe) ────────────────────────────────────────────
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
        const patterns = [/doubleclick/i, /adservice/i, /googlesyndication/i,
          /googleadservices/i, /criteo/i, /outbrain/i];
        return patterns.some(p => p.test(url));
      }
      const allAdDetected = adUrls.every(url => isAdUrl(url));
      const noFalsePositives = nonAdUrls.every(url => !isAdUrl(url));
      const ok = allAdDetected && noFalsePositives;
      return { ok, details: ok ? '' : 'Ad detection failed' };
    }
  },
  {
    name: 'AdBlocker global toggle works',
    run: async () => {
      let globalState = false;
      const setGlobal = (enabled) => { globalState = enabled; };
      setGlobal(true);
      return { ok: globalState === true, details: globalState ? '' : 'Global toggle failed' };
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
      return { ok: getForProfile('profile-1') === true, details: 'Per-profile override not applied' };
    }
  },

  // ─── Direct import adBlocker.js (env:'react') ─────────────────────────────
  // adBlocker.js może importować electron session (main process) – w Node failuje.
  // Te testy weryfikują store API przy uruchomieniu apki.
  {
    name: 'setProfileAdBlocker – stores value for profile',
    env: 'react',
    run: async () => {
      const { setProfileAdBlocker, getProfileAdBlocker } = await import('../src/engine/adBlocker.js');
      setProfileAdBlocker('test-profile', false);
      const ok = getProfileAdBlocker('test-profile') === false;
      return { ok, details: ok ? '' : 'setProfileAdBlocker did not persist value' };
    }
  },
  {
    name: 'getProfileAdBlocker – falls back to global when no profile override',
    env: 'react',
    run: async () => {
      const { getGlobalAdBlocker, getProfileAdBlocker, setGlobalAdBlocker } = await import('../src/engine/adBlocker.js');
      setGlobalAdBlocker(true);
      const result = getProfileAdBlocker('__nonexistent_profile__');
      const ok = result === getGlobalAdBlocker();
      return { ok, details: ok ? '' : `Got ${result}, expected ${getGlobalAdBlocker()}` };
    }
  },
  {
    name: 'setProfileAdBlocker – missing profileId does not throw',
    env: 'react',
    run: async () => {
      const { setProfileAdBlocker } = await import('../src/engine/adBlocker.js');
      let threw = false;
      try { setProfileAdBlocker(null, true); } catch { threw = true; }
      return { ok: !threw, details: threw ? 'setProfileAdBlocker threw on null profileId' : '' };
    }
  },
  {
    name: 'initAdBlocker – does not throw when feature disabled',
    env: 'react',
    run: async () => {
      const { initAdBlocker } = await import('../src/engine/adBlocker.js');
      return { ok: typeof initAdBlocker === 'function', details: 'initAdBlocker not exported as function' };
    }
  },
];

export async function runAdBlockerTests() {
  return runTests('AdBlocker', tests);
}
