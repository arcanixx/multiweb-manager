// =============================================================================
// FILE: TestRunner_SearchIndex.js
// PATH: tests/TestRunner_SearchIndex.js
// VERSION: 0.0.3
// PURPOSE: Testy modułu globalnego wyszukiwania (src/utils/searchIndex.js) — buildSearchIndex, searchAll, filtrowanie i edge cases.
// FUNCTIONS: runSearchIndexTests
// DEPENDS ON: testUtils.js, path
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
import { join } from 'path';

const ROOT = process.cwd();

const tests = [
  {
    name: 'buildSearchIndex and searchAll exported as functions',
    run: async () => {
      const mod = await import(join(ROOT, 'src/utils/searchIndex.js'));
      const ok = typeof mod.buildSearchIndex === 'function' && typeof mod.searchAll === 'function';
      return { ok, details: ok ? '' : 'Missing exports' };
    }
  },
  {
    name: 'buildSearchIndex – returns all four groups',
    run: async () => {
      const { buildSearchIndex } = await import(join(ROOT, 'src/utils/searchIndex.js'));
      const idx = buildSearchIndex({ profiles: [], projects: [], tasks: [], notepad: [] });
      const ok = 'profiles' in idx && 'projects' in idx && 'tasks' in idx && 'notepad' in idx;
      return { ok, details: ok ? '' : `Keys: ${Object.keys(idx).join(', ')}` };
    }
  },
  {
    name: 'buildSearchIndex – maps profile to correct shape',
    run: async () => {
      const { buildSearchIndex } = await import(join(ROOT, 'src/utils/searchIndex.js'));
      const idx = buildSearchIndex({ profiles: [{ id: 'p1', name: 'Claude', url: 'https://claude.ai' }] });
      const item = idx.profiles[0];
      const ok = item.type === 'profile' && item.id === 'p1' && item.label === 'Claude' && item.sub === 'https://claude.ai';
      return { ok, details: ok ? '' : `Got: ${JSON.stringify(item)}` };
    }
  },
  {
    name: 'buildSearchIndex – maps task to correct shape',
    run: async () => {
      const { buildSearchIndex } = await import(join(ROOT, 'src/utils/searchIndex.js'));
      const idx = buildSearchIndex({ tasks: [{ id: 't1', title: 'Fix bug', description: 'urgent' }] });
      const item = idx.tasks[0];
      const ok = item.type === 'task' && item.label === 'Fix bug' && item.sub === 'urgent';
      return { ok, details: ok ? '' : `Got: ${JSON.stringify(item)}` };
    }
  },
  {
    name: 'buildSearchIndex – notepad sub is truncated to 80 chars',
    run: async () => {
      const { buildSearchIndex } = await import(join(ROOT, 'src/utils/searchIndex.js'));
      const longContent = 'x'.repeat(200);
      const idx = buildSearchIndex({ notepad: [{ id: 'n1', title: 'Note', content: longContent }] });
      const ok = idx.notepad[0].sub.length === 80;
      return { ok, details: ok ? '' : `sub.length=${idx.notepad[0].sub.length}` };
    }
  },
  {
    name: 'searchAll – empty query returns empty results',
    run: async () => {
      const { buildSearchIndex, searchAll } = await import(join(ROOT, 'src/utils/searchIndex.js'));
      const idx = buildSearchIndex({ profiles: [{ id: 'p1', name: 'Claude', url: 'https://claude.ai' }] });
      const results = searchAll(idx, '');
      const allEmpty = Object.values(results).every(arr => arr.length === 0);
      return { ok: allEmpty, details: allEmpty ? '' : 'Non-empty results for empty query' };
    }
  },
  {
    name: 'searchAll – finds match in label (case-insensitive)',
    run: async () => {
      const { buildSearchIndex, searchAll } = await import(join(ROOT, 'src/utils/searchIndex.js'));
      const idx = buildSearchIndex({
        profiles: [
          { id: 'p1', name: 'Claude AI', url: 'https://claude.ai' },
          { id: 'p2', name: 'DeepSeek', url: 'https://deepseek.com' }
        ]
      });
      const results = searchAll(idx, 'CLAUDE');
      const ok = results.profiles.length === 1 && results.profiles[0].id === 'p1';
      return { ok, details: ok ? '' : `Got ${results.profiles.length} results` };
    }
  },
  {
    name: 'searchAll – finds match in sub field',
    run: async () => {
      const { buildSearchIndex, searchAll } = await import(join(ROOT, 'src/utils/searchIndex.js'));
      const idx = buildSearchIndex({
        projects: [
          { id: 'pr1', name: 'Alpha', description: 'main project backend' },
          { id: 'pr2', name: 'Beta', description: 'frontend only' }
        ]
      });
      const results = searchAll(idx, 'backend');
      const ok = results.projects.length === 1 && results.projects[0].id === 'pr1';
      return { ok, details: ok ? '' : `Got ${results.projects.length} results` };
    }
  },
  {
    name: 'searchAll – no false positives across groups',
    run: async () => {
      const { buildSearchIndex, searchAll } = await import(join(ROOT, 'src/utils/searchIndex.js'));
      const idx = buildSearchIndex({
        profiles: [{ id: 'p1', name: 'Xyz', url: 'https://xyz.com' }],
        tasks: [{ id: 't1', title: 'Something else', description: '' }]
      });
      const results = searchAll(idx, 'xyz');
      const ok = results.profiles.length === 1 && results.tasks.length === 0;
      return { ok, details: ok ? '' : `profiles=${results.profiles.length}, tasks=${results.tasks.length}` };
    }
  },
  {
    name: 'buildSearchIndex – handles missing optional fields gracefully',
    run: async () => {
      const { buildSearchIndex } = await import(join(ROOT, 'src/utils/searchIndex.js'));
      let threw = false;
      try {
        buildSearchIndex({
          tasks: [{ id: 't1', title: 'No description' }], // brak description
          notepad: [{ id: 'n1', title: 'No content' }]    // brak content
        });
      } catch { threw = true; }
      return { ok: !threw, details: threw ? 'Threw on missing optional fields' : '' };
    }
  }
];

export async function runSearchIndexTests() {
  return runTests('SearchIndex', tests);
}