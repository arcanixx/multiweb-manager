// =============================================================================
// FILE: TestRunner_Doc.js
// PATH: tests/TestRunner_Doc.js
// VERSION: 0.0.3
// PURPOSE: Testy spójności dokumentacji w folderze doc/ — obecność plików, nagłówki MD, README.
// FUNCTIONS: runDocTests
// DEPENDS ON: fs, testUtils.js, path
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { readdirSync, readFileSync, existsSync } from 'fs';
import { runTests } from './testUtils.js';
import { join } from 'path';

const DOC_DIR = join(process.cwd(), 'doc');

// Wszystkie pliki obecne w doc/ na branchu UAT-v0.0.4
// UWAGA: TestCases_Suggestion.md jest generowany przez build_structure.py – jest tu celowo
const EXPECTED_DOC_FILES = [
  'AI_Development_Standards.md',
  'AI_Repository_Access.md',
  'Definition_Mockups_UI_UX.md',
  'DevelopersGuide.md',
  'Global_Project_Starter_Guide.md',
  'ModulesOverview.md',
  'Project_Initialization_Guide.md',
  'Requirements.md',
  'Structure.md',
  'Structure_light.md',
  'TestCases_Suggestion.md',
  'pending_updates_for_Definition_Mockups_UI_UX.md'
];

// Pliki które mogą nie mieć formalnego nagłówka (generowane lub tymczasowe)
const NO_HEADER_REQUIRED = [
  'pending_updates_for_Definition_Mockups_UI_UX.md',
  'TestCases_Suggestion.md'
];

const HEADER_PATTERN = /<!--\s*={5,}\n FILE: (.+?)\n PATH: (.+?)\n VERSION: (.+?)\n PURPOSE: (.+?)\n FUNCTIONS: (.+?)\n DEPENDS ON: (.+?)\n UWAGA: (.+?)\n ={5,}\s*-->/s;

const tests = [
  {
    name: 'doc/ directory exists',
    run: async () => {
      const exists = existsSync(DOC_DIR);
      return { ok: exists, details: exists ? '' : 'doc/ directory not found' };
    }
  },
  {
    name: 'All expected doc files exist',
    run: async () => {
      if (!existsSync(DOC_DIR)) return { ok: false, details: 'doc/ directory not found' };
      const existing = readdirSync(DOC_DIR).filter(f => f.endsWith('.md'));
      const missing = EXPECTED_DOC_FILES.filter(f => !existing.includes(f));
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Missing: ${missing.join(', ')}` };
    }
  },
  {
    name: 'No extra .md files in doc/ (update EXPECTED_DOC_FILES if added)',
    run: async () => {
      if (!existsSync(DOC_DIR)) return { ok: false, details: 'doc/ directory not found' };
      const existing = readdirSync(DOC_DIR).filter(f => f.endsWith('.md'));
      const extra = existing.filter(f => !EXPECTED_DOC_FILES.includes(f));
      const ok = extra.length === 0;
      return { ok, details: ok ? '' : `Extra files: ${extra.join(', ')} — add to EXPECTED_DOC_FILES or remove` };
    }
  },
  {
    name: 'Core doc files have valid MD headers',
    run: async () => {
      if (!existsSync(DOC_DIR)) return { ok: false, details: 'doc/ directory not found' };
      const toCheck = EXPECTED_DOC_FILES.filter(f => !NO_HEADER_REQUIRED.includes(f));
      const errors = [];
      for (const file of toCheck) {
        const filePath = join(DOC_DIR, file);
        if (!existsSync(filePath)) { errors.push(`${file}: not found`); continue; }
        const content = readFileSync(filePath, 'utf-8');
        const match = content.match(HEADER_PATTERN);
        if (!match) { errors.push(`${file}: missing or invalid header`); continue; }
        const [, fileName, , version, purpose] = match;
        if (fileName !== file) errors.push(`${file}: FILE mismatch (got ${fileName})`);
        if (!version.match(/^\d+\.\d+\.\d+$/)) errors.push(`${file}: VERSION format invalid`);
        if (!purpose || purpose.trim() === '') errors.push(`${file}: PURPOSE is empty`);
      }
      const ok = errors.length === 0;
      return { ok, details: ok ? '' : errors.join('; ') };
    }
  },
  {
    name: 'README.md exists in root',
    run: async () => {
      const exists = existsSync(join(process.cwd(), 'README.md'))
                  || existsSync(join(process.cwd(), 'readme.md'));
      return { ok: exists, details: exists ? '' : 'README.md not found in root' };
    }
  },
  {
    name: 'Structure.md and Structure_light.md both exist',
    run: async () => {
      const a = existsSync(join(DOC_DIR, 'Structure.md'));
      const b = existsSync(join(DOC_DIR, 'Structure_light.md'));
      const ok = a && b;
      return { ok, details: ok ? '' : `Structure.md=${a}, Structure_light.md=${b}` };
    }
  }
];

export async function runDocTests() {
  return runTests('Doc', tests);
}
