=============================================================================
FILE: Requirements.md
PATH: DOC/Requirements.md
VERSION: 0.0.3
PURPOSE: Wymagania aplikacji, z aktualnymi statusami
DEPENDS ON: structure.txt, DevelopersGuide.md, AI_Development_Standards.md
=============================================================================


📦 — ARCHITEKTURA I STABILNOŚĆ (punkty 1a–1r)
(najważniejsza sekcja, fundament całej aplikacji)

🧩 1a. Cleanup event listenerów (WebViewTab, Terminal, App)
Priorytet: ASAP
Pliki do modyfikacji:
src/components/WebViewTab/WebViewTab.jsx
src/components/Terminal/Terminal.jsx
src/App.jsx
preload.js
Problem:  
Komponenty dodają eventy, ale ich nie usuwają → memory leak, crash, duplikacja eventów, rosnący RAM.
Co zrobić (krok po kroku):
1. W każdym useEffect dodającym event listener:
js
useEffect(() => {
  const handler = () => { ... };
  window.addEventListener("resize", handler);

  return () => {
    window.removeEventListener("resize", handler);
  };
}, []);

2. W WebViewTab.jsx — WebView eventy:
js
useEffect(() => {
  const webview = webviewRef.current;

  const onLoad = () => setLoading(false);
  const onConsole = (e) => logDebug("webview console", e.message);

  webview.addEventListener("did-finish-load", onLoad);
  webview.addEventListener("console-message", onConsole);

  return () => {
    webview.removeEventListener("did-finish-load", onLoad);
    webview.removeEventListener("console-message", onConsole);
  };
}, []);

3. W Terminal.jsx — xterm + pty:
js
useEffect(() => {
  const term = new Terminal();
  const fitAddon = new FitAddon();
  term.loadAddon(fitAddon);

  const onData = term.onData((data) => pty.write(data));
  const onExit = pty.onExit(() => term.write("\r\n[Process exited]\r\n"));

  return () => {
    onData.dispose();
    onExit.dispose();
    pty.kill();
    term.dispose();
  };
}, []);

4. W preload.js — funkcje onX muszą zwracać cleanup:
js
onCheckBeforeQuit: (handler) => {
  const listener = (_, payload) => handler(payload);
  ipcRenderer.on("check-before-quit", listener);
  return () => ipcRenderer.removeListener("check-before-quit", listener);
}

Instrukcja dla AI:
Znajdź wszystkie addEventListener, on(...), xterm.onData, ipcRenderer.on.
Dodaj cleanup.
Upewnij się, że WebView i Terminal nie zostawiają listenerów po unmount.
Rezultat:  
Stabilna aplikacja, brak memory leaków.
🧩 1b. Walidacja danych w IPC
Priorytet: CRITICAL
Pliki:
main.js
src/engine/ipcMainHandlers.js (jeśli wydzielone)
preload.js (forward)
wszystkie store’y korzystające z IPC
Problem:  
Renderer może wysłać:
null,
"string",
{},
błędne typy → korupcja danych w Electron Store.
Co zrobić:
1. Każdy handler IPC zaczyna się od walidacji:
js
if (!payload || typeof payload !== "object") {
  return { ok: false, error: "INVALID_PAYLOAD" };
}

2. Walidacja pól settings:
js
if (payload.language && typeof payload.language !== "string") {
  return { ok: false, error: "INVALID_LANGUAGE" };
}

3. Walidacja profilu:
js
if (!payload.id || typeof payload.id !== "string") ...
if (!payload.url || typeof payload.url !== "string") ...

4. Walidacja tasków:
js
if (!Array.isArray(payload)) {
  return { ok: false, error: "TASKS_MUST_BE_ARRAY" };
}

Instrukcja dla AI:
Każdy handler IPC musi walidować typy i strukturę.
Nigdy nie zakładaj, że renderer wysyła poprawne dane.
Rezultat:  
Bezpieczny store, brak uszkodzeń danych.
🧩 1c. try/catch w IPC
Priorytet: CRITICAL
Pliki:
main.js
ipcMainHandlers.js
Problem:  
Błąd zapisu → renderer dostaje undefined → UI nie wie, co się stało.
Co zrobić:
1. Każdy handler IPC musi być w try/catch:
js
ipcMain.handle("save-settings", async (event, payload) => {
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

Instrukcja dla AI:
Wszystkie operacje I/O (fs, store, API) muszą być w try/catch.
Zawsze zwracaj { ok: false, error }.
Rezultat:  
Przewidywalne błędy, łatwe debugowanie.
🧩 1d. requestSingleInstanceLock()
Priorytet: CRITICAL
Plik: main.js
Problem:  
Użytkownik może odpalić kilka instancji → store się psuje.
Co zrobić:
js
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

Instrukcja dla AI:
Dodaj to na górze main.js.
Upewnij się, że działa na Windows/Mac/Linux.
Rezultat:  
Jedna instancja, brak konfliktów.
🧩 1e. Global error handlers
Priorytet: CRITICAL
Plik: main.js
Problem:  
Brak obsługi błędów → aplikacja wywala się bez logów.
Co zrobić:
js
process.on("uncaughtException", (err) => {
  logError("uncaughtException", err);
});

process.on("unhandledRejection", (reason) => {
  logError("unhandledRejection", reason);
});

Instrukcja dla AI:
logError musi zapisywać do pliku logów.
Nie wolno ignorować błędów.
Rezultat:  
Aplikacja nie wywala się bez informacji.
🧩 1f. Poprawne zapisywanie settings (merge, nie overwrite)
Priorytet: ASAP
Pliki:
src/core/settingsStore.js
wszystkie miejsca wywołujące saveSettings
Problem:  
saveSettings({ projects: [...] }) nadpisuje CAŁE settings → tracisz język, debugMode, API key itd.
Co zrobić:
js
export function updateSettings(partial) {
  const current = loadSettings();
  const merged = { ...current, ...partial };
  saveSettings(merged);
  return merged;
}

Instrukcja dla AI:
Nigdy nie nadpisuj całego settings jednym polem.
Zawsze merge.
Rezultat:  
Brak utraty ustawień.
🧩 1g. Zapis profili po dodaniu/edycji
Priorytet: ASAP
Pliki:
Sidebar.jsx
profilesStore.js
Problem:  
Profil dodany → nie zapisany → znika po restarcie.
Co zrobić:
js
function handleProfilesChange(nextProfiles) {
  setProfiles(nextProfiles);
  saveProfiles(nextProfiles); // IPC → main → electron-store
}

Instrukcja dla AI:
Każda zmiana profili musi kończyć się saveProfiles().
Rezultat:  
Profile są trwałe.
🧩 1h. Autosave Notepad tylko przy zmianie
Priorytet: MAJOR
Pliki:
Notepad.jsx
notepadStore.js
Problem:  
Zapis co 5s nawet bez zmian → lag, I/O spam.
Co zrobić:
js
useEffect(() => {
  const interval = setInterval(() => {
    if (content !== lastSaved) {
      saveNoteContent(activeNoteId, content);
      setLastSaved(content);
    }
  }, 5000);

  return () => clearInterval(interval);
}, [content, lastSaved, activeNoteId]);

Instrukcja dla AI:
Porównuj content z lastSaved.
Rezultat:  
Płynny notatnik.
🧩 1i. Logger + zapis do pliku + eksport logów
Priorytet: MAJOR
Pliki:
src/utils/logger.js
src/services/logService.js
Settings.jsx
Problem:  
DebugMode loguje tylko do konsoli.
Co zrobić:
1. Logger:
js
export function logError(msg, meta) {
  console.error(msg, meta);
  appendLogToFile({ level: "error", msg, meta, ts: Date.now() });
}

2. Eksport logów:
przycisk w Settings → zapisuje app.log do wybranej lokalizacji.
Instrukcja dla AI:
Logi muszą być w userData/logs/app.log.
Rezultat:  
Łatwe debugowanie.
🧩 1j. Osobny config.js
Priorytet: MAJOR
Plik: config.js
Problem:  
Settings zawiera rzeczy, które powinny być stałe.
Co zrobić:
config.js:
js
export const CONFIG = {
  debugMode: false,
  sleepTabsTimeout: 15 * 60 * 1000,
  historyLimit: 200,
  removeBg: { endpoint: "...", apiKey: "" }
};

Instrukcja dla AI:
Settings = dane użytkownika.
Config = stałe.
Rezultat:  
Czysta architektura.
🧩 1k. WebView błędy bez alert()
Priorytet: MAJOR
Pliki:
WebViewTab.jsx
WebViewErrorBar.jsx
Problem:  
Alerty są brzydkie i blokujące.
Co zrobić:
jsx
{error && (
  <WebViewErrorBar
    message={t("webview.error.network")}
    onReload={handleReload}
  />
)}

Instrukcja dla AI:
Usuń wszystkie alerty w WebViewTab.
Rezultat:  
Profesjonalny UX.
🧩 1l. Zastąpić alert/prompt modalami
Priorytet: MAJOR
Pliki:
UI/Modal.jsx
wszystkie komponenty używające alert/prompt
Problem:  
Prompty są archaiczne.
Co zrobić:
Stworzyć Modal.jsx.
Używać go do:
Add/Edit Task,
Add/Edit Profile,
Add/Edit Project,
Confirm Delete.
Instrukcja dla AI:
Usuń wszystkie prompt().
Rezultat:  
Spójny UX.
🧩 1m. Cleanup listenerów online/offline
Priorytet: MAJOR
Plik: App.jsx
Co zrobić:
js
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

🧩 1n. System powiadomień (toast + system notifications)
Priorytet: MAJOR
Pliki:
UI/ToastContainer.jsx
notificationsManager.js
Settings.jsx
Co zrobić:
Toasty: success/error/info/warning.
System notifications: new Notification(...).
Toggle w Settings.
🧩 1o. Pushbullet API
Priorytet: NICE-TO-HAVE
Pliki:
apiService.js
Settings.jsx
Co zrobić:
Użytkownik podaje API key.
Można wysyłać powiadomienia z nazwą kafelka.
🧩 1p. Spellcheck + walidacja kodu
Priorytet: MAJOR
Pliki:
NotepadEditor.jsx
Co zrobić:
CodeMirror/Monaco.
Tryby: JS, Python, HTML, CSS, XML.
Spellcheck PL/EN.
🧩 1q. Voice agent / AI agent
Priorytet: DO-ANALYSIS
Pliki:
VoiceAgent.jsx
aiAgentService.js
Co zrobić:
Web Speech API.
Integracja z lokalnym LLM.
🧩 1r. Automatyczne code review
Priorytet: DO-ANALYSIS
Pliki:
Tools/CodeReview.jsx
Co zrobić:
Wysyłanie kodu do AI.
Analiza i sugestie.
🧩 2. SIDEBAR / PROFILE MANAGER (2a–2g)
.
2a. App Library (lista gotowych aplikacji)
Priorytet: MAJOR
Pliki do modyfikacji / dodania
src/data/app-library.json (NOWY plik)
src/core/appLibraryStore.js (NOWY)
src/components/Sidebar/Sidebar.jsx
src/components/Sidebar/SidebarSection.jsx
src/components/Sidebar/AppLibraryItem.jsx (NOWY)
src/locales/pl.json, src/locales/en.json
src/data/icons.js (dodanie ikon)
Problem / potrzeba
Użytkownik musi ręcznie wpisywać URL profilu → wolne, niewygodne.
Chcesz mieć bibliotekę gotowych aplikacji, jak WebCatalog / Rambox.
Co zrobić (krok po kroku)
1. Stwórz plik app-library.json
Struktura:
json
{
  "categories": [
    {
      "id": "AI",
      "label": "AI",
      "apps": [
        { "id": "chatgpt", "name": "ChatGPT", "url": "https://chat.openai.com", "icon": "CHATGPT" },
        { "id": "claude", "name": "Claude", "url": "https://claude.ai", "icon": "CLAUDE" }
      ]
    }
  ]
}

2. Stwórz appLibraryStore.js
js
// =============================================================================
// FILE: appLibraryStore.js
// PURPOSE: Wczytywanie i filtrowanie App Library
// =============================================================================

import library from "../data/app-library.json";

export function loadAppLibrary() {
  return library.categories;
}

export function filterApps(query) {
  const q = query.toLowerCase();
  return library.categories.flatMap(cat =>
    cat.apps.filter(app =>
      app.name.toLowerCase().includes(q)
    )
  );
}

3. Sidebar – sekcja „App Library”
W Sidebar.jsx dodaj sekcję:
jsx
<SidebarSection title={t("sidebar.appLibrary")}>
  {categories.map(cat => (
    <AppLibraryItem
      key={cat.id}
      category={cat}
      onAdd={(app) => handleAddFromLibrary(app)}
    />
  ))}
</SidebarSection>

4. Funkcja dodawania profilu z App Library
js
function handleAddFromLibrary(app) {
  const newProfile = {
    id: uuid(),
    name: app.name,
    url: app.url,
    category: app.categoryId,
    label: app.name,
    notes: "",
    userAgent: "",
    partition: `profile-${uuid()}`
  };

  const updated = [...profiles, newProfile];
  setProfiles(updated);
  saveProfiles(updated);
  showToast("success", t("sidebar.profileAdded"));
}

Instrukcja dla AI
App Library jest statyczna — nie zapisujemy jej do store.
Dodawanie profilu = tworzenie nowego obiektu w profilesStore.
Każdy app musi mieć ikonę w icons.js.
Dodaj tłumaczenia:
sidebar.appLibrary,
sidebar.profileAdded.
Edge‑case’y
Jeśli profil o tym URL już istnieje → pokaż toast „Profil już istnieje”.
Jeśli App Library ma 200+ pozycji → dodaj paginację lub lazy load.
Rezultat
Dodawanie profili jednym kliknięciem.
Sidebar staje się jak WebCatalog.
2b. Filtrowanie profili (search bar)
Priorytet: MAJOR
Pliki
Sidebar.jsx
SidebarSearch.jsx (NOWY)
profilesStore.js
Problem
Sidebar może mieć 50+ profili → trudno znaleźć właściwy.
Co zrobić
1. Dodaj komponent SidebarSearch.jsx
jsx
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

2. W Sidebar.jsx dodaj filtr
js
const [query, setQuery] = useState("");

const filteredProfiles = profiles.filter(p =>
  p.name.toLowerCase().includes(query.toLowerCase()) ||
  p.url.toLowerCase().includes(query.toLowerCase())
);

3. Renderuj filteredProfiles zamiast profiles
Instrukcja dla AI
Search działa w czasie rzeczywistym.
Filtruje po name, url, label.
Dodaj tłumaczenia:
sidebar.searchPlaceholder.
Edge‑case’y
Jeśli lista jest pusta → pokaż „Brak wyników”.
Jeśli query = "" → pokaż pełną listę.
Rezultat
Sidebar staje się szybki i wygodny.
2c. Kategorie profili
Priorytet: MAJOR
Pliki
profilesStore.js
Sidebar.jsx
SidebarSection.jsx
Problem
Profile są w jednej liście → chaos.
Co zrobić
1. Dodaj pole category do profilu
js
{
  id: "...",
  name: "...",
  url: "...",
  category: "AI" | "Dev" | "Design" | "Productivity" | "Special",
  ...
}

2. W Sidebar grupuj profile
js
const grouped = {
  AI: [],
  Dev: [],
  Design: [],
  Productivity: [],
  Special: []
};

profiles.forEach(p => grouped[p.category].push(p));

3. Renderuj sekcje
jsx
{Object.entries(grouped).map(([cat, items]) => (
  <SidebarSection key={cat} title={t(`categories.${cat}`)}>
    {items.map(profile => (
      <SidebarProfileItem key={profile.id} profile={profile} />
    ))}
  </SidebarSection>
))}

Instrukcja dla AI
Dodaj tłumaczenia kategorii.
Dodaj walidację kategorii przy zapisie profilu.
Edge‑case’y
Jeśli kategoria pusta → nie renderuj sekcji.
Rezultat
Sidebar jest uporządkowany jak w Rambox/WebCatalog.
2d. Ostatnio używane profile
Priorytet: MINOR
Pliki
profilesStore.js
Sidebar.jsx
Co zrobić
1. Dodaj pole lastUsedAt
js
updateProfile(id, { lastUsedAt: Date.now() });

2. W Sidebar dodaj sekcję „Last used”
js
const lastUsed = [...profiles]
  .filter(p => p.lastUsedAt)
  .sort((a, b) => b.lastUsedAt - a.lastUsedAt)
  .slice(0, 10);

Instrukcja dla AI
Aktualizuj lastUsedAt przy każdym otwarciu profilu.
Rezultat
Szybki dostęp do ostatnio używanych aplikacji.
2e. Drag & drop profili
Priorytet: MAJOR
Pliki
Sidebar.jsx
profilesStore.js
Co zrobić
1. Użyj HTML5 drag&drop
jsx
<li
  draggable
  onDragStart={() => setDragged(profile.id)}
  onDrop={() => reorderProfiles(profile.id)}
>

2. Funkcja reorder
js
function reorderProfiles(targetId) {
  const draggedIndex = profiles.findIndex(p => p.id === dragged);
  const targetIndex = profiles.findIndex(p => p.id === targetId);

  const newList = [...profiles];
  const [item] = newList.splice(draggedIndex, 1);
  newList.splice(targetIndex, 0, item);

  setProfiles(newList);
  saveProfiles(newList);
}

Instrukcja dla AI
Drag&drop musi działać między kategoriami.
Po zmianie kolejności → saveProfiles().
Rezultat
Pełna personalizacja Sidebaru.
2f. Edycja profilu (modal)
Priorytet: MAJOR
Pliki
SidebarProfileItem.jsx
ProfileModal.jsx (NOWY)
profilesStore.js
Co zrobić
1. Stwórz ProfileModal.jsx
Pola:
Name
URL
Category
Label (tooltip)
Notes (rich text)
User Agent
2. W SidebarProfileItem dodaj przycisk „Edit”
jsx
<button onClick={() => setEditing(profile)}>✏️</button>

3. Po zapisaniu:
js
updateProfile(profile.id, patch);
saveProfiles();
showToast("success", t("profile.saved"));

Instrukcja dla AI
Usuń wszystkie prompt() z kodu.
Modal musi mieć walidację URL.
Rezultat
Profile są w pełni edytowalne.
2g. Multi‑account login (DO‑ANALYSIS)
Priorytet: DO‑ANALYSIS
Pliki
profilesStore.js
WebViewTab.jsx
Co zrobić (prototyp)
Każdy profil ma własny partition.
Można kopiować cookies między partition.
Instrukcja dla AI
Nie implementować bez decyzji użytkownika.
🧩 3a. Toolbar jak w przeglądarce
Priorytet: MAJOR
Pliki do modyfikacji / dodania:  
src/components/WebViewTab/WebViewTab.jsx  
src/components/WebViewTab/WebViewToolbar.jsx  
src/data/icons.js  
src/locales/pl.json, src/locales/en.json
Problem:  
Obecny toolbar WebViewTab jest minimalny. Brakuje podstawowych funkcji przeglądarkowych: back, forward, refresh, address bar, copy URL, open in browser, zoom, devtools, clear cache.
Użytkownik nie ma kontroli nad WebView → UX gorszy niż w Rambox/WebCatalog.
Co zrobić (krok po kroku):
Najpierw w WebViewTab.jsx dodaj referencję do WebView:
js
const webviewRef = useRef(null);

Następnie dodaj callbacki:
js
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

function handleOpenExternal() {
  window.electronAPI.openExternal(webviewRef.current.getURL());
}

function handleCopyUrl() {
  navigator.clipboard.writeText(webviewRef.current.getURL());
  showToast("success", t("webview.urlCopied"));
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
  window.electronAPI.clearCache();
  showToast("info", t("webview.cacheCleared"));
}

Następnie w WebViewToolbar.jsx:
jsx
export default function WebViewToolbar({
  url,
  onBack,
  onForward,
  onRefresh,
  onOpenExternal,
  onCopyUrl,
  onZoomIn,
  onZoomOut,
  onDevTools,
  onClearCache
}) {
  return (
    <div className="wv-toolbar">
      <button onClick={onBack}>{ICONS.BACK}</button>
      <button onClick={onForward}>{ICONS.FORWARD}</button>
      <button onClick={onRefresh}>{ICONS.REFRESH}</button>
      <input className="wv-url" value={url} readOnly />
      <button onClick={onCopyUrl}>{ICONS.COPY}</button>
      <button onClick={onOpenExternal}>{ICONS.EXTERNAL}</button>
      <button onClick={onZoomIn}>{ICONS.ZOOM_IN}</button>
      <button onClick={onZoomOut}>{ICONS.ZOOM_OUT}</button>
      <button onClick={onDevTools}>{ICONS.DEVTOOLS}</button>
      <button onClick={onClearCache}>{ICONS.CLEAR}</button>
    </div>
  );
}

Instrukcja dla AI:  
Toolbar musi być w pełni kontrolowany przez WebViewTab.
WebViewToolbar nie może mieć własnej logiki — tylko wywołuje callbacki.
Adres bar jest readonly (na razie).
Każdy przycisk ma tooltip z opisem i skrótem klawiszowym.
Edge‑case’y:  
Jeśli WebView nie jest jeszcze załadowany → disable przyciski.
Jeśli URL jest about:blank → ukryj copy/open external.
Rezultat:  
WebViewTab zachowuje się jak mini‑przeglądarka.
🧩 3b. Tile view (2–3 WebView obok siebie)
Priorytet: NICE‑TO‑HAVE
Pliki:  
WebViewTab.jsx  
WebViewTileView.jsx (NOWY)  
icons.js
Problem:  
Użytkownik chce mieć Figma + Notion obok siebie, ChatGPT + dokumentację, itp.
Obecnie można mieć tylko jedną zakładkę na raz.
Co zrobić:
Dodaj tryb tile view:
js
const [tileMode, setTileMode] = useState(false);

Dodaj przycisk w toolbarze:
jsx
<button onClick={() => setTileMode(!tileMode)}>
  {ICONS.TILE}
</button>

Stwórz WebViewTileView.jsx:
jsx
export default function WebViewTileView({ profiles }) {
  return (
    <div className="tile-container">
      {profiles.map(p => (
        <WebViewTab key={p.id} profile={p} tile />
      ))}
    </div>
  );
}

Instrukcja dla AI:  
Tile view nie zastępuje normalnego widoku — to tryb alternatywny.
Tile view musi mieć grid 2–3 kolumny.
WebViewTab w tile mode nie ma sidebaru ani dużego toolbaru.
Rezultat:  
Multitasking jak w Rambox.
🧩 3c. Custom user agent per profile
Priorytet: MAJOR
Pliki:  
profilesStore.js  
ProfileModal.jsx  
WebViewTab.jsx
Problem:  
Niektóre strony wymagają UA (np. mobilne wersje, starsze strony).
Co zrobić:
W profilu dodaj pole:
js
userAgent: ""

W ProfileModal dodaj input:
jsx
<input
  value={profile.userAgent}
  onChange={(e) => setProfile({ ...profile, userAgent: e.target.value })}
/>

W WebViewTab.jsx:
js
<webview
  ref={webviewRef}
  useragent={profile.userAgent || undefined}
  src={profile.url}
/>

Instrukcja dla AI:  
Jeśli userAgent pusty → użyj domyślnego.
Waliduj, czy UA nie jest pustym stringiem z whitespace.
Rezultat:  
Większa kompatybilność.
🧩 3d. AdBlocker toggle
Priorytet: MAJOR
Pliki:  
main.js  
settingsStore.js  
Settings.jsx
Problem:  
Masz flagę adBlocker, ale brak implementacji.
Co zrobić:
W main.js:
js
session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
  if (!settings.adBlocker) return callback({});
  if (isAdUrl(details.url)) return callback({ cancel: true });
  callback({});
});

Funkcja isAdUrl:
js
function isAdUrl(url) {
  return /doubleclick|adservice|googlesyndication/.test(url);
}

Instrukcja dla AI:  
AdBlocker musi być toggle w Settings.
Zmiana ustawienia wymaga restartu WebView.
Rezultat:  
Czystsze strony.
🧩 4. NOTEPAD (4a–4c)
🧩 4a. Syntax highlight (JS, Python, HTML, CSS, XML)
Priorytet: MAJOR
Pliki:  
NotepadEditor.jsx  
notepadStore.js
Problem:  
Notepad jest plain text → nie nadaje się do kodu.
Co zrobić:
Zaimplementuj CodeMirror lub Monaco:
jsx
<CodeMirror
  value={note.content}
  height="100%"
  theme="dark"
  extensions={[javascript(), python(), html(), css(), xml()]}
  onChange={(value) => onChange(value)}
/>

Instrukcja dla AI:  
Tryb syntax highlight aktywuje się, jeśli note.mode === "code".
Dodaj pole language w notatce.
Rezultat:  
Notepad++ w Twojej apce.
🧩 4b. Spellcheck
Priorytet: MAJOR
Pliki:  
NotepadEditor.jsx  
Settings.jsx
Co zrobić:
W trybie plain/rich:
jsx
<textarea spellCheck={settings.spellcheck} />

Instrukcja dla AI:  
Spellcheck PL/EN zależy od języka systemu.
Dodaj toggle w Settings.
🧩 4c. Rich text notatki
Priorytet: MAJOR
Pliki:  
NotepadEditor.jsx  
Notepad.jsx
Co zrobić:
Dodaj tryb rich text:
jsx
<RichTextEditor
  value={note.content}
  onChange={onChange}
/>

Instrukcja dla AI:  
Rich text = bold, italic, underline, listy, linki.
🧩 5. TASKPANEL / AGGREGATEDTASKS (5a–5c)
🧩 5a. Filtrowanie po priorytecie
Priorytet: MAJOR
Pliki:  
TaskPanel.jsx  
TaskFilters.jsx
Co zrobić:
js
const filtered = tasks.filter(t =>
  filters.priority ? t.priority === filters.priority : true
);

Instrukcja dla AI:  
Priorytety: A/B/C/D/E.
Kolory priorytetów muszą być spójne w całej apce.
🧩 5b. Wyszukiwarka zadań
Priorytet: MAJOR
Pliki:  
TaskPanel.jsx  
TaskFilters.jsx
Co zrobić:
js
const filtered = tasks.filter(t =>
  t.title.toLowerCase().includes(query.toLowerCase()) ||
  t.description.toLowerCase().includes(query.toLowerCase())
);

Instrukcja dla AI:  
Search działa w czasie rzeczywistym.
🧩 5c. Notatki rich‑text w zadaniach
Priorytet: MAJOR
Pliki:  
TaskModal.jsx  
tasksStore.js
Co zrobić:
Dodaj rich text editor do pola description.
Instrukcja dla AI:  
Opis zadania może być HTML/Markdown.
Zapisuj w store jako string.
🧩 6. TERMINAL (6a–6c)
6a. Cleanup listenerów IPC
Priorytet: ASAP
Pliki:
src/components/Terminal/Terminal.jsx
preload.js
main.js (handler IPC dla terminala)
Problem:  
Terminal dodaje listenery IPC (onData, onExit, ipcRenderer.on(...)), ale ich nie usuwa. Każde otwarcie terminala dokłada kolejne subskrypcje → memory leak, duplikowane eventy, rosnący RAM.
Co zrobić (krok po kroku):
W preload.js funkcje typu onTerminalData muszą zwracać cleanup:
js
contextBridge.exposeInMainWorld("electronAPI", {
  onTerminalData: (handler) => {
    const listener = (_, payload) => handler(payload);
    ipcRenderer.on("terminal:data", listener);
    return () => ipcRenderer.removeListener("terminal:data", listener);
  },
  onTerminalExit: (handler) => {
    const listener = (_, code) => handler(code);
    ipcRenderer.on("terminal:exit", listener);
    return () => ipcRenderer.removeListener("terminal:exit", listener);
  }
});

W Terminal.jsx:
js
useEffect(() => {
  const disposeData = window.electronAPI.onTerminalData((data) => {
    term.write(data);
  });

  const disposeExit = window.electronAPI.onTerminalExit((code) => {
    term.write(`\r\n[Process exited with code ${code}]\r\n`);
  });

  return () => {
    disposeData && disposeData();
    disposeExit && disposeExit();
    ptyProcess.kill();
    term.dispose();
  };
}, []);

Instrukcja dla AI:  
Wyszukaj wszystkie on("terminal:...") po stronie renderera i upewnij się, że mają cleanup.
Po zamknięciu Terminala nie może zostać żaden listener IPC ani żywy ptyProcess.
Rezultat:  
Brak wycieków pamięci związanych z terminalem.
6b. Historia komend
Priorytet: MINOR
Pliki:
Terminal.jsx
ewentualnie terminalStore.js (jeśli chcesz trwale zapisywać historię)
Problem:  
Brak historii komend (strzałka w górę/dół), co jest standardem w terminalach.
Co zrobić:
W Terminal.jsx dodaj stan:
js
const [history, setHistory] = useState([]);
const [historyIndex, setHistoryIndex] = useState(-1);

Przy wysyłaniu komendy:
js
function handleEnterCommand(cmd) {
  if (!cmd.trim()) return;
  ptyProcess.write(cmd + "\r");
  setHistory((prev) => [...prev, cmd]);
  setHistoryIndex(-1);
}

Obsługa strzałek:
js
term.onKey(({ key, domEvent }) => {
  if (domEvent.key === "ArrowUp") {
    const nextIndex = historyIndex === -1
      ? history.length - 1
      : Math.max(0, historyIndex - 1);
    setHistoryIndex(nextIndex);
    const cmd = history[nextIndex] || "";
    replaceCurrentLine(cmd);
  } else if (domEvent.key === "ArrowDown") {
    const nextIndex = historyIndex === -1
      ? -1
      : Math.min(history.length - 1, historyIndex + 1);
    setHistoryIndex(nextIndex);
    const cmd = nextIndex === -1 ? "" : history[nextIndex];
    replaceCurrentLine(cmd);
  }
});

replaceCurrentLine to helper, który czyści aktualną linię i wpisuje tekst.
Instrukcja dla AI:  
Historia może być lokalna (per sesja).
Nie zapisuj historii do store, jeśli nie jest to wymagane.
Rezultat:  
Terminal zachowuje się jak normalny shell.
6c. Kolorowanie outputu (ANSI)
Priorytet: MINOR
Pliki:
Terminal.jsx
Problem:  
Brak kolorowania ANSI → logi i output są mniej czytelne.
Co zrobić:
Jeśli używasz xterm.js, doładuj addon:
js
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";

const term = new Terminal({
  convertEol: true,
  theme: { background: "#000000" }
});
term.loadAddon(new FitAddon());
term.loadAddon(new WebLinksAddon());

xterm sam obsługuje ANSI kolorowanie, jeśli dane z pty zawierają sekwencje ANSI.
Instrukcja dla AI:  
Upewnij się, że ptyProcess nie stripuje sekwencji ANSI.
Nie trzeba ręcznie parsować kolorów.
Rezultat:  
Kolorowy output, lepsza czytelność.
🧩 7. SETTINGS (7a–7e)
7a. Hotkeys manager (custom skróty + wklejanie tekstów)
Priorytet: MAJOR
Pliki:
SettingsHotkeys.jsx (nowy moduł w Settings)
hotkeysStore.js
main.js (globalShortcuts)
preload.js (IPC do triggerów)
Problem:  
Brak możliwości definiowania własnych skrótów, które wklejają tekst w dowolnym miejscu (np. snippet’y, podpisy, szablony).
Co zrobić:
Struktura hotkey w store:
js
{
  id: "hk-1",
  shortcut: "Ctrl+Alt+1",
  name: "Podpis mailowy",
  text: "Pozdrawiam,\nMaciek",
  enabled: true
}

hotkeysStore.js:
js
export function loadHotkeys() { ... }
export function saveHotkeys(list) { ... }

W SettingsHotkeys.jsx:
tabela z listą hotkeys,
przyciski Add/Edit/Delete (modale),
walidacja skrótu (unikalny, poprawny format).
W main.js:
js
function registerHotkeys() {
  const hotkeys = loadHotkeys();
  hotkeys.forEach(hk => {
    if (!hk.enabled) return;
    globalShortcut.register(hk.shortcut, () => {
      mainWindow.webContents.send("hotkey:trigger", hk.id);
    });
  });
}

W preload.js:
js
onHotkeyTrigger: (handler) => {
  const listener = (_, id) => handler(id);
  ipcRenderer.on("hotkey:trigger", listener);
  return () => ipcRenderer.removeListener("hotkey:trigger", listener);
}

W rendererze (np. App.jsx):
js
useEffect(() => {
  const dispose = window.electronAPI.onHotkeyTrigger((id) => {
    const hk = hotkeys.find(h => h.id === id);
    if (!hk) return;
    window.electronAPI.insertText(hk.text);
  });
  return () => dispose && dispose();
}, [hotkeys]);

Instrukcja dla AI:  
Skróty muszą być rejestrowane globalnie przez globalShortcut.
Dodaj w Settings możliwość włączenia/wyłączenia całego systemu hotkeys.
insertText po stronie main może używać robotjs / native input lub ograniczyć się do wklejania w obrębie aplikacji (w zależności od decyzji).
Rezultat:  
Mega wygoda przy powtarzalnych tekstach.
7b. Dark mode
Priorytet: MAJOR
Pliki:
SettingsAppearance.jsx
index.css / Tailwind config
App.jsx
Problem:  
Brak dark mode, a aplikacja devowa bez dark mode to grzech.
Co zrobić:
W settings:
js
settings.theme = "light" | "dark" | "system";

W App.jsx:
js
useEffect(() => {
  const root = document.documentElement;
  if (settings.theme === "dark") {
    root.classList.add("dark");
  } else if (settings.theme === "light") {
    root.classList.remove("dark");
  } else {
    // system
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
  }
}, [settings.theme]);

W CSS/Tailwind: stylowanie przez .dark .selector { ... }.
Instrukcja dla AI:  
Dark mode musi obejmować wszystkie główne komponenty: Sidebar, WebViewTab toolbar, TaskPanel, Notepad, Settings.
Kolory priorytetów, toastów, tooltipów muszą mieć wersje dark.
Rezultat:  
Nowoczesny wygląd, mniej męczący dla oczu.
7c. Eksport/Import ustawień
Priorytet: MAJOR
Pliki:
SettingsBackup.jsx
settingsStore.js
preload.js (IPC do dialogów i fs)
main.js (handler eksport/import)
Problem:  
Brak możliwości backupu ustawień, profili, notatek, tasków.
Co zrobić:
Struktura eksportu:
json
{
  "version": "1.1.0",
  "exportedAt": 1710000000000,
  "settings": { ... },
  "profiles": [ ... ],
  "tasks": [ ... ],
  "notes": [ ... ]
}

W main.js:
js
ipcMain.handle("settings:export", async () => {
  const data = collectAllData();
  const filePath = await showSaveDialog();
  if (!filePath) return { ok: false, error: "CANCELLED" };
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  return { ok: true };
});

ipcMain.handle("settings:import", async () => {
  const filePath = await showOpenDialog();
  if (!filePath) return { ok: false, error: "CANCELLED" };
  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw);
  validateImportedData(data);
  applyImportedData(data);
  return { ok: true };
});

Instrukcja dla AI:  
Waliduj wersję pliku i strukturę.
Nie nadpisuj wszystkiego bez pytania — pokaż modal z podsumowaniem (ile profili, ile tasków, itp.).
Rezultat:  
Bezpieczny backup i migracja między maszynami.
7d. Logi dostępne z Settings
Priorytet: MAJOR
Pliki:
SettingsDebug.jsx
logService.js
main.js
Problem:  
Logi są, ale użytkownik nie ma łatwego dostępu.
Co zrobić:
W main.js:
js
ipcMain.handle("logs:openFolder", () => {
  shell.openPath(getLogsDir());
  return { ok: true };
});

W SettingsDebug.jsx:
jsx
<button onClick={handleOpenLogs}>
  {t("settings.openLogsFolder")}
</button>

handleOpenLogs:
js
async function handleOpenLogs() {
  const res = await window.electronAPI.openLogsFolder();
  if (!res.ok) showToast("error", t("settings.openLogsError"));
}

Instrukcja dla AI:  
Folder logów: userData/logs.
Nie pokazuj ścieżki w UI, tylko otwieraj systemowy eksplorator.
Rezultat:  
Łatwy dostęp do logów dla debugowania.
7e. Konto użytkownika + sync w chmurze (DO‑ANALYSIS)
Priorytet: DO‑ANALYSIS
Pliki (docelowo):
AuthService.js
CloudSyncService.js
SettingsAccount.jsx
Problem:  
Brak synchronizacji profili/ustawień między urządzeniami.
Co zrobić (koncepcyjnie):  
Logowanie e‑mail + hasło / OAuth.
Sync profili, settings, notatek, tasków z backendem (np. Supabase/Firebase).
Rozwiązywanie konfliktów (last write wins / merge).
Instrukcja dla AI:  
Nie implementować bez decyzji o backendzie.
Wymaga osobnego projektu serwerowego.
🧩 8. NOWE NARZĘDZIA (KAFELKI) 8a–8h
Tu opiszę skrótowo strukturę, bo każde narzędzie ma podobny pattern, a Ty masz już szczegółowy opis w ToDo — tu doprecyzowuję pliki, strukturę i instrukcje dla AI.
8a. JSON/YAML/XML formatter
Priorytet: MAJOR
Pliki:
Tools/JsonYamlXmlFormatter.jsx
icons.js
locales
Co zrobić:  
Textarea input, wybór formatu (JSON/YAML/XML), przycisk „Format”, „Validate”, „Copy”.
Użyj JSON.parse/stringify, js-yaml, prosty parser XML (lub tylko formatowanie wcięć).
Instrukcja dla AI:  
Błędy walidacji pokazuj w panelu error (nie alert).
Dodaj przycisk „Minify/Pretty”.
8b. Regex tester
Priorytet: MAJOR
Pliki:
Tools/RegexTester.jsx
Co zrobić:  
Pola: pattern, flags, test string.
Pod spodem lista dopasowań, grup, indeksów.
Instrukcja dla AI:  
Obsłuż błędny pattern w try/catch.
8c. Markdown Previewer
Priorytet: MAJOR
Pliki:
Tools/MarkdownPreviewer.jsx
Co zrobić:  
Lewa strona: textarea / CodeMirror.
Prawa strona: podgląd HTML (marked/markdown‑it).
Tryb split/fullscreen, drag&drop plików .md.
Instrukcja dla AI:  
Sanityzuj HTML (xss).
Dodaj eksport do HTML.
8d. Image Tools (compress, resize, convert)
Priorytet: MAJOR
Pliki:
Tools/ImageTools.jsx
Co zrobić:  
Drag&drop obrazów, preview przed/po, suwaki jakości, rozmiaru, format (PNG/JPG/WebP).
Canvas API do przetwarzania.
Instrukcja dla AI:  
Przetwarzanie lokalne, bez API.
Dodaj toast „Zapisano” po eksporcie.
8e. SVG → PNG converter + preview
Priorytet: MAJOR
Pliki:
Tools/SvgToPng.jsx
Co zrobić:  
Drag&drop SVG, wybór rozdzielczości, render do canvas, eksport PNG.
Instrukcja dla AI:  
Obsłuż wiele plików.
Dodaj podgląd SVG + kod źródłowy.
8f. File Previewer
Priorytet: MAJOR
Pliki:
Tools/FilePreviewer.jsx
Co zrobić:  
Drag&drop pliku, rozpoznanie typu po rozszerzeniu/MIME.
Tryby: RAW / PREVIEW.
HTML → WebView, TXT → text, JSON → format + kolor, CSS/JS → highlight, Markdown → auto preview.
Instrukcja dla AI:  
Użyj highlight.js / CodeMirror do kolorowania.
Nie wykonuj JS z plików.
8g. Mini Postman (API tester)
Priorytet: NICE‑TO‑HAVE
Pliki:
Tools/ApiTester.jsx
Co zrobić:  
Metoda, URL, headers, body, przycisk „Send”, panel response (status, headers, body).
Historia requestów.
Instrukcja dla AI:  
Użyj fetch.
Obsłuż timeout i błędy sieci.
8h. Clipboard history
Priorytet: NICE‑TO‑HAVE
Pliki:
Tools/ClipboardHistory.jsx
clipboardStore.js
main.js (polling / event)
Co zrobić:  
Lista ostatnich wpisów schowka (tekst).
Kliknięcie → skopiowanie z powrotem.
Pinowanie wpisów.
Instrukcja dla AI:  
Użyj clipboard z Electron.
Nie zapisuj wrażliwych danych długoterminowo (opcjonalny limit czasu).
🧩 9. App Library — lista aplikacji (Twoja baza startowa)
To już częściowo rozpisałem przy 2a, tu doprecyzowanie:
Pliki:
data/app-library.json
AppLibraryBrowser.jsx (pełny widok biblioteki)
Sidebar (skrótowa wersja)
Co zrobić:  
Pełny widok App Library jako osobny kafelek „App Library” w Sidebarze.
Możliwość filtrowania, sortowania, podglądu opisu, dodania do profili jednym kliknięciem.
Instrukcja dla AI:  
App Library jest tylko źródłem — nie zapisujemy jej zmian w store (chyba że dodasz custom apps).
Custom apps możesz dopisywać do osobnego pliku user-app-library.json.
🧩 10. UI/UX — projekt (10a–10f)
10a. Sidebar redesign
Priorytet: MAJOR
Pliki:
Sidebar.jsx
SidebarSection.jsx
SidebarProfileItem.jsx
SidebarSearch.jsx
Co zrobić:  
Nowy layout:
góra: search bar,
poniżej: sekcje kategorii (AI, Dev, Design, Productivity, Special Tools, Profiles),
na dole: „Last used”, „Settings”, „Help”.
Instrukcja dla AI:  
Sidebar musi być responsywny (zwijać się do ikon).
Tooltipy na ikonach, pełne nazwy po hover.
10b. WebView toolbar (doprecyzowanie)
Priorytet: MAJOR
To już rozpisałem w 3a — tu doprecyzowanie UX:
Adres bar może być przełączany między readonly/edytowalny (toggle w Settings).
Dodaj skróty klawiszowe:
Ctrl+L — fokus na address bar,
Ctrl+R — reload,
Alt+←/→ — back/forward.
10c. Toast messages
Priorytet: MAJOR
Pliki:
UI/ToastContainer.jsx
toastStore.js
Co zrobić:  
Globalny kontener w App.jsx, który renderuje listę toastów.
API:
js
showToast("success", "Zapisano ustawienia");
showToast("error", "Błąd zapisu");

Instrukcja dla AI:  
Toasty znikają po 3–5 sekundach, z możliwością ręcznego zamknięcia.
Typy: success, error, info, warning.
10d. Tooltipy wszędzie
Priorytet: MINOR
Pliki:
UI/Tooltip.jsx
wszystkie przyciski/ikony
Co zrobić:  
Prosty komponent tooltip, np. na hover/long‑press.
Treść tooltipów z locales.
Instrukcja dla AI:  
Tooltipy muszą zawierać skróty klawiszowe, jeśli istnieją.
10e. Modale zamiast alert/prompt
Priorytet: MAJOR
Pliki:
UI/Modal.jsx
TaskModal.jsx
ProfileModal.jsx
ProjectModal.jsx
Co zrobić:  
Globalny komponent Modal z portalem do document.body.
Obsługa ESC, kliknięcia w tło, przycisków OK/Cancel.
Wszystkie dotychczasowe alert/prompt/confirm zastąpić modalami.
Instrukcja dla AI:  
Każdy modal musi mieć: tytuł, opis, przyciski, walidację pól, komunikaty błędów.
10f. Loading states
Priorytet: MAJOR
Pliki:
UI/Spinner.jsx
UI/Skeleton.jsx
komponenty: TaskPanel, Settings, WebViewTab (przy pierwszym ładowaniu), HistoryLog
Co zrobić:  
Dla każdej operacji > 200 ms:
disable przycisk, pokaż spinner lub skeleton.
Np. przy ładowaniu tasks z IPC:
jsx
if (loading) return <TasksSkeleton />;

Instrukcja dla AI:  
Loading states muszą być spójne wizualnie (ten sam spinner/skeleton).
Nie blokuj całej aplikacji — tylko lokalny obszar.
🔥 4 NOWE FEATURE’Y (Twoje pomysły)
Na koniec dopisuję cztery rzeczy, o których pisałeś w rozmowach (i które trzeba mieć w tym dokumencie):
A. Sleep dla nieaktywnych kafelków / kont (np. po 15 minutach)
Pliki:
WebViewTab.jsx
config.js
settingsStore.js
Założenie:  
Jeśli profil/kafelek nie jest aktywny przez X minut, WebView przechodzi w „sleep”:
unload strony / pauza, żeby nie żarła RAM/CPU.
Co zrobić:
W config.js:
js
sleepTabsTimeout: 15 * 60 * 1000

W WebViewTab.jsx:
js
const [lastActiveAt, setLastActiveAt] = useState(Date.now());
const [sleeping, setSleeping] = useState(false);

useEffect(() => {
  const interval = setInterval(() => {
    if (!isActiveTab) return;
    const idle = Date.now() - lastActiveAt;
    if (idle > settings.sleepTabsTimeout && !sleeping) {
      setSleeping(true);
      webviewRef.current?.loadURL("about:blank");
    }
  }, 60000);

  return () => clearInterval(interval);
}, [lastActiveAt, sleeping, isActiveTab, settings.sleepTabsTimeout]);

Przy aktywacji zakładki:
js
useEffect(() => {
  if (isActiveTab) {
    setLastActiveAt(Date.now());
    if (sleeping) {
      setSleeping(false);
      webviewRef.current?.loadURL(profile.url);
    }
  }
}, [isActiveTab]);

Instrukcja dla AI:  
Sleep musi być konfigurowalny w Settings (wyłączony / 5 / 15 / 30 min).
Nie usuwaj stanu logowania, jeśli to możliwe (zależy od strony).
B. Search dla kafelków / kont (globalny, nie tylko w Sidebarze)
Pliki:
GlobalSearch.jsx (Ctrl+K)
App.jsx
profilesStore.js
tasksStore.js
notesStore.js
Założenie:  
Unified search: profile, projekty, zadania, notatki.
Co zrobić:
GlobalSearch.jsx:
input,
lista wyników z sekcjami: Profiles, Projects, Tasks, Notes.
Logika:
js
const results = {
  profiles: profiles.filter(p => match(p.name, query) || match(p.url, query)),
  tasks: tasks.filter(t => match(t.title, query) || match(t.description, query)),
  notes: notes.filter(n => match(n.title, query) || match(n.content, query))
};

Instrukcja dla AI:  
Skrót Ctrl+K otwiera globalny search.
Enter na wyniku → przejście do odpowiedniego modułu (otwarcie profilu, projektu, notatki).
C. Modal Add/Edit Task (zamiast promptów)
Pliki:
TaskModal.jsx
TaskPanel.jsx
tasksStore.js
Założenie:  
Dodawanie/edycja zadania w pełnym modalu, z polami:
tytuł, opis (rich text), priorytet (A–E), status (Backlog/Active/Done), projekt, deadline, tagi.
Co zrobić:
TaskModal.jsx:
jsx
export default function TaskModal({ initialTask, onSave, onCancel }) {
  const [task, setTask] = useState(initialTask || defaultTask);

  function handleSubmit() {
    if (!task.title.trim()) {
      setError(t("tasks.errors.titleRequired"));
      return;
    }
    onSave(task);
  }

  return (
    <Modal title={initialTask ? t("tasks.edit") : t("tasks.add")} onClose={onCancel}>
      {/* inputs: title, description (rich), priority, status, project, deadline, tags */}
      <button onClick={handleSubmit}>{t("common.save")}</button>
    </Modal>
  );
}

W TaskPanel.jsx:
js
function handleAddTask() {
  setEditingTask(null);
  setTaskModalOpen(true);
}

function handleEditTask(task) {
  setEditingTask(task);
  setTaskModalOpen(true);
}

function handleSaveTask(task) {
  if (task.id) {
    updateTask(task.id, task);
  } else {
    createTask(task);
  }
  saveTasks();
  setTaskModalOpen(false);
}

Instrukcja dla AI:  
Usuń wszystkie prompt() związane z zadaniami.
Priorytet i status muszą być wybierane z dropdownów, nie wpisywane ręcznie.
D. Modal Add/Edit Profile (doprecyzowanie)
To już częściowo rozpisałem przy 2f, tu doprecyzowanie pól:
Pola w modalu:
nazwa, URL, kategoria, label (tooltip), notatki (rich text), userAgent, adBlocker (per profil), pinned (czy ma być na górze listy), kolor/ikona (opcjonalnie).
Instrukcja dla AI:  
AdBlocker musi mieć toggle per profil (to jest to, czego brakowało w poprzednim opisie — globalny + per‑profil override).
Logika:
jeśli profile.adBlocker jest true/false → nadpisuje globalne settings;
jeśli undefined → użyj globalnego.
—-----------------
Update do poprzednich punktów, jeśli czegoś brakuje, trzeba o te miejsca też zrobić update DevelopersGuide.md na koniec, oraz opisy w komentarzach w structure.txt:

🧩 2. app-library.json — poprawka
Masz absolutną rację.
Każda aplikacja w App Library powinna mieć:
isPinned
isDefault
isFavorite
I wszystkie powinny być edytowalne oraz ustawialne przy dodawaniu.
Czyli finalny format:
json
{
  "id": "chatgpt",
  "name": "ChatGPT",
  "url": "https://chat.openai.com",
  "icon": "CHATGPT",
  "isPinned": false,
  "isDefault": false,
  "isFavorite": false
}

🧩 5. Screenshot aktywnego WebView — NOWY FEATURE
To jest świetny pomysł.
Dodajemy:
przycisk w toolbarze WebView: Screenshot
po kliknięciu:
WebView robi screenshot (API: capturePage()),
zapisuje PNG do schowka,
toast: „Zrzut ekranu skopiowany do schowka”.
Opcjonalnie:
zapis do pliku,
otwarcie folderu Screenshots.
🧩 7. Cookie Grabber — potwierdzenie
Dodać
Cookie Grabber jako osobne narzędzie:
Cookie Grabber — NOWY FEATURE
pobiera cookies z aktywnego WebView,
pokazuje w tabeli,
można skopiować pojedyncze cookie lub wszystkie,
można eksportować do JSON.


🧩 8. Tooltipy — doprecyzowanie
Tak — tooltipy:
na ikonach,
na kafelkach,
na przyciskach,
na polach formularzy (np. „User Agent — opcjonalny”),
na elementach UI, które mają skróty klawiszowe.
Dodać to do dokumentacji.

🧩 9. Single App Mode — potwierdzenie
dodacpełny punkt:
przycisk w toolbarze WebView,
otwiera profil w osobnym oknie Electron,
po zamknięciu wraca do normalnego widoku,
idealne na drugi monitor.

🧩 10. Resource Monitoring — potwierdzenie
Dodac:
przycisk w toolbarze WebView: Resource Monitor
po kliknięciu:
toast z aktualnym zużyciem RAM/CPU WebView,
dane pobierane z webContents.getProcessMemoryInfo().
🧩 11. Sleep Tabs — potwierdzenie
Tak — Sleep Tabs jest już opisane, ale:
dodac pełną logikę,
dodac ustawienia per profil,
dodac ustawienia globalne,
dodac edge‑case’y (np. formularze, logowanie).
🧩 12. Search w Sidebar — potwierdzenie
Tak — Sidebar ma:
search bar,
highlight wyników,
rozwijanie sekcji, gdzie są wyniki.
Dodac i rozwinac.
🧩 13. AdBlocker per profil — poprawka
to musi być:
globalny toggle,
per‑profil override.
Logika:
Kod
if (profile.adBlocker !== undefined)
    użyj profile.adBlocker
else
    użyj settings.adBlocker
