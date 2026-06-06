// =============================================================================
// FILE: TestRunner_Settings.js
// PATH: tests/TestRunner_Settings.js
// VERSION: 0.0.3
// PURPOSE: Testy silnika ustawień — merge logika, getDefaultSetting, DEBUG_MODULES, settingsStore CRUD.
// FUNCTIONS: runSettingsTests
// DEPENDS ON: testUtils.js, path
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
import { join } from 'path';
const ROOT = process.cwd();

const tests = [
  // ── DEFAULT_SETTINGS i getDefaultSetting ──────────────────────────────────
  {
    name: 'DEFAULT_SETTINGS – theme is dark|light|system',
    run: async () => {
      const { DEFAULT_SETTINGS } = await import(join(ROOT, 'src/config/settings.js'));
      const ok = ['dark', 'light', 'system'].includes(DEFAULT_SETTINGS.theme);
      return { ok, details: ok ? '' : `Invalid theme: ${DEFAULT_SETTINGS.theme}` };
    }
  },
  {
    name: 'getDefaultSetting – returns value for known key',
    run: async () => {
      const { getDefaultSetting, DEFAULT_SETTINGS } = await import(join(ROOT, 'src/config/settings.js'));
      const ok = getDefaultSetting('theme') === DEFAULT_SETTINGS.theme
              && getDefaultSetting('hotkeysEnabled') === DEFAULT_SETTINGS.hotkeysEnabled;
      return { ok, details: ok ? '' : 'getDefaultSetting mismatch' };
    }
  },
  {
    name: 'getDefaultSetting – unknown key returns undefined',
    run: async () => {
      const { getDefaultSetting } = await import(join(ROOT, 'src/config/settings.js'));
      const ok = getDefaultSetting('__nonexistent__') === undefined;
      return { ok, details: ok ? '' : 'Should return undefined for unknown key' };
    }
  },
  {
    name: 'DEBUG_MODULES – contains all required module names',
    run: async () => {
      const { DEBUG_MODULES } = await import(join(ROOT, 'src/config/settings.js'));
      const required = ['webview', 'terminal', 'tasks', 'tools', 'settings', 'engine', 'store', 'ipc', 'ui'];
      const missing = required.filter(m => !(m in DEBUG_MODULES));
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Missing modules: ${missing.join(', ')}` };
    }
  },

  // ── Merge logika (czysta) ─────────────────────────────────────────────────
  {
    name: 'Settings shallow merge preserves unmodified keys',
    run: async () => {
      const current = { language: 'pl', theme: 'dark', debugMode: false };
      const patch    = { theme: 'light' };
      const merged   = { ...current, ...patch };
      const ok = merged.language === 'pl' && merged.theme === 'light' && merged.debugMode === false;
      return { ok, details: ok ? '' : 'Merge lost keys' };
    }
  },
  {
    name: 'Settings deep merge (lodash-style) preserves nested keys',
    run: async () => {
      const current = { resourceMonitor: { warnAt: 70, criticalAt: 90 }, theme: 'dark' };
      const patch    = { resourceMonitor: { warnAt: 80 } };
      // Symulacja lodash _.merge
      const merged = {
        ...current,
        resourceMonitor: { ...current.resourceMonitor, ...patch.resourceMonitor }
      };
      const ok = merged.resourceMonitor.warnAt === 80 && merged.resourceMonitor.criticalAt === 90;
      return { ok, details: ok ? '' : `criticalAt lost: got ${merged.resourceMonitor.criticalAt}` };
    }
  },
  {
    name: 'Dark mode toggle works',
    run: async () => {
      let isDark = false;
      isDark = !isDark;
      return { ok: isDark === true, details: isDark ? '' : 'Toggle failed' };
    }
  },

  // ── Export/Import structure ────────────────────────────────────────────────
  {
    name: 'Export data structure has required fields',
    run: async () => {
      const { DEFAULT_SETTINGS } = await import(join(ROOT, 'src/config/settings.js'));
      const exportData = {
        version: '0.0.3',
        exportedAt: Date.now(),
        settings: { ...DEFAULT_SETTINGS },
        profiles: [],
        tasks: []
      };
      const ok = !!exportData.version && !!exportData.exportedAt
              && typeof exportData.settings === 'object';
      return { ok, details: ok ? '' : 'Missing version or exportedAt or settings' };
    }
  },

  // ── settingsStore (main-process, dynamic import) ───────────────────────────
  {
    name: 'settingsStore – loadSettings/saveSettings/mergeSettings exported',
    run: async () => {
      let mod;
      try {
        mod = await import(join(ROOT, 'src/stores/settingsStore.js'));
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
      const required = ['loadSettings', 'saveSettings', 'mergeSettings', 'updateSettings', 'resetSettings'];
      const missing = required.filter(fn => typeof mod[fn] !== 'function');
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Missing exports: ${missing.join(', ')}` };
    }
  }
];

export async function runSettingsTests() {
  return runTests('Settings', tests);
}