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
  getProfiles: () => ipcRenderer.invoke('profiles:getAll'),

  // ─── Notepad ──────────────────────────────────────────────────
  // ─── getNotepad() – Pobiera wszystkie wpisy notepad
  getNotepad:         ()          => ipcRenderer.invoke('notepad:getAll'),
  // ─── addNotepadEntry(entry) – Dodaje nowy wpis do notepad
  addNotepadEntry:    (entry)     => ipcRenderer.invoke('notepad:add', entry),
  // ─── updateNotepadEntry(id, patch) – Aktualizuje wpis notepad
  updateNotepadEntry: (id, patch) => ipcRenderer.invoke('notepad:update', { id, patch }),
  // ─── deleteNotepadEntry(id) – Usuwa wpis notepad
  deleteNotepadEntry: (id)        => ipcRenderer.invoke('notepad:delete', id),

  // ─── Settings ─────────────────────────────────────────────────
  // ─── getSettings() – Pobiera aktualną konfigurację użytkownika
  getSettings:  ()      => ipcRenderer.invoke('settings:get'),
  // ─── saveSettings(patch) – Aktualizuje ustawienia (mechanizm merge)
  saveSettings: (patch) => ipcRenderer.invoke('settings:update', patch),
  // ─── resetSettings() – Przywraca ustawienia do stanu domyślnego
  resetSettings: ()     => ipcRenderer.invoke('settings:reset'),
  // ─── setDebugMode(enabled) – Przełącza globalny tryb debugowania
  setDebugMode: (enabled) => ipcRenderer.invoke('settings:update', { debugMode: enabled }),
  // ─── setDebugModule(moduleName, enabled) – Przełącza tryb debug dla konkretnego modułu
  setDebugModule: (moduleName, enabled) => ipcRenderer.invoke('settings:update', {
    debugModules: { [moduleName]: enabled }
  }),

  // ─── Tasks ────────────────────────────────────────────────────
  // ─── getTasks(taskGroupId?) – Pobiera płaską listę zadań dla grupy lub wszystkich
  getTasks:   (taskGroupId) => ipcRenderer.invoke('tasks:getAll', taskGroupId),
  // ─── getAllTasks() – Pobiera zadania pogrupowane per taskGroupId (dla AggregatedTasks)
  getAllTasks: ()            => ipcRenderer.invoke('tasks:getAllGrouped'),

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
  getTaskGroupForProfile:       (profileId)             => ipcRenderer.invoke('taskGroups:getForProfile', { profileId }),
  // ─── ensureTaskGroupForProfile(profileId, profileName) – Zwraca lub tworzy domyślną grupę 1:1
  ensureTaskGroupForProfile:    (profileId, profileName) => ipcRenderer.invoke('taskGroups:ensureForProfile', { profileId, profileName }),
  // ─── assignProfileToTaskGroup(groupId, profileId) – Przypisuje profil do grupy
  assignProfileToTaskGroup:     (groupId, profileId)    => ipcRenderer.invoke('taskGroups:assignProfile', { groupId, profileId }),
  // ─── unassignProfileFromTaskGroup(profileId) – Odłącza profil od grupy
  unassignProfileFromTaskGroup: (profileId)              => ipcRenderer.invoke('taskGroups:unassignProfile', { profileId }),

  // ─── History ──────────────────────────────────────────────────
  // ─── getHistory() – Pobiera historię aktywności
  getHistory:   ()      => ipcRenderer.invoke('history:getAll'),
  // ─── addHistory(entry) – Dodaje nowy wpis do historii
  addHistory:   (entry) => ipcRenderer.invoke('history:add', entry),
  // ─── clearHistory() – Czyści historię aktywności
  clearHistory: ()      => ipcRenderer.invoke('history:clear'),

  // ─── WebView ──────────────────────────────────────────────────
  // ─── clearProfileCache(id) – Czyści pamięć podręczną (cache) dla profilu
  //   Kanał: webview:clearCache (handler: ipcMainHandlers_webview_cache.js)
  clearProfileCache: (id) => ipcRenderer.invoke('webview:clearCache', id),

  // ─── registerWebView(tabId, webContentsId) – Rejestruje mapowanie karty na ID Electron WebContents
  //   Kanał: webview:register (handler: ipcMainHandlers_webview_registry.js)
  //   Wywołaj po zamontowaniu <webview>: webviewEl.getWebContentsId()
  registerWebView: (tabId, webContentsId) => ipcRenderer.invoke('webview:register', tabId, webContentsId),
  // ─── unregisterWebView(tabId) – Usuwa mapowanie karty z rejestru (cleanup)
  //   Kanał: webview:unregister (handler: ipcMainHandlers_webview_registry.js)
  unregisterWebView: (tabId) => ipcRenderer.invoke('webview:unregister', tabId),

  // ─── openSingleWindow(payload) – Otwiera stronę w osobnym oknie (Single App Mode)
  //   Kanał: webview:openSingle (handler: ipcMainHandlers_webview_tools.js)
  openSingleWindow: (payload) => ipcRenderer.invoke('webview:openSingle', payload),
  // ─── captureWebView(tabId) – Przechwytuje zrzut ekranu WebView
  //   Kanał: webview:capture (handler: ipcMainHandlers_webview_tools.js)
  //   Wymaga wcześniejszego registerWebView dla tabId
  captureWebView: (tabId) => ipcRenderer.invoke('webview:capture', { tabId }),
  // ─── getWebViewResourceInfo(tabId) – Pobiera informacje o zużyciu RAM/CPU WebView
  //   Kanał: webview:getResource (handler: ipcMainHandlers_webview_tools.js)
  //   Wymaga wcześniejszego registerWebView dla tabId
  getWebViewResourceInfo: (tabId) => ipcRenderer.invoke('webview:getResource', { tabId }),

  // ─── WebView HTTP Errors ──────────────────────────────────────
  // ─── startWebviewHttpMonitor(partition) – rejestruje monitor HTTP 4xx/5xx dla partycji WebView
  startWebviewHttpMonitor: (partition) => ipcRenderer.invoke('webview:startHttpMonitor', partition),
  // ─── onWebviewHttpError(callback) – nasłuchuje błędów HTTP 4xx/5xx z WebView; zwraca cleanup
  onWebviewHttpError: (callback) => {
    const listener = (_, payload) => callback(payload);
    ipcRenderer.on('webview:http-error', listener);
    return () => ipcRenderer.removeListener('webview:http-error', listener);
  },

  // ─── Updates & version ────────────────────────────────────────
  // ─── getAppVersion() – Pobiera informacje o aplikacji (nazwa, wersja, ścieżka)
  //   Kanał: app:getInfo (handler: ipcMainHandlers_appInfo.js)
  //   Zwraca: { ok, data: { name, version, path, isPackaged } }
  getAppVersion: () => ipcRenderer.invoke('app:getInfo'),
  // ─── checkForUpdates() – [PLACEHOLDER] Auto-update niezaimplementowany
  //   Kanał: app:checkUpdates (brak handlera — future feature)
  checkForUpdates: () => ipcRenderer.invoke('app:checkUpdates'),

  // ─── File dialogs ─────────────────────────────────────────────
  // ─── saveTextToFile(content, name, folder) – Otwiera dialog zapisu tekstu do pliku
  //   Kanał: files:saveText (handler: ipcMainHandlers_files.js)
  saveTextToFile: (content, name, folder) => ipcRenderer.invoke('files:saveText', content, name, folder),
  // ─── saveFile(payload) – Zapisuje dane binarne do pliku przez dialog
  //   Kanał: files:saveBinary (handler: ipcMainHandlers_files.js)
  saveFile: (payload) => ipcRenderer.invoke('files:saveBinary', payload),

  // ─── Terminal ─────────────────────────────────────────────────
  // ─── createTerminal(cwd) – Tworzy nową sesję terminala w podanej ścieżce
  createTerminal:    (cwd)            => ipcRenderer.invoke('terminal:create', { cwd }),
  // ─── terminalWrite(id, data) – Przesyła dane do wejścia terminala
  terminalWrite:     (id, data)       => ipcRenderer.invoke('terminal:write', { terminalId: id, data }),
  // ─── terminalResize(id, cols, rows) – Zmienia wymiary okna terminala
  terminalResize:    (id, cols, rows) => ipcRenderer.invoke('terminal:resize', { terminalId: id, cols, rows }),
  // ─── killTerminal(id) – Zamyka proces terminala
  killTerminal:      (id)             => ipcRenderer.invoke('terminal:kill', id),
  // ─── terminalGetBuffer(id) – Pobiera bufor historii terminala (np. po reconnect)
  terminalGetBuffer: (id)             => ipcRenderer.invoke('terminal:getBuffer', id),
  // ─── terminalRestart(id, cwd) – Restartuje sesję terminala zachowując cwd
  terminalRestart:   (id, cwd)        => ipcRenderer.invoke('terminal:restart', { terminalId: id, cwd }),

  // ─── onTerminalData(callback) – Rejestruje słuchacz strumienia danych z terminala; zwraca cleanup
  onTerminalData: (callback) => {
    const listener = (_, payload) => callback(payload);
    ipcRenderer.on('terminal-data', listener);
    return () => ipcRenderer.removeListener('terminal-data', listener);
  },
  // ─── onTerminalExit(callback) – Rejestruje słuchacz zakończenia procesu terminala; zwraca cleanup
  onTerminalExit: (callback) => {
    const listener = (_, code) => callback(code);
    ipcRenderer.on('terminal:exit', listener);
    return () => ipcRenderer.removeListener('terminal:exit', listener);
  },

  // ─── Misc ─────────────────────────────────────────────────────
  // ─── openExternal(url) – Otwiera link w zewnętrznej przeglądarce systemowej
  openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url),

  // ─── App lifecycle ────────────────────────────────────────────
  // ─── confirmQuit() – Potwierdza zamknięcie aplikacji po zgodzie użytkownika
  //   Kanał: app:confirmQuit (handler: ipcMainHandlers_app.js)
  confirmQuit: () => ipcRenderer.invoke('app:confirmQuit'),
  // ─── onCheckBeforeQuit(callback) – Rejestruje słuchacz sprawdzający stan przed zamknięciem; zwraca cleanup
  onCheckBeforeQuit: (callback) => {
    const listener = () => callback();
    ipcRenderer.on('check-before-quit', listener);
    return () => ipcRenderer.removeListener('check-before-quit', listener);
  },

  // ─── Logs (logWriter) ─────────────────────────────────────────
  // ─── appendLogFile(payload) – Dopisuje dane do pliku logów testów
  //   Kanał: logs:append (handler: ipcMainHandlers_logs.js)
  //   Używany przez: src/utils/logWriter.js → appendTestFailLog()
  appendLogFile: (payload) => ipcRenderer.invoke('logs:append', payload),
  // ─── getLogsFile() – Odczytuje zawartość pliku logów testów
  //   Kanał: logs:get (handler: ipcMainHandlers_logs.js)
  //   Używany przez: src/utils/logWriter.js → getLogsContent()
  getLogsFile: () => ipcRenderer.invoke('logs:get'),
  // ─── clearLogsFile() – Czyści zawartość pliku logów testów
  //   Kanał: logs:clear (handler: ipcMainHandlers_logs.js)
  //   Używany przez: src/utils/logWriter.js → clearLogsFile()
  clearLogsFile: () => ipcRenderer.invoke('logs:clear'),
  // Aliasy dla LogsSection.jsx (logsGet / logsClear)
  logsGet:   () => ipcRenderer.invoke('logs:get'),
  logsClear: () => ipcRenderer.invoke('logs:clear'),

  // ─── Cookie Grabber ───────────────────────────────────────────
  // ─── getCookies(partition) – Pobiera ciasteczka dla wybranej partycji WebView
  getCookies: (partition) => ipcRenderer.invoke('cookies:getAll', { partition }),

  // ─── Hotkeys ──────────────────────────────────────────────────
  // ─── getHotkeys() – Pobiera listę zdefiniowanych skrótów klawiszowych
  getHotkeys:            ()         => ipcRenderer.invoke('hotkeys:getAll'),
  // ─── saveHotkeys(hotkeys) – Zapisuje listę skrótów klawiszowych
  saveHotkeys:           (hotkeys)  => ipcRenderer.invoke('hotkeys:save', hotkeys),
  // ─── registerGlobalHotkeys(hotkeys) – Rejestruje skróty klawiszowe w systemie
  registerGlobalHotkeys: (hotkeys)  => ipcRenderer.invoke('hotkeys:register', hotkeys),
  // ─── onHotkeyTrigger(callback) – Rejestruje słuchacz naciśnięcia skrótu; zwraca cleanup
  onHotkeyTrigger: (callback) => {
    const listener = (_, data) => callback(data);
    ipcRenderer.on('hotkey:trigger', listener);
    return () => ipcRenderer.removeListener('hotkey:trigger', listener);
  },

  // ─── AdBlocker ────────────────────────────────────────────────
  // ─── setGlobalAdBlocker(enabled) – Ustawia stan globalnego blokera reklam
  setGlobalAdBlocker:     (enabled)            => ipcRenderer.invoke('adblocker:setGlobal', enabled),
  // ─── getGlobalAdBlocker() – Pobiera stan globalnego blokera reklam
  getGlobalAdBlocker:     ()                   => ipcRenderer.invoke('adblocker:getGlobal'),
  // ─── setAdBlockerForProfile(profileId, enabled) – Ustawia bloker reklam dla profilu
  setAdBlockerForProfile: (profileId, enabled) => ipcRenderer.invoke('adblocker:setForProfile', profileId, enabled),
  // ─── getAdBlockerForProfile(profileId) – Pobiera stan blokera reklam dla profilu
  getAdBlockerForProfile: (profileId)          => ipcRenderer.invoke('adblocker:getForProfile', profileId),

  // ─── Sleep Tabs ───────────────────────────────────────────────
  // ─── setSleepTimeout(minutes) – Ustawia czas bezczynności przed uśpieniem karty
  setSleepTimeout: (minutes) => ipcRenderer.invoke('sleeptabs:setTimeout', minutes),
  // ─── getSleepTimeout() – Pobiera czas bezczynności przed uśpieniem
  getSleepTimeout: ()        => ipcRenderer.invoke('sleeptabs:getTimeout'),

  // ─── Generic invoke ───────────────────────────────────────────
  // ─── invoke(channel, ...args) – Wykonuje dowolne wywołanie kanału IPC
  //   Używany przez: logWriter.js, DataLogsSection, inne pliki niekorzystające z dedykowanych metod
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args)
});
