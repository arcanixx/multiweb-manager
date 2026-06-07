// =============================================================================
// FILE: TestRunner_AppLibrary.js
// PATH: tests/TestRunner_AppLibrary.js
// VERSION: 0.0.3
// PURPOSE: Testy UI biblioteki aplikacji - eksport komponentu AppLibraryBrowser.
// FUNCTIONS: runAppLibraryTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// Nie usuwac komentarzy - opisuja flow aplikacji.

import { checkSourceExport, runTests } from './testUtils.js';

const tests = [
  {
    name: 'AppLibraryBrowser - src/ui/appLibrary/AppLibraryBrowser.jsx eksportuje komponent',
    run: async () => checkSourceExport('src/ui/appLibrary/AppLibraryBrowser.jsx', 'AppLibraryBrowser')
  }
];

export async function runAppLibraryTests() {
  return runTests('AppLibrary', tests);
}