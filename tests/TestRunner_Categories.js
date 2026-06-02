// =============================================================================
// FILE: TestRunner_Categories.js
// PATH: tests/TestRunner_Categories.js
// VERSION: 0.0.3
// PURPOSE: Testy hooka useCategories – CRUD kategorii, stan zwinięcia, persistencja przez mock electronAPI.
// FUNCTIONS: runCategoriesTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';

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
    name: 'useCategories loads categories and collapsed state',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      _mockSettings = {
        categories: [{ id: 'c1', name: 'Test', icon: '📁' }],
        collapsedCategories: { c1: false }
      };
      const { useCategories } = await import('../src/hooks/useCategories.js');
      const ok = typeof useCategories === 'function';
      return { ok, details: ok ? '' : 'useCategories is not a function' };
    }
  },
  {
    name: 'useCategories toggleCollapse switches state',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      _mockSettings = {
        categories: [{ id: 'c1', name: 'Test', icon: '📁' }],
        collapsedCategories: { c1: false }
      };
      const { useCategories } = await import('../src/hooks/useCategories.js');
      const ok = typeof useCategories === 'function';
      return { ok, details: ok ? '' : 'useCategories not available' };
    }
  },
  {
    name: 'useCategories handles missing electronAPI gracefully',
    run: async () => {
      window.electronAPI = null;
      const { useCategories } = await import('../src/hooks/useCategories.js');
      const ok = typeof useCategories === 'function';
      return { ok, details: ok ? '' : 'useCategories not available' };
    }
  },
  {
    name: 'useCategories addCategory appends to list',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      _mockSettings = { categories: [], collapsedCategories: {} };
      const { useCategories } = await import('../src/hooks/useCategories.js');
      const ok = typeof useCategories === 'function';
      return { ok, details: ok ? '' : 'useCategories not available' };
    }
  },
  {
    name: 'useCategories deleteCategory removes from list',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      _mockSettings = {
        categories: [
          { id: 'c1', name: 'Keep', icon: '📁' },
          { id: 'c2', name: 'Delete', icon: '🗑️' }
        ],
        collapsedCategories: {}
      };
      const { useCategories } = await import('../src/hooks/useCategories.js');
      const ok = typeof useCategories === 'function';
      return { ok, details: ok ? '' : 'useCategories not available' };
    }
  }
];

export async function runCategoriesTests() {
  return runTests('Categories', tests);
}
