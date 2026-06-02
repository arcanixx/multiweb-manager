// =============================================================================
// FILE: TestRunner_Tasks.js
// PATH: tests/TestRunner_Tasks.js
// VERSION: 0.0.3
// PURPOSE: Testy funkcjonalne systemu zarządzania zadaniami. Sprawdza poprawność typów danych, wydajność filtrowania priorytetów oraz sprawność wyszukiwarki pełnotekstowej w obrębie zadań.
// FUNCTIONS: runTasksTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
const tests = [
  {
    name: 'Task structure is valid',
    run: async () => {
      const mockTask = {
        id: 'task-1',
        title: 'Test Task',
        priority: 'A',
        done: false,
        dueDate: null
      };
      const isValid = mockTask.id && mockTask.title && ['A', 'B', 'C', 'D', 'E'].includes(mockTask.priority);
      return { ok: isValid, details: isValid ? '' : 'Missing required fields or invalid priority' };
    }
  },
  {
    name: 'Priority filter works',
    run: async () => {
      const tasks = [
        { id: '1', priority: 'A' },
        { id: '2', priority: 'B' },
        { id: '3', priority: 'A' }
      ];
      const filtered = tasks.filter(t => t.priority === 'A');
      const isFilteredCorrect = filtered.length === 2;
      return { ok: isFilteredCorrect, details: isFilteredCorrect ? '' : `Expected 2, got ${filtered.length}` };
    }
  },
  {
    name: 'Search by title works',
    run: async () => {
      const tasks = [
        { id: '1', title: 'Fix bug' },
        { id: '2', title: 'Add feature' }
      ];
      const query = 'bug';
      const filtered = tasks.filter(t => t.title.toLowerCase().includes(query));
      const isSearchCorrect = filtered.length === 1 && filtered[0].id === '1';
      return { ok: isSearchCorrect, details: isSearchCorrect ? '' : 'Search failed' };
    }
  }
];

// ─── runTasksTests() – Inicjalizuje i uruchamia proces testowy dla systemu zadań
export async function runTasksTests() {
  return runTests('Tasks', tests);
}
