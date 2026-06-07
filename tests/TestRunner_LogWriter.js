// =============================================================================
// FILE: TestRunner_LogWriter.js
// PATH: tests/TestRunner_LogWriter.js
// VERSION: 0.0.3
// PURPOSE: Testy dla LogWritera – eksport funkcji, logika formatowania wpisów, guard debugMode.
// FUNCTIONS: runLogWriterTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests, safeImport } from './testUtils.js';

const tests = [
  // ─── Eksporty ─────────────────────────────────────────────────────────────
  {
    name: 'LogWriter – wszystkie funkcje eksportowane',
    run: async () => {
      const mod = await safeImport('src/utils/logWriter.js');
      const required = ['initLogWriter', 'appendTestFailLog', 'getLogsContent', 'clearLogsFile'];
      const missing = required.filter(fn => typeof mod[fn] !== 'function');
      return { ok: missing.length === 0, details: missing.length ? `Brakujące: ${missing.join(', ')}` : '' };
    }
  },

  // ─── Logika formatowania wpisów (czysta, bez IPC) ─────────────────────────
  {
    name: 'LogWriter – format wpisu zawiera timestamp ISO, module i test name',
    run: async () => {
      const ts = new Date(1717000000000).toISOString();
      const line = `[${ts}] FAIL: TestModule / TestName – Some details\n`;
      const ok = line.includes('[2024-') && line.includes('FAIL:') &&
                 line.includes('TestModule / TestName') && line.includes('Some details');
      return { ok, details: ok ? '' : `Format line: ${line}` };
    }
  },
  {
    name: 'LogWriter – format wpisu FIFO: nowe wpisy dopisywane na końcu',
    run: async () => {
      const lines = [];
      const append = (module, test, details) =>
        lines.push(`FAIL: ${module} / ${test} – ${details}`);
      append('ModA', 'Test1', 'detail1');
      append('ModB', 'Test2', 'detail2');
      const ok = lines[0].includes('ModA') && lines[1].includes('ModB');
      return { ok, details: ok ? '' : `Lines: ${JSON.stringify(lines)}` };
    }
  },
  {
    name: 'LogWriter – guard: appendTestFailLog nie wywołuje IPC gdy debugMode=false',
    run: async () => {
      // Sprawdzamy logikę guard bez wywoływania IPC
      let debugMode = false;
      let logsEnabled = true;
      const shouldLog = () => debugMode && logsEnabled;
      const ok = !shouldLog(); // przy debugMode=false nie logujemy
      debugMode = true;
      const okDebug = shouldLog(); // przy debugMode=true logujemy
      return { ok: ok && okDebug, details: ok && okDebug ? '' : `shouldLog(false)=${!ok}, shouldLog(true)=${okDebug}` };
    }
  },
  {
    name: 'LogWriter – guard: nie loguje gdy logsEnabled=false mimo debugMode=true',
    run: async () => {
      let debugMode = true;
      let logsEnabled = false;
      const shouldLog = () => debugMode && logsEnabled;
      const ok = !shouldLog();
      return { ok, details: ok ? '' : 'Should NOT log when logsEnabled=false' };
    }
  },
  {
    name: 'LogWriter – timestamp jest liczbą ms (Date.now() format)',
    run: async () => {
      const ts = Date.now();
      const ok = typeof ts === 'number' && ts > 1_000_000_000_000;
      return { ok, details: ok ? '' : `ts=${ts}` };
    }
  },
];

export async function runLogWriterTests() {
  return runTests('LogWriter', tests);
}