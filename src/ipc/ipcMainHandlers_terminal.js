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
// HELPER: create shell command per OS
// =============================================================================

// ─── getDefaultShell() – Zwraca nazwę binarnego pliku domyślnej powłoki systemowej (shell) na podstawie platformy operacyjnej (powershell.exe dla Windows, zsh dla macOS, bash dla Linuxa)
function getDefaultShell() {
  if (os.platform() === "win32") return "powershell.exe";
  if (os.platform() === "darwin") return "zsh";
  return "bash";
}
// =============================================================================
// CREATE TERMINAL SESSION
// =============================================================================
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
    logError('ipc', "terminal:create failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// WRITE TO TERMINAL
// =============================================================================

ipcMain.handle("terminal:write", async (_, { terminalId, data }) => {
  try {
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
    logError('ipc', "terminal:restart failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// END OF FILE
// =============================================================================