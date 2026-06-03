// =============================================================================
// FILE: logWriter.js
// PATH: src/utils/logWriter.js
// VERSION: 0.0.3
// PURPOSE: Zarządzanie utrwalaniem logów błędów i wyników testów w systemie plików (userData) poprzez mostek IPC.
// FUNCTIONS: initLogWriter, appendTestFailLog, getLogsContent, clearLogsFile
// DEPENDS ON: loggerRenderer.js, config.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logInfo, logError, logWarn, logDebug } from "./loggerRenderer.js";
import { DEFAULT_SETTINGS } from '../config.js';

let logsEnabled = false;
let debugMode = false;

// ─── initLogWriter() – inicjalizuje system logowania testów na podstawie ustawień
//   Zgoda na logowanie jest teraz zarządzana przez Settings (logsEnabled toggle),
//   nie przez window.confirm – usunięto interaktywny dialog.
//   @returns {Promise<void>}
export async function initLogWriter() {
  try {
    const settingsRes = await window.electronAPI?.invoke?.('settings:get');
    const settings = settingsRes?.ok ? settingsRes.data : DEFAULT_SETTINGS;
    debugMode = settings.debugMode === true;
    logsEnabled = settings.logsEnabled === true;
    logDebug("store", `initLogWriter: debugMode=${debugMode}, logsEnabled=${logsEnabled}`);

    if (!debugMode) {
      logsEnabled = false;
      logInfo("store", "initLogWriter: debug mode disabled, skipping log setup");
      return;
    }

    // firstRun: jeśli użytkownik jeszcze nie ustawił logsEnabled – domyślnie włączamy
    // (użytkownik może wyłączyć w Settings → Data & Logs)
    if (settings.firstRun && logsEnabled === false) {
      await window.electronAPI?.saveSettings?.({ logsEnabled: true, firstRun: false });
      logsEnabled = true;
      logInfo("store", "initLogWriter: first run – logs enabled by default");
    }
  } catch (err) {
    logError("store", "initLogWriter failed", err.message);
    logWarn("store", "Nie udało się zainicjować zapisu logów");
    logsEnabled = false;
  }
}

// ─── appendTestFailLog() – dopisuje wpis o błędzie testu do pliku przez IPC
//   Rotacja pliku jest obsługiwana przez handler (ipcMainHandlers_logs.js).
//   @param {string} moduleName – nazwa modułu
//   @param {string} testName   – nazwa testu
//   @param {string} details    – szczegóły błędu
//   @returns {Promise<void>}
export async function appendTestFailLog(moduleName, testName, details) {
  if (!debugMode || !logsEnabled) return;

  try {
    const result = await window.electronAPI?.invoke?.('append-log-file', {
      level: 'fail',
      module: moduleName,
      test: testName,
      details,
      timestamp: Date.now(),
    });
    if (!result?.ok) {
      logWarn("store", `appendTestFailLog: IPC returned error – ${result?.error ?? 'unknown'}`);
    } else {
      logDebug("store", `appendTestFailLog: logged failure for ${moduleName}.${testName}`);
    }
  } catch (err) {
    logError("store", "appendTestFailLog failed", err.message);
    logWarn("store", "Nie udało się zapisać logu testu");
  }
}

// ─── getLogsContent() – pobiera zawartość aktualnego pliku logów przez IPC
//   @returns {Promise<string|null>}
export async function getLogsContent() {
  if (!debugMode || !logsEnabled) return null;
  try {
    const result = await window.electronAPI?.invoke?.('get-logs-file');
    if (result?.ok) {
      logDebug("store", "getLogsContent: logs retrieved");
      return result.data;
    }
    logWarn("store", "getLogsContent: no logs available");
    return null;
  } catch (err) {
    logError("store", "getLogsContent failed", err.message);
    logWarn("store", "Nie udało się odczytać logów");
    return null;
  }
}

// ─── clearLogsFile() – czyści aktualny plik logów przez IPC (archiwa pozostają)
//   @returns {Promise<boolean>}
export async function clearLogsFile() {
  if (!debugMode || !logsEnabled) return false;
  try {
    const result = await window.electronAPI?.invoke?.('clear-logs-file');
    if (result?.ok) logInfo("store", "clearLogsFile: logs cleared");
    return result?.ok === true;
  } catch (err) {
    logError("store", "clearLogsFile failed", err.message);
    logWarn("store", "Nie udało się wyczyścić logów");
    return false;
  }
}