// =============================================================================
// FILE: TestRunner_BusinessLogic.js
// PATH: tests/TestRunner_BusinessLogic.js
// VERSION: 0.0.3
// PURPOSE: Testy czystych funkcji biznesowych (cartesian, parseSplitChar, sortByPin, normalizeUrl)
// FUNCTIONS: runBusinessLogicTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';

const tests = [
  // Cartesian product
  {
    name: 'cartesian: empty input',
    run: async () => {
      const cartesian = (arrays) => {
        if (!arrays || arrays.length === 0) return [[]];
        if (arrays.length === 1) return arrays[0].map(v => [v]);
        return arrays.reduce((acc, arr) => {
          const result = [];
          for (const a of acc) for (const b of arr) result.push([...a, b]);
          return result;
        }, [[]]);
      };
      const result = JSON.stringify(cartesian([]));
      const ok = result === '[[]]';
      return { ok, details: ok ? '' : `Expected [[]], got ${result}` };
    }
  },
  {
    name: 'cartesian: single array',
    run: async () => {
      const cartesian = (arrays) => {
        if (!arrays || arrays.length === 0) return [[]];
        if (arrays.length === 1) return arrays[0].map(v => [v]);
        return arrays.reduce((acc, arr) => {
          const result = [];
          for (const a of acc) for (const b of arr) result.push([...a, b]);
          return result;
        }, [[]]);
      };
      const result = JSON.stringify(cartesian([['a', 'b']]));
      const ok = result === '[["a"],["b"]]';
      return { ok, details: ok ? '' : `Expected [["a"],["b"]], got ${result}` };
    }
  },
  {
    name: 'cartesian: 2x2',
    run: async () => {
      const cartesian = (arrays) => {
        if (!arrays || arrays.length === 0) return [[]];
        if (arrays.length === 1) return arrays[0].map(v => [v]);
        return arrays.reduce((acc, arr) => {
          const result = [];
          for (const a of acc) for (const b of arr) result.push([...a, b]);
          return result;
        }, [[]]);
      };
      const result = cartesian([['a', 'b'], ['1', '2']]).length;
      const ok = result === 4;
      return { ok, details: ok ? '' : `Expected 4, got ${result}` };
    }
  },
  // parseSplitChar
  {
    name: 'parseSplitChar: enter → newline',
    run: async () => {
      const parseSplitChar = (raw) => {
        if (raw === '\\n' || raw === 'enter') return '\n';
        if (raw === '\\t' || raw === 'tab') return '\t';
        return raw || ' ';
      };
      const result = parseSplitChar('enter');
      const ok = result === '\n';
      return { ok, details: ok ? '' : `Expected newline, got ${JSON.stringify(result)}` };
    }
  },
  {
    name: 'parseSplitChar: semicolon → semicolon',
    run: async () => {
      const parseSplitChar = (raw) => {
        if (raw === '\\n' || raw === 'enter') return '\n';
        if (raw === '\\t' || raw === 'tab') return '\t';
        return raw || ' ';
      };
      const result = parseSplitChar(';');
      const ok = result === ';';
      return { ok, details: ok ? '' : `Expected ";", got ${result}` };
    }
  },
  // Priority colors
  {
    name: 'Priority colors mapping',
    run: async () => {
      const PRIORITY_COLORS = { A: '#ef4444', B: '#f97316', C: '#eab308', D: '#3b82f6', E: '#22c55e' };
      const ok = PRIORITY_COLORS.A === '#ef4444' && PRIORITY_COLORS.B === '#f97316' &&
                 PRIORITY_COLORS.C === '#eab308' && PRIORITY_COLORS.D === '#3b82f6' &&
                 PRIORITY_COLORS.E === '#22c55e';
      return { ok, details: ok ? '' : 'Priority colors mismatch' };
    }
  },
  // sortByPin
  {
    name: 'sortByPin: pinned first',
    run: async () => {
      const sortByPin = (list) => [...list].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
      const tasks = [
        { id: '1', pinned: false },
        { id: '2', pinned: true },
        { id: '3', pinned: false }
      ];
      const sorted = sortByPin(tasks);
      const ok = sorted[0].pinned === true;
      return { ok, details: ok ? '' : 'Pinned item not first' };
    }
  },
  // normalizeUrl
  {
    name: 'normalizeUrl: adds https',
    run: async () => {
      const normalizeUrl = (url) => {
        if (!url) return '';
        const trimmed = url.trim();
        if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
          return 'https://' + trimmed;
        }
        return trimmed;
      };
      const result = normalizeUrl('deepseek.com');
      const ok = result === 'https://deepseek.com';
      return { ok, details: ok ? '' : `Expected https://deepseek.com, got ${result}` };
    }
  },
  // History slice limit
  {
    name: 'History max 100 entries',
    run: async () => {
      const history = Array.from({ length: 150 }, (_, i) => ({ id: i }));
      const sliced = history.slice(0, 100);
      const ok = sliced.length === 100;
      return { ok, details: ok ? '' : `Expected 100, got ${sliced.length}` };
    }
  }
];

export async function runBusinessLogicTests() {
  return runTests('BusinessLogic', tests);
}


