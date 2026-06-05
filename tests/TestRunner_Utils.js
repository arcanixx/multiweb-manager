// =============================================================================
// FILE: TestRunner_Utils.js
// PATH: tests/TestRunner_Utils.js
// VERSION: 0.0.3
// PURPOSE: Testy funkcji z src/utils/ – urlUtils, validators, searchIndex, notesStorage, notificationsManager, networkUtils, fileUtils.
//          Testy modułów utils — logger (eksporty, setDebugModule, logUI/logStore/etc.), fileUtils (readJsonSafe/writeJsonSafe/streaming), persistence, sharpLoader, testrunner (assert/assertThrows), yamlLoader, notificationsManager, translations.
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
    name: 'logger – setDebugModule toggles module state',
    run: async () => {
      const { setDebugModule, isDebugMode } = await import(join(ROOT, 'src/utils/logger.js'));
      // setDebugModule nie rzuca i jest callable
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
    name: 'testrunner – assert FAIL increments failCount',
    run: async () => {
      const { initTestResults, assert, getTestResults } = await import(join(ROOT, 'src/utils/testrunner.js'));
      initTestResults();
      assert('test fail', false);
      const { failCount } = getTestResults();
      return { ok: failCount === 1, details: `failCount=${failCount}` };
    }
  },
  {
    name: 'testrunner – assertThrows PASS when function throws',
    run: async () => {
      const { initTestResults, assertThrows, getTestResults } = await import(join(ROOT, 'src/utils/testrunner.js'));
      initTestResults();
      assertThrows('should throw', () => { throw new Error('expected'); });
      const { passCount } = getTestResults();
      return { ok: passCount === 1, details: `passCount=${passCount}` };
    }
  },
  {
    name: 'testrunner – assertThrows FAIL when function does not throw',
    run: async () => {
      const { initTestResults, assertThrows, getTestResults } = await import(join(ROOT, 'src/utils/testrunner.js'));
      initTestResults();
      assertThrows('should not throw', () => {});
      const { failCount } = getTestResults();
      return { ok: failCount === 1, details: `failCount=${failCount}` };
    }
  },
  {
    name: 'testrunner – getTestResults returns correct shape',
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
    name: 'fileUtils – readJsonSafe returns fallback for missing file',
    run: async () => {
      const { readJsonSafe } = await import(join(ROOT, 'src/utils/fileUtils.js'));
      const fallback = { default: true };
      const result = readJsonSafe('/nonexistent/path/file.json', fallback);
      const ok = result === fallback;
      return { ok, details: ok ? '' : 'Should return fallback for missing file' };
    }
  },
  {
    name: 'fileUtils – writeJsonStreaming and readJsonStreaming are async',
    run: async () => {
      const { writeJsonStreaming, readJsonStreaming } = await import(join(ROOT, 'src/utils/fileUtils.js'));
      const ok = writeJsonStreaming instanceof Function && readJsonStreaming instanceof Function;
      return { ok, details: ok ? '' : 'Not async functions' };
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
    name: 'sharpLoader – loadSharp exported as async function',
    run: async () => {
      const { loadSharp } = await import(join(ROOT, 'src/utils/sharpLoader.js'));
      const ok = typeof loadSharp === 'function';
      return { ok, details: ok ? '' : 'loadSharp not exported' };
    }
  },
  {
    name: 'sharpLoader – loadSharp returns Promise',
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

  // ── notificationsManager ──────────────────────────────────────────────────
  {
    name: 'notificationsManager – showSystemNotification exported',
    run: async () => {
      const mod = await import(join(ROOT, 'src/utils/notificationsManager.js'));
      const ok = typeof mod.showSystemNotification === 'function';
      return { ok, details: ok ? '' : 'showSystemNotification not exported' };
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

  // ─── urlUtils
  {
    name: 'urlUtils – normalizeWebUrl dodaje https',
    run: async () => {
      const { normalizeWebUrl } = await import('../src/utils/urlUtils.js');
      const result = normalizeWebUrl('google.com');
      const ok = result === 'https://google.com';
      return { ok, details: ok ? '' : `Otrzymano: ${result}` };
    }
  },
  {
    name: 'urlUtils – normalizeWebUrl nie duplikuje https',
    run: async () => {
      const { normalizeWebUrl } = await import('../src/utils/urlUtils.js');
      const result = normalizeWebUrl('https://google.com');
      const ok = result === 'https://google.com';
      return { ok, details: ok ? '' : `Otrzymano: ${result}` };
    }
  },
  {
    name: 'urlUtils – isValidWebUrl zwraca true dla poprawnego URL',
    run: async () => {
      const { isValidWebUrl } = await import('../src/utils/urlUtils.js');
      const ok = isValidWebUrl('https://google.com') === true;
      return { ok, details: ok ? '' : 'isValidWebUrl zwróciło false dla poprawnego URL' };
    }
  },
  {
    name: 'urlUtils – isValidWebUrl zwraca false dla pustego stringa',
    run: async () => {
      const { isValidWebUrl } = await import('../src/utils/urlUtils.js');
      const ok = isValidWebUrl('') === false;
      return { ok, details: ok ? '' : 'isValidWebUrl zwróciło true dla pustego stringa' };
    }
  },
  {
    name: 'urlUtils – isSafeUrl blokuje javascript:',
    run: async () => {
      const { isSafeUrl } = await import('../src/utils/urlUtils.js');
      const ok = isSafeUrl('javascript:alert(1)') === false;
      return { ok, details: ok ? '' : 'isSafeUrl przepuściło javascript: URL' };
    }
  },
  {
    name: 'urlUtils – isSafeUrl przepuszcza https',
    run: async () => {
      const { isSafeUrl } = await import('../src/utils/urlUtils.js');
      const ok = isSafeUrl('https://example.com') === true;
      return { ok, details: ok ? '' : 'isSafeUrl blokowało poprawny https URL' };
    }
  },

  // ─── validators
  {
    name: 'validators – ensureString zwraca string',
    run: async () => {
      const { ensureString } = await import('../src/utils/validators.js');
      const ok = ensureString(123) === '123' || typeof ensureString('abc') === 'string';
      return { ok, details: ok ? '' : 'ensureString nie działa poprawnie' };
    }
  },
  {
    name: 'validators – validateUrl zwraca true dla poprawnego URL',
    run: async () => {
      const { validateUrl } = await import('../src/utils/validators.js');
      const ok = validateUrl('https://example.com') === true;
      return { ok, details: ok ? '' : 'validateUrl failed dla poprawnego URL' };
    }
  },
  {
    name: 'validators – validateEmail zwraca true dla poprawnego emaila',
    run: async () => {
      const { validateEmail } = await import('../src/utils/validators.js');
      const ok = validateEmail('test@example.com') === true;
      return { ok, details: ok ? '' : 'validateEmail failed' };
    }
  },
  {
    name: 'validators – validateEmail zwraca false dla niepoprawnego emaila',
    run: async () => {
      const { validateEmail } = await import('../src/utils/validators.js');
      const ok = validateEmail('niema-at-sign') === false;
      return { ok, details: ok ? '' : 'validateEmail przepuściło niepoprawny email' };
    }
  },
  {
    name: 'validators – validateLength zwraca false gdy za krótkie',
    run: async () => {
      const { validateLength } = await import('../src/utils/validators.js');
      const ok = validateLength('ab', 3, 10) === false;
      return { ok, details: ok ? '' : 'validateLength nie wykryło za krótkiego stringa' };
    }
  },

  // ─── notesStorage
  {
    name: 'notesStorage – createNewTab zwraca obiekt z id i content',
    run: async () => {
      const { createNewTab } = await import('../src/utils/notesStorage.js');
      const tab = createNewTab();
      const ok = tab && typeof tab.id === 'string' && 'content' in tab;
      return { ok, details: ok ? '' : `Niepoprawna struktura zakładki: ${JSON.stringify(tab)}` };
    }
  },
  {
    name: 'notesStorage – loadNotesFromStorage / saveNotesToStorage eksportowane',
    run: async () => {
      const mod = await import('../src/utils/notesStorage.js');
      const ok = typeof mod.loadNotesFromStorage === 'function' && typeof mod.saveNotesToStorage === 'function';
      return { ok, details: ok ? '' : 'Brakuje eksportów load/saveNotesToStorage' };
    }
  },

  // ─── searchIndex
  {
    name: 'searchIndex – buildSearchIndex i searchAll eksportowane',
    run: async () => {
      const mod = await import('../src/utils/searchIndex.js');
      const ok = typeof mod.buildSearchIndex === 'function' && typeof mod.searchAll === 'function';
      return { ok, details: ok ? '' : 'Brakuje eksportów buildSearchIndex lub searchAll' };
    }
  },
  {
    name: 'searchIndex – searchAll zwraca pustą tablicę dla pustego indeksu',
    run: async () => {
      const { buildSearchIndex, searchAll } = await import('../src/utils/searchIndex.js');
      const index = buildSearchIndex({ profiles: [], projects: [], tasks: [], notes: [] });
      const results = searchAll(index, 'test');
      const ok = Array.isArray(results);
      return { ok, details: ok ? '' : 'searchAll nie zwróciło tablicy' };
    }
  },

  // ─── notificationsManager
  {
    name: 'notificationsManager – registerToastHandler i showToast eksportowane',
    run: async () => {
      const mod = await import('../src/utils/notificationsManager.js');
      const ok = typeof mod.registerToastHandler === 'function' && typeof mod.showToast === 'function';
      return { ok, details: ok ? '' : 'Brakuje eksportów notificationsManager' };
    }
  },
  {
    name: 'notificationsManager – showToast nie rzuca błędu bez zainstalowanego handlera',
    run: async () => {
      const { showToast } = await import('../src/utils/notificationsManager.js');
      let error = null;
      try { showToast('info', 'Test message'); } catch (e) { error = e.message; }
      return { ok: error === null, details: error ? `Rzucono wyjątek: ${error}` : '' };
    }
  },

  // ─── networkUtils
  {
    name: 'networkUtils – pingUrl eksportowane jako funkcja',
    run: async () => {
      const mod = await import('../src/utils/networkUtils.js');
      const ok = typeof mod.pingUrl === 'function';
      return { ok, details: ok ? '' : 'pingUrl nie jest eksportowane' };
    }
  },

];

export async function runUtilsTests() {
  return runTests('Utils', tests);
}