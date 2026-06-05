// =============================================================================
// FILE: TestRunner_IpcChannels.js
// PATH: tests/TestRunner_IpcChannels.js
// VERSION: 0.0.3
// PURPOSE: Testy rejestru kanałów IPC (src/constants/ipcChannels.js) — kompletność grup, brak duplikatów wartości, format string 'group:action'.
// FUNCTIONS: runIpcChannelsTests
// DEPENDS ON: testUtils.js, path
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
import { join } from 'path';

const ROOT = process.cwd();

const tests = [
  {
    name: 'IPC_CHANNELS – exported from ipcChannels.js',
    run: async () => {
      const mod = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      const ok = mod.IPC_CHANNELS && typeof mod.IPC_CHANNELS === 'object';
      return { ok, details: ok ? '' : 'IPC_CHANNELS not exported' };
    }
  },
  {
    name: 'IPC_CHANNELS – required top-level groups exist',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      const required = ['PROFILES', 'SETTINGS', 'TASKS', 'PROJECTS', 'NOTEPAD',
        'HISTORY', 'WORKSPACES', 'TOOLS', 'WEBVIEW', 'SYSTEM'];
      const missing = required.filter(g => !(g in IPC_CHANNELS));
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Missing groups: ${missing.join(', ')}` };
    }
  },
  {
    name: 'IPC_CHANNELS – all leaf values are strings',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      const errors = [];
      const walk = (obj, path) => {
        for (const [k, v] of Object.entries(obj)) {
          if (typeof v === 'object') walk(v, `${path}.${k}`);
          else if (typeof v !== 'string') errors.push(`${path}.${k} is ${typeof v}`);
        }
      };
      walk(IPC_CHANNELS, 'IPC_CHANNELS');
      return { ok: errors.length === 0, details: errors.join('; ') };
    }
  },
  {
    name: 'IPC_CHANNELS – all values follow group:action format',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      const invalid = [];
      const walk = (obj) => {
        for (const v of Object.values(obj)) {
          if (typeof v === 'object') walk(v);
          else if (!/^[a-z][a-zA-Z]+:[a-zA-Z]/.test(v)) invalid.push(v);
        }
      };
      walk(IPC_CHANNELS);
      return { ok: invalid.length === 0, details: invalid.length ? `Bad format: ${invalid.slice(0,5).join(', ')}` : '' };
    }
  },
  {
    name: 'IPC_CHANNELS – no duplicate channel values',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      const values = [];
      const walk = (obj) => {
        for (const v of Object.values(obj)) {
          if (typeof v === 'object') walk(v);
          else values.push(v);
        }
      };
      walk(IPC_CHANNELS);
      const dupes = values.filter((v, i) => values.indexOf(v) !== i);
      const ok = dupes.length === 0;
      return { ok, details: ok ? '' : `Duplicates: ${[...new Set(dupes)].join(', ')}` };
    }
  },
  {
    name: 'IPC_CHANNELS.PROFILES – CRUD channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      const required = ['GET_ALL', 'CREATE', 'UPDATE', 'DELETE'];
      const missing = required.filter(k => !(k in IPC_CHANNELS.PROFILES));
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  },
  {
    name: 'IPC_CHANNELS.SETTINGS – GET and UPDATE channels defined',
    run: async () => {
      const { IPC_CHANNELS } = await import(join(ROOT, 'src/constants/ipcChannels.js'));
      const required = ['GET', 'UPDATE'];
      const missing = required.filter(k => !(k in IPC_CHANNELS.SETTINGS));
      return { ok: missing.length === 0, details: missing.length ? `Missing: ${missing.join(', ')}` : '' };
    }
  }
];

export async function runIpcChannelsTests() {
  return runTests('IpcChannels', tests);
}