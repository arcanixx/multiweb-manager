=============================================================================
FILE: AI_Development_Standards.md
PATH: DOC/AI_Development_Standards.md
VERSION: 0.0.3
PURPOSE: Standardy tworzenia i modyfikacji kodu dla MultiWeb Manager
DEPENDS ON: structure.txt, DevelopersGuide.md
=============================================================================

# =============================================================================
# AI DEVELOPMENT STANDARDS – MULTIWEB MANAGER v0.0.3
# =============================================================================

## Zasady tworzenia i modyfikacji kodu dla AI
Poniższe standardy są ogólne, a przykłady mają charakter poglądowy.
Implementacja zależy od aktualnej architektury aplikacji, istniejących wywołań i struktury modułów.
Nazwy funkcji, hooków, loggerów czy helperów mogą się różnić (`logger()`, `_log()`, itp.),
ale efekt końcowy musi zawsze spełniać zasady opisane poniżej.

---

# =============================================================================
# 1. NAGŁÓWEK PLIKU (OBOWIĄZKOWY)
# =============================================================================

Dla wszystkich plików, poza .json i tam, gdzie się nie da komentarza dodać:
// =============================================================================
// FILE: nazwa_pliku.js
// PATH: pełna/ścieżka/od/roota
// VERSION: aktualna wersja pliku, zwykle w formacie #.#.# iteracyjnie
// PURPOSE: 1–3 linijki opisujące przeznaczenie pliku
// FUNCTIONS: wypisane jeżeli istnieją i mają sens, funkcje, jakie są obsługiwane w danym module etc, zbiory danych CONST (pliki z danymi), lub kategorie (np. w locales, icons.js etc)
// DEPENDS ON: lista zależności (moduły, pliki, biblioteki)
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

Dla plików .json:

{
  "_comment": "FILE: nazwa_pliku.json | PATH: pełna/ścieżka | VERSION: #.#.# | PURPOSE: opis | UWAGA: Nie usuwać komentarzy",
  "version": "#.#.#"
}

---

# =============================================================================
# 2. IKONY – ZERO HARDCODED
# =============================================================================

## Zabronione
- Emoji w kodzie (np. 🪟 – błędna ikona, niekompatybilna ze starszym Chrome).
- Stringi z ikonami wpisane bezpośrednio w kodzie.
- Fallbacki do emoji.
- Wklejanie ikon bezpośrednio w JSX lub JS.

## Dozwolone
import { ICONS } from '../data/icons.js'
<button>{ICONS.SINGLE_APP}</button>

Użycie w JS:
const label = `${ICONS.CAMERA} ${t('actions.takePhoto')}`

Jeśli brakuje ikony — dodaj ją w icons.js, nie w komponencie.

## Przykład w icons.js
ICONS.CAMERA = '📸';
ICONS.WINDOW_BAD = '🪟'; // przykład błędnej ikony – nie używać

## Dodatkowe uwagi
- Ikony muszą być zgodne ze starszym Chrome.
- Przy refaktorze często gubi się fallback/title/label — zwracać uwagę.
- Ikony w locales muszą być w backtickach:
  `${ICONS.CAMERA} Zrób zdjęcie`

---

# =============================================================================
# 3. TŁUMACZENIA – ZERO HARDCODED
# =============================================================================

## Zabronione
- Teksty w JSX (`<h1>Hello</h1>`)
- Komunikaty w konsoli
- Tooltipy, placeholdery, labelki
- Teksty w modalach, toastach, potwierdzeniach

## Dozwolone
import { useTranslation } from '../hooks/useTranslation'
const { t } = useTranslation()
<h1>{t('hello')}</h1>

## Locales
src/locales/pl.json  
src/locales/en.json  
src/locales/helpData_pl.json  
src/locales/helpData_en.json

Każdy nowy klucz musi być dodany w PL i EN.

## Ikony w tłumaczeniach
Jeśli tłumaczenie zawiera `${ICONS.*}`, cały wpis musi być w backtickach:
`${ICONS.CAMERA} Zrób zdjęcie`

---

# =============================================================================
# 4. LOGGER – debugMode
# =============================================================================

## W plikach .js
import { logDebug, logError, logWarn, logInfo } from '../utils/loggerRenderer.js'

logDebug('LoggerRenderer.init', { context })
logError('LoggerRenderer.error', err)

## W plikach .jsx
import { logDebug } from '../utils/loggerRenderer'

const handleClick = () => {
  logDebug('Button.clicked', { source: 'MainActionButton' })
}

## Zasada
Każda istotna funkcja/akcja powinna logować, gdy debugMode = true.

---

# =============================================================================
# 5. KOMENTARZE W KODZIE
# =============================================================================

- Każda istotna funkcja lub stała powinna mieć krótki komentarz (1–2 linijki).
- Jeśli const zawiera dane — opisz skąd pochodzą.
- Przy refaktorze aktualizuj nagłówek pliku.
- Komentarzy nie usuwamy.

---

# =============================================================================
# 6. TESTY JEDNOSTKOWE
# =============================================================================

Każdy nowy moduł → nowe testy w tests/TestRunner_NazwaModulu.js  
Minimum 3 testy na moduł.

## Przykład
import { ICONS } from '../src/data/icons.js'
import { t } from '../src/locales/i18n'
import { logInfo, logError } from '../src/utils/logger.js'

export async function runNazwaModuluTests() {
  const title = `${ICONS.TEST} ${t('tests.nazwaModulu.title')}`
  let passed = 0
  let failed = 0

  console.log(title)

  try {
    // test 1 – t('tests.nazwaModulu.case1')
    // test 2 – t('tests.nazwaModulu.case2')
    // test 3 – t('tests.nazwaModulu.case3')
  } catch (err) {
    logError(t('tests.nazwaModulu.error'), err)
    failed++
  }

  logInfo(t('tests.nazwaModulu.summary'), { passed, failed })
  return { passed, failed }
}

---

# =============================================================================
# 7. REFAKTOR – ROZBIJANIE DUŻYCH PLIKÓW
# =============================================================================

Jeśli plik > 8 KB i/lub zawiera różne logiki → rozbij na moduły. 
Przykład poniżej dla Settings.

## Konwencja
Settings_Engine.js  
Settings_UI.jsx  
Settings_Data.json  
Settings.utils.js

## Katalogi
src/core/  
src/engine/  
src/ui/[modul]/  
src/utils/  
src/data/

---

# =============================================================================
# 8. AKTUALIZACJA DOKUMENTACJI
# =============================================================================

Po każdej istotnej zmianie:

- DevelopersGuide.md
- helpData_pl.json / helpData_en.json
- structure.txt — aktualizacja struktury, zależności, kolejności importów

Jeśli structure.txt nie istnieje — należy go stworzyć.

structure.txt powinien zawierać:
- listę plików i folderów,
- opis odpowiedzialności każdego modułu,
- kolejność ładowania/importów,
- zależności między modułami,
- komentarze dotyczące architektury.

---

# =============================================================================
# 9. STYLE (CSS)
# =============================================================================

## Zasady
- Brak stylów inline (poza dynamicznymi).
- Style podzielone logicznie.
- Modułowość CSS zgodna ze strukturą projektu.

## Przykład 1
index.css  
layout.css  
theme.css  
components.css

## Przykład 2
base.css  
core.css  
settings.css  
minigames.css  
actions.css  
utils.css  
modals.css  
toasts.css

---

# =============================================================================
# 10. CHECKLISTA PRZED PUSH
# =============================================================================

- Nagłówki w plikach
- Brak hardcoded ikon i tekstów
- Dodane testy
- Zaktualizowane locales
- Logger w kluczowych miejscach
- Komentarze aktualne
- npm run dev bez błędów
- debugMode: true → testy przechodzą

---

# =============================================================================
# 11. DODATKOWE UWAGI
# =============================================================================

- Nazwy plików: `_`, nie `-`
- Ścieżki od roota
- Wersja iteracyjna (#.#.#)
- Komentarzy nie usuwamy
- Jeżeli dostaniesz plik z poprawkami do merge jako cały plik do podmiany, 
	upewnij się, że nic ważnego nie znika z poprzedniego, 
	lub nie jest to okrojona wersja raptem.

---

# =============================================================================
# 12. TOOLTIPY
# =============================================================================

Każdy przycisk powinien mieć tooltip.  
Tekst tooltipa w locales.  
Ikony w tooltipach: `${ICONS.INFO} ${t('tooltips.settings')}`

---

# =============================================================================
# 13. TOAST MESSAGES
# =============================================================================

Każde działanie → toast.  
Tekst z locales.  
Ikony z ICONS.

---

# =============================================================================
# 14. ZAKAZ UŻYWANIA NATYWNYCH PROMPTÓW
# =============================================================================

Nie używamy:
window.alert  
window.confirm  
window.prompt

Zamiast tego — własne modale,
bazujące na spójnym CSS projektu,
z tłumaczeniami z locales,
z ikonami z ICONS,
z pełną kontrolą nad UX.

---

# =============================================================================
# 15. STRUKTURA CSS A MODUŁY
# =============================================================================

Pliki CSS powinny być rozbite według funkcjonalności:
base/core, settings, actions, utils, modals, toasts, itp.

---

# =============================================================================
# 16. REQUIREMENTS.MD — STANDARD ZARZĄDZANIA WYMAGANIAMI
# =============================================================================

Plik requirements.md jest obowiązkowy w każdym projekcie.  
Zawiera pełną listę wymagań funkcjonalnych i niefunkcjonalnych, podzielonych na moduły.

## Struktura pliku

Każdy moduł powinien mieć własną sekcję:

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

---

# =============================================================================
# 17. KONFIGURACJA - Plik konfiguracyjny config.js
# =============================================================================

## Plik konfiguracyjny config.js”
Zawiera wszystkie rzeczy z innych modulów, które mogą być łatwo zmieniane, jeśli dotyczą aplikacji, jak:
- DEBUG MODE true/false
- DEFAULT_LANGUAGE
- wszelkiego rodzaju ilosci, jak np. ilosc wpisów, jakie ClipboardHistory ma przechowywać, czy czas, po jakim cos się ma zadziać jako event/akcja,
- DEFAULT_THEME
- DEFAULT_PROFILE
- inne rzeczy z modułów, które warto mieć zebrane w jednym miejscu, z opisanym komentarzem, za co odpowiadają, a mają istotny wpływ jako konfiguracja

---

=============================================================================
# KONIEC DOKUMENTU
=============================================================================
