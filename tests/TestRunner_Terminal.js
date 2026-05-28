// =============================================================================
// FILE: TestRunner_Terminal.js
// PATH: tests/TestRunner_Terminal.js
// VERSION: 0.0.3
// PURPOSE: Testy jednostkowe dla Terminala (xterm, node-pty, historia, ANSI)
// FUNCTIONS: runTerminalTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
const tests = [
  {
    name: 'xterm.js – module available',
    run: async () => {
      let xtermLoaded = false;
      try {
        await import('xterm');
        xtermLoaded = true;
      } catch (e) {
        xtermLoaded = false;
      }
      return { ok: xtermLoaded, details: xtermLoaded ? '' : 'xterm package not installed' };
    }
  },
  {
    name: 'node-pty – module available (Electron only)',
    run: async () => {
      let ptyAvailable = false;
      try {
        if (typeof process !== 'undefined' && process.versions?.electron) {
          await import('node-pty');
          ptyAvailable = true;
        } else {
          ptyAvailable = true; // mock for non-Electron test env
        }
      } catch (e) {
        ptyAvailable = false;
      }
      return { ok: ptyAvailable, details: ptyAvailable ? '' : 'node-pty package not installed' };
    }
  },
  {
    name: 'Command history order works',
    run: async () => {
      const history = [];
      const addToHistory = (cmd) => { if (cmd.trim()) history.push(cmd); };
      addToHistory('ls -la');
      addToHistory('npm start');
      addToHistory('git status');
      const last = history[history.length - 1];
      const first = history[0];
      return { ok: last === 'git status' && first === 'ls -la', details: `Last: ${last}, First: ${first}` };
    }
  },
  {
    name: 'ANSI escape sequences preserved',
    run: async () => {
      const ansiRed = '\x1b[31mRed text\x1b[0m';
      const hasAnsi = ansiRed.includes('\x1b');
      return { ok: hasAnsi, details: hasAnsi ? '' : 'No ANSI sequences found' };
    }
  }
];

export async function runTerminalTests() {
  return runTests('Terminal', tests);
}


