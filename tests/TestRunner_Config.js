// =============================================================================
// FILE: TestRunner_Config.js
// PATH: tests/TestRunner_Config.js
// VERSION: 0.0.3
// PURPOSE: Testy modułów konfiguracyjnych z src/config/* — features, limits, settings, app, paths, endpoints oraz re-eksportu przez src/config.js.
// FUNCTIONS: runConfigTests
// DEPENDS ON: fs, testUtils.js, path
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { existsSync, readFileSync } from 'fs';
import { runTests, safeImport } from './testUtils.js';
import { join } from 'path';
const ROOT = process.cwd();

async function importModule(relPath) {
  try { return { ok: true, data: await safeImport(relPath) }; }
  catch (err) { return { ok: false, error: err.message }; }
}

const tests = [
  // ── Istnienie plików ────────────────────────────────────────────────────────
  {
    name: 'src/config.js (re-export barrel) exists',
    run: async () => {
      const exists = existsSync(join(ROOT, 'src/config.js'));
      return { ok: exists, details: exists ? '' : 'src/config.js not found' };
    }
  },
  {
    name: 'src/config.js re-exports all sub-modules (featuresConfig, limitsConfig, settingsConfig, ...)',
    run: async () => {
      const path = join(ROOT, 'src/config.js');
      if (!existsSync(path)) return { ok: false, details: 'src/config.js not found' };
      const content = readFileSync(path, 'utf-8');
      // Pliki nazywają się *Config.js w src/config/
      const required = ['featuresConfig.js', 'limitsConfig.js', 'settingsConfig.js', 'pathsConfig.js', 'endpointsConfig.js'];
      const missing = required.filter(f => !content.includes(f));
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Missing re-exports: ${missing.join(', ')}` };
    }
  },
  {
    name: 'All src/config/* sub-files exist',
    run: async () => {
      const files = ['appConfig.js', 'featuresConfig.js', 'limitsConfig.js', 'pathsConfig.js', 'settingsConfig.js', 'endpointsConfig.js'];
      const missing = files.filter(f => !existsSync(join(ROOT, 'src/config', f)));
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Missing: ${missing.join(', ')}` };
    }
  },

  // ── features ────────────────────────────────────────────────────────────────
  {
    name: 'FEATURES – all flags are boolean',
    run: async () => {
      const r = await importModule('src/config/featuresConfig.js');
      if (!r.ok) return { ok: false, details: r.error };
      const { FEATURES } = r.data;
      if (!FEATURES) return { ok: false, details: 'FEATURES not exported' };
      const invalid = Object.entries(FEATURES).filter(([, v]) => typeof v !== 'boolean');
      const ok = invalid.length === 0;
      return { ok, details: ok ? '' : `Non-boolean: ${invalid.map(([k]) => k).join(', ')}` };
    }
  },
  {
    name: 'isFeatureEnabled – returns correct boolean',
    run: async () => {
      const r = await importModule('src/config/featuresConfig.js');
      if (!r.ok) return { ok: false, details: r.error };
      const { isFeatureEnabled } = r.data;
      if (typeof isFeatureEnabled !== 'function') return { ok: false, details: 'isFeatureEnabled not a function' };
      const resultTrue  = isFeatureEnabled('helpScreen');
      const resultFalse = isFeatureEnabled('__nonexistent__');
      const ok = resultTrue === true && resultFalse === false;
      return { ok, details: ok ? '' : `helpScreen=${resultTrue}, nonexistent=${resultFalse}` };
    }
  },
  {
    name: 'isToolEnabled – alias isFeatureEnabled, works identically',
    run: async () => {
      const r = await importModule('src/config/featuresConfig.js');
      if (!r.ok) return { ok: false, details: r.error };
      const { isToolEnabled, isFeatureEnabled } = r.data;
      if (typeof isToolEnabled !== 'function') return { ok: false, details: 'isToolEnabled not exported' };
      const ok = isToolEnabled('clipboardHistory') === isFeatureEnabled('clipboardHistory');
      return { ok, details: ok ? '' : 'isToolEnabled !== isFeatureEnabled for same key' };
    }
  },
  {
    name: 'FEATURES – required keys present',
    run: async () => {
      const r = await importModule('src/config/featuresConfig.js');
      if (!r.ok) return { ok: false, details: r.error };
      const { FEATURES } = r.data;
      const required = ['helpScreen', 'appLibrary', 'sleepTabs', 'adBlocker', 'clipboardHistory',
        'hotkeysManager', 'exportImport', 'resourceMonitor', 'singleAppMode'];
      const missing = required.filter(k => !(k in FEATURES));
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Missing keys: ${missing.join(', ')}` };
    }
  },

  // ── limits ──────────────────────────────────────────────────────────────────
  {
    name: 'LIMITS – all values are positive numbers',
    run: async () => {
      const r = await importModule('src/config/limitsConfig.js');
      if (!r.ok) return { ok: false, details: r.error };
      const { LIMITS } = r.data;
      if (!LIMITS) return { ok: false, details: 'LIMITS not exported' };
      const invalid = Object.entries(LIMITS).filter(([, v]) => typeof v !== 'number' || v <= 0);
      const ok = invalid.length === 0;
      return { ok, details: ok ? '' : `Invalid: ${invalid.map(([k]) => k).join(', ')}` };
    }
  },
  {
    name: 'getLimit – returns correct value for known key',
    run: async () => {
      const r = await importModule('src/config/limitsConfig.js');
      if (!r.ok) return { ok: false, details: r.error };
      const { getLimit, LIMITS } = r.data;
      if (typeof getLimit !== 'function') return { ok: false, details: 'getLimit not a function' };
      const key = Object.keys(LIMITS)[0];
      const ok = getLimit(key) === LIMITS[key];
      return { ok, details: ok ? '' : `getLimit('${key}') mismatch` };
    }
  },
  {
    name: 'getLimit – returns undefined for unknown key',
    run: async () => {
      const r = await importModule('src/config/limitsConfig.js');
      if (!r.ok) return { ok: false, details: r.error };
      const { getLimit } = r.data;
      const ok = getLimit('__nonexistent__') === undefined;
      return { ok, details: ok ? '' : 'Expected undefined for unknown key' };
    }
  },

  // ── settings ────────────────────────────────────────────────────────────────
  {
    name: 'DEFAULT_SETTINGS – required keys present',
    run: async () => {
      const r = await importModule('src/config/settingsConfig.js');
      if (!r.ok) return { ok: false, details: r.error };
      const { DEFAULT_SETTINGS } = r.data;
      if (!DEFAULT_SETTINGS) return { ok: false, details: 'DEFAULT_SETTINGS not exported' };
      const required = ['language', 'theme', 'debugMode', 'firstRun', 'logsEnabled',
        'sleepTabsTimeout', 'defaultZoom', 'hotkeysEnabled', 'defaultProfileCategory'];
      const missing = required.filter(k => !(k in DEFAULT_SETTINGS));
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Missing: ${missing.join(', ')}` };
    }
  },
  {
    name: 'getDefaultSetting – returns correct values',
    run: async () => {
      const r = await importModule('src/config/settingsConfig.js');
      if (!r.ok) return { ok: false, details: r.error };
      const { getDefaultSetting, DEFAULT_SETTINGS } = r.data;
      if (typeof getDefaultSetting !== 'function') return { ok: false, details: 'getDefaultSetting not a function' };
      const ok = getDefaultSetting('theme') === DEFAULT_SETTINGS.theme
              && getDefaultSetting('__nonexistent__') === undefined;
      return { ok, details: ok ? '' : 'getDefaultSetting returned unexpected value' };
    }
  },
  {
    name: 'DEBUG_MODULES – all values are boolean',
    run: async () => {
      const r = await importModule('src/config/settingsConfig.js');
      if (!r.ok) return { ok: false, details: r.error };
      const { DEBUG_MODULES } = r.data;
      if (!DEBUG_MODULES) return { ok: false, details: 'DEBUG_MODULES not exported' };
      const required = ['webview', 'terminal', 'tasks', 'tools', 'settings', 'engine', 'store', 'ipc', 'ui'];
      const missing = required.filter(m => !(m in DEBUG_MODULES));
      const nonBool  = Object.entries(DEBUG_MODULES).filter(([, v]) => typeof v !== 'boolean');
      const ok = missing.length === 0 && nonBool.length === 0;
      return { ok, details: ok ? '' : `Missing: ${missing.join(', ')} | NonBool: ${nonBool.map(([k])=>k).join(', ')}` };
    }
  },

  // ── paths ───────────────────────────────────────────────────────────────────
  {
    name: 'PATHS – all values are strings',
    run: async () => {
      const r = await importModule('src/config/pathsConfig.js');
      if (!r.ok) return { ok: false, details: r.error };
      const { PATHS } = r.data;
      if (!PATHS) return { ok: false, details: 'PATHS not exported' };
      const invalid = Object.entries(PATHS).filter(([, v]) => typeof v !== 'string');
      const ok = invalid.length === 0;
      return { ok, details: ok ? '' : `Non-string paths: ${invalid.map(([k]) => k).join(', ')}` };
    }
  },

  // ── endpoints ───────────────────────────────────────────────────────────────
  {
    name: 'API_ENDPOINTS – all values are valid http(s) URLs',
    run: async () => {
      const r = await importModule('src/config/endpointsConfig.js');
      if (!r.ok) return { ok: false, details: r.error };
      const { API_ENDPOINTS } = r.data;
      if (!API_ENDPOINTS) return { ok: false, details: 'API_ENDPOINTS not exported' };
      const invalid = Object.entries(API_ENDPOINTS).filter(([, v]) => !/^https?:\/\//.test(v));
      const ok = invalid.length === 0;
      return { ok, details: ok ? '' : `Invalid URLs: ${invalid.map(([k]) => k).join(', ')}` };
    }
  },

  // ── root/config.js re-export ───────────────────────────────────────────────
  {
    name: 'root/config.js exists and re-exports src/config.js',
    run: async () => {
      const rootConfig = join(ROOT, 'config.js');
      if (!existsSync(rootConfig)) return { ok: false, details: 'root/config.js not found' };
      const content = readFileSync(rootConfig, 'utf-8');
      const ok = content.includes('export *') && content.includes('src/config.js');
      return { ok, details: ok ? '' : 'root/config.js does not re-export src/config.js' };
    }
  },

  // ── settingsRegistry ────────────────────────────────────────────────────────
  {
    name: 'src/config/settingsRegistryConfig.js exists',
    run: async () => {
      const exists = existsSync(join(ROOT, 'src/config/settingsRegistryConfig.js'));
      return { ok: exists, details: exists ? '' : 'src/config/settingsRegistryConfig.js not found' };
    }
  },
  {
    name: 'settingsRegistry – SETTINGS_REGISTRY is non-empty array',
    run: async () => {
      const r = await importModule('src/config/settingsRegistryConfig.js');
      if (!r.ok) return { ok: false, details: r.error };
      const { SETTINGS_REGISTRY } = r.data;
      const ok = Array.isArray(SETTINGS_REGISTRY) && SETTINGS_REGISTRY.length > 0;
      return { ok, details: ok ? '' : 'SETTINGS_REGISTRY empty or not array' };
    }
  },
  {
    name: 'settingsRegistry – getSettingsComponent exported as function',
    run: async () => {
      const r = await importModule('src/config/settingsRegistryConfig.js');
      if (!r.ok) return { ok: false, details: r.error };
      const ok = typeof r.data.getSettingsComponent === 'function';
      return { ok, details: ok ? '' : 'getSettingsComponent not a function' };
    }
  },
  {
    name: 'settingsRegistry – getSettingsComponent returns null for unknown id',
    run: async () => {
      const r = await importModule('src/config/settingsRegistryConfig.js');
      if (!r.ok) return { ok: false, details: r.error };
      const result = r.data.getSettingsComponent('__nonexistent__');
      return { ok: result === null, details: result === null ? '' : `Expected null, got ${JSON.stringify(result)}` };
    }
  },
  {
    name: 'settingsRegistry – no duplicate ids',
    run: async () => {
      const r = await importModule('src/config/settingsRegistryConfig.js');
      if (!r.ok) return { ok: false, details: r.error };
      const ids = r.data.SETTINGS_REGISTRY.map(e => e.id);
      const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
      const ok = dupes.length === 0;
      return { ok, details: ok ? '' : `Duplicate ids: ${dupes.join(', ')}` };
    }
  }
];

export async function runConfigTests() {
  return runTests('Config', tests);
}
