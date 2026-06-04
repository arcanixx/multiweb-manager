<!-- =============================================================================
 FILE: Structure_light.md
 PATH: doc/Structure_light.md
 VERSION: 0.0.3
 PURPOSE: Uproszczona struktura projektu - same ścieżki i typy plików, bez metadanych.
          Do użycia przez AI bez dostępu do repo (oszczędność tokenów).
 FUNCTIONS: -
 DEPENDS ON: -
 UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
 ============================================================================= -->

root/
├── 📁 assets/
│ ├── 🖼️ app-icon.ico <!-- VERSION: - PATH: assets/app-icon.ico
│ │ PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│ │ pomocniczej.
│ │ FUNCTIONS: -
│ │ DEPENDS ON: -
│ │ -->
│ ├── 🖼️ app-icon.png <!-- VERSION: - PATH: assets/app-icon.png
│ │ PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│ │ pomocniczej.
│ │ FUNCTIONS: -
│ │ DEPENDS ON: -
│ │ -->
│ ├── 🖼️ multiweb_manager_architecture_graph.png <!-- VERSION: - PATH: assets/multiweb_manager_architecture_graph.png
│ │ PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│ │ pomocniczej.
│ │ FUNCTIONS: -
│ │ DEPENDS ON: -
│ │ -->
│ └── splash_logo.svg <!-- VERSION: - PATH: assets/splash_logo.svg
│ PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│ pomocniczej.
│ FUNCTIONS: -
│ DEPENDS ON: -
│ -->
├── 📁 doc/
│ ├── AI_Development_Standards.md ❗ <!-- VERSION: 0.0.3 PATH: doc/AI_Development_Standards.md
│ │ PURPOSE: Standardy tworzenia i modyfikacji kodu dla AI –
│ │ kompaktowy przewodnik
│ │ FUNCTIONS: Dokumentacja: 12 sekcji głównych
│ │ DEPENDS ON: -
│ │ -->
│ ├── AI_Repository_Access.md <!-- VERSION: 0.0.3 PATH: doc/AI_Repository_Access.md
│ │ PURPOSE: Dokumentacja specyfikacji projektowej - Mapowanie
│ │ bezpośrednich odnośników RAW dla modeli AI (Claude).
│ │ FUNCTIONS: -
│ │ DEPENDS ON: -
│ │ -->
│ ├── Definition_Mockups_UI_UX.md <!-- VERSION: 0.0.3 PATH: doc/Definition_Mockups_UI_UX.md
│ │ PURPOSE: Dokumentacja specyfikacji projektowej - Kompletny opis
│ │ UI/UX aplikacji MultiWeb Manager (do np. Figma)
│ │ FUNCTIONS: Dokumentacja: 41 sekcji głównych
│ │ DEPENDS ON: -
│ │ -->
│ ├── DevelopersGuide.md <!-- VERSION: 0.0.3 PATH: doc/DevelopersGuide.md
│ │ PURPOSE: Dokumentacja specyfikacji projektowej - Kompletny
│ │ przewodnik developerski MultiWeb Manager
│ │ FUNCTIONS: Dokumentacja: 19 sekcji głównych
│ │ DEPENDS ON: -
│ │ -->
│ ├── Global_Project_Starter_Guide.md ❗ <!-- VERSION: 0.0.3 PATH: doc/Global_Project_Starter_Guide.md
│ │ PURPOSE: Dokumentacja specyfikacji projektowej - Globalny
│ │ przewodnik inicjalizacji projektów (AI First)
│ │ FUNCTIONS: Dokumentacja: 15 sekcji głównych
│ │ DEPENDS ON: -
│ │ -->
│ ├── ModulesOverview.md ❗ <!-- VERSION: 0.0.3 PATH: doc/ModulesOverview.md
│ │ PURPOSE: Dokumentacja specyfikacji projektowej - Ujednolicona
│ │ lista modułów + opis przeznaczenia dla AI i devów
│ │ FUNCTIONS: Dokumentacja: 78 sekcji głównych
│ │ DEPENDS ON: -
│ │ -->
│ ├── Project_Initialization_Guide.md <!-- VERSION: 0.0.3 PATH: doc/Project_Initialization_Guide.md
│ │ PURPOSE: Dokumentacja specyfikacji projektowej - Kompletny
│ │ przewodnik startowy — jak rozpocząć nowy projekt
│ │ (AI-first)
│ │ FUNCTIONS: Dokumentacja: 12 sekcji głównych
│ │ DEPENDS ON: -
│ │ -->
│ ├── Requirements.md <!-- VERSION: 0.0.3 PATH: doc/Requirements.md
│ │ PURPOSE: Dokumentacja specyfikacji projektowej - Wymagania
│ │ aplikacji z aktualnymi statusami, priorytetami i
│ │ komentarzami
│ │ FUNCTIONS: Dokumentacja: 17 sekcji głównych
│ │ DEPENDS ON: -
│ │ -->
│ ├── Structure.md <!-- VERSION: - PATH: doc/Structure.md
│ │ PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│ │ pomocniczej.
│ │ FUNCTIONS: -
│ │ DEPENDS ON: -
│ │ -->
│ ├── Structure_light.md ❗ <!-- VERSION: 0.0.3 PATH: doc/Structure_light.md
│ │ PURPOSE: Uproszczona struktura projektu - same ścieżki i typy
│ │ plików, bez metadanych. Do użycia przez AI
│ │ bez dostępu do repo (oszczędność tokenów).
│ │ FUNCTIONS: -
│ │ DEPENDS ON: -
│ │ -->
│ └── pending_updates_for_Definition_Mockups_UI_UX.md <!-- VERSION: 0.0.3 PATH: doc/pending_updates_for_Definition_Mockups_UI_UX.md
│ PURPOSE: Dokumentacja specyfikacji projektowej - Kolejka
│ oczekujących zmian UI/UX do scalenia z
│ Definition_Mockups_UI_UX.md. AI dopisuje tu
│ bieżące modyfikacje interfejsu wynikające z nowych
│ funkcji w trakcie sprintu. Scalanie zbiorcze
│ raz na kilkanaście/kilkadziesiąt commitów.
│ FUNCTIONS: -
│ DEPENDS ON: -
│ -->
├── 📁 public/
│ └── index.html <!-- VERSION: 0.0.3 PATH: public/index.html
│ PURPOSE: Główny plik html aplikacji dla WebView
│ FUNCTIONS: -
│ DEPENDS ON: -
│ -->
├── 📁 src/
│ ├── 📁 constants/
│ │ └── ipcChannels.js ❗ <!-- VERSION: 0.0.3 PATH: src/constants/ipcChannels.js
│ │ PURPOSE: Centralny rejestr nazw kanałów IPC – single source of
│ │ truth. Eliminuje string literals rozrzucone po
│ │ handlerach, hookach i preloadzie. Używać wszędzie
│ │ zamiast ręcznych stringów np. 'profiles:getAll'.
│ │ FUNCTIONS: -
│ │ DEPENDS ON: -
│ │ -->
│ ├── 📁 data/
│ │ ├── app-library.json <!-- VERSION: 0.0.3 PATH: src/data/app-library.json
│ │ │ PURPOSE: Plik danych / tłumaczeń
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: -
│ │ │ -->
│ │ ├── defaultProfiles.json <!-- VERSION: 0.0.3 PATH: src/data/defaultProfiles.json
│ │ │ PURPOSE: Domyślne profile użytkownika (template)
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: -
│ │ │ -->
│ │ ├── defaultSettings.json <!-- VERSION: 0.0.3 PATH: src/data/defaultSettings.json
│ │ │ PURPOSE: Domyślne ustawienia aplikacji
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: -
│ │ │ -->
│ │ └── icons.js <!-- VERSION: 0.0.3 PATH: src/data/icons.js
│ │ PURPOSE: Centralny rejestr wszystkich ikon używanych w
│ │ aplikacji.
│ │ FUNCTIONS: -
│ │ DEPENDS ON: -
│ │ -->
│ ├── 📁 engine/
│ │ ├── adBlocker.js ❗ <!-- VERSION: 0.0.3 PATH: src/engine/adBlocker.js
│ │ │ PURPOSE: Implementacja blokowania reklam na poziomie sieciowym
│ │ │ (webRequest) – wspiera ustawienia globalne i
│ │ │ nadpisywanie per-profil.
│ │ │ FUNCTIONS: isAdUrl, setGlobalAdBlocker, getGlobalAdBlocker,
│ │ │ setProfileAdBlocker, getProfileAdBlocker,
│ │ │ initAdBlocker
│ │ │ DEPENDS ON: electron, config.js, logger.js, webviewRegistry.js
│ │ │ -->
│ │ ├── hotkeysManager.js ❗ <!-- VERSION: 0.0.3 PATH: src/engine/hotkeysManager.js
│ │ │ PURPOSE: Zarządzanie globalnymi skrótami klawiszowymi w procesie
│ │ │ głównym. Obsługuje rejestrację w OS i dispatch zdarzeń
│ │ │ IPC do renderera.
│ │ │ FUNCTIONS: setMainWindow, unregisterAllHotkeys,
│ │ │ registerGlobalHotkeys, getAllHotkeys, saveHotkeys,
│ │ │ registerHotkeysFromList
│ │ │ DEPENDS ON: electron, config.js, logger.js, electron-store
│ │ │ -->
│ │ ├── resourceMonitor.js ❗ <!-- VERSION: 0.0.3 PATH: src/engine/resourceMonitor.js
│ │ │ PURPOSE: Serwis monitorujący zużycie zasobów systemowych
│ │ │ (CPU/RAM) przez aplikację i system operacyjny.
│ │ │ FUNCTIONS: getSystemUsage
│ │ │ DEPENDS ON: os, config.js, logger.js
│ │ │ -->
│ │ ├── sleepTabsManager.js ❗ <!-- VERSION: 0.0.3 PATH: src/engine/sleepTabsManager.js
│ │ │ PURPOSE: Logika zarządzania stanem bezczynności WebView –
│ │ │ obliczanie timeoutów i weryfikacja gotowości do
│ │ │ uśpienia.
│ │ │ FUNCTIONS: getSleepTimeoutMs, shouldSleepTab, markTabActive,
│ │ │ getSleepPlaceholderState
│ │ │ DEPENDS ON: config.js, logger.js
│ │ │ -->
│ │ ├── updateService.js ❗ <!-- VERSION: 0.0.3 PATH: src/engine/updateService.js
│ │ │ PURPOSE: Placeholder sprawdzania aktualizacji (UpdateChecker UI
│ │ │ → docelowo API).
│ │ │ FUNCTIONS: checkForUpdates
│ │ │ DEPENDS ON: logger.js
│ │ │ -->
│ │ └── webviewRegistry.js ❗ <!-- VERSION: 0.0.3 PATH: src/engine/webviewRegistry.js
│ │ PURPOSE: Rejestracja WebView (mapy tabId ↔ webContentsId)
│ │ FUNCTIONS: registerWebView, unregisterWebView, getWebViewEntry,
│ │ getAllWebContents
│ │ DEPENDS ON: logger.js, electron
│ │ -->
│ ├── 📁 hooks/
│ │ ├── useAppLibrary.js ❗ <!-- VERSION: 0.0.3 PATH: src/hooks/useAppLibrary.js
│ │ │ PURPOSE: Hook React do pobierania i wyszukiwania w bibliotece
│ │ │ aplikacji (App Library) przez IPC.
│ │ │ FUNCTIONS: useAppLibrary
│ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ -->
│ │ ├── useCategories.js <!-- VERSION: 0.0.3 PATH: src/hooks/useCategories.js
│ │ │ PURPOSE: Hook React do zarządzania kategoriami profilów – CRUD,
│ │ │ stan zwinięcia, persistencja przez IPC.
│ │ │ FUNCTIONS: useCategories
│ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ -->
│ │ ├── useHistoryLog.js ❗ <!-- VERSION: 0.0.3 PATH: src/hooks/useHistoryLog.js
│ │ │ PURPOSE: Hook React do zarządzania i odświeżania logów historii
│ │ │ aktywności użytkownika. Komunikuje się z historyStore
│ │ │ przez mostek IPC.
│ │ │ FUNCTIONS: useHistoryLog
│ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ -->
│ │ ├── useMainLayout.js ❗ <!-- VERSION: 0.0.3 PATH: src/hooks/useMainLayout.js
│ │ │ PURPOSE: Hook zarządzający stanem globalnym layoutu aplikacji –
│ │ │ TaskPanel, modal potwierdzenia oraz klasa CSS body w
│ │ │ zależności od aktywnego widoku.
│ │ │ FUNCTIONS: useMainLayout
│ │ │ DEPENDS ON: react, translations.js, loggerRenderer.js
│ │ │ -->
│ │ ├── useNotepadContent.js ❗ <!-- VERSION: 0.0.3 PATH: src/hooks/useNotepadContent.js
│ │ │ PURPOSE: Hook React do zarządzania treścią notatnika – stan
│ │ │ edycji, zapis ręczny, zapis do pliku, skróty
│ │ │ klawiszowe.
│ │ │ FUNCTIONS: useNotepadContent
│ │ │ DEPENDS ON: react, notepadStorage.js, loggerRenderer.js
│ │ │ -->
│ │ ├── useNotepadFindReplace.js ❗ <!-- VERSION: 0.0.3 PATH: src/hooks/useNotepadFindReplace.js
│ │ │ PURPOSE: Hook React obsługujący logikę wyszukiwania i
│ │ │ zastępowania tekstu w edytorze notatnika.
│ │ │ FUNCTIONS: useNotepadFindReplace
│ │ │ DEPENDS ON: react, translations.js, loggerRenderer.js,
│ │ │ notificationsManager.js
│ │ │ -->
│ │ ├── useNotepadTabs.js ❗ <!-- VERSION: 0.0.3 PATH: src/hooks/useNotepadTabs.js
│ │ │ PURPOSE: Hook React do zarządzania zakładkami notatnika –
│ │ │ tworzenie, przełączanie, zamykanie, zmiana nazw.
│ │ │ FUNCTIONS: useNotepadTabs
│ │ │ DEPENDS ON: react, notepadStorage.js, loggerRenderer.js
│ │ │ -->
│ │ ├── useNotepadUI.js ❗ <!-- VERSION: 0.0.3 PATH: src/hooks/useNotepadUI.js
│ │ │ PURPOSE: Orkiestrator hooków notatnika – łączy zarządzanie
│ │ │ zakładkami i treścią, obsługuje autosave i toast.
│ │ │ FUNCTIONS: useNotepadUI
│ │ │ DEPENDS ON: react, translations.js, useNotepadTabs.js,
│ │ │ useNotepadContent.js, loggerRenderer.js,
│ │ │ notificationsManager.js
│ │ │ -->
│ │ ├── useProfiles.js <!-- VERSION: 0.0.3 PATH: src/hooks/useProfiles.js
│ │ │ PURPOSE: Hook React do zarządzania profilami WebView – CRUD,
│ │ │ favorite, persistencja przez IPC (granularne kanały
│ │ │ profiles:create/update/delete).
│ │ │ FUNCTIONS: useProfiles
│ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ -->
│ │ ├── useProjects.js ❗ <!-- VERSION: 0.0.3 PATH: src/hooks/useProjects.js
│ │ │ PURPOSE: Hook React do zarządzania projektami użytkownika –
│ │ │ obsługa operacji CRUD przez mostek IPC.
│ │ │ FUNCTIONS: useProjects
│ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ -->
│ │ ├── useSettings.js ❗ <!-- VERSION: 0.0.3 PATH: src/hooks/useSettings.js
│ │ │ PURPOSE: Hook React do zarządzania ustawieniami użytkownika –
│ │ │ ładowanie, aktualizacja i synchronizacja stanu z
│ │ │ settingsStore przez mostek IPC.
│ │ │ FUNCTIONS: useSettings
│ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ -->
│ │ ├── useSidebarSearch.js <!-- VERSION: 0.0.3 PATH: src/hooks/useSidebarSearch.js
│ │ │ PURPOSE: Hook React do wyszukiwania i filtrowania profilów w
│ │ │ sidebarze – tryb lokalny (profile/kategorie) i globalny
│ │ │ (notepad, tasks, projects, profiles przez IPC).
│ │ │ FUNCTIONS: useSidebarSearch
│ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ -->
│ │ ├── useTaskGroups.js ❗ <!-- VERSION: 0.0.3 PATH: src/hooks/useTaskGroups.js
│ │ │ PURPOSE: Hook React do zarządzania grupami zadań (TaskGroup) –
│ │ │ CRUD + przypisanie profili przez IPC.
│ │ │ FUNCTIONS: useTaskGroups
│ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ -->
│ │ ├── useTasks.js ❗ <!-- VERSION: 0.0.3 PATH: src/hooks/useTasks.js
│ │ │ PURPOSE: Hook React do zarządzania zadaniami użytkownika per
│ │ │ taskGroupId – CRUD przez IPC z optimistic update i
│ │ │ rollbackiem.
│ │ │ FUNCTIONS: useTasks
│ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ -->
│ │ ├── useTranslation.js <!-- VERSION: 0.0.3 PATH: src/hooks/useTranslation.js
│ │ │ PURPOSE: Hook React zapewniający dostęp do kontekstu tłumaczeń i
│ │ │ danych pomocy.
│ │ │ FUNCTIONS: useTranslation
│ │ │ DEPENDS ON: react, translations.js, loggerRenderer.js
│ │ │ -->
│ │ ├── useWebViewActions.js ❗ <!-- VERSION: 0.0.3 PATH: src/hooks/useWebViewActions.js
│ │ │ PURPOSE: Hook akcji WebView – nawigacja, zoom, narzędzia
│ │ │ (screenshot, single app, resource monitor)
│ │ │ FUNCTIONS: useWebViewActions
│ │ │ DEPENDS ON: react, config.js, loggerRenderer.js
│ │ │ -->
│ │ ├── useWebViewEvents.js ❗ <!-- VERSION: 0.0.3 PATH: src/hooks/useWebViewEvents.js
│ │ │ PURPOSE: Hook zarządzający listenerami zdarzeń WebView (load,
│ │ │ navigate, title, console)
│ │ │ FUNCTIONS: useWebViewEvents
│ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ -->
│ │ └── useWorkspaces.js ❗ <!-- VERSION: 0.0.3 PATH: src/hooks/useWorkspaces.js
│ │ PURPOSE: Hook React do zarządzania przestrzeniami roboczymi
│ │ (workspaces) użytkownika przez mostek IPC.
│ │ FUNCTIONS: useWorkspaces
│ │ DEPENDS ON: react, loggerRenderer.js, ConfirmModal,
│ │ translations.js
│ │ -->
│ ├── 📁 ipc/
│ │ ├── ipcMainHandlers_adBlocker.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_adBlocker.js
│ │ │ PURPOSE: IPC handlery do zarządzania blokerem reklam – globalnie
│ │ │ i per profil
│ │ │ FUNCTIONS: ipc:adblocker:setGlobal, ipc:adblocker:getGlobal,
│ │ │ ipc:adblocker:setForProfile,
│ │ │ ipc:adblocker:getForProfile
│ │ │ DEPENDS ON: electron, adBlocker.js, logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_aggregatedTasks.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_aggregatedTasks.js
│ │ │ PURPOSE: IPC handlers dla widoku zbiorczego zadań
│ │ │ (AggregatedTasks). Łączy zadania z grupami (TaskGroup)
│ │ │ i profilami.
│ │ │ FUNCTIONS: ipc:aggregatedTasks:getAll,
│ │ │ ipc:aggregatedTasks:filter, ipc:aggregatedTasks:sort
│ │ │ DEPENDS ON: electron, tasksStore.js, taskGroupsStore.js,
│ │ │ logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_app.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_app.js
│ │ │ PURPOSE: IPC handlery cyklu życia aplikacji – potwierdzenie
│ │ │ zamknięcia.
│ │ │ FUNCTIONS: ipc:app:confirmQuit, ipc:confirm-quit
│ │ │ DEPENDS ON: electron, logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_appInfo.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_appInfo.js
│ │ │ PURPOSE: IPC handler do pobierania informacji o aplikacji
│ │ │ FUNCTIONS: ipc:app:getInfo
│ │ │ DEPENDS ON: electron, logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_appLibrary.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_appLibrary.js
│ │ │ PURPOSE: IPC dla biblioteki aplikacji (App Library) – pobieranie
│ │ │ kategorii, wyszukiwanie, filtrowanie po kategorii.
│ │ │ FUNCTIONS: ipc:appLibrary:getAll, ipc:appLibrary:search,
│ │ │ ipc:appLibrary:getByCategory
│ │ │ DEPENDS ON: electron, appLibraryStore.js, logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_cookies.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_cookies.js
│ │ │ PURPOSE: IPC handler do pobierania cookies (Cookie Grabber)
│ │ │ FUNCTIONS: ipc:tools:getCookies
│ │ │ DEPENDS ON: electron, logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_dialogs.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_dialogs.js
│ │ │ PURPOSE: IPC handlers dla natywnych okien dialogowych
│ │ │ (open/save)
│ │ │ FUNCTIONS: ipc:dialog:openFile, ipc:dialog:saveFile
│ │ │ DEPENDS ON: electron, logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_fileApi.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_fileApi.js
│ │ │ PURPOSE: IPC handlers dla File Previewer, Mini Postman i
│ │ │ Clipboard
│ │ │ FUNCTIONS: ipc:tools:filePreview, ipc:tools:apiRequest,
│ │ │ ipc:tools:clipboard:get
│ │ │ DEPENDS ON: electron, fs, path, logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_fileSystem.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_fileSystem.js
│ │ │ PURPOSE: IPC handlers do odczytu i zapisu plików (przez main
│ │ │ process)
│ │ │ FUNCTIONS: ipc:fs:readFile, ipc:fs:writeFile
│ │ │ DEPENDS ON: electron, fs, logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_files.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_files.js
│ │ │ PURPOSE: IPC handlery zapisu plików – tekst i dane binarne przez
│ │ │ dialog systemowy.
│ │ │ FUNCTIONS: ipc:files:saveText, ipc:save-text-to-file,
│ │ │ ipc:files:saveBinary, ipc:save-file
│ │ │ DEPENDS ON: electron, fs, path, logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_history.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_history.js
│ │ │ PURPOSE: IPC dla historii odwiedzin/akcji. history:getAll –
│ │ │ zwraca pełną historię (max 5000 wpisów) history:add 
│ │ │ – dodaje nowy wpis i zapisuje history:clear –
│ │ │ czyści historię history:getRecent – zwraca ostatnie 100
│ │ │ wpisów
│ │ │ FUNCTIONS: ipc:history:getAll, ipc:history:add,
│ │ │ ipc:history:clear, ipc:history:getRecent
│ │ │ DEPENDS ON: electron, historyStore.js, logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_hotkeys.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_hotkeys.js
│ │ │ PURPOSE: IPC handlery do zarządzania skrótami klawiszowymi –
│ │ │ pobieranie, zapis, rejestracja
│ │ │ FUNCTIONS: ipc:hotkeys:getAll, ipc:hotkeys:save,
│ │ │ ipc:hotkeys:register
│ │ │ DEPENDS ON: electron, hotkeysManager.js, logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_imageSharp.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_imageSharp.js
│ │ │ PURPOSE: IPC handlery dla operacji na obrazach (resize, convert,
│ │ │ compress)
│ │ │ FUNCTIONS: ipc:tools:image:resize, ipc:tools:image:convert,
│ │ │ ipc:tools:image:compress
│ │ │ DEPENDS ON: electron, logger.js, sharpLoader.js
│ │ │ -->
│ │ ├── ipcMainHandlers_jsonYaml.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_jsonYaml.js
│ │ │ PURPOSE: IPC handlery dla JSON i YAML (formatowanie, konwersja)
│ │ │ FUNCTIONS: ipc:tools:formatJSON, ipc:tools:yamlToJson,
│ │ │ ipc:tools:jsonToYaml
│ │ │ DEPENDS ON: electron, logger.js, yamlLoader.js
│ │ │ -->
│ │ ├── ipcMainHandlers_logs.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_logs.js
│ │ │ PURPOSE: Handlery IPC dla logów testów (LogWriter) i dziennika
│ │ │ zdarzeń (EventLogger). append-log-file – błędy testów;
│ │ │ events:append – zdarzenia aplikacji (ARCH_REQ-044).
│ │ │ FUNCTIONS: registerLogsHandlers, ipc:append-log-file,
│ │ │ ipc:get-logs-file, ipc:clear-logs-file,
│ │ │ ipc:logs:getFile, ipc:logs:append, ipc:logs:get,
│ │ │ ipc:logs:clear, ipc:events:append, ipc:events:getFile,
│ │ │ ipc:events:clear
│ │ │ DEPENDS ON: electron, fs, path, logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_notepad.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_notepad.js
│ │ │ PURPOSE: IPC dla notatek (Notepad, hooks useNotepad).
│ │ │ FUNCTIONS: ipc:notepad:getAll, ipc:notepad:add, ipc:notepad:update,
│ │ │ ipc:notepad:delete
│ │ │ DEPENDS ON: electron, notepadStore.js, logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_notifications.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_notifications.js
│ │ │ PURPOSE: Handler IPC dla natywnych powiadomień systemowych OS
│ │ │ (Windows/macOS). Przeniesione do procesu głównego —
│ │ │ działa nawet gdy okno jest zminimalizowane lub ukryte w
│ │ │ tray. Implementuje UIUX_REQ-022.
│ │ │ FUNCTIONS: ipc:notifications:showSystem
│ │ │ DEPENDS ON: electron, path, logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_openExternal.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_openExternal.js
│ │ │ PURPOSE: IPC handler do otwierania URL w domyślnej przeglądarce
│ │ │ systemowej
│ │ │ FUNCTIONS: ipc:shell:openExternal
│ │ │ DEPENDS ON: electron, logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_pathUtils.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_pathUtils.js
│ │ │ PURPOSE: IPC helpers dla operacji na ścieżkach (path.join,
│ │ │ path.dirname)
│ │ │ FUNCTIONS: ipc:path:join, ipc:path:dirname
│ │ │ DEPENDS ON: electron, path, logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_profiles.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_profiles.js
│ │ │ PURPOSE: IPC dla profili (Sidebar / Profile Manager / App
│ │ │ Library) pobieranie profili zapisywanie profili edycja
│ │ │ profili usuwanie profili ostatnio używane walidacja
│ │ │ danych
│ │ │ FUNCTIONS: ipc:profiles:getAll, ipc:profiles:create,
│ │ │ ipc:profiles:update, ipc:profiles:delete,
│ │ │ ipc:profiles:touch
│ │ │ DEPENDS ON: electron, profilesStore.js, logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_projects.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_projects.js
│ │ │ PURPOSE: IPC handlers dla Project Manager – CRUD projektów z
│ │ │ walidacją i integracją z tasksStore. projects:getAll 
│ │ │ – pobiera wszystkie projekty projects:getWithTasks –
│ │ │ pobiera projekt wraz z jego zadaniami projects:create 
│ │ │ – tworzy nowy projekt projects:update –
│ │ │ aktualizuje projekt (patch) projects:archive –
│ │ │ archiwizuje projekt projects:delete – usuwa
│ │ │ projekt
│ │ │ FUNCTIONS: ipc:projects:getAll, ipc:projects:getWithTasks,
│ │ │ ipc:projects:create, ipc:projects:update,
│ │ │ ipc:projects:archive, ipc:projects:delete
│ │ │ DEPENDS ON: electron, projectsStore.js, tasksStore.js, logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_regexMarkdown.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_regexMarkdown.js
│ │ │ PURPOSE: IPC handlers dla Regex Tester i Markdown Previewer
│ │ │ FUNCTIONS: ipc:tools:regexTest, ipc:tools:markdownRender
│ │ │ DEPENDS ON: electron, logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_search.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_search.js
│ │ │ PURPOSE: IPC handler globalnego wyszukiwania (Ctrl+K / sidebar
│ │ │ global search). search:global – buduje indeks ze
│ │ │ store'ów i przeszukuje go wg query.
│ │ │ FUNCTIONS: ipc:search:global
│ │ │ DEPENDS ON: electron, searchIndex.js, notepadStore.js,
│ │ │ tasksStore.js, projectsStore.js, logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_settings.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_settings.js
│ │ │ PURPOSE: IPC handlers dla Settings. settings:get –
│ │ │ pobiera aktualne ustawienia settings:update –
│ │ │ aktualizuje (merge patch, nie nadpisuje) settings:reset
│ │ │ – reset do DEFAULT_SETTINGS settings:export –
│ │ │ eksport do pliku JSON settings:import – import z
│ │ │ pliku JSON (merge) settings:getDefaults – zwraca
│ │ │ DEFAULT_SETTINGS z config.js
│ │ │ FUNCTIONS: ipc:settings:get, ipc:settings:update,
│ │ │ ipc:settings:reset, ipc:settings:export,
│ │ │ ipc:settings:import, ipc:settings:getDefaults
│ │ │ DEPENDS ON: electron, fs, logger.js, settingsStore.js, config.js
│ │ │ -->
│ │ ├── ipcMainHandlers_svgToPng.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_svgToPng.js
│ │ │ PURPOSE: IPC handler konwersji SVG → PNG przez sharp
│ │ │ FUNCTIONS: ipc:tools:svgToPng
│ │ │ DEPENDS ON: electron, fs, logger.js, sharpLoader.js
│ │ │ -->
│ │ ├── ipcMainHandlers_taskGroups.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_taskGroups.js
│ │ │ PURPOSE: IPC handlers dla grup zadań (TaskGroup) — CRUD +
│ │ │ przypisanie profili. Mapuje profile WebView na wspólne
│ │ │ panele zadań.
│ │ │ FUNCTIONS: ipc:taskGroups:getAll, ipc:taskGroups:create,
│ │ │ ipc:taskGroups:update, ipc:taskGroups:delete,
│ │ │ ipc:taskGroups:getForProfile,
│ │ │ ipc:taskGroups:ensureForProfile,
│ │ │ ipc:taskGroups:assignProfile,
│ │ │ ipc:taskGroups:unassignProfile
│ │ │ DEPENDS ON: electron, taskGroupsStore.js, logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_tasks.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_tasks.js
│ │ │ PURPOSE: IPC handlers dla zadań (TaskPanel) – CRUD z walidacją
│ │ │ section↔status i mapowaniem na taskGroupId.
│ │ │ FUNCTIONS: ipc:tasks:getAll, ipc:tasks:getAllGrouped,
│ │ │ ipc:tasks:add, ipc:tasks:update, ipc:tasks:delete,
│ │ │ ipc:tasks:saveSections
│ │ │ DEPENDS ON: electron, tasksStore.js, logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_terminal.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_terminal.js
│ │ │ PURPOSE: IPC dla Terminala (node-pty + xterm.js) tworzenie sesji
│ │ │ wysyłanie danych odbieranie danych zamykanie sesji
│ │ │ restart cleanup
│ │ │ FUNCTIONS: ipc:terminal:create, ipc:terminal:write,
│ │ │ ipc:terminal:resize, ipc:terminal:getBuffer,
│ │ │ ipc:terminal:kill, ipc:terminal:restart
│ │ │ DEPENDS ON: electron, logger.js, node-pty, os
│ │ │ -->
│ │ ├── ipcMainHandlers_webview_cache.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_webview_cache.js
│ │ │ PURPOSE: IPC handler dla czyszczenia cache WebView
│ │ │ FUNCTIONS: ipc:webview:clearCache
│ │ │ DEPENDS ON: electron, logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_webview_controls.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_webview_controls.js
│ │ │ PURPOSE: IPC handlers dla User Agent, Single App Mode, Resource
│ │ │ Monitor, Sleep Tabs. Używa ESM import path/url zamiast
│ │ │ require() (ES module context).
│ │ │ FUNCTIONS: ipc:webview:setUserAgent, ipc:webview:openInWindow,
│ │ │ ipc:webview:getUsage, ipc:webview:sleep,
│ │ │ ipc:webview:wake
│ │ │ DEPENDS ON: electron, path, url, logger.js, config.js
│ │ │ -->
│ │ ├── ipcMainHandlers_webview_extra.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_webview_extra.js
│ │ │ PURPOSE: Dodatkowe handlery IPC dla WebView – tryb Single App,
│ │ │ screenshot, monitor zasobów.
│ │ │ FUNCTIONS: registerWebViewExtraHandlers, ipc:webview:openSingle,
│ │ │ ipc:open-single-window, ipc:webview:capture,
│ │ │ ipc:capture-webview, ipc:webview:getResource,
│ │ │ ipc:get-webview-resource
│ │ │ DEPENDS ON: electron, path, logger.js, webviewRegistry.js
│ │ │ -->
│ │ ├── ipcMainHandlers_webview_httpErrors.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_webview_httpErrors.js
│ │ │ PURPOSE: IPC handler monitorujący HTTP 4xx/5xx z WebView per
│ │ │ partycja. Uzupełnia did-fail-load (błędy sieciowe/DNS)
│ │ │ o obsługę błędów HTTP, których did-fail-load nie
│ │ │ wychwytuje (strona się ładuje, ale zwraca błąd).
│ │ │ FUNCTIONS: ipc:webview:startHttpMonitor
│ │ │ DEPENDS ON: electron, logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_webview_nav.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_webview_nav.js
│ │ │ PURPOSE: IPC handlers dla nawigacji WebView. webview:navigate
│ │ │ waliduje URL przez isSafeUrl() przed loadURL() —
│ │ │ blokuje javascript:, data:, file: itp.
│ │ │ FUNCTIONS: ipc:webview:navigate, ipc:webview:reload,
│ │ │ ipc:webview:goBack, ipc:webview:goForward,
│ │ │ ipc:webview:getURL
│ │ │ DEPENDS ON: electron, logger.js, urlUtils.js
│ │ │ -->
│ │ ├── ipcMainHandlers_webview_screenshot.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_webview_screenshot.js
│ │ │ PURPOSE: IPC handler dla screenshot WebView
│ │ │ FUNCTIONS: ipc:webview:screenshot
│ │ │ DEPENDS ON: electron, logger.js, config.js
│ │ │ -->
│ │ └── ipcMainHandlers_workspaces.js ❗ <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_workspaces.js
│ │ PURPOSE: IPC dla workspace (Sidebar, useWorkspaces).
│ │ FUNCTIONS: ipc:workspaces:getAll, ipc:workspaces:save,
│ │ ipc:workspaces:delete
│ │ DEPENDS ON: electron, workspacesStore.js, logger.js
│ │ -->
│ ├── 📁 loaders/
│ │ ├── ipcLoader.js ❗ <!-- VERSION: 0.0.3 PATH: src/loaders/ipcLoader.js
│ │ │ PURPOSE: Dynamicznie ładuje wszystkie handlery IPC z src/ipc/.
│ │ │ Eliminuje konieczność ręcznego importowania każdego
│ │ │ pliku w main.js. Pomija: ipcLegacyBridge.js (ładowany
│ │ │ osobno jako most legacy).
│ │ │ FUNCTIONS: loadAllIpcHandlers
│ │ │ DEPENDS ON: komponenty z folderu ipc/
│ │ │ -->
│ │ └── testsLoader.js ❗ <!-- VERSION: 0.0.3 PATH: src/loaders/testsLoader.js
│ │ PURPOSE: Dynamicznie ładuje i uruchamia wszystkie testy z
│ │ tests/TestRunner_*.js. Eliminuje konieczność ręcznego
│ │ importowania testów w TestRunner.js. Pomija:
│ │ TestRunner.js (orchestrator), testUtils.js. Obsługuje
│ │ flagę --verbose (process.argv) do szczegółowego
│ │ logowania.
│ │ FUNCTIONS: loadAndRunAllTests
│ │ DEPENDS ON: komponenty z folderu tests/
│ │ -->
│ ├── 📁 locales/
│ │ ├── 📁 templates/
│ │ │ ├── help.template.json <!-- VERSION: 0.0.3 PATH: src/locales/templates/help.template.json
│ │ │ │ PURPOSE: Szablon dla pomocy w nowym języku (kopiuj, zmień nazwę
│ │ │ │ na help_[język].json i przetłumacz). PAMIĘTAJ: Jeśli
│ │ │ │ dodajesz nowy język, zaktualizuj TestRunner_Locales.js
│ │ │ │ (dodaj plik do LOCALE_FILES) ORAZ w
│ │ │ │ src/utils/translations.js – w useEffect dla help, dodaj
│ │ │ │ import help_[język].json.
│ │ │ │ FUNCTIONS: -
│ │ │ │ DEPENDS ON: -
│ │ │ │ -->
│ │ │ └── lang.template.json <!-- VERSION: 0.0.3 PATH: src/locales/templates/lang.template.json
│ │ │ PURPOSE: 
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: -
│ │ │ -->
│ │ ├── en.json <!-- VERSION: 0.0.3 PATH: src/locales/en.json
│ │ │ PURPOSE: English translations
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: -
│ │ │ -->
│ │ ├── help_en.json <!-- VERSION: 0.0.3 PATH: src/locales/help_en.json
│ │ │ PURPOSE: Help content (EN) – translated from help_pl.json
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: -
│ │ │ -->
│ │ ├── help_pl.json <!-- VERSION: 0.0.3 PATH: src/locales/help_pl.json
│ │ │ PURPOSE: Treści pomocy (PL)
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: -
│ │ │ -->
│ │ └── pl.json <!-- VERSION: 0.0.3 PATH: src/locales/pl.json
│ │ PURPOSE: Tłumaczenia polskie
│ │ FUNCTIONS: -
│ │ DEPENDS ON: -
│ │ -->
│ ├── 📁 stores/
│ │ ├── accountsStore.js ❗ <!-- VERSION: 0.0.3 PATH: src/stores/accountsStore.js
│ │ │ PURPOSE: Zarządzanie kontami użytkownika (Google, GitHub, AI,
│ │ │ itp.) – obsługa trwałości i operacji CRUD na danych
│ │ │ kont.
│ │ │ FUNCTIONS: getAllAccounts, addAccount, updateAccount,
│ │ │ deleteAccount
│ │ │ DEPENDS ON: fs, path, electron, logger.js
│ │ │ -->
│ │ ├── appLibraryStore.js ❗ <!-- VERSION: 0.0.3 PATH: src/stores/appLibraryStore.js
│ │ │ PURPOSE: Statyczna App Library (WebCatalog-style) — odczyt,
│ │ │ cache'owanie i filtrowanie aplikacji z pliku JSON
│ │ │ (loadAppLibrary, filterApps, searchAppLibrary,
│ │ │ getAppById).
│ │ │ FUNCTIONS: loadAppLibrary, filterApps, searchAppLibrary,
│ │ │ getAppById
│ │ │ DEPENDS ON: fs, path, url, logger.js
│ │ │ -->
│ │ ├── clipboardStore.js ❗ <!-- VERSION: 0.0.3 PATH: src/stores/clipboardStore.js
│ │ │ PURPOSE: Zarządzanie historią schowka systemowego – dodawanie,
│ │ │ pobieranie i czyszczenie wpisów tekstowych.
│ │ │ FUNCTIONS: addClipboardEntry, getClipboardHistory,
│ │ │ clearClipboardHistory
│ │ │ DEPENDS ON: electron, config.js, logger.js
│ │ │ -->
│ │ ├── historyStore.js ❗ <!-- VERSION: 0.0.3 PATH: src/stores/historyStore.js
│ │ │ PURPOSE: Zarządzanie historią akcji użytkownika – odczyt, zapis,
│ │ │ dodawanie wpisów, czyszczenie i pobieranie ostatnich
│ │ │ wpisów.
│ │ │ FUNCTIONS: loadHistory, saveHistory, addHistoryEntry,
│ │ │ clearHistory, getRecentHistory
│ │ │ DEPENDS ON: config.js, persistence.js, logger.js
│ │ │ -->
│ │ ├── notepadStore.js ❗ <!-- VERSION: 0.0.3 PATH: src/stores/notepadStore.js
│ │ │ PURPOSE: Zarządzanie notatkami użytkownika – ładowanie,
│ │ │ zapisywanie oraz operacje CRUD na danych notatek.
│ │ │ FUNCTIONS: getAllnotepad, addNote, updateNote, deleteNote
│ │ │ DEPENDS ON: fs, path, electron, logger.js
│ │ │ -->
│ │ ├── profilesStore.js ❗ <!-- VERSION: 0.0.3 PATH: src/stores/profilesStore.js
│ │ │ PURPOSE: Zarządzanie profilami WebView — odczyt z pliku, zapis,
│ │ │ tworzenie, aktualizacja i usuwanie (loadProfiles,
│ │ │ saveProfiles, createProfile, updateProfile,
│ │ │ deleteProfile).
│ │ │ FUNCTIONS: loadProfiles, saveProfiles, createProfile,
│ │ │ updateProfile, deleteProfile
│ │ │ DEPENDS ON: fs, path, url, persistence.js, logger.js, config.js
│ │ │ -->
│ │ ├── projectsStore.js ❗ <!-- VERSION: 0.0.3 PATH: src/stores/projectsStore.js
│ │ │ PURPOSE: Projekty (ProjectManager, AggregatedTasks) — plik
│ │ │ projects.json.
│ │ │ FUNCTIONS: loadProjects, saveProjects, createProject,
│ │ │ updateProject, archiveProject, deleteProject
│ │ │ DEPENDS ON: persistence.js, settingsStore.js, logger.js, fs
│ │ │ -->
│ │ ├── settingsStore.js ❗ <!-- VERSION: 0.0.3 PATH: src/stores/settingsStore.js
│ │ │ PURPOSE: Ustawienia użytkownika — merge partial updates, reset
│ │ │ do domyślnych.
│ │ │ FUNCTIONS: loadSettings, saveSettings, mergeSettings,
│ │ │ updateSettings, resetSettings
│ │ │ DEPENDS ON: lodash, fs, path, url, config.js, persistence.js,
│ │ │ logger.js
│ │ │ -->
│ │ ├── taskGroupsStore.js ❗ <!-- VERSION: 0.0.3 PATH: src/stores/taskGroupsStore.js
│ │ │ PURPOSE: Zarządzanie grupami zadań (TaskGroup) — mapowanie
│ │ │ profili WebView na wspólny panel zadań. Każda grupa to
│ │ │ osobny panel TaskPanel współdzielony przez 1..N
│ │ │ profili.
│ │ │ FUNCTIONS: loadTaskGroups, saveTaskGroups, createTaskGroup,
│ │ │ updateTaskGroup, deleteTaskGroup, getGroupForProfile,
│ │ │ ensureDefaultGroup
│ │ │ DEPENDS ON: persistence.js, logger.js
│ │ │ -->
│ │ ├── tasksStore.js ❗ <!-- VERSION: 0.0.3 PATH: src/stores/tasksStore.js
│ │ │ PURPOSE: Zadania per TaskGroup (TaskPanel, AggregatedTasks).
│ │ │ Jeden plik JSON per taskGroupId. Zawiera logikę
│ │ │ mapowania section↔status.
│ │ │ FUNCTIONS: resolveSection, normalizeTask, loadTasksSections,
│ │ │ loadTasksByGroup, saveTasksForGroup,
│ │ │ loadAllTasksGrouped, loadTasks
│ │ │ DEPENDS ON: fs, persistence.js, logger.js
│ │ │ -->
│ │ └── workspacesStore.js ❗ <!-- VERSION: 0.0.3 PATH: src/stores/workspacesStore.js
│ │ PURPOSE: Zarządzanie przestrzeniami roboczymi (workspaces)
│ │ użytkownika – ładowanie, zapisywanie oraz operacje typu
│ │ upsert.
│ │ FUNCTIONS: getAllWorkspaces, saveWorkspace, saveWorkspaces,
│ │ deleteWorkspace
│ │ DEPENDS ON: fs, path, electron, logger.js
│ │ -->
│ ├── 📁 tools/
│ │ ├── apiClient.js ❗ <!-- VERSION: 0.0.3 PATH: src/tools/apiClient.js
│ │ │ PURPOSE: Wrapper HTTP do testowania API – wykonuje żądania z
│ │ │ obsługą timeout (AbortController) i automatycznym retry
│ │ │ z exponential backoff (3 próby). apiRequest() zwraca {
│ │ │ status, headers, body } dla MiniPostman.
│ │ │ apiFetch/apiGet/apiPost to niskopoziomowe helpery z
│ │ │ retry dla innych narzędzi.
│ │ │ FUNCTIONS: apiFetch, apiGet, apiPost, apiRequest
│ │ │ DEPENDS ON: logger.js
│ │ │ -->
│ │ ├── markdownRenderer.js ❗ <!-- VERSION: 0.0.3 PATH: src/tools/markdownRenderer.js
│ │ │ PURPOSE: Renderowanie markdown do HTML przy użyciu marked -
│ │ │ renderMarkdown(text) zwraca string HTML
│ │ │ FUNCTIONS: renderMarkdown
│ │ │ DEPENDS ON: marked, logger.js
│ │ │ -->
│ │ ├── regexEngine.js ❗ <!-- VERSION: 0.0.3 PATH: src/tools/regexEngine.js
│ │ │ PURPOSE: Helper do testowania wyrażeń regularnych
│ │ │ testRegex(pattern, flags, text) zwraca tablicę
│ │ │ wszystkich dopasowań z podanego tekstu
│ │ │ FUNCTIONS: testRegex
│ │ │ DEPENDS ON: logger.js
│ │ │ -->
│ │ └── svgToPng.js ❗ <!-- VERSION: 0.0.3 PATH: src/tools/svgToPng.js
│ │ PURPOSE: Konwersja pliku SVG do PNG przy użyciu sharp
│ │ svgToPng(svgPath, outputPath, width, height) odczytuje
│ │ SVG z dysku, renderuje do PNG o podanych wymiarach i
│ │ zapisuje wynik pod outputPath
│ │ FUNCTIONS: svgToPng
│ │ DEPENDS ON: fs, sharp, logger.js
│ │ -->
│ ├── 📁 ui/
│ │ ├── 📁 appLibrary/
│ │ │ └── ⚛️ AppLibraryBrowser.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/appLibrary/AppLibraryBrowser.jsx
│ │ │ PURPOSE: Główny widok biblioteki aplikacji (App Library) –
│ │ │ przeglądanie skatalogowanych usług webowych,
│ │ │ wyszukiwanie i dodawanie do profili. Komunikacja przez
│ │ │ hook IPC useAppLibrary.
│ │ │ FUNCTIONS: AppLibraryBrowser
│ │ │ DEPENDS ON: react, config.js, useAppLibrary.js, translations.js,
│ │ │ loggerRenderer.js, icons.js
│ │ │ -->
│ │ ├── 📁 help/
│ │ │ ├── ⚛️ FAQ.jsx <!-- VERSION: 0.0.3 PATH: src/ui/help/FAQ.jsx
│ │ │ │ PURPOSE: Pojedynczy wpis FAQ (pytanie + odpowiedź)
│ │ │ │ FUNCTIONS: -
│ │ │ │ DEPENDS ON: react, translations.js, icons.js
│ │ │ │ -->
│ │ │ ├── ⚛️ Help.jsx <!-- VERSION: 0.0.3 PATH: src/ui/help/Help.jsx
│ │ │ │ PURPOSE: Główny komponent pomocy – łączy sekcje (Profile, Tools,
│ │ │ │ Tasks, Shortcuts, FAQ)
│ │ │ │ FUNCTIONS: Help
│ │ │ │ DEPENDS ON: react, config.js, translations.js, icons.js,
│ │ │ │ HelpSection, ToolCard, Shortcut, FAQ
│ │ │ │ -->
│ │ │ ├── ⚛️ HelpSection.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/help/HelpSection.jsx
│ │ │ │ PURPOSE: Rozwijana sekcja pomocy (tytuł + treść)
│ │ │ │ FUNCTIONS: HelpSection
│ │ │ │ DEPENDS ON: react, translations.js, icons.js
│ │ │ │ -->
│ │ │ ├── ⚛️ Shortcut.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/help/Shortcut.jsx
│ │ │ │ PURPOSE: Wiersz skrótu klawiaturowego
│ │ │ │ FUNCTIONS: Shortcut
│ │ │ │ DEPENDS ON: react, translations.js
│ │ │ │ -->
│ │ │ └── ⚛️ ToolCard.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/help/ToolCard.jsx
│ │ │ PURPOSE: Karta opisu narzędzia (ikona, tytuł, opis)
│ │ │ FUNCTIONS: ToolCard
│ │ │ DEPENDS ON: react, translations.js
│ │ │ -->
│ │ ├── 📁 history/
│ │ │ ├── ⚛️ HistoryExport.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/history/HistoryExport.jsx
│ │ │ │ PURPOSE: Eksport historii do CSV
│ │ │ │ FUNCTIONS: HistoryExport
│ │ │ │ DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── ⚛️ HistoryFilters.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/history/HistoryFilters.jsx
│ │ │ │ PURPOSE: Filtry historii (poziom, sortowanie, przycisk
│ │ │ │ czyszczenia)
│ │ │ │ FUNCTIONS: HistoryFilters
│ │ │ │ DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── ⚛️ HistoryList.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/history/HistoryList.jsx
│ │ │ │ PURPOSE: Lista wpisów historii (tabela)
│ │ │ │ FUNCTIONS: HistoryList
│ │ │ │ DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│ │ │ │ -->
│ │ │ └── ⚛️ HistoryLog.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/history/HistoryLog.jsx
│ │ │ PURPOSE: Historia przeglądania – lista ostatnio odwiedzonych
│ │ │ profili, komunikacja przez hook IPC useHistoryLog.
│ │ │ FUNCTIONS: HistoryLog
│ │ │ DEPENDS ON: react, useHistoryLog.js, translations.js,
│ │ │ loggerRenderer.js, icons.js, ConfirmModal.jsx,
│ │ │ HistoryFilters.jsx, HistoryList.jsx
│ │ │ -->
│ │ ├── 📁 layout/
│ │ │ └── ⚛️ MainLayout.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/layout/MainLayout.jsx
│ │ │ PURPOSE: Główny szkielet interfejsu użytkownika (Shell) –
│ │ │ definiuje siatkę aplikacji, koordynuje nawigację
│ │ │ boczną, obszar roboczy (ContentRenderer) oraz integruje
│ │ │ globalne mechanizmy modalne. Logika stanu przeniesiona
│ │ │ do useMainLayout.js.
│ │ │ FUNCTIONS: MainLayout
│ │ │ DEPENDS ON: react, useMainLayout.js, Sidebar.jsx,
│ │ │ ContentRenderer.jsx, ConfirmModal.jsx
│ │ │ -->
│ │ ├── 📁 modals/
│ │ │ ├── ⚛️ CategoryModal.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/modals/CategoryModal.jsx
│ │ │ │ PURPOSE: Formularz modalny do zarządzania kategoriami profili –
│ │ │ │ umożliwia tworzenie nowych i edycję istniejących sekcji
│ │ │ │ grupujących w Sidebarze.
│ │ │ │ FUNCTIONS: CategoryModal
│ │ │ │ DEPENDS ON: loggerRenderer.js, react, translations.js, icons.js,
│ │ │ │ ModalPortal
│ │ │ │ -->
│ │ │ ├── ⚛️ ConfirmModal.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/modals/ConfirmModal.jsx
│ │ │ │ PURPOSE: Generyczny komponent modalny służący do potwierdzania
│ │ │ │ akcji krytycznych (np. usuwanie). Zapewnia spójność
│ │ │ │ wizualną i zastępuje natywną funkcję window.confirm.
│ │ │ │ FUNCTIONS: ConfirmModal
│ │ │ │ DEPENDS ON: react, translations.js, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── ⚛️ Modal.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/modals/Modal.jsx
│ │ │ │ PURPOSE: Bazowy komponent modalny dla całej aplikacji
│ │ │ │ FUNCTIONS: Modal
│ │ │ │ DEPENDS ON: react, translations.js, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── ⚛️ ProfileModal.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/modals/ProfileModal.jsx
│ │ │ │ PURPOSE: Zaawansowany formularz modalny do konfiguracji profili
│ │ │ │ WebView – obsługuje parametry URL, ikony, przypisanie
│ │ │ │ do kategorii oraz przełączniki adblockera i
│ │ │ │ powiadomień.
│ │ │ │ FUNCTIONS: ProfileModal
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js,
│ │ │ │ urlUtils.js, ModalPortal, notificationsManager.js,
│ │ │ │ useTaskGroups.js
│ │ │ │ -->
│ │ │ └── ⚛️ PromptModal.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/modals/PromptModal.jsx
│ │ │ PURPOSE: Modal z polem input – zastępuje window.prompt()
│ │ │ FUNCTIONS: PromptModal
│ │ │ DEPENDS ON: react, translations.js, loggerRenderer.js
│ │ │ -->
│ │ ├── 📁 notepad/
│ │ │ ├── ⚛️ ClipboardHistoryModal.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/notepad/ClipboardHistoryModal.jsx
│ │ │ │ PURPOSE: Okno modalne prezentujące listę historycznych wpisów ze
│ │ │ │ schowka systemowego – umożliwia przeglądanie i
│ │ │ │ odzyskiwanie skopiowanych wcześniej fragmentów tekstu.
│ │ │ │ FUNCTIONS: ClipboardHistoryModal
│ │ │ │ DEPENDS ON: react, translations.js, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── ⚛️ Notepad.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/notepad/Notepad.jsx
│ │ │ │ PURPOSE: Główny komponent interfejsu notatnika – koordynuje
│ │ │ │ pracę zakładek, edytora oraz paneli wyszukiwania i
│ │ │ │ statusu, integrując logikę z hookami useNotepadUI i
│ │ │ │ useNotepadFindReplace.
│ │ │ │ FUNCTIONS: Notepad
│ │ │ │ DEPENDS ON: react, useNotepadUI.js, useNotepadFindReplace.js,
│ │ │ │ NotepadTabs, NotepadToolbar, NotepadFindReplace,
│ │ │ │ NotepadStatusBar, loggerRenderer.js, translations.js,
│ │ │ │ ConfirmModal
│ │ │ │ -->
│ │ │ ├── ⚛️ NotepadFindReplace.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/notepad/NotepadFindReplace.jsx
│ │ │ │ PURPOSE: Panel znajdź/zastąp w notatniku
│ │ │ │ FUNCTIONS: NotepadFindReplace
│ │ │ │ DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── ⚛️ NotepadStatusBar.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/notepad/NotepadStatusBar.jsx
│ │ │ │ PURPOSE: Pasek informacyjny u dołu notatnika – wyświetla
│ │ │ │ metadane aktywnego dokumentu: statystyki znaków/wierszy
│ │ │ │ oraz czas ostatniego autozapisu.
│ │ │ │ FUNCTIONS: NotepadStatusBar
│ │ │ │ DEPENDS ON: react, translations.js, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── ⚛️ NotepadTabs.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/notepad/NotepadTabs.jsx
│ │ │ │ PURPOSE: Komponent zarządzający paskiem kart notatnika –
│ │ │ │ obsługuje przełączanie dokumentów, ich zamykanie,
│ │ │ │ zmianę nazwy oraz wizualizację stanu 'dirty'.
│ │ │ │ FUNCTIONS: NotepadTabs
│ │ │ │ DEPENDS ON: react, translations.js, loggerRenderer.js, icons.js,
│ │ │ │ PromptModal.jsx
│ │ │ │ -->
│ │ │ └── ⚛️ NotepadToolbar.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/notepad/NotepadToolbar.jsx
│ │ │ PURPOSE: Pasek narzędzi notatnika (zapisz, znajdź, word wrap)
│ │ │ FUNCTIONS: NotepadToolbar
│ │ │ DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│ │ │ -->
│ │ ├── 📁 profiles/
│ │ │ └── ⚛️ Profiles.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/profiles/Profiles.jsx
│ │ │ PURPOSE: UI zarządzania profilami WebView — wyświetlanie listy
│ │ │ profili z danych IPC (load, wyświetlanie nazwy, URL,
│ │ │ obsługa błędów). Używa window.electronAPI.invoke
│ │ │ zamiast window.mw.
│ │ │ FUNCTIONS: Profiles
│ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ -->
│ │ ├── 📁 projects/
│ │ │ ├── ⚛️ ProjectList.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/projects/ProjectList.jsx
│ │ │ │ PURPOSE: Lista projektów z akcjami (zadania, terminal, usuwanie)
│ │ │ │ FUNCTIONS: ProjectList
│ │ │ │ DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── ⚛️ ProjectManager.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/projects/ProjectManager.jsx
│ │ │ │ PURPOSE: Zarządzanie projektami – lista, dodawanie, usuwanie,
│ │ │ │ edycja przez hook IPC useProjects.
│ │ │ │ FUNCTIONS: ProjectManager
│ │ │ │ DEPENDS ON: react, useProjects.js, translations.js,
│ │ │ │ loggerRenderer.js, icons.js, ConfirmModal.jsx,
│ │ │ │ ProjectModal.jsx
│ │ │ │ -->
│ │ │ └── ⚛️ ProjectModal.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/projects/ProjectModal.jsx
│ │ │ PURPOSE: Modal dodawania nowego projektu (nazwa + ścieżka)
│ │ │ FUNCTIONS: ProjectModal
│ │ │ DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│ │ │ -->
│ │ ├── 📁 settings/
│ │ │ ├── ⚛️ AccountSection.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/settings/AccountSection.jsx
│ │ │ │ PURPOSE: Sekcja zarządzania profilem użytkownika – obecnie służy
│ │ │ │ jako placeholder dla nadchodzącej funkcji
│ │ │ │ synchronizacji danych w chmurze (Cloud Sync) planowanej
│ │ │ │ w v0.0.4.
│ │ │ │ FUNCTIONS: AccountSection
│ │ │ │ DEPENDS ON: react, translations.js, src, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── ⚛️ DataManagementSection.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/settings/DataManagementSection.jsx
│ │ │ │ PURPOSE: Sekcja zarządzania danymi aplikacji – eksport, import i
│ │ │ │ reset ustawień.
│ │ │ │ FUNCTIONS: DataManagementSection
│ │ │ │ DEPENDS ON: react, translations.js, loggerRenderer.js, icons.js,
│ │ │ │ ConfirmModal
│ │ │ │ -->
│ │ │ ├── ⚛️ DebugModulesSection.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/settings/DebugModulesSection.jsx
│ │ │ │ PURPOSE: UI do zarządzania filtrowaniem logów per-moduł.
│ │ │ │ Widoczna tylko w trybie debugMode.
│ │ │ │ FUNCTIONS: DebugModulesSection
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer.js,
│ │ │ │ icons.js
│ │ │ │ -->
│ │ │ ├── ⚛️ GeneralSection.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/settings/GeneralSection.jsx
│ │ │ │ PURPOSE: Sekcja ustawień ogólnych aplikacji – zarządza wyborem
│ │ │ │ języka (i18n), motywem graficznym (Light/Dark) oraz
│ │ │ │ globalnym trybem debugowania (developer mode).
│ │ │ │ FUNCTIONS: GeneralSection
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│ │ │ │ icons
│ │ │ │ -->
│ │ │ ├── ⚛️ HotkeyModal.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/settings/HotkeyModal.jsx
│ │ │ │ PURPOSE: Modal do dodawania i edycji skrótów klawiszowych –
│ │ │ │ formularz z walidacją.
│ │ │ │ FUNCTIONS: HotkeyModal
│ │ │ │ DEPENDS ON: react, translations.js, Modal
│ │ │ │ -->
│ │ │ ├── ⚛️ HotkeysList.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/settings/HotkeysList.jsx
│ │ │ │ PURPOSE: Komponent tabeli wyświetlającej listę skrótów
│ │ │ │ klawiszowych z akcjami edycji i usuwania.
│ │ │ │ FUNCTIONS: HotkeysList
│ │ │ │ DEPENDS ON: react, translations.js, icons.js
│ │ │ │ -->
│ │ │ ├── ⚛️ HotkeysManager.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/settings/HotkeysManager.jsx
│ │ │ │ PURPOSE: Kontener zarządzania skrótami klawiszowymi – ładuje
│ │ │ │ dane, orkiestruje logikę CRUD i renderuje
│ │ │ │ podkomponenty.
│ │ │ │ FUNCTIONS: HotkeysManager
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│ │ │ │ HotkeysList, HotkeyModal, ConfirmModal,
│ │ │ │ notificationsManager.js
│ │ │ │ -->
│ │ │ ├── ⚛️ LogsSection.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/settings/LogsSection.jsx
│ │ │ │ PURPOSE: Sekcja zarządzania logami — logi testów (LogWriter) i
│ │ │ │ dziennik zdarzeń aplikacji (EventLogger, ARCH_REQ-044).
│ │ │ │ FUNCTIONS: LogsSection
│ │ │ │ DEPENDS ON: react, translations.js, loggerRenderer.js, icons.js,
│ │ │ │ Modal
│ │ │ │ -->
│ │ │ ├── ⚛️ NotificationsSection.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/settings/NotificationsSection.jsx
│ │ │ │ PURPOSE: Sekcja powiadomień — toggles dla toastów UI
│ │ │ │ (UIUX_REQ-021), powiadomień systemowych OS
│ │ │ │ (UIUX_REQ-022) oraz Pushbullet.
│ │ │ │ FUNCTIONS: NotificationsSection
│ │ │ │ DEPENDS ON: react, translations.js, loggerRenderer, icons
│ │ │ │ -->
│ │ │ ├── ⚛️ Settings.jsx <!-- VERSION: 0.0.3 PATH: src/ui/settings/Settings.jsx
│ │ │ │ PURPOSE: Główny kontener widoku ustawień aplikacji. Agreguje
│ │ │ │ wszystkie sekcje konfiguracyjne w jeden
│ │ │ │ ustrukturyzowany interfejs użytkownika.
│ │ │ │ FUNCTIONS: Settings
│ │ │ │ DEPENDS ON: react, GeneralSection, WebViewSection, TabsSection,
│ │ │ │ NotificationsSection, HotkeysManager,
│ │ │ │ DebugModulesSection, DataManagementSection,
│ │ │ │ LogsSection, AccountSection, loggerRenderer.js,
│ │ │ │ translations.js
│ │ │ │ -->
│ │ │ ├── ⚛️ TabsSection.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/settings/TabsSection.jsx
│ │ │ │ PURPOSE: Sekcja konfiguracji zarządzania kartami – pozwala na
│ │ │ │ ustawienie czasu bezczynności, po którym nieaktywne
│ │ │ │ WebView są uśpiane w celu oszczędzania zasobów
│ │ │ │ systemowych (RAM/CPU).
│ │ │ │ FUNCTIONS: TabsSection
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│ │ │ │ icons
│ │ │ │ -->
│ │ │ └── ⚛️ WebViewSection.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/settings/WebViewSection.jsx
│ │ │ PURPOSE: Konfiguracja silnika przeglądarki (WebView) – zarządza
│ │ │ globalnym blokowaniem reklam, maskowaniem tożsamości
│ │ │ przeglądarki (User Agent) oraz trybami wyświetlania
│ │ │ okien.
│ │ │ FUNCTIONS: WebViewSection
│ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│ │ │ icons
│ │ │ -->
│ │ ├── 📁 sidebar/
│ │ │ ├── ⚛️ ContextMenu.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/ContextMenu.jsx
│ │ │ │ PURPOSE: Menu kontekstowe (PPM) dla profilu
│ │ │ │ FUNCTIONS: ContextMenu
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, translations.js
│ │ │ │ -->
│ │ │ ├── ⚛️ Sidebar.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/Sidebar.jsx
│ │ │ │ PURPOSE: Główny panel nawigacyjny aplikacji – orkiestrator,
│ │ │ │ deleguje logikę do hooków i podkomponentów.
│ │ │ │ FUNCTIONS: Sidebar
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js,
│ │ │ │ config.js, useProfiles.js, useCategories.js,
│ │ │ │ useSidebarSearch.js, useWorkspaces.js, SidebarHeader,
│ │ │ │ SidebarProfileList, SidebarTools, SidebarWorkspaces,
│ │ │ │ ProfileModal, CategoryModal, ConfirmModal
│ │ │ │ -->
│ │ │ ├── ⚛️ SidebarCategory.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/SidebarCategory.jsx
│ │ │ │ PURPOSE: Nagłówek kategorii profilów (zwijanie/rozwijanie, menu
│ │ │ │ kontekstowe)
│ │ │ │ FUNCTIONS: SidebarCategory
│ │ │ │ DEPENDS ON: react, translations.js, loggerRenderer.js, icons.js
│ │ │ │ -->
│ │ │ ├── ⚛️ SidebarHeader.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/SidebarHeader.jsx
│ │ │ │ PURPOSE: Główny komponent nagłówka paska bocznego (Sidebar) –
│ │ │ │ udostępnia przyciski akcji do tworzenia nowych profili
│ │ │ │ i kategorii oraz integruje komponent wyszukiwania
│ │ │ │ SidebarSearch.
│ │ │ │ FUNCTIONS: SidebarHeader
│ │ │ │ DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js,
│ │ │ │ SidebarSearch
│ │ │ │ -->
│ │ │ ├── ⚛️ SidebarProfileItem.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/SidebarProfileItem.jsx
│ │ │ │ PURPOSE: Pojedynczy profil w Sidebarze (ikona, nazwa,
│ │ │ │ indykatory)
│ │ │ │ FUNCTIONS: SidebarProfileItem
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, icons.js
│ │ │ │ -->
│ │ │ ├── ⚛️ SidebarProfileList.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/SidebarProfileList.jsx
│ │ │ │ PURPOSE: Lista profilów w sidebarze – favorites, kategorie,
│ │ │ │ profil bez kategorii, z obsługą menu kontekstowego.
│ │ │ │ FUNCTIONS: SidebarProfileList
│ │ │ │ DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js,
│ │ │ │ SidebarCategory, SidebarProfileItem, ContextMenu
│ │ │ │ -->
│ │ │ ├── ⚛️ SidebarSearch.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/SidebarSearch.jsx
│ │ │ │ PURPOSE: Komponent paska wyszukiwania zintegrowany z
│ │ │ │ SidebarHeader – filtrowanie profili i kategorii (tryb
│ │ │ │ lokalny) oraz globalne wyszukiwanie notatek, zadań i
│ │ │ │ projektów (tryb globalny).
│ │ │ │ FUNCTIONS: SidebarSearch
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js
│ │ │ │ -->
│ │ │ ├── ⚛️ SidebarTools.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/SidebarTools.jsx
│ │ │ │ PURPOSE: Sekcja narzędzi specjalnych w Sidebarze
│ │ │ │ FUNCTIONS: SidebarTools
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer.js,
│ │ │ │ icons.js
│ │ │ │ -->
│ │ │ └── ⚛️ SidebarWorkspaces.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/SidebarWorkspaces.jsx
│ │ │ PURPOSE: Sekcja workspace'ów w Sidebarze
│ │ │ FUNCTIONS: SidebarWorkspaces
│ │ │ DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js
│ │ │ -->
│ │ ├── 📁 styles/
│ │ │ ├── components.css ❗ <!-- VERSION: 0.0.3 PATH: src/ui/styles/components.css
│ │ │ │ PURPOSE: Zbiór stylów CSS aplikacji
│ │ │ │ FUNCTIONS: -
│ │ │ │ DEPENDS ON: -
│ │ │ │ -->
│ │ │ └── theme.css <!-- VERSION: 0.0.3 PATH: src/ui/styles/theme.css
│ │ │ PURPOSE: Globalne style aplikacji MultiWeb Manager
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: -
│ │ │ -->
│ │ ├── 📁 system/
│ │ │ ├── ⚛️ ModalPortal.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/system/ModalPortal.jsx
│ │ │ │ PURPOSE: Modal w portalu (document.body) — ponad natywnym
│ │ │ │ <webview> w Electronie.
│ │ │ │ FUNCTIONS: ModalPortal
│ │ │ │ DEPENDS ON: react, react-dom
│ │ │ │ -->
│ │ │ ├── ⚛️ OnboardingScreen.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/system/OnboardingScreen.jsx
│ │ │ │ PURPOSE: Ekran onboardingu przy pierwszym uruchomieniu – 5
│ │ │ │ kroków: motyw, język, prywatność/disclaimer, szybki
│ │ │ │ start (wybór aplikacji z App Library), konto
│ │ │ │ (placeholder).
│ │ │ │ FUNCTIONS: OnboardingScreen
│ │ │ │ DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js,
│ │ │ │ app-library.json
│ │ │ │ -->
│ │ │ ├── ⚛️ SplashScreen.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/system/SplashScreen.jsx
│ │ │ │ PURPOSE: Ekran ładowania aplikacji wyświetlany przy starcie
│ │ │ │ przez 1.5–2s. Pokazuje logo (PNG z assets/ lub SVG
│ │ │ │ fallback), nazwę aplikacji i pasek postępu.
│ │ │ │ FUNCTIONS: SplashScreen
│ │ │ │ DEPENDS ON: react, translations.js, icons.js
│ │ │ │ -->
│ │ │ ├── ⚛️ ToastContainer.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/system/ToastContainer.jsx
│ │ │ │ PURPOSE: Globalny kontener toastów z kolejką FIFO i animowanym
│ │ │ │ stackiem. Subskrybuje się na CustomEvent 'mwm:toast' z
│ │ │ │ notificationsManager.js. Zarządza stanem przez
│ │ │ │ useReducer — max 3 aktywne jednocześnie, pozostałe
│ │ │ │ czekają w kolejce.
│ │ │ │ FUNCTIONS: ToastContainer
│ │ │ │ DEPENDS ON: react, icons.js, loggerRenderer.js
│ │ │ │ -->
│ │ │ └── ⚛️ UpdateChecker.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/system/UpdateChecker.jsx
│ │ │ PURPOSE: Komponent sprawdzania aktualizacji. Używa globalnego
│ │ │ showToast (UIUX_REQ-021) zamiast lokalnego stanu
│ │ │ inline.
│ │ │ FUNCTIONS: UpdateChecker
│ │ │ DEPENDS ON: react, icons, translations.js, loggerRenderer,
│ │ │ notificationsManager.js
│ │ │ -->
│ │ ├── 📁 taskpanel/
│ │ │ ├── ⚛️ CommentModal.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/CommentModal.jsx
│ │ │ │ PURPOSE: Modal podglądu komentarza/kodu do zadania
│ │ │ │ FUNCTIONS: CommentModal
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js
│ │ │ │ -->
│ │ │ ├── ⚛️ TaskDetails.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskDetails.jsx
│ │ │ │ PURPOSE: Widok szczegółowy pojedynczego zadania. Umożliwia
│ │ │ │ szybką edycję statusu i priorytetu bezpośrednio z
│ │ │ │ poziomu podglądu oraz synchronizację tych zmian przez
│ │ │ │ IPC.
│ │ │ │ FUNCTIONS: TaskDetails
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, constants.js,
│ │ │ │ translations.js
│ │ │ │ -->
│ │ │ ├── ⚛️ TaskEditor.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskEditor.jsx
│ │ │ │ PURPOSE: Wyspecjalizowany edytor zadań (inline lub modal)
│ │ │ │ obsługujący walidację danych wejściowych, komunikację z
│ │ │ │ tasksStore przez IPC oraz integrację z systemem
│ │ │ │ toastów.
│ │ │ │ FUNCTIONS: TaskEditor
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, constants.js,
│ │ │ │ translations.js
│ │ │ │ -->
│ │ │ ├── ⚛️ TaskEmptyState.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskEmptyState.jsx
│ │ │ │ PURPOSE: Komponent wyświetlający stan braku zadań w danej
│ │ │ │ sekcji.
│ │ │ │ FUNCTIONS: TaskEmptyState
│ │ │ │ DEPENDS ON: react, translations.js
│ │ │ │ -->
│ │ │ ├── ⚛️ TaskItem.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskItem.jsx
│ │ │ │ PURPOSE: Pojedynczy element zadania w panelu. Wyświetla status,
│ │ │ │ priorytet, nazwę i przyciski akcji. Przyciski ruchu
│ │ │ │ między sekcjami są kontekstowe (zależą od section i
│ │ │ │ status zadania).
│ │ │ │ FUNCTIONS: TaskItem
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js
│ │ │ │ -->
│ │ │ ├── ⚛️ TaskList.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskList.jsx
│ │ │ │ PURPOSE: Główny komponent listy zadań (Kanban/List view) –
│ │ │ │ odpowiada za dynamiczne filtrowanie, grupowanie według
│ │ │ │ statusu (TODO, IN_PROGRESS, BLOCKED, DONE) oraz
│ │ │ │ wyzwalanie akcji edycji i podglądu.
│ │ │ │ FUNCTIONS: TaskList
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, constants.js,
│ │ │ │ translations.js
│ │ │ │ -->
│ │ │ ├── ⚛️ TaskModal.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskModal.jsx
│ │ │ │ PURPOSE: Modal dodawania i edycji zadania. Status wybierany
│ │ │ │ przez użytkownika – sekcja jest wyznaczana
│ │ │ │ automatycznie (status→section). Priorytety: A–E. Pola:
│ │ │ │ name, status, priority, desc, version, comment, pinned.
│ │ │ │ FUNCTIONS: TaskModal
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js
│ │ │ │ -->
│ │ │ ├── ⚛️ TaskPanel.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskPanel.jsx
│ │ │ │ PURPOSE: Główny komponent panelu zadań – zarządza zadaniami per
│ │ │ │ TaskGroup. Otwierany z kontekstu profilu WebView
│ │ │ │ (Sidebar). Obsługuje sekcje (active/backlog/done) i
│ │ │ │ statusy zadań (todo/in_progress/blocked/done/cancelled)
│ │ │ │ z automatycznym mapowaniem section↔status.
│ │ │ │ FUNCTIONS: TaskPanel
│ │ │ │ DEPENDS ON: react, useTasks.js, translations.js,
│ │ │ │ loggerRenderer.js, icons.js, ConfirmModal.jsx,
│ │ │ │ TaskModal.jsx, CommentModal.jsx, TaskSectionList.jsx
│ │ │ │ -->
│ │ │ ├── ⚛️ TaskSection.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskSection.jsx
│ │ │ │ PURPOSE: Pojedyncza sekcja zadań (aktywne, backlog, done)
│ │ │ │ FUNCTIONS: TaskSection
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js,
│ │ │ │ TaskItem
│ │ │ │ -->
│ │ │ └── ⚛️ TaskSectionList.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskSectionList.jsx
│ │ │ PURPOSE: Renderuje pogrupowaną listę sekcji zadań (Active,
│ │ │ Backlog, Done) w panelu bocznym.
│ │ │ FUNCTIONS: TaskSectionList
│ │ │ DEPENDS ON: react, translations.js, TaskSection.jsx
│ │ │ -->
│ │ ├── 📁 tasks/
│ │ │ ├── ⚛️ AggregatedProjectSection.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/tasks/AggregatedProjectSection.jsx
│ │ │ │ PURPOSE: Pojedyncza sekcja grupy zadań (TaskGroup) w widoku
│ │ │ │ zbiorczym. Wyświetla zadania per sekcja z pinem na
│ │ │ │ górze.
│ │ │ │ FUNCTIONS: AggregatedProjectSection
│ │ │ │ DEPENDS ON: react, translations.js, icons.js,
│ │ │ │ AggregatedTaskItem.jsx
│ │ │ │ -->
│ │ │ ├── ⚛️ AggregatedTaskItem.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/tasks/AggregatedTaskItem.jsx
│ │ │ │ PURPOSE: Pojedynczy element zadania w widoku zbiorczym.
│ │ │ │ Wyświetla status (ikona), priorytet (kolor), nazwę,
│ │ │ │ flagę pinned, komentarz, wersję.
│ │ │ │ FUNCTIONS: AggregatedTaskItem
│ │ │ │ DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│ │ │ │ -->
│ │ │ └── ⚛️ AggregatedTasks.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/tasks/AggregatedTasks.jsx
│ │ │ PURPOSE: Widok zbiorczy zadań ze wszystkich grup (TaskGroup).
│ │ │ Filtrowanie po statusie, priorytecie, sekcji.
│ │ │ Zwijanie/rozwijanie per grupa.
│ │ │ FUNCTIONS: AggregatedTasks
│ │ │ DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js,
│ │ │ AggregatedProjectSection.jsx
│ │ │ -->
│ │ ├── 📁 terminal/
│ │ │ └── ⚛️ Terminal.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/terminal/Terminal.jsx
│ │ │ PURPOSE: Terminal z xterm.js + node-pty (historia komend, ANSI
│ │ │ colors). Używa nowego multi-session API
│ │ │ (terminal:create/write/resize/kill z terminalId).
│ │ │ FUNCTIONS: Terminal
│ │ │ DEPENDS ON: react, xterm, xterm-addon-fit, xterm-addon-web-links,
│ │ │ translations.js, loggerRenderer, icons
│ │ │ -->
│ │ ├── 📁 tools/
│ │ │ ├── ⚛️ ClipboardHistory.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/tools/ClipboardHistory.jsx
│ │ │ │ PURPOSE: Historia schowka z pinowaniem i wyszukiwarką
│ │ │ │ FUNCTIONS: ClipboardHistory
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│ │ │ │ icons
│ │ │ │ -->
│ │ │ ├── ⚛️ CookieGrabber.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/tools/CookieGrabber.jsx
│ │ │ │ PURPOSE: Pobieranie cookies z aktywnego WebView – tabela,
│ │ │ │ kopiowanie, eksport
│ │ │ │ FUNCTIONS: CookieGrabber
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│ │ │ │ icons
│ │ │ │ -->
│ │ │ ├── ⚛️ FilePreviewer.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/tools/FilePreviewer.jsx
│ │ │ │ PURPOSE: Podgląd plików (RAW/PREVIEW) – TXT, JSON, HTML, SVG,
│ │ │ │ Markdown, obrazy
│ │ │ │ FUNCTIONS: FilePreviewer
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│ │ │ │ icons, markdownRenderer
│ │ │ │ -->
│ │ │ ├── ⚛️ ImageTools.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/tools/ImageTools.jsx
│ │ │ │ PURPOSE: Kompresja, resize i konwersja obrazów (drag & drop,
│ │ │ │ preview)
│ │ │ │ FUNCTIONS: ImageTools
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│ │ │ │ icons, imageUtils
│ │ │ │ -->
│ │ │ ├── ⚛️ JsonFormatter.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/tools/JsonFormatter.jsx
│ │ │ │ PURPOSE: Formatowanie i walidacja JSON/YAML/XML
│ │ │ │ FUNCTIONS: JsonFormatter
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer
│ │ │ │ -->
│ │ │ ├── ⚛️ MarkdownPreviewer.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/tools/MarkdownPreviewer.jsx
│ │ │ │ PURPOSE: Podgląd Markdown na żywo (split view)
│ │ │ │ FUNCTIONS: MarkdownPreviewer
│ │ │ │ DEPENDS ON: react, config.js, loggerRenderer.js, translations.js
│ │ │ │ -->
│ │ │ ├── ⚛️ MiniPostman.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/tools/MiniPostman.jsx
│ │ │ │ PURPOSE: Lekki API tester (GET/POST/PUT/DELETE, nagłówki, body,
│ │ │ │ odpowiedź)
│ │ │ │ FUNCTIONS: MiniPostman
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│ │ │ │ icons, apiClient
│ │ │ │ -->
│ │ │ ├── ⚛️ RegexTester.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/tools/RegexTester.jsx
│ │ │ │ PURPOSE: Testowanie wyrażeń regularnych
│ │ │ │ FUNCTIONS: RegexTester
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│ │ │ │ regexEngine
│ │ │ │ -->
│ │ │ ├── ⚛️ RemoveBgTool.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/tools/RemoveBgTool.jsx
│ │ │ │ PURPOSE: Narzędzie do masowego usuwania tła ze zdjęć przez API
│ │ │ │ remove.bg.
│ │ │ │ FUNCTIONS: RemoveBgTool
│ │ │ │ DEPENDS ON: react, axios, icons, translations.js, loggerRenderer,
│ │ │ │ config, notificationsManager.js
│ │ │ │ -->
│ │ │ ├── ⚛️ StringCombiner.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/tools/StringCombiner.jsx
│ │ │ │ PURPOSE: Generator kombinacji stringów. Podajesz tekst bazowy,
│ │ │ │ znak podziału
│ │ │ │ FUNCTIONS: StringCombiner
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, icons, translations.js
│ │ │ │ -->
│ │ │ ├── ⚛️ SvgToPngConverter.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/tools/SvgToPngConverter.jsx
│ │ │ │ PURPOSE: Konwersja SVG → PNG z wyborem rozdzielczości (drag &
│ │ │ │ drop, preview)
│ │ │ │ FUNCTIONS: SvgToPngConverter
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│ │ │ │ icons, svgToPng
│ │ │ │ -->
│ │ │ └── ⚛️ ToolsPanel.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/tools/ToolsPanel.jsx
│ │ │ PURPOSE: Główny panel narzędziowy aplikacji (Tools Panel) –
│ │ │ dostarcza interfejs oparty na zakładkach do obsługi
│ │ │ narzędzi pomocniczych (JSON Formatter, Regex Tester,
│ │ │ Clipboard History, Image Tools, Mini Postman, Cookie
│ │ │ Grabber itp.). Obsługuje dynamiczne ładowanie na
│ │ │ podstawie flag funkcji (feature flags). Komponenty
│ │ │ narzędzi ładowane leniwie (React.lazy) — kod pobierany
│ │ │ dopiero po pierwszym kliknięciu zakładki, co skraca
│ │ │ czas startu aplikacji.
│ │ │ FUNCTIONS: ToolsPanel
│ │ │ DEPENDS ON: react, config.js, translations.js, icons,
│ │ │ loggerRenderer, Spinner
│ │ │ -->
│ │ ├── 📁 views/
│ │ │ ├── ⚛️ ContentRenderer.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/views/ContentRenderer.jsx
│ │ │ │ PURPOSE: Router widoków — deleguje do WebViewContainer,
│ │ │ │ ToolsContainer lub SettingsContainer
│ │ │ │ FUNCTIONS: ContentRenderer
│ │ │ │ DEPENDS ON: react, icons.js, loggerRenderer.js, translations.js,
│ │ │ │ WebViewContainer.jsx, ToolsContainer.jsx,
│ │ │ │ SettingsContainer.jsx
│ │ │ │ -->
│ │ │ ├── ⚛️ SettingsContainer.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/views/SettingsContainer.jsx
│ │ │ │ PURPOSE: Kontener renderowania ustawień, pomocy, historii i
│ │ │ │ zadań zagregowanych
│ │ │ │ FUNCTIONS: SettingsContainer
│ │ │ │ DEPENDS ON: react, config.js, loggerRenderer.js, Spinner.jsx
│ │ │ │ -->
│ │ │ ├── ⚛️ Spinner.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/views/Spinner.jsx
│ │ │ │ PURPOSE: Współdzielony komponent wizualny wskaźnika ładowania
│ │ │ │ (loader). Wykorzystywany jako fallback dla React
│ │ │ │ Suspense oraz podczas asynchronicznych operacji I/O.
│ │ │ │ FUNCTIONS: Spinner
│ │ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── ⚛️ ToolsContainer.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/views/ToolsContainer.jsx
│ │ │ │ PURPOSE: Kontener renderowania narzędzi specjalnych (Notepad,
│ │ │ │ ProjectManager, RemoveBg, AppLibrary itp.)
│ │ │ │ FUNCTIONS: ToolsContainer
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, Spinner.jsx, config.js
│ │ │ │ -->
│ │ │ └── ⚛️ WebViewContainer.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/views/WebViewContainer.jsx
│ │ │ PURPOSE: Kontener renderowania WebView dla aktywnego profilu
│ │ │ FUNCTIONS: WebViewContainer
│ │ │ DEPENDS ON: react, Spinner.jsx, loggerRenderer.js
│ │ │ -->
│ │ ├── 📁 webview/
│ │ │ ├── ⚛️ WebViewTab.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/webview/WebViewTab.jsx
│ │ │ │ PURPOSE: Zakładka WebView – lifecycle, nawigacja, zoom,
│ │ │ │ recovery, logowanie błędów
│ │ │ │ FUNCTIONS: WebViewTab
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer.js,
│ │ │ │ WebViewToolbar.jsx, useWebViewEvents.js,
│ │ │ │ useWebViewActions.js
│ │ │ │ -->
│ │ │ └── ⚛️ WebViewToolbar.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/webview/WebViewToolbar.jsx
│ │ │ PURPOSE: Pasek narzędzi WebView – przyciski i akcje (Back,
│ │ │ Forward, Reload, Zoom, itp.)
│ │ │ FUNCTIONS: WebViewToolbar
│ │ │ DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│ │ │ -->
│ │ ├── index.css <!-- VERSION: 0.0.3 PATH: src/ui/index.css
│ │ │ PURPOSE: Główny plik stylów – importuje layout, theme,
│ │ │ components
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: -
│ │ │ -->
│ │ └── layout.css <!-- VERSION: 0.0.3 PATH: src/ui/layout.css
│ │ PURPOSE: Layout aplikacji – grid, sidebar, content, toolbar
│ │ FUNCTIONS: -
│ │ DEPENDS ON: -
│ │ -->
│ ├── 📁 utils/
│ │ ├── eventLogger.js <!-- VERSION: 0.0.3 PATH: src/utils/eventLogger.js
│ │ │ PURPOSE: Dziennik zdarzeń aplikacji — zapisuje akcje użytkownika
│ │ │ i systemu do userData/logs/events.log w formacie
│ │ │ NDJSON. Różny od logger.js (konsola debug) i
│ │ │ logWriter.js (błędy testów). Implementuje ARCH_REQ-044.
│ │ │ FUNCTIONS: logEvent
│ │ │ DEPENDS ON: loggerRenderer.js
│ │ │ -->
│ │ ├── fileUtils.js <!-- VERSION: 0.0.3 PATH: src/utils/fileUtils.js
│ │ │ PURPOSE: Uniwersalne i bezpieczne opakowanie natywnych funkcji
│ │ │ I/O Node.js dla plików JSON z automatyczną obsługą
│ │ │ błędów.
│ │ │ FUNCTIONS: readJsonSafe, writeJsonSafe, writeJsonStreaming,
│ │ │ readJsonStreaming
│ │ │ DEPENDS ON: fs, logger.js
│ │ │ -->
│ │ ├── icons.js <!-- VERSION: 0.0.3 PATH: src/utils/icons.js
│ │ │ PURPOSE: Re-export ikon z kanonicznej lokalizacji
│ │ │ src/data/icons.js
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: icons.js
│ │ │ -->
│ │ ├── imageUtils.js <!-- VERSION: 0.0.3 PATH: src/utils/imageUtils.js
│ │ │ PURPOSE: Funkcje pomocnicze do manipulacji plikami graficznymi
│ │ │ (resize, format conversion) oparte na silniku sharp.
│ │ │ FUNCTIONS: resizeImage, convertImage, compressJpeg
│ │ │ DEPENDS ON: sharp, logger.js
│ │ │ -->
│ │ ├── logWriter.js <!-- VERSION: 0.0.3 PATH: src/utils/logWriter.js
│ │ │ PURPOSE: Zarządzanie utrwalaniem logów błędów i wyników testów w
│ │ │ systemie plików (userData) poprzez mostek IPC.
│ │ │ FUNCTIONS: initLogWriter, appendTestFailLog, getLogsContent,
│ │ │ clearLogsFile
│ │ │ DEPENDS ON: loggerRenderer.js, config.js
│ │ │ -->
│ │ ├── logger.js ❗ <!-- VERSION: 0.0.3 PATH: src/utils/logger.js
│ │ │ PURPOSE: Główna logika logowania z filtrowaniem per-modułowym.
│ │ │ Obsługuje proces Main i Renderer.
│ │ │ FUNCTIONS: initLogger, setDebugMode, setDebugModule, isDebugMode,
│ │ │ log, warn, error, logDebug, logInfo, logWarn,
│ │ │ logError, getLogFilePath, logUI, logWebview,
│ │ │ logTerminal, logTasks, logTools, logSettings,
│ │ │ logEngine, logStore, logIPC
│ │ │ DEPENDS ON: config.js, electron
│ │ │ -->
│ │ ├── loggerRenderer.js <!-- VERSION: 0.0.3 PATH: src/utils/loggerRenderer.js
│ │ │ PURPOSE: Cienki wrapper re-eksportujący logger.js dla procesu
│ │ │ renderera (React). Eksportuje też LOG_CATEGORIES –
│ │ │ stałą z nazwami dostępnych kategorii, przydatną przy
│ │ │ dynamicznym filtrowaniu logów w
│ │ │ DebugModulesSection.jsx.
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: loggerRenderer, logger.js
│ │ │ -->
│ │ ├── networkUtils.js <!-- VERSION: 0.0.3 PATH: src/utils/networkUtils.js
│ │ │ PURPOSE: Funkcje pomocnicze do diagnostyki sieciowej i
│ │ │ sprawdzania dostępności zewnętrznych zasobów.
│ │ │ FUNCTIONS: pingUrl
│ │ │ DEPENDS ON: logger.js
│ │ │ -->
│ │ ├── notepadStorage.js ❗ <!-- VERSION: 0.0.3 PATH: src/utils/notepadStorage.js
│ │ │ PURPOSE: Pomocnicze funkcje zapisu i odczytu notatek oraz
│ │ │ fabryka zakładek
│ │ │ FUNCTIONS: createNewTab, loadnotepadFromStorage,
│ │ │ savenotepadToStorage
│ │ │ DEPENDS ON: logger.js
│ │ │ -->
│ │ ├── notificationsManager.js ❗ <!-- VERSION: 0.0.3 PATH: src/utils/notificationsManager.js
│ │ │ PURPOSE: Fasada globalnego systemu powiadomień — dispatchuje
│ │ │ toasty UI przez CustomEvent do ToastContainer oraz
│ │ │ wywołuje systemowe powiadomienia OS przez IPC. Nie
│ │ │ zarządza stanem React.
│ │ │ FUNCTIONS: showToast, showSystemNotification
│ │ │ DEPENDS ON: logger.js
│ │ │ -->
│ │ ├── persistence.js ❗ <!-- VERSION: 0.0.3 PATH: src/utils/persistence.js
│ │ │ PURPOSE: Wspólne operacje I/O dla plików JSON – odczyt, zapis i
│ │ │ zarządzanie ścieżkami w katalogu userData Electrona.
│ │ │ FUNCTIONS: getUserDataPath, readJsonFile, writeJsonFile
│ │ │ DEPENDS ON: fs, path, electron, logger.js
│ │ │ -->
│ │ ├── searchIndex.js <!-- VERSION: 0.0.3 PATH: src/utils/searchIndex.js
│ │ │ PURPOSE: Budowanie ujednoliconego indeksu wyszukiwania
│ │ │ (profiles, projects, tasks, notepad) dla globalnej palety
│ │ │ komend (Ctrl+K) i globalnego wyszukiwania w sidebarze.
│ │ │ FUNCTIONS: buildSearchIndex, searchAll
│ │ │ DEPENDS ON: logger.js
│ │ │ -->
│ │ ├── sharpLoader.js ❗ <!-- VERSION: 0.0.3 PATH: src/utils/sharpLoader.js
│ │ │ PURPOSE: Leniwe ładowanie modułu sharp (przetwarzanie obrazów) z
│ │ │ obsługą braku zależności. Używane przez
│ │ │ ipcMainHandlers_imageSharp.js w main process.
│ │ │ FUNCTIONS: loadSharp
│ │ │ DEPENDS ON: komponenty z folderu sharp/
│ │ │ -->
│ │ ├── testrunner.js <!-- VERSION: 0.0.3 PATH: src/utils/testrunner.js
│ │ │ PURPOSE: Silnik do uruchamiania testów jednostkowych i
│ │ │ integracyjnych – asercje, liczniki wyników i
│ │ │ raportowanie PASS/FAIL.
│ │ │ FUNCTIONS: initTestResults, assert, assertThrows, getTestResults,
│ │ │ logTestSummary
│ │ │ DEPENDS ON: logger.js, icons.js
│ │ │ -->
│ │ ├── translations.js <!-- VERSION: 0.0.3 PATH: src/utils/translations.js
│ │ │ PURPOSE: Logika ładowania tłumaczeń i helpData, provider
│ │ │ contextu (dynamicznie)
│ │ │ FUNCTIONS: TranslationProvider
│ │ │ DEPENDS ON: react, config.js, loggerRenderer.js
│ │ │ -->
│ │ ├── urlUtils.js <!-- VERSION: 0.0.3 PATH: src/utils/urlUtils.js
│ │ │ PURPOSE: Narzędzia do walidacji, normalizacji i sanityzacji
│ │ │ adresów URL dla modułu WebView.
│ │ │ FUNCTIONS: normalizeWebUrl, isValidWebUrl, isSafeUrl
│ │ │ DEPENDS ON: logger.js
│ │ │ -->
│ │ ├── validators.js <!-- VERSION: 0.0.3 PATH: src/utils/validators.js
│ │ │ PURPOSE: Walidatory typów danych wykorzystywane przy sprawdzaniu
│ │ │ poprawności payloadów IPC i stanów magazynów.
│ │ │ FUNCTIONS: ensureString, ensureObject, validateUrl,
│ │ │ validateEmail, validateLength, validateNoSpecialChars,
│ │ │ validatePassword, validatePhone
│ │ │ DEPENDS ON: logger.js
│ │ │ -->
│ │ └── yamlLoader.js ❗ <!-- VERSION: 0.0.3 PATH: src/utils/yamlLoader.js
│ │ PURPOSE: Leniwe ładowanie modułu js-yaml
│ │ (parsowanie/serializacja YAML) z obsługą braku
│ │ zależności. Używane przez ipcMainHandlers_jsonYaml.js w
│ │ main process.
│ │ FUNCTIONS: loadYaml
│ │ DEPENDS ON: komponenty z folderu yaml/
│ │ -->
│ ├── ⚛️ App.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/App.jsx
│ │ PURPOSE: Główny komponent root aplikacji React – inicjalizuje
│ │ system logowania, ładuje ustawienia użytkownika,
│ │ zarządza motywem graficznym (dark/light) oraz obsługuje
│ │ globalne skróty klawiszowe i stan sieci.
│ │ FUNCTIONS: App
│ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer.js,
│ │ urlUtils.js, MainLayout.jsx, Spinner.jsx,
│ │ SplashScreen.jsx, OnboardingScreen.jsx,
│ │ ToastContainer.jsx, notificationsManager.js
│ │ -->
│ ├── config.js ❗ <!-- VERSION: 0.0.3 PATH: src/config.js
│ │ PURPOSE: Centralna konfiguracja aplikacji - flagi funkcji,
│ │ limity i domyślne ustawienia.
│ │ FUNCTIONS: isFeatureEnabled, isToolEnabled, getDefaultSetting,
│ │ getLimit
│ │ DEPENDS ON: -
│ │ -->
│ ├── constants.js <!-- VERSION: 0.0.3 PATH: src/constants.js
│ │ PURPOSE: Application-wide constants and enums (tasks, app
│ │ categories, etc.)
│ │ FUNCTIONS: -
│ │ DEPENDS ON: -
│ │ -->
│ └── ⚛️ index.jsx <!-- VERSION: 0.0.3 PATH: src/index.jsx
│ PURPOSE: Punkt wejścia aplikacji React. Montuje <App /> w #root,
│ FUNCTIONS: -
│ DEPENDS ON: react, react-dom, useTranslation, App
│ -->
├── 📁 tests/
│ ├── TestRunner.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner.js
│ │ PURPOSE: Orchestrator testów – uruchamia wszystkie
│ │ TestRunner_*.js
│ │ FUNCTIONS: runAllTests
│ │ DEPENDS ON: logger.js, icons.js, logWriter.js, testsLoader.js
│ │ -->
│ ├── TestRunner_AdBlocker.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_AdBlocker.js
│ │ PURPOSE: Testy jednostkowe dla AdBlockera (globalny + per
│ │ profil, wykrywanie URL)
│ │ FUNCTIONS: runAdBlockerTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_Assets.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Assets.js
│ │ PURPOSE: Testy spójności plików w folderze assets/
│ │ FUNCTIONS: runAssetsTests
│ │ DEPENDS ON: fs, path, testUtils.js
│ │ -->
│ ├── TestRunner_BusinessLogic.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_BusinessLogic.js
│ │ PURPOSE: Testy czystych funkcji biznesowych (cartesian,
│ │ parseSplitChar, sortByPin, normalizeUrl)
│ │ FUNCTIONS: runBusinessLogicTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_CSS.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_CSS.js
│ │ PURPOSE: Testy spójności plików CSS (importy, kolejność,
│ │ istniejące pliki)
│ │ FUNCTIONS: runCssTests
│ │ DEPENDS ON: fs, path, testUtils.js
│ │ -->
│ ├── TestRunner_Categories.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Categories.js
│ │ PURPOSE: Testy hooka useCategories – CRUD kategorii, stan
│ │ zwinięcia, persistencja przez mock electronAPI.
│ │ FUNCTIONS: runCategoriesTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_Config.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Config.js
│ │ PURPOSE: Testy pliku konfiguracyjnego config.js
│ │ FUNCTIONS: runConfigTests
│ │ DEPENDS ON: fs, path, testUtils.js
│ │ -->
│ ├── TestRunner_Doc.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Doc.js
│ │ PURPOSE: Testy spójności dokumentacji w folderze doc/
│ │ FUNCTIONS: runDocTests
│ │ DEPENDS ON: fs, path, testUtils.js
│ │ -->
│ ├── TestRunner_ElectronAPI.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_ElectronAPI.js
│ │ PURPOSE: Testy dostępności i typu metod window.electronAPI
│ │ FUNCTIONS: runElectronAPITests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_EventLogger.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_EventLogger.js
│ │ PURPOSE: Testy jednostkowe modułu eventLogger — sanityzacja
│ │ params, guard eventLogEnabled, format wpisu.
│ │ (ARCH_REQ-044)
│ │ FUNCTIONS: runEventLoggerTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_History.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_History.js
│ │ PURPOSE: Testy integralności logów aktywności użytkownika.
│ │ Sprawdza walidację poziomów logowania, mechanizmy
│ │ filtrowania zdarzeń oraz poprawność przycinania
│ │ historii do zdefiniowanych limitów (FIFO).
│ │ FUNCTIONS: runHistoryTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_Hooks.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Hooks.js
│ │ PURPOSE: Testy hooków React useProfiles, useCategories,
│ │ useSidebarSearch – mock electronAPI, struktura
│ │ eksportów, obsługa błędów.
│ │ FUNCTIONS: runHooksTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_IPC.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_IPC.js
│ │ PURPOSE: Testy dostępności i typów dla nowych handlerów IPC
│ │ FUNCTIONS: runIPCTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_Icons.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Icons.js
│ │ PURPOSE: Testy integralności ikon (ICONS, SIDEBAR_ICON_MAP)
│ │ FUNCTIONS: runIconsTests
│ │ DEPENDS ON: testUtils.js, icons.js
│ │ -->
│ ├── TestRunner_Locales.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Locales.js
│ │ PURPOSE: Testy integralności plików locales (dynamicznie z
│ │ LANGUAGES z config.js)
│ │ FUNCTIONS: runLocalesTests
│ │ DEPENDS ON: testUtils.js, config.js
│ │ -->
│ ├── TestRunner_LogWriter.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_LogWriter.js
│ │ PURPOSE: Testy dla LogWritera (zapis, odczyt, czyszczenie, limit
│ │ linii)
│ │ FUNCTIONS: runLogWriterTests
│ │ DEPENDS ON: testUtils.js, logWriter.js
│ │ -->
│ ├── TestRunner_MainEngine.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_MainEngine.js
│ │ PURPOSE: Testy modułów wyciągniętych z main.js (webviewRegistry,
│ │ adBlocker, hotkeysManager)
│ │ FUNCTIONS: runMainEngineTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_Notepad.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Notepad.js
│ │ PURPOSE: Zestaw testów dla modułu notatnika. Weryfikuje
│ │ integralność danych kart, poprawność mechanizmu
│ │ autozapisu (dirty checking) oraz logikę przełączania
│ │ kontekstu między dokumentami.
│ │ FUNCTIONS: runNotepadTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_Notifications.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Notifications.js
│ │ PURPOSE: Testy jednostkowe globalnego systemu toastów —
│ │ kolejkowanie, typy, guard toastsEnabled. (UIUX_REQ-021)
│ │ FUNCTIONS: runNotificationsTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_Profiles.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Profiles.js
│ │ PURPOSE: Zestaw testów jednostkowych i integracyjnych dla
│ │ zarządzania profilami WebView. Weryfikuje strukturę
│ │ danych, poprawność kategorii oraz mechanizmy sortowania
│ │ chronologicznego.
│ │ FUNCTIONS: runProfilesTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_Projects.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Projects.js
│ │ PURPOSE: Zestaw testów dla modułu projektów. Weryfikuje
│ │ mechanizmy archiwizacji, strukturę obiektów
│ │ projektowych oraz poprawność agregacji liczby zadań
│ │ przypisanych do konkretnych projektów.
│ │ FUNCTIONS: runProjectsTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_Reexport.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Reexport.js
│ │ PURPOSE: Testy poprawności re-eksportów (config.js, icons.js)
│ │ FUNCTIONS: runReexportTests
│ │ DEPENDS ON: fs, path, testUtils.js
│ │ -->
│ ├── TestRunner_Settings.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Settings.js
│ │ PURPOSE: Zestaw testów dla silnika ustawień. Weryfikuje
│ │ bezpieczeństwo głębokiego łączenia (merge)
│ │ konfiguracji, stabilność przełączania motywów oraz
│ │ poprawność schematu danych przy imporcie/eksporcie.
│ │ FUNCTIONS: runSettingsTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_SleepTabs.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_SleepTabs.js
│ │ PURPOSE: Testy jednostkowe dla Sleep Tabs
│ │ FUNCTIONS: runSleepTabsTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_Store.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Store.js
│ │ PURPOSE: Testy struktury danych pobieranych z store (settings,
│ │ notepad, history)
│ │ FUNCTIONS: runStoreTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_Tasks.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Tasks.js
│ │ PURPOSE: Testy funkcjonalne systemu zarządzania zadaniami.
│ │ Sprawdza poprawność typów danych, wydajność filtrowania
│ │ priorytetów oraz sprawność wyszukiwarki pełnotekstowej
│ │ w obrębie zadań.
│ │ FUNCTIONS: runTasksTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_Terminal.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Terminal.js
│ │ PURPOSE: Testy jednostkowe dla Terminala (xterm, node-pty,
│ │ historia, ANSI, multi-session API)
│ │ FUNCTIONS: runTerminalTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_Tools.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Tools.js
│ │ PURPOSE: Testy jednostkowe dla narzędzi (JSON, Regex, Markdown,
│ │ Clipboard)
│ │ FUNCTIONS: runToolsTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_WebView.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_WebView.js
│ │ PURPOSE: Testy jednostkowe dla WebView (Single App, Screenshot,
│ │ Resource Monitor, Zoom)
│ │ FUNCTIONS: runWebViewTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ └── testUtils.js <!-- VERSION: 0.0.3 PATH: tests/testUtils.js
│ PURPOSE: Wspólne funkcje dla wszystkich testów (runner,
│ logowanie)
│ FUNCTIONS: runTests
│ DEPENDS ON: icons.js
│ -->
├── config.js <!-- VERSION: 0.0.3 PATH: config.js
│ PURPOSE: Re-eksport konfiguracji z src/config.js.
│ FUNCTIONS: -
│ DEPENDS ON: config.js
│ -->
├── main.js ❗ <!-- VERSION: 0.0.3 PATH: main.js
│ PURPOSE: Główna logika procesu głównego Electron – koordynacja,
│ okno, bezpieczeństwo
│ FUNCTIONS: createWindow, runStartupTestsIfEnabled,
│ checkDiskSpaceWarning
│ DEPENDS ON: electron, path, url, child_process, config.js,
│ settingsStore.js, logger.js, TestRunner.js,
│ adBlocker.js, hotkeysManager.js, ipcLoader.js
│ -->
├── package.json <!-- VERSION: - PATH: package.json
│ PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│ pomocniczej.
│ FUNCTIONS: -
│ DEPENDS ON: -
│ -->
├── preload.cjs ❗ <!-- VERSION: 0.0.3 PATH: preload.cjs
│ PURPOSE: Bridge IPC – eksponuje bezpieczne API dla renderera
│ (contextBridge). Definiuje metody komunikacji i
│ handlery zdarzeń z mechanizmem cleanup.
│ FUNCTIONS: -
│ DEPENDS ON: electron
│ -->
└── readme.md <!-- VERSION: 0.0.3 PATH: readme.md
 PURPOSE: Dokumentacja specyfikacji projektowej
 FUNCTIONS: Dokumentacja: 14 sekcji głównych
 DEPENDS ON: -
 -->
