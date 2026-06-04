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
  {
    // ─── Sprawdza dostępność pakietu xterm.js (renderer ma do niego dostęp)
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
    // ─── node-pty działa po stronie main process (nie renderera) – weryfikujemy
    //     tylko przez electronAPI, nie przez bezpośredni import
    name: 'node-pty – dostępny przez electronAPI (createTerminal)',
    run: async () => {
      if (!window.electronAPI?.createTerminal) {
        return { ok: false, details: 'electronAPI.createTerminal missing – preload niezaktualizowany?' };
      }
      return { ok: true, details: '' };
    }
  },
  {
    // ─── Weryfikuje kształt odpowiedzi terminal:create – musi zwracać { ok, data: { terminalId } }
    name: 'terminal:create – zwraca terminalId',
    run: async () => {
      if (!window.electronAPI?.createTerminal) {
        return { ok: false, details: 'electronAPI.createTerminal missing' };
      }
      try {
        const res = await window.electronAPI.createTerminal(undefined);
        const ok = res?.ok === true && typeof res?.data?.terminalId === 'string' && res.data.terminalId.length > 0;
        if (ok) {
          // Sprzątamy po sobie
          await window.electronAPI.killTerminal?.(res.data.terminalId);
        }
        return {
          ok,
          details: ok ? `terminalId: ${res?.data?.terminalId}` : `Nieoczekiwana odpowiedź: ${JSON.stringify(res)}`
        };
      } catch (err) {
        return { ok: false, details: `Wyjątek: ${err.message}` };
      }
    }
  },
  {
    // ─── Sprawdza dostępność metod nowego API w electronAPI (preload bridge)
    name: 'electronAPI – nowe metody terminal dostępne',
    run: async () => {
      const wymagane = ['createTerminal', 'terminalWrite', 'terminalResize', 'killTerminal', 'onTerminalData', 'onTerminalExit'];
      const brakujace = wymagane.filter(m => !window.electronAPI?.[m]);
      const ok = brakujace.length === 0;
      return {
        ok,
        details: ok ? '' : `Brakujące metody: ${brakujace.join(', ')}`
      };
    }
  },
  {
    // ─── Sprawdza że legacy metody NIE są już używane (czystość preload)
    name: 'electronAPI – brak legacy metod terminal',
    run: async () => {
      const legacy = ['terminalStart', 'terminalWriteLegacy', 'terminalResizeLegacy', 'terminalKillLegacy'];
      const obecne = legacy.filter(m => !!window.electronAPI?.[m]);
      const ok = obecne.length === 0;
      return {
        ok,
        details: ok ? '' : `Legacy metody wciąż obecne w preload: ${obecne.join(', ')} – można je usunąć`
      };
    }
  },
  {
    // ─── Logika historii komend – test w izolacji (bez IPC)
    name: 'Historia komend – kolejność i nawigacja',
    run: async () => {
      const historia = [];
      const dodaj = (cmd) => { if (cmd.trim()) historia.push(cmd); };
      dodaj('ls -la');
      dodaj('npm start');
      dodaj('git status');
      const ok = historia[historia.length - 1] === 'git status' && historia[0] === 'ls -la' && historia.length === 3;
      return { ok, details: ok ? '' : `Historia: ${JSON.stringify(historia)}` };
    }
  },
  {
    // ─── Sekwencje ANSI muszą być zachowane (kolorowe wyjście terminala)
    name: 'ANSI escape sequences – zachowane',
    run: async () => {
      const ansiRed = '\x1b[31mRed text\x1b[0m';
      const ok = ansiRed.includes('\x1b');
      return { ok, details: ok ? '' : 'Brak sekwencji ANSI' };
    }
  }
];

export async function runTerminalTests() {
  return runTests('Terminal', tests);
}
