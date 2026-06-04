// =============================================================================
// FILE: main.js
// PATH: main.js
// VERSION: 0.0.3
// PURPOSE: Główna logika procesu głównego Electron – koordynacja, okno, bezpieczeństwo
// FUNCTIONS: createWindow, runStartupTestsIfEnabled, checkDiskSpaceWarning
// DEPENDS ON: electron, path, url, child_process, config.js, settingsStore.js, logger.js, TestRunner.js, adBlocker.js, hotkeysManager.js, ipcLoader.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { app, BrowserWindow, session } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { FEATURES, DEFAULT_SETTINGS } from "./config.js";
import { loadSettings } from "./src/stores/settingsStore.js";
import { logInfo, logError } from "./src/utils/logger.js";
import { runAllTests } from "./tests/TestRunner.js";
import { initAdBlocker } from './src/engine/adBlocker.js';
import { unregisterAllHotkeys } from './src/engine/hotkeysManager.js';
import { setMainWindow } from './src/engine/hotkeysManager.js';

// DYNAMICZNY LOADER HANDLERÓW (IPC)
// =============================================================================
import { loadAllIpcHandlers } from './src/loaders/ipcLoader.js';

// =============================================================================
// KONFIGURACJA PODSTAWOWA
// =============================================================================
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
// ESM nie ma __dirname — obliczamy ręcznie
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Preload jest .cjs bo Electron preload nie obsługuje ESM
const PRELOAD_PATH = path.join(__dirname, "preload.cjs");
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
// FUNKCJA TWORZENIA OKNA
// =============================================================================

// ─── createWindow() – Inicjalizuje główne okno BrowserWindow, ustawia CSP i ładuje URL
export function createWindow() {
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

  setMainWindow(mainWindow);

// CSP – Content Security Policy
// Ogranicza możliwość wykonywania niebezpiecznego kodu (XSS, script injection)
session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      'Content-Security-Policy': [
        "default-src 'self'; img-src * data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
      ]
    }
  });
});

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'public', 'index.html'));
  }

  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.on("closed", () => { mainWindow = null; });
}

// =============================================================================
// SECURITY — WebView
// Blokuje otwieranie nowych okien w webview + opcjonalny whitelist domen
// =============================================================================
app.on("web-contents-created", (_, contents) => {
  if (contents.getType() === "webview") {
    contents.setWindowOpenHandler(() => ({ action: "deny" }));
    contents.on("will-navigate", (_e) => {});
  }
});

// =============================================================================
// STARTUP TESTS — uruchamia TestRunner gdy debugMode=true
// =============================================================================

// ─── runStartupTestsIfEnabled() – Sprawdza ustawienia debugMode i uruchamia testy integracyjne przy starcie
export async function runStartupTestsIfEnabled() {
  try {
    const settings = loadSettings();
    const debugMode = settings.debugMode ?? DEFAULT_SETTINGS.debugMode;
    if (FEATURES.startupTests && debugMode) {
      logInfo("engine", "Startup tests enabled — running TestRunner...");
      const summary = await runAllTests({ logToFile: true, verbose: false });
      logInfo("engine", "Startup tests finished", summary);
    }
  } catch (err) {
    logError("engine", "Startup tests failed", err.message);
  }
}

// =============================================================================
// DISK SPACE WARNING
// Ostrzega gdy wolne miejsce < 5% (tylko Windows)
// =============================================================================

// ─── checkDiskSpaceWarning() – Sprawdza dostępne miejsce na partycji danych użytkownika (tylko Windows)
export function checkDiskSpaceWarning() {
  try {
    if (process.platform !== "win32") return;
    const drive = path.parse(app.getPath("userData")).root;
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
        logError("engine", "Low disk space warning", { pctFree: pctFree.toFixed(1), drive: driveLetter });
      }
    }
  } catch (err) {
    // Nie przerywamy startu — brak wmic to nie problem krytyczny
    logError("engine", "checkDiskSpaceWarning failed", err.message);
  }
}

app.whenReady().then(async () => {
  checkDiskSpaceWarning();
  await runStartupTestsIfEnabled();
  await loadAllIpcHandlers();
  initAdBlocker();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on('will-quit', () => {
  unregisterAllHotkeys();
});

// =============================================================================
// GLOBAL ERROR HANDLERS
// Logują błędy, które inaczej znikają bez śladu
// =============================================================================
process.on("uncaughtException", (err) => logError('engine', "uncaughtException", err.message));
process.on("unhandledRejection", (reason) => logError('engine', "unhandledRejection", reason.message || reason));
