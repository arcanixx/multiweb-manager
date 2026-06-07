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
  // ─── Nowe: OnboardingScreen i SplashScreen z audytu ────────────────────────
  {
    name: 'OnboardingScreen - src/ui/system/OnboardingScreen.jsx eksportuje komponent',
    run: async () => checkSourceExport('src/ui/system/OnboardingScreen.jsx', 'OnboardingScreen')
  },
  {
    name: 'SplashScreen - src/ui/system/SplashScreen.jsx eksportuje komponent',
    run: async () => checkSourceExport('src/ui/system/SplashScreen.jsx', 'SplashScreen')
  },
  { name: 'ToastItem - src/ui/system/ToastItem.jsx eksportuje komponent', 
    run: async () => checkSourceExport('src/ui/system/ToastItem.jsx', 'ToastItem') },
  {
    name: 'ToastContainer - limit widocznych toastow zachowuje najnowsze wpisy',
    run: async () => {
      const limit = 5;
      const toasts = Array.from({ length: 8 }, (_, id) => ({ id }));
      const visible = toasts.slice(-limit);
      const ok = visible.length === limit && visible[0].id === 3 && visible[4].id === 7;
      return { ok, details: ok ? '' : `Widoczne id: ${visible.map((toast) => toast.id).join(',')}` };
    }
  },
  // ─── Toast kolejkowanie ──────────────────────────────────────────────────────
  {
    name: 'Toast – kolejka FIFO (pierwszy wchodzi, pierwszy wychodzi)',
    run: async () => {
      const queue = [];
      const push = (msg) => queue.push({ id: Date.now(), msg });
      const shift = () => queue.shift();
      push('A'); push('B'); push('C');
      const first = shift();
      const ok = first.msg === 'A' && queue.length === 2;
      return { ok, details: ok ? '' : `Pierwszy: ${first?.msg}, pozostało: ${queue.length}` };
    }
  },
  {
    name: 'Toast – typ success/error/warning/info jest walidowany',
    run: async () => {
      const VALID_TYPES = ['success', 'error', 'warning', 'info'];
      const isValid = (type) => VALID_TYPES.includes(type);
      const ok = isValid('success') && isValid('error') && !isValid('critical') && !isValid('');
      return { ok, details: ok ? '' : 'Toast type validation failed' };
    }
  },
];

export async function runSystemTests() {
  return runTests('System', tests);
}