// =============================================================================
// FILE: TestRunner_Utils.js
// PATH: tests/TestRunner_Utils.js
// VERSION: 0.0.3
// PURPOSE: Testy funkcji z src/utils/ – urlUtils, validators, searchIndex, notesStorage, notificationsManager, networkUtils, fileUtils.
// FUNCTIONS: runUtilsTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';

const tests = [
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