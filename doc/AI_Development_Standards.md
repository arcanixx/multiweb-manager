<!-- =============================================================================
 FILE: AI_Development_Standards.md
 PATH: doc/AI_Development_Standards.md
 VERSION: 0.0.3
 PURPOSE: Dokumentacja specyfikacji projektowej - Standardy tworzenia i modyfikacji kodu
 FUNCTIONS: Dokumentacja: 21 sekcji głównych
 DEPENDS ON: -
 UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
 ============================================================================= -->

# AI DEVELOPMENT STANDARDS – MULTIWEB MANAGER v0.0.3
## Zasady tworzenia i modyfikacji kodu dla AI
Poniższe standardy są ogólne, a przykłady mają charakter poglądowy.
Implementacja zależy od aktualnej architektury aplikacji, istniejących wywołań i struktury modułów.
Nazwy funkcji, hooków, loggerów czy helperów mogą się różnić (`logger()`, `_log()`, itp.),
ale efekt końcowy musi zawsze spełniać zasady opisane poniżej.
---
## 1. NAGŁÓWEK PLIKU (OBOWIĄZKOWY)
Dla wszystkich plików, poza `.json` i tam, gdzie nie można dodać komentarza:
```js
// =============================================================================
// FILE: nazwa_pliku.rozszerzenie
// PATH: pełna/ścieżka/od/roota/nazwa_pliku.rozszerzenie
// VERSION: #.#.#
// PURPOSE: 1–3 linijki opisujące przeznaczenie pliku
// FUNCTIONS: wypisane jeżeli istnieją i mają sens, funkcje, jakie są obsługiwane
// DEPENDS ON: lista zależności (moduły, pliki, biblioteki)
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================
```
Dla plików `.json`:
```json
{
  "_comment": "FILE: nazwa_pliku.json | PATH: pełna/ścieżka | VERSION: #.#.# | PURPOSE: opis | FUNCTIONS: - | DEPENDS ON: - | UWAGA: Nie usuwać komentarzy",
  "version": "#.#.#"
}
```
> **Uwaga:** Wszystkie pola poza `PURPOSE` są automatycznie weryfikowane, aktualizowane i uzupełniane przez skrypt `build_structure.py --fix` przed pull requestem. Nie modyfikuj ich ręcznie – zostaną nadpisane.
---
## 2. IKONY – ZERO HARDCODED
### Zabronione
- Emoji w kodzie (np. `🪟` – błędna ikona, niekompatybilna ze starszym Chrome)
- Stringi z ikonami wpisane bezpośrednio w kodzie
- Fallbacki do emoji
- Wklejanie ikon bezpośrednio w JSX lub JS
### Dozwolone
```js
import { ICONS } from '../utils/icons.js';
<button>{ICONS.SINGLE_APP}</button>
```

Użycie w JS:

```js
const label = `${ICONS.CAMERA} ${t('actions.takePhoto')}`;
```

Jeśli brakuje ikony — dodaj ją w `src/data/icons.js`, nie w komponencie.

### Przykład w `icons.js`

```js
export const ICONS = {
  CAMERA: '📸',
  SINGLE_APP: '🖥️',
  // ...
};
```

### Dodatkowe uwagi

- Ikony muszą być zgodne ze starszym Chrome.
- Przy refaktorze często gubi się fallback/title/label — zwracać uwagę.
- Ikony w locales muszą być w backtickach: `` `${ICONS.CAMERA} Zrób zdjęcie` ``

---

## 3. TŁUMACZENIA – ZERO HARDCODED

### Zabronione

- Teksty w JSX (`<h1>Hello</h1>`)
- Komunikaty w konsoli
- Tooltipy, placeholdery, labelki
- Teksty w modalach, toastach, potwierdzeniach

### Dozwolone

```js
import { TranslationContext } from '../utils/translations.js';
const { t } = useContext(TranslationContext);
<h1>{t('hello')}</h1>
```

### Locales

```
src/locales/pl.json
src/locales/en.json
src/locales/help_pl.json
src/locales/help_en.json
src/locales/templates/
```

Każdy nowy klucz musi być dodany w `pl` i `en`.

### Ikony w tłumaczeniach

Jeśli tłumaczenie zawiera `${ICONS.*}`, cały wpis musi być w backtickach:

```json
"cameraAction": "`${ICONS.CAMERA} Zrób zdjęcie`"
```

---

## 4. LOGGER – debugMode

### W plikach `.js` (core, engine, utils, ipc, tools)

```js
import { logDebug, logError, logWarn, logInfo } from '../utils/logger.js';

logDebug('Logger.init', { context: 'settings' });
logError('Logger.error', err);
```

### W plikach `.jsx` (UI)

```js
import { logDebug, logError, logWarn, logInfo } from '../utils/loggerRenderer.js';

const handleClick = () => {
  logDebug('Button.clicked', { source: 'MainActionButton' });
};
```

### Zasada

Każda istotna funkcja/akcja powinna logować, gdy `debugMode = true`.

### LogWriter – zapis logów testów

`LogWriter` (`src/utils/logWriter.js`) zapisuje do pliku `test-fails.log` (w `userData/logs/`) tylko testy zakończone niepowodzeniem. Działa wyłącznie gdy:

- `settings.debugMode === true`
- użytkownik wyraził zgodę na zapis logów (pytanie przy pierwszym uruchomieniu z `debugMode=true` lub przełącznik w Settings)

Plik logów jest ograniczony do 500 linii (nadpisywane od najstarszych). Można go podejrzeć i wyczyścić w `Settings → Data & Logs` (widoczne tylko gdy `debugMode=true`).

---

## 5. KOMENTARZE W KODZIE

- Każda istotna funkcja lub stała powinna mieć krótki komentarz (1–2 linijki).
- Jeśli `const` zawiera dane — opisz skąd pochodzą.
- Przy refaktorze aktualizuj nagłówek pliku.
- Komentarzy nie usuwamy.

---

## 6. TESTY JEDNOSTKOWE

Każdy nowy moduł → nowe testy w `tests/TestRunner_NazwaModulu.js`. Minimum 3 testy na moduł.

### Przykład

```js
import { runTests } from './testUtils.js';

const tests = [
  {
    name: 'Test 1 - opis',
    run: async () => {
      // test logic
      return { ok: true, details: '' };
    }
  },
  {
    name: 'Test 2 - opis',
    run: async () => {
      // test logic
      return { ok: false, details: 'error description' };
    }
  }
];

export async function runModuleTests() {
  return runTests('ModuleName', tests);
}
```

### LogWriter – zapis logów testów

Podczas pisania nowych testów (`TestRunner_*.js`) nie musisz ręcznie zapisywać logów — `LogWriter` robi to automatycznie przy niepowodzeniu testu.

Pamiętaj jednak:

- Używaj `runTests(moduleName, tests)` z `testUtils.js` — ona wywołuje `appendTestFailLog` przy failu.
- Nie używaj `console.log` do raportowania błędów — używaj `ICONS` i `locales`.
- Klucz `logs.askForPermission` jest używany przy pytaniu o zgodę na zapis logów.
- Klucz `logs.unknownError` – fallback, gdy błąd nie ma własnego opisu.

### `testsLoader.js` – dynamiczne ładowanie testów

Plik `src/loaders/testsLoader.js` automatycznie wykrywa i uruchamia wszystkie `TestRunner_*.js` z folderu `tests/`. Nie trzeba ręcznie importować testów w `TestRunner.js`.

```js
import { loadAndRunAllTests } from './loaders/testsLoader.js';

export async function runAllTests(options = {}) {
  return await loadAndRunAllTests(options);
}
```

---

## 7. REFAKTOR – ROZBIJANIE DUŻYCH PLIKÓW

Jeśli plik `> 8 KB` i/lub zawiera różne logiki → rozbij na moduły.

### Konwencja nazewnicza

```
Settings_Engine.js
Settings_UI.jsx
Settings_Data.json
Settings.utils.js
```

### Katalogi

| Katalog | Przeznaczenie |
|---|---|
| `src/core/` | logika biznesowa (store'y) |
| `src/engine/` | silniki (adBlocker, hotkeysManager, sleepTabsManager, updateService, webviewRegistry) |
| `src/ui/[modul]/` | komponenty React |
| `src/utils/` | funkcje pomocnicze |
| `src/data/` | statyczne dane |
| `src/hooks/` | hooki React |
| `src/ipc/` | handlery IPC |
| `src/loaders/` | dynamiczne loadery |
| `src/tools/` | backend narzędzi |

---

## 8. AKTUALIZACJA DOKUMENTACJI

Po każdej istotnej zmianie zaktualizuj:

- `DevelopersGuide.md`
- `help_pl.json` / `help_en.json` / `pl.json` / `en.json` / inne dodane języki
- `Structure.md` – aktualizacja struktury, zależności, kolejności importów
- `ModulesOverview.md` – jeśli zmienia się lista modułów
- `Definition_Mockups_UI_UX.md` – jeśli zmienia się UI (lub dopisz do `pending_updates_for_Definition_Mockups_UI_UX.md`)

Jeśli `Structure.md` nie istnieje — należy go stworzyć. Powinien zawierać:

- listę plików i folderów
- opis odpowiedzialności każdego modułu
- kolejność ładowania/importów
- zależności między modułami
- komentarze dotyczące architektury

---

## 9. STYLE (CSS)

### Zasady

- Brak stylów inline (poza dynamicznymi).
- Style podzielone logicznie.
- Modułowość CSS zgodna ze strukturą projektu.

### Przykład struktury (mniejsze projekty)

```
src/ui/styles/
├── index.css       # główny import
├── layout.css      # layout aplikacji
├── theme.css       # motywy (dark/light)
└── components.css  # style komponentów
```

### Przykład struktury (większe projekty)

```
src/ui/styles/
├── base.css
├── core.css
├── settings.css
├── minigames.css
├── actions.css
├── utils.css
├── modals.css
└── toasts.css
```

---

## 10. CHECKLISTA PRZED PUSH

- [ ] Nagłówki w plikach (`FILE`, `PATH`, `VERSION`, `PURPOSE`, `FUNCTIONS`, `DEPENDS ON`, `UWAGA`)
- [ ] Brak hardcoded ikon i tekstów (wszystko przez `ICONS` i `t()`)
- [ ] Dodane testy dla nowych modułów
- [ ] Zaktualizowane locales (`pl.json`, `en.json`, `help_pl.json`, `help_en.json`)
- [ ] Logger w kluczowych miejscach (`logDebug`, `logError`)
- [ ] Komentarze aktualne (nieusunięte)
- [ ] `npm run dev` bez błędów
- [ ] `debugMode: true` → testy przechodzą

---

## 11. DODATKOWE UWAGI

- Nazwy plików: `_`, nie `-` (np. `settingsStore.js`, nie `settings-store.js`)
- Ścieżki od roota projektu
- Wersja iteracyjna (`#.#.#`) – zawsze zgodna z `package.json`
- Komentarzy nie usuwamy
- Jeżeli dostaniesz plik z poprawkami do merge jako cały plik do podmiany, upewnij się, że nic ważnego nie znika z poprzedniego, lub nie jest to okrojona wersja raptem.

---

## 12. TOOLTIPY

Każdy przycisk powinien mieć tooltip. Tekst tooltipa w locales. Ikony w tooltipach: `` `${ICONS.INFO} ${t('tooltips.settings')}` ``

```jsx
<button title={t('tooltips.saveSettings')}>
  {ICONS.SAVE}
</button>
```

---

## 13. TOAST MESSAGES

Każde działanie → toast. Tekst z locales. Ikony z `ICONS`.

```js
showToast('success', t('settings.saved'));
```

---

## 14. ZAKAZ UŻYWANIA NATYWNYCH PROMPTÓW

### Nie używamy

- `window.alert`
- `window.confirm`
- `window.prompt`

### Zamiast tego

Własne modale, bazujące na spójnym CSS projektu, z tłumaczeniami z `locales`, z ikonami z `ICONS`, z pełną kontrolą nad UX.

```jsx
<ConfirmModal
  isOpen={showConfirm}
  title={t('confirm.delete')}
  message={t('confirm.deleteProfile')}
  onConfirm={handleDelete}
  onClose={() => setShowConfirm(false)}
/>
```

---

## 15. STRUKTURA CSS A MODUŁY

Pliki CSS powinny być rozbite według funkcjonalności:

- `layout.css` – grid, sidebar, main content
- `theme.css` – zmienne, kolory, motywy
- `components.css` – przyciski, modale, toasty, tooltipy
- `[modul].css` – style specyficzne dla modułu (opcjonalnie)

---

## 16. Requirements.md — STANDARD ZARZĄDZANIA WYMAGANIAMI

Plik `Requirements.md` jest obowiązkowy w każdym projekcie. Zawiera pełną listę wymagań funkcjonalnych i niefunkcjonalnych, podzielonych na moduły.

### Struktura wpisu

```markdown
## [Nazwa Modułu]

### [Nazwa wymagania]
- **ID:** NAZWA_REQ-001
- **Sekcja:** NAZWA SEKCJI
- **Opis:** pełny opis wymagania
- **Status:** IN_SPRINT / BLOCKED / BACKLOG / DONE
- **Priorytet:** CRITICAL / MAJOR / MINOR
- **Version:** #.#.#
- **Komentarz:** dodatkowe informacje, powody blokady, zależności
```

### Statusy

| Status | Znaczenie |
|---|---|
| `IN_SPRINT` | Wymaganie jest aktualnie implementowane |
| `BLOCKED` | Wymaganie nie może być realizowane (dopisz komentarz) |
| `BACKLOG` | Wymaganie zaplanowane na później |
| `DONE` | Wymaganie zaimplementowane, przetestowane i potwierdzone |

### Priorytety

| Priorytet | Znaczenie |
|---|---|
| `CRITICAL` | Blokuje działanie aplikacji lub kluczowych funkcji |
| `MAJOR` | Istotne wymaganie, ale nie blokujące |
| `MINOR` | Dodatkowe funkcje, ulepszenia, kosmetyka |

### Sekcje

W razie potrzeby dodać nową sekcję do listy, aktualizując pliki dokumentacji. Obecna lista:

| ID | Sekcja |
|---|---|
| `ARCH` | ARCHITEKTURA I STABILNOŚĆ |
| `SIDEBAR` | SIDEBAR / PROFILE MANAGER |
| `WEBVIEW` | WEBVIEW MANAGER |
| `NOTEPAD` | NOTEPAD EDITOR |
| `TASKS` | TASKPANEL / AGGREGATEDTASKS |
| `TERMINAL` | TERMINAL CONSOLE |
| `SETTINGS` | SETTINGS PANEL |
| `TOOLS` | TOOLSPANEL (KAFELKI) |
| `APPLIB` | APP LIBRARY (PEŁNY WIDOK) |
| `UIUX` | UI/UX DESIGN & UX IMPROVEMENTS |
| `HOTKEYS` | SETTINGS PANEL (HOTKEYS) |
| `ADBLOCKER` | WEBVIEW MANAGER (ADBLOCKER) |
| `PLUGIN` | SYSTEM WTYCZEK / FUTURE IDEAS |
| `DOC` | DOCUMENTATION |
| `GENERAL` | OGÓLNE / TECH DEBT |
| `TEST` | TESTY |

### Zasady aktualizacji

- Każda zmiana w projekcie → aktualizacja `Requirements.md`
- Każdy nowy pomysł → wpis do `BACKLOG`
- Każdy błąd → wpis jako nowe wymaganie (`CRITICAL` lub `MAJOR`)
- Każdy sprint → przeniesienie wymagań do `IN_SPRINT`
- Po wdrożeniu → `DONE` + `Version`

---

## 17. KONFIGURACJA – PLIK `config.js`

Plik konfiguracyjny `config.js` (zarówno w root jak i `src/config.js`) zawiera wszystkie rzeczy z innych modułów, które mogą być łatwo zmieniane:

- `DEBUG_MODE` – true/false
- `DEFAULT_LANGUAGE` – domyślny język
- Limity (np. `CLIPBOARD_HISTORY_MAX`, `SLEEP_TABS_TIMEOUT_DEFAULT`)
- `DEFAULT_THEME` – dark/light/system
- `DEFAULT_PROFILE_CATEGORY` – domyślna kategoria profilu
- Feature flags – włączanie/wyłączanie modułów
- Ścieżki do katalogów (`PATHS`)
- Limity (`LIMITS`)
- API endpoints (`API_ENDPOINTS`)

```js
export const CONFIG = {
  debugMode: false,
  sleepTabsTimeout: 15 * 60 * 1000,
  resourceMonitor: { warnAt: 70, criticalAt: 90 },
  historyLimit: 200,
  featureFlags: {
    screenshotWebView: true,
    cookieGrabber: true
  }
};
```

---

## 18. SZABLONY LOCALES (DLA NOWYCH JĘZYKÓW)

W `src/locales/templates/` znajdują się:

- `lang.template.json` – szablon dla nowego języka (kopiuj, zmień nazwę na `[język].json`)
- `help.template.json` – szablon dla pomocy (kopiuj, zmień nazwę na `help_[język].json`)

**Zasada:** każdy nowy klucz w `pl.json` i `en.json` jednocześnie.

Po dodaniu nowego języka:

1. Skopiuj `lang.template.json` → `[język].json`
2. Skopiuj `help.template.json` → `help_[język].json`
3. Dodaj język do `LANGUAGES` w `config.js`
4. Dodaj import w `src/utils/translations.js`

---

## 19. TESTY – JEDNOLITY FORMAT

Wszystkie testy w `tests/` używają wspólnej funkcji `runTests(moduleName, tests)` z `testUtils.js`.

```js
import { runTests } from './testUtils.js';

const tests = [
  { name: 'Test 1', run: async () => ({ ok: true, details: '' }) },
  { name: 'Test 2', run: async () => ({ ok: false, details: 'error' }) }
];

export async function runModuleTests() {
  return runTests('ModuleName', tests);
}
```

Testy nie mają hardcoded ikon – używają `ICONS.TEST_PASS` i `ICONS.TEST_FAIL` z `icons.js`.

---

## 20. NAZEWNICTWO PLIKÓW

| Typ | Lokalizacja | Przykład |
|---|---|---|
| Kanoniczne ikony | `src/data/icons.js` | `export const ICONS = { ... }` |
| Export wrapper ikony | `src/utils/icons.js` | `export * from '../data/icons.js'` |
| TestRunner (silnik) | `src/utils/testRunner.js` | `export function assert(...)` |
| TestRunner (orchestrator) | `tests/TestRunner.js` | `export async function runAllTests()` |
| Store'y | `src/core/[nazwa]Store.js` | `settingsStore.js` |
| Handlery IPC | `src/ipc/ipcMainHandlers_[nazwa].js` | `ipcMainHandlers_settings.js` |
| Loadery | `src/loaders/[nazwa]Loader.js` | `testsLoader.js`, `ipcLoader.js` |
| Hooki | `src/hooks/use[Nazwa].js` | `useSettings.js` |
| Komponenty UI | `src/ui/[modul]/[Nazwa].jsx` | `sidebar/Sidebar.jsx` |
| Narzędzia (front) | `src/ui/tools/[Nazwa].jsx` | `JsonFormatter.jsx` |
| Narzędzia (back) | `src/tools/[nazwa].js` | `apiClient.js` |

---

## 21. ZASADY EDYCJI PLIKÓW – NAGŁÓWKI I WERSJE

### 21.1. `PURPOSE` – ręczna aktualizacja

Każda zmiana w pliku (dodanie funkcji, zmiana odpowiedzialności, refaktor) wymaga aktualizacji pola `PURPOSE` w nagłówku. `PURPOSE` opisuje CO plik robi, nie JAK. 1–3 linijki, zwięźle.

### 21.2. `VERSION` – automatyczna aktualizacja

Skrypt `build_structure.py --fix` ustawia `VERSION` na wartość z `package.json`. Nie modyfikuj ręcznie. Jeśli edytujesz plik 10 razy w ramach jednego sprintu (`0.0.3`), wersja pliku nie powinna się zmieniać — wersja pliku = wersja aplikacji, w której plik był ostatnio modyfikowany merytorycznie.

### 21.3. `FUNCTIONS` i `DEPENDS ON` – automatyczna aktualizacja

Te pola są aktualizowane automatycznie przez skrypt `build_structure.py --fix` przed pull requestem. Nie modyfikuj ich ręcznie – zostaną nadpisane.

- `FUNCTIONS` – lista eksportowanych funkcji (generowana z kodu)
- `DEPENDS ON` – lista importowanych modułów (generowana z importów)

### 21.4. Kolejność pól w nagłówku (WAŻNE!)

Kolejność jest ustalona i **NIE MOŻE BYĆ ZMIENIANA**:

1. `FILE:` – nazwa pliku z rozszerzeniem
2. `PATH:` – ścieżka od roota projektu
3. `VERSION:` – `#.#.#` (z `package.json`)
4. `PURPOSE:` – opis przeznaczenia pliku
5. `FUNCTIONS:` – lista eksportowanych funkcji
6. `DEPENDS ON:` – lista importowanych modułów
7. `UWAGA:` – `"Nie usuwać komentarzy – opisują flow aplikacji."`

Dla `.css`:

```css
/* =============================================================================
 * FILE: nazwa_pliku.css
 * PATH: src/ui/styles/nazwa_pliku.css
 * VERSION: #.#.#
 * PURPOSE: Style dla modułu X
 * FUNCTIONS: -
 * DEPENDS ON: -
 * UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
 * ============================================================================= */
```

Dla `.md` / `.html`:

```html
<!-- =============================================================================
 FILE: nazwa_pliku.md
 PATH: doc/nazwa_pliku.md
 VERSION: #.#.#
 PURPOSE: Dokumentacja specyfikacji projektowej - opis
 FUNCTIONS: Dokumentacja: X sekcji głównych
 DEPENDS ON: -
 UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
 ============================================================================= -->
```

Dla `.json`:

```json
{
  "_comment": "FILE: pl.json | PATH: src/locales/pl.json | VERSION: #.#.# | PURPOSE: Tłumaczenia polskie | FUNCTIONS: - | DEPENDS ON: - | UWAGA: Nie usuwać komentarzy",
  "key": "value"
}
```

### 21.5. Automatyzacja przed pull requestem

Skrypt `build_structure.py --fix` przed każdym PR:

- Aktualizuje `VERSION` na wartość z `package.json`
- Aktualizuje `PATH` i `FILE` na podstawie rzeczywistej lokalizacji
- Wyciąga `FUNCTIONS` z eksportów w kodzie
- Wyciąga `DEPENDS ON` z importów (normalizuje nazwy – bez ścieżek)
- Ujednolica `UWAGA` do standardowego tekstu

Nie modyfikuj ręcznie pól, które są automatycznie aktualizowane – zostaną nadpisane.

### 21.6. `DEPENDS ON` – format

- Tylko nazwy plików (bez ścieżek i rozszerzeń, jeśli to możliwe)
- Przykład: `logger.js`, `icons.js`, `react`
- Jeśli dwa pliki mają tę samą nazwę (np. `config.js` w root i `src/config.js`) – skrypt zachowa rozróżnienie: `root/config.js`, `src/config.js`

### 21.7. Przykład z dodatkowym komentarzem POD nagłówkiem

```js
// =============================================================================
// FILE: Structure.md
// PATH: doc/Structure.md
// VERSION: #.#.#
// PURPOSE: Dokumentacja specyfikacji projektowej - Struktura projektu
// FUNCTIONS: -
// DEPENDS ON: DevelopersGuide.md
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================
```

```html
<!--
  AI Important! Sekcja drzewa jest generowana automatycznie
  przez build_structure.py — NIE edytować ręcznie tej sekcji.
  Sekcja po OTHER SECTIONS jest statyczna i można ją edytować.
-->
```

Zasada: Wszystko co wymaga dodatkowego wyjaśnienia – umieść w osobnym bloku komentarza **PO** nagłówku, nie wewnątrz niego.

### 21.8. Zasada dla AI: NEVER REMOVE COMMENTS

Nagłówki i komentarze strukturalne są krytyczne dla działania skryptów automatyzacji (`build_structure.py`, generowanie `Structure.md`, walidacja przed PR).

- **ZAKAZ:** usuwania, modyfikowania lub zmiany kolejności pól w nagłówku.
- **DOZWOLONE:** aktualizacja `PURPOSE`, `VERSION` (tylko jeśli wiesz że skrypt nie zadziała), dodawanie nowych linii komentarza poniżej nagłówka.

---

<!-- KONIEC DOKUMENTU -->