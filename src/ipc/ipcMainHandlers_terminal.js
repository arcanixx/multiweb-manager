// =============================================================================
// FILE: ipcMainHandlers_terminal.js
// PATH: src/ipc/ipcMainHandlers_terminal.js
// VERSION: 0.0.3
// PURPOSE: IPC dla Terminala (node-pty + xterm.js) tworzenie sesji wysyłanie danych odbieranie danych zamykanie sesji restart cleanup
// FUNCTIONS: ipc:terminal:create, ipc:terminal:write, ipc:terminal:resize, ipc:terminal:getBuffer, ipc:terminal:kill, ipc:terminal:restart
// DEPENDS ON: electron, logger.js, node-pty, os
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from "electron";
import { logError } from "../utils/logger.js";
import pty from "node-pty";
import os from "os";
// =============================================================================
// GLOBAL STORAGE
// =============================================================================
const terminals = {};
const terminalBuffers = {};
// =============================================================================
// HELPER: domyślna powłoka per OS
// =============================================================================

// ─── getDefaultShell() – Zwraca nazwę binarnego pliku domyślnej powłoki systemowej na podstawie platformy
function getDefaultShell() {
  if (os.platform() === "win32") return "powershell.exe";
  if (os.platform() === "darwin") return "zsh";
  return "bash";
}

// =============================================================================
// HELPER: tworzenie procesu PTY
// =============================================================================

// ─── spawnPty() – Tworzy nowy proces PTY z daną powłoką i CWD; rejestruje handlery onData/onError/onExit
//   @param {string} terminalId – ID terminala (string z PID)
//   @param {string} cwd        – katalog roboczy
//   @returns {Object}          – instancja ptyProcess
function spawnPty(terminalId, cwd) {
  const shell = getDefaultShell();
  const ptyProcess = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: 120,
    rows: 30,
    cwd: cwd || process.cwd(),
    env: process.env
  });

  terminals[terminalId]       = ptyProcess;
  terminalBuffers[terminalId] = [];

  ptyProcess.onData((data) => {
    terminalBuffers[terminalId].push(data);
    if (terminalBuffers[terminalId].length > 2000) {
      terminalBuffers[terminalId].shift();
    }
  });

  ptyProcess.on('error', (err) => {
    logError('ipc', `PTY error on terminal ${terminalId}`, err);
    try { ptyProcess.kill(); } catch (_) {}
    delete terminals[terminalId];
    delete terminalBuffers[terminalId];
  });

  ptyProcess.onExit(() => {
    delete terminals[terminalId];
    delete terminalBuffers[terminalId];
  });

  return ptyProcess;
}
// =============================================================================
// CREATE TERMINAL SESSION
// =============================================================================
ipcMain.handle("terminal:create", async (_, { cwd }) => {
  try {
    const ptyProcess = spawnPty('_tmp', cwd); // tymczasowe ID przed poznaniem PID
    const terminalId = String(ptyProcess.pid);
    // przenieś pod właściwe ID
    terminals[terminalId]       = terminals['_tmp'];
    terminalBuffers[terminalId] = terminalBuffers['_tmp'];
    delete terminals['_tmp'];
    delete terminalBuffers['_tmp'];
    return { ok: true, data: { terminalId } };
  } catch (err) {
    logError('ipc', "terminal:create failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// WRITE TO TERMINAL
// =============================================================================

ipcMain.handle("terminal:write", async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'object' || !('terminalId' in payload) || !('data' in payload)) {
      throw new Error('INVALID_PAYLOAD');
    }
    const { terminalId, data } = payload;
    const term = terminals[terminalId];
    if (!term) throw new Error("TERMINAL_NOT_FOUND");

    term.write(data);
    return { ok: true };
  } catch (err) {
    logError('ipc', "terminal:write failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// RESIZE TERMINAL
// =============================================================================

ipcMain.handle("terminal:resize", async (_, { terminalId, cols, rows }) => {
  try {
    const term = terminals[terminalId];
    if (!term) throw new Error("TERMINAL_NOT_FOUND");

    term.resize(cols, rows);
    return { ok: true };
  } catch (err) {
    logError('ipc', "terminal:resize failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// READ BUFFER (initial dump for xterm)
// =============================================================================

ipcMain.handle("terminal:getBuffer", async (_, terminalId) => {
  try {
    const buffer = terminalBuffers[terminalId] || [];
    return { ok: true, data: buffer.join("") };
  } catch (err) {
    logError('ipc', "terminal:getBuffer failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// KILL TERMINAL
// =============================================================================

ipcMain.handle("terminal:kill", async (_, terminalId) => {
  try {
    const term = terminals[terminalId];
    if (!term) throw new Error("TERMINAL_NOT_FOUND");

    term.kill();
    delete terminals[terminalId];
    delete terminalBuffers[terminalId];

    return { ok: true };
  } catch (err) {
    logError('ipc', "terminal:kill failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// RESTART TERMINAL
// =============================================================================

ipcMain.handle("terminal:restart", async (_, { terminalId, cwd }) => {
  try {
    const old = terminals[terminalId];
    if (old) old.kill();
    delete terminals[terminalId];
    delete terminalBuffers[terminalId];
    spawnPty(terminalId, cwd);
    return { ok: true };
  } catch (err) {
    logError('ipc', "terminal:restart failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// END OF FILE
// =============================================================================