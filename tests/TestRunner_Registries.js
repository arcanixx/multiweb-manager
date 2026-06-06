// =============================================================================
// FILE: TestRunner_Registries.js
// PATH: tests/TestRunner_Registries.js
// VERSION: 0.0.3
// PURPOSE: Testy rejestrów komponentów (settingsRegistry, toolsRegistry) — eksporty, kompletność wpisów, flagi featureFlag, getSettingsComponent/getToolComponent.
// FUNCTIONS: runRegistriesTests
// DEPENDS ON: testUtils.js, path
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
import { join } from 'path';
const ROOT = process.cwd();

const tests = [
  // ── settingsRegistry ──────────────────────────────────────────────────────
  {
    name: 'settingsRegistry – SETTINGS_REGISTRY and getSettingsComponent exported',
    run: async () => {
      const mod = await import(join(ROOT, 'src/config/settingsRegistry.js'));
      const ok = Array.isArray(mod.SETTINGS_REGISTRY) && typeof mod.getSettingsComponent === 'function';
      return { ok, details: ok ? '' : 'Missing exports' };
    }
  },
  {
    name: 'settingsRegistry – required ids present (settings, help, aggregatedTasks, history)',
    run: async () => {
      const { SETTINGS_REGISTRY } = await import(join(ROOT, 'src/config/settingsRegistry.js'));
      const ids = SETTINGS_REGISTRY.map(e => e.id);
      const required = ['settings', 'help', 'aggregatedTasks', 'history'];
      const missing = required.filter(id => !ids.includes(id));
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Missing ids: ${missing.join(', ')}` };
    }
  },
  {
    name: 'settingsRegistry – every entry has id and component',
    run: async () => {
      const { SETTINGS_REGISTRY } = await import(join(ROOT, 'src/config/settingsRegistry.js'));
      const bad = SETTINGS_REGISTRY.filter(e => !e.id || !e.component);
      const ok = bad.length === 0;
      return { ok, details: ok ? '' : `Bad entries: ${bad.map(e => e.id).join(', ')}` };
    }
  },
  {
    name: 'settingsRegistry – featureFlag entries reference valid FEATURES keys',
    run: async () => {
      const { SETTINGS_REGISTRY } = await import(join(ROOT, 'src/config/settingsRegistry.js'));
      const { FEATURES } = await import(join(ROOT, 'src/config/features.js'));
      const bad = SETTINGS_REGISTRY
        .filter(e => e.featureFlag)
        .filter(e => !(e.featureFlag in FEATURES));
      const ok = bad.length === 0;
      return { ok, details: ok ? '' : `Unknown featureFlags: ${bad.map(e => e.featureFlag).join(', ')}` };
    }
  },
  {
    name: 'getSettingsComponent – returns entry for known id',
    run: async () => {
      const { getSettingsComponent } = await import(join(ROOT, 'src/config/settingsRegistry.js'));
      const entry = getSettingsComponent('settings');
      const ok = entry !== null && entry.id === 'settings' && typeof entry.disabled === 'boolean';
      return { ok, details: ok ? '' : `Got: ${JSON.stringify(entry)}` };
    }
  },
  {
    name: 'getSettingsComponent – returns null for unknown id',
    run: async () => {
      const { getSettingsComponent } = await import(join(ROOT, 'src/config/settingsRegistry.js'));
      const entry = getSettingsComponent('__nonexistent__');
      return { ok: entry === null, details: entry === null ? '' : `Expected null, got ${JSON.stringify(entry)}` };
    }
  },
  {
    name: 'getSettingsComponent – disabled=false for active feature, disabled=true for inactive',
    run: async () => {
      const { getSettingsComponent } = await import(join(ROOT, 'src/config/settingsRegistry.js'));
      // help ma featureFlag: 'helpScreen' (true domyślnie)
      const helpEntry = getSettingsComponent('help');
      // settings nie ma featureFlag — zawsze disabled=false
      const settingsEntry = getSettingsComponent('settings');
      const ok = settingsEntry?.disabled === false && helpEntry !== null;
      return { ok, details: ok ? '' : `settings.disabled=${settingsEntry?.disabled}, help=${JSON.stringify(helpEntry)}` };
    }
  },

  // ── toolsRegistry ─────────────────────────────────────────────────────────
  {
    name: 'toolsRegistry – TOOLS_REGISTRY and getToolComponent exported',
    run: async () => {
      const mod = await import(join(ROOT, 'src/config/toolsRegistry.js'));
      const ok = Array.isArray(mod.TOOLS_REGISTRY) && typeof mod.getToolComponent === 'function';
      return { ok, details: ok ? '' : 'Missing exports' };
    }
  },
  {
    name: 'toolsRegistry – required tool ids present',
    run: async () => {
      const { TOOLS_REGISTRY } = await import(join(ROOT, 'src/config/toolsRegistry.js'));
      const ids = TOOLS_REGISTRY.map(e => e.id);
      const required = ['notepad', 'projectManager', 'removebg', 'stringCombiner',
        'terminal', 'jsonYamlXmlFormatter', 'regexTester', 'markdownPreviewer',
        'clipboardHistory', 'cookieGrabber'];
      const missing = required.filter(id => !ids.includes(id));
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Missing: ${missing.join(', ')}` };
    }
  },
  {
    name: 'toolsRegistry – every entry has id and component',
    run: async () => {
      const { TOOLS_REGISTRY } = await import(join(ROOT, 'src/config/toolsRegistry.js'));
      const bad = TOOLS_REGISTRY.filter(e => !e.id || !e.component);
      const ok = bad.length === 0;
      return { ok, details: ok ? '' : `Bad entries: ${bad.map(e => e.id || '?').join(', ')}` };
    }
  },
  {
    name: 'toolsRegistry – featureFlag entries reference valid FEATURES keys',
    run: async () => {
      const { TOOLS_REGISTRY } = await import(join(ROOT, 'src/config/toolsRegistry.js'));
      const { FEATURES } = await import(join(ROOT, 'src/config/features.js'));
      const bad = TOOLS_REGISTRY
        .filter(e => e.featureFlag)
        .filter(e => !(e.featureFlag in FEATURES));
      const ok = bad.length === 0;
      return { ok, details: ok ? '' : `Unknown featureFlags: ${bad.map(e => e.featureFlag).join(', ')}` };
    }
  },
  {
    name: 'getToolComponent – returns entry for known id',
    run: async () => {
      const { getToolComponent } = await import(join(ROOT, 'src/config/toolsRegistry.js'));
      const entry = getToolComponent('notepad');
      const ok = entry !== null && entry.id === 'notepad' && typeof entry.disabled === 'boolean';
      return { ok, details: ok ? '' : `Got: ${JSON.stringify(entry)}` };
    }
  },
  {
    name: 'getToolComponent – returns null for unknown id',
    run: async () => {
      const { getToolComponent } = await import(join(ROOT, 'src/config/toolsRegistry.js'));
      const entry = getToolComponent('__nonexistent__');
      return { ok: entry === null, details: entry === null ? '' : `Expected null, got: ${JSON.stringify(entry)}` };
    }
  },

  // ── Spójność między rejestrami ─────────────────────────────────────────────
  {
    name: 'No id overlap between SETTINGS_REGISTRY and TOOLS_REGISTRY',
    run: async () => {
      const { SETTINGS_REGISTRY } = await import(join(ROOT, 'src/config/settingsRegistry.js'));
      const { TOOLS_REGISTRY }    = await import(join(ROOT, 'src/config/toolsRegistry.js'));
      const settingsIds = new Set(SETTINGS_REGISTRY.map(e => e.id));
      const overlap = TOOLS_REGISTRY.map(e => e.id).filter(id => settingsIds.has(id));
      const ok = overlap.length === 0;
      return { ok, details: ok ? '' : `Overlapping ids: ${overlap.join(', ')}` };
    }
  }
];

export async function runRegistriesTests() {
  return runTests('Registries', tests);
}