=============================================================================
FILE: Project_Initialization_Guide.md
PATH: multiweb-manager/docs/Project_Initialization_Guide.md
VERSION: 0.0.1
PURPOSE: Kompletny przewodnik startowy — jak rozpocząć nowy projekt (AI-first)
DEPENDS ON: AI_Development_Standards.md, DevelopersGuide.md, structure.txt, ModulesOverview.md
=============================================================================

# =============================================================================
# PROJECT INITIALIZATION GUIDE — AI-FIRST DEVELOPMENT
# =============================================================================

## Cel dokumentu
Ten dokument opisuje **kompletny proces startowy** dla nowego projektu:
- jak przygotować repozytorium,
- jak ustawić środowisko,
- jak zbudować architekturę,
- jak przygotować dokumentację,
- jak prowadzić projekt zgodnie z dobrymi praktykami,
- jak AI powinno pracować nad projektem od pierwszej linijki.

Dokument jest **uniwersalny** — działa dla:
- React,
- Electron,
- Web (HTML/JS/CSS),
- projektów hybrydowych,
- projektów AI-first.

---

# =============================================================================
# 1. STRUKTURA REPOZYTORIUM (ROOT)
# =============================================================================

Każdy projekt powinien zaczynać się od następującej struktury:

/project-root  
├── src/  
│   ├── core/  
│   ├── engine/  
│   ├── ui/  
│   ├── utils/  
│   ├── data/  
│   ├── locales/  
│   └── index.js / main.js  
├── docs/  
│   ├── AI_Development_Standards.md  
│   ├── DevelopersGuide.md  
│   ├── Project_Initialization_Guide.md  
│   ├── ModulesOverview.md  
│   ├── Definition_Mockups_UI_UX.md  
│   ├── requirements.md  
│   └── structure.txt  
├── package.json  
├── README.md  
└── .gitignore

---

# =============================================================================
# 2. BRANCHOWANIE — STANDARD ENTERPRISE
# =============================================================================

## Główne branche

### MASTER  
- stabilna wersja produkcyjna  
- tylko merge po pełnych testach  
- tagi wersji (v1.0.0, v1.1.0, itp.)

### DEV  
- główny branch developerski  
- integracja funkcji  
- testy developerskie

### SAT (System Acceptance Testing)  
- testy systemowe  
- łączenie wielu funkcji w jedną wersję  
- przygotowanie do UAT

### UAT (User Acceptance Testing)  
- testy użytkownika  
- wersje RC (release candidate)

## Branche funkcjonalne

feature/nazwa-funkcji  
fix/nazwa-poprawki  
refactor/nazwa-modulu  
experiment/nazwa-testu  

---

# =============================================================================
# 3. ŚRODOWISKO — INSTALACJA I WYMAGANIA
# =============================================================================

## Wymagane oprogramowanie

- Node.js LTS (zalecane 18.x lub 20.x)
- NPM lub PNPM
- Git
- Visual Studio Code
- (Electron projects) Python 3 + build tools
- (Terminal) node-pty (kompatybilna wersja)
- (WebView) Chromium/Electron runtime

## Instalacja projektu

npm install  
lub  
pnpm install

## Uruchomienie środowiska DEV

npm run dev  
npm run start  
npm run electron:dev (dla Electron)

## Build produkcyjny

npm run build  
npm run electron:build

## Wybór architektury startowej
React + Electron: od razu planuj modułowość (src/core/, src/ui/, src/engine/).
Web (HTML/JS/CSS): od razu podział na js/, css/, assets/, lib/.
Chrome Extension: od razu manifest.json, background/, content/, popup/.

---

# =============================================================================
# 4. PLIKI DOKUMENTACYJNE — CO MUSI ISTNIEĆ OD POCZĄTKU
# =============================================================================

## 4.1 structure.txt (OBOWIĄZKOWY)
Zawiera:

- pełną strukturę katalogów i plików,
- opis odpowiedzialności każdego modułu,
- zależności między modułami,
- kolejność ładowania/importów,
- wskazanie entrypointów,
- wskazanie plików krytycznych,
- komentarze architektoniczne.

Jeśli structure.txt nie istnieje — **należy go stworzyć natychmiast**.

---

## 4.2 DevelopersGuide.md
Zawiera:

- zasady architektury,
- zasady stabilności,
- zasady IPC,
- zasady WebView,
- zasady UI/UX,
- zasady testów,
- zasady loggera,
- zasady cleanupów,
- zasady merge settings,
- zasady profili,
- zasady CSS,
- zasady buildów,
- zasady debugowania.

---

## 4.3 ModulesOverview.md
Zawiera:

- listę modułów,
- opis przeznaczenia,
- opis danych wejściowych/wyjściowych,
- opis zależności,
- opis powiązań,
- status (DONE / TODO / DO-ANALYSIS),
- priorytety.

---

## 4.4 Definition_Mockups_UI_UX.md
Zawiera:

- opisowe mockupy ekranów,
- opis zachowania UI,
- opis interakcji,
- opis stanów (loading/error/empty/success),
- opis layoutów,
- opis modali, toastów, tooltipów,
- opis komponentów UI,
- opis responsywności,
- opis stylów globalnych.

---

## 4.5 requirements.md
Zawiera:

- wymagania funkcjonalne,
- wymagania niefunkcjonalne,
- wymagania techniczne,
- wymagania UI/UX,
- wymagania dotyczące wydajności,
- wymagania dotyczące bezpieczeństwa,
- wymagania dotyczące integracji,
- historię zmian wymagań.


# =============================================================================
# 4.6 .GITIGNORE — OBOWIĄZKOWY W KAŻDYM PROJEKCIE
# =============================================================================

Jeżeli projekt korzysta z frameworków lub narzędzi generujących pliki tymczasowe,
cache lub foldery zależności (np. node_modules), należy utworzyć plik .gitignore.

## Minimalny .gitignore dla projektów JS/Electron/React

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

## Zasady

- Do repozytorium trafiają tylko pliki potrzebne do developmentu.
- Pliki generowane automatycznie (node_modules, build, dist) nigdy nie są commitowane.
- Jeśli projekt wymaga dodatkowych wykluczeń — dopisać je w .gitignore.

---

# =============================================================================
# 4.7 REQUIREMENTS.MD — ROZSZERZENIE
# =============================================================================

Plik requirements.md jest obowiązkowy w każdym projekcie.  
Zawiera pełną listę wymagań funkcjonalnych i niefunkcjonalnych, podzielonych na moduły.

## Struktura pliku

Plik requirements.md musi być podzielony na sekcje odpowiadające modułom projektu.

## [Nazwa Modułu]
- ID: unikalny identyfikator wymagania, nawiązujący też do modułu np. (SETTINGS_REQ-001, SETTINGS_REQ-002, ...)
- Opis: pełny opis wymagania
- Status: IN_SPRINT / BLOCKED / BACKLOG / DONE
- Priorytet: CRITICAL / MAJOR / MINOR
- Version (opcjonalnie): wersja aplikacji, w której wymaganie ma być dostępne
- Komentarz: dodatkowe informacje, powody blokady, zależności, cokolwiek użytecznego

## Statusy

### IN_SPRINT  
Wymaganie jest aktualnie implementowane.

### BLOCKED  
Wymaganie nie może być realizowane (np. brak API, brak danych, zależność od innego modułu).  
Zalecane: dopisać komentarz z powodem blokady.

### BACKLOG  
Wymaganie zaplanowane na później.

### DONE  
Wymaganie zaimplementowane, przetestowane i potwierdzone.

## Priorytety

### CRITICAL  
Blokuje działanie aplikacji lub kluczowych funkcji.

### MAJOR  
Istotne wymaganie, ale nie blokujące.

### MINOR  
Dodatkowe funkcje, ulepszenia, kosmetyka.

## Zasady aktualizacji

- Każda zmiana w projekcie → aktualizacja requirements.md  
- Każdy nowy pomysł → wpis do BACKLOG  
- Każdy błąd → wpis jako nowe wymaganie (CRITICAL lub MAJOR)  
- Każdy sprint → przeniesienie wymagań do IN_SPRINT  
- Po wdrożeniu → DONE + Version

requirements.md jest jednym z głównych dokumentów projektowych
i musi być spójny z ModulesOverview.md oraz DevelopersGuide.md.


Każda zmiana w projekcie → również aktualizacja requirements.md.

---

# =============================================================================
# 5. ARCHITEKTURA STARTOWA — DOBRE PRAKTYKI
# =============================================================================

## 5.1 Modułowość
Każdy moduł powinien być:

- izolowany,
- testowalny,
- niezależny,
- posiadać własny folder,
- posiadać własne style,
- posiadać własne testy,
- posiadać własną dokumentację.

## 5.2 Podział na warstwy
- core → logika biznesowa  
- engine → silniki (np. sleep tabs, resource monitor)  
- ui → komponenty  
- utils → funkcje pomocnicze  
- data → statyczne dane  
- locales → tłumaczenia  

## 5.3 Zasada „Single Responsibility”
Każdy plik robi jedną rzecz.

## 5.4 Zasada „No Hardcoded”
- brak tekstów,
- brak ikon,
- brak URL,
- brak promptów,
- brak alertów.

## 5.5 Zasada „Clean Imports”
Importy uporządkowane:

1. biblioteki zewnętrzne  
2. moduły core  
3. utils  
4. komponenty  
5. style  
6. dane  

## 5.6 Plik konfiguracyjny config.js”
Zawiera wszystkie rzeczy z innych modulów, które mogą być łatwo zmieniane, jeśli dotyczą aplikacji, jak:
- DEBUG MODE true/false
- DEFAULT_LANGUAGE
- wszelkiego rodzaju ilosci, jak np. ilosc wpisów, jakie ClipboardHistory ma przechowywać, czy czas, po jakim cos się ma zadziać jako event/akcja,
- DEFAULT_THEME
- DEFAULT_PROFILE
- inne rzeczy z modułów, które warto mieć zebrane w jednym miejscu, z opisanym komentarzem, za co odpowiadają, a mają istotny wpływ jako konfiguracja

---

# =============================================================================
# 6. AI-FIRST DEVELOPMENT — JAK AI MA PROWADZIĆ PROJEKT
# =============================================================================

## 6.1 AI musi:
- generować kod zgodnie z AI_Development_Standards.md,
- aktualizować dokumentację,
- aktualizować structure.txt,
- aktualizować ModulesOverview.md,
- aktualizować requirements.md,
- generować testy,
- generować komentarze,
- generować mockupy UI,
- generować architekturę,
- generować pliki startowe.

## 6.2 AI nie może:
- tworzyć hardcoded tekstów,
- pomijać komentarzy,
- pomijać nagłówków plików,
- pomijać testów,
- pomijać dokumentacji.

---

# =============================================================================
# 7. CHECKLISTA STARTOWA — NOWY PROJEKT
# =============================================================================

## 7.1 Utwórz repozytorium
- z branchami MASTER / DEV / SAT / UAT / FEATURE/nazwa-funkcji/wymagania

## 7.2 Utwórz dokumentację
- AI_Development_Standards.md  
- DevelopersGuide.md  
- Project_Initialization_Guide.md  
- ModulesOverview.md  
- Definition_Mockups_UI_UX.md  
- requirements.md  
- structure.txt  

## 7.3 Utwórz strukturę katalogów
src/core  
src/engine  
src/ui  
src/utils  
src/data  
src/locales  

## 7.4 Przygotuj środowisko
npm install  
npm run dev  

## 7.5 Przygotuj architekturę
- entrypointy  
- moduły  
- utils  
- style  
- locales  
- testy  

## 7.6 Przygotuj UI/UX
- mockupy  
- layouty  
- modale  
- toasty  
- tooltipy  
- stany ładowania  

## 7.7 Checklista przed pierwszym commitem
- Struktura folderów zgodna z structure.txt
- config.js z stałymi konfiguracyjnymi
- icons.js z wszystkimi potrzebnymi ikonami
- locales/pl.json i en.json z podstawowymi kluczami
- main.js (Electron) lub index.html (web)
- package.json z poprawnymi skryptami
- .gitignore (node_modules, dist, build, .env, *.log itp)

---

# =============================================================================
# 8. DOBRE PRAKTYKI — UNIWERSALNE w celu unikania przyszłych refaktorów
# =============================================================================

- Każdy moduł ma własny folder.  
- Każdy moduł ma testy.  
- Każdy moduł ma dokumentację.  
- Każdy plik ma nagłówek.  
- Każdy tekst jest w locales.  
- Każda ikona jest w icons.js.  
- Każdy modal jest komponentem.  
- Każdy toast jest komponentem.  
- Każdy tooltip jest komponentem.  
- Każdy WebView ma cleanup.  
- Każdy IPC ma walidację.  
- Każdy błąd ma logger.  
- Każdy build jest powtarzalny. 
- Nie mieszaj logiki z UI – core/ i engine/ są od tego.
- Nie twórz src/components/ – od razu src/ui/[modul]/.
- Nie używaj alert()/prompt() – od razu modale. 

---

# =============================================================================
# KONIEC DOKUMENTU
# =============================================================================
