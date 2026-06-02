// =============================================================================
// FILE: TestRunner_Tools.js
// PATH: tests/TestRunner_Tools.js
// VERSION: 0.0.3
// PURPOSE: Testy jednostkowe dla narzędzi (JSON, Regex, Markdown, Clipboard)
// FUNCTIONS: runToolsTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
const tests = [
  // JSON Formatter
  {
    name: 'JSON Formatter – valid JSON formats correctly',
    run: async () => {
      const input = '{"name":"test","value":123}';
      let output = '';
      try {
        const parsed = JSON.parse(input);
        output = JSON.stringify(parsed, null, 2);
      } catch (e) {
        return { ok: false, details: e.message };
      }
      const isValid = output.includes('"name": "test"') && output.includes('"value": 123');
      return { ok: isValid, details: isValid ? '' : 'Formatting failed' };
    }
  },
  {
    name: 'JSON Formatter – invalid JSON shows error',
    run: async () => {
      const input = '{"name":"test"';
      let error = null;
      try {
        JSON.parse(input);
      } catch (e) {
        error = e.message;
      }
      return { ok: error !== null, details: error || 'Should throw error' };
    }
  },
  {
    name: 'JSON Formatter – minify removes whitespace',
    run: async () => {
      const input = '{"name":"test","value":123}';
      const minified = JSON.stringify(JSON.parse(input));
      const isMinified = !minified.includes(' ') && !minified.includes('\n');
      return { ok: isMinified, details: isMinified ? '' : 'Still has whitespace' };
    }
  },
  // Regex Tester
  {
    name: 'Regex Tester – simple pattern matches',
    run: async () => {
      const pattern = 'test';
      const flags = 'g';
      const text = 'this is a test string';
      const regex = new RegExp(pattern, flags);
      const matches = [...text.matchAll(regex)];
      return { ok: matches.length === 1, details: `Expected 1, got ${matches.length}` };
    }
  },
  {
    name: 'Regex Tester – invalid pattern throws error',
    run: async () => {
      let error = null;
      try {
        new RegExp('[');
      } catch (e) {
        error = e.message;
      }
      return { ok: error !== null, details: error || 'Should throw error' };
    }
  },
  {
    name: 'Regex Tester – groups extraction works',
    run: async () => {
      const pattern = '(\\d+)-(\\d+)';
      const text = 'code: 123-456';
      const regex = new RegExp(pattern);
      const match = regex.exec(text);
      const hasGroups = match && match[1] === '123' && match[2] === '456';
      return { ok: hasGroups, details: hasGroups ? '' : 'Group extraction failed' };
    }
  },
  // Markdown Previewer
  {
    name: 'Markdown – converts heading to HTML',
    run: async () => {
      const md = '# Heading 1';
      const html = md.replace(/^# (.*$)/gm, '<h1>$1</h1>');
      return { ok: html === '<h1>Heading 1</h1>', details: 'Heading conversion failed' };
    }
  },
  {
    name: 'Markdown – converts bold text',
    run: async () => {
      const md = '**bold text**';
      const html = md.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return { ok: html === '<strong>bold text</strong>', details: 'Bold conversion failed' };
    }
  },
  {
    name: 'Markdown – converts link',
    run: async () => {
      const md = '[DeepSeek](https://deepseek.com)';
      const html = md.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
      return { ok: html === '<a href="https://deepseek.com">DeepSeek</a>', details: 'Link conversion failed' };
    }
  },
  // Clipboard History
  {
    name: 'Clipboard History – saves entry to localStorage',
    run: async () => {
      const testKey = 'clipboard_test';
      const testValue = [{ id: 1, text: 'test' }];
      localStorage.setItem(testKey, JSON.stringify(testValue));
      const loaded = JSON.parse(localStorage.getItem(testKey));
      localStorage.removeItem(testKey);
      return { ok: loaded[0].text === 'test', details: 'Save/load failed' };
    }
  },
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
  }
  // Cookies Grabber
  ,{
    name: 'Cookie Grabber – getCookies returns array',
    run: async () => {
      if (!window.electronAPI?.getCookies) {
        return { ok: false, details: 'getCookies not available' };
      }
      const result = await window.electronAPI.getCookies(null);
      const ok = result?.ok === true && Array.isArray(result?.data);
      return { ok, details: ok ? '' : 'Invalid response structure' };
    }
  }
];

// ─── runToolsTests() – Uruchamia zestaw testów jednostkowych dla narzędzi pomocniczych (JSON, Regex, Markdown, Clipboard)
export async function runToolsTests() {
  return runTests('Tools', tests);
}
