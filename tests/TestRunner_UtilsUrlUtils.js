// =============================================================================
// FILE: TestRunner_UtilsUrlUtils.js
// PATH: tests/TestRunner_UtilsUrlUtils.js
// VERSION: 0.0.3
// PURPOSE: Testy modułu urlUtils (normalizeWebUrl, isValidWebUrl, isSafeUrl) — walidacja URL, blokowanie niebezpiecznych schematów, edge cases.
// FUNCTIONS: runUrlUtilsTests
// DEPENDS ON: testUtils.js, path
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests, safeImport } from './testUtils.js';
import { join } from 'path';
const ROOT = process.cwd();

const tests = [
  // ── exports ────────────────────────────────────────────────────────────────
  {
    name: 'urlUtils – all functions exported',
    run: async () => {
      const mod = await safeImport('src/utils/urlUtils.js');
      const required = ['normalizeWebUrl', 'isValidWebUrl', 'isSafeUrl'];
      const missing = required.filter(fn => typeof mod[fn] !== 'function');
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },

  // ── normalizeWebUrl ────────────────────────────────────────────────────────
  {
    name: 'normalizeWebUrl – adds https to bare domain',
    run: async () => {
      const { normalizeWebUrl } = await safeImport('src/utils/urlUtils.js');
      const result = normalizeWebUrl('deepseek.com');
      return { ok: result === 'https://deepseek.com/', details: `Got: ${result}` };
    }
  },
  {
    name: 'normalizeWebUrl – preserves existing https',
    run: async () => {
      const { normalizeWebUrl } = await safeImport('src/utils/urlUtils.js');
      const result = normalizeWebUrl('https://claude.ai');
      return { ok: result === 'https://claude.ai/', details: `Got: ${result}` };
    }
  },
  {
    name: 'normalizeWebUrl – preserves http protocol',
    run: async () => {
      const { normalizeWebUrl } = await safeImport('src/utils/urlUtils.js');
      const result = normalizeWebUrl('http://localhost:3000');
      return { ok: result === 'http://localhost:3000/', details: `Got: ${result}` };
    }
  },
  {
    name: 'normalizeWebUrl – null input returns null',
    run: async () => {
      const { normalizeWebUrl } = await safeImport('src/utils/urlUtils.js');
      return { ok: normalizeWebUrl(null) === null, details: 'Expected null' };
    }
  },
  {
    name: 'normalizeWebUrl – empty string returns null',
    run: async () => {
      const { normalizeWebUrl } = await safeImport('src/utils/urlUtils.js');
      return { ok: normalizeWebUrl('') === null, details: 'Expected null for empty string' };
    }
  },
  {
    name: 'normalizeWebUrl – single word without dot returns null',
    run: async () => {
      const { normalizeWebUrl } = await safeImport('src/utils/urlUtils.js');
      const result = normalizeWebUrl('notadomain');
      return { ok: result === null, details: `Got: ${result}` };
    }
  },
  {
    name: 'normalizeWebUrl – IP address accepted',
    run: async () => {
      const { normalizeWebUrl } = await safeImport('src/utils/urlUtils.js');
      const result = normalizeWebUrl('192.168.1.1');
      return { ok: result !== null && result.includes('192.168.1.1'), details: `Got: ${result}` };
    }
  },
  {
    name: 'normalizeWebUrl – trims whitespace',
    run: async () => {
      const { normalizeWebUrl } = await safeImport('src/utils/urlUtils.js');
      const result = normalizeWebUrl('  https://claude.ai  ');
      return { ok: result === 'https://claude.ai/', details: `Got: ${result}` };
    }
  },

  // ── isSafeUrl ─────────────────────────────────────────────────────────────
  {
    name: 'isSafeUrl – blocks javascript: scheme',
    run: async () => {
      const { isSafeUrl } = await safeImport('src/utils/urlUtils.js');
      return { ok: isSafeUrl('javascript:alert(1)') === false, details: 'javascript: should be blocked' };
    }
  },
  {
    name: 'isSafeUrl – blocks data: scheme',
    run: async () => {
      const { isSafeUrl } = await safeImport('src/utils/urlUtils.js');
      return { ok: isSafeUrl('data:text/html,<h1>x</h1>') === false, details: 'data: should be blocked' };
    }
  },
  {
    name: 'isSafeUrl – blocks file: scheme',
    run: async () => {
      const { isSafeUrl } = await safeImport('src/utils/urlUtils.js');
      return { ok: isSafeUrl('file:///etc/passwd') === false, details: 'file: should be blocked' };
    }
  },
  {
    name: 'isSafeUrl – blocks vbscript: scheme',
    run: async () => {
      const { isSafeUrl } = await safeImport('src/utils/urlUtils.js');
      return { ok: isSafeUrl('vbscript:msgbox(1)') === false, details: 'vbscript: should be blocked' };
    }
  },
  {
    name: 'isSafeUrl – allows https URL',
    run: async () => {
      const { isSafeUrl } = await safeImport('src/utils/urlUtils.js');
      return { ok: isSafeUrl('https://claude.ai') === true, details: 'https should be allowed' };
    }
  },
  {
    name: 'isSafeUrl – empty string returns false',
    run: async () => {
      const { isSafeUrl } = await safeImport('src/utils/urlUtils.js');
      return { ok: isSafeUrl('') === false, details: 'empty string should return false' };
    }
  },

  // ── isValidWebUrl ──────────────────────────────────────────────────────────
  {
    name: 'isValidWebUrl – valid URL returns true',
    run: async () => {
      const { isValidWebUrl } = await safeImport('src/utils/urlUtils.js');
      return { ok: isValidWebUrl('https://github.com') === true, details: 'Valid URL should return true' };
    }
  },
  {
    name: 'isValidWebUrl – javascript: URL returns false',
    run: async () => {
      const { isValidWebUrl } = await safeImport('src/utils/urlUtils.js');
      return { ok: isValidWebUrl('javascript:void(0)') === false, details: 'javascript: should be invalid' };
    }
  },
  {
    name: 'isValidWebUrl – null returns false',
    run: async () => {
      const { isValidWebUrl } = await safeImport('src/utils/urlUtils.js');
      return { ok: isValidWebUrl(null) === false, details: 'null should return false' };
    }
  }
];

export async function runUrlUtilsTests() {
  return runTests('UrlUtils', tests);
}