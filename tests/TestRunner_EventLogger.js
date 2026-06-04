// =============================================================================
// FILE: TestRunner_EventLogger.js
// PATH: tests/TestRunner_EventLogger.js
// VERSION: 0.0.3
// PURPOSE: Testy jednostkowe modułu eventLogger — sanityzacja params, guard eventLogEnabled, format wpisu. (ARCH_REQ-044)
// FUNCTIONS: runEventLoggerTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';

const tests = [
  {
    name: 'logEvent: nie zapisuje gdy eventLogEnabled=false (domyślne)',
    run: async () => {
      const calls = [];
      // Mockuj invoke — przechwytuj wywołania events:append
      const origInvoke = window.electronAPI?.invoke;
      if (window.electronAPI) {
        window.electronAPI.invoke = async (channel, ...args) => {
          if (channel === 'events:append') calls.push(args[0]);
          if (channel === 'settings:get') return { ok: true, data: { eventLogEnabled: false } };
          return origInvoke?.(channel, ...args);
        };
      }
      try {
        // Reset cache modułu (reimport)
        const mod = await import('../src/utils/eventLogger.js?t=' + Date.now());
        mod.logEvent('TestModule', 'testFn', 'test_action', {}, 'user');
        await new Promise(r => setTimeout(r, 50));
        if (calls.length > 0) return { ok: false, details: `events:append called ${calls.length} times (expected 0)` };
        return { ok: true, details: 'Guard works — no write when eventLogEnabled=false' };
      } finally {
        if (window.electronAPI && origInvoke) window.electronAPI.invoke = origInvoke;
      }
    },
  },

  {
    name: 'logEvent: sanityzuje blacklistowane klucze params',
    run: async () => {
      // Test _sanitizeParams przez pośrednie sprawdzenie modułu
      // Importujemy i sprawdzamy czy wyeksportowane logEvent nie przepuszcza wrażliwych danych
      const calls = [];
      const origInvoke = window.electronAPI?.invoke;
      if (window.electronAPI) {
        window.electronAPI.invoke = async (channel, ...args) => {
          if (channel === 'events:append') calls.push(args[0]);
          if (channel === 'settings:get') return { ok: true, data: { eventLogEnabled: true } };
          return origInvoke?.(channel, ...args);
        };
      }
      try {
        const mod = await import('../src/utils/eventLogger.js?t2=' + Date.now());
        mod.logEvent('TestModule', 'testFn', 'test_action', {
          userId: 123,
          password: 'secret123',   // blacklisted
          token: 'abc.def.ghi',    // blacklisted
          name: 'TestUser',
        }, 'user');
        await new Promise(r => setTimeout(r, 50));
        if (calls.length === 0) return { ok: false, details: 'No call recorded — guard too strict' };
        const params = calls[0].params || {};
        if ('password' in params) return { ok: false, details: 'password present in params (should be blacklisted)' };
        if ('token' in params) return { ok: false, details: 'token present in params (should be blacklisted)' };
        if (!('userId' in params)) return { ok: false, details: 'userId missing (should pass through)' };
        return { ok: true, details: 'Blacklisted keys removed, safe keys preserved' };
      } finally {
        if (window.electronAPI && origInvoke) window.electronAPI.invoke = origInvoke;
      }
    },
  },

  {
    name: 'logEvent: wpis zawiera wymagane pola (ts, module, fn, action, source)',
    run: async () => {
      const calls = [];
      const origInvoke = window.electronAPI?.invoke;
      if (window.electronAPI) {
        window.electronAPI.invoke = async (channel, ...args) => {
          if (channel === 'events:append') calls.push(args[0]);
          if (channel === 'settings:get') return { ok: true, data: { eventLogEnabled: true } };
          return origInvoke?.(channel, ...args);
        };
      }
      try {
        const mod = await import('../src/utils/eventLogger.js?t3=' + Date.now());
        mod.logEvent('TaskPanel', 'handleSave', 'task_saved', { id: 1 }, 'user');
        await new Promise(r => setTimeout(r, 50));
        if (calls.length === 0) return { ok: false, details: 'No call recorded' };
        const entry = calls[0];
        const required = ['ts', 'module', 'fn', 'action', 'source'];
        const missing = required.filter(k => !(k in entry));
        if (missing.length > 0) return { ok: false, details: `Missing fields: ${missing.join(', ')}` };
        if (entry.module !== 'TaskPanel') return { ok: false, details: `Wrong module: ${entry.module}` };
        if (entry.source !== 'user') return { ok: false, details: `Wrong source: ${entry.source}` };
        if (typeof entry.ts !== 'number') return { ok: false, details: `ts not a number: ${entry.ts}` };
        return { ok: true, details: 'All required fields present and correct' };
      } finally {
        if (window.electronAPI && origInvoke) window.electronAPI.invoke = origInvoke;
      }
    },
  },
];

export async function runEventLoggerTests() {
  return runTests('EventLogger', tests);
}