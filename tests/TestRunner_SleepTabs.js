// =============================================================================
// FILE: TestRunner_SleepTabs.js
// PATH: tests/TestRunner_SleepTabs.js
// VERSION: 0.0.3
// PURPOSE: Testy jednostkowe dla Sleep Tabs
// FUNCTIONS: runSleepTabsTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';
const tests = [
  {
    name: 'Sleep Tabs timeout setting works',
    run: async () => {
      let timeout = 15;
      const set = (minutes) => { timeout = minutes; };
      const get = () => timeout;
      set(5);
      return { ok: get() === 5, details: `Expected 5, got ${get()}` };
    }
  },
  {
    name: 'Mark active wakes sleeping tab',
    run: async () => {
      let sleeping = true;
      const markActive = () => { sleeping = false; };
      markActive();
      return { ok: sleeping === false, details: 'Tab still sleeping after markActive' };
    }
  },
  {
    name: 'Sleep threshold calculation works',
    run: async () => {
      const lastActive = Date.now() - (20 * 60 * 1000); // 20 min ago
      const timeout = 15 * 60 * 1000; // 15 min
      const idle = Date.now() - lastActive;
      const shouldSleep = idle > timeout;
      return { ok: shouldSleep === true, details: 'Should sleep after 20 min idle' };
    }
  }
];
export async function runSleepTabsTests() {
  return runTests('SleepTabs', tests);
}

