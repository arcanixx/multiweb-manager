// =============================================================================
// FILE: ipcLegacyBridge.js
// PATH: src/ipc/ipcLegacyBridge.js
// VERSION: 0.0.3
// PURPOSE: Kanały IPC zgodne z preload.js (get-profiles, save-settings, …).
//          Most między React a store — zwraca surowe dane, nie tylko { ok, data }.
// DEPENDS ON: electron (ipcMain, BrowserWindow), core stores, logger.js, node-pty
// =============================================================================

import { ipcMain, BrowserWindow, app, dialog } from "electron";
import fs from "fs";
import path from "path";
import pty from "node-pty";
import os from "os";
import {
  loadSettings,
  mergeSettings,
  saveSettings
} from "../core/settingsStore.js";
import { loadProfiles, saveProfiles } from "../core/profilesStore.js";
import { getAllNotes, addNote, updateNote, deleteNote } from "../core/notesStore.js";
import {
  loadTasksSections,
  saveTasksForProject,
  loadAllTasksGrouped
} from "../core/tasksStore.js";
import {
  loadHistory,
  addHistoryEntry,
  clearHistory
} from "../core/historyStore.js";
import { logError, logInfo } from "../utils/logger.js";

const terminals = {};

function getShell() {
  if (os.platform() === "win32") return "powershell.exe";
  if (os.platform() === "darwin") return "zsh";
  return "bash";
}

function broadcast(channel, payload) {
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send(channel, payload);
  }
}

// --- Profiles ---
ipcMain.handle("get-profiles", async () => loadProfiles());
ipcMain.handle("save-profiles", async (_, profiles) => {
  if (!Array.isArray(profiles)) return [];
  return saveProfiles(profiles);
});

// --- Notes ---
ipcMain.handle("get-notes", async () => getAllNotes());
ipcMain.handle("save-notes", async (_, notes) => {
  if (!Array.isArray(notes)) return [];
  const file = path.join(app.getPath("userData"), "notes.json");
  fs.writeFileSync(
    file,
    JSON.stringify({ version: "0.0.3", data: notes }, null, 2),
    "utf8"
  );
  return notes;
});

// --- Settings (merge) ---
ipcMain.handle("get-settings", async () => loadSettings());
ipcMain.handle("save-settings", async (_, patch) => {
  if (!patch || typeof patch !== "object") return loadSettings();
  return mergeSettings(patch);
});

// --- Tasks ---
ipcMain.handle("get-tasks", async (_, projectName) => ({
  tasks: loadTasksSections(projectName || "default")
}));
ipcMain.handle("save-tasks", async (_, projectName, data) => {
  saveTasksForProject(projectName || "default", data);
  return { ok: true };
});
ipcMain.handle("get-all-tasks", async () => {
  const grouped = loadAllTasksGrouped();
  const settings = loadSettings();
  const projects = settings.projects || [];
  const result = {};
  for (const p of projects) {
    const name = p.name || p.id;
    result[name] = grouped[name] || loadTasksSections(name);
  }
  Object.assign(result, grouped);
  return result;
});

// --- History ---
ipcMain.handle("get-history", async () => loadHistory());
ipcMain.handle("add-history", async (_, entry) => addHistoryEntry(entry || {}));
ipcMain.handle("clear-history", async () => clearHistory());

// --- WebView cache ---
ipcMain.handle("clear-profile-cache", async () => ({ ok: true }));

// --- App meta ---
ipcMain.handle("get-app-version", async () => app.getVersion());
ipcMain.handle("check-for-updates", async () => ({
  available: false,
  message: "Coming soon"
}));

// --- Files ---
ipcMain.handle("save-text-to-file", async (_, content, name, folder) => {
  try {
    const defaultPath = path.join(
      folder || app.getPath("documents"),
      name || "export.txt"
    );
    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath
    });
    if (canceled || !filePath) return null;
    fs.writeFileSync(filePath, content, "utf8");
    return filePath;
  } catch (err) {
    logError("save-text-to-file", err);
    return null;
  }
});

// --- Terminal (legacy preload API) ---
ipcMain.handle("create-terminal", async (_, cwd) => {
  try {
    const ptyProcess = pty.spawn(getShell(), [], {
      name: "xterm-color",
      cols: 120,
      rows: 30,
      cwd: cwd || process.cwd(),
      env: process.env
    });
    const terminalId = String(ptyProcess.pid);
    terminals[terminalId] = ptyProcess;

    ptyProcess.onData((data) => {
      broadcast("terminal-data", { terminalId, data });
    });

    ptyProcess.onExit(() => {
      delete terminals[terminalId];
    });

    logInfo("terminal created", terminalId);
    return terminalId;
  } catch (err) {
    logError("create-terminal", err);
    return null;
  }
});

ipcMain.handle("terminal-write", async (_, id, data) => {
  terminals[id]?.write(data);
});

ipcMain.handle("terminal-resize", async (_, id, cols, rows) => {
  terminals[id]?.resize(cols, rows);
});

ipcMain.handle("kill-terminal", async (_, id) => {
  terminals[id]?.kill();
  delete terminals[id];
});

// --- Quit ---
ipcMain.handle("confirm-quit", async () => {
  app.quit();
});
