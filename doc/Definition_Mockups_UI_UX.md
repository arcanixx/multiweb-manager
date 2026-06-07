<!-- =============================================================================
 FILE: Definition_Mockups_UI_UX.md
 PATH: doc/Definition_Mockups_UI_UX.md
 VERSION: 0.0.3
 PURPOSE: Dokumentacja specyfikacji projektowej - Kompletny opis UI/UX aplikacji MultiWeb Manager (do np. Figma)
 FUNCTIONS: Dokumentacja: 14 sekcji głównych
 DEPENDS ON: -
 UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
 ============================================================================= -->

# DEFINITION MOCKUPS UI/UX — MultiWeb Manager

> Stan na: `v0.0.3` / branch `UAT-v0.0.4`
> Dokument opisuje **rzeczywisty stan aplikacji** (nie backlog/wizja).

---

## 1. PRZEPŁYW STARTOWY APLIKACJI

Przy każdym uruchomieniu aplikacja przechodzi przez 3 etapy zanim wyświetli główny UI:

```
App.jsx
  │
  ├─► [splashDone = false]
  │     SplashScreen (1.8s)
  │       ├─ Logo (PNG z assets/ lub SVG fallback)
  │       ├─ Nazwa: "MultiWeb Manager"
  │       ├─ Tagline (z locales)
  │       ├─ Animowany pasek postępu (0→100% przez 1.8s, krok co 30ms)
  │       └─ Fade-out 300ms → onFinished() → splashDone = true
  │
  ├─► [settings.firstRun = true → onboardingDone = false]
  │     OnboardingScreen (wizard 5 kroków)
  │       └─ po finish → onboardingDone = true, firstRun = false
  │
  └─► [splashDone && onboardingDone]
        MainLayout
```

### 1.1. SplashScreen

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│               [LOGO SVG/PNG ~120px]                 │
│                                                     │
│            MultiWeb Manager                         │
│         your personal web hub                       │
│                                                     │
│    ████████████████████████░░░░░░░░░░  78%          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- Tło: `var(--bg-primary, #1a1a2e)`
- Logo: PNG z `assets/` jeśli dostępne, fallback SVG inline
- Pasek postępu: `var(--accent)`, `border-radius: 4px`, pełna szerokość 200px

---

## 2. ONBOARDING (5 kroków)

Wyświetlany tylko przy `firstRun = true`. Po zakończeniu zapisuje ustawienia przez IPC i ustawia `firstRun: false`.

### Układ ogólny

```
┌─────────────────────────────────────────┐
│  ● ○ ○ ○ ○   [StepIndicator]            │
├─────────────────────────────────────────┤
│                                         │
│  [Ikona 40px]                           │
│  Tytuł kroku (18px bold)                │
│                                         │
│  [Zawartość kroku]                      │
│                                         │
├─────────────────────────────────────────┤
│  [← Wstecz]              [Dalej →]      │
└─────────────────────────────────────────┘
```

- `StepIndicator` – kółka (aktywne = `var(--accent)`, nieaktywne = `var(--border)`)
- Przyciski nawigacji: Wstecz (disabled na kroku 0), Dalej / Zakończ (disabled jeśli walidacja nie przejdzie)

### Krok 1: Motyw (Theme)

3 przyciski-kafelki (min-width: 100px, padding: 16px 24px):

| Opcja | Ikona | Klucz |
|---|---|---|
| Dark | `ICONS.ONBOARDING_THEME_DARK` | `onboarding.theme_dark` |
| Light | `ICONS.ONBOARDING_THEME_LIGHT` | `onboarding.theme_light` |
| System | `ICONS.ONBOARDING_LANGUAGE` | `onboarding.theme_system` |

- Wybrany: `border: 2px solid var(--accent)`, `background: var(--accent-subtle)`
- Zmiana stosowana live na `document.documentElement.classList`

### Krok 2: Język (Language)

Kafelki dla każdego z `LANGUAGES` z `config.js`:

| Język | Flaga | Label |
|---|---|---|
| pl | 🇵🇱 | Polski |
| en | 🇬🇧 | English |

- Zmiana stosowana live przez `setLocale()`

### Krok 3: Prywatność (Privacy)

```
┌──────────────────────────────────────────────┐
│ Disclaimer                                   │
│ • Dane przechowywane lokalnie                │
│ • Brak śledzenia                             │
│ • Open source                                │
└──────────────────────────────────────────────┘
[☑] Akceptuję (required – odblokowuje przycisk Dalej)

Opcje prywatności (toggle-y):
• Włącz powiadomienia toast    [ON]
• Włącz logi debugowania       [OFF]
• Włącz analitykę              [OFF]
```

- Przycisk Dalej disabled dopóki `disclaimerAccepted = false`

### Krok 4: Szybki start – Aplikacje

```
AI
  [ Claude ]  [ ChatGPT ]  [ Gemini ]  ...

PRODUCTIVITY
  [ Notion ]  [ Trello ]  [ Asana ]  ...
```

- Aplikacje z `app-library.json`, filtrowane przez `QUICK_START_MAP` z `onboardingConfig.js`
- Wybrana: `border: 1.5px solid var(--accent)`, `border-radius: 20px`
- Po zakończeniu onboardingu wybrane aplikacje dodawane jako profile

### Krok 5: Konto (Account) — placeholder

```
        [ICONS.ONBOARDING_ACCOUNT  48px]

        Synchronizacja konta – wkrótce

  [ Zaloguj przez Google ]  (disabled)
  [ Zaloguj przez GitHub ]  (disabled)

  * Sync w przygotowaniu
```

- Wszystkie przyciski `disabled`, `cursor: not-allowed`
- Nie blokuje ukończenia onboardingu

---

## 3. GŁÓWNY LAYOUT

### Struktura (po onboardingu)

```
┌──────────────────────┬────────────────────────────────────────────────┐
│ SIDEBAR (~260px)     │ MAIN CONTENT                                   │
│ ─────────────────── │ ────────────────────────────────────────────── │
│ [+] Profil [📁+]     │  ContentRenderer                               │
│ [🔍 Szukaj...]       │                                                │
│ ──── ─────────────── │  ← WebViewTab | Notepad | TaskPanel |          │
│ ► AI                 │    ProjectManager | AggregatedTasks |          │
│   • Claude AI        │    Terminal | HistoryLog | Settings |          │
│   • ChatGPT          │    Tools (JSON/Regex/…) | Help                 │
│ ► DEV                │                                                │
│   • GitHub           │                                                │
│ ──────────────────── │                                                │
│ [App Library]        │                                                │
│ ──────────────────── │                                                │
│ ▼ Narzędzia spec.    │                                                │
│   📓 Notepad         │                                                │
│   📋 Project Manager │                                                │
│   ☑  Aggregated      │                                                │
│   📅 Historia        │                                                │
│   🖼  Remove.bg      │                                                │
│   🔗 StringCombiner  │                                                │
│   >_ Terminal        │                                                │
│   ⚙  Settings        │                                                │
│   ❓ Help            │                                                │
│ ──────────────────── │                                                │
│ ▣ Workspaces         │                                                │
│   • Workspace 1      │                                                │
└──────────────────────┴────────────────────────────────────────────────┘
```

- CSS klasa `main-area--webview` gdy aktywny WebView (inna obsługa overflow)
- CSS klasa `main-area--module` dla pozostałych widoków
- `key` na `module-view` zmienia się przy każdej nawigacji → reset stanu

---

## 4. SIDEBAR

### 4.1. SidebarHeader

```
┌───────────────────────────────┐
│ [+ Dodaj profil]  [📁+]       │
│ [🔍 Szukaj... ]  [🌐]         │
└───────────────────────────────┘
```

- `[+ Dodaj profil]` – `btn-primary`, flex: 1
- `[📁+]` – `btn-icon`, otwiera modal kategorii
- `[🌐]` – toggle globalnego wyszukiwania (przeszukuje przez IPC)
- Globalny search: wyniki drop-down pod polem, spinner `isGlobalSearching`

### 4.2. App Library (kafelek nad listą profili)

Widoczny tylko gdy `isFeatureEnabled('appLibrary')`:

```
┌──────────────────────────────────┐
│ [ikona]  App Library             │
└──────────────────────────────────┘
```

- Styl aktywny: `background: var(--accent)`, tekst biały
- Otwiera widok `AppLibraryBrowser` w MAIN CONTENT

### 4.3. Lista profili (SidebarProfileList)

```
★ ULUBIONE
  ● Claude AI          [☑ tasks]
  ● ChatGPT            [☑ tasks]

► AI
  ● Gemini
  ● Perplexity

► DEV
  ● GitHub
  ● StackOverflow
```

- Kategorie zwijane/rozwijane, stan w `settings.categories.collapsed`
- PPM na profilu → `ContextMenu`:
  - Edytuj profil
  - Duplikuj
  - Usuń
  - Przenieś do kategorii → podmenu
  - Otwórz w przeglądarce

### 4.4. Narzędzia specjalne (SidebarTools)

Lista z `SPECIAL_TOOLS`:

```
📓 Notepad
📋 Project Manager
☑  Aggregated Tasks
─────────────────── (reszta sortowana alfabetycznie)
📅 Historia
❓ Help             (tylko gdy isFeatureEnabled('helpScreen'))
🖼  Remove.bg
>_ Terminal
🔗 String Combiner
⚙  Settings
```

- Pierwsze 3 (Notepad, Project Manager, Aggregated) zawsze na górze
- Reszta sortowana alfabetycznie wg `t(labelKey)`

### 4.5. SidebarWorkspaces

```
▣ Workspaces
  📁 Workspace 1  ← aktywny (podświetlony)
  📁 Workspace 2
```

- Widoczny tylko gdy `workspaces.length > 0`
- Klik = `onSelect(workspace)`

---

## 5. WEBVIEWTAB

### 5.1. Toolbar

```
[←] [→] [⟳] [⬡] [📋] [  https://claude.ai  ▸] [🛠] [+] [−] [🗑] [◼] [📷] [📊]
```

| Ikona | Akcja |
|---|---|
| `ICONS.BACK` | Wstecz |
| `ICONS.FORWARD` | Naprzód |
| `ICONS.REFRESH` | Odśwież |
| `ICONS.EXTERNAL` | Otwórz w przeglądarce |
| `ICONS.COPY` | Kopiuj URL |
| Address bar | Readonly lub edytowalne (Settings) |
| `ICONS.DEVTOOLS` | DevTools |
| `ICONS.ZOOM_IN` | Zoom + |
| `ICONS.ZOOM_OUT` | Zoom − |
| `ICONS.CLEAR_CACHE` | Clear cache (ConfirmModal) |
| `ICONS.SINGLE_APP` | Single App Mode |
| `ICONS.CAMERA` | Screenshot |
| `ICONS.MONITOR` | Resource Monitor (BACKLOG – UI brakuje) |

### 5.2. Error bar

```
┌─────────────────────────────────────────────────────┐
│ ❗  Brak internetu – strona nie odpowiada   [Reload] │
└─────────────────────────────────────────────────────┘
```

Czerwony pasek pojawia się nad WebView przy HTTP error (`webview_httpErrors` handler).

### 5.3. Sleep tabs

Gdy zakładka śpi (`sleepTabsManager` po ustawionym timeout):

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│           💤  Ta zakładka śpi                       │
│                                                     │
│                  [ Obudź ]                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

WebView unloaded, placeholder wyświetlony zamiast. `Wake up` = reload.

---

## 6. TASKPANEL

Panel wysuwa się nad głównym contentem (overlay). Otwierany z ikony `[☑]` przy profilu lub z Sidebaru.

### 6.1. Nagłówek

```
┌───────────────────────────────────────────────────┐
│ ☑  MultiWeb Manager Tasks    [🔄]        [✕]      │
│ ─────────────────────────────────────────────────  │
│ [+ Dodaj zadanie]                                  │
└───────────────────────────────────────────────────┘
```

### 6.2. Sekcje zadań

```
▼ ACTIVE (3)
  [A] Zaimplementować Sleep Tabs             [✏] [🗑]
  [B] Poprawić autosave Notepad              [✏] [🗑]
  [C] Dodać tooltipsy                        [✏] [🗑]

▼ BACKLOG (2)
  [D] Refaktor Settings                      [✏] [🗑]
  [E] Tile view                              [✏] [🗑]

▼ DONE (1)
  [✓] App Library Browser                   [✏] [🗑]
```

Kolory priorytetu:

| Priorytet | Kolor |
|---|---|
| A | `#ef4444` (czerwony) |
| B | `#f97316` (pomarańczowy) |
| C | `#eab308` (żółty) |
| D | `#3b82f6` (niebieski) |
| E | `#22c55e` (zielony) |

### 6.3. TaskModal

```
┌─────────────────────────────────┐
│  Nowe zadanie                   │
│  ─────────────────────────────  │
│  Tytuł *  [                   ] │
│  Priorytet [A ▾]                │
│  Sekcja    [active ▾]           │
│  Komentarz [                   ]│
│  ─────────────────────────────  │
│             [Anuluj]  [Zapisz]  │
└─────────────────────────────────┘
```

---

## 7. AGGREGATED TASKS

Widok zbiorczy zadań ze wszystkich grup. Dostępny z Sidebaru.

### 7.1. Nagłówek z filtrami

```
┌────────────────────────────────────────────────────────────────┐
│ ☑  Wszystkie zadania                              [🔄]         │
│  X active · Y total · Z groups                                 │
│ ─────────────────────────────────────────────────────────────  │
│ [🔍 Filtruj...] [Status ▾] [Priorytet ▾] [Sekcja ▾]           │
│ [Zwiń wszystkie] [Rozwiń wszystkie] (gdy aktywny filtr: [✕])   │
└────────────────────────────────────────────────────────────────┘
```

### 7.2. Lista grup

```
▼ MultiWeb Manager (12)          [👁] [∧]
  ─ ACTIVE ──────────────────────────────
  [A] Zaimplementować Sleep Tabs
  [B] Dodać App Library
  ─ BACKLOG ─────────────────────────────
  [C] Poprawić autosave
  ─ DONE ────────────────────────────────
  [✓] SplashScreen

▼ Projekt B (3)                  [👁] [∧]
  ...

■ Projekt C (ukryty)             [👁]
  (uproszczony pasek, opacity 0.5)
```

- `[👁]` – toggle ukrycia grupy (zapis w `settings.hiddenTaskGroups`)
- `[∧]` / `[∨]` – zwijanie (zapis w `settings.collapsedTaskGroups`)
- Pinnowane zadania (`task.pinned = true`) wyświetlane na górze sekcji

---

## 8. NOTEPAD

### 8.1. Zakładki

```
[ README.md ✕ ] [ notatki ✕ ] [ API ✕ ] [+]
```

- Double click → rename (inline edit)
- `✕` → zamknięcie (ConfirmModal jeśli niezapisany)
- `[+]` → nowa zakładka z domyślną nazwą

### 8.2. Toolbar

```
[💾 Zapisz] [📋 Kopiuj] [🔍 Znajdź] [📥 Import] [📤 Eksport] [📋 Historia schowka]
```

### 8.3. Editor

```
┌─────────────────────────────────────────────────────────────┐
│  [Zawartość plain text — textarea]                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- Plain text (obecny stan)
- Syntax highlight: BACKLOG (`isFeatureEnabled('syntaxHighlight') = false`)
- Rich text: BACKLOG (`isFeatureEnabled('richText') = false`)

### 8.4. FindReplace bar (toggle przez toolbar)

```
┌──────────────────────────────────────────────────┐
│ Szukaj: [           ]  Zamień: [           ]     │
│ [↑] [↓]  [Zamień]  [Zamień wszystkie]  [✕]       │
└──────────────────────────────────────────────────┘
```

### 8.5. Status bar

```
Linie: 142  |  Znaki: 3241  |  Autosave: włączony
```

- Autosave co 5s tylko gdy content zmieniony (porównanie hash)

---

## 9. SETTINGS

Sekcje w osobnych komponentach JSX, dostępne z Sidebaru lub `ContentRenderer`.

### 9.1. General

```
Język          [ Polski ▾ ]
Motyw          [ Ciemny ▾ ]
Debug mode     [ OFF ]
```

### 9.2. WebView

```
AdBlocker               [ ON ]
Edytowalny pasek URL    [ OFF ]
Domyślny User Agent     [                      ]
```

### 9.3. Tabs

```
Sleep tabs timeout      [ 15 min ▾ ]
  (opcje: 5 / 15 / 30 / 60 min / nigdy)
```

### 9.4. Notifications

```
Toasty UI               [ ON ]
Powiadomienia systemowe [ ON ]
Pushbullet API key      [                      ]  [Zapisz]
  ▶ Jak ustawić Pushbullet?
    1. Wejdź na pushbullet.com
    2. Przejdź do ustawień API
    3. Skopiuj klucz i wklej powyżej
```

### 9.5. Hotkeys (HotkeysManagerSection)

```
Skrót             Nazwa                   Tekst  Wł.   Akcje
Ctrl+Shift+S      Screenshot WebView       -      [✓]  [✏][🗑]
Ctrl+Shift+M      Resource Monitor         -      [✓]  [✏][🗑]
Ctrl+Shift+1      Snippet: Email sig.     Best…  [✓]  [✏][🗑]

[+ Dodaj skrót]
```

Modal edycji:
```
┌──────────────────────────────────┐
│  Edytuj skrót                    │
│  Skrót *    [Ctrl+Shift+S      ] │
│  Nazwa *    [Screenshot        ] │
│  Tekst      [                  ] │
│  Akcja      [screenshot ▾]       │
│  Włączony   [✓]                  │
│             [Anuluj]  [Zapisz]   │
└──────────────────────────────────┘
```

### 9.6. Konto (AccountSection)

Placeholder — przyciski logowania disabled (sync w przygotowaniu).

### 9.7. Data & Management (DataManagementSection)

```
[Eksportuj ustawienia]  [Importuj ustawienia]
```

### 9.8. Logi (LogsSection) — widoczne tylko gdy `debugMode = true`

```
Logi testów:
[📂 Otwórz folder]  [👁 Podgląd]  [🗑 Wyczyść]
Zapisuj logi  [OFF]

Dziennik zdarzeń:
Włącz dziennik zdarzeń  [OFF]
(gdy ON:) [👁 Podgląd]  [🗑 Wyczyść]
```

### 9.9. Debug modules (DebugModulesSection)

Toggle-y modułów debugowania — widoczne tylko gdy `debugMode = true`.

### 9.10. WebView section (WebViewSection)

Konfiguracja zachowania webview per instancja.

### 9.11. Tabs section (TabsSection)

Konfiguracja zakładek i sleep tabs.

---

## 10. TOOLS

Dostępne z Sidebaru przez `ToolsContainer`. Rejestr narzędzi w `src/config/toolsRegistryConfig.js` — dodanie narzędzia = nowy wpis w rejestrze, bez modyfikacji ToolsContainer.

### Lista narzędzi

| Narzędzie | Feature flag | Komponent |
|---|---|---|
| JSON Formatter | `jsonFormatter` | `JsonFormatter.jsx` |
| Regex Tester | `regexTester` | `RegexTester.jsx` |
| Markdown Previewer | `markdownPreviewer` | `MarkdownPreviewer.jsx` |
| Image Tools | `imageTools` | `ImageTools.jsx` |
| SVG → PNG | `svgToPng` | `SvgToPngConverter.jsx` |
| File Previewer | `filePreviewer` | `FilePreviewer.jsx` |
| Mini Postman | `miniPostman` | `MiniPostman.jsx` |
| Clipboard History | `clipboardHistory` | `ClipboardHistory.jsx` |
| Cookie Grabber | `cookieGrabber` | `CookieGrabber.jsx` |
| Remove.bg | `removeBg` | `RemoveBgTool.jsx` |
| String Combiner | `stringCombiner` | `StringCombiner.jsx` |

Narzędzie z `featureFlag: false` → wyświetla komunikat `t('tools.disabled')` zamiast crasha.

---

## 11. TERMINAL

```
┌────────────────────────────────────────────────────────────┐
│ xterm.js viewport                                          │
│                                                            │
│ user@machine:~$ █                                          │
│                                                            │
└────────────────────────────────────────────────────────────┘
│ [Wyczyść]  [Restart sesji]                                 │
```

- `node-pty` backend, `xterm.js` frontend
- ANSI coloring, historia komend (↑)

---

## 12. HISTORY LOG

```
Filtry: [Info] [Warn] [Error]  Sortowanie: [Najnowsze ▾]  [Eksport CSV]  [Wyczyść]

[INFO]  2026-06-07 13:08 – Settings saved
[WARN]  2026-06-07 12:01 – WebView crashed
[ERROR] 2026-06-07 12:00 – IPC save failed: profiles
```

---

## 13. ELEMENTY WSPÓLNE UI

### 13.1. Modale

- `Modal` – bazowy, ESC i klik-poza zamykają, `ModalPortal` przez `createPortal`
- `ConfirmModal` – zastępuje `window.confirm`
- `ProfileModal`, `CategoryModal`, `TaskModal`, `CommentModal`, `PromptModal`, `HotkeyModal`
- Rozmiary: `small` 400px / `medium` 600px / `large` 800px
- `z-index: 20000` (powyżej toastów i reszty UI)

### 13.2. Toasty (system kolejkowania)

```
                          ┌────────────────────────────────┐
                          │ ✓  Ustawienia zapisane      [✕] │  ← success (zielony)
                          ├────────────────────────────────┤
                          │ ⚠  Brak połączenia z net.   [✕] │  ← warning (żółty)
                          └────────────────────────────────┘
```

- Pozycja: fixed, `bottom: 20px, right: 20px`, `flex-direction: column-reverse`
- Max widocznych jednocześnie: `MAX_ACTIVE = 3` (z `toastConfig.js`)
- Overflow → FIFO queue (`toastReducerStore.js`)
- Auto-dismiss: `VISIBLE_MS = 2000ms`, animacja exit: `ANIMATE_MS = 300ms`
- Typy: `success` (zielony) / `error` (czerwony) / `info` (niebieski) / `warning` (żółty)
- `z-index: 9000` (poniżej modali 20000)
- Źródło eventu: `CustomEvent('mwm:toast')` z `notificationsManager.js`

### 13.3. Tooltipy

Na każdym przycisku, ikonie, polu formularza. Treść z locales.

### 13.4. Loading states

Spinner/skeleton dla operacji > 200ms. Blokada przycisku w czasie operacji.

---

## 14. STAN WDROŻENIA

| Sekcja | Status |
|---|---|
| SplashScreen | ✅ zaimplementowany |
| OnboardingScreen (5 kroków) | ✅ zaimplementowany (Account = placeholder) |
| Sidebar (Header, Profile List, Tools, Workspaces) | ✅ zaimplementowany |
| WebViewTab (toolbar, sleep, error bar, AdBlocker) | ✅ zaimplementowany |
| TaskPanel (active/backlog/done, TaskModal) | ✅ zaimplementowany |
| AggregatedTasks (filtry, grupy, collapse/hide) | ✅ zaimplementowany |
| Notepad (multi-tab, autosave, FindReplace) | ✅ zaimplementowany |
| Terminal (xterm + node-pty) | ✅ zaimplementowany |
| History Log (filtry, eksport) | ✅ zaimplementowany |
| Settings (wszystkie sekcje) | ✅ zaimplementowany |
| Tools (rejestr, 11 narzędzi) | ✅ zaimplementowany |
| Toast system (kolejka, FIFO, MAX_ACTIVE=3) | ✅ zaimplementowany |
| App Library Browser | ✅ zaimplementowany |
| ProjectManager | ✅ zaimplementowany |
| Resource Monitor UI | ❌ BACKLOG |
| Tile View (WebView obok siebie) | ❌ BACKLOG |
| Global Search (Ctrl+K) | ❌ BACKLOG (`unifiedSearch: false`) |
| Quick Switcher | ❌ BACKLOG (`quickSwitcher: false`) |
| Syntax highlight / Rich text w Notepad | ❌ BACKLOG |
| WebView Script Injector UI | ❌ BACKLOG (`webviewScriptInjector: false`) |
| Account / Sync | ❌ BACKLOG |

---

## 15. ZASADY OGÓLNE PROJEKTU UI

- **Ciemny motyw domyślny**, jasny opcjonalny
- **CSS variables** dla wszystkich kolorów (`var(--bg-primary)`, `var(--accent)`, itd.)
- **Płaskie UI** – zero gradientów
- **Ikonografia** wyłącznie z `src/utils/icons.js` (fasada na `src/data/icons.js`)
- **Zakaz** `alert()` / `confirm()` / `prompt()` – zastąpione modalami i toastami
- **Zakaz** hardcoded tekstów – wszystko przez `t('...')` z `TranslationContext`
- **Animacje** 150–200ms (fade/slide)
- `border-radius: 8px` na elementach UI, `12px` na kafelkach onboardingu
- Formularze: inputy z focus na borderze, `border-radius: 8px`
- Modale portowane przez `ModalPortal` (`createPortal` do `document.body`)