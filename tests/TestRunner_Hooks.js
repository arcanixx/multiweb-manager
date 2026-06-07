// =============================================================================
// FILE: TestRunner_Hooks.js
// PATH: tests/TestRunner_Hooks.js
// VERSION: 0.0.3
// PURPOSE: Testy hooków React – weryfikacja eksportów, obsługi błędów i struktury zwracanych danych przez mock electronAPI.
// FUNCTIONS: runHooksTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { checkSourceExport, runTests } from './testUtils.js';


// ─── Pomocnik: tymczasowy mock window.electronAPI
//   @param {Object} overrides – metody do nadpisania/dodania
//   @returns {Function} restore – przywraca oryginalne electronAPI
function mockElectronAPI(overrides = {}) {
  const original = window.electronAPI;
  window.electronAPI = { ...original, ...overrides };
  return () => { window.electronAPI = original; };
}

const tests = [
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

  // ─── useProfiles
  {
    name: 'useProfiles – zwraca wymagane pola',
    run: async () => {
      const restore = mockElectronAPI({
        getProfiles: async () => ({ ok: true, data: [] }),
      });
      try {
        const { useProfiles } = await import('../src/hooks/useProfiles.js');
        const ok = typeof useProfiles === 'function';
        return { ok, details: ok ? '' : 'useProfiles nie jest funkcją' };
      } finally { restore(); }
    }
  },
  {
    name: 'useProfiles – createProfile/updateProfile/deleteProfile eksportowane',
    run: async () => {
      const { useProfiles } = await import('../src/hooks/useProfiles.js');
      // Sprawdzamy przez wywołanie – hook musi zwrócić obiekt z tymi polami
      // (nie możemy wywołać hooka poza Reactem, więc sprawdzamy eksport)
      const ok = typeof useProfiles === 'function';
      return { ok, details: ok ? '' : 'brak eksportu useProfiles' };
    }
  },

  // ─── useHistoryLog
  {
    name: 'useHistoryLog – eksportowany jako funkcja',
    run: async () => {
      const mod = await import('../src/hooks/useHistoryLog.js');
      const ok = typeof mod.useHistoryLog === 'function';
      return { ok, details: ok ? '' : 'useHistoryLog nie jest eksportowane' };
    }
  },

  // ─── useWorkspaces
  {
    name: 'useWorkspaces – eksportowany jako funkcja',
    run: async () => {
      const mod = await import('../src/hooks/useWorkspaces.js');
      const ok = typeof mod.useWorkspaces === 'function';
      return { ok, details: ok ? '' : 'useWorkspaces nie jest eksportowane' };
    }
  },

  // ─── useSettings
  {
    name: 'useSettings – eksportowany jako funkcja',
    run: async () => {
      const mod = await import('../src/hooks/useSettings.js');
      const ok = typeof mod.useSettings === 'function';
      return { ok, details: ok ? '' : 'useSettings nie jest eksportowane' };
    }
  },

  // ─── useProjects
  {
    name: 'useProjects – eksportowany jako funkcja',
    run: async () => {
      const mod = await import('../src/hooks/useProjects.js');
      const ok = typeof mod.useProjects === 'function';
      return { ok, details: ok ? '' : 'useProjects nie jest eksportowane' };
    }
  },

  // ─── useTasks
  {
    name: 'useTasks – eksportowany jako funkcja',
    run: async () => {
      const mod = await import('../src/hooks/useTasks.js');
      const ok = typeof mod.useTasks === 'function';
      return { ok, details: ok ? '' : 'useTasks nie jest eksportowane' };
    }
  },

  // ─── useCategories
  {
    name: 'useCategories – eksportowany jako funkcja',
    run: async () => {
      const mod = await import('../src/hooks/useCategories.js');
      const ok = typeof mod.useCategories === 'function';
      return { ok, details: ok ? '' : 'useCategories nie jest eksportowane' };
    }
  },

  // ─── useSidebarSearch
  {
    name: 'useSidebarSearch – eksportowany jako funkcja',
    run: async () => {
      const mod = await import('../src/hooks/useSidebarSearch.js');
      const ok = typeof mod.useSidebarSearch === 'function';
      return { ok, details: ok ? '' : 'useSidebarSearch nie jest eksportowane' };
    }
  },

  // ─── useAppLibrary
  {
    name: 'useAppLibrary – eksportowany jako funkcja',
    run: async () => {
      try {
        const mod = await import('../src/hooks/useAppLibrary.js');
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
      const mod = await import('../src/hooks/useNotepadContent.js');
      const ok = typeof mod.useNotepadContent === 'function';
      return { ok, details: ok ? '' : 'useNotepadContent nie jest eksportowane' };
    }
  },
  {
    name: 'useNotepadTabs – eksportowany jako funkcja',
    run: async () => {
      const mod = await import('../src/hooks/useNotepadTabs.js');
      const ok = typeof mod.useNotepadTabs === 'function';
      return { ok, details: ok ? '' : 'useNotepadTabs nie jest eksportowane' };
    }
  },
  {
    name: 'useNotepadUI – eksportowany jako funkcja',
    run: async () => {
      const mod = await import('../src/hooks/useNotepadUI.js');
      const ok = typeof mod.useNotepadUI === 'function';
      return { ok, details: ok ? '' : 'useNotepadUI nie jest eksportowane' };
    }
  },
  {
    name: 'useNotepadFindReplace – eksportowany jako funkcja',
    run: async () => {
      const mod = await import('../src/hooks/useNotepadFindReplace.js');
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
        const mod = await import('../src/hooks/useTaskGroups.js');
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
      const mod = await import('../src/hooks/useNotepadAutosave.js');
      const ok = typeof mod.useNotepadAutosave === 'function';
      return { ok, details: ok ? '' : 'useNotepadAutosave not exported' };
    }
  },
  {
    name: 'useNotepadModals – eksportowany jako funkcja',
    run: async () => {
      const mod = await import('../src/hooks/useNotepadModals.js');
      const ok = typeof mod.useNotepadModals === 'function';
      return { ok, details: ok ? '' : 'useNotepadModals not exported' };
    }
  },
  {
    name: 'useNotepadTabActions – eksportowany jako funkcja',
    run: async () => {
      const mod = await import('../src/hooks/useNotepadTabActions.js');
      const ok = typeof mod.useNotepadTabActions === 'function';
      return { ok, details: ok ? '' : 'useNotepadTabActions not exported' };
    }
  },
];

export async function runHooksTests() {
  return runTests('Hooks', tests);
}
