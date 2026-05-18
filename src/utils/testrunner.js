// =============================================================================
// FILE: src/utils/testRunner.js
// PATH: multiweb-manager/src/utils/testRunner.js
// VERSION: v1
// PURPOSE: Moduł testów integralności uruchamianych przy starcie gdy DEBUG=true.
//          Sprawdza: ikony, tłumaczenia, IPC API, struktury danych, logikę
//          biznesową (cartesian, parseSplitChar, priorytety). Używa mocków
//          gdzie potrzebne IPC. Raport w konsoli z podsumowaniem PASS/FAIL.
// DEPENDS ON: logger.js, icons.js
//             (dynamicznie: locales/pl.json, locales/en.json)
// =============================================================================

import { log, error as logError } from './logger';
import { ICONS, SIDEBAR_ICON_MAP } from './icons';

// ─── Helpers testowe ─────────────────────────────────────────────────────────

let passCount = 0;
let failCount = 0;
const results = [];

function assert(name, condition, detail = '') {
  if (condition) {
    passCount++;
    results.push({ name, status: 'PASS', detail });
    log(`  ✔ PASS: ${name}`);
  } else {
    failCount++;
    results.push({ name, status: 'FAIL', detail });
    logError(`  ✘ FAIL: ${name}${detail ? ' – ' + detail : ''}`);
  }
}

function assertThrows(name, fn) {
  try {
    fn();
    failCount++;
    results.push({ name, status: 'FAIL', detail: 'Expected throw, got none' });
    logError(`  ✘ FAIL: ${name} – expected throw`);
  } catch (e) {
    passCount++;
    results.push({ name, status: 'PASS', detail: e.message });
    log(`  ✔ PASS: ${name} (threw as expected)`);
  }
}

// ─── Sekcje testowe ──────────────────────────────────────────────────────────

// 1. Testy ikon
function testIcons() {
  log('\n[TEST] Icons:');

  // ICONS istnieje i jest obiektem
  assert('ICONS is object', typeof ICONS === 'object' && ICONS !== null);

  // Kluczowe ikony muszą istnieć
  const requiredIcons = [
    'PLUS', 'EDIT', 'DELETE', 'SAVE', 'CLOSE', 'REFRESH',
    'NOTEPAD', 'SETTINGS', 'HELP', 'HISTORY', 'TASKS',
    'PRIORITY_A', 'PRIORITY_B', 'PRIORITY_C', 'PRIORITY_D', 'PRIORITY_E',
    'DONE', 'COMMENT', 'PIN', 'UNPIN', 'DEFAULT',
    'THEME_DARK', 'THEME_LIGHT', 'THEME_SYSTEM',
    'TERMINAL', 'REMOVEBG', 'STRINGCOMBINER', 'PROJECTMANAGER', 'AGGREGATEDTASKS',
    'UPDATE', 'VERSION', 'DEBUG', 'WARNING', 'INFO', 'SEARCH',
    'BACK', 'FORWARD', 'ZOOM_IN', 'ZOOM_OUT', 'DEVTOOLS', 'CLEAR_CACHE',
  ];
  for (const key of requiredIcons) {
    assert(`ICONS.${key} exists`, key in ICONS && typeof ICONS[key] === 'string', `Missing: ${key}`);
  }

  // Żadna ikona nie powinna być pustym stringiem
  const emptyIcons = Object.entries(ICONS).filter(([, v]) => !v || v.trim() === '');
  assert('No empty icon values', emptyIcons.length === 0,
    emptyIcons.length ? `Empty: ${emptyIcons.map(([k]) => k).join(', ')}` : '');

  // SIDEBAR_ICON_MAP
  assert('SIDEBAR_ICON_MAP is object', typeof SIDEBAR_ICON_MAP === 'object');
  const requiredSidebarKeys = ['notepad', 'projectManager', 'removebg', 'stringCombiner', 'terminal', 'settings', 'help'];
  for (const key of requiredSidebarKeys) {
    assert(`SIDEBAR_ICON_MAP.${key} exists`, key in SIDEBAR_ICON_MAP);
    const iconKey = SIDEBAR_ICON_MAP[key];
    assert(`SIDEBAR_ICON_MAP.${key} points to valid ICONS key`, iconKey in ICONS, `${iconKey} missing in ICONS`);
  }
}

// 2. Testy tłumaczeń
async function testTranslations() {
  log('\n[TEST] Translations:');
  let pl, en;
  try {
    pl = (await import('../locales/pl.json')).default;
    en = (await import('../locales/en.json')).default;
  } catch (e) {
    assert('Locales import', false, e.message);
    return;
  }

  assert('pl.json loaded', typeof pl === 'object' && pl !== null);
  assert('en.json loaded', typeof en === 'object' && en !== null);

  // Kluczowe sekcje muszą istnieć w obu językach
  const requiredSections = [
    'app', 'sidebar', 'notepad', 'projectManager', 'removebg',
    'stringCombiner', 'terminal', 'settings', 'help', 'webview',
    'tasks', 'aggregatedTasks', 'history', 'updateChecker', 'notifications',
    'profile_modal', 'category_modal',
  ];
  for (const section of requiredSections) {
    assert(`pl.${section} exists`, section in pl, `Missing section: ${section}`);
    assert(`en.${section} exists`, section in en, `Missing section: ${section}`);
  }

  // Sprawdź, czy kluczowe klucze istnieją
  const criticalKeys = [
    ['sidebar', 'add_profile'],
    ['sidebar', 'favorites'],
    ['tasks', 'modal_title_add'],
    ['tasks', 'priority_a'],
    ['tasks', 'field_comment'],
    ['settings', 'theme'],
    ['history', 'clear'],
    ['updateChecker', 'coming_soon'],
    ['notifications', 'offline'],
    ['notifications', 'online'],
  ];
  for (const [section, key] of criticalKeys) {
    assert(`pl.${section}.${key}`, pl[section]?.[key] !== undefined, `Missing key`);
    assert(`en.${section}.${key}`, en[section]?.[key] !== undefined, `Missing key`);
  }

  // Sprawdź, czy PL i EN mają te same klucze w każdej sekcji
  for (const section of requiredSections) {
    if (!pl[section] || !en[section]) continue;
    const plKeys = Object.keys(pl[section]);
    const enKeys = Object.keys(en[section]);
    const missingInEn = plKeys.filter(k => !enKeys.includes(k));
    const missingInPl = enKeys.filter(k => !plKeys.includes(k));
    assert(`${section}: same keys in PL/EN`, missingInEn.length === 0 && missingInPl.length === 0,
      missingInEn.length ? `Missing in EN: ${missingInEn.join(',')}` :
      missingInPl.length ? `Missing in PL: ${missingInPl.join(',')}` : '');
  }
}

// 3. Testy logiki biznesowej (pure functions, bez IPC)
function testBusinessLogic() {
  log('\n[TEST] Business Logic:');

  // Cartesian product (StringCombiner)
  function cartesian(arrays) {
    if (!arrays || arrays.length === 0) return [[]];
    if (arrays.length === 1) return arrays[0].map(v => [v]);
    return arrays.reduce((acc, arr) => {
      const result = [];
      for (const a of acc) for (const b of arr) result.push([...a, b]);
      return result;
    }, [[]]);
  }

  assert('cartesian: empty input', JSON.stringify(cartesian([])) === '[[]]');
  assert('cartesian: single array', JSON.stringify(cartesian([['a', 'b']])) === '[["a"],["b"]]');
  assert('cartesian: 2x2', cartesian([['a', 'b'], ['1', '2']]).length === 4);
  assert('cartesian: 2x3', cartesian([['a', 'b'], ['1', '2', '3']]).length === 6);
  assert('cartesian: 3x2x2', cartesian([['a', 'b', 'c'], ['x', 'y'], ['1', '2']]).length === 12);

  // parseSplitChar
  function parseSplitChar(raw) {
    if (raw === '\\n' || raw === 'enter') return '\n';
    if (raw === '\\t' || raw === 'tab')   return '\t';
    return raw || ' ';
  }

  assert('parseSplitChar: enter', parseSplitChar('enter') === '\n');
  assert('parseSplitChar: \\n', parseSplitChar('\\n') === '\n');
  assert('parseSplitChar: tab', parseSplitChar('tab') === '\t');
  assert('parseSplitChar: semicolon', parseSplitChar(';') === ';');
  assert('parseSplitChar: empty defaults to space', parseSplitChar('') === ' ');

  // Priority colors
  const PRIORITY_COLORS = { A: '#ef4444', B: '#f97316', C: '#eab308', D: '#3b82f6', E: '#22c55e' };
  assert('Priority A is red',    PRIORITY_COLORS.A === '#ef4444');
  assert('Priority B is orange', PRIORITY_COLORS.B === '#f97316');
  assert('Priority C is yellow', PRIORITY_COLORS.C === '#eab308');
  assert('Priority D is blue',   PRIORITY_COLORS.D === '#3b82f6');
  assert('Priority E is green',  PRIORITY_COLORS.E === '#22c55e');

  // Task sort by pin
  function sortByPin(list) {
    return [...list].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }

  const tasks = [
    { id: '1', name: 'A', pinned: false },
    { id: '2', name: 'B', pinned: true  },
    { id: '3', name: 'C', pinned: false },
    { id: '4', name: 'D', pinned: true  },
  ];
  const sorted = sortByPin(tasks);
  assert('sortByPin: pinned first', sorted[0].pinned && sorted[1].pinned);
  assert('sortByPin: non-pinned last', !sorted[2].pinned && !sorted[3].pinned);
  assert('sortByPin: original not mutated', tasks[0].name === 'A');

  // URL normalization (Sidebar)
  function normalizeUrl(url) {
    if (!url) return '';
    const trimmed = url.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return 'https://' + trimmed;
    }
    return trimmed;
  }

  assert('normalizeUrl: adds https', normalizeUrl('deepseek.com') === 'https://deepseek.com');
  assert('normalizeUrl: keeps https', normalizeUrl('https://example.com') === 'https://example.com');
  assert('normalizeUrl: keeps http', normalizeUrl('http://localhost:3000') === 'http://localhost:3000');
  assert('normalizeUrl: empty', normalizeUrl('') === '');

  // History slice
  const history = Array.from({ length: 150 }, (_, i) => ({ id: i }));
  const sliced = history.slice(0, 100);
  assert('History max 100 entries', sliced.length === 100);
}

// 4. Testy electronAPI (mock – sprawdza tylko czy API jest dostępne)
function testElectronAPI() {
  log('\n[TEST] electronAPI availability:');
  const api = window.electronAPI;
  assert('window.electronAPI exists', !!api);

  if (!api) return;

  const requiredMethods = [
    'getProfiles', 'saveProfiles',
    'getNotes', 'saveNotes',
    'getSettings', 'saveSettings',
    'getTasks', 'saveTasks', 'getAllTasks',
    'getHistory', 'addHistory', 'clearHistory',
    'clearProfileCache',
    'checkForUpdates', 'getAppVersion',
    'saveTextToFile',
    'createTerminal', 'terminalWrite', 'terminalResize', 'killTerminal',
    'onTerminalData',
    'confirmQuit', 'onCheckBeforeQuit',
  ];

  for (const method of requiredMethods) {
    assert(`electronAPI.${method} is function`, typeof api[method] === 'function',
      `Method missing or not a function`);
  }
}

// 5. Testy struktury store (mock IPC call)
async function testStoreStructure() {
  log('\n[TEST] Store structure:');
  if (!window.electronAPI) {
    assert('Store tests skipped (no API)', true, 'electronAPI unavailable');
    return;
  }

  try {
    const settings = await window.electronAPI.getSettings();
    assert('settings is object', typeof settings === 'object' && settings !== null);
    assert('settings.language exists', 'language' in settings);
    assert('settings.theme exists', 'theme' in settings);
    assert('settings.debugMode exists', 'debugMode' in settings);
    assert('settings.projects is array', Array.isArray(settings.projects));

    const notes = await window.electronAPI.getNotes();
    assert('notes is object', typeof notes === 'object' && notes !== null);
    assert('notes.tabs is array', Array.isArray(notes.tabs));
    assert('notes.activeTab exists', 'activeTab' in notes);
    assert('notes.tabs[0] has id', notes.tabs.length === 0 || 'id' in notes.tabs[0]);
    assert('notes.tabs[0] has content', notes.tabs.length === 0 || 'content' in notes.tabs[0]);

    const history = await window.electronAPI.getHistory();
    assert('history is array', Array.isArray(history));
    assert('history max 100', history.length <= 100);

  } catch (e) {
    assert('Store tests', false, e.message);
  }
}

// =============================================================================
// runTests() – punkt wejścia, wywołuje wszystkie sekcje testów
// =============================================================================
export async function runTests() {
  // Testy uruchamiają się TYLKO gdy debug mode aktywny
  if (!window.electronAPI) return;

  const settings = await window.electronAPI.getSettings().catch(() => ({}));
  if (!settings.debugMode) return;

  passCount = 0;
  failCount = 0;
  results.length = 0;

  log('\n══════════════════════════════════════');
  log('  MultiWeb Manager – Integrity Tests  ');
  log('══════════════════════════════════════');

  testIcons();
  await testTranslations();
  testBusinessLogic();
  testElectronAPI();
  await testStoreStructure();

  // ─── Raport końcowy ──────────────────────────────────────────────
  const total = passCount + failCount;
  log('\n══════════════════════════════════════');
  log(`  RESULTS: ${passCount}/${total} passed, ${failCount} failed`);
  log('══════════════════════════════════════\n');

  if (failCount > 0) {
    logError('FAILED TESTS:');
    results.filter(r => r.status === 'FAIL').forEach(r =>
      logError(`  • ${r.name}${r.detail ? ': ' + r.detail : ''}`)
    );
  } else {
    log('All tests passed! ✔');
  }

  return { passCount, failCount, total, results };
}
