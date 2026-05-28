// =============================================================================
// FILE: TestRunner_Icons.js
// PATH: tests/TestRunner_Icons.js
// VERSION: 0.0.3
// PURPOSE: Testy integralności ikon (ICONS, SIDEBAR_ICON_MAP)
// FUNCTIONS: runIconsTests
// DEPENDS ON: testUtils.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
import { ICONS, SIDEBAR_ICON_MAP } from '../src/utils/icons.js';
const tests = [
  {
    name: 'ICONS is object',
    run: async () => {
      const isValid = typeof ICONS === 'object' && ICONS !== null;
      return { ok: isValid, details: isValid ? '' : 'ICONS is not an object' };
    }
  },
  {
    name: 'Required icons exist',
    run: async () => {
      const requiredIcons = [
        'PLUS', 'EDIT', 'DELETE', 'SAVE', 'CLOSE', 'REFRESH',
        'NOTEPAD', 'SETTINGS', 'HELP', 'HISTORY', 'TASKS',
        'PRIORITY_A', 'PRIORITY_B', 'PRIORITY_C', 'PRIORITY_D', 'PRIORITY_E',
        'DONE', 'COMMENT', 'PIN', 'UNPIN', 'DEFAULT',
        'THEME_DARK', 'THEME_LIGHT', 'THEME_SYSTEM',
        'TERMINAL', 'REMOVEBG', 'STRINGCOMBINER', 'PROJECTMANAGER', 'AGGREGATEDTASKS',
        'UPDATE', 'VERSION', 'DEBUG', 'WARNING', 'INFO', 'SEARCH',
        'BACK', 'FORWARD', 'ZOOM_IN', 'ZOOM_OUT', 'DEVTOOLS', 'CLEAR_CACHE'
      ];
      const missing = requiredIcons.filter(key => !(key in ICONS) || typeof ICONS[key] !== 'string');
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Missing or invalid: ${missing.join(', ')}` };
    }
  },
  {
    name: 'No empty icon values',
    run: async () => {
      const empty = Object.entries(ICONS).filter(([, v]) => !v || v.trim() === '');
      const ok = empty.length === 0;
      return { ok, details: ok ? '' : `Empty icons: ${empty.map(([k]) => k).join(', ')}` };
    }
  },
  {
    name: 'SIDEBAR_ICON_MAP is valid',
    run: async () => {
      const isObject = typeof SIDEBAR_ICON_MAP === 'object';
      const requiredKeys = ['notepad', 'projectManager', 'removebg', 'stringCombiner', 'terminal', 'settings', 'help'];
      const missingKeys = requiredKeys.filter(key => !(key in SIDEBAR_ICON_MAP));
      const invalidPointers = requiredKeys
        .filter(key => key in SIDEBAR_ICON_MAP)
        .filter(key => !(SIDEBAR_ICON_MAP[key] in ICONS));
      const ok = isObject && missingKeys.length === 0 && invalidPointers.length === 0;
      const details = [];
      if (!isObject) details.push('SIDEBAR_ICON_MAP is not an object');
      if (missingKeys.length) details.push(`Missing keys: ${missingKeys.join(', ')}`);
      if (invalidPointers.length) details.push(`Invalid ICONS references: ${invalidPointers.join(', ')}`);
      return { ok, details: details.join('; ') };
    }
  }
];

export async function runIconsTests() {
  return runTests('Icons', tests);
}