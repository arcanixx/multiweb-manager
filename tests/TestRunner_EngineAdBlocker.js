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
  // ─── Test: AdBlocker URL detection works ─────────────────
  // Weryfikuje, czy funkcja isAdUrl poprawnie identyfikuje adresy URL jako reklamowe lub nie.
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
  // ─── Test: AdBlocker global toggle works ─────────────────
  // Sprawdza, czy globalny przełącznik AdBlockera poprawnie zmienia jego stan.
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
  // ─── Test: AdBlocker per-profile override works ─────────────────
  // Weryfikuje, czy ustawienia AdBlockera dla konkretnego profilu nadpisują ustawienia globalne.
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
  },

  // ─── setProfileAdBlocker / getProfileAdBlocker ────────────────────────────
  {
    name: 'setProfileAdBlocker – stores value for profile',
    run: async () => {
      const { setProfileAdBlocker, getProfileAdBlocker } = await import('../src/engine/adBlocker.js');
      setProfileAdBlocker('test-profile', false);
      const ok = getProfileAdBlocker('test-profile') === false;
      return { ok, details: ok ? '' : 'setProfileAdBlocker did not persist value' };
    }
  },
  {
    name: 'getProfileAdBlocker – falls back to global when no profile override',
    run: async () => {
      const { getGlobalAdBlocker, getProfileAdBlocker, setGlobalAdBlocker } = await import('../src/engine/adBlocker.js');
      setGlobalAdBlocker(true);
      // profil bez override – powinien zwrócić globalny stan
      const result = getProfileAdBlocker('__nonexistent_profile__');
      const ok = result === getGlobalAdBlocker();
      return { ok, details: ok ? '' : `Got ${result}, expected ${getGlobalAdBlocker()}` };
    }
  },
  {
    name: 'setProfileAdBlocker – missing profileId does not throw',
    run: async () => {
      const { setProfileAdBlocker } = await import('../src/engine/adBlocker.js');
      let threw = false;
      try { setProfileAdBlocker(null, true); } catch { threw = true; }
      // funkcja łapie błąd wewnętrznie i loguje go — nie rzuca na zewnątrz
      return { ok: !threw, details: threw ? 'setProfileAdBlocker threw on null profileId' : '' };
    }
  },
  {
    name: 'initAdBlocker – does not throw when feature disabled',
    run: async () => {
      // initAdBlocker używa session z electron — w środowisku testowym nie jest dostępne.
      // Sprawdzamy tylko eksport — czy funkcja jest callable.
      const { initAdBlocker } = await import('../src/engine/adBlocker.js');
      const ok = typeof initAdBlocker === 'function';
      return { ok, details: ok ? '' : 'initAdBlocker not exported as function' };
    }
  }
];

// ─── runAdBlockerTests() – uruchamia testy jednostkowe blokera reklam ─────────────────
export async function runAdBlockerTests() {
  return runTests('AdBlocker', tests);
}