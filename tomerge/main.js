// =============================================================================
// FILE: main.js
// PATH: src/main.js
// VERSION: 0.0.3
// PURPOSE: Electron Main Process.
//          - tworzy BrowserWindow z bezpiecznym preload
//          - ładuje wszystkie moduły IPC (handlers rejestrują się przez import)
//          - uruchamia TestRunner przy starcie (loguje wyniki)
//          - blokuje otwieranie zewnętrznych okien (setWindowOpenHandler)
//          - obsługuje cykl życia aplikacji (activate, window-all-closed)
// DEPENDS ON: electron, TestRunner.js, logger.js, wszystkie ipcMainHandlers_*
// =============================================================================

import { app, BrowserWindow, shell } from "electron";
import path from "path";
import { runAllTests } from "./tests/TestRunner.js";
import { logInfo, logError } from "./utils/logger.js";

// IPC modules – same importowanie rejestruje handlery przez ipcMain.handle(...)
import "./ipc/ipcMainHandlers_profiles.js";
import "./ipc/ipcMainHandlers_tasks.js";
import "./ipc/ipcMainHandlers_projects.js";
import "./ipc/ipcMainHandlers_webview.js";
import "./ipc/ipcMainHandlers_terminal.js";
import "./ipc/ipcMainHandlers_settings.js";
import "./ipc/ipcMainHandlers_tools.js";
import "./ipc/ipcMainHandlers_history.js";
import "./ipc/ipcMainHandlers_aggregatedTasks.js";
import "./ipc/ipcMainHandlers_misc.js";

let mainWindow = null;

// ----------------------------------------------------------------
// createWindow() – tworzy główne okno aplikacji
//   - contextIsolation: true + sandbox: true = maksymalne bezpieczeństwo
//   - preload wstrzykuje window.mw (IPC bridge)
// ----------------------------------------------------------------
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: "#1e1e1e",
    webPreferences: {
      preload: path.join(process.cwd(), "preload.js"),
      contextIsolation: true,
      sandbox: true
    }
  });

  mainWindow.loadFile("index.html");

  // Blokuj otwieranie zewnętrznych okien – otwieraj w domyślnej przeglądarce
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// ----------------------------------------------------------------
// app.whenReady – inicjalizacja po gotowości Electrona
//   - tworzy okno
//   - uruchamia testy integralności (wyniki loguje przez logger)
// ----------------------------------------------------------------
app.whenReady().then(async () => {
  logInfo("Application starting…");
  createWindow();

  // Uruchom testy integralności i zaloguj wyniki
  const results = await runAllTests();
  logInfo("TestRunner results", results);

  // macOS – odtwórz okno gdy kliknięto ikonę w docku
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// =============================================================================
// END OF FILE
// =============================================================================
