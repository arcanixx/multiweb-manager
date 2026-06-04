<!-- =============================================================================
 FILE: AI_Repository_Access.md
 PATH: doc/AI_Repository_Access.md
 VERSION: 0.0.3
 PURPOSE: Dokumentacja specyfikacji projektowej - Mapowanie bezpośrednich odnośników RAW dla modeli AI (Claude).
 FUNCTIONS: -
 DEPENDS ON: -
 UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
 ============================================================================= -->

# Instrukcja dostępu do kodu źródłowego dla AI

Drogi Asystencie/Modelu AI, poniżej znajduje się mapa struktury plików naszego projektu. 
Wszystkie pliki posiadają bezpośrednie odnośniki **RAW**. Jeśli potrzebujesz przeanalizować, zmodyfikować lub zrozumieć działanie dowolnego modułu, kliknij lub pobierz zawartość poprzez przypisany do niego link URL.

* **Wybrany Branch:** `UAT-v0.0.4`
* **Baza repozytorium:** `https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/`

## Drzewo Struktury Projektu i Linki RAW:

📁 root/
├── 📁 📁 assets/
│   ├── 🖼️ [app-icon.ico](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/assets/app-icon.ico)
│   ├── 🖼️ [app-icon.png](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/assets/app-icon.png)
│   ├── 🖼️ [multiweb_manager_architecture_graph.png](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/assets/multiweb_manager_architecture_graph.png)
│   └── 📊 [splash_logo.svg](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/assets/splash_logo.svg)
├── 📁 📁 doc/
│   ├── 📄 [AI_Development_Standards.md](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/doc/AI_Development_Standards.md)
│   ├── 📄 [AI_Repository_Access.md](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/doc/AI_Repository_Access.md)
│   ├── 📄 [Definition_Mockups_UI_UX.md](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/doc/Definition_Mockups_UI_UX.md)
│   ├── 📄 [DevelopersGuide.md](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/doc/DevelopersGuide.md)
│   ├── 📄 [Global_Project_Starter_Guide.md](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/doc/Global_Project_Starter_Guide.md)
│   ├── 📄 [ModulesOverview.md](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/doc/ModulesOverview.md)
│   ├── 📄 [Project_Initialization_Guide.md](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/doc/Project_Initialization_Guide.md)
│   ├── 📄 [Requirements.md](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/doc/Requirements.md)
│   ├── 📄 [Structure.md](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/doc/Structure.md)
│   ├── 📄 [Structure_light.md](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/doc/Structure_light.md)
│   └── 📄 [pending_updates_for_Definition_Mockups_UI_UX.md](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/doc/pending_updates_for_Definition_Mockups_UI_UX.md)
├── 📁 📁 public/
│   └── 🌐 [index.html](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/public/index.html)
├── 📁 📁 src/
│   ├── 📁 📁 constants/
│   │   └── 📜 [ipcChannels.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/constants/ipcChannels.js)
│   ├── 📁 📁 data/
│   │   ├── 📦 [app-library.json](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/data/app-library.json)
│   │   ├── 📦 [defaultProfiles.json](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/data/defaultProfiles.json)
│   │   ├── 📦 [defaultSettings.json](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/data/defaultSettings.json)
│   │   └── 📜 [icons.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/data/icons.js)
│   ├── 📁 📁 engine/
│   │   ├── 📜 [adBlocker.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/engine/adBlocker.js)
│   │   ├── 📜 [hotkeysManager.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/engine/hotkeysManager.js)
│   │   ├── 📜 [sleepTabsManager.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/engine/sleepTabsManager.js)
│   │   ├── 📜 [updateService.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/engine/updateService.js)
│   │   └── 📜 [webviewRegistry.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/engine/webviewRegistry.js)
│   ├── 📁 📁 hooks/
│   │   ├── 📜 [useAppLibrary.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/hooks/useAppLibrary.js)
│   │   ├── 📜 [useCategories.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/hooks/useCategories.js)
│   │   ├── 📜 [useHistoryLog.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/hooks/useHistoryLog.js)
│   │   ├── 📜 [useMainLayout.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/hooks/useMainLayout.js)
│   │   ├── 📜 [useNotepadContent.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/hooks/useNotepadContent.js)
│   │   ├── 📜 [useNotepadFindReplace.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/hooks/useNotepadFindReplace.js)
│   │   ├── 📜 [useNotepadTabs.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/hooks/useNotepadTabs.js)
│   │   ├── 📜 [useNotepadUI.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/hooks/useNotepadUI.js)
│   │   ├── 📜 [useProfiles.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/hooks/useProfiles.js)
│   │   ├── 📜 [useProjects.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/hooks/useProjects.js)
│   │   ├── 📜 [useSettings.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/hooks/useSettings.js)
│   │   ├── 📜 [useSidebarSearch.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/hooks/useSidebarSearch.js)
│   │   ├── 📜 [useTaskGroups.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/hooks/useTaskGroups.js)
│   │   ├── 📜 [useTasks.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/hooks/useTasks.js)
│   │   ├── 📜 [useTranslation.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/hooks/useTranslation.js)
│   │   ├── 📜 [useWebViewActions.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/hooks/useWebViewActions.js)
│   │   ├── 📜 [useWebViewEvents.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/hooks/useWebViewEvents.js)
│   │   └── 📜 [useWorkspaces.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/hooks/useWorkspaces.js)
│   ├── 📁 📁 ipc/
│   │   ├── 📜 [ipcMainHandlers_adBlocker.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_adBlocker.js)
│   │   ├── 📜 [ipcMainHandlers_aggregatedTasks.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_aggregatedTasks.js)
│   │   ├── 📜 [ipcMainHandlers_app.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_app.js)
│   │   ├── 📜 [ipcMainHandlers_appInfo.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_appInfo.js)
│   │   ├── 📜 [ipcMainHandlers_appLibrary.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_appLibrary.js)
│   │   ├── 📜 [ipcMainHandlers_cookies.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_cookies.js)
│   │   ├── 📜 [ipcMainHandlers_dialogs.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_dialogs.js)
│   │   ├── 📜 [ipcMainHandlers_fileApi.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_fileApi.js)
│   │   ├── 📜 [ipcMainHandlers_fileSystem.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_fileSystem.js)
│   │   ├── 📜 [ipcMainHandlers_files.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_files.js)
│   │   ├── 📜 [ipcMainHandlers_history.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_history.js)
│   │   ├── 📜 [ipcMainHandlers_hotkeys.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_hotkeys.js)
│   │   ├── 📜 [ipcMainHandlers_imageSharp.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_imageSharp.js)
│   │   ├── 📜 [ipcMainHandlers_jsonYaml.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_jsonYaml.js)
│   │   ├── 📜 [ipcMainHandlers_logs.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_logs.js)
│   │   ├── 📜 [ipcMainHandlers_notes.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_notes.js)
│   │   ├── 📜 [ipcMainHandlers_notifications.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_notifications.js)
│   │   ├── 📜 [ipcMainHandlers_openExternal.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_openExternal.js)
│   │   ├── 📜 [ipcMainHandlers_pathUtils.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_pathUtils.js)
│   │   ├── 📜 [ipcMainHandlers_profiles.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_profiles.js)
│   │   ├── 📜 [ipcMainHandlers_projects.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_projects.js)
│   │   ├── 📜 [ipcMainHandlers_regexMarkdown.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_regexMarkdown.js)
│   │   ├── 📜 [ipcMainHandlers_search.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_search.js)
│   │   ├── 📜 [ipcMainHandlers_settings.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_settings.js)
│   │   ├── 📜 [ipcMainHandlers_svgToPng.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_svgToPng.js)
│   │   ├── 📜 [ipcMainHandlers_taskGroups.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_taskGroups.js)
│   │   ├── 📜 [ipcMainHandlers_tasks.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_tasks.js)
│   │   ├── 📜 [ipcMainHandlers_terminal.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_terminal.js)
│   │   ├── 📜 [ipcMainHandlers_webview_cache.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_webview_cache.js)
│   │   ├── 📜 [ipcMainHandlers_webview_controls.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_webview_controls.js)
│   │   ├── 📜 [ipcMainHandlers_webview_extra.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_webview_extra.js)
│   │   ├── 📜 [ipcMainHandlers_webview_httpErrors.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_webview_httpErrors.js)
│   │   ├── 📜 [ipcMainHandlers_webview_nav.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_webview_nav.js)
│   │   ├── 📜 [ipcMainHandlers_webview_screenshot.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_webview_screenshot.js)
│   │   └── 📜 [ipcMainHandlers_workspaces.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ipc/ipcMainHandlers_workspaces.js)
│   ├── 📁 📁 loaders/
│   │   ├── 📜 [ipcLoader.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/loaders/ipcLoader.js)
│   │   │   📁 DEPENDS ON: komponenty z folderu ipc/
│   │   └── 📜 [testsLoader.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/loaders/testsLoader.js)
│   │   📁 DEPENDS ON: komponenty z folderu tests/
│   ├── 📁 📁 locales/
│   │   ├── 📁 📁 templates/
│   │   │   ├── 📦 [help.template.json](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/locales/templates/help.template.json)
│   │   │   └── 📦 [lang.template.json](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/locales/templates/lang.template.json)
│   │   ├── 📦 [en.json](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/locales/en.json)
│   │   ├── 📦 [help_en.json](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/locales/help_en.json)
│   │   ├── 📦 [help_pl.json](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/locales/help_pl.json)
│   │   └── 📦 [pl.json](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/locales/pl.json)
│   ├── 📁 📁 stores/
│   │   ├── 📜 [accountsStore.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/stores/accountsStore.js)
│   │   ├── 📜 [appLibraryStore.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/stores/appLibraryStore.js)
│   │   ├── 📜 [clipboardStore.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/stores/clipboardStore.js)
│   │   ├── 📜 [historyStore.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/stores/historyStore.js)
│   │   ├── 📜 [notesStore.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/stores/notesStore.js)
│   │   ├── 📜 [persistence.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/stores/persistence.js)
│   │   ├── 📜 [profilesStore.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/stores/profilesStore.js)
│   │   ├── 📜 [projectsStore.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/stores/projectsStore.js)
│   │   ├── 📜 [resourceMonitor.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/stores/resourceMonitor.js)
│   │   ├── 📜 [settingsStore.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/stores/settingsStore.js)
│   │   ├── 📜 [taskGroupsStore.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/stores/taskGroupsStore.js)
│   │   ├── 📜 [tasksStore.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/stores/tasksStore.js)
│   │   └── 📜 [workspacesStore.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/stores/workspacesStore.js)
│   ├── 📁 📁 tools/
│   │   ├── 📜 [apiClient.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/tools/apiClient.js)
│   │   ├── 📜 [markdownRenderer.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/tools/markdownRenderer.js)
│   │   ├── 📜 [regexEngine.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/tools/regexEngine.js)
│   │   └── 📜 [svgToPng.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/tools/svgToPng.js)
│   ├── 📁 📁 ui/
│   │   ├── 📁 📁 appLibrary/
│   │   │   └── ⚛️ [AppLibraryBrowser.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/appLibrary/AppLibraryBrowser.jsx)
│   │   ├── 📁 📁 help/
│   │   │   ├── ⚛️ [FAQ.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/help/FAQ.jsx)
│   │   │   ├── ⚛️ [Help.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/help/Help.jsx)
│   │   │   ├── ⚛️ [HelpSection.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/help/HelpSection.jsx)
│   │   │   ├── ⚛️ [Shortcut.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/help/Shortcut.jsx)
│   │   │   └── ⚛️ [ToolCard.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/help/ToolCard.jsx)
│   │   ├── 📁 📁 history/
│   │   │   ├── ⚛️ [HistoryExport.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/history/HistoryExport.jsx)
│   │   │   ├── ⚛️ [HistoryFilters.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/history/HistoryFilters.jsx)
│   │   │   ├── ⚛️ [HistoryList.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/history/HistoryList.jsx)
│   │   │   └── ⚛️ [HistoryLog.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/history/HistoryLog.jsx)
│   │   ├── 📁 📁 layout/
│   │   │   └── ⚛️ [MainLayout.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/layout/MainLayout.jsx)
│   │   ├── 📁 📁 modals/
│   │   │   ├── ⚛️ [CategoryModal.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/modals/CategoryModal.jsx)
│   │   │   ├── ⚛️ [ConfirmModal.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/modals/ConfirmModal.jsx)
│   │   │   ├── ⚛️ [Modal.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/modals/Modal.jsx)
│   │   │   ├── ⚛️ [ProfileModal.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/modals/ProfileModal.jsx)
│   │   │   └── ⚛️ [PromptModal.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/modals/PromptModal.jsx)
│   │   ├── 📁 📁 notepad/
│   │   │   ├── ⚛️ [ClipboardHistoryModal.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/notepad/ClipboardHistoryModal.jsx)
│   │   │   ├── ⚛️ [Notepad.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/notepad/Notepad.jsx)
│   │   │   ├── ⚛️ [NotepadFindReplace.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/notepad/NotepadFindReplace.jsx)
│   │   │   ├── ⚛️ [NotepadStatusBar.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/notepad/NotepadStatusBar.jsx)
│   │   │   ├── ⚛️ [NotepadTabs.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/notepad/NotepadTabs.jsx)
│   │   │   └── ⚛️ [NotepadToolbar.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/notepad/NotepadToolbar.jsx)
│   │   ├── 📁 📁 profiles/
│   │   │   └── ⚛️ [Profiles.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/profiles/Profiles.jsx)
│   │   ├── 📁 📁 projects/
│   │   │   ├── ⚛️ [ProjectList.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/projects/ProjectList.jsx)
│   │   │   ├── ⚛️ [ProjectManager.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/projects/ProjectManager.jsx)
│   │   │   └── ⚛️ [ProjectModal.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/projects/ProjectModal.jsx)
│   │   ├── 📁 📁 settings/
│   │   │   ├── ⚛️ [AccountSection.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/settings/AccountSection.jsx)
│   │   │   ├── ⚛️ [DataManagementSection.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/settings/DataManagementSection.jsx)
│   │   │   ├── ⚛️ [DebugModulesSection.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/settings/DebugModulesSection.jsx)
│   │   │   ├── ⚛️ [GeneralSection.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/settings/GeneralSection.jsx)
│   │   │   ├── ⚛️ [HotkeyModal.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/settings/HotkeyModal.jsx)
│   │   │   ├── ⚛️ [HotkeysList.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/settings/HotkeysList.jsx)
│   │   │   ├── ⚛️ [HotkeysManager.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/settings/HotkeysManager.jsx)
│   │   │   ├── ⚛️ [LogsSection.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/settings/LogsSection.jsx)
│   │   │   ├── ⚛️ [NotificationsSection.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/settings/NotificationsSection.jsx)
│   │   │   ├── ⚛️ [Settings.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/settings/Settings.jsx)
│   │   │   ├── ⚛️ [TabsSection.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/settings/TabsSection.jsx)
│   │   │   └── ⚛️ [WebViewSection.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/settings/WebViewSection.jsx)
│   │   ├── 📁 📁 sidebar/
│   │   │   ├── ⚛️ [ContextMenu.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/sidebar/ContextMenu.jsx)
│   │   │   ├── ⚛️ [Sidebar.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/sidebar/Sidebar.jsx)
│   │   │   ├── ⚛️ [SidebarCategory.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/sidebar/SidebarCategory.jsx)
│   │   │   ├── ⚛️ [SidebarHeader.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/sidebar/SidebarHeader.jsx)
│   │   │   ├── ⚛️ [SidebarProfileItem.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/sidebar/SidebarProfileItem.jsx)
│   │   │   ├── ⚛️ [SidebarProfileList.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/sidebar/SidebarProfileList.jsx)
│   │   │   ├── ⚛️ [SidebarSearch.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/sidebar/SidebarSearch.jsx)
│   │   │   ├── ⚛️ [SidebarTools.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/sidebar/SidebarTools.jsx)
│   │   │   └── ⚛️ [SidebarWorkspaces.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/sidebar/SidebarWorkspaces.jsx)
│   │   ├── 📁 📁 styles/
│   │   │   ├── 🎨 [components.css](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/styles/components.css)
│   │   │   └── 🎨 [theme.css](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/styles/theme.css)
│   │   ├── 📁 📁 system/
│   │   │   ├── ⚛️ [ModalPortal.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/system/ModalPortal.jsx)
│   │   │   ├── ⚛️ [OnboardingScreen.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/system/OnboardingScreen.jsx)
│   │   │   ├── ⚛️ [SplashScreen.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/system/SplashScreen.jsx)
│   │   │   ├── ⚛️ [ToastContainer.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/system/ToastContainer.jsx)
│   │   │   └── ⚛️ [UpdateChecker.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/system/UpdateChecker.jsx)
│   │   ├── 📁 📁 taskpanel/
│   │   │   ├── ⚛️ [CommentModal.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/taskpanel/CommentModal.jsx)
│   │   │   ├── ⚛️ [TaskDetails.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/taskpanel/TaskDetails.jsx)
│   │   │   ├── ⚛️ [TaskEditor.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/taskpanel/TaskEditor.jsx)
│   │   │   ├── ⚛️ [TaskEmptyState.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/taskpanel/TaskEmptyState.jsx)
│   │   │   ├── ⚛️ [TaskItem.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/taskpanel/TaskItem.jsx)
│   │   │   ├── ⚛️ [TaskList.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/taskpanel/TaskList.jsx)
│   │   │   ├── ⚛️ [TaskModal.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/taskpanel/TaskModal.jsx)
│   │   │   ├── ⚛️ [TaskPanel.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/taskpanel/TaskPanel.jsx)
│   │   │   ├── ⚛️ [TaskSection.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/taskpanel/TaskSection.jsx)
│   │   │   └── ⚛️ [TaskSectionList.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/taskpanel/TaskSectionList.jsx)
│   │   ├── 📁 📁 tasks/
│   │   │   ├── ⚛️ [AggregatedProjectSection.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/tasks/AggregatedProjectSection.jsx)
│   │   │   ├── ⚛️ [AggregatedTaskItem.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/tasks/AggregatedTaskItem.jsx)
│   │   │   └── ⚛️ [AggregatedTasks.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/tasks/AggregatedTasks.jsx)
│   │   ├── 📁 📁 terminal/
│   │   │   └── ⚛️ [Terminal.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/terminal/Terminal.jsx)
│   │   ├── 📁 📁 tools/
│   │   │   ├── ⚛️ [ClipboardHistory.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/tools/ClipboardHistory.jsx)
│   │   │   ├── ⚛️ [CookieGrabber.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/tools/CookieGrabber.jsx)
│   │   │   ├── ⚛️ [FilePreviewer.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/tools/FilePreviewer.jsx)
│   │   │   ├── ⚛️ [ImageTools.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/tools/ImageTools.jsx)
│   │   │   ├── ⚛️ [JsonFormatter.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/tools/JsonFormatter.jsx)
│   │   │   ├── ⚛️ [MarkdownPreviewer.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/tools/MarkdownPreviewer.jsx)
│   │   │   ├── ⚛️ [MiniPostman.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/tools/MiniPostman.jsx)
│   │   │   ├── ⚛️ [RegexTester.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/tools/RegexTester.jsx)
│   │   │   ├── ⚛️ [RemoveBgTool.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/tools/RemoveBgTool.jsx)
│   │   │   ├── ⚛️ [StringCombiner.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/tools/StringCombiner.jsx)
│   │   │   ├── ⚛️ [SvgToPngConverter.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/tools/SvgToPngConverter.jsx)
│   │   │   └── ⚛️ [ToolsPanel.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/tools/ToolsPanel.jsx)
│   │   ├── 📁 📁 views/
│   │   │   ├── ⚛️ [ContentRenderer.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/views/ContentRenderer.jsx)
│   │   │   ├── ⚛️ [SettingsContainer.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/views/SettingsContainer.jsx)
│   │   │   ├── ⚛️ [Spinner.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/views/Spinner.jsx)
│   │   │   ├── ⚛️ [ToolsContainer.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/views/ToolsContainer.jsx)
│   │   │   └── ⚛️ [WebViewContainer.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/views/WebViewContainer.jsx)
│   │   ├── 📁 📁 webview/
│   │   │   ├── ⚛️ [WebViewTab.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/webview/WebViewTab.jsx)
│   │   │   └── ⚛️ [WebViewToolbar.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/webview/WebViewToolbar.jsx)
│   │   ├── 🎨 [index.css](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/index.css)
│   │   └── 🎨 [layout.css](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/ui/layout.css)
│   ├── 📁 📁 utils/
│   │   ├── 📜 [eventLogger.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/utils/eventLogger.js)
│   │   ├── 📜 [fileUtils.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/utils/fileUtils.js)
│   │   ├── 📜 [icons.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/utils/icons.js)
│   │   ├── 📜 [imageUtils.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/utils/imageUtils.js)
│   │   ├── 📜 [logWriter.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/utils/logWriter.js)
│   │   ├── 📜 [logger.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/utils/logger.js)
│   │   ├── 📜 [loggerRenderer.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/utils/loggerRenderer.js)
│   │   ├── 📜 [networkUtils.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/utils/networkUtils.js)
│   │   ├── 📜 [notesStorage.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/utils/notesStorage.js)
│   │   ├── 📜 [notificationsManager.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/utils/notificationsManager.js)
│   │   ├── 📜 [searchIndex.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/utils/searchIndex.js)
│   │   ├── 📜 [sharpLoader.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/utils/sharpLoader.js)
│   │   │   📁 DEPENDS ON: komponenty z folderu sharp/
│   │   ├── 📜 [testrunner.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/utils/testrunner.js)
│   │   ├── 📜 [translations.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/utils/translations.js)
│   │   ├── 📜 [urlUtils.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/utils/urlUtils.js)
│   │   ├── 📜 [validators.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/utils/validators.js)
│   │   └── 📜 [yamlLoader.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/utils/yamlLoader.js)
│   │   📁 DEPENDS ON: komponenty z folderu yaml/
│   ├── ⚛️ [App.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/App.jsx)
│   ├── 📜 [config.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/config.js)
│   ├── 📜 [constants.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/constants.js)
│   └── ⚛️ [index.jsx](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/src/index.jsx)
├── 📁 📁 tests/
│   ├── 📜 [TestRunner.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner.js)
│   ├── 📜 [TestRunner_AdBlocker.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_AdBlocker.js)
│   ├── 📜 [TestRunner_Assets.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_Assets.js)
│   │   📁 PURPOSE: Testy spójności plików w folderze assets/
│   ├── 📜 [TestRunner_BusinessLogic.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_BusinessLogic.js)
│   ├── 📜 [TestRunner_CSS.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_CSS.js)
│   ├── 📜 [TestRunner_Categories.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_Categories.js)
│   ├── 📜 [TestRunner_Config.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_Config.js)
│   ├── 📜 [TestRunner_Doc.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_Doc.js)
│   │   📁 PURPOSE: Testy spójności dokumentacji w folderze doc/
│   ├── 📜 [TestRunner_ElectronAPI.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_ElectronAPI.js)
│   ├── 📜 [TestRunner_EventLogger.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_EventLogger.js)
│   ├── 📜 [TestRunner_History.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_History.js)
│   ├── 📜 [TestRunner_Hooks.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_Hooks.js)
│   ├── 📜 [TestRunner_IPC.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_IPC.js)
│   ├── 📜 [TestRunner_Icons.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_Icons.js)
│   ├── 📜 [TestRunner_Locales.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_Locales.js)
│   ├── 📜 [TestRunner_LogWriter.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_LogWriter.js)
│   ├── 📜 [TestRunner_MainEngine.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_MainEngine.js)
│   ├── 📜 [TestRunner_Notepad.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_Notepad.js)
│   ├── 📜 [TestRunner_Notifications.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_Notifications.js)
│   ├── 📜 [TestRunner_Profiles.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_Profiles.js)
│   ├── 📜 [TestRunner_Projects.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_Projects.js)
│   ├── 📜 [TestRunner_Reexport.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_Reexport.js)
│   ├── 📜 [TestRunner_Settings.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_Settings.js)
│   ├── 📜 [TestRunner_SleepTabs.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_SleepTabs.js)
│   ├── 📜 [TestRunner_Store.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_Store.js)
│   ├── 📜 [TestRunner_Tasks.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_Tasks.js)
│   ├── 📜 [TestRunner_Terminal.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_Terminal.js)
│   ├── 📜 [TestRunner_Tools.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_Tools.js)
│   ├── 📜 [TestRunner_WebView.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/TestRunner_WebView.js)
│   └── 📜 [testUtils.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/tests/testUtils.js)
├── 📜 [config.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/config.js)
├── 📜 [main.js](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/main.js)
├── 📦 [package.json](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/package.json)
├── 📄 [preload.cjs](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/preload.cjs)
└── 📄 [readme.md](https://raw.githubusercontent.com/arcanixx/multiweb-manager/refs/heads/UAT-v0.0.4/readme.md)
<!-- TREE END -->
