// =============================================================================
// FILE: ipcMainHandlers_jsonYaml.js
// PATH: src/ipc/ipcMainHandlers_jsonYaml.js
// VERSION: 0.0.3
// PURPOSE: IPC handlery dla JSON i YAML (formatowanie, konwersja)
// FUNCTIONS: ipc:tools:formatJSON, ipc:tools:yamlToJson, ipc:tools:jsonToYaml
// DEPENDS ON: electron, logger.js, yamlLoader.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from 'electron';
import { logError } from '../utils/logger.js';
import { loadYaml } from '../utils/yamlLoader.js';
// ─── ipc:tools:formatJSON – formatuje tekst JSON z wcięciami
//   Oczekuje: { text: string }
//   Zwraca: { ok: boolean, data?: string, error?: string }
ipcMain.handle('tools:formatJSON', async (_, text) => {
  try {
    const parsed = JSON.parse(text);
    const formatted = JSON.stringify(parsed, null, 2);
    return { ok: true, data: formatted };
  } catch (err) {
    logError('tools:formatJSON failed', err);
    return { ok: false, error: err.message };
  }
});
// ─── ipc:tools:yamlToJson – konwertuje YAML na sformatowany JSON
//   Oczekuje: { text: string }
//   Zwraca: { ok: boolean, data?: string, error?: string }
ipcMain.handle('tools:yamlToJson', async (_, text) => {
  try {
    const yaml = await loadYaml();
    if (!yaml) return { ok: false, error: 'YAML_MODULE_MISSING' };
    const parsed = yaml.load(text);
    const formatted = JSON.stringify(parsed, null, 2);
    return { ok: true, data: formatted };
  } catch (err) {
    logError('tools:yamlToJson failed', err);
    return { ok: false, error: err.message };
  }
});
// ─── ipc:tools:jsonToYaml – konwertuje JSON na YAML
//   Oczekuje: { text: string }
//   Zwraca: { ok: boolean, data?: string, error?: string }
ipcMain.handle('tools:jsonToYaml', async (_, text) => {
  try {
    const yaml = await loadYaml();
    if (!yaml) return { ok: false, error: 'YAML_MODULE_MISSING' };
    const parsed = JSON.parse(text);
    const formatted = yaml.dump(parsed);
    return { ok: true, data: formatted };
  } catch (err) {
    logError('tools:jsonToYaml failed', err);
    return { ok: false, error: err.message };
  }
});