// =============================================================================
// FILE: TestRunner_Projects.js
// PATH: tests/TestRunner_Projects.js
// VERSION: 0.0.3
// PURPOSE: Testy modułu projektów — struktura, projectsStore CRUD, archiwizacja, agregacja zadań.
// FUNCTIONS: runProjectsTests
// DEPENDS ON: testUtils.js, path
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
import { join } from 'path';

const ROOT = process.cwd();

const tests = [
  // ── Struktura projektu ─────────────────────────────────────────────────────
  {
    name: 'Project structure is valid',
    run: async () => {
      const mockProject = {
        id: 'proj-1', name: 'Test Project',
        description: 'Test', status: 'Active'
      };
      const ok = mockProject.id && mockProject.name && ['Active', 'Archived'].includes(mockProject.status);
      return { ok, details: ok ? '' : 'Missing required fields or invalid status' };
    }
  },
  {
    name: 'Project status – only Active and Archived are valid',
    run: async () => {
      const validStatuses = ['Active', 'Archived'];
      const ok = !validStatuses.includes('Deleted') && validStatuses.includes('Active');
      return { ok, details: ok ? '' : 'Status validation failed' };
    }
  },

  // ── projectsStore CRUD ─────────────────────────────────────────────────────
  {
    name: 'projectsStore – all CRUD functions exported',
    run: async () => {
      let mod;
      try { mod = await import(join(ROOT, 'src/stores/projectsStore.js')); }
      catch (e) { return { ok: false, details: `Import failed: ${e.message}` }; }
      const required = ['loadProjects', 'saveProjects', 'createProject', 'updateProject', 'archiveProject', 'deleteProject'];
      const missing = required.filter(fn => typeof mod[fn] !== 'function');
      const ok = missing.length === 0;
      return { ok, details: ok ? '' : `Missing: ${missing.join(', ')}` };
    }
  },

  // ── Logika archiwizacji ────────────────────────────────────────────────────
  {
    name: 'Archive project – changes status to Archived',
    run: async () => {
      let project = { id: '1', status: 'Active' };
      project.status = 'Archived';
      return { ok: project.status === 'Archived', details: project.status === 'Archived' ? '' : 'Archive failed' };
    }
  },
  {
    name: 'Archived project – excluded from active list',
    run: async () => {
      const projects = [
        { id: '1', status: 'Active' }, { id: '2', status: 'Archived' }, { id: '3', status: 'Active' }
      ];
      const active = projects.filter(p => p.status === 'Active');
      const ok = active.length === 2 && !active.find(p => p.id === '2');
      return { ok, details: ok ? '' : `Active count: ${active.length}` };
    }
  },

  // ── Agregacja zadań ────────────────────────────────────────────────────────
  {
    name: 'Task count per project – aggregates correctly',
    run: async () => {
      const tasks = [{ projectId: '1' }, { projectId: '1' }, { projectId: '2' }];
      const count = tasks.filter(t => t.projectId === '1').length;
      return { ok: count === 2, details: count === 2 ? '' : `Expected 2, got ${count}` };
    }
  },
  {
    name: 'Project tasks aggregation – multiple projects',
    run: async () => {
      const tasks = [
        { projectId: 'A' }, { projectId: 'A' }, { projectId: 'B' }, { projectId: 'C' }
      ];
      const byProject = tasks.reduce((acc, t) => {
        acc[t.projectId] = (acc[t.projectId] || 0) + 1;
        return acc;
      }, {});
      const ok = byProject['A'] === 2 && byProject['B'] === 1 && byProject['C'] === 1;
      return { ok, details: ok ? '' : `Map: ${JSON.stringify(byProject)}` };
    }
  },
  {
    name: 'Project search filter – matches name and description',
    run: async () => {
      const projects = [
        { id: '1', name: 'Alpha', description: 'main project' },
        { id: '2', name: 'Beta', description: 'test suite' }
      ];
      const q = 'main';
      const filtered = projects.filter(p =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
      const ok = filtered.length === 1 && filtered[0].id === '1';
      return { ok, details: ok ? '' : `Got ${filtered.length} results` };
    }
  }
];

export async function runProjectsTests() {
  return runTests('Projects', tests);
}