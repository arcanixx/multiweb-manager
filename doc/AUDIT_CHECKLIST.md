<!-- =============================================================================
 FILE: AUDIT_CHECKLIST.md
 PATH: doc/AUDIT_CHECKLIST.md
 VERSION: 0.0.3
 PURPOSE: Dokumentacja specyfikacji projektowej - Kompletna lista kontrolna Audytu Projektu – ocena ryzyka, skalowalności, bezpieczeństwa i utrzymywalności przed release'em.
 FUNCTIONS: -
 DEPENDS ON: CODE_REVIEW_CHECKLIST.md, DevelopersGuide.md, Requirements.md
 UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
 ============================================================================= -->

# 🔍 AUDYT PROJEKTU – MultiWeb Manager

> **Użycie:** Przed głównym release'em (v0.0.4) lub przy zmianie zespołu. Audyt jest głębszy niż Code Review – ocenia ryzyko, koszty utrzymania, skalowalność i compliance.
> **Dla AI:** Punkty `[AUTO]` mogą być zweryfikowane przez `TestRunner_Audit.js`. `[MANUAL]` wymaga ręcznej analizy.

---

## 1. BEZPIECZEŃSTWO

### 1.1. Zależności

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 1.1.1 | `npm audit` – brak wysokich/krytycznych podatności | [AUTO] | `npm audit --production` |
| 1.1.2 | Pakiety produkcyjne w `dependencies`, nie `devDependencies` | [AUTO] | `electron`, `react`, `xterm`, `lodash`, `marked` |
| 1.1.3 | Brak przestarzałych wersji | [AUTO] | `npm outdated` |

### 1.2. Electron Security

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 1.2.1 | `nodeIntegration: false` w `webPreferences` | [AUTO] | Jest w `main.js` |
| 1.2.2 | `contextIsolation: true` | [AUTO] | Jest |
| 1.2.3 | CSP (Content Security Policy) w `main.js` | [AUTO] | Jest – sprawdzić czy nie blokuje webview |
| 1.2.4 | `preload.cjs` nie eksponuje `fs`, `path`, `child_process` | [AUTO] | `TestRunner_Audit.js` weryfikuje |

### 1.3. Storage i dane

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 1.3.1 | `userData` – profile nie zawierają tokenów ani haseł | [MANUAL] | Profile przechowują tylko URL i UUID |
| 1.3.2 | `localStorage` – tylko ustawienia UI (nie dane wrażliwe) | [MANUAL] | Theme, język – OK |
| 1.3.3 | `notepadStorage.js` – notatki mogą zawierać dane osobowe | [MANUAL] | Brak szyfrowania – akceptowalne dla desktop app |
| 1.3.4 | Export/import danych – czy jest możliwy backup? | [MANUAL] | `exportSettings` / `importSettings` – jest |

### 1.4. XSS i walidacja wejścia

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 1.4.1 | Brak `dangerouslySetInnerHTML` | [AUTO] | `TestRunner_Audit.js` weryfikuje |
| 1.4.2 | URL sanityzowane przed `loadURL` przez `isSafeUrl()` | [AUTO] | Jest |
| 1.4.3 | `marked` – renderowanie markdown bezpieczne (HTML wyłączone) | [MANUAL] | Domyślnie OK |

### 1.5. RODO / GDPR

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 1.5.1 | Użytkownik może usunąć wszystkie dane (usunięcie app usuwa `userData`) | [MANUAL] | Desktop app – brak kont, OK |
| 1.5.2 | Logi nie zawierają danych osobowych | [MANUAL] | `eventLogger.js` loguje akcje, nie treści |
| 1.5.3 | `settings.logsEnabled` domyślnie `false` | [AUTO] | `TestRunner_Config.js` weryfikuje |
| 1.5.4 | `analyticsEnabled` domyślnie `false` | [AUTO] | `TestRunner_Config.js` weryfikuje |

---

## 2. SKALOWALNOŚĆ I WYDAJNOŚĆ

### 2.1. Limity danych

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 2.1.1 | `clipboardStore.js` – limit historii zdefiniowany w `LIMITS` | [MANUAL] | Sprawdzić `CLIPBOARD_HISTORY_MAX` |
| 2.1.2 | `historyStore.js` – limit historii zdefiniowany w `LIMITS` | [MANUAL] | Sprawdzić `HISTORY_MAX` |
| 2.1.3 | `logWriter.js` – limit linii (500) | [AUTO] | Jest – `TestRunner_LogWriter.js` weryfikuje |
| 2.1.4 | `tasksStore.js` – brak limitu zadań na grupę | [MANUAL] | Ryzyko przy >1000 zadań – BACKLOG |
| 2.1.5 | WebView – brak limitu otwartych kart | [MANUAL] | Ryzyko OOM przy 20+ WebView – BACKLOG |

### 2.2. I/O i persistence

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 2.2.1 | `persistence.js` używa `writeFileSync` (blokujące) | [MANUAL] | Dla dużych plików może blokować UI – rozważyć async |
| 2.2.2 | `tasksStore.js` – atomic save (temp + rename) | [MANUAL] | Jest – sprawdzić inne store'y |
| 2.2.3 | `settingsStore.js` – deep merge przez lodash | [AUTO] | `TestRunner_Audit.js` weryfikuje |

### 2.3. Startup time

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 2.3.1 | `ToolsPanel` ładuje się leniwie (`React.lazy`) | [AUTO] | Jest |
| 2.3.2 | `AppLibrary` ładuje się leniwie | [MANUAL] | Sprawdzić `ToolsContainer.jsx` |
| 2.3.3 | `SplashScreen` widoczny podczas inicjalizacji | [MANUAL] | Jest – `SplashScreen.jsx` |

---

## 3. PROCESY I DEVOPS

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 3.1.1 | Brak CI/CD pipeline | [MANUAL] | BACKLOG – dodać GitHub Actions przed release'em |
| 3.1.2 | `build_structure.py` uruchamiany przed commitem | [MANUAL] | Można dodać pre-commit hook |
| 3.1.3 | Testy uruchamiane ręcznie przed PR | [MANUAL] | Dodać `npm test` do pipeline – BACKLOG |
| 3.2.2 | `README.md` – instrukcja uruchomienia aktualna | [MANUAL] | `npm install && npm start` |
| 3.3.2 | `uncaughtException` i `unhandledRejection` obsłużone | [AUTO] | W `main.js` – jest |
| 3.3.3 | `eventLogger.js` zapisuje kluczowe akcje | [MANUAL] | Sprawdzić TaskPanel, Sidebar, Notepad |

---

## 4. UTRZYMYWALNOŚĆ

### 4.1. Architektura i dokumentacja

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 4.1.1 | `Structure.md` jest aktualny | [AUTO] | `build_structure.py` generuje |
| 4.1.2 | `DevelopersGuide.md` ma sekcję dla `StorageService` | [MANUAL] | Brak – do uzupełnienia (z audytu) |
| 4.1.3 | `DevelopersGuide.md` ma sekcję dla `useAsync`/`useAsyncMutation` | [MANUAL] | Brak – do uzupełnienia (z audytu) |
| 4.1.4 | `Requirements.md` – brak duplikatów ID i aktualnych statusów | [MANUAL] | `ARCH_REQ-042` jest zduplikowane (z audytu) |
| 4.1.5 | Diagram architektury jest aktualny | [MANUAL] | `assets/multiweb_manager_architecture_graph.png` |

### 4.2. Tech debt

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 4.2.1 | `notepadStorage.js` vs `notepadStore.js` – czy jest decyzja? | [MANUAL] | `notepadStorage.js` celowo poza `StorageService` (autosave) – udokumentować |
| 4.2.2 | `webviewScriptInjector` – czy jest feature flag? | [MANUAL] | Brak feature flagi (z audytu) – BACKLOG |
| 4.2.3 | `StorageService.js` – poprawne routowanie IPC dla mutacji profili | [MANUAL] | Błędne routowanie (z audytu) – do naprawy |
| 4.2.4 | React Query – odłożone do stabilizacji `StorageService` | [MANUAL] | BACKLOG – zgodnie z decyzją architektoniczną |

### 4.3. Testy i pokrycie

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 4.3.1 | Pokrycie testami Node.js >30% (docelowo 80%) | [AUTO] | Raport z `build_structure.py` |
| 4.3.2 | Testy React (env:react) obecne dla wszystkich hooków | [AUTO] | `TestRunner_Hooks.js` |
| 4.3.3 | `env:'react'` tagi prawidłowo użyte w testach wymagających Electron | [AUTO] | `testsLoader.js` weryfikuje przy uruchomieniu |

---

## 5. SPECYFICZNE DLA MULTIWEB MANAGER

### 5.1. WebView

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 5.1.1 | `WebViewTab.jsx` – cleanup listenerów w `useEffect` | [MANUAL] | `did-finish-load`, `did-fail-load`, `crash` |
| 5.1.2 | `webviewRegistry.js` – `unregisterWebView` czyści mapę | [AUTO] | `TestRunner_Engine.js` weryfikuje |
| 5.1.3 | Sleep Tabs – uśpione WebView zwalniają RAM (`about:blank`) | [MANUAL] | `sleepTabsManager.js` |
| 5.1.4 | Session WebView – czy jest zwalniana przy zamknięciu? | [MANUAL] | Electron nie zwalnia automatycznie – potencjalny leak |

### 5.2. IPC consistency

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 5.2.1 | Wszystkie handlery używają `IPC_CHANNELS` (nie string literals) | [AUTO] | `TestRunner_IPC.js` weryfikuje |
| 5.2.2 | `preload.cjs` nie eksponuje przestarzałych kanałów | [MANUAL] | Sprawdzić legacy methods |

### 5.3. Log rotation

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 5.3.1 | `logWriter.js` – limit 500 linii (FIFO) | [AUTO] | `TestRunner_LogWriter.js` weryfikuje |
| 5.3.2 | `eventLogger.js` – rotacja plików przy 2MB | [MANUAL] | `ipcMainHandlers_logs.js` – `rotateLogs` |

### 5.4. Settings migration

| # | Sprawdzenie | Typ | Uwagi |
|---|-------------|-----|-------|
| 5.4.1 | Zmiana `DEFAULT_SETTINGS` nie psuje istniejących ustawień | [MANUAL] | `mergeSettings` (deep merge) – bezpieczne |
| 5.4.2 | Brak mechanizmu migracji wersji settings | [MANUAL] | BACKLOG – przy dużej zmianie struktury może być problem |

---

## 6. RYZYKA – PODSUMOWANIE

| # | Ryzyko | Prawdopodobieństwo | Wpływ | Mitygacja |
|---|--------|-------------------|-------|-----------|
| 1 | Wyciek pamięci w WebView | Średnie | Wysoki | Monitoring, limit otwartych WebView (BACKLOG) |
| 2 | Błędne routowanie IPC w StorageService | Wysokie | Wysoki | Naprawić przed release'em (z audytu) |
| 3 | Brak migracji settings przy zmianie struktury | Niskie | Średni | Dodać przy zmianie struktury (BACKLOG) |
| 4 | `persistence.js` blokuje wątek UI przy dużych plikach | Średnie | Średni | Rozważyć async write (BACKLOG) |
| 5 | Brak backupu danych | Średnie | Średni | Automatyczny backup (BACKLOG) |
| 6 | Duplikat ID `ARCH_REQ-042` w Requirements.md | Pewne | Niski | Naprawić w bieżącym sprincie |
| 7 | Brakujące sekcje w DevelopersGuide.md | Pewne | Niski | Uzupełnić przed release'em |

---

## 7. PODSUMOWANIE GOTOWOŚCI DO RELEASE

| Obszar | Punktów | Gotowe | Do poprawy | BACKLOG |
|--------|---------|--------|-----------|---------|
| Bezpieczeństwo | 14 | 9 | 2 | 3 |
| Skalowalność | 10 | 5 | 2 | 3 |
| DevOps | 6 | 2 | 1 | 3 |
| Utrzymywalność | 13 | 6 | 4 | 3 |
| MwM specyficzne | 14 | 8 | 3 | 3 |
| **RAZEM** | **57** | **30** | **12** | **15** |

<!-- ============================================================================= -->
