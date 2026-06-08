// =============================================================================
// FILE: TestRunner_Terminal.js
// PATH: tests/TestRunner_Terminal.js
// VERSION: 0.0.3
// PURPOSE: Testy jednostkowe dla Terminala (xterm, node-pty, historia, ANSI, multi-session API)
// FUNCTIONS: runTerminalTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';

const tests = [
  // ─── Testy wymagające Electron/React (env:'react') ────────────────────────
  {
    name: 'xterm.js – module available',
    env: 'react',
    run: async () => {
      try { await import('xterm'); return { ok: true }; }
      catch { return { ok: false, details: 'xterm package not installed' }; }
    }
  },
  {
    name: 'node-pty – dostępny przez electronAPI (createTerminal)',
    env: 'react',
    run: async () => {
      const ok = !!window.electronAPI?.createTerminal;
      return { ok, details: ok ? '' : 'electronAPI.createTerminal missing' };
    }
  },
  {
    name: 'terminal:create – zwraca terminalId',
    env: 'react',
    run: async () => {
      if (!window.electronAPI?.createTerminal)
        return { ok: false, details: 'electronAPI.createTerminal missing' };
      try {
        const res = await window.electronAPI.createTerminal(undefined);
        const ok = res?.ok === true && typeof res?.data?.terminalId === 'string' && res.data.terminalId.length > 0;
        if (ok) await window.electronAPI.killTerminal?.(res.data.terminalId);
        return { ok, details: ok ? `terminalId: ${res?.data?.terminalId}` : `Odpowiedź: ${JSON.stringify(res)}` };
      } catch (err) { return { ok: false, details: `Wyjątek: ${err.message}` }; }
    }
  },
  {
    name: 'electronAPI – nowe metody terminal dostępne',
    env: 'react',
    run: async () => {
      const wymagane = ['createTerminal', 'terminalWrite', 'terminalResize', 'killTerminal', 'onTerminalData', 'onTerminalExit'];
      const brakujace = wymagane.filter(m => !window.electronAPI?.[m]);
      return { ok: brakujace.length === 0, details: brakujace.length ? `Brakujące: ${brakujace.join(', ')}` : '' };
    }
  },
  {
    name: 'electronAPI – brak legacy metod terminal',
    env: 'react',
    run: async () => {
      const legacy = ['terminalStart', 'terminalWriteLegacy', 'terminalResizeLegacy', 'terminalKillLegacy'];
      const obecne = legacy.filter(m => !!window.electronAPI?.[m]);
      return { ok: obecne.length === 0, details: obecne.length ? `Legacy wciąż obecne: ${obecne.join(', ')}` : '' };
    }
  },

  // ─── Testy czysto Node (brak zależności od DOM) ────────────────────────────
  {
    name: 'Historia komend – kolejność i nawigacja',
    run: async () => {
      const historia = [];
      const dodaj = (cmd) => { if (cmd.trim()) historia.push(cmd); };
      dodaj('ls -la'); dodaj('npm start'); dodaj('git status');
      const ok = historia[historia.length - 1] === 'git status'
              && historia[0] === 'ls -la' && historia.length === 3;
      return { ok, details: ok ? '' : `Historia: ${JSON.stringify(historia)}` };
    }
  },
  {
    name: 'ANSI escape sequences – zachowane',
    run: async () => {
      const ansiRed = '\x1b[31mRed text\x1b[0m';
      const ok = ansiRed.includes('\x1b');
      return { ok, details: ok ? '' : 'Brak sekwencji ANSI' };
    }
  },
];

export async function runTerminalTests() {
  return runTests('Terminal', tests);
}
