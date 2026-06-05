<!-- =============================================================================
 FILE: Project_Initialization_Guide.md
 PATH: doc/Project_Initialization_Guide.md
 VERSION: 0.0.3
 PURPOSE: Dokumentacja specyfikacji projektowej - Kompletny przewodnik startowy — jak rozpocząć nowy projekt (AI-first)
 FUNCTIONS: Dokumentacja: 12 sekcji głównych
 DEPENDS ON: -
 UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
 ============================================================================= -->

# PROJECT INITIALIZATION GUIDE — AI-FIRST DEVELOPMENT
---
## Cel dokumentu
Ten dokument opisuje **kompletny proces startowy** dla nowego projektu:
- jak przygotować repozytorium,
- jak ustawić środowisko,
- jak zbudować architekturę,
- jak przygotować dokumentację,
- jak prowadzić projekt zgodnie z dobrymi praktykami,
- jak AI powinno pracować nad projektem od pierwszej linijki.
Dokument jest **uniwersalny** — działa dla: React, Electron, Web (HTML/JS/CSS), projektów hybrydowych i AI-first.
---
## 1. STRUKTURA REPOZYTORIUM (ROOT)
Każdy projekt powinien zaczynać się od następującej struktury:
```
/project-root
├── assets/
├── src/
│   ├── stores/       # store'y (settings, profiles, tasks, notepad, projects, history, workspaces, clipboard)
│   ├── engine/     # silniki (adBlocker, hotkeysManager, sleepTabsManager, updateService, webviewRegistry)
│   ├── ui/         # komponenty React (modułowo: sidebar, taskpanel, notepad, tools, settings, ...)
│   ├── utils/      # funkcje pomocnicze (logger, translations, icons, fileUtils, imageUtils, ...)
│   ├── data/       # statyczne dane (app-library.json, defaultProfiles.json, defaultSettings.json, icons.js)
│   ├── locales/    # tłumaczenia (pl.json, en.json, help.pl.json, help.en.json, templates/)
│   ├── hooks/      # hooki (useSettings, useTasks, useNotepad, useProjects, ...)
│   ├── ipc/        # handlery IPC (ipcMainHandlers_.js)
│   ├── loaders/    # dynamiczne loadery (testsLoader.js, ipcLoader.js)
│   ├── tools/      # backend narzędzi (apiClient, markdownRenderer, regexEngine, svgToPng)
│   ├── App.jsx     # główny komponent React
│   ├── index.jsx   # entrypoint React
│   ├── config.js   # konfiguracja aplikacji (feature flags, limity, ścieżki)
│   └── constants.js # stałe aplikacji (enumy, mapy kategorii)
├── public/
│   └── index.html
├── tests/          # testy jednostkowe (TestRunner_.js)
├── doc/            # dokumentacja (.md)
├── package.json
├── main.js         # proces główny Electron
├── preload.cjs     # mostek IPC (bezpieczeństwo)
├── config.js       # re-eksport z src/config.js (dla kompatybilności)
└── README.md
```

---

## 2. BRANCHOWANIE — STANDARD ENTERPRISE

### Główne branche

| Branch | Opis |
|--------|------|
| `master` | Stabilna wersja produkcyjna. Tylko merge po pełnych testach. Tagi wersji (`v1.0.0`, `v1.1.0`, itp.). |
| `dev` | Główny branch developerski. Integracja funkcji, testy developerskie. |
| `sat` | System Acceptance Testing — testy systemowe, łączenie funkcji, przygotowanie do UAT. |
| `uat` | User Acceptance Testing — testy użytkownika, wersje RC (release candidate). |

### Branche funkcjonalne

```
feature/nazwa-funkcji
feature/nazwa-wymagania
fix/nazwa-poprawki
refactor/nazwa-modulu
experiment/nazwa-testu
```

---

## 3. ŚRODOWISKO — INSTALACJA I WYMAGANIA

### Wymagane oprogramowanie

- Node.js LTS (zalecane 18.x lub 20.x)
- NPM lub PNPM
- Git
- Visual Studio Code
- (Electron) Python 3 + build tools
- (Terminal) node-pty (kompatybilna wersja)
- (WebView) Chromium / Electron runtime

### Instalacja projektu

```bash
npm install
# lub
pnpm install
```

### Uruchomienie środowiska DEV

```bash
npm run dev
npm run start
npm run electron:dev   # dla Electron
```

### Build produkcyjny

```bash
npm run build
npm run electron:build
```

### Wybór architektury startowej

| Typ projektu | Zalecenia startowe |
|---|---|
| React + Electron | Od razu planuj modułowość: `src/stores/`, `src/ui/`, `src/engine/` |
| Web (HTML/JS/CSS) | Podział na `js/`, `css/`, `assets/`, `lib/` |
| Chrome Extension | Od razu: `manifest.json`, `background/`, `content/`, `popup/` |

---

## 4. PLIKI DOKUMENTACYJNE — CO MUSI ISTNIEĆ OD POCZĄTKU

### 4.1. `Structure.md` (OBOWIĄZKOWY)

Zawiera: pełną strukturę katalogów i plików, opis odpowiedzialności każdego modułu, zależności między modułami, kolejność ładowania/importów, wskazanie entrypointów i plików krytycznych, komentarze architektoniczne.

> Jeśli `Structure.md` nie istnieje — należy go stworzyć natychmiast.

### 4.2. `DevelopersGuide.md`

Zawiera zasady: architektury, stabilności, IPC, WebView, UI/UX, testów, loggera, cleanupów, merge settings, profili, CSS, buildów, debugowania.

### 4.3. `ModulesOverview.md`

Zawiera: listę modułów, opis przeznaczenia, opis danych wejściowych/wyjściowych, opis zależności i powiązań, status (`DONE` / `TODO` / `DO-ANALYSIS`), priorytety.

### 4.4. `Definition_Mockups_UI_UX.md`

Zawiera: opisowe mockupy ekranów, opis zachowania UI, opis interakcji, opis stanów (`loading` / `error` / `empty` / `success`), opis layoutów, modali, toastów, tooltipów, komponentów UI, responsywności i stylów globalnych.

### 4.5. `Requirements.md`

Zawiera: wymagania funkcjonalne, niefunkcjonalne, techniczne, UI/UX, wydajnościowe, bezpieczeństwa, integracyjne oraz historię zmian wymagań.

---

## 5. `.gitignore` — OBOWIĄZKOWY W KAŻDYM PROJEKCIE

Jeżeli projekt korzysta z frameworków lub narzędzi generujących pliki tymczasowe, cache lub foldery zależności (np. `node_modules`), należy utworzyć plik `.gitignore`.

### Minimalny `.gitignore` dla projektów JS / Electron / React

```
node_modules/
dist/
build/
out/
.DS_Store
.env
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
coverage/
.cache/
*.tmp
```

### Zasady

- Do repozytorium trafiają tylko pliki potrzebne do developmentu.
- Pliki generowane automatycznie (`node_modules`, `build`, `dist`) **nigdy** nie są commitowane.
- Jeśli projekt wymaga dodatkowych wykluczeń — dopisać je w `.gitignore`.

---

## 6. `.clinerules` — INSTRUKCJE DLA AI W VSCODE

Plik `.clinerules` (bez rozszerzenia) umieść w root projektu. Zawiera rygorystyczne zasady dla AI (Roo Code / Cline / GitHub Copilot):

### Zasady (skrót)

- **ZAKAZ** generowania kodu od zera dla istniejących plików — tylko niezbędne poprawki.
- **Zachowanie kontekstu konfiguracyjnego** — merge, nie nadpisywanie.
- **Aktywny preload bridge** — tylko `preload.cjs`; `preload.js` jest wyłączony.
- **Weryfikacja wersji** — zawsze z `package.json`, nie z pamięci cache.
- **Nagłówek pliku** — obowiązkowy (`FILE`, `PATH`, `VERSION`, `PURPOSE`, `FUNCTIONS`, `DEPENDS ON`, `UWAGA`).
- **Stack technologiczny** — Electron + React, bezpieczeństwo IPC.
- **System logowania** — centralny, przez `loggerRenderer.js` (JSX) lub `logger.js` (JS).
- **Zakaz natywnych okien** — `alert`, `confirm`, `prompt` → modale, toasty.
- **Brak hardcoded tekstów** — wszystko przez `TranslationContext`.
- **Import ikon** — tylko z `src/utils/icons.js` (reeksport).
- **Testy** — obowiązkowe dla nowych modułów, aktualizacja istniejących.
- **Cykl życia dokumentacji** — `pending_updates_for_Definition_Mockups_UI_UX.md` na bieżące zmiany UI.
- **Zasady generowania kodu** — bez automatycznych commitów, kod po polsku.

> Plik jest krytyczny dla współpracy z AI — nie modyfikuj go bez potrzeby. Jeśli zmieniasz zasady, upewnij się, że są spójne z `AI_Development_Standards.md` i `DevelopersGuide.md`.

---

## 7. PLIK TYMCZASOWY NA ZMIANY UI/UX

**Plik:** `doc/pending_updates_for_Definition_Mockups_UI_UX.md`

**Cel:** Uniknięcie częstej modyfikacji dużego pliku `Definition_Mockups_UI_UX.md` (~500 linii).

### Zasada

| Plik | Kiedy modyfikować |
|------|-------------------|
| `Definition_Mockups_UI_UX.md` | Rzadko, zbiorczo — np. przed dużym kamieniem milowym |
| `pending_updates_...md` | Na bieżąco — AI dopisuje tu zmiany UI/UX w trakcie sprintu |

### Format wpisu

```markdown
## [YYYY-MM-DD] Nazwa zmiany
- **Plik:** src/ui/komponent/Plik.jsx
- **Opis:** co się zmieniło
- **Nowe zachowanie:** ...
- **Wpływ na inne komponenty:** ...
```

### Przed commitem / PR

Użytkownik ręcznie scala zmiany z głównym plikiem. Po scaleniu — plik tymczasowy jest czyszczony (lub usuwany).

> Główny plik makiet ma ~500 linii. Częste modyfikacje generują dużo szumu w diffie i mogą powodować konflikty merge.

---

## 8. ARCHITEKTURA STARTOWA — DOBRE PRAKTYKI

### 8.1. Modułowość

Każdy moduł powinien być: izolowany, testowalny, niezależny — posiadać własny folder, własne style, testy i dokumentację.

### 8.2. Podział na warstwy

| Warstwa | Odpowiedzialność |
|---------|-----------------|
| `stores/` | Logika biznesowa (store'y) |
| `engine/` | Silniki (np. sleep tabs, resource monitor) |
| `ui/` | Komponenty React |
| `utils/` | Funkcje pomocnicze |
| `data/` | Statyczne dane |
| `locales/` | Tłumaczenia |

### 8.3. Zasada „Single Responsibility"

Każdy plik robi jedną rzecz.

### 8.4. Zasada „No Hardcoded"

Brak hardcoded: tekstów, ikon, URL, promptów, alertów.

### 8.5. Zasada „Clean Imports"

Importy uporządkowane w kolejności: biblioteki zewnętrzne → moduły stores → utils → komponenty → style → dane.

---

## 9. AI-FIRST DEVELOPMENT — JAK AI MA PROWADZIĆ PROJEKT

### AI musi

- generować kod zgodnie z `AI_Development_Standards.md`,
- aktualizować dokumentację: `Structure.md`, `ModulesOverview.md`, `Requirements.md`,
- generować testy, komentarze, mockupy UI (w pliku tymczasowym),
- generować architekturę i pliki startowe.

### AI nie może

- tworzyć hardcoded tekstów,
- pomijać komentarzy, nagłówków plików, testów, dokumentacji.

---

## 10. CHECKLISTA STARTOWA — NOWY PROJEKT

### 10.1. Utwórz repozytorium

Z branchami: `master` / `dev` / `sat` / `uat` / `feature/nazwa-funkcji`.

### 10.2. Utwórz dokumentację

```
AI_Development_Standards.md
DevelopersGuide.md
Project_Initialization_Guide.md
ModulesOverview.md
Definition_Mockups_UI_UX.md
pending_updates_for_Definition_Mockups_UI_UX.md
Requirements.md
Structure.md
```

### 10.3. Utwórz strukturę katalogów

```
src/stores/
src/engine/
src/ui/
src/utils/
src/data/
src/locales/
src/hooks/
src/ipc/
src/loaders/
src/tools/
```

### 10.4. Przygotuj środowisko

```bash
npm install
npm run dev
```

### 10.5. Przygotuj architekturę

Entrypointy, moduły, utils, style, locales, testy.

### 10.6. Przygotuj UI/UX

Mockupy (w pliku tymczasowym), layouty, modale, toasty, tooltipy, stany ładowania.

### 10.7. Checklista przed pierwszym commitem

- [ ] Struktura folderów zgodna z `Structure.md`
- [ ] `config.js` z ustawieniami konfiguracyjnymi
- [ ] `icons.js` z ikonami aplikacji
- [ ] `locales/pl.json` i `locales/en.json` z podstawowymi kluczami
- [ ] `main.js` (Electron) lub `index.html` (web)
- [ ] `package.json` z poprawnie skonfigurowanymi skryptami
- [ ] `.gitignore` z wykluczeniami (`node_modules`, `dist`, `build`, `.env`, `*.log` itp.)
- [ ] `.clinerules` w root projektu

---

## 11. DOBRE PRAKTYKI — UNIWERSALNE

- Każdy moduł ma własny folder, testy i dokumentację.
- Każdy plik ma nagłówek.
- Każdy tekst jest w `locales`, każda ikona w `icons.js`.
- Każdy modal, toast i tooltip jest komponentem.
- Każdy WebView ma cleanup, każdy IPC ma walidację.
- Każdy błąd ma logger, każdy build jest powtarzalny.
- Nie mieszaj logiki z UI — `stores/` i `engine/` są od tego.
- Nie twórz `src/components/` — od razu `src/ui/[modul]/`.
- Nie używaj `alert` / `prompt` — od razu modale.

---

## 12. LOGI TESTÓW (LOGWRITER)

### Konfiguracja

Po pierwszym uruchomieniu z `debugMode = true`, aplikacja zapyta o zgodę na zapis logów testów.

- **Plik logów:** `userData/logs/test-fails.log`
- **Warunki zapisu:** `settings.debugMode === true` oraz użytkownik wyraził zgodę

### Limity

- Maksymalnie 500 linii
- Nadpisywane od najstarszych (FIFO)

### UI w Settings (Data & Logs)

- Przełącznik włącz/wyłącz logowania (widoczny tylko gdy `debugMode = true`)
- Przycisk „Otwórz folder logów"
- Przycisk „Wyczyść logi testów"

### Integracja z testami

TestRunnerzy używają `runTests(moduleName, tests)` z `testUtils.js`, która automatycznie loguje rozpoczęcie testów, wywołuje `appendTestFailLog` przy failu i podsumowuje wyniki. Nie wymaga ręcznej ingerencji w testy.

### Handlery IPC

| Handler | Opis |
|---------|------|
| `append-log-file` | Dopisuje linię do pliku (używane przez LogWriter) |
| `get-logs-file` | Odczytuje zawartość (dla podglądu w Settings) |
| `clear-logs-file` | Usuwa plik (przycisk czyszczenia) |

### Konfiguracja w `config.js`

```js
export const CONFIG = {
  logsEnabled: false,   // czy logi są włączone (override ustawienia)
  logsMaxLines: 500     // maksymalna liczba linii
};
```

---

<!-- ============================================================================= -->
<!-- KONIEC DOKUMENTU -->
<!-- ============================================================================= -->