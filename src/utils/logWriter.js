// =============================================================================
// FILE: logWriter.js
// PATH: src/utils/logWriter.js
// VERSION: 0.0.3
// PURPOSE: Zarządzanie utrwalaniem logów błędów i wyników testów w systemie plików (userData) poprzez mostek IPC.
// FUNCTIONS: initLogWriter, appendTestFailLog, getLogsContent, clearLogsFile
// DEPENDS ON: logger.js, config.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logInfo, logError, logWarn, logDebug } from "./logger.js";
import { DEFAULT_SETTINGS } from '../config.js';

let logsEnabled = false;
let debugMode = false;

// ─── initLogWriter() – inicjalizuje system logowania testów
//   @returns {Promise<void>}
export async function initLogWriter() {
  try {
    const settingsRes = await window.electronAPI?.invoke?.('settings:get');
    const settings = settingsRes?.ok ? settingsRes.data : DEFAULT_SETTINGS;
    debugMode = settings.debugMode === true;
    logsEnabled = settings.logsEnabled === true;
    logDebug("store", `initLogWriter: debugMode=${debugMode}, logsEnabled=${logsEnabled}`);

    // Jeśli debugMode jest wyłączony – nie robimy nic
    if (!debugMode) {
      logsEnabled = false;
      logInfo("store", "initLogWriter: debug mode disabled, skipping log setup");
      return;
    }

    // Jeśli to pierwsze uruchomienie i jeszcze nie wyraził zgody
    if (settings.firstRun && !logsEnabled) {
      const granted = await askForLogPermission();
      if (granted) {
        await window.electronAPI?.saveSettings?.({ logsEnabled: true });
        logsEnabled = true;
        logInfo("store", "initLogWriter: log permission granted");
      } else {
        await window.electronAPI?.saveSettings?.({ logsEnabled: false });
        logsEnabled = false;
        logWarn("store", "initLogWriter: log permission denied");
      }
      await window.electronAPI?.saveSettings?.({ firstRun: false });
    }
  } catch (err) {
    logError("store", "initLogWriter failed", err.message);
    logWarn("store", "Nie udało się zainicjować zapisu logów");
    logsEnabled = false;
  }
}

// ─── t() – funkcja tłumaczenia (prosty proxy, zastąpiona przez TranslationContext w UI)
//   @param {string} key – klucz tłumaczenia
//   @param {Object} params – parametry interpolacji
//   @returns {string} przetłumaczony tekst lub klucz

// ─── t() – uproszczona funkcja tłumaczenia dla logWriter (fallback poza kontekstem React)
//   @param {string} key – klucz tłumaczenia
//   @param {Object} params – parametry interpolacji
//   @returns {string} przełumaczony tekst lub klucz
function t(key, params = {}) {
  const translations = {
    'logs.askForPermission': 'Czy zezwolić na zapisywanie logów testów?',
    'logs.unknownError': 'Nieznany błąd: {error}'
  };
  let result = translations[key] || key;
  Object.entries(params).forEach(([k, v]) => {
    result = result.replace(`{${k}}`, v);
  });
  return result;
}

// ─── askForLogPermission() – prosi użytkownika o zgodę na logowanie przez window.confirm
//   Uwaga: window.confirm jest tu celowy (logWriter działa poza aplikacją React)
//   @returns {Promise<boolean>} czy zgodę przyznano
async function askForLogPermission() {
  // Użyjemy modala (ConfirmModal) – tutaj uproszczona wersja
  return new Promise((resolve) => {
    const confirmed = window.confirm(t('logs.askForPermission'));
    resolve(confirmed);
  });
}

// ─── appendTestFailLog() – dodaje wpis o błędzie testu do pliku
//   @param {string} moduleName – nazwa modułu
//   @param {string} testName – nazwa testu
//   @param {string} details – szczegóły błędu
//   @returns {Promise<void>}
export async function appendTestFailLog(moduleName, testName, details) {
  if (!debugMode || !logsEnabled) return;

  try {
    const result = await window.electronAPI?.appendLogFile?.({
      level: 'fail',
      module: moduleName,
      test: testName,
      details,
      timestamp: Date.now()
    });
    if (!result || !result.ok) {
      logWarn("store", "appendTestFailLog: IPC call failed");
      throw new Error(t('logs.unknownError', { error: result?.error || '' }));
    }
    logDebug("store", `appendTestFailLog: logged failure for ${moduleName}.${testName}`);
  } catch (err) {
    logError("store", "appendTestFailLog failed", err.message);
    logWarn("store", "Nie udało się zapisać logu testu");
  }
}

// ─── getLogsContent() – pobiera zawartość pliku logów
//   @returns {Promise<string|null>}
export async function getLogsContent() {
  if (!debugMode || !logsEnabled) return null;
  try {
    const result = await window.electronAPI?.getLogsFile?.();
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

// ─── clearLogsFile() – czyści plik logów
//   @returns {Promise<boolean>}
export async function clearLogsFile() {
  if (!debugMode || !logsEnabled) return false;
  try {
    const result = await window.electronAPI?.clearLogsFile?.();
    if (result?.ok) {
      logInfo("store", "clearLogsFile: logs cleared");
    }
    return result?.ok === true;
  } catch (err) {
    logError("store", "clearLogsFile failed", err.message);
    logWarn("store", "Nie udało się wyczyścić logów");
    return false;
  }
}
