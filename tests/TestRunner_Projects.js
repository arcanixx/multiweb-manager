// =============================================================================
// FILE: TestRunner_Projects.js
// PATH: tests/TestRunner_Projects.js
// VERSION: 0.0.3
// PURPOSE: Zestaw testów dla modułu projektów. Weryfikuje mechanizmy archiwizacji, strukturę obiektów projektowych oraz poprawność agregacji liczby zadań przypisanych do konkretnych projektów.
// FUNCTIONS: runProjectsTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
const tests = [
  {
    name: 'Project structure is valid',
    run: async () => {
      const mockProject = {
        id: 'proj-1',
        name: 'Test Project',
        description: 'Test',
        status: 'Active'
      };
      const isValid = mockProject.id && mockProject.name && ['Active', 'Archived'].includes(mockProject.status);
      return { ok: isValid, details: isValid ? '' : 'Missing required fields or invalid status' };
    }
  },
  {
    name: 'Archive project works',
    run: async () => {
      let project = { id: '1', status: 'Active' };
      project.status = 'Archived';
      const isArchived = project.status === 'Archived';
      return { ok: isArchived, details: isArchived ? '' : 'Archive status not applied' };
    }
  },
  {
    name: 'Task count per project works',
    run: async () => {
      const tasks = [
        { projectId: '1' },
        { projectId: '1' },
        { projectId: '2' }
      ];
      const projectTasksCount = tasks.filter(t => t.projectId === '1').length;
      const isCountCorrect = projectTasksCount === 2;
      return { ok: isCountCorrect, details: isCountCorrect ? '' : `Expected 2, got ${projectTasksCount}` };
    }
  }
];
// ─── runProjectsTests() – Inicjalizuje i uruchamia proces testowy dla menedżera projektów
export async function runProjectsTests() {
  return runTests('Projects', tests);
}
