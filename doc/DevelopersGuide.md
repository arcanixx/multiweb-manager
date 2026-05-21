=============================================================================
FILE: DevelopersGuide.md
PATH: doc/DevelopersGuide.md
VERSION: 0.0.3
PURPOSE: Kompletny przewodnik developerski MultiWeb Manager — pełna specyfikacja
DEPENDS ON: structure.txt, ModulesOverview.md
=============================================================================

# =============================================================================
# 1. ARCHITEKTURA I STABILNOŚĆ (1a–1r)
# =============================================================================

## 1a. Cleanup event listenerów (WebViewTab, Terminal, App)
**Pliki:**
- src/components/WebViewTab/WebViewTab.jsx
- src/components/Terminal/Terminal.jsx
- src/App.jsx
- preload.js

**Cel:**  
Zapobieganie memory leakom, duplikacji eventów, rosnącemu zużyciu RAM i crashom po dłuższym używaniu.

**Zasada:**  
Każdy addEventListener / on(...) musi mieć cleanup w return().

**Przykład w React:**
```js
useEffect(() => {
  function handleResize() {}
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
```

**WebViewTab cleanup:**
```js
useEffect(() => {
  const wv = webviewRef.current;
  const onLoad = () => setLoading(false);
  const onConsole = (e) => logDebug("webview console", e.message);

  wv.addEventListener("did-finish-load", onLoad);
  wv.addEventListener("console-message", onConsole);

  return () => {
    wv.removeEventListener("did-finish-load", onLoad);
    wv.removeEventListener("console-message", onConsole);
  };
}, []);
```

**Terminal cleanup:**
```js
useEffect(() => {
  const disposeData = term.onData((data) => pty.write(data));
  const disposeExit = pty.onExit(() => term.write("\r\n[Process exited]\r\n"));

  return () => {
    disposeData.dispose();
    disposeExit.dispose();
    pty.kill();
    term.dispose();
  };
}, []);
```

**preload.js cleanup:**
```js
onTerminalData: (handler) => {
  const listener = (_, payload) => handler(payload);
  ipcRenderer.on("terminal:data", listener);
  return () => ipcRenderer.removeListener("terminal:data", listener);
}
```

---

## 1b. Walidacja danych w IPC
**Pliki:** main.js, ipcMainHandlers.js

**Cel:**  
Zapobieganie korupcji danych w Electron Store.

**Wzorzec walidacji:**
```js
if (!payload || typeof payload !== "object") {
  return { ok: false, error: "INVALID_PAYLOAD" };
}
```

**Walidacja settings:**
```js
if (payload.language && typeof payload.language !== "string") {
  return { ok: false, error: "INVALID_LANGUAGE" };
}
```

**Walidacja profilu:**
```js
if (!payload.id || typeof payload.id !== "string") return { ok: false, error: "INVALID_ID" };
if (!payload.url || typeof payload.url !== "string") return { ok: false, error: "INVALID_URL" };
```

---

## 1c. try/catch w IPC
**Cel:**  
Każdy handler IPC musi zwracać { ok, data, error }.

**Wzorzec:**
```js
ipcMain.handle("save-settings", async (_, payload) => {
  try {
    validateSettings(payload);
    const merged = mergeSettings(payload);
    saveSettingsToStore(merged);
    return { ok: true, data: merged };
  } catch (err) {
    logError("save-settings failed", err);
    return { ok: false, error: err.message || "UNKNOWN_ERROR" };
  }
});
```

---

## 1d. requestSingleInstanceLock()
**Plik:** main.js

**Cel:**  
Zapobieganie uruchomieniu wielu instancji aplikacji.

```js
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  process.exit(0);
}

app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});
```

---

## 1e. Global error handlers
**Plik:** main.js

**Cel:**  
Logowanie błędów, które normalnie znikają bez śladu.

```js
process.on("uncaughtException", (err) => logError("uncaughtException", err));
process.on("unhandledRejection", (reason) => logError("unhandledRejection", reason));
```

---

## 1f. Poprawne zapisywanie settings (merge, nie overwrite)
**Pliki:** settingsStore.js

**Cel:**  
Nigdy nie nadpisywać całego settings jednym polem.

```js
export function updateSettings(partial) {
  const current = loadSettings();
  const merged = { ...current, ...partial };
  saveSettings(merged);
  return merged;
}
```

---

## 1g. Zapis profili po dodaniu/edycji
**Pliki:** Sidebar.jsx, profilesStore.js

```js
function handleProfilesChange(nextProfiles) {
  setProfiles(nextProfiles);
  saveProfiles(nextProfiles);
}
```

---

## 1h. Autosave Notepad tylko przy zmianie
**Pliki:** Notepad.jsx, notepadStore.js

```js
useEffect(() => {
  const interval = setInterval(() => {
    if (content !== lastSaved) {
      saveNoteContent(activeNoteId, content);
      setLastSaved(content);
    }
  }, 5000);
  return () => clearInterval(interval);
}, [content, lastSaved, activeNoteId]);
```

---

## 1i. Logger + zapis do pliku + eksport logów
**Pliki:** logger.js, logService.js, Settings.jsx

**Logger:**
```js
export function logError(msg, meta) {
  console.error(msg, meta);
  appendLogToFile({ level: "error", msg, meta, ts: Date.now() });
}
```

---

## 1j. config.js
**Cel:**  
Stałe, limity, wartości domyślne, feature flags.

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

## 1k. WebView błędy bez alert()
**Pliki:** WebViewTab.jsx, WebViewErrorBar.jsx

```jsx
{error && (
  <WebViewErrorBar
    message={t("webview.error.network")}
    onReload={handleReload}
  />
)}
```

---

## 1l. Modale zamiast alert/prompt
**Pliki:** UI/Modal.jsx, wszystkie komponenty

**Modal musi mieć:**
- tytuł,
- opis,
- pola input,
- przyciski OK/Cancel,
- obsługę ESC,
- klik poza zamyka.

---

## 1m. Cleanup listenerów online/offline
**Plik:** App.jsx

```js
useEffect(() => {
  const onOnline = () => setOnline(true);
  const onOffline = () => setOnline(false);

  window.addEventListener("online", onOnline);
  window.addEventListener("offline", onOffline);

  return () => {
    window.removeEventListener("online", onOnline);
    window.removeEventListener("offline", onOffline);
  };
}, []);
```

---

## 1n. System powiadomień (toast + system notifications)
**Pliki:** ToastContainer.jsx, notificationsManager.js, Settings.jsx

**Toast API:**
```js
showToast("success", "Zapisano ustawienia");
```

---

## 1o. Pushbullet API
**Pliki:** apiService.js, Settings.jsx  
**Cel:** powiadomienia mobilne.

---

## 1p. Spellcheck + syntax highlight
**Pliki:** NotepadEditor.jsx  
**Cel:** CodeMirror/Monaco + tryby języków.

---

## 1q. Voice agent / AI agent
**Pliki:** VoiceAgent.jsx, aiAgentService.js  
**Status:** DO-ANALYSIS

---

## 1r. Automatyczne code review
**Pliki:** Tools/CodeReview.jsx  
**Status:** DO-ANALYSIS

# =============================================================================
# 2. SIDEBAR / PROFILE MANAGER / APP LIBRARY (2a–2g)
# =============================================================================

## 2a. App Library (lista gotowych aplikacji)
**Pliki:**
- src/data/app-library.json
- src/core/appLibraryStore.js
- src/components/Sidebar/Sidebar.jsx
- src/components/Sidebar/AppLibraryItem.jsx
- src/components/Sidebar/AppLibraryBrowser.jsx
- src/locales/pl.json, en.json
- src/data/icons.js

**Cel:**  
Umożliwić użytkownikowi dodawanie gotowych aplikacji jednym kliknięciem, bez wpisywania URL.  
App Library działa jak WebCatalog/Rambox: kategorie, wyszukiwarka, flagi (isPinned, isDefault, isFavorite), ikony, opisy.

**Struktura app-library.json (FINALNA):**
```json
{
  "categories": [
    {
      "id": "AI",
      "label": "AI",
      "apps": [
        {
          "id": "chatgpt",
          "name": "ChatGPT",
          "url": "https://chat.openai.com",
          "icon": "CHATGPT",
          "isPinned": false,
          "isDefault": false,
          "isFavorite": false
        },
        {
          "id": "claude",
          "name": "Claude",
          "url": "https://claude.ai",
          "icon": "CLAUDE",
          "isPinned": false,
          "isDefault": false,
          "isFavorite": false
        }
      ]
    }
  ]
}
```

**appLibraryStore.js:**
```js
export function loadAppLibrary() {
  return library.categories;
}

export function searchAppLibrary(query) {
  const q = query.toLowerCase();
  return library.categories.flatMap(cat =>
    cat.apps.filter(app =>
      app.name.toLowerCase().includes(q)
    )
  );
}
```

**Dodawanie profilu z App Library:**
```js
function handleAddFromLibrary(app) {
  const newProfile = {
    id: uuid(),
    name: app.name,
    url: app.url,
    category: currentCategory || "AI",
    label: app.name,
    notes: "",
    userAgent: "",
    adBlocker: undefined,
    isPinned: app.isPinned,
    isFavorite: app.isFavorite,
    isDefault: app.isDefault,
    partition: `profile-${uuid()}`
  };

  const updated = [...profiles, newProfile];
  setProfiles(updated);
  saveProfiles(updated);
  showToast("success", t("sidebar.profileAdded"));
}
```

**Instrukcja dla AI:**
- App Library jest statyczna — nie zapisujemy jej zmian.
- Każdy app musi mieć ikonę w icons.js.
- Dodaj tłumaczenia: sidebar.appLibrary, sidebar.openLibrary, sidebar.profileAdded.
- Jeśli profil o tym URL już istnieje → toast „Profil już istnieje”.

---

## 2b. Filtrowanie profili (search bar)
**Pliki:**
- Sidebar.jsx
- SidebarSearch.jsx
- profilesStore.js

**Cel:**  
Sidebar może mieć dziesiątki profili — potrzebna jest wyszukiwarka.

**SidebarSearch.jsx:**
```jsx
export default function SidebarSearch({ value, onChange }) {
  return (
    <input
      className="sidebar-search"
      placeholder={t("sidebar.searchPlaceholder")}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
```

**Filtrowanie profili:**
```js
const filteredProfiles = profiles.filter(p =>
  p.name.toLowerCase().includes(query.toLowerCase()) ||
  p.url.toLowerCase().includes(query.toLowerCase()) ||
  p.label.toLowerCase().includes(query.toLowerCase())
);
```

**Instrukcja dla AI:**
- Search działa w czasie rzeczywistym.
- Filtruje po name, url, label.
- Jeśli lista jest pusta → „Brak wyników”.

---

## 2c. Kategorie profili
**Pliki:**
- profilesStore.js
- Sidebar.jsx
- SidebarSection.jsx

**Cel:**  
Uporządkować profile w sekcje: AI, Dev, Design, Productivity, Special.

**Struktura profilu:**
```js
{
  id: "...",
  name: "...",
  url: "...",
  category: "AI" | "Dev" | "Design" | "Productivity" | "Special",
  ...
}
```

**Grupowanie profili:**
```js
const grouped = {
  AI: [],
  Dev: [],
  Design: [],
  Productivity: [],
  Special: []
};

profiles.forEach(p => grouped[p.category].push(p));
```

**Renderowanie sekcji:**
```jsx
{Object.entries(grouped).map(([cat, items]) => (
  <SidebarSection key={cat} title={t(`categories.${cat}`)}>
    {items.map(profile => (
      <SidebarProfileItem key={profile.id} profile={profile} />
    ))}
  </SidebarSection>
))}
```

**Instrukcja dla AI:**
- Dodaj tłumaczenia kategorii.
- Waliduj kategorię przy zapisie profilu.

---

## 2d. Ostatnio używane profile
**Pliki:**
- profilesStore.js
- Sidebar.jsx

**Cel:**  
Szybki dostęp do ostatnio otwieranych profili.

**Aktualizacja lastUsedAt:**
```js
updateProfile(id, { lastUsedAt: Date.now() });
```

**Sekcja „Last used”:**
```js
const lastUsed = [...profiles]
  .filter(p => p.lastUsedAt)
  .sort((a, b) => b.lastUsedAt - a.lastUsedAt)
  .slice(0, 10);
```

---

## 2e. Drag & drop profili
**Pliki:**
- Sidebar.jsx
- profilesStore.js

**Cel:**  
Użytkownik może zmieniać kolejność profili.

**Implementacja:**
```jsx
<li
  draggable
  onDragStart={() => setDragged(profile.id)}
  onDrop={() => reorderProfiles(profile.id)}
>
```

**Funkcja reorder:**
```js
function reorderProfiles(targetId) {
  const draggedIndex = profiles.findIndex(p => p.id === dragged);
  const targetIndex = profiles.findIndex(p => p.id === targetId);

  const newList = [...profiles];
  const [item] = newList.splice(draggedIndex, 1);
  newList.splice(targetIndex, 0, item);

  setProfiles(newList);
  saveProfiles(newList);
}
```

**Instrukcja dla AI:**
- Drag&drop musi działać między kategoriami.
- Po zmianie kolejności → saveProfiles().

---

## 2f. Edycja profilu (modal)
**Pliki:**
- SidebarProfileItem.jsx
- ProfileModal.jsx
- profilesStore.js

**Cel:**  
Pełna edycja profilu w modalach, zamiast promptów.

**Pola w ProfileModal:**
- name
- url
- category
- label
- notes (rich text)
- userAgent
- adBlocker (per profil)
- isPinned
- isFavorite
- isDefault

**Zapis profilu:**
```js
updateProfile(profile.id, patch);
saveProfiles();
showToast("success", t("profile.saved"));
```

**Instrukcja dla AI:**
- Usuń wszystkie prompt().
- Waliduj URL.
- AdBlocker per profil nadpisuje globalny.

---

## 2g. Multi‑account login (DO‑ANALYSIS)
**Pliki:**
- profilesStore.js
- WebViewTab.jsx

**Cel:**  
Możliwość logowania na wiele kont (np. Google) poprzez osobne partition.

**Założenia:**
- Każdy profil ma własny partition.
- Można kopiować cookies między partition.

**Status:**  
DO‑ANALYSIS — wymaga decyzji użytkownika.

---


# =============================================================================
# 3. WEBVIEWTAB / PRZEGLĄDARKA (3a–3d + nowe funkcje)
# =============================================================================

## 3a. Toolbar jak w przeglądarce
**Pliki:**
- src/components/WebViewTab/WebViewTab.jsx
- src/components/WebViewTab/WebViewToolbar.jsx
- src/data/icons.js
- src/locales/pl.json, en.json

**Cel:**  
WebViewTab ma działać jak mini‑przeglądarka. Toolbar musi zawierać wszystkie podstawowe funkcje: Back, Forward, Refresh, Address Bar, Copy URL, Open External, Zoom, DevTools, Clear Cache, Screenshot, Single App Mode, Resource Monitor.

**Struktura toolbaru:**
- Back
- Forward
- Refresh
- Address bar (readonly lub edytowalny)
- Copy URL
- Open in browser
- Zoom in/out
- DevTools
- Clear cache (z potwierdzeniem)
- Screenshot WebView
- Single App Mode
- Resource Monitor

**Implementacja callbacków w WebViewTab.jsx:**
```js
function handleBack() {
  const wv = webviewRef.current;
  if (wv && wv.canGoBack()) wv.goBack();
}

function handleForward() {
  const wv = webviewRef.current;
  if (wv && wv.canGoForward()) wv.goForward();
}

function handleRefresh() {
  webviewRef.current?.reload();
}

function handleCopyUrl() {
  const url = webviewRef.current?.getURL();
  if (url) {
    navigator.clipboard.writeText(url);
    showToast("success", t("webview.urlCopied"));
  }
}

function handleOpenExternal() {
  const url = webviewRef.current?.getURL();
  if (url) window.electronAPI.openExternal(url);
}

function handleZoomIn() {
  const wv = webviewRef.current;
  wv.setZoomFactor(wv.getZoomFactor() + 0.1);
}

function handleZoomOut() {
  const wv = webviewRef.current;
  wv.setZoomFactor(wv.getZoomFactor() - 0.1);
}

function handleDevTools() {
  webviewRef.current.openDevTools();
}

function handleClearCache() {
  openModal({
    title: t("webview.clearCacheTitle"),
    description: t("webview.clearCacheDesc"),
    onConfirm: async () => {
      await window.electronAPI.clearCache();
      showToast("info", t("webview.cacheCleared"));
    }
  });
}
```

**Instrukcja dla AI:**
- Toolbar jest „głupi” — tylko wywołuje callbacki.
- Logika WebView jest w WebViewTab.jsx.
- Clear Cache wymaga modala potwierdzającego.
- Address bar może być przełączany w Settings (readonly/edytowalny).

---

## 3b. Tile View (2–3 WebView obok siebie)
**Pliki:**
- src/components/WebViewTab/WebViewTileView.jsx
- src/components/WebViewTab/WebViewTab.jsx

**Cel:**  
Umożliwić pracę w trybie wielookienkowym (np. ChatGPT + dokumentacja + Notion).

**Implementacja:**
```jsx
export default function WebViewTileView({ profiles }) {
  return (
    <div className="tile-container">
      {profiles.map(p => (
        <WebViewTab key={p.id} profile={p} tileMode />
      ))}
    </div>
  );
}
```

**Instrukcja dla AI:**
- Tile mode nie ma pełnego toolbaru.
- Każdy WebViewTab w tile mode ma uproszczony interfejs.
- Grid: 2 lub 3 kolumny, zależnie od liczby profili.

---

## 3c. Custom User Agent per profil
**Pliki:**
- profilesStore.js
- ProfileModal.jsx
- WebViewTab.jsx

**Cel:**  
Niektóre strony wymagają UA (np. mobilne wersje, starsze strony).

**Implementacja w WebViewTab.jsx:**
```jsx
<webview
  ref={webviewRef}
  src={profile.url}
  useragent={profile.userAgent || undefined}
/>
```

**Instrukcja dla AI:**
- Jeśli userAgent jest pusty → użyj domyślnego.
- Waliduj, czy UA nie jest whitespace.

---

## 3d. AdBlocker globalny + per profil
**Pliki:**
- main.js
- settingsStore.js
- ProfileModal.jsx
- WebViewTab.jsx

**Cel:**  
Możliwość włączenia/wyłączenia AdBlockera globalnie oraz nadpisania ustawienia per profil.

**Logika:**
```
if (profile.adBlocker !== undefined)
    użyj profile.adBlocker
else
    użyj settings.adBlocker
```

**Implementacja w main.js:**
```js
session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
  const shouldBlock = getAdblockStateForUrl(details.url);
  if (shouldBlock) return callback({ cancel: true });
  callback({});
});
```

**Instrukcja dla AI:**
- Dodaj toggle w ProfileModal.
- Dodaj toggle globalny w Settings.
- Zmiana wymaga restartu WebView.

---

# 3e. Single App Mode (NOWY FEATURE)
**Pliki:**
- WebViewTab.jsx
- preload.js
- main.js
- locales
- icons.js

**Cel:**  
Otworzenie profilu w osobnym oknie Electron — idealne na drugi monitor.

**Implementacja:**

### WebViewTab.jsx:
```js
function handleOpenSingleWindow() {
  window.electronAPI.openSingleWindow({
    url: profile.url,
    width: 1200,
    height: 800,
    debug: settings.debugMode
  });
}
```

### preload.js:
```js
openSingleWindow: (payload) => ipcRenderer.invoke("open-single-window", payload)
```

### main.js:
```js
ipcMain.handle("open-single-window", async (_, payload) => {
  const win = new BrowserWindow({
    width: payload.width,
    height: payload.height,
    webPreferences: { preload: PRELOAD_PATH }
  });
  win.loadURL(payload.url);
  if (payload.debug) win.webContents.openDevTools();
});
```

**Instrukcja dla AI:**
- Okno nie zapisuje stanu — po zamknięciu wraca do normalnego widoku.
- Dodaj ikonę w toolbarze.

---

# 3f. Resource Monitor (NOWY FEATURE)
**Pliki:**
- resourceMonitor.js
- WebViewTab.jsx
- Settings.jsx

**Cel:**  
Pokazać zużycie RAM/CPU WebView w formie toastu.

**Implementacja:**
```js
async function handleResourceMonitor() {
  const info = await window.electronAPI.getWebViewResourceInfo();
  showToast("info", `RAM: ${info.memory} MB | CPU: ${info.cpu}%`);
}
```

**Instrukcja dla AI:**
- Dane pobierane z webContents.getProcessMemoryInfo().
- Thresholds w config.js.

---

# 3g. Screenshot WebView (NOWY FEATURE)
**Pliki:**
- WebViewTab.jsx
- main.js
- preload.js

**Cel:**  
Zrobić screenshot aktywnego WebView i skopiować do schowka.

**Implementacja:**

### WebViewTab.jsx:
```js
async function handleScreenshot() {
  const img = await window.electronAPI.captureWebView(profile.id);
  await navigator.clipboard.write([
    new ClipboardItem({ "image/png": img })
  ]);
  showToast("success", t("webview.screenshotCopied"));
}
```

### main.js:
```js
ipcMain.handle("capture-webview", async (_, tabId) => {
  const contents = getWebContentsByTabId(tabId);
  const image = await contents.capturePage();
  return image.toPNG();
});
```

**Instrukcja dla AI:**
- Dodaj ikonę screenshot w toolbarze.
- Dodaj tłumaczenia.

---

# 3h. Sleep Tabs (rozszerzenie)
**Pliki:**
- WebViewTab.jsx
- sleepTabsManager.js
- settingsStore.js
- config.js

**Cel:**  
Usypianie nieaktywnych WebView po X minutach.

**Implementacja:**
```js
useEffect(() => {
  const interval = setInterval(() => {
    const idle = Date.now() - lastActiveAt;
    if (idle > settings.sleepTabsTimeout && !sleeping) {
      setSleeping(true);
      webviewRef.current?.loadURL("about:blank");
    }
  }, 60000);

  return () => clearInterval(interval);
}, [lastActiveAt, sleeping, settings.sleepTabsTimeout]);
```

**Instrukcja dla AI:**
- Sleep Tabs musi mieć ustawienia globalne i per profil.
- Wake up przy aktywacji zakładki.

---

# 3i. Podsumowanie modułu WebViewTab
Moduł WebViewTab jest jednym z najważniejszych elementów aplikacji. Odpowiada za:
- renderowanie WebView,
- pełny toolbar przeglądarkowy,
- tryb Single App Mode,
- tryb Tile View,
- Sleep Tabs,
- Resource Monitor,
- Screenshot WebView,
- AdBlocker globalny + per profil,
- obsługę błędów (WebViewErrorBar),
- cleanup event listenerów,
- integrację z settings i config.js.

To jest kompletny zestaw funkcji, które musi zaimplementować AI.


# =============================================================================
# 4. NOTEPAD (4a–4c) + TASKPANEL (5a–5c) + AGGREGATEDTASKS
# =============================================================================

# 4. NOTEPAD (4a–4c)

## 4a. Multi‑tab Notepad
**Pliki:**
- src/components/Notepad/Notepad.jsx
- src/components/Notepad/NotepadTabs.jsx
- src/components/Notepad/NotepadEditor.jsx
- src/core/notepadStore.js

**Cel:**  
Notepad działa jak edytor z zakładkami (VSCode style). Każda notatka to osobna karta.

**Struktura notatki:**
```js
{
  id: string,
  title: string,
  content: string,
  createdAt: string,
  updatedAt: string
}
```

**Funkcje w notepadStore:**
```js
loadNotes()
saveNotes(notes)
createNote()
updateNote(id, patch)
deleteNote(id)
setActiveNote(id)
```

**UI:**
- Pasek zakładek u góry.
- Ikona „+” dodaje nową notatkę.
- Ikona „x” zamyka notatkę.
- Double‑click na tytuł → rename.

---

## 4b. Autosave tylko przy zmianie
**Cel:**  
Oszczędność I/O i płynność działania.

**Implementacja:**
```js
useEffect(() => {
  const interval = setInterval(() => {
    if (content !== lastSavedContent) {
      saveNoteContent(activeNoteId, content);
      setLastSavedContent(content);
    }
  }, 5000);

  return () => clearInterval(interval);
}, [content, lastSavedContent, activeNoteId]);
```

---

## 4c. Tryby edycji: plain text, syntax highlight, rich text
**Cel:**  
Notepad ma działać jako:
- zwykły notatnik,
- edytor kodu (JS, HTML, CSS, Python, XML),
- edytor rich text.

**Implementacja (CodeMirror/Monaco):**
```jsx
<CodeMirror
  value={note.content}
  height="100%"
  theme="dark"
  extensions={[javascript(), html(), css(), python(), xml()]}
  onChange={(value) => onChange(value)}
/>
```

**Rich text:**
- bold, italic, underline,
- listy,
- linki,
- nagłówki.

---

# 5. TASKPANEL (5a–5c)

## 5a. TaskModal — dodawanie/edycja zadania (zamiast promptów)
**Pliki:**
- src/components/TaskPanel/TaskPanel.jsx
- src/components/TaskPanel/TaskModal.jsx
- src/core/tasksStore.js
- locales

**Struktura zadania:**
```js
{
  id: string,
  title: string,
  description: string, // rich text
  priority: "A" | "B" | "C" | "D" | "E",
  dueDate: string | null,
  projectId: string | null,
  done: boolean,
  createdAt: string
}
```

**TaskModal pola:**
- Tytuł
- Opis (rich text)
- Priorytet (A–E)
- Termin (date/time)
- Projekt (select)
- Status (Backlog / Active / Done)

**Zapis zadania:**
```js
function handleSaveTask(task) {
  if (task.id) updateTask(task.id, task);
  else createTask(task);
  saveTasks();
  setTaskModalOpen(false);
}
```

---

## 5b. Filtrowanie zadań po priorytecie
**Cel:**  
Priorytety A–E muszą być filtrowalne.

**Implementacja:**
```js
const filtered = tasks.filter(t =>
  filters.priority ? t.priority === filters.priority : true
);
```

---

## 5c. Wyszukiwarka zadań
**Cel:**  
Search bar filtruje po tytule i opisie.

**Implementacja:**
```js
const filtered = tasks.filter(t =>
  t.title.toLowerCase().includes(query.toLowerCase()) ||
  t.description.toLowerCase().includes(query.toLowerCase())
);
```

---

# 6. AGGREGATEDTASKS

## 6a. Widok zbiorczy zadań per projekt
**Pliki:**
- src/components/AggregatedTasks/AggregatedTasks.jsx
- src/core/projectsStore.js
- src/core/tasksStore.js
- locales

**Cel:**  
Wyświetlanie zadań pogrupowanych według projektów.

**UI:**
- Nagłówek projektu
- Liczba zadań
- Przycisk „Zwiń/Rozwiń”
- Przycisk „Ukryj projekt”
- Lista zadań

---

## 6b. Ustawienia widoczności i zwinięcia
**Struktura settings:**
```js
settings.aggregatedTasks = {
  collapsedProjects: string[],
  hiddenProjects: string[]
};
```

**Funkcje:**
```js
toggleCollapse(projectId)
toggleVisibility(projectId)
saveAggregatedSettings(partial)
```

---

## 6c. Integracja z TaskPanel i ProjectManager
**Cel:**  
Zadania muszą być spójne w obu widokach.

**Zasady:**
- Zmiana statusu zadania w TaskPanel aktualizuje AggregatedTasks.
- Archiwizacja projektu ukrywa go w AggregatedTasks.
- Usunięcie projektu usuwa jego zadania.

---


#UWAGA#
ZEPSUTA NUMERACJA PONIZEJ, PRZY REFAKTORZE POPRAWIĆ - OD TERAZ POWINNO BYĆ 7a, a nie ponownie 6a - błąd numeracji raptem! WAŻNE!!


# =============================================================================
# 5. TERMINAL (6a–6c)
# =============================================================================

## 6a. Terminal — node-pty + xterm
**Pliki:**
- src/components/Terminal/Terminal.jsx
- preload.js
- main.js
- src/tests/TestRunner_Terminal.js

**Cel:**  
Pełny terminal systemowy działający w Electronie, z obsługą:
- node-pty (backend),
- xterm.js (frontend),
- kolorowania ANSI,
- historii komend,
- restartu sesji,
- czyszczenia ekranu,
- cleanup event listenerów.

**Inicjalizacja terminala:**
```js
useEffect(() => {
  const term = new Terminal({
    convertEol: true,
    theme: { background: "#000000" }
  });

  const fitAddon = new FitAddon();
  term.loadAddon(fitAddon);

  term.open(containerRef.current);
  fitAddon.fit();

  window.electronAPI.startPty();
}, []);
```

---

## 6b. Historia komend
**Cel:**  
Strzałka w górę/dół przewija historię komend.

**Implementacja:**
```js
const [history, setHistory] = useState([]);
const [historyIndex, setHistoryIndex] = useState(-1);

term.onKey(({ key, domEvent }) => {
  if (domEvent.key === "ArrowUp") {
    const next = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
    setHistoryIndex(next);
    replaceCurrentLine(history[next] || "");
  }
  if (domEvent.key === "ArrowDown") {
    const next = historyIndex === -1 ? -1 : Math.min(history.length - 1, historyIndex + 1);
    setHistoryIndex(next);
    replaceCurrentLine(next === -1 ? "" : history[next]);
  }
});
```

---

## 6c. Cleanup listenerów IPC
**Cel:**  
Terminal nie może zostawiać listenerów po zamknięciu.

**Implementacja:**
```js
useEffect(() => {
  const disposeData = window.electronAPI.onTerminalData((data) => term.write(data));
  const disposeExit = window.electronAPI.onTerminalExit(() => term.write("\r\n[Process exited]\r\n"));

  return () => {
    disposeData();
    disposeExit();
    ptyProcess.kill();
    term.dispose();
  };
}, []);
```

---

# =============================================================================
# 6. SETTINGS (7a–7e)
# =============================================================================

## 7a. Hotkeys Manager
**Pliki:**
- SettingsHotkeys.jsx
- hotkeysStore.js
- main.js (globalShortcut)
- preload.js

**Cel:**  
Użytkownik może tworzyć własne skróty klawiszowe, które:
- wklejają tekst,
- wykonują akcje,
- działają globalnie.

**Struktura hotkey:**
```js
{
  id: "hk-1",
  shortcut: "Ctrl+Alt+1",
  name: "Podpis mailowy",
  text: "Pozdrawiam,\nMaciek",
  enabled: true
}
```

**Rejestracja skrótów w main.js:**
```js
function registerHotkeys() {
  const hotkeys = loadHotkeys();
  hotkeys.forEach(hk => {
    if (!hk.enabled) return;
    globalShortcut.register(hk.shortcut, () => {
      mainWindow.webContents.send("hotkey:trigger", hk.id);
    });
  });
}
```

---

## 7b. Dark Mode
**Cel:**  
Pełne wsparcie dla trybu ciemnego.

**Implementacja:**
```js
useEffect(() => {
  const root = document.documentElement;
  if (settings.theme === "dark") root.classList.add("dark");
  else if (settings.theme === "light") root.classList.remove("dark");
  else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
  }
}, [settings.theme]);
```

---

## 7c. Eksport/Import ustawień
**Cel:**  
Backup ustawień, profili, notatek, tasków, projektów.

**Struktura eksportu:**
```json
{
  "version": "1.1.0",
  "exportedAt": 1710000000000,
  "settings": { ... },
  "profiles": [ ... ],
  "tasks": [ ... ],
  "notes": [ ... ],
  "projects": [ ... ]
}
```

**Import:**
- walidacja struktury,
- modal potwierdzający,
- merge danych.

---

## 7d. Logi dostępne z Settings
**Cel:**  
Przycisk „Otwórz folder logów”.

**Implementacja:**
```js
ipcMain.handle("logs:openFolder", () => {
  shell.openPath(getLogsDir());
  return { ok: true };
});
```

---

## 7e. Konto użytkownika + synchronizacja
**Status:** DO‑ANALYSIS  
**Cel:**  
Synchronizacja ustawień i profili między urządzeniami.

---

# =============================================================================
# 7. TOOLS (8a–8h)
# =============================================================================

## 8a. JSON/YAML/XML Formatter
**Pliki:** Tools/JsonYamlXmlFormatter.jsx  
**Funkcje:** formatowanie, walidacja, minify/pretty.

---

## 8b. Regex Tester
**Pliki:** Tools/RegexTester.jsx  
**Funkcje:** pattern, flags, test string, lista dopasowań.

---

## 8c. Markdown Previewer
**Pliki:** Tools/MarkdownPreviewer.jsx  
**Funkcje:** split view, live preview, drag&drop .md.

---

## 8d. Image Tools
**Pliki:** Tools/ImageTools.jsx  
**Funkcje:** compress, resize, convert, preview.

---

## 8e. SVG → PNG Converter
**Pliki:** Tools/SvgToPng.jsx  
**Funkcje:** render SVG → canvas → PNG.

---

## 8f. File Previewer
**Pliki:** Tools/FilePreviewer.jsx  
**Funkcje:** RAW/PREVIEW, highlight, obsługa wielu formatów.

---

## 8g. Mini Postman
**Pliki:** Tools/ApiTester.jsx  
**Funkcje:** metoda, URL, nagłówki, body, response.

---

## 8h. Clipboard History
**Pliki:** Tools/ClipboardHistory.jsx  
**Funkcje:** historia schowka, pinowanie, kopiowanie.

---

## 8i. Cookie Grabber (NOWY FEATURE)
**Pliki:** Tools/CookieGrabber.jsx  
**Cel:**  
Pobieranie cookies z aktywnego WebView.

**Implementacja:**
```js
const cookies = await window.electronAPI.getCookies(profile.partition);
```

---

# =============================================================================
# 8. APP LIBRARY — PEŁNE UZUPEŁNIENIE (9)
# =============================================================================

**Cel:**  
Pełny widok App Library jako osobny moduł (nie tylko w Sidebarze).

**Pliki:**
- AppLibraryBrowser.jsx
- app-library.json
- appLibraryStore.js

**Funkcje:**
- wyszukiwarka,
- sortowanie,
- filtrowanie po kategorii,
- podgląd aplikacji,
- dodawanie profilu jednym kliknięciem.

---

# =============================================================================
# 9. UI/UX (10a–10f)
# =============================================================================

## 10a. Sidebar redesign
- search bar,
- kategorie,
- last used,
- tools,
- settings,
- help.

---

## 10b. WebView toolbar
- pełny zestaw przycisków,
- skróty klawiszowe (Ctrl+L, Ctrl+R, Alt+←/→).

---

## 10c. Toasty
- success, error, info, warning,
- auto-hide,
- ręczne zamykanie.

---

## 10d. Tooltipy
- na ikonach,
- na kafelkach,
- na polach formularzy,
- na przyciskach.

---

## 10e. Modale
- globalny komponent,
- ESC zamyka,
- klik poza zamyka,
- walidacja pól.

---

## 10f. Loading states
- spinner,
- skeleton,
- disable przycisków podczas operacji.

---

# =============================================================================
# 10. ROADMAPA (11)
# =============================================================================

## Etap 1 — Stabilizacja
- IPC walidacja,
- cleanup eventów,
- poprawa zapisu settings/profiles,
- logger,
- single instance lock.

## Etap 2 — App Library + Workspaces
- app-library.json,
- workspacesStore,
- przełączanie workspace’ów.

## Etap 3 — Power features
- unified search (Ctrl+K),
- quick switcher (Ctrl+P),
- tile view,
- dark mode,
- ulepszenia TaskPanel/AggregatedTasks.


# =============================================================================
# 12. INSTRUKCJA DLA AI — JAK KORZYSTAĆ Z TEGO DOKUMENTU
# =============================================================================

1. Zaimportuj **structure.txt** i **DevelopersGuide.md** jako *pełną specyfikację projektu MultiWeb Manager*.

2. Traktuj **wszystkie sekcje** jako *wymagania implementacyjne*.

3. Dla każdego modułu (Sidebar, TaskPanel, Notepad, ProjectManager, AggregatedTasks, WebViewTab, Terminal, HistoryLog, Settings, Help, Tools, App Library, Workspaces, engine, core, utils, hooks):
   - utwórz pliki zgodnie ze structure.txt,
   - zaimplementuj funkcje i logikę zgodnie z opisem w tym dokumencie,
   - stosuj zasady globalne (nagłówki, icons, locales, IPC, settings merge, modale, toasty, cleanup eventów).

4. Dla każdego feature’a z roadmapy (1.1, 1.2, 1.3):
   - zaimplementuj go w odpowiednich plikach,
   - zachowaj zgodność z opisem.

5. Upewnij się, że:
   - nie ma alert() / prompt(),
   - wszystkie eventy mają cleanup,
   - IPC ma walidację + try/catch + { ok, data, error },
   - settings są mergowane,
   - wszystkie teksty idą przez useTranslation,
   - wszystkie ikony pochodzą z icons.js.

6. Ten dokument jest **kompletną specyfikacją** — na jego podstawie da się odtworzyć cały projekt 1:1, bez zgadywania.

# =============================================================================
# KONIEC SEKCJI 4
# =============================================================================
