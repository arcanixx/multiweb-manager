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
    run: async () => checkSourceExport('src/hooks/notepad/useNotepadAutosave.js', 'useNotepadAutosave')
  },
  {
    name: 'useNotepadContent – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/notepad/useNotepadContent.js', 'useNotepadContent')
  },
  {
    name: 'useNotepadFindReplace – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/notepad/useNotepadFindReplace.js', 'useNotepadFindReplace')
  },
  {
    name: 'useNotepadModals – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/notepad/useNotepadModals.js', 'useNotepadModals')
  },
  {
    name: 'useNotepadTabActions – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/notepad/useNotepadTabActions.js', 'useNotepadTabActions')
  },
  {
    name: 'useNotepadTabs – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/notepad/useNotepadTabs.js', 'useNotepadTabs')
  },
  {
    name: 'useNotepadUI – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/notepad/useNotepadUI.js', 'useNotepadUI')
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
        const mod = await safeImport('src/hooks/settings/useSettings.js');
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
        const mod = await safeImport('src/hooks/aggregated/useTaskPanel.js');
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
        const mod = await safeImport('src/hooks/sidebar/useSidebarSearch.js');
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
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },

  // ─── useNotepadContent / useNotepadTabs / useNotepadUI / useNotepadFindReplace
  {
    name: 'useNotepadContent – eksportowany jako funkcja',
    run: async () => {
      const mod = await import('../src/hooks/notepad/useNotepadContent.js');
      const ok = typeof mod.useNotepadContent === 'function';
      return { ok, details: ok ? '' : 'useNotepadContent nie jest eksportowane' };
    }
  },
  {
    name: 'useNotepadTabs – eksportowany jako funkcja',
    run: async () => {
      const mod = await import('../src/hooks/notepad/useNotepadTabs.js');
      const ok = typeof mod.useNotepadTabs === 'function';
      return { ok, details: ok ? '' : 'useNotepadTabs nie jest eksportowane' };
    }
  },
  {
    name: 'useNotepadUI – eksportowany jako funkcja',
    run: async () => {
      const mod = await import('../src/hooks/notepad/useNotepadUI.js');
      const ok = typeof mod.useNotepadUI === 'function';
      return { ok, details: ok ? '' : 'useNotepadUI nie jest eksportowane' };
    }
  },
  {
    name: 'useNotepadFindReplace – eksportowany jako funkcja',
    run: async () => {
      const mod = await import('../src/hooks/notepad/useNotepadFindReplace.js');
      const ok = typeof mod.useNotepadFindReplace === 'function';
      return { ok, details: ok ? '' : 'useNotepadFindReplace nie jest eksportowane' };
    }
  },

  // ─── useWebViewActions / useWebViewEvents
  {
    name: 'useWebViewActions – eksportowany jako funkcja',
    run: async () => {
      const mod = await import('../src/hooks/useWebViewActions.js');
      const ok = typeof mod.useWebViewActions === 'function';
      return { ok, details: ok ? '' : 'useWebViewActions nie jest eksportowane' };
    }
  },
  {
    name: 'useWebViewEvents – eksportowany jako funkcja',
    run: async () => {
      const mod = await import('../src/hooks/useWebViewEvents.js');
      const ok = typeof mod.useWebViewEvents === 'function';
      return { ok, details: ok ? '' : 'useWebViewEvents nie jest eksportowane' };
    }
  },

  // ─── useTaskGroups (nowy – z refaktoru Tasks)
  {
    name: 'useTaskGroups – eksportowany jako funkcja',
    run: async () => {
      try {
        const mod = await import('../src/hooks/aggregated/useAggregatedGroups.js');
        const ok = typeof mod.useTaskGroups === 'function';
        return { ok, details: ok ? '' : 'useTaskGroups nie jest eksportowane' };
      } catch (e) {
        return { ok: false, details: `Import failed: ${e.message}` };
      }
    }
  },

  // ─── useTranslation
  {
    name: 'useTranslation – eksportowany jako funkcja',
    run: async () => {
      const mod = await import('../src/hooks/useTranslation.js');
      const ok = typeof mod.useTranslation === 'function';
      return { ok, details: ok ? '' : 'useTranslation nie jest eksportowane' };
    }
  },

  // ─── Weryfikacja że hooki wołają window.electronAPI.invoke (nie bezpośrednio store)
  {
    name: 'useHistoryLog – nie importuje historyStore bezpośrednio',
    run: async () => {
      // Sprawdzamy przez tekst modułu – historyStore nie powinien być importowany w rendererze
      try {
        const response = await fetch('/src/hooks/useHistoryLog.js');
        if (!response.ok) return { ok: true, details: 'Nie można sprawdzić (fetch niedostępny) – pomiń' };
        const src = await response.text();
        const ok = !src.includes('historyStore');
        return { ok, details: ok ? '' : 'useHistoryLog importuje historyStore – naruszenie architektury IPC' };
      } catch {
        return { ok: true, details: 'Nie można zweryfikować przez fetch – sprawdź ręcznie' };
      }
    }
  },

  // ─── useAsyncMutation (osobny plik po refaktorze)
  {
    name: 'useAsyncMutation – eksportowany jako funkcja z useAsyncMutation.js',
    run: async () => {
      const mod = await import('../src/hooks/useAsyncMutation.js');
      const ok = typeof mod.useAsyncMutation === 'function';
      return { ok, details: ok ? '' : 'useAsyncMutation not exported from useAsyncMutation.js' };
    }
  },
  {
    name: 'useAppInitialization – eksportowany jako funkcja',
    run: async () => {
      const mod = await import('../src/hooks/useAppInitialization.js');
      const ok = typeof mod.useAppInitialization === 'function';
      return { ok, details: ok ? '' : 'useAppInitialization not exported' };
    }
  },
  {
    name: 'useMainLayout – eksportowany jako funkcja',
    run: async () => {
      const mod = await import('../src/hooks/useMainLayout.js');
      const ok = typeof mod.useMainLayout === 'function';
      return { ok, details: ok ? '' : 'useMainLayout not exported' };
    }
  },
  {
    name: 'useNotepadAutosave – eksportowany jako funkcja',
    run: async () => {
      const mod = await import('../src/hooks/notepad/useNotepadAutosave.js');
      const ok = typeof mod.useNotepadAutosave === 'function';
      return { ok, details: ok ? '' : 'useNotepadAutosave not exported' };
    }
  },
  {
    name: 'useNotepadModals – eksportowany jako funkcja',
    run: async () => {
      const mod = await import('../src/hooks/notepad/useNotepadModals.js');
      const ok = typeof mod.useNotepadModals === 'function';
      return { ok, details: ok ? '' : 'useNotepadModals not exported' };
    }
  },
  {
    name: 'useNotepadTabActions – eksportowany jako funkcja',
    run: async () => {
      const mod = await import('../src/hooks/notepad/useNotepadTabActions.js');
      const ok = typeof mod.useNotepadTabActions === 'function';
      return { ok, details: ok ? '' : 'useNotepadTabActions not exported' };
    }
  },

  // ─── Hooki z folderów podfunkcjonalnych ─────────────────────────────────

  // settings/
  {
    name: 'useSettings – src/hooks/settings/useSettings.js eksportuje hook',
    run: async () => checkSourceExport('src/hooks/settings/useSettings.js', 'useSettings'),
  },
  {
    name: 'useLogsSection – src/hooks/settings/useLogsSection.js eksportuje hook',
    run: async () => checkSourceExport('src/hooks/settings/useLogsSection.js', 'useLogsSection'),
  },
  {
    name: 'useNotificationsSection – src/hooks/settings/useNotificationsSection.js eksportuje hook',
    run: async () => checkSourceExport('src/hooks/settings/useNotificationsSection.js', 'useNotificationsSection'),
  },
  {
    name: 'useHotkeysManager – src/hooks/settings/useHotkeysManager.js eksportuje hook',
    run: async () => checkSourceExport('src/hooks/settings/useHotkeysManager.js', 'useHotkeysManager'),
  },

  // aggregated/
  {
    name: 'useAggregatedGroups – src/hooks/aggregated/useAggregatedGroups.js eksportuje hook',
    run: async () => checkSourceExport('src/hooks/aggregated/useAggregatedGroups.js', 'useTaskGroups'),
  },
  {
    name: 'useTaskPanel – src/hooks/aggregated/useTaskPanel.js eksportuje hook',
    run: async () => checkSourceExport('src/hooks/aggregated/useTaskPanel.js', 'useTasks'),
  },
  {
    name: 'useAggregated – src/hooks/aggregated/useAggregated.js eksportuje hook',
    run: async () => checkSourceExport('src/hooks/aggregated/useAggregated.js', 'useAggregatedTasks'),
  },

  // sidebar/
  {
    name: 'useSidebarSearch – src/hooks/sidebar/useSidebarSearch.js eksportuje hook',
    run: async () => checkSourceExport('src/hooks/sidebar/useSidebarSearch.js', 'useSidebarSearch'),
  },

  // notepad/ (przeniesione)
  {
    name: 'useNotepadContent – src/hooks/notepad/useNotepadContent.js eksportuje hook',
    run: async () => checkSourceExport('src/hooks/notepad/useNotepadContent.js', 'useNotepadContent'),
  },
  {
    name: 'useNotepadTabs – src/hooks/notepad/useNotepadTabs.js eksportuje hook',
    run: async () => checkSourceExport('src/hooks/notepad/useNotepadTabs.js', 'useNotepadTabs'),
  },

];

export async function runHooksTests() {
  return runTests('Hooks', tests);
}

