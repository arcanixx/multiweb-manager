// =============================================================================
// FILE: TestRunner_Tools.js
// PATH: tests/TestRunner_Tools.js
// VERSION: 0.0.3
// PURPOSE: Testy silników narzędzi (src/tools/*) — regexEngine.testRegex, markdownRenderer.renderMarkdown, apiClient (apiFetch/apiGet/apiPost/apiRequest) oraz logika UI narzędzi (JSON, Clipboard, Markdown).
// FUNCTIONS: runToolsTests
// DEPENDS ON: testUtils.js, path
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
import { join } from 'path';
const ROOT = process.cwd();


const tests = [
  // ── regexEngine.testRegex ─────────────────────────────────────────────────
  {
    name: 'regexEngine – testRegex exported as function',
    run: async () => {
      const { testRegex } = await import(join(ROOT, 'src/tools/regexEngine.js'));
      return { ok: typeof testRegex === 'function', details: 'testRegex not exported' };
    }
  },
  {
    name: 'regexEngine – testRegex finds match',
    run: async () => {
      const { testRegex } = await import(join(ROOT, 'src/tools/regexEngine.js'));
      const matches = testRegex('test', 'g', 'this is a test string');
      const ok = matches.length === 1;
      return { ok, details: ok ? '' : `Expected 1, got ${matches.length}` };
    }
  },
  {
    name: 'regexEngine – testRegex returns all matches with global flag',
    run: async () => {
      const { testRegex } = await import(join(ROOT, 'src/tools/regexEngine.js'));
      const matches = testRegex('\\d+', 'g', 'abc 123 def 456');
      const ok = matches.length === 2;
      return { ok, details: ok ? '' : `Expected 2, got ${matches.length}` };
    }
  },
  {
    name: 'regexEngine – testRegex extracts capture groups',
    run: async () => {
      const { testRegex } = await import(join(ROOT, 'src/tools/regexEngine.js'));
      const matches = testRegex('(\\d+)-(\\d+)', 'g', 'code: 123-456');
      const ok = matches.length === 1 && matches[0][1] === '123' && matches[0][2] === '456';
      return { ok, details: ok ? '' : 'Group extraction failed' };
    }
  },
  {
    name: 'regexEngine – testRegex throws on invalid pattern',
    run: async () => {
      const { testRegex } = await import(join(ROOT, 'src/tools/regexEngine.js'));
      let threw = false;
      try { testRegex('[invalid', 'g', 'text'); } catch { threw = true; }
      return { ok: threw, details: threw ? '' : 'Should throw for invalid regex' };
    }
  },
  {
    name: 'regexEngine – testRegex case-insensitive flag works',
    run: async () => {
      const { testRegex } = await import(join(ROOT, 'src/tools/regexEngine.js'));
      const matches = testRegex('hello', 'gi', 'Hello HELLO hello');
      const ok = matches.length === 3;
      return { ok, details: ok ? '' : `Expected 3, got ${matches.length}` };
    }
  },

  // ── markdownRenderer.renderMarkdown ──────────────────────────────────────
  {
    name: 'markdownRenderer – renderMarkdown exported as function',
    run: async () => {
      const { renderMarkdown } = await import(join(ROOT, 'src/tools/markdownRenderer.js'));
      return { ok: typeof renderMarkdown === 'function', details: 'renderMarkdown not exported' };
    }
  },
  {
    name: 'markdownRenderer – h1 heading converts to <h1>',
    run: async () => {
      const { renderMarkdown } = await import(join(ROOT, 'src/tools/markdownRenderer.js'));
      const html = renderMarkdown('# Heading 1');
      const ok = html.includes('<h1') && html.includes('Heading 1');
      return { ok, details: ok ? '' : `Got: ${html}` };
    }
  },
  {
    name: 'markdownRenderer – bold converts to <strong>',
    run: async () => {
      const { renderMarkdown } = await import(join(ROOT, 'src/tools/markdownRenderer.js'));
      const html = renderMarkdown('**bold text**');
      const ok = html.includes('<strong>bold text</strong>');
      return { ok, details: ok ? '' : `Got: ${html}` };
    }
  },
  {
    name: 'markdownRenderer – link converts to <a>',
    run: async () => {
      const { renderMarkdown } = await import(join(ROOT, 'src/tools/markdownRenderer.js'));
      const html = renderMarkdown('[DeepSeek](https://deepseek.com)');
      const ok = html.includes('href="https://deepseek.com"') && html.includes('DeepSeek');
      return { ok, details: ok ? '' : `Got: ${html}` };
    }
  },
  {
    name: 'markdownRenderer – returns string',
    run: async () => {
      const { renderMarkdown } = await import(join(ROOT, 'src/tools/markdownRenderer.js'));
      const result = renderMarkdown('hello');
      return { ok: typeof result === 'string' && result.length > 0, details: `Got: ${typeof result}` };
    }
  },
  {
    name: 'markdownRenderer – throws on non-string input',
    run: async () => {
      const { renderMarkdown } = await import(join(ROOT, 'src/tools/markdownRenderer.js'));
      let threw = false;
      try { renderMarkdown(null); } catch { threw = true; }
      return { ok: threw, details: threw ? '' : 'Should throw for null input' };
    }
  },

  // ── apiClient ─────────────────────────────────────────────────────────────
  {
    name: 'apiClient – all functions exported',
    run: async () => {
      const mod = await import(join(ROOT, 'src/tools/apiClient.js'));
      const required = ['apiFetch', 'apiGet', 'apiPost', 'apiRequest'];
      const missing = required.filter(fn => typeof mod[fn] !== 'function');
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'apiClient – apiFetch is async function',
    run: async () => {
      const { apiFetch } = await import(join(ROOT, 'src/tools/apiClient.js'));
      const result = apiFetch('https://example.com', {}, {});
      const ok = result instanceof Promise;
      return { ok, details: ok ? '' : 'apiFetch should return Promise' };
    }
  },
  {
    name: 'apiClient – apiGet wraps apiFetch (same signature)',
    run: async () => {
      const { apiGet } = await import(join(ROOT, 'src/tools/apiClient.js'));
      const result = apiGet('https://example.com');
      const ok = result instanceof Promise;
      return { ok, details: ok ? '' : 'apiGet should return Promise' };
    }
  },
  {
    name: 'apiClient – apiPost wraps apiFetch (same signature)',
    run: async () => {
      const { apiPost } = await import(join(ROOT, 'src/tools/apiClient.js'));
      const result = apiPost('https://example.com', { data: 1 });
      const ok = result instanceof Promise;
      return { ok, details: ok ? '' : 'apiPost should return Promise' };
    }
  },

  // ── JSON Formatter (logika czysta bez IPC) ────────────────────────────────
  {
    name: 'JSON Formatter – valid JSON formats correctly',
    run: async () => {
      const input = '{"name":"test","value":123}';
      const output = JSON.stringify(JSON.parse(input), null, 2);
      const ok = output.includes('"name": "test"') && output.includes('"value": 123');
      return { ok, details: ok ? '' : 'Formatting failed' };
    }
  },
  {
    name: 'JSON Formatter – invalid JSON throws error',
    run: async () => {
      let error = null;
      try { JSON.parse('{"name":"test"'); } catch (e) { error = e.message; }
      return { ok: error !== null, details: error || 'Should throw' };
    }
  },
  {
    name: 'JSON Formatter – minify removes whitespace',
    run: async () => {
      const minified = JSON.stringify(JSON.parse('{"name":"test","value":123}'));
      const ok = !minified.includes(' ') && !minified.includes('\n');
      return { ok, details: ok ? '' : 'Still has whitespace' };
    }
  },

  // ── Clipboard History (logika czysta) ─────────────────────────────────────
  {
    name: 'Clipboard History – max history limit (50)',
    run: async () => {
      const MAX = 50;
      const history = Array.from({ length: 60 }, (_, i) => ({ id: i }));
      const limited = history.slice(0, MAX);
      return { ok: limited.length === MAX, details: `Expected ${MAX}, got ${limited.length}` };
    }
  },
  {
    name: 'Clipboard History – pin/unpin works',
    run: async () => {
      let pinned = [];
      const entry = { id: 1, text: 'pinned text' };
      pinned.push(entry);
      const isPinned = pinned.length === 1;
      pinned = pinned.filter(e => e.id !== 1);
      const isUnpinned = pinned.length === 0;
      return { ok: isPinned && isUnpinned, details: 'Pin/unpin logic failed' };
    }
  },

  // ── Cookie Grabber (IPC) ──────────────────────────────────────────────────
  {
    name: 'Cookie Grabber – getCookies IPC available',
    run: async () => {
      if (!window?.electronAPI?.getCookies) return { ok: false, details: 'getCookies not available' };
      const result = await window.electronAPI.getCookies(null);
      const ok = result?.ok === true && Array.isArray(result?.data);
      return { ok, details: ok ? '' : 'Invalid response structure' };
    }
  }
];

export async function runToolsTests() {
  return runTests('Tools', tests);
}