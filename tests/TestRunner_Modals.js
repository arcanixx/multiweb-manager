// =============================================================================
// FILE: TestRunner_Modals.js
// PATH: tests/TestRunner_Modals.js
// VERSION: 0.0.3
// PURPOSE: Testy komponentow modalnych oraz podstawowych kontraktow formularzy.
// FUNCTIONS: runModalsTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

// Nie usuwac komentarzy - opisuja flow aplikacji.

import { checkSourceExport, runTests } from './testUtils.js';

const modalComponents = [
  ['CategoryModal', 'src/ui/modals/CategoryModal.jsx'],
  ['ConfirmModal', 'src/ui/modals/ConfirmModal.jsx'],
  ['Modal', 'src/ui/modals/Modal.jsx'],
  ['ProfileModal', 'src/ui/modals/ProfileModal.jsx'],
  ['PromptModal', 'src/ui/modals/PromptModal.jsx']
];

const tests = [
  ...modalComponents.map(([name, path]) => ({
    name: `${name} - ${path} eksportuje komponent`,
    run: async () => checkSourceExport(path, name)
  })),
  {
    name: 'ConfirmModal - kontrakt callbackow onConfirm/onCancel',
    run: async () => {
      let confirmed = false;
      let cancelled = false;
      const props = {
        onConfirm: () => { confirmed = true; },
        onCancel: () => { cancelled = true; }
      };
      props.onConfirm();
      props.onCancel();
      return { ok: confirmed && cancelled, details: confirmed && cancelled ? '' : 'Callback nie zostal wywolany' };
    }
  },
  {
    name: 'ProfileModal - minimalna walidacja name/url blokuje puste dane',
    run: async () => {
      const canSubmit = ({ name, url }) => Boolean(name?.trim()) && /^https?:\/\//.test(url || '');
      const ok = canSubmit({ name: 'Docs', url: 'https://example.com' })
        && !canSubmit({ name: '', url: 'https://example.com' })
        && !canSubmit({ name: 'Docs', url: 'notaurl' });
      return { ok, details: ok ? '' : 'Walidacja minimalnych danych profilu nie dziala' };
    }
  }
];

export async function runModalsTests() {
  return runTests('Modals', tests);
}