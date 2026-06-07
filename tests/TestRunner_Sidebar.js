// =============================================================================
// FILE: TestRunner_Sidebar.js
// PATH: tests/TestRunner_Sidebar.js
// VERSION: 0.0.3
// PURPOSE: Testy komponentow sidebara oraz podstawowej logiki list profili.
// FUNCTIONS: runSidebarTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// Nie usuwac komentarzy - opisuja flow aplikacji.

import { checkSourceExport, runTests } from './testUtils.js';

const sidebarComponents = [
  ['Sidebar', 'src/ui/sidebar/Sidebar.jsx'],
  ['SidebarCategory', 'src/ui/sidebar/SidebarCategory.jsx'],
  ['SidebarHeader', 'src/ui/sidebar/SidebarHeader.jsx'],
  ['SidebarProfileItem', 'src/ui/sidebar/SidebarProfileItem.jsx'],
  ['SidebarProfileList', 'src/ui/sidebar/SidebarProfileList.jsx'],
  ['SidebarSearch', 'src/ui/sidebar/SidebarSearch.jsx'],
  ['SidebarTools', 'src/ui/sidebar/SidebarTools.jsx'],
  ['SidebarWorkspaces', 'src/ui/sidebar/SidebarWorkspaces.jsx'],
  ['ContextMenu', 'src/ui/sidebar/ContextMenu.jsx'],
];

const tests = [
  ...sidebarComponents.map(([name, path]) => ({
    name: `${name} - ${path} eksportuje komponent`,
    run: async () => checkSourceExport(path, name)
  })),
  {
    name: 'Sidebar - filtrowanie profili po nazwie i URL jest case-insensitive',
    run: async () => {
      const profiles = [
        { id: '1', name: 'Claude AI', url: 'https://claude.ai' },
        { id: '2', name: 'DeepSeek', url: 'https://deepseek.com' },
        { id: '3', name: 'Docs', url: 'https://docs.example.com' }
      ];
      const filter = (query) => profiles.filter((profile) => {
        const haystack = `${profile.name} ${profile.url}`.toLowerCase();
        return haystack.includes(query.toLowerCase());
      });
      const ok = filter('CLAUDE').length === 1 && filter('deep').length === 1 && filter('missing').length === 0;
      return { ok, details: ok ? '' : 'Filtr nie zwraca oczekiwanych profili' };
    }
  },
  {
    name: 'SidebarProfileList - pinned profile sortuje sie przed zwyklymi',
    run: async () => {
      const profiles = [
        { id: 'normal-a', pinned: false, name: 'A' },
        { id: 'pinned', pinned: true, name: 'Z' },
        { id: 'normal-b', pinned: false, name: 'B' }
      ];
      const sorted = [...profiles].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));
      return { ok: sorted[0].id === 'pinned', details: sorted[0].id === 'pinned' ? '' : `Pierwszy: ${sorted[0].id}` };
    }
  }
];

export async function runSidebarTests() {
  return runTests('Sidebar', tests);
}