// =============================================================================
// FILE: TestRunner_Assets.js
// PATH: tests/TestRunner_Assets.js
// VERSION: 0.0.3
// PURPOSE: Testy spójności plików w folderze assets/ — obecność, rozszerzenia, rozmiar.
// FUNCTIONS: runAssetsTests
// DEPENDS ON: fs, path, testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { readdirSync, existsSync, statSync } from 'fs';
import { join } from 'path';
import { runTests } from './testUtils.js';

const ASSETS_DIR = join(process.cwd(), 'assets');

const EXPECTED_ASSET_FILES = [
  'app-icon.ico',
  'app-icon.png',
  'multiweb_manager_architecture_graph.png',
  'splash_logo.svg'
];

const ALLOWED_EXTENSIONS = ['.ico', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.bmp', '.tiff', '.webp'];

const tests = [
  {
    name: 'assets/ directory exists',
    run: async () => {
      const exists = existsSync(ASSETS_DIR);
      return { ok: exists, details: exists ? '' : 'assets/ directory not found' };
    }
  },
  {
    name: 'All expected asset files exist',
    run: async () => {
      if (!existsSync(ASSETS_DIR)) return { ok: false, details: 'assets/ directory not found' };
      const existing = readdirSync(ASSETS_DIR);
      const missing = EXPECTED_ASSET_FILES.filter(f => !existing.includes(f));
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Missing: ${missing.join(', ')}` };
    }
  },
  {
    name: 'No unexpected file extensions in assets/',
    run: async () => {
      if (!existsSync(ASSETS_DIR)) return { ok: false, details: 'assets/ directory not found' };
      const existing = readdirSync(ASSETS_DIR);
      const wrongExt = existing.filter(f => {
        const ext = f.slice(f.lastIndexOf('.')).toLowerCase();
        return !ALLOWED_EXTENSIONS.includes(ext);
      });
      const ok = wrongExt.length === 0;
      return { ok, details: ok ? '' : `Wrong extensions: ${wrongExt.join(', ')}` };
    }
  },
  {
    name: 'All asset files are non-empty',
    run: async () => {
      if (!existsSync(ASSETS_DIR)) return { ok: false, details: 'assets/ directory not found' };
      const errors = [];
      for (const file of readdirSync(ASSETS_DIR)) {
        const stats = statSync(join(ASSETS_DIR, file));
        if (stats.size === 0) errors.push(`${file}: empty`);
      }
      const ok = errors.length === 0;
      return { ok, details: ok ? '' : errors.join('; ') };
    }
  },
  {
    name: 'app-icon.ico and app-icon.png both exist (required for Electron)',
    run: async () => {
      const ico = existsSync(join(ASSETS_DIR, 'app-icon.ico'));
      const png = existsSync(join(ASSETS_DIR, 'app-icon.png'));
      const ok = ico && png;
      return { ok, details: ok ? '' : `ico=${ico}, png=${png}` };
    }
  },
  {
    name: 'splash_logo.svg exists (splash screen)',
    run: async () => {
      const exists = existsSync(join(ASSETS_DIR, 'splash_logo.svg'));
      return { ok: exists, details: exists ? '' : 'splash_logo.svg missing' };
    }
  }
];

export async function runAssetsTests() {
  return runTests('Assets', tests);
}
