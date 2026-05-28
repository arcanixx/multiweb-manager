// =============================================================================
// FILE: TestRunner_MainEngine.js
// PATH: tests/TestRunner_MainEngine.js
// VERSION: 0.0.3
// PURPOSE: Testy modułów wyciągniętych z main.js (webviewRegistry, adBlocker, hotkeysManager)
// FUNCTIONS: runMainEngineTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
const tests = [
  // webviewRegistry
  {
    name: 'webviewRegistry: register and get entry',
    run: async () => {
      const { registerWebView, getWebViewEntry } = await import('../src/engine/webviewRegistry.js');
      registerWebView('tab-test', 999);
      const entry = getWebViewEntry('tab-test');
      const ok = entry && entry.webContentsId === 999;
      return { ok, details: ok ? '' : 'Registration or retrieval failed' };
    }
  },
  {
    name: 'webviewRegistry: unregister removes entry',
    run: async () => {
      const { registerWebView, unregisterWebView, getWebViewEntry } = await import('../src/engine/webviewRegistry.js');
      registerWebView('tab-to-delete', 888);
      unregisterWebView('tab-to-delete');
      const entry = getWebViewEntry('tab-to-delete');
      const ok = !entry;
      return { ok, details: ok ? '' : 'Unregister failed' };
    }
  },
  // adBlocker
  {
    name: 'adBlocker: isAdUrl detects ad patterns',
    run: async () => {
      const { isAdUrl } = await import('../src/engine/adBlocker.js');
      const testUrl = 'https://doubleclick.net/ads.js';
      const ok = isAdUrl(testUrl) === true;
      return { ok, details: ok ? '' : 'Ad not detected' };
    }
  },
  {
    name: 'adBlocker: setGlobal and getGlobal work',
    run: async () => {
      const { setGlobalAdBlocker, getGlobalAdBlocker } = await import('../src/engine/adBlocker.js');
      setGlobalAdBlocker(false);
      const ok = getGlobalAdBlocker() === false;
      setGlobalAdBlocker(true); // przywróć
      return { ok, details: ok ? '' : 'Global toggle failed' };
    }
  },
  // hotkeysManager (częściowo – pełne testy wymagają electron)
  {
    name: 'hotkeysManager: getAllHotkeys returns array',
    run: async () => {
      const { getAllHotkeys } = await import('../src/engine/hotkeysManager.js');
      const hotkeys = await getAllHotkeys();
      const ok = Array.isArray(hotkeys);
      return { ok, details: ok ? '' : 'getAllHotkeys did not return array' };
    }
  }
];

export async function runMainEngineTests() {
  return runTests('MainEngine', tests);
}