// =============================================================================
// FILE: TestRunner_Locales.js
// PATH: tests/TestRunner_Locales.js
// VERSION: 0.0.3
// PURPOSE: Testy integralnosci plikow locales - sekcje, klucze krytyczne i help JSON.
// FUNCTIONS: runLocalesTests
// DEPENDS ON: fs, path, testUtils.js, config.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// Nie usuwac komentarzy - opisuja flow aplikacji.

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { runTests } from './testUtils.js';
import { LANGUAGES } from '../src/config.js';

const LOCALES_DIR = join(process.cwd(), 'src/locales');
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

function readLocaleJson(fileName) {
  const filePath = join(LOCALES_DIR, fileName);
  if (!existsSync(filePath)) throw new Error(`${fileName} not found`);
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

const tests = [
  {
    name: 'All locale files exist and load',
    run: async () => {
      const errors = [];
      for (const lang of LANGUAGES) {
        for (const fileName of [`${lang}.json`, `help.${lang}.json`]) {
          try { readLocaleJson(fileName); }
          catch (err) { errors.push(`${fileName}: ${err.message}`); }
        }
      }
      return { ok: errors.length === 0, details: errors.join('; ') };
    }
  },
  {
    name: 'Language files have required sections',
    run: async () => {
      const errors = [];
      for (const lang of LANGUAGES) {
        const data = readLocaleJson(`${lang}.json`);
        for (const section of REQUIRED_SECTIONS) {
          if (!data[section]) errors.push(`${lang}.json missing section: ${section}`);
        }
      }
      return { ok: errors.length === 0, details: errors.join('; ') };
    }
  },
  {
    name: 'Critical keys exist in all languages',
    run: async () => {
      const errors = [];
      for (const lang of LANGUAGES) {
        const data = readLocaleJson(`${lang}.json`);
        for (const [section, key] of CRITICAL_KEYS) {
          if (!data[section]?.[key]) errors.push(`${lang}.json missing ${section}.${key}`);
        }
      }
      return { ok: errors.length === 0, details: errors.join('; ') };
    }
  },
  {
    name: 'Same keys across all languages for required sections',
    run: async () => {
      const [baseLang, ...rest] = LANGUAGES;
      const base = readLocaleJson(`${baseLang}.json`);
      const errors = [];

      for (const lang of rest) {
        const current = readLocaleJson(`${lang}.json`);
        for (const section of REQUIRED_SECTIONS) {
          const baseKeys = Object.keys(base[section] || {});
          const currentKeys = Object.keys(current[section] || {});
          const missing = baseKeys.filter((key) => !currentKeys.includes(key));
          const extra = currentKeys.filter((key) => !baseKeys.includes(key));
          if (missing.length) errors.push(`${lang}.json missing keys in ${section}: ${missing.join(',')}`);
          if (extra.length) errors.push(`${lang}.json has extra keys in ${section}: ${extra.join(',')}`);
        }
      }
      return { ok: errors.length === 0, details: errors.join('; ') };
    }
  },
  {
    name: 'Help files have valid structure',
    run: async () => {
      const errors = [];
      for (const lang of LANGUAGES) {
        const fileName = `help.${lang}.json`;
        const data = readLocaleJson(fileName);
        if (!Array.isArray(data.sections) || data.sections.length === 0) {
          errors.push(`${fileName}: sections array missing or empty`);
          continue;
        }
        data.sections.forEach((section, index) => {
          if (!section.id) errors.push(`${fileName}: section ${index} missing id`);
          if (!section.title) errors.push(`${fileName}: section ${index} missing title`);
          if (!section.content && !section.items && !section.children) {
            errors.push(`${fileName}: section ${index} missing content/items/children`);
          }
        });
      }
      return { ok: errors.length === 0, details: errors.join('; ') };
    }
  }
];

export async function runLocalesTests() {
  return runTests('Locales', tests);
}