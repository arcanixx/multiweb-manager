<!-- =============================================================================
 FILE: DevelopersGuide.md
 PATH: doc/DevelopersGuide.md
 VERSION: 0.0.3
 PURPOSE: Dokumentacja specyfikacji projektowej - Kompletny przewodnik developerski MultiWeb Manager
 FUNCTIONS: Dokumentacja: 17 sekcji głównych
 DEPENDS ON: -
 UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
 ============================================================================= -->

# 📖 KOMPLETNY PRZEWODNIK DEVELOPERSKI — MULTIWEB MANAGER
---
# 1. ARCHITEKTURA I STABILNOŚĆ (1a–1r)
## 1a. Cleanup event listenerów (`WebViewTab`, `Terminal`, `App`)
**Pliki:**
- `src/ui/webview/WebViewTab.jsx`
- `src/ui/terminal/Terminal.jsx`
- `src/App.jsx`
- `preload.cjs`
**Cel:** Zapobieganie memory leakom, duplikacji eventów, rosnącemu zużyciu RAM i crashom po dłuższym używaniu.
**Zasada:** Każdy `addEventListener` / `on(...)` musi mieć cleanup w `return()`.
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

**`preload.cjs` cleanup:**
```js
onTerminalData: (handler) => {
  const listener = (_, payload) => handler(payload);
  ipcRenderer.on("terminal:data", listener);
  return () => ipcRenderer.removeListener("terminal:data", listener);
}
```

---

## 1b. Walidacja danych w IPC

**Pliki:** `main.js`, `src/ipc/ipcMainHandlers_*.js`

**Cel:** Zapobieganie korupcji danych w Electron Store.

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

## 1c. `try/catch` w IPC

**Cel:** Każdy handler IPC musi zwracać `{ ok, data, error }`.

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

## 1d. `requestSingleInstanceLock()`

**Plik:** `main.js`

**Cel:** Zapobieganie uruchomieniu wielu instancji aplikacji.

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

**Plik:** `main.js`

**Cel:** Logowanie błędów, które normalnie znikają bez śladu.

```js
process.on("uncaughtException", (err) => logError("uncaughtException", err));
process.on("unhandledRejection", (reason) => logError("unhandledRejection", reason));
```

---

## 1f. Poprawne zapisywanie settings (merge, nie overwrite)

**Plik:** `src/core/settingsStore.js`

**Cel:** Nigdy nie nadpisywać całego settings jednym polem.

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

**Pliki:** `src/ui/sidebar/Sidebar.jsx`, `src/core/profilesStore.js`

```js
function handleProfilesChange(nextProfiles) {
  setProfiles(nextProfiles);
  saveProfiles(nextProfiles);
}
```

---

## 1h. Autosave Notepad tylko przy zmianie

**Pliki:** `src/ui/notepad/Notepad.jsx`, `src/core/notesStore.js`

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

**Pliki:** `src/utils/logger.js`, `src/utils/logWriter.js`, `src/ui/settings/DataLogsSection.jsx`

**Logger:**
```js
export function logError(msg, meta) {
  console.error(msg, meta);
  appendLogToFile({ level: "error", msg, meta, ts: Date.now() });
}
```

**LogWriter** (`src/utils/logWriter.js`) zapisuje do pliku `test-fails.log` (w `userData/logs/`) tylko testy zakończone niepowodzeniem. Działa wyłącznie gdy:
- `settings.debugMode === true`
- użytkownik wyraził zgodę na zapis logów (pytanie przy pierwszym uruchomieniu lub przełącznik w Settings)

Plik logów jest ograniczony do 500 linii (nadpisywane od najstarszych). Można go podejrzeć i wyczyścić w Settings → Data & Logs (widoczne tylko gdy `debugMode = true`).

**Handlery IPC:**

| Handler | Opis |
|---------|------|
| `append-log-file` | Dopisuje linię do pliku |
| `get-logs-file` | Odczytuje zawartość pliku |
| `clear-logs-file` | Usuwa plik |

**Konfiguracja w `config.js`:**
- `logsEnabled` — czy logowanie jest włączone (domyślnie `false`)
- `logsMaxLines` — maksymalna liczba linii (domyślnie `500`)

> `LogWriter` jest inicjalizowany w `TestRunner.js` przed uruchomieniem testów.

---

## 1j. `config.js`

**Pliki:** `src/config.js`, `config.js` (root)

**Cel:** Stałe, limity, wartości domyślne, feature flags.

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

**Podział `config.js`:**

| Sekcja | Opis |
|--------|------|
| `APP_ENV` | Środowisko (`development` / `production`) |
| `DEBUG_DEFAULT` | Domyślny tryb debug (`true`) |
| `LANGUAGES` | Lista dostępnych języków (`pl`, `en`) |
| `DEFAULT_LANGUAGE` | Domyślny język (`pl`) |
| `UI_ZOOM` | Konfiguracja zoomu UI (min, max, step, default) |
| `CLIPBOARD_HISTORY_MAX` | Maks. wpisów w historii schowka |
| `SLEEP_TABS_TIMEOUT_DEFAULT` | Domyślny timeout usypiania (15 min) |
| `MAX_LAST_USED_PROFILES` | Maks. profili w „ostatnio używane" |
| `RESOURCE_WARN_AT` | Próg ostrzeżenia RAM/CPU (%) |
| `RESOURCE_CRITICAL_AT` | Próg krytyczny RAM/CPU (%) |
| `DEFAULT_PROFILE_CATEGORY` | Domyślna kategoria profilu (`AI`) |
| `FEATURES` | Feature flags (włącz/wyłącz moduły) |
| `PATHS` | Ścieżki do katalogów |
| `LIMITS` | Limity (max zadań, notatek, projektów, WebView) |
| `DEFAULT_SETTINGS` | Domyślne ustawienia użytkownika |
| `API_ENDPOINTS` | Zewnętrzne API (np. remove.bg) |

---

## 1k. WebView błędy bez `alert()`

**Pliki:** `src/ui/webview/WebViewTab.jsx`, `src/ui/webview/WebViewErrorBar.jsx`

```jsx
{error && (
  <WebViewErrorBar
    message={t("webview.error.network")}
    onReload={handleReload}
  />
)}
```

---

## 1l. Modale zamiast `alert` / `prompt`

**Pliki:** `src/ui/modals/Modal.jsx`, `src/ui/modals/ConfirmModal.jsx`

Modal musi mieć: tytuł, opis, pola input, przyciski OK/Cancel, obsługę ESC, klik poza zamyka.

---

## 1m. Cleanup listenerów `online` / `offline`

**Plik:** `src/App.jsx`

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

**Pliki:** `src/ui/system/ToastContainer.jsx`, `src/utils/notificationsManager.js`, `src/ui/settings/NotificationsSection.jsx`

**Toast API:**
```js
showToast("success", "Zapisano ustawienia");
```

---

## 1o. Pushbullet API

**Pliki:** `src/utils/apiService.js`, `src/ui/settings/NotificationsSection.jsx`

**Cel:** Powiadomienia mobilne. **Status: DO-ANALYSIS**

---

## 1p. Spellcheck + syntax highlight

**Plik:** `src/ui/notepad/NotepadEditor.jsx`

**Cel:** CodeMirror / Monaco + tryby języków. **Status: BACKLOG**

---

## 1q. Voice agent / AI agent

**Pliki:** `src/ui/system/VoiceAgent.jsx`, `src/services/aiAgentService.js`

**Status: DO-ANALYSIS**

---

## 1r. Automatyczne code review

**Plik:** `src/ui/tools/CodeReview.jsx`

**Status: DO-ANALYSIS**

---

## 1s. Graf aplikacji

https://codesplain.ai/share/4a8586db4e01e423a595ddbdef94a8a5
Również jako screenshot w assets/multiweb_manager_architecture_graph.png

---

# 2. SIDEBAR / PROFILE MANAGER / APP LIBRARY (2a–2g)

## 2a. App Library (lista gotowych aplikacji)

**Pliki:**
- `src/data/app-library.json`
- `src/core/appLibraryStore.js`
- `src/ui/sidebar/Sidebar.jsx`
- `src/ui/appLibrary/AppLibraryBrowser.jsx`
- `src/locales/pl.json`, `en.json`
- `src/utils/icons.js`

**Cel:** Umożliwić użytkownikowi dodawanie gotowych aplikacji jednym kliknięciem, bez wpisywania URL. App Library działa jak WebCatalog/Rambox: kategorie, wyszukiwarka, flagi (`isPinned`, `isDefault`, `isFavorite`), ikony, opisy.

**Struktura `app-library.json` (FINALNA):**
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

**`appLibraryStore.js`:**
```js
export function loadAppLibrary() {
  return library.categories;
}

export function searchAppLibrary(query) {
  const q = query.toLowerCase();
  return library.categories.flatMap(cat =>
    cat.apps.filter(app => app.name.toLowerCase().includes(q))
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
- Każdy app musi mieć ikonę w `icons.js`.
- Dodaj tłumaczenia: `sidebar.appLibrary`, `sidebar.openLibrary`, `sidebar.profileAdded`.
- Jeśli profil o tym URL już istnieje → toast „Profil już istnieje".

---

## 2b. Filtrowanie profili (search bar)

**Pliki:**
- `src/ui/sidebar/Sidebar.jsx`
- `src/ui/sidebar/SidebarSearch.jsx`
- `src/core/profilesStore.js`

**Cel:** Sidebar może mieć dziesiątki profili — potrzebna jest wyszukiwarka.

**`SidebarSearch.jsx`:**
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

> Search działa w czasie rzeczywistym, filtruje po `name`, `url`, `label`. Jeśli lista jest pusta → „Brak wyników".

---

## 2c. Kategorie profili

**Pliki:**
- `src/core/profilesStore.js`
- `src/ui/sidebar/Sidebar.jsx`
- `src/ui/sidebar/SidebarSection.jsx`

**Cel:** Uporządkować profile w sekcje: `AI`, `Dev`, `Design`, `Productivity`, `Special`.

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
const grouped = { AI: [], Dev: [], Design: [], Productivity: [], Special: [] };
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

> Dodaj tłumaczenia kategorii. Waliduj kategorię przy zapisie profilu.

---

## 2d. Ostatnio używane profile

**Pliki:** `src/core/profilesStore.js`, `src/ui/sidebar/Sidebar.jsx`

**Cel:** Szybki dostęp do ostatnio otwieranych profili.

**Aktualizacja `lastUsedAt`:**
```js
updateProfile(id, { lastUsedAt: Date.now() });
```

**Sekcja „Last used":**
```js
const lastUsed = [...profiles]
  .filter(p => p.lastUsedAt)
  .sort((a, b) => b.lastUsedAt - a.lastUsedAt)
  .slice(0, 10);
```

---

## 2e. Drag & drop profili

**Pliki:** `src/ui/sidebar/Sidebar.jsx`, `src/core/profilesStore.js`

**Cel:** Użytkownik może zmieniać kolejność profili.

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

> Drag & drop musi działać między kategoriami. Po zmianie kolejności → `saveProfiles()`.

---

## 2f. Edycja profilu (modal)

**Pliki:**
- `src/ui/sidebar/SidebarProfileItem.jsx`
- `src/ui/sidebar/ProfileModal.jsx`
- `src/core/profilesStore.js`

**Cel:** Pełna edycja profilu w modalach, zamiast promptów.

**Pola w `ProfileModal`:** `name`, `url`, `category`, `label`, `notes` (rich text), `userAgent`, `adBlocker` (per profil), `isPinned`, `isFavorite`, `isDefault`

**Zapis profilu:**
```js
updateProfile(profile.id, patch);
saveProfiles();
showToast("success", t("profile.saved"));
```

> Usuń wszystkie `prompt()`. Waliduj URL. AdBlocker per profil nadpisuje globalny.

---

## 2g. Multi-account login

**Pliki:** `src/core/profilesStore.js`, `src/ui/webview/WebViewTab.jsx`

**Cel:** Możliwość logowania na wiele kont (np. Google) poprzez osobne `partition`.

**Założenia:** Każdy profil ma własny `partition`. Można kopiować cookies między `partition`.

**Status: DO-ANALYSIS** — wymaga decyzji użytkownika.

---

# 3. WEBVIEWTAB / PRZEGLĄDARKA (3a–3h)

## 3a. Toolbar jak w przeglądarce

**Pliki:**
- `src/ui/webview/WebViewTab.jsx`
- `src/ui/webview/WebViewToolbar.jsx`
- `src/utils/icons.js`
- `src/locales/pl.json`, `en.json`

**Cel:** WebViewTab ma działać jak mini-przeglądarka. Toolbar zawiera: Back, Forward, Refresh, Address Bar, Copy URL, Open External, Zoom, DevTools, Clear Cache, Screenshot, Single App Mode, Resource Monitor.

**Implementacja callbacków w `WebViewTab.jsx`:**
```js
function handleBack() {
  const wv = webviewRef.current;
  if (wv && wv.canGoBack()) wv.goBack();
}
function handleForward() {
  const wv = webviewRef.current;
  if (wv && wv.canGoForward()) wv.goForward();
}
function handleRefresh()      { webviewRef.current?.reload(); }
function handleCopyUrl() {
  const url = webviewRef.current?.getURL();
  if (url) { navigator.clipboard.writeText(url); showToast("success", t("webview.urlCopied")); }
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
function handleDevTools() { webviewRef.current.openDevTools(); }
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

> Toolbar jest „głupi" — tylko wywołuje callbacki. Logika WebView jest w `WebViewTab.jsx`. Clear Cache wymaga modala potwierdzającego. Address bar może być przełączany w Settings (readonly / edytowalny).

---

## 3b. Tile View (2–3 WebView obok siebie)

**Pliki:** `src/ui/webview/WebViewTileView.jsx`, `src/ui/webview/WebViewTab.jsx`

**Cel:** Umożliwić pracę w trybie wielookienkowym (np. ChatGPT + dokumentacja + Notion).

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

> Tile mode nie ma pełnego toolbaru — każdy `WebViewTab` w tile mode ma uproszczony interfejs. Grid: 2 lub 3 kolumny, zależnie od liczby profili.

**Status: BACKLOG**

---

## 3c. Custom User Agent per profil

**Pliki:** `src/core/profilesStore.js`, `src/ui/sidebar/ProfileModal.jsx`, `src/ui/webview/WebViewTab.jsx`

**Cel:** Niektóre strony wymagają UA (np. mobilne wersje, starsze strony).

```jsx
<webview
  ref={webviewRef}
  src={profile.url}
  useragent={profile.userAgent || undefined}
/>
```

> Jeśli `userAgent` jest pusty → użyj domyślnego. Waliduj, czy UA nie jest whitespace.

---

## 3d. AdBlocker globalny + per profil

**Pliki:** `main.js`, `src/core/settingsStore.js`, `src/ui/sidebar/ProfileModal.jsx`, `src/ui/webview/WebViewTab.jsx`

**Cel:** Możliwość włączenia/wyłączenia AdBlockera globalnie oraz nadpisania ustawienia per profil.

**Logika:**
```
if (profile.adBlocker !== undefined)
    użyj profile.adBlocker
else
    użyj settings.adBlocker
```

**Implementacja w `main.js`:**
```js
session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
  const shouldBlock = getAdblockStateForUrl(details.url);
  if (shouldBlock) return callback({ cancel: true });
  callback({});
});
```

> Dodaj toggle w `ProfileModal`. Dodaj toggle globalny w Settings. Zmiana wymaga restartu WebView.

---

## 3e. Single App Mode

**Pliki:**
- `src/ui/webview/WebViewTab.jsx`
- `preload.cjs`
- `main.js`
- `src/locales/pl.json`, `en.json`
- `src/utils/icons.js`

**Cel:** Otworzenie profilu w osobnym oknie Electron — idealne na drugi monitor.

**`WebViewTab.jsx`:**
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

**`preload.cjs`:**
```js
openSingleWindow: (payload) => ipcRenderer.invoke("open-single-window", payload)
```

**`main.js`:**
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

> Okno nie zapisuje stanu — po zamknięciu wraca do normalnego widoku. Dodaj ikonę w toolbarze.

---

## 3f. Resource Monitor

**Pliki:** `src/core/resourceMonitor.js`, `src/ui/webview/WebViewTab.jsx`, `src/ui/settings/Settings.jsx`

**Cel:** Pokazać zużycie RAM/CPU WebView w formie toastu.

**Implementacja (core — istnieje):**
```js
export function getSystemUsage() {
  const cpus = os.cpus();
  const cpuLoad = cpus.reduce((acc, cpu) => {
    const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
    return acc + (1 - cpu.times.idle / total);
  }, 0) / cpus.length;
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const ramPercent = ((totalMem - freeMem) / totalMem) * 100;
  return {
    cpuPercent: Math.round(cpuLoad * 100),
    ramPercent: Math.round(ramPercent),
    warnAt: DEFAULT_SETTINGS.resourceMonitor.warnAt,
    criticalAt: DEFAULT_SETTINGS.resourceMonitor.criticalAt
  };
}
```

**UI (brakuje — BACKLOG):**
```js
async function handleResourceMonitor() {
  const info = await window.electronAPI.getWebViewResourceInfo();
  showToast("info", `RAM: ${info.memory} MB | CPU: ${info.cpu}%`);
}
```

**Status:** Core istnieje, UI brakuje → **BACKLOG**

---

## 3g. Screenshot WebView

**Pliki:**
- `src/ui/webview/WebViewTab.jsx`
- `main.js`
- `preload.cjs`
- `src/locales/pl.json`, `en.json`
- `src/utils/icons.js`

**Cel:** Zrobić screenshot aktywnego WebView i skopiować do schowka.

**`WebViewTab.jsx`:**
```js
async function handleScreenshot() {
  const img = await window.electronAPI.captureWebView(profile.id);
  await navigator.clipboard.write([
    new ClipboardItem({ "image/png": img })
  ]);
  showToast("success", t("webview.screenshotCopied"));
}
```

**`main.js`:**
```js
ipcMain.handle("capture-webview", async (_, tabId) => {
  const contents = getWebContentsByTabId(tabId);
  const image = await contents.capturePage();
  return image.toPNG();
});
```

> Dodaj ikonę screenshot w toolbarze. Dodaj tłumaczenia.

---

## 3h. Sleep Tabs

**Pliki:** `src/ui/webview/WebViewTab.jsx`, `src/engine/sleepTabsManager.js`, `src/core/settingsStore.js`, `src/config.js`

**Cel:** Usypianie nieaktywnych WebView po X minutach.

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

> Sleep Tabs musi mieć ustawienia globalne i per profil. Wake up przy aktywacji zakładki.

---

# 4. NOTEPAD (4a–4c)

## 4a. Multi-tab Notepad

**Pliki:**
- `src/ui/notepad/Notepad.jsx`
- `src/ui/notepad/NotepadTabs.jsx`
- `src/ui/notepad/NotepadEditor.jsx`
- `src/core/notesStore.js`

**Cel:** Notepad działa jak edytor z zakładkami (VSCode style). Każda notatka to osobna karta.

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

**Funkcje w `notesStore`:** `loadNotes()`, `saveNotes(notes)`, `createNote()`, `updateNote(id, patch)`, `deleteNote(id)`, `setActiveNote(id)`

**UI:**
- Pasek zakładek u góry
- Ikona `+` dodaje nową notatkę
- Ikona `x` zamyka notatkę
- Double-click na tytuł → rename

---

## 4b. Autosave tylko przy zmianie

**Cel:** Oszczędność I/O i płynność działania.

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

**Cel:** Notepad ma działać jako: zwykły notatnik, edytor kodu (JS, HTML, CSS, Python, XML), edytor rich text.

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

Rich text: bold, italic, underline, listy, linki, nagłówki.

**Status:** Plain text działa. Syntax highlight i rich text → **BACKLOG**

---

# 5. TASKPANEL (5a–5c)

## 5a. TaskModal — dodawanie/edycja zadania

**Pliki:**
- `src/ui/taskpanel/TaskPanel.jsx`
- `src/ui/taskpanel/TaskModal.jsx`
- `src/core/tasksStore.js`
- `src/locales/pl.json`, `en.json`

**Struktura zadania:**
```js
{
  id: string,
  title: string,
  description: string,
  priority: "A" | "B" | "C" | "D" | "E",
  dueDate: string | null,
  projectId: string | null,
  done: boolean,
  createdAt: string
}
```

**Pola `TaskModal`:** Tytuł, Opis (rich text), Priorytet (A–E), Termin (date/time), Projekt (select), Status (Backlog / Active / Done)

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

```js
const filtered = tasks.filter(t =>
  filters.priority ? t.priority === filters.priority : true
);
```

---

## 5c. Wyszukiwarka zadań

```js
const filtered = tasks.filter(t =>
  t.title.toLowerCase().includes(query.toLowerCase()) ||
  t.description.toLowerCase().includes(query.toLowerCase())
);
```

---

# 6. AGGREGATEDTASKS (6a–6c)

## 6a. Widok zbiorczy zadań per projekt

**Pliki:**
- `src/ui/tasks/AggregatedTasks.jsx`
- `src/ui/tasks/AggregatedProjectSection.jsx`
- `src/ui/tasks/AggregatedTaskItem.jsx`
- `src/core/projectsStore.js`
- `src/core/tasksStore.js`
- `src/locales/pl.json`, `en.json`

**Cel:** Wyświetlanie zadań pogrupowanych według projektów.

**UI:** Nagłówek projektu, liczba zadań, przycisk „Zwiń/Rozwiń", przycisk „Ukryj projekt", lista zadań.

---

## 6b. Ustawienia widoczności i zwinięcia

**Struktura settings:**
```js
settings.aggregatedTasks = {
  collapsedProjects: string[],
  hiddenProjects: string[]
};
```

**Funkcje:** `toggleCollapse(projectId)`, `toggleVisibility(projectId)`, `saveAggregatedSettings(partial)`

---

## 6c. Integracja z TaskPanel i ProjectManager

- Zmiana statusu zadania w TaskPanel aktualizuje AggregatedTasks.
- Archiwizacja projektu ukrywa go w AggregatedTasks.
- Usunięcie projektu usuwa jego zadania.

---

# 7. TERMINAL (7a–7c)

## 7a. Terminal — node-pty + xterm

**Pliki:**
- `src/ui/terminal/Terminal.jsx`
- `preload.cjs`
- `main.js`
- `tests/TestRunner_Terminal.js`

**Cel:** Pełny terminal systemowy z obsługą: node-pty (backend), xterm.js (frontend), kolorowania ANSI, historii komend, restartu sesji, czyszczenia ekranu, cleanup event listenerów.

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

## 7b. Historia komend

**Cel:** Strzałka w górę/dół przewija historię komend.

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

## 7c. Cleanup listenerów IPC

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

# 8. SETTINGS (8a–8e)

## 8a. Hotkeys Manager

**Pliki:**
- `src/ui/settings/HotkeysManager.jsx`
- `src/core/hotkeysStore.js`
- `main.js` (globalShortcut)
- `preload.cjs`

**Cel:** Użytkownik może tworzyć własne skróty klawiszowe, które: wklejają tekst, wykonują akcje, działają globalnie.

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

**Rejestracja skrótów w `main.js`:**
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

## 8b. Dark Mode

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

## 8c. Eksport/Import ustawień

**Cel:** Backup ustawień, profili, notatek, tasków, projektów.

**Struktura eksportu:**
```json
{
  "version": "1.1.0",
  "exportedAt": 1710000000000,
  "settings": {},
  "profiles": [],
  "tasks": [],
  "notes": [],
  "projects": []
}
```

**Import:** walidacja struktury, modal potwierdzający, merge danych.

---

## 8d. Logi dostępne z Settings

**Cel:** Przycisk „Otwórz folder logów".

```js
ipcMain.handle("logs:openFolder", () => {
  shell.openPath(getLogsDir());
  return { ok: true };
});
```

---

## 8e. Konto użytkownika + synchronizacja

**Status: DO-ANALYSIS**

**Cel:** Synchronizacja ustawień i profili między urządzeniami.

---

# 9. TOOLS (9a–9i)

| Narzędzie | Plik | Funkcje |
|-----------|------|---------|
| JSON/YAML/XML Formatter | `src/ui/tools/JsonFormatter.jsx` | formatowanie, walidacja, minify/pretty |
| Regex Tester | `src/ui/tools/RegexTester.jsx` | pattern, flags, test string, lista dopasowań |
| Markdown Previewer | `src/ui/tools/MarkdownPreviewer.jsx` | split view, live preview, drag & drop `.md` |
| Image Tools | `src/ui/tools/ImageTools.jsx` | compress, resize, convert, preview |
| SVG → PNG Converter | `src/ui/tools/SvgToPngConverter.jsx` | render SVG → canvas → PNG |
| File Previewer | `src/ui/tools/FilePreviewer.jsx` | RAW/PREVIEW, highlight, obsługa wielu formatów |
| Mini Postman | `src/ui/tools/MiniPostman.jsx` | metoda, URL, nagłówki, body, response |
| Clipboard History | `src/ui/tools/ClipboardHistory.jsx` | historia schowka, pinowanie, kopiowanie |
| Cookie Grabber | `src/ui/tools/CookieGrabber.jsx` | pobieranie cookies z aktywnego WebView |

**Cookie Grabber — implementacja:**
```js
const cookies = await window.electronAPI.getCookies(profile.partition);
```

---

# 10. APP LIBRARY — PEŁNY WIDOK

**Pliki:**
- `src/ui/appLibrary/AppLibraryBrowser.jsx`
- `src/data/app-library.json`
- `src/core/appLibraryStore.js`

**Cel:** Pełny widok App Library jako osobny moduł (nie tylko w Sidebarze).

**Funkcje:** wyszukiwarka, sortowanie, filtrowanie po kategorii, podgląd aplikacji, dodawanie profilu jednym kliknięciem.

---

# 11. UI/UX (11a–11f)

## 11a. Sidebar redesign

Search bar, kategorie, last used, tools, settings, help.

## 11b. WebView toolbar

Pełny zestaw przycisków, skróty klawiszowe (`Ctrl+L`, `Ctrl+R`, `Alt+←/→`).

## 11c. Toasty

`success`, `error`, `info`, `warning`, auto-hide, ręczne zamykanie.

## 11d. Tooltipy

Na ikonach, kafelkach, polach formularzy, przyciskach.

## 11e. Modale

Globalny komponent, ESC zamyka, klik poza zamyka, walidacja pól.

## 11f. Loading states

Spinner, skeleton, disable przycisków podczas operacji.

---

# 12. ROADMAPA

## Etap 1 — Stabilizacja (v0.0.3)

IPC walidacja, cleanup eventów, poprawa zapisu settings/profiles, logger, single instance lock.

## Etap 2 — App Library + Workspaces (v0.0.4)

`app-library.json`, `workspacesStore`, przełączanie workspace'ów.

## Etap 3 — Power features (v0.0.4+)

Unified search (`Ctrl+K`), quick switcher (`Ctrl+P`), tile view, dark mode, ulepszenia TaskPanel/AggregatedTasks.

---

# 13. DYNAMICZNE ŁADOWANIE TESTÓW (`testsLoader.js`)

**Plik:** `src/loaders/testsLoader.js`

**Cel:** Automatyczne wykrywanie i uruchamianie wszystkich testów bez ręcznego importowania.

**Działanie:**
- Skanuje folder `tests/` w poszukiwaniu plików `TestRunner_*.js`
- Pomija: `TestRunner.js`, `testUtils.js`
- Dla każdego pliku — znajduje eksportowaną funkcję `run*Tests()` (np. `runNotepadTests`, `runTasksTests`)
- Uruchamia ją i agreguje wyniki

**Użycie w `TestRunner.js`:**
```js
import { loadAndRunAllTests } from './loaders/testsLoader.js';

export async function runAllTests(options = {}) {
  const { passed, failed, results } = await loadAndRunAllTests(options);
  return { passed, failed, results };
}
```

> Nowe testy są wykrywane automatycznie — nie trzeba modyfikować `TestRunner.js`. Łatwiejsze utrzymanie i mniej konfliktów merge. `testsLoader` używa `logInfo` i `logError` z loggera.

---

# 14. DYNAMICZNE ŁADOWANIE HANDLERÓW IPC (`ipcLoader.js`)

**Plik:** `src/loaders/ipcLoader.js`

**Cel:** Automatyczne ładowanie wszystkich handlerów IPC z folderu `src/ipc/`.

**Działanie:**
- Skanuje folder `src/ipc/` w poszukiwaniu plików `ipcMainHandlers_*.js`
- Pomija: `ipcLegacyBridge.js` (ładowany osobno jako most legacy)
- Importuje każdy plik — handlery rejestrują się przez side-effect

**Użycie w `main.js`:**
```js
import { loadAllIpcHandlers } from './loaders/ipcLoader.js';
await loadAllIpcHandlers();
```

> Nowe handlery dodajesz tylko jako plik — nie modyfikujesz `main.js`. Łatwiejsze utrzymanie i mniej konfliktów merge. `ipcLoader` loguje które handlery zostały załadowane, pominięte lub dały błąd.

---

# 15. WEBVIEW MAPY W `main.js`

Do prawidłowego działania Screenshot, Resource Monitor i AdBlockera, w `main.js` utrzymujemy mapy:

```js
const webviewMap = new Map();        // tabId → { webContentsId, registeredAt }
const webviewProfileMap = new Map(); // webContentsId → profileId

ipcMain.handle('register-webview', (_, tabId, webContentsId) => {
  webviewMap.set(tabId, { webContentsId, registeredAt: Date.now() });
  webviewProfileMap.set(webContentsId, tabId);
});

ipcMain.handle('unregister-webview', (_, tabId) => {
  const entry = webviewMap.get(tabId);
  if (entry) {
    webviewProfileMap.delete(entry.webContentsId);
    webviewMap.delete(tabId);
  }
});
```

> Mapy to stan `main.js`, nie handlery. Handlery rejestracji są w `src/ipc/ipcMainHandlers_webview_extra.js`.

---

# 16. NAGŁÓWKI PLIKÓW — STANDARD

## 16.1. Kolejność pól (STAŁA)

| Pole | Opis |
|------|------|
| `FILE:` | Nazwa pliku z rozszerzeniem |
| `PATH:` | Ścieżka od roota projektu |
| `VERSION:` | `#.#.#` (z `package.json`) |
| `PURPOSE:` | Opis przeznaczenia pliku |
| `FUNCTIONS:` | Lista eksportowanych funkcji (automatyczna) |
| `DEPENDS ON:` | Lista importowanych modułów (automatyczna) |
| `UWAGA:` | `"Nie usuwać komentarzy – opisują flow aplikacji."` |

## 16.2. Wzory dla różnych typów plików

**Dla `.js` / `.jsx` / `.cjs`:**
```js
// =============================================================================
// FILE: nazwa_pliku.js
// PATH: src/folder/nazwa_pliku.js
// VERSION: #.#.#
// PURPOSE: opis przeznaczenia pliku
// FUNCTIONS: funkcja1, funkcja2
// DEPENDS ON: react, logger.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================
```

**Dla `.md` / `.html`:**
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

**Dla `.css`:**
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

**Dla `.json`:**
```json
{
  "_comment": "FILE: pl.json | PATH: src/locales/pl.json | VERSION: #.#.# | PURPOSE: Tłumaczenia polskie | FUNCTIONS: - | DEPENDS ON: - | UWAGA: Nie usuwać komentarzy",
  "key": "value"
}
```

## 16.3. Zasady aktualizacji

| Pole | Aktualizacja | Kto |
|------|-------------|-----|
| `FILE` | automatyczna | skrypt |
| `PATH` | automatyczna | skrypt |
| `VERSION` | automatyczna (z `package.json`) | skrypt |
| `PURPOSE` | ręczna | developer / AI |
| `FUNCTIONS` | automatyczna | skrypt |
| `DEPENDS ON` | automatyczna | skrypt |
| `UWAGA` | stała | — |

> Wszystkie pola poza `PURPOSE` są automatycznie weryfikowane i aktualizowane przez skrypt `build_structure.py --fix` przed pull requestem. Nie modyfikuj ich ręcznie — zostaną nadpisane.

## 16.4. `DEPENDS ON` — format

Tylko nazwy plików (bez ścieżek i rozszerzeń, jeśli to możliwe). Przykład: `logger.js, icons.js, react`

Jeśli dwa pliki mają tę samą nazwę — skrypt zachowa rozróżnienie: `root/config.js`, `src/config.js`

## 16.5. Przykład z dodatkowym komentarzem POD nagłówkiem

```html
<!-- =============================================================================
 FILE: Structure.md
 PATH: doc/Structure.md
 VERSION: #.#.#
 PURPOSE: Dokumentacja specyfikacji projektowej - Struktura projektu
 FUNCTIONS: -
 DEPENDS ON: DevelopersGuide.md
 UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
 ============================================================================= -->

<!--
  AI Important! Sekcja drzewa jest generowana automatycznie
  przez build_structure.py — NIE edytować ręcznie tej sekcji.
  Sekcja po OTHER SECTIONS jest statyczna i można ją edytować.
-->
```

> Wszystko co wymaga dodatkowego wyjaśnienia — umieść w osobnym bloku komentarza PO nagłówku, nie wewnątrz niego.

---

# 17. INSTRUKCJA DLA AI — JAK KORZYSTAĆ Z TEGO DOKUMENTU

1. Zaimportuj `Structure.md` i `DevelopersGuide.md` jako pełną specyfikację projektu MultiWeb Manager.
2. Traktuj wszystkie sekcje jako wymagania implementacyjne.
3. Dla każdego modułu (`Sidebar`, `TaskPanel`, `Notepad`, `ProjectManager`, `AggregatedTasks`, `WebViewTab`, `Terminal`, `HistoryLog`, `Settings`, `Help`, `Tools`, `App Library`, `Workspaces`, `engine`, `core`, `utils`, `hooks`): utwórz pliki zgodnie ze `Structure.md`, zaimplementuj funkcje zgodnie z opisem, stosuj zasady globalne (nagłówki, icons, locales, IPC, settings merge, modale, toasty, cleanup eventów).
4. Dla każdego feature'a z roadmapy: zaimplementuj go w odpowiednich plikach, zachowaj zgodność z opisem.
5. Upewnij się, że:
   - nie ma `alert()` / `prompt()`
   - wszystkie eventy mają cleanup
   - IPC ma walidację + `try/catch` + `{ ok, data, error }`
   - settings są mergowane
   - wszystkie teksty idą przez `translations.js`
   - wszystkie ikony pochodzą z `icons.js`

> Ten dokument jest kompletną specyfikacją — na jego podstawie da się odtworzyć cały projekt 1:1, bez zgadywania.

---

# 17. FEATURE FLAGS — WARUNKOWE ŁADOWANIE MODUŁÓW

## 17.1. Przeznaczenie

Obiekt `FEATURES` w `src/config.js` steruje włączaniem/wyłączaniem poszczególnych modułów aplikacji bez konieczności usuwania kodu. Pozwala szybko wyłączyć dowolny feature na czas debugów lub testów.

## 17.2. Implementacja w komponentach React

**Zasada: WSZYSTKIE hooki muszą być PRZED warunkiem feature.**

React wymaga, żeby hooki były wywoływane bezwarunkowo i zawsze w tej samej kolejności. Umieszczenie `if (!isFeatureEnabled(...)) return null` przed `useState` / `useEffect` / `useContext` jest błędem (`React Hook called conditionally`).

```jsx
// ✅ POPRAWNIE — hooki przed warunkiem
import { isFeatureEnabled } from '../../config.js';

export default function MojKomponent() {
  const { t } = useContext(TranslationContext); // ✅ hook zawsze na górze
  const [stan, setStan] = useState(null);        // ✅ hook zawsze na górze

  if (!isFeatureEnabled('nazwaFeature')) return null; // ✅ warunek PO hookach

  return <div>...</div>;
}

// ❌ ŹLE — warunek przed hookami
export default function MojKomponent() {
  if (!isFeatureEnabled('nazwaFeature')) return null; // ❌ BŁĄD!
  const [stan, setStan] = useState(null);
  // ...
}
```

**Wyjątek — komponenty z `useEffect`:** Jeśli komponent ma useEffect (np. ładuje dane przy mount), warunek feature powinien wystąpić po hookach, ale logika efektu nie ulegnie zmianie — komponent po prostu zwróci null zanim wyrenderuje UI.

## 17.3. Implementacja w modułach logicznych (`.js`)

```js
// ✅ POPRAWNIE — warunek na początku funkcji (nie hook, więc można przed logiką)
export function initAdBlocker() {
  if (!isFeatureEnabled('adBlocker')) return;
  // ... logika inicjalizacji
}
```

## 17.4. Mapowanie FEATURES → pliki

| Flaga | Plik(i) | Sposób warunkowania |
|---|---|---|
| `helpScreen` | `src/ui/help/Help.jsx` | `return null` w komponencie |
| `appLibrary` | `src/ui/appLibrary/AppLibraryBrowser.jsx` | `return null` w komponencie |
| `unifiedSearch` | `src/ui/system/GlobalSearch.jsx` (jeśli istnieje) | `return null` w komponencie |
| `tileView` | `src/ui/webview/WebViewTileView.jsx` (jeśli istnieje) | `return null` w komponencie |
| `singleAppMode` | `src/ui/webview/WebViewTab.jsx` | prop `onSingleAppMode` = `undefined` |
| `screenshotWebView` | `src/ui/webview/WebViewTab.jsx` | prop `onScreenshot` = `undefined` |
| `resourceMonitor` | `src/ui/webview/WebViewTab.jsx` | prop `onResourceMonitor` = `undefined` |
| `sleepTabs` | `src/engine/sleepTabsManager.js` | `return 0` w `getSleepTimeoutMs()` |
| `adBlocker` | `src/engine/adBlocker.js` | `return` w `initAdBlocker()` |
| `jsonYamlXmlFormatter` | `src/ui/tools/JsonFormatter.jsx` + `ToolsPanel.jsx` | `return null` + filtr listy |
| `regexTester` | `src/ui/tools/RegexTester.jsx` + `ToolsPanel.jsx` | `return null` + filtr listy |
| `markdownPreviewer` | `src/ui/tools/MarkdownPreviewer.jsx` + `ToolsPanel.jsx` | `return null` + filtr listy |
| `imageTools` | `src/ui/tools/ImageTools.jsx` + `ToolsPanel.jsx` | `return null` + filtr listy |
| `svgToPng` | `src/ui/tools/SvgToPngConverter.jsx` + `ToolsPanel.jsx` | `return null` + filtr listy |
| `filePreviewer` | `src/ui/tools/FilePreviewer.jsx` + `ToolsPanel.jsx` | `return null` + filtr listy |
| `miniPostman` | `src/ui/tools/MiniPostman.jsx` + `ToolsPanel.jsx` | `return null` + filtr listy |
| `clipboardHistory` | `src/ui/tools/ClipboardHistory.jsx` + `ToolsPanel.jsx` | `return null` + filtr listy |
| `cookieGrabber` | `src/ui/tools/CookieGrabber.jsx` + `ToolsPanel.jsx` | `return null` + filtr listy |
| `hotkeysManager` | `src/ui/settings/HotkeysManager.jsx` + `Settings.jsx` | `return null` + `{isFeatureEnabled && <HotkeysManager />}` |
| `exportImport` | `src/ui/settings/DataLogsSection.jsx` | warunkowe renderowanie przycisków |
| `logsAccess` | `src/ui/settings/DataLogsSection.jsx` | warunkowe renderowanie przycisku |

## 17.5. Wzorzec filtrowania zakładek w ToolsPanel

Lista narzędzi w `ToolsPanel.jsx` używa pola `feature` i filtruje tablicę `allTools`:

```jsx
const allTools = [
  { id: 'jsonFormatter', icon: ICONS.JSON, label: t('tools.jsonFormatter'), feature: 'jsonYamlXmlFormatter' },
  { id: 'removebg', icon: ICONS.REMOVEBG, label: t('tools.removebg'), feature: null }, // null = zawsze widoczne
  // ...
];
const tools = allTools.filter(tool => !tool.feature || isFeatureEnabled(tool.feature));
```

## 17.6. Dodawanie nowego feature flaga — checklista

1. Dodaj wpis do `FEATURES` w `src/config.js`
2. Dodaj `import { isFeatureEnabled } from '../../config.js'` w docelowym pliku
3. W komponencie React: dodaj `if (!isFeatureEnabled('klucz')) return null;` **PO wszystkich hookach**
4. W module JS: dodaj `if (!isFeatureEnabled('klucz')) return;` na początku funkcji inicjalizacyjnej
5. Jeśli tool pojawia się w `ToolsPanel` — dodaj pole `feature: 'klucz'` w `allTools`
6. Zaktualizuj tablicę mapowania w sekcji 17.4 powyżej
7. Dodaj wpis do `.clinerules` (sekcja DEBUG / FEATURES)

---
<!-- KONIEC DOKUMENTU -->
<!-- ============================================================================= -->