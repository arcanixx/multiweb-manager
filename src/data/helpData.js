// =============================================================================
// FILE: helpData.js
// PATH: src/data/helpData.js
// VERSION: v1.0
// PURPOSE: Dane do ekranu Help / Docs — spis treści + treść sekcji.
//          Renderowane w Help.jsx jako interaktywna dokumentacja.
// =============================================================================

export const helpData = [
  // ===========================================================================
  // SPIS TREŚCI
  // ===========================================================================
  {
    id: "toc",
    title: "Spis treści",
    type: "toc",
    items: [
      { id: "intro", label: "Wprowadzenie" },
      { id: "sidebar", label: "Sidebar i Profile" },
      { id: "webview", label: "WebView i przeglądarka" },
      { id: "notepad", label: "Notepad" },
      { id: "tasks", label: "TaskPanel i zadania" },
      { id: "projects", label: "Projekty i AggregatedTasks" },
      { id: "terminal", label: "Terminal" },
      { id: "tools", label: "Narzędzia (Tools)" },
      { id: "settings", label: "Ustawienia" },
      { id: "appLibrary", label: "App Library" },
      { id: "features", label: "Funkcje zaawansowane" },
      { id: "shortcuts", label: "Skróty klawiszowe" },
      { id: "faq", label: "FAQ" }
    ]
  },

  // ===========================================================================
  // WPROWADZENIE
  // ===========================================================================
  {
    id: "intro",
    title: "Wprowadzenie",
    content: `
MultiWeb Manager to aplikacja łącząca funkcje przeglądarki, narzędzi developerskich,
zarządzania zadaniami, projektami, notatkami oraz zestawu narzędzi (Tools).
Dokument ten opisuje wszystkie funkcje aplikacji oraz sposób ich używania.

Po lewej stronie znajduje się Sidebar — centrum nawigacji.
Po prawej — WebView, Notepad, TaskPanel, Tools i inne moduły.
`
  },

  // ===========================================================================
  // SIDEBAR
  // ===========================================================================
  {
    id: "sidebar",
    title: "Sidebar i Profile",
    content: `
Sidebar zawiera:
- wyszukiwarkę profili,
- kategorie (AI, Dev, Design, Productivity, Special),
- listę profili,
- ostatnio używane,
- narzędzia (Tools),
- App Library,
- Settings,
- Help.

Każdy profil to osobna aplikacja otwierana w WebView.
Możesz:
- dodawać profile,
- edytować je w modalach,
- zmieniać kolejność (drag & drop),
- przypinać (isPinned),
- oznaczać jako ulubione (isFavorite),
- ustawiać jako domyślne (isDefault),
- dodawać notatki i etykiety,
- ustawiać userAgent,
- włączać/wyłączać AdBlocker per profil.
`
  },

  // ===========================================================================
  // WEBVIEW
  // ===========================================================================
  {
    id: "webview",
    title: "WebView i przeglądarka",
    content: `
Każdy profil otwiera się w WebView z pełnym toolbar'em:
- Back / Forward
- Refresh
- Address Bar (readonly lub edytowalny)
- Copy URL
- Open in Browser
- Zoom In / Out
- DevTools
- Clear Cache
- Screenshot WebView
- Single App Mode
- Resource Monitor

Dodatkowe funkcje:
- Sleep Tabs — usypianie nieaktywnych zakładek
- AdBlocker globalny + per profil
- Tile View — wiele WebView obok siebie
- Custom User Agent
`
  },

  // ===========================================================================
  // NOTEPAD
  // ===========================================================================
  {
    id: "notepad",
    title: "Notepad",
    content: `
Notepad działa jak edytor z zakładkami:
- multi‑tab,
- rename zakładek,
- autosave tylko przy zmianie,
- tryb plain text,
- syntax highlight (CodeMirror/Monaco),
- rich text (bold, italic, listy).

Notatki są zapisywane automatycznie i trwale.
`
  },

  // ===========================================================================
  // TASKPANEL
  // ===========================================================================
  {
    id: "tasks",
    title: "TaskPanel i zadania",
    content: `
TaskPanel umożliwia:
- dodawanie zadań (TaskModal),
- edycję zadań,
- filtrowanie po priorytecie (A–E),
- wyszukiwanie zadań,
- oznaczanie jako wykonane,
- przypisywanie do projektów,
- ustawianie terminów,
- opis rich text.

Zadania są zapisywane w tasksStore.
`
  },

  // ===========================================================================
  // PROJECTS + AGGREGATEDTASKS
  // ===========================================================================
  {
    id: "projects",
    title: "Projekty i AggregatedTasks",
    content: `
ProjectManager pozwala tworzyć projekty z opisem i statusem (aktywne/archiwalne).

AggregatedTasks wyświetla zadania pogrupowane według projektów:
- liczba zadań,
- collapse/expand,
- hide/show,
- sortowanie,
- integracja z TaskPanel.

Ustawienia widoczności są zapisywane w settings.aggregatedTasks.
`
  },

  // ===========================================================================
  // TERMINAL
  // ===========================================================================
  {
    id: "terminal",
    title: "Terminal",
    content: `
Terminal oparty jest o node-pty + xterm.js.

Funkcje:
- pełna obsługa komend,
- kolorowanie ANSI,
- historia komend (strzałki góra/dół),
- restart sesji,
- clear,
- cleanup event listenerów,
- integracja z preload.js i main.js.

Terminal działa w osobnym kontenerze i nie blokuje UI.
`
  },

  // ===========================================================================
  // TOOLS
  // ===========================================================================
  {
    id: "tools",
    title: "Narzędzia (Tools)",
    content: `
Dostępne narzędzia:
- JSON/YAML/XML Formatter
- Regex Tester
- Markdown Previewer
- Image Tools (compress/resize/convert)
- SVG → PNG Converter
- File Previewer
- Mini Postman (API Tester)
- Clipboard History
- Cookie Grabber

Każde narzędzie ma własny komponent i wpis w helpData.
`
  },

  // ===========================================================================
  // SETTINGS
  // ===========================================================================
  {
    id: "settings",
    title: "Ustawienia",
    content: `
Settings zawiera:
- język (PL/EN),
- motyw (dark/light/system),
- debugMode,
- API keys,
- hotkeys manager,
- eksport/import ustawień,
- folder logów,
- Sleep Tabs timeout,
- Resource Monitor thresholds,
- AdBlocker globalny,
- Address Bar editable,
- domyślne kategorie profili.

Ustawienia są mergowane — nigdy nie nadpisywane.
`
  },

  // ===========================================================================
  // APP LIBRARY
  // ===========================================================================
  {
    id: "appLibrary",
    title: "App Library",
    content: `
App Library to lista gotowych aplikacji podzielonych na kategorie.

Każda aplikacja ma:
- id
- name
- url
- icon
- isPinned
- isDefault
- isFavorite

Możesz dodać aplikację do Sidebar jednym kliknięciem.
`
  },

  // ===========================================================================
  // FEATURES
  // ===========================================================================
  {
    id: "features",
    title: "Funkcje zaawansowane",
    content: `
Zaawansowane funkcje aplikacji:
- Single App Mode — otwieranie profilu w osobnym oknie
- Resource Monitor — zużycie RAM/CPU WebView
- Sleep Tabs — usypianie nieaktywnych zakładek
- Screenshot WebView — zapis do schowka
- Cookie Grabber — pobieranie cookies z WebView
- Tile View — wiele WebView obok siebie
- Unified Search — globalne wyszukiwanie (Ctrl+K)
- Quick Switcher — szybkie przełączanie (Ctrl+P)
`
  },

  // ===========================================================================
  // SHORTCUTS
  // ===========================================================================
  {
    id: "shortcuts",
    title: "Skróty klawiszowe",
    content: `
Globalne skróty:
- Ctrl+K — Unified Search
- Ctrl+P — Quick Switcher
- Ctrl+L — fokus na Address Bar
- Ctrl+R — reload
- Alt+← / Alt+→ — back/forward

Hotkeys Manager pozwala tworzyć własne skróty.
`
  },

  // ===========================================================================
  // FAQ
  // ===========================================================================
  {
    id: "faq",
    title: "FAQ",
    content: `
**Czy mogę otworzyć aplikację na drugim monitorze?**  
Tak — użyj Single App Mode.

**Czy mogę wyłączyć AdBlocker tylko dla jednego profilu?**  
Tak — w ProfileModal.

**Czy mogę eksportować ustawienia?**  
Tak — w Settings → Eksport/Import.

**Czy mogę zmienić motyw?**  
Tak — Settings → Theme.
`
  }
];

// =============================================================================
// END OF FILE
// =============================================================================
