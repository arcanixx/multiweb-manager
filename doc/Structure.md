<!-- =============================================================================
 FILE: Structure.md
 PATH: doc/Structure.md
 VERSION: 0.0.3
 PURPOSE: Dokumentacja specyfikacji projektowej - Struktura projektu + mapowanie
          modułów, feature'ów i odpowiedzialności.
 FUNCTIONS: -
 DEPENDS ON: DevelopersGuide.md
 UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
 ============================================================================= -->
<!--
  AI Important! Sekcja drzewa (do <!-- OTHER SECTIONS -->) jest generowana automatycznie
  przez build_structure.py — NIE edytować ręcznie tej sekcji.
  Sekcja po <!-- OTHER SECTIONS --> jest obecnie statyczna i można ją edytować dla aktualizacji.
-->

root/
├── 📁 assets/
│   ├── 🖼️ app-icon.ico                           <!-- VERSION: - PATH: assets/app-icon.ico
│   │                                                   PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│   │                                                            pomocniczej.
│   │                                                   FUNCTIONS: -
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 🖼️ app-icon.png                           <!-- VERSION: - PATH: assets/app-icon.png
│   │                                                   PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│   │                                                            pomocniczej.
│   │                                                   FUNCTIONS: -
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   └── 🖼️ multiweb_manager_architecture_graph.png <!-- VERSION: - PATH: assets/multiweb_manager_architecture_graph.png
│                                                       PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│                                                                pomocniczej.
│                                                       FUNCTIONS: -
│                                                       DEPENDS ON: -
│                                                       -->
├── 📁 doc/
│   ├── 📄 AI_Development_Standards.md             <!-- VERSION: 0.0.3 PATH: doc/AI_Development_Standards.md
│   │                                                   PURPOSE: Dokumentacja specyfikacji projektowej - Standardy
│   │                                                            tworzenia i modyfikacji kodu
│   │                                                   FUNCTIONS: Dokumentacja: 21 sekcji głównych
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 📄 AI_Repository_Access.md                 <!-- VERSION: 0.0.3 PATH: doc/AI_Repository_Access.md
│   │                                                   PURPOSE: Dokumentacja specyfikacji projektowej - Mapowanie
│   │                                                            bezpośrednich odnośników RAW dla modeli AI (Claude).
│   │                                                   FUNCTIONS: -
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 📄 Definition_Mockups_UI_UX.md             <!-- VERSION: 0.0.3 PATH: doc/Definition_Mockups_UI_UX.md
│   │                                                   PURPOSE: Dokumentacja specyfikacji projektowej - Kompletny opis
│   │                                                            UI/UX aplikacji MultiWeb Manager (do np. Figma)
│   │                                                   FUNCTIONS: Dokumentacja: 41 sekcji głównych
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 📄 DevelopersGuide.md                      <!-- VERSION: 0.0.3 PATH: doc/DevelopersGuide.md
│   │                                                   PURPOSE: Dokumentacja specyfikacji projektowej - Kompletny
│   │                                                            przewodnik developerski MultiWeb Manager
│   │                                                   FUNCTIONS: Dokumentacja: 17 sekcji głównych
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 📄 Global_Project_Starter_Guide.md         <!-- VERSION: 0.0.3 PATH: doc/Global_Project_Starter_Guide.md
│   │                                                   PURPOSE: Dokumentacja specyfikacji projektowej - Globalny
│   │                                                            przewodnik inicjalizacji projektów (AI First)
│   │                                                   FUNCTIONS: Dokumentacja: 15 sekcji głównych
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 📄 ModulesOverview.md                      <!-- VERSION: 0.0.3 PATH: doc/ModulesOverview.md
│   │                                                   PURPOSE: Dokumentacja specyfikacji projektowej - Ujednolicona
│   │                                                            lista modułów + opis przeznaczenia dla AI i devów
│   │                                                   FUNCTIONS: Dokumentacja: 78 sekcji głównych
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 📄 Project_Initialization_Guide.md         <!-- VERSION: 0.0.3 PATH: doc/Project_Initialization_Guide.md
│   │                                                   PURPOSE: Dokumentacja specyfikacji projektowej - Kompletny
│   │                                                            przewodnik startowy — jak rozpocząć nowy projekt
│   │                                                            (AI-first)
│   │                                                   FUNCTIONS: Dokumentacja: 12 sekcji głównych
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 📄 Requirements.md                         <!-- VERSION: 0.0.3 PATH: doc/Requirements.md
│   │                                                   PURPOSE: Dokumentacja specyfikacji projektowej - Wymagania
│   │                                                            aplikacji z aktualnymi statusami, priorytetami i
│   │                                                            komentarzami
│   │                                                   FUNCTIONS: Dokumentacja: 17 sekcji głównych
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 📄 Structure.md                            <!-- VERSION: - PATH: doc/Structure.md
│   │                                                   PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│   │                                                            pomocniczej.
│   │                                                   FUNCTIONS: -
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   └── 📄 pending_updates_for_Definition_Mockups_UI_UX.md <!-- VERSION: 0.0.3 PATH: doc/pending_updates_for_Definition_Mockups_UI_UX.md
│                                                       PURPOSE: Dokumentacja specyfikacji projektowej - Kolejka
│                                                                oczekujących zmian UI/UX do scalenia z
│                                                                Definition_Mockups_UI_UX.md.           AI dopisuje tu
│                                                                bieżące modyfikacje interfejsu wynikające z nowych
│                                                                funkcji w trakcie sprintu.           Scalanie zbiorcze
│                                                                raz na kilkanaście/kilkadziesiąt commitów.
│                                                       FUNCTIONS: -
│                                                       DEPENDS ON: -
│                                                       -->
├── 📁 public/
│   └── 🌐 index.html                              <!-- VERSION: 0.0.3 PATH: public/index.html
│                                                       PURPOSE: Główny plik html aplikacji dla WebView
│                                                       FUNCTIONS: -
│                                                       DEPENDS ON: -
│                                                       -->
├── 📁 src/
│   ├── 📁 core/
│   │   ├── 📜 accountsStore.js ❗                  <!-- VERSION: 0.0.3 PATH: src/core/accountsStore.js
│   │   │                                               PURPOSE: Zarządzanie kontami użytkownika (Google, GitHub, AI,
│   │   │                                                        itp.) – obsługa trwałości i operacji CRUD na danych
│   │   │                                                        kont.
│   │   │                                               FUNCTIONS: getAllAccounts, addAccount, updateAccount,
│   │   │                                                          deleteAccount
│   │   │                                               DEPENDS ON: fs, path, electron, logger.js
│   │   │                                               -->
│   │   ├── 📜 appLibraryStore.js ❗                <!-- VERSION: 0.0.3 PATH: src/core/appLibraryStore.js
│   │   │                                               PURPOSE: Statyczna App Library (WebCatalog-style) — odczyt,
│   │   │                                                        cache'owanie i filtrowanie aplikacji z pliku JSON
│   │   │                                                        (loadAppLibrary, filterApps, searchAppLibrary,
│   │   │                                                        getAppById).
│   │   │                                               FUNCTIONS: loadAppLibrary, filterApps, searchAppLibrary,
│   │   │                                                          getAppById
│   │   │                                               DEPENDS ON: fs, path, url, logger.js
│   │   │                                               -->
│   │   ├── 📜 clipboardStore.js ❗                 <!-- VERSION: 0.0.3 PATH: src/core/clipboardStore.js
│   │   │                                               PURPOSE: Zarządzanie historią schowka systemowego – dodawanie,
│   │   │                                                        pobieranie i czyszczenie wpisów tekstowych.
│   │   │                                               FUNCTIONS: addClipboardEntry, getClipboardHistory,
│   │   │                                                          clearClipboardHistory
│   │   │                                               DEPENDS ON: electron, config.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 historyStore.js ❗                   <!-- VERSION: 0.0.3 PATH: src/core/historyStore.js
│   │   │                                               PURPOSE: Zarządzanie historią akcji użytkownika – odczyt, zapis,
│   │   │                                                        dodawanie wpisów, czyszczenie i pobieranie ostatnich
│   │   │                                                        wpisów.
│   │   │                                               FUNCTIONS: loadHistory, saveHistory, addHistoryEntry,
│   │   │                                                          clearHistory, getRecentHistory
│   │   │                                               DEPENDS ON: config.js, persistence.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 notesStore.js ❗                     <!-- VERSION: 0.0.3 PATH: src/core/notesStore.js
│   │   │                                               PURPOSE: Zarządzanie notatkami użytkownika – ładowanie,
│   │   │                                                        zapisywanie oraz operacje CRUD na danych notatek.
│   │   │                                               FUNCTIONS: getAllNotes, addNote, updateNote, deleteNote
│   │   │                                               DEPENDS ON: fs, path, electron, logger.js
│   │   │                                               -->
│   │   ├── 📜 persistence.js ❗                    <!-- VERSION: 0.0.3 PATH: src/core/persistence.js
│   │   │                                               PURPOSE: Wspólne operacje I/O dla plików JSON – odczyt, zapis i
│   │   │                                                        zarządzanie ścieżkami w katalogu userData Electrona.
│   │   │                                               FUNCTIONS: getUserDataPath, readJsonFile, writeJsonFile
│   │   │                                               DEPENDS ON: fs, path, electron, logger.js
│   │   │                                               -->
│   │   ├── 📜 profilesStore.js ❗                  <!-- VERSION: 0.0.3 PATH: src/core/profilesStore.js
│   │   │                                               PURPOSE: Zarządzanie profilami WebView — odczyt z pliku, zapis,
│   │   │                                                        tworzenie, aktualizacja i usuwanie (loadProfiles,
│   │   │                                                        saveProfiles, createProfile, updateProfile,
│   │   │                                                        deleteProfile).
│   │   │                                               FUNCTIONS: loadProfiles, saveProfiles, createProfile,
│   │   │                                                          updateProfile, deleteProfile
│   │   │                                               DEPENDS ON: fs, path, url, persistence.js, logger.js, config.js
│   │   │                                               -->
│   │   ├── 📜 projectsStore.js ❗                  <!-- VERSION: 0.0.3 PATH: src/core/projectsStore.js
│   │   │                                               PURPOSE: Projekty (ProjectManager, AggregatedTasks) — plik
│   │   │                                                        projects.json.
│   │   │                                               FUNCTIONS: loadProjects, saveProjects, createProject,
│   │   │                                                          updateProject, archiveProject, deleteProject
│   │   │                                               DEPENDS ON: persistence.js, settingsStore.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 resourceMonitor.js ❗                <!-- VERSION: 0.0.3 PATH: src/core/resourceMonitor.js
│   │   │                                               PURPOSE: Serwis monitorujący zużycie zasobów systemowych
│   │   │                                                        (CPU/RAM) przez aplikację i system operacyjny.
│   │   │                                               FUNCTIONS: getSystemUsage
│   │   │                                               DEPENDS ON: os, config.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 settingsStore.js ❗                  <!-- VERSION: 0.0.3 PATH: src/core/settingsStore.js
│   │   │                                               PURPOSE: Ustawienia użytkownika — merge partial updates, reset
│   │   │                                                        do domyślnych.
│   │   │                                               FUNCTIONS: loadSettings, saveSettings, mergeSettings,
│   │   │                                                          updateSettings, resetSettings
│   │   │                                               DEPENDS ON: lodash, fs, path, url, config.js, persistence.js,
│   │   │                                                           logger.js
│   │   │                                               -->
│   │   ├── 📜 tasksStore.js ❗                     <!-- VERSION: 0.0.3 PATH: src/core/tasksStore.js
│   │   │                                               PURPOSE: Zadania per projekt (TaskPanel, AggregatedTasks).
│   │   │                                               FUNCTIONS: loadTasksSections, loadTasksByProject,
│   │   │                                                          saveTasksForProject, loadAllTasksGrouped, loadTasks
│   │   │                                               DEPENDS ON: fs, persistence.js, logger.js
│   │   │                                               -->
│   │   └── 📜 workspacesStore.js ❗                <!-- VERSION: 0.0.3 PATH: src/core/workspacesStore.js
│   │                                                   PURPOSE: Zarządzanie przestrzeniami roboczymi (workspaces)
│   │                                                            użytkownika – ładowanie, zapisywanie oraz operacje typu
│   │                                                            upsert.
│   │                                                   FUNCTIONS: getAllWorkspaces, saveWorkspace, saveWorkspaces,
│   │                                                              deleteWorkspace
│   │                                                   DEPENDS ON: fs, path, electron, logger.js
│   │                                                   -->
│   ├── 📁 data/
│   │   ├── 📦 app-library.json                    <!-- VERSION: 0.0.3 PATH: src/data/app-library.json
│   │   │                                               PURPOSE: Plik danych / tłumaczeń
│   │   │                                               FUNCTIONS: -
│   │   │                                               DEPENDS ON: -
│   │   │                                               -->
│   │   ├── 📦 defaultProfiles.json                <!-- VERSION: 0.0.3 PATH: src/data/defaultProfiles.json
│   │   │                                               PURPOSE: Domyślne profile użytkownika (template)
│   │   │                                               FUNCTIONS: -
│   │   │                                               DEPENDS ON: -
│   │   │                                               -->
│   │   ├── 📦 defaultSettings.json                <!-- VERSION: 0.0.3 PATH: src/data/defaultSettings.json
│   │   │                                               PURPOSE: Domyślne ustawienia aplikacji
│   │   │                                               FUNCTIONS: -
│   │   │                                               DEPENDS ON: -
│   │   │                                               -->
│   │   └── 📜 icons.js                            <!-- VERSION: 0.0.3 PATH: src/data/icons.js
│   │                                                   PURPOSE: Centralny rejestr wszystkich ikon używanych w
│   │                                                            aplikacji.
│   │                                                   FUNCTIONS: -
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 📁 engine/
│   │   ├── 📜 adBlocker.js ❗                      <!-- VERSION: 0.0.3 PATH: src/engine/adBlocker.js
│   │   │                                               PURPOSE: Implementacja blokowania reklam na poziomie sieciowym
│   │   │                                                        (webRequest) – wspiera ustawienia globalne i
│   │   │                                                        nadpisywanie per-profil.
│   │   │                                               FUNCTIONS: isAdUrl, setGlobalAdBlocker, getGlobalAdBlocker,
│   │   │                                                          setProfileAdBlocker, getProfileAdBlocker,
│   │   │                                                          initAdBlocker
│   │   │                                               DEPENDS ON: electron, config.js, logger.js, webviewRegistry.js
│   │   │                                               -->
│   │   ├── 📜 hotkeysManager.js ❗                 <!-- VERSION: 0.0.3 PATH: src/engine/hotkeysManager.js
│   │   │                                               PURPOSE: Zarządzanie globalnymi skrótami klawiszowymi w procesie
│   │   │                                                        głównym. Obsługuje rejestrację w OS i dispatch zdarzeń
│   │   │                                                        IPC do renderera.
│   │   │                                               FUNCTIONS: setMainWindow, unregisterAllHotkeys,
│   │   │                                                          registerGlobalHotkeys, getAllHotkeys, saveHotkeys,
│   │   │                                                          registerHotkeysFromList
│   │   │                                               DEPENDS ON: electron, config.js, logger.js, electron-store
│   │   │                                               -->
│   │   ├── 📜 sleepTabsManager.js ❗               <!-- VERSION: 0.0.3 PATH: src/engine/sleepTabsManager.js
│   │   │                                               PURPOSE: Logika zarządzania stanem bezczynności WebView –
│   │   │                                                        obliczanie timeoutów i weryfikacja gotowości do
│   │   │                                                        uśpienia.
│   │   │                                               FUNCTIONS: getSleepTimeoutMs, shouldSleepTab, markTabActive,
│   │   │                                                          getSleepPlaceholderState
│   │   │                                               DEPENDS ON: config.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 updateService.js ❗                  <!-- VERSION: 0.0.3 PATH: src/engine/updateService.js
│   │   │                                               PURPOSE: Placeholder sprawdzania aktualizacji (UpdateChecker UI
│   │   │                                                        → docelowo API).
│   │   │                                               FUNCTIONS: checkForUpdates
│   │   │                                               DEPENDS ON: logger.js
│   │   │                                               -->
│   │   └── 📜 webviewRegistry.js ❗                <!-- VERSION: 0.0.3 PATH: src/engine/webviewRegistry.js
│   │                                                   PURPOSE: Rejestracja WebView (mapy tabId ↔ webContentsId)
│   │                                                   FUNCTIONS: registerWebView, unregisterWebView, getWebViewEntry,
│   │                                                              getAllWebContents
│   │                                                   DEPENDS ON: logger.js, electron
│   │                                                   -->
│   ├── 📁 hooks/
│   │   ├── 📜 useHistoryLog.js ❗                  <!-- VERSION: 0.0.3 PATH: src/hooks/useHistoryLog.js
│   │   │                                               PURPOSE: Hook React do zarządzania i odświeżania logów historii
│   │   │                                                        aktywności użytkownika. Komunikuje się z historyStore
│   │   │                                                        przez mostek IPC.
│   │   │                                               FUNCTIONS: useHistoryLog
│   │   │                                               DEPENDS ON: react, loggerRenderer.js
│   │   │                                               -->
│   │   ├── 📜 useNotepad.js ❗                     <!-- VERSION: 0.0.3 PATH: src/hooks/useNotepad.js
│   │   │                                               PURPOSE: Hook React do zarządzania notatkami użytkownika –
│   │   │                                                        obsługa operacji CRUD (Create, Read, Update, Delete)
│   │   │                                                        przez mostek IPC.
│   │   │                                               FUNCTIONS: useNotepad
│   │   │                                               DEPENDS ON: react, loggerRenderer.js
│   │   │                                               -->
│   │   ├── 📜 useNotepadFindReplace.js ❗          <!-- VERSION: 0.0.3 PATH: src/hooks/useNotepadFindReplace.js
│   │   │                                               PURPOSE: Hook React obsługujący logikę wyszukiwania i
│   │   │                                                        zastępowania tekstu w edytorze notatnika.
│   │   │                                               FUNCTIONS: useNotepadFindReplace
│   │   │                                               DEPENDS ON: react, translations.js, loggerRenderer.js
│   │   │                                               -->
│   │   ├── 📜 useNotepadUI.js ❗                   <!-- VERSION: 0.0.3 PATH: src/hooks/useNotepadUI.js
│   │   │                                               PURPOSE: Hook React do zarządzania interfejsem notatnika –
│   │   │                                                        obsługa zakładek, automatycznego zapisu oraz skrótów
│   │   │                                                        klawiszowych.
│   │   │                                               FUNCTIONS: useNotepadUI
│   │   │                                               DEPENDS ON: react, translations.js, notesStorage.js,
│   │   │                                                           loggerRenderer.js
│   │   │                                               -->
│   │   ├── 📜 useProjects.js ❗                    <!-- VERSION: 0.0.3 PATH: src/hooks/useProjects.js
│   │   │                                               PURPOSE: Hook React do zarządzania projektami użytkownika –
│   │   │                                                        obsługa operacji CRUD przez mostek IPC.
│   │   │                                               FUNCTIONS: useProjects
│   │   │                                               DEPENDS ON: react, loggerRenderer.js
│   │   │                                               -->
│   │   ├── 📜 useSettings.js ❗                    <!-- VERSION: 0.0.3 PATH: src/hooks/useSettings.js
│   │   │                                               PURPOSE: Hook React do zarządzania ustawieniami użytkownika –
│   │   │                                                        ładowanie, aktualizacja i synchronizacja stanu z
│   │   │                                                        settingsStore przez mostek IPC.
│   │   │                                               FUNCTIONS: useSettings
│   │   │                                               DEPENDS ON: react, loggerRenderer.js
│   │   │                                               -->
│   │   ├── 📜 useTasks.js ❗                       <!-- VERSION: 0.0.3 PATH: src/hooks/useTasks.js
│   │   │                                               PURPOSE: Hook React do zarządzania zadaniami użytkownika –
│   │   │                                                        obsługa operacji CRUD przez mostek IPC.
│   │   │                                               FUNCTIONS: useTasks
│   │   │                                               DEPENDS ON: react, loggerRenderer.js
│   │   │                                               -->
│   │   ├── 📜 useTranslation.js                   <!-- VERSION: 0.0.3 PATH: src/hooks/useTranslation.js
│   │   │                                               PURPOSE: Hook React zapewniający dostęp do kontekstu tłumaczeń i
│   │   │                                                        danych pomocy.
│   │   │                                               FUNCTIONS: useTranslation
│   │   │                                               DEPENDS ON: react, translations.js, loggerRenderer.js
│   │   │                                               -->
│   │   └── 📜 useWorkspaces.js ❗                  <!-- VERSION: 0.0.3 PATH: src/hooks/useWorkspaces.js
│   │                                                   PURPOSE: Hook React do zarządzania przestrzeniami roboczymi
│   │                                                            (workspaces) użytkownika przez mostek IPC.
│   │                                                   FUNCTIONS: useWorkspaces
│   │                                                   DEPENDS ON: react, loggerRenderer.js
│   │                                                   -->
│   ├── 📁 ipc/
│   │   ├── 📜 ipcMainHandlers_adBlocker.js ❗      <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_adBlocker.js
│   │   │                                               PURPOSE: IPC handlery do zarządzania blokerem reklam – globalnie
│   │   │                                                        i per profil
│   │   │                                               FUNCTIONS: ipc:adblocker:setGlobal, ipc:adblocker:getGlobal,
│   │   │                                                          ipc:adblocker:setForProfile,
│   │   │                                                          ipc:adblocker:getForProfile
│   │   │                                               DEPENDS ON: electron, adBlocker.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_aggregatedTasks.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_aggregatedTasks.js
│   │   │                                               PURPOSE: IPC handlers dla widoku zbiorczego zadań.
│   │   │                                               FUNCTIONS: ipc:aggregatedTasks:getAll,
│   │   │                                                          ipc:aggregatedTasks:filter, ipc:aggregatedTasks:sort
│   │   │                                               DEPENDS ON: electron, tasksStore.js, projectsStore.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_appInfo.js ❗        <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_appInfo.js
│   │   │                                               PURPOSE: IPC handler do pobierania informacji o aplikacji
│   │   │                                               FUNCTIONS: ipc:app:getInfo
│   │   │                                               DEPENDS ON: electron, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_cookies.js ❗        <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_cookies.js
│   │   │                                               PURPOSE: IPC handler do pobierania cookies (Cookie Grabber)
│   │   │                                               FUNCTIONS: ipc:tools:getCookies
│   │   │                                               DEPENDS ON: electron, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_dialogs.js ❗        <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_dialogs.js
│   │   │                                               PURPOSE: IPC handlers dla natywnych okien dialogowych
│   │   │                                                        (open/save)
│   │   │                                               FUNCTIONS: ipc:dialog:openFile, ipc:dialog:saveFile
│   │   │                                               DEPENDS ON: electron, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_fileApi.js ❗        <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_fileApi.js
│   │   │                                               PURPOSE: IPC handlers dla File Previewer, Mini Postman i
│   │   │                                                        Clipboard
│   │   │                                               FUNCTIONS: ipc:tools:filePreview, ipc:tools:apiRequest,
│   │   │                                                          ipc:tools:clipboard:get
│   │   │                                               DEPENDS ON: electron, fs, path, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_fileSystem.js ❗     <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_fileSystem.js
│   │   │                                               PURPOSE: IPC handlers do odczytu i zapisu plików (przez main
│   │   │                                                        process)
│   │   │                                               FUNCTIONS: ipc:fs:readFile, ipc:fs:writeFile
│   │   │                                               DEPENDS ON: electron, fs, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_history.js ❗        <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_history.js
│   │   │                                               PURPOSE: IPC dla historii odwiedzin/akcji. history:getAll    –
│   │   │                                                        zwraca pełną historię (max 5000 wpisów) history:add    
│   │   │                                                          – dodaje nowy wpis i zapisuje history:clear     –
│   │   │                                                        czyści historię history:getRecent – zwraca ostatnie 100
│   │   │                                                        wpisów
│   │   │                                               FUNCTIONS: ipc:history:getAll, ipc:history:add,
│   │   │                                                          ipc:history:clear, ipc:history:getRecent
│   │   │                                               DEPENDS ON: electron, historyStore.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_hotkeys.js ❗        <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_hotkeys.js
│   │   │                                               PURPOSE: IPC handlery do zarządzania skrótami klawiszowymi –
│   │   │                                                        pobieranie, zapis, rejestracja
│   │   │                                               FUNCTIONS: ipc:hotkeys:getAll, ipc:hotkeys:save,
│   │   │                                                          ipc:hotkeys:register
│   │   │                                               DEPENDS ON: electron, hotkeysManager.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_imageSharp.js ❗     <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_imageSharp.js
│   │   │                                               PURPOSE: IPC handlery dla operacji na obrazach (resize, convert,
│   │   │                                                        compress)
│   │   │                                               FUNCTIONS: ipc:tools:image:resize, ipc:tools:image:convert,
│   │   │                                                          ipc:tools:image:compress
│   │   │                                               DEPENDS ON: electron, logger.js, sharpLoader.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_jsonYaml.js ❗       <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_jsonYaml.js
│   │   │                                               PURPOSE: IPC handlery dla JSON i YAML (formatowanie, konwersja)
│   │   │                                               FUNCTIONS: ipc:tools:formatJSON, ipc:tools:yamlToJson,
│   │   │                                                          ipc:tools:jsonToYaml
│   │   │                                               DEPENDS ON: electron, logger.js, yamlLoader.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_logs.js ❗           <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_logs.js
│   │   │                                               PURPOSE: Handlery IPC dla logów testów (LogWriter). logs:getFile
│   │   │                                                        buduje ścieżkę lokalnie przez app.getPath('userData') —
│   │   │                                                        nie używa getLogFilePath() z renderer logger.js (zwraca
│   │   │                                                        null w main).
│   │   │                                               FUNCTIONS: registerLogsHandlers, ipc:append-log-file,
│   │   │                                                          ipc:get-logs-file, ipc:clear-logs-file,
│   │   │                                                          ipc:logs:getFile
│   │   │                                               DEPENDS ON: electron, fs, path, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_notes.js ❗          <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_notes.js
│   │   │                                               PURPOSE: IPC dla notatek (Notepad, hooks useNotepad).
│   │   │                                               FUNCTIONS: ipc:notes:getAll, ipc:notes:add, ipc:notes:update,
│   │   │                                                          ipc:notes:delete
│   │   │                                               DEPENDS ON: electron, notesStore.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_openExternal.js ❗   <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_openExternal.js
│   │   │                                               PURPOSE: IPC handler do otwierania URL w domyślnej przeglądarce
│   │   │                                                        systemowej
│   │   │                                               FUNCTIONS: ipc:shell:openExternal
│   │   │                                               DEPENDS ON: electron, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_pathUtils.js ❗      <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_pathUtils.js
│   │   │                                               PURPOSE: IPC helpers dla operacji na ścieżkach (path.join,
│   │   │                                                        path.dirname)
│   │   │                                               FUNCTIONS: ipc:path:join, ipc:path:dirname
│   │   │                                               DEPENDS ON: electron, path, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_profiles.js ❗       <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_profiles.js
│   │   │                                               PURPOSE: IPC dla profili (Sidebar / Profile Manager / App
│   │   │                                                        Library) pobieranie profili zapisywanie profili edycja
│   │   │                                                        profili usuwanie profili ostatnio używane walidacja
│   │   │                                                        danych
│   │   │                                               FUNCTIONS: ipc:profiles:getAll, ipc:profiles:create,
│   │   │                                                          ipc:profiles:update, ipc:profiles:delete,
│   │   │                                                          ipc:profiles:touch
│   │   │                                               DEPENDS ON: electron, profilesStore.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_projects.js ❗       <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_projects.js
│   │   │                                               PURPOSE: IPC dla Project Manager settings:get        – pobiera
│   │   │                                                        aktualne ustawienia settings:update     – aktualizuje
│   │   │                                                        (merge patch, nie nadpisuje) settings:reset      –
│   │   │                                                        reset do DEFAULT_SETTINGS settings:export     – eksport
│   │   │                                                        do pliku JSON settings:import     – import z pliku JSON
│   │   │                                                        (merge) settings:getDefaults – zwraca DEFAULT_SETTINGS
│   │   │                                                        z config.js
│   │   │                                               FUNCTIONS: ipc:projects:getAll, ipc:projects:getWithTasks,
│   │   │                                                          ipc:projects:create, ipc:projects:update,
│   │   │                                                          ipc:projects:archive, ipc:projects:delete
│   │   │                                               DEPENDS ON: electron, projectsStore.js, tasksStore.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_regexMarkdown.js ❗  <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_regexMarkdown.js
│   │   │                                               PURPOSE: IPC handlers dla Regex Tester i Markdown Previewer
│   │   │                                               FUNCTIONS: ipc:tools:regexTest, ipc:tools:markdownRender
│   │   │                                               DEPENDS ON: electron, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_settings.js ❗       <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_settings.js
│   │   │                                               PURPOSE: IPC handlers dla Settings. settings:get        –
│   │   │                                                        pobiera aktualne ustawienia settings:update     –
│   │   │                                                        aktualizuje (merge patch, nie nadpisuje) settings:reset
│   │   │                                                             – reset do DEFAULT_SETTINGS settings:export     –
│   │   │                                                        eksport do pliku JSON settings:import     – import z
│   │   │                                                        pliku JSON (merge) settings:getDefaults – zwraca
│   │   │                                                        DEFAULT_SETTINGS z config.js
│   │   │                                               FUNCTIONS: ipc:settings:get, ipc:settings:update,
│   │   │                                                          ipc:settings:reset, ipc:settings:export,
│   │   │                                                          ipc:settings:import, ipc:settings:getDefaults
│   │   │                                               DEPENDS ON: electron, fs, logger.js, settingsStore.js, config.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_svgToPng.js ❗       <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_svgToPng.js
│   │   │                                               PURPOSE: IPC handler konwersji SVG → PNG przez sharp
│   │   │                                               FUNCTIONS: ipc:tools:svgToPng
│   │   │                                               DEPENDS ON: electron, fs, logger.js, sharpLoader.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_tasks.js ❗          <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_tasks.js
│   │   │                                               PURPOSE: IPC namespaced dla zadań (ui/taskpanel).
│   │   │                                               FUNCTIONS: ipc:tasks:getAll, ipc:tasks:saveSections
│   │   │                                               DEPENDS ON: electron, tasksStore.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_terminal.js ❗       <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_terminal.js
│   │   │                                               PURPOSE: IPC dla Terminala (node-pty + xterm.js) tworzenie sesji
│   │   │                                                        wysyłanie danych odbieranie danych zamykanie sesji
│   │   │                                                        restart cleanup
│   │   │                                               FUNCTIONS: ipc:terminal:create, ipc:terminal:write,
│   │   │                                                          ipc:terminal:resize, ipc:terminal:getBuffer,
│   │   │                                                          ipc:terminal:kill, ipc:terminal:restart
│   │   │                                               DEPENDS ON: electron, logger.js, node-pty, os
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_webview_cache.js ❗  <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_webview_cache.js
│   │   │                                               PURPOSE: IPC handler dla czyszczenia cache WebView
│   │   │                                               FUNCTIONS: ipc:webview:clearCache
│   │   │                                               DEPENDS ON: electron, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_webview_controls.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_webview_controls.js
│   │   │                                               PURPOSE: IPC handlers dla User Agent, Single App Mode, Resource
│   │   │                                                        Monitor, Sleep Tabs. Używa ESM import path/url zamiast
│   │   │                                                        require() (ES module context).
│   │   │                                               FUNCTIONS: ipc:webview:setUserAgent, ipc:webview:openInWindow,
│   │   │                                                          ipc:webview:getUsage, ipc:webview:sleep,
│   │   │                                                          ipc:webview:wake
│   │   │                                               DEPENDS ON: electron, path, url, logger.js, config.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_webview_extra.js ❗  <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_webview_extra.js
│   │   │                                               PURPOSE: Dodatkowe handlery IPC dla WebView (screenshot, single
│   │   │                                                        app, resource)
│   │   │                                               FUNCTIONS: registerWebViewExtraHandlers, ipc:open-single-window,
│   │   │                                                          ipc:capture-webview, ipc:get-webview-resource
│   │   │                                               DEPENDS ON: electron, path, logger.js, webviewRegistry.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_webview_nav.js ❗    <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_webview_nav.js
│   │   │                                               PURPOSE: IPC handlers dla nawigacji WebView. webview:navigate
│   │   │                                                        waliduje URL przez isSafeUrl() przed loadURL() —
│   │   │                                                        blokuje javascript:, data:, file: itp.
│   │   │                                               FUNCTIONS: ipc:webview:navigate, ipc:webview:reload,
│   │   │                                                          ipc:webview:goBack, ipc:webview:goForward,
│   │   │                                                          ipc:webview:getURL
│   │   │                                               DEPENDS ON: electron, logger.js, urlUtils.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_webview_screenshot.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_webview_screenshot.js
│   │   │                                               PURPOSE: IPC handler dla screenshot WebView
│   │   │                                               FUNCTIONS: ipc:webview:screenshot
│   │   │                                               DEPENDS ON: electron, logger.js, config.js
│   │   │                                               -->
│   │   └── 📜 ipcMainHandlers_workspaces.js ❗     <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_workspaces.js
│   │                                                   PURPOSE: IPC dla workspace (Sidebar, useWorkspaces).
│   │                                                   FUNCTIONS: ipc:workspaces:getAll, ipc:workspaces:save
│   │                                                   DEPENDS ON: electron, workspacesStore.js, logger.js
│   │                                                   -->
│   ├── 📁 loaders/
│   │   ├── 📜 ipcLoader.js ❗                      <!-- VERSION: 0.0.3 PATH: src/loaders/ipcLoader.js
│   │   │                                               PURPOSE: Dynamicznie ładuje wszystkie handlery IPC z src/ipc/.
│   │   │                                                        Eliminuje konieczność ręcznego importowania każdego
│   │   │                                                        pliku w main.js. Pomija: ipcLegacyBridge.js (ładowany
│   │   │                                                        osobno jako most legacy).
│   │   │                                               FUNCTIONS: loadAllIpcHandlers
│   │   │                                               DEPENDS ON: komponenty z folderu ipc/
│   │   │                                               -->
│   │   └── 📜 testsLoader.js ❗                    <!-- VERSION: 0.0.3 PATH: src/loaders/testsLoader.js
│   │                                                   PURPOSE: Dynamicznie ładuje i uruchamia wszystkie testy z
│   │                                                            tests/TestRunner_*.js. Eliminuje konieczność ręcznego
│   │                                                            importowania testów w TestRunner.js. Pomija:
│   │                                                            TestRunner.js (orchestrator), testUtils.js, index.js.
│   │                                                   FUNCTIONS: loadAndRunAllTests
│   │                                                   DEPENDS ON: komponenty z folderu tests/
│   │                                                   -->
│   ├── 📁 locales/
│   │   ├── 📁 templates/
│   │   │   ├── 📦 help.template.json              <!-- VERSION: 0.0.3 PATH: src/locales/templates/help.template.json
│   │   │   │                                           PURPOSE: Szablon dla pomocy w nowym języku (kopiuj, zmień nazwę
│   │   │   │                                                    na help_[język].json i przetłumacz). PAMIĘTAJ: Jeśli
│   │   │   │                                                    dodajesz nowy język, zaktualizuj TestRunner_Locales.js
│   │   │   │                                                    (dodaj plik do LOCALE_FILES) ORAZ w
│   │   │   │                                                    src/utils/translations.js – w useEffect dla help, dodaj
│   │   │   │                                                    import help_[język].json.
│   │   │   │                                           FUNCTIONS: -
│   │   │   │                                           DEPENDS ON: -
│   │   │   │                                           -->
│   │   │   └── 📦 lang.template.json ❗            <!-- VERSION: 0.0.3 PATH: src/locales/templates/lang.template.json
│   │   │                                               PURPOSE: Szablon dla nowego języka (kopiuj, zmień nazwę na
│   │   │                                                        [język].json i przetłumacz). PAMIĘTAJ: Jeśli dodajesz
│   │   │                                                        nowy język, zaktualizuj TestRunner_Locales.js (dodaj
│   │   │                                                        plik do LOCALE_FILES) ORAZ w src/utils/translations.js
│   │   │                                                        dodaj import nowego języka oraz w
│   │   │                                                        src/hooks/useTranslation.js (jeśli używa locales).
│   │   │                                               FUNCTIONS: -
│   │   │                                               DEPENDS ON: -
│   │   │                                               -->
│   │   ├── 📦 en.json                             <!-- VERSION: 0.0.3 PATH: src/locales/en.json
│   │   │                                               PURPOSE: English translations
│   │   │                                               FUNCTIONS: -
│   │   │                                               DEPENDS ON: -
│   │   │                                               -->
│   │   ├── 📦 help_en.json                        <!-- VERSION: 0.0.3 PATH: src/locales/help_en.json
│   │   │                                               PURPOSE: Help content (EN) – translated from help_pl.json
│   │   │                                               FUNCTIONS: -
│   │   │                                               DEPENDS ON: -
│   │   │                                               -->
│   │   ├── 📦 help_pl.json                        <!-- VERSION: 0.0.3 PATH: src/locales/help_pl.json
│   │   │                                               PURPOSE: Treści pomocy (PL)
│   │   │                                               FUNCTIONS: -
│   │   │                                               DEPENDS ON: -
│   │   │                                               -->
│   │   └── 📦 pl.json                             <!-- VERSION: 0.0.3 PATH: src/locales/pl.json
│   │                                                   PURPOSE: Tłumaczenia polskie
│   │                                                   FUNCTIONS: -
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 📁 tools/
│   │   ├── 📜 apiClient.js ❗                      <!-- VERSION: 0.0.3 PATH: src/tools/apiClient.js
│   │   │                                               PURPOSE: Prosty wrapper HTTP do testowania API apiRequest(url,
│   │   │                                                        method, headers, body) wykonuje żądanie i zwraca {
│   │   │                                                        status, headers, body }
│   │   │                                               FUNCTIONS: apiRequest
│   │   │                                               DEPENDS ON: logger.js
│   │   │                                               -->
│   │   ├── 📜 markdownRenderer.js ❗               <!-- VERSION: 0.0.3 PATH: src/tools/markdownRenderer.js
│   │   │                                               PURPOSE: Renderowanie markdown do HTML przy użyciu marked -
│   │   │                                                        renderMarkdown(text) zwraca string HTML
│   │   │                                               FUNCTIONS: renderMarkdown
│   │   │                                               DEPENDS ON: marked, logger.js
│   │   │                                               -->
│   │   ├── 📜 regexEngine.js ❗                    <!-- VERSION: 0.0.3 PATH: src/tools/regexEngine.js
│   │   │                                               PURPOSE: Helper do testowania wyrażeń regularnych
│   │   │                                                        testRegex(pattern, flags, text) zwraca tablicę
│   │   │                                                        wszystkich dopasowań z podanego tekstu
│   │   │                                               FUNCTIONS: testRegex
│   │   │                                               DEPENDS ON: logger.js
│   │   │                                               -->
│   │   └── 📜 svgToPng.js ❗                       <!-- VERSION: 0.0.3 PATH: src/tools/svgToPng.js
│   │                                                   PURPOSE: Konwersja pliku SVG do PNG przy użyciu sharp
│   │                                                            svgToPng(svgPath, outputPath, width, height) odczytuje
│   │                                                            SVG z dysku, renderuje do PNG o podanych wymiarach i
│   │                                                            zapisuje wynik pod outputPath
│   │                                                   FUNCTIONS: svgToPng
│   │                                                   DEPENDS ON: fs, sharp, logger.js
│   │                                                   -->
│   ├── 📁 ui/
│   │   ├── 📁 appLibrary/
│   │   │   └── ⚛️ AppLibraryBrowser.jsx ❗        <!-- VERSION: 0.0.3 PATH: src/ui/appLibrary/AppLibraryBrowser.jsx
│   │   │                                               PURPOSE: Główny widok biblioteki aplikacji (App Library) –
│   │   │                                                        umożliwia przeglądanie skatalogowanych usług webowych,
│   │   │                                                        ich wyszukiwanie oraz szybkie dodawanie do profili
│   │   │                                                        użytkownika. Współpracuje z appLibraryStore.
│   │   │                                               FUNCTIONS: AppLibraryBrowser
│   │   │                                               DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │                                                           icons, appLibraryStore
│   │   │                                               -->
│   │   ├── 📁 help/
│   │   │   ├── ⚛️ FAQ.jsx                        <!-- VERSION: 0.0.3 PATH: src/ui/help/FAQ.jsx
│   │   │   │                                           PURPOSE: Pojedynczy wpis FAQ (pytanie + odpowiedź)
│   │   │   │                                           FUNCTIONS: -
│   │   │   │                                           DEPENDS ON: react, translations.js, icons.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ Help.jsx                       <!-- VERSION: 0.0.3 PATH: src/ui/help/Help.jsx
│   │   │   │                                           PURPOSE: Główny komponent pomocy – łączy sekcje (Profile, Tools,
│   │   │   │                                                    Tasks, Shortcuts, FAQ)
│   │   │   │                                           FUNCTIONS: Help
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, icons.js,
│   │   │   │                                                       HelpSection, ToolCard, Shortcut, FAQ
│   │   │   │                                           -->
│   │   │   ├── ⚛️ HelpSection.jsx ❗              <!-- VERSION: 0.0.3 PATH: src/ui/help/HelpSection.jsx
│   │   │   │                                           PURPOSE: Rozwijana sekcja pomocy (tytuł + treść)
│   │   │   │                                           FUNCTIONS: HelpSection
│   │   │   │                                           DEPENDS ON: react, translations.js, icons.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ Shortcut.jsx ❗                 <!-- VERSION: 0.0.3 PATH: src/ui/help/Shortcut.jsx
│   │   │   │                                           PURPOSE: Wiersz skrótu klawiaturowego
│   │   │   │                                           FUNCTIONS: Shortcut
│   │   │   │                                           DEPENDS ON: react, translations.js
│   │   │   │                                           -->
│   │   │   └── ⚛️ ToolCard.jsx ❗                 <!-- VERSION: 0.0.3 PATH: src/ui/help/ToolCard.jsx
│   │   │                                               PURPOSE: Karta opisu narzędzia (ikona, tytuł, opis)
│   │   │                                               FUNCTIONS: ToolCard
│   │   │                                               DEPENDS ON: react, translations.js
│   │   │                                               -->
│   │   ├── 📁 history/
│   │   │   ├── ⚛️ HistoryExport.jsx ❗            <!-- VERSION: 0.0.3 PATH: src/ui/history/HistoryExport.jsx
│   │   │   │                                           PURPOSE: Eksport historii do CSV
│   │   │   │                                           FUNCTIONS: HistoryExport
│   │   │   │                                           DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ HistoryFilters.jsx ❗           <!-- VERSION: 0.0.3 PATH: src/ui/history/HistoryFilters.jsx
│   │   │   │                                           PURPOSE: Filtry historii (poziom, sortowanie, przycisk
│   │   │   │                                                    czyszczenia)
│   │   │   │                                           FUNCTIONS: HistoryFilters
│   │   │   │                                           DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ HistoryList.jsx ❗              <!-- VERSION: 0.0.3 PATH: src/ui/history/HistoryList.jsx
│   │   │   │                                           PURPOSE: Lista wpisów historii (tabela)
│   │   │   │                                           FUNCTIONS: HistoryList
│   │   │   │                                           DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│   │   │   │                                           -->
│   │   │   └── ⚛️ HistoryLog.jsx ❗               <!-- VERSION: 0.0.3 PATH: src/ui/history/HistoryLog.jsx
│   │   │                                               PURPOSE: Historia przeglądania – lista ostatnio odwiedzonych
│   │   │                                                        profili
│   │   │                                               FUNCTIONS: HistoryLog
│   │   │                                               DEPENDS ON: react, historyStore.js, translations.js,
│   │   │                                                           loggerRenderer.js, icons.js, ConfirmModal.jsx,
│   │   │                                                           HistoryFilters.jsx, HistoryList.jsx
│   │   │                                               -->
│   │   ├── 📁 layout/
│   │   │   └── ⚛️ MainLayout.jsx ❗               <!-- VERSION: 0.0.3 PATH: src/ui/layout/MainLayout.jsx
│   │   │                                               PURPOSE: Główny szkielet interfejsu użytkownika (Shell) –
│   │   │                                                        definiuje siatkę aplikacji, koordynuje nawigację
│   │   │                                                        boczną, obszar roboczy (ContentRenderer) oraz integruje
│   │   │                                                        globalne mechanizmy modalne i powiadomienia sieciowe.
│   │   │                                               FUNCTIONS: MainLayout
│   │   │                                               DEPENDS ON: react, translations.js, loggerRenderer.js,
│   │   │                                                           Sidebar.jsx, ContentRenderer.jsx, ConfirmModal.jsx
│   │   │                                               -->
│   │   ├── 📁 modals/
│   │   │   ├── ⚛️ ConfirmModal.jsx ❗             <!-- VERSION: 0.0.3 PATH: src/ui/modals/ConfirmModal.jsx
│   │   │   │                                           PURPOSE: Generyczny komponent modalny służący do potwierdzania
│   │   │   │                                                    akcji krytycznych (np. usuwanie). Zapewnia spójność
│   │   │   │                                                    wizualną i zastępuje natywną funkcję window.confirm.
│   │   │   │                                           FUNCTIONS: ConfirmModal
│   │   │   │                                           DEPENDS ON: react, translations.js, loggerRenderer.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ Modal.jsx ❗                    <!-- VERSION: 0.0.3 PATH: src/ui/modals/Modal.jsx
│   │   │   │                                           PURPOSE: Bazowy komponent modalny dla całej aplikacji
│   │   │   │                                           FUNCTIONS: Modal
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js
│   │   │   │                                           -->
│   │   │   └── ⚛️ PromptModal.jsx ❗              <!-- VERSION: 0.0.3 PATH: src/ui/modals/PromptModal.jsx
│   │   │                                               PURPOSE: Modal z polem input – zastępuje window.prompt()
│   │   │                                               FUNCTIONS: PromptModal
│   │   │                                               DEPENDS ON: react, translations.js, loggerRenderer.js
│   │   │                                               -->
│   │   ├── 📁 notepad/
│   │   │   ├── ⚛️ ClipboardHistoryModal.jsx ❗    <!-- VERSION: 0.0.3 PATH: src/ui/notepad/ClipboardHistoryModal.jsx
│   │   │   │                                           PURPOSE: Okno modalne prezentujące listę historycznych wpisów ze
│   │   │   │                                                    schowka systemowego – umożliwia przeglądanie i
│   │   │   │                                                    odzyskiwanie skopiowanych wcześniej fragmentów tekstu.
│   │   │   │                                           FUNCTIONS: ClipboardHistoryModal
│   │   │   │                                           DEPENDS ON: react, translations.js, loggerRenderer.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ Notepad.jsx ❗                  <!-- VERSION: 0.0.3 PATH: src/ui/notepad/Notepad.jsx
│   │   │   │                                           PURPOSE: Główny komponent interfejsu notatnika – koordynuje
│   │   │   │                                                    pracę zakładek, edytora oraz paneli wyszukiwania i
│   │   │   │                                                    statusu, integrując logikę z hookami useNotepadUI i
│   │   │   │                                                    useNotepadFindReplace.
│   │   │   │                                           FUNCTIONS: Notepad
│   │   │   │                                           DEPENDS ON: react, useNotepadUI.js, useNotepadFindReplace.js,
│   │   │   │                                                       NotepadTabs, NotepadToolbar, NotepadFindReplace,
│   │   │   │                                                       NotepadStatusBar, loggerRenderer.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ NotepadFindReplace.jsx ❗       <!-- VERSION: 0.0.3 PATH: src/ui/notepad/NotepadFindReplace.jsx
│   │   │   │                                           PURPOSE: Panel znajdź/zastąp w notatniku
│   │   │   │                                           FUNCTIONS: NotepadFindReplace
│   │   │   │                                           DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ NotepadStatusBar.jsx ❗         <!-- VERSION: 0.0.3 PATH: src/ui/notepad/NotepadStatusBar.jsx
│   │   │   │                                           PURPOSE: Pasek informacyjny u dołu notatnika – wyświetla
│   │   │   │                                                    metadane aktywnego dokumentu: statystyki znaków/wierszy
│   │   │   │                                                    oraz czas ostatniego autozapisu.
│   │   │   │                                           FUNCTIONS: NotepadStatusBar
│   │   │   │                                           DEPENDS ON: react, translations.js, loggerRenderer.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ NotepadTabs.jsx ❗              <!-- VERSION: 0.0.3 PATH: src/ui/notepad/NotepadTabs.jsx
│   │   │   │                                           PURPOSE: Komponent zarządzający paskiem kart notatnika –
│   │   │   │                                                    obsługuje przełączanie dokumentów, ich zamykanie,
│   │   │   │                                                    zmianę nazwy oraz wizualizację stanu 'dirty'.
│   │   │   │                                           FUNCTIONS: NotepadTabs
│   │   │   │                                           DEPENDS ON: react, translations.js, loggerRenderer.js, icons.js,
│   │   │   │                                                       PromptModal.jsx
│   │   │   │                                           -->
│   │   │   └── ⚛️ NotepadToolbar.jsx ❗           <!-- VERSION: 0.0.3 PATH: src/ui/notepad/NotepadToolbar.jsx
│   │   │                                               PURPOSE: Pasek narzędzi notatnika (zapisz, znajdź, word wrap)
│   │   │                                               FUNCTIONS: NotepadToolbar
│   │   │                                               DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│   │   │                                               -->
│   │   ├── 📁 profiles/
│   │   │   └── ⚛️ Profiles.jsx ❗                 <!-- VERSION: 0.0.3 PATH: src/ui/profiles/Profiles.jsx
│   │   │                                               PURPOSE: UI zarządzania profilami WebView — wyświetlanie listy
│   │   │                                                        profili z danych IPC (load, wyświetlanie nazwy, URL,
│   │   │                                                        obsługa błędów). Używa window.electronAPI.invoke
│   │   │                                                        zamiast window.mw.
│   │   │                                               FUNCTIONS: Profiles
│   │   │                                               DEPENDS ON: react, loggerRenderer.js
│   │   │                                               -->
│   │   ├── 📁 projects/
│   │   │   ├── ⚛️ ProjectList.jsx ❗              <!-- VERSION: 0.0.3 PATH: src/ui/projects/ProjectList.jsx
│   │   │   │                                           PURPOSE: Lista projektów z akcjami (zadania, terminal, usuwanie)
│   │   │   │                                           FUNCTIONS: ProjectList
│   │   │   │                                           DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ ProjectManager.jsx ❗           <!-- VERSION: 0.0.3 PATH: src/ui/projects/ProjectManager.jsx
│   │   │   │                                           PURPOSE: Zarządzanie projektami – lista, dodawanie, usuwanie,
│   │   │   │                                                    edycja
│   │   │   │                                           FUNCTIONS: ProjectManager
│   │   │   │                                           DEPENDS ON: react, projectsStore.js, translations.js,
│   │   │   │                                                       loggerRenderer.js, icons.js, ConfirmModal.jsx,
│   │   │   │                                                       ProjectModal.jsx
│   │   │   │                                           -->
│   │   │   └── ⚛️ ProjectModal.jsx ❗             <!-- VERSION: 0.0.3 PATH: src/ui/projects/ProjectModal.jsx
│   │   │                                               PURPOSE: Modal dodawania nowego projektu (nazwa + ścieżka)
│   │   │                                               FUNCTIONS: ProjectModal
│   │   │                                               DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│   │   │                                               -->
│   │   ├── 📁 settings/
│   │   │   ├── ⚛️ AccountSection.jsx ❗           <!-- VERSION: 0.0.3 PATH: src/ui/settings/AccountSection.jsx
│   │   │   │                                           PURPOSE: Sekcja zarządzania profilem użytkownika – obecnie służy
│   │   │   │                                                    jako placeholder dla nadchodzącej funkcji
│   │   │   │                                                    synchronizacji danych w chmurze (Cloud Sync) planowanej
│   │   │   │                                                    w v0.0.4.
│   │   │   │                                           FUNCTIONS: AccountSection
│   │   │   │                                           DEPENDS ON: react, translations.js, src, loggerRenderer.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ DataLogsSection.jsx ❗          <!-- VERSION: 0.0.3 PATH: src/ui/settings/DataLogsSection.jsx
│   │   │   │                                           PURPOSE: Sekcja danych i logów (eksport/import, otwieranie
│   │   │   │                                                    folderu logów, logi testów)
│   │   │   │                                           FUNCTIONS: DataLogsSection
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │   │                                                       icons, ConfirmModal, Modal
│   │   │   │                                           -->
│   │   │   ├── ⚛️ DebugModulesSection.jsx ❗      <!-- VERSION: 0.0.3 PATH: src/ui/settings/DebugModulesSection.jsx
│   │   │   │                                           PURPOSE: UI do zarządzania filtrowaniem logów per-moduł.
│   │   │   │                                                    Widoczna tylko w trybie debugMode.
│   │   │   │                                           FUNCTIONS: DebugModulesSection
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer.js,
│   │   │   │                                                       icons.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ GeneralSection.jsx ❗           <!-- VERSION: 0.0.3 PATH: src/ui/settings/GeneralSection.jsx
│   │   │   │                                           PURPOSE: Sekcja ustawień ogólnych aplikacji – zarządza wyborem
│   │   │   │                                                    języka (i18n), motywem graficznym (Light/Dark) oraz
│   │   │   │                                                    globalnym trybem debugowania (developer mode).
│   │   │   │                                           FUNCTIONS: GeneralSection
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │   │                                                       icons
│   │   │   │                                           -->
│   │   │   ├── ⚛️ HotkeysManager.jsx ❗           <!-- VERSION: 0.0.3 PATH: src/ui/settings/HotkeysManager.jsx
│   │   │   │                                           PURPOSE: Interfejs zarządzania globalnymi skrótami klawiszowymi
│   │   │   │                                                    aplikacji. Umożliwia definiowanie akcji systemowych
│   │   │   │                                                    (screenshot, monitor) oraz wstawianie predefiniowanych
│   │   │   │                                                    snippetów tekstowych.
│   │   │   │                                           FUNCTIONS: HotkeysManager
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │   │                                                       ConfirmModal, Modal, notificationsManager.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ NotificationsSection.jsx ❗     <!-- VERSION: 0.0.3 PATH: src/ui/settings/NotificationsSection.jsx
│   │   │   │                                           PURPOSE: Sekcja powiadomień (toasty, system, Pushbullet)
│   │   │   │                                           FUNCTIONS: NotificationsSection
│   │   │   │                                           DEPENDS ON: react, translations.js, loggerRenderer, icons
│   │   │   │                                           -->
│   │   │   ├── ⚛️ Settings.jsx ❗                 <!-- VERSION: 0.0.3 PATH: src/ui/settings/Settings.jsx
│   │   │   │                                           PURPOSE: Główny kontener widoku ustawień aplikacji. Agreguje
│   │   │   │                                                    wszystkie sekcje konfiguracyjne (General, WebView,
│   │   │   │                                                    Tabs, Notifications, Hotkeys, Debug, Data) w jeden
│   │   │   │                                                    ustrukturyzowany interfejs użytkownika.
│   │   │   │                                           FUNCTIONS: Settings
│   │   │   │                                           DEPENDS ON: react, GeneralSection, WebViewSection, TabsSection,
│   │   │   │                                                       NotificationsSection, HotkeysManager,
│   │   │   │                                                       DebugModulesSection, DataLogsSection, AccountSection,
│   │   │   │                                                       translations.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ TabsSection.jsx ❗              <!-- VERSION: 0.0.3 PATH: src/ui/settings/TabsSection.jsx
│   │   │   │                                           PURPOSE: Sekcja konfiguracji zarządzania kartami – pozwala na
│   │   │   │                                                    ustawienie czasu bezczynności, po którym nieaktywne
│   │   │   │                                                    WebView są uśpiane w celu oszczędzania zasobów
│   │   │   │                                                    systemowych (RAM/CPU).
│   │   │   │                                           FUNCTIONS: TabsSection
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │   │                                                       icons
│   │   │   │                                           -->
│   │   │   └── ⚛️ WebViewSection.jsx ❗           <!-- VERSION: 0.0.3 PATH: src/ui/settings/WebViewSection.jsx
│   │   │                                               PURPOSE: Konfiguracja silnika przeglądarki (WebView) – zarządza
│   │   │                                                        globalnym blokowaniem reklam, maskowaniem tożsamości
│   │   │                                                        przeglądarki (User Agent) oraz trybami wyświetlania
│   │   │                                                        okien.
│   │   │                                               FUNCTIONS: WebViewSection
│   │   │                                               DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │                                                           icons
│   │   │                                               -->
│   │   ├── 📁 sidebar/
│   │   │   ├── ⚛️ CategoryModal.jsx ❗            <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/CategoryModal.jsx
│   │   │   │                                           PURPOSE: Formularz modalny do zarządzania kategoriami profili –
│   │   │   │                                                    umożliwia tworzenie nowych i edycję istniejących sekcji
│   │   │   │                                                    grupujących w Sidebarze.
│   │   │   │                                           FUNCTIONS: CategoryModal
│   │   │   │                                           DEPENDS ON: react, translations.js, icons.js, ModalPortal
│   │   │   │                                           -->
│   │   │   ├── ⚛️ ContextMenu.jsx ❗              <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/ContextMenu.jsx
│   │   │   │                                           PURPOSE: Menu kontekstowe (PPM) dla profilu
│   │   │   │                                           FUNCTIONS: ContextMenu
│   │   │   │                                           DEPENDS ON: react, translations.js, icons.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ ProfileModal.jsx ❗             <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/ProfileModal.jsx
│   │   │   │                                           PURPOSE: Zaawansowany formularz modalny do konfiguracji profili
│   │   │   │                                                    WebView – obsługuje parametry URL, ikony, przypisanie
│   │   │   │                                                    do kategorii oraz przełączniki adblockera i
│   │   │   │                                                    powiadomień.
│   │   │   │                                           FUNCTIONS: ProfileModal
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js,
│   │   │   │                                                       urlUtils.js, ModalPortal, notificationsManager.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ Sidebar.jsx ❗                  <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/Sidebar.jsx
│   │   │   │                                           PURPOSE: Główny panel nawigacyjny aplikacji – zarządza listą
│   │   │   │                                                    profili, hierarchią kategorii, narzędziami systemowymi
│   │   │   │                                                    oraz integracją z mostkiem IPC dla trwałości ustawień.
│   │   │   │                                           FUNCTIONS: Sidebar
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js,
│   │   │   │                                                       ProfileModal, CategoryModal, ContextMenu,
│   │   │   │                                                       SidebarSearch, SidebarCategory, SidebarProfileItem,
│   │   │   │                                                       SidebarTools, SidebarWorkspaces, ConfirmModal.jsx
│   │   │   │                                           -->
│   │   │   ├── ⚛️ SidebarCategory.jsx ❗          <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/SidebarCategory.jsx
│   │   │   │                                           PURPOSE: Nagłówek kategorii profilów (zwijanie/rozwijanie, menu
│   │   │   │                                                    kontekstowe)
│   │   │   │                                           FUNCTIONS: SidebarCategory
│   │   │   │                                           DEPENDS ON: react, translations.js, icons.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ SidebarProfileItem.jsx ❗       <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/SidebarProfileItem.jsx
│   │   │   │                                           PURPOSE: Pojedynczy profil w Sidebarze (ikona, nazwa,
│   │   │   │                                                    indykatory)
│   │   │   │                                           FUNCTIONS: SidebarProfileItem
│   │   │   │                                           DEPENDS ON: react, translations.js, icons.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ SidebarSearch.jsx ❗            <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/SidebarSearch.jsx
│   │   │   │                                           PURPOSE: Wyszukiwarka profili w Sidebarze
│   │   │   │                                           FUNCTIONS: SidebarSearch
│   │   │   │                                           DEPENDS ON: react, translations.js, icons.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ SidebarTools.jsx ❗             <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/SidebarTools.jsx
│   │   │   │                                           PURPOSE: Sekcja narzędzi specjalnych w Sidebarze
│   │   │   │                                           FUNCTIONS: SidebarTools
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, icons.js,
│   │   │   │                                                       constants.js
│   │   │   │                                           -->
│   │   │   └── ⚛️ SidebarWorkspaces.jsx ❗        <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/SidebarWorkspaces.jsx
│   │   │                                               PURPOSE: Sekcja workspace'ów w Sidebarze
│   │   │                                               FUNCTIONS: SidebarWorkspaces
│   │   │                                               DEPENDS ON: react, translations.js, icons.js
│   │   │                                               -->
│   │   ├── 📁 styles/
│   │   │   ├── 🎨 components.css                  <!-- VERSION: 0.0.3 PATH: src/ui/styles/components.css
│   │   │   │                                           PURPOSE: Zbiór stylów CSS aplikacji
│   │   │   │                                           FUNCTIONS: -
│   │   │   │                                           DEPENDS ON: -
│   │   │   │                                           -->
│   │   │   └── 🎨 theme.css                       <!-- VERSION: 0.0.3 PATH: src/ui/styles/theme.css
│   │   │                                               PURPOSE: Globalne style aplikacji MultiWeb Manager
│   │   │                                               FUNCTIONS: -
│   │   │                                               DEPENDS ON: -
│   │   │                                               -->
│   │   ├── 📁 system/
│   │   │   ├── ⚛️ ModalPortal.jsx ❗              <!-- VERSION: 0.0.3 PATH: src/ui/system/ModalPortal.jsx
│   │   │   │                                           PURPOSE: Modal w portalu (document.body) — ponad natywnym
│   │   │   │                                                    <webview> w Electronie.
│   │   │   │                                           FUNCTIONS: ModalPortal
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js, react-dom
│   │   │   │                                           -->
│   │   │   └── ⚛️ UpdateChecker.jsx ❗            <!-- VERSION: 0.0.3 PATH: src/ui/system/UpdateChecker.jsx
│   │   │                                               PURPOSE: Komponent sprawdzania aktualizacji. Placeholder –
│   │   │                                                        docelowo
│   │   │                                               FUNCTIONS: UpdateChecker
│   │   │                                               DEPENDS ON: react, icons, translations.js, loggerRenderer
│   │   │                                               -->
│   │   ├── 📁 taskpanel/
│   │   │   ├── ⚛️ CommentModal.jsx ❗             <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/CommentModal.jsx
│   │   │   │                                           PURPOSE: Modal podglądu komentarza/kodu do zadania
│   │   │   │                                           FUNCTIONS: CommentModal
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ TaskDetails.jsx ❗              <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskDetails.jsx
│   │   │   │                                           PURPOSE: Widok szczegółowy pojedynczego zadania. Umożliwia
│   │   │   │                                                    szybką edycję statusu i priorytetu bezpośrednio z
│   │   │   │                                                    poziomu podglądu oraz synchronizację tych zmian przez
│   │   │   │                                                    IPC.
│   │   │   │                                           FUNCTIONS: TaskDetails
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js, constants.js,
│   │   │   │                                                       translations.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ TaskEditor.jsx ❗               <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskEditor.jsx
│   │   │   │                                           PURPOSE: Wyspecjalizowany edytor zadań (inline lub modal)
│   │   │   │                                                    obsługujący walidację danych wejściowych, komunikację z
│   │   │   │                                                    tasksStore przez IPC oraz integrację z systemem
│   │   │   │                                                    toastów.
│   │   │   │                                           FUNCTIONS: TaskEditor
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js, constants.js,
│   │   │   │                                                       translations.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ TaskItem.jsx ❗                 <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskItem.jsx
│   │   │   │                                           PURPOSE: Interaktywny element listy zadań w panelu projektu.
│   │   │   │                                                    Dostarcza pełny zestaw akcji CRUD (edycja, usuwanie,
│   │   │   │                                                    pinowanie) oraz szybkie przyciski zmiany stanu (Move to
│   │   │   │                                                    Active/Backlog/Done).
│   │   │   │                                           FUNCTIONS: TaskItem
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ TaskList.jsx ❗                 <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskList.jsx
│   │   │   │                                           PURPOSE: Główny komponent listy zadań (Kanban/List view) –
│   │   │   │                                                    odpowiada za dynamiczne filtrowanie, grupowanie według
│   │   │   │                                                    statusu (TODO, IN_PROGRESS, BLOCKED, DONE) oraz
│   │   │   │                                                    wyzwalanie akcji edycji i podglądu.
│   │   │   │                                           FUNCTIONS: TaskList
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js, constants.js,
│   │   │   │                                                       translations.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ TaskModal.jsx ❗                <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskModal.jsx
│   │   │   │                                           PURPOSE: Formularz modalny do kompleksowego zarządzania
│   │   │   │                                                    zadaniem. Obsługuje edycję metadanych takich jak:
│   │   │   │                                                    priorytet, sekcja, przypisanie do projektu oraz
│   │   │   │                                                    dodatkowe notatki i wersjonowanie.
│   │   │   │                                           FUNCTIONS: TaskModal
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ TaskPanel.jsx ❗                <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskPanel.jsx
│   │   │   │                                           PURPOSE: Interfejs zarządzania zadaniami dla konkretnego
│   │   │   │                                                    projektu. Obsługuje wizualizację tablicy Kanban
│   │   │   │                                                    (Active, Backlog, Done), filtrowanie oraz
│   │   │   │                                                    synchronizację z tasksStore.
│   │   │   │                                           FUNCTIONS: TaskPanel
│   │   │   │                                           DEPENDS ON: react, tasksStore.js, projectsStore.js,
│   │   │   │                                                       translations.js, loggerRenderer.js, icons.js,
│   │   │   │                                                       ConfirmModal.jsx, TaskItem.jsx, TaskModal.jsx
│   │   │   │                                           -->
│   │   │   └── ⚛️ TaskSection.jsx ❗              <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskSection.jsx
│   │   │                                               PURPOSE: Pojedyncza sekcja zadań (aktywne, backlog, done)
│   │   │                                               FUNCTIONS: TaskSection
│   │   │                                               DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js,
│   │   │                                                           TaskItem
│   │   │                                               -->
│   │   ├── 📁 tasks/
│   │   │   ├── ⚛️ AggregatedProjectSection.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/tasks/AggregatedProjectSection.jsx
│   │   │   │                                           PURPOSE: Pojedyncza sekcja projektu w widoku zbiorczym
│   │   │   │                                           FUNCTIONS: AggregatedProjectSection
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js,
│   │   │   │                                                       AggregatedTaskItem
│   │   │   │                                           -->
│   │   │   ├── ⚛️ AggregatedTaskItem.jsx ❗       <!-- VERSION: 0.0.3 PATH: src/ui/tasks/AggregatedTaskItem.jsx
│   │   │   │                                           PURPOSE: Wyspecjalizowany komponent prezentujący zadanie w
│   │   │   │                                                    widoku zagregowanym (dashboard). Obsługuje wizualizację
│   │   │   │                                                    priorytetów, znaczników wersji oraz statusu wykonania
│   │   │   │                                                    (skreślenie).
│   │   │   │                                           FUNCTIONS: AggregatedTaskItem
│   │   │   │                                           DEPENDS ON: loggerRenderer.js, icons.js
│   │   │   │                                           -->
│   │   │   └── ⚛️ AggregatedTasks.jsx ❗          <!-- VERSION: 0.0.3 PATH: src/ui/tasks/AggregatedTasks.jsx
│   │   │                                               PURPOSE: Widok zbiorczy zadań ze wszystkich projektów
│   │   │                                               FUNCTIONS: AggregatedTasks
│   │   │                                               DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js,
│   │   │                                                           AggregatedProjectSection, AggregatedTaskItem
│   │   │                                               -->
│   │   ├── 📁 terminal/
│   │   │   └── ⚛️ Terminal.jsx ❗                 <!-- VERSION: 0.0.3 PATH: src/ui/terminal/Terminal.jsx
│   │   │                                               PURPOSE: Terminal z xterm.js + node-pty (historia komend, ANSI
│   │   │                                                        colors). Używa terminalWriteLegacy/terminalResizeLegacy
│   │   │                                                        z preload (alias dla legacy IPC).
│   │   │                                               FUNCTIONS: Terminal
│   │   │                                               DEPENDS ON: react, xterm, xterm-addon-fit, xterm-addon-web-links,
│   │   │                                                           translations.js, loggerRenderer, icons
│   │   │                                               -->
│   │   ├── 📁 tools/
│   │   │   ├── ⚛️ ClipboardHistory.jsx ❗         <!-- VERSION: 0.0.3 PATH: src/ui/tools/ClipboardHistory.jsx
│   │   │   │                                           PURPOSE: Historia schowka z pinowaniem i wyszukiwarką
│   │   │   │                                           FUNCTIONS: ClipboardHistory
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │   │                                                       icons
│   │   │   │                                           -->
│   │   │   ├── ⚛️ CookieGrabber.jsx ❗            <!-- VERSION: 0.0.3 PATH: src/ui/tools/CookieGrabber.jsx
│   │   │   │                                           PURPOSE: Pobieranie cookies z aktywnego WebView – tabela,
│   │   │   │                                                    kopiowanie, eksport
│   │   │   │                                           FUNCTIONS: CookieGrabber
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │   │                                                       icons
│   │   │   │                                           -->
│   │   │   ├── ⚛️ FilePreviewer.jsx ❗            <!-- VERSION: 0.0.3 PATH: src/ui/tools/FilePreviewer.jsx
│   │   │   │                                           PURPOSE: Podgląd plików (RAW/PREVIEW) – TXT, JSON, HTML, SVG,
│   │   │   │                                                    Markdown, obrazy
│   │   │   │                                           FUNCTIONS: FilePreviewer
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │   │                                                       icons, markdownRenderer
│   │   │   │                                           -->
│   │   │   ├── ⚛️ ImageTools.jsx ❗               <!-- VERSION: 0.0.3 PATH: src/ui/tools/ImageTools.jsx
│   │   │   │                                           PURPOSE: Kompresja, resize i konwersja obrazów (drag & drop,
│   │   │   │                                                    preview)
│   │   │   │                                           FUNCTIONS: ImageTools
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │   │                                                       icons, imageUtils
│   │   │   │                                           -->
│   │   │   ├── ⚛️ JsonFormatter.jsx ❗            <!-- VERSION: 0.0.3 PATH: src/ui/tools/JsonFormatter.jsx
│   │   │   │                                           PURPOSE: Formatowanie i walidacja JSON/YAML/XML
│   │   │   │                                           FUNCTIONS: JsonFormatter
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer
│   │   │   │                                           -->
│   │   │   ├── ⚛️ MarkdownPreviewer.jsx ❗        <!-- VERSION: 0.0.3 PATH: src/ui/tools/MarkdownPreviewer.jsx
│   │   │   │                                           PURPOSE: Podgląd Markdown na żywo (split view)
│   │   │   │                                           FUNCTIONS: MarkdownPreviewer
│   │   │   │                                           DEPENDS ON: react, config.js, loggerRenderer.js, translations.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ MiniPostman.jsx ❗              <!-- VERSION: 0.0.3 PATH: src/ui/tools/MiniPostman.jsx
│   │   │   │                                           PURPOSE: Lekki API tester (GET/POST/PUT/DELETE, nagłówki, body,
│   │   │   │                                                    odpowiedź)
│   │   │   │                                           FUNCTIONS: MiniPostman
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │   │                                                       icons, apiClient
│   │   │   │                                           -->
│   │   │   ├── ⚛️ RegexTester.jsx ❗              <!-- VERSION: 0.0.3 PATH: src/ui/tools/RegexTester.jsx
│   │   │   │                                           PURPOSE: Testowanie wyrażeń regularnych
│   │   │   │                                           FUNCTIONS: RegexTester
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │   │                                                       regexEngine
│   │   │   │                                           -->
│   │   │   ├── ⚛️ RemoveBgTool.jsx ❗             <!-- VERSION: 0.0.3 PATH: src/ui/tools/RemoveBgTool.jsx
│   │   │   │                                           PURPOSE: Narzędzie do masowego usuwania tła ze zdjęć przez API
│   │   │   │                                                    remove.bg.
│   │   │   │                                           FUNCTIONS: RemoveBgTool
│   │   │   │                                           DEPENDS ON: react, axios, icons, translations.js, loggerRenderer,
│   │   │   │                                                       config, notificationsManager.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ StringCombiner.jsx ❗           <!-- VERSION: 0.0.3 PATH: src/ui/tools/StringCombiner.jsx
│   │   │   │                                           PURPOSE: Generator kombinacji stringów. Podajesz tekst bazowy,
│   │   │   │                                                    znak podziału
│   │   │   │                                           FUNCTIONS: StringCombiner
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js, icons, translations.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ SvgToPngConverter.jsx ❗        <!-- VERSION: 0.0.3 PATH: src/ui/tools/SvgToPngConverter.jsx
│   │   │   │                                           PURPOSE: Konwersja SVG → PNG z wyborem rozdzielczości (drag &
│   │   │   │                                                    drop, preview)
│   │   │   │                                           FUNCTIONS: SvgToPngConverter
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │   │                                                       icons, svgToPng
│   │   │   │                                           -->
│   │   │   └── ⚛️ ToolsPanel.jsx ❗               <!-- VERSION: 0.0.3 PATH: src/ui/tools/ToolsPanel.jsx
│   │   │                                               PURPOSE: Główny panel narzędziowy aplikacji (Tools Panel) –
│   │   │                                                        dostarcza interfejs oparty na zakładkach do obsługi
│   │   │                                                        narzędzi pomocniczych (JSON Formatter, Regex Tester,
│   │   │                                                        Clipboard History, Image Tools, Mini Postman, Cookie
│   │   │                                                        Grabber itp.). Obsługuje dynamiczne ładowanie na
│   │   │                                                        podstawie flag funkcji (feature flags).
│   │   │                                               FUNCTIONS: ToolsPanel
│   │   │                                               DEPENDS ON: react, config.js, translations.js, icons,
│   │   │                                                           loggerRenderer, RemoveBgTool.jsx, StringCombiner.jsx,
│   │   │                                                           JsonFormatter.jsx, RegexTester.jsx,
│   │   │                                                           MarkdownPreviewer.jsx, ClipboardHistory.jsx,
│   │   │                                                           ImageTools.jsx, SvgToPngConverter.jsx,
│   │   │                                                           MiniPostman.jsx, FilePreviewer.jsx,
│   │   │                                                           CookieGrabber.jsx
│   │   │                                               -->
│   │   ├── 📁 views/
│   │   │   ├── ⚛️ ContentRenderer.jsx ❗          <!-- VERSION: 0.0.3 PATH: src/ui/views/ContentRenderer.jsx
│   │   │   │                                           PURPOSE: Router widoków — deleguje do WebViewContainer,
│   │   │   │                                                    ToolsContainer lub SettingsContainer
│   │   │   │                                           FUNCTIONS: ContentRenderer
│   │   │   │                                           DEPENDS ON: react, icons.js, translations.js,
│   │   │   │                                                       WebViewContainer.jsx, ToolsContainer.jsx,
│   │   │   │                                                       SettingsContainer.jsx
│   │   │   │                                           -->
│   │   │   ├── ⚛️ SettingsContainer.jsx ❗        <!-- VERSION: 0.0.3 PATH: src/ui/views/SettingsContainer.jsx
│   │   │   │                                           PURPOSE: Kontener renderowania ustawień, pomocy, historii i
│   │   │   │                                                    zadań zagregowanych
│   │   │   │                                           FUNCTIONS: SettingsContainer
│   │   │   │                                           DEPENDS ON: react, config.js, loggerRenderer.js, Spinner.jsx
│   │   │   │                                           -->
│   │   │   ├── ⚛️ Spinner.jsx ❗                  <!-- VERSION: 0.0.3 PATH: src/ui/views/Spinner.jsx
│   │   │   │                                           PURPOSE: Współdzielony komponent wizualny wskaźnika ładowania
│   │   │   │                                                    (loader). Wykorzystywany jako fallback dla React
│   │   │   │                                                    Suspense oraz podczas asynchronicznych operacji I/O.
│   │   │   │                                           FUNCTIONS: Spinner
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ ToolsContainer.jsx ❗           <!-- VERSION: 0.0.3 PATH: src/ui/views/ToolsContainer.jsx
│   │   │   │                                           PURPOSE: Kontener renderowania narzędzi specjalnych (Notepad,
│   │   │   │                                                    ProjectManager, RemoveBg, itp.)
│   │   │   │                                           FUNCTIONS: ToolsContainer
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js, Spinner.jsx
│   │   │   │                                           -->
│   │   │   └── ⚛️ WebViewContainer.jsx ❗         <!-- VERSION: 0.0.3 PATH: src/ui/views/WebViewContainer.jsx
│   │   │                                               PURPOSE: Kontener renderowania WebView dla aktywnego profilu
│   │   │                                               FUNCTIONS: WebViewContainer
│   │   │                                               DEPENDS ON: react, Spinner.jsx
│   │   │                                               -->
│   │   ├── 📁 webview/
│   │   │   ├── ⚛️ WebViewTab.jsx ❗               <!-- VERSION: 0.0.3 PATH: src/ui/webview/WebViewTab.jsx
│   │   │   │                                           PURPOSE: Zakładka WebView – lifecycle, nawigacja, zoom,
│   │   │   │                                                    recovery, logowanie błędów
│   │   │   │                                           FUNCTIONS: WebViewTab
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer.js,
│   │   │   │                                                       WebViewToolbar.jsx
│   │   │   │                                           -->
│   │   │   └── ⚛️ WebViewToolbar.jsx ❗           <!-- VERSION: 0.0.3 PATH: src/ui/webview/WebViewToolbar.jsx
│   │   │                                               PURPOSE: Pasek narzędzi WebView – przyciski i akcje (Back,
│   │   │                                                        Forward, Reload, Zoom, itp.)
│   │   │                                               FUNCTIONS: WebViewToolbar
│   │   │                                               DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│   │   │                                               -->
│   │   ├── 🎨 index.css                           <!-- VERSION: 0.0.3 PATH: src/ui/index.css
│   │   │                                               PURPOSE: Główny plik stylów – importuje layout, theme,
│   │   │                                                        components
│   │   │                                               FUNCTIONS: -
│   │   │                                               DEPENDS ON: -
│   │   │                                               -->
│   │   └── 🎨 layout.css                          <!-- VERSION: 0.0.3 PATH: src/ui/layout.css
│   │                                                   PURPOSE: Layout aplikacji – grid, sidebar, content, toolbar
│   │                                                   FUNCTIONS: -
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 📁 utils/
│   │   ├── 📜 fileUtils.js                        <!-- VERSION: 0.0.3 PATH: src/utils/fileUtils.js
│   │   │                                               PURPOSE: Uniwersalne i bezpieczne opakowanie natywnych funkcji
│   │   │                                                        I/O Node.js dla plików JSON z automatyczną obsługą
│   │   │                                                        błędów.
│   │   │                                               FUNCTIONS: readJsonSafe, writeJsonSafe
│   │   │                                               DEPENDS ON: fs, logger.js
│   │   │                                               -->
│   │   ├── 📜 icons.js                            <!-- VERSION: 0.0.3 PATH: src/utils/icons.js
│   │   │                                               PURPOSE: Re-export ikon z kanonicznej lokalizacji
│   │   │                                                        src/data/icons.js
│   │   │                                               FUNCTIONS: -
│   │   │                                               DEPENDS ON: icons.js
│   │   │                                               -->
│   │   ├── 📜 imageUtils.js                       <!-- VERSION: 0.0.3 PATH: src/utils/imageUtils.js
│   │   │                                               PURPOSE: Funkcje pomocnicze do manipulacji plikami graficznymi
│   │   │                                                        (resize, format conversion) oparte na silniku sharp.
│   │   │                                               FUNCTIONS: resizeImage, convertImage, compressJpeg
│   │   │                                               DEPENDS ON: sharp, logger.js
│   │   │                                               -->
│   │   ├── 📜 logWriter.js                        <!-- VERSION: 0.0.3 PATH: src/utils/logWriter.js
│   │   │                                               PURPOSE: Zarządzanie utrwalaniem logów błędów i wyników testów w
│   │   │                                                        systemie plików (userData) poprzez mostek IPC.
│   │   │                                               FUNCTIONS: initLogWriter, appendTestFailLog, getLogsContent,
│   │   │                                                          clearLogsFile
│   │   │                                               DEPENDS ON: logger.js, config.js
│   │   │                                               -->
│   │   ├── 📜 logger.js                           <!-- VERSION: 0.0.3 PATH: src/utils/logger.js
│   │   │                                               PURPOSE: Główna logika logowania z filtrowaniem per-modułowym.
│   │   │                                                        Obsługuje proces Main i Renderer.
│   │   │                                               FUNCTIONS: initLogger, setDebugMode, setDebugModule, isDebugMode,
│   │   │                                                          log, warn, error, logDebug, logInfo, logWarn,
│   │   │                                                          logError, getLogFilePath
│   │   │                                               DEPENDS ON: config.js, electron
│   │   │                                               -->
│   │   ├── 📜 loggerRenderer.js                   <!-- VERSION: 0.0.3 PATH: src/utils/loggerRenderer.js
│   │   │                                               PURPOSE: Cienki wrapper re-eksportujący logger.js dla procesu
│   │   │                                                        renderera (React).
│   │   │                                               FUNCTIONS: -
│   │   │                                               DEPENDS ON: loggerRenderer, logger.js
│   │   │                                               -->
│   │   ├── 📜 networkUtils.js                     <!-- VERSION: 0.0.3 PATH: src/utils/networkUtils.js
│   │   │                                               PURPOSE: Funkcje pomocnicze do diagnostyki sieciowej i
│   │   │                                                        sprawdzania dostępności zewnętrznych zasobów.
│   │   │                                               FUNCTIONS: pingUrl
│   │   │                                               DEPENDS ON: logger.js
│   │   │                                               -->
│   │   ├── 📜 notesStorage.js ❗                   <!-- VERSION: 0.0.3 PATH: src/utils/notesStorage.js
│   │   │                                               PURPOSE: Pomocnicze funkcje zapisu i odczytu notatek oraz
│   │   │                                                        fabryka zakładek
│   │   │                                               FUNCTIONS: createNewTab, loadNotesFromStorage,
│   │   │                                                          saveNotesToStorage
│   │   │                                               DEPENDS ON: logger.js
│   │   │                                               -->
│   │   ├── 📜 notificationsManager.js ❗           <!-- VERSION: 0.0.3 PATH: src/utils/notificationsManager.js
│   │   │                                               PURPOSE: Toasty w UI + opcjonalne powiadomienia systemowe
│   │   │                                                        (renderer).
│   │   │                                               FUNCTIONS: registerToastHandler, showToast,
│   │   │                                                          showSystemNotification
│   │   │                                               DEPENDS ON: logger.js
│   │   │                                               -->
│   │   ├── 📜 searchIndex.js                      <!-- VERSION: 0.0.3 PATH: src/utils/searchIndex.js
│   │   │                                               PURPOSE: Budowanie ujednoliconego indeksu wyszukiwania
│   │   │                                                        (profiles, projects, tasks, notes) dla globalnej palety
│   │   │                                                        komend (Ctrl+K).
│   │   │                                               FUNCTIONS: buildSearchIndex, searchAll
│   │   │                                               DEPENDS ON: logger.js
│   │   │                                               -->
│   │   ├── 📜 sharpLoader.js ❗                    <!-- VERSION: 0.0.3 PATH: src/utils/sharpLoader.js
│   │   │                                               PURPOSE: Leniwe ładowanie modułu sharp (przetwarzanie obrazów) z
│   │   │                                                        obsługą braku zależności. Używane przez
│   │   │                                                        ipcMainHandlers_imageSharp.js w main process.
│   │   │                                               FUNCTIONS: loadSharp
│   │   │                                               DEPENDS ON: komponenty z folderu sharp/
│   │   │                                               -->
│   │   ├── 📜 testrunner.js                       <!-- VERSION: 0.0.3 PATH: src/utils/testrunner.js
│   │   │                                               PURPOSE: Silnik do uruchamiania testów jednostkowych i
│   │   │                                                        integracyjnych – asercje, liczniki wyników i
│   │   │                                                        raportowanie PASS/FAIL.
│   │   │                                               FUNCTIONS: initTestResults, assert, assertThrows, getTestResults,
│   │   │                                                          logTestSummary
│   │   │                                               DEPENDS ON: logger.js, icons.js
│   │   │                                               -->
│   │   ├── 📜 translations.js                     <!-- VERSION: 0.0.3 PATH: src/utils/translations.js
│   │   │                                               PURPOSE: Logika ładowania tłumaczeń i helpData, provider
│   │   │                                                        contextu (dynamicznie)
│   │   │                                               FUNCTIONS: TranslationProvider
│   │   │                                               DEPENDS ON: react, config.js
│   │   │                                               -->
│   │   ├── 📜 urlUtils.js                         <!-- VERSION: 0.0.3 PATH: src/utils/urlUtils.js
│   │   │                                               PURPOSE: Narzędzia do walidacji, normalizacji i sanityzacji
│   │   │                                                        adresów URL dla modułu WebView.
│   │   │                                               FUNCTIONS: normalizeWebUrl, isValidWebUrl, isSafeUrl
│   │   │                                               DEPENDS ON: logger.js
│   │   │                                               -->
│   │   ├── 📜 validators.js                       <!-- VERSION: 0.0.3 PATH: src/utils/validators.js
│   │   │                                               PURPOSE: Walidatory typów danych wykorzystywane przy sprawdzaniu
│   │   │                                                        poprawności payloadów IPC i stanów magazynów.
│   │   │                                               FUNCTIONS: ensureString, ensureObject
│   │   │                                               DEPENDS ON: logger.js
│   │   │                                               -->
│   │   └── 📜 yamlLoader.js ❗                     <!-- VERSION: 0.0.3 PATH: src/utils/yamlLoader.js
│   │                                                   PURPOSE: Leniwe ładowanie modułu js-yaml
│   │                                                            (parsowanie/serializacja YAML) z obsługą braku
│   │                                                            zależności. Używane przez ipcMainHandlers_jsonYaml.js w
│   │                                                            main process.
│   │                                                   FUNCTIONS: loadYaml
│   │                                                   DEPENDS ON: komponenty z folderu yaml/
│   │                                                   -->
│   ├── ⚛️ App.jsx ❗                              <!-- VERSION: 0.0.3 PATH: src/App.jsx
│   │                                                   PURPOSE: Główny komponent root aplikacji React – inicjalizuje
│   │                                                            system logowania, ładuje profile i ustawienia
│   │                                                            użytkownika, zarządza motywem graficznym (dark/light)
│   │                                                            oraz obsługuje globalne skróty klawiszowe i stan sieci.
│   │                                                   FUNCTIONS: App
│   │                                                   DEPENDS ON: react, config.js, translations.js, loggerRenderer.js,
│   │                                                               urlUtils.js, MainLayout.jsx, Spinner.jsx
│   │                                                   -->
│   ├── 📜 config.js                               <!-- VERSION: 0.0.3 PATH: src/config.js
│   │                                                   PURPOSE: Centralna konfiguracja aplikacji - flagi funkcji,
│   │                                                            limity i domyślne ustawienia.
│   │                                                   FUNCTIONS: isFeatureEnabled, isToolEnabled, getDefaultSetting,
│   │                                                              getLimit
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 📜 constants.js                            <!-- VERSION: 0.0.3 PATH: src/constants.js
│   │                                                   PURPOSE: Application-wide constants and enums (tasks, app
│   │                                                            categories, etc.)
│   │                                                   FUNCTIONS: -
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   └── ⚛️ index.jsx                              <!-- VERSION: 0.0.3 PATH: src/index.jsx
│                                                       PURPOSE: Punkt wejścia aplikacji React. Montuje <App /> w #root,
│                                                       FUNCTIONS: -
│                                                       DEPENDS ON: react, react-dom, useTranslation, App
│                                                       -->
├── 📁 tests/
│   ├── 📜 TestRunner.js                           <!-- VERSION: 0.0.3 PATH: tests/TestRunner.js
│   │                                                   PURPOSE: Orchestrator testów – uruchamia wszystkie
│   │                                                            TestRunner_*.js
│   │                                                   FUNCTIONS: runAllTests
│   │                                                   DEPENDS ON: logger.js, icons.js, logWriter.js, testsLoader.js
│   │                                                   -->
│   ├── 📜 TestRunner_AdBlocker.js ❗               <!-- VERSION: 0.0.3 PATH: tests/TestRunner_AdBlocker.js
│   │                                                   PURPOSE: Testy jednostkowe dla AdBlockera (globalny + per
│   │                                                            profil, wykrywanie URL)
│   │                                                   FUNCTIONS: runAdBlockerTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Assets.js                    <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Assets.js
│   │                                                   PURPOSE: Testy spójności plików w folderze assets/
│   │                                                   FUNCTIONS: runAssetsTests
│   │                                                   DEPENDS ON: fs, path, testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_BusinessLogic.js ❗           <!-- VERSION: 0.0.3 PATH: tests/TestRunner_BusinessLogic.js
│   │                                                   PURPOSE: Testy czystych funkcji biznesowych (cartesian,
│   │                                                            parseSplitChar, sortByPin, normalizeUrl)
│   │                                                   FUNCTIONS: runBusinessLogicTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_CSS.js                       <!-- VERSION: 0.0.3 PATH: tests/TestRunner_CSS.js
│   │                                                   PURPOSE: Testy spójności plików CSS (importy, kolejność,
│   │                                                            istniejące pliki)
│   │                                                   FUNCTIONS: runCssTests
│   │                                                   DEPENDS ON: fs, path, testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Config.js                    <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Config.js
│   │                                                   PURPOSE: Testy pliku konfiguracyjnego config.js
│   │                                                   FUNCTIONS: runConfigTests
│   │                                                   DEPENDS ON: fs, path, testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Doc.js                       <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Doc.js
│   │                                                   PURPOSE: Testy spójności dokumentacji w folderze doc/
│   │                                                   FUNCTIONS: runDocTests
│   │                                                   DEPENDS ON: fs, path, testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_ElectronAPI.js               <!-- VERSION: 0.0.3 PATH: tests/TestRunner_ElectronAPI.js
│   │                                                   PURPOSE: Testy dostępności i typu metod window.electronAPI
│   │                                                   FUNCTIONS: runElectronAPITests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_History.js                   <!-- VERSION: 0.0.3 PATH: tests/TestRunner_History.js
│   │                                                   PURPOSE: Testy integralności logów aktywności użytkownika.
│   │                                                            Sprawdza walidację poziomów logowania, mechanizmy
│   │                                                            filtrowania zdarzeń oraz poprawność przycinania
│   │                                                            historii do zdefiniowanych limitów (FIFO).
│   │                                                   FUNCTIONS: runHistoryTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_IPC.js                       <!-- VERSION: 0.0.3 PATH: tests/TestRunner_IPC.js
│   │                                                   PURPOSE: Testy dostępności i typów dla nowych handlerów IPC
│   │                                                   FUNCTIONS: runIPCTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Icons.js                     <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Icons.js
│   │                                                   PURPOSE: Testy integralności ikon (ICONS, SIDEBAR_ICON_MAP)
│   │                                                   FUNCTIONS: runIconsTests
│   │                                                   DEPENDS ON: testUtils.js, icons.js
│   │                                                   -->
│   ├── 📜 TestRunner_Locales.js                   <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Locales.js
│   │                                                   PURPOSE: Testy integralności plików locales (dynamicznie z
│   │                                                            LANGUAGES z config.js)
│   │                                                   FUNCTIONS: runLocalesTests
│   │                                                   DEPENDS ON: testUtils.js, config.js
│   │                                                   -->
│   ├── 📜 TestRunner_LogWriter.js                 <!-- VERSION: 0.0.3 PATH: tests/TestRunner_LogWriter.js
│   │                                                   PURPOSE: Testy dla LogWritera (zapis, odczyt, czyszczenie, limit
│   │                                                            linii)
│   │                                                   FUNCTIONS: runLogWriterTests
│   │                                                   DEPENDS ON: testUtils.js, logWriter.js
│   │                                                   -->
│   ├── 📜 TestRunner_MainEngine.js                <!-- VERSION: 0.0.3 PATH: tests/TestRunner_MainEngine.js
│   │                                                   PURPOSE: Testy modułów wyciągniętych z main.js (webviewRegistry,
│   │                                                            adBlocker, hotkeysManager)
│   │                                                   FUNCTIONS: runMainEngineTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Notepad.js                   <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Notepad.js
│   │                                                   PURPOSE: Zestaw testów dla modułu notatnika. Weryfikuje
│   │                                                            integralność danych kart, poprawność mechanizmu
│   │                                                            autozapisu (dirty checking) oraz logikę przełączania
│   │                                                            kontekstu między dokumentami.
│   │                                                   FUNCTIONS: runNotepadTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Profiles.js                  <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Profiles.js
│   │                                                   PURPOSE: Zestaw testów jednostkowych i integracyjnych dla
│   │                                                            zarządzania profilami WebView. Weryfikuje strukturę
│   │                                                            danych, poprawność kategorii oraz mechanizmy sortowania
│   │                                                            chronologicznego.
│   │                                                   FUNCTIONS: runProfilesTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Projects.js                  <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Projects.js
│   │                                                   PURPOSE: Zestaw testów dla modułu projektów. Weryfikuje
│   │                                                            mechanizmy archiwizacji, strukturę obiektów
│   │                                                            projektowych oraz poprawność agregacji liczby zadań
│   │                                                            przypisanych do konkretnych projektów.
│   │                                                   FUNCTIONS: runProjectsTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Reexport.js                  <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Reexport.js
│   │                                                   PURPOSE: Testy poprawności re-eksportów (config.js, icons.js)
│   │                                                   FUNCTIONS: runReexportTests
│   │                                                   DEPENDS ON: fs, path, testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Settings.js                  <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Settings.js
│   │                                                   PURPOSE: Zestaw testów dla silnika ustawień. Weryfikuje
│   │                                                            bezpieczeństwo głębokiego łączenia (merge)
│   │                                                            konfiguracji, stabilność przełączania motywów oraz
│   │                                                            poprawność schematu danych przy imporcie/eksporcie.
│   │                                                   FUNCTIONS: runSettingsTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_SleepTabs.js ❗               <!-- VERSION: 0.0.3 PATH: tests/TestRunner_SleepTabs.js
│   │                                                   PURPOSE: Testy jednostkowe dla Sleep Tabs
│   │                                                   FUNCTIONS: runSleepTabsTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Store.js                     <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Store.js
│   │                                                   PURPOSE: Testy struktury danych pobieranych z store (settings,
│   │                                                            notes, history)
│   │                                                   FUNCTIONS: runStoreTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Tasks.js                     <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Tasks.js
│   │                                                   PURPOSE: Testy funkcjonalne systemu zarządzania zadaniami.
│   │                                                            Sprawdza poprawność typów danych, wydajność filtrowania
│   │                                                            priorytetów oraz sprawność wyszukiwarki pełnotekstowej
│   │                                                            w obrębie zadań.
│   │                                                   FUNCTIONS: runTasksTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Terminal.js ❗                <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Terminal.js
│   │                                                   PURPOSE: Testy jednostkowe dla Terminala (xterm, node-pty,
│   │                                                            historia, ANSI)
│   │                                                   FUNCTIONS: runTerminalTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Tools.js                     <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Tools.js
│   │                                                   PURPOSE: Testy jednostkowe dla narzędzi (JSON, Regex, Markdown,
│   │                                                            Clipboard)
│   │                                                   FUNCTIONS: runToolsTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_WebView.js                   <!-- VERSION: 0.0.3 PATH: tests/TestRunner_WebView.js
│   │                                                   PURPOSE: Testy jednostkowe dla WebView (Single App, Screenshot,
│   │                                                            Resource Monitor, Zoom)
│   │                                                   FUNCTIONS: runWebViewTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   └── 📜 testUtils.js                            <!-- VERSION: 0.0.3 PATH: tests/testUtils.js
│                                                       PURPOSE: Wspólne funkcje dla wszystkich testów (runner,
│                                                                logowanie)
│                                                       FUNCTIONS: runTests
│                                                       DEPENDS ON: icons.js
│                                                       -->
├── 📜 config.js                                   <!-- VERSION: 0.0.3 PATH: config.js
│                                                       PURPOSE: Re-eksport konfiguracji z src/config.js.
│                                                       FUNCTIONS: -
│                                                       DEPENDS ON: config.js
│                                                       -->
├── 📜 main.js ❗                                   <!-- VERSION: 0.0.3 PATH: main.js
│                                                       PURPOSE: Główna logika procesu głównego Electron – koordynacja,
│                                                                okno, bezpieczeństwo
│                                                       FUNCTIONS: createWindow, runStartupTestsIfEnabled,
│                                                                  checkDiskSpaceWarning
│                                                       DEPENDS ON: electron, path, url, child_process, config.js,
│                                                                   settingsStore.js, logger.js, TestRunner.js,
│                                                                   adBlocker.js, hotkeysManager.js, ipcLoader.js
│                                                       -->
├── 📦 package.json                                <!-- VERSION: - PATH: package.json
│                                                       PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│                                                                pomocniczej.
│                                                       FUNCTIONS: -
│                                                       DEPENDS ON: -
│                                                       -->
├── 📜 preload.cjs ❗                               <!-- VERSION: 0.0.3 PATH: preload.cjs
│                                                       PURPOSE: Bridge IPC – eksponuje bezpieczne API dla renderera
│                                                                (contextBridge). Definiuje metody komunikacji i
│                                                                handlery zdarzeń z mechanizmem cleanup.
│                                                       FUNCTIONS: -
│                                                       DEPENDS ON: electron
│                                                       -->
└── 📄 readme.md                                   <!-- VERSION: 0.0.3 PATH: readme.md
                                                        PURPOSE: Dokumentacja specyfikacji projektowej
                                                        FUNCTIONS: Dokumentacja: 14 sekcji głównych
                                                        DEPENDS ON: -
                                                        -->
<!-- TREE END -->
<!-- OTHER SECTIONS -->
) jest generowana automatycznie
  przez build_structure.py — NIE edytować ręcznie tej sekcji.
  Sekcja po <!-- OTHER SECTIONS --> jest obecnie statyczna i można ją edytować dla aktualizacji.
-->

root/
├── 📁 assets/
│   ├── 🖼️ app-icon.ico                           <!-- VERSION: - PATH: assets/app-icon.ico
│   │                                                   PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│   │                                                            pomocniczej.
│   │                                                   FUNCTIONS: -
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 🖼️ app-icon.png                           <!-- VERSION: - PATH: assets/app-icon.png
│   │                                                   PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│   │                                                            pomocniczej.
│   │                                                   FUNCTIONS: -
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   └── 🖼️ multiweb_manager_architecture_graph.png <!-- VERSION: - PATH: assets/multiweb_manager_architecture_graph.png
│                                                       PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│                                                                pomocniczej.
│                                                       FUNCTIONS: -
│                                                       DEPENDS ON: -
│                                                       -->
├── 📁 doc/
│   ├── 📄 AI_Development_Standards.md             <!-- VERSION: 0.0.3 PATH: doc/AI_Development_Standards.md
│   │                                                   PURPOSE: Dokumentacja specyfikacji projektowej - Standardy
│   │                                                            tworzenia i modyfikacji kodu
│   │                                                   FUNCTIONS: Dokumentacja: 21 sekcji głównych
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 📄 AI_Repository_Access.md                 <!-- VERSION: 0.0.3 PATH: doc/AI_Repository_Access.md
│   │                                                   PURPOSE: Dokumentacja specyfikacji projektowej - Mapowanie
│   │                                                            bezpośrednich odnośników RAW dla modeli AI (Claude).
│   │                                                   FUNCTIONS: -
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 📄 Definition_Mockups_UI_UX.md             <!-- VERSION: 0.0.3 PATH: doc/Definition_Mockups_UI_UX.md
│   │                                                   PURPOSE: Dokumentacja specyfikacji projektowej - Kompletny opis
│   │                                                            UI/UX aplikacji MultiWeb Manager (do np. Figma)
│   │                                                   FUNCTIONS: Dokumentacja: 41 sekcji głównych
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 📄 DevelopersGuide.md                      <!-- VERSION: 0.0.3 PATH: doc/DevelopersGuide.md
│   │                                                   PURPOSE: Dokumentacja specyfikacji projektowej - Kompletny
│   │                                                            przewodnik developerski MultiWeb Manager
│   │                                                   FUNCTIONS: Dokumentacja: 17 sekcji głównych
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 📄 Global_Project_Starter_Guide.md         <!-- VERSION: 0.0.3 PATH: doc/Global_Project_Starter_Guide.md
│   │                                                   PURPOSE: Dokumentacja specyfikacji projektowej - Globalny
│   │                                                            przewodnik inicjalizacji projektów (AI First)
│   │                                                   FUNCTIONS: Dokumentacja: 15 sekcji głównych
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 📄 ModulesOverview.md                      <!-- VERSION: 0.0.3 PATH: doc/ModulesOverview.md
│   │                                                   PURPOSE: Dokumentacja specyfikacji projektowej - Ujednolicona
│   │                                                            lista modułów + opis przeznaczenia dla AI i devów
│   │                                                   FUNCTIONS: Dokumentacja: 78 sekcji głównych
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 📄 Project_Initialization_Guide.md         <!-- VERSION: 0.0.3 PATH: doc/Project_Initialization_Guide.md
│   │                                                   PURPOSE: Dokumentacja specyfikacji projektowej - Kompletny
│   │                                                            przewodnik startowy — jak rozpocząć nowy projekt
│   │                                                            (AI-first)
│   │                                                   FUNCTIONS: Dokumentacja: 12 sekcji głównych
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 📄 Requirements.md                         <!-- VERSION: 0.0.3 PATH: doc/Requirements.md
│   │                                                   PURPOSE: Dokumentacja specyfikacji projektowej - Wymagania
│   │                                                            aplikacji z aktualnymi statusami, priorytetami i
│   │                                                            komentarzami
│   │                                                   FUNCTIONS: Dokumentacja: 17 sekcji głównych
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 📄 Structure.md                            <!-- VERSION: - PATH: doc/Structure.md
│   │                                                   PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│   │                                                            pomocniczej.
│   │                                                   FUNCTIONS: -
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   └── 📄 pending_updates_for_Definition_Mockups_UI_UX.md <!-- VERSION: 0.0.3 PATH: doc/pending_updates_for_Definition_Mockups_UI_UX.md
│                                                       PURPOSE: Dokumentacja specyfikacji projektowej - Kolejka
│                                                                oczekujących zmian UI/UX do scalenia z
│                                                                Definition_Mockups_UI_UX.md.           AI dopisuje tu
│                                                                bieżące modyfikacje interfejsu wynikające z nowych
│                                                                funkcji w trakcie sprintu.           Scalanie zbiorcze
│                                                                raz na kilkanaście/kilkadziesiąt commitów.
│                                                       FUNCTIONS: -
│                                                       DEPENDS ON: -
│                                                       -->
├── 📁 public/
│   └── 🌐 index.html                              <!-- VERSION: 0.0.3 PATH: public/index.html
│                                                       PURPOSE: Główny plik html aplikacji dla WebView
│                                                       FUNCTIONS: -
│                                                       DEPENDS ON: -
│                                                       -->
├── 📁 src/
│   ├── 📁 core/
│   │   ├── 📜 accountsStore.js ❗                  <!-- VERSION: 0.0.3 PATH: src/core/accountsStore.js
│   │   │                                               PURPOSE: Zarządzanie kontami użytkownika (Google, GitHub, AI,
│   │   │                                                        itp.) – obsługa trwałości i operacji CRUD na danych
│   │   │                                                        kont.
│   │   │                                               FUNCTIONS: getAllAccounts, addAccount, updateAccount,
│   │   │                                                          deleteAccount
│   │   │                                               DEPENDS ON: fs, path, electron, logger.js
│   │   │                                               -->
│   │   ├── 📜 appLibraryStore.js ❗                <!-- VERSION: 0.0.3 PATH: src/core/appLibraryStore.js
│   │   │                                               PURPOSE: Statyczna App Library (WebCatalog-style) — odczyt,
│   │   │                                                        cache'owanie i filtrowanie aplikacji z pliku JSON
│   │   │                                                        (loadAppLibrary, filterApps, searchAppLibrary,
│   │   │                                                        getAppById).
│   │   │                                               FUNCTIONS: loadAppLibrary, filterApps, searchAppLibrary,
│   │   │                                                          getAppById
│   │   │                                               DEPENDS ON: fs, path, url, logger.js
│   │   │                                               -->
│   │   ├── 📜 clipboardStore.js ❗                 <!-- VERSION: 0.0.3 PATH: src/core/clipboardStore.js
│   │   │                                               PURPOSE: Zarządzanie historią schowka systemowego – dodawanie,
│   │   │                                                        pobieranie i czyszczenie wpisów tekstowych.
│   │   │                                               FUNCTIONS: addClipboardEntry, getClipboardHistory,
│   │   │                                                          clearClipboardHistory
│   │   │                                               DEPENDS ON: electron, config.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 historyStore.js ❗                   <!-- VERSION: 0.0.3 PATH: src/core/historyStore.js
│   │   │                                               PURPOSE: Zarządzanie historią akcji użytkownika – odczyt, zapis,
│   │   │                                                        dodawanie wpisów, czyszczenie i pobieranie ostatnich
│   │   │                                                        wpisów.
│   │   │                                               FUNCTIONS: loadHistory, saveHistory, addHistoryEntry,
│   │   │                                                          clearHistory, getRecentHistory
│   │   │                                               DEPENDS ON: config.js, persistence.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 notesStore.js ❗                     <!-- VERSION: 0.0.3 PATH: src/core/notesStore.js
│   │   │                                               PURPOSE: Zarządzanie notatkami użytkownika – ładowanie,
│   │   │                                                        zapisywanie oraz operacje CRUD na danych notatek.
│   │   │                                               FUNCTIONS: getAllNotes, addNote, updateNote, deleteNote
│   │   │                                               DEPENDS ON: fs, path, electron, logger.js
│   │   │                                               -->
│   │   ├── 📜 persistence.js ❗                    <!-- VERSION: 0.0.3 PATH: src/core/persistence.js
│   │   │                                               PURPOSE: Wspólne operacje I/O dla plików JSON – odczyt, zapis i
│   │   │                                                        zarządzanie ścieżkami w katalogu userData Electrona.
│   │   │                                               FUNCTIONS: getUserDataPath, readJsonFile, writeJsonFile
│   │   │                                               DEPENDS ON: fs, path, electron, logger.js
│   │   │                                               -->
│   │   ├── 📜 profilesStore.js ❗                  <!-- VERSION: 0.0.3 PATH: src/core/profilesStore.js
│   │   │                                               PURPOSE: Zarządzanie profilami WebView — odczyt z pliku, zapis,
│   │   │                                                        tworzenie, aktualizacja i usuwanie (loadProfiles,
│   │   │                                                        saveProfiles, createProfile, updateProfile,
│   │   │                                                        deleteProfile).
│   │   │                                               FUNCTIONS: loadProfiles, saveProfiles, createProfile,
│   │   │                                                          updateProfile, deleteProfile
│   │   │                                               DEPENDS ON: fs, path, url, persistence.js, logger.js, config.js
│   │   │                                               -->
│   │   ├── 📜 projectsStore.js ❗                  <!-- VERSION: 0.0.3 PATH: src/core/projectsStore.js
│   │   │                                               PURPOSE: Projekty (ProjectManager, AggregatedTasks) — plik
│   │   │                                                        projects.json.
│   │   │                                               FUNCTIONS: loadProjects, saveProjects, createProject,
│   │   │                                                          updateProject, archiveProject, deleteProject
│   │   │                                               DEPENDS ON: persistence.js, settingsStore.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 resourceMonitor.js ❗                <!-- VERSION: 0.0.3 PATH: src/core/resourceMonitor.js
│   │   │                                               PURPOSE: Serwis monitorujący zużycie zasobów systemowych
│   │   │                                                        (CPU/RAM) przez aplikację i system operacyjny.
│   │   │                                               FUNCTIONS: getSystemUsage
│   │   │                                               DEPENDS ON: os, config.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 settingsStore.js ❗                  <!-- VERSION: 0.0.3 PATH: src/core/settingsStore.js
│   │   │                                               PURPOSE: Ustawienia użytkownika — merge partial updates, reset
│   │   │                                                        do domyślnych.
│   │   │                                               FUNCTIONS: loadSettings, saveSettings, mergeSettings,
│   │   │                                                          updateSettings, resetSettings
│   │   │                                               DEPENDS ON: lodash, fs, path, url, config.js, persistence.js,
│   │   │                                                           logger.js
│   │   │                                               -->
│   │   ├── 📜 tasksStore.js ❗                     <!-- VERSION: 0.0.3 PATH: src/core/tasksStore.js
│   │   │                                               PURPOSE: Zadania per projekt (TaskPanel, AggregatedTasks).
│   │   │                                               FUNCTIONS: loadTasksSections, loadTasksByProject,
│   │   │                                                          saveTasksForProject, loadAllTasksGrouped, loadTasks
│   │   │                                               DEPENDS ON: fs, persistence.js, logger.js
│   │   │                                               -->
│   │   └── 📜 workspacesStore.js ❗                <!-- VERSION: 0.0.3 PATH: src/core/workspacesStore.js
│   │                                                   PURPOSE: Zarządzanie przestrzeniami roboczymi (workspaces)
│   │                                                            użytkownika – ładowanie, zapisywanie oraz operacje typu
│   │                                                            upsert.
│   │                                                   FUNCTIONS: getAllWorkspaces, saveWorkspace, saveWorkspaces,
│   │                                                              deleteWorkspace
│   │                                                   DEPENDS ON: fs, path, electron, logger.js
│   │                                                   -->
│   ├── 📁 data/
│   │   ├── 📦 app-library.json                    <!-- VERSION: 0.0.3 PATH: src/data/app-library.json
│   │   │                                               PURPOSE: Plik danych / tłumaczeń
│   │   │                                               FUNCTIONS: -
│   │   │                                               DEPENDS ON: -
│   │   │                                               -->
│   │   ├── 📦 defaultProfiles.json                <!-- VERSION: 0.0.3 PATH: src/data/defaultProfiles.json
│   │   │                                               PURPOSE: Domyślne profile użytkownika (template)
│   │   │                                               FUNCTIONS: -
│   │   │                                               DEPENDS ON: -
│   │   │                                               -->
│   │   ├── 📦 defaultSettings.json                <!-- VERSION: 0.0.3 PATH: src/data/defaultSettings.json
│   │   │                                               PURPOSE: Domyślne ustawienia aplikacji
│   │   │                                               FUNCTIONS: -
│   │   │                                               DEPENDS ON: -
│   │   │                                               -->
│   │   └── 📜 icons.js                            <!-- VERSION: 0.0.3 PATH: src/data/icons.js
│   │                                                   PURPOSE: Centralny rejestr wszystkich ikon używanych w
│   │                                                            aplikacji.
│   │                                                   FUNCTIONS: -
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 📁 engine/
│   │   ├── 📜 adBlocker.js ❗                      <!-- VERSION: 0.0.3 PATH: src/engine/adBlocker.js
│   │   │                                               PURPOSE: Implementacja blokowania reklam na poziomie sieciowym
│   │   │                                                        (webRequest) – wspiera ustawienia globalne i
│   │   │                                                        nadpisywanie per-profil.
│   │   │                                               FUNCTIONS: isAdUrl, setGlobalAdBlocker, getGlobalAdBlocker,
│   │   │                                                          setProfileAdBlocker, getProfileAdBlocker,
│   │   │                                                          initAdBlocker
│   │   │                                               DEPENDS ON: electron, config.js, logger.js, webviewRegistry.js
│   │   │                                               -->
│   │   ├── 📜 hotkeysManager.js ❗                 <!-- VERSION: 0.0.3 PATH: src/engine/hotkeysManager.js
│   │   │                                               PURPOSE: Zarządzanie globalnymi skrótami klawiszowymi w procesie
│   │   │                                                        głównym. Obsługuje rejestrację w OS i dispatch zdarzeń
│   │   │                                                        IPC do renderera.
│   │   │                                               FUNCTIONS: setMainWindow, unregisterAllHotkeys,
│   │   │                                                          registerGlobalHotkeys, getAllHotkeys, saveHotkeys,
│   │   │                                                          registerHotkeysFromList
│   │   │                                               DEPENDS ON: electron, config.js, logger.js, electron-store
│   │   │                                               -->
│   │   ├── 📜 sleepTabsManager.js ❗               <!-- VERSION: 0.0.3 PATH: src/engine/sleepTabsManager.js
│   │   │                                               PURPOSE: Logika zarządzania stanem bezczynności WebView –
│   │   │                                                        obliczanie timeoutów i weryfikacja gotowości do
│   │   │                                                        uśpienia.
│   │   │                                               FUNCTIONS: getSleepTimeoutMs, shouldSleepTab, markTabActive,
│   │   │                                                          getSleepPlaceholderState
│   │   │                                               DEPENDS ON: config.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 updateService.js ❗                  <!-- VERSION: 0.0.3 PATH: src/engine/updateService.js
│   │   │                                               PURPOSE: Placeholder sprawdzania aktualizacji (UpdateChecker UI
│   │   │                                                        → docelowo API).
│   │   │                                               FUNCTIONS: checkForUpdates
│   │   │                                               DEPENDS ON: logger.js
│   │   │                                               -->
│   │   └── 📜 webviewRegistry.js ❗                <!-- VERSION: 0.0.3 PATH: src/engine/webviewRegistry.js
│   │                                                   PURPOSE: Rejestracja WebView (mapy tabId ↔ webContentsId)
│   │                                                   FUNCTIONS: registerWebView, unregisterWebView, getWebViewEntry,
│   │                                                              getAllWebContents
│   │                                                   DEPENDS ON: logger.js, electron
│   │                                                   -->
│   ├── 📁 hooks/
│   │   ├── 📜 useHistoryLog.js ❗                  <!-- VERSION: 0.0.3 PATH: src/hooks/useHistoryLog.js
│   │   │                                               PURPOSE: Hook React do zarządzania i odświeżania logów historii
│   │   │                                                        aktywności użytkownika. Komunikuje się z historyStore
│   │   │                                                        przez mostek IPC.
│   │   │                                               FUNCTIONS: useHistoryLog
│   │   │                                               DEPENDS ON: react, loggerRenderer.js
│   │   │                                               -->
│   │   ├── 📜 useNotepad.js ❗                     <!-- VERSION: 0.0.3 PATH: src/hooks/useNotepad.js
│   │   │                                               PURPOSE: Hook React do zarządzania notatkami użytkownika –
│   │   │                                                        obsługa operacji CRUD (Create, Read, Update, Delete)
│   │   │                                                        przez mostek IPC.
│   │   │                                               FUNCTIONS: useNotepad
│   │   │                                               DEPENDS ON: react, loggerRenderer.js
│   │   │                                               -->
│   │   ├── 📜 useNotepadFindReplace.js ❗          <!-- VERSION: 0.0.3 PATH: src/hooks/useNotepadFindReplace.js
│   │   │                                               PURPOSE: Hook React obsługujący logikę wyszukiwania i
│   │   │                                                        zastępowania tekstu w edytorze notatnika.
│   │   │                                               FUNCTIONS: useNotepadFindReplace
│   │   │                                               DEPENDS ON: react, translations.js, loggerRenderer.js
│   │   │                                               -->
│   │   ├── 📜 useNotepadUI.js ❗                   <!-- VERSION: 0.0.3 PATH: src/hooks/useNotepadUI.js
│   │   │                                               PURPOSE: Hook React do zarządzania interfejsem notatnika –
│   │   │                                                        obsługa zakładek, automatycznego zapisu oraz skrótów
│   │   │                                                        klawiszowych.
│   │   │                                               FUNCTIONS: useNotepadUI
│   │   │                                               DEPENDS ON: react, translations.js, notesStorage.js,
│   │   │                                                           loggerRenderer.js
│   │   │                                               -->
│   │   ├── 📜 useProjects.js ❗                    <!-- VERSION: 0.0.3 PATH: src/hooks/useProjects.js
│   │   │                                               PURPOSE: Hook React do zarządzania projektami użytkownika –
│   │   │                                                        obsługa operacji CRUD przez mostek IPC.
│   │   │                                               FUNCTIONS: useProjects
│   │   │                                               DEPENDS ON: react, loggerRenderer.js
│   │   │                                               -->
│   │   ├── 📜 useSettings.js ❗                    <!-- VERSION: 0.0.3 PATH: src/hooks/useSettings.js
│   │   │                                               PURPOSE: Hook React do zarządzania ustawieniami użytkownika –
│   │   │                                                        ładowanie, aktualizacja i synchronizacja stanu z
│   │   │                                                        settingsStore przez mostek IPC.
│   │   │                                               FUNCTIONS: useSettings
│   │   │                                               DEPENDS ON: react, loggerRenderer.js
│   │   │                                               -->
│   │   ├── 📜 useTasks.js ❗                       <!-- VERSION: 0.0.3 PATH: src/hooks/useTasks.js
│   │   │                                               PURPOSE: Hook React do zarządzania zadaniami użytkownika –
│   │   │                                                        obsługa operacji CRUD przez mostek IPC.
│   │   │                                               FUNCTIONS: useTasks
│   │   │                                               DEPENDS ON: react, loggerRenderer.js
│   │   │                                               -->
│   │   ├── 📜 useTranslation.js                   <!-- VERSION: 0.0.3 PATH: src/hooks/useTranslation.js
│   │   │                                               PURPOSE: Hook React zapewniający dostęp do kontekstu tłumaczeń i
│   │   │                                                        danych pomocy.
│   │   │                                               FUNCTIONS: useTranslation
│   │   │                                               DEPENDS ON: react, translations.js, loggerRenderer.js
│   │   │                                               -->
│   │   └── 📜 useWorkspaces.js ❗                  <!-- VERSION: 0.0.3 PATH: src/hooks/useWorkspaces.js
│   │                                                   PURPOSE: Hook React do zarządzania przestrzeniami roboczymi
│   │                                                            (workspaces) użytkownika przez mostek IPC.
│   │                                                   FUNCTIONS: useWorkspaces
│   │                                                   DEPENDS ON: react, loggerRenderer.js
│   │                                                   -->
│   ├── 📁 ipc/
│   │   ├── 📜 ipcMainHandlers_adBlocker.js ❗      <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_adBlocker.js
│   │   │                                               PURPOSE: IPC handlery do zarządzania blokerem reklam – globalnie
│   │   │                                                        i per profil
│   │   │                                               FUNCTIONS: ipc:adblocker:setGlobal, ipc:adblocker:getGlobal,
│   │   │                                                          ipc:adblocker:setForProfile,
│   │   │                                                          ipc:adblocker:getForProfile
│   │   │                                               DEPENDS ON: electron, adBlocker.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_aggregatedTasks.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_aggregatedTasks.js
│   │   │                                               PURPOSE: IPC handlers dla widoku zbiorczego zadań.
│   │   │                                               FUNCTIONS: ipc:aggregatedTasks:getAll,
│   │   │                                                          ipc:aggregatedTasks:filter, ipc:aggregatedTasks:sort
│   │   │                                               DEPENDS ON: electron, tasksStore.js, projectsStore.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_appInfo.js ❗        <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_appInfo.js
│   │   │                                               PURPOSE: IPC handler do pobierania informacji o aplikacji
│   │   │                                               FUNCTIONS: ipc:app:getInfo
│   │   │                                               DEPENDS ON: electron, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_cookies.js ❗        <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_cookies.js
│   │   │                                               PURPOSE: IPC handler do pobierania cookies (Cookie Grabber)
│   │   │                                               FUNCTIONS: ipc:tools:getCookies
│   │   │                                               DEPENDS ON: electron, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_dialogs.js ❗        <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_dialogs.js
│   │   │                                               PURPOSE: IPC handlers dla natywnych okien dialogowych
│   │   │                                                        (open/save)
│   │   │                                               FUNCTIONS: ipc:dialog:openFile, ipc:dialog:saveFile
│   │   │                                               DEPENDS ON: electron, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_fileApi.js ❗        <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_fileApi.js
│   │   │                                               PURPOSE: IPC handlers dla File Previewer, Mini Postman i
│   │   │                                                        Clipboard
│   │   │                                               FUNCTIONS: ipc:tools:filePreview, ipc:tools:apiRequest,
│   │   │                                                          ipc:tools:clipboard:get
│   │   │                                               DEPENDS ON: electron, fs, path, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_fileSystem.js ❗     <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_fileSystem.js
│   │   │                                               PURPOSE: IPC handlers do odczytu i zapisu plików (przez main
│   │   │                                                        process)
│   │   │                                               FUNCTIONS: ipc:fs:readFile, ipc:fs:writeFile
│   │   │                                               DEPENDS ON: electron, fs, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_history.js ❗        <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_history.js
│   │   │                                               PURPOSE: IPC dla historii odwiedzin/akcji. history:getAll    –
│   │   │                                                        zwraca pełną historię (max 5000 wpisów) history:add    
│   │   │                                                          – dodaje nowy wpis i zapisuje history:clear     –
│   │   │                                                        czyści historię history:getRecent – zwraca ostatnie 100
│   │   │                                                        wpisów
│   │   │                                               FUNCTIONS: ipc:history:getAll, ipc:history:add,
│   │   │                                                          ipc:history:clear, ipc:history:getRecent
│   │   │                                               DEPENDS ON: electron, historyStore.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_hotkeys.js ❗        <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_hotkeys.js
│   │   │                                               PURPOSE: IPC handlery do zarządzania skrótami klawiszowymi –
│   │   │                                                        pobieranie, zapis, rejestracja
│   │   │                                               FUNCTIONS: ipc:hotkeys:getAll, ipc:hotkeys:save,
│   │   │                                                          ipc:hotkeys:register
│   │   │                                               DEPENDS ON: electron, hotkeysManager.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_imageSharp.js ❗     <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_imageSharp.js
│   │   │                                               PURPOSE: IPC handlery dla operacji na obrazach (resize, convert,
│   │   │                                                        compress)
│   │   │                                               FUNCTIONS: ipc:tools:image:resize, ipc:tools:image:convert,
│   │   │                                                          ipc:tools:image:compress
│   │   │                                               DEPENDS ON: electron, logger.js, sharpLoader.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_jsonYaml.js ❗       <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_jsonYaml.js
│   │   │                                               PURPOSE: IPC handlery dla JSON i YAML (formatowanie, konwersja)
│   │   │                                               FUNCTIONS: ipc:tools:formatJSON, ipc:tools:yamlToJson,
│   │   │                                                          ipc:tools:jsonToYaml
│   │   │                                               DEPENDS ON: electron, logger.js, yamlLoader.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_logs.js ❗           <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_logs.js
│   │   │                                               PURPOSE: Handlery IPC dla logów testów (LogWriter). logs:getFile
│   │   │                                                        buduje ścieżkę lokalnie przez app.getPath('userData') —
│   │   │                                                        nie używa getLogFilePath() z renderer logger.js (zwraca
│   │   │                                                        null w main).
│   │   │                                               FUNCTIONS: registerLogsHandlers, ipc:append-log-file,
│   │   │                                                          ipc:get-logs-file, ipc:clear-logs-file,
│   │   │                                                          ipc:logs:getFile
│   │   │                                               DEPENDS ON: electron, fs, path, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_notes.js ❗          <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_notes.js
│   │   │                                               PURPOSE: IPC dla notatek (Notepad, hooks useNotepad).
│   │   │                                               FUNCTIONS: ipc:notes:getAll, ipc:notes:add, ipc:notes:update,
│   │   │                                                          ipc:notes:delete
│   │   │                                               DEPENDS ON: electron, notesStore.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_openExternal.js ❗   <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_openExternal.js
│   │   │                                               PURPOSE: IPC handler do otwierania URL w domyślnej przeglądarce
│   │   │                                                        systemowej
│   │   │                                               FUNCTIONS: ipc:shell:openExternal
│   │   │                                               DEPENDS ON: electron, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_pathUtils.js ❗      <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_pathUtils.js
│   │   │                                               PURPOSE: IPC helpers dla operacji na ścieżkach (path.join,
│   │   │                                                        path.dirname)
│   │   │                                               FUNCTIONS: ipc:path:join, ipc:path:dirname
│   │   │                                               DEPENDS ON: electron, path, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_profiles.js ❗       <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_profiles.js
│   │   │                                               PURPOSE: IPC dla profili (Sidebar / Profile Manager / App
│   │   │                                                        Library) pobieranie profili zapisywanie profili edycja
│   │   │                                                        profili usuwanie profili ostatnio używane walidacja
│   │   │                                                        danych
│   │   │                                               FUNCTIONS: ipc:profiles:getAll, ipc:profiles:create,
│   │   │                                                          ipc:profiles:update, ipc:profiles:delete,
│   │   │                                                          ipc:profiles:touch
│   │   │                                               DEPENDS ON: electron, profilesStore.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_projects.js ❗       <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_projects.js
│   │   │                                               PURPOSE: IPC dla Project Manager settings:get        – pobiera
│   │   │                                                        aktualne ustawienia settings:update     – aktualizuje
│   │   │                                                        (merge patch, nie nadpisuje) settings:reset      –
│   │   │                                                        reset do DEFAULT_SETTINGS settings:export     – eksport
│   │   │                                                        do pliku JSON settings:import     – import z pliku JSON
│   │   │                                                        (merge) settings:getDefaults – zwraca DEFAULT_SETTINGS
│   │   │                                                        z config.js
│   │   │                                               FUNCTIONS: ipc:projects:getAll, ipc:projects:getWithTasks,
│   │   │                                                          ipc:projects:create, ipc:projects:update,
│   │   │                                                          ipc:projects:archive, ipc:projects:delete
│   │   │                                               DEPENDS ON: electron, projectsStore.js, tasksStore.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_regexMarkdown.js ❗  <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_regexMarkdown.js
│   │   │                                               PURPOSE: IPC handlers dla Regex Tester i Markdown Previewer
│   │   │                                               FUNCTIONS: ipc:tools:regexTest, ipc:tools:markdownRender
│   │   │                                               DEPENDS ON: electron, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_settings.js ❗       <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_settings.js
│   │   │                                               PURPOSE: IPC handlers dla Settings. settings:get        –
│   │   │                                                        pobiera aktualne ustawienia settings:update     –
│   │   │                                                        aktualizuje (merge patch, nie nadpisuje) settings:reset
│   │   │                                                             – reset do DEFAULT_SETTINGS settings:export     –
│   │   │                                                        eksport do pliku JSON settings:import     – import z
│   │   │                                                        pliku JSON (merge) settings:getDefaults – zwraca
│   │   │                                                        DEFAULT_SETTINGS z config.js
│   │   │                                               FUNCTIONS: ipc:settings:get, ipc:settings:update,
│   │   │                                                          ipc:settings:reset, ipc:settings:export,
│   │   │                                                          ipc:settings:import, ipc:settings:getDefaults
│   │   │                                               DEPENDS ON: electron, fs, logger.js, settingsStore.js, config.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_svgToPng.js ❗       <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_svgToPng.js
│   │   │                                               PURPOSE: IPC handler konwersji SVG → PNG przez sharp
│   │   │                                               FUNCTIONS: ipc:tools:svgToPng
│   │   │                                               DEPENDS ON: electron, fs, logger.js, sharpLoader.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_tasks.js ❗          <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_tasks.js
│   │   │                                               PURPOSE: IPC namespaced dla zadań (ui/taskpanel).
│   │   │                                               FUNCTIONS: ipc:tasks:getAll, ipc:tasks:saveSections
│   │   │                                               DEPENDS ON: electron, tasksStore.js, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_terminal.js ❗       <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_terminal.js
│   │   │                                               PURPOSE: IPC dla Terminala (node-pty + xterm.js) tworzenie sesji
│   │   │                                                        wysyłanie danych odbieranie danych zamykanie sesji
│   │   │                                                        restart cleanup
│   │   │                                               FUNCTIONS: ipc:terminal:create, ipc:terminal:write,
│   │   │                                                          ipc:terminal:resize, ipc:terminal:getBuffer,
│   │   │                                                          ipc:terminal:kill, ipc:terminal:restart
│   │   │                                               DEPENDS ON: electron, logger.js, node-pty, os
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_webview_cache.js ❗  <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_webview_cache.js
│   │   │                                               PURPOSE: IPC handler dla czyszczenia cache WebView
│   │   │                                               FUNCTIONS: ipc:webview:clearCache
│   │   │                                               DEPENDS ON: electron, logger.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_webview_controls.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_webview_controls.js
│   │   │                                               PURPOSE: IPC handlers dla User Agent, Single App Mode, Resource
│   │   │                                                        Monitor, Sleep Tabs. Używa ESM import path/url zamiast
│   │   │                                                        require() (ES module context).
│   │   │                                               FUNCTIONS: ipc:webview:setUserAgent, ipc:webview:openInWindow,
│   │   │                                                          ipc:webview:getUsage, ipc:webview:sleep,
│   │   │                                                          ipc:webview:wake
│   │   │                                               DEPENDS ON: electron, path, url, logger.js, config.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_webview_extra.js ❗  <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_webview_extra.js
│   │   │                                               PURPOSE: Dodatkowe handlery IPC dla WebView (screenshot, single
│   │   │                                                        app, resource)
│   │   │                                               FUNCTIONS: registerWebViewExtraHandlers, ipc:open-single-window,
│   │   │                                                          ipc:capture-webview, ipc:get-webview-resource
│   │   │                                               DEPENDS ON: electron, path, logger.js, webviewRegistry.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_webview_nav.js ❗    <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_webview_nav.js
│   │   │                                               PURPOSE: IPC handlers dla nawigacji WebView. webview:navigate
│   │   │                                                        waliduje URL przez isSafeUrl() przed loadURL() —
│   │   │                                                        blokuje javascript:, data:, file: itp.
│   │   │                                               FUNCTIONS: ipc:webview:navigate, ipc:webview:reload,
│   │   │                                                          ipc:webview:goBack, ipc:webview:goForward,
│   │   │                                                          ipc:webview:getURL
│   │   │                                               DEPENDS ON: electron, logger.js, urlUtils.js
│   │   │                                               -->
│   │   ├── 📜 ipcMainHandlers_webview_screenshot.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_webview_screenshot.js
│   │   │                                               PURPOSE: IPC handler dla screenshot WebView
│   │   │                                               FUNCTIONS: ipc:webview:screenshot
│   │   │                                               DEPENDS ON: electron, logger.js, config.js
│   │   │                                               -->
│   │   └── 📜 ipcMainHandlers_workspaces.js ❗     <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_workspaces.js
│   │                                                   PURPOSE: IPC dla workspace (Sidebar, useWorkspaces).
│   │                                                   FUNCTIONS: ipc:workspaces:getAll, ipc:workspaces:save
│   │                                                   DEPENDS ON: electron, workspacesStore.js, logger.js
│   │                                                   -->
│   ├── 📁 loaders/
│   │   ├── 📜 ipcLoader.js ❗                      <!-- VERSION: 0.0.3 PATH: src/loaders/ipcLoader.js
│   │   │                                               PURPOSE: Dynamicznie ładuje wszystkie handlery IPC z src/ipc/.
│   │   │                                                        Eliminuje konieczność ręcznego importowania każdego
│   │   │                                                        pliku w main.js. Pomija: ipcLegacyBridge.js (ładowany
│   │   │                                                        osobno jako most legacy).
│   │   │                                               FUNCTIONS: loadAllIpcHandlers
│   │   │                                               DEPENDS ON: komponenty z folderu ipc/
│   │   │                                               -->
│   │   └── 📜 testsLoader.js ❗                    <!-- VERSION: 0.0.3 PATH: src/loaders/testsLoader.js
│   │                                                   PURPOSE: Dynamicznie ładuje i uruchamia wszystkie testy z
│   │                                                            tests/TestRunner_*.js. Eliminuje konieczność ręcznego
│   │                                                            importowania testów w TestRunner.js. Pomija:
│   │                                                            TestRunner.js (orchestrator), testUtils.js, index.js.
│   │                                                   FUNCTIONS: loadAndRunAllTests
│   │                                                   DEPENDS ON: komponenty z folderu tests/
│   │                                                   -->
│   ├── 📁 locales/
│   │   ├── 📁 templates/
│   │   │   ├── 📦 help.template.json              <!-- VERSION: 0.0.3 PATH: src/locales/templates/help.template.json
│   │   │   │                                           PURPOSE: Szablon dla pomocy w nowym języku (kopiuj, zmień nazwę
│   │   │   │                                                    na help_[język].json i przetłumacz). PAMIĘTAJ: Jeśli
│   │   │   │                                                    dodajesz nowy język, zaktualizuj TestRunner_Locales.js
│   │   │   │                                                    (dodaj plik do LOCALE_FILES) ORAZ w
│   │   │   │                                                    src/utils/translations.js – w useEffect dla help, dodaj
│   │   │   │                                                    import help_[język].json.
│   │   │   │                                           FUNCTIONS: -
│   │   │   │                                           DEPENDS ON: -
│   │   │   │                                           -->
│   │   │   └── 📦 lang.template.json ❗            <!-- VERSION: 0.0.3 PATH: src/locales/templates/lang.template.json
│   │   │                                               PURPOSE: Szablon dla nowego języka (kopiuj, zmień nazwę na
│   │   │                                                        [język].json i przetłumacz). PAMIĘTAJ: Jeśli dodajesz
│   │   │                                                        nowy język, zaktualizuj TestRunner_Locales.js (dodaj
│   │   │                                                        plik do LOCALE_FILES) ORAZ w src/utils/translations.js
│   │   │                                                        dodaj import nowego języka oraz w
│   │   │                                                        src/hooks/useTranslation.js (jeśli używa locales).
│   │   │                                               FUNCTIONS: -
│   │   │                                               DEPENDS ON: -
│   │   │                                               -->
│   │   ├── 📦 en.json                             <!-- VERSION: 0.0.3 PATH: src/locales/en.json
│   │   │                                               PURPOSE: English translations
│   │   │                                               FUNCTIONS: -
│   │   │                                               DEPENDS ON: -
│   │   │                                               -->
│   │   ├── 📦 help_en.json                        <!-- VERSION: 0.0.3 PATH: src/locales/help_en.json
│   │   │                                               PURPOSE: Help content (EN) – translated from help_pl.json
│   │   │                                               FUNCTIONS: -
│   │   │                                               DEPENDS ON: -
│   │   │                                               -->
│   │   ├── 📦 help_pl.json                        <!-- VERSION: 0.0.3 PATH: src/locales/help_pl.json
│   │   │                                               PURPOSE: Treści pomocy (PL)
│   │   │                                               FUNCTIONS: -
│   │   │                                               DEPENDS ON: -
│   │   │                                               -->
│   │   └── 📦 pl.json                             <!-- VERSION: 0.0.3 PATH: src/locales/pl.json
│   │                                                   PURPOSE: Tłumaczenia polskie
│   │                                                   FUNCTIONS: -
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 📁 tools/
│   │   ├── 📜 apiClient.js ❗                      <!-- VERSION: 0.0.3 PATH: src/tools/apiClient.js
│   │   │                                               PURPOSE: Prosty wrapper HTTP do testowania API apiRequest(url,
│   │   │                                                        method, headers, body) wykonuje żądanie i zwraca {
│   │   │                                                        status, headers, body }
│   │   │                                               FUNCTIONS: apiRequest
│   │   │                                               DEPENDS ON: logger.js
│   │   │                                               -->
│   │   ├── 📜 markdownRenderer.js ❗               <!-- VERSION: 0.0.3 PATH: src/tools/markdownRenderer.js
│   │   │                                               PURPOSE: Renderowanie markdown do HTML przy użyciu marked -
│   │   │                                                        renderMarkdown(text) zwraca string HTML
│   │   │                                               FUNCTIONS: renderMarkdown
│   │   │                                               DEPENDS ON: marked, logger.js
│   │   │                                               -->
│   │   ├── 📜 regexEngine.js ❗                    <!-- VERSION: 0.0.3 PATH: src/tools/regexEngine.js
│   │   │                                               PURPOSE: Helper do testowania wyrażeń regularnych
│   │   │                                                        testRegex(pattern, flags, text) zwraca tablicę
│   │   │                                                        wszystkich dopasowań z podanego tekstu
│   │   │                                               FUNCTIONS: testRegex
│   │   │                                               DEPENDS ON: logger.js
│   │   │                                               -->
│   │   └── 📜 svgToPng.js ❗                       <!-- VERSION: 0.0.3 PATH: src/tools/svgToPng.js
│   │                                                   PURPOSE: Konwersja pliku SVG do PNG przy użyciu sharp
│   │                                                            svgToPng(svgPath, outputPath, width, height) odczytuje
│   │                                                            SVG z dysku, renderuje do PNG o podanych wymiarach i
│   │                                                            zapisuje wynik pod outputPath
│   │                                                   FUNCTIONS: svgToPng
│   │                                                   DEPENDS ON: fs, sharp, logger.js
│   │                                                   -->
│   ├── 📁 ui/
│   │   ├── 📁 appLibrary/
│   │   │   └── ⚛️ AppLibraryBrowser.jsx ❗        <!-- VERSION: 0.0.3 PATH: src/ui/appLibrary/AppLibraryBrowser.jsx
│   │   │                                               PURPOSE: Główny widok biblioteki aplikacji (App Library) –
│   │   │                                                        umożliwia przeglądanie skatalogowanych usług webowych,
│   │   │                                                        ich wyszukiwanie oraz szybkie dodawanie do profili
│   │   │                                                        użytkownika. Współpracuje z appLibraryStore.
│   │   │                                               FUNCTIONS: AppLibraryBrowser
│   │   │                                               DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │                                                           icons, appLibraryStore
│   │   │                                               -->
│   │   ├── 📁 help/
│   │   │   ├── ⚛️ FAQ.jsx                        <!-- VERSION: 0.0.3 PATH: src/ui/help/FAQ.jsx
│   │   │   │                                           PURPOSE: Pojedynczy wpis FAQ (pytanie + odpowiedź)
│   │   │   │                                           FUNCTIONS: -
│   │   │   │                                           DEPENDS ON: react, translations.js, icons.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ Help.jsx                       <!-- VERSION: 0.0.3 PATH: src/ui/help/Help.jsx
│   │   │   │                                           PURPOSE: Główny komponent pomocy – łączy sekcje (Profile, Tools,
│   │   │   │                                                    Tasks, Shortcuts, FAQ)
│   │   │   │                                           FUNCTIONS: Help
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, icons.js,
│   │   │   │                                                       HelpSection, ToolCard, Shortcut, FAQ
│   │   │   │                                           -->
│   │   │   ├── ⚛️ HelpSection.jsx ❗              <!-- VERSION: 0.0.3 PATH: src/ui/help/HelpSection.jsx
│   │   │   │                                           PURPOSE: Rozwijana sekcja pomocy (tytuł + treść)
│   │   │   │                                           FUNCTIONS: HelpSection
│   │   │   │                                           DEPENDS ON: react, translations.js, icons.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ Shortcut.jsx ❗                 <!-- VERSION: 0.0.3 PATH: src/ui/help/Shortcut.jsx
│   │   │   │                                           PURPOSE: Wiersz skrótu klawiaturowego
│   │   │   │                                           FUNCTIONS: Shortcut
│   │   │   │                                           DEPENDS ON: react, translations.js
│   │   │   │                                           -->
│   │   │   └── ⚛️ ToolCard.jsx ❗                 <!-- VERSION: 0.0.3 PATH: src/ui/help/ToolCard.jsx
│   │   │                                               PURPOSE: Karta opisu narzędzia (ikona, tytuł, opis)
│   │   │                                               FUNCTIONS: ToolCard
│   │   │                                               DEPENDS ON: react, translations.js
│   │   │                                               -->
│   │   ├── 📁 history/
│   │   │   ├── ⚛️ HistoryExport.jsx ❗            <!-- VERSION: 0.0.3 PATH: src/ui/history/HistoryExport.jsx
│   │   │   │                                           PURPOSE: Eksport historii do CSV
│   │   │   │                                           FUNCTIONS: HistoryExport
│   │   │   │                                           DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ HistoryFilters.jsx ❗           <!-- VERSION: 0.0.3 PATH: src/ui/history/HistoryFilters.jsx
│   │   │   │                                           PURPOSE: Filtry historii (poziom, sortowanie, przycisk
│   │   │   │                                                    czyszczenia)
│   │   │   │                                           FUNCTIONS: HistoryFilters
│   │   │   │                                           DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ HistoryList.jsx ❗              <!-- VERSION: 0.0.3 PATH: src/ui/history/HistoryList.jsx
│   │   │   │                                           PURPOSE: Lista wpisów historii (tabela)
│   │   │   │                                           FUNCTIONS: HistoryList
│   │   │   │                                           DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│   │   │   │                                           -->
│   │   │   └── ⚛️ HistoryLog.jsx ❗               <!-- VERSION: 0.0.3 PATH: src/ui/history/HistoryLog.jsx
│   │   │                                               PURPOSE: Historia przeglądania – lista ostatnio odwiedzonych
│   │   │                                                        profili
│   │   │                                               FUNCTIONS: HistoryLog
│   │   │                                               DEPENDS ON: react, historyStore.js, translations.js,
│   │   │                                                           loggerRenderer.js, icons.js, ConfirmModal.jsx,
│   │   │                                                           HistoryFilters.jsx, HistoryList.jsx
│   │   │                                               -->
│   │   ├── 📁 layout/
│   │   │   └── ⚛️ MainLayout.jsx ❗               <!-- VERSION: 0.0.3 PATH: src/ui/layout/MainLayout.jsx
│   │   │                                               PURPOSE: Główny szkielet interfejsu użytkownika (Shell) –
│   │   │                                                        definiuje siatkę aplikacji, koordynuje nawigację
│   │   │                                                        boczną, obszar roboczy (ContentRenderer) oraz integruje
│   │   │                                                        globalne mechanizmy modalne i powiadomienia sieciowe.
│   │   │                                               FUNCTIONS: MainLayout
│   │   │                                               DEPENDS ON: react, translations.js, loggerRenderer.js,
│   │   │                                                           Sidebar.jsx, ContentRenderer.jsx, ConfirmModal.jsx
│   │   │                                               -->
│   │   ├── 📁 modals/
│   │   │   ├── ⚛️ ConfirmModal.jsx ❗             <!-- VERSION: 0.0.3 PATH: src/ui/modals/ConfirmModal.jsx
│   │   │   │                                           PURPOSE: Generyczny komponent modalny służący do potwierdzania
│   │   │   │                                                    akcji krytycznych (np. usuwanie). Zapewnia spójność
│   │   │   │                                                    wizualną i zastępuje natywną funkcję window.confirm.
│   │   │   │                                           FUNCTIONS: ConfirmModal
│   │   │   │                                           DEPENDS ON: react, translations.js, loggerRenderer.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ Modal.jsx ❗                    <!-- VERSION: 0.0.3 PATH: src/ui/modals/Modal.jsx
│   │   │   │                                           PURPOSE: Bazowy komponent modalny dla całej aplikacji
│   │   │   │                                           FUNCTIONS: Modal
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js
│   │   │   │                                           -->
│   │   │   └── ⚛️ PromptModal.jsx ❗              <!-- VERSION: 0.0.3 PATH: src/ui/modals/PromptModal.jsx
│   │   │                                               PURPOSE: Modal z polem input – zastępuje window.prompt()
│   │   │                                               FUNCTIONS: PromptModal
│   │   │                                               DEPENDS ON: react, translations.js, loggerRenderer.js
│   │   │                                               -->
│   │   ├── 📁 notepad/
│   │   │   ├── ⚛️ ClipboardHistoryModal.jsx ❗    <!-- VERSION: 0.0.3 PATH: src/ui/notepad/ClipboardHistoryModal.jsx
│   │   │   │                                           PURPOSE: Okno modalne prezentujące listę historycznych wpisów ze
│   │   │   │                                                    schowka systemowego – umożliwia przeglądanie i
│   │   │   │                                                    odzyskiwanie skopiowanych wcześniej fragmentów tekstu.
│   │   │   │                                           FUNCTIONS: ClipboardHistoryModal
│   │   │   │                                           DEPENDS ON: react, translations.js, loggerRenderer.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ Notepad.jsx ❗                  <!-- VERSION: 0.0.3 PATH: src/ui/notepad/Notepad.jsx
│   │   │   │                                           PURPOSE: Główny komponent interfejsu notatnika – koordynuje
│   │   │   │                                                    pracę zakładek, edytora oraz paneli wyszukiwania i
│   │   │   │                                                    statusu, integrując logikę z hookami useNotepadUI i
│   │   │   │                                                    useNotepadFindReplace.
│   │   │   │                                           FUNCTIONS: Notepad
│   │   │   │                                           DEPENDS ON: react, useNotepadUI.js, useNotepadFindReplace.js,
│   │   │   │                                                       NotepadTabs, NotepadToolbar, NotepadFindReplace,
│   │   │   │                                                       NotepadStatusBar, loggerRenderer.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ NotepadFindReplace.jsx ❗       <!-- VERSION: 0.0.3 PATH: src/ui/notepad/NotepadFindReplace.jsx
│   │   │   │                                           PURPOSE: Panel znajdź/zastąp w notatniku
│   │   │   │                                           FUNCTIONS: NotepadFindReplace
│   │   │   │                                           DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ NotepadStatusBar.jsx ❗         <!-- VERSION: 0.0.3 PATH: src/ui/notepad/NotepadStatusBar.jsx
│   │   │   │                                           PURPOSE: Pasek informacyjny u dołu notatnika – wyświetla
│   │   │   │                                                    metadane aktywnego dokumentu: statystyki znaków/wierszy
│   │   │   │                                                    oraz czas ostatniego autozapisu.
│   │   │   │                                           FUNCTIONS: NotepadStatusBar
│   │   │   │                                           DEPENDS ON: react, translations.js, loggerRenderer.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ NotepadTabs.jsx ❗              <!-- VERSION: 0.0.3 PATH: src/ui/notepad/NotepadTabs.jsx
│   │   │   │                                           PURPOSE: Komponent zarządzający paskiem kart notatnika –
│   │   │   │                                                    obsługuje przełączanie dokumentów, ich zamykanie,
│   │   │   │                                                    zmianę nazwy oraz wizualizację stanu 'dirty'.
│   │   │   │                                           FUNCTIONS: NotepadTabs
│   │   │   │                                           DEPENDS ON: react, translations.js, loggerRenderer.js, icons.js,
│   │   │   │                                                       PromptModal.jsx
│   │   │   │                                           -->
│   │   │   └── ⚛️ NotepadToolbar.jsx ❗           <!-- VERSION: 0.0.3 PATH: src/ui/notepad/NotepadToolbar.jsx
│   │   │                                               PURPOSE: Pasek narzędzi notatnika (zapisz, znajdź, word wrap)
│   │   │                                               FUNCTIONS: NotepadToolbar
│   │   │                                               DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│   │   │                                               -->
│   │   ├── 📁 profiles/
│   │   │   └── ⚛️ Profiles.jsx ❗                 <!-- VERSION: 0.0.3 PATH: src/ui/profiles/Profiles.jsx
│   │   │                                               PURPOSE: UI zarządzania profilami WebView — wyświetlanie listy
│   │   │                                                        profili z danych IPC (load, wyświetlanie nazwy, URL,
│   │   │                                                        obsługa błędów). Używa window.electronAPI.invoke
│   │   │                                                        zamiast window.mw.
│   │   │                                               FUNCTIONS: Profiles
│   │   │                                               DEPENDS ON: react, loggerRenderer.js
│   │   │                                               -->
│   │   ├── 📁 projects/
│   │   │   ├── ⚛️ ProjectList.jsx ❗              <!-- VERSION: 0.0.3 PATH: src/ui/projects/ProjectList.jsx
│   │   │   │                                           PURPOSE: Lista projektów z akcjami (zadania, terminal, usuwanie)
│   │   │   │                                           FUNCTIONS: ProjectList
│   │   │   │                                           DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ ProjectManager.jsx ❗           <!-- VERSION: 0.0.3 PATH: src/ui/projects/ProjectManager.jsx
│   │   │   │                                           PURPOSE: Zarządzanie projektami – lista, dodawanie, usuwanie,
│   │   │   │                                                    edycja
│   │   │   │                                           FUNCTIONS: ProjectManager
│   │   │   │                                           DEPENDS ON: react, projectsStore.js, translations.js,
│   │   │   │                                                       loggerRenderer.js, icons.js, ConfirmModal.jsx,
│   │   │   │                                                       ProjectModal.jsx
│   │   │   │                                           -->
│   │   │   └── ⚛️ ProjectModal.jsx ❗             <!-- VERSION: 0.0.3 PATH: src/ui/projects/ProjectModal.jsx
│   │   │                                               PURPOSE: Modal dodawania nowego projektu (nazwa + ścieżka)
│   │   │                                               FUNCTIONS: ProjectModal
│   │   │                                               DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│   │   │                                               -->
│   │   ├── 📁 settings/
│   │   │   ├── ⚛️ AccountSection.jsx ❗           <!-- VERSION: 0.0.3 PATH: src/ui/settings/AccountSection.jsx
│   │   │   │                                           PURPOSE: Sekcja zarządzania profilem użytkownika – obecnie służy
│   │   │   │                                                    jako placeholder dla nadchodzącej funkcji
│   │   │   │                                                    synchronizacji danych w chmurze (Cloud Sync) planowanej
│   │   │   │                                                    w v0.0.4.
│   │   │   │                                           FUNCTIONS: AccountSection
│   │   │   │                                           DEPENDS ON: react, translations.js, src, loggerRenderer.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ DataLogsSection.jsx ❗          <!-- VERSION: 0.0.3 PATH: src/ui/settings/DataLogsSection.jsx
│   │   │   │                                           PURPOSE: Sekcja danych i logów (eksport/import, otwieranie
│   │   │   │                                                    folderu logów, logi testów)
│   │   │   │                                           FUNCTIONS: DataLogsSection
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │   │                                                       icons, ConfirmModal, Modal
│   │   │   │                                           -->
│   │   │   ├── ⚛️ DebugModulesSection.jsx ❗      <!-- VERSION: 0.0.3 PATH: src/ui/settings/DebugModulesSection.jsx
│   │   │   │                                           PURPOSE: UI do zarządzania filtrowaniem logów per-moduł.
│   │   │   │                                                    Widoczna tylko w trybie debugMode.
│   │   │   │                                           FUNCTIONS: DebugModulesSection
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer.js,
│   │   │   │                                                       icons.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ GeneralSection.jsx ❗           <!-- VERSION: 0.0.3 PATH: src/ui/settings/GeneralSection.jsx
│   │   │   │                                           PURPOSE: Sekcja ustawień ogólnych aplikacji – zarządza wyborem
│   │   │   │                                                    języka (i18n), motywem graficznym (Light/Dark) oraz
│   │   │   │                                                    globalnym trybem debugowania (developer mode).
│   │   │   │                                           FUNCTIONS: GeneralSection
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │   │                                                       icons
│   │   │   │                                           -->
│   │   │   ├── ⚛️ HotkeysManager.jsx ❗           <!-- VERSION: 0.0.3 PATH: src/ui/settings/HotkeysManager.jsx
│   │   │   │                                           PURPOSE: Interfejs zarządzania globalnymi skrótami klawiszowymi
│   │   │   │                                                    aplikacji. Umożliwia definiowanie akcji systemowych
│   │   │   │                                                    (screenshot, monitor) oraz wstawianie predefiniowanych
│   │   │   │                                                    snippetów tekstowych.
│   │   │   │                                           FUNCTIONS: HotkeysManager
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │   │                                                       ConfirmModal, Modal, notificationsManager.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ NotificationsSection.jsx ❗     <!-- VERSION: 0.0.3 PATH: src/ui/settings/NotificationsSection.jsx
│   │   │   │                                           PURPOSE: Sekcja powiadomień (toasty, system, Pushbullet)
│   │   │   │                                           FUNCTIONS: NotificationsSection
│   │   │   │                                           DEPENDS ON: react, translations.js, loggerRenderer, icons
│   │   │   │                                           -->
│   │   │   ├── ⚛️ Settings.jsx ❗                 <!-- VERSION: 0.0.3 PATH: src/ui/settings/Settings.jsx
│   │   │   │                                           PURPOSE: Główny kontener widoku ustawień aplikacji. Agreguje
│   │   │   │                                                    wszystkie sekcje konfiguracyjne (General, WebView,
│   │   │   │                                                    Tabs, Notifications, Hotkeys, Debug, Data) w jeden
│   │   │   │                                                    ustrukturyzowany interfejs użytkownika.
│   │   │   │                                           FUNCTIONS: Settings
│   │   │   │                                           DEPENDS ON: react, GeneralSection, WebViewSection, TabsSection,
│   │   │   │                                                       NotificationsSection, HotkeysManager,
│   │   │   │                                                       DebugModulesSection, DataLogsSection, AccountSection,
│   │   │   │                                                       translations.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ TabsSection.jsx ❗              <!-- VERSION: 0.0.3 PATH: src/ui/settings/TabsSection.jsx
│   │   │   │                                           PURPOSE: Sekcja konfiguracji zarządzania kartami – pozwala na
│   │   │   │                                                    ustawienie czasu bezczynności, po którym nieaktywne
│   │   │   │                                                    WebView są uśpiane w celu oszczędzania zasobów
│   │   │   │                                                    systemowych (RAM/CPU).
│   │   │   │                                           FUNCTIONS: TabsSection
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │   │                                                       icons
│   │   │   │                                           -->
│   │   │   └── ⚛️ WebViewSection.jsx ❗           <!-- VERSION: 0.0.3 PATH: src/ui/settings/WebViewSection.jsx
│   │   │                                               PURPOSE: Konfiguracja silnika przeglądarki (WebView) – zarządza
│   │   │                                                        globalnym blokowaniem reklam, maskowaniem tożsamości
│   │   │                                                        przeglądarki (User Agent) oraz trybami wyświetlania
│   │   │                                                        okien.
│   │   │                                               FUNCTIONS: WebViewSection
│   │   │                                               DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │                                                           icons
│   │   │                                               -->
│   │   ├── 📁 sidebar/
│   │   │   ├── ⚛️ CategoryModal.jsx ❗            <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/CategoryModal.jsx
│   │   │   │                                           PURPOSE: Formularz modalny do zarządzania kategoriami profili –
│   │   │   │                                                    umożliwia tworzenie nowych i edycję istniejących sekcji
│   │   │   │                                                    grupujących w Sidebarze.
│   │   │   │                                           FUNCTIONS: CategoryModal
│   │   │   │                                           DEPENDS ON: react, translations.js, icons.js, ModalPortal
│   │   │   │                                           -->
│   │   │   ├── ⚛️ ContextMenu.jsx ❗              <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/ContextMenu.jsx
│   │   │   │                                           PURPOSE: Menu kontekstowe (PPM) dla profilu
│   │   │   │                                           FUNCTIONS: ContextMenu
│   │   │   │                                           DEPENDS ON: react, translations.js, icons.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ ProfileModal.jsx ❗             <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/ProfileModal.jsx
│   │   │   │                                           PURPOSE: Zaawansowany formularz modalny do konfiguracji profili
│   │   │   │                                                    WebView – obsługuje parametry URL, ikony, przypisanie
│   │   │   │                                                    do kategorii oraz przełączniki adblockera i
│   │   │   │                                                    powiadomień.
│   │   │   │                                           FUNCTIONS: ProfileModal
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js,
│   │   │   │                                                       urlUtils.js, ModalPortal, notificationsManager.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ Sidebar.jsx ❗                  <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/Sidebar.jsx
│   │   │   │                                           PURPOSE: Główny panel nawigacyjny aplikacji – zarządza listą
│   │   │   │                                                    profili, hierarchią kategorii, narzędziami systemowymi
│   │   │   │                                                    oraz integracją z mostkiem IPC dla trwałości ustawień.
│   │   │   │                                           FUNCTIONS: Sidebar
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js,
│   │   │   │                                                       ProfileModal, CategoryModal, ContextMenu,
│   │   │   │                                                       SidebarSearch, SidebarCategory, SidebarProfileItem,
│   │   │   │                                                       SidebarTools, SidebarWorkspaces, ConfirmModal.jsx
│   │   │   │                                           -->
│   │   │   ├── ⚛️ SidebarCategory.jsx ❗          <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/SidebarCategory.jsx
│   │   │   │                                           PURPOSE: Nagłówek kategorii profilów (zwijanie/rozwijanie, menu
│   │   │   │                                                    kontekstowe)
│   │   │   │                                           FUNCTIONS: SidebarCategory
│   │   │   │                                           DEPENDS ON: react, translations.js, icons.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ SidebarProfileItem.jsx ❗       <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/SidebarProfileItem.jsx
│   │   │   │                                           PURPOSE: Pojedynczy profil w Sidebarze (ikona, nazwa,
│   │   │   │                                                    indykatory)
│   │   │   │                                           FUNCTIONS: SidebarProfileItem
│   │   │   │                                           DEPENDS ON: react, translations.js, icons.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ SidebarSearch.jsx ❗            <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/SidebarSearch.jsx
│   │   │   │                                           PURPOSE: Wyszukiwarka profili w Sidebarze
│   │   │   │                                           FUNCTIONS: SidebarSearch
│   │   │   │                                           DEPENDS ON: react, translations.js, icons.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ SidebarTools.jsx ❗             <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/SidebarTools.jsx
│   │   │   │                                           PURPOSE: Sekcja narzędzi specjalnych w Sidebarze
│   │   │   │                                           FUNCTIONS: SidebarTools
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, icons.js,
│   │   │   │                                                       constants.js
│   │   │   │                                           -->
│   │   │   └── ⚛️ SidebarWorkspaces.jsx ❗        <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/SidebarWorkspaces.jsx
│   │   │                                               PURPOSE: Sekcja workspace'ów w Sidebarze
│   │   │                                               FUNCTIONS: SidebarWorkspaces
│   │   │                                               DEPENDS ON: react, translations.js, icons.js
│   │   │                                               -->
│   │   ├── 📁 styles/
│   │   │   ├── 🎨 components.css                  <!-- VERSION: 0.0.3 PATH: src/ui/styles/components.css
│   │   │   │                                           PURPOSE: Zbiór stylów CSS aplikacji
│   │   │   │                                           FUNCTIONS: -
│   │   │   │                                           DEPENDS ON: -
│   │   │   │                                           -->
│   │   │   └── 🎨 theme.css                       <!-- VERSION: 0.0.3 PATH: src/ui/styles/theme.css
│   │   │                                               PURPOSE: Globalne style aplikacji MultiWeb Manager
│   │   │                                               FUNCTIONS: -
│   │   │                                               DEPENDS ON: -
│   │   │                                               -->
│   │   ├── 📁 system/
│   │   │   ├── ⚛️ ModalPortal.jsx ❗              <!-- VERSION: 0.0.3 PATH: src/ui/system/ModalPortal.jsx
│   │   │   │                                           PURPOSE: Modal w portalu (document.body) — ponad natywnym
│   │   │   │                                                    <webview> w Electronie.
│   │   │   │                                           FUNCTIONS: ModalPortal
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js, react-dom
│   │   │   │                                           -->
│   │   │   └── ⚛️ UpdateChecker.jsx ❗            <!-- VERSION: 0.0.3 PATH: src/ui/system/UpdateChecker.jsx
│   │   │                                               PURPOSE: Komponent sprawdzania aktualizacji. Placeholder –
│   │   │                                                        docelowo
│   │   │                                               FUNCTIONS: UpdateChecker
│   │   │                                               DEPENDS ON: react, icons, translations.js, loggerRenderer
│   │   │                                               -->
│   │   ├── 📁 taskpanel/
│   │   │   ├── ⚛️ CommentModal.jsx ❗             <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/CommentModal.jsx
│   │   │   │                                           PURPOSE: Modal podglądu komentarza/kodu do zadania
│   │   │   │                                           FUNCTIONS: CommentModal
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ TaskDetails.jsx ❗              <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskDetails.jsx
│   │   │   │                                           PURPOSE: Widok szczegółowy pojedynczego zadania. Umożliwia
│   │   │   │                                                    szybką edycję statusu i priorytetu bezpośrednio z
│   │   │   │                                                    poziomu podglądu oraz synchronizację tych zmian przez
│   │   │   │                                                    IPC.
│   │   │   │                                           FUNCTIONS: TaskDetails
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js, constants.js,
│   │   │   │                                                       translations.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ TaskEditor.jsx ❗               <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskEditor.jsx
│   │   │   │                                           PURPOSE: Wyspecjalizowany edytor zadań (inline lub modal)
│   │   │   │                                                    obsługujący walidację danych wejściowych, komunikację z
│   │   │   │                                                    tasksStore przez IPC oraz integrację z systemem
│   │   │   │                                                    toastów.
│   │   │   │                                           FUNCTIONS: TaskEditor
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js, constants.js,
│   │   │   │                                                       translations.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ TaskItem.jsx ❗                 <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskItem.jsx
│   │   │   │                                           PURPOSE: Interaktywny element listy zadań w panelu projektu.
│   │   │   │                                                    Dostarcza pełny zestaw akcji CRUD (edycja, usuwanie,
│   │   │   │                                                    pinowanie) oraz szybkie przyciski zmiany stanu (Move to
│   │   │   │                                                    Active/Backlog/Done).
│   │   │   │                                           FUNCTIONS: TaskItem
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ TaskList.jsx ❗                 <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskList.jsx
│   │   │   │                                           PURPOSE: Główny komponent listy zadań (Kanban/List view) –
│   │   │   │                                                    odpowiada za dynamiczne filtrowanie, grupowanie według
│   │   │   │                                                    statusu (TODO, IN_PROGRESS, BLOCKED, DONE) oraz
│   │   │   │                                                    wyzwalanie akcji edycji i podglądu.
│   │   │   │                                           FUNCTIONS: TaskList
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js, constants.js,
│   │   │   │                                                       translations.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ TaskModal.jsx ❗                <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskModal.jsx
│   │   │   │                                           PURPOSE: Formularz modalny do kompleksowego zarządzania
│   │   │   │                                                    zadaniem. Obsługuje edycję metadanych takich jak:
│   │   │   │                                                    priorytet, sekcja, przypisanie do projektu oraz
│   │   │   │                                                    dodatkowe notatki i wersjonowanie.
│   │   │   │                                           FUNCTIONS: TaskModal
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ TaskPanel.jsx ❗                <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskPanel.jsx
│   │   │   │                                           PURPOSE: Interfejs zarządzania zadaniami dla konkretnego
│   │   │   │                                                    projektu. Obsługuje wizualizację tablicy Kanban
│   │   │   │                                                    (Active, Backlog, Done), filtrowanie oraz
│   │   │   │                                                    synchronizację z tasksStore.
│   │   │   │                                           FUNCTIONS: TaskPanel
│   │   │   │                                           DEPENDS ON: react, tasksStore.js, projectsStore.js,
│   │   │   │                                                       translations.js, loggerRenderer.js, icons.js,
│   │   │   │                                                       ConfirmModal.jsx, TaskItem.jsx, TaskModal.jsx
│   │   │   │                                           -->
│   │   │   └── ⚛️ TaskSection.jsx ❗              <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskSection.jsx
│   │   │                                               PURPOSE: Pojedyncza sekcja zadań (aktywne, backlog, done)
│   │   │                                               FUNCTIONS: TaskSection
│   │   │                                               DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js,
│   │   │                                                           TaskItem
│   │   │                                               -->
│   │   ├── 📁 tasks/
│   │   │   ├── ⚛️ AggregatedProjectSection.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/tasks/AggregatedProjectSection.jsx
│   │   │   │                                           PURPOSE: Pojedyncza sekcja projektu w widoku zbiorczym
│   │   │   │                                           FUNCTIONS: AggregatedProjectSection
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js,
│   │   │   │                                                       AggregatedTaskItem
│   │   │   │                                           -->
│   │   │   ├── ⚛️ AggregatedTaskItem.jsx ❗       <!-- VERSION: 0.0.3 PATH: src/ui/tasks/AggregatedTaskItem.jsx
│   │   │   │                                           PURPOSE: Wyspecjalizowany komponent prezentujący zadanie w
│   │   │   │                                                    widoku zagregowanym (dashboard). Obsługuje wizualizację
│   │   │   │                                                    priorytetów, znaczników wersji oraz statusu wykonania
│   │   │   │                                                    (skreślenie).
│   │   │   │                                           FUNCTIONS: AggregatedTaskItem
│   │   │   │                                           DEPENDS ON: loggerRenderer.js, icons.js
│   │   │   │                                           -->
│   │   │   └── ⚛️ AggregatedTasks.jsx ❗          <!-- VERSION: 0.0.3 PATH: src/ui/tasks/AggregatedTasks.jsx
│   │   │                                               PURPOSE: Widok zbiorczy zadań ze wszystkich projektów
│   │   │                                               FUNCTIONS: AggregatedTasks
│   │   │                                               DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js,
│   │   │                                                           AggregatedProjectSection, AggregatedTaskItem
│   │   │                                               -->
│   │   ├── 📁 terminal/
│   │   │   └── ⚛️ Terminal.jsx ❗                 <!-- VERSION: 0.0.3 PATH: src/ui/terminal/Terminal.jsx
│   │   │                                               PURPOSE: Terminal z xterm.js + node-pty (historia komend, ANSI
│   │   │                                                        colors). Używa terminalWriteLegacy/terminalResizeLegacy
│   │   │                                                        z preload (alias dla legacy IPC).
│   │   │                                               FUNCTIONS: Terminal
│   │   │                                               DEPENDS ON: react, xterm, xterm-addon-fit, xterm-addon-web-links,
│   │   │                                                           translations.js, loggerRenderer, icons
│   │   │                                               -->
│   │   ├── 📁 tools/
│   │   │   ├── ⚛️ ClipboardHistory.jsx ❗         <!-- VERSION: 0.0.3 PATH: src/ui/tools/ClipboardHistory.jsx
│   │   │   │                                           PURPOSE: Historia schowka z pinowaniem i wyszukiwarką
│   │   │   │                                           FUNCTIONS: ClipboardHistory
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │   │                                                       icons
│   │   │   │                                           -->
│   │   │   ├── ⚛️ CookieGrabber.jsx ❗            <!-- VERSION: 0.0.3 PATH: src/ui/tools/CookieGrabber.jsx
│   │   │   │                                           PURPOSE: Pobieranie cookies z aktywnego WebView – tabela,
│   │   │   │                                                    kopiowanie, eksport
│   │   │   │                                           FUNCTIONS: CookieGrabber
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │   │                                                       icons
│   │   │   │                                           -->
│   │   │   ├── ⚛️ FilePreviewer.jsx ❗            <!-- VERSION: 0.0.3 PATH: src/ui/tools/FilePreviewer.jsx
│   │   │   │                                           PURPOSE: Podgląd plików (RAW/PREVIEW) – TXT, JSON, HTML, SVG,
│   │   │   │                                                    Markdown, obrazy
│   │   │   │                                           FUNCTIONS: FilePreviewer
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │   │                                                       icons, markdownRenderer
│   │   │   │                                           -->
│   │   │   ├── ⚛️ ImageTools.jsx ❗               <!-- VERSION: 0.0.3 PATH: src/ui/tools/ImageTools.jsx
│   │   │   │                                           PURPOSE: Kompresja, resize i konwersja obrazów (drag & drop,
│   │   │   │                                                    preview)
│   │   │   │                                           FUNCTIONS: ImageTools
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │   │                                                       icons, imageUtils
│   │   │   │                                           -->
│   │   │   ├── ⚛️ JsonFormatter.jsx ❗            <!-- VERSION: 0.0.3 PATH: src/ui/tools/JsonFormatter.jsx
│   │   │   │                                           PURPOSE: Formatowanie i walidacja JSON/YAML/XML
│   │   │   │                                           FUNCTIONS: JsonFormatter
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer
│   │   │   │                                           -->
│   │   │   ├── ⚛️ MarkdownPreviewer.jsx ❗        <!-- VERSION: 0.0.3 PATH: src/ui/tools/MarkdownPreviewer.jsx
│   │   │   │                                           PURPOSE: Podgląd Markdown na żywo (split view)
│   │   │   │                                           FUNCTIONS: MarkdownPreviewer
│   │   │   │                                           DEPENDS ON: react, config.js, loggerRenderer.js, translations.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ MiniPostman.jsx ❗              <!-- VERSION: 0.0.3 PATH: src/ui/tools/MiniPostman.jsx
│   │   │   │                                           PURPOSE: Lekki API tester (GET/POST/PUT/DELETE, nagłówki, body,
│   │   │   │                                                    odpowiedź)
│   │   │   │                                           FUNCTIONS: MiniPostman
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │   │                                                       icons, apiClient
│   │   │   │                                           -->
│   │   │   ├── ⚛️ RegexTester.jsx ❗              <!-- VERSION: 0.0.3 PATH: src/ui/tools/RegexTester.jsx
│   │   │   │                                           PURPOSE: Testowanie wyrażeń regularnych
│   │   │   │                                           FUNCTIONS: RegexTester
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │   │                                                       regexEngine
│   │   │   │                                           -->
│   │   │   ├── ⚛️ RemoveBgTool.jsx ❗             <!-- VERSION: 0.0.3 PATH: src/ui/tools/RemoveBgTool.jsx
│   │   │   │                                           PURPOSE: Narzędzie do masowego usuwania tła ze zdjęć przez API
│   │   │   │                                                    remove.bg.
│   │   │   │                                           FUNCTIONS: RemoveBgTool
│   │   │   │                                           DEPENDS ON: react, axios, icons, translations.js, loggerRenderer,
│   │   │   │                                                       config, notificationsManager.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ StringCombiner.jsx ❗           <!-- VERSION: 0.0.3 PATH: src/ui/tools/StringCombiner.jsx
│   │   │   │                                           PURPOSE: Generator kombinacji stringów. Podajesz tekst bazowy,
│   │   │   │                                                    znak podziału
│   │   │   │                                           FUNCTIONS: StringCombiner
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js, icons, translations.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ SvgToPngConverter.jsx ❗        <!-- VERSION: 0.0.3 PATH: src/ui/tools/SvgToPngConverter.jsx
│   │   │   │                                           PURPOSE: Konwersja SVG → PNG z wyborem rozdzielczości (drag &
│   │   │   │                                                    drop, preview)
│   │   │   │                                           FUNCTIONS: SvgToPngConverter
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│   │   │   │                                                       icons, svgToPng
│   │   │   │                                           -->
│   │   │   └── ⚛️ ToolsPanel.jsx ❗               <!-- VERSION: 0.0.3 PATH: src/ui/tools/ToolsPanel.jsx
│   │   │                                               PURPOSE: Główny panel narzędziowy aplikacji (Tools Panel) –
│   │   │                                                        dostarcza interfejs oparty na zakładkach do obsługi
│   │   │                                                        narzędzi pomocniczych (JSON Formatter, Regex Tester,
│   │   │                                                        Clipboard History, Image Tools, Mini Postman, Cookie
│   │   │                                                        Grabber itp.). Obsługuje dynamiczne ładowanie na
│   │   │                                                        podstawie flag funkcji (feature flags).
│   │   │                                               FUNCTIONS: ToolsPanel
│   │   │                                               DEPENDS ON: react, config.js, translations.js, icons,
│   │   │                                                           loggerRenderer, RemoveBgTool.jsx, StringCombiner.jsx,
│   │   │                                                           JsonFormatter.jsx, RegexTester.jsx,
│   │   │                                                           MarkdownPreviewer.jsx, ClipboardHistory.jsx,
│   │   │                                                           ImageTools.jsx, SvgToPngConverter.jsx,
│   │   │                                                           MiniPostman.jsx, FilePreviewer.jsx,
│   │   │                                                           CookieGrabber.jsx
│   │   │                                               -->
│   │   ├── 📁 views/
│   │   │   ├── ⚛️ ContentRenderer.jsx ❗          <!-- VERSION: 0.0.3 PATH: src/ui/views/ContentRenderer.jsx
│   │   │   │                                           PURPOSE: Router widoków — deleguje do WebViewContainer,
│   │   │   │                                                    ToolsContainer lub SettingsContainer
│   │   │   │                                           FUNCTIONS: ContentRenderer
│   │   │   │                                           DEPENDS ON: react, icons.js, translations.js,
│   │   │   │                                                       WebViewContainer.jsx, ToolsContainer.jsx,
│   │   │   │                                                       SettingsContainer.jsx
│   │   │   │                                           -->
│   │   │   ├── ⚛️ SettingsContainer.jsx ❗        <!-- VERSION: 0.0.3 PATH: src/ui/views/SettingsContainer.jsx
│   │   │   │                                           PURPOSE: Kontener renderowania ustawień, pomocy, historii i
│   │   │   │                                                    zadań zagregowanych
│   │   │   │                                           FUNCTIONS: SettingsContainer
│   │   │   │                                           DEPENDS ON: react, config.js, loggerRenderer.js, Spinner.jsx
│   │   │   │                                           -->
│   │   │   ├── ⚛️ Spinner.jsx ❗                  <!-- VERSION: 0.0.3 PATH: src/ui/views/Spinner.jsx
│   │   │   │                                           PURPOSE: Współdzielony komponent wizualny wskaźnika ładowania
│   │   │   │                                                    (loader). Wykorzystywany jako fallback dla React
│   │   │   │                                                    Suspense oraz podczas asynchronicznych operacji I/O.
│   │   │   │                                           FUNCTIONS: Spinner
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js
│   │   │   │                                           -->
│   │   │   ├── ⚛️ ToolsContainer.jsx ❗           <!-- VERSION: 0.0.3 PATH: src/ui/views/ToolsContainer.jsx
│   │   │   │                                           PURPOSE: Kontener renderowania narzędzi specjalnych (Notepad,
│   │   │   │                                                    ProjectManager, RemoveBg, itp.)
│   │   │   │                                           FUNCTIONS: ToolsContainer
│   │   │   │                                           DEPENDS ON: react, loggerRenderer.js, Spinner.jsx
│   │   │   │                                           -->
│   │   │   └── ⚛️ WebViewContainer.jsx ❗         <!-- VERSION: 0.0.3 PATH: src/ui/views/WebViewContainer.jsx
│   │   │                                               PURPOSE: Kontener renderowania WebView dla aktywnego profilu
│   │   │                                               FUNCTIONS: WebViewContainer
│   │   │                                               DEPENDS ON: react, Spinner.jsx
│   │   │                                               -->
│   │   ├── 📁 webview/
│   │   │   ├── ⚛️ WebViewTab.jsx ❗               <!-- VERSION: 0.0.3 PATH: src/ui/webview/WebViewTab.jsx
│   │   │   │                                           PURPOSE: Zakładka WebView – lifecycle, nawigacja, zoom,
│   │   │   │                                                    recovery, logowanie błędów
│   │   │   │                                           FUNCTIONS: WebViewTab
│   │   │   │                                           DEPENDS ON: react, config.js, translations.js, loggerRenderer.js,
│   │   │   │                                                       WebViewToolbar.jsx
│   │   │   │                                           -->
│   │   │   └── ⚛️ WebViewToolbar.jsx ❗           <!-- VERSION: 0.0.3 PATH: src/ui/webview/WebViewToolbar.jsx
│   │   │                                               PURPOSE: Pasek narzędzi WebView – przyciski i akcje (Back,
│   │   │                                                        Forward, Reload, Zoom, itp.)
│   │   │                                               FUNCTIONS: WebViewToolbar
│   │   │                                               DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│   │   │                                               -->
│   │   ├── 🎨 index.css                           <!-- VERSION: 0.0.3 PATH: src/ui/index.css
│   │   │                                               PURPOSE: Główny plik stylów – importuje layout, theme,
│   │   │                                                        components
│   │   │                                               FUNCTIONS: -
│   │   │                                               DEPENDS ON: -
│   │   │                                               -->
│   │   └── 🎨 layout.css                          <!-- VERSION: 0.0.3 PATH: src/ui/layout.css
│   │                                                   PURPOSE: Layout aplikacji – grid, sidebar, content, toolbar
│   │                                                   FUNCTIONS: -
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 📁 utils/
│   │   ├── 📜 fileUtils.js                        <!-- VERSION: 0.0.3 PATH: src/utils/fileUtils.js
│   │   │                                               PURPOSE: Uniwersalne i bezpieczne opakowanie natywnych funkcji
│   │   │                                                        I/O Node.js dla plików JSON z automatyczną obsługą
│   │   │                                                        błędów.
│   │   │                                               FUNCTIONS: readJsonSafe, writeJsonSafe
│   │   │                                               DEPENDS ON: fs, logger.js
│   │   │                                               -->
│   │   ├── 📜 icons.js                            <!-- VERSION: 0.0.3 PATH: src/utils/icons.js
│   │   │                                               PURPOSE: Re-export ikon z kanonicznej lokalizacji
│   │   │                                                        src/data/icons.js
│   │   │                                               FUNCTIONS: -
│   │   │                                               DEPENDS ON: icons.js
│   │   │                                               -->
│   │   ├── 📜 imageUtils.js                       <!-- VERSION: 0.0.3 PATH: src/utils/imageUtils.js
│   │   │                                               PURPOSE: Funkcje pomocnicze do manipulacji plikami graficznymi
│   │   │                                                        (resize, format conversion) oparte na silniku sharp.
│   │   │                                               FUNCTIONS: resizeImage, convertImage, compressJpeg
│   │   │                                               DEPENDS ON: sharp, logger.js
│   │   │                                               -->
│   │   ├── 📜 logWriter.js                        <!-- VERSION: 0.0.3 PATH: src/utils/logWriter.js
│   │   │                                               PURPOSE: Zarządzanie utrwalaniem logów błędów i wyników testów w
│   │   │                                                        systemie plików (userData) poprzez mostek IPC.
│   │   │                                               FUNCTIONS: initLogWriter, appendTestFailLog, getLogsContent,
│   │   │                                                          clearLogsFile
│   │   │                                               DEPENDS ON: logger.js, config.js
│   │   │                                               -->
│   │   ├── 📜 logger.js                           <!-- VERSION: 0.0.3 PATH: src/utils/logger.js
│   │   │                                               PURPOSE: Główna logika logowania z filtrowaniem per-modułowym.
│   │   │                                                        Obsługuje proces Main i Renderer.
│   │   │                                               FUNCTIONS: initLogger, setDebugMode, setDebugModule, isDebugMode,
│   │   │                                                          log, warn, error, logDebug, logInfo, logWarn,
│   │   │                                                          logError, getLogFilePath
│   │   │                                               DEPENDS ON: config.js, electron
│   │   │                                               -->
│   │   ├── 📜 loggerRenderer.js                   <!-- VERSION: 0.0.3 PATH: src/utils/loggerRenderer.js
│   │   │                                               PURPOSE: Cienki wrapper re-eksportujący logger.js dla procesu
│   │   │                                                        renderera (React).
│   │   │                                               FUNCTIONS: -
│   │   │                                               DEPENDS ON: loggerRenderer, logger.js
│   │   │                                               -->
│   │   ├── 📜 networkUtils.js                     <!-- VERSION: 0.0.3 PATH: src/utils/networkUtils.js
│   │   │                                               PURPOSE: Funkcje pomocnicze do diagnostyki sieciowej i
│   │   │                                                        sprawdzania dostępności zewnętrznych zasobów.
│   │   │                                               FUNCTIONS: pingUrl
│   │   │                                               DEPENDS ON: logger.js
│   │   │                                               -->
│   │   ├── 📜 notesStorage.js ❗                   <!-- VERSION: 0.0.3 PATH: src/utils/notesStorage.js
│   │   │                                               PURPOSE: Pomocnicze funkcje zapisu i odczytu notatek oraz
│   │   │                                                        fabryka zakładek
│   │   │                                               FUNCTIONS: createNewTab, loadNotesFromStorage,
│   │   │                                                          saveNotesToStorage
│   │   │                                               DEPENDS ON: logger.js
│   │   │                                               -->
│   │   ├── 📜 notificationsManager.js ❗           <!-- VERSION: 0.0.3 PATH: src/utils/notificationsManager.js
│   │   │                                               PURPOSE: Toasty w UI + opcjonalne powiadomienia systemowe
│   │   │                                                        (renderer).
│   │   │                                               FUNCTIONS: registerToastHandler, showToast,
│   │   │                                                          showSystemNotification
│   │   │                                               DEPENDS ON: logger.js
│   │   │                                               -->
│   │   ├── 📜 searchIndex.js                      <!-- VERSION: 0.0.3 PATH: src/utils/searchIndex.js
│   │   │                                               PURPOSE: Budowanie ujednoliconego indeksu wyszukiwania
│   │   │                                                        (profiles, projects, tasks, notes) dla globalnej palety
│   │   │                                                        komend (Ctrl+K).
│   │   │                                               FUNCTIONS: buildSearchIndex, searchAll
│   │   │                                               DEPENDS ON: logger.js
│   │   │                                               -->
│   │   ├── 📜 sharpLoader.js ❗                    <!-- VERSION: 0.0.3 PATH: src/utils/sharpLoader.js
│   │   │                                               PURPOSE: Leniwe ładowanie modułu sharp (przetwarzanie obrazów) z
│   │   │                                                        obsługą braku zależności. Używane przez
│   │   │                                                        ipcMainHandlers_imageSharp.js w main process.
│   │   │                                               FUNCTIONS: loadSharp
│   │   │                                               DEPENDS ON: komponenty z folderu sharp/
│   │   │                                               -->
│   │   ├── 📜 testrunner.js                       <!-- VERSION: 0.0.3 PATH: src/utils/testrunner.js
│   │   │                                               PURPOSE: Silnik do uruchamiania testów jednostkowych i
│   │   │                                                        integracyjnych – asercje, liczniki wyników i
│   │   │                                                        raportowanie PASS/FAIL.
│   │   │                                               FUNCTIONS: initTestResults, assert, assertThrows, getTestResults,
│   │   │                                                          logTestSummary
│   │   │                                               DEPENDS ON: logger.js, icons.js
│   │   │                                               -->
│   │   ├── 📜 translations.js                     <!-- VERSION: 0.0.3 PATH: src/utils/translations.js
│   │   │                                               PURPOSE: Logika ładowania tłumaczeń i helpData, provider
│   │   │                                                        contextu (dynamicznie)
│   │   │                                               FUNCTIONS: TranslationProvider
│   │   │                                               DEPENDS ON: react, config.js
│   │   │                                               -->
│   │   ├── 📜 urlUtils.js                         <!-- VERSION: 0.0.3 PATH: src/utils/urlUtils.js
│   │   │                                               PURPOSE: Narzędzia do walidacji, normalizacji i sanityzacji
│   │   │                                                        adresów URL dla modułu WebView.
│   │   │                                               FUNCTIONS: normalizeWebUrl, isValidWebUrl, isSafeUrl
│   │   │                                               DEPENDS ON: logger.js
│   │   │                                               -->
│   │   ├── 📜 validators.js                       <!-- VERSION: 0.0.3 PATH: src/utils/validators.js
│   │   │                                               PURPOSE: Walidatory typów danych wykorzystywane przy sprawdzaniu
│   │   │                                                        poprawności payloadów IPC i stanów magazynów.
│   │   │                                               FUNCTIONS: ensureString, ensureObject
│   │   │                                               DEPENDS ON: logger.js
│   │   │                                               -->
│   │   └── 📜 yamlLoader.js ❗                     <!-- VERSION: 0.0.3 PATH: src/utils/yamlLoader.js
│   │                                                   PURPOSE: Leniwe ładowanie modułu js-yaml
│   │                                                            (parsowanie/serializacja YAML) z obsługą braku
│   │                                                            zależności. Używane przez ipcMainHandlers_jsonYaml.js w
│   │                                                            main process.
│   │                                                   FUNCTIONS: loadYaml
│   │                                                   DEPENDS ON: komponenty z folderu yaml/
│   │                                                   -->
│   ├── ⚛️ App.jsx ❗                              <!-- VERSION: 0.0.3 PATH: src/App.jsx
│   │                                                   PURPOSE: Główny komponent root aplikacji React – inicjalizuje
│   │                                                            system logowania, ładuje profile i ustawienia
│   │                                                            użytkownika, zarządza motywem graficznym (dark/light)
│   │                                                            oraz obsługuje globalne skróty klawiszowe i stan sieci.
│   │                                                   FUNCTIONS: App
│   │                                                   DEPENDS ON: react, config.js, translations.js, loggerRenderer.js,
│   │                                                               urlUtils.js, MainLayout.jsx, Spinner.jsx
│   │                                                   -->
│   ├── 📜 config.js                               <!-- VERSION: 0.0.3 PATH: src/config.js
│   │                                                   PURPOSE: Centralna konfiguracja aplikacji - flagi funkcji,
│   │                                                            limity i domyślne ustawienia.
│   │                                                   FUNCTIONS: isFeatureEnabled, isToolEnabled, getDefaultSetting,
│   │                                                              getLimit
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   ├── 📜 constants.js                            <!-- VERSION: 0.0.3 PATH: src/constants.js
│   │                                                   PURPOSE: Application-wide constants and enums (tasks, app
│   │                                                            categories, etc.)
│   │                                                   FUNCTIONS: -
│   │                                                   DEPENDS ON: -
│   │                                                   -->
│   └── ⚛️ index.jsx                              <!-- VERSION: 0.0.3 PATH: src/index.jsx
│                                                       PURPOSE: Punkt wejścia aplikacji React. Montuje <App /> w #root,
│                                                       FUNCTIONS: -
│                                                       DEPENDS ON: react, react-dom, useTranslation, App
│                                                       -->
├── 📁 tests/
│   ├── 📜 TestRunner.js                           <!-- VERSION: 0.0.3 PATH: tests/TestRunner.js
│   │                                                   PURPOSE: Orchestrator testów – uruchamia wszystkie
│   │                                                            TestRunner_*.js
│   │                                                   FUNCTIONS: runAllTests
│   │                                                   DEPENDS ON: logger.js, icons.js, logWriter.js, testsLoader.js
│   │                                                   -->
│   ├── 📜 TestRunner_AdBlocker.js ❗               <!-- VERSION: 0.0.3 PATH: tests/TestRunner_AdBlocker.js
│   │                                                   PURPOSE: Testy jednostkowe dla AdBlockera (globalny + per
│   │                                                            profil, wykrywanie URL)
│   │                                                   FUNCTIONS: runAdBlockerTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Assets.js                    <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Assets.js
│   │                                                   PURPOSE: Testy spójności plików w folderze assets/
│   │                                                   FUNCTIONS: runAssetsTests
│   │                                                   DEPENDS ON: fs, path, testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_BusinessLogic.js ❗           <!-- VERSION: 0.0.3 PATH: tests/TestRunner_BusinessLogic.js
│   │                                                   PURPOSE: Testy czystych funkcji biznesowych (cartesian,
│   │                                                            parseSplitChar, sortByPin, normalizeUrl)
│   │                                                   FUNCTIONS: runBusinessLogicTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_CSS.js                       <!-- VERSION: 0.0.3 PATH: tests/TestRunner_CSS.js
│   │                                                   PURPOSE: Testy spójności plików CSS (importy, kolejność,
│   │                                                            istniejące pliki)
│   │                                                   FUNCTIONS: runCssTests
│   │                                                   DEPENDS ON: fs, path, testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Config.js                    <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Config.js
│   │                                                   PURPOSE: Testy pliku konfiguracyjnego config.js
│   │                                                   FUNCTIONS: runConfigTests
│   │                                                   DEPENDS ON: fs, path, testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Doc.js                       <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Doc.js
│   │                                                   PURPOSE: Testy spójności dokumentacji w folderze doc/
│   │                                                   FUNCTIONS: runDocTests
│   │                                                   DEPENDS ON: fs, path, testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_ElectronAPI.js               <!-- VERSION: 0.0.3 PATH: tests/TestRunner_ElectronAPI.js
│   │                                                   PURPOSE: Testy dostępności i typu metod window.electronAPI
│   │                                                   FUNCTIONS: runElectronAPITests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_History.js                   <!-- VERSION: 0.0.3 PATH: tests/TestRunner_History.js
│   │                                                   PURPOSE: Testy integralności logów aktywności użytkownika.
│   │                                                            Sprawdza walidację poziomów logowania, mechanizmy
│   │                                                            filtrowania zdarzeń oraz poprawność przycinania
│   │                                                            historii do zdefiniowanych limitów (FIFO).
│   │                                                   FUNCTIONS: runHistoryTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_IPC.js                       <!-- VERSION: 0.0.3 PATH: tests/TestRunner_IPC.js
│   │                                                   PURPOSE: Testy dostępności i typów dla nowych handlerów IPC
│   │                                                   FUNCTIONS: runIPCTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Icons.js                     <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Icons.js
│   │                                                   PURPOSE: Testy integralności ikon (ICONS, SIDEBAR_ICON_MAP)
│   │                                                   FUNCTIONS: runIconsTests
│   │                                                   DEPENDS ON: testUtils.js, icons.js
│   │                                                   -->
│   ├── 📜 TestRunner_Locales.js                   <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Locales.js
│   │                                                   PURPOSE: Testy integralności plików locales (dynamicznie z
│   │                                                            LANGUAGES z config.js)
│   │                                                   FUNCTIONS: runLocalesTests
│   │                                                   DEPENDS ON: testUtils.js, config.js
│   │                                                   -->
│   ├── 📜 TestRunner_LogWriter.js                 <!-- VERSION: 0.0.3 PATH: tests/TestRunner_LogWriter.js
│   │                                                   PURPOSE: Testy dla LogWritera (zapis, odczyt, czyszczenie, limit
│   │                                                            linii)
│   │                                                   FUNCTIONS: runLogWriterTests
│   │                                                   DEPENDS ON: testUtils.js, logWriter.js
│   │                                                   -->
│   ├── 📜 TestRunner_MainEngine.js                <!-- VERSION: 0.0.3 PATH: tests/TestRunner_MainEngine.js
│   │                                                   PURPOSE: Testy modułów wyciągniętych z main.js (webviewRegistry,
│   │                                                            adBlocker, hotkeysManager)
│   │                                                   FUNCTIONS: runMainEngineTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Notepad.js                   <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Notepad.js
│   │                                                   PURPOSE: Zestaw testów dla modułu notatnika. Weryfikuje
│   │                                                            integralność danych kart, poprawność mechanizmu
│   │                                                            autozapisu (dirty checking) oraz logikę przełączania
│   │                                                            kontekstu między dokumentami.
│   │                                                   FUNCTIONS: runNotepadTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Profiles.js                  <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Profiles.js
│   │                                                   PURPOSE: Zestaw testów jednostkowych i integracyjnych dla
│   │                                                            zarządzania profilami WebView. Weryfikuje strukturę
│   │                                                            danych, poprawność kategorii oraz mechanizmy sortowania
│   │                                                            chronologicznego.
│   │                                                   FUNCTIONS: runProfilesTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Projects.js                  <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Projects.js
│   │                                                   PURPOSE: Zestaw testów dla modułu projektów. Weryfikuje
│   │                                                            mechanizmy archiwizacji, strukturę obiektów
│   │                                                            projektowych oraz poprawność agregacji liczby zadań
│   │                                                            przypisanych do konkretnych projektów.
│   │                                                   FUNCTIONS: runProjectsTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Reexport.js                  <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Reexport.js
│   │                                                   PURPOSE: Testy poprawności re-eksportów (config.js, icons.js)
│   │                                                   FUNCTIONS: runReexportTests
│   │                                                   DEPENDS ON: fs, path, testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Settings.js                  <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Settings.js
│   │                                                   PURPOSE: Zestaw testów dla silnika ustawień. Weryfikuje
│   │                                                            bezpieczeństwo głębokiego łączenia (merge)
│   │                                                            konfiguracji, stabilność przełączania motywów oraz
│   │                                                            poprawność schematu danych przy imporcie/eksporcie.
│   │                                                   FUNCTIONS: runSettingsTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_SleepTabs.js ❗               <!-- VERSION: 0.0.3 PATH: tests/TestRunner_SleepTabs.js
│   │                                                   PURPOSE: Testy jednostkowe dla Sleep Tabs
│   │                                                   FUNCTIONS: runSleepTabsTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Store.js                     <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Store.js
│   │                                                   PURPOSE: Testy struktury danych pobieranych z store (settings,
│   │                                                            notes, history)
│   │                                                   FUNCTIONS: runStoreTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Tasks.js                     <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Tasks.js
│   │                                                   PURPOSE: Testy funkcjonalne systemu zarządzania zadaniami.
│   │                                                            Sprawdza poprawność typów danych, wydajność filtrowania
│   │                                                            priorytetów oraz sprawność wyszukiwarki pełnotekstowej
│   │                                                            w obrębie zadań.
│   │                                                   FUNCTIONS: runTasksTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Terminal.js ❗                <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Terminal.js
│   │                                                   PURPOSE: Testy jednostkowe dla Terminala (xterm, node-pty,
│   │                                                            historia, ANSI)
│   │                                                   FUNCTIONS: runTerminalTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_Tools.js                     <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Tools.js
│   │                                                   PURPOSE: Testy jednostkowe dla narzędzi (JSON, Regex, Markdown,
│   │                                                            Clipboard)
│   │                                                   FUNCTIONS: runToolsTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   ├── 📜 TestRunner_WebView.js                   <!-- VERSION: 0.0.3 PATH: tests/TestRunner_WebView.js
│   │                                                   PURPOSE: Testy jednostkowe dla WebView (Single App, Screenshot,
│   │                                                            Resource Monitor, Zoom)
│   │                                                   FUNCTIONS: runWebViewTests
│   │                                                   DEPENDS ON: testUtils.js
│   │                                                   -->
│   └── 📜 testUtils.js                            <!-- VERSION: 0.0.3 PATH: tests/testUtils.js
│                                                       PURPOSE: Wspólne funkcje dla wszystkich testów (runner,
│                                                                logowanie)
│                                                       FUNCTIONS: runTests
│                                                       DEPENDS ON: icons.js
│                                                       -->
├── 📜 config.js                                   <!-- VERSION: 0.0.3 PATH: config.js
│                                                       PURPOSE: Re-eksport konfiguracji z src/config.js.
│                                                       FUNCTIONS: -
│                                                       DEPENDS ON: config.js
│                                                       -->
├── 📜 main.js ❗                                   <!-- VERSION: 0.0.3 PATH: main.js
│                                                       PURPOSE: Główna logika procesu głównego Electron – koordynacja,
│                                                                okno, bezpieczeństwo
│                                                       FUNCTIONS: createWindow, runStartupTestsIfEnabled,
│                                                                  checkDiskSpaceWarning
│                                                       DEPENDS ON: electron, path, url, child_process, config.js,
│                                                                   settingsStore.js, logger.js, TestRunner.js,
│                                                                   adBlocker.js, hotkeysManager.js, ipcLoader.js
│                                                       -->
├── 📦 package.json                                <!-- VERSION: - PATH: package.json
│                                                       PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│                                                                pomocniczej.
│                                                       FUNCTIONS: -
│                                                       DEPENDS ON: -
│                                                       -->
├── 📜 preload.cjs ❗                               <!-- VERSION: 0.0.3 PATH: preload.cjs
│                                                       PURPOSE: Bridge IPC – eksponuje bezpieczne API dla renderera
│                                                                (contextBridge). Definiuje metody komunikacji i
│                                                                handlery zdarzeń z mechanizmem cleanup.
│                                                       FUNCTIONS: -
│                                                       DEPENDS ON: electron
│                                                       -->
└── 📄 readme.md                                   <!-- VERSION: 0.0.3 PATH: readme.md
                                                        PURPOSE: Dokumentacja specyfikacji projektowej
                                                        FUNCTIONS: Dokumentacja: 14 sekcji głównych
                                                        DEPENDS ON: -
                                                        -->