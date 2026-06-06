// =============================================================================
// FILE: TestRunner_LogWriter.js
// PATH: tests/TestRunner_LogWriter.js
// VERSION: 0.0.3
// PURPOSE: Testy dla LogWritera (zapis, odczyt, czyszczenie, limit linii)
// FUNCTIONS: runLogWriterTests
// DEPENDS ON: testUtils.js, logWriter.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
import { initLogWriter, appendTestFailLog, getLogsContent, clearLogsFile } from '../src/utils/logWriter.js';



const tests = [
  {
    name: 'LogWriter: initLogWriter runs without error',
    run: async () => {
      let error = null;
      try {
        await initLogWriter();
      } catch (e) {
        error = e.message;
      }
      const ok = error === null;
      return { ok, details: ok ? '' : `init failed: ${error}` };
    }
  },
  {
    name: 'LogWriter: appendTestFailLog writes entry',
    run: async () => {
      await clearLogsFile(); // wyczyść przed testem
      await appendTestFailLog('TestModule', 'TestName', 'Test details');
      const content = await getLogsContent();
      const ok = content && content.includes('FAIL: TestModule / TestName');
      return { ok, details: ok ? '' : 'Log entry not found' };
    }
  },
  {
    name: 'LogWriter: getLogsContent returns string',
    run: async () => {
      const content = await getLogsContent();
      const ok = typeof content === 'string';
      return { ok, details: ok ? '' : 'getLogsContent did not return string' };
    }
  },
  {
    name: 'LogWriter: clearLogsFile removes logs',
    run: async () => {
      await appendTestFailLog('ClearTest', 'Clear', 'data');
      await clearLogsFile();
      const content = await getLogsContent();
      const ok = !content || content.trim() === '';
      return { ok, details: ok ? '' : 'Clear failed – logs still present' };
    }
  }
];

export async function runLogWriterTests() {
  return runTests('LogWriter', tests);
}