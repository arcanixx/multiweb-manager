<!-- =============================================================================
 FILE: Global_Project_Starter_Guide.md
 PATH: doc/Global_Project_Starter_Guide.md
 VERSION: 0.0.3
 PURPOSE: Dokumentacja specyfikacji projektowej - Globalny przewodnik inicjalizacji projektów (AI First)
 FUNCTIONS: Dokumentacja: 15 sekcji głównych
 DEPENDS ON: -
 UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
 ============================================================================= -->

# 🌍 GLOBALNY PRZEWODNIK INICJALIZACJI PROJEKTÓW (AI-FIRST)
---
## 1. PRZYGOTOWANIE SYSTEMU OPERACYJNEGO (WINDOWS DEV ENVIRONMENT)
Aby system działał stabilnie i automatycznie dostarczał zmienne środowiskowe, instalujemy kluczowe pakiety globalnie przez menedżer Chocolatey (uruchom PowerShell jako Administrator):
```bash
# Instalacja środowisk uruchomieniowych i kompilatorów
choco install nodejs-lts -y --version 22.11.0
choco install python3 -y
choco install git -y
# Narzędzia kompilacji dla node-pty / modułów natywnych C++
npm install --global --production windows-build-tools
```
### Narzędzia dla projektów mobilnych (budowanie APK bez Android Studio jako edytora)
Zamiast instalować ciężkie środowisko graficzne, pobieramy same narzędzia CLI do kompilacji:
```bash
choco install android-sdk android-ndk openjdk17 -y
```
> Zmienne systemowe (`ANDROID_HOME`, `JAVA_HOME`) zostaną automatycznie dopisane do systemu przez Chocolatey.
---
## 2. REPOZYTORIUM GIT & GITHUB STANDARDS (ENTERPRISE FLOW)
### I. Inicjalizacja i struktura branchy
Każdy projekt, niezależnie od wielkości, zaczynamy od wdrożenia 4 środowisk:
1. `master` / `main` – Kod produkcyjny. Tylko stabilne wersje z tagami (np. `v1.0.0`).
2. `uat` (User Acceptance Testing) – Wersje Release Candidate (RC). Służy do ostatecznych testów funkcjonalnych.
3. `sat` (System Acceptance Testing) – Środowisko integracyjne. Tutaj łączymy mniejsze funkcje, dozwolony szybki bezpośredni push podczas debugowania.
4. `dev` – Główny poligon doświadczalny, z którego tworzymy branche typu `feature/funkcja` lub `fix/poprawka`.
### II. Blokada brancha `master` i `uat` na GitHubie (Branch Protection)
Wchodzimy w `Settings` → `Branches` → `Add branch protection rule`:
- **Branch name pattern:** `master` (oraz druga reguła dla `uat`)
- **Włącz opcje:**
  - `Require a pull request before merging` – wymusza tworzenie PR dla CodeRabbita
  - `Require conversation resolution before merging` – blokuje merge, dopóki nie zamkniesz uwag CodeRabbita/błędów testów
  - `Do not allow bypassing the above settings` – reguła dotyczy także Ciebie jako admina
---
## 3. AUTOMATYCZNY SZABLON OPISU PULL REQUESTA
Tworzymy plik w lokalizacji `.github/pull_request_template.md`. Dzięki temu CodeRabbit i wtyczki do review w VS Code od razu otrzymają idealny kontekst:
```markdown
## 📝 Opis zmian i kontekst architektoniczny
<!-- Wyjaśnij krótko cel zmiany i wpływ na inne moduły aplikacji -->

## 🛠️ Stack i typ zmiany
- [ ] 🚀 Nowa Funkcja (Feature)
- [ ] 🐛 Naprawa błędu (Bugfix)
- [ ] 🧹 Refaktoryzacja / Czyszczenie kodu (Refactor)
- [ ] 📚 Dokumentacja (Docs)

## 📋 Gwarancja jakości AI-First
- [ ] Kod zweryfikowany pod kątem wycieków pamięci (Event Listeners Cleanup)
- [ ] Wszystkie nowe teksty interfejsu przeniesione do plików lokalizacji locales/
- [ ] Nowe ikony zarejestrowane w icons.js (brak hardcoded assetów)
- [ ] Zmiany zaktualizowane w Structure.md oraz Requirements.md
```

---

## 4. STANDARDY INICJALIZACJI PLIKÓW PROJEKTOWYCH (README & MOCKUPS)

Każdy nowy projekt w swoim katalogu głównym (Root) musi posiadać plik **`README.md`** oraz plik makiet w folderze dokumentacji. Zapobiega to chaosowi informacyjnemu w miarę rozrostu aplikacji.

### I. Wymagany szablon README.md (w Root folderze)

```markdown
# 🚀 [Nazwa Projektu]

## 📌 Krótkie opisowe założenia
<!-- 2-3 zdania wyjaśniające unikalną wartość projektu i dla kogo powstaje -->

## 🛠️ Szybki start (lokalne uruchomienie)
1. `npm install`
2. `npm run dev`

## ⚙️ Wymagania systemowe
- Node.js v22 LTS
- System operacyjny z zainstalowanymi zmiennymi środowiskowymi przez Chocolatey.
```

### II. Pliki makiet i zarządzanie zmianami UI/UX

Aby uniknąć marnowania tokenów przy ciągłym czytaniu i modyfikacji wielkich plików opisów graficznych, wdrażamy system kolejkowania poprawek UI:

1. **`Definition_Mockups_UI_UX.md`** – Główny plik z pełnym, zatwierdzonym opisem interfejsu, kafelków, nawigacji i zachowań graficznych (używany np. do generowania widoków w Figma/v0.dev). Modyfikowany rzadko, zbiorczo.
2. **`pending_updates_for_Definition_Mockups_UI_UX.md`** – Plik podręczny. AI dopisuje tu małe, bieżące zmiany w UI/UX wynikające z nowych funkcjonalności w trakcie sprintu. Zmiany stąd są scalane z głównym plikiem makiet raz na kilkanaście/kilkadziesiąt commitów.

---

## 5. CHECKLISTA STARTOWA DLA NOWEGO PROJEKTU

Gdy zaczynasz nowy projekt, Twoja pierwsza wiadomość do Roo Code / Cline powinna brzmieć:

```text
Cześć! Zaczynamy nowy projekt. Oto nasze globalne standardy.
Wgraj plik .clinerules do roota. Następnie utwórz plik README.md według szablonu oraz folder doc/, a w nim zainicjalizuj puste pliki:
1. Structure.md (architektura i drzewo katalogów)
2. Requirements.md (lista wymagań z ID i statusem BACKLOG)
3. Definition_Mockups_UI_UX.md (początkowy opis założeń wizualnych interfejsu)
4. pending_updates_for_Definition_Mockups_UI_UX.md (pusty plik na przyszłe poprawki UI)
5. DevelopersGuide.md (standardy czystego kodu, loggerów, testów i cleanupów)

Zbuduj podstawowy szkielet projektu w oparciu o podział na warstwy: stores/, ui/, utils/ oraz locales/ (w tym locales/help/). Nie pisz kodu funkcjonalnego, dopóki struktura dokumentów nie będzie gotowa i zatwierdzona!
```

---

## 6. .clinerules – INSTRUKCJE DLA AI W VSCODE

Plik `.clinerules` (bez rozszerzenia) umieść w root projektu. Zawiera on rygorystyczne zasady dla AI (Roo Code / Cline / GitHub Copilot).

### Zasady (skrót)

- **ZAKAZ** generowania kodu od zera dla istniejących plików – tylko niezbędne poprawki.
- **Zachowanie kontekstu konfiguracyjnego** – merge, nie nadpisywanie.
- **Aktywny preload bridge** – tylko `preload.cjs`; `preload.js` jest wyłączony.
- **Weryfikacja wersji** – zawsze z `package.json`, nie z pamięci cache.
- **Nagłówek pliku** – obowiązkowy (`FILE`, `PATH`, `VERSION`, `PURPOSE`, `FUNCTIONS`, `DEPENDS ON`, `UWAGA`).
- **Stack technologiczny** – Electron + React, bezpieczeństwo IPC.
- **System logowania** – centralny, przez `loggerRenderer.js` (JSX) lub `logger.js` (JS).
- **Zakaz natywnych okien** – `alert`, `confirm`, `prompt` → modale, toasty.
- **Brak hardcoded tekstów** – wszystko przez `TranslationContext`.
- **Import ikon** – tylko z `src/utils/icons.js` (reeksport).
- **Testy** – obowiązkowe dla nowych modułów, aktualizacja istniejących.
- **Cykl życia dokumentacji** – `pending_updates_for_Definition_Mockups_UI_UX.md` na bieżące zmiany UI.
- **Zasady generowania kodu** – bez automatycznych commitów, komentarze po polsku.

> Plik jest krytyczny dla współpracy z AI – nie modyfikuj go bez potrzeby. Jeśli zmieniasz zasady, upewnij się że są spójne z `AI_Development_Standards.md` i `DevelopersGuide.md`.

---
<!-- END OF FILE -->