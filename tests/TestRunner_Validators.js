// =============================================================================
// FILE: TestRunner_Validators.js
// PATH: tests/TestRunner_Validators.js
// VERSION: 0.0.3
// PURPOSE: Testy modułu validators — ensureString, ensureObject, validateUrl, validateEmail, validateLength, validateNoSpecialChars, validatePassword, validatePhone.
// FUNCTIONS: runValidatorsTests
// DEPENDS ON: testUtils.js, path
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
import { join } from 'path';
const ROOT = process.cwd();
const tests = [
  // ── exports ────────────────────────────────────────────────────────────────
  {
    name: 'validators – all functions exported',
    run: async () => {
      const mod = await import(join(ROOT, 'src/utils/validators.js'));
      const required = ['ensureString', 'ensureObject', 'validateUrl', 'validateEmail',
        'validateLength', 'validateNoSpecialChars', 'validatePassword', 'validatePhone'];
      const missing = required.filter(fn => typeof mod[fn] !== 'function');
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },

  // ── ensureString ───────────────────────────────────────────────────────────
  {
    name: 'ensureString – valid string passes',
    run: async () => {
      const { ensureString } = await import(join(ROOT, 'src/utils/validators.js'));
      let threw = false;
      try { ensureString('hello', 'field'); } catch { threw = true; }
      return { ok: !threw, details: threw ? 'Should not throw for valid string' : '' };
    }
  },
  {
    name: 'ensureString – empty string throws',
    run: async () => {
      const { ensureString } = await import(join(ROOT, 'src/utils/validators.js'));
      let threw = false;
      try { ensureString('', 'field'); } catch { threw = true; }
      return { ok: threw, details: threw ? '' : 'Should throw for empty string' };
    }
  },
  {
    name: 'ensureString – number throws',
    run: async () => {
      const { ensureString } = await import(join(ROOT, 'src/utils/validators.js'));
      let threw = false;
      try { ensureString(123, 'field'); } catch { threw = true; }
      return { ok: threw, details: threw ? '' : 'Should throw for number' };
    }
  },
  {
    name: 'ensureString – whitespace-only throws',
    run: async () => {
      const { ensureString } = await import(join(ROOT, 'src/utils/validators.js'));
      let threw = false;
      try { ensureString('   ', 'field'); } catch { threw = true; }
      return { ok: threw, details: threw ? '' : 'Should throw for whitespace-only' };
    }
  },

  // ── ensureObject ──────────────────────────────────────────────────────────
  {
    name: 'ensureObject – valid object passes',
    run: async () => {
      const { ensureObject } = await import(join(ROOT, 'src/utils/validators.js'));
      let threw = false;
      try { ensureObject({ id: 1 }, 'obj'); } catch { threw = true; }
      return { ok: !threw, details: threw ? 'Should not throw for valid object' : '' };
    }
  },
  {
    name: 'ensureObject – null throws',
    run: async () => {
      const { ensureObject } = await import(join(ROOT, 'src/utils/validators.js'));
      let threw = false;
      try { ensureObject(null, 'obj'); } catch { threw = true; }
      return { ok: threw, details: threw ? '' : 'Should throw for null' };
    }
  },
  {
    name: 'ensureObject – string throws',
    run: async () => {
      const { ensureObject } = await import(join(ROOT, 'src/utils/validators.js'));
      let threw = false;
      try { ensureObject('string', 'obj'); } catch { threw = true; }
      return { ok: threw, details: threw ? '' : 'Should throw for string' };
    }
  },

  // ── validateUrl ───────────────────────────────────────────────────────────
  {
    name: 'validateUrl – valid https URL returns {valid:true}',
    run: async () => {
      const { validateUrl } = await import(join(ROOT, 'src/utils/validators.js'));
      const r = validateUrl('https://example.com');
      return { ok: r.valid === true, details: JSON.stringify(r) };
    }
  },
  {
    name: 'validateUrl – ftp: protocol returns {valid:false}',
    run: async () => {
      const { validateUrl } = await import(join(ROOT, 'src/utils/validators.js'));
      const r = validateUrl('ftp://example.com');
      return { ok: r.valid === false && r.error === 'URL_PROTOCOL_INVALID', details: JSON.stringify(r) };
    }
  },
  {
    name: 'validateUrl – garbage string returns {valid:false}',
    run: async () => {
      const { validateUrl } = await import(join(ROOT, 'src/utils/validators.js'));
      const r = validateUrl('not a url');
      return { ok: r.valid === false, details: JSON.stringify(r) };
    }
  },

  // ── validateEmail ─────────────────────────────────────────────────────────
  {
    name: 'validateEmail – valid email returns {valid:true}',
    run: async () => {
      const { validateEmail } = await import(join(ROOT, 'src/utils/validators.js'));
      const r = validateEmail('user@example.com');
      return { ok: r.valid === true, details: JSON.stringify(r) };
    }
  },
  {
    name: 'validateEmail – missing @ returns {valid:false}',
    run: async () => {
      const { validateEmail } = await import(join(ROOT, 'src/utils/validators.js'));
      const r = validateEmail('notanemail');
      return { ok: r.valid === false && r.error === 'EMAIL_INVALID', details: JSON.stringify(r) };
    }
  },

  // ── validateLength ────────────────────────────────────────────────────────
  {
    name: 'validateLength – value within range returns {valid:true}',
    run: async () => {
      const { validateLength } = await import(join(ROOT, 'src/utils/validators.js'));
      return { ok: validateLength('hello', 1, 10).valid === true, details: '' };
    }
  },
  {
    name: 'validateLength – too short returns VALUE_TOO_SHORT',
    run: async () => {
      const { validateLength } = await import(join(ROOT, 'src/utils/validators.js'));
      const r = validateLength('hi', 5, 10);
      return { ok: r.valid === false && r.error === 'VALUE_TOO_SHORT', details: JSON.stringify(r) };
    }
  },
  {
    name: 'validateLength – too long returns VALUE_TOO_LONG',
    run: async () => {
      const { validateLength } = await import(join(ROOT, 'src/utils/validators.js'));
      const r = validateLength('a'.repeat(300), 1, 255);
      return { ok: r.valid === false && r.error === 'VALUE_TOO_LONG', details: JSON.stringify(r) };
    }
  },

  // ── validateNoSpecialChars ─────────────────────────────────────────────────
  {
    name: 'validateNoSpecialChars – clean string passes',
    run: async () => {
      const { validateNoSpecialChars } = await import(join(ROOT, 'src/utils/validators.js'));
      return { ok: validateNoSpecialChars('Project Alpha 2024').valid === true, details: '' };
    }
  },
  {
    name: 'validateNoSpecialChars – < > " chars blocked',
    run: async () => {
      const { validateNoSpecialChars } = await import(join(ROOT, 'src/utils/validators.js'));
      const r = validateNoSpecialChars('<script>');
      return { ok: r.valid === false && r.error === 'SPECIAL_CHARS_FORBIDDEN', details: JSON.stringify(r) };
    }
  },

  // ── validatePassword ──────────────────────────────────────────────────────
  {
    name: 'validatePassword – strong password passes',
    run: async () => {
      const { validatePassword } = await import(join(ROOT, 'src/utils/validators.js'));
      return { ok: validatePassword('Strong1!Pass').valid === true, details: '' };
    }
  },
  {
    name: 'validatePassword – too short returns PASSWORD_TOO_SHORT',
    run: async () => {
      const { validatePassword } = await import(join(ROOT, 'src/utils/validators.js'));
      const r = validatePassword('Ab1!');
      return { ok: r.valid === false && r.error === 'PASSWORD_TOO_SHORT', details: JSON.stringify(r) };
    }
  },
  {
    name: 'validatePassword – no uppercase returns PASSWORD_NO_UPPERCASE',
    run: async () => {
      const { validatePassword } = await import(join(ROOT, 'src/utils/validators.js'));
      const r = validatePassword('password1!');
      return { ok: r.valid === false && r.error === 'PASSWORD_NO_UPPERCASE', details: JSON.stringify(r) };
    }
  }
];

export async function runValidatorsTests() {
  return runTests('Validators', tests);
}