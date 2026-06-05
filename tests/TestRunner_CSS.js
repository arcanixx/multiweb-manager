// =============================================================================
// FILE: TestRunner_CSS.js
// PATH: tests/TestRunner_CSS.js
// VERSION: 0.0.3
// PURPOSE: Testy spójności plików CSS — src/ui/index.css importuje layout.css + styles/theme.css + styles/components.css, brak kołowych zależności.
// FUNCTIONS: runCssTests
// DEPENDS ON: fs, path, testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { runTests } from './testUtils.js';

const UI_DIR    = join(process.cwd(), 'src', 'ui');
const STYLES_DIR = join(UI_DIR, 'styles');

// Oczekiwana kolejność importów w index.css
const EXPECTED_IMPORTS = [
  './layout.css',
  './styles/theme.css',
  './styles/components.css'
];

const IMPORT_RE = /@import\s+['"]([^'"]+)['"]/g;

function extractImports(content) {
  const imports = [];
  let m;
  IMPORT_RE.lastIndex = 0;
  while ((m = IMPORT_RE.exec(content)) !== null) imports.push(m[1]);
  return imports;
}

const tests = [
  {
    name: 'src/ui/index.css exists',
    run: async () => {
      const exists = existsSync(join(UI_DIR, 'index.css'));
      return { ok: exists, details: exists ? '' : 'src/ui/index.css not found' };
    }
  },
  {
    name: 'src/ui/layout.css exists',
    run: async () => {
      const exists = existsSync(join(UI_DIR, 'layout.css'));
      return { ok: exists, details: exists ? '' : 'src/ui/layout.css not found' };
    }
  },
  {
    name: 'src/ui/styles/theme.css exists',
    run: async () => {
      const exists = existsSync(join(STYLES_DIR, 'theme.css'));
      return { ok: exists, details: exists ? '' : 'src/ui/styles/theme.css not found' };
    }
  },
  {
    name: 'src/ui/styles/components.css exists',
    run: async () => {
      const exists = existsSync(join(STYLES_DIR, 'components.css'));
      return { ok: exists, details: exists ? '' : 'src/ui/styles/components.css not found' };
    }
  },
  {
    name: 'index.css imports are in correct order',
    run: async () => {
      const indexPath = join(UI_DIR, 'index.css');
      if (!existsSync(indexPath)) return { ok: false, details: 'index.css not found' };
      const imports = extractImports(readFileSync(indexPath, 'utf-8'));
      // Sprawdzamy czy wszystkie oczekiwane są obecne i w kolejności
      const positions = EXPECTED_IMPORTS.map(imp => imports.indexOf(imp));
      const allFound = positions.every(p => p !== -1);
      const inOrder  = positions.every((p, i) => i === 0 || p > positions[i - 1]);
      const ok = allFound && inOrder;
      const details = !allFound
        ? `Missing imports: ${EXPECTED_IMPORTS.filter(i => !imports.includes(i)).join(', ')}`
        : !inOrder ? 'Imports not in expected order' : '';
      return { ok, details };
    }
  },
  {
    name: 'All CSS files imported by index.css actually exist',
    run: async () => {
      const indexPath = join(UI_DIR, 'index.css');
      if (!existsSync(indexPath)) return { ok: false, details: 'index.css not found' };
      const imports = extractImports(readFileSync(indexPath, 'utf-8'));
      const missing = imports.filter(imp => !existsSync(join(UI_DIR, imp)));
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Missing: ${missing.join(', ')}` };
    }
  },
  {
    name: 'No CSS file imports itself (no self-circular dependency)',
    run: async () => {
      const files = [
        { path: join(UI_DIR, 'index.css'), name: 'index.css' },
        { path: join(UI_DIR, 'layout.css'), name: 'layout.css' },
        { path: join(STYLES_DIR, 'theme.css'), name: 'theme.css' },
        { path: join(STYLES_DIR, 'components.css'), name: 'components.css' }
      ];
      const errors = [];
      for (const { path, name } of files) {
        if (!existsSync(path)) continue;
        const imports = extractImports(readFileSync(path, 'utf-8'));
        if (imports.some(i => i.includes(name))) errors.push(`${name} imports itself`);
      }
      const ok = errors.length === 0;
      return { ok, details: ok ? '' : errors.join('; ') };
    }
  }
];

export async function runCssTests() {
  return runTests('CSS', tests);
}
