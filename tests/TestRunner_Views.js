// =============================================================================
// FILE: TestRunner_Views.js
// PATH: tests/TestRunner_Views.js
// VERSION: 0.0.3
// PURPOSE: Testy kontenerow widokow - ContentRenderer, SettingsContainer, Spinner, ToolsContainer, WebViewContainer.
// FUNCTIONS: runViewsTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// Nie usuwac komentarzy - opisuja flow aplikacji.

import { checkSourceExport, runTests } from './testUtils.js';

const viewComponents = [
  ['ContentRenderer', 'src/ui/views/ContentRenderer.jsx'],
  ['SettingsContainer', 'src/ui/views/SettingsContainer.jsx'],
  ['Spinner', 'src/ui/views/Spinner.jsx'],
  ['ToolsContainer', 'src/ui/views/ToolsContainer.jsx'],
  ['WebViewContainer', 'src/ui/views/WebViewContainer.jsx']
];

const tests = viewComponents.map(([name, path]) => ({
  name: `${name} - ${path} eksportuje komponent`,
  run: async () => checkSourceExport(path, name)
}));

export async function runViewsTests() {
  return runTests('Views', tests);
}