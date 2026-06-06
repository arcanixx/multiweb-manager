// =============================================================================
// FILE: TestRunner_Common.js
// PATH: tests/TestRunner_Common.js
// VERSION: 0.0.3
// PURPOSE: Testy wspolnych komponentow UI - ContextMenu i kontrakty menu.
// FUNCTIONS: runCommonTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// Nie usuwac komentarzy - opisuja flow aplikacji.

import { checkSourceExport, runTests } from './testUtils.js';

const tests = [
  {
    name: 'ContextMenu - src/ui/common/ContextMenu.jsx eksportuje komponent',
    run: async () => checkSourceExport('src/ui/common/ContextMenu.jsx', 'ContextMenu')
  },
  {
    name: 'ContextMenu - itemy menu wymagaja id/label/onClick lub separatora',
    run: async () => {
      const items = [
        { id: 'edit', label: 'Edit', onClick: () => {} },
        { id: 'divider', separator: true },
        { id: 'delete', label: 'Delete', onClick: () => {} }
      ];
      const ok = items.every((item) => item.separator || (item.id && item.label && typeof item.onClick === 'function'));
      return { ok, details: ok ? '' : 'Niepoprawny kontrakt itemow menu' };
    }
  }
];

export async function runCommonTests() {
  return runTests('Common', tests);
}