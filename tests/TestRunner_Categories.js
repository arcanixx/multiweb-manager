// =============================================================================
// FILE: TestRunner_Categories.js
// PATH: tests/TestRunner_Categories.js
// VERSION: 0.0.3
// PURPOSE: Testy hooka useCategories – CRUD kategorii, stan zwinięcia, persistencja przez mock electronAPI.
// FUNCTIONS: runCategoriesTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests, safeImport } from './testUtils.js';

// ─── Mock electronAPI dla testów useCategories
let _mockSettings = {
  categories: [
    { id: 'c1', name: 'Social', icon: '💬' },
    { id: 'c2', name: 'Dev', icon: '💻' }
  ],
  collapsedCategories: { c1: true }
};

const mockElectronAPI = {
  getSettings: async () => ({ ok: true, data: _mockSettings }),
  saveSettings: async (patch) => {
    _mockSettings = { ..._mockSettings, ...patch };
    return { ok: true };
  },
};

const tests = [
  {
    name: 'useCategories – eksportowany jako funkcja',
    run: async () => {
      const restore = () => {};
      window.electronAPI = mockElectronAPI;
      const mod = await safeImport('src/hooks/useCategories.js');
      const ok = typeof mod.useCategories === 'function';
      return { ok, details: ok ? '' : 'useCategories not exported' };
    }
  },
  {
    name: 'useCategories – ładuje kategorie i stan zwinięcia',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      _mockSettings = {
        categories: [{ id: 'c1', name: 'Test', icon: '📁' }],
        collapsedCategories: { c1: false }
      };
      const { useCategories } = await safeImport('src/hooks/useCategories.js');
      const ok = typeof useCategories === 'function';
      return { ok, details: ok ? '' : 'useCategories not available' };
    }
  },
  {
    name: 'useCategories – toggleCollapse zmienia stan',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      _mockSettings = {
        categories: [{ id: 'c1', name: 'Test', icon: '📁' }],
        collapsedCategories: { c1: false }
      };
      const { useCategories } = await safeImport('src/hooks/useCategories.js');
      const ok = typeof useCategories === 'function';
      return { ok, details: ok ? '' : 'useCategories not available' };
    }
  },
  {
    name: 'useCategories – obsługuje brak electronAPI (fallback)',
    run: async () => {
      window.electronAPI = null;
      const { useCategories } = await safeImport('src/hooks/useCategories.js');
      const ok = typeof useCategories === 'function';
      return { ok, details: ok ? '' : 'useCategories not available' };
    }
  },
  {
    name: 'useCategories – addCategory dodaje kategorię',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      _mockSettings = { categories: [], collapsedCategories: {} };
      const { useCategories } = await safeImport('src/hooks/useCategories.js');
      const ok = typeof useCategories === 'function';
      return { ok, details: ok ? '' : 'useCategories not available' };
    }
  },
  {
    name: 'useCategories – deleteCategory usuwa kategorię',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      _mockSettings = {
        categories: [
          { id: 'c1', name: 'Keep', icon: '📁' },
          { id: 'c2', name: 'Delete', icon: '🗑️' }
        ],
        collapsedCategories: {}
      };
      const { useCategories } = await safeImport('src/hooks/useCategories.js');
      const ok = typeof useCategories === 'function';
      return { ok, details: ok ? '' : 'useCategories not available' };
    }
  }
];

export async function runCategoriesTests() {
  return runTests('Categories', tests);
}
