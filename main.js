// =============================================================================
// FILE: main.js
// PATH: multiweb-manager/main.js
// VERSION: v1.0
// PURPOSE: Główna logika procesu głównego Electron:
//          - tworzenie okna
//          - IPC
//          - bezpieczeństwo WebView
//          - single instance lock
//          - logowanie błędów
//          - integracja z TestRunner
// =============================================================================

import { app, BrowserWindow, ipcMain, session, shell } from "electron";
import path from "path";
import { APP_ENV, FEATURES, DEFAULT_SETTINGS } from "./config.js";
import { loadSettings } from "./src/core/settingsStore.js";
import { logInfo, logError } from "./src/utils/logger.js";
import { runAllTests } from "./src/tests/TestRunner.js";

// =============================================================================
// SINGLE INSTANCE LOCK
// =============================================================================

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
  process.exit(0);
}

app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// =============================================================================
// GLOBALS
// =============================================================================

let mainWindow = null;
const PRELOAD_PATH = path.join(__dirname, "preload.js");

// =============================================================================
// CREATE WINDOW
// =============================================================================

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: "#1e1e1e",
    show: false,
    webPreferences: {
      preload: PRELOAD_PATH,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webviewTag: true,
      spellcheck: false
    }
  });

  mainWindow.loadFile("index.html");

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// =============================================================================
// SECURITY — WebView
// =============================================================================

app.on("web-contents-created", (_, contents) => {
  if (contents.getType() === "webview") {
    contents.setWindowOpenHandler(() => ({ action: "deny" }));
    contents.on("will-navigate", (e) => {
      // Możesz dodać whitelistę domen
    });
  }
});

// =============================================================================
// IPC HANDLERS (skrót — pełne w ipcMainHandlers.js)
// =============================================================================

ipcMain.handle("open-external", (_, url) => {
  shell.openExternal(url);
  return { ok: true };
});

// =============================================================================
// STARTUP TESTS — integracja z TestRunner
// =============================================================================

async function runStartupTestsIfEnabled() {
  try {
    const settings = loadSettings();
    const debugMode = settings.debugMode ?? DEFAULT_SETTINGS.debugMode;

    if (FEATURES.startupTests && debugMode) {
      logInfo("Startup tests enabled — running TestRunner...");
      const summary = await runAllTests({
        logToFile: true,
        verbose: false
      });
      logInfo("Startup tests finished", summary);
    }
  } catch (err) {
    logError("Startup tests failed", err);
  }
}

// =============================================================================
// APP EVENTS
// =============================================================================

app.whenReady().then(async () => {
  await runStartupTestsIfEnabled();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// =============================================================================
// GLOBAL ERROR HANDLERS
// =============================================================================

process.on("uncaughtException", (err) => {
  logError("uncaughtException", err);
});

process.on("unhandledRejection", (reason) => {
  logError("unhandledRejection", reason);
});

// =============================================================================
// END OF FILE
// =============================================================================
