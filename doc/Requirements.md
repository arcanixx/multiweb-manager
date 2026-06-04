<!-- =============================================================================
 FILE: Requirements.md
 PATH: doc/Requirements.md
 VERSION: 0.0.3
 PURPOSE: Dokumentacja specyfikacji projektowej - Wymagania aplikacji z aktualnymi statusami, priorytetami i komentarzami
 FUNCTIONS: Dokumentacja: 17 sekcji głównych
 DEPENDS ON: -
 UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
 ============================================================================= -->

---
# 📋 MULTIWEB MANAGER — WYMAGANIA SYSTEMOWE
> Wersja dokumentu: 0.0.3 | Ostatnia aktualizacja: 2026-05-26
> Format: ID | Sekcja | Opis | Status | Priorytet | Version | Komentarz
---
## ## ACTIVE (AKTYWNE ZADANIA)
---
## 📦 ARCHITEKTURA I STABILNOŚĆ
> Fundament całej aplikacji. Wymagania dotyczące stabilności, bezpieczeństwa IPC, zarządzania pamięcią i architektury kodu.
---
### [Cleanup Event Listenerów] :
- **ID:** ARCH_REQ-001
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Cleanup event listenerów w komponentach WebViewTab, Terminal i App.jsx. Każdy `useEffect` dodający event listener musi zwracać funkcję cleanup (`removeEventListener`). W WebViewTab.jsx — eventy WebView (`did-finish-load`, `console-message`) muszą być usuwane przy unmount. W Terminal.jsx — xterm i pty muszą być dispose'owane (`onData.dispose()`, `onExit.dispose()`, `pty.kill()`, `term.dispose()`). W preload.cjs — funkcje `onX` muszą zwracać cleanup: `return () => ipcRenderer.removeListener(...)`.
- **Status:** IN_SPRINT
- **Priorytet:** CRITICAL
- **Version:** 0.0.3
- **Komentarz:** Brak cleanup → memory leak, crash, duplikacja eventów, rosnący RAM. Dotyczy plików: `WebViewTab.jsx`, `Terminal.jsx`, `App.jsx`, `preload.cjs`. Szukaj wszystkich `addEventListener`, `on(...)`, `xterm.onData`, `ipcRenderer.on` i dodaj cleanup.
---
### [Walidacja Danych w IPC] :
- **ID:** ARCH_REQ-002
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Każdy handler IPC w `main.js` / `ipcMainHandlers.js` musi walidować typy i strukturę przychodzącego payloadu przed przetworzeniem. Walidacja: `if (!payload || typeof payload !== "object") return { ok: false, error: "INVALID_PAYLOAD" }`. Walidacja pól settings (np. `language` musi być stringiem), profilu (wymagane `id` i `url` jako string), tasków (musi być tablicą).
- **Status:** IN_SPRINT
- **Priorytet:** CRITICAL
- **Version:** 0.0.3
- **Komentarz:** Renderer może wysłać null, "string", {}, błędne typy → korupcja danych w Electron Store. Nigdy nie zakładaj, że renderer wysyła poprawne dane. Dotyczy: `main.js`, `ipcMainHandlers.js`, wszystkich store'ów korzystających z IPC.
---
### [Try/Catch w Handlerach IPC] :
- **ID:** ARCH_REQ-003
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Każdy handler IPC musi być opakowany w blok `try/catch`. Przy błędzie zwracać `{ ok: false, error: err.message || "UNKNOWN_ERROR" }`. Wszystkie operacje I/O (fs, store, API) muszą być w try/catch.
- **Status:** IN_SPRINT
- **Priorytet:** CRITICAL
- **Version:** 0.0.3
- **Komentarz:** Bez try/catch błąd zapisu → renderer dostaje `undefined` → UI nie wie, co się stało.
---
### [Single Instance Lock] :
- **ID:** ARCH_REQ-004
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Implementacja `app.requestSingleInstanceLock()` na górze `main.js`. Jeśli aplikacja nie uzyska blokady — `app.quit()` i `process.exit(0)`. Obsługa zdarzenia `second-instance`: przywrócenie i fokus na istniejącym oknie.
- **Status:** IN_SPRINT
- **Priorytet:** CRITICAL
- **Version:** 0.0.3
- **Komentarz:** Bez blokady użytkownik może odpalić kilka instancji → store się psuje.

---

### [Globalne Handlery Błędów] :

- **ID:** ARCH_REQ-005
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Dodanie globalnych handlerów błędów w `main.js`: `process.on("uncaughtException", ...)` oraz `process.on("unhandledRejection", ...)`. Oba muszą wywoływać `logError(...)` zapisujący do pliku logów.
- **Status:** IN_SPRINT
- **Priorytet:** CRITICAL
- **Version:** 0.0.3
- **Komentarz:** Brak obsługi błędów → aplikacja wywala się bez logów.

---

### [Merge Settings (nie Overwrite)] :

- **ID:** ARCH_REQ-006
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Funkcja `updateSettings(partial)` w `settingsStore.js` musi stosować merge: `const merged = { ...current, ...partial }`. Nigdy nie nadpisywać całego obiektu settings jednym polem.
- **Status:** IN_SPRINT
- **Priorytet:** CRITICAL
- **Version:** 0.0.3
- **Komentarz:** `saveSettings({ projects: [...] })` nadpisuje CAŁE settings → tracisz język, debugMode, API key itd.

---

### [Trwały Zapis Profili] :

- **ID:** ARCH_REQ-007
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Każda zmiana profili (dodanie, edycja, usunięcie) musi kończyć się wywołaniem `saveProfiles(nextProfiles)` przez IPC → main → electron-store.
- **Status:** IN_SPRINT
- **Priorytet:** CRITICAL
- **Version:** 0.0.3
- **Komentarz:** Profil dodany → nie zapisany → znika po restarcie.

---

### [Autosave Notepad tylko przy Zmianie] :

- **ID:** ARCH_REQ-008
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Autosave notatnika co 5 sekund, ale tylko gdy `content !== lastSaved`. Cleanup: `return () => clearInterval(interval)`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Zapis co 5s nawet bez zmian → lag, I/O spam.

---

### [Logger z Zapisem do Pliku i Eksportem] :

- **ID:** ARCH_REQ-009
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** System logowania musi zapisywać do pliku `userData/logs/app.log`. W Settings — przycisk eksportu logów.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** DebugMode loguje tylko do konsoli — niewystarczające.

---

### [Osobny Plik config.js] :

- **ID:** ARCH_REQ-010
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Wydzielenie stałych konfiguracyjnych do osobnego pliku `config.js`. Settings = dane użytkownika (zmienne). Config = stałe aplikacji (niezmienne w runtime).
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Settings zawiera rzeczy, które powinny być stałe → bałagan architektoniczny.

---

### [WebView Błędy bez alert()] :

- **ID:** ARCH_REQ-011
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Zastąpienie wszystkich `alert()` w `WebViewTab.jsx` komponentem `WebViewErrorBar` inline z przyciskiem „Reload".
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Alerty są brzydkie i blokujące.

---

### [Zastąpienie alert/prompt Modalami] :

- **ID:** ARCH_REQ-012
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Absolutny zakaz używania `alert()`, `confirm()`, `prompt()`. Stworzyć `Modal.jsx` i używać go do: Add/Edit Task, Add/Edit Profile, Add/Edit Project, Confirm Delete.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Prompty są archaiczne i blokujące.

---

### [Cleanup Listenerów online/offline] :

- **ID:** ARCH_REQ-013
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** W `App.jsx` — eventy `online`/`offline` muszą mieć cleanup w `useEffect`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Brak cleanup → memory leak przy remount komponentu.

---

### [System Powiadomień (Toast + System Notifications)] :

- **ID:** ARCH_REQ-014
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Globalny system powiadomień: toasty (success/error/info/warning) w `UI/ToastContainer.jsx` oraz systemowe powiadomienia OS (`new Notification(...)`). Toggle w Settings.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Dotyczy: `UI/ToastContainer.jsx`, `notificationsManager.js`.

---

### [Pushbullet API] :

- **ID:** ARCH_REQ-015
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Integracja z Pushbullet API. Użytkownik podaje API key w Settings. Możliwość wysyłania powiadomień.
- **Status:** IN_SPRINT
- **Priorytet:** MINOR
- **Version:** 0.0.3
- **Komentarz:** Nice-to-have.

---

### [Spellcheck i Walidacja Kodu w Notatniku] :

- **ID:** ARCH_REQ-016
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Implementacja CodeMirror lub Monaco Editor. Tryby: JS, Python, HTML, CSS, XML. Spellcheck PL/EN zależny od języka systemu.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Notepad jest plain text → nie nadaje się do kodu.

---

### [Global Error Boundary] :

- **ID:** ARCH_REQ-017
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Globalny Error Boundary w React (`src/ui/system/ErrorBoundary.jsx`). Owiń `App` w `<ErrorBoundary>`. Przy błędzie renderuje fallback UI.
- **Status:** IN_SPRINT
- **Priorytet:** CRITICAL
- **Version:** 0.0.3
- **Komentarz:** Bez tego jeden błąd w komponencie rozwala cały renderer.

---

### [Centralny Storage Manager] :

- **ID:** ARCH_REQ-018
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Centralny wrapper storage (`src/utils/storage.js`). API: `storage.loadSettings()`, `storage.saveSettings()`, `storage.loadProfiles()`, `storage.saveProfiles()`. Komponenty NIE wywołują bezpośrednio `electronAPI`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Uprości testy, refactor, pozwoli dodać sync/backup/cache/retry.

---

### [Command System / Palette] :

- **ID:** ARCH_REQ-019
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** System komend (`src/core/commandRegistry.js`). Rejestracja: `registerCommand({ id, name, shortcut, action })`. Globalna palette (`Ctrl+K` lub `Ctrl+P`).
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Podstawa pod automatyzację, plugin system, szybkie akcje.

---

### [Session Restore] :

- **ID:** ARCH_REQ-020
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Po restarcie aplikacji – przywróć ostatnio otwarte profile i zakładki. Zapisywane w `sessionStore.json`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** UX – użytkownik nie chce tracić sesji.

---

### [Safe Mode] :

- **ID:** ARCH_REQ-021
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Uruchomienie aplikacji z flagą `--safe-mode`. Wyłącza: WebView, pluginy, cache, hotkeys, sleep tabs. Uruchamia minimalny UI.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Krytyczne przy awariach.

---

### [Queue System] :

- **ID:** ARCH_REQ-022
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Globalny system kolejek (`src/utils/queueManager.js`). Obsługa: RemoveBG, backup, import, export, batch image processing.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Uniknięcie blokowania UI przy długich operacjach.

---

### [Resource Monitor – UI i Toasty] :

- **ID:** ARCH_REQ-023
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** UI dla Resource Monitor – przycisk w toolbarze WebView. Po kliknięciu: toast z RAM/CPU. Ostrzeżenia gdy zużycie > 70% (warn) i > 90% (critical). Wykorzystuje `DEFAULT_SETTINGS.resourceMonitor = { warnAt: 70, criticalAt: 90 }`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Handler IPC istnieje, brakuje UI i toastów.

---

### [Terminal.jsx – naprawa błędów składni i API] :
- **ID:** ARCH_REQ-038
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** W `src/ui/terminal/Terminal.jsx` usunięto podwójny export default oraz przeniesiono importy na początek pliku. Dodatkowo naprawiono rozbieżność API z preload.cjs – używane są aliasy (terminalWriteLegacy, terminalResizeLegacy) dla zachowania spójności. Docelowo aliasy należy usunąć i ujednolicić sygnatury.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Zmiana eliminuje błąd parsowania modułu i przywraca komunikację terminala z preload. Pełna poprawa API (bez aliasów) wymaga dodatkowej sesji.

---

### [Dodanie brakujących ikon do rejestru] :
- **ID:** ARCH_REQ-039
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Do pliku `src/data/icons.js` dodano brakujące ikony: CLEAR, APP_LIBRARY, DATA, HTML, NOTIFICATION, PUSHBULLET, SVG, TABS. Uzupełniono SIDEBAR_ICON_MAP o brakujące mapowania (appLibrary, tools).
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Ikony były używane w komponentach ale niezdefiniowane – powodowało błędy w konsoli.

---

### [Dodanie Error Boundary w App.jsx] :
- **ID:** ARCH_REQ-040
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Dodano `AppErrorBoundary` (klasowy React.Component) opakowujący główny render App. Przy błędzie w dowolnym komponencie renderuje fallback UI zamiast białego ekranu.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Zgodne z ARCH_REQ-017. Brak tego elementu powodował całkowite zawieszenie renderera.

---

### [URL sanitization – blokada niebezpiecznych URLi] :
- **ID:** ARCH_REQ-041
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Dodano `isSafeUrl()` w `src/utils/urlUtils.js` blokującą: javascript:, vbscript:, data:, file:, about:, blob:. Zintegrowano z `normalizeWebUrl()` i `ipcMainHandlers_webview_nav.js` (webview:navigate).
- **Status:** IN_SPRINT
- **Priorytet:** CRITICAL
- **Version:** 0.0.3
- **Komentarz:** Podstawowe zabezpieczenie przed atakami script injection przez pasek adresu.

---

### [Standaryzacja obsługi błędów z modalami/toastami] :
- **ID:** ARCH_REQ-042
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Wprowadzenie jednolitego systemu obsługi błędów w aplikacji. Wszystkie nieobsłużone wyjątki i błędy IPC muszą być prezentowane użytkownikowi poprzez modal ConfirmModal (dla krytycznych błędów wymagających potwierdzenia) lub toast (dla błędów nieblokujących). W przypadku błędów I/O (np. odczyt/zapis plików) należy wykonać trzy kroki: 1) Złapać błąd w try-catch, 2) Zalogować błąd przez logger z kontekstem modułu, opisem akcji i szczegółami błędu, 3) Pokaż odpowiedni komunikat użytkownikowi (toast dla błędów nieblokujących, modal dla błędów uniemożliwiających kontynuację pracy). Dotyczy wszystkich hooków use* i funkcji zapisujących/odczytujących dane.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Standaryzacja poprawi UX poprzez konsekwentne informowanie użytkownika o problemach oraz ułatwi debugowanie poprzez jednolite logowanie.


### [Deep merge ustawień (lodash.merge)] :
- **ID:** ARCH_REQ-042
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Zastąpiono `{...current, ...patch}` przez `_.merge({}, current, patch)` w `settingsStore.js`. Zapewnia poprawną aktualizację zagnieżdżonych pól (np. resourceMonitor.warnAt).
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Lodash musi być zainstalowany (`npm i lodash`). Zgodne z ARCH_REQ-006.

---

## 🗂️ SIDEBAR / PROFILE MANAGER

> Wymagania dotyczące panelu bocznego: zarządzanie profilami, biblioteka aplikacji, wyszukiwanie, kategorie, drag & drop.

---

### [App Library — Biblioteka Gotowych Aplikacji] :

- **ID:** SIDEBAR_REQ-001
- **Sekcja:** SIDEBAR / PROFILE MANAGER
- **Opis:** Stworzenie biblioteki gotowych aplikacji w pliku `src/data/app-library.json`. Struktura: kategorie (AI, Dev, Design, Productivity, Special) z listą aplikacji. W Sidebar — sekcja „App Library". Funkcja `handleAddFromLibrary(app)` tworzy nowy profil.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** App Library jest statyczna. Dodawanie profilu = tworzenie nowego obiektu w profilesStore.

---

### [Filtrowanie Profili — Search Bar] :

- **ID:** SIDEBAR_REQ-002
- **Sekcja:** SIDEBAR / PROFILE MANAGER
- **Opis:** Komponent `SidebarSearch.jsx` z polem input filtrującym profile w czasie rzeczywistym po `name`, `url`, `label`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Sidebar może mieć 50+ profili → trudno znaleźć właściwy.

---

### [Kategorie Profili] :

- **ID:** SIDEBAR_REQ-003
- **Sekcja:** SIDEBAR / PROFILE MANAGER
- **Opis:** Dodanie pola `category` do profilu. Grupowanie profili w Sidebar według kategorii przez `SidebarSection`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Profile są w jednej liście → chaos.

---

### [Ostatnio Używane Profile] :

- **ID:** SIDEBAR_REQ-004
- **Sekcja:** SIDEBAR / PROFILE MANAGER
- **Opis:** Dodanie pola `lastUsedAt` do profilu. Sekcja „Last used" w Sidebar: 10 ostatnio używanych profili.
- **Status:** IN_SPRINT
- **Priorytet:** MINOR
- **Version:** 0.0.3
- **Komentarz:** Szybki dostęp do ostatnio używanych aplikacji.

---

### [Drag & Drop Profili] :

- **ID:** SIDEBAR_REQ-005
- **Sekcja:** SIDEBAR / PROFILE MANAGER
- **Opis:** Implementacja HTML5 drag & drop dla profili w Sidebar. Funkcja `reorderProfiles(targetId)`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Pełna personalizacja Sidebaru.

---

### [Edycja Profilu — Modal] :

- **ID:** SIDEBAR_REQ-006
- **Sekcja:** SIDEBAR / PROFILE MANAGER
- **Opis:** Komponent `ProfileModal.jsx` z polami: Name, URL, Category, Label, Notes, User Agent, adBlocker, pinned. Walidacja URL.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** AdBlocker per profil override.

---

## 🌐 WEBVIEW MANAGER

> Wymagania dotyczące widoku WebView: toolbar, tile view, user agent, adblocker, screenshot, single app mode, resource monitor.

---

### [Toolbar WebView jak w Przeglądarce] :

- **ID:** WEBVIEW_REQ-001
- **Sekcja:** WEBVIEW MANAGER
- **Opis:** Komponent `WebViewToolbar.jsx` z przyciskami: Back, Forward, Refresh, Address Bar, Copy URL, Open External, Zoom, DevTools, Clear Cache, Screenshot. Skróty: `Ctrl+L`, `Ctrl+R`, `Alt+←/→`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Obecny toolbar jest minimalny.

---

### [Tile View — Wiele WebView Obok Siebie] :

- **ID:** WEBVIEW_REQ-002
- **Sekcja:** WEBVIEW MANAGER
- **Opis:** Tryb tile view: 2–3 WebView obok siebie w gridzie. Przycisk toggle w toolbarze. Komponent `WebViewTileView.jsx`.
- **Status:** BACKLOG
- **Priorytet:** MINOR
- **Version:** 0.0.4
- **Komentarz:** FEATURES.tileView = true w config.js, ale komponent nie istnieje.

---

### [Custom User Agent per Profil] :

- **ID:** WEBVIEW_REQ-003
- **Sekcja:** WEBVIEW MANAGER
- **Opis:** Pole `userAgent` w profilu. Input w `ProfileModal.jsx`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Niektóre strony wymagają UA (mobilne wersje).

---

### [AdBlocker — Toggle Globalny i per Profil] :

- **ID:** WEBVIEW_REQ-004
- **Sekcja:** WEBVIEW MANAGER
- **Opis:** Implementacja AdBlockera w `main.js` przez `session.defaultSession.webRequest.onBeforeRequest`. Funkcja `isAdUrl(url)` sprawdza regex. Zmiana wymaga restartu WebView.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Globalny toggle w Settings + per-profile override.

---

### [Screenshot Aktywnego WebView] :

- **ID:** WEBVIEW_REQ-005
- **Sekcja:** WEBVIEW MANAGER
- **Opis:** Przycisk „Screenshot" w toolbarze WebView. API `capturePage()`, zapis PNG do schowka, toast potwierdzenia.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Przycisk istnieje w toolbarze.

---

### [Single App Mode — Osobne Okno Electron] :

- **ID:** WEBVIEW_REQ-006
- **Sekcja:** WEBVIEW MANAGER
- **Opis:** Przycisk w toolbarze WebView otwierający profil w osobnym oknie Electron. Po zamknięciu okna — powrót.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Idealne na drugi monitor.

---

### [Resource Monitor WebView – Handler] :

- **ID:** WEBVIEW_REQ-007
- **Sekcja:** WEBVIEW MANAGER
- **Opis:** Handler IPC dla Resource Monitor. Dane pobierane z `webContents.getProcessMemoryInfo()`. **Handler istnieje, UI brakuje** (patrz ARCH_REQ-023).
- **Status:** IN_SPRINT
- **Priorytet:** MINOR
- **Version:** 0.0.3
- **Komentarz:** Część ARCH_REQ-023.

---

### [Sleep Tabs — Uśpienie Nieaktywnych Kafelków] :

- **ID:** WEBVIEW_REQ-008
- **Sekcja:** WEBVIEW MANAGER
- **Opis:** Jeśli profil nie jest aktywny przez X minut → WebView `loadURL("about:blank")`. Przy aktywacji → wybudzenie. Placeholder „Tab is sleeping". Konfiguracja w `config.js` i Settings.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Sprawdzanie co 60 sekund przez `setInterval` z cleanup.

---

## 📝 NOTEPAD EDITOR

> Wymagania dotyczące notatnika: syntax highlight, spellcheck, rich text.

---

### [Syntax Highlight — CodeMirror/Monaco] :

- **ID:** NOTEPAD_REQ-001
- **Sekcja:** NOTEPAD EDITOR
- **Opis:** Implementacja CodeMirror lub Monaco Editor. Tryby: JS, Python, HTML, CSS, XML. Syntax highlight gdy `note.mode === "code"`.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** FEATURES.syntaxHighlight = true w config.js, ale brak implementacji.

---

### [Spellcheck w Notatniku] :

- **ID:** NOTEPAD_REQ-002
- **Sekcja:** NOTEPAD EDITOR
- **Opis:** W trybie plain/rich text: `<textarea spellCheck={settings.spellcheck} />`. Toggle w Settings.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Spellcheck PL/EN zależny od języka systemu.

---

### [Rich Text Notatki] :

- **ID:** NOTEPAD_REQ-003
- **Sekcja:** NOTEPAD EDITOR
- **Opis:** Tryb rich text: bold, italic, underline, listy, linki. Przełączanie między trybami.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** FEATURES.richText = true w config.js, ale brak implementacji.

---

## ✅ TASKPANEL / AGGREGATEDTASKS

> Wymagania dotyczące panelu zadań: filtrowanie, wyszukiwanie, rich text w opisach, modal dodawania/edycji.

---

### [Filtrowanie Zadań po Priorytecie] :

- **ID:** TASKS_REQ-001
- **Sekcja:** TASKPANEL / AGGREGATEDTASKS
- **Opis:** Filtrowanie zadań po priorytecie (A/B/C/D/E) w `TaskPanel.jsx`. Komponent `TaskFilters.jsx` z dropdownem.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Kolory priorytetów spójne w całej aplikacji.

---

### [Wyszukiwarka Zadań] :

- **ID:** TASKS_REQ-002
- **Sekcja:** TASKPANEL / AGGREGATEDTASKS
- **Opis:** Wyszukiwanie zadań w czasie rzeczywistym po `title` i `description`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Case-insensitive.

---

### [Rich Text w Opisach Zadań] :

- **ID:** TASKS_REQ-003
- **Sekcja:** TASKPANEL / AGGREGATEDTASKS
- **Opis:** Rich text editor w polu `description` w `TaskModal.jsx`. Opis jako HTML/Markdown.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Zapisywany w store jako string.

---

### [Modal Add/Edit Task] :

- **ID:** TASKS_REQ-004
- **Sekcja:** TASKPANEL / AGGREGATEDTASKS
- **Opis:** Komponent `TaskModal.jsx` z polami: tytuł (wymagany), opis, priorytet (dropdown), status (Backlog/Active/Done, dropdown), projekt, deadline, tagi.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Usunięcie wszystkich `prompt()` związanych z zadaniami.

---

## 💻 TERMINAL CONSOLE

> Wymagania dotyczące terminala: cleanup listenerów, historia komend, kolorowanie ANSI.

---

### [Cleanup Listenerów IPC Terminala] :

- **ID:** TERMINAL_REQ-001
- **Sekcja:** TERMINAL CONSOLE
- **Opis:** W `preload.cjs` funkcje `onTerminalData` i `onTerminalExit` muszą zwracać cleanup. W `Terminal.jsx` dispose'ować listenery i zabijać `ptyProcess`.
- **Status:** IN_SPRINT
- **Priorytet:** CRITICAL
- **Version:** 0.0.3
- **Komentarz:** Każde otwarcie terminala dokłada kolejne subskrypcje → memory leak.

---

### [Historia Komend Terminala] :

- **ID:** TERMINAL_REQ-002
- **Sekcja:** TERMINAL CONSOLE
- **Opis:** Historia komend per sesja. Obsługa strzałek ArrowUp/ArrowDown przez `term.onKey`.
- **Status:** IN_SPRINT
- **Priorytet:** MINOR
- **Version:** 0.0.3
- **Komentarz:** Standard w terminalach.

---

### [Kolorowanie Outputu ANSI] :

- **ID:** TERMINAL_REQ-003
- **Sekcja:** TERMINAL CONSOLE
- **Opis:** xterm.js obsługuje ANSI natywnie. Addony: `FitAddon`, `WebLinksAddon`.
- **Status:** IN_SPRINT
- **Priorytet:** MINOR
- **Version:** 0.0.3
- **Komentarz:** Nie trzeba ręcznie parsować kolorów.

---

## ⚙️ SETTINGS PANEL

> Wymagania dotyczące panelu ustawień: hotkeys, dark mode, eksport/import, logi.

---

### [Hotkeys Manager — Custom Skróty i Snippety] :

- **ID:** SETTINGS_REQ-001
- **Sekcja:** SETTINGS PANEL
- **Opis:** Moduł `SettingsHotkeys.jsx` z tabelą hotkeys. Store `hotkeysStore.js`. Rejestracja przez `globalShortcut`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Snippety tekstowe do automatycznego wklejania.

---

### [Dark Mode] :

- **ID:** SETTINGS_REQ-002
- **Sekcja:** SETTINGS PANEL
- **Opis:** Ustawienie `settings.theme = "light" | "dark" | "system"`. Klasa `dark` na `document.documentElement`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Dark mode to grzech w aplikacji devowej.

---

### [Eksport/Import Ustawień] :

- **ID:** SETTINGS_REQ-003
- **Sekcja:** SETTINGS PANEL
- **Opis:** Eksport do JSON: `{ version, exportedAt, settings, profiles, tasks, notes }`. Import z walidacją i modalem potwierdzenia.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Backup i migracja między maszynami.

---

### [Logi Dostępne z Settings] :

- **ID:** SETTINGS_REQ-004
- **Sekcja:** SETTINGS PANEL
- **Opis:** Przycisk „Otwórz folder logów" w `SettingsDebug.jsx`. Handler IPC `logs:openFolder`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Logi są, ale użytkownik nie ma łatwego dostępu.

---

### [Przycisk Czyszczenia Logów] :

- **ID:** SETTINGS_REQ-005
- **Sekcja:** SETTINGS PANEL
- **Opis:** Przycisk „Wyczyść logi" w `SettingsDebug.jsx`. Usuwa pliki w `userData/logs/` (oprócz aktualnego).
- **Status:** IN_SPRINT
- **Priorytet:** MINOR
- **Version:** 0.0.3
- **Komentarz:** Zarządzanie przestrzenią dyskową.

---

## 🛠️ TOOLSPANEL — NARZĘDZIA (KAFELKI)

> Wymagania dotyczące panelu narzędzi: formattery, testery, konwertery, narzędzia deweloperskie.

---

### [Lazy loading narzędzi w ToolsPanel (React.lazy)] :
- **ID:** TOOLS_REQ-015
- **Sekcja:** TOOLSPANEL (KAFELKI)
- **Opis:** ToolsPanel.jsx ładuje wszystkie narzędzia (MiniPostman, RegexTester, CookieGrabber, itd.) przy starcie, co zwiększa rozmiar bundle i czas ładowania. Należy zastosować React.lazy i Suspense – każde narzędzie ładowane dynamicznie dopiero po kliknięciu w zakładkę.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Zadanie w stanie PENDING – do wdrożenia. Nie zmienia logiki działania, tylko sposób ładowania komponentów.

---

### [useAsync hook – wspólny wrapper dla operacji asynchronicznych] :
- **ID:** GENERAL_REQ-019
- **Sekcja:** OGÓLNE / TECH DEBT
- **Opis:** Stworzenie hooka `useAsync(asyncFn, deps)` w `src/hooks/useAsync.js`. Hook przyjmuje funkcję asynchroniczną i zwraca `{ data, loading, error, refetch }`. Eliminuje duplikację wzorca `setLoading(true) → invoke → setLoading(false)` z wszystkich hooków (useHistoryLog, useNotepad, useProjects, useSettings, useTasks, useWorkspaces). Zależne od GENERAL_REQ-009 i GENERAL_REQ-012.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Do wdrożenia. Powiązane z refaktorem load() w hookach.

---

### [Feature Flags per moduł w config.js] :
- **ID:** GENERAL_REQ-020
- **Sekcja:** OGÓLNE / TECH DEBT
- **Opis:** Rozbudowa `FEATURES` w `config.js` o flagi per moduł: `FEATURES.debug.terminal`, `FEATURES.debug.webview`, `FEATURES.debug.ipc`. Każda flaga kontroluje szczegółowość logowania dla konkretnego modułu. Flagi widoczne w Settings (sekcja Debug) jako checkboxy. Aktualna struktura `FEATURES` ma flagi globalne – wymaga rozbudowy do granularnej kontroli.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Do wdrożenia. Obecny `FEATURES` jest płaski – wymaga rozbudowy o granularne flagi debug.

---

### [Rotacja logów w logWriter.js] :
- **ID:** GENERAL_REQ-021
- **Sekcja:** OGÓLNE / TECH DEBT
- **Opis:** W `src/utils/logWriter.js` i `ipcMainHandlers_logs.js` dodanie automatycznej rotacji plików logów: maksymalny rozmiar pliku 5MB, po przekroczeniu – archiwizacja do `test-fails.log.1`, `test-fails.log.2` (max 3 archiwum). Bieżący plik zawsze `test-fails.log`. Czyszczenie starszych archiwum automatycznie.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Do wdrożenia. Bez rotacji plik logów rośnie nieograniczenie.

---

### [Walidator locale przed buildem] :
- **ID:** GENERAL_REQ-022
- **Sekcja:** OGÓLNE / TECH DEBT
- **Opis:** Dodanie walidatora kluczy tłumaczeń uruchamianego przed buildem lub jako test. Walidator sprawdza: wszystkie klucze z `en.json` istnieją w `pl.json` i odwrotnie, brak pustych wartości, spraw dzenie czy używane `t('klucz')` w kodzie mają odpowiedniki w plikach locale. Może być częścią `translations.js` lub osobnym `build_validate_locales.py`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Do wdrożenia. Obecne `_warnMissingKey()` działa tylko w runtime – potrzeba statycznej walidacji przed buildem.

---

### [Podział constants.js na constants.js i constants_UI.js] :
- **ID:** GENERAL_REQ-023
- **Sekcja:** OGÓLNE / TECH DEBT
- **Opis:** Przeniesienie stałych UI (kategorie aplikacji, mapowania ikon, priorytety zadań, statusy) z `src/constants.js` do `src/ui/constants_UI.js`. Stałe domenowe (LIMITS, PATHS, API) zostają w `constants.js`. Jeśli plik po podziale przekroczy 300 linii – rozważyć dalszy podział. Aktualizacja wszystkich importów.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Do wdrożenia. Wymaga analizy, które stałe gdzie powinny trafić. Skrypt `split_constants_file.py` przygotowany, ale wymaga ręcznego dostrojenia.

---

### [JSON/YAML/XML Formatter] :
- **ID:** TOOLS_REQ-001
- **Sekcja:** TOOLSPANEL (KAFELKI)
- **Opis:** Narzędzie `Tools/JsonYamlXmlFormatter.jsx` z formatowaniem, walidacją, minify/pretty.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Użycie `JSON.parse/stringify`, `js-yaml`.

---

### [Regex Tester] :

- **ID:** TOOLS_REQ-002
- **Sekcja:** TOOLSPANEL (KAFELKI)
- **Opis:** Narzędzie `Tools/RegexTester.jsx` z pattern, flags, test string. Lista dopasowań i grup.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Obsługa błędnego pattern w try/catch.

---

### [Markdown Previewer] :

- **ID:** TOOLS_REQ-003
- **Sekcja:** TOOLSPANEL (KAFELKI)
- **Opis:** Narzędzie `Tools/MarkdownPreviewer.jsx` z split view, drag & drop `.md`, eksport HTML.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Sanityzacja HTML (XSS).

---

### [Image Tools — Compress, Resize, Convert] :

- **ID:** TOOLS_REQ-004
- **Sekcja:** TOOLSPANEL (KAFELKI)
- **Opis:** Narzędzie `Tools/ImageTools.jsx` z drag & drop, preview, suwaki jakości/rozmiaru, format (PNG/JPG/WebP). Przetwarzanie przez Canvas API.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Bez zewnętrznego API.

---

### [SVG → PNG Converter] :

- **ID:** TOOLS_REQ-005
- **Sekcja:** TOOLSPANEL (KAFELKI)
- **Opis:** Narzędzie `Tools/SvgToPng.jsx` z drag & drop SVG, wybór rozdzielczości, render do canvas, eksport PNG.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Obsługa wielu plików.

---

### [File Previewer] :

- **ID:** TOOLS_REQ-006
- **Sekcja:** TOOLSPANEL (KAFELKI)
- **Opis:** Narzędzie `Tools/FilePreviewer.jsx` z drag & drop, rozpoznanie typu, tryby RAW/PREVIEW. Użycie highlight.js.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Zakaz wykonywania JS z plików.

---

### [Mini Postman — API Tester] :

- **ID:** TOOLS_REQ-007
- **Sekcja:** TOOLSPANEL (KAFELKI)
- **Opis:** Narzędzie `Tools/ApiTester.jsx` z metodami HTTP, headers, body, historia requestów.
- **Status:** IN_SPRINT
- **Priorytet:** MINOR
- **Version:** 0.0.3
- **Komentarz:** Nice-to-have.

---

### [Clipboard History] :

- **ID:** TOOLS_REQ-008
- **Sekcja:** TOOLSPANEL (KAFELKI)
- **Opis:** Narzędzie `Tools/ClipboardHistory.jsx` z listą ostatnich wpisów, pinowanie, kopiowanie.
- **Status:** IN_SPRINT
- **Priorytet:** MINOR
- **Version:** 0.0.3
- **Komentarz:** Nie zapisywać wrażliwych danych długoterminowo.

---

### [Cookie Grabber] :

- **ID:** TOOLS_REQ-009
- **Sekcja:** TOOLSPANEL (KAFELKI)
- **Opis:** Narzędzie Cookie Grabber – pobiera cookies z aktywnego WebView, tabela, eksport JSON. **Full UI istnieje**.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Pełne narzędzie (komponent + handler IPC).

---

## 📚 APP LIBRARY (PEŁNY WIDOK)

> Wymagania dotyczące pełnego widoku biblioteki aplikacji.

---

### [App Library — Pełny Widok Przeglądarki] :

- **ID:** APPLIB_REQ-001
- **Sekcja:** APP LIBRARY (PEŁNY WIDOK)
- **Opis:** Pełny widok App Library jako osobny kafelek „App Library" w Sidebarze. Komponent `AppLibraryBrowser.jsx`. Filtrowanie, sortowanie, dodanie do profili. Działa dla default user.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** App Library jest statyczna (`src/data/app-library.json`).

---

### [App Library – User Profile & Custom Apps] :

- **ID:** APPLIB_REQ-002
- **Sekcja:** APP LIBRARY (PEŁNY WIDOK)
- **Opis:** Po implementacji User Profile – możliwość tworzenia własnych aplikacji w bibliotece. Zapis do `user-app-library.json` (per użytkownik). Łączenie z domyślną biblioteką.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Zależne od implementacji User Profile / logowania.

---

## 🎨 UI/UX DESIGN & UX IMPROVEMENTS

> Wymagania dotyczące interfejsu użytkownika: redesign, tooltipy, modale, loading states, global search.

---

### [Sidebar Redesign] :

- **ID:** UIUX_REQ-001
- **Sekcja:** UI/UX DESIGN & UX IMPROVEMENTS
- **Opis:** Nowy layout Sidebaru: search bar, sekcje kategorii, „Last used", „Settings", „Help". Responsywny: zwijanie do ikon.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Tooltipy na ikonach.

---

### [WebView Toolbar — Doprecyzowanie UX] :

- **ID:** UIUX_REQ-002
- **Sekcja:** UI/UX DESIGN & UX IMPROVEMENTS
- **Opis:** Address bar przełączany między readonly/edytowalny (toggle w Settings). Skróty klawiszowe.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** `addressBarEditable = false` w config.js – do weryfikacji UX.

---

### [Toast Messages — Globalny System] :

- **ID:** UIUX_REQ-003
- **Sekcja:** UI/UX DESIGN & UX IMPROVEMENTS
- **Opis:** Globalny kontener `UI/ToastContainer.jsx`. API: `showToast(type, message)`. Toasty znikają po 3–5 sekundach.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Store `toastStore.js`.

---

### [Tooltipy Wszędzie] :

- **ID:** UIUX_REQ-004
- **Sekcja:** UI/UX DESIGN & UX IMPROVEMENTS
- **Opis:** Komponent `UI/Tooltip.jsx` na hover/long-press. Treść z locales. Tooltipy zawierają skróty klawiszowe.
- **Status:** IN_SPRINT
- **Priorytet:** MINOR
- **Version:** 0.0.3
- **Komentarz:** Dotyczy wszystkich przycisków/ikon w aplikacji.

---

### [Modale zamiast alert/prompt] :

- **ID:** UIUX_REQ-005
- **Sekcja:** UI/UX DESIGN & UX IMPROVEMENTS
- **Opis:** Globalny komponent `UI/Modal.jsx` z portalem. Obsługa ESC, kliknięcie w tło, przyciski OK/Cancel.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Modale: Task, Profile, Project, Confirm.

---

### [Loading States — Spinner i Skeleton] :

- **ID:** UIUX_REQ-006
- **Sekcja:** UI/UX DESIGN & UX IMPROVEMENTS
- **Opis:** Komponenty `UI/Spinner.jsx` i `UI/Skeleton.jsx`. Dla operacji > 200ms: disable przycisk, spinner lub skeleton.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Dotyczy: TaskPanel, Settings, WebViewTab, HistoryLog.

---

### [Global Search — Ctrl+K] :

- **ID:** UIUX_REQ-007
- **Sekcja:** UI/UX DESIGN & UX IMPROVEMENTS
- **Opis:** Komponent `GlobalSearch.jsx` otwierany `Ctrl+K`. Unified search: profile, projekty, zadania, notatki.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** FEATURES.unifiedSearch = true w config.js, ale komponent nie istnieje.

---

### [Loading Spinner / Skeleton – Globalny Util] :

- **ID:** UIUX_REQ-008
- **Sekcja:** UI/UX DESIGN & UX IMPROVEMENTS
- **Opis:** Globalny util do wyświetlania spinnera przy długich operacjach (logowanie, wake from sleep, ładowanie WebView). Sprawdzić, czy `UI/Spinner.jsx` lub `UI/Skeleton.jsx` już istnieją. Jeśli nie – dodać.
- **Status:** BACKLOG
- **Priorytet:** MINOR
- **Version:** 0.0.3
- **Komentarz:** Do weryfikacji – na 99.9% nie ma.

---

### [Splash Screen / Login Screen] :

- **ID:** UIUX_REQ-009
- **Sekcja:** UI/UX DESIGN & UX IMPROVEMENTS
- **Opis:** Ekran logowania / wyboru profilu użytkownika przy starcie (jeśli włączone). Grafika (logo, tło), lista użytkowników, przycisk „Dodaj nowego", opcja „Gość".
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Zależne od User Profile.

---

## 🧪 TEST (TESTY)

> Wymagania dotyczące automatycznych testów integracyjnych i spójności projektu.

---

### [TestRunner – Dokumentacja (doc/)] :

- **ID:** TEST_REQ-004
- **Sekcja:** TEST
- **Opis:** TestRunner sprawdza spójność folderu `doc/`. Testy: istnienie plików, nagłówki, README.md.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Implementacja: `tests/TestRunner_Doc.js`.

---

### [TestRunner – Zasoby (assets/)] :

- **ID:** TEST_REQ-005
- **Sekcja:** TEST
- **Opis:** TestRunner sprawdza spójność folderu `assets/`. Testy: oczekiwane pliki, brak nieoczekiwanych, niepuste.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Implementacja: `tests/TestRunner_Assets.js`.

---

### [TestRunner – Konfiguracja (config.js)] :

- **ID:** TEST_REQ-006
- **Sekcja:** TEST
- **Opis:** TestRunner sprawdza poprawność plików konfiguracyjnych. Testy: istnienie, re-eksport, typy flag, oczekiwane klucze.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Implementacja: `tests/TestRunner_Config.js`.

---

### [TestRunner – CSS (styles/)] :

- **ID:** TEST_REQ-007
- **Sekcja:** TEST
- **Opis:** TestRunner sprawdza spójność plików CSS. Testy: istnienie plików, kolejność importów, brak cyklicznych zależności.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Implementacja: `tests/TestRunner_CSS.js`.

---

### [TestRunner – Re-eksporty (config, icons)] :

- **ID:** TEST_REQ-008
- **Sekcja:** TEST
- **Opis:** TestRunner sprawdza poprawność re-eksportów: `root/config.js` → `src/config.js`, `src/utils/icons.js` → `src/data/icons.js`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Implementacja: `tests/TestRunner_Reexport.js`.

---

### [TestRunner – Locales (dynamiczne)] :

- **ID:** TEST_REQ-009
- **Sekcja:** TEST
- **Opis:** TestRunner dynamicznie ładuje locale na podstawie `SUPPORTED_LANGUAGES` z `config.js`. Testy spójności kluczy w `en.json` i `pl.json`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** `SUPPORTED_LANGUAGES = ["en", "pl"]` w config.js – już istnieje.

---

### [TestRunner – Integracja z Main] :

- **ID:** TEST_REQ-010
- **Sekcja:** TEST
- **Opis:** TestRunner zintegrowany z `main.js`, uruchamiany przy starcie gdy `debugMode === true`. Wyniki logowane do konsoli i pliku logów.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Dotyczy: `main.js`, `tests/index.js`.

---

## 📜 DOC (DOCUMENTATION)

> Wymagania dotyczące dokumentacji.

---

### [Requirements.md – Ujednolicenie] :

- **ID:** DOC_REQ-001
- **Sekcja:** DOC
- **Opis:** Aktualizacja `Requirements.md` zgodnie z ustaloną strukturą sekcji. Każde wymaganie ma poprawny ID, Status, Priorytet, Version, Komentarz.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Żadne wymaganie nie ma statusu DONE (dopóki nie potwierdzimy).

---

### [DEPENDS ON w CookieGrabber.jsx] :

- **ID:** DOC_REQ-002
- **Sekcja:** DOC
- **Opis:** W `src/ui/tools/CookieGrabber.jsx` DEPENDS ON jest puste, mimo że importuje `TranslationContext`, `loggerRenderer`, `icons`. Wypełnić zgodnie z importami.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Skrypt `build_structure.py` powinien to wyłapać.

---

### [resourceMonitor.js – Brak importu loggera] :

- **ID:** DOC_REQ-003
- **Sekcja:** DOC
- **Opis:** W `src/core/resourceMonitor.js` brak importu loggera. Dodać i użyć `logDebug` / `logError`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Ostrzeżenie w MONIT.

---

## ## BLOCKED (ZABLOKOWANE ZADANIA)

*(brak)*

---

## ## DONE (ZAKOŃCZONE ZADANIA)

*(brak – zgodnie z zasadą: nic nie jest DONE dopóki nie potwierdzimy)*

---

## ## BACKLOG (CZEKAJĄ NA KOLEJNY SPRINT)

> Wszystkie wymagania z Twojego oryginalnego pliku pozostają. Poniżej tylko **dodatkowe**, które nie były wcześniej.

### [AI Voice Agent — Dyktowanie i Akcje] :
- **ID:** ARCH_REQ-024
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Integracja z Web Speech API i lokalnym modelem LLM. Komendy głosowe PL na akcje systemowe.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** DO-ANALYSIS – nie implementować bez decyzji.

### [Lokalny Automatyczny Asystent Code Review] :
- **ID:** ARCH_REQ-025
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Narzędzie do code review w `src/ui/tools/CodeReview.jsx`. ESLint + heurystyki. Docelowo Ollama.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** DO-ANALYSIS – pełne przetwarzanie offline.

### [Multi-Account Login & Credential Sharing] :
- **ID:** SIDEBAR_REQ-007
- **Sekcja:** SIDEBAR / PROFILE MANAGER
- **Opis:** Izolacja profili z możliwością bezpiecznego współdzielenia cookies. Szyfrowany eksport/import przez `electron.safeStorage`.
- **Status:** BACKLOG
- **Priorytet:** CRITICAL
- **Version:** 0.0.4
- **Komentarz:** DO-ANALYSIS – krytyczne pod kątem bezpieczeństwa.

### [Zarządzanie Kontem i Synchronizacja w Chmurze] :
- **ID:** SETTINGS_REQ-006
- **Sekcja:** SETTINGS PANEL
- **Opis:** Logowanie e-mail + hasło / OAuth. Synchronizacja profili, ustawień, notatek, tasków z backendem (Supabase/Firebase).
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** DO-ANALYSIS – wymaga osobnego projektu serwerowego.

### [Help.jsx — Lazy Loading i Chunked Sekcje] :
- **ID:** UIUX_REQ-010
- **Sekcja:** UI/UX DESIGN & UX IMPROVEMENTS
- **Opis:** Optymalizacja panelu pomocy – lazy loading sekcji przez `React.lazy`, prefetch chunk, defer mount.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Likwidacja mikro-zamrożeń UI.

### [Rozszerzenie Słownika constants.js] :
- **ID:** GENERAL_REQ-001
- **Sekcja:** OGÓLNE / TECH DEBT
- **Opis:** Rozbudowa `constants.js` o kategorie: Grafika, Search engines, Email, Cloud, Version Control.
- **Status:** BACKLOG
- **Priorytet:** MINOR
- **Version:** 0.0.4
- **Komentarz:** Porządkowanie struktur danych.

### [Natywna Obsługa Repozytoriów GitHub] :
- **ID:** TOOLS_REQ-010
- **Sekcja:** TOOLSPANEL (KAFELKI)
- **Opis:** Integracja z GitHub: przeglądanie zmian, branch, commit, push/pull.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Kluczowe dla automatyzacji z AI.

### [Zaawansowany Monitoring Sieci i Ping] :
- **ID:** UIUX_REQ-011
- **Sekcja:** UI/UX DESIGN & UX IMPROVEMENTS
- **Opis:** Dynamiczne pingowanie hostów, renderowanie statusu opóźnień.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Podniesienie stabilności diagnostycznej.

### [Zintegrowany Edytor CodeMirror / Monaco w Notepad] :
- **ID:** NOTEPAD_REQ-004
- **Sekcja:** NOTEPAD EDITOR
- **Opis:** Zastąpienie `<textarea>` edytorem kodu. Syntax highlight, numeracja linii, auto-uzupełnianie.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Transformacja notatnika w mini-IDE.

### [Pełny System Backupów i Walidacji Ustawień] :
- **ID:** SETTINGS_REQ-007
- **Sekcja:** SETTINGS PANEL
- **Opis:** Dedykowany modal do eksportu/importu backupu. Walidacja JSON przed wgraniem.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Bezpieczeństwo i przenośność profili.

### [Dynamiczne Schematy Kolorów — theme.js] :
- **ID:** UIUX_REQ-012
- **Sekcja:** UI/UX DESIGN & UX IMPROVEMENTS
- **Opis:** `src/ui/styles/theme.js` z tablicami kolorów, mapowaniem kontrastów, motywami.
- **Status:** BACKLOG
- **Priorytet:** MINOR
- **Version:** 0.0.4
- **Komentarz:** Separacja CSS od programowalnych motywów.

### [App Library — Ulubione i Pinowanie Kont] :
- **ID:** APPLIB_REQ-003
- **Sekcja:** APP LIBRARY (PEŁNY WIDOK)
- **Opis:** Flaga `isFavorite` i mechanizm pinowania kont z poziomu App Library.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Dla zaawansowanych użytkowników.

### [Widok Kafelkowy WebView — Tile View] :
- **ID:** WEBVIEW_REQ-009
- **Sekcja:** WEBVIEW MANAGER
- **Opis:** Tile View – 2–3 WebView obok siebie. Dynamiczne dzielenie grida, focus, izolacja procesów.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Wymaga optymalizacji RAM.

### [Zintegrowany Panel Menedżera Skrótów — Hotkeys Manager UI] :
- **ID:** SETTINGS_REQ-008
- **Sekcja:** SETTINGS PANEL
- **Opis:** UI do redefiniowania skrótów, przypisywania akcji, snippetów tekstowych.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Współpraca z IPC i store.

### [Konsolidacja Modułów Pushbullet, Cookie Grabber i Mini Postman] :
- **ID:** TOOLS_REQ-011
- **Sekcja:** TOOLSPANEL (KAFELKI)
- **Opis:** Pełna integracja UI dla Pushbullet, Cookie Grabber, Mini Postman.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Unifikacja istniejących handlerów.

### [Zaawansowany AdBlocker oparty o webRequest] :
- **ID:** WEBVIEW_REQ-010
- **Sekcja:** WEBVIEW MANAGER
- **Opis:** Przeniesienie AdBlockera do main.js. Filtrowanie na poziomie sieciowym.
- **Status:** BACKLOG
- **Priorytet:** CRITICAL
- **Version:** 0.0.4
- **Komentarz:** Kluczowe dla wydajności.

### [Architektura Rozszerzeń i Wizualizacji — Plugin System, AI Panel, Workspace Templates] :
- **ID:** PLUGIN_REQ-001
- **Sekcja:** SYSTEM WTYCZEK / FUTURE IDEAS
- **Opis:** Ramy dla: plugin system, AI chat panel, workspace templates.
- **Status:** BACKLOG
- **Priorytet:** MINOR
- **Version:** 0.0.4
- **Komentarz:** Faza researchu.

### [Standaryzacja Metadanych i Nagłówków Plików Source] :
- **ID:** GENERAL_REQ-002
- **Sekcja:** OGÓLNE / TECH DEBT
- **Opis:** Każdy plik musi mieć nagłówek: FILE, PATH, VERSION, PURPOSE, FUNCTIONS, DEPENDS ON, UWAGA.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Krytyczny tech debt dla współpracy z AI.

### [Globalna Integracja Loggera w trybie debugMode] :
- **ID:** GENERAL_REQ-003
- **Sekcja:** OGÓLNE / TECH DEBT
- **Opis:** Każda metoda, handler, subskrypcja musi mieć `logDebug()` i `logError()`, aktywowane gdy `debugMode === true`.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Pełna diagnostyka błędów.

### [Audyt i Czyszczenie utils/ — Usuwanie Martwego Kodu] :
- **ID:** GENERAL_REQ-004
- **Sekcja:** OGÓLNE / TECH DEBT
- **Opis:** Audyt `src/utils/`, usunięcie nieużywanych eksportów.
- **Status:** BACKLOG
- **Priorytet:** MINOR
- **Version:** 0.0.4
- **Komentarz:** Redukcja objętości kodu.

### [Ujednolicenie i Standaryzacja Warstwy Komunikacji IPC] :
- **ID:** ARCH_REQ-026
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Unified response: `{ ok, data, error }`. Thin preload – tylko przekazywanie parametrów.
- **Status:** BACKLOG
- **Priorytet:** CRITICAL
- **Version:** 0.0.4
- **Komentarz:** Kluczowa stabilizacja komunikacji.

### [Korekta Numeracji i Struktury Pliku DevelopersGuide.md] :
- **ID:** DOC_REQ-004
- **Sekcja:** DOC
- **Opis:** Naprawa hierarchii i numeracji w `DevelopersGuide.md`.
- **Status:** BACKLOG
- **Priorytet:** MINOR
- **Version:** 0.0.4
- **Komentarz:** Ujednolicenie dokumentacji.

### [Przegląd i Optymalizacja Systemu Magazynowania Danych (Stores)] :
- **ID:** GENERAL_REQ-005
- **Sekcja:** OGÓLNE / TECH DEBT
- **Opis:** Audyt stores: asynchroniczne I/O, odporność na uszkodzone JSON, fallback.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Stabilizacja warstwy danych.

### [Audyt i Refaktoryzacja Mostka IPC Bridge w main.js] :
- **ID:** ARCH_REQ-027
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Przegląd handlerów w main.js, eliminacja wycieków pamięci, migracja do modułów.
- **Status:** BACKLOG
- **Priorytet:** CRITICAL
- **Version:** 0.0.4
- **Komentarz:** Przed nowymi funkcjami sieciowymi.

### [Weryfikacja Migracji i Struktury Katalogu src/ui/] :
- **ID:** UIUX_REQ-013
- **Sekcja:** UI/UX DESIGN & UX IMPROVEMENTS
- **Opis:** Sprawdzenie integralności po migracji z `components/` do `src/ui/`. Poprawa ścieżek importów.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Porządkowanie struktury katalogów.

### [Zabezpieczenie UI Stub Ustawień Konta — Account Placeholder] :
- **ID:** SETTINGS_REQ-009
- **Sekcja:** SETTINGS PANEL
- **Opis:** Zabezpieczenie placeholderu `SettingsAccount.jsx` – brak wyjątków, tooltip lub wyłączenie przycisku.
- **Status:** BACKLOG
- **Priorytet:** MINOR
- **Version:** 0.0.4
- **Komentarz:** Estetyka kodu i stabilność UI.

### [Przegląd Techniczny Menedżerów Tła — sleepTabs, notifications, searchIndex] :
- **ID:** ARCH_REQ-028
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Audyt `setInterval` w sleepTabsManager, notificationsManager, searchIndex. Brak wycieków po zamknięciu okien.
- **Status:** BACKLOG
- **Priorytet:** CRITICAL
- **Version:** 0.0.4
- **Komentarz:** Kluczowy audyt procesów w tle.

### [Czyszczenie i Refaktoryzacja Globalnego Re-eksportu config.js] :
- **ID:** GENERAL_REQ-006
- **Sekcja:** OGÓLNE / TECH DEBT
- **Opis:** Weryfikacja re-eksportów w `config.js`, usunięcie cyklicznych zależności.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Konsolidacja globalnych zmiennych.

### [constants.js – TASK_STATUS.BLOCKED – czy używane?] :
- **ID:** GENERAL_REQ-007
- **Sekcja:** OGÓLNE / TECH DEBT
- **Opis:** Sprawdzić, czy `TASK_STATUS.BLOCKED` jest używane w TaskPanel. Jeśli nie – usunąć lub zaimplementować.
- **Status:** BACKLOG
- **Priorytet:** MINOR
- **Version:** 0.0.4
- **Komentarz:** Do weryfikacji.

### [Bezpieczne ładowanie stałych i plików (try-catch)] :
- **ID:** GENERAL_REQ-008
- **Sekcja:** OGÓLNE / TECH DEBT
- **Opis:** Wszystkie stałe i funkcje ładujące dane zewnętrzne (pliki, API, ścieżki systemowe) muszą być opakowane w `try-catch` z logowaniem błędu do loggera i toastem dla użytkownika. Dotyczy w szczególności: `getUserDataPath()`, `readJsonFile()`, `writeJsonFile()`, `CONST.HISTORY_FILE`, `CONST.LOGS_DIR`, `CONFIG` – wszędzie tam, gdzie brak walidacji może rzucić `undefined` lub błędem. Należy dodać osobny test (`TEST_REQ-011`) sprawdzający, czy wszystkie funkcje I/O mają obsługę błędów.
- **Status:** BACKLOG
- **Priorytet:** CRITICAL
- **Version:** 0.0.4
- **Komentarz:** Brak try-catch przy `getUserDataPath()` → aplikacja wybucha bez logowania. Dotyczy: `src/utils/fileUtils.js`, `src/constants.js`, `src/config.js`, `tests/TestRunner_Safety.js` (nowy).

---

### [Refaktor duplikacji readJsonFile/writeJsonFile/getUserDataPath] :

- **ID:** GENERAL_REQ-011
- **Sekcja:** OGÓLNE / TECH DEBT
- **Opis:** Funkcje `readJsonFile()`, `writeJsonFile()` oraz `getUserDataPath()` są zduplikowane w wielu plikach (`persistence.js`, `profilesStore.js`, `projectsStore.js` i innych). Należy je wydzielić do jednego pliku `src/utils/fileUtils.js` i importować wszędzie tam, gdzie są potrzebne. Eliminacja duplikacji kodu i ułatwienie ewentualnych zmian w przyszłości.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Po wydzieleniu – dodać `try-catch` w jednym miejscu (zgodnie z `GENERAL_REQ-010`), a nie w każdym pliku osobno. Dotyczy co najmniej: `src/core/persistence.js`, `src/core/profilesStore.js`, `src/core/projectsStore.js`.

---

### [Refaktor duplikacji load() w hookach – wspólny loader] :

- **ID:** GENERAL_REQ-012
- **Sekcja:** OGÓLNE / TECH DEBT
- **Opis:** Funkcja `load()` (ustawianie `loading=true`, wywołanie IPC, ustawianie `loading=false`) jest zduplikowana w hookach: `useHistoryLog`, `useNotepad`, `useProjects`, `useSettings`, `useTasks`, `useWorkspaces`. Należy stworzyć wspólną funkcję `withLoading(asyncFn)` w `src/utils/loadingUtils.js` lub dedykowany hook `useDataLoader`, który przyjmuje nazwę kanału IPC i zwraca `{ data, loading, error, refetch }`. Eliminacja duplikacji.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Duplikacja wykryta przez skrypt (`[DUPLICATED]` w logu). To jest rozwinięcie `GENERAL_REQ-009` – warto rozdzielić na dwa osobne zadania.

---

### [TestRunner_ExternalResources.js – testy odporności na brak zasobów zewnętrznych] :
- **ID:** TEST_REQ-011
- **Sekcja:** TEST
- **Opis:** Nowy test (nie rozbudowa `TestRunner_Store.js`). Sprawdza wszystkie miejsca w aplikacji, które odwołują się do zasobów **POZA aplikacją**: pliki na dysku (logi, konfiguracja, export/import), foldery użytkownika (`userData`, `appData`, `temp`), API zewnętrzne (Pushbullet, RemoveBG), ścieżki sieciowe, czytanie/zapis poza katalogiem aplikacji. Testy muszą symulować brak dostępu (brak pliku, brak folderu, brak uprawnień, uszkodzony JSON) i weryfikować, czy funkcja:
      - nie rzuca nieobsłużonego wyjątku (brak crasha)
      - loguje błąd przez logger
      - zwraca bezpieczny fallback (`null`, `[]`, `{}`, `false`)
      - wyświetla toast z komunikatem (jeśli dotyczy UI)
- **Status:** BACKLOG
- **Priorytet:** CRITICAL
- **Version:** 0.0.4
- **Komentarz:** Przykład: użytkownik skasował folder z logami, a aplikacja próbuje go otworzyć – zamiast crasha ma pokazać toast „Folder logów nie istnieje”. Testy muszą pokryć wszystkie funkcje I/O, które odwołują się do zasobów zewnętrznych.

---

### [Refaktor duplikacji load() w hookach – wspólna funkcja] :
- **ID:** GENERAL_REQ-009
- **Sekcja:** OGÓLNE / TECH DEBT
- **Opis:** W hookach (`useHistoryLog`, `useNotepad`, `useProjects`, `useSettings`, `useTasks`, `useWorkspaces`) występuje identyczna funkcja `load()`, która ustawia `loading=true`, wykonuje `window.electronAPI.invoke(...)` i ustawia `loading=false`. Należy wydzielić wspólną funkcję do `src/utils/loadingUtils.js` (np. `withLoading(asyncFn)`) lub stworzyć dedykowany hook `useDataLoader`. Eliminacja duplikacji kodu.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Duplikacja wykryta przez skrypt (`[DUPLICATED]` w logu). Dotyczy wszystkich hooków w `src/hooks/`.

---

### [Refaktor duplikacji load() w hookach] :
- **ID:** GENERAL_REQ-009
- **Sekcja:** OGÓLNE / TECH DEBT
- **Opis:** W hookach (`useHistoryLog`, `useNotepad`, `useProjects`, `useSettings`, `useTasks`, `useWorkspaces`) występuje identyczna funkcja `load()`, która ustawia `loading=true`, wykonuje `window.electronAPI.invoke(...)` i ustawia `loading=false`. Należy wydzielić wspólną funkcję do `src/utils/loadingUtils.js` (np. `withLoading(asyncFn)`) lub stworzyć dedykowany hook `useDataLoader`, aby wyeliminować duplikację kodu.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Duplikacja wykryta przez skrypt (`[DUPLICATED]` w logu). Dotyczy plików: `src/hooks/useHistoryLog.js`, `src/hooks/useNotepad.js`, `src/hooks/useProjects.js`, `src/hooks/useSettings.js`, `src/hooks/useTasks.js`, `src/hooks/useWorkspaces.js`.

---

### [App Library – rozwijane / zwijane sekcje] :
- **ID:** APPLIB_REQ-004
- **Sekcja:** APP LIBRARY (PEŁNY WIDOK)
- **Opis:** W App Library (`AppLibraryBrowser.jsx`) każda kategoria (np. AI, Dev, Design, Productivity) musi być rozwijana/zwijana. Stan zwinięcia ma być zapamiętywany w `settingsStore` (per użytkownik, nie per workspace). Użytkownik może ukryć wyświetlania rozwiniętych kategori, których nie potrzebuje (np. media społecznościowe). Tooltip po najechaniu na ikonę aplikacji (lub nazwę) wyświetla krótki opis do czego służy dana aplikacja. Tooltipy mają być pobierane z `app-library.json` (nowe pole `description`). Domyślnie wszystkie kategorie rozwinięte. Stan zapisywany i wczytywany przy otworzeniu App Library Browser.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Tooltipy mają być konkretne i mówiące o przeznaczeniu aplikacji. Dotyczy: `src/data/app-library.json` (dodać `description`), `AppLibraryBrowser.jsx`, `settingsStore.js`.

---

### [Profile Schema Version + migracje] :
- **ID:** ARCH_REQ-029
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Wersjonowanie struktury profilu (`version` w `profilesStore`). Automatyczna migracja starych profili do nowej wersji przy starcie aplikacji. Brak migracji → crash przy zmianie struktury.
- **Status:** BACKLOG
- **Priorytet:** CRITICAL
- **Version:** 0.0.5
- **Komentarz:** Bez tego zmiana struktury profilu wywali aplikację.

---

### [WebView Watchdog] :
- **ID:** ARCH_REQ-030
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Mechanizm monitorujący WebView: timeout ładowania (np. 30s), auto-reload przy crashu, wykrywanie zawieszenia (frozen state). Konfiguracja w `config.js`.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.5
- **Komentarz:** WebView potrafi się zawiesić – watchdog go odratuje.

---

### [Master Password / PIN Lock] :
- **ID:** ARCH_REQ-031
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Blokada dostępu do całej aplikacji kodem PIN lub hasłem (np. przy dłuższej nieaktywności lub ręcznej blokadzie). Po wpisaniu poprawnego kodu – odblokowanie.
- **Status:** BACKLOG
- **Priorytet:** MINOR
- **Version:** 0.0.5
- **Komentarz:** Niskie prio, ale dla niektórych użytkowników ważne.

---

### [Auto-update checker] :
- **ID:** ARCH_REQ-032
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Sprawdzanie nowej wersji aplikacji przy starcie (lub ręcznie w Settings). Pobieranie, instalacja, restart. Changelog przed aktualizacją.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.5
- **Komentarz:** Ważne dla dystrybucji.

---

### [Session Manager] :
- **ID:** ARCH_REQ-033
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Zapis i przywracanie całych sesji (zestaw otwartych profili + ich stan nawigacji + karty). Możliwość zapisu wielu sesji i przełączania między nimi.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.5
- **Komentarz:** Rozszerzenie `ARCH_REQ-020` (Session Restore).

---

### [Lokalny Mock Server / Interceptor] :
- **ID:** ARCH_REQ-034
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Możliwość podmieniania odpowiedzi z serwera na lokalny plik JSON przez `session.defaultSession.webRequest`. Definiowanie reguł w Settings (URL pattern → ścieżka do pliku).
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.5
- **Komentarz:** Zaawansowane, bardzo potężne dla QA / developera.

---

### [User Scripts / Custom JS/CSS injection] :
- **ID:** WEBVIEW_REQ-011
- **Sekcja:** WEBVIEW MANAGER
- **Opis:** Możliwość wstrzykiwania własnego kodu JS/CSS do ładowanej strony WebView (per profil). Wykorzystanie `webContents.executeJavaScript()` lub `<webview>` preload. Przydatne do automatyzacji testów, wymuszenia dark mode, ukrywania elementów.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.5
- **Komentarz:** Dla zaawansowanych użytkowników / QA.

---

### [Domain Lock / Link Injection] :
- **ID:** WEBVIEW_REQ-012
- **Sekcja:** WEBVIEW MANAGER
- **Opis:** Blokowanie kliknięć w linki prowadzące poza zdefiniowaną domenę (per profil). Link zewnętrzny otwiera się w systemowej przeglądarce. Konfiguracja: dozwolone domeny lub tryb "tylko ta domena".
- **Status:** BACKLOG
- **Priorytet:** MINOR
- **Version:** 0.0.5
- **Komentarz:** Zapobiega przypadkowemu opuszczeniu aplikacji.

---

### [Proxy per profil] :
- **ID:** WEBVIEW_REQ-013
- **Sekcja:** WEBVIEW MANAGER
- **Opis:** Możliwość ustawienia dedykowanego proxy (HTTP/HTTPS/SOCKS) dla konkretnego WebView. Konfiguracja w `ProfileModal.jsx`. Proxy ustawiane przez `session.setProxy()`.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.5
- **Komentarz:** Bardzo użyteczne do testowania geolokalizacji / blokad.

---

### [Tab Groups w WebView] :
- **ID:** WEBVIEW_REQ-014
- **Sekcja:** WEBVIEW MANAGER
- **Opis:** Grupowanie zakładek w obrębie jednego WebView (nawigacja wielopoziomowa). Możliwość zapisu grupy jako osobny "widok". Integracja z historyStore.
- **Status:** BACKLOG
- **Priorytet:** MINOR
- **Version:** 0.0.5
- **Komentarz:** Dla zaawansowanej nawigacji.

---

### [Zastąpienie window.confirm w 4 komponentach] :

- **ID:** UIUX_REQ-020
- **Sekcja:** UI/UX DESIGN & UX IMPROVEMENTS
- **Opis:** W plikach `HistoryLog.jsx`, `ProjectManager.jsx`, `Sidebar.jsx`, `TaskPanel.jsx` występuje `window.confirm` zamiast własnego modala `ConfirmModal`. Należy zastąpić każde wystąpienie. Wzór: zamiast `if (window.confirm(...))` → `showConfirm(title, message, onConfirm)`.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Wykryte przez skrypt. Dotyczy: `src/ui/history/HistoryLog.jsx`, `src/ui/projects/ProjectManager.jsx`, `src/ui/sidebar/Sidebar.jsx`, `src/ui/taskpanel/TaskPanel.jsx`.

---

### [Dashboard / Centralny widok startowy] :
- **ID:** UIUX_REQ-014
- **Sekcja:** UI/UX DESIGN & UX IMPROVEMENTS
- **Opis:** Widok startowy aplikacji (po uruchomieniu lub zamiast pustego layoutu) z podsumowaniem: ostatnio używane profile, taski (do zrobienia), notatki (ostatnie), ewentualnie powiadomienia. Możliwość wyłączenia w Settings.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.5
- **Komentarz:** Alternatywa dla `session restore` lub uzupełnienie.

---

### [Groupy / Folders dla profili] :
- **ID:** UIUX_REQ-015
- **Sekcja:** UI/UX DESIGN & UX IMPROVEMENTS
- **Opis:** Możliwość tworzenia folderów / grup w Sidebarze (zagnieżdżanie). Przeciąganie profili między folderami. Folder może być zwijany/rozwijany.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.5
- **Komentarz:** Rozszerzenie `SIDEBAR_REQ-003` (kategorie).

---

### [Custom Tags & Colors dla profili] :
- **ID:** UIUX_REQ-016
- **Sekcja:** UI/UX DESIGN & UX IMPROVEMENTS
- **Opis:** Dodanie własnych tagów i kolorów dla profili (np. "frontend", "backend", "client X"). Tagi mogą być filtrowane w Sidebarze. Kolor jako obramowanie lub tło ikony.
- **Status:** BACKLOG
- **Priorytet:** MINOR
- **Version:** 0.0.5
- **Komentarz:** Personalizacja dla zaawansowanych użytkowników.

---

### [Workspace jako osobne zestawy aplikacji / profili] :
- **ID:** UIUX_REQ-017
- **Sekcja:** UI/UX DESIGN & UX IMPROVEMENTS
- **Opis:** Workspace przechowuje konkretny zestaw otwartych profili (nie tylko układ modułów). Przełączanie między workspace'ami przywraca dokładnie te profile, które były otwarte.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.5
- **Komentarz:** Rozszerzenie istniejącego `workspacesStore`.

---

### [Quick Notes / Sticky notes] :
- **ID:** UIUX_REQ-018
- **Sekcja:** UI/UX DESIGN & UX IMPROVEMENTS
- **Opis:** Małe "przypinki" na pulpicie / w sidebarze. Tworzenie, edycja, usuwanie, kolory. Przypinki zapisywane w `notesStore` z typem "sticky".
- **Status:** BACKLOG
- **Priorytet:** MINOR
- **Version:** 0.0.5
- **Komentarz:** Szybkie notatki bez otwierania pełnego notatnika.

---

### [Profiles templates] :
- **ID:** UIUX_REQ-019
- **Sekcja:** UI/UX DESIGN & UX IMPROVEMENTS
- **Opis:** Szablony profili (np. "Dev: GitHub + StackOverflow + npm", "AI: ChatGPT + Claude + DeepSeek"), które tworzą kilka profili naraz. Szablony predefiniowane w `app-library.json` lub tworzone przez użytkownika.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.5
- **Komentarz:** Przyspiesza onboarding i konfigurację.

---

### [Smart Screenshot z metadanymi] :
- **ID:** TOOLS_REQ-012
- **Sekcja:** TOOLSPANEL (KAFELKI)
- **Opis:** Rozszerzenie `WEBVIEW_REQ-005` – zrzut ekranu WebView z automatycznie dodaną datą, godziną, URL, wersją modułu w nazwie pliku. Zapis do pliku (nie tylko schowek). Możliwość wyboru folderu docelowego.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.5
- **Komentarz:** Dla QA / testerów.

---

### [Export/Import pojedynczego profilu] :
- **ID:** TOOLS_REQ-013
- **Sekcja:** TOOLSPANEL (KAFELKI)
- **Opis:** Eksport/import jednego profilu do pliku `.json` (nie całego backupu). Umożliwia udostępnianie profili między użytkownikami lub kopię zapasową pojedynczego profilu.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.5
- **Komentarz:** Uzupełnienie `SETTINGS_REQ-003`.

---

### [Copy to Notepad (z WebView)] :
- **ID:** TOOLS_REQ-014
- **Sekcja:** TOOLSPANEL (KAFELKI)
- **Opis:** Zaznaczenie tekstu w WebView i opcja "Wyślij do notatnika" z menu kontekstowego. Tekst dodawany jako nowa notatka lub do aktywnej karty notatnika (z konfiguracją).
- **Status:** BACKLOG
- **Priorytet:** MINOR
- **Version:** 0.0.5
- **Komentarz:** Usprawnienie pracy z notatkami.

---

### [Service Recipes (Franz/Ferdi)] :
- **ID:** APPLIB_REQ-005
- **Sekcja:** APP LIBRARY (PEŁNY WIDOK)
- **Opis:** Skrypt inicjalizacyjny dla aplikacji w bibliotece – definiuje jak pobrać favicon (jeśli nie działa standardowo), jak czytać liczbę powiadomień z DOM (badge). Struktura recipe: `{ appId, faviconSelector, notificationSelector, notificationRegex }`. Przechowywane w `app-library.json` lub osobny plik `recipes.json`.
- **Status:** BACKLOG
- **Priorytet:** MINOR
- **Version:** 0.0.5
- **Komentarz:** Zaawansowane – dla aplikacji, które nie działają standardowo.

---

### [App Library – aktualizacja z Rambox] :
- **ID:** APPLIB_REQ-006
- **Sekcja:** APP LIBRARY (PEŁNY WIDOK)
- **Opis:** Przejrzenie `https://rambox.app/apps/` i wybranie aplikacji do dodania do `app-library.json`. Kryteria: bez oczywistych niszowych (np. <10k odwiedzin/miesiąc – jeśli dane dostępne), bez komunikatorów (opcjonalnie, ale można dodać). Każda aplikacja musi mieć: nazwę, URL, kategorię, ikonę (lub fallback), opis (tooltip). Lista ma być sensowna i użyteczna, nie mega długa.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Do wykonania raz a porządnie. Dotyczy: `src/data/app-library.json`.

---

### [Favicon Cache (lokalny, hashed filenames)] :
- **ID:** GENERAL_REQ-014
- **Sekcja:** OGÓLNE / TECH DEBT
- **Opis:** Pobieranie favicon raz, zapis lokalnie w `userData/cache/favicons/` z hashowaną nazwą (hash z URL). Przy kolejnych uruchomieniach – odczyt z cache, brak requestów do sieci. Fallback jeśli brak favicon.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.5
- **Komentarz:** Ważne dla wydajności przy 50+ profilach.

---

### [QA Inspector Modulo – szybki DevTools per WebView] :
- **ID:** GENERAL_REQ-015
- **Sekcja:** OGÓLNE / TECH DEBT
- **Opis:** Dedykowany przycisk lub skrót do otwarcia DevTools dla konkretnego WebView (nie dla całej aplikacji). W `WebViewToolbar.jsx` ikona "DevTools" – otwiera devtools dla aktywnego WebView. (Uwaga: czy to już jest? Jeśli tak – przenieść do OBSOLETE).
- **Status:** BACKLOG (DO SPRAWDZENIA)
- **Priorytet:** MINOR
- **Version:** 0.0.5
- **Komentarz:** Sprawdzić, czy `WEBVIEW_REQ-001` już tego nie ma. Jeśli tak – usunąć.

---

### [OBSOLETE – kategoria do przenoszenia odrzuconych] :
- **ID:** GENERAL_REQ-016
- **Sekcja:** OGÓLNE / TECH DEBT
- **Opis:** W `Requirements.md` dodać sekcję `## OBSOLETE (ZREALIZOWANE / ODRZUCONE)`. Przenosić tam wymagania, które: zostały zrealizowane (DONE), ale nie chcemy ich trzymać w BACKLOG/IN_SPRINT, lub zostały odrzucone jako niepotrzebne/niewykonalne.
- **Status:** BACKLOG
- **Priorytet:** MINOR
- **Version:** 0.0.5
- **Komentarz:** Ułatwia utrzymanie czystości w pliku.

---

### [Badge z liczbą nieprzeczytanych / powiadomień] :
- **ID:** WEBVIEW_REQ-015
- **Sekcja:** WEBVIEW MANAGER
- **Opis:** Dla profili (szczególnie komunikatorów, ale też AI jak ChatGPT ma powiadomienia) wyświetlanie badge'a z liczbą nieprzeczytanych / powiadomień. Dane pobierane z WebView (DOM lub API). Konfiguracja per profil (włącz/wyłącz). Wykorzystanie `notificationSelector` z `APPLIB_REQ-005` (Service Recipes).
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.5
- **Komentarz:** Standard w takich aplikacjach (Rambox, Franz, Ferdi).

---

### [Rozwijane sekcje w App Library – przeniesione z APPLIB_REQ-004] :
- **ID:** APPLIB_REQ-007
- **Sekcja:** APP LIBRARY (PEŁNY WIDOK)
- **Opis:** (to samo co `APPLIB_REQ-004`, ale wydzielone) – kategorie w App Library rozwijane/zwijane, pamiętanie stanu w `settingsStore`, tooltipy z opisem aplikacji.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Poprzednio `APPLIB_REQ-004` – tutaj jako osobne.

---

### [Analiza i refaktor logger.js – getLogFilePath() zawsze zwraca null] :
- **ID:** GENERAL_REQ-017
- **Sekcja:** OGÓLNE / TECH DEBT
- **Opis:** W `src/utils/logger.js` funkcja `getLogFilePath()` zawsze zwraca `null` (lub `undefined`) i nie ma sensownej implementacji. Komentarz wskazuje na ograniczenia Electrona / dostępu do Node.js, ale `loggerRenderer.js` działa poprawnie. Należy przeanalizować oba pliki, ujednolicić logikę i zapewnić, że `getLogFilePath()` zwraca poprawną ścieżkę do pliku logów (`userData/logs/app.log`) lub – jeśli to niemożliwe w danym kontekście – usunąć funkcję lub zastąpić ją rzuceniem błędu z komunikatem. Dodatkowo: sprawdzić, czy `logger.js` i `loggerRenderer.js` nie są zduplikowane i czy nie można ich połączyć w jeden spójny moduł logowania z rozróżnieniem kontekstu (main vs renderer).
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Problem wykryty przez skrypt. Funkcja zwracająca zawsze `null` wprowadza w błąd i może powodować błędy przy zapisie logów. Dotyczy: `src/utils/logger.js`, `src/utils/loggerRenderer.js`.

---

### [Normalizacja modelu danych Sidebara] :
- **ID:** SIDEBAR_REQ-008
- **Sekcja:** SIDEBAR / PROFILE MANAGER
- **Opis:** Normalizacja modelu danych Sidebara. Stworzenie unified item schema: `{ id, type, category, icon, title, favorite, pinned, url, section }`. Typy: `"profile"`, `"tool"`, `"favorite"`, `"app"`. Ujednolicenie profili, narzędzi, ulubionych i aplikacji z App Library w jednej strukturze. Sidebar operuje na jednej liście `sidebarItems`, a nie na wielu osobnych źródłach. Umożliwia to jednolite filtrowanie, wyszukiwanie, drag & drop, pinowanie i kategorie.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.5
- **Komentarz:** Obecnie Sidebar miesza profile, narzędzia i zakładki jako "special case". To się zemści przy rozbudowie kategorii, ulubionych i przeciągania.

---

### [Crash recovery notatnika] :
- **ID:** NOTEPAD_REQ-005
- **Sekcja:** NOTEPAD EDITOR
- **Opis:** Crash recovery notatnika. Autosave co 5 sekund (lub zgodnie z `AUTO_SAVE_INTERVAL`) do osobnego pliku `userData/recovery_notes.json`. Przy starcie aplikacji – sprawdzenie, czy istnieją niezapisane notatki (porównanie `lastSaved` z `recovery`). Jeśli tak – modal: "Wykryto niezapisane notatki. Przywrócić? [Tak] [Nie] [Pokaż różnice]". Po przywróceniu – usunięcie pliku recovery. Integracja z `ARCH_REQ-008` (autosave tylko przy zmianie).
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.5
- **Komentarz:** Bez tego crash aplikacji = utrata notatek, które nie zdążyły się zapisać. Dotyczy: `useNotepad.js`, `NotepadEditor.jsx`, nowy moduł `recoveryManager.js`.

---

### [App State Context] :
- **ID:** ARCH_REQ-035
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Wprowadzenie warstwy kontekstów React: `AppContext`, `SettingsContext`, `ThemeContext`. Celem jest redukcja props drillingu i bezpośrednich wołań `electronAPI` z komponentów. `AppContext` dostarcza: `loading, error, toast, modal, confirm`. `SettingsContext` dostarcza: `settings, updateSetting, resetSettings`. `ThemeContext` dostarcza: `theme, setTheme, isDark`. Komponenty używają `useContext` zamiast własnych stanów i bezpośrednich IPC.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.5
- **Komentarz:** Obecnie dużo props drillingu i wielokrotne wołanie `window.electronAPI.invoke` w komponentach. Utrudnia to testy, refaktor i dodawanie nowych funkcji.

---

### [CSP i sanityzacja URLi] :
- **ID:** ARCH_REQ-036
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Implementacja Content Security Policy (CSP) w `index.html`. Polityka: `default-src 'self'; img-src * data:; script-src 'self'; style-src 'self' 'unsafe-inline';`. Dodatkowo: sanityzacja URLi wprowadzanych przez użytkownika (pasek adresu, profil). Whitelist dozwolonych protokołów: `http:`, `https:`, `file:`. Blokada `javascript:`, `data:`, `vbscript:` URLi. W `WebViewTab.jsx` – walidacja URL przed załadowaniem.
- **Status:** BACKLOG
- **Priorytet:** CRITICAL
- **Version:** 0.0.5
- **Komentarz:** Użytkownik może wpisać `javascript:alert('XSS')` w pasku adresu – bez CSP i sanityzacji to się wykona. Dotyczy: `index.html`, `WebViewTab.jsx`, `urlSanitizer.js`.

---

### [Profile health monitoring] :
- **ID:** SIDEBAR_REQ-009
- **Sekcja:** SIDEBAR / PROFILE MANAGER
- **Opis:** Profile health monitoring. Dla każdego profilu przechowywane w `profilesStore` dodatkowe pola: `lastOnlineCheck` (timestamp), `online` (boolean), `lastLoadSuccess` (timestamp), `loadErrors` (liczba błędów od ostatniego sukcesu). W main.js handler IPC `profile:checkHealth` wykonuje HEAD request do URL profilu (timeout 5s) i aktualizuje status. W Sidebar – ikona statusu (zielona = online, żółta = wolno/niestabilne, czerwona = offline/błędy). Tooltip: "Online: 2s | Ostatnie błędy: 3". Sprawdzanie co 5 minut dla aktywnych profili.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.5
- **Komentarz:** Użytkownik nie wie, czy strona działa, czy to WebView się zawiesił. Health monitoring daje szybką diagnozę.

---

### [Szyfrowanie wrażliwych danych] :
- **ID:** ARCH_REQ-037
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** System szyfrowania wrażliwych danych. Wykorzystanie `electron.safeStorage` (jeśli dostępny) lub `crypto` z hashem (master password od użytkownika). Szyfrowane dane: klucze API (Pushbullet, RemoveBG), notatki (opcjonalnie, toggle w Settings), taski (opcjonalnie, toggle w Settings). Backup eksportowany jako `backup_encrypted.json` (zamiast jawnego JSON). Przy imporcie – pytanie o hasło. Integracja z `SETTINGS_REQ-003` (eksport/import ustawień). Nie szyfrujemy: profili WebView (brak loginów), cookies i sesji (bezpieczna partycja Electrona), historii, logów, ustawień UI.
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.5
- **Komentarz:** Bez szyfrowania backup zawiera wszystkie notatki i taski w czystym tekście – ryzyko przy udostępnianiu lub chmurze. Dotyczy: `backupManager.js`, `settingsStore.js`, `encryptionUtils.js`.

---

### [DEBUG_MODULES – per‑modułowe logowanie błędów] :
- **ID:** ARCH_REQ-043
- **Sekcja:** ARCHITEKTURA I STABILNOŚĆ
- **Opis:** Wprowadzenie mechanizmu `DEBUG_MODULES` w `config.js`, który pozwala niezależnie włączać/wyłączać logowanie (`logDebug`, `logError`, `logWarn`, `logInfo`) dla poszczególnych modułów aplikacji, gdy `settings.debugMode === true`. Domyślnie wszystkie moduły logują. Użytkownik (lub developer) może wyłączyć logowanie dla wybranego modułu bez restartu aplikacji (zmiana przez UI Settings lub przez konsolę).
- **Status:** BACKLOG
- **Priorytet:** MAJOR
- **Version:** 0.0.4
- **Komentarz:** Obecnie `debugMode` włącza logowanie we wszystkich modułach jednocześnie – przy poszukiwaniu błędu w jednym module logi z pozostałych zaśmiecają konsolę. Dotyczy: `src/utils/logger.js`, `src/utils/loggerRenderer.js`, `src/config.js`, `src/ui/settings/DebugModulesSection.jsx` (nowy komponent) oraz wszystkich miejsc wywołujących `logDebug`, `logInfo`, `logWarn`, `logError` (dostosowanie nagłówka lub dodanie parametru `module`).

---

*Koniec dokumentu wymagań — wersja 0.0.3*
---

## 🗂️ TASKPANEL — ARCHITEKTURA I MODEL DANYCH

> Wymagania naprawcze i architektoniczne dla systemu zadań (TaskPanel + AggregatedTasks). Priorytet: unifikacja modelu danych, spójność warstw, przyszłościowa rozszerzalność (mini-JIRA z reminderem).

---

### [Unifikacja Modelu Danych Zadania] :

- **ID:** TASKS_ARCH-001
- **Sekcja:** TASKPANEL — ARCHITEKTURA I MODEL DANYCH
- **Opis:** Każde zadanie musi mieć zunifikowany model: `{ id, name, desc, comment, priority, section, version, pinned, projectId, createdAt }`. Pola `title`/`description`/`status` (z `TASK_STATUS`) nie są używane w aktywnym UI i muszą zostać usunięte lub zmapowane. `section` przyjmuje wartości: `active | backlog | done`. `priority` przyjmuje: `A | B | C | D | E`. Pole `projectId` to identyfikator projektu (string lub number — musi być spójny z `projects.id`). Pole `name` jest wymagane (min. 1 znak, max. 200).
- **Status:** IN_SPRINT
- **Priorytet:** CRITICAL
- **Version:** 0.0.3
- **Komentarz:** Wykryto dwa równoległe modele: `TaskModal` (aktywny UI) używa `name/desc/comment`, `TaskEditor`/`TaskDetails`/`TaskList` używają `title/description/status`. Scalono w jednym modelu — canonical to `name/desc/comment/section`. `TaskEditor` i `TaskList` — martwy kod, nie podłączony do `TaskPanel` — do usunięcia lub integracji w kolejnym sprincie.

---

### [Identyfikator Projektu w Zadaniach] :

- **ID:** TASKS_ARCH-002
- **Sekcja:** TASKPANEL — ARCHITEKTURA I MODEL DANYCH
- **Opis:** `projectId` w zadaniu musi być spójny z `id` projektu z `projectsStore`. `tasksStore` zapisuje pliki po `projectId` (jako nazwa pliku). Przy tworzeniu projektu w `ProjectManager`: `id: Date.now().toString()` (string) lub UUID. `TaskPanel` przekazuje `projectId` jako prop — musi to być to samo `id` co w `projects[]`. Handler `tasks:getAll` bez payloadu zwraca płaską listę z polem `projectId` zmapowanym z `projectName` dla kompatybilności.
- **Status:** IN_SPRINT
- **Priorytet:** CRITICAL
- **Version:** 0.0.3
- **Komentarz:** Wykryto rozbieżność: `ProjectManager` tworzy projekty z `id: Date.now()` (number), `tasksStore` używa `projectName` (string) jako klucza pliku. Do ujednolicenia przy implementacji pełnego CRUD projektów. Tymczasowo: `projectId = projectName` (nazwa projektu jako ID).

---

### [Separacja Formatów: TaskPanel vs AggregatedTasks] :

- **ID:** TASKS_ARCH-003
- **Sekcja:** TASKPANEL — ARCHITEKTURA I MODEL DANYCH
- **Opis:** Dwa widoki mają różne potrzeby formatów danych: `TaskPanel` potrzebuje płaskiej listy zadań dla projektu (tablica `Task[]`), `AggregatedTasks` potrzebuje zgrupowanego obiektu `{ projectName: { active, backlog, done } }`. Kanały IPC: `tasks:getAll` (z/bez payloadu) → płaska lista; `tasks:getAllGrouped` → format per projekt dla AggregatedTasks. `preload.cjs`: `getAllTasks()` → `tasks:getAllGrouped`, `getTasks(project)` → `tasks:getAll`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Naprawione: dodano `tasks:getAllGrouped` handler, przepięto `getAllTasks()` w preload. Dwa formaty są potrzebne — nie ma sensu płaskiej listy w AggregatedTasks (potrzebuje pogrupowania per projekt).

---

### [Spójność Przepływu CRUD Zadań] :

- **ID:** TASKS_ARCH-004
- **Sekcja:** TASKPANEL — ARCHITEKTURA I MODEL DANYCH
- **Opis:** Pełny przepływ CRUD przez IPC: `TaskPanel.jsx` → `useTasks.js` → `invoke('tasks:add/update/delete')` → `ipcMainHandlers_tasks.js` → `tasksStore.js`. Brakujące handlery IPC: `tasks:add`, `tasks:update`, `tasks:delete` — dodane. Każda operacja mutuje dane po stronie `tasksStore` i zwraca `{ ok, data?, error? }`. Hook `useTasks` stosuje optimistic update z rollbackiem przy błędzie. Po operacji `update` ze zmianą sekcji — zadanie musi być przeniesione między tablicami w pliku JSON projektu.
- **Status:** IN_SPRINT
- **Priorytet:** CRITICAL
- **Version:** 0.0.3
- **Komentarz:** Handlery `tasks:add/update/delete` dodane w poprzednim commicie. `tasks:update` obsługuje zmianę sekcji (przeniesienie między active/backlog/done). `tasks:delete` usuwa z dowolnej sekcji szukając po `projectId || projectName`.

---

### [Martwy Kod — TaskEditor i TaskList] :

- **ID:** TASKS_ARCH-005
- **Sekcja:** TASKPANEL — ARCHITEKTURA I MODEL DANYCH
- **Opis:** `TaskEditor.jsx` i `TaskList.jsx` nie są importowane ani używane przez `TaskPanel.jsx`. `TaskEditor` wywołuje `window.showToast()` — nieistniejąca funkcja w preload/renderer. `TaskList` używa `TASK_STATUS` (todo/in_progress/blocked) — model niezgodny z aktywnym UI. Do decyzji: usunięcie lub integracja jako alternatywny widok listy (zastępstwo `TaskSectionList`). `TASK_STATUS.BLOCKED` nie jest używany nigdzie indziej.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Nie usuwać przed decyzją produktową. Na razie zostawić jako `// TODO: rozważyć integrację lub usunięcie`. Jeśli `TaskList` ma zastąpić `TaskSectionList` — trzeba zmapować sekcje (active/backlog/done) na statusy (todo/in_progress/done) lub odwrotnie.

---

### [Naprawione: Błędy Krytyczne TaskPanel] :

- **ID:** TASKS_ARCH-006
- **Sekcja:** TASKPANEL — ARCHITEKTURA I MODEL DANYCH
- **Opis:** Lista naprawionych błędów krytycznych (sprint 0): (1) Błędne ścieżki importów w `src/ui/taskpanel/` — wszystkie `../utils/` zamienione na `../../utils/` (crashowało bundler). (2) `onDelete` w `TaskPanel.handlers` — `TaskItem` wysyłał `id` (string), handler oczekiwał obiektu `task` — naprawione przez lookup w `sections`. (3) `tasks:getAll` bez payloadu zwracał obiekt pogrupowany zamiast tablicy — naprawione (płaska lista). (4) `AggregatedTasks` używał `getAllTasks()` → format pogrupowany wymagany — dodano `tasks:getAllGrouped` i przepięto preload. (5) Syntax error w `ToolsContainer.jsx`: `props = {>` → `props = {}`.
- **Status:** DONE
- **Priorytet:** CRITICAL
- **Version:** 0.0.3
- **Komentarz:** Wszystkie błędy z tej listy zostały naprawione w commicie fix(tasks) na branchu UAT-v0.0.4.


---

## 🗂️ TASKPANEL — GRUPY ZADAŃ I PRZEPŁYW PROFIL→TASKGROUP

> Wymagania dla systemu przypisania profili WebView do grup zadań (TaskGroup). Jeden TaskPanel = jedna TaskGroup. Profil domyślnie → TaskGroup 1:1. Opcjonalnie wiele profili → jedna TaskGroup (shared).

---

### [Model Danych — Task] :

- **ID:** TASKS_MODEL-001
- **Sekcja:** TASKPANEL — GRUPY ZADAŃ I PRZEPŁYW PROFIL→TASKGROUP
- **Opis:** Kanoniczny model zadania:
  ```
  Task {
    id:          string          // task_<timestamp>_<random>
    taskGroupId: string          // ID grupy (tg_<profileId> dla 1:1, lub dowolny dla shared)
    name:        string          // wymagane, max 200 znaków
    desc:        string          // opcjonalny opis
    comment:     string          // opcjonalny komentarz techniczny (kod, notatka)
    status:      TaskStatus      // 'todo' | 'in_progress' | 'blocked' | 'done' | 'cancelled'
    section:     TaskCategory    // 'active' | 'backlog' | 'done' — WYZNACZANA ze status
    priority:    'A'|'B'|'C'|'D'|'E'  // A = najwyższy
    pinned:      boolean         // zadania pinnowane zawsze na górze sekcji
    version:     string          // opcjonalne, np. '0.0.3'
    createdAt:   ISO string
  }
  ```
  `section` NIE jest ustawiana przez użytkownika — jest automatycznie wyznaczana z `status` przez `normalizeTask()` po stronie backendu i frontendu.
- **Status:** IN_SPRINT
- **Priorytet:** CRITICAL
- **Version:** 0.0.3

---

### [Model Danych — TaskStatus ↔ TaskCategory (Section)] :

- **ID:** TASKS_MODEL-002
- **Sekcja:** TASKPANEL — GRUPY ZADAŃ I PRZEPŁYW PROFIL→TASKGROUP
- **Opis:** Mapowanie status → sekcja (reguły domenowe, implementowane w `tasksStore.normalizeTask()` i mirror w UI):
  ```
  in_progress → active   (zadanie w toku, sekcja Aktualne)
  todo        → backlog  (do zrobienia, sekcja Backlog)
  blocked     → backlog  (zablokowane, sekcja Backlog)
  done        → done     (ukończone, sekcja Zrobione)
  cancelled   → done     (anulowane / Out of Scope, sekcja Zrobione)
  ```
  Dozwolone statusy per sekcja:
  - `active`:  tylko `in_progress`
  - `backlog`: `todo`, `blocked`
  - `done`:    `done`, `cancelled`

  Przywrócenie z `done` → zawsze `todo` w `backlog` (nie można wrócić do `in_progress` bezpośrednio z Done).
- **Status:** IN_SPRINT
- **Priorytet:** CRITICAL
- **Version:** 0.0.3

---

### [Model Danych — TaskGroup] :

- **ID:** TASKS_MODEL-003
- **Sekcja:** TASKPANEL — GRUPY ZADAŃ I PRZEPŁYW PROFIL→TASKGROUP
- **Opis:** Model grupy zadań:
  ```
  TaskGroup {
    id:         string     // 'tg_<profileId>' dla 1:1, lub 'tg_<timestamp>' dla shared
    name:       string     // wyświetlana nazwa w nagłówku TaskPanel
    profileIds: string[]   // lista profili współdzielących grupę
    createdAt:  ISO string
  }
  ```
  Plik danych: `userData/task_groups.json`. Zadania przechowywane w `userData/tasks/<taskGroupId>.json`.
- **Status:** IN_SPRINT
- **Priorytet:** CRITICAL
- **Version:** 0.0.3

---

### [Przepływ: Profil → TaskGroup → TaskPanel] :

- **ID:** TASKS_FLOW-001
- **Sekcja:** TASKPANEL — GRUPY ZADAŃ I PRZEPŁYW PROFIL→TASKGROUP
- **Opis:** Mechanizm otwarcia TaskPanel z kontekstu profilu WebView:
  1. Użytkownik klik prawym na profil w Sidebar → `Otwórz zadania`
  2. `Sidebar` wywołuje `onOpenTaskPanel(profile)` z pełnym obiektem profilu
  3. `MainLayout.handleOpenTaskPanel()` wywołuje `taskGroups:ensureForProfile({ profileId, profileName })`
  4. Handler IPC: szuka grupy dla `profileId` → jeśli brak, tworzy `{ id: tg_<profileId>, name: profileName, profileIds: [profileId] }`
  5. Zwraca `TaskGroup` → `MainLayout` ustawia `currentGroup = { id, name }` i otwiera `TaskPanel`
  6. `TaskPanel` otrzymuje `taskGroupId` i `groupName` jako props
  7. `useTasks.reloadTasks(taskGroupId)` ładuje płaską listę zadań dla grupy
- **Status:** IN_SPRINT
- **Priorytet:** CRITICAL
- **Version:** 0.0.3

---

### [Shared TaskGroup — Wiele Profili, Jeden Panel] :

- **ID:** TASKS_FLOW-002
- **Sekcja:** TASKPANEL — GRUPY ZADAŃ I PRZEPŁYW PROFIL→TASKGROUP
- **Opis:** Użytkownik może przypisać wiele profili do jednej grupy zadań (np. wszystkie instancje Claude.ai → jedna grupa "Claude"). Mechanizm:
  - Backend (zaimplementowane): `taskGroups:assignProfile({ groupId, profileId })` — przenosi profil z poprzedniej grupy do docelowej
  - Backend (zaimplementowane): `taskGroups:unassignProfile({ profileId })` — odpina profil od grupy
  - UI (FUTURE — Sprint 1 UI): w `ProfileModal` lub osobnym widoku: dropdown wyboru grupy + przycisk "Utwórz nową grupę"
  - Przy otwarciu TaskPanel dla profilu: zawsze `ensureForProfile` → jeśli profil już ma grupę (shared), zwraca tę grupę, nie tworzy nowej
  - Zadania shared grupy są widoczne dla wszystkich profili przypisanych do tej grupy
- **Status:** IN_SPRINT (backend), FUTURE (UI)
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Backend gotowy: `taskGroupsStore.js`, `ipcMainHandlers_taskGroups.js`, `useTaskGroups.js`, preload. UI do implementacji w kolejnym sprincie.

---

### [AggregatedTasks — Widok Zbiorczy] :

- **ID:** TASKS_FLOW-003
- **Sekcja:** TASKPANEL — GRUPY ZADAŃ I PRZEPŁYW PROFIL→TASKGROUP
- **Opis:** Widok zbiorczy (`AggregatedTasks` w ToolsPanel) pokazuje wszystkie zadania ze wszystkich grup. Funkcje:
  - Grupowanie per `taskGroupId` z wyświetleniem `groupName`
  - Filtrowanie po `status`: in_progress / todo / blocked / done / cancelled
  - Filtrowanie po `priority`: A / B / C / D / E
  - Filtrowanie po `section`: active / backlog / done
  - Sortowanie po priority (A→E), date, status
  - Zwijanie/rozwijanie per grupa
  - Kanały IPC: `aggregatedTasks:getAll`, `aggregatedTasks:filter`, `aggregatedTasks:sort`
  - `getAllTasks()` w preload → `tasks:getAllGrouped` (format per taskGroupId dla AggregatedTasks)
- **Status:** IN_SPRINT (backend), FUTURE (UI filtry + zwijanie)
- **Priorytet:** MAJOR
- **Version:** 0.0.3

