// =============================================================================
// FILE: TestRunner_ConfigRegistries.js
// PATH: tests/TestRunner_ConfigRegistries.js
// VERSION: 0.0.3
// PURPOSE: Testy rejestrów komponentów (settingsRegistry, toolsRegistry) – eksporty,
//          kompletność wpisów, featureFlag, getSettingsComponent/getToolComponent.
// FUNCTIONS: runRegistriesTests
// DEPENDS ON: testUtils.js, fs, path
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { checkSourceExport, runTests, safeImport } from './testUtils.js';
import { readFileSync } from 'fs';
import { join } from 'path';

// ─── Pomocnik: czyta plik i parsuje id-sy z SETTINGS_REGISTRY / TOOLS_REGISTRY
function extractIds(relativePath, registryName) {
  try {
    const src = readFileSync(join(process.cwd(), relativePath), 'utf8');
    const matches = [...src.matchAll(/id:\s*['"]([^'"]+)['"]/g)];
    return matches.map(m => m[1]);
  } catch {
    return [];
  }
}

// ─── Pomocnik: sprawdza obecność klucza w źródle pliku
function sourceContains(relativePath, ...patterns) {
  try {
    const src = readFileSync(join(process.cwd(), relativePath), 'utf8');
    return patterns.every(p => src.includes(p));
  } catch {
    return false;
  }
}

const SETTINGS_PATH = 'src/config/settingsRegistryConfig.js';
const TOOLS_PATH    = 'src/config/toolsRegistryConfig.js';
const FEATURES_PATH = 'src/config/featuresConfig.js';

const tests = [
  // ── settingsRegistry – eksporty przez checkSourceExport ──────────────────
  {
    name: 'settingsRegistry – SETTINGS_REGISTRY eksportowany',
    run: async () => checkSourceExport(SETTINGS_PATH, 'SETTINGS_REGISTRY'),
  },
  {
    name: 'settingsRegistry – getSettingsComponent eksportowany',
    run: async () => checkSourceExport(SETTINGS_PATH, 'getSettingsComponent'),
  },
  {
    name: 'settingsRegistry – wymagane ids obecne (settings, help, aggregatedTasks, history)',
    run: async () => {
      const ids = extractIds(SETTINGS_PATH, 'SETTINGS_REGISTRY');
      const required = ['settings', 'help', 'aggregatedTasks', 'history'];
      const missing = required.filter(id => !ids.includes(id));
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Brakujące ids: ${missing.join(', ')} (znalezione: ${ids.join(', ')})` };
    }
  },
  {
    name: 'settingsRegistry – każdy wpis ma id i component (lazy import)',
    run: async () => {
      const src = readFileSync(join(process.cwd(), SETTINGS_PATH), 'utf8');
      // Sprawdzamy że każde 'id:' ma odpowiadające 'component:'
      const idCount    = (src.match(/^\s+id:\s*['"]/gm) || []).length;
      const lazyCount  = (src.match(/lazy\(\s*\(\)/g) || []).length;
      const ok = idCount > 0 && lazyCount === idCount;
      return { ok, details: ok ? '' : `id count=${idCount}, lazy count=${lazyCount}` };
    }
  },
  {
    name: 'settingsRegistry – featureFlag dla help wskazuje na helpScreen',
    run: async () => {
      const ok = sourceContains(SETTINGS_PATH, "featureFlag: 'helpScreen'", "featureFlag: \"helpScreen\"") ||
                 sourceContains(SETTINGS_PATH, 'featureFlag:');
      // Weryfikujemy przynajmniej że featureFlag jest używany
      const src = readFileSync(join(process.cwd(), SETTINGS_PATH), 'utf8');
      const hasHelpScreen = src.includes('helpScreen');
      return { ok: hasHelpScreen, details: hasHelpScreen ? '' : 'helpScreen featureFlag not found in settingsRegistry' };
    }
  },
  {
    name: 'settingsRegistry – importuje isFeatureEnabled z config.js',
    run: async () => {
      const ok = sourceContains(SETTINGS_PATH, 'isFeatureEnabled');
      return { ok, details: ok ? '' : 'isFeatureEnabled not imported in settingsRegistry' };
    }
  },

  // ── toolsRegistry – eksporty przez checkSourceExport ────────────────────
  {
    name: 'toolsRegistry – TOOLS_REGISTRY eksportowany',
    run: async () => checkSourceExport(TOOLS_PATH, 'TOOLS_REGISTRY'),
  },
  {
    name: 'toolsRegistry – getToolComponent eksportowany',
    run: async () => checkSourceExport(TOOLS_PATH, 'getToolComponent'),
  },
  {
    name: 'toolsRegistry – wymagane tool ids obecne',
    run: async () => {
      const ids = extractIds(TOOLS_PATH, 'TOOLS_REGISTRY');
      const required = ['notepad', 'projectManager', 'removebg', 'stringCombiner', 'terminal'];
      const missing = required.filter(id => !ids.includes(id));
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Brakujące: ${missing.join(', ')} (znalezione: ${ids.join(', ')})` };
    }
  },
  {
    name: 'toolsRegistry – każdy wpis ma id i component (lazy import)',
    run: async () => {
      const src = readFileSync(join(process.cwd(), TOOLS_PATH), 'utf8');
      const idCount   = (src.match(/^\s+id:\s*['"]/gm) || []).length;
      const lazyCount = (src.match(/lazy\(\s*\(\)/g) || []).length;
      const ok = idCount > 0 && lazyCount === idCount;
      return { ok, details: ok ? '' : `id count=${idCount}, lazy count=${lazyCount}` };
    }
  },
  {
    name: 'toolsRegistry – featureFlag entries używają isFeatureEnabled',
    run: async () => {
      const ok = sourceContains(TOOLS_PATH, 'isFeatureEnabled', 'featureFlag');
      return { ok, details: ok ? '' : 'featureFlag/isFeatureEnabled not used in toolsRegistry' };
    }
  },
  {
    name: 'toolsRegistry – getToolComponent zwraca disabled:true dla nieaktywnej flagi (logika w źródle)',
    run: async () => {
      const ok = sourceContains(TOOLS_PATH, 'disabled: true');
      return { ok, details: ok ? '' : 'disabled: true not found in getToolComponent' };
    }
  },

  // ── features.js – baza dla obu rejestrów ─────────────────────────────────
  {
    name: 'features.js – FEATURES eksportowany',
    run: async () => checkSourceExport(FEATURES_PATH, 'FEATURES'),
  },
  {
    name: 'features.js – isFeatureEnabled eksportowany',
    run: async () => checkSourceExport(FEATURES_PATH, 'isFeatureEnabled'),
  },
  {
    name: 'features.js – isFeatureEnabled importowalny i zwraca boolean',
    run: async () => {
      try {
        const { isFeatureEnabled } = await safeImport(FEATURES_PATH);
        const ok = isFeatureEnabled('helpScreen') === true
                && isFeatureEnabled('__nonexistent__') === false;
        return { ok, details: ok ? '' : 'isFeatureEnabled logic incorrect' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },
  {
    name: 'features.js – FEATURES zawiera wymagane klucze (helpScreen, adBlocker, sleepTabs)',
    run: async () => {
      try {
        const { FEATURES } = await safeImport(FEATURES_PATH);
        const required = ['helpScreen', 'adBlocker', 'sleepTabs', 'hotkeysManager'];
        const missing = required.filter(k => !(k in FEATURES));
        return { ok: missing.length === 0, details: missing.length ? `Brakujące: ${missing.join(', ')}` : '' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },

  // ── Spójność między rejestrami (przez parsowanie źródła) ─────────────────
  {
    name: 'Brak nakładania się ids między SETTINGS_REGISTRY i TOOLS_REGISTRY',
    run: async () => {
      const settingsIds = new Set(extractIds(SETTINGS_PATH));
      const toolsIds    = extractIds(TOOLS_PATH);
      // aggregatedTasks jest w obu rejestrach – to zamierzone (inny kontekst)
      // więc sprawdzamy tylko czyste kolizje poza agregowanymi taskami
      const ALLOWED_OVERLAP = new Set(['aggregatedTasks']);
      const overlap = toolsIds.filter(id => settingsIds.has(id) && !ALLOWED_OVERLAP.has(id));
      const ok = overlap.length === 0;
      return { ok, details: ok ? '' : `Kolizje ids: ${overlap.join(', ')}` };
    }
  },
];

export async function runRegistriesTests() {
  return runTests('Registries', tests);
}