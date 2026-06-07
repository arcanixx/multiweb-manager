<!-- =============================================================================
 FILE: Structure_light.md
 PATH: doc/Structure_light.md
 VERSION: 0.0.3
 PURPOSE: Dokumentacja specyfikacji projektowej - Uproszczona struktura projektu - same ścieżki i typy plików, bez metadanych.
          Do użycia przez AI bez dostępu do repo (oszczędność tokenów).
 FUNCTIONS: -
 DEPENDS ON: -
 UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
 ============================================================================= -->

root/
├── assets/
│ ├── app-icon.ico <!-- VERSION: - PATH: assets/app-icon.ico
│ │ PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│ │ pomocniczej.
│ │ FUNCTIONS: -
│ │ DEPENDS ON: -
│ │ -->
│ ├── app-icon.png <!-- VERSION: - PATH: assets/app-icon.png
│ │ PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│ │ pomocniczej.
│ │ FUNCTIONS: -
│ │ DEPENDS ON: -
│ │ -->
│ ├── multiweb_manager_architecture_graph.png <!-- VERSION: - PATH: assets/multiweb_manager_architecture_graph.png
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
├── doc/
│ ├── AI_Development_Standards.md <!-- VERSION: 0.0.3 PATH: doc/AI_Development_Standards.md
│ │ PURPOSE: Dokumentacja specyfikacji projektowej - Standardy
│ │ tworzenia i modyfikacji kodu dla AI – kompaktowy
│ │ przewodnik
│ │ FUNCTIONS: Dokumentacja: 13 sekcji głównych
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
│ │ FUNCTIONS: Dokumentacja: 23 sekcji głównych
│ │ DEPENDS ON: -
│ │ -->
│ ├── Global_Project_Starter_Guide.md <!-- VERSION: 0.0.3 PATH: doc/Global_Project_Starter_Guide.md
│ │ PURPOSE: Dokumentacja specyfikacji projektowej - Globalny
│ │ przewodnik inicjalizacji projektów (AI First)
│ │ FUNCTIONS: Dokumentacja: 15 sekcji głównych
│ │ DEPENDS ON: -
│ │ -->
│ ├── ModulesOverview.md <!-- VERSION: 0.0.3 PATH: doc/ModulesOverview.md
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
│ ├── Structure_light.md <!-- VERSION: 0.0.3 PATH: doc/Structure_light.md
│ │ PURPOSE: Dokumentacja specyfikacji projektowej - Uproszczona
│ │ struktura projektu - same ścieżki i typy plików, bez
│ │ metadanych. Do użycia przez AI bez dostępu do
│ │ repo (oszczędność tokenów).
│ │ FUNCTIONS: -
│ │ DEPENDS ON: -
│ │ -->
│ ├── TestCases_Suggestion.md ❗ <!-- VERSION: 0.0.3 PATH: doc/TestCases_Suggestion.md
│ │ PURPOSE: Sugestie testów dla niepokrytych plików – gotowe bloki
│ │ do wklejenia.
│ │ FUNCTIONS: -
│ │ DEPENDS ON: build_structure.py
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
├── public/
│ └── index.html <!-- VERSION: 0.0.3 PATH: public/index.html
│ PURPOSE: Główny plik html aplikacji dla WebView
│ FUNCTIONS: -
│ DEPENDS ON: -
│ -->
├── src/
│ ├── config/
│ │ ├── appConfig.js <!-- VERSION: 0.0.3 PATH: src/config/appConfig.js
│ │ │ PURPOSE: Podstawowe stałe aplikacji – środowisko, język, zoom
│ │ │ UI, limity UI i stałe profili.
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: -
│ │ │ -->
│ │ ├── endpointsConfig.js <!-- VERSION: 0.0.3 PATH: src/config/endpointsConfig.js
│ │ │ PURPOSE: Adresy zewnętrznych API używanych przez aplikację
│ │ │ (API_ENDPOINTS).
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: -
│ │ │ -->
│ │ ├── featuresConfig.js <!-- VERSION: 0.0.3 PATH: src/config/featuresConfig.js
│ │ │ PURPOSE: Feature flags – włączanie/wyłączanie modułów aplikacji
│ │ │ (FEATURES) oraz helpery isFeatureEnabled,
│ │ │ isToolEnabled.
│ │ │ FUNCTIONS: isFeatureEnabled, isToolEnabled
│ │ │ DEPENDS ON: -
│ │ │ -->
│ │ ├── limitsConfig.js <!-- VERSION: 0.0.3 PATH: src/config/limitsConfig.js
│ │ │ PURPOSE: Limity aplikacji – maksymalne liczby elementów w
│ │ │ kolekcjach (LIMITS) i helper getLimit.
│ │ │ FUNCTIONS: getLimit
│ │ │ DEPENDS ON: -
│ │ │ -->
│ │ ├── onboardingConfig.js <!-- VERSION: 0.0.3 PATH: src/config/onboardingConfig.js
│ │ │ PURPOSE: Stałe konfiguracyjne onboardingu – kroki wizarda i mapa
│ │ │ aplikacji szybkiego startu
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: -
│ │ │ -->
│ │ ├── pathsConfig.js <!-- VERSION: 0.0.3 PATH: src/config/pathsConfig.js
│ │ │ PURPOSE: Ścieżki katalogów i plików w userData (PATHS).
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: -
│ │ │ -->
│ │ ├── settingsConfig.js <!-- VERSION: 0.0.3 PATH: src/config/settingsConfig.js
│ │ │ PURPOSE: Domyślne ustawienia aplikacji (DEFAULT_SETTINGS),
│ │ │ per-modułowe flagi debugowania (DEBUG_MODULES) i helper
│ │ │ getDefaultSetting.
│ │ │ FUNCTIONS: getDefaultSetting
│ │ │ DEPENDS ON: appConfig.js
│ │ │ -->
│ │ ├── settingsRegistryConfig.js <!-- VERSION: - PATH: src/config/settingsRegistryConfig.js
│ │ │ PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│ │ │ pomocniczej.
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: -
│ │ │ -->
│ │ ├── toastConfig.js <!-- VERSION: - PATH: src/config/toastConfig.js
│ │ │ PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│ │ │ pomocniczej.
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: -
│ │ │ -->
│ │ └── toolsRegistryConfig.js <!-- VERSION: - PATH: src/config/toolsRegistryConfig.js
│ │ PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│ │ pomocniczej.
│ │ FUNCTIONS: -
│ │ DEPENDS ON: -
│ │ -->
│ ├── constants/
│ │ ├── constants.js <!-- VERSION: 0.0.3 PATH: src/constants/constants.js
│ │ │ PURPOSE: Application-wide constants and enums (tasks, app
│ │ │ categories, etc.)
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: -
│ │ │ -->
│ │ └── ipcChannels.js <!-- VERSION: 0.0.3 PATH: src/constants/ipcChannels.js
│ │ PURPOSE: Centralny rejestr nazw kanałów IPC – single source of
│ │ truth. Eliminuje string literals rozrzucone po
│ │ handlerach, hookach i preloadzie. Używać wszędzie
│ │ zamiast ręcznych stringów np. 'profiles:getAll'.
│ │ FUNCTIONS: -
│ │ DEPENDS ON: -
│ │ -->
│ ├── data/
│ │ ├── appLibrary/
│ │ │ ├── appLibrary.AI.json <!-- VERSION: - PATH: src/data/appLibrary/appLibrary.AI.json
│ │ │ │ PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│ │ │ │ pomocniczej.
│ │ │ │ FUNCTIONS: -
│ │ │ │ DEPENDS ON: -
│ │ │ │ -->
│ │ │ ├── appLibrary.CLOUD.json <!-- VERSION: - PATH: src/data/appLibrary/appLibrary.CLOUD.json
│ │ │ │ PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│ │ │ │ pomocniczej.
│ │ │ │ FUNCTIONS: -
│ │ │ │ DEPENDS ON: -
│ │ │ │ -->
│ │ │ ├── appLibrary.COMMUNICATION.json <!-- VERSION: - PATH: src/data/appLibrary/appLibrary.COMMUNICATION.json
│ │ │ │ PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│ │ │ │ pomocniczej.
│ │ │ │ FUNCTIONS: -
│ │ │ │ DEPENDS ON: -
│ │ │ │ -->
│ │ │ ├── appLibrary.DESIGN.json <!-- VERSION: - PATH: src/data/appLibrary/appLibrary.DESIGN.json
│ │ │ │ PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│ │ │ │ pomocniczej.
│ │ │ │ FUNCTIONS: -
│ │ │ │ DEPENDS ON: -
│ │ │ │ -->
│ │ │ ├── appLibrary.DEV.json <!-- VERSION: - PATH: src/data/appLibrary/appLibrary.DEV.json
│ │ │ │ PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│ │ │ │ pomocniczej.
│ │ │ │ FUNCTIONS: -
│ │ │ │ DEPENDS ON: -
│ │ │ │ -->
│ │ │ ├── appLibrary.ENTERTAINMENT.json <!-- VERSION: - PATH: src/data/appLibrary/appLibrary.ENTERTAINMENT.json
│ │ │ │ PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│ │ │ │ pomocniczej.
│ │ │ │ FUNCTIONS: -
│ │ │ │ DEPENDS ON: -
│ │ │ │ -->
│ │ │ ├── appLibrary.PRODUCTIVITY.json <!-- VERSION: - PATH: src/data/appLibrary/appLibrary.PRODUCTIVITY.json
│ │ │ │ PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│ │ │ │ pomocniczej.
│ │ │ │ FUNCTIONS: -
│ │ │ │ DEPENDS ON: -
│ │ │ │ -->
│ │ │ ├── appLibrary.SOCIAL.json <!-- VERSION: - PATH: src/data/appLibrary/appLibrary.SOCIAL.json
│ │ │ │ PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│ │ │ │ pomocniczej.
│ │ │ │ FUNCTIONS: -
│ │ │ │ DEPENDS ON: -
│ │ │ │ -->
│ │ │ └── index.js <!-- VERSION: 0.0.3 PATH: src/data/appLibrary/index.js
│ │ │ PURPOSE: Agregator biblioteki aplikacji – łączy kategorie JSON w
│ │ │ jeden obiekt.
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: icons.js, appLibrary.AI.json, appLibrary.DEV.json,
│ │ │ appLibrary.PRODUCTIVITY.json,
│ │ │ appLibrary.COMMUNICATION.json,
│ │ │ appLibrary.SOCIAL.json, appLibrary.DESIGN.json,
│ │ │ appLibrary.CLOUD.json, appLibrary.ENTERTAINMENT.json
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
│ ├── engine/
│ │ ├── adBlocker.js <!-- VERSION: 0.0.3 PATH: src/engine/adBlocker.js
│ │ │ PURPOSE: Implementacja blokowania reklam na poziomie sieciowym
│ │ │ (webRequest) – wspiera ustawienia globalne i
│ │ │ nadpisywanie per-profil.
│ │ │ FUNCTIONS: isAdUrl, setGlobalAdBlocker, getGlobalAdBlocker,
│ │ │ setProfileAdBlocker, getProfileAdBlocker,
│ │ │ initAdBlocker
│ │ │ DEPENDS ON: electron, config.js, logger.js, webviewRegistry.js
│ │ │ -->
│ │ ├── hotkeysManager.js <!-- VERSION: 0.0.3 PATH: src/engine/hotkeysManager.js
│ │ │ PURPOSE: Zarządzanie globalnymi skrótami klawiszowymi w procesie
│ │ │ głównym. Obsługuje rejestrację w OS i dispatch zdarzeń
│ │ │ IPC do renderera.
│ │ │ FUNCTIONS: setMainWindow, unregisterAllHotkeys,
│ │ │ registerGlobalHotkeys, getAllHotkeys, saveHotkeys,
│ │ │ registerHotkeysFromList
│ │ │ DEPENDS ON: electron, config.js, logger.js, electron-store
│ │ │ -->
│ │ ├── resourceMonitor.js <!-- VERSION: 0.0.3 PATH: src/engine/resourceMonitor.js
│ │ │ PURPOSE: Serwis monitorujący zużycie zasobów systemowych
│ │ │ (CPU/RAM) przez aplikację i system operacyjny.
│ │ │ FUNCTIONS: getSystemUsage
│ │ │ DEPENDS ON: os, config.js, logger.js
│ │ │ -->
│ │ ├── sleepTabsManager.js <!-- VERSION: 0.0.3 PATH: src/engine/sleepTabsManager.js
│ │ │ PURPOSE: Logika zarządzania stanem bezczynności WebView –
│ │ │ obliczanie timeoutów i weryfikacja gotowości do
│ │ │ uśpienia.
│ │ │ FUNCTIONS: getSleepTimeoutMs, shouldSleepTab, markTabActive,
│ │ │ getSleepPlaceholderState
│ │ │ DEPENDS ON: config.js, logger.js
│ │ │ -->
│ │ ├── updateService.js <!-- VERSION: 0.0.3 PATH: src/engine/updateService.js
│ │ │ PURPOSE: Placeholder sprawdzania aktualizacji (UpdateChecker UI
│ │ │ → docelowo API).
│ │ │ FUNCTIONS: checkForUpdates
│ │ │ DEPENDS ON: logger.js
│ │ │ -->
│ │ ├── webviewRegistry.js <!-- VERSION: 0.0.3 PATH: src/engine/webviewRegistry.js
│ │ │ PURPOSE: Rejestracja WebView (mapy tabId ↔ webContentsId)
│ │ │ FUNCTIONS: registerWebView, unregisterWebView, getWebViewEntry,
│ │ │ getAllWebContents
│ │ │ DEPENDS ON: logger.js, electron
│ │ │ -->
│ │ └── webviewScriptInjector.js <!-- VERSION: 0.0.3 PATH: src/engine/webviewScriptInjector.js
│ │ PURPOSE: Wstrzykiwanie CSS i skryptów użytkownika (user styles,
│ │ user scripts) do webview po załadowaniu strony.
│ │ Uruchamiany przez main process przy zdarzeniu
│ │ did-finish-load. Oddzielony od adBlocker.js – tamten
│ │ blokuje requesty na poziomie sieciowym, ten modyfikuje
│ │ DOM po załadowaniu.
│ │ FUNCTIONS: injectUserCSS, removeUserCSS, injectUserScript,
│ │ scheduleInjectionOnLoad, removeInjectionListeners
│ │ DEPENDS ON: config.js, logger.js
│ │ -->
│ ├── hooks/
│ │ ├── aggregated/
│ │ │ ├── useAggregated.js ❗ <!-- VERSION: 0.0.3 PATH: src/hooks/aggregated/useAggregated.js
│ │ │ │ PURPOSE: Hook logiki widoku zbiorczego zadań – ładowanie danych,
│ │ │ │ filtrowanie, grupowanie, zwijanie/ukrywanie grup
│ │ │ │ FUNCTIONS: useAggregatedTasks
│ │ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ │ -->
│ │ │ └── useAggregatedGroups.js <!-- VERSION: 0.0.3 PATH: src/hooks/aggregated/useAggregatedGroups.js
│ │ │ PURPOSE: Hook React do zarządzania grupami zadań (TaskGroup) –
│ │ │ CRUD + przypisanie profili przez IPC.
│ │ │ FUNCTIONS: useTaskGroups
│ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ -->
│ │ ├── notepad/
│ │ │ ├── useNotepadAutosave.js <!-- VERSION: 0.0.3 PATH: src/hooks/notepad/useNotepadAutosave.js
│ │ │ │ PURPOSE: Izolowana logika automatycznego zapisu dla notatnika.
│ │ │ │ FUNCTIONS: useNotepadAutosave
│ │ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── useNotepadContent.js <!-- VERSION: 0.0.3 PATH: src/hooks/notepad/useNotepadContent.js
│ │ │ │ PURPOSE: Hook React do zarządzania treścią notatnika – stan
│ │ │ │ edycji, zapis ręczny, zapis do pliku, skróty
│ │ │ │ klawiszowe.
│ │ │ │ FUNCTIONS: useNotepadContent
│ │ │ │ DEPENDS ON: react, notepadStorage.js, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── useNotepadFindReplace.js <!-- VERSION: 0.0.3 PATH: src/hooks/notepad/useNotepadFindReplace.js
│ │ │ │ PURPOSE: Hook React obsługujący logikę wyszukiwania i
│ │ │ │ zastępowania tekstu w edytorze notatnika.
│ │ │ │ FUNCTIONS: useNotepadFindReplace
│ │ │ │ DEPENDS ON: react, translations.js, loggerRenderer.js,
│ │ │ │ notificationsManager.js
│ │ │ │ -->
│ │ │ ├── useNotepadHandlers.js <!-- VERSION: 0.0.3 PATH: src/hooks/notepad/useNotepadHandlers.js
│ │ │ │ PURPOSE: Hook lokalnych handlerów UI Notepad – zarządza stanem i
│ │ │ │ callbackami dla word wrap, panelu find/replace oraz
│ │ │ │ potwierdzenia zamknięcia zakładki. Oddziela stan UI od
│ │ │ │ JSX orkiestratora Notepad.
│ │ │ │ FUNCTIONS: useNotepadHandlers
│ │ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── useNotepadModals.js <!-- VERSION: 0.0.3 PATH: src/hooks/notepad/useNotepadModals.js
│ │ │ │ PURPOSE: Zarządzanie stanem modali i powiadomień dla notatnika.
│ │ │ │ FUNCTIONS: useNotepadModals
│ │ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── useNotepadTabActions.js <!-- VERSION: 0.0.3 PATH: src/hooks/notepad/useNotepadTabActions.js
│ │ │ │ PURPOSE: Wrappery dla akcji na zakładkach z logiką walidacji i
│ │ │ │ UI.
│ │ │ │ FUNCTIONS: useNotepadTabActions
│ │ │ │ DEPENDS ON: react, translations.js, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── useNotepadTabs.js <!-- VERSION: 0.0.3 PATH: src/hooks/notepad/useNotepadTabs.js
│ │ │ │ PURPOSE: Hook React do zarządzania zakładkami notatnika –
│ │ │ │ tworzenie, przełączanie, zamykanie, zmiana nazw.
│ │ │ │ FUNCTIONS: useNotepadTabs
│ │ │ │ DEPENDS ON: react, notepadStorage.js, loggerRenderer.js
│ │ │ │ -->
│ │ │ └── useNotepadUI.js <!-- VERSION: 0.0.3 PATH: src/hooks/notepad/useNotepadUI.js
│ │ │ PURPOSE: Orkiestrator hooków notatnika – koordynuje zakładki,
│ │ │ treść, modale i akcje użytkownika.
│ │ │ FUNCTIONS: useNotepadUI
│ │ │ DEPENDS ON: react, translations.js, useNotepadTabs.js,
│ │ │ useNotepadContent.js, useNotepadAutosave.js,
│ │ │ useNotepadModals.js, useNotepadTabActions.js,
│ │ │ loggerRenderer.js, notificationsManager.js
│ │ │ -->
│ │ ├── settings/
│ │ │ ├── useHotkeysManager.js ❗ <!-- VERSION: 0.0.3 PATH: src/hooks/settings/useHotkeysManager.js
│ │ │ │ PURPOSE: Hook logiki HotkeysManager – ładowanie, CRUD skrótów,
│ │ │ │ walidacja, zapis IPC
│ │ │ │ FUNCTIONS: useHotkeysManager
│ │ │ │ DEPENDS ON: react, translations.js, loggerRenderer.js,
│ │ │ │ notificationsManager.js
│ │ │ │ -->
│ │ │ ├── useLogsSection.js ❗ <!-- VERSION: 0.0.3 PATH: src/hooks/settings/useLogsSection.js
│ │ │ │ PURPOSE: Hook logiki sekcji logów – ładowanie ustawień, handlery
│ │ │ │ logów testów i dziennika zdarzeń
│ │ │ │ FUNCTIONS: useLogsSection
│ │ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── useNotificationsSection.js ❗ <!-- VERSION: 0.0.3 PATH: src/hooks/settings/useNotificationsSection.js
│ │ │ │ PURPOSE: Hook logiki sekcji powiadomień – ładowanie ustawień,
│ │ │ │ handlery toastów, systemu OS i Pushbullet
│ │ │ │ FUNCTIONS: useNotificationsSection
│ │ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ │ -->
│ │ │ └── useSettings.js <!-- VERSION: 0.0.3 PATH: src/hooks/settings/useSettings.js
│ │ │ PURPOSE: Hook React do zarządzania ustawieniami użytkownika –
│ │ │ ładowanie przez StorageService (cache + IPC), zapis z
│ │ │ notyfikacją subskrybentów.
│ │ │ FUNCTIONS: useSettings
│ │ │ DEPENDS ON: react, loggerRenderer.js, StorageService.js
│ │ │ -->
│ │ ├── sidebar/
│ │ │ ├── useSidebarHandlers.js <!-- VERSION: 0.0.3 PATH: src/hooks/sidebar/useSidebarHandlers.js
│ │ │ │ PURPOSE: Hook orkiestrator logiki handlerów Sidebaru – zarządza
│ │ │ │ stanem modali (profil, kategoria, potwierdzenie
│ │ │ │ usunięcia) oraz obsługuje akcje CRUD profili, kategorii
│ │ │ │ i wyników globalnego wyszukiwania.
│ │ │ │ FUNCTIONS: useSidebarHandlers
│ │ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ │ -->
│ │ │ └── useSidebarSearch.js <!-- VERSION: 0.0.3 PATH: src/hooks/sidebar/useSidebarSearch.js
│ │ │ PURPOSE: Hook React do wyszukiwania i filtrowania profilów w
│ │ │ sidebarze – tryb lokalny (profile/kategorie) i globalny
│ │ │ (notepad, tasks, projects, profiles przez IPC).
│ │ │ FUNCTIONS: useSidebarSearch
│ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ -->
│ │ ├── taskpanel/
│ │ │ ├── useTaskPanel.js <!-- VERSION: 0.0.3 PATH: src/hooks/taskpanel/useTaskPanel.js
│ │ │ │ PURPOSE: Hook React do zarządzania zadaniami użytkownika per
│ │ │ │ taskGroupId – CRUD przez IPC z optimistic update i
│ │ │ │ rollbackiem.
│ │ │ │ FUNCTIONS: useTasks
│ │ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ │ -->
│ │ │ └── useTaskPanelHandlers.js <!-- VERSION: 0.0.3 PATH: src/hooks/taskpanel/useTaskPanelHandlers.js
│ │ │ PURPOSE: Hook logiki TaskPanel – CRUD zadań, zmiany
│ │ │ sekcji/statusu, stan modali (TaskModal, ConfirmModal,
│ │ │ CommentModal). Oddziela handlery od JSX orkiestratora
│ │ │ TaskPanel.
│ │ │ FUNCTIONS: useTaskPanelHandlers
│ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ -->
│ │ ├── useAppInitialization.js <!-- VERSION: 0.0.3 PATH: src/hooks/useAppInitialization.js
│ │ │ PURPOSE: Logika startowa aplikacji (logger, settings, profile,
│ │ │ hotkeys, theme).
│ │ │ FUNCTIONS: useAppInitialization
│ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer.js,
│ │ │ urlUtils.js, notificationsManager.js
│ │ │ -->
│ │ ├── useAppLibrary.js <!-- VERSION: 0.0.3 PATH: src/hooks/useAppLibrary.js
│ │ │ PURPOSE: Hook React do pobierania i wyszukiwania w bibliotece
│ │ │ aplikacji (App Library) przez IPC.
│ │ │ FUNCTIONS: useAppLibrary
│ │ │ DEPENDS ON: react, loggerRenderer.js, translations.js
│ │ │ -->
│ │ ├── useAsync.js <!-- VERSION: 0.0.3 PATH: src/hooks/useAsync.js
│ │ │ PURPOSE: Generyczny hook do obsługi operacji asynchronicznych
│ │ │ (ładowanie danych). Eliminuje duplikację wzorca load()
│ │ │ w hookach danych.
│ │ │ FUNCTIONS: useAsync
│ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ -->
│ │ ├── useAsyncMutation.js <!-- VERSION: 0.0.3 PATH: src/hooks/useAsyncMutation.js
│ │ │ PURPOSE: Hook do operacji mutacji z optimistic updates i
│ │ │ rollbackiem.
│ │ │ FUNCTIONS: useAsyncMutation
│ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ -->
│ │ ├── useCategories.js <!-- VERSION: 0.0.3 PATH: src/hooks/useCategories.js
│ │ │ PURPOSE: Hook React do zarządzania kategoriami profilów – CRUD,
│ │ │ stan zwinięcia, persistencja przez IPC.
│ │ │ FUNCTIONS: useCategories
│ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ -->
│ │ ├── useHistoryLog.js <!-- VERSION: 0.0.3 PATH: src/hooks/useHistoryLog.js
│ │ │ PURPOSE: Hook React do zarządzania i odświeżania logów historii
│ │ │ aktywności użytkownika. Komunikuje się z historyStore
│ │ │ przez mostek IPC.
│ │ │ FUNCTIONS: useHistoryLog
│ │ │ DEPENDS ON: react, loggerRenderer.js, useAsync.js
│ │ │ -->
│ │ ├── useMainLayout.js <!-- VERSION: 0.0.3 PATH: src/hooks/useMainLayout.js
│ │ │ PURPOSE: Hook zarządzający stanem globalnym layoutu aplikacji –
│ │ │ TaskPanel, modal potwierdzenia oraz klasa CSS body w
│ │ │ zależności od aktywnego widoku.
│ │ │ FUNCTIONS: useMainLayout
│ │ │ DEPENDS ON: react, translations.js, loggerRenderer.js
│ │ │ -->
│ │ ├── useProfiles.js <!-- VERSION: 0.0.3 PATH: src/hooks/useProfiles.js
│ │ │ PURPOSE: Hook React do zarządzania profilami WebView – CRUD,
│ │ │ favorite, persistencja przez StorageService (cache +
│ │ │ IPC). Optimistic updates z rollbackiem.
│ │ │ FUNCTIONS: useProfiles
│ │ │ DEPENDS ON: react, loggerRenderer.js, StorageService.js,
│ │ │ useAsync.js
│ │ │ -->
│ │ ├── useProjects.js <!-- VERSION: 0.0.3 PATH: src/hooks/useProjects.js
│ │ │ PURPOSE: Hook React do zarządzania projektami użytkownika – CRUD
│ │ │ przez mostek IPC z optimistic updates i rollbackiem.
│ │ │ FUNCTIONS: useProjects
│ │ │ DEPENDS ON: react, loggerRenderer.js, useAsync.js
│ │ │ -->
│ │ ├── useToastQueue.js <!-- VERSION: - PATH: src/hooks/useToastQueue.js
│ │ │ PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│ │ │ pomocniczej.
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: -
│ │ │ -->
│ │ ├── useTranslation.js <!-- VERSION: 0.0.3 PATH: src/hooks/useTranslation.js
│ │ │ PURPOSE: Hook React zapewniający dostęp do kontekstu tłumaczeń i
│ │ │ danych pomocy.
│ │ │ FUNCTIONS: useTranslation
│ │ │ DEPENDS ON: react, translations.js, loggerRenderer.js
│ │ │ -->
│ │ ├── useWebViewActions.js <!-- VERSION: 0.0.3 PATH: src/hooks/useWebViewActions.js
│ │ │ PURPOSE: Hook akcji WebView – nawigacja, zoom, narzędzia
│ │ │ (screenshot, single app, resource monitor)
│ │ │ FUNCTIONS: useWebViewActions
│ │ │ DEPENDS ON: react, config.js, loggerRenderer.js
│ │ │ -->
│ │ ├── useWebViewEvents.js <!-- VERSION: 0.0.3 PATH: src/hooks/useWebViewEvents.js
│ │ │ PURPOSE: Hook zarządzający listenerami zdarzeń WebView (load,
│ │ │ navigate, title, console)
│ │ │ FUNCTIONS: useWebViewEvents
│ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ -->
│ │ └── useWorkspaces.js <!-- VERSION: 0.0.3 PATH: src/hooks/useWorkspaces.js
│ │ PURPOSE: Hook React do zarządzania przestrzeniami roboczymi
│ │ (workspaces) użytkownika przez mostek IPC.
│ │ FUNCTIONS: useWorkspaces
│ │ DEPENDS ON: react, loggerRenderer.js, translations.js
│ │ -->
│ ├── ipc/
│ │ ├── ipcMainHandlers_adBlocker.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_adBlocker.js
│ │ │ PURPOSE: IPC handlery do zarządzania blokerem reklam – globalnie
│ │ │ i per profil
│ │ │ FUNCTIONS: const:IPC_CHANNELS.ADBLOCKER.SET_GLOBAL,
│ │ │ const:IPC_CHANNELS.ADBLOCKER.GET_GLOBAL,
│ │ │ const:IPC_CHANNELS.ADBLOCKER.SET_FOR_PROFILE,
│ │ │ const:IPC_CHANNELS.ADBLOCKER.GET_FOR_PROFILE
│ │ │ DEPENDS ON: electron, adBlocker.js, logger.js, ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_aggregatedTasks.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_aggregatedTasks.js
│ │ │ PURPOSE: IPC handlers dla widoku zbiorczego zadań
│ │ │ (AggregatedTasks). Łączy zadania z grupami (TaskGroup)
│ │ │ i profilami.
│ │ │ FUNCTIONS: const:IPC_CHANNELS.AGGREGATED_TASKS.GET_ALL,
│ │ │ const:IPC_CHANNELS.AGGREGATED_TASKS.FILTER,
│ │ │ const:IPC_CHANNELS.AGGREGATED_TASKS.SORT
│ │ │ DEPENDS ON: electron, ipcChannels.js, taskPanelStore.js,
│ │ │ aggregatedStore.js, logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_app.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_app.js
│ │ │ PURPOSE: IPC handlery cyklu życia aplikacji – potwierdzenie
│ │ │ zamknięcia.
│ │ │ FUNCTIONS: const:IPC_CHANNELS.APP.CONFIRM_QUIT
│ │ │ DEPENDS ON: electron, logger.js, ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_appInfo.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_appInfo.js
│ │ │ PURPOSE: IPC handlery informacji o aplikacji – wersja,
│ │ │ sprawdzanie aktualizacji, info diagnostyczne.
│ │ │ FUNCTIONS: const:IPC_CHANNELS.APP_INFO.GET_INFO,
│ │ │ const:IPC_CHANNELS.APP.GET_VERSION,
│ │ │ const:IPC_CHANNELS.APP.CHECK_UPDATES
│ │ │ DEPENDS ON: electron, logger.js, ipcChannels.js,
│ │ │ updateService.js
│ │ │ -->
│ │ ├── ipcMainHandlers_appLibrary.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_appLibrary.js
│ │ │ PURPOSE: IPC dla biblioteki aplikacji (App Library) – pobieranie
│ │ │ kategorii, wyszukiwanie, filtrowanie po kategorii.
│ │ │ FUNCTIONS: const:IPC_CHANNELS.APP_LIBRARY.GET_ALL,
│ │ │ const:IPC_CHANNELS.APP_LIBRARY.SEARCH,
│ │ │ const:IPC_CHANNELS.APP_LIBRARY.GET_BY_CATEGORY
│ │ │ DEPENDS ON: electron, appLibraryStore.js, logger.js,
│ │ │ ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_cookies.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_cookies.js
│ │ │ PURPOSE: IPC handler do pobierania cookies (Cookie Grabber)
│ │ │ FUNCTIONS: const:IPC_CHANNELS.COOKIES.GET_ALL
│ │ │ DEPENDS ON: electron, logger.js, ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_dialogs.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_dialogs.js
│ │ │ PURPOSE: IPC handlers dla natywnych okien dialogowych
│ │ │ (open/save)
│ │ │ FUNCTIONS: const:IPC_CHANNELS.DIALOGS.OPEN_FILE,
│ │ │ const:IPC_CHANNELS.DIALOGS.SAVE_FILE
│ │ │ DEPENDS ON: electron, logger.js, ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_events.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_events.js
│ │ │ PURPOSE: Handlery IPC dla dziennika zdarzeń aplikacji
│ │ │ (EventLogger). Obsługuje zapis, odczyt i czyszczenie
│ │ │ zdarzeń.
│ │ │ FUNCTIONS: registerEventLogsHandlers,
│ │ │ const:IPC_CHANNELS.EVENTS.APPEND,
│ │ │ const:IPC_CHANNELS.EVENTS.GET_FILE,
│ │ │ const:IPC_CHANNELS.EVENTS.CLEAR
│ │ │ DEPENDS ON: electron, fs, path, logger.js,
│ │ │ ipcMainHandlers_logs.js, ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_fileApi.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_fileApi.js
│ │ │ PURPOSE: IPC handlers dla File Previewer, Mini Postman i
│ │ │ Clipboard
│ │ │ FUNCTIONS: const:IPC_CHANNELS.TOOLS.FILE_PREVIEW,
│ │ │ const:IPC_CHANNELS.TOOLS.API_REQUEST,
│ │ │ const:IPC_CHANNELS.TOOLS.CLIPBOARD_GET
│ │ │ DEPENDS ON: electron, fs, path, logger.js, ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_fileSystem.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_fileSystem.js
│ │ │ PURPOSE: IPC handlers do odczytu i zapisu plików (przez main
│ │ │ process)
│ │ │ FUNCTIONS: const:IPC_CHANNELS.FS.READ_FILE,
│ │ │ const:IPC_CHANNELS.FS.WRITE_FILE
│ │ │ DEPENDS ON: electron, fs, logger.js, ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_files.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_files.js
│ │ │ PURPOSE: IPC handlery zapisu plików – tekst i dane binarne przez
│ │ │ dialog systemowy.
│ │ │ FUNCTIONS: const:IPC_CHANNELS.FILES.SAVE_TEXT,
│ │ │ const:IPC_CHANNELS.FILES.SAVE_BINARY
│ │ │ DEPENDS ON: electron, fs, path, logger.js, ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_history.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_history.js
│ │ │ PURPOSE: IPC dla historii odwiedzin/akcji. history:getAll –
│ │ │ zwraca pełną historię (max 5000 wpisów) history:add 
│ │ │ – dodaje nowy wpis i zapisuje history:clear –
│ │ │ czyści historię history:getRecent – zwraca ostatnie 100
│ │ │ wpisów
│ │ │ FUNCTIONS: const:IPC_CHANNELS.HISTORY.GET_ALL,
│ │ │ const:IPC_CHANNELS.HISTORY.ADD,
│ │ │ const:IPC_CHANNELS.HISTORY.CLEAR,
│ │ │ const:IPC_CHANNELS.HISTORY.GET_RECENT
│ │ │ DEPENDS ON: electron, historyStore.js, logger.js, ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_hotkeys.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_hotkeys.js
│ │ │ PURPOSE: IPC handlery do zarządzania skrótami klawiszowymi –
│ │ │ pobieranie, zapis, rejestracja
│ │ │ FUNCTIONS: const:IPC_CHANNELS.HOTKEYS.GET_ALL,
│ │ │ const:IPC_CHANNELS.HOTKEYS.SAVE,
│ │ │ const:IPC_CHANNELS.HOTKEYS.REGISTER
│ │ │ DEPENDS ON: electron, hotkeysManager.js, logger.js,
│ │ │ ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_imageSharp.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_imageSharp.js
│ │ │ PURPOSE: IPC handlery dla operacji na obrazach (resize, convert,
│ │ │ compress)
│ │ │ FUNCTIONS: const:IPC_CHANNELS.TOOLS.IMAGE_RESIZE,
│ │ │ const:IPC_CHANNELS.TOOLS.IMAGE_CONVERT,
│ │ │ const:IPC_CHANNELS.TOOLS.IMAGE_COMPRESS
│ │ │ DEPENDS ON: electron, logger.js, sharpLoader.js, ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_jsonYaml.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_jsonYaml.js
│ │ │ PURPOSE: IPC handlery dla JSON i YAML (formatowanie, konwersja)
│ │ │ FUNCTIONS: const:IPC_CHANNELS.TOOLS.FORMAT_JSON,
│ │ │ const:IPC_CHANNELS.TOOLS.YAML_TO_JSON,
│ │ │ const:IPC_CHANNELS.TOOLS.JSON_TO_YAML
│ │ │ DEPENDS ON: electron, logger.js, yamlLoader.js, ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_logs.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_logs.js
│ │ │ PURPOSE: Handlery IPC dla logów testów (LogWriter). Obsługuje
│ │ │ zapis, odczyt i czyszczenie logów testów.
│ │ │ FUNCTIONS: rotateLogs, registerLogsHandlers,
│ │ │ const:IPC_CHANNELS.LOGS.APPEND,
│ │ │ const:IPC_CHANNELS.LOGS.GET,
│ │ │ const:IPC_CHANNELS.LOGS.CLEAR
│ │ │ DEPENDS ON: electron, fs, path, logger.js, ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_notepad.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_notepad.js
│ │ │ PURPOSE: IPC dla notatek (Notepad, hooks useNotepad).
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: electron, notepadStore.js, logger.js, ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_notifications.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_notifications.js
│ │ │ PURPOSE: Handler IPC dla natywnych powiadomień systemowych OS
│ │ │ (Windows/macOS). Przeniesione do procesu głównego —
│ │ │ działa nawet gdy okno jest zminimalizowane lub ukryte w
│ │ │ tray. Implementuje UIUX_REQ-022.
│ │ │ FUNCTIONS: const:IPC_CHANNELS.NOTIFICATIONS.SHOW_SYSTEM
│ │ │ DEPENDS ON: electron, path, logger.js, ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_openExternal.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_openExternal.js
│ │ │ PURPOSE: IPC handler do otwierania URL w domyślnej przeglądarce
│ │ │ systemowej
│ │ │ FUNCTIONS: const:IPC_CHANNELS.SHELL.OPEN_EXTERNAL
│ │ │ DEPENDS ON: electron, logger.js, ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_pathUtils.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_pathUtils.js
│ │ │ PURPOSE: IPC helpers dla operacji na ścieżkach (path.join,
│ │ │ path.dirname)
│ │ │ FUNCTIONS: const:IPC_CHANNELS.PATH.JOIN,
│ │ │ const:IPC_CHANNELS.PATH.DIRNAME
│ │ │ DEPENDS ON: electron, path, logger.js, ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_profiles.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_profiles.js
│ │ │ PURPOSE: IPC dla profili (Sidebar / Profile Manager / App
│ │ │ Library) pobieranie profili zapisywanie profili edycja
│ │ │ profili usuwanie profili ostatnio używane walidacja
│ │ │ danych
│ │ │ FUNCTIONS: const:IPC_CHANNELS.PROFILES.GET_ALL,
│ │ │ const:IPC_CHANNELS.PROFILES.CREATE,
│ │ │ const:IPC_CHANNELS.PROFILES.UPDATE,
│ │ │ const:IPC_CHANNELS.PROFILES.DELETE,
│ │ │ const:IPC_CHANNELS.PROFILES.TOUCH
│ │ │ DEPENDS ON: electron, profilesStore.js, logger.js,
│ │ │ ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_projects.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_projects.js
│ │ │ PURPOSE: IPC handlers dla Project Manager – CRUD projektów z
│ │ │ walidacją i integracją z tasksStore. projects:getAll 
│ │ │ – pobiera wszystkie projekty projects:getWithTasks –
│ │ │ pobiera projekt wraz z jego zadaniami projects:create 
│ │ │ – tworzy nowy projekt projects:update –
│ │ │ aktualizuje projekt (patch) projects:archive –
│ │ │ archiwizuje projekt projects:delete – usuwa
│ │ │ projekt
│ │ │ FUNCTIONS: const:IPC_CHANNELS.PROJECTS.GET_ALL,
│ │ │ const:IPC_CHANNELS.PROJECTS.GET_WITH_TASKS,
│ │ │ const:IPC_CHANNELS.PROJECTS.CREATE,
│ │ │ const:IPC_CHANNELS.PROJECTS.UPDATE,
│ │ │ const:IPC_CHANNELS.PROJECTS.ARCHIVE,
│ │ │ const:IPC_CHANNELS.PROJECTS.DELETE
│ │ │ DEPENDS ON: electron, projectsStore.js, taskPanelStore.js,
│ │ │ logger.js, ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_regexMarkdown.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_regexMarkdown.js
│ │ │ PURPOSE: IPC handlers dla Regex Tester i Markdown Previewer
│ │ │ FUNCTIONS: const:IPC_CHANNELS.TOOLS.REGEX_TEST,
│ │ │ const:IPC_CHANNELS.TOOLS.MARKDOWN_RENDER
│ │ │ DEPENDS ON: electron, logger.js, ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_search.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_search.js
│ │ │ PURPOSE: IPC handler globalnego wyszukiwania (Ctrl+K / sidebar
│ │ │ global search). search:global – buduje indeks ze
│ │ │ store'ów i przeszukuje go wg query.
│ │ │ FUNCTIONS: const:IPC_CHANNELS.SEARCH.GLOBAL
│ │ │ DEPENDS ON: electron, searchIndex.js, notepadStore.js,
│ │ │ taskPanelStore.js, projectsStore.js, logger.js,
│ │ │ ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_settings.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_settings.js
│ │ │ PURPOSE: IPC handlers dla Settings. settings:get –
│ │ │ pobiera aktualne ustawienia settings:update –
│ │ │ aktualizuje (merge patch, nie nadpisuje) settings:reset
│ │ │ – reset do DEFAULT_SETTINGS settings:export –
│ │ │ eksport do pliku JSON settings:import – import z
│ │ │ pliku JSON (merge) settings:getDefaults – zwraca
│ │ │ DEFAULT_SETTINGS z config.js
│ │ │ FUNCTIONS: const:IPC_CHANNELS.SETTINGS.GET,
│ │ │ const:IPC_CHANNELS.SETTINGS.UPDATE,
│ │ │ const:IPC_CHANNELS.SETTINGS.RESET,
│ │ │ const:IPC_CHANNELS.SETTINGS.EXPORT,
│ │ │ const:IPC_CHANNELS.SETTINGS.IMPORT,
│ │ │ const:IPC_CHANNELS.SETTINGS.GET_DEFAULTS
│ │ │ DEPENDS ON: electron, fs, logger.js, settingsStore.js, config.js,
│ │ │ ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_svgToPng.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_svgToPng.js
│ │ │ PURPOSE: IPC handler konwersji SVG → PNG przez sharp
│ │ │ FUNCTIONS: const:IPC_CHANNELS.TOOLS.SVG_TO_PNG
│ │ │ DEPENDS ON: electron, fs, logger.js, sharpLoader.js,
│ │ │ ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_taskGroups.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_taskGroups.js
│ │ │ PURPOSE: IPC handlers dla grup zadań (TaskGroup) — CRUD +
│ │ │ przypisanie profili. Mapuje profile WebView na wspólne
│ │ │ panele zadań.
│ │ │ FUNCTIONS: const:IPC_CHANNELS.TASK_GROUPS.GET_ALL,
│ │ │ const:IPC_CHANNELS.TASK_GROUPS.CREATE,
│ │ │ const:IPC_CHANNELS.TASK_GROUPS.UPDATE,
│ │ │ const:IPC_CHANNELS.TASK_GROUPS.DELETE,
│ │ │ const:IPC_CHANNELS.TASK_GROUPS.GET_FOR_PROFILE,
│ │ │ const:IPC_CHANNELS.TASK_GROUPS.ENSURE_FOR_PROFILE,
│ │ │ const:IPC_CHANNELS.TASK_GROUPS.ASSIGN_PROFILE,
│ │ │ const:IPC_CHANNELS.TASK_GROUPS.UNASSIGN_PROFILE
│ │ │ DEPENDS ON: electron, ipcChannels.js, aggregatedStore.js,
│ │ │ logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_tasks.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_tasks.js
│ │ │ PURPOSE: IPC handlers dla zadań (TaskPanel) – CRUD z walidacją
│ │ │ section↔status i mapowaniem na taskGroupId.
│ │ │ FUNCTIONS: const:IPC_CHANNELS.TASKS.GET_ALL,
│ │ │ const:IPC_CHANNELS.TASKS.GET_ALL_GROUPED,
│ │ │ const:IPC_CHANNELS.TASKS.ADD,
│ │ │ const:IPC_CHANNELS.TASKS.UPDATE,
│ │ │ const:IPC_CHANNELS.TASKS.DELETE,
│ │ │ const:IPC_CHANNELS.TASKS.SAVE_SECTIONS
│ │ │ DEPENDS ON: electron, ipcChannels.js, taskPanelStore.js,
│ │ │ logger.js
│ │ │ -->
│ │ ├── ipcMainHandlers_terminal.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_terminal.js
│ │ │ PURPOSE: IPC dla Terminala (node-pty + xterm.js) tworzenie sesji
│ │ │ wysyłanie danych odbieranie danych zamykanie sesji
│ │ │ restart cleanup
│ │ │ FUNCTIONS: const:IPC_CHANNELS.TERMINAL.CREATE,
│ │ │ const:IPC_CHANNELS.TERMINAL.WRITE,
│ │ │ const:IPC_CHANNELS.TERMINAL.RESIZE,
│ │ │ const:IPC_CHANNELS.TERMINAL.GET_BUFFER,
│ │ │ const:IPC_CHANNELS.TERMINAL.KILL,
│ │ │ const:IPC_CHANNELS.TERMINAL.RESTART
│ │ │ DEPENDS ON: electron, logger.js, ipcChannels.js, node-pty, os
│ │ │ -->
│ │ ├── ipcMainHandlers_webview_cache.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_webview_cache.js
│ │ │ PURPOSE: IPC handler dla czyszczenia cache WebView
│ │ │ FUNCTIONS: const:IPC_CHANNELS.WEBVIEW.CLEAR_CACHE
│ │ │ DEPENDS ON: electron, logger.js, ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_webview_controls.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_webview_controls.js
│ │ │ PURPOSE: IPC handlers dla User Agent, Single App Mode, Resource
│ │ │ Monitor, Sleep Tabs. Używa ESM import path/url zamiast
│ │ │ require() (ES module context).
│ │ │ FUNCTIONS: const:IPC_CHANNELS.WEBVIEW.SET_USER_AGENT,
│ │ │ const:IPC_CHANNELS.WEBVIEW.OPEN_IN_WINDOW,
│ │ │ const:IPC_CHANNELS.WEBVIEW.GET_USAGE,
│ │ │ const:IPC_CHANNELS.WEBVIEW.SLEEP,
│ │ │ const:IPC_CHANNELS.WEBVIEW.WAKE,
│ │ │ const:IPC_CHANNELS.WEBVIEW.SCHEDULE_INJECTION,
│ │ │ const:IPC_CHANNELS.WEBVIEW.REMOVE_INJECTION
│ │ │ DEPENDS ON: electron, path, url, logger.js, config.js,
│ │ │ webviewScriptInjector.js, ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_webview_httpErrors.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_webview_httpErrors.js
│ │ │ PURPOSE: IPC handler monitorujący HTTP 4xx/5xx z WebView per
│ │ │ partycja. Uzupełnia did-fail-load (błędy sieciowe/DNS)
│ │ │ o obsługę błędów HTTP, których did-fail-load nie
│ │ │ wychwytuje (strona się ładuje, ale zwraca błąd).
│ │ │ FUNCTIONS: const:IPC_CHANNELS.WEBVIEW.START_HTTP_MONITOR
│ │ │ DEPENDS ON: electron, logger.js, ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_webview_nav.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_webview_nav.js
│ │ │ PURPOSE: IPC handlers dla nawigacji WebView. webview:navigate
│ │ │ waliduje URL przez isSafeUrl() przed loadURL() —
│ │ │ blokuje javascript:, data:, file: itp.
│ │ │ FUNCTIONS: const:IPC_CHANNELS.WEBVIEW.NAVIGATE,
│ │ │ const:IPC_CHANNELS.WEBVIEW.RELOAD,
│ │ │ const:IPC_CHANNELS.WEBVIEW.GO_BACK,
│ │ │ const:IPC_CHANNELS.WEBVIEW.GO_FORWARD,
│ │ │ const:IPC_CHANNELS.WEBVIEW.GET_URL
│ │ │ DEPENDS ON: electron, logger.js, urlUtils.js, ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_webview_registry.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_webview_registry.js
│ │ │ PURPOSE: Handlery IPC dla rejestru WebView – mapowanie tabId ↔
│ │ │ webContentsId. Wymagane przez Screenshot, Resource
│ │ │ Monitor i AdBlocker.
│ │ │ FUNCTIONS: const:IPC_CHANNELS.WEBVIEW.REGISTER,
│ │ │ const:IPC_CHANNELS.WEBVIEW.UNREGISTER
│ │ │ DEPENDS ON: electron, logger.js, webviewRegistry.js,
│ │ │ ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_webview_screenshot.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_webview_screenshot.js
│ │ │ PURPOSE: IPC handler dla screenshot WebView
│ │ │ FUNCTIONS: const:IPC_CHANNELS.WEBVIEW.SCREENSHOT
│ │ │ DEPENDS ON: electron, logger.js, config.js, ipcChannels.js
│ │ │ -->
│ │ ├── ipcMainHandlers_webview_tools.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_webview_tools.js
│ │ │ PURPOSE: Handlery IPC dla narzędzi WebView: tryb Single App,
│ │ │ zrzuty ekranu i monitor zasobów.
│ │ │ FUNCTIONS: registerWebViewExtraHandlers,
│ │ │ const:IPC_CHANNELS.WEBVIEW.OPEN_SINGLE,
│ │ │ const:IPC_CHANNELS.WEBVIEW.CAPTURE,
│ │ │ const:IPC_CHANNELS.WEBVIEW.GET_RESOURCE
│ │ │ DEPENDS ON: electron, path, url, logger.js, webviewRegistry.js,
│ │ │ ipcChannels.js
│ │ │ -->
│ │ └── ipcMainHandlers_workspaces.js <!-- VERSION: 0.0.3 PATH: src/ipc/ipcMainHandlers_workspaces.js
│ │ PURPOSE: IPC dla workspace (Sidebar, useWorkspaces).
│ │ FUNCTIONS: const:IPC_CHANNELS.WORKSPACES.GET_ALL,
│ │ const:IPC_CHANNELS.WORKSPACES.SAVE,
│ │ const:IPC_CHANNELS.WORKSPACES.DELETE
│ │ DEPENDS ON: electron, workspacesStore.js, logger.js,
│ │ ipcChannels.js
│ │ -->
│ ├── loaders/
│ │ ├── ipcLoader.js <!-- VERSION: 0.0.3 PATH: src/loaders/ipcLoader.js
│ │ │ PURPOSE: Dynamicznie ładuje wszystkie handlery IPC z src/ipc/.
│ │ │ Eliminuje konieczność ręcznego importowania każdego
│ │ │ pliku w main.js. Pomija: ipcLegacyBridge.js (ładowany
│ │ │ osobno jako most legacy).
│ │ │ FUNCTIONS: loadAllIpcHandlers
│ │ │ DEPENDS ON: komponenty z folderu ipc/
│ │ │ -->
│ │ └── testsLoader.js <!-- VERSION: 0.0.3 PATH: src/loaders/testsLoader.js
│ │ PURPOSE: Dynamicznie ładuje i uruchamia wszystkie testy z
│ │ tests/TestRunner_*.js. Eliminuje konieczność ręcznego
│ │ importowania testów w TestRunner.js. Pomija:
│ │ TestRunner.js (orchestrator), testUtils.js. Obsługuje
│ │ flagę --verbose (process.argv) do szczegółowego
│ │ logowania.
│ │ FUNCTIONS: loadAndRunAllTests
│ │ DEPENDS ON: komponenty z folderu tests/
│ │ -->
│ ├── locales/
│ │ ├── en.json <!-- VERSION: 0.0.3 PATH: src/locales/en.json
│ │ │ PURPOSE: English translations
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: -
│ │ │ -->
│ │ ├── help.en.json <!-- VERSION: 0.0.3 PATH: src/locales/help.en.json
│ │ │ PURPOSE: Help content (EN) – translated from help.pl.json
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: -
│ │ │ -->
│ │ ├── help.pl.json <!-- VERSION: 0.0.3 PATH: src/locales/help.pl.json
│ │ │ PURPOSE: Treści pomocy (PL)
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: -
│ │ │ -->
│ │ └── pl.json <!-- VERSION: 0.0.3 PATH: src/locales/pl.json
│ │ PURPOSE: Tłumaczenia polskie
│ │ FUNCTIONS: -
│ │ DEPENDS ON: -
│ │ -->
│ ├── stores/
│ │ ├── accountsStore.js <!-- VERSION: 0.0.3 PATH: src/stores/accountsStore.js
│ │ │ PURPOSE: Zarządzanie kontami użytkownika (Google, GitHub, AI,
│ │ │ itp.) – obsługa trwałości i operacji CRUD na danych
│ │ │ kont.
│ │ │ FUNCTIONS: getAllAccounts, addAccount, updateAccount,
│ │ │ deleteAccount
│ │ │ DEPENDS ON: fs, path, electron, logger.js
│ │ │ -->
│ │ ├── aggregatedStore.js <!-- VERSION: 0.0.3 PATH: src/stores/aggregatedStore.js
│ │ │ PURPOSE: Zarządzanie grupami zadań (TaskGroup) — mapowanie
│ │ │ profili WebView na wspólny panel zadań. Każda grupa to
│ │ │ osobny panel TaskPanel współdzielony przez 1..N
│ │ │ profili.
│ │ │ FUNCTIONS: loadTaskGroups, saveTaskGroups, createTaskGroup,
│ │ │ updateTaskGroup, deleteTaskGroup, getGroupForProfile,
│ │ │ ensureDefaultGroup
│ │ │ DEPENDS ON: persistence.js, logger.js
│ │ │ -->
│ │ ├── appLibraryStore.js <!-- VERSION: 0.0.3 PATH: src/stores/appLibraryStore.js
│ │ │ PURPOSE: Statyczna App Library (WebCatalog-style) — udostępnia i
│ │ │ filtruje aplikacje z prekompilowanej biblioteki.
│ │ │ FUNCTIONS: loadAppLibrary, filterApps, searchAppLibrary,
│ │ │ getAppById
│ │ │ DEPENDS ON: logger.js, index.js
│ │ │ -->
│ │ ├── clipboardStore.js <!-- VERSION: 0.0.3 PATH: src/stores/clipboardStore.js
│ │ │ PURPOSE: Zarządzanie historią schowka systemowego – dodawanie,
│ │ │ pobieranie i czyszczenie wpisów tekstowych.
│ │ │ FUNCTIONS: addClipboardEntry, getClipboardHistory,
│ │ │ clearClipboardHistory
│ │ │ DEPENDS ON: electron, config.js, logger.js
│ │ │ -->
│ │ ├── historyStore.js <!-- VERSION: 0.0.3 PATH: src/stores/historyStore.js
│ │ │ PURPOSE: Zarządzanie historią akcji użytkownika – odczyt, zapis,
│ │ │ dodawanie wpisów, czyszczenie i pobieranie ostatnich
│ │ │ wpisów.
│ │ │ FUNCTIONS: loadHistory, saveHistory, addHistoryEntry,
│ │ │ clearHistory, getRecentHistory
│ │ │ DEPENDS ON: config.js, persistence.js, logger.js
│ │ │ -->
│ │ ├── notepadStore.js <!-- VERSION: 0.0.3 PATH: src/stores/notepadStore.js
│ │ │ PURPOSE: Zarządzanie notatkami użytkownika – ładowanie,
│ │ │ zapisywanie oraz operacje CRUD na danych notatek.
│ │ │ FUNCTIONS: getAllnotepad, addNote, updateNote, deleteNote
│ │ │ DEPENDS ON: fs, path, electron, logger.js
│ │ │ -->
│ │ ├── profilesStore.js <!-- VERSION: 0.0.3 PATH: src/stores/profilesStore.js
│ │ │ PURPOSE: Zarządzanie profilami WebView — odczyt z pliku, zapis,
│ │ │ tworzenie, aktualizacja i usuwanie (loadProfiles,
│ │ │ saveProfiles, createProfile, updateProfile,
│ │ │ deleteProfile).
│ │ │ FUNCTIONS: loadProfiles, saveProfiles, createProfile,
│ │ │ updateProfile, deleteProfile
│ │ │ DEPENDS ON: fs, path, url, persistence.js, logger.js, config.js
│ │ │ -->
│ │ ├── projectsStore.js <!-- VERSION: 0.0.3 PATH: src/stores/projectsStore.js
│ │ │ PURPOSE: Projekty (ProjectManager, AggregatedTasks) — plik
│ │ │ projects.json.
│ │ │ FUNCTIONS: loadProjects, saveProjects, createProject,
│ │ │ updateProject, archiveProject, deleteProject
│ │ │ DEPENDS ON: persistence.js, logger.js, fs
│ │ │ -->
│ │ ├── settingsStore.js <!-- VERSION: 0.0.3 PATH: src/stores/settingsStore.js
│ │ │ PURPOSE: Ustawienia użytkownika — merge partial updates, reset
│ │ │ do domyślnych.
│ │ │ FUNCTIONS: loadSettings, saveSettings, mergeSettings,
│ │ │ updateSettings, resetSettings
│ │ │ DEPENDS ON: lodash, fs, path, url, config.js, persistence.js,
│ │ │ logger.js
│ │ │ -->
│ │ ├── taskPanelStore.js <!-- VERSION: 0.0.3 PATH: src/stores/taskPanelStore.js
│ │ │ PURPOSE: Zadania per TaskGroup (TaskPanel, AggregatedTasks).
│ │ │ Jeden plik JSON per taskGroupId. Zawiera logikę
│ │ │ mapowania section↔status.
│ │ │ FUNCTIONS: resolveSection, normalizeTask, loadTasksSections,
│ │ │ loadTasksByGroup, saveTasksForGroup,
│ │ │ loadAllTasksGrouped, loadTasks
│ │ │ DEPENDS ON: fs, persistence.js, logger.js
│ │ │ -->
│ │ ├── toastReducerStore.js <!-- VERSION: - PATH: src/stores/toastReducerStore.js
│ │ │ PURPOSE: Plik zasobów, konfiguracji npm lub dokumentacji
│ │ │ pomocniczej.
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: -
│ │ │ -->
│ │ └── workspacesStore.js <!-- VERSION: 0.0.3 PATH: src/stores/workspacesStore.js
│ │ PURPOSE: Zarządzanie przestrzeniami roboczymi (workspaces)
│ │ użytkownika – ładowanie, zapisywanie oraz operacje typu
│ │ upsert.
│ │ FUNCTIONS: getAllWorkspaces, saveWorkspace, saveWorkspaces,
│ │ deleteWorkspace
│ │ DEPENDS ON: fs, path, electron, logger.js
│ │ -->
│ ├── tools/
│ │ ├── apiClient.js <!-- VERSION: 0.0.3 PATH: src/tools/apiClient.js
│ │ │ PURPOSE: Wrapper HTTP do testowania API – wykonuje żądania z
│ │ │ obsługą timeout (AbortController) i automatycznym retry
│ │ │ z exponential backoff (3 próby). apiRequest() zwraca {
│ │ │ status, headers, body } dla MiniPostman.
│ │ │ apiFetch/apiGet/apiPost to niskopoziomowe helpery z
│ │ │ retry dla innych narzędzi.
│ │ │ FUNCTIONS: apiFetch, apiGet, apiPost, apiRequest
│ │ │ DEPENDS ON: logger.js
│ │ │ -->
│ │ ├── markdownRenderer.js <!-- VERSION: 0.0.3 PATH: src/tools/markdownRenderer.js
│ │ │ PURPOSE: Renderowanie markdown do HTML przy użyciu marked -
│ │ │ renderMarkdown(text) zwraca string HTML
│ │ │ FUNCTIONS: renderMarkdown
│ │ │ DEPENDS ON: marked, logger.js
│ │ │ -->
│ │ ├── regexEngine.js <!-- VERSION: 0.0.3 PATH: src/tools/regexEngine.js
│ │ │ PURPOSE: Helper do testowania wyrażeń regularnych
│ │ │ testRegex(pattern, flags, text) zwraca tablicę
│ │ │ wszystkich dopasowań z podanego tekstu
│ │ │ FUNCTIONS: testRegex
│ │ │ DEPENDS ON: logger.js
│ │ │ -->
│ │ └── svgToPng.js <!-- VERSION: 0.0.3 PATH: src/tools/svgToPng.js
│ │ PURPOSE: Konwersja pliku SVG do PNG przy użyciu sharp
│ │ svgToPng(svgPath, outputPath, width, height) odczytuje
│ │ SVG z dysku, renderuje do PNG o podanych wymiarach i
│ │ zapisuje wynik pod outputPath
│ │ FUNCTIONS: svgToPng
│ │ DEPENDS ON: fs, sharp, logger.js
│ │ -->
│ ├── ui/
│ │ ├── aggregated/
│ │ │ ├── AggregatedProjectSection.jsx <!-- VERSION: 0.0.3 PATH: src/ui/aggregated/AggregatedProjectSection.jsx
│ │ │ │ PURPOSE: Pojedyncza sekcja grupy zadań (TaskGroup) w widoku
│ │ │ │ zbiorczym. Wyświetla zadania per sekcja z pinem na
│ │ │ │ górze.
│ │ │ │ FUNCTIONS: AggregatedProjectSection
│ │ │ │ DEPENDS ON: react, translations.js, icons.js,
│ │ │ │ AggregatedTaskItem.jsx
│ │ │ │ -->
│ │ │ ├── AggregatedTaskItem.jsx <!-- VERSION: 0.0.3 PATH: src/ui/aggregated/AggregatedTaskItem.jsx
│ │ │ │ PURPOSE: Pojedynczy element zadania w widoku zbiorczym.
│ │ │ │ Wyświetla status (ikona), priorytet (kolor), nazwę,
│ │ │ │ flagę pinned, komentarz, wersję.
│ │ │ │ FUNCTIONS: AggregatedTaskItem
│ │ │ │ DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│ │ │ │ -->
│ │ │ └── AggregatedTasks.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/aggregated/AggregatedTasks.jsx
│ │ │ PURPOSE: Widok zbiorczy zadań – orkiestrator renderujący filtry,
│ │ │ nagłówek i listę grup. Logika w useAggregatedTasks.
│ │ │ FUNCTIONS: AggregatedTasks
│ │ │ DEPENDS ON: react, translations.js, icons.js,
│ │ │ AggregatedProjectSection.jsx, useAggregatedTasks.js
│ │ │ -->
│ │ ├── appLibrary/
│ │ │ └── AppLibraryBrowser.jsx <!-- VERSION: 0.0.3 PATH: src/ui/appLibrary/AppLibraryBrowser.jsx
│ │ │ PURPOSE: Główny widok biblioteki aplikacji (App Library) –
│ │ │ przeglądanie skatalogowanych usług webowych,
│ │ │ wyszukiwanie i dodawanie do profili. Komunikacja przez
│ │ │ hook IPC useAppLibrary.
│ │ │ FUNCTIONS: AppLibraryBrowser
│ │ │ DEPENDS ON: react, config.js, useAppLibrary.js, translations.js,
│ │ │ loggerRenderer.js, icons.js
│ │ │ -->
│ │ ├── common/
│ │ │ └── ContextMenu.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/common/ContextMenu.jsx
│ │ │ PURPOSE: Reużywalny komponent menu kontekstowego (PPM) – używany
│ │ │ przez Sidebar, Notepad, TaskPanel i inne moduły.
│ │ │ Renderuje listę akcji z obsługą separatorów, ikon i
│ │ │ trybu danger.
│ │ │ FUNCTIONS: ContextMenu
│ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ -->
│ │ ├── help/
│ │ │ ├── FAQ.jsx <!-- VERSION: 0.0.3 PATH: src/ui/help/FAQ.jsx
│ │ │ │ PURPOSE: Pojedynczy wpis FAQ (pytanie + odpowiedź)
│ │ │ │ FUNCTIONS: -
│ │ │ │ DEPENDS ON: react, translations.js, icons.js
│ │ │ │ -->
│ │ │ ├── Help.jsx <!-- VERSION: 0.0.3 PATH: src/ui/help/Help.jsx
│ │ │ │ PURPOSE: Główny komponent pomocy – łączy sekcje (Profile, Tools,
│ │ │ │ Tasks, Shortcuts, FAQ)
│ │ │ │ FUNCTIONS: Help
│ │ │ │ DEPENDS ON: react, config.js, translations.js, icons.js,
│ │ │ │ HelpSection, ToolCard, Shortcut, FAQ
│ │ │ │ -->
│ │ │ ├── HelpSection.jsx <!-- VERSION: 0.0.3 PATH: src/ui/help/HelpSection.jsx
│ │ │ │ PURPOSE: Rozwijana sekcja pomocy (tytuł + treść)
│ │ │ │ FUNCTIONS: HelpSection
│ │ │ │ DEPENDS ON: react, translations.js, icons.js
│ │ │ │ -->
│ │ │ ├── Shortcut.jsx <!-- VERSION: 0.0.3 PATH: src/ui/help/Shortcut.jsx
│ │ │ │ PURPOSE: Wiersz skrótu klawiaturowego
│ │ │ │ FUNCTIONS: Shortcut
│ │ │ │ DEPENDS ON: react, translations.js
│ │ │ │ -->
│ │ │ └── ToolCard.jsx <!-- VERSION: 0.0.3 PATH: src/ui/help/ToolCard.jsx
│ │ │ PURPOSE: Karta opisu narzędzia (ikona, tytuł, opis)
│ │ │ FUNCTIONS: ToolCard
│ │ │ DEPENDS ON: react, translations.js
│ │ │ -->
│ │ ├── history/
│ │ │ ├── HistoryExport.jsx <!-- VERSION: 0.0.3 PATH: src/ui/history/HistoryExport.jsx
│ │ │ │ PURPOSE: Eksport historii do CSV
│ │ │ │ FUNCTIONS: HistoryExport
│ │ │ │ DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── HistoryFilters.jsx <!-- VERSION: 0.0.3 PATH: src/ui/history/HistoryFilters.jsx
│ │ │ │ PURPOSE: Filtry historii (poziom, sortowanie, przycisk
│ │ │ │ czyszczenia)
│ │ │ │ FUNCTIONS: HistoryFilters
│ │ │ │ DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── HistoryList.jsx <!-- VERSION: 0.0.3 PATH: src/ui/history/HistoryList.jsx
│ │ │ │ PURPOSE: Lista wpisów historii (tabela)
│ │ │ │ FUNCTIONS: HistoryList
│ │ │ │ DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│ │ │ │ -->
│ │ │ └── HistoryLog.jsx <!-- VERSION: 0.0.3 PATH: src/ui/history/HistoryLog.jsx
│ │ │ PURPOSE: Historia przeglądania – lista ostatnio odwiedzonych
│ │ │ profili, komunikacja przez hook IPC useHistoryLog.
│ │ │ FUNCTIONS: HistoryLog
│ │ │ DEPENDS ON: react, useHistoryLog.js, translations.js,
│ │ │ loggerRenderer.js, icons.js, ConfirmModal.jsx,
│ │ │ HistoryFilters.jsx, HistoryList.jsx
│ │ │ -->
│ │ ├── layout/
│ │ │ └── MainLayout.jsx <!-- VERSION: 0.0.3 PATH: src/ui/layout/MainLayout.jsx
│ │ │ PURPOSE: Główny szkielet interfejsu użytkownika (Shell) –
│ │ │ definiuje siatkę aplikacji, koordynuje nawigację
│ │ │ boczną, obszar roboczy (ContentRenderer) oraz integruje
│ │ │ globalne mechanizmy modalne. Logika stanu przeniesiona
│ │ │ do useMainLayout.js.
│ │ │ FUNCTIONS: MainLayout
│ │ │ DEPENDS ON: react, useMainLayout.js, Sidebar.jsx,
│ │ │ ContentRenderer.jsx, ConfirmModal.jsx
│ │ │ -->
│ │ ├── modals/
│ │ │ ├── CategoryModal.jsx <!-- VERSION: 0.0.3 PATH: src/ui/modals/CategoryModal.jsx
│ │ │ │ PURPOSE: Formularz modalny do zarządzania kategoriami profili –
│ │ │ │ umożliwia tworzenie nowych i edycję istniejących sekcji
│ │ │ │ grupujących w Sidebarze.
│ │ │ │ FUNCTIONS: CategoryModal
│ │ │ │ DEPENDS ON: loggerRenderer.js, react, translations.js, icons.js,
│ │ │ │ ModalPortal
│ │ │ │ -->
│ │ │ ├── CommentModal.jsx <!-- VERSION: 0.0.3 PATH: src/ui/modals/CommentModal.jsx
│ │ │ │ PURPOSE: Modal podglądu komentarza/kodu do zadania
│ │ │ │ FUNCTIONS: CommentModal
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js
│ │ │ │ -->
│ │ │ ├── ConfirmModal.jsx <!-- VERSION: 0.0.3 PATH: src/ui/modals/ConfirmModal.jsx
│ │ │ │ PURPOSE: Generyczny komponent modalny służący do potwierdzania
│ │ │ │ akcji krytycznych (np. usuwanie). Zapewnia spójność
│ │ │ │ wizualną i zastępuje natywną funkcję window.confirm.
│ │ │ │ FUNCTIONS: ConfirmModal
│ │ │ │ DEPENDS ON: react, translations.js, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── Modal.jsx <!-- VERSION: 0.0.3 PATH: src/ui/modals/Modal.jsx
│ │ │ │ PURPOSE: Bazowy komponent modalny dla całej aplikacji
│ │ │ │ FUNCTIONS: Modal
│ │ │ │ DEPENDS ON: react, translations.js, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── ProfileModal.jsx <!-- VERSION: 0.0.3 PATH: src/ui/modals/ProfileModal.jsx
│ │ │ │ PURPOSE: Zaawansowany formularz modalny do konfiguracji profili
│ │ │ │ WebView – obsługuje parametry URL, ikony, przypisanie
│ │ │ │ do kategorii oraz przełączniki adblockera i
│ │ │ │ powiadomień.
│ │ │ │ FUNCTIONS: ProfileModal
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js,
│ │ │ │ urlUtils.js, ModalPortal, notificationsManager.js,
│ │ │ │ useTaskGroups.js
│ │ │ │ -->
│ │ │ ├── PromptModal.jsx <!-- VERSION: 0.0.3 PATH: src/ui/modals/PromptModal.jsx
│ │ │ │ PURPOSE: Modal z polem input – zastępuje window.prompt()
│ │ │ │ FUNCTIONS: PromptModal
│ │ │ │ DEPENDS ON: react, translations.js, loggerRenderer.js
│ │ │ │ -->
│ │ │ └── TaskModal.jsx <!-- VERSION: 0.0.3 PATH: src/ui/modals/TaskModal.jsx
│ │ │ PURPOSE: Modal dodawania i edycji zadania. Status wybierany
│ │ │ przez użytkownika – sekcja jest wyznaczana
│ │ │ automatycznie (status→section). Priorytety: A–E. Pola:
│ │ │ name, status, priority, desc, version, comment, pinned.
│ │ │ FUNCTIONS: TaskModal
│ │ │ DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js
│ │ │ -->
│ │ ├── notepad/
│ │ │ ├── ClipboardHistoryModal.jsx <!-- VERSION: 0.0.3 PATH: src/ui/notepad/ClipboardHistoryModal.jsx
│ │ │ │ PURPOSE: Okno modalne prezentujące listę historycznych wpisów ze
│ │ │ │ schowka systemowego – umożliwia przeglądanie i
│ │ │ │ odzyskiwanie skopiowanych wcześniej fragmentów tekstu.
│ │ │ │ FUNCTIONS: ClipboardHistoryModal
│ │ │ │ DEPENDS ON: react, translations.js, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── Notepad.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/notepad/Notepad.jsx
│ │ │ │ PURPOSE: Główny komponent notatnika – czysty orkiestrator.
│ │ │ │ Koordynuje zakładki, edytor, wyszukiwanie i statusbar
│ │ │ │ przez useNotepadUI i useNotepadHandlers.
│ │ │ │ FUNCTIONS: Notepad
│ │ │ │ DEPENDS ON: react, useNotepadUI.js, useNotepadFindReplace.js,
│ │ │ │ useNotepadHandlers.js, NotepadTabs, NotepadToolbar,
│ │ │ │ NotepadFindReplace, NotepadStatusBar,
│ │ │ │ translations.js, ConfirmModal
│ │ │ │ -->
│ │ │ ├── NotepadFindReplace.jsx <!-- VERSION: 0.0.3 PATH: src/ui/notepad/NotepadFindReplace.jsx
│ │ │ │ PURPOSE: Panel znajdź/zastąp w notatniku
│ │ │ │ FUNCTIONS: NotepadFindReplace
│ │ │ │ DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── NotepadStatusBar.jsx <!-- VERSION: 0.0.3 PATH: src/ui/notepad/NotepadStatusBar.jsx
│ │ │ │ PURPOSE: Pasek informacyjny u dołu notatnika – wyświetla
│ │ │ │ metadane aktywnego dokumentu: statystyki znaków/wierszy
│ │ │ │ oraz czas ostatniego autozapisu.
│ │ │ │ FUNCTIONS: NotepadStatusBar
│ │ │ │ DEPENDS ON: react, translations.js, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── NotepadTabs.jsx <!-- VERSION: 0.0.3 PATH: src/ui/notepad/NotepadTabs.jsx
│ │ │ │ PURPOSE: Komponent zarządzający paskiem kart notatnika –
│ │ │ │ obsługuje przełączanie dokumentów, ich zamykanie,
│ │ │ │ zmianę nazwy oraz wizualizację stanu 'dirty'.
│ │ │ │ FUNCTIONS: NotepadTabs
│ │ │ │ DEPENDS ON: react, translations.js, loggerRenderer.js, icons.js,
│ │ │ │ PromptModal.jsx
│ │ │ │ -->
│ │ │ └── NotepadToolbar.jsx <!-- VERSION: 0.0.3 PATH: src/ui/notepad/NotepadToolbar.jsx
│ │ │ PURPOSE: Pasek narzędzi notatnika (zapisz, znajdź, word wrap)
│ │ │ FUNCTIONS: NotepadToolbar
│ │ │ DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│ │ │ -->
│ │ ├── onboarding/
│ │ │ ├── Onboarding.jsx <!-- VERSION: 0.0.3 PATH: src/ui/onboarding/Onboarding.jsx
│ │ │ │ PURPOSE: Główny wizard onboardingu – zarządza stanem, nawigacją
│ │ │ │ i logiką kroków. Importuje moduły kroków z tego samego
│ │ │ │ folderu.
│ │ │ │ FUNCTIONS: Onboarding
│ │ │ │ DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js,
│ │ │ │ onboardingConfig.js, StepIndicator.jsx,
│ │ │ │ StepTheme.jsx, StepLanguage.jsx, StepPrivacy.jsx,
│ │ │ │ StepApps.jsx, StepAccount.jsx
│ │ │ │ -->
│ │ │ ├── StepAccount.jsx <!-- VERSION: 0.0.3 PATH: src/ui/onboarding/StepAccount.jsx
│ │ │ │ PURPOSE: Krok onboardingu 5/5 – placeholder konta użytkownika
│ │ │ │ (sync coming soon)
│ │ │ │ FUNCTIONS: StepAccount
│ │ │ │ DEPENDS ON: react, icons.js
│ │ │ │ -->
│ │ │ ├── StepApps.jsx <!-- VERSION: 0.0.3 PATH: src/ui/onboarding/StepApps.jsx
│ │ │ │ PURPOSE: Krok onboardingu 4/5 – szybki start: wybór aplikacji z
│ │ │ │ App Library per kategoria
│ │ │ │ FUNCTIONS: StepApps
│ │ │ │ DEPENDS ON: react, icons.js, onboardingConfig.js,
│ │ │ │ app-library.json
│ │ │ │ -->
│ │ │ ├── StepIndicator.jsx <!-- VERSION: 0.0.3 PATH: src/ui/onboarding/StepIndicator.jsx
│ │ │ │ PURPOSE: Wskaźnik postępu onboardingu – animowane dot-y u góry
│ │ │ │ wizarda
│ │ │ │ FUNCTIONS: StepIndicator
│ │ │ │ DEPENDS ON: react
│ │ │ │ -->
│ │ │ ├── StepLanguage.jsx <!-- VERSION: 0.0.3 PATH: src/ui/onboarding/StepLanguage.jsx
│ │ │ │ PURPOSE: Krok onboardingu 2/5 – wybór języka interfejsu (pl/en)
│ │ │ │ z zastosowaniem live
│ │ │ │ FUNCTIONS: StepLanguage
│ │ │ │ DEPENDS ON: react, config.js
│ │ │ │ -->
│ │ │ ├── StepPrivacy.jsx <!-- VERSION: 0.0.3 PATH: src/ui/onboarding/StepPrivacy.jsx
│ │ │ │ PURPOSE: Krok onboardingu 3/5 – disclaimer aplikacji + toggles
│ │ │ │ prywatności (toasty, logi, analityka)
│ │ │ │ FUNCTIONS: StepPrivacy
│ │ │ │ DEPENDS ON: react, onboardingConfig.js
│ │ │ │ -->
│ │ │ └── StepTheme.jsx <!-- VERSION: 0.0.3 PATH: src/ui/onboarding/StepTheme.jsx
│ │ │ PURPOSE: Krok onboardingu 1/5 – wybór motywu (dark/light/system)
│ │ │ z podglądem live
│ │ │ FUNCTIONS: StepTheme
│ │ │ DEPENDS ON: react, icons.js
│ │ │ -->
│ │ ├── profiles/
│ │ │ └── Profiles.jsx <!-- VERSION: 0.0.3 PATH: src/ui/profiles/Profiles.jsx
│ │ │ PURPOSE: UI zarządzania profilami WebView — wyświetlanie listy
│ │ │ profili z danych IPC (load, wyświetlanie nazwy, URL,
│ │ │ obsługa błędów). Używa window.electronAPI.invoke
│ │ │ zamiast window.mw.
│ │ │ FUNCTIONS: Profiles
│ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ -->
│ │ ├── projects/
│ │ │ ├── ProjectList.jsx <!-- VERSION: 0.0.3 PATH: src/ui/projects/ProjectList.jsx
│ │ │ │ PURPOSE: Lista projektów z akcjami (zadania, terminal, usuwanie)
│ │ │ │ FUNCTIONS: ProjectList
│ │ │ │ DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── ProjectManager.jsx <!-- VERSION: 0.0.3 PATH: src/ui/projects/ProjectManager.jsx
│ │ │ │ PURPOSE: Zarządzanie projektami – lista, dodawanie, usuwanie,
│ │ │ │ edycja przez hook IPC useProjects.
│ │ │ │ FUNCTIONS: ProjectManager
│ │ │ │ DEPENDS ON: react, useProjects.js, translations.js,
│ │ │ │ loggerRenderer.js, icons.js, ConfirmModal.jsx,
│ │ │ │ ProjectModal.jsx
│ │ │ │ -->
│ │ │ └── ProjectModal.jsx <!-- VERSION: 0.0.3 PATH: src/ui/projects/ProjectModal.jsx
│ │ │ PURPOSE: Modal dodawania nowego projektu (nazwa + ścieżka)
│ │ │ FUNCTIONS: ProjectModal
│ │ │ DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js
│ │ │ -->
│ │ ├── settings/
│ │ │ ├── AccountSection.jsx <!-- VERSION: 0.0.3 PATH: src/ui/settings/AccountSection.jsx
│ │ │ │ PURPOSE: Sekcja zarządzania profilem użytkownika – obecnie służy
│ │ │ │ jako placeholder dla nadchodzącej funkcji
│ │ │ │ synchronizacji danych w chmurze (Cloud Sync) planowanej
│ │ │ │ w v0.0.4.
│ │ │ │ FUNCTIONS: AccountSection
│ │ │ │ DEPENDS ON: react, translations.js, src, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── DataManagementSection.jsx <!-- VERSION: 0.0.3 PATH: src/ui/settings/DataManagementSection.jsx
│ │ │ │ PURPOSE: Sekcja zarządzania danymi aplikacji – eksport, import i
│ │ │ │ reset ustawień.
│ │ │ │ FUNCTIONS: DataManagementSection
│ │ │ │ DEPENDS ON: react, translations.js, loggerRenderer.js, icons.js,
│ │ │ │ ConfirmModal
│ │ │ │ -->
│ │ │ ├── DebugModulesSection.jsx <!-- VERSION: 0.0.3 PATH: src/ui/settings/DebugModulesSection.jsx
│ │ │ │ PURPOSE: UI do zarządzania filtrowaniem logów per-moduł.
│ │ │ │ Widoczna tylko w trybie debugMode.
│ │ │ │ FUNCTIONS: DebugModulesSection
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer.js,
│ │ │ │ icons.js
│ │ │ │ -->
│ │ │ ├── GeneralSection.jsx <!-- VERSION: 0.0.3 PATH: src/ui/settings/GeneralSection.jsx
│ │ │ │ PURPOSE: Sekcja ustawień ogólnych aplikacji – zarządza wyborem
│ │ │ │ języka (i18n), motywem graficznym (Light/Dark) oraz
│ │ │ │ globalnym trybem debugowania (developer mode).
│ │ │ │ FUNCTIONS: GeneralSection
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│ │ │ │ icons
│ │ │ │ -->
│ │ │ ├── HotkeyModal.jsx <!-- VERSION: 0.0.3 PATH: src/ui/settings/HotkeyModal.jsx
│ │ │ │ PURPOSE: Modal do dodawania i edycji skrótów klawiszowych –
│ │ │ │ formularz z walidacją.
│ │ │ │ FUNCTIONS: HotkeyModal
│ │ │ │ DEPENDS ON: react, translations.js, Modal
│ │ │ │ -->
│ │ │ ├── HotkeysListSection.jsx <!-- VERSION: 0.0.3 PATH: src/ui/settings/HotkeysListSection.jsx
│ │ │ │ PURPOSE: Komponent tabeli wyświetlającej listę skrótów
│ │ │ │ klawiszowych z akcjami edycji i usuwania.
│ │ │ │ FUNCTIONS: HotkeysList
│ │ │ │ DEPENDS ON: react, translations.js, icons.js
│ │ │ │ -->
│ │ │ ├── HotkeysManagerSection.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/settings/HotkeysManagerSection.jsx
│ │ │ │ PURPOSE: Widok zarządzania skrótami klawiszowymi – orkiestrator
│ │ │ │ renderujący podkomponenty. Logika w useHotkeysManager.
│ │ │ │ FUNCTIONS: HotkeysManager
│ │ │ │ DEPENDS ON: react, config.js, translations.js,
│ │ │ │ useHotkeysManager.js, HotkeysListSection.jsx,
│ │ │ │ HotkeyModal.jsx, ConfirmModal.jsx
│ │ │ │ -->
│ │ │ ├── LogsSection.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/settings/LogsSection.jsx
│ │ │ │ PURPOSE: Widok sekcji zarządzania logami – logi testów i
│ │ │ │ dziennik zdarzeń. Logika w useLogsSection.
│ │ │ │ FUNCTIONS: LogsSection
│ │ │ │ DEPENDS ON: react, translations.js, icons.js, Modal,
│ │ │ │ useLogsSection.js
│ │ │ │ -->
│ │ │ ├── NotificationsSection.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/settings/NotificationsSection.jsx
│ │ │ │ PURPOSE: Widok sekcji powiadomień – toasty UI, powiadomienia
│ │ │ │ systemowe OS, Pushbullet. Logika w
│ │ │ │ useNotificationsSection.
│ │ │ │ FUNCTIONS: NotificationsSection
│ │ │ │ DEPENDS ON: react, translations.js, icons.js,
│ │ │ │ useNotificationsSection.js
│ │ │ │ -->
│ │ │ ├── Settings.jsx <!-- VERSION: 0.0.3 PATH: src/ui/settings/Settings.jsx
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
│ │ │ ├── TabsSection.jsx <!-- VERSION: 0.0.3 PATH: src/ui/settings/TabsSection.jsx
│ │ │ │ PURPOSE: Sekcja konfiguracji zarządzania kartami – pozwala na
│ │ │ │ ustawienie czasu bezczynności, po którym nieaktywne
│ │ │ │ WebView są uśpiane w celu oszczędzania zasobów
│ │ │ │ systemowych (RAM/CPU).
│ │ │ │ FUNCTIONS: TabsSection
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│ │ │ │ icons
│ │ │ │ -->
│ │ │ └── WebViewSection.jsx <!-- VERSION: 0.0.3 PATH: src/ui/settings/WebViewSection.jsx
│ │ │ PURPOSE: Konfiguracja silnika przeglądarki (WebView) – zarządza
│ │ │ globalnym blokowaniem reklam, maskowaniem tożsamości
│ │ │ przeglądarki (User Agent) oraz trybami wyświetlania
│ │ │ okien.
│ │ │ FUNCTIONS: WebViewSection
│ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│ │ │ icons
│ │ │ -->
│ │ ├── sidebar/
│ │ │ ├── Sidebar.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/Sidebar.jsx
│ │ │ │ PURPOSE: Główny panel nawigacyjny aplikacji – czysty
│ │ │ │ orkiestrator. Kompozycja podkomponentów i delegacja
│ │ │ │ logiki do useSidebarHandlers.
│ │ │ │ FUNCTIONS: Sidebar
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js,
│ │ │ │ config.js, useProfiles.js, useCategories.js,
│ │ │ │ useSidebarSearch.js, useWorkspaces.js,
│ │ │ │ useSidebarHandlers.js, SidebarHeader,
│ │ │ │ SidebarProfileList, SidebarTools, SidebarWorkspaces,
│ │ │ │ ProfileModal, CategoryModal, ConfirmModal
│ │ │ │ -->
│ │ │ ├── SidebarCategory.jsx <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/SidebarCategory.jsx
│ │ │ │ PURPOSE: Nagłówek kategorii profilów (zwijanie/rozwijanie, menu
│ │ │ │ kontekstowe)
│ │ │ │ FUNCTIONS: SidebarCategory
│ │ │ │ DEPENDS ON: react, translations.js, loggerRenderer.js, icons.js
│ │ │ │ -->
│ │ │ ├── SidebarHeader.jsx <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/SidebarHeader.jsx
│ │ │ │ PURPOSE: Główny komponent nagłówka paska bocznego (Sidebar) –
│ │ │ │ udostępnia przyciski akcji do tworzenia nowych profili
│ │ │ │ i kategorii oraz integruje komponent wyszukiwania
│ │ │ │ SidebarSearch.
│ │ │ │ FUNCTIONS: SidebarHeader
│ │ │ │ DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js,
│ │ │ │ SidebarSearch
│ │ │ │ -->
│ │ │ ├── SidebarProfileItem.jsx <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/SidebarProfileItem.jsx
│ │ │ │ PURPOSE: Pojedynczy profil w Sidebarze (ikona, nazwa,
│ │ │ │ indykatory)
│ │ │ │ FUNCTIONS: SidebarProfileItem
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, icons.js
│ │ │ │ -->
│ │ │ ├── SidebarProfileList.jsx <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/SidebarProfileList.jsx
│ │ │ │ PURPOSE: Lista profilów w sidebarze – favorites, kategorie,
│ │ │ │ profil bez kategorii, z obsługą menu kontekstowego.
│ │ │ │ FUNCTIONS: SidebarProfileList
│ │ │ │ DEPENDS ON: react, translations.js, icons.js, loggerRenderer.js,
│ │ │ │ SidebarCategory, SidebarProfileItem, ContextMenu
│ │ │ │ -->
│ │ │ ├── SidebarSearch.jsx <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/SidebarSearch.jsx
│ │ │ │ PURPOSE: Komponent paska wyszukiwania zintegrowany z
│ │ │ │ SidebarHeader – filtrowanie profili i kategorii (tryb
│ │ │ │ lokalny) oraz globalne wyszukiwanie notatek, zadań i
│ │ │ │ projektów (tryb globalny).
│ │ │ │ FUNCTIONS: SidebarSearch
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js
│ │ │ │ -->
│ │ │ ├── SidebarTools.jsx <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/SidebarTools.jsx
│ │ │ │ PURPOSE: Sekcja narzędzi specjalnych w Sidebarze
│ │ │ │ FUNCTIONS: SidebarTools
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer.js,
│ │ │ │ icons.js, constants.js
│ │ │ │ -->
│ │ │ └── SidebarWorkspaces.jsx <!-- VERSION: 0.0.3 PATH: src/ui/sidebar/SidebarWorkspaces.jsx
│ │ │ PURPOSE: Sekcja workspace'ów w Sidebarze
│ │ │ FUNCTIONS: SidebarWorkspaces
│ │ │ DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js
│ │ │ -->
│ │ ├── styles/
│ │ │ ├── components.css <!-- VERSION: 0.0.3 PATH: src/ui/styles/components.css
│ │ │ │ PURPOSE: Zbiór stylów CSS aplikacji
│ │ │ │ FUNCTIONS: -
│ │ │ │ DEPENDS ON: -
│ │ │ │ -->
│ │ │ └── theme.css <!-- VERSION: 0.0.3 PATH: src/ui/styles/theme.css
│ │ │ PURPOSE: Globalne style aplikacji MultiWeb Manager
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: -
│ │ │ -->
│ │ ├── system/
│ │ │ ├── ErrorBoundary.jsx <!-- VERSION: 0.0.3 PATH: src/ui/system/ErrorBoundary.jsx
│ │ │ │ PURPOSE: Przechwytuje błędy React w drzewie komponentów,
│ │ │ │ zapobiegając awarii całej aplikacji.
│ │ │ │ FUNCTIONS: -
│ │ │ │ DEPENDS ON: react
│ │ │ │ -->
│ │ │ ├── ModalPortal.jsx <!-- VERSION: 0.0.3 PATH: src/ui/system/ModalPortal.jsx
│ │ │ │ PURPOSE: Modal w portalu (document.body) — ponad natywnym
│ │ │ │ <webview> w Electronie.
│ │ │ │ FUNCTIONS: ModalPortal
│ │ │ │ DEPENDS ON: react, react-dom
│ │ │ │ -->
│ │ │ ├── OnboardingScreen.jsx <!-- VERSION: 0.0.3 PATH: src/ui/system/OnboardingScreen.jsx
│ │ │ │ PURPOSE: Re-export komponentu Onboarding z nowej lokalizacji dla
│ │ │ │ kompatybilności wstecznej
│ │ │ │ FUNCTIONS: default as OnboardingScreen
│ │ │ │ DEPENDS ON: ../onboarding/Onboarding.jsx
│ │ │ │ -->
│ │ │ ├── SplashScreen.jsx <!-- VERSION: 0.0.3 PATH: src/ui/system/SplashScreen.jsx
│ │ │ │ PURPOSE: Ekran ładowania aplikacji wyświetlany przy starcie
│ │ │ │ przez 1.5–2s. Pokazuje logo (PNG z assets/ lub SVG
│ │ │ │ fallback), nazwę aplikacji i pasek postępu.
│ │ │ │ FUNCTIONS: SplashScreen
│ │ │ │ DEPENDS ON: react, translations.js, icons.js
│ │ │ │ -->
│ │ │ ├── ToastContainer.jsx ❗ <!-- VERSION: 0.0.3 PATH: src/ui/system/ToastContainer.jsx
│ │ │ │ PURPOSE: Globalny kontener toastów – orkiestrator renderujący
│ │ │ │ kolejkę. Logika w useToastQueue, konfiguracja w
│ │ │ │ toastConfig.js, widok pojedynczego toastu w
│ │ │ │ ToastItem.jsx.
│ │ │ │ FUNCTIONS: ToastContainer
│ │ │ │ DEPENDS ON: react, useToastQueue.js, ToastItem.jsx
│ │ │ │ -->
│ │ │ ├── ToastItem.jsx <!-- VERSION: 0.0.3 PATH: src/ui/system/ToastItem.jsx
│ │ │ │ PURPOSE: Pojedynczy toast – wyświetla ikonę, treść i przycisk
│ │ │ │ zamknięcia
│ │ │ │ FUNCTIONS: ToastItem
│ │ │ │ DEPENDS ON: react, icons.js, toastConfig.js
│ │ │ │ -->
│ │ │ └── UpdateChecker.jsx <!-- VERSION: 0.0.3 PATH: src/ui/system/UpdateChecker.jsx
│ │ │ PURPOSE: Komponent sprawdzania aktualizacji. Używa globalnego
│ │ │ showToast (UIUX_REQ-021) zamiast lokalnego stanu
│ │ │ inline.
│ │ │ FUNCTIONS: UpdateChecker
│ │ │ DEPENDS ON: react, icons, translations.js, loggerRenderer,
│ │ │ notificationsManager.js
│ │ │ -->
│ │ ├── taskpanel/
│ │ │ ├── TaskDetails.jsx <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskDetails.jsx
│ │ │ │ PURPOSE: Widok szczegółowy pojedynczego zadania. Umożliwia
│ │ │ │ szybką edycję statusu i priorytetu bezpośrednio z
│ │ │ │ poziomu podglądu oraz synchronizację tych zmian przez
│ │ │ │ IPC.
│ │ │ │ FUNCTIONS: TaskDetails
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, constants.js,
│ │ │ │ translations.js
│ │ │ │ -->
│ │ │ ├── TaskEditor.jsx <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskEditor.jsx
│ │ │ │ PURPOSE: Wyspecjalizowany edytor zadań (inline lub modal)
│ │ │ │ obsługujący walidację danych wejściowych, komunikację z
│ │ │ │ tasksStore przez IPC oraz integrację z systemem
│ │ │ │ toastów.
│ │ │ │ FUNCTIONS: TaskEditor
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, constants.js,
│ │ │ │ translations.js
│ │ │ │ -->
│ │ │ ├── TaskEmptyState.jsx <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskEmptyState.jsx
│ │ │ │ PURPOSE: Komponent wyświetlający stan braku zadań w danej
│ │ │ │ sekcji.
│ │ │ │ FUNCTIONS: TaskEmptyState
│ │ │ │ DEPENDS ON: react, translations.js
│ │ │ │ -->
│ │ │ ├── TaskItem.jsx <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskItem.jsx
│ │ │ │ PURPOSE: Pojedynczy element zadania w panelu. Wyświetla status,
│ │ │ │ priorytet, nazwę i przyciski akcji. Przyciski ruchu
│ │ │ │ między sekcjami są kontekstowe (zależą od section i
│ │ │ │ status zadania).
│ │ │ │ FUNCTIONS: TaskItem
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js
│ │ │ │ -->
│ │ │ ├── TaskList.jsx <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskList.jsx
│ │ │ │ PURPOSE: Główny komponent listy zadań (Kanban/List view) –
│ │ │ │ odpowiada za dynamiczne filtrowanie, grupowanie według
│ │ │ │ statusu (TODO, IN_PROGRESS, BLOCKED, DONE) oraz
│ │ │ │ wyzwalanie akcji edycji i podglądu.
│ │ │ │ FUNCTIONS: TaskList
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, constants.js,
│ │ │ │ translations.js
│ │ │ │ -->
│ │ │ ├── TaskPanel.jsx <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskPanel.jsx
│ │ │ │ PURPOSE: Główny komponent panelu zadań – czysty orkiestrator.
│ │ │ │ Zarządza sekcjami zadań (active/backlog/done) i
│ │ │ │ deleguje logikę do useTaskPanelHandlers.
│ │ │ │ FUNCTIONS: TaskPanel
│ │ │ │ DEPENDS ON: react, useTasks.js, useTaskPanelHandlers.js,
│ │ │ │ translations.js, loggerRenderer.js, icons.js,
│ │ │ │ ConfirmModal.jsx, TaskModal.jsx, CommentModal.jsx,
│ │ │ │ TaskSectionList.jsx
│ │ │ │ -->
│ │ │ ├── TaskSection.jsx <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskSection.jsx
│ │ │ │ PURPOSE: Pojedyncza sekcja zadań (aktywne, backlog, done)
│ │ │ │ FUNCTIONS: TaskSection
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js,
│ │ │ │ TaskItem
│ │ │ │ -->
│ │ │ └── TaskSectionList.jsx <!-- VERSION: 0.0.3 PATH: src/ui/taskpanel/TaskSectionList.jsx
│ │ │ PURPOSE: Renderuje pogrupowaną listę sekcji zadań (Active,
│ │ │ Backlog, Done) w panelu bocznym.
│ │ │ FUNCTIONS: TaskSectionList
│ │ │ DEPENDS ON: react, translations.js, TaskSection.jsx
│ │ │ -->
│ │ ├── terminal/
│ │ │ └── Terminal.jsx <!-- VERSION: 0.0.3 PATH: src/ui/terminal/Terminal.jsx
│ │ │ PURPOSE: Terminal z xterm.js + node-pty (historia komend, ANSI
│ │ │ colors). Używa nowego multi-session API
│ │ │ (terminal:create/write/resize/kill z terminalId).
│ │ │ FUNCTIONS: Terminal
│ │ │ DEPENDS ON: react, xterm, xterm-addon-fit, xterm-addon-web-links,
│ │ │ translations.js, loggerRenderer, icons
│ │ │ -->
│ │ ├── tools/
│ │ │ ├── ClipboardHistory.jsx <!-- VERSION: 0.0.3 PATH: src/ui/tools/ClipboardHistory.jsx
│ │ │ │ PURPOSE: Historia schowka z pinowaniem i wyszukiwarką
│ │ │ │ FUNCTIONS: ClipboardHistory
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│ │ │ │ icons
│ │ │ │ -->
│ │ │ ├── CookieGrabber.jsx <!-- VERSION: 0.0.3 PATH: src/ui/tools/CookieGrabber.jsx
│ │ │ │ PURPOSE: Pobieranie cookies z aktywnego WebView – tabela,
│ │ │ │ kopiowanie, eksport
│ │ │ │ FUNCTIONS: CookieGrabber
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│ │ │ │ icons
│ │ │ │ -->
│ │ │ ├── FilePreviewer.jsx <!-- VERSION: 0.0.3 PATH: src/ui/tools/FilePreviewer.jsx
│ │ │ │ PURPOSE: Podgląd plików (RAW/PREVIEW) – TXT, JSON, HTML, SVG,
│ │ │ │ Markdown, obrazy
│ │ │ │ FUNCTIONS: FilePreviewer
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│ │ │ │ icons, markdownRenderer
│ │ │ │ -->
│ │ │ ├── ImageTools.jsx <!-- VERSION: 0.0.3 PATH: src/ui/tools/ImageTools.jsx
│ │ │ │ PURPOSE: Kompresja, resize i konwersja obrazów (drag & drop,
│ │ │ │ preview)
│ │ │ │ FUNCTIONS: ImageTools
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│ │ │ │ icons, imageUtils
│ │ │ │ -->
│ │ │ ├── JsonFormatter.jsx <!-- VERSION: 0.0.3 PATH: src/ui/tools/JsonFormatter.jsx
│ │ │ │ PURPOSE: Formatowanie i walidacja JSON/YAML/XML
│ │ │ │ FUNCTIONS: JsonFormatter
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer
│ │ │ │ -->
│ │ │ ├── MarkdownPreviewer.jsx <!-- VERSION: 0.0.3 PATH: src/ui/tools/MarkdownPreviewer.jsx
│ │ │ │ PURPOSE: Podgląd Markdown na żywo (split view)
│ │ │ │ FUNCTIONS: MarkdownPreviewer
│ │ │ │ DEPENDS ON: react, config.js, loggerRenderer.js, translations.js
│ │ │ │ -->
│ │ │ ├── MiniPostman.jsx <!-- VERSION: 0.0.3 PATH: src/ui/tools/MiniPostman.jsx
│ │ │ │ PURPOSE: Lekki API tester (GET/POST/PUT/DELETE, nagłówki, body,
│ │ │ │ odpowiedź)
│ │ │ │ FUNCTIONS: MiniPostman
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│ │ │ │ icons, apiClient
│ │ │ │ -->
│ │ │ ├── RegexTester.jsx <!-- VERSION: 0.0.3 PATH: src/ui/tools/RegexTester.jsx
│ │ │ │ PURPOSE: Testowanie wyrażeń regularnych
│ │ │ │ FUNCTIONS: RegexTester
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│ │ │ │ regexEngine
│ │ │ │ -->
│ │ │ ├── RemoveBgTool.jsx <!-- VERSION: 0.0.3 PATH: src/ui/tools/RemoveBgTool.jsx
│ │ │ │ PURPOSE: Narzędzie do masowego usuwania tła ze zdjęć przez API
│ │ │ │ remove.bg.
│ │ │ │ FUNCTIONS: RemoveBgTool
│ │ │ │ DEPENDS ON: react, axios, icons, translations.js, loggerRenderer,
│ │ │ │ config, notificationsManager.js
│ │ │ │ -->
│ │ │ ├── StringCombiner.jsx <!-- VERSION: 0.0.3 PATH: src/ui/tools/StringCombiner.jsx
│ │ │ │ PURPOSE: Generator kombinacji stringów. Podajesz tekst bazowy,
│ │ │ │ znak podziału
│ │ │ │ FUNCTIONS: StringCombiner
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, icons, translations.js
│ │ │ │ -->
│ │ │ ├── SvgToPngConverter.jsx <!-- VERSION: 0.0.3 PATH: src/ui/tools/SvgToPngConverter.jsx
│ │ │ │ PURPOSE: Konwersja SVG → PNG z wyborem rozdzielczości (drag &
│ │ │ │ drop, preview)
│ │ │ │ FUNCTIONS: SvgToPngConverter
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer,
│ │ │ │ icons, svgToPng
│ │ │ │ -->
│ │ │ └── ToolsPanel.jsx <!-- VERSION: 0.0.3 PATH: src/ui/tools/ToolsPanel.jsx
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
│ │ ├── views/
│ │ │ ├── ContentRenderer.jsx <!-- VERSION: 0.0.3 PATH: src/ui/views/ContentRenderer.jsx
│ │ │ │ PURPOSE: Router widoków — deleguje do WebViewContainer,
│ │ │ │ ToolsContainer lub SettingsContainer
│ │ │ │ FUNCTIONS: ContentRenderer
│ │ │ │ DEPENDS ON: react, icons.js, loggerRenderer.js, translations.js,
│ │ │ │ WebViewContainer.jsx, ToolsContainer.jsx,
│ │ │ │ SettingsContainer.jsx
│ │ │ │ -->
│ │ │ ├── SettingsContainer.jsx <!-- VERSION: 0.0.3 PATH: src/ui/views/SettingsContainer.jsx
│ │ │ │ PURPOSE: Kontener renderowania widoków
│ │ │ │ ustawień/pomocy/historii/zadań. Używa SETTINGS_REGISTRY
│ │ │ │ zamiast switch-case — nowy widok = wpis w
│ │ │ │ src/config/settingsRegistryConfig.js, bez modyfikacji
│ │ │ │ kontenera.
│ │ │ │ FUNCTIONS: SettingsContainer
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, translations.js,
│ │ │ │ Spinner.jsx, settingsRegistryConfig.js
│ │ │ │ -->
│ │ │ ├── Spinner.jsx <!-- VERSION: 0.0.3 PATH: src/ui/views/Spinner.jsx
│ │ │ │ PURPOSE: Współdzielony komponent wizualny wskaźnika ładowania
│ │ │ │ (loader). Wykorzystywany jako fallback dla React
│ │ │ │ Suspense oraz podczas asynchronicznych operacji I/O.
│ │ │ │ FUNCTIONS: Spinner
│ │ │ │ DEPENDS ON: react, loggerRenderer.js
│ │ │ │ -->
│ │ │ ├── ToolsContainer.jsx <!-- VERSION: 0.0.3 PATH: src/ui/views/ToolsContainer.jsx
│ │ │ │ PURPOSE: Kontener renderowania narzędzi specjalnych. Używa
│ │ │ │ TOOLS_REGISTRY zamiast switch-case – nowe narzędzie =
│ │ │ │ wpis w src/config/toolsRegistryConfig.js, bez
│ │ │ │ modyfikacji kontenera.
│ │ │ │ FUNCTIONS: ToolsContainer
│ │ │ │ DEPENDS ON: react, loggerRenderer.js, translations.js,
│ │ │ │ Spinner.jsx, toolsRegistryConfig.js
│ │ │ │ -->
│ │ │ └── WebViewContainer.jsx <!-- VERSION: 0.0.3 PATH: src/ui/views/WebViewContainer.jsx
│ │ │ PURPOSE: Kontener renderowania WebView dla aktywnego profilu
│ │ │ FUNCTIONS: WebViewContainer
│ │ │ DEPENDS ON: react, Spinner.jsx, loggerRenderer.js
│ │ │ -->
│ │ ├── webview/
│ │ │ ├── WebViewTab.jsx <!-- VERSION: 0.0.3 PATH: src/ui/webview/WebViewTab.jsx
│ │ │ │ PURPOSE: Zakładka WebView – lifecycle, nawigacja, zoom,
│ │ │ │ recovery, logowanie błędów
│ │ │ │ FUNCTIONS: WebViewTab
│ │ │ │ DEPENDS ON: react, config.js, translations.js, loggerRenderer.js,
│ │ │ │ WebViewToolbar.jsx, useWebViewEvents.js,
│ │ │ │ useWebViewActions.js
│ │ │ │ -->
│ │ │ └── WebViewToolbar.jsx <!-- VERSION: 0.0.3 PATH: src/ui/webview/WebViewToolbar.jsx
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
│ ├── utils/
│ │ ├── StorageService.js <!-- VERSION: 0.0.3 PATH: src/utils/StorageService.js
│ │ │ PURPOSE: Centralna warstwa dostępu do danych w procesie
│ │ │ renderera – cache per klucz z TTL, pattern observer
│ │ │ (subscribe/notify), ujednolicone invoke do IPC,
│ │ │ deduplicacja równoległych żądań. Używana przez hooki
│ │ │ danych (useProfiles, useSettings i inne).
│ │ │ FUNCTIONS: -
│ │ │ DEPENDS ON: loggerRenderer.js
│ │ │ -->
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
│ │ ├── logger.js <!-- VERSION: 0.0.3 PATH: src/utils/logger.js
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
│ │ ├── notepadStorage.js <!-- VERSION: 0.0.3 PATH: src/utils/notepadStorage.js
│ │ │ PURPOSE: Pomocnicze funkcje zapisu i odczytu notatek oraz
│ │ │ fabryka zakładek
│ │ │ FUNCTIONS: createNewTab, loadnotepadFromStorage,
│ │ │ savenotepadToStorage
│ │ │ DEPENDS ON: logger.js
│ │ │ -->
│ │ ├── notificationsManager.js <!-- VERSION: 0.0.3 PATH: src/utils/notificationsManager.js
│ │ │ PURPOSE: Fasada globalnego systemu powiadomień — dispatchuje
│ │ │ toasty UI przez CustomEvent do ToastContainer oraz
│ │ │ wywołuje systemowe powiadomienia OS przez IPC. Nie
│ │ │ zarządza stanem React.
│ │ │ FUNCTIONS: showToast, showSystemNotification
│ │ │ DEPENDS ON: logger.js
│ │ │ -->
│ │ ├── persistence.js <!-- VERSION: 0.0.3 PATH: src/utils/persistence.js
│ │ │ PURPOSE: Wspólne operacje I/O dla plików JSON – odczyt, zapis i
│ │ │ zarządzanie ścieżkami w katalogu userData Electrona.
│ │ │ FUNCTIONS: getUserDataPath, readJsonFile, writeJsonFile
│ │ │ DEPENDS ON: fs, path, electron, logger.js
│ │ │ -->
│ │ ├── searchIndex.js <!-- VERSION: 0.0.3 PATH: src/utils/searchIndex.js
│ │ │ PURPOSE: Budowanie ujednoliconego indeksu wyszukiwania
│ │ │ (profiles, projects, tasks, notepad) dla globalnej
│ │ │ palety komend (Ctrl+K) i globalnego wyszukiwania w
│ │ │ sidebarze.
│ │ │ FUNCTIONS: buildSearchIndex, searchAll
│ │ │ DEPENDS ON: logger.js
│ │ │ -->
│ │ ├── sharpLoader.js <!-- VERSION: 0.0.3 PATH: src/utils/sharpLoader.js
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
│ │ └── yamlLoader.js <!-- VERSION: 0.0.3 PATH: src/utils/yamlLoader.js
│ │ PURPOSE: Leniwe ładowanie modułu js-yaml
│ │ (parsowanie/serializacja YAML) z obsługą braku
│ │ zależności. Używane przez ipcMainHandlers_jsonYaml.js w
│ │ main process.
│ │ FUNCTIONS: loadYaml
│ │ DEPENDS ON: komponenty z folderu yaml/
│ │ -->
│ ├── App.jsx <!-- VERSION: 0.0.3 PATH: src/App.jsx
│ │ PURPOSE: Główny komponent root aplikacji React – zarządza
│ │ przełączaniem widoków (Splash/Onboarding/Layout).
│ │ FUNCTIONS: App
│ │ DEPENDS ON: react, translations.js, useAppInitialization.js,
│ │ MainLayout.jsx, Spinner.jsx, SplashScreen.jsx,
│ │ OnboardingScreen.jsx, ToastContainer.jsx,
│ │ ErrorBoundary.jsx
│ │ -->
│ ├── config.js <!-- VERSION: 0.0.3 PATH: src/config.js
│ │ PURPOSE: Re-eksport centralnej konfiguracji aplikacji z
│ │ src/config/*. Wszystkie importy from '../config.js' lub
│ │ '../../config.js' trafiają tutaj. Nie modyfikuj tego
│ │ pliku bezpośrednio – edytuj podpliki w src/config/.
│ │ FUNCTIONS: -
│ │ DEPENDS ON: appConfig.js, featuresConfig.js, limitsConfig.js,
│ │ pathsConfig.js, settingsConfig.js,
│ │ endpointsConfig.js
│ │ -->
│ └── index.jsx <!-- VERSION: 0.0.3 PATH: src/index.jsx
│ PURPOSE: Punkt wejścia aplikacji React. Montuje <App /> w #root,
│ FUNCTIONS: -
│ DEPENDS ON: react, react-dom, useTranslation, App
│ -->
├── tests/
│ ├── TestRunner.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner.js
│ │ PURPOSE: Orchestrator testów – uruchamia wszystkie
│ │ TestRunner_*.js
│ │ FUNCTIONS: runAllTests
│ │ DEPENDS ON: url, logger.js, icons.js, logWriter.js,
│ │ testsLoader.js
│ │ -->
│ ├── TestRunner_Aggregated.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Aggregated.js
│ │ PURPOSE: Testy logiki domenowej systemu zadań: model danych,
│ │ reguły section↔status, normalizeTask, tasksStore CRUD.
│ │ Testy izolowane – nie wymagają Electron ani IPC.
│ │ FUNCTIONS: runTasksTests
│ │ DEPENDS ON: testUtils.js, taskPanelStore.js
│ │ -->
│ ├── TestRunner_App.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_App.js
│ │ PURPOSE: Testy głównego komponentu App – eksporty, logika
│ │ firstRun, integracja SplashScreen/Onboarding
│ │ FUNCTIONS: runAppTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_AppLibrary.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_AppLibrary.js
│ │ PURPOSE: Testy UI biblioteki aplikacji - eksport komponentu
│ │ AppLibraryBrowser.
│ │ FUNCTIONS: runAppLibraryTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_Assets.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Assets.js
│ │ PURPOSE: Testy spójności plików w folderze assets/ — obecność,
│ │ rozszerzenia, rozmiar.
│ │ FUNCTIONS: runAssetsTests
│ │ DEPENDS ON: fs, testUtils.js, path
│ │ -->
│ ├── TestRunner_BusinessLogic.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_BusinessLogic.js
│ │ PURPOSE: Testy czystych funkcji biznesowych (cartesian,
│ │ parseSplitChar, sortByPin, normalizeUrl)
│ │ FUNCTIONS: runBusinessLogicTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_CSS.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_CSS.js
│ │ PURPOSE: Testy spójności plików CSS — src/ui/index.css importuje
│ │ layout.css + styles/theme.css + styles/components.css,
│ │ brak kołowych zależności.
│ │ FUNCTIONS: runCssTests
│ │ DEPENDS ON: fs, testUtils.js, path
│ │ -->
│ ├── TestRunner_Common.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Common.js
│ │ PURPOSE: Testy wspolnych komponentow UI - ContextMenu i
│ │ kontrakty menu.
│ │ FUNCTIONS: runCommonTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_Config.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Config.js
│ │ PURPOSE: Testy modułów konfiguracyjnych z src/config/* —
│ │ features, limits, settings, app, paths, endpoints oraz
│ │ re-eksportu przez src/config.js.
│ │ FUNCTIONS: runConfigTests
│ │ DEPENDS ON: fs, testUtils.js, path
│ │ -->
│ ├── TestRunner_ConfigFeatures.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_ConfigFeatures.js
│ │ PURPOSE: Testy modułu feature flags
│ │ (src/config/featuresConfig.js) — isFeatureEnabled,
│ │ isToolEnabled, spójność FEATURES.
│ │ FUNCTIONS: runFeaturesTests
│ │ DEPENDS ON: path, testUtils.js
│ │ -->
│ ├── TestRunner_ConfigLimits.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_ConfigLimits.js
│ │ PURPOSE: Testy modułu limitów aplikacji
│ │ (src/config/limitsConfig.js) — LIMITS, getLimit.
│ │ FUNCTIONS: runLimitsTests
│ │ DEPENDS ON: testUtils.js, path
│ │ -->
│ ├── TestRunner_ConfigRegistries.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_ConfigRegistries.js
│ │ PURPOSE: Testy rejestrów komponentów (settingsRegistry,
│ │ toolsRegistry) – eksporty, kompletność wpisów,
│ │ featureFlag, getSettingsComponent/getToolComponent.
│ │ FUNCTIONS: runRegistriesTests
│ │ DEPENDS ON: testUtils.js, fs, path
│ │ -->
│ ├── TestRunner_Doc.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Doc.js
│ │ PURPOSE: Testy spójności dokumentacji w folderze doc/ — obecność
│ │ plików, nagłówki MD, README.
│ │ FUNCTIONS: runDocTests
│ │ DEPENDS ON: fs, testUtils.js, path
│ │ -->
│ ├── TestRunner_ElectronAPI.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_ElectronAPI.js
│ │ PURPOSE: Testy dostępności i poprawności metod
│ │ window.electronAPI (preload bridge). Weryfikuje
│ │ obecność, typy i brak legacy metod.
│ │ FUNCTIONS: runElectronAPITests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_Engine.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Engine.js
│ │ PURPOSE: Testy modułów silnika głównego: webviewRegistry,
│ │ resourceMonitor, webviewScriptInjector, hotkeysManager.
│ │ FUNCTIONS: runMainEngineTests
│ │ DEPENDS ON: testUtils.js, path
│ │ -->
│ ├── TestRunner_EngineAdBlocker.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_EngineAdBlocker.js
│ │ PURPOSE: Testy jednostkowe dla AdBlockera (globalny + per
│ │ profil, wykrywanie URL)
│ │ FUNCTIONS: runAdBlockerTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_EngineSleepTabs.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_EngineSleepTabs.js
│ │ PURPOSE: Testy jednostkowe dla Sleep Tabs – sleepTabsManager
│ │ (getSleepTimeoutMs, shouldSleepTab, markTabActive,
│ │ getSleepPlaceholderState)
│ │ FUNCTIONS: runSleepTabsTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_EngineUpdate.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_EngineUpdate.js
│ │ PURPOSE: Testy serwisu aktualizacji
│ │ (src/engine/updateService.js) — checkForUpdates stub +
│ │ kształt odpowiedzi.
│ │ FUNCTIONS: runUpdateTests
│ │ DEPENDS ON: testUtils.js, path
│ │ -->
│ ├── TestRunner_Help.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Help.js
│ │ PURPOSE: Testy komponentow pomocy - HelpSection, Shortcut,
│ │ ToolCard.
│ │ FUNCTIONS: runHelpTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_History.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_History.js
│ │ PURPOSE: Testy historii aktywności — historyStore CRUD,
│ │ walidacja struktury wpisów, filtrowanie, limit FIFO.
│ │ FUNCTIONS: runHistoryTests
│ │ DEPENDS ON: testUtils.js, path
│ │ -->
│ ├── TestRunner_Hooks.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Hooks.js
│ │ PURPOSE: Testy hooków React – weryfikacja eksportów, obsługi
│ │ błędów i struktury zwracanych danych przez mock
│ │ electronAPI.
│ │ FUNCTIONS: runHooksTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_HooksCategories.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_HooksCategories.js
│ │ PURPOSE: Testy hooka useCategories – CRUD kategorii, stan
│ │ zwinięcia, persistencja przez mock electronAPI.
│ │ FUNCTIONS: runCategoriesTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_HooksUseAsync.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_HooksUseAsync.js
│ │ PURPOSE: Testy hooka useAsync i useAsyncMutation – poprawność
│ │ stanów loading/error/data, obsługa błędów IPC,
│ │ optimistic updates, rollback.
│ │ FUNCTIONS: runUseAsyncTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_IPC.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_IPC.js
│ │ PURPOSE: Testy dostępności wszystkich kanałów IPC przez
│ │ window.electronAPI – profiles, settings, history,
│ │ workspaces, tasks, terminal, notes, hotkeys, adBlocker,
│ │ webview, tools, search, logs.
│ │ FUNCTIONS: runIPCTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_Icons.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Icons.js
│ │ PURPOSE: Testy integralności ikon (ICONS, SIDEBAR_ICON_MAP)
│ │ FUNCTIONS: runIconsTests
│ │ DEPENDS ON: testUtils.js, icons.js, constants.js
│ │ -->
│ ├── TestRunner_IpcChannels.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_IpcChannels.js
│ │ PURPOSE: Testy rejestru kanałów IPC
│ │ (src/constants/ipcChannels.js) — kompletność wszystkich
│ │ grup, obecność każdej stałej, brak duplikatów wartości,
│ │ format string 'group:action', rozróżnienie kanałów
│ │ invoke vs event.
│ │ FUNCTIONS: runIpcChannelsTests
│ │ DEPENDS ON: testUtils.js, path
│ │ -->
│ ├── TestRunner_Layout.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Layout.js
│ │ PURPOSE: Testy layoutu aplikacji - eksport MainLayout.
│ │ FUNCTIONS: runLayoutTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_Loaders.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Loaders.js
│ │ PURPOSE: Testy loaderów dynamicznych — ipcLoader
│ │ (loadAllIpcHandlers) i testsLoader (loadAndRunAllTests)
│ │ — eksporty, kształt odpowiedzi, wykrywanie plików.
│ │ FUNCTIONS: runLoadersTests
│ │ DEPENDS ON: testUtils.js, path, fs
│ │ -->
│ ├── TestRunner_Locales.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Locales.js
│ │ PURPOSE: Testy integralnosci plikow locales - sekcje, klucze
│ │ krytyczne i help JSON.
│ │ FUNCTIONS: runLocalesTests
│ │ DEPENDS ON: fs, path, testUtils.js, config.js
│ │ -->
│ ├── TestRunner_LogWriter.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_LogWriter.js
│ │ PURPOSE: Testy dla LogWritera – eksport funkcji, logika
│ │ formatowania wpisów, guard debugMode.
│ │ FUNCTIONS: runLogWriterTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_Modals.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Modals.js
│ │ PURPOSE: Testy komponentow modalnych – eksporty JSX (Modal,
│ │ ConfirmModal, CategoryModal, ProfileModal, PromptModal,
│ │ CommentModal, TaskModal)
│ │ FUNCTIONS: runModalsTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_Notepad.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Notepad.js
│ │ PURPOSE: Testy modułu notatnika — notepadStorage (createNewTab,
│ │ load/save), notepadStore (CRUD), dirty-checking i
│ │ logika zakładek.
│ │ FUNCTIONS: runNotepadTests
│ │ DEPENDS ON: testUtils.js, path
│ │ -->
│ ├── TestRunner_Onboarding.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Onboarding.js
│ │ PURPOSE: Testy komponentów onboardingu – eksporty kroków i
│ │ komponentu głównego (checkSourceExport), logika
│ │ walidacji kroków, config onboardingu.
│ │ FUNCTIONS: runOnboardingTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_Profiles.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Profiles.js
│ │ PURPOSE: Testy zarządzania profilami WebView — struktura danych,
│ │ profilesStore CRUD, sortowanie, kategorie,
│ │ defaultProfiles.json.
│ │ FUNCTIONS: runProfilesTests
│ │ DEPENDS ON: testUtils.js, path, fs
│ │ -->
│ ├── TestRunner_Projects.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Projects.js
│ │ PURPOSE: Testy modułu projektów — struktura, projectsStore CRUD,
│ │ archiwizacja, agregacja zadań.
│ │ FUNCTIONS: runProjectsTests
│ │ DEPENDS ON: testUtils.js, path
│ │ -->
│ ├── TestRunner_Reexport.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Reexport.js
│ │ PURPOSE: Testy poprawności re-eksportów (config.js, icons.js)
│ │ FUNCTIONS: runReexportTests
│ │ DEPENDS ON: fs, testUtils.js, path
│ │ -->
│ ├── TestRunner_Settings.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Settings.js
│ │ PURPOSE: Testy silnika ustawień — merge logika,
│ │ getDefaultSetting, DEBUG_MODULES, settingsStore CRUD.
│ │ FUNCTIONS: runSettingsTests
│ │ DEPENDS ON: testUtils.js, path
│ │ -->
│ ├── TestRunner_Sidebar.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Sidebar.js
│ │ PURPOSE: Testy komponentow sidebara oraz podstawowej logiki list
│ │ profili.
│ │ FUNCTIONS: runSidebarTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_Stores.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Stores.js
│ │ PURPOSE: Testy wszystkich stores (main process) — eksporty CRUD,
│ │ logika domenowa: workspacesStore, accountsStore,
│ │ clipboardStore, taskGroupsStore, appLibraryStore,
│ │ tasksStore (VALID_STATUSES, STATUS_TO_SECTION,
│ │ resolveSection, normalizeTask).
│ │ FUNCTIONS: runStoresTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_System.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_System.js
│ │ PURPOSE: Testy komponentow systemowych - ModalPortal,
│ │ ToastContainer, UpdateChecker.
│ │ FUNCTIONS: runSystemTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_SystemSplashScreen.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_SystemSplashScreen.js
│ │ PURPOSE: Testy komponentu SplashScreen – eksport, logika
│ │ animacji i konfiguracja.
│ │ FUNCTIONS: runSplashScreenTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_SystemToast.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_SystemToast.js
│ │ PURPOSE: Testy systemu toastów – reducer, konfiguracja, stałe,
│ │ kolejkowanie
│ │ FUNCTIONS: runToastTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_TaskPanel.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_TaskPanel.js
│ │ PURPOSE: Testy integracyjne komponentów UI TaskPanel
│ │ (src/ui/taskpanel) i AggregatedTasks (src/ui/tasks).
│ │ Weryfikuje eksporty komponentów, stałe, IPC API dla
│ │ TaskGroups oraz logikę AggregatedTasks.
│ │ FUNCTIONS: runTasksPanelTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_Terminal.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Terminal.js
│ │ PURPOSE: Testy jednostkowe dla Terminala (xterm, node-pty,
│ │ historia, ANSI, multi-session API)
│ │ FUNCTIONS: runTerminalTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_Tools.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Tools.js
│ │ PURPOSE: Testy silników narzędzi (src/tools/*) —
│ │ regexEngine.testRegex, markdownRenderer.renderMarkdown,
│ │ apiClient (apiFetch/apiGet/apiPost/apiRequest) oraz
│ │ logika UI narzędzi (JSON, Clipboard, Markdown).
│ │ FUNCTIONS: runToolsTests
│ │ DEPENDS ON: testUtils.js, path
│ │ -->
│ ├── TestRunner_Utils.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Utils.js
│ │ PURPOSE: Testy modułów utils bez osobnych plików testowych:
│ │ logger, testrunner, fileUtils, persistence,
│ │ sharpLoader, yamlLoader, translations, networkUtils,
│ │ imageUtils, notepadStorage. Moduły urlUtils,
│ │ validators, searchIndex, notificationsManager mają
│ │ własne dedykowane pliki TestRunner_*.js i nie są tutaj
│ │ duplikowane.
│ │ FUNCTIONS: runUtilsTests
│ │ DEPENDS ON: testUtils.js, path
│ │ -->
│ ├── TestRunner_UtilsEventLogger.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_UtilsEventLogger.js
│ │ PURPOSE: Testy jednostkowe modułu eventLogger — sanityzacja
│ │ params, guard eventLogEnabled, format wpisu.
│ │ (ARCH_REQ-044)
│ │ FUNCTIONS: runEventLoggerTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_UtilsNotifications.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_UtilsNotifications.js
│ │ PURPOSE: Testy jednostkowe globalnego systemu toastów —
│ │ kolejkowanie, typy, guard toastsEnabled. (UIUX_REQ-021)
│ │ FUNCTIONS: runNotificationsTests
│ │ DEPENDS ON: testUtils.js
│ │ -->
│ ├── TestRunner_UtilsSearchIndex.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_UtilsSearchIndex.js
│ │ PURPOSE: Testy modułu globalnego wyszukiwania
│ │ (src/utils/searchIndex.js) — buildSearchIndex,
│ │ searchAll, filtrowanie i edge cases.
│ │ FUNCTIONS: runSearchIndexTests
│ │ DEPENDS ON: testUtils.js, path
│ │ -->
│ ├── TestRunner_UtilsUrlUtils.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_UtilsUrlUtils.js
│ │ PURPOSE: Testy modułu urlUtils (normalizeWebUrl, isValidWebUrl,
│ │ isSafeUrl) — walidacja URL, blokowanie niebezpiecznych
│ │ schematów, edge cases.
│ │ FUNCTIONS: runUrlUtilsTests
│ │ DEPENDS ON: testUtils.js, path
│ │ -->
│ ├── TestRunner_UtilsValidators.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_UtilsValidators.js
│ │ PURPOSE: Testy modułu validators — ensureString, ensureObject,
│ │ validateUrl, validateEmail, validateLength,
│ │ validateNoSpecialChars, validatePassword,
│ │ validatePhone.
│ │ FUNCTIONS: runValidatorsTests
│ │ DEPENDS ON: testUtils.js, path
│ │ -->
│ ├── TestRunner_Views.js <!-- VERSION: 0.0.3 PATH: tests/TestRunner_Views.js
│ │ PURPOSE: Testy kontenerow widokow - ContentRenderer,
│ │ SettingsContainer, Spinner, ToolsContainer,
│ │ WebViewContainer.
│ │ FUNCTIONS: runViewsTests
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
│ logowanie, mocki)
│ FUNCTIONS: safeImport, checkSourceExport, mockElectronAPI,
│ mockTranslationContext, runTests
│ DEPENDS ON: icons.js, url, path, fs, ...
│ -->
├── config.js <!-- VERSION: 0.0.3 PATH: config.js
│ PURPOSE: Re-eksport konfiguracji z src/config.js.
│ FUNCTIONS: -
│ DEPENDS ON: config.js
│ -->
├── main.js <!-- VERSION: 0.0.3 PATH: main.js
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
├── preload.cjs <!-- VERSION: 0.0.3 PATH: preload.cjs
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
