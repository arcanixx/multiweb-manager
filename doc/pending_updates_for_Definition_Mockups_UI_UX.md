<!-- =============================================================================
 FILE: pending_updates_for_Definition_Mockups_UI_UX.md
 PATH: doc/pending_updates_for_Definition_Mockups_UI_UX.md
 VERSION: 0.0.3
 PURPOSE: Dokumentacja specyfikacji projektowej - Kolejka oczekujących zmian UI/UX do scalenia z Definition_Mockups_UI_UX.md.
          AI dopisuje tu bieżące modyfikacje interfejsu wynikające z nowych funkcji w trakcie sprintu.
          Scalanie zbiorcze raz na kilkanaście/kilkadziesiąt commitów.
 FUNCTIONS: -
 DEPENDS ON: -
 UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
 ============================================================================= -->

## [2026-06-07] SplashScreen i OnboardingScreen

- **Plik:** `src/ui/system/SplashScreen.jsx`, `src/ui/system/OnboardingScreen.jsx`
- **Opis:** Oba komponenty zaimplementowane i podpięte w `App.jsx`
- **Nowe zachowanie:**
  - `SplashScreen` — wyświetlany ~1.8s przy każdym starcie, zawiera logo (SVG fallback z `assets/splash_logo.svg`), nazwę aplikacji, tagline, animowany pasek postępu, fade-out 300ms. Callback `onFinished` po zakończeniu.
  - `OnboardingScreen` — 5-krokowy wizard (Theme, Language, Privacy, Apps, Account), wyświetlany gdy `settings.firstRun === true`. Krok Account jest placeholderem (przyciski disabled — czeka na auth). Po zakończeniu ustawia `firstRun: false`.
- **Wpływ na inne komponenty:** `App.jsx` kontroluje przepływ przez flagi `splashDone`/`onboardingDone`. Kolejność: SplashScreen → (firstRun?) OnboardingScreen → MainLayout.

---

## [2026-06-07] ToolsContainer — rejestr zamiast switch-case

- **Plik:** `src/ui/views/ToolsContainer.jsx`, `src/config/toolsRegistryConfig.js`
- **Opis:** ToolsContainer nie używa switch-case — renderuje narzędzia z rejestru `TOOLS_REGISTRY` przez `getToolComponent(id)`.
- **Nowe zachowanie:** Nowe narzędzie = wpis w `toolsRegistryConfig.js`. Komponent nie wymaga modyfikacji. Narzędzia wyłączone przez `featureFlag` renderują komunikat `tools.disabled` zamiast crasha.
- **Wpływ na inne komponenty:** `toolsRegistryConfig.js` — jedyne miejsce do edycji przy dodawaniu narzędzi.

---

## [2026-06-07] Feature flags BACKLOG wyłączone

- **Plik:** `src/config/featuresConfig.js`
- **Opis:** Flagi dla niezaimplementowanych modułów ustawione na `false`: `unifiedSearch`, `quickSwitcher`, `syntaxHighlight`, `richText`, `webviewScriptInjector`.
- **Nowe zachowanie:** Elementy UI zależne od tych flag nie renderują się. Notepad nie pokazuje przycisków syntax highlight / rich text do czasu implementacji.
- **Wpływ na inne komponenty:** Każdy komponent używający `isFeatureEnabled('unifiedSearch')` itp. — zwróci `false`.

