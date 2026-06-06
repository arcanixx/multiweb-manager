// =============================================================================
// FILE: TestRunner_SleepTabs.js
// PATH: tests/TestRunner_SleepTabs.js
// VERSION: 0.0.3
// PURPOSE: Testy jednostkowe dla Sleep Tabs – sleepTabsManager (getSleepTimeoutMs, shouldSleepTab, markTabActive, getSleepPlaceholderState)
// FUNCTIONS: runSleepTabsTests
// DEPENDS ON: testUtils.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { runTests } from './testUtils.js';


const tests = [
  // ─── Eksporty modułu
  {
    name: 'sleepTabsManager – wszystkie funkcje eksportowane',
    run: async () => {
      const mod = await import('../src/engine/sleepTabsManager.js');
      const wymagane = ['getSleepTimeoutMs', 'shouldSleepTab', 'markTabActive', 'getSleepPlaceholderState'];
      const brakujace = wymagane.filter(f => typeof mod[f] !== 'function');
      const ok = brakujace.length === 0;
      return { ok, details: ok ? '' : `Brakujące: ${brakujace.join(', ')}` };
    }
  },

  // ─── getSleepTimeoutMs
  {
    name: 'getSleepTimeoutMs – zwraca liczbę > 0',
    run: async () => {
      const { getSleepTimeoutMs } = await import('../src/engine/sleepTabsManager.js');
      const ms = getSleepTimeoutMs();
      const ok = typeof ms === 'number' && ms > 0;
      return { ok, details: ok ? '' : `Otrzymano: ${ms}` };
    }
  },
  {
    name: 'getSleepTimeoutMs – domyślnie 15 minut (900000ms)',
    run: async () => {
      const { getSleepTimeoutMs } = await import('../src/engine/sleepTabsManager.js');
      const ms = getSleepTimeoutMs();
      const ok = ms === 15 * 60 * 1000;
      return { ok, details: ok ? '' : `Oczekiwano 900000, otrzymano ${ms}` };
    }
  },

  // ─── shouldSleepTab
  {
    name: 'shouldSleepTab – zwraca false dla aktywnej zakładki (lastActive = teraz)',
    run: async () => {
      const { shouldSleepTab } = await import('../src/engine/sleepTabsManager.js');
      const ok = shouldSleepTab(Date.now()) === false;
      return { ok, details: ok ? '' : 'Świeża zakładka nie powinna być uśpiona' };
    }
  },
  {
    name: 'shouldSleepTab – zwraca true po przekroczeniu timeoutu',
    run: async () => {
      const { shouldSleepTab } = await import('../src/engine/sleepTabsManager.js');
      const dawnoTemu = Date.now() - (20 * 60 * 1000); // 20 min temu
      const ok = shouldSleepTab(dawnoTemu) === true;
      return { ok, details: ok ? '' : 'Zakładka idle 20min powinna być uśpiona (timeout 15min)' };
    }
  },

  // ─── markTabActive
  {
    name: 'markTabActive – zwraca timestamp (number)',
    run: async () => {
      const { markTabActive } = await import('../src/engine/sleepTabsManager.js');
      const ts = markTabActive('tab-test-id');
      const ok = typeof ts === 'number' && ts > 0;
      return { ok, details: ok ? '' : `Otrzymano: ${ts}` };
    }
  },

  // ─── getSleepPlaceholderState
  {
    name: 'getSleepPlaceholderState – zwraca obiekt z polem sleeping',
    run: async () => {
      const { getSleepPlaceholderState } = await import('../src/engine/sleepTabsManager.js');
      const state = getSleepPlaceholderState('tab-test-id');
      const ok = typeof state === 'object' && state !== null && 'sleeping' in state;
      return { ok, details: ok ? '' : `Nieoczekiwana struktura: ${JSON.stringify(state)}` };
    }
  },

  // ─── Logika timeout (izolowana)
  {
    name: 'Timeout calc – idle 20min > 15min timeout',
    run: async () => {
      const lastActive = Date.now() - (20 * 60 * 1000);
      const timeout = 15 * 60 * 1000;
      const idle = Date.now() - lastActive;
      const ok = idle > timeout;
      return { ok, details: ok ? '' : `idle: ${idle}ms, timeout: ${timeout}ms` };
    }
  },
  {
    name: 'Timeout calc – idle 5min < 15min timeout',
    run: async () => {
      const lastActive = Date.now() - (5 * 60 * 1000);
      const timeout = 15 * 60 * 1000;
      const idle = Date.now() - lastActive;
      const ok = idle < timeout;
      return { ok, details: ok ? '' : 'Świeża zakładka nie powinna przekraczać timeoutu' };
    }
  },
];

export async function runSleepTabsTests() {
  return runTests('SleepTabs', tests);
}
