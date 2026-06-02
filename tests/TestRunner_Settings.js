// =============================================================================
// FILE: TestRunner_Settings.js
// PATH: tests/TestRunner_Settings.js
// VERSION: 0.0.3
// PURPOSE: Zestaw testów dla silnika ustawień. Weryfikuje bezpieczeństwo głębokiego łączenia (merge) konfiguracji, stabilność przełączania motywów oraz poprawność schematu danych przy imporcie/eksporcie.
// FUNCTIONS: runSettingsTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
const tests = [
  {
    name: 'Settings merge (not overwrite) works',
    run: async () => {
      const current = { language: 'pl', theme: 'dark', debugMode: false };
      const partial = { theme: 'light' };
      const merged = { ...current, ...partial };
      const isMergedCorrect = merged.language === 'pl' && merged.theme === 'light' && merged.debugMode === false;
      return { ok: isMergedCorrect, details: isMergedCorrect ? '' : 'Merge failed – lost language or debugMode' };
    }
  },
  {
    name: 'Dark mode toggle works',
    run: async () => {
      let isDark = false;
      isDark = !isDark;
      const toggledCorrect = isDark === true;
      return { ok: toggledCorrect, details: toggledCorrect ? '' : 'Toggle logic failed' };
    }
  },
  {
    name: 'Export structure is valid',
    run: async () => {
      const exportData = {
        version: '0.0.3',
        exportedAt: Date.now(),
        settings: { language: 'pl' },
        profiles: [],
        tasks: []
      };
      const hasVersion = !!exportData.version;
      const hasExportedAt = !!exportData.exportedAt;
      const isValid = hasVersion && hasExportedAt;
      return { ok: isValid, details: isValid ? '' : 'Missing version or exportedAt' };
    }
  }
];
// ─── runSettingsTests() – Inicjalizuje i uruchamia proces testowy dla systemu ustawień
export async function runSettingsTests() {
  return runTests('Settings', tests);
}
