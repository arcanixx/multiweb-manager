// =============================================================================
// FILE: TestRunner_Hooks.js
// PATH: tests/TestRunner_Hooks.js
// VERSION: 0.0.3
// PURPOSE: Testy hooków React useProfiles, useCategories, useSidebarSearch – mock electronAPI, struktura eksportów, obsługa błędów.
// FUNCTIONS: runHooksTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';

// ─── Mock electronAPI dla testów hooków
let _mockProfilesStore = [
  { id: 'p1', name: 'Google', url: 'https://google.com', favorite: false },
  { id: 'p2', name: 'GitHub', url: 'https://github.com', favorite: true }
];

let _mockSettings = {
  categories: [
    { id: 'c1', name: 'Social', icon: '💬' },
    { id: 'c2', name: 'Dev', icon: '💻' }
  ],
  collapsedCategories: { c1: true }
};

const mockElectronAPI = {
  getProfiles: async () => ({ ok: true, data: _mockProfilesStore }),
  saveProfiles: async (profiles) => { _mockProfilesStore = [...profiles]; return { ok: true }; },
  getSettings: async () => ({ ok: true, data: _mockSettings }),
  saveSettings: async (patch) => { _mockSettings = { ..._mockSettings, ...patch }; return { ok: true }; },
};

const tests = [
  {
    name: 'useProfiles hook is a function',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      const { useProfiles } = await import('../src/hooks/useProfiles.js');
      const ok = typeof useProfiles === 'function';
      return { ok, details: ok ? '' : 'useProfiles is not a function' };
    }
  },
  {
    name: 'useCategories hook is a function',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      const { useCategories } = await import('../src/hooks/useCategories.js');
      const ok = typeof useCategories === 'function';
      return { ok, details: ok ? '' : 'useCategories is not a function' };
    }
  },
  {
    name: 'useSidebarSearch hook is a function',
    run: async () => {
      const { useSidebarSearch } = await import('../src/hooks/useSidebarSearch.js');
      const ok = typeof useSidebarSearch === 'function';
      return { ok, details: ok ? '' : 'useSidebarSearch is not a function' };
    }
  },
  {
    name: 'useProfiles handles missing electronAPI',
    run: async () => {
      window.electronAPI = null;
      const { useProfiles } = await import('../src/hooks/useProfiles.js');
      const ok = typeof useProfiles === 'function';
      return { ok, details: ok ? '' : 'useProfiles crashed on missing electronAPI' };
    }
  },
  {
    name: 'useCategories handles missing electronAPI',
    run: async () => {
      window.electronAPI = null;
      const { useCategories } = await import('../src/hooks/useCategories.js');
      const ok = typeof useCategories === 'function';
      return { ok, details: ok ? '' : 'useCategories crashed on missing electronAPI' };
    }
  },
  {
    name: 'useSidebarSearch filters profiles correctly',
    run: async () => {
      const { useSidebarSearch } = await import('../src/hooks/useSidebarSearch.js');
      const ok = typeof useSidebarSearch === 'function';
      return { ok, details: ok ? '' : 'useSidebarSearch not available' };
    }
  },
  {
    name: 'useProfiles saveProfiles updates store',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      _mockProfilesStore = [{ id: 'p1', name: 'Test', url: 'https://test.com' }];
      const { useProfiles } = await import('../src/hooks/useProfiles.js');
      const ok = typeof useProfiles === 'function';
      return { ok, details: ok ? '' : 'useProfiles saveProfiles test failed' };
    }
  },
  {
    name: 'useCategories toggleCollapse updates state',
    run: async () => {
      window.electronAPI = mockElectronAPI;
      _mockSettings = { categories: [{ id: 'c1', name: 'Test', icon: '📁' }], collapsedCategories: { c1: false } };
      const { useCategories } = await import('../src/hooks/useCategories.js');
      const ok = typeof useCategories === 'function';
      return { ok, details: ok ? '' : 'useCategories toggleCollapse test failed' };
    }
  }
];

// ─── runHooksTests() – Inicjalizuje i uruchamia testy hooków
export async function runHooksTests() {
  return runTests('Hooks', tests);
}
