// =============================================================================
// FILE: ipcMainHandlers_misc.js
// PATH: src/ipc/ipcMainHandlers_misc.js
// VERSION: 0.0.3
// PURPOSE: IPC handlers dla funkcji ogólnych (misc).
//          - misc:openExternal   – otwiera URL w domyślnej przeglądarce
//          - misc:openFileDialog – dialog wyboru pliku (showOpenDialog)
//          - misc:saveFileDialog – dialog zapisu pliku (showSaveDialog)
//          - misc:getAppInfo     – info o aplikacji (name, version, path)
//          - misc:readFile       – odczytuje plik tekstowy z dysku
//          - misc:writeFile      – zapisuje plik tekstowy na dysk
//          - misc:getLogFile     – odczytuje plik logów (ścieżka + treść)
//          - misc:path:join      – path.join(...parts)
//          - misc:path:dirname   – path.dirname(filePath)
// DEPENDS ON: electron (ipcMain, shell, dialog, app), fs, path, logger.js
// =============================================================================

import { ipcMain, shell, dialog, app } from "electron";
import fs from "fs";
import path from "path";
import { logError, logInfo, getLogFilePath } from "../utils/logger.js";

// ----------------------------------------------------------------
// misc:openExternal – otwiera URL w domyślnej przeglądarce systemowej
// ----------------------------------------------------------------
ipcMain.handle("misc:openExternal", async (_, url) => {
  try {
    await shell.openExternal(url);
    return { ok: true };
  } catch (err) {
    logError("misc:openExternal failed", err);
    return { ok: false, error: err.message };
  }
});

// ----------------------------------------------------------------
// misc:openFileDialog – natywny dialog wyboru pliku
//   options: Electron ShowOpenDialogOptions
// ----------------------------------------------------------------
ipcMain.handle("misc:openFileDialog", async (_, options) => {
  try {
    const result = await dialog.showOpenDialog(options || {});
    return { ok: true, data: result };
  } catch (err) {
    logError("misc:openFileDialog failed", err);
    return { ok: false, error: err.message };
  }
});

// ----------------------------------------------------------------
// misc:saveFileDialog – natywny dialog zapisu pliku
//   options: Electron ShowSaveDialogOptions
// ----------------------------------------------------------------
ipcMain.handle("misc:saveFileDialog", async (_, options) => {
  try {
    const result = await dialog.showSaveDialog(options || {});
    return { ok: true, data: result };
  } catch (err) {
    logError("misc:saveFileDialog failed", err);
    return { ok: false, error: err.message };
  }
});

// ----------------------------------------------------------------
// misc:getAppInfo – zwraca podstawowe info o aplikacji
// ----------------------------------------------------------------
ipcMain.handle("misc:getAppInfo", async () => {
  try {
    return {
      ok: true,
      data: {
        name:       app.getName(),
        version:    app.getVersion(),
        path:       app.getAppPath(),
        isPackaged: app.isPackaged
      }
    };
  } catch (err) {
    logError("misc:getAppInfo failed", err);
    return { ok: false, error: err.message };
  }
});

// ----------------------------------------------------------------
// misc:readFile – odczytuje plik tekstowy z dysku (UTF-8)
// ----------------------------------------------------------------
ipcMain.handle("misc:readFile", async (_, filePath) => {
  try {
    if (!fs.existsSync(filePath)) throw new Error("FILE_NOT_FOUND");
    const data = fs.readFileSync(filePath, "utf8");
    return { ok: true, data };
  } catch (err) {
    logError("misc:readFile failed", err);
    return { ok: false, error: err.message };
  }
});

// ----------------------------------------------------------------
// misc:writeFile – zapisuje plik tekstowy na dysk (UTF-8)
// ----------------------------------------------------------------
ipcMain.handle("misc:writeFile", async (_, { filePath, content }) => {
  try {
    fs.writeFileSync(filePath, content, "utf8");
    return { ok: true };
  } catch (err) {
    logError("misc:writeFile failed", err);
    return { ok: false, error: err.message };
  }
});

// ----------------------------------------------------------------
// misc:getLogFile – odczytuje plik logów aplikacji (ścieżka + treść)
// ----------------------------------------------------------------
ipcMain.handle("misc:getLogFile", async () => {
  try {
    const logPath = getLogFilePath();
    const content = fs.readFileSync(logPath, "utf8");
    return { ok: true, data: { path: logPath, content } };
  } catch (err) {
    logError("misc:getLogFile failed", err);
    return { ok: false, error: err.message };
  }
});

// ----------------------------------------------------------------
// misc:path:join – łączy segmenty ścieżki (path.join)
// ----------------------------------------------------------------
ipcMain.handle("misc:path:join", async (_, parts) => {
  try {
    const result = path.join(...parts);
    return { ok: true, data: result };
  } catch (err) {
    logError("misc:path:join failed", err);
    return { ok: false, error: err.message };
  }
});

// ----------------------------------------------------------------
// misc:path:dirname – zwraca katalog nadrzędny ścieżki
// ----------------------------------------------------------------
ipcMain.handle("misc:path:dirname", async (_, filePath) => {
  try {
    return { ok: true, data: path.dirname(filePath) };
  } catch (err) {
    logError("misc:path:dirname failed", err);
    return { ok: false, error: err.message };
  }
});

// =============================================================================
// END OF FILE
// =============================================================================
