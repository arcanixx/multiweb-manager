=============================================================================
FILE: Definition_Mockups_UI_UX.md
PATH: doc/Definition_Mockups_UI_UX.md
VERSION: 0.0.3
PURPOSE: Kompletny opis UI/UX aplikacji MultiWeb Manager v0.0.3 (do Figma)
DEPENDS ON: structure.txt, DevelopersGuide.md
=============================================================================

# =============================================================================
# 1. GŁÓWNY LAYOUT APLIKACJI
# =============================================================================

## Struktura ekranu (desktop)

┌──────────────────────────────┬──────────────────────────────────────────────┐
│ SIDEBAR │ MAIN CONTENT │
│ (stała szerokość ~260px) │ (dynamiczny obszar widoku modułów) │
│ │ │
│ • Search bar │ • TaskPanel / WebViewTab / Notepad / │
│ • Kategorie profili │ ProjectManager / AggregatedTasks / │
│ • Lista profili │ Terminal / HistoryLog / Settings / Tools │
│ • Last used │ │
│ • Tools │ │
│ • Workspaces │ │
└──────────────────────────────┴──────────────────────────────────────────────┘

## Zasady ogólne UI

- **ciemny motyw domyślny**, jasny opcjonalny (Settings → Dark Mode)
- **płaskie UI**, bez gradientów
- **ikonografia z `icons.js`** (zero emoji w kodzie)
- **tooltips wszędzie**
- **toasty zamiast alertów**
- **modale zamiast promptów**
- **loading states** (spinner / skeleton)
- **animacje 150–200ms** (fade / slide)
- **layout responsywny** (desktop-first)

# =============================================================================
# 2. SIDEBAR
# =============================================================================

## 2.1. Search bar

- pole input z ikoną `ICONS.SEARCH` (z `icons.js`)
- filtruje w czasie rzeczywistym: profile, narzędzia, App Library, workspace’y
- placeholder: `t('sidebar.searchPlaceholder')`

## 2.2. Kategorie profili

Kategorie (tłumaczone przez `t('categories.XXX')`):

- AI
- Dev
- Design
- Productivity
- Special

Każda kategoria:

- nagłówek (mała czcionka, uppercase)
- lista profili z ikonami
- klik = otwarcie `WebViewTab`
- PPM = menu kontekstowe:
  - Edytuj profil
  - Duplikuj
  - Usuń
  - Otwórz w przeglądarce
  - Przenieś do kategorii → lista kategorii

## 2.3. Last used

- 5–10 ostatnio otwieranych profili
- sortowane po `lastUsedAt`
- ikona: `ICONS.CLOCK`

## 2.4. Tools (narzędzia specjalne)

Lista narzędzi (każde z ikoną z `ICONS` i tooltipem):

- JSON Formatter (`ICONS.JSON`)
- Regex Tester (`ICONS.REGEX`)
- Markdown Previewer (`ICONS.MARKDOWN`)
- Image Tools (`ICONS.IMAGE`)
- SVG → PNG Converter (`ICONS.SVG`)
- File Previewer (`ICONS.PREVIEW`)
- Mini Postman (`ICONS.API`)
- Clipboard History (`ICONS.CLIPBOARD`)
- Remove.bg (`ICONS.REMOVEBG`)
- String Combiner (`ICONS.STRINGCOMBINER`)
- Update Checker (`ICONS.UPDATE`)

Klik = otwarcie narzędzia w `MAIN CONTENT`.

## 2.5. Workspaces

- lista workspace’ów
- klik = przełączenie workspace’a
- aktywny workspace podświetlony (klasa `.active`)
- PPM:
  - Edytuj
  - Duplikuj
  - Usuń

# =============================================================================
# 3. WEBVIEWTAB (PRZEGLĄDARKA)
# =============================================================================

## 3.1. Toolbar (jak mini przeglądarka)

Elementy od lewej (każdy z `ICONS` i tooltipem):

- `ICONS.BACK` – Back
- `ICONS.FORWARD` – Forward
- `ICONS.REFRESH` – Refresh
- `ICONS.EXTERNAL` – Open in browser
- `ICONS.COPY` – Copy URL
- Address bar (readonly lub editable)
- `ICONS.DEVTOOLS` – DevTools
- `ICONS.ZOOM_IN` – Zoom in
- `ICONS.ZOOM_OUT` – Zoom out
- `ICONS.CLEAR_CACHE` – Clear cache (z modałem potwierdzenia)
- `ICONS.SINGLE_APP` – Single App Mode

## 3.2. Error bar (zamiast alertów)

Czerwony pasek nad WebView:
❗ Brak internetu – strona nie odpowiada [Reload]

- Ikona: `ICONS.WARNING`
- Przycisk `Reload` odświeża WebView

## 3.3. Sleep tabs

Gdy zakładka nieaktywna przez ustawiony czas (Settings → Tabs):
💤 Tab is sleeping [Wake up]

- WebView zatrzymany, placeholder z ikoną `ICONS.SLEEP`
- Kliknięcie `Wake up` = reload

## 3.4. Tile view (opcjonalnie, planowane)

- 2–3 WebView obok siebie w gridzie
- Status: BACKLOG

# =============================================================================
# 4. TASKPANEL I AGGREGATEDTASKS
# =============================================================================

## 4.1. TaskPanel (górny pasek)

- przycisk `+ Add Task` – otwiera `TaskModal`
- dropdown priorytetu (A/B/C/D/E)
- search bar (filtruje po tytule / opisie)
- filtr statusu: `Active` / `Done`

## 4.2. Lista zadań

Każde zadanie:
[ ] [A] Tytuł zadania
Opis (max 1 linia)
Projekt: X | Deadline: 2025-05-18
[Edit] [Delete]

- checkbox = toggle `done`
- kolory priorytetów:
  - A = czerwony
  - B = pomarańczowy
  - C = żółty
  - D = zielony
  - E = niebieski

## 4.3. TaskModal (dodawanie/edycja)

Pola:

- Title (input)
- Description (rich text – na przyszłość)
- Priority (dropdown A–E)
- Deadline (date/time)
- Project (select)
- Przyciski: `Save`, `Cancel`

## 4.4. AggregatedTasks (widok zbiorczy)

Sekcje per projekt:
▼ Projekt: MultiWeb Manager (12 tasks)
• [A] Zaimplementować Sleep Tabs
• [B] Dodać App Library
• [C] Poprawić autosave

Funkcje:

- collapse / expand (zapis w `settings.aggregatedTasks.collapsedProjects`)
- hide / show (zapis w `settings.aggregatedTasks.hiddenProjects`)
- sortowanie projektów po liczbie aktywnych zadań
- liczniki: `Active`, `Backlog`, `Done`

# =============================================================================
# 5. NOTEPAD
# =============================================================================

## 5.1. Tabs
[ README.md ] [ Notes ] [ API ] [+]

- Double click → rename
- `x` → close
- `+` → new note

## 5.2. Editor

Tryby (na przyszłość):

- plain text
- syntax highlight (CodeMirror/Monaco)
- rich text (bold, italic, listy)
- Markdown (opcjonalnie w Tools)

## 5.3. Autosave

- zapis co 5s **tylko jeśli content się zmienił**
- w rogu: `Autosave enabled`

# =============================================================================
# 6. TERMINAL
# =============================================================================

- okno terminala oparte o `xterm.js` + `node-pty`
- historia komend (strzałka ↑)
- kolorowanie ANSI
- przyciski: `Clear`, `Restart session`

# =============================================================================
# 7. HISTORY LOG
# =============================================================================

Widok:
[INFO] 2025-05-18 12:00 – Settings saved
[WARN] 2025-05-18 12:01 – WebView crashed
[ERROR] 2025-05-18 12:02 – IPC save failed

Funkcje:

- filtry (`info` / `warn` / `error`)
- sortowanie
- eksport CSV
- clear history

# =============================================================================
# 8. SETTINGS
# =============================================================================

Sekcje (każda w osobnym pliku JSX):

## General

- Language (PL/EN)
- Dark Mode
- Debug Mode

## WebView

- AdBlocker (toggle)
- Default User Agent (input)

## Tabs

- Sleep Tabs timeout (select: 5/15/30/60 min, `never`)

## Notifications

- Toasts (domyślnie włączone)
- System notifications (toggle)
- Pushbullet API key (pole z instrukcją)

## Hotkeys

- lista skrótów (tabela)
- edycja skrótów (modal)
- toggle włącz/wyłącz

## Data & Logs

- Export settings (przycisk)
- Import settings (przycisk)
- Open logs folder (przycisk)
- Export logs (przycisk)

# =============================================================================
# 9. TOOLS (WIDOK GŁÓWNY)
# =============================================================================

Lista narzędzi zgodna z Sidebar (pkt 2.4).  
Każde narzędzie ma własny komponent w `src/ui/tools/`.

# =============================================================================
# 10. ELEMENTY WSPÓLNE UI
# =============================================================================

## 10.1. Modale

- globalny komponent `Modal` (ESC zamyka, klik poza zamyka)
- `ConfirmModal` (potwierdzenie akcji, zastępuje `window.confirm`)
- zawartość modal – centrowana, ciemne tło, padding, przyciski `Save` / `Cancel`

## 10.2. Toasty

- pojawiają się u dołu po prawej
- typy: `success` (zielony), `error` (czerwony), `info` (niebieski), `warning` (żółty)
- automatyczne znikanie po 3–5s, ręczne zamknięcie

## 10.3. Tooltipy

- na każdym przycisku, ikonie, kafelku, polu formularza
- treść z locales (`t('tooltips.xxx')`)
- jeśli istnieje skrót klawiszowy – wyświetlany w tooltipie

## 10.4. Loading states

- spinner / skeleton dla każdej operacji > 200 ms
- blokada przycisku w czasie operacji

# =============================================================================
# 11. STAN WDROŻENIA (DLA FIGMA)
# =============================================================================

| Sekcja                           | Wdrożone w kodzie |
|----------------------------------|-------------------|
| Sidebar                          | ✅ tak            |
| WebViewTab (toolbar, sleep tabs) | ✅ tak            |
| AdBlocker (global + per profil)  | ✅ tak            |
| TaskPanel + AggregatedTasks      | ✅ tak            |
| Notepad (multi-tab, autosave)    | ✅ tak            |
| Terminal (xterm + node-pty)      | ✅ tak            |
| History Log                      | ✅ tak            |
| Settings (wszystkie sekcje)      | ✅ tak            |
| Tools (wszystkie narzędzia)      | ✅ tak            |
| Modale + Toasty + Tooltipy       | ✅ tak            |
| Tile View                        | ❌ backlog        |
| Global Search (Ctrl+K)           | ❌ backlog        |
| Quick Switcher (Ctrl+P)          | ❌ backlog        |

# =============================================================================
# 12. UWAGI DLA GRAFIKA / FIGMA
# =============================================================================

- Użyj ikon odpowiadających `icons.js` (lub ich graficznych odpowiedników)
- Tooltipy i toasty jako osobne komponenty – bez gradientów, z `border-radius: 8px`
- Sidebar – ciemne tło, listy bez zbędnych ozdobników
- WebView toolbar – płaski, kontrastowy
- Formularze – inputy z zaokrąglonymi rogami, focus na borderze
- Modale – rozmiary: `small` (400px), `medium` (600px), `large` (800px)
- Stany ładowania – neutralny szary spinner

# =============================================================================
# 13. PODSUMOWANIE
# =============================================================================

Plik powstał na podstawie:

- kodu źródłowego `v0.0.3`
- `structure.txt` i `DevelopersGuide.md`
- bezpośredniej znajomości komponentów UI (Sidebar, WebViewTab, TaskPanel, AggregatedTasks, Notepad, Terminal, Settings, Tools, Modals)

Jest to dokumentacja **rzeczywistego stanu aplikacji**, nie wizja czy backlog.

=============================================================================
END OF FILE
=============================================================================