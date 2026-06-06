// =============================================================================
// FILE: TestRunner_Layout.js
// PATH: tests/TestRunner_Layout.js
// VERSION: 0.0.3
// PURPOSE: Testy layoutu aplikacji - eksport MainLayout.
// FUNCTIONS: runLayoutTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// Nie usuwac komentarzy - opisuja flow aplikacji.

import { checkSourceExport, runTests } from './testUtils.js';

const tests = [
  {
    name: 'MainLayout - src/ui/layout/MainLayout.jsx eksportuje komponent',
    run: async () => checkSourceExport('src/ui/layout/MainLayout.jsx', 'MainLayout')
  }
];

export async function runLayoutTests() {
  return runTests('Layout', tests);
}