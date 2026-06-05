// =============================================================================
// FILE: ipcMainHandlers_jsonYaml.js
// PATH: src/ipc/ipcMainHandlers_jsonYaml.js
// VERSION: 0.0.3
// PURPOSE: IPC handlery dla JSON i YAML (formatowanie, konwersja)
// FUNCTIONS: const:IPC_CHANNELS.TOOLS.FORMAT_JSON, const:IPC_CHANNELS.TOOLS.YAML_TO_JSON, const:IPC_CHANNELS.TOOLS.JSON_TO_YAML
// DEPENDS ON: electron, logger.js, yamlLoader.js, ipcChannels.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ipcMain } from 'electron';
import { logError } from '../utils/logger.js';
import { loadYaml } from '../utils/yamlLoader.js';
import { IPC_CHANNELS } from '../constants/ipcChannels.js';
// ─── ipc:tools:formatJSON – formatuje tekst JSON z wcięciami
//   Oczekuje: { text: string }
//   Zwraca: { ok: boolean, data?: string, error?: string }
ipcMain.handle(IPC_CHANNELS.TOOLS.FORMAT_JSON, async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'object' || !('text' in payload)) {
      throw new Error('INVALID_PAYLOAD');
    }
    const { text } = payload;
    const parsed = JSON.parse(text);
    const formatted = JSON.stringify(parsed, null, 2);
    return { ok: true, data: formatted };
  } catch (err) {
    logError('ipc', 'tools:formatJSON failed', err);
    return { ok: false, error: err.message };
  }
});
// ─── ipc:tools:yamlToJson – konwertuje YAML na sformatowany JSON
//   Oczekuje: { text: string }
//   Zwraca: { ok: boolean, data?: string, error?: string }
ipcMain.handle(IPC_CHANNELS.TOOLS.YAML_TO_JSON, async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'object' || !('text' in payload)) {
      throw new Error('INVALID_PAYLOAD');
    }
    const { text } = payload;
    const yaml = await loadYaml();
    if (!yaml) return { ok: false, error: 'YAML_MODULE_MISSING' };
    const parsed = yaml.load(text);
    const formatted = JSON.stringify(parsed, null, 2);
    return { ok: true, data: formatted };
  } catch (err) {
    logError('ipc', 'tools:yamlToJson failed', err);
    return { ok: false, error: err.message };
  }
});
// ─── ipc:tools:jsonToYaml – konwertuje JSON na YAML
//   Oczekuje: { text: string }
//   Zwraca: { ok: boolean, data?: string, error?: string }
ipcMain.handle(IPC_CHANNELS.TOOLS.JSON_TO_YAML, async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'object' || !('text' in payload)) {
      throw new Error('INVALID_PAYLOAD');
    }
    const { text } = payload;
    const yaml = await loadYaml();
    if (!yaml) return { ok: false, error: 'YAML_MODULE_MISSING' };
    const parsed = JSON.parse(text);
    const formatted = yaml.dump(parsed);
    return { ok: true, data: formatted };
  } catch (err) {
    logError('ipc', 'tools:jsonToYaml failed', err);
    return { ok: false, error: err.message };
  }
});