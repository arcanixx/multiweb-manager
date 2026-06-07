// =============================================================================
// FILE: TestRunner_ConfigLimits.js
// PATH: tests/TestRunner_ConfigLimits.js
// VERSION: 0.0.3
// PURPOSE: Testy modułu limitów aplikacji (src/config/limitsConfig.js) — LIMITS, getLimit.
// FUNCTIONS: runLimitsTests
// DEPENDS ON: testUtils.js, path
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests, safeImport } from './testUtils.js';
import { join } from 'path';
const ROOT = process.cwd();

const tests = [
  {
    name: 'LIMITS – all expected keys exist',
    run: async () => {
      const { LIMITS } = await safeImport('src/config/limitsConfig.js');
      const required = ['maxClipboardItems', 'maxRecentApps', 'maxNotepadEntries',
        'maxTasks', 'maxProjects', 'maxHistoryEntries', 'maxWebviews', 'maxTileViewColumns'];
      const missing = required.filter(k => !(k in LIMITS));
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Missing: ${missing.join(', ')}` };
    }
  },
  {
    name: 'LIMITS – all values are positive integers',
    run: async () => {
      const { LIMITS } = await safeImport('src/config/limitsConfig.js');
      const invalid = Object.entries(LIMITS).filter(([, v]) => !Number.isInteger(v) || v <= 0);
      const ok = invalid.length === 0;
      return { ok, details: ok ? '' : `Non-positive-integer: ${invalid.map(([k]) => k).join(', ')}` };
    }
  },
  {
    name: 'getLimit – returns exact LIMITS value for known key',
    run: async () => {
      const { getLimit, LIMITS } = await safeImport('src/config/limitsConfig.js');
      const checks = Object.entries(LIMITS).map(([k, v]) => getLimit(k) === v);
      const ok = checks.every(Boolean);
      return { ok, details: ok ? '' : 'Some getLimit() calls returned wrong values' };
    }
  },
  {
    name: 'getLimit – returns undefined for unknown key',
    run: async () => {
      const { getLimit } = await safeImport('src/config/limitsConfig.js');
      const ok = getLimit('__nonexistent__') === undefined;
      return { ok, details: ok ? '' : 'Expected undefined for unknown key' };
    }
  },
  {
    name: 'LIMITS – maxTasks > maxProjects (sensible hierarchy)',
    run: async () => {
      const { LIMITS } = await safeImport('src/config/limitsConfig.js');
      const ok = LIMITS.maxTasks > LIMITS.maxProjects;
      return { ok, details: ok ? '' : `maxTasks(${LIMITS.maxTasks}) should be > maxProjects(${LIMITS.maxProjects})` };
    }
  },
  {
    name: 'LIMITS – maxClipboardItems <= 100 (performance guard)',
    run: async () => {
      const { LIMITS } = await safeImport('src/config/limitsConfig.js');
      const ok = LIMITS.maxClipboardItems <= 100;
      return { ok, details: ok ? '' : `maxClipboardItems=${LIMITS.maxClipboardItems} exceeds 100` };
    }
  }
];

export async function runLimitsTests() {
  return runTests('Limits', tests);
}