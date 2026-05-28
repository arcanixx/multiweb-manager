<!-- =============================================================================
 FILE: Definition_Mockups_UI_UX.md
 PATH: doc/Definition_Mockups_UI_UX.md
 VERSION: 0.0.3
 PURPOSE: Dokumentacja specyfikacji projektowej - Kompletny opis UI/UX aplikacji MultiWeb Manager (do np. Figma)
 FUNCTIONS: Dokumentacja: 41 sekcji głównych
 DEPENDS ON: -
 UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
 ============================================================================= -->

# DEFINITION MOCKUPS UI/UX
---
## 1. GŁÓWNY LAYOUT APLIKACJI
### Struktura ekranu (desktop)
```
┌──────────────────────────────┬──────────────────────────────────────────────┐
│ SIDEBAR                      │ MAIN CONTENT                                 │
│ (stała szerokość ~260px)     │ (dynamiczny obszar widoku modułów)           │
│                              │                                              │
│ • Search bar                 │ • TaskPanel / WebViewTab / Notepad /         │
│ • Kategorie profili          │   ProjectManager / AggregatedTasks /         │
│ • Lista profili              │   Terminal / HistoryLog / Settings / Tools   │
│ • Last used                  │                                              │
│ • Tools                      │                                              │
│ • Workspaces                 │                                              │
└──────────────────────────────┴──────────────────────────────────────────────┘
```
### Zasady ogólne UI
- **Ciemny motyw domyślny**, jasny opcjonalny (`Settings` → `Dark Mode`)
- **Płaskie UI** – bez gradientów
- **Ikonografia z `icons.js`** – zero emoji w kodzie
- **Tooltipy** wszędzie
- **Toasty** zamiast alertów
- **Modale** zamiast promptów
- **Loading states** (spinner / skeleton)
- **Animacje 150–200ms** (fade / slide)
- **Layout responsywny** (desktop-first)
---
## 2. SIDEBAR
### 2.1. Search bar
- Pole input z ikoną `ICONS.SEARCH` (z `icons.js`)
- Filtruje w czasie rzeczywistym: profile, narzędzia, App Library, workspace'y
- Placeholder: `t('sidebar.searchPlaceholder')`
### 2.2. Kategorie profili
Kategorie (tłumaczone przez `t('categories.XXX')`):
- AI
- Dev
- Design
- Productivity
- Special

Każda kategoria:

- Nagłówek (mała czcionka, uppercase)
- Lista profili z ikonami
- Klik = otwarcie `WebViewTab`
- PPM = menu kontekstowe:
  - Edytuj profil
  - Duplikuj
  - Usuń
  - Otwórz w przeglądarce
  - Przenieś do kategorii → lista kategorii

### 2.3. Last used

- 5–10 ostatnio otwieranych profili
- Sortowane po `lastUsedAt`
- Ikona: `ICONS.CLOCK`

### 2.4. Tools (narzędzia specjalne)

| Narzędzie            | Ikona                  | Komponent                 |
|----------------------|------------------------|---------------------------|
| JSON Formatter       | `ICONS.JSON`           | `JsonFormatter.jsx`       |
| Regex Tester         | `ICONS.REGEX`          | `RegexTester.jsx`         |
| Markdown Previewer   | `ICONS.MARKDOWN`       | `MarkdownPreviewer.jsx`   |
| Image Tools          | `ICONS.IMAGE`          | `ImageTools.jsx`          |
| SVG → PNG Converter  | `ICONS.SVG`            | `SvgToPngConverter.jsx`   |
| File Previewer       | `ICONS.PREVIEW`        | `FilePreviewer.jsx`       |
| Mini Postman         | `ICONS.API`            | `MiniPostman.jsx`         |
| Clipboard History    | `ICONS.CLIPBOARD`      | `ClipboardHistory.jsx`    |
| Cookie Grabber       | `ICONS.COOKIE`         | `CookieGrabber.jsx`       |
| Remove.bg            | `ICONS.REMOVEBG`       | `RemoveBgTool.jsx`        |
| String Combiner      | `ICONS.STRINGCOMBINER` | `StringCombiner.jsx`      |

Klik = otwarcie narzędzia w `MAIN CONTENT`.

### 2.5. Workspaces

- Lista workspace'ów
- Klik = przełączenie workspace'a
- Aktywny workspace podświetlony (klasa `.active`)
- PPM:
  - Edytuj
  - Duplikuj
  - Usuń

---

## 3. WEBVIEWTAB (PRZEGLĄDARKA)

### 3.1. Toolbar (jak mini przeglądarka)

Elementy od lewej (każdy z `ICONS` i tooltipem):

| Ikona              | Akcja                                          |
|--------------------|------------------------------------------------|
| `ICONS.BACK`       | Back                                           |
| `ICONS.FORWARD`    | Forward                                        |
| `ICONS.REFRESH`    | Refresh                                        |
| `ICONS.EXTERNAL`   | Open in browser                                |
| `ICONS.COPY`       | Copy URL                                       |
| –                  | Address bar (readonly lub editable – Settings) |
| `ICONS.DEVTOOLS`   | DevTools                                       |
| `ICONS.ZOOM_IN`    | Zoom in                                        |
| `ICONS.ZOOM_OUT`   | Zoom out                                       |
| `ICONS.CLEAR_CACHE`| Clear cache (z modałem potwierdzenia)          |
| `ICONS.SINGLE_APP` | Single App Mode                                |
| `ICONS.CAMERA`     | Screenshot                                     |
| `ICONS.MONITOR`    | Resource Monitor (BACKLOG – UI brakuje)        |

### 3.2. Error bar (zamiast alertów)

Czerwony pasek nad WebView:

```
❗ Brak internetu – strona nie odpowiada  [Reload]
```

- Ikona: `ICONS.WARNING`
- Przycisk `Reload` odświeża WebView

### 3.3. Sleep tabs

Gdy zakładka nieaktywna przez ustawiony czas (`Settings` → `Tabs`):

```
💤 Tab is sleeping  [Wake up]
```

- WebView zatrzymany, placeholder z ikoną `ICONS.SLEEP`
- Kliknięcie `Wake up` = reload

### 3.4. Tile view (planowane)

- 2–3 WebView obok siebie w gridzie
- Status: **BACKLOG**

---

## 4. TASKPANEL I AGGREGATEDTASKS

### 4.1. TaskPanel (górny pasek)

- Przycisk `+ Add Task` – otwiera `TaskModal`
- Dropdown priorytetu (A/B/C/D/E)
- Search bar (filtruje po tytule / opisie)
- Filtr statusu: `Active` / `Done`

### 4.2. Lista zadań

```
[ ] [A] Tytuł zadania
    Opis (max 1 linia)
    Projekt: X | Deadline: 2025-05-18
    [Edit] [Delete]
```

- Checkbox = toggle `done`
- Kolory priorytetów:

| Priorytet | Kolor                        |
|-----------|------------------------------|
| A         | czerwony (`#ef4444`)         |
| B         | pomarańczowy (`#f97316`)     |
| C         | żółty (`#eab308`)            |
| D         | niebieski (`#3b82f6`)        |
| E         | zielony (`#22c55e`)          |

### 4.3. TaskModal (dodawanie/edycja)

Pola:

- `Title` (input, wymagany)
- `Description` (rich text – na przyszłość, obecnie plain text)
- `Priority` (dropdown A–E)
- `Deadline` (date/time)
- `Project` (select z listy projektów)
- Przyciski: `Save`, `Cancel`

### 4.4. AggregatedTasks (widok zbiorczy)

```
▼ Projekt: MultiWeb Manager (12 tasks)
  • [A] Zaimplementować Sleep Tabs
  • [B] Dodać App Library
  • [C] Poprawić autosave
```

Funkcje:

- Collapse / expand (zapis w `settings.aggregatedTasks.collapsedProjects`)
- Hide / show (zapis w `settings.aggregatedTasks.hiddenProjects`)
- Sortowanie projektów po liczbie aktywnych zadań
- Liczniki: `Active`, `Backlog`, `Done`

---

## 5. NOTEPAD

### 5.1. Tabs

```
[ README.md ] [ Notes ] [ API ] [+]
```

- Double click → rename
- `x` → close
- `+` → new note

### 5.2. Editor

Tryby:

- Plain text (obecnie)
- Syntax highlight (BACKLOG – CodeMirror/Monaco)
- Rich text (BACKLOG – bold, italic, listy)
- Markdown (opcjonalnie w Tools)

### 5.3. Autosave

- Zapis co 5s **tylko jeśli content się zmienił** – porównanie `content` vs `lastSaved`
- W rogu: `Autosave enabled`

---

## 6. TERMINAL

- Okno terminala oparte o `xterm.js` + `node-pty`
- Historia komend (strzałka ↑)
- Kolorowanie ANSI
- Przyciski: `Clear`, `Restart session`

---

## 7. HISTORY LOG

```
[INFO]  2025-05-18 12:00 – Settings saved
[WARN]  2025-05-18 12:01 – WebView crashed
[ERROR] 2025-05-18 12:02 – IPC save failed
```

Funkcje:

- Filtry (`info` / `warn` / `error`)
- Sortowanie (rosnąco/malejąco)
- Eksport CSV
- Clear history

---

## 8. SETTINGS

Sekcje (każda w osobnym pliku JSX):

### General
- Language (PL/EN)
- Dark Mode
- Debug Mode

### WebView
- AdBlocker (toggle)
- Default User Agent (input)
- Address Bar Editable (toggle)

### Tabs
- Sleep Tabs timeout (select: 5 / 15 / 30 / 60 min, `never`)

### Notifications
- Toasts (domyślnie włączone)
- System notifications (toggle)
- Pushbullet API key (pole z instrukcją)

### Hotkeys
- Lista skrótów (tabela)
- Edycja skrótów (modal)
- Toggle włącz/wyłącz

### Data & Logs
- Export settings (przycisk)
- Import settings (przycisk)
- Open logs folder (przycisk)
- Export logs (przycisk)
- Clear test logs (przycisk)

---

## 9. TOOLS (WIDOK GŁÓWNY)

Lista narzędzi zgodna z Sidebar (pkt 2.4). Każde narzędzie ma własny komponent w `src/ui/tools/`.

---

## 10. ELEMENTY WSPÓLNE UI

### 10.1. Modale

- Globalny komponent `Modal` (ESC zamyka, klik poza zamyka)
- `ConfirmModal` – potwierdzenie akcji, zastępuje `window.confirm`
- Zawartość: centrowana, ciemne tło, padding, przyciski `Save` / `Cancel`

### 10.2. Toasty

- Pojawiają się u dołu po prawej
- Typy: `success` (zielony), `error` (czerwony), `info` (niebieski), `warning` (żółty)
- Automatyczne znikanie po 3–5s, ręczne zamknięcie

### 10.3. Tooltipy

- Na każdym przycisku, ikonie, kafelku, polu formularza
- Treść z locales (`t('tooltips.xxx')`)
- Jeśli istnieje skrót klawiszowy – wyświetlany w tooltipie

### 10.4. Loading states

- Spinner / skeleton dla każdej operacji > 200 ms
- Blokada przycisku w czasie operacji

---

## 11. STAN WDROŻENIA (DLA FIGMA)

| Sekcja                              | Wdrożone w kodzie |
|-------------------------------------|-------------------|
| Sidebar                             | ✅ tak            |
| WebViewTab (toolbar, sleep tabs)    | ✅ tak            |
| AdBlocker (global + per profil)     | ✅ tak            |
| TaskPanel + AggregatedTasks         | ✅ tak            |
| Notepad (multi-tab, autosave)       | ✅ tak            |
| Terminal (xterm + node-pty)         | ✅ tak            |
| History Log                         | ✅ tak            |
| Settings (wszystkie sekcje)         | ✅ tak            |
| Tools (większość)                   | ✅ tak (9/11)     |
| Cookie Grabber                      | ✅ tak            |
| Modale + Toasty + Tooltipy          | ✅ tak            |
| Resource Monitor UI                 | ❌ backlog        |
| Tile View                           | ❌ backlog        |
| Global Search (Ctrl+K)              | ❌ backlog        |
| Syntax highlight / Rich text        | ❌ backlog        |

---

## 12. UWAGI DLA GRAFIKA / FIGMA

- Użyj ikon odpowiadających `icons.js` (lub ich graficznych odpowiedników)
- Tooltipy i toasty jako osobne komponenty – bez gradientów, z `border-radius: 8px`
- Sidebar – ciemne tło, listy bez zbędnych ozdobników
- WebView toolbar – płaski, kontrastowy
- Formularze – inputy z zaokrąglonymi rogami, focus na borderze
- Modale – rozmiary: `small` (400px), `medium` (600px), `large` (800px)
- Stany ładowania – neutralny szary spinner

---

## 13. PODSUMOWANIE

Plik powstał na podstawie:

- Kodu źródłowego `v0.0.3`
- `Structure.md` i `DevelopersGuide.md`
- Bezpośredniej znajomości komponentów UI (Sidebar, WebViewTab, TaskPanel, AggregatedTasks, Notepad, Terminal, Settings, Tools, Modals)

Jest to dokumentacja **rzeczywistego stanu aplikacji**, nie wizja czy backlog.

---
<!-- END OF FILE -->