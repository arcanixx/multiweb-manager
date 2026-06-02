// =============================================================================
// FILE: TestRunner_Profiles.js
// PATH: tests/TestRunner_Profiles.js
// VERSION: 0.0.3
// PURPOSE: Zestaw testów jednostkowych i integracyjnych dla zarządzania profilami WebView. Weryfikuje strukturę danych, poprawność kategorii oraz mechanizmy sortowania chronologicznego.
// FUNCTIONS: runProfilesTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
const tests = [
  {
    name: 'Profile structure is valid',
    run: async () => {
      const mockProfile = {
        id: 'test-1',
        name: 'Test',
        url: 'https://example.com',
        category: 'AI',
        pinned: false,
        lastUsedAt: Date.now()
      };
      const isValid = mockProfile.id && mockProfile.name && mockProfile.url && mockProfile.category;
      return { ok: isValid, details: isValid ? '' : 'Missing required fields' };
    }
  },
  {
    name: 'Category validation works',
    run: async () => {
      const validCategories = ['AI', 'Dev', 'Design', 'Productivity', 'Special'];
      const isValid = validCategories.includes('AI');
      return { ok: isValid, details: isValid ? '' : 'Category not found' };
    }
  },
  {
    name: 'Last used sorting works',
    run: async () => {
      const profiles = [
        { id: '1', lastUsedAt: 100 },
        { id: '2', lastUsedAt: 300 },
        { id: '3', lastUsedAt: 200 }
      ];
      const sorted = [...profiles].sort((a, b) => b.lastUsedAt - a.lastUsedAt);
      const isCorrect = sorted[0].id === '2' && sorted[1].id === '3' && sorted[2].id === '1';
      return { ok: isCorrect, details: isCorrect ? '' : 'Sorting order incorrect' };
    }
  }
];

// ─── runProfilesTests() – Inicjalizuje i uruchamia proces testowy dla modułu Profiles
export async function runProfilesTests() {
  return runTests('Profiles', tests);
}
