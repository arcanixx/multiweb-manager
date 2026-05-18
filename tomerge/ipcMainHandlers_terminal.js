// =============================================================================
// FILE: ipcMainHandlers_terminal.js
// PATH: src/ipc/ipcMainHandlers_terminal.js
// VERSION: 0.0.3
// PURPOSE: IPC handlers dla Terminala opartego na node-pty.
//          - terminal:create  – tworzy sesję pty (shell per OS)
//          - terminal:write   – wysyła dane do sesji
//          - terminal:resize  – zmienia rozmiar (cols/rows)
//          - terminal:getBuffer – zwraca bufor historii output
//          - terminal:kill    – zamyka sesję
//          - terminal:restart – zamyka i tworzy nową sesję w tym samym CWD
//          Bufor max 2000 wpisów (FIFO) – dla xterm.js initial dump.
// DEPENDS ON: electron (ipcMain), node-pty, os, logger.js
// =============================================================================

import { ipcMain } from "electron";
import { logError } from "../utils/logger.js";
import pty from "node-pty";
import os from "os";

// Globalne storage sesji terminalowych
const terminals = {};       // { terminalId: ptyProcess }
const terminalBuffers = {}; // { terminalId: string[] }

// ----------------------------------------------------------------
// getDefaultShell() – zwraca shell dla aktualnego OS
// ----------------------------------------------------------------
function getDefaultShell() {
  if (os.platform() === "win32") return "powershell.exe";
  if (os.platform() === "darwin") return "zsh";
  return "bash";
}

// ----------------------------------------------------------------
// terminal:create – tworzy nową sesję pty
//   cwd: katalog roboczy (domyślnie process.cwd())
//   Zwraca: { ok, data: { terminalId } }
// ----------------------------------------------------------------
ipcMain.handle("terminal:create", async (_, { cwd }) => {
  try {
    const shell = getDefaultShell();

    const ptyProcess = pty.spawn(shell, [], {
      name: "xterm-color",
      cols: 120,
      rows: 30,
      cwd: cwd || process.cwd(),
      env: process.env
    });

    const terminalId = String(ptyProcess.pid);
    terminals[terminalId] = ptyProcess;
    terminalBuffers[terminalId] = [];

    // Buforuj output – max 2000 wpisów (FIFO)
    ptyProcess.onData((data) => {
      terminalBuffers[terminalId].push(data);
      if (terminalBuffers[terminalId].length > 2000) {
        terminalBuffers[terminalId].shift();
      }
    });

    ptyProcess.onExit(() => {
      delete terminals[terminalId];
      delete terminalBuffers[terminalId];
    });

    return { ok: true, data: { terminalId } };
  } catch (err) {
    logError("terminal:create failed", err);
    return { ok: false, error: err.message };
  }
});

// ----------------------------------------------------------------
// terminal:write – wysyła dane (komendy) do sesji
//   Zwraca: { ok } | { ok: false, error }
// ----------------------------------------------------------------
ipcMain.handle("terminal:write", async (_, { terminalId, data }) => {
  try {
    const term = terminals[terminalId];
    if (!term) throw new Error("TERMINAL_NOT_FOUND");
    term.write(data);
    return { ok: true };
  } catch (err) {
    logError("terminal:write failed", err);
    return { ok: false, error: err.message };
  }
});

// ----------------------------------------------------------------
// terminal:resize – zmienia rozmiar terminala (cols x rows)
//   Wywołaj przy resize okna lub panelu
// ----------------------------------------------------------------
ipcMain.handle("terminal:resize", async (_, { terminalId, cols, rows }) => {
  try {
    const term = terminals[terminalId];
    if (!term) throw new Error("TERMINAL_NOT_FOUND");
    term.resize(cols, rows);
    return { ok: true };
  } catch (err) {
    logError("terminal:resize failed", err);
    return { ok: false, error: err.message };
  }
});

// ----------------------------------------------------------------
// terminal:getBuffer – zwraca sklejony bufor historii output
//   Używane przez xterm.js przy inicjalizacji (initial dump)
// ----------------------------------------------------------------
ipcMain.handle("terminal:getBuffer", async (_, terminalId) => {
  try {
    const buffer = terminalBuffers[terminalId] || [];
    return { ok: true, data: buffer.join("") };
  } catch (err) {
    logError("terminal:getBuffer failed", err);
    return { ok: false, error: err.message };
  }
});

// ----------------------------------------------------------------
// terminal:kill – zamyka sesję i usuwa z pamięci
// ----------------------------------------------------------------
ipcMain.handle("terminal:kill", async (_, terminalId) => {
  try {
    const term = terminals[terminalId];
    if (!term) throw new Error("TERMINAL_NOT_FOUND");
    term.kill();
    delete terminals[terminalId];
    delete terminalBuffers[terminalId];
    return { ok: true };
  } catch (err) {
    logError("terminal:kill failed", err);
    return { ok: false, error: err.message };
  }
});

// ----------------------------------------------------------------
// terminal:restart – zamyka starą sesję i tworzy nową w tym samym CWD
//   Przydatne do przycisku "Restart" w Terminal.jsx
// ----------------------------------------------------------------
ipcMain.handle("terminal:restart", async (_, { terminalId, cwd }) => {
  try {
    const old = terminals[terminalId];
    if (old) old.kill();

    const shell = getDefaultShell();
    const ptyProcess = pty.spawn(shell, [], {
      name: "xterm-color",
      cols: 120,
      rows: 30,
      cwd: cwd || process.cwd(),
      env: process.env
    });

    terminals[terminalId] = ptyProcess;
    terminalBuffers[terminalId] = [];

    ptyProcess.onData((data) => {
      terminalBuffers[terminalId].push(data);
      if (terminalBuffers[terminalId].length > 2000) {
        terminalBuffers[terminalId].shift();
      }
    });

    ptyProcess.onExit(() => {
      delete terminals[terminalId];
      delete terminalBuffers[terminalId];
    });

    return { ok: true };
  } catch (err) {
    logError("terminal:restart failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// END OF FILE
// =============================================================================
