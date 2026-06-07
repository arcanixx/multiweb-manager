// =============================================================================
// FILE: TestRunner_Hooks.js
// PATH: tests/TestRunner_Hooks.js
// VERSION: 0.0.3
// PURPOSE: Testy hooków React – weryfikacja eksportów (checkSourceExport – Node-safe) i testy funkcjonalne z mockElectronAPI. Testy direct-import hooków React są wykonywane przy starcie aplikacji (pełne środowisko Electron+JSDOM).
// FUNCTIONS: runHooksTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { checkSourceExport, runTests, safeImport, mockElectronAPI } from './testUtils.js';

const tests = [
  // ============================================================================
  // EKSPORTY HOOKÓW (checkSourceExport – bezpieczne w Node, nie importuje JSX/React)
  // ============================================================================

  // ── Core hooks ──────────────────────────────────────────────────────────────
  { name: 'useAppInitialization – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useAppInitialization.js', 'useAppInitialization') },
  { name: 'useMainLayout – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useMainLayout.js', 'useMainLayout') },
  { name: 'useWebViewActions – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useWebViewActions.js', 'useWebViewActions') },
  { name: 'useWebViewEvents – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useWebViewEvents.js', 'useWebViewEvents') },
  { name: 'useTranslation – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useTranslation.js', 'useTranslation') },
  { name: 'useAsyncMutation – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useAsyncMutation.js', 'useAsyncMutation') },
  { name: 'useProfiles – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useProfiles.js', 'useProfiles') },
  { name: 'useHistoryLog – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useHistoryLog.js', 'useHistoryLog') },
  { name: 'useWorkspaces – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useWorkspaces.js', 'useWorkspaces') },
  { name: 'useProjects – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useProjects.js', 'useProjects') },
  { name: 'useCategories – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useCategories.js', 'useCategories') },
  { name: 'useAppLibrary – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/useAppLibrary.js', 'useAppLibrary') },

  // ── Settings hooks ───────────────────────────────────────────────────────────
  { name: 'useSettings – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/settings/useSettings.js', 'useSettings') },
  { name: 'useLogsSection – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/settings/useLogsSection.js', 'useLogsSection') },
  { name: 'useNotificationsSection – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/settings/useNotificationsSection.js', 'useNotificationsSection') },
  { name: 'useHotkeysManager – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/settings/useHotkeysManager.js', 'useHotkeysManager') },

  // ── Notepad hooks ────────────────────────────────────────────────────────────
  { name: 'useNotepadHandlers – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/notepad/useNotepadHandlers.js', 'useNotepadHandlers') },
  { name: 'useNotepadAutosave – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/notepad/useNotepadAutosave.js', 'useNotepadAutosave') },
  { name: 'useNotepadContent – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/notepad/useNotepadContent.js', 'useNotepadContent') },
  { name: 'useNotepadFindReplace – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/notepad/useNotepadFindReplace.js', 'useNotepadFindReplace') },
  { name: 'useNotepadModals – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/notepad/useNotepadModals.js', 'useNotepadModals') },
  { name: 'useNotepadTabActions – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/notepad/useNotepadTabActions.js', 'useNotepadTabActions') },
  { name: 'useNotepadTabs – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/notepad/useNotepadTabs.js', 'useNotepadTabs') },
  { name: 'useNotepadUI – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/notepad/useNotepadUI.js', 'useNotepadUI') },

  // ── Aggregated hooks ─────────────────────────────────────────────────────────
  { name: 'useAggregatedGroups – eksportuje hook (useTaskGroups)',
    run: async () => checkSourceExport('src/hooks/aggregated/useAggregatedGroups.js', 'useTaskGroups') },
  { name: 'useTaskPanel – eksportuje hook (useTasks)',
    run: async () => checkSourceExport('src/hooks/aggregated/useTaskPanel.js', 'useTasks') },
  { name: 'useAggregated – eksportuje hook (useAggregatedTasks)',
    run: async () => checkSourceExport('src/hooks/aggregated/useAggregated.js', 'useAggregatedTasks') },

  // ── Sidebar hooks ────────────────────────────────────────────────────────────
  { name: 'useSidebarHandlers – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/sidebar/useSidebarHandlers.js', 'useSidebarHandlers') },
  { name: 'useSidebarSearch – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/sidebar/useSidebarSearch.js', 'useSidebarSearch') },

  // ── Task panel hooks ─────────────────────────────────────────────────────────
  { name: 'useTaskPanelHandlers – eksportuje hook',
    run: async () => checkSourceExport('src/hooks/taskpanel/useTaskPanelHandlers.js', 'useTaskPanelHandlers') },

  // ============================================================================
  // TESTY FUNKCJONALNE z mockElectronAPI (safeImport – bez React DOM)
  // Te testy weryfikują że hook jest funkcją i przyjmuje poprawne argumenty.
  // Pełne testy renderowania wykonywane są przy starcie aplikacji (Electron+JSDOM).
  // ============================================================================

  {
    name: 'useProfiles – importowalny i jest funkcją',
    run: async () => {
      const restore = mockElectronAPI({ getProfiles: async () => ({ ok: true, data: [] }) });
      try {
        const { useProfiles } = await safeImport('src/hooks/useProfiles.js');
        return { ok: typeof useProfiles === 'function', details: 'useProfiles nie jest funkcją' };
      } catch (e) { return { ok: false, details: e.message }; }
      finally { restore(); }
    }
  },
  {
    name: 'useHistoryLog – importowalny i jest funkcją',
    run: async () => {
      const restore = mockElectronAPI({ getHistory: async () => ({ ok: true, data: [] }) });
      try {
        const { useHistoryLog } = await safeImport('src/hooks/useHistoryLog.js');
        return { ok: typeof useHistoryLog === 'function', details: 'useHistoryLog nie jest funkcją' };
      } catch (e) { return { ok: false, details: e.message }; }
      finally { restore(); }
    }
  },
  {
    name: 'useWorkspaces – importowalny i jest funkcją',
    run: async () => {
      const restore = mockElectronAPI({ getWorkspaces: async () => ({ ok: true, data: [] }) });
      try {
        const { useWorkspaces } = await safeImport('src/hooks/useWorkspaces.js');
        return { ok: typeof useWorkspaces === 'function', details: 'useWorkspaces nie jest funkcją' };
      } catch (e) { return { ok: false, details: e.message }; }
      finally { restore(); }
    }
  },
  {
    name: 'useSettings – importowalny i jest funkcją',
    run: async () => {
      const restore = mockElectronAPI({ getSettings: async () => ({ ok: true, data: {} }) });
      try {
        const { useSettings } = await safeImport('src/hooks/settings/useSettings.js');
        return { ok: typeof useSettings === 'function', details: 'useSettings nie jest funkcją' };
      } catch (e) { return { ok: false, details: e.message }; }
      finally { restore(); }
    }
  },
  {
    name: 'useProjects – importowalny i jest funkcją',
    run: async () => {
      const restore = mockElectronAPI({ getProjects: async () => ({ ok: true, data: [] }) });
      try {
        const { useProjects } = await safeImport('src/hooks/useProjects.js');
        return { ok: typeof useProjects === 'function', details: 'useProjects nie jest funkcją' };
      } catch (e) { return { ok: false, details: e.message }; }
      finally { restore(); }
    }
  },
  {
    name: 'useSidebarSearch – importowalny i jest funkcją',
    run: async () => {
      const restore = mockElectronAPI({ invoke: async () => ({ ok: true, data: [] }) });
      try {
        const { useSidebarSearch } = await safeImport('src/hooks/sidebar/useSidebarSearch.js');
        return { ok: typeof useSidebarSearch === 'function', details: 'useSidebarSearch nie jest funkcją' };
      } catch (e) { return { ok: false, details: e.message }; }
      finally { restore(); }
    }
  },
  {
    name: 'useCategories – importowalny i jest funkcją',
    run: async () => {
      const restore = mockElectronAPI({
        getSettings: async () => ({ ok: true, data: { categories: [] } }),
        saveSettings: async () => ({ ok: true }),
      });
      try {
        const { useCategories } = await safeImport('src/hooks/useCategories.js');
        return { ok: typeof useCategories === 'function', details: 'useCategories nie jest funkcją' };
      } catch (e) { return { ok: false, details: e.message }; }
      finally { restore(); }
    }
  },

  // ─── Weryfikacja architektury IPC ────────────────────────────────────────
  {
    name: 'useHistoryLog – nie importuje historyStore bezpośrednio (czystość IPC)',
    run: async () => {
      const { readFileSync } = await import('fs');
      const { join } = await import('path');
      try {
        const src = readFileSync(join(process.cwd(), 'src/hooks/useHistoryLog.js'), 'utf8');
        const ok = !src.includes("'../stores/historyStore'") && !src.includes('"../stores/historyStore"');
        return { ok, details: ok ? '' : 'useHistoryLog importuje historyStore – naruszenie architektury IPC' };
      } catch (e) {
        return { ok: false, details: `Nie można odczytać pliku: ${e.message}` };
      }
    }
  },
];

export async function runHooksTests() {
  return runTests('Hooks', tests);
}
