// =============================================================================
// FILE: logWriter.js
// PATH: src/utils/logWriter.js
// VERSION: 0.0.3
// PURPOSE: Zapis logów testów do pliku (tylko przy failu, gdy debugMode=true i logsEnabled=true).
// FUNCTIONS: initLogWriter, appendTestFailLog, getLogsContent, clearLogsFile
// DEPENDS ON: logger.js, config.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { logError } from './logger.js';
import { DEFAULT_SETTINGS } from '../config.js';

let logsEnabled = false;
let debugMode = false;
export async function initLogWriter() {
  try {
    const settings = await window.electronAPI?.getSettings?.() || DEFAULT_SETTINGS;
    debugMode = settings.debugMode === true;
    logsEnabled = settings.logsEnabled === true;
    // Jeśli debugMode jest wyłączony – nie robimy nic
    if (!debugMode) {
      logsEnabled = false;
      return;
    }
    // Jeśli to pierwsze uruchomienie i jeszcze nie wyraził zgody
    if (settings.firstRun && !logsEnabled) {
      const granted = await askForLogPermission();
      if (granted) {
        await window.electronAPI?.saveSettings?.({ logsEnabled: true });
        logsEnabled = true;
      } else {
        await window.electronAPI?.saveSettings?.({ logsEnabled: false });
        logsEnabled = false;
      }
      await window.electronAPI?.saveSettings?.({ firstRun: false });
    }
  } catch (err) {
    logError('initLogWriter failed', err);
    logsEnabled = false;
  }
}
async function askForLogPermission() {
  // Użyjemy modala (ConfirmModal) – tutaj uproszczona wersja
  return new Promise((resolve) => {
    const confirmed = window.confirm(t('logs.askForPermission'));
    resolve(confirmed);
  });
}
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
    if (!result || !result.ok) throw new Error(t('logs.unknownError', { error: result?.error || '' }));
  } catch (err) {
    logError('appendTestFailLog failed', err);
  }
}

export async function getLogsContent() {
  if (!debugMode || !logsEnabled) return null;
  try {
    const result = await window.electronAPI?.getLogsFile?.();
    if (result?.ok) return result.data;
    return null;
  } catch (err) {
    logError('getLogsContent failed', err);
    return null;
  }
}

export async function clearLogsFile() {
  if (!debugMode || !logsEnabled) return false;
  try {
    const result = await window.electronAPI?.clearLogsFile?.();
    return result?.ok === true;
  } catch (err) {
    logError('clearLogsFile failed', err);
    return false;
  }
}
