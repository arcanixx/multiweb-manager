// =============================================================================
// FILE: TestRunner_Locales.js
// PATH: tests/TestRunner_Locales.js
// VERSION: 0.0.3
// PURPOSE: Testy integralności plików locales (dynamicznie z LANGUAGES z config.js)
// FUNCTIONS: runLocalesTests
// DEPENDS ON: testUtils.js, config.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
import { LANGUAGES } from '../src/config.js';

const REQUIRED_SECTIONS = [
  'app', 'sidebar', 'notepad', 'projectManager', 'removebg',
  'stringCombiner', 'terminal', 'settings', 'help', 'webview',
  'tasks', 'aggregatedTasks', 'history', 'updateChecker', 'notifications',
  'profile_modal', 'category_modal'
];
const CRITICAL_KEYS = [
  ['sidebar', 'add_profile'],
  ['sidebar', 'favorites'],
  ['tasks', 'modal_title_add'],
  ['tasks', 'priority_a'],
  ['settings', 'theme'],
  ['history', 'clear'],
  ['updateChecker', 'coming_soon'],
  ['notifications', 'offline'],
  ['notifications', 'online']
];
const HELP_REQUIRED_FIELDS = ['id', 'title', 'content'];
const tests = [
  // Test 1: Wszystkie pliki locales (lang i help) istnieją i ładują się
  {
    name: 'All locale files exist and load',
    run: async () => {
      const errors = [];
      for (const lang of LANGUAGES) {
        try {
          await import(`../src/locales/${lang}.json`);
        } catch (e) {
          errors.push(`${lang}.json – ${e.message}`);
        }
        try {
          await import(`../src/locales/help_${lang}.json`);
        } catch (e) {
          errors.push(`help_${lang}.json – ${e.message}`);
        }
      }
      const ok = errors.length === 0;
      return { ok, details: ok ? '' : errors.join('; ') };
    }
  },
  // Test 2: Wszystkie pliki językowe mają wymagane sekcje
  {
    name: 'Language files have required sections',
    run: async () => {
      const errors = [];
      for (const lang of LANGUAGES) {
        try {
          const data = await import(`../src/locales/${lang}.json`);
          for (const section of REQUIRED_SECTIONS) {
            if (!data.default[section]) {
              errors.push(`${lang}.json missing section: ${section}`);
            }
          }
        } catch (e) {
          errors.push(`${lang}.json – ${e.message}`);
        }
      }
      const ok = errors.length === 0;
      return { ok, details: ok ? '' : errors.join('; ') };
    }
  },
  // Test 3: Kluczowe klucze istnieją we wszystkich językach
  {
    name: 'Critical keys exist in all languages',
    run: async () => {
      const errors = [];
      for (const lang of LANGUAGES) {
        try {
          const data = await import(`../src/locales/${lang}.json`);
          for (const [section, key] of CRITICAL_KEYS) {
            if (!data.default[section]?.[key]) {
              errors.push(`${lang}.json missing ${section}.${key}`);
            }
          }
        } catch (e) {
          errors.push(`${lang}.json – ${e.message}`);
        }
      }
      const ok = errors.length === 0;
      return { ok, details: ok ? '' : errors.join('; ') };
    }
  },
  // Test 4: Spójność kluczy między językami (dla tych samych sekcji)
  {
    name: 'Same keys across all languages for required sections',
    run: async () => {
      const errors = [];
      const langData = {};
      for (const lang of LANGUAGES) {
        try {
          langData[lang] = await import(`../src/locales/${lang}.json`);
        } catch (e) {
          errors.push(`${lang}.json – ${e.message}`);
        }
      }
      if (errors.length) return { ok: false, details: errors.join('; ') };

      const baseLang = LANGUAGES[0];
      const baseKeys = {};
      for (const section of REQUIRED_SECTIONS) {
        baseKeys[section] = Object.keys(langData[baseLang].default[section] || {});
      }

      for (const lang of LANGUAGES.slice(1)) {
        for (const section of REQUIRED_SECTIONS) {
          const currentKeys = Object.keys(langData[lang].default[section] || {});
          const missingInCurrent = baseKeys[section].filter(k => !currentKeys.includes(k));
          if (missingInCurrent.length) {
            errors.push(`${lang}.json missing keys in ${section}: ${missingInCurrent.join(',')}`);
          }
          const extraInCurrent = currentKeys.filter(k => !baseKeys[section].includes(k));
          if (extraInCurrent.length) {
            errors.push(`${lang}.json has extra keys in ${section}: ${extraInCurrent.join(',')}`);
          }
        }
      }
      const ok = errors.length === 0;
      return { ok, details: ok ? '' : errors.join('; ') };
    }
  },
  // Test 5: Wszystkie pliki help mają poprawną strukturę
  {
    name: 'Help files have valid structure',
    run: async () => {
      const errors = [];
      for (const lang of LANGUAGES) {
        try {
          const data = await import(`../src/locales/help_${lang}.json`);
          if (!data.default.sections || !Array.isArray(data.default.sections)) {
            errors.push(`help_${lang}.json: missing sections array`);
            continue;
          }
          for (let i = 0; i < data.default.sections.length; i++) {
            const section = data.default.sections[i];
            for (const field of HELP_REQUIRED_FIELDS) {
              if (!section[field]) {
                errors.push(`help_${lang}.json: section ${i} missing "${field}"`);
              }
            }
          }
          // Dodatkowo sprawdź, czy sections nie jest puste
          if (data.default.sections.length === 0) {
            errors.push(`help_${lang}.json: sections array is empty`);
          }
        } catch (e) {
          errors.push(`help_${lang}.json – ${e.message}`);
        }
      }
      const ok = errors.length === 0;
      return { ok, details: ok ? '' : errors.join('; ') };
    }
  }
];

export async function runLocalesTests() {
  return runTests('Locales', tests);
}