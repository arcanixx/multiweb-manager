// =============================================================================
// FILE: TestRunner_Features.js
// PATH: tests/TestRunner_Features.js
// VERSION: 0.0.3
// PURPOSE: Testy modułu feature flags (src/config/features.js) — isFeatureEnabled, isToolEnabled, spójność FEATURES.
// FUNCTIONS: runFeaturesTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
import { join } from 'path';

const ROOT = process.cwd();

const tests = [
  {
    name: 'isFeatureEnabled – known enabled flag returns true',
    run: async () => {
      const { isFeatureEnabled } = await import(join(ROOT, 'src/config/features.js'));
      const ok = isFeatureEnabled('helpScreen') === true;
      return { ok, details: ok ? '' : 'helpScreen should be enabled' };
    }
  },
  {
    name: 'isFeatureEnabled – unknown key returns false',
    run: async () => {
      const { isFeatureEnabled } = await import(join(ROOT, 'src/config/features.js'));
      const ok = isFeatureEnabled('__nonexistent__key__') === false;
      return { ok, details: ok ? '' : 'Unknown key should return false' };
    }
  },
  {
    name: 'isToolEnabled – matches isFeatureEnabled for same key',
    run: async () => {
      const { isFeatureEnabled, isToolEnabled } = await import(join(ROOT, 'src/config/features.js'));
      const keys = ['clipboardHistory', 'regexTester', 'jsonYamlXmlFormatter'];
      const mismatches = keys.filter(k => isToolEnabled(k) !== isFeatureEnabled(k));
      const ok = mismatches.length === 0;
      return { ok, details: ok ? '' : `Mismatches: ${mismatches.join(', ')}` };
    }
  },
  {
    name: 'FEATURES – devTools is disabled by default',
    run: async () => {
      const { FEATURES } = await import(join(ROOT, 'src/config/features.js'));
      // devTools powinno być false w UAT (bezpieczeństwo)
      const ok = FEATURES.devTools === false;
      return { ok, details: ok ? '' : 'devTools should be false in production/UAT' };
    }
  },
  {
    name: 'FEATURES – no undefined or null values',
    run: async () => {
      const { FEATURES } = await import(join(ROOT, 'src/config/features.js'));
      const bad = Object.entries(FEATURES).filter(([, v]) => v === undefined || v === null);
      const ok = bad.length === 0;
      return { ok, details: ok ? '' : `Null/undefined flags: ${bad.map(([k]) => k).join(', ')}` };
    }
  },
  {
    name: 'FEATURES – WebView group keys exist',
    run: async () => {
      const { FEATURES } = await import(join(ROOT, 'src/config/features.js'));
      const webviewKeys = ['tileView', 'singleAppMode', 'screenshotWebView', 'resourceMonitor', 'sleepTabs', 'adBlocker'];
      const missing = webviewKeys.filter(k => !(k in FEATURES));
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Missing WebView flags: ${missing.join(', ')}` };
    }
  },
  {
    name: 'FEATURES – Tools group keys exist',
    run: async () => {
      const { FEATURES } = await import(join(ROOT, 'src/config/features.js'));
      const toolKeys = ['removeBg', 'stringCombiner', 'jsonYamlXmlFormatter', 'regexTester',
        'markdownPreviewer', 'imageTools', 'svgToPng', 'filePreviewer', 'miniPostman',
        'clipboardHistory', 'cookieGrabber'];
      const missing = toolKeys.filter(k => !(k in FEATURES));
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Missing Tools flags: ${missing.join(', ')}` };
    }
  }
];

export async function runFeaturesTests() {
  return runTests('Features', tests);
}
