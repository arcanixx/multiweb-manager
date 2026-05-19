// =============================================================================
// FILE: main.js
// PATH: multiweb-manager/main.js
// VERSION: 0.0.3
// PURPOSE: Główna logika procesu głównego Electron:
//          - tworzenie okna
//          - IPC
//          - bezpieczeństwo WebView
//          - single instance lock
//          - logowanie błędów
//          - sprawdzenie wolnego miejsca na dysku
//          - integracja z TestRunner
// UWAGA: Nie usuwaj komentarzy — opisują przeznaczenie sekcji i funkcji.
// =============================================================================

import { app, BrowserWindow, ipcMain, session, shell } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { execSync } from "child_process";
import { APP_ENV, FEATURES, DEFAULT_SETTINGS } from "./config.js";
import { loadSettings } from "./src/core/settingsStore.js";
import { logInfo, logError } from "./src/utils/logger.js";
import { runAllTests } from "./tests/TestRunner.js";

// ESM nie ma __dirname — obliczamy ręcznie
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Preload jest .cjs bo Electron preload nie obsługuje ESM
const PRELOAD_PATH = path.join(__dirname, "preload.cjs");

// Rejestracja handlerów IPC (import = side-effect register)
import "./src/ipc/ipcLegacyBridge.js";
import "./src/ipc/ipcMainHandlers_profiles.js";
import "./src/ipc/ipcMainHandlers_projects.js";
import "./src/ipc/ipcMainHandlers_tasks.js";
import "./src/ipc/ipcMainHandlers_webview.js";
import "./src/ipc/ipcMainHandlers_terminal.js";
import "./src/ipc/ipcMainHandlers_settings.js";
import "./src/ipc/ipcMainHandlers_tools.js";
import "./src/ipc/ipcMainHandlers_history.js";
import "./src/ipc/ipcMainHandlers_aggregatedTasks.js";
import "./src/ipc/ipcMainHandlers_misc.js";
import "./src/ipc/ipcMainHandlers_notes.js";
import "./src/ipc/ipcMainHandlers_workspaces.js";

// =============================================================================
// SINGLE INSTANCE LOCK
// Zapobiega uruchomieniu wielu instancji aplikacji
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
// Blokuje otwieranie nowych okien w webview + opcjonalny whitelist domen
// =============================================================================

app.on("web-contents-created", (_, contents) => {
  if (contents.getType() === "webview") {
    contents.setWindowOpenHandler(() => ({ action: "deny" }));
    contents.on("will-navigate", (_e) => {
      // Można dodać whitelist domen tutaj jeśli potrzeba
    });
  }
});

// =============================================================================
// STARTUP TESTS — uruchamia TestRunner gdy debugMode=true
// =============================================================================

async function runStartupTestsIfEnabled() {
  try {
    const settings = loadSettings();
    const debugMode = settings.debugMode ?? DEFAULT_SETTINGS.debugMode;

    if (FEATURES.startupTests && debugMode) {
      logInfo("Startup tests enabled — running TestRunner...");
      const summary = await runAllTests({ logToFile: true, verbose: false });
      logInfo("Startup tests finished", summary);
    }
  } catch (err) {
    logError("Startup tests failed", err);
  }
}

// =============================================================================
// DISK SPACE WARNING
// Ostrzega gdy wolne miejsce < 5% (tylko Windows)
// =============================================================================

function checkDiskSpaceWarning() {
  try {
    if (process.platform !== "win32") return;

    const drive = path.parse(app.getPath("userData")).root;
    // Usuwamy trailing slash dla wmic: "C:\" -> "C:"
    const driveLetter = drive.replace(/\\$/, "");

    const out = execSync(
      `wmic logicaldisk where "DeviceID='${driveLetter}'" get FreeSpace,Size /format:value`,
      { encoding: "utf8", timeout: 3000 }
    );

    const freeMatch = out.match(/FreeSpace=(\d+)/);
    const sizeMatch = out.match(/Size=(\d+)/);

    if (freeMatch && sizeMatch) {
      const free = Number(freeMatch[1]);
      const size = Number(sizeMatch[1]) || 1;
      const pctFree = (free / size) * 100;

      if (pctFree < 5) {
        logError("Low disk space warning", {
          pctFree: pctFree.toFixed(1),
          drive: driveLetter
        });
      }
    }
  } catch (err) {
    // Nie przerywamy startu — brak wmic to nie problem krytyczny
    logError("checkDiskSpaceWarning failed", err.message);
  }
}

// =============================================================================
// APP EVENTS
// =============================================================================

app.whenReady().then(async () => {
  checkDiskSpaceWarning();
  await runStartupTestsIfEnabled();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// =============================================================================
// GLOBAL ERROR HANDLERS
// Logują błędy, które inaczej znikają bez śladu
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
