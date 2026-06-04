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
  getProfiles:    ()           => ipcRenderer.invoke('profiles:getAll'),
  // ─── createProfile(profileData) – Tworzy nowy profil (zastępuje saveProfiles dla nowych wpisów)
  createProfile:  (profileData) => ipcRenderer.invoke('profiles:create', profileData),
  // ─── updateProfile(id, patch) – Aktualizuje istniejący profil
  updateProfile:  (id, patch)   => ipcRenderer.invoke('profiles:update', { id, patch }),
  // ─── deleteProfile(id) – Usuwa profil po ID
  deleteProfile:  (id)          => ipcRenderer.invoke('profiles:delete', id),
  // ─── touchProfile(id) – Aktualizuje lastUsedAt profilu
  touchProfile:   (id)          => ipcRenderer.invoke('profiles:touch', id),
  
  // ─── Notes ────────────────────────────────────────────────────
  // ─── getNotes() – Pobiera listę notatek
  getNotes:   ()             => ipcRenderer.invoke('notes:getAll'),
  // ─── addNote(note) – Dodaje nową notatkę
  addNote:    (note)         => ipcRenderer.invoke('notes:add', note),
  // ─── updateNote(id, patch) – Aktualizuje notatkę po ID
  updateNote: (id, patch)    => ipcRenderer.invoke('notes:update', { id, patch }),
  // ─── deleteNote(id) – Usuwa notatkę po ID
  deleteNote: (id)           => ipcRenderer.invoke('notes:delete', id),
  
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
  // ─── getTasks(taskGroupId?) – Pobiera płaską listę zadań dla grupy lub wszystkich
  getTasks:         (taskGroupId) => ipcRenderer.invoke('tasks:getAll', taskGroupId),
  // ─── getAllTasks() – Pobiera zadania pogrupowane per taskGroupId (dla AggregatedTasks)
  getAllTasks:       ()            => ipcRenderer.invoke('tasks:getAllGrouped'),

  // ─── TaskGroups ───────────────────────────────────────────────
  // ─── getTaskGroups() – Pobiera wszystkie grupy zadań
  getTaskGroups:        ()                    => ipcRenderer.invoke('taskGroups:getAll'),
  // ─── createTaskGroup(data) – Tworzy nową grupę zadań
  createTaskGroup:      (data)               => ipcRenderer.invoke('taskGroups:create', data),
  // ─── updateTaskGroup(id, patch) – Aktualizuje grupę
  updateTaskGroup:      (id, patch)          => ipcRenderer.invoke('taskGroups:update', { id, patch }),
  // ─── deleteTaskGroup(id) – Usuwa grupę
  deleteTaskGroup:      (id)                 => ipcRenderer.invoke('taskGroups:delete', { id }),
  // ─── getTaskGroupForProfile(profileId) – Zwraca grupę dla profilu lub null
  getTaskGroupForProfile: (profileId)        => ipcRenderer.invoke('taskGroups:getForProfile', { profileId }),
  // ─── ensureTaskGroupForProfile(profileId, profileName) – Zwraca lub tworzy domyślną grupę 1:1
  ensureTaskGroupForProfile: (profileId, profileName) => ipcRenderer.invoke('taskGroups:ensureForProfile', { profileId, profileName }),
  // ─── assignProfileToTaskGroup(groupId, profileId) – Przypisuje profil do grupy
  assignProfileToTaskGroup: (groupId, profileId)      => ipcRenderer.invoke('taskGroups:assignProfile', { groupId, profileId }),
  // ─── unassignProfileFromTaskGroup(profileId) – Odłącza profil od grupy
  unassignProfileFromTaskGroup: (profileId)           => ipcRenderer.invoke('taskGroups:unassignProfile', { profileId }),

  
  // ─── History ──────────────────────────────────────────────────
  // ─── getHistory() – Pobiera historię aktywności
  getHistory:   ()      => ipcRenderer.invoke('history:getAll'),
  // ─── addHistory(entry) – Dodaje nowy wpis do historii
  addHistory:   (entry) => ipcRenderer.invoke('history:add', entry),
  // ─── clearHistory() – Czyści historię aktywności
  clearHistory: ()      => ipcRenderer.invoke('history:clear'),
  
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
  createTerminal: (cwd)              => ipcRenderer.invoke('terminal:create', { cwd }),
  // ─── terminalWrite(id, data) – Przesyła dane do wejścia terminala
  terminalWrite:  (id, data)         => ipcRenderer.invoke('terminal:write', { terminalId: id, data }),
  // ─── terminalResize(id, cols, rows) – Zmienia wymiary okna terminala
  terminalResize: (id, cols, rows)   => ipcRenderer.invoke('terminal:resize', { terminalId: id, cols, rows }),
  // ─── killTerminal(id) – Zamyka proces terminala
  killTerminal:   (id)               => ipcRenderer.invoke('terminal:kill', id),
  
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
  // ─── appendLogFile(payload) – Dopisuje dane do pliku logów aplikacji [legacy — użyj logsAppend]
  appendLogFile: (payload) => ipcRenderer.invoke('append-log-file', payload),
  // ─── getLogsFile() – Odczytuje zawartość pliku logów [legacy — użyj logsGet]
  getLogsFile: () => ipcRenderer.invoke('get-logs-file'),
  // ─── clearLogsFile() – Usuwa zawartość pliku logów [legacy — użyj logsClear]
  clearLogsFile: () => ipcRenderer.invoke('clear-logs-file'),
  // ─── logsAppend(payload) – nowa nazwa (Sprint 2): logs:append
  logsAppend: (payload) => ipcRenderer.invoke('logs:append', payload),
  // ─── logsGet() – nowa nazwa (Sprint 2): logs:get
  logsGet: () => ipcRenderer.invoke('logs:get'),
  // ─── logsClear() – nowa nazwa (Sprint 2): logs:clear
  logsClear: () => ipcRenderer.invoke('logs:clear'),

  // ─── Cookie Grabber ───────────────────────────────────────────
  // ─── getCookies(partition) – Pobiera ciasteczka dla wybranej partycji WebView
  getCookies: (partition) => ipcRenderer.invoke('tools:getCookies', partition),

  // ─── Single App Mode, Screenshot, Resource Monitor ───────────
  // ─── openSingleWindow(payload) – Otwiera stronę w osobnym oknie [legacy — użyj webviewOpenSingle]
  openSingleWindow: (payload) => ipcRenderer.invoke('open-single-window', payload),
  // ─── captureWebView(tabId) – Przechwytuje obraz widoku WebView [legacy — użyj webviewCapture]
  captureWebView: (tabId) => ipcRenderer.invoke('capture-webview', tabId),
  // ─── getWebViewResourceInfo(tabId) – Pobiera informacje o zużyciu RAM/CPU [legacy — użyj webviewGetResource]
  getWebViewResourceInfo: (tabId) => ipcRenderer.invoke('get-webview-resource', tabId),
  // ─── webviewOpenSingle(payload) – nowa nazwa (Sprint 2): webview:openSingle
  webviewOpenSingle: (payload) => ipcRenderer.invoke('webview:openSingle', payload),
  // ─── webviewCapture(tabId) – nowa nazwa (Sprint 2): webview:capture
  webviewCapture: (tabId) => ipcRenderer.invoke('webview:capture', tabId),
  // ─── webviewGetResource(tabId) – nowa nazwa (Sprint 2): webview:getResource
  webviewGetResource: (tabId) => ipcRenderer.invoke('webview:getResource', tabId),

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

   // ─── WebView HTTP Errors ──────────────────────────────────────
   // ─── startWebviewHttpMonitor(partition) – rejestruje monitor HTTP 4xx/5xx dla partycji WebView
   startWebviewHttpMonitor: (partition) => ipcRenderer.invoke('webview:startHttpMonitor', partition),
   // ─── onWebviewHttpError(callback) – nasłuchuje błędów HTTP 4xx/5xx z WebView; zwraca cleanup
   onWebviewHttpError: (callback) => {
     const listener = (_, payload) => callback(payload);
     ipcRenderer.on('webview:http-error', listener);
     return () => ipcRenderer.removeListener('webview:http-error', listener);
   },

   // ─── WebView registry (dla screenshot/resource) ───────────────
   // ─── registerWebView(tabId, webContentsId) – Rejestruje mapowanie karty na ID Electron
   registerWebView: (tabId, webContentsId) => ipcRenderer.invoke('register-webview', tabId, webContentsId),
   // ─── unregisterWebView(tabId) – Usuwa mapowanie karty
   unregisterWebView: (tabId) => ipcRenderer.invoke('unregister-webview', tabId),

  // ─── Generic invoke (dla nowych kanałów namespaced) ───────────
  // ─── invoke(channel, ...args) – Wykonuje dowolne wywołanie kanału IPC
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args)
});

