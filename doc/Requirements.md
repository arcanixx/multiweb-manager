=============================================================================
FILE: Requirements.md
PATH: doc/Requirements.md
VERSION: 0.0.3
PURPOSE: Wymagania aplikacji z aktualnymi statusami, priorytetami i komentarzami
DEPENDS ON: structure.txt, DevelopersGuide.md, AI_Development_Standards.md
=============================================================================

# 📋 MULTIWEB MANAGER — WYMAGANIA SYSTEMOWE

> Wersja dokumentu: 0.0.3 | Ostatnia aktualizacja: 2026-05-22
> Format: ID | Opis | Status | Priorytet | Version | Komentarz

---

## 📦 ARCHITEKTURA I STABILNOŚĆ

> Fundament całej aplikacji. Wymagania dotyczące stabilności, bezpieczeństwa IPC, zarządzania pamięcią i architektury kodu.

---

### [Cleanup Event Listenerów] :

- **ID:** ARCH_REQ-001
- **Opis:** Cleanup event listenerów w komponentach WebViewTab, Terminal i App.jsx. Każdy `useEffect` dodający event listener musi zwracać funkcję cleanup (`removeEventListener`). W WebViewTab.jsx — eventy WebView (`did-finish-load`, `console-message`) muszą być usuwane przy unmount. W Terminal.jsx — xterm i pty muszą być dispose'owane (`onData.dispose()`, `onExit.dispose()`, `pty.kill()`, `term.dispose()`). W preload.cjs — funkcje `onX` muszą zwracać cleanup: `return () => ipcRenderer.removeListener(...)`.
- **Status:** IN_SPRINT
- **Priorytet:** CRITICAL
- **Version:** 0.0.3
- **Komentarz:** Brak cleanup → memory leak, crash, duplikacja eventów, rosnący RAM. Dotyczy plików: `WebViewTab.jsx`, `Terminal.jsx`, `App.jsx`, `preload.cjs`. Szukaj wszystkich `addEventListener`, `on(...)`, `xterm.onData`, `ipcRenderer.on` i dodaj cleanup.

---

### [Walidacja Danych w IPC] :

- **ID:** ARCH_REQ-002
- **Opis:** Każdy handler IPC w `main.js` / `ipcMainHandlers.js` musi walidować typy i strukturę przychodzącego payloadu przed przetworzeniem. Walidacja: `if (!payload || typeof payload !== "object") return { ok: false, error: "INVALID_PAYLOAD" }`. Walidacja pól settings (np. `language` musi być stringiem), profilu (wymagane `id` i `url` jako string), tasków (musi być tablicą).
- **Status:** IN_SPRINT
- **Priorytet:** CRITICAL
- **Version:** 0.0.3
- **Komentarz:** Renderer może wysłać null, "string", {}, błędne typy → korupcja danych w Electron Store. Nigdy nie zakładaj, że renderer wysyła poprawne dane. Dotyczy: `main.js`, `ipcMainHandlers.js`, wszystkich store'ów korzystających z IPC.

---

### [Try/Catch w Handlerach IPC] :

- **ID:** ARCH_REQ-003
- **Opis:** Każdy handler IPC musi być opakowany w blok `try/catch`. Przy błędzie zwracać `{ ok: false, error: err.message || "UNKNOWN_ERROR" }`. Wszystkie operacje I/O (fs, store, API) muszą być w try/catch. Przykład: `ipcMain.handle("save-settings", async (event, payload) => { try { ... return { ok: true, data: merged }; } catch (err) { logError(...); return { ok: false, error: ... }; } })`.
- **Status:** IN_SPRINT
- **Priorytet:** CRITICAL
- **Version:** 0.0.3
- **Komentarz:** Bez try/catch błąd zapisu → renderer dostaje `undefined` → UI nie wie, co się stało. Dotyczy: `main.js`, `ipcMainHandlers.js`.

---

### [Single Instance Lock] :

- **ID:** ARCH_REQ-004
- **Opis:** Implementacja `app.requestSingleInstanceLock()` na górze `main.js`. Jeśli aplikacja nie uzyska blokady — `app.quit()` i `process.exit(0)`. Obsługa zdarzenia `second-instance`: przywrócenie i fokus na istniejącym oknie (`mainWindow.restore()` + `mainWindow.focus()`).
- **Status:** IN_SPRINT
- **Priorytet:** CRITICAL
- **Version:** 0.0.3
- **Komentarz:** Bez blokady użytkownik może odpalić kilka instancji → store się psuje. Musi działać na Windows/Mac/Linux. Dotyczy: `main.js`.

---

### [Globalne Handlery Błędów] :

- **ID:** ARCH_REQ-005
- **Opis:** Dodanie globalnych handlerów błędów w `main.js`: `process.on("uncaughtException", ...)` oraz `process.on("unhandledRejection", ...)`. Oba muszą wywoływać `logError(...)` zapisujący do pliku logów. Nie wolno ignorować błędów.
- **Status:** IN_SPRINT
- **Priorytet:** CRITICAL
- **Version:** 0.0.3
- **Komentarz:** Brak obsługi błędów → aplikacja wywala się bez logów. `logError` musi zapisywać do pliku logów (nie tylko konsola). Dotyczy: `main.js`.

---

### [Merge Settings (nie Overwrite)] :

- **ID:** ARCH_REQ-006
- **Opis:** Funkcja `updateSettings(partial)` w `settingsStore.js` musi stosować merge: `const merged = { ...current, ...partial }`. Nigdy nie nadpisywać całego obiektu settings jednym polem. Wszystkie miejsca wywołujące `saveSettings` muszą używać `updateSettings`.
- **Status:** IN_SPRINT
- **Priorytet:** CRITICAL
- **Version:** 0.0.3
- **Komentarz:** `saveSettings({ projects: [...] })` nadpisuje CAŁE settings → tracisz język, debugMode, API key itd. Dotyczy: `src/core/settingsStore.js` i wszystkich miejsc wywołujących `saveSettings`.

---

### [Trwały Zapis Profili] :

- **ID:** ARCH_REQ-007
- **Opis:** Każda zmiana profili (dodanie, edycja, usunięcie) musi kończyć się wywołaniem `saveProfiles(nextProfiles)` przez IPC → main → electron-store. Funkcja `handleProfilesChange(nextProfiles)` powinna: `setProfiles(nextProfiles)` + `saveProfiles(nextProfiles)`.
- **Status:** IN_SPRINT
- **Priorytet:** CRITICAL
- **Version:** 0.0.3
- **Komentarz:** Profil dodany → nie zapisany → znika po restarcie. Dotyczy: `Sidebar.jsx`, `profilesStore.js`.

---

### [Autosave Notepad tylko przy Zmianie] :

- **ID:** ARCH_REQ-008
- **Opis:** Autosave notatnika co 5 sekund, ale tylko gdy `content !== lastSaved`. Implementacja przez `setInterval` w `useEffect` z porównaniem stanu. Po zapisie aktualizować `lastSaved`. Cleanup: `return () => clearInterval(interval)`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Zapis co 5s nawet bez zmian → lag, I/O spam. Dotyczy: `Notepad.jsx`, `notepadStore.js`.

---

### [Logger z Zapisem do Pliku i Eksportem] :

- **ID:** ARCH_REQ-009
- **Opis:** System logowania musi zapisywać do pliku `userData/logs/app.log`. Funkcja `logError(msg, meta)` wywołuje `appendLogToFile({ level: "error", msg, meta, ts: Date.now() })`. W Settings — przycisk eksportu logów: zapisuje `app.log` do wybranej lokalizacji przez dialog systemowy.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** DebugMode loguje tylko do konsoli — niewystarczające. Logi muszą być w `userData/logs/app.log`. Dotyczy: `src/utils/logger.js`, `src/services/logService.js`, `Settings.jsx`.

---

### [Osobny Plik config.js] :

- **ID:** ARCH_REQ-010
- **Opis:** Wydzielenie stałych konfiguracyjnych do osobnego pliku `config.js`. Struktura: `export const CONFIG = { debugMode: false, sleepTabsTimeout: 15 * 60 * 1000, historyLimit: 200, removeBg: { endpoint: "...", apiKey: "" } }`. Settings = dane użytkownika (zmienne). Config = stałe aplikacji (niezmienne w runtime).
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Settings zawiera rzeczy, które powinny być stałe → bałagan architektoniczny. Dotyczy: `config.js`.

---

### [WebView Błędy bez alert()] :

- **ID:** ARCH_REQ-011
- **Opis:** Zastąpienie wszystkich `alert()` w `WebViewTab.jsx` komponentem `WebViewErrorBar`. Komponent wyświetla komunikat błędu inline z przyciskiem „Reload". Przykład: `{error && <WebViewErrorBar message={t("webview.error.network")} onReload={handleReload} />}`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Alerty są brzydkie i blokujące. Dotyczy: `WebViewTab.jsx`, `WebViewErrorBar.jsx`.

---

### [Zastąpienie alert/prompt Modalami] :

- **ID:** ARCH_REQ-012
- **Opis:** Absolutny zakaz używania `alert()`, `confirm()`, `prompt()`. Stworzyć `Modal.jsx` i używać go do: Add/Edit Task, Add/Edit Profile, Add/Edit Project, Confirm Delete. Wszystkie dotychczasowe wywołania natywnych okien zastąpić dedykowanymi modalami React.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Prompty są archaiczne i blokujące. Dotyczy: `UI/Modal.jsx` i wszystkich komponentów używających `alert/prompt`.

---

### [Cleanup Listenerów online/offline] :

- **ID:** ARCH_REQ-013
- **Opis:** W `App.jsx` — eventy `online`/`offline` muszą mieć cleanup w `useEffect`. Wzorzec: `window.addEventListener("online", onOnline)` + `return () => window.removeEventListener("online", onOnline)`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Brak cleanup → memory leak przy remount komponentu. Dotyczy: `App.jsx`.

---

### [System Powiadomień (Toast + System Notifications)] :

- **ID:** ARCH_REQ-014
- **Opis:** Globalny system powiadomień: toasty (success/error/info/warning) w `UI/ToastContainer.jsx` oraz systemowe powiadomienia OS (`new Notification(...)`). Toggle włączenia/wyłączenia systemu powiadomień w Settings.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Dotyczy: `UI/ToastContainer.jsx`, `notificationsManager.js`, `Settings.jsx`.

---

### [Pushbullet API] :

- **ID:** ARCH_REQ-015
- **Opis:** Integracja z Pushbullet API. Użytkownik podaje API key w Settings. Możliwość wysyłania powiadomień z nazwą kafelka/profilu.
- **Status:** IN_SPRINT
- **Priorytet:** MINOR
- **Version:** 0.0.3
- **Komentarz:** Nice-to-have. Dotyczy: `apiService.js`, `Settings.jsx`.

---

### [Spellcheck i Walidacja Kodu w Notatniku] :

- **ID:** ARCH_REQ-016
- **Opis:** Implementacja CodeMirror lub Monaco Editor w `NotepadEditor.jsx`. Tryby: JS, Python, HTML, CSS, XML. Spellcheck PL/EN zależny od języka systemu.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Dotyczy: `NotepadEditor.jsx`. Szczegóły implementacji w NOTEPAD_REQ-001.

---

### [Voice Agent / AI Agent] :

- **ID:** ARCH_REQ-017
- **Opis:** Integracja z Web Speech API i lokalnym LLM. Komponent `VoiceAgent.jsx` + serwis `aiAgentService.js`.
- **Status:** IN_SPRINT
- **Priorytet:** MINOR
- **Version:** 0.0.3
- **Komentarz:** DO-ANALYSIS — nie implementować bez decyzji użytkownika. Wymaga analizy dostępnych lokalnych modeli LLM.

---

### [Automatyczne Code Review] :

- **ID:** ARCH_REQ-018
- **Opis:** Narzędzie do automatycznego code review: wysyłanie kodu do AI, analiza i sugestie. Komponent `Tools/CodeReview.jsx`.
- **Status:** IN_SPRINT
- **Priorytet:** MINOR
- **Version:** 0.0.3
- **Komentarz:** DO-ANALYSIS — nie implementować bez decyzji użytkownika. Wymaga wyboru modelu AI i polityki prywatności.

---

## 🗂️ SIDEBAR / PROFILE MANAGER

> Wymagania dotyczące panelu bocznego: zarządzanie profilami, biblioteka aplikacji, wyszukiwanie, kategorie, drag & drop.

---

### [App Library — Biblioteka Gotowych Aplikacji] :

- **ID:** SIDEBAR_REQ-001
- **Opis:** Stworzenie biblioteki gotowych aplikacji w pliku `src/data/app-library.json`. Struktura: kategorie (AI, Dev, Design, Productivity, Special) z listą aplikacji. Każda aplikacja: `{ id, name, url, icon, isPinned, isDefault, isFavorite }`. Store `appLibraryStore.js` z funkcjami `loadAppLibrary()` i `filterApps(query)`. W Sidebar — sekcja „App Library" z komponentem `AppLibraryItem`. Funkcja `handleAddFromLibrary(app)` tworzy nowy profil z UUID i zapisuje przez `saveProfiles()`. Toast po dodaniu. Jeśli profil o tym URL już istnieje → toast „Profil już istnieje".
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Użytkownik musi ręcznie wpisywać URL profilu → wolne, niewygodne. App Library jest statyczna — nie zapisujemy jej do store. Dodawanie profilu = tworzenie nowego obiektu w profilesStore. Każdy app musi mieć ikonę w `icons.js`. Jeśli App Library ma 200+ pozycji → dodać paginację lub lazy load. Dotyczy: `src/data/app-library.json` (NOWY), `src/core/appLibraryStore.js` (NOWY), `Sidebar.jsx`, `SidebarSection.jsx`, `AppLibraryItem.jsx` (NOWY).

---

### [Filtrowanie Profili — Search Bar] :

- **ID:** SIDEBAR_REQ-002
- **Opis:** Komponent `SidebarSearch.jsx` z polem input filtrującym profile w czasie rzeczywistym. Filtrowanie po `name`, `url`, `label`. Jeśli lista pusta → komunikat „Brak wyników". Jeśli query = "" → pełna lista. Tłumaczenie: `sidebar.searchPlaceholder`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Sidebar może mieć 50+ profili → trudno znaleźć właściwy. Sidebar ma: search bar, highlight wyników, rozwijanie sekcji gdzie są wyniki. Dotyczy: `Sidebar.jsx`, `SidebarSearch.jsx` (NOWY), `profilesStore.js`.

---

### [Kategorie Profili] :

- **ID:** SIDEBAR_REQ-003
- **Opis:** Dodanie pola `category` do profilu: `"AI" | "Dev" | "Design" | "Productivity" | "Special"`. Grupowanie profili w Sidebar według kategorii przez `SidebarSection`. Jeśli kategoria pusta → nie renderuj sekcji. Walidacja kategorii przy zapisie profilu. Tłumaczenia kategorii w locales.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Profile są w jednej liście → chaos. Sidebar staje się uporządkowany jak w Rambox/WebCatalog. Dotyczy: `profilesStore.js`, `Sidebar.jsx`, `SidebarSection.jsx`.

---

### [Ostatnio Używane Profile] :

- **ID:** SIDEBAR_REQ-004
- **Opis:** Dodanie pola `lastUsedAt` do profilu. Aktualizacja `lastUsedAt: Date.now()` przy każdym otwarciu profilu. Sekcja „Last used" w Sidebar: 10 ostatnio używanych profili posortowanych malejąco po `lastUsedAt`.
- **Status:** IN_SPRINT
- **Priorytet:** MINOR
- **Version:** 0.0.3
- **Komentarz:** Szybki dostęp do ostatnio używanych aplikacji. Dotyczy: `profilesStore.js`, `Sidebar.jsx`.

---

### [Drag & Drop Profili] :

- **ID:** SIDEBAR_REQ-005
- **Opis:** Implementacja HTML5 drag & drop dla profili w Sidebar. Atrybuty `draggable`, `onDragStart`, `onDrop` na elementach listy. Funkcja `reorderProfiles(targetId)` przelicza kolejność i wywołuje `saveProfiles()`. Drag & drop musi działać między kategoriami.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Pełna personalizacja Sidebaru. Po zmianie kolejności → `saveProfiles()`. Dotyczy: `Sidebar.jsx`, `profilesStore.js`.

---

### [Edycja Profilu — Modal] :

- **ID:** SIDEBAR_REQ-006
- **Opis:** Komponent `ProfileModal.jsx` z polami: Name, URL, Category, Label (tooltip), Notes (rich text), User Agent, adBlocker (per profil — override globalnego), pinned (czy na górze listy), kolor/ikona (opcjonalnie). Przycisk „Edit" w `SidebarProfileItem`. Po zapisaniu: `updateProfile(id, patch)` + `saveProfiles()` + toast. Walidacja URL. Usunięcie wszystkich `prompt()` z kodu.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** AdBlocker musi mieć toggle per profil (globalny + per-profil override). Logika: jeśli `profile.adBlocker !== undefined` → użyj `profile.adBlocker`, else → użyj `settings.adBlocker`. Dotyczy: `SidebarProfileItem.jsx`, `ProfileModal.jsx` (NOWY), `profilesStore.js`.

---

### [Multi-Account Login] :

- **ID:** SIDEBAR_REQ-007
- **Opis:** Każdy profil ma własny `partition` w WebView. Możliwość kopiowania cookies między partycjami.
- **Status:** IN_SPRINT
- **Priorytet:** MINOR
- **Version:** 0.0.3
- **Komentarz:** DO-ANALYSIS — nie implementować bez decyzji użytkownika. Dotyczy: `profilesStore.js`, `WebViewTab.jsx`.

---

## 🌐 WEBVIEW

> Wymagania dotyczące widoku WebView: toolbar, tile view, user agent, adblocker, screenshot, single app mode, resource monitor.

---

### [Toolbar WebView jak w Przeglądarce] :

- **ID:** WEBVIEW_REQ-001
- **Opis:** Komponent `WebViewToolbar.jsx` z przyciskami: Back, Forward, Refresh, Address Bar (readonly, z togglem na edytowalny w Settings), Copy URL, Open External, Zoom In, Zoom Out, DevTools, Clear Cache, Screenshot. Toolbar jest w pełni kontrolowany przez `WebViewTab` — `WebViewToolbar` tylko wywołuje callbacki. Każdy przycisk ma tooltip z opisem i skrótem klawiszowym. Skróty: `Ctrl+L` — fokus na address bar, `Ctrl+R` — reload, `Alt+←/→` — back/forward. Jeśli WebView nie załadowany → disable przyciski. Jeśli URL = `about:blank` → ukryj copy/open external.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Obecny toolbar jest minimalny. Brakuje podstawowych funkcji przeglądarkowych. Dotyczy: `WebViewTab.jsx`, `WebViewToolbar.jsx`, `icons.js`, locales.

---

### [Tile View — Wiele WebView Obok Siebie] :

- **ID:** WEBVIEW_REQ-002
- **Opis:** Tryb tile view: 2–3 WebView obok siebie w gridzie. Przycisk toggle w toolbarze. Komponent `WebViewTileView.jsx` renderuje wiele `WebViewTab` w trybie tile (bez sidebaru i dużego toolbaru). Tile view to tryb alternatywny, nie zastępuje normalnego widoku.
- **Status:** IN_SPRINT
- **Priorytet:** MINOR
- **Version:** 0.0.3
- **Komentarz:** Multitasking jak w Rambox. Dotyczy: `WebViewTab.jsx`, `WebViewTileView.jsx` (NOWY), `icons.js`.

---

### [Custom User Agent per Profil] :

- **ID:** WEBVIEW_REQ-003
- **Opis:** Pole `userAgent` w profilu. Input w `ProfileModal.jsx`. W `WebViewTab.jsx`: `<webview useragent={profile.userAgent || undefined} src={profile.url} />`. Jeśli `userAgent` pusty lub whitespace → użyj domyślnego. Walidacja: trim i sprawdzenie czy nie jest pustym stringiem.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Niektóre strony wymagają UA (mobilne wersje, starsze strony). Dotyczy: `profilesStore.js`, `ProfileModal.jsx`, `WebViewTab.jsx`.

---

### [AdBlocker — Toggle Globalny i per Profil] :

- **ID:** WEBVIEW_REQ-004
- **Opis:** Implementacja AdBlockera w `main.js` przez `session.defaultSession.webRequest.onBeforeRequest`. Funkcja `isAdUrl(url)` sprawdza regex: `/doubleclick|adservice|googlesyndication/`. Globalny toggle w Settings. Per-profil override: jeśli `profile.adBlocker !== undefined` → użyj `profile.adBlocker`, else → użyj `settings.adBlocker`. Zmiana ustawienia wymaga restartu WebView.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Masz flagę adBlocker, ale brak implementacji. Dotyczy: `main.js`, `settingsStore.js`, `Settings.jsx`, `ProfileModal.jsx`.

---

### [Screenshot Aktywnego WebView] :

- **ID:** WEBVIEW_REQ-005
- **Opis:** Przycisk „Screenshot" w toolbarze WebView. Po kliknięciu: WebView robi screenshot przez API `capturePage()`, zapisuje PNG do schowka, toast: „Zrzut ekranu skopiowany do schowka". Opcjonalnie: zapis do pliku, otwarcie folderu Screenshots.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Nowy feature. Dotyczy: `WebViewTab.jsx`, `WebViewToolbar.jsx`, `main.js` (handler IPC dla capturePage).

---

### [Single App Mode — Osobne Okno Electron] :

- **ID:** WEBVIEW_REQ-006
- **Opis:** Przycisk w toolbarze WebView otwierający profil w osobnym oknie Electron. Po zamknięciu okna — powrót do normalnego widoku. Idealne na drugi monitor.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Nowy feature. Dotyczy: `WebViewTab.jsx`, `WebViewToolbar.jsx`, `main.js` (tworzenie nowego BrowserWindow).

---

### [Resource Monitor WebView] :

- **ID:** WEBVIEW_REQ-007
- **Opis:** Przycisk „Resource Monitor" w toolbarze WebView. Po kliknięciu: toast z aktualnym zużyciem RAM/CPU WebView. Dane pobierane z `webContents.getProcessMemoryInfo()`.
- **Status:** IN_SPRINT
- **Priorytet:** MINOR
- **Version:** 0.0.3
- **Komentarz:** Nowy feature. Dotyczy: `WebViewTab.jsx`, `WebViewToolbar.jsx`, `main.js` (handler IPC).

---

## 📝 NOTEPAD

> Wymagania dotyczące notatnika: syntax highlight, spellcheck, rich text.

---

### [Syntax Highlight — CodeMirror/Monaco] :

- **ID:** NOTEPAD_REQ-001
- **Opis:** Implementacja CodeMirror lub Monaco Editor w `NotepadEditor.jsx`. Tryby: JS, Python, HTML, CSS, XML. Syntax highlight aktywuje się gdy `note.mode === "code"`. Dodanie pola `language` w notatce. Ciemny motyw edytora.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Notepad jest plain text → nie nadaje się do kodu. Dotyczy: `NotepadEditor.jsx`, `notepadStore.js`.

---

### [Spellcheck w Notatniku] :

- **ID:** NOTEPAD_REQ-002
- **Opis:** W trybie plain/rich text: `<textarea spellCheck={settings.spellcheck} />`. Spellcheck PL/EN zależy od języka systemu. Toggle w Settings.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Dotyczy: `NotepadEditor.jsx`, `Settings.jsx`.

---

### [Rich Text Notatki] :

- **ID:** NOTEPAD_REQ-003
- **Opis:** Tryb rich text w notatniku: bold, italic, underline, listy, linki. Komponent `RichTextEditor` z `onChange`. Przełączanie między trybami: plain text / rich text / code.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Dotyczy: `NotepadEditor.jsx`, `Notepad.jsx`.

---

## ✅ TASKSVIEW / TASKPANEL

> Wymagania dotyczące panelu zadań: filtrowanie, wyszukiwanie, rich text w opisach, modal dodawania/edycji.

---

### [Filtrowanie Zadań po Priorytecie] :

- **ID:** TASKS_REQ-001
- **Opis:** Filtrowanie zadań po priorytecie (A/B/C/D/E) w `TaskPanel.jsx`. Komponent `TaskFilters.jsx` z dropdownem priorytetów. Logika: `tasks.filter(t => filters.priority ? t.priority === filters.priority : true)`. Kolory priorytetów muszą być spójne w całej aplikacji.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Dotyczy: `TaskPanel.jsx`, `TaskFilters.jsx`.

---

### [Wyszukiwarka Zadań] :

- **ID:** TASKS_REQ-002
- **Opis:** Wyszukiwanie zadań w czasie rzeczywistym po `title` i `description`. Logika: `tasks.filter(t => t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query))`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Dotyczy: `TaskPanel.jsx`, `TaskFilters.jsx`.

---

### [Rich Text w Opisach Zadań] :

- **ID:** TASKS_REQ-003
- **Opis:** Rich text editor w polu `description` w `TaskModal.jsx`. Opis zadania może być HTML/Markdown. Zapisywany w store jako string.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Dotyczy: `TaskModal.jsx`, `tasksStore.js`.

---

### [Modal Add/Edit Task] :

- **ID:** TASKS_REQ-004
- **Opis:** Komponent `TaskModal.jsx` z polami: tytuł (wymagany), opis (rich text), priorytet (A–E, dropdown), status (Backlog/Active/Done, dropdown), projekt, deadline, tagi. Walidacja: tytuł nie może być pusty → komunikat błędu. Usunięcie wszystkich `prompt()` związanych z zadaniami. W `TaskPanel.jsx`: `handleAddTask()`, `handleEditTask(task)`, `handleSaveTask(task)` — rozróżnienie create/update po obecności `task.id`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Priorytet i status muszą być wybierane z dropdownów, nie wpisywane ręcznie. Dotyczy: `TaskModal.jsx`, `TaskPanel.jsx`, `tasksStore.js`.

---

## 💻 TERMINAL

> Wymagania dotyczące terminala: cleanup listenerów, historia komend, kolorowanie ANSI.

---

### [Cleanup Listenerów IPC Terminala] :

- **ID:** TERMINAL_REQ-001
- **Opis:** W `preload.cjs` funkcje `onTerminalData` i `onTerminalExit` muszą zwracać funkcję cleanup: `return () => ipcRenderer.removeListener(...)`. W `Terminal.jsx` — `useEffect` musi dispose'ować oba listenery i zabijać `ptyProcess` przy unmount. Po zamknięciu Terminala nie może zostać żaden listener IPC ani żywy `ptyProcess`.
- **Status:** IN_SPRINT
- **Priorytet:** CRITICAL
- **Version:** 0.0.3
- **Komentarz:** Terminal dodaje listenery IPC, ale ich nie usuwa. Każde otwarcie terminala dokłada kolejne subskrypcje → memory leak, duplikowane eventy, rosnący RAM. Dotyczy: `Terminal.jsx`, `preload.cjs`, `main.js`.

---

### [Historia Komend Terminala] :

- **ID:** TERMINAL_REQ-002
- **Opis:** Historia komend per sesja (nie zapisywana do store). Stan: `history[]` i `historyIndex`. Przy wysyłaniu komendy: dodaj do `history`, reset `historyIndex = -1`. Obsługa strzałek ArrowUp/ArrowDown przez `term.onKey`. Helper `replaceCurrentLine(cmd)` czyści aktualną linię i wpisuje tekst z historii.
- **Status:** IN_SPRINT
- **Priorytet:** MINOR
- **Version:** 0.0.3
- **Komentarz:** Brak historii komend (strzałka w górę/dół) — standard w terminalach. Dotyczy: `Terminal.jsx`, opcjonalnie `terminalStore.js`.

---

### [Kolorowanie Outputu ANSI] :

- **ID:** TERMINAL_REQ-003
- **Opis:** xterm.js obsługuje ANSI kolorowanie natywnie. Konfiguracja: `new Terminal({ convertEol: true, theme: { background: "#000000" } })`. Załadowanie addonów: `FitAddon`, `WebLinksAddon`. Upewnić się, że `ptyProcess` nie stripuje sekwencji ANSI.
- **Status:** IN_SPRINT
- **Priorytet:** MINOR
- **Version:** 0.0.3
- **Komentarz:** Brak kolorowania ANSI → logi i output są mniej czytelne. Nie trzeba ręcznie parsować kolorów. Dotyczy: `Terminal.jsx`.

---

## ⚙️ SETTINGS

> Wymagania dotyczące panelu ustawień: hotkeys, dark mode, eksport/import, logi, konto użytkownika.

---

### [Hotkeys Manager — Custom Skróty i Snippety] :

- **ID:** SETTINGS_REQ-001
- **Opis:** Moduł `SettingsHotkeys.jsx` z tabelą hotkeys (Add/Edit/Delete przez modale). Struktura hotkey: `{ id, shortcut, name, text, enabled }`. Store `hotkeysStore.js` z `loadHotkeys()` i `saveHotkeys(list)`. W `main.js`: `registerHotkeys()` rejestruje skróty przez `globalShortcut.register`. W `preload.cjs`: `onHotkeyTrigger` zwraca cleanup. W `App.jsx`: `useEffect` nasłuchuje `onHotkeyTrigger` i wywołuje `window.electronAPI.insertText(hk.text)`. Walidacja skrótu: unikalny, poprawny format. Toggle włączenia/wyłączenia całego systemu hotkeys w Settings.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Brak możliwości definiowania własnych skrótów wklejających tekst (snippety, podpisy, szablony). `insertText` po stronie main może używać robotjs/native input lub ograniczyć się do wklejania w obrębie aplikacji. Dotyczy: `SettingsHotkeys.jsx` (NOWY), `hotkeysStore.js` (NOWY), `main.js`, `preload.cjs`.

---

### [Dark Mode] :

- **ID:** SETTINGS_REQ-002
- **Opis:** Ustawienie `settings.theme = "light" | "dark" | "system"`. W `App.jsx`: `useEffect` dodaje/usuwa klasę `dark` na `document.documentElement` w zależności od ustawienia. Tryb `system` używa `window.matchMedia("(prefers-color-scheme: dark)")`. Dark mode musi obejmować: Sidebar, WebViewTab toolbar, TaskPanel, Notepad, Settings. Kolory priorytetów, toastów, tooltipów muszą mieć wersje dark.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Brak dark mode w aplikacji devowej to grzech. Dotyczy: `SettingsAppearance.jsx`, `index.css`/Tailwind config, `App.jsx`.

---

### [Eksport/Import Ustawień] :

- **ID:** SETTINGS_REQ-003
- **Opis:** Eksport do JSON: `{ version, exportedAt, settings, profiles, tasks, notes }`. Handler IPC `settings:export` — dialog zapisu pliku, `fs.writeFileSync`. Handler IPC `settings:import` — dialog otwarcia pliku, `JSON.parse`, walidacja wersji i struktury, modal z podsumowaniem (ile profili, tasków, itp.) przed nadpisaniem. Nie nadpisywać wszystkiego bez pytania.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Brak możliwości backupu ustawień, profili, notatek, tasków. Bezpieczny backup i migracja między maszynami. Dotyczy: `SettingsBackup.jsx` (NOWY), `settingsStore.js`, `preload.cjs`, `main.js`.

---

### [Logi Dostępne z Settings] :

- **ID:** SETTINGS_REQ-004
- **Opis:** Przycisk „Otwórz folder logów" w `SettingsDebug.jsx`. Handler IPC `logs:openFolder` wywołuje `shell.openPath(getLogsDir())`. Folder logów: `userData/logs`. Nie pokazywać ścieżki w UI — tylko otwierać systemowy eksplorator.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Logi są, ale użytkownik nie ma łatwego dostępu. Dotyczy: `SettingsDebug.jsx`, `logService.js`, `main.js`.

---

### [Konto Użytkownika i Sync w Chmurze] :

- **ID:** SETTINGS_REQ-005
- **Opis:** Logowanie e-mail + hasło / OAuth. Sync profili, settings, notatek, tasków z backendem (np. Supabase/Firebase). Rozwiązywanie konfliktów (last write wins / merge).
- **Status:** IN_SPRINT
- **Priorytet:** MINOR
- **Version:** 0.0.3
- **Komentarz:** DO-ANALYSIS — nie implementować bez decyzji o backendzie. Wymaga osobnego projektu serwerowego. Dotyczy: `AuthService.js` (NOWY), `CloudSyncService.js` (NOWY), `SettingsAccount.jsx` (NOWY).

---

## 🛠️ TOOLSPANEL — NARZĘDZIA (KAFELKI)

> Wymagania dotyczące panelu narzędzi: formattery, testery, konwertery, narzędzia deweloperskie.

---

### [JSON/YAML/XML Formatter] :

- **ID:** TOOLS_REQ-001
- **Opis:** Narzędzie `Tools/JsonYamlXmlFormatter.jsx`: textarea input, wybór formatu (JSON/YAML/XML), przyciski „Format", „Validate", „Copy", „Minify/Pretty". Użycie `JSON.parse/stringify`, `js-yaml`, parser XML. Błędy walidacji pokazywane w panelu error (nie alert).
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Dotyczy: `Tools/JsonYamlXmlFormatter.jsx` (NOWY), `icons.js`, locales.

---

### [Regex Tester] :

- **ID:** TOOLS_REQ-002
- **Opis:** Narzędzie `Tools/RegexTester.jsx`: pola pattern, flags, test string. Lista dopasowań, grup, indeksów pod spodem. Obsługa błędnego pattern w try/catch.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Dotyczy: `Tools/RegexTester.jsx` (NOWY).

---

### [Markdown Previewer] :

- **ID:** TOOLS_REQ-003
- **Opis:** Narzędzie `Tools/MarkdownPreviewer.jsx`: lewa strona — textarea/CodeMirror, prawa strona — podgląd HTML (marked/markdown-it). Tryb split/fullscreen. Drag & drop plików `.md`. Sanityzacja HTML (XSS). Eksport do HTML.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Dotyczy: `Tools/MarkdownPreviewer.jsx` (NOWY).

---

### [Image Tools — Compress, Resize, Convert] :

- **ID:** TOOLS_REQ-004
- **Opis:** Narzędzie `Tools/ImageTools.jsx`: drag & drop obrazów, preview przed/po, suwaki jakości i rozmiaru, wybór formatu (PNG/JPG/WebP). Przetwarzanie lokalne przez Canvas API (bez zewnętrznego API). Toast „Zapisano" po eksporcie.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Dotyczy: `Tools/ImageTools.jsx` (NOWY).

---

### [SVG → PNG Converter] :

- **ID:** TOOLS_REQ-005
- **Opis:** Narzędzie `Tools/SvgToPng.jsx`: drag & drop SVG, wybór rozdzielczości, render do canvas, eksport PNG. Obsługa wielu plików. Podgląd SVG + kod źródłowy.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Dotyczy: `Tools/SvgToPng.jsx` (NOWY).

---

### [File Previewer] :

- **ID:** TOOLS_REQ-006
- **Opis:** Narzędzie `Tools/FilePreviewer.jsx`: drag & drop pliku, rozpoznanie typu po rozszerzeniu/MIME. Tryby: RAW / PREVIEW. HTML → WebView, TXT → text, JSON → format + kolor, CSS/JS → highlight, Markdown → auto preview. Użycie highlight.js/CodeMirror do kolorowania. Zakaz wykonywania JS z plików.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Dotyczy: `Tools/FilePreviewer.jsx` (NOWY).

---

### [Mini Postman — API Tester] :

- **ID:** TOOLS_REQ-007
- **Opis:** Narzędzie `Tools/ApiTester.jsx`: metoda HTTP, URL, headers, body, przycisk „Send", panel response (status, headers, body). Historia requestów. Użycie `fetch`. Obsługa timeout i błędów sieci.
- **Status:** IN_SPRINT
- **Priorytet:** MINOR
- **Version:** 0.0.3
- **Komentarz:** Nice-to-have. Dotyczy: `Tools/ApiTester.jsx` (NOWY).

---

### [Clipboard History] :

- **ID:** TOOLS_REQ-008
- **Opis:** Narzędzie `Tools/ClipboardHistory.jsx`: lista ostatnich wpisów schowka (tekst). Kliknięcie → skopiowanie z powrotem. Pinowanie wpisów. Użycie clipboard z Electron. Opcjonalny limit czasu dla wrażliwych danych.
- **Status:** IN_SPRINT
- **Priorytet:** MINOR
- **Version:** 0.0.3
- **Komentarz:** Nice-to-have. Nie zapisywać wrażliwych danych długoterminowo. Dotyczy: `Tools/ClipboardHistory.jsx` (NOWY), `clipboardStore.js` (NOWY), `main.js`.

---

### [Cookie Grabber] :

- **ID:** TOOLS_REQ-009
- **Opis:** Narzędzie Cookie Grabber: pobiera cookies z aktywnego WebView, pokazuje w tabeli (nazwa, wartość, domena, expiry), możliwość skopiowania pojedynczego cookie lub wszystkich, eksport do JSON.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Nowy feature. Dotyczy: nowy komponent w `Tools/`, `main.js` (handler IPC dla `session.cookies`).

---

## 📚 APP LIBRARY

> Wymagania dotyczące pełnego widoku biblioteki aplikacji.

---

### [App Library — Pełny Widok Przeglądarki] :

- **ID:** APPLIB_REQ-001
- **Opis:** Pełny widok App Library jako osobny kafelek „App Library" w Sidebarze. Komponent `AppLibraryBrowser.jsx`. Możliwość filtrowania, sortowania, podglądu opisu, dodania do profili jednym kliknięciem. App Library jest tylko źródłem — nie zapisujemy jej zmian w store. Custom apps dopisywane do osobnego pliku `user-app-library.json`. Format aplikacji w bibliotece: `{ id, name, url, icon, isPinned, isDefault, isFavorite }`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Dotyczy: `data/app-library.json`, `AppLibraryBrowser.jsx` (NOWY), Sidebar (skrótowa wersja).

---

## 🎨 UI/UX

> Wymagania dotyczące interfejsu użytkownika: redesign Sidebaru, toolbar WebView, toasty, tooltipy, modale, loading states, global search, sleep tabs.

---

### [Sidebar Redesign] :

- **ID:** UIUX_REQ-001
- **Opis:** Nowy layout Sidebaru: góra — search bar, poniżej — sekcje kategorii (AI, Dev, Design, Productivity, Special Tools, Profiles), na dole — „Last used", „Settings", „Help". Sidebar responsywny: zwijanie do ikon. Tooltipy na ikonach, pełne nazwy po hover.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Dotyczy: `Sidebar.jsx`, `SidebarSection.jsx`, `SidebarProfileItem.jsx`, `SidebarSearch.jsx`.

---

### [WebView Toolbar — Doprecyzowanie UX] :

- **ID:** UIUX_REQ-002
- **Opis:** Address bar przełączany między readonly/edytowalny (toggle w Settings). Skróty klawiszowe: `Ctrl+L` — fokus na address bar, `Ctrl+R` — reload, `Alt+←/→` — back/forward. Szczegóły implementacji w WEBVIEW_REQ-001.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Doprecyzowanie UX do WEBVIEW_REQ-001.

---

### [Toast Messages — Globalny System] :

- **ID:** UIUX_REQ-003
- **Opis:** Globalny kontener `UI/ToastContainer.jsx` w `App.jsx`. API: `showToast("success" | "error" | "info" | "warning", message)`. Toasty znikają po 3–5 sekundach z możliwością ręcznego zamknięcia. Store `toastStore.js`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Dotyczy: `UI/ToastContainer.jsx`, `toastStore.js`.

---

### [Tooltipy Wszędzie] :

- **ID:** UIUX_REQ-004
- **Opis:** Komponent `UI/Tooltip.jsx` na hover/long-press. Tooltipy na: ikonach, kafelkach, przyciskach, polach formularzy (np. „User Agent — opcjonalny"), elementach UI ze skrótami klawiszowymi. Treść tooltipów z locales. Tooltipy muszą zawierać skróty klawiszowe, jeśli istnieją.
- **Status:** IN_SPRINT
- **Priorytet:** MINOR
- **Version:** 0.0.3
- **Komentarz:** Dotyczy: `UI/Tooltip.jsx` (NOWY) i wszystkie przyciski/ikony w aplikacji.

---

### [Modale zamiast alert/prompt] :

- **ID:** UIUX_REQ-005
- **Opis:** Globalny komponent `UI/Modal.jsx` z portalem do `document.body`. Obsługa: ESC, kliknięcie w tło, przyciski OK/Cancel. Każdy modal musi mieć: tytuł, opis, przyciski, walidację pól, komunikaty błędów. Modale: `TaskModal.jsx`, `ProfileModal.jsx`, `ProjectModal.jsx`. Wszystkie `alert/prompt/confirm` zastąpione modalami.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Dotyczy: `UI/Modal.jsx`, `TaskModal.jsx`, `ProfileModal.jsx`, `ProjectModal.jsx`.

---

### [Loading States — Spinner i Skeleton] :

- **ID:** UIUX_REQ-006
- **Opis:** Komponenty `UI/Spinner.jsx` i `UI/Skeleton.jsx`. Dla każdej operacji > 200ms: disable przycisk, pokaż spinner lub skeleton. Przykład: `if (loading) return <TasksSkeleton />`. Loading states spójne wizualnie. Nie blokować całej aplikacji — tylko lokalny obszar. Dotyczy: `TaskPanel`, `Settings`, `WebViewTab` (pierwsze ładowanie), `HistoryLog`.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Dotyczy: `UI/Spinner.jsx` (NOWY), `UI/Skeleton.jsx` (NOWY) i komponenty z operacjami async.

---

### [Global Search — Ctrl+K] :

- **ID:** UIUX_REQ-007
- **Opis:** Komponent `GlobalSearch.jsx` otwierany skrótem `Ctrl+K`. Unified search: profile, projekty, zadania, notatki. Lista wyników z sekcjami: Profiles, Projects, Tasks, Notes. Enter na wyniku → przejście do odpowiedniego modułu (otwarcie profilu, projektu, notatki).
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Nowy feature. Dotyczy: `GlobalSearch.jsx` (NOWY), `App.jsx`, `profilesStore.js`, `tasksStore.js`, `notesStore.js`.

---

### [Sleep Tabs — Uśpienie Nieaktywnych Kafelków] :

- **ID:** UIUX_REQ-008
- **Opis:** Jeśli profil/kafelek nie jest aktywny przez X minut → WebView przechodzi w „sleep" (`loadURL("about:blank")`). Przy aktywacji zakładki → wybudzenie i załadowanie `profile.url`. Konfiguracja w `config.js`: `sleepTabsTimeout: 15 * 60 * 1000`. Ustawienia per profil i globalne w Settings: wyłączony / 5 / 15 / 30 min. Edge-case'y: formularze, logowanie (nie usuwać stanu logowania jeśli możliwe). Sprawdzanie co 60 sekund przez `setInterval` z cleanup.
- **Status:** IN_SPRINT
- **Priorytet:** MAJOR
- **Version:** 0.0.3
- **Komentarz:** Nowy feature. Dotyczy: `WebViewTab.jsx`, `config.js`, `settingsStore.js`.

---

*Koniec dokumentu wymagań — wersja 0.0.3*


## Wymagania do weryfikacji (v0.0.3)

- 2a. App Library (lista gotowych aplikacji)
- 2b. Filtrowanie profili (search bar)
- 2c. Kategorie profili
- 2d. Ostatnio używane profile
- 2e. Drag & drop profili
- 2f. Edycja profilu (modal)
- 2g. Multi‑account login (DO‑ANALYSIS)
- 🧩 3a. Toolbar jak w przeglądarce
- 🧩 3b. Tile view (2–3 WebView obok siebie)
- 🧩 3c. Custom user agent per profile
- 🧩 3d. AdBlocker toggle
- 🧩 4a. Syntax highlight (JS, Python, HTML, CSS, XML)
- 🧩 4b. Spellcheck
- 🧩 4c. Rich text notatki
- 🧩 5a. Filtrowanie po priorytecie
- 🧩 5b. Wyszukiwarka zadań
- 🧩 5c. Notatki rich‑text w zadaniach
- 6a. Cleanup listenerów IPC
- 6b. Historia komend
- 6c. Kolorowanie outputu (ANSI)
- 7a. Hotkeys manager (custom skróty + wklejanie tekstów)
- 7b. Dark mode
- 7c. Eksport/Import ustawień
- 7d. Logi dostępne z Settings
- 7e. Konto użytkownika + sync w chmurze (DO‑ANALYSIS)
- 8a. JSON/YAML/XML formatter
- 8b. Regex tester
- 8c. Markdown Previewer
- 8d. Image Tools (compress, resize, convert)
- 8e. SVG → PNG converter + preview
- 8f. File Previewer
- 8g. Mini Postman (API tester)
- 8h. Clipboard history
- 10a. Sidebar redesign
- 10b. WebView toolbar (doprecyzowanie)
- 10c. Toast messages
- 10d. Tooltipy wszędzie
- 10e. Modale zamiast alert/prompt
- 10f. Loading states
