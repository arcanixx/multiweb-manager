<!-- =============================================================================
 FILE: readme.md
 PATH: readme.md
 VERSION: 0.0.3
 PURPOSE: Dokumentacja specyfikacji projektowej
 FUNCTIONS: Dokumentacja: 14 sekcji głównych
 DEPENDS ON: -
 UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
 ============================================================================= -->

# MultiWeb Manager
**Wersja:** 0.0.3  
**Status:** Development / UAT  
**Stack:** Electron + React (JavaScript, CSS, HTML)
---
## Opis
MultiWeb Manager to aplikacja desktopowa umożliwiająca zarządzanie wieloma kontami webowymi, zadaniami, projektami, notatkami oraz zestawem narzędzi developerskich (JSON formatter, regex tester, markdown previewer, image tools, mini postman i inne). Działa jak zaawansowany menedżer profili z wbudowaną przeglądarką, terminalem i systemem powiadomień.
---
## Główne funkcje
- Sidebar z kategoriami profili (AI, Dev, Design, Productivity, Special Tools)
- WebView z toolbar: Back, Forward, Refresh, Copy URL, Open in browser, Zoom, DevTools, Clear cache, Single App Mode, Screenshot, Resource Monitor
- AdBlocker (globalny + per profil)
- Sleep Tabs (usypianie nieaktywnych zakładek)
- TaskPanel z priorytetami A–E, filtrami, wyszukiwarką, modalem
- AggregatedTasks – zadania pogrupowane według projektów
- Notepad – multi‑tab, autosave tylko przy zmianie
- Terminal (xterm.js + node-pty) z historią komend i kolorowaniem ANSI
- History Log – logi, filtry, eksport
- Settings – General, WebView, Tabs, Notifications, Hotkeys, Data & Logs
- Tools: JSON/YAML/XML Formatter, Regex Tester, Markdown Previewer, Image Tools, SVG→PNG Converter, File Previewer, Mini Postman, Clipboard History, Cookie Grabber
- App Library – lista gotowych aplikacji (WebCatalog‑style)
- Workspaces – przełączanie układów profili
- Dark mode, i18n (PL/EN), toasty, modale, tooltipy
---
## Wymagania
- Node.js 22+ (LTS)
- NPM lub PNPM
- (opcjonalnie) Python 3 + build tools (dla node-pty)
- System operacyjny: Windows / macOS / Linux
---
## Instalacja i uruchomienie
# 1. Sklonuj repozytorium
git clone https://github.com/arcanixx/multiweb-manager.git
cd multiweb-manager
# 2. Przełącz się na branch UAT (lub master)
git checkout UAT-v0.0.4
# 3. Zainstaluj zależności
npm install
# 4. Uruchom w trybie developerskim
npm run dev

Aplikacja uruchomi się w oknie Electron.

---

## Struktura katalogów (skrót)
root/
├── main.js                 # proces główny Electron
├── preload.cjs             # bezpieczny most IPC
├── config.js               # re-eksport konfiguracji (root)
├── public/index.html       # właściwy dokument HTML
├── src/
│   ├── stores/               # store'y (profiles, settings, tasks...)
│   ├── engine/             # silniki (adBlocker, hotkeysManager, sleepTabsManager...)
│   ├── ui/                 # komponenty React (modułowo: sidebar, taskpanel, notepad...)
│   ├── utils/              # logger, testRunner, imageUtils, translations, icons...
│   ├── hooks/              # useTranslation, useSettings, useTasks...
│   ├── data/               # icons.js, app-library.json, defaultSettings.json...
│   ├── locales/            # pl.json, en.json, help_pl/en.json, templates/
│   ├── ipc/                # handlery IPC (ipcMainHandlers_*.js)
│   ├── loaders/            # dynamiczne loadery (testsLoader.js, ipcLoader.js)
│   ├── tools/              # backend narzędzi (sharp, svgToPng...)
│   ├── App.jsx             # główny komponent React
│   ├── index.jsx           # entrypoint React
│   ├── config.js           # konfiguracja (feature flags, limity, ścieżki)
│   └── constants/          # stałe (enumy, kategorie)
├── tests/                  # testRunner_*.js
├── doc/                    # dokumentacja (.md)
└── package.json

---

## Dokumentacja
- doc/DevelopersGuide.md – architektura, feature flags, IPC, WebView, logger
- doc/Definition_Mockups_UI_UX.md – opis UI/UX do Figma
- doc/AI_Development_Standards.md – standardy kodowania dla AI
- doc/Project_Initialization_Guide.md – jak zacząć nowy projekt
- doc/ModulesOverview.md – przegląd modułów
- doc/Requirements.md – wymagania (IN_SPRINT / BACKLOG / DONE)

---

## Testy
Testy jednostkowe uruchamiają się automatycznie, gdy w Settings włączysz debugMode: true.
Możesz też uruchomić je ręcznie w konsoli DevTools:

import { runAllTests } from './tests/TestRunner.js'; runAllTests();

Testy znajdują się w tests/ i korzystają z testUtils.js (wspólny runner).
Testy są ładowane dynamicznie przez testsLoader.js – wystarczy dodać nowy plik TestRunner_*.js w folderze tests/, a zostanie automatycznie wykryty i uruchomiony.
Handlery IPC są ładowane dynamicznie przez ipcLoader.js – nowy handler wystarczy dodać jako ipcMainHandlers_*.js w src/ipc/.

---

## Automatyzacja i walidacja kodu

Projekt wykorzystuje skrypt `build_structure.py` do:
- automatycznego generowania `doc/Structure.md` (drzewo plików z metadanymi)
- walidacji i aktualizacji nagłówków plików (FILE, PATH, VERSION, PURPOSE, FUNCTIONS, DEPENDS ON, UWAGA)
- generowania raportów audytu (`logs/audit_report_*.log`)

### Uruchomienie:
```bash
python build_structure.py --fix ```
Skrypt przed pull requestem sprawdza poprawność nagłówków, wykrywa brakujące funkcje w FUNCTIONS i braki w DEPENDS ON.

---

## Licencja
Projekt jest prywatny / wewnętrzny. Wszelkie prawa zastrzeżone.

Autor / kontakt
Maciek (arcanixx)
Projekt rozwijany z pomocą AI (DeepSeek, Claude).

---

## Uwagi końcowe
Aplikacja jest w ciągłym rozwoju. Przed uruchomieniem upewnij się, że masz zainstalowane wszystkie zależności (w tym opcjonalne: sharp, js-yaml). 
W razie problemów – sprawdź konsolę (DevTools) i pliki logów w userData/logs/.