# =============================================================================
# FILE: ModulesOverview.md
# PATH: multiweb-manager/docs/ModulesOverview.md
# VERSION: v1.0
# PURPOSE: Ujednolicona lista modułów + opis przeznaczenia dla AI i devów.
# DEPENDS ON: DevelopersGuide.md, structure.txt
# =============================================================================

# 🧩 1. Stabilność i fundamenty (architektura)

## Cleanup event listenerów
Opis: Usuwanie wszystkich addEventListener/on(...) w WebViewTab, Terminal, App, preload.js.  
Cel: Brak memory leaków.

## Walidacja danych w IPC
Opis: Każdy handler IPC waliduje typy i strukturę danych.  
Cel: Brak korupcji danych.

## try/catch w IPC
Opis: Każdy handler zwraca { ok, data, error }.  
Cel: Przewidywalne błędy.

## SingleInstanceLock
Opis: Blokada wielu instancji aplikacji.  
Cel: Stabilność store.

## Global error handlers
Opis: Logowanie uncaughtException/unhandledRejection.  
Cel: Diagnostyka.

## Settings merge
Opis: Zapis ustawień przez merge, nie overwrite.  
Cel: Brak utraty danych.

## Zapis profili
Opis: Każda zmiana profili → saveProfiles().  
Cel: Trwałość profili.

## Autosave Notepad tylko przy zmianie
Opis: Porównanie content vs lastSaved.  
Cel: Oszczędność I/O.

## Logger + logi do pliku
Opis: Logi w userData/logs/app.log + eksport.  
Cel: Debug.

## config.js
Opis: Stałe, limity, wartości domyślne.  
Cel: Czysta architektura.

## WebView error bar
Opis: Pasek błędu zamiast alertów.  
Cel: UX.

## Modale zamiast alert/prompt
Opis: Globalny komponent Modal.  
Cel: Spójny UX.

## Toast + system notifications
Opis: Nowoczesne powiadomienia.  
Cel: Feedback.

## Pushbullet API
Opis: Powiadomienia mobilne.  
Cel: Integracja.

## Spellcheck + syntax highlight
Opis: Notepad z CodeMirror/Monaco.  
Cel: Edycja kodu.

## Voice agent / AI agent
Opis: DO-ANALYSIS.  
Cel: Automatyzacja.

## Automatyczne code review
Opis: DO-ANALYSIS.  
Cel: Analiza kodu.

# 🧩 2. Sidebar / Profile Manager / App Library

## App Library
Opis: Statyczna lista aplikacji, dodawanie profili jednym kliknięciem.  
Dane: id, name, url, icon, isPinned, isDefault, isFavorite.

## Filtrowanie profili
Opis: Search bar nad listą profili.

## Kategorie profili
Opis: AI / Dev / Design / Productivity / Special.

## Ostatnio używane
Opis: Sortowanie po lastUsedAt.

## Drag & drop profili
Opis: Zmiana kolejności + zapis.

## Edycja profilu (modal)
Opis: Nazwa, URL, label, notatki, userAgent, adBlocker per profil.

## Multi-account login
Opis: DO-ANALYSIS.

# 🧩 3. WebViewTab / przeglądarka

## Toolbar jak w przeglądarce
Opis: Back, Forward, Refresh, Copy URL, Open External, Zoom, DevTools, Clear Cache.

## Tile view
Opis: 2–3 WebView obok siebie.

## Custom user agent
Opis: Per profil.

## AdBlocker globalny + per profil
Opis: Override globalnego ustawienia.

## Single App Mode
Opis: Otwieranie profilu w osobnym oknie.

## Resource Monitor
Opis: Toast z RAM/CPU WebView.

## Sleep Tabs
Opis: Usypianie nieaktywnych WebView po X minutach.

## Screenshot WebView
Opis: Zapis do schowka + toast.

# 🧩 4. Notepad

## Multi-tab
Opis: Zakładki, rename, close.

## Autosave tylko przy zmianie
Opis: Porównanie content.

## Syntax highlight
Opis: CodeMirror/Monaco.

## Rich text
Opis: Bold, italic, listy.

# 🧩 5. TaskPanel / AggregatedTasks

## TaskModal (Add/Edit Task)
Opis: Modal zamiast prompt.

## Filtrowanie po priorytecie
Opis: A/B/C/D/E.

## Wyszukiwarka zadań
Opis: Search bar.

## Rich text w zadaniach
Opis: Opis jak w Jira.

## AggregatedTasks
Opis: Widok zadań per projekt.

# 🧩 6. Terminal

## node-pty + xterm
Opis: Pełny terminal.

## Cleanup listenerów
Opis: Usuwanie onData/onExit.

## Historia komend
Opis: Strzałka w górę/dół.

## Kolorowanie ANSI
Opis: xterm obsługuje.

# 🧩 7. Settings

## Hotkeys manager
Opis: Skróty + teksty do wklejenia.

## Dark mode
Opis: Tailwind + klasa .dark.

## Eksport/Import ustawień
Opis: Plik JSON.

## Logi dostępne z Settings
Opis: Przycisk „Otwórz folder logów”.

## Konto użytkownika + sync
Opis: DO-ANALYSIS.

# 🧩 8. Tools (narzędzia)

## JSON/YAML/XML formatter
## Regex tester
## Markdown Previewer
## Image Tools
## SVG → PNG converter
## File Previewer
## Mini Postman
## Clipboard history
## Cookie Grabber

# 🧩 9. App Library (pełna)

## app-library.json
Opis: Każda aplikacja ma: id, name, url, icon, isPinned, isDefault, isFavorite.

## AppLibraryBrowser
Opis: Pełny widok biblioteki.

# 🧩 10. UI/UX

## Sidebar redesign
## WebView toolbar
## Toasty
## Tooltipy wszędzie
## Modale
## Loading states

# =============================================================================
# END OF FILE
# =============================================================================
