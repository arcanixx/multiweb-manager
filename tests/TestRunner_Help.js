// =============================================================================
// FILE: TestRunner_Help.js
// PATH: tests/TestRunner_Help.js
// VERSION: 0.0.3
// PURPOSE: Testy komponentow pomocy - HelpSection, Shortcut, ToolCard.
// FUNCTIONS: runHelpTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// Nie usuwac komentarzy - opisuja flow aplikacji.

import { checkSourceExport, runTests } from './testUtils.js';

const tests = [
  {
    name: 'HelpSection - src/ui/help/HelpSection.jsx eksportuje komponent',
    run: async () => checkSourceExport('src/ui/help/HelpSection.jsx', 'HelpSection')
  },
  {
    name: 'Shortcut - src/ui/help/Shortcut.jsx eksportuje komponent',
    run: async () => checkSourceExport('src/ui/help/Shortcut.jsx', 'Shortcut')
  },
  {
    name: 'ToolCard - src/ui/help/ToolCard.jsx eksportuje komponent',
    run: async () => checkSourceExport('src/ui/help/ToolCard.jsx', 'ToolCard')
  },
  {
    name: 'Help UI - wymagane komponenty sa w jednym module testowym folderu help',
    run: async () => {
      const required = ['HelpSection', 'Shortcut', 'ToolCard'];
      const covered = tests.map((test) => test.name);
      const missing = required.filter((name) => !covered.some((testName) => testName.includes(name)));
      return { ok: missing.length === 0, details: missing.length ? `Braki: ${missing.join(', ')}` : '' };
    }
  }
];

export async function runHelpTests() {
  return runTests('Help', tests);
}