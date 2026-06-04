<!-- =============================================================================
 FILE: AI_Development_Standards.md
 PATH: doc/AI_Development_Standards.md
 VERSION: 0.0.3
 PURPOSE: Standardy tworzenia i modyfikacji kodu dla AI – kompaktowy przewodnik
 FUNCTIONS: Dokumentacja: 12 sekcji głównych
 DEPENDS ON: -
 UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
 ============================================================================= -->

# AI DEVELOPMENT STANDARDS — MULTIWEB MANAGER
> Szczegółowe przykłady implementacji: `doc/DevelopersGuide.md`
> Struktura projektu: `doc/Structure.md` | `doc/Structure_light.md`

---

## 1. NAGŁÓWEK PLIKU (OBOWIĄZKOWY)

Każdy plik `*.js`, `*.cjs`, `*.jsx`:
```js
// =============================================================================
// FILE: nazwa_pliku.js
// PATH: src/folder/nazwa_pliku.js
// VERSION: 0.0.3
// PURPOSE: opis przeznaczenia (edytuj ręcznie przy zmianie odpowiedzialności)
// FUNCTIONS: eksportowane funkcje (auto-skrypt)
// DEPENDS ON: zależności (auto-skrypt)
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================
```

**Zasady:**
- Kolejność pól STAŁA: `FILE → PATH → VERSION → PURPOSE → FUNCTIONS → DEPENDS ON → UWAGA`
- `PURPOSE` — jedyne pole do ręcznej edycji przez AI
- Pozostałe pola — **NIE modyfikuj ręcznie** (nadpisze `build_structure.py --fix`)
- `VERSION` — zawsze z `package.json`, nigdy z pamięci; jeśli brak — zapytaj
- Dodatkowe uwagi umieszczaj **POD** blokiem nagłówka, nie wewnątrz
- Dla `.css`: `/* ... */`, dla `.md`/`.html`: `<!-- ... -->`, dla `.json`: `"_comment": "..."`

---

## 2. BEZPIECZEŃSTWO IPC (KRYTYCZNE)

```
src/ui/ i src/hooks/  →  window.electronAPI  →  preload.cjs  →  src/ipc/  →  src/core/
```

- **ZAKAZ** importu `electron`, `fs`, `path`, `child_process` w `src/*` (renderer process)
- Komunikacja z Node.js **WYŁĄCZNIE** przez `window.electronAPI.invoke(channel, ...args)`
- Generyczny invoke: `window.electronAPI.invoke('namespace:action', payload)`

**Konwencja kanałów IPC:** `namespace:action` (np. `tasks:getAll`, `settings:update`)

**Wzorzec warstw:**
```
KomponentUI.jsx  →  useFeature.js (hook)  →  invoke('feature:action')
                                                    ↓
                              ipcMainHandlers_feature.js  →  featureStore.js
```

---

## 3. HOOKI — KONWENCJA NAZEWNICTWA

| Typ hooka | Nazwa pliku | Kiedy używać |
|---|---|---|
| Hook głównego komponentu | `useTaskPanel.js` | 1:1 z komponentem |
| Hook pomocniczy | `useTaskPanelFilters.js` | wydzielona logika |
| Hook domeny IPC | `useTasks.js` | dane domenowe przez IPC |

Hook **NIGDY** nie importuje ze `src/core/` — tylko `window.electronAPI.invoke()`.

---

## 4. IKONY — ZERO HARDCODED

```js
import { ICONS } from '../utils/icons.js'; // ← JEDYNE dozwolone źródło
```

- **ZAKAZ** emoji bezpośrednio w JSX/JS (niekompatybilne ze starszym Chrome)
- **ZAKAZ** importu z `src/data/icons.js` — tylko przez fasadę `src/utils/icons.js`
- Brakująca ikona → dodaj w `src/data/icons.js`

---

## 5. TŁUMACZENIA — ZERO HARDCODED

```js
import { TranslationContext } from '../utils/translations.js';
const { t } = useContext(TranslationContext);
// Każdy string widoczny dla użytkownika: t('klucz')
```

- Nowy klucz → dodaj jednocześnie w `pl.json` **i** `en.json` (i template)
- Pliki locales: `src/locales/pl.json`, `en.json`, `help_pl.json`, `help_en.json`
- Ikony w locales: `` `${ICONS.CAMERA} ${t('action')}` `` (backticki)

---

## 6. LOGGER

| Kontekst | Import |
|---|---|
| Komponenty React (`*.jsx`) | `src/utils/loggerRenderer.js` |
| Pozostałe (`*.js`, `*.cjs`) | `src/utils/logger.js` |

```js
logInfo('module', 'komunikat', dane);   // moduły: webview, terminal, tasks,
logError('module', 'błąd', err);        //   tools, settings, engine, store, ipc, ui
logWarn('module', 'ostrzeżenie');
logDebug('module', 'debug');
```

---

## 7. FEATURE FLAGS

Obiekt `FEATURES` w `src/config.js`. Szczegóły: `DevelopersGuide.md` sekcja 13.

```jsx
// ZAWSZE po wszystkich hookach — React Hook called conditionally to błąd
export default function Komponent() {
  const { t } = useContext(TranslationContext); // hook
  const [s, setS] = useState(null);             // hook
  if (!isFeatureEnabled('klucz')) return null;  // ← PO hookach
  return <div>...</div>;
}
```

Checklista nowego feature flaga: wpis w `FEATURES`, `isFeatureEnabled` po hookach, pole `feature` w `allTools` (jeśli tool), update tabeli w `DevelopersGuide.md` sekcja 13.5.

---

## 8. ZAKAZY BEZWZGLĘDNE

- `alert()`, `confirm()`, `prompt()` → zamiast tego modale z `src/ui/modals/`
- Hardcoded teksty → `t('klucz')`
- Hardcoded ikony → `ICONS.NAZWA`
- Import `electron`/`fs`/`path` w `src/*` → `window.electronAPI`
- Automatyczne commity → zawsze daj do review

---

## 9. ZASADY EDYCJI PLIKÓW

- **ZAKAZ** generowania pliku od zera jeśli istnieje — tylko chirurgiczne edycje
- **ZAKAZ** usuwania komentarzy
- **ZAKAZ** zgadywania struktury — najpierw przeczytaj plik z repo (`Structure.md`)
- `config.js` — zawsze metoda merge, nigdy overwrite całego obiektu
- Event listenery → cleanup w `return ()` hooka
- IPC handlery → walidacja + `try/catch` + `{ ok, data, error }`
- Nowe moduły → testy w `tests/TestRunner_*.js`

---

## 10. CHECKLISTA PRZED COMMITEM

- [ ] Nagłówki: poprawna kolejność, `PURPOSE` uzupełnione
- [ ] Brak `alert()` / `confirm()` / `prompt()`
- [ ] Brak hardcoded tekstów i ikon
- [ ] Ikony z `utils/icons.js`, logger z `utils/loggerRenderer.js` lub `utils/logger.js`
- [ ] Komunikacja z Node.js tylko przez `window.electronAPI`
- [ ] Event listenery mają cleanup
- [ ] IPC handlery: walidacja + `try/catch` + `{ ok, data, error }`
- [ ] Nowe funkcje mają testy
- [ ] Zmiany UI → `pending_updates_for_Definition_Mockups_UI_UX.md`
- [ ] Locales zaktualizowane (pl + en)
- [ ] Brak automatycznych commitów

---

## 11. AKTUALIZACJA DOKUMENTACJI

Po każdej istotnej zmianie:
- `doc/Structure.md` — uruchom `build_structure.py --fix`
- `doc/Requirements.md` — zaktualizuj statusy zadań
- `doc/DevelopersGuide.md` — jeśli zmienia się architektura/API
- `pending_updates_for_Definition_Mockups_UI_UX.md` — jeśli zmienia się UI (nie główny plik!)
- `src/locales/` — nowe klucze w pl + en

---

## 12. NAZEWNICTWO PLIKÓW

| Typ | Lokalizacja | Przykład |
|---|---|---|
| Handler IPC | `src/ipc/ipcMainHandlers_*.js` | `ipcMainHandlers_tasks.js` |
| Hook | `src/hooks/use*.js` | `useTaskPanel.js` |
| Store | `src/core/*Store.js` | `tasksStore.js` |
| Engine | `src/engine/*.js` | `adBlocker.js` |
| Komponent UI | `src/ui/[modul]/*.jsx` | `TaskPanel.jsx` |
| Narzędzie (front) | `src/ui/tools/*.jsx` | `JsonFormatter.jsx` |
| Test | `tests/TestRunner_*.js` | `TestRunner_Tasks.js` |

---

<!-- KONIEC DOKUMENTU -->
