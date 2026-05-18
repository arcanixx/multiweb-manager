// =============================================================================
// FILE: useTranslation.js
// PATH: src/hooks/useTranslation.js
// VERSION: 0.0.3
// PURPOSE: Hook i18n dla tłumaczeń PL/EN. Używa React Context żeby unikać
//          wielokrotnych wywołań IPC getSettings() w każdym komponencie.
//          Eksportuje: TranslationProvider (owija App), useTranslation (hook).
//          Obsługuje interpolację parametrów: t('klucz', { param: wartość }).
// DEPENDS ON: React (createContext, useState, useEffect, useContext, useCallback)
//             src/locales/pl.json, src/locales/en.json
//             window.electronAPI.getSettings (preload.js)
// =============================================================================

import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import pl from '../locales/pl.json';
import en from '../locales/en.json';
import { DEFAULT_LANGUAGE } from "../config";

// Słownik tłumaczeń – dodaj nowe języki tutaj
const translations = { pl, en };

// Kontekst – jeden dla całej aplikacji, unika wielokrotnych wywołań IPC
const TranslationContext = createContext(null);

// ----------------------------------------------------------------
// TranslationProvider – owija <App />, ładuje język raz z settings
//   i udostępnia go wszystkim dzieciom przez context.
// ----------------------------------------------------------------
export function TranslationProvider({ children }) {
  const [locale, setLocaleState] = useState(DEFAULT_LANGUAGE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI
        .getSettings()
        .then(settings => {
          const lang = settings.language || DEFAULT_LANGUAGE;
          if (translations[lang]) {
            setLocaleState(lang);
          }
          setLoaded(true);
        })
        .catch(() => setLoaded(true));
    } else {
      setLoaded(true);
    }
  }, []);

  // ----------------------------------------------------------------
  // setLocale() – zmienia język i zapisuje do settings
  // ----------------------------------------------------------------
  const setLocale = useCallback((lang) => {
    if (translations[lang]) {
      setLocaleState(lang);
      if (window.electronAPI) {
        window.electronAPI.saveSettings({ language: lang });
      }
    }
  }, []);

  // ----------------------------------------------------------------
  // t(key, params) – funkcja tłumaczenia z interpolacją parametrów
  //   Przykład: t('removebg.drop_zone', { max: 30 }) → 'Upuść do 30 obrazów'
  //   Jeśli klucz nie istnieje, zwraca sam klucz (widoczny błąd w UI)
  // ----------------------------------------------------------------
  const t = useCallback((key, params = {}) => {
    const dict = translations[locale] || translations[DEFAULT_LANGUAGE];
    // Obsługa zagnieżdżonych kluczy: 'sidebar.add_profile' → dict.sidebar.add_profile
    const parts = key.split('.');
    let val = dict;
    for (const part of parts) {
      if (val && typeof val === 'object') {
        val = val[part];
      } else {
        val = undefined;
        break;
      }
    }
    if (typeof val !== 'string') return key;

    // Interpolacja parametrów {param}
    return Object.keys(params).reduce(
      (str, p) => str.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p]),
      val
    );
  }, [locale]);

  const value = { t, locale, setLocale, loaded };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

// ----------------------------------------------------------------
// useTranslation() – hook do użycia w komponentach
//   Rzuca błąd jeśli użyty poza TranslationProvider
// ----------------------------------------------------------------
export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within <TranslationProvider>');
  }
  return ctx;
}
