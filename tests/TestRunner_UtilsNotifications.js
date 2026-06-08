// =============================================================================
// FILE: TestRunner_UtilsNotifications.js
// PATH: tests/TestRunner_UtilsNotifications.js
// VERSION: 0.0.3
// PURPOSE: Testy jednostkowe globalnego systemu toastów — kolejkowanie, typy, guard toastsEnabled. (UIUX_REQ-021)
// FUNCTIONS: runNotificationsTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';

function ensureWindowEvents() {
  if (typeof globalThis.window === 'undefined') {
    const target = new EventTarget();
    globalThis.window = {
      addEventListener: target.addEventListener.bind(target),
      removeEventListener: target.removeEventListener.bind(target),
      dispatchEvent: target.dispatchEvent.bind(target),
      electronAPI: { invoke: async () => ({ ok: true }) }
    };
  }
  if (typeof globalThis.CustomEvent === 'undefined') {
    globalThis.CustomEvent = class CustomEvent extends Event {
      constructor(type, params = {}) {
        super(type);
        this.detail = params.detail;
      }
    };
  }
}

const tests = [
  {
    name: 'showToast: dispatches CustomEvent mwm:toast',
    env: 'react',
    run: async () => {
      ensureWindowEvents();
      let received = null;
      const handler = (e) => { received = e.detail; };
      window.addEventListener('mwm:toast', handler);
      try {
        const { showToast } = await import('../src/utils/notificationsManager.js');
        showToast('success', 'Test message');
        await new Promise(r => setTimeout(r, 10));
        if (!received) return { ok: false, details: 'Event not received' };
        if (received.type !== 'success') return { ok: false, details: `Wrong type: ${received.type}` };
        if (received.message !== 'Test message') return { ok: false, details: `Wrong message: ${received.message}` };
        if (!received.id?.startsWith('toast-')) return { ok: false, details: `Bad id: ${received.id}` };
        return { ok: true, details: 'Event dispatched correctly' };
      } finally {
        window.removeEventListener('mwm:toast', handler);
      }
    },
  },

  {
    name: 'showToast: generuje unikalny id dla każdego toastu',
    env: 'react',
    run: async () => {
      ensureWindowEvents();
      const ids = [];
      const handler = (e) => ids.push(e.detail.id);
      window.addEventListener('mwm:toast', handler);
      try {
        const { showToast } = await import('../src/utils/notificationsManager.js');
        showToast('info', 'A');
        showToast('info', 'B');
        showToast('info', 'C');
        await new Promise(r => setTimeout(r, 20));
        if (ids.length !== 3) return { ok: false, details: `Expected 3 ids, got ${ids.length}` };
        const unique = new Set(ids);
        if (unique.size !== 3) return { ok: false, details: 'Duplicate IDs detected' };
        return { ok: true, details: `All ${ids.length} IDs unique` };
      } finally {
        window.removeEventListener('mwm:toast', handler);
      }
    },
  },

  {
    name: 'showToast: akceptuje wszystkie typy (success/error/warning/info)',
    env: 'react',
    run: async () => {
      ensureWindowEvents();
      const types = ['success', 'error', 'warning', 'info'];
      const received = [];
      const handler = (e) => received.push(e.detail.type);
      window.addEventListener('mwm:toast', handler);
      try {
        const { showToast } = await import('../src/utils/notificationsManager.js');
        for (const type of types) showToast(type, `Test ${type}`);
        await new Promise(r => setTimeout(r, 20));
        const missing = types.filter(t => !received.includes(t));
        if (missing.length > 0) return { ok: false, details: `Missing types: ${missing.join(', ')}` };
        return { ok: true, details: `All types dispatched: ${types.join(', ')}` };
      } finally {
        window.removeEventListener('mwm:toast', handler);
      }
    },
  },
];

export async function runNotificationsTests() {
  return runTests('Notifications', tests);
}