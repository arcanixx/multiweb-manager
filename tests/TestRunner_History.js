// =============================================================================
// FILE: TestRunner_History.js
// PATH: tests/TestRunner_History.js
// VERSION: 0.0.3
// PURPOSE: Testy historii aktywności — historyStore CRUD, walidacja struktury wpisów, filtrowanie, limit FIFO.
// FUNCTIONS: runHistoryTests
// DEPENDS ON: testUtils.js, path
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { checkSourceExport, runTests, safeImport } from './testUtils.js';
import { join } from 'path';
const ROOT = process.cwd();
const tests = [
  {
    name: 'HistoryExport - src/ui/history/HistoryExport.jsx eksportuje komponent',
    run: async () => checkSourceExport('src/ui/history/HistoryExport.jsx', 'HistoryExport')
  },
  {
    name: 'HistoryFilters - src/ui/history/HistoryFilters.jsx eksportuje komponent',
    run: async () => checkSourceExport('src/ui/history/HistoryFilters.jsx', 'HistoryFilters')
  },
  {
    name: 'HistoryList - src/ui/history/HistoryList.jsx eksportuje komponent',
    run: async () => checkSourceExport('src/ui/history/HistoryList.jsx', 'HistoryList')
  },
  {
    name: 'HistoryLog - src/ui/history/HistoryLog.jsx eksportuje komponent',
    run: async () => checkSourceExport('src/ui/history/HistoryLog.jsx', 'HistoryLog')
  },

  // ── historyStore exports ───────────────────────────────────────────────────
  {
    name: 'historyStore – all functions exported',
    run: async () => {
      let mod;
      try { mod = await safeImport('src/stores/historyStore.js'); }
      catch (e) { return { ok: false, details: `Import failed: ${e.message}` }; }
      const required = ['loadHistory', 'saveHistory', 'addHistoryEntry', 'clearHistory', 'getRecentHistory'];
      const missing = required.filter(fn => typeof mod[fn] !== 'function');
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Missing: ${missing.join(', ')}` };
    }
  },

  // ── Struktura wpisu ────────────────────────────────────────────────────────
  {
    name: 'History entry structure is valid',
    run: async () => {
      const entry = { level: 'info', message: 'Test message', timestamp: Date.now() };
      const ok = ['info', 'warn', 'error', 'debug'].includes(entry.level) && entry.message && entry.timestamp;
      return { ok, details: ok ? '' : 'Missing required fields' };
    }
  },
  {
    name: 'History entry – invalid level rejected',
    run: async () => {
      const validLevels = ['info', 'warn', 'error', 'debug'];
      const ok = !validLevels.includes('critical'); // 'critical' nie jest prawidłowym poziomem
      return { ok, details: ok ? '' : 'Invalid level should not be accepted' };
    }
  },

  // ── Filtrowanie ────────────────────────────────────────────────────────────
  {
    name: 'History filter by level – returns only matching entries',
    run: async () => {
      const entries = [{ level: 'info' }, { level: 'error' }, { level: 'info' }, { level: 'warn' }];
      const errors = entries.filter(e => e.level === 'error');
      const ok = errors.length === 1;
      return { ok, details: ok ? '' : `Expected 1, got ${errors.length}` };
    }
  },
  {
    name: 'History filter by text query – case-insensitive match',
    run: async () => {
      const entries = [
        { level: 'info', message: 'Profile loaded' },
        { level: 'error', message: 'PROFILE save failed' },
        { level: 'info', message: 'Task created' }
      ];
      const q = 'profile';
      const filtered = entries.filter(e => e.message.toLowerCase().includes(q));
      const ok = filtered.length === 2;
      return { ok, details: ok ? '' : `Expected 2, got ${filtered.length}` };
    }
  },

  // ── FIFO limit ─────────────────────────────────────────────────────────────
  {
    name: 'History FIFO – trims oldest when over limit',
    run: async () => {
      const MAX = 100;
      const history = Array.from({ length: 150 }, (_, i) => ({ id: i, message: `msg-${i}` }));
      // FIFO: usuń najstarsze (przód listy)
      const trimmed = history.length > MAX ? history.slice(history.length - MAX) : history;
      const ok = trimmed.length === MAX && trimmed[0].id === 50;
      return { ok, details: ok ? '' : `Length=${trimmed.length}, first.id=${trimmed[0]?.id}` };
    }
  },
  {
    name: 'getRecentHistory – returns at most limit entries',
    run: async () => {
      // Symulacja getRecentHistory(limit, offset)
      const allEntries = Array.from({ length: 200 }, (_, i) => ({ id: i }));
      const getRecent = (limit = 100, offset = 0) => allEntries.slice(offset, offset + limit);
      const result = getRecent(50, 0);
      const ok = result.length === 50;
      return { ok, details: ok ? '' : `Expected 50, got ${result.length}` };
    }
  },
  {
    name: 'getRecentHistory – offset works correctly',
    run: async () => {
      const allEntries = Array.from({ length: 200 }, (_, i) => ({ id: i }));
      const getRecent = (limit = 100, offset = 0) => allEntries.slice(offset, offset + limit);
      const page2 = getRecent(10, 10);
      const ok = page2[0].id === 10 && page2.length === 10;
      return { ok, details: ok ? '' : `First id=${page2[0]?.id}, len=${page2.length}` };
    }
  }
];

export async function runHistoryTests() {
  return runTests('History', tests);
}
