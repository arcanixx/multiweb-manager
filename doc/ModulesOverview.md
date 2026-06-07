<!-- =============================================================================
 FILE: ModulesOverview.md
 PATH: doc/ModulesOverview.md
 VERSION: 0.0.3
 PURPOSE: Dokumentacja specyfikacji projektowej - Ujednolicona lista modułów + opis przeznaczenia dla AI i devów
 FUNCTIONS: Dokumentacja: 78 sekcji głównych
 DEPENDS ON: -
 UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
 ============================================================================= -->

# MODULES OVERVIEW
---
## 1. STABILNOŚĆ I FUNDAMENTY (ARCHITEKTURA)
- **Cleanup event listenerów** – usuwanie wszystkich `addEventListener` / `on(...)` w WebViewTab, Terminal, App, `preload.cjs`. Cel: brak memory leaków.
- **Walidacja danych w IPC** – każdy handler IPC waliduje typy i strukturę danych. Cel: brak korupcji danych.
- **try/catch w IPC** – każdy handler zwraca `{ ok, data, error }`. Cel: przewidywalne błędy.
- **SingleInstanceLock** – blokada wielu instancji aplikacji. Cel: stabilność store.
- **Global error handlers** – logowanie `uncaughtException` / `unhandledRejection`. Cel: diagnostyka.
- **Settings merge** – zapis ustawień przez merge, nie overwrite. Cel: brak utraty danych.
- **Zapis profili** – każda zmiana profili → `saveProfiles()`. Cel: trwałość profili.
- **Autosave Notepad tylko przy zmianie** – porównanie `content` vs `lastSaved`. Cel: oszczędność I/O.
- **Logger + logi do pliku** – logi w `userData/logs/app.log` + eksport. Cel: debug.
- **`config.js`** – stałe, limity, wartości domyślne. Cel: czysta architektura.
- **`constants.js`** – enumy, mapy kategorii (`TASK_PRIORITIES`, `TASK_STATUS`, `APP_CATEGORIES_MAP`). Cel: centralne stałe.
- **WebView error bar** – pasek błędu zamiast alertów. Cel: UX.
- **Modale zamiast `alert` / `prompt`** – globalny komponent `Modal`. Cel: spójny UX.
- **Toast + system notifications** – nowoczesne powiadomienia. Cel: feedback.
- **Pushbullet API** – powiadomienia mobilne. Cel: integracja (DO-ANALYSIS).
- **Spellcheck + syntax highlight** – Notepad z CodeMirror/Monaco. Cel: edycja kodu (BACKLOG).
---
## 2. SIDEBAR / PROFILE MANAGER / APP LIBRARY
- **App Library** – statyczna lista aplikacji, dodawanie profili jednym kliknięciem. Dane: `id`, `name`, `url`, `icon`, `isPinned`, `isDefault`, `isFavorite`.
- **Filtrowanie profili** – search bar nad listą profili.
- **Kategorie profili** – AI / Dev / Design / Productivity / Special.
- **Ostatnio używane** – sortowanie po `lastUsedAt`.
- **Drag & drop profili** – zmiana kolejności + zapis.
- **Edycja profilu (modal)** – `name`, `url`, `label`, `notepad`, `userAgent`, `adBlocker` per profil.
- **Multi-account login** – DO-ANALYSIS.
---
## 3. WEBVIEWTAB / PRZEGLĄDARKA
- **Toolbar jak w przeglądarce** – Back, Forward, Refresh, Copy URL, Open External, Zoom, DevTools, Clear Cache.
- **Tile view** – 2–3 WebView obok siebie (BACKLOG).
- **Custom user agent** – per profil.
- **AdBlocker globalny + per profil** – override globalnego ustawienia.
- **Single App Mode** – otwieranie profilu w osobnym oknie.
- **Resource Monitor** – stores istnieje, UI brakuje (BACKLOG).
- **Sleep Tabs** – usypianie nieaktywnych WebView po X minutach.
- **Screenshot WebView** – zapis do schowka + toast.
- **Cookie Grabber** – pobieranie cookies z aktywnego WebView.

---

## 4. NOTEPAD

- **Multi-tab** – zakładki, rename, close.
- **Autosave tylko przy zmianie** – porównanie `content`.
- **Syntax highlight** – BACKLOG.
- **Rich text** – BACKLOG.

---

## 5. TASKPANEL / AGGREGATEDTASKS

- **TaskModal (Add/Edit Task)** – modal zamiast `prompt`.
- **Filtrowanie po priorytecie** – A/B/C/D/E.
- **Wyszukiwarka zadań** – search bar.
- **Rich text w zadaniach** – BACKLOG.
- **AggregatedTasks** – widok zadań per projekt.

---

## 6. TERMINAL

- **node-pty + xterm** – pełny terminal.
- **Cleanup listenerów** – usuwanie `onData` / `onExit`.
- **Historia komend** – strzałka ↑/↓.
- **Kolorowanie ANSI** – obsługiwane przez xterm.

---

## 7. SETTINGS

- **Hotkeys manager** – skróty + teksty do wklejenia.
- **Dark mode** – Tailwind + klasa `.dark`.
- **Eksport/Import ustawień** – plik JSON.
- **Logi dostępne z Settings** – przycisk „Otwórz folder logów".
- **Konto użytkownika + sync** – DO-ANALYSIS.

---

## 8. TOOLS (NARZĘDZIA)

- JSON / YAML / XML Formatter
- Regex Tester
- Markdown Previewer
- Image Tools
- SVG → PNG Converter
- File Previewer
- Mini Postman
- Clipboard History
- Cookie Grabber
- Remove.bg
- String Combiner

---

## 9. APP LIBRARY (PEŁNA)

- **`app-library.json`** – każda aplikacja: `id`, `name`, `url`, `icon`, `isPinned`, `isDefault`, `isFavorite`.
- **`AppLibraryBrowser`** – pełny widok biblioteki.

---

## 10. UI/UX

- Sidebar redesign
- WebView toolbar
- Toasty
- Tooltipy wszędzie
- Modale
- Loading states (spinner, skeleton)

---

## 10b. ONBOARDING

- **SplashScreen** – animacja startowa (~2s) przy każdym uruchomieniu. SVG/PNG logo, nazwa aplikacji, animowany pasek postępu. Fade-out 300ms. Komponent: `src/ui/system/SplashScreen.jsx`.
- **OnboardingScreen** – wieloetapowy wizard przy `firstRun === true`. Kroki: `theme` → `language` → `privacy` → `apps` → `account`. Po ukończeniu zapisuje patch do settings przez IPC i ustawia `firstRun: false`. Komponent: `src/ui/system/OnboardingScreen.jsx`.
- **StepPrivacy** – krok z toggleami opt-in: `toastsEnabled`, `logsEnabled`, `analyticsEnabled`.

## 10c. SYSTEM POWIADOMIEŃ

- **Toast Queue** – kolejka toastów UI (`success`/`error`/`warning`/`info`). Max 3 aktywne, reszta w FIFO queue. Czas widoczności: 2s, animacja 0.3s. API: `showToast(type, msg)` z `notificationsManager.js`. Komponent: `src/ui/system/ToastContainer.jsx`.
- **System Notifications** – powiadomienia systemowe OS przez `electron.Notification`. Działają przy zminimalizowanym oknie. IPC: `notifications:showSystem`. Toggle: `settings.systemNotificationsEnabled`.

## 10d. DZIENNIK ZDARZEŃ (EVENT LOG)

- **eventLogger.js** – fire-and-forget logger kluczowych akcji użytkownika do pliku `userData/logs/events.log`. Format: NDJSON. Rotacja co 2MB (max 2 archiwa). Sanityzacja params (blacklista: password, token, cookie itp.). Guard: `settings.eventLogEnabled === false` → nic nie zapisuje. API: `logEvent(module, fn, action, params, source)`. Toggle w `LogsSection.jsx`.

## 11. LOADERY (DYNAMICZNE ŁADOWANIE)

- **`testsLoader.js`** – dynamiczne ładowanie `TestRunner_*.js` z folderu `tests/`
- **`ipcLoader.js`** – dynamiczne ładowanie `ipcMainHandlers_*.js` z folderu `src/ipc/`

---

## 12. TESTY (TestRunner_*.js)

- `TestRunner_AdBlocker.js` – testy AdBlockera (globalny + per profil, wykrywanie URL)
- `TestRunner_Assets.js` – testy spójności plików w folderze assets/
- `TestRunner_BusinessLogic.js` – testy czystych funkcji (cartesian, parseSplitChar, normalizeUrl)
- `TestRunner_Config.js` – testy konfiguracji (feature flags, limity, ścieżki, API endpoints)
- `TestRunner_CSS.js` – testy spójności CSS (importy, kolejność, istniejące pliki)
- `TestRunner_Doc.js` – testy spójności dokumentacji w folderze doc/
- `TestRunner_ElectronAPI.js` – testy dostępności i typu metod window.electronAPI
- `TestRunner_History.js` – testy historii (filtry, eksport)
- `TestRunner_IPC.js` – testy handlerów IPC (openExternal, appendLogFile, getHotkeys, setGlobalAdBlocker)
- `TestRunner_Icons.js` – testy integralności ikon (ICONS, SIDEBAR_ICON_MAP)
- `TestRunner_Locales.js` – testy spójności plików locales (dynamicznie z LANGUAGES z config.js)
- `TestRunner_LogWriter.js` – testy LogWritera (zapis, odczyt, czyszczenie)
- `TestRunner_MainEngine.js` – testy modułów z main.js (webviewRegistry, adBlocker, hotkeysManager)
- `TestRunner_Notepad.js` – testy notatnika (struktura notatki, multi-tab, autosave)
- `TestRunner_Profiles.js` – testy profili (struktura, sortowanie last used)
- `TestRunner_Projects.js` – testy projektów (struktura, archiwizacja, liczba zadań)
- `TestRunner_Reexport.js` – testy re-eksportów (config.js, icons.js)
- `TestRunner_Settings.js` – testy ustawień (dark mode toggle, eksport/import)
- `TestRunner_SleepTabs.js` – testy Sleep Tabs (timeout, wake, threshold)
- `TestRunner_Store.js` – testy store (settings, notepad, history)
- `TestRunner_Tasks.js` – testy zadań (struktura, filtrowanie priorytetów, wyszukiwanie)
- `TestRunner_Terminal.js` – testy terminala (xterm, node-pty, ANSI, historia komend)
- `TestRunner_Tools.js` – testy narzędzi (JSON formatter, Regex Tester, Markdown Previewer)
- `TestRunner_WebView.js` – testy WebView (screenshot, resource monitor, zoom)

---
<!-- END OF FILE -->
