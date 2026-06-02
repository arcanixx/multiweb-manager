// =============================================================================
// FILE: preload.cjs
// PATH: preload.cjs
// VERSION: 0.0.3
// PURPOSE: Bridge IPC – eksponuje bezpieczne API dla renderera (contextBridge). Definiuje metody komunikacji i handlery zdarzeń z mechanizmem cleanup.
// FUNCTIONS: -
// DEPENDS ON: electron
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  
  // ─── Profiles ─────────────────────────────────────────────────
  // ─── getProfiles() – Pobiera listę wszystkich profili użytkownika
  getProfiles:    ()           => ipcRenderer.invoke('get-profiles'),
  // ─── saveProfiles(profiles) – Zapisuje aktualny stan listy profili
  saveProfiles:   (profiles)   => ipcRenderer.invoke('save-profiles', profiles),
  
  // ─── Notes ────────────────────────────────────────────────────
  // ─── getNotes() – Pobiera listę notatek
  getNotes:   ()      => ipcRenderer.invoke('get-notes'),
  // ─── saveNotes(notes) – Zapisuje listę notatek
  saveNotes:  (notes) => ipcRenderer.invoke('save-notes', notes),
  
  // ─── Settings ─────────────────────────────────────────────────
  // ─── getSettings() – Pobiera aktualną konfigurację użytkownika
  getSettings:  ()      => ipcRenderer.invoke('settings:get'),
  // ─── saveSettings(patch) – Aktualizuje ustawienia (mechanizm merge)
  saveSettings: (patch) => ipcRenderer.invoke('settings:update', patch),
  // ─── resetSettings() – Przywraca ustawienia do stanu domyślnego
  resetSettings: () => ipcRenderer.invoke('settings:reset'),
  // ─── setDebugMode(enabled) – Przełącza globalny tryb debugowania
  setDebugMode: (enabled) => ipcRenderer.invoke('settings:update', { debugMode: enabled }),
  // ─── setDebugModule(moduleName, enabled) – Przełącza tryb debug dla konkretnego modułu
  setDebugModule: (moduleName, enabled) => ipcRenderer.invoke('settings:update', {
    debugModules: { [moduleName]: enabled }
  }),
  
  // ─── Tasks ────────────────────────────────────────────────────
  // ─── getTasks(project) – Pobiera zadania dla wybranego projektu
  getTasks:    (project)       => ipcRenderer.invoke('get-tasks', project),
  // ─── saveTasks(project, data) – Zapisuje stan zadań w projekcie
  saveTasks:   (project, data) => ipcRenderer.invoke('save-tasks', project, data),
  // ─── getAllTasks() – Pobiera wszystkie zadania ze wszystkich projektów
  getAllTasks:  ()              => ipcRenderer.invoke('get-all-tasks'),
  
  // ─── History ──────────────────────────────────────────────────
  // ─── getHistory() – Pobiera historię aktywności
  getHistory:   ()      => ipcRenderer.invoke('get-history'),
  // ─── addHistory(entry) – Dodaje nowy wpis do historii
  addHistory:   (entry) => ipcRenderer.invoke('add-history', entry),
  // ─── clearHistory() – Czyści historię aktywności
  clearHistory: ()      => ipcRenderer.invoke('clear-history'),
  
  // ─── WebView ──────────────────────────────────────────────────
  // ─── clearProfileCache(id) – Czyści pamięć podręczną (cache) dla profilu
  clearProfileCache: (id)  => ipcRenderer.invoke('clear-profile-cache', id),
  
  // ─── Updates & version ────────────────────────────────────────
  // ─── checkForUpdates() – Sprawdza dostępność nowej wersji aplikacji
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  // ─── getAppVersion() – Zwraca aktualną wersję aplikacji
  getAppVersion:   () => ipcRenderer.invoke('get-app-version'),
  
  // ─── File dialogs ─────────────────────────────────────────────
  // ─── saveTextToFile(content, name, folder) – Otwiera dialog zapisu tekstu do pliku
  saveTextToFile: (content, name, folder) =>
    ipcRenderer.invoke('save-text-to-file', content, name, folder),
  // ─── saveFile(payload) – Zapisuje dane binarne do pliku
  saveFile: (payload) => ipcRenderer.invoke('save-file', payload),
  
  // ─── Terminal ─────────────────────────────────────────────────
  // ─── createTerminal(cwd) – Tworzy nową sesję terminala w podanej ścieżce
  createTerminal: (cwd)          => ipcRenderer.invoke('create-terminal', cwd),
  // ─── terminalWrite(id, data) – Przesyła dane do wejścia terminala
  terminalWrite:  (id, data)     => ipcRenderer.invoke('terminal-write', id, data),
  // ─── terminalResize(id, cols, rows) – Zmienia wymiary okna terminala
  terminalResize: (id, cols, rows) => ipcRenderer.invoke('terminal-resize', id, cols, rows),
  // ─── killTerminal(id) – Zamyka proces terminala
  killTerminal:   (id)           => ipcRenderer.invoke('kill-terminal', id),
  
  // ─── onTerminalData(callback) – Rejestruje słuchacz strumienia danych z terminala
  onTerminalData: (callback) => {
    const listener = (_, payload) => callback(payload);
    ipcRenderer.on('terminal-data', listener);
    return () => ipcRenderer.removeListener('terminal-data', listener);
  },
  // ─── onTerminalExit(callback) – Rejestruje słuchacz zakończenia procesu terminala
  onTerminalExit: (callback) => {
    const listener = (_, code) => callback(code);
    ipcRenderer.on('terminal:exit', listener);
    return () => ipcRenderer.removeListener('terminal:exit', listener);
  },

  // ─── terminalStart() – Uruchamia terminal (API legacy)
  terminalStart: () => ipcRenderer.invoke('terminal:start'),
  // ─── terminalWriteLegacy(data) – Wysyła dane do terminala (API legacy)
  terminalWriteLegacy: (data) => ipcRenderer.invoke('terminal:write', data),
  // ─── terminalResizeLegacy(cols, rows) – Zmienia rozmiar terminala (API legacy)
  terminalResizeLegacy: (cols, rows) => ipcRenderer.invoke('terminal:resize', cols, rows),
  // ─── terminalKillLegacy() – Kończy sesję terminala (API legacy)
  terminalKillLegacy: () => ipcRenderer.invoke('terminal:kill'),

  // ─── Misc ─────────────────────────────────────────────────────
  // ─── openExternal(url) – Otwiera link w zewnętrznej przeglądarce
  openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url),

  // ─── App lifecycle ────────────────────────────────────────────
  // ─── confirmQuit() – Potwierdza chęć wyjścia z aplikacji
  confirmQuit: () => ipcRenderer.invoke('confirm-quit'),
  // ─── onCheckBeforeQuit(callback) – Rejestruje słuchacz sprawdzający stan przed zamknięciem
  onCheckBeforeQuit: (callback) => {
    const listener = () => callback();
    ipcRenderer.on('check-before-quit', listener);
    return () => ipcRenderer.removeListener('check-before-quit', listener);
  },

  // ─── LogWriter ────────────────────────────────────────────────
  // ─── appendLogFile(payload) – Dopisuje dane do pliku logów aplikacji
  appendLogFile: (payload) => ipcRenderer.invoke('append-log-file', payload),
  // ─── getLogsFile() – Odczytuje zawartość pliku logów
  getLogsFile: () => ipcRenderer.invoke('get-logs-file'),
  // ─── clearLogsFile() – Usuwa zawartość pliku logów
  clearLogsFile: () => ipcRenderer.invoke('clear-logs-file'),

  // ─── Cookie Grabber ───────────────────────────────────────────
  // ─── getCookies(partition) – Pobiera ciasteczka dla wybranej partycji WebView
  getCookies: (partition) => ipcRenderer.invoke('tools:getCookies', partition),

  // ─── Single App Mode, Screenshot, Resource Monitor ───────────
  // ─── openSingleWindow(payload) – Otwiera stronę w osobnym oknie aplikacji
  openSingleWindow: (payload) => ipcRenderer.invoke('open-single-window', payload),
  // ─── captureWebView(tabId) – Przechwytuje obraz widoku WebView
  captureWebView: (tabId) => ipcRenderer.invoke('capture-webview', tabId),
  // ─── getWebViewResourceInfo(tabId) – Pobiera informacje o zużyciu RAM/CPU przez WebView
  getWebViewResourceInfo: (tabId) => ipcRenderer.invoke('get-webview-resource', tabId),

  // ─── Hotkeys ──────────────────────────────────────────────────
  // ─── getHotkeys() – Pobiera listę zdefiniowanych skrótów klawiszowych
  getHotkeys: () => ipcRenderer.invoke('hotkeys:getAll'),
  // ─── saveHotkeys(hotkeys) – Zapisuje listę skrótów klawiszowych
  saveHotkeys: (hotkeys) => ipcRenderer.invoke('hotkeys:save', hotkeys),
  // ─── registerGlobalHotkeys(hotkeys) – Rejestruje skróty w systemie
  registerGlobalHotkeys: (hotkeys) => ipcRenderer.invoke('hotkeys:register', hotkeys),
  // ─── onHotkeyTrigger(callback) – Rejestruje słuchacz zdarzenia naciśnięcia skrótu
  onHotkeyTrigger: (callback) => {
    const listener = (_, data) => callback(data);
    ipcRenderer.on('hotkey:trigger', listener);
    return () => ipcRenderer.removeListener('hotkey:trigger', listener);
  },

  // ─── AdBlocker ────────────────────────────────────────────────
  // ─── setGlobalAdBlocker(enabled) – Ustawia stan globalnego blokera reklam
  setGlobalAdBlocker: (enabled) => ipcRenderer.invoke('adblocker:setGlobal', enabled),
  // ─── getGlobalAdBlocker() – Pobiera stan globalnego blokera reklam
  getGlobalAdBlocker: () => ipcRenderer.invoke('adblocker:getGlobal'),
  // ─── setAdBlockerForProfile(profileId, enabled) – Ustawia bloker reklam dla profilu
  setAdBlockerForProfile: (profileId, enabled) => ipcRenderer.invoke('adblocker:setForProfile', profileId, enabled),
  // ─── getAdBlockerForProfile(profileId) – Pobiera stan blokera reklam dla profilu
  getAdBlockerForProfile: (profileId) => ipcRenderer.invoke('adblocker:getForProfile', profileId),

  // ─── Sleep Tabs ───────────────────────────────────────────────
  // ─── setSleepTimeout(minutes) – Ustawia czas bezczynności przed uśpieniem karty
  setSleepTimeout: (minutes) => ipcRenderer.invoke('sleeptabs:setTimeout', minutes),
  // ─── getSleepTimeout() – Pobiera czas bezczynności przed uśpieniem
  getSleepTimeout: () => ipcRenderer.invoke('sleeptabs:getTimeout'),

  // ─── WebView registry (dla screenshot/resource) ───────────────
  // ─── registerWebView(tabId, webContentsId) – Rejestruje mapowanie karty na ID Electron
  registerWebView: (tabId, webContentsId) => ipcRenderer.invoke('register-webview', tabId, webContentsId),
  // ─── unregisterWebView(tabId) – Usuwa mapowanie karty
  unregisterWebView: (tabId) => ipcRenderer.invoke('unregister-webview', tabId),

  // ─── Generic invoke (dla nowych kanałów namespaced) ───────────
  // ─── invoke(channel, ...args) – Wykonuje dowolne wywołanie kanału IPC
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args)
});
