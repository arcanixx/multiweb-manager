// =============================================================================
// FILE: TestRunner_Utils.js
// PATH: tests/TestRunner_Utils.js
// VERSION: 0.0.3
// PURPOSE: Testy modułów utils bez osobnych plików testowych: logger, testrunner, fileUtils, persistence, sharpLoader, yamlLoader, translations, networkUtils, imageUtils, notepadStorage.
//          Moduły urlUtils, validators, searchIndex, notificationsManager mają własne dedykowane pliki TestRunner_*.js i nie są tutaj duplikowane.
// FUNCTIONS: runUtilsTests
// DEPENDS ON: testUtils.js, path
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
import { join } from 'path'; 
const ROOT = process.cwd();


const tests = [

  // ── logger – eksporty i moduły ────────────────────────────────────────────
  {
    name: 'logger – all core functions exported',
    run: async () => {
      const mod = await import(join(ROOT, 'src/utils/logger.js'));
      const required = ['initLogger', 'setDebugModule', 'isDebugMode', 'logDebug',
        'logInfo', 'logWarn', 'logError'];
      const missing = required.filter(fn => typeof mod[fn] !== 'function');
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'logger – module-specific aliases exported (logUI, logStore, logIPC…)',
    run: async () => {
      const mod = await import(join(ROOT, 'src/utils/logger.js'));
      const aliases = ['logUI', 'logWebview', 'logTerminal', 'logTasks',
        'logTools', 'logSettings', 'logEngine', 'logStore', 'logIPC'];
      const missing = aliases.filter(fn => typeof mod[fn] !== 'function');
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'logger – setDebugModule toggles without throwing',
    run: async () => {
      const { setDebugModule } = await import(join(ROOT, 'src/utils/logger.js'));
      let threw = false;
      try { setDebugModule('ui', true); setDebugModule('ui', false); } catch { threw = true; }
      return { ok: !threw, details: threw ? 'setDebugModule threw' : '' };
    }
  },
  {
    name: 'logger – getLogFilePath exported as function',
    run: async () => {
      const mod = await import(join(ROOT, 'src/utils/logger.js'));
      const ok = typeof mod.getLogFilePath === 'function';
      return { ok, details: ok ? '' : 'getLogFilePath not exported' };
    }
  },

  // ── testrunner – assert / assertThrows ────────────────────────────────────
  {
    name: 'testrunner – all functions exported',
    run: async () => {
      const mod = await import(join(ROOT, 'src/utils/testrunner.js'));
      const required = ['initTestResults', 'assert', 'assertThrows', 'getTestResults', 'logTestSummary'];
      const missing = required.filter(fn => typeof mod[fn] !== 'function');
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'testrunner – initTestResults resets counters',
    run: async () => {
      const { initTestResults, assert, getTestResults } = await import(join(ROOT, 'src/utils/testrunner.js'));
      initTestResults();
      assert('dummy', true);
      initTestResults();
      const { passCount, failCount } = getTestResults();
      const ok = passCount === 0 && failCount === 0;
      return { ok, details: ok ? '' : `pass=${passCount}, fail=${failCount}` };
    }
  },
  {
    name: 'testrunner – assert PASS increments passCount',
    run: async () => {
      const { initTestResults, assert, getTestResults } = await import(join(ROOT, 'src/utils/testrunner.js'));
      initTestResults();
      assert('test pass', true);
      const { passCount } = getTestResults();
      return { ok: passCount === 1, details: `passCount=${passCount}` };
    }
  },
  {
    name: 'testrunner – assert FAIL increments failCount (nie rzuca wyjątku)',
    run: async () => {
      const { initTestResults, assert, getTestResults } = await import(join(ROOT, 'src/utils/testrunner.js'));
      initTestResults();
      assert('test fail', false);
      const { failCount } = getTestResults();
      return { ok: failCount === 1, details: `failCount=${failCount}` };
    }
  },
  {
    name: 'testrunner – assertThrows PASS gdy funkcja rzuca',
    run: async () => {
      const { initTestResults, assertThrows, getTestResults } = await import(join(ROOT, 'src/utils/testrunner.js'));
      initTestResults();
      assertThrows('should throw', () => { throw new Error('expected'); });
      const { passCount } = getTestResults();
      return { ok: passCount === 1, details: `passCount=${passCount}` };
    }
  },
  {
    name: 'testrunner – assertThrows FAIL gdy funkcja nie rzuca',
    run: async () => {
      const { initTestResults, assertThrows, getTestResults } = await import(join(ROOT, 'src/utils/testrunner.js'));
      initTestResults();
      assertThrows('should not throw', () => {});
      const { failCount } = getTestResults();
      return { ok: failCount === 1, details: `failCount=${failCount}` };
    }
  },
  {
    name: 'testrunner – getTestResults zwraca { passCount, failCount, total, results }',
    run: async () => {
      const { initTestResults, assert, getTestResults } = await import(join(ROOT, 'src/utils/testrunner.js'));
      initTestResults();
      const r = getTestResults();
      const ok = 'passCount' in r && 'failCount' in r && 'total' in r && Array.isArray(r.results);
      return { ok, details: ok ? '' : `Shape: ${JSON.stringify(Object.keys(r))}` };
    }
  },

  // ── fileUtils ─────────────────────────────────────────────────────────────
  {
    name: 'fileUtils – all functions exported',
    run: async () => {
      const mod = await import(join(ROOT, 'src/utils/fileUtils.js'));
      const required = ['readJsonSafe', 'writeJsonSafe', 'writeJsonStreaming', 'readJsonStreaming'];
      const missing = required.filter(fn => typeof mod[fn] !== 'function');
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'fileUtils – readJsonSafe zwraca fallback dla nieistniejącego pliku',
    run: async () => {
      const { readJsonSafe } = await import(join(ROOT, 'src/utils/fileUtils.js'));
      const fallback = { default: true };
      const result = readJsonSafe('/nonexistent/path/file.json', fallback);
      const ok = result === fallback;
      return { ok, details: ok ? '' : 'Should return fallback for missing file' };
    }
  },
  {
    name: 'fileUtils – writeJsonStreaming i readJsonStreaming są funkcjami async',
    run: async () => {
      const { writeJsonStreaming, readJsonStreaming } = await import(join(ROOT, 'src/utils/fileUtils.js'));
      const ok = typeof writeJsonStreaming === 'function' && typeof readJsonStreaming === 'function';
      return { ok, details: ok ? '' : 'Not functions' };
    }
  },

  // ── persistence ───────────────────────────────────────────────────────────
  {
    name: 'persistence – getUserDataPath, readJsonFile, writeJsonFile exported',
    run: async () => {
      const mod = await import(join(ROOT, 'src/utils/persistence.js'));
      const required = ['getUserDataPath', 'readJsonFile', 'writeJsonFile'];
      const missing = required.filter(fn => typeof mod[fn] !== 'function');
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },

  // ── sharpLoader ───────────────────────────────────────────────────────────
  {
    name: 'sharpLoader – loadSharp exported as function',
    run: async () => {
      const { loadSharp } = await import(join(ROOT, 'src/utils/sharpLoader.js'));
      const ok = typeof loadSharp === 'function';
      return { ok, details: ok ? '' : 'loadSharp not exported' };
    }
  },
  {
    name: 'sharpLoader – loadSharp zwraca Promise',
    run: async () => {
      const { loadSharp } = await import(join(ROOT, 'src/utils/sharpLoader.js'));
      const result = loadSharp();
      const ok = result instanceof Promise;
      return { ok, details: ok ? '' : 'loadSharp should return Promise' };
    }
  },

  // ── yamlLoader ────────────────────────────────────────────────────────────
  {
    name: 'yamlLoader – loadYaml exported as function',
    run: async () => {
      const mod = await import(join(ROOT, 'src/utils/yamlLoader.js'));
      const ok = typeof mod.loadYaml === 'function';
      return { ok, details: ok ? '' : 'loadYaml not exported' };
    }
  },

  // ── translations ──────────────────────────────────────────────────────────
  {
    name: 'translations – TranslationProvider exported as function',
    run: async () => {
      const mod = await import(join(ROOT, 'src/utils/translations.js'));
      const ok = typeof mod.TranslationProvider === 'function';
      return { ok, details: ok ? '' : 'TranslationProvider not exported' };
    }
  },
  {
    name: 'translations – TranslationContext exported',
    run: async () => {
      const mod = await import(join(ROOT, 'src/utils/translations.js'));
      const ok = mod.TranslationContext !== undefined;
      return { ok, details: ok ? '' : 'TranslationContext not exported' };
    }
  },

  // ── networkUtils ──────────────────────────────────────────────────────────
  {
    name: 'networkUtils – pingUrl exported as function',
    run: async () => {
      const mod = await import(join(ROOT, 'src/utils/networkUtils.js'));
      const ok = typeof mod.pingUrl === 'function';
      return { ok, details: ok ? '' : 'pingUrl not exported' };
    }
  },

  // ── imageUtils ────────────────────────────────────────────────────────────
  {
    name: 'imageUtils – all functions exported (resizeImage, convertImage, compressJpeg)',
    run: async () => {
      const mod = await import(join(ROOT, 'src/utils/imageUtils.js'));
      const required = ['resizeImage', 'convertImage', 'compressJpeg'];
      const missing = required.filter(fn => typeof mod[fn] !== 'function');
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'imageUtils – resizeImage zwraca Promise (jest async)',
    run: async () => {
      const { resizeImage } = await import(join(ROOT, 'src/utils/imageUtils.js'));
      // Wywołanie z błędnymi ścieżkami – sprawdzamy że zwraca Promise (nie rzuca synchronicznie)
      let result;
      try { result = resizeImage('/nonexistent.jpg', 100, 100, '/out.jpg'); } catch { result = null; }
      const ok = result instanceof Promise;
      return { ok, details: ok ? '' : 'resizeImage should return Promise' };
    }
  },

  // ── notepadStorage ────────────────────────────────────────────────────────
  {
    name: 'notepadStorage – createNewTab, loadnotepadFromStorage, savenotepadToStorage exported',
    run: async () => {
      const mod = await import(join(ROOT, 'src/utils/notepadStorage.js'));
      const required = ['createNewTab', 'loadnotepadFromStorage', 'savenotepadToStorage'];
      const missing = required.filter(fn => typeof mod[fn] !== 'function');
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'notepadStorage – createNewTab zwraca obiekt z id i content',
    run: async () => {
      const { createNewTab } = await import(join(ROOT, 'src/utils/notepadStorage.js'));
      const tab = createNewTab();
      const ok = tab && typeof tab.id === 'string' && 'content' in tab;
      return { ok, details: ok ? '' : `Niepoprawna struktura zakładki: ${JSON.stringify(tab)}` };
    }
  },
  {
    name: 'notepadStorage – createNewTab z podanym id zachowuje id',
    run: async () => {
      const { createNewTab } = await import(join(ROOT, 'src/utils/notepadStorage.js'));
      const tab = createNewTab('my-id');
      const ok = tab && tab.id === 'my-id';
      return { ok, details: ok ? '' : `Expected id 'my-id', got ${tab?.id}` };
    }
  },

];

export async function runUtilsTests() {
  return runTests('Utils', tests);
}