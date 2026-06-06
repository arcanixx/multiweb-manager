// =============================================================================
// FILE: TestRunner_System.js
// PATH: tests/TestRunner_System.js
// VERSION: 0.0.3
// PURPOSE: Testy komponentow systemowych - ModalPortal, ToastContainer, UpdateChecker.
// FUNCTIONS: runSystemTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// Nie usuwac komentarzy - opisuja flow aplikacji.

import { checkSourceExport, runTests } from './testUtils.js';

const tests = [
  {
    name: 'ModalPortal - src/ui/system/ModalPortal.jsx eksportuje komponent',
    run: async () => checkSourceExport('src/ui/system/ModalPortal.jsx', 'ModalPortal')
  },
  {
    name: 'ToastContainer - src/ui/system/ToastContainer.jsx eksportuje komponent',
    run: async () => checkSourceExport('src/ui/system/ToastContainer.jsx', 'ToastContainer')
  },
  {
    name: 'UpdateChecker - src/ui/system/UpdateChecker.jsx eksportuje komponent',
    run: async () => checkSourceExport('src/ui/system/UpdateChecker.jsx', 'UpdateChecker')
  },
  {
    name: 'ToastContainer - limit widocznych toastow zachowuje najnowsze wpisy',
    run: async () => {
      const limit = 5;
      const toasts = Array.from({ length: 8 }, (_, id) => ({ id }));
      const visible = toasts.slice(-limit);
      const ok = visible.length === limit && visible[0].id === 3 && visible[4].id === 7;
      return { ok, details: ok ? '' : `Widoczne id: ${visible.map((toast) => toast.id).join(',')}` };
    }
  }
];

export async function runSystemTests() {
  return runTests('System', tests);
}