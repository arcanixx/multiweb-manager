// =============================================================================
// FILE: TestRunner_MainEngine.js
// PATH: tests/TestRunner_MainEngine.js
// VERSION: 0.0.3
// PURPOSE: Testy modułów silnika głównego: webviewRegistry, resourceMonitor, webviewScriptInjector, hotkeysManager.
// FUNCTIONS: runMainEngineTests
// DEPENDS ON: testUtils.js, path
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
import { join } from 'path';
const ROOT = process.cwd();


const tests = [
  // ── webviewRegistry ─────────────────────────────────────────────────────
  {
    name: 'webviewRegistry – register and get entry',
    run: async () => {
      const { registerWebView, getWebViewEntry } = await import(join(ROOT, 'src/engine/webviewRegistry.js'));
      registerWebView('tab-test-1', 999);
      const entry = getWebViewEntry('tab-test-1');
      const ok = entry && entry.webContentsId === 999;
      return { ok, details: ok ? '' : `Entry: ${JSON.stringify(entry)}` };
    }
  },
  {
    name: 'webviewRegistry – unregister removes entry',
    run: async () => {
      const { registerWebView, unregisterWebView, getWebViewEntry } = await import(join(ROOT, 'src/engine/webviewRegistry.js'));
      registerWebView('tab-to-delete', 888);
      unregisterWebView('tab-to-delete');
      const entry = getWebViewEntry('tab-to-delete');
      return { ok: !entry, details: entry ? 'Entry still exists after unregister' : '' };
    }
  },
  {
    name: 'webviewRegistry – getAllWebContents returns array',
    run: async () => {
      const { getAllWebContents } = await import(join(ROOT, 'src/engine/webviewRegistry.js'));
      if (typeof getAllWebContents !== 'function') return { ok: false, details: 'getAllWebContents not exported' };
      const result = getAllWebContents();
      const ok = Array.isArray(result);
      return { ok, details: ok ? '' : 'getAllWebContents did not return array' };
    }
  },
  {
    name: 'webviewRegistry – registering same tabId overwrites previous entry',
    run: async () => {
      const { registerWebView, getWebViewEntry } = await import(join(ROOT, 'src/engine/webviewRegistry.js'));
      registerWebView('tab-overwrite', 100);
      registerWebView('tab-overwrite', 200);
      const entry = getWebViewEntry('tab-overwrite');
      const ok = entry && entry.webContentsId === 200;
      return { ok, details: ok ? '' : `Expected 200, got ${entry?.webContentsId}` };
    }
  },

  // ── resourceMonitor ──────────────────────────────────────────────────────
  {
    name: 'resourceMonitor – getSystemUsage exported as function',
    run: async () => {
      const mod = await import(join(ROOT, 'src/engine/resourceMonitor.js'));
      const ok = typeof mod.getSystemUsage === 'function';
      return { ok, details: ok ? '' : 'getSystemUsage not exported' };
    }
  },
  {
    name: 'resourceMonitor – getSystemUsage returns object with required fields',
    run: async () => {
      const { getSystemUsage } = await import(join(ROOT, 'src/engine/resourceMonitor.js'));
      const result = getSystemUsage();
      const required = ['cpuPercent', 'ramPercent', 'warnAt', 'criticalAt'];
      const missing = required.filter(k => !(k in result));
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Missing fields: ${missing.join(', ')}` };
    }
  },
  {
    name: 'resourceMonitor – cpuPercent and ramPercent are numbers 0–100',
    run: async () => {
      const { getSystemUsage } = await import(join(ROOT, 'src/engine/resourceMonitor.js'));
      const { cpuPercent, ramPercent } = getSystemUsage();
      const ok = typeof cpuPercent === 'number' && cpuPercent >= 0 && cpuPercent <= 100
              && typeof ramPercent === 'number' && ramPercent >= 0 && ramPercent <= 100;
      return { ok, details: ok ? '' : `cpu=${cpuPercent}, ram=${ramPercent}` };
    }
  },
  {
    name: 'resourceMonitor – warnAt < criticalAt (sensible thresholds)',
    run: async () => {
      const { getSystemUsage } = await import(join(ROOT, 'src/engine/resourceMonitor.js'));
      const { warnAt, criticalAt } = getSystemUsage();
      const ok = warnAt < criticalAt;
      return { ok, details: ok ? '' : `warnAt(${warnAt}) should be < criticalAt(${criticalAt})` };
    }
  },

  // ── webviewScriptInjector ────────────────────────────────────────────────
  {
    name: 'webviewScriptInjector – all functions exported',
    run: async () => {
      const mod = await import(join(ROOT, 'src/engine/webviewScriptInjector.js'));
      const required = ['injectUserCSS', 'removeUserCSS', 'injectUserScript',
        'scheduleInjectionOnLoad', 'removeInjectionListeners'];
      const missing = required.filter(fn => typeof mod[fn] !== 'function');
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Missing: ${missing.join(', ')}` };
    }
  },
  {
    name: 'webviewScriptInjector – removeInjectionListeners handles missing wc gracefully',
    run: async () => {
      const { removeInjectionListeners } = await import(join(ROOT, 'src/engine/webviewScriptInjector.js'));
      let threw = false;
      try {
        // Wywołanie z null/undefined webContents nie powinno crashować
        removeInjectionListeners({ id: 99999 });
      } catch {
        threw = true;
      }
      return { ok: !threw, details: threw ? 'removeInjectionListeners threw on unknown wc' : '' };
    }
  },

  // ── hotkeysManager ───────────────────────────────────────────────────────
  {
    name: 'hotkeysManager – getAllHotkeys returns array',
    run: async () => {
      const { getAllHotkeys } = await import(join(ROOT, 'src/engine/hotkeysManager.js'));
      const hotkeys = await getAllHotkeys();
      const ok = Array.isArray(hotkeys);
      return { ok, details: ok ? '' : 'getAllHotkeys did not return array' };
    }
  },
  {
    name: 'hotkeysManager – required functions exported',
    run: async () => {
      const mod = await import(join(ROOT, 'src/engine/hotkeysManager.js'));
      const required = ['getAllHotkeys', 'setMainWindow', 'unregisterAllHotkeys',
        'registerGlobalHotkeys', 'registerHotkeysFromList'];
      const missing = required.filter(fn => typeof mod[fn] !== 'function');
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Missing: ${missing.join(', ')}` };
    }
  }
];

export async function runMainEngineTests() {
  return runTests('MainEngine', tests);
}