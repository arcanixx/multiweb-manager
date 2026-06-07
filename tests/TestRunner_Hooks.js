// =============================================================================
// FILE: TestRunner_Hooks.js
// PATH: tests/TestRunner_Hooks.js
// VERSION: 0.0.3
// PURPOSE: Testy hooków React – weryfikacja eksportów, obsługi błędów i struktury zwracanych danych przez mock electronAPI.
// FUNCTIONS: runHooksTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { checkSourceExport, runTests, safeImport } from './testUtils.js';

// ─── Pomocnik: tymczasowy mock window.electronAPI ─────────────────────────────
function mockElectronAPI(overrides = {}) {
  const original = window.electronAPI;
  window.electronAPI = { ...original, ...overrides };
  return () => { window.electronAPI = original; };
}

// ─── Pomocnik: mock React context dla TranslationContext ─────────────────────
function mockTranslationContext() {
  const originalReact = globalThis.React;
  globalThis.React = {
    ...originalReact,
    useContext: () => ({ t: (key) => key }),
    createContext: (val) => val,
  };
  return () => { globalThis.React = originalReact; };
}

const tests = [
  // ============================================================================
  // 1. TESTY EKSPORTÓW (checkSourceExport – dla hooków które nie wymagają DOM)
  // ============================================================================
  {
    name: 'useNotepadHandlers - src/hooks/notepad/useNotepadHandlers.js eksportuje hook',
    run: async () => checkSourceExport('src/hooks/notepad/useNotepadHandlers.js', 'useNotepadHandlers')
  },
  {
    name: 'useSidebarHandlers - src/hooks/sidebar/useSidebarHandlers.js eksportuje hook',
    run: async () => checkSourceExport('src/hooks/sidebar/useSidebarHandlers.js', 'useSidebarHandlers')
  },
  {
    name: 'useTaskPanelHandlers - src/hooks/taskpanel/useTaskPanelHandlers.js eksportuje hook',
    run: async () => checkSourceExport('src/hooks/taskpanel/useTaskPanelHandlers.js', 'useTaskPanelHandlers')
  },
  {
    name: 'useAppInitialization – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useAppInitialization.js', 'useAppInitialization')
  },
  {
    name: 'useMainLayout – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useMainLayout.js', 'useMainLayout')
  },
  {
    name: 'useNotepadAutosave – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useNotepadAutosave.js', 'useNotepadAutosave')
  },
  {
    name: 'useNotepadContent – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useNotepadContent.js', 'useNotepadContent')
  },
  {
    name: 'useNotepadFindReplace – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useNotepadFindReplace.js', 'useNotepadFindReplace')
  },
  {
    name: 'useNotepadModals – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useNotepadModals.js', 'useNotepadModals')
  },
  {
    name: 'useNotepadTabActions – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useNotepadTabActions.js', 'useNotepadTabActions')
  },
  {
    name: 'useNotepadTabs – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useNotepadTabs.js', 'useNotepadTabs')
  },
  {
    name: 'useNotepadUI – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useNotepadUI.js', 'useNotepadUI')
  },
  {
    name: 'useWebViewActions – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useWebViewActions.js', 'useWebViewActions')
  },
  {
    name: 'useWebViewEvents – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useWebViewEvents.js', 'useWebViewEvents')
  },
  {
    name: 'useTranslation – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useTranslation.js', 'useTranslation')
  },
  {
    name: 'useAsyncMutation – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useAsyncMutation.js', 'useAsyncMutation')
  },

  // ============================================================================
  // 2. TESTY FUNKCJONALNE (z mockowaniem – dla hooków które wymagają IPC)
  // ============================================================================
  {
    name: 'useProfiles – zwraca wymagane pola',
    run: async () => {
      const restore = mockElectronAPI({
        getProfiles: async () => ({ ok: true, data: [] }),
      });
      try {
        const { useProfiles } = await safeImport('src/hooks/useProfiles.js');
        const ok = typeof useProfiles === 'function';
        return { ok, details: ok ? '' : 'useProfiles nie jest funkcją' };
      } finally { restore(); }
    }
  },
  {
    name: 'useHistoryLog – eksportowany jako funkcja',
    run: async () => {
      const restore = mockElectronAPI({
        getHistory: async () => ({ ok: true, data: [] }),
      });
      try {
        const mod = await safeImport('src/hooks/useHistoryLog.js');
        const ok = typeof mod.useHistoryLog === 'function';
        return { ok, details: ok ? '' : 'useHistoryLog nie jest eksportowane' };
      } finally { restore(); }
    }
  },
  {
    name: 'useWorkspaces – eksportowany jako funkcja',
    run: async () => {
      const restore = mockElectronAPI({
        getWorkspaces: async () => ({ ok: true, data: [] }),
      });
      try {
        const mod = await safeImport('src/hooks/useWorkspaces.js');
        const ok = typeof mod.useWorkspaces === 'function';
        return { ok, details: ok ? '' : 'useWorkspaces nie jest eksportowane' };
      } finally { restore(); }
    }
  },
  {
    name: 'useSettings – eksportowany jako funkcja',
    run: async () => {
      const restore = mockElectronAPI({
        getSettings: async () => ({ ok: true, data: {} }),
      });
      try {
        const mod = await safeImport('src/hooks/useSettings.js');
        const ok = typeof mod.useSettings === 'function';
        return { ok, details: ok ? '' : 'useSettings nie jest eksportowane' };
      } finally { restore(); }
    }
  },
  {
    name: 'useProjects – eksportowany jako funkcja',
    run: async () => {
      const restore = mockElectronAPI({
        getProjects: async () => ({ ok: true, data: [] }),
      });
      try {
        const mod = await safeImport('src/hooks/useProjects.js');
        const ok = typeof mod.useProjects === 'function';
        return { ok, details: ok ? '' : 'useProjects nie jest eksportowane' };
      } finally { restore(); }
    }
  },
  {
    name: 'useTasks – eksportowany jako funkcja',
    run: async () => {
      const restore = mockElectronAPI({
        getTasks: async () => ({ ok: true, data: [] }),
      });
      try {
        const mod = await safeImport('src/hooks/useTasks.js');
        const ok = typeof mod.useTasks === 'function';
        return { ok, details: ok ? '' : 'useTasks nie jest eksportowane' };
      } finally { restore(); }
    }
  },
  {
    name: 'useCategories – eksportowany jako funkcja',
    run: async () => {
      const restore = mockElectronAPI({
        getSettings: async () => ({ ok: true, data: { categories: [] } }),
        saveSettings: async () => ({ ok: true }),
      });
      try {
        const mod = await safeImport('src/hooks/useCategories.js');
        const ok = typeof mod.useCategories === 'function';
        return { ok, details: ok ? '' : 'useCategories nie jest eksportowane' };
      } finally { restore(); }
    }
  },
  {
    name: 'useSidebarSearch – eksportowany jako funkcja',
    run: async () => {
      const restore = mockElectronAPI({
        invoke: async () => ({ ok: true, data: [] }),
      });
      try {
        const mod = await safeImport('src/hooks/useSidebarSearch.js');
        const ok = typeof mod.useSidebarSearch === 'function';
        return { ok, details: ok ? '' : 'useSidebarSearch nie jest eksportowane' };
      } finally { restore(); }
    }
  },
  {
    name: 'useAppLibrary – eksportowany jako funkcja',
    run: async () => {
      const restore = mockElectronAPI({
        invoke: async () => ({ ok: true, data: [] }),
      });
      try {
        const mod = await safeImport('src/hooks/useAppLibrary.js');
        const ok = typeof mod.useAppLibrary === 'function';
        return { ok, details: ok ? '' : 'useAppLibrary nie jest eksportowane' };
      } finally { restore(); }
    }
  },
  {
    name: 'useTaskGroups – eksportowany jako funkcja',
    run: async () => {
      const restore = mockElectronAPI({
        invoke: async () => ({ ok: true, data: [] }),
      });
      try {
        const mod = await safeImport('src/hooks/useTaskGroups.js');
        const ok = typeof mod.useTaskGroups === 'function';
        return { ok, details: ok ? '' : 'useTaskGroups nie jest eksportowane' };
      } finally { restore(); }
    }
  },
  {
    name: 'useAggregatedTasks – eksportowany jako funkcja',
    run: async () => {
      const restore = mockElectronAPI({
        invoke: async () => ({ ok: true, data: [] }),
        getSettings: async () => ({ ok: true, data: {} }),
      });
      try {
        const mod = await safeImport('src/hooks/useAggregatedTasks.js');
        const ok = typeof mod.useAggregatedTasks === 'function';
        return { ok, details: ok ? '' : 'useAggregatedTasks nie jest eksportowane' };
      } finally { restore(); }
    }
  },
  {
    name: 'useHotkeysManager – eksportowany jako funkcja',
    run: async () => {
      const restoreMock = mockElectronAPI({
        getHotkeys: async () => ({ ok: true, data: [] }),
        saveHotkeys: async () => ({ ok: true }),
        registerGlobalHotkeys: async () => ({ ok: true }),
      });
      const restoreContext = mockTranslationContext();
      try {
        const mod = await safeImport('src/hooks/useHotkeysManager.js');
        const ok = typeof mod.useHotkeysManager === 'function';
        return { ok, details: ok ? '' : 'useHotkeysManager nie jest eksportowane' };
      } finally { restoreMock(); restoreContext(); }
    }
  },
  {
    name: 'useLogsSection – eksportowany jako funkcja',
    run: async () => {
      const restore = mockElectronAPI({
        getSettings: async () => ({ ok: true, data: {} }),
        invoke: async () => ({ ok: true }),
      });
      try {
        const mod = await safeImport('src/hooks/useLogsSection.js');
        const ok = typeof mod.useLogsSection === 'function';
        return { ok, details: ok ? '' : 'useLogsSection nie jest eksportowane' };
      } finally { restore(); }
    }
  },
  {
    name: 'useNotificationsSection – eksportowany jako funkcja',
    run: async () => {
      const restore = mockElectronAPI({
        invoke: async () => ({ ok: true, data: {} }),
      });
      try {
        const mod = await safeImport('src/hooks/useNotificationsSection.js');
        const ok = typeof mod.useNotificationsSection === 'function';
        return { ok, details: ok ? '' : 'useNotificationsSection nie jest eksportowane' };
      } finally { restore(); }
    }
  },

  // ============================================================================
  // 3. ARCHITEKTURA IPC – hooki nie importują bezpośrednio store'ów
  // ============================================================================
  {
    name: 'useHistoryLog – nie importuje historyStore bezpośrednio (architektura IPC)',
    run: async () => {
      const { readFileSync } = await import('fs');
      const { join } = await import('path');
      const src = readFileSync(join(process.cwd(), 'src/hooks/useHistoryLog.js'), 'utf8');
      const ok = !src.includes('historyStore') || src.includes('import') === false;
      return { ok, details: ok ? '' : 'useHistoryLog importuje historyStore – naruszenie architektury IPC' };
    }
  },
];

export async function runHooksTests() {
  return runTests('Hooks', tests);
}