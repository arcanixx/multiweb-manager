<!-- =============================================================================
 FILE: CODE_REVIEW_CHECKLIST.md
 PATH: doc/CODE_REVIEW_CHECKLIST.md
 VERSION: 0.0.3
 PURPOSE: Dokumentacja specyfikacji projektowej - Kompletna lista kontrolna Code Review dla MultiWeb Manager – weryfikacja kodu przed mergem.
 FUNCTIONS: -
 DEPENDS ON: AI_Repository_Access.md, DevelopersGuide.md
 UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
 ============================================================================= -->

# 📋 CODE REVIEW CHECKLIST – MultiWeb Manager

> **Użycie:** Przed każdym pull requestem lub po większych zmianach, przejdź przez poniższe punkty.
> **Dla AI:** Jeśli punkt jest oznaczony `[AUTO]`, może być zweryfikowany skryptem lub `TestRunner_Audit.js`. Jeśli `[MANUAL]` – wymaga ręcznej inspekcji.

> **Instrukcja zapisu dla AI:** Po zakończeniu code review zapisz wynik do pliku:
> `logs/CODE_REVIEW_CHECKLIST_YYYYMMDD_HHMMSS.log`
> gdzie timestamp to czas UTC wykonania review (format: `20260610_143022`).
> Plik tworzy się przez GitHub API (PUT) lub lokalnie – zawiera wszystkie punkty
> z oznaczeniami `[PASS]`, `[FAIL]`, `[WARN]`, `[INFO]` oraz sekcję PODSUMOWANIE.
> Istniejące pliki `logs/*.log` NIE są nadpisywane – każdy przegląd dostaje własny plik z datą.


---

## 1. ARCHITEKTURA PLIKÓW I STRUKTURA PROJEKTU

### 1.1. Konfiguracja (`src/config/`)

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 1.1.1 | `src/config.js` (fasada) re-eksportuje tylko z `src/config/*.js`, nie zawiera logiki | [AUTO] | Grep na `export.*=.*\(` powinien zwrócić 0 |
| 1.1.2 | `featuresConfig.js` – `FEATURES`, `isFeatureEnabled`, `isToolEnabled` | [AUTO] | Sprawdź czy wszystkie flagi są używane |
| 1.1.3 | `limitsConfig.js` – `LIMITS`, `getLimit` | [AUTO] | Sprawdź czy limity są przestrzegane w store'ach |
| 1.1.4 | `settingsConfig.js` – `DEFAULT_SETTINGS`, `DEBUG_MODULES`, `getDefaultSetting` | [AUTO] | Sprawdź czy `DEBUG_MODULES` zawiera wszystkie kategorie loggera |
| 1.1.5 | `endpointsConfig.js` – `API_ENDPOINTS` | [AUTO] | Sprawdź czy endpointy są aktualne |
| 1.1.6 | `appConfig.js` – stałe aplikacji (`APP_ENV`, `LANGUAGES`, `UI_ZOOM`) | [AUTO] | Sprawdź czy `LANGUAGES` odpowiada plikom w `src/locales/` |

### 1.2. Katalogi i ich przeznaczenie

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 1.2.1 | `src/stores/` – tylko store'y (logika I/O, cache, persistence) | [MANUAL] | Żaden store nie powinien zawierać JSX ani hooków React |
| 1.2.2 | `src/engine/` – tylko serwisy (adBlocker, hotkeys, sleepTabs, webviewRegistry) | [MANUAL] | Brak importów z `src/ui/` |
| 1.2.3 | `src/hooks/` – wszystkie pliki mają prefix `use` i eksportują hooki | [AUTO] | `TestRunner_Audit.js` weryfikuje |
| 1.2.4 | `src/ipc/` – tylko handlery IPC (`ipcMainHandlers_*.js`), brak logiki biznesowej | [MANUAL] | Handlery tylko walidują i delegują do store'ów |
| 1.2.5 | `src/ui/` – podział na foldery funkcjonalne | [MANUAL] | Nowe komponenty trafiają do odpowiedniego folderu |
| 1.2.6 | `src/utils/` – tylko czyste funkcje pomocnicze (brak JSX, brak useState/useEffect) | [AUTO] | `grep -r "import.*React" src/utils/` powinno zwrócić 0 (poza `loggerRenderer.js`) |
| 1.2.7 | `src/tools/` – helpery dla narzędzi (apiClient, markdownRenderer, regexEngine) | [MANUAL] | Sprawdź czy nie ma tam logiki UI |
| 1.2.8 | `src/constants/` – tylko stałe (`ipcChannels.js`, `constants.js`) | [MANUAL] | Żadnych funkcji |
| 1.2.9 | `src/data/` – tylko dane (JSON, ikony) | [MANUAL] | Brak plików `.js` z logiką (poza `appLibrary/index.js`) |
| 1.2.10 | `tests/` – pliki z prefixem `TestRunner_*.js`, każdy eksportuje `runNazwaTests()` | [AUTO] | `TestRunner_Audit.js` weryfikuje |

### 1.3. Pliki główne (root)

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 1.3.1 | `main.js` – nie importuje ręcznie handlerów IPC (używa `ipcLoader.js`) | [AUTO] | Grep na `ipcMainHandlers_` w `main.js` powinien zwrócić 0 |
| 1.3.2 | `preload.cjs` – eksponuje tylko bezpieczne API przez `contextBridge` | [MANUAL] | Żadnych `nodeIntegration` |
| 1.3.3 | `package.json` – wersja zgodna z branchem | [MANUAL] | UAT-v0.0.4 → `0.0.3` w plikach |

---

## 2. IMPORTY I ZALEŻNOŚCI

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 2.1.1 | Importy z bibliotek zewnętrznych na górze pliku | [MANUAL] | Wzorzec: React → Electron → store'y → utils → komponenty |
| 2.1.2 | Importy relatywne używają `..` (brak aliasów `@/`) | [AUTO] | `TestRunner_Audit.js` weryfikuje |
| 2.1.3 | Brak importów z `src/data/icons.js` (tylko przez `src/utils/icons.js`) | [AUTO] | `TestRunner_Audit.js` weryfikuje |
| 2.2.1 | Brak cyklicznych importów między store'ami | [AUTO] | `npx madge --circular src/stores/` |
| 2.3.1 | Brak nieużywanych importów (`useState`, `logInfo`, `ICONS` bez użycia) | [AUTO] | ESLint `no-unused-vars` |

---

## 3. KOMENTARZE I DOKUMENTACJA KODU

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 3.1.1 | Każdy plik `.js`/`.jsx`/`.cjs`/`.md`/`.css` ma nagłówek | [AUTO] | `build_structure.py` weryfikuje |
| 3.1.2 | Kolejność pól nagłówka: `FILE → PATH → VERSION → PURPOSE → FUNCTIONS → DEPENDS ON → UWAGA` | [AUTO] | `build_structure.py --fix` poprawi |
| 3.1.3 | `VERSION` zgodne z `package.json` | [AUTO] | `build_structure.py` weryfikuje |
| 3.1.4 | `PURPOSE` nie jest puste ani generyczne | [MANUAL] | Nie może być "Plik zasobów..." |
| 3.2.1 | Każda eksportowana funkcja ma komentarz opisujący rolę | [AUTO] | `build_structure.py` ostrzega przy >50% brakach (MONIT) |
| 3.2.3 | Brak komentarzy `/** */` w plikach `.js` (używamy `//`) | [AUTO] | `TestRunner_Audit.js` weryfikuje |
| 3.3.1 | Każde `// TODO` ma autora i datę (`// TODO(@user): opis`) | [MANUAL] | Wzorzec: `// TODO(@username): opis do YYYY-MM-DD` |
| 3.3.2 | Brak `// FIXME` bez rozwiązania w tym PR | [MANUAL] | FIXME powinny być rozwiązane przed mergem |

---

## 4. LOGOWANIE

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 4.1.1 | Każdy store ma `logError` przy błędach I/O | [AUTO] | MONIT w `build_structure.py` |
| 4.2.1 | Każdy handler IPC ma `logError` w `catch` | [AUTO] | `TestRunner_Audit.js` weryfikuje |
| 4.2.2 | `logInfo` przy udanych operacjach (create, update, delete) | [MANUAL] | Opcjonalne, ale pomocne |
| 4.3.1 | Każdy komponent z `useEffect` i async ma `logError` | [MANUAL] | `try/catch` wokół `invoke()` |
| 4.4.1 | Każde wywołanie loggera zawiera kategorię (pierwszy parametr) | [MANUAL] | `logError('webview', ...)` |
| 4.4.2 | Kategorie zgodne z `DEBUG_MODULES` (`webview`, `terminal`, `tasks`, `tools`, `settings`, `engine`, `store`, `ipc`, `ui`) | [AUTO] | Grep na nieznane kategorie |

---

## 5. OBSŁUGA BŁĘDÓW

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 5.1.1 | Każdy handler IPC ma `try/catch` | [AUTO] | `TestRunner_Audit.js` weryfikuje |
| 5.1.2 | Każdy handler zwraca `{ ok, data?, error? }` | [AUTO] | Nie rzuca błędów do renderera |
| 5.1.3 | Walidacja payload przed destrukturyzacją | [AUTO] | Guard na początku handlera |
| 5.2.1 | `readJsonFile`, `writeJsonFile` mają `try/catch` | [AUTO] | Jest w `persistence.js` |
| 5.2.3 | Atomic save (temp + rename) dla krytycznych plików | [MANUAL] | `tasksStore.js` ma – sprawdzić inne |

---

## 6. I18N (TŁUMACZENIA)

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 6.1.1 | Każdy komponent UI używa `t()` zamiast hardcoded stringów | [AUTO] | Grep na polskie znaki w JSX |
| 6.1.2 | Brak `alert`, `confirm`, `prompt` | [AUTO] | `TestRunner_Audit.js` weryfikuje |
| 6.2.1 | `pl.json` i `en.json` mają identyczne klucze | [AUTO] | `build_structure.py` weryfikuje |
| 6.2.2 | `help_pl.json` i `help_en.json` mają identyczne klucze | [AUTO] | `build_structure.py` weryfikuje |

---

## 7. CSS I STYLOWANIE

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 7.1.2 | Brak inline styles w JSX (poza dynamicznymi wartościami) | [MANUAL] | Dla stałych styli używamy klas CSS |
| 7.1.3 | Klasy CSS używają kebab-case | [AUTO] | `TestRunner_Audit.js` weryfikuje |
| 7.2.1 | Dark mode obsługiwany przez klasy CSS (`theme.css`) | [MANUAL] | Zmienne CSS w `:root` i `.dark` |

---

## 8. PERFORMANCE

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 8.1.1 | `ToolsPanel.jsx` używa `React.lazy` dla każdego narzędzia | [AUTO] | Grep na `React.lazy` |
| 8.2.1 | `useCallback` dla funkcji przekazywanych do child komponentów | [MANUAL] | Sidebar, TaskPanel |
| 8.3.1 | Każdy `setInterval` ma `clearInterval` w cleanup | [AUTO] | Grep |
| 8.3.2 | Każdy `addEventListener` ma `removeEventListener` w cleanup | [AUTO] | Grep |

---

## 9. BEZPIECZEŃSTWO

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 9.1.1 | `isSafeUrl()` blokuje `javascript:`, `data:`, `file:` | [AUTO] | Sprawdzić regex |
| 9.1.2 | `webview:navigate` używa `isSafeUrl()` | [AUTO] | Jest |
| 9.2.1 | `preload.cjs` eksponuje API tylko przez `contextBridge` | [MANUAL] | Brak `nodeIntegration` |
| 9.2.2 | `preload.cjs` nie eksponuje `fs`, `path`, `child_process` | [AUTO] | `TestRunner_Audit.js` weryfikuje |
| 9.2.3 | Walidacja payload w każdym handlerze | [AUTO] | Guards na początku handlerów |

---

## 10. IPC CHANNEL REGISTRY

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 10.1 | `ipcChannels.js` zawiera wszystkie używane kanały | [AUTO] | `TestRunner_IpcChannels.js` weryfikuje |
| 10.2 | Handlery używają `IPC_CHANNELS` zamiast string literals | [AUTO] | Grep na `ipcMain.handle('` powinien zwrócić 0 |
| 10.4 | Renderer (hooki) importują `IPC_CHANNELS` gdy używają `invoke` | [AUTO] | Grep na `IPC_CHANNELS` w `src/hooks/` |

---

## 11. MARTWY KOD

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 11.2 | Nieużywane ikony w `ICONS` | [AUTO] | `TestRunner_Audit.js` weryfikuje |
| 11.3 | Nieużywane kanały IPC | [AUTO] | Porównaj definicje z użyciem |
| 11.4 | Nieużywane eksporty w store'ach | [AUTO] | ESLint `no-unused-exports` |

---

## 12. KONWENCJE

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 12.1 | Komponenty – `PascalCase`, plik `.jsx` | [AUTO] | `TestRunner_Audit.js` weryfikuje |
| 12.2 | Hooki – `camelCase` z prefixem `use` | [AUTO] | `TestRunner_Audit.js` weryfikuje |
| 12.3 | Stałe – `UPPER_SNAKE_CASE` | [MANUAL] | `LIMITS`, `FEATURES`, `DEFAULT_SETTINGS` |
| 12.5 | Każdy `useEffect` ma dependency array | [AUTO] | ESLint `react-hooks/exhaustive-deps` (wyłączone – sprawdzić ręcznie) |
| 12.6 | `eslint-disable` tylko z uzasadnieniem | [MANUAL] | Grep + sprawdzić komentarz |

---

## 13. TESTY

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 13.1 | Każdy `TestRunner_*.js` eksportuje `runNazwaTests()` | [AUTO] | `TestRunner_Audit.js` weryfikuje |
| 13.2 | Testy używają `runTests()` z `testUtils.js` | [AUTO] | Grep |
| 13.3 | Testy IPC używają `env: 'react'` lub `mockElectronAPI` – nie wywołują `window.electronAPI` bezpośrednio | [AUTO] | `testUtils.js` to wymusza |
| 13.4 | Każda funkcja eksportowana ma test lub jest w `REACT_ONLY_FUNCTIONS` | [AUTO] | `build_structure.py` raportuje pokrycie |
| 13.5 | Pokrycie testami >30% (docelowo 80%) | [AUTO] | Raport z `build_structure.py` |

---

## 14. SPECYFICZNE DLA MULTIWEB MANAGER

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 14.1.1 | `WebViewTab.jsx` – cleanup listenerów w `useEffect` | [MANUAL] | `did-finish-load`, `did-fail-load`, `crash` |
| 14.2.1 | Autosave notatek co 5s tylko przy zmianie | [MANUAL] | `useNotepadAutosave.js` |
| 14.3.1 | Atomic save w `tasksStore.js` | [MANUAL] | Jest |
| 14.5.1 | `mergeSettings` – deep merge przez lodash | [AUTO] | `TestRunner_Audit.js` weryfikuje |
| 14.5.3 | `exportSettings` / `importSettings` – walidacja JSON | [MANUAL] | `DataManagementSection.jsx` |
| 14.6.1 | `ToolsPanel.jsx` – `React.lazy` dla każdego narzędzia | [MANUAL] | Jest |
| 14.6.3 | `isFeatureEnabled()` przed załadowaniem narzędzia | [MANUAL] | `ToolsContainer.jsx` |

---

## ✅ SKRÓCONA LISTA PRE-COMMIT (najważniejsze)

Przed każdym commitem sprawdź minimum:

- [ ] `build_structure.py` – brak nowych MONIT FAIL
- [ ] Każdy nowy plik ma nagłówek z wypełnionym `PURPOSE`
- [ ] Brak `alert()`, `confirm()`, `prompt()`
- [ ] Brak hardcoded stringów w UI (używamy `t()`)
- [ ] Brak hardcoded ikon (używamy `ICONS.NAZWA`)
- [ ] Nowe kanały IPC są w `ipcChannels.js`
- [ ] Nowe testy eksportują `runNazwaTests()`
- [ ] `eslint` – brak nowych błędów

<!-- ============================================================================= -->
