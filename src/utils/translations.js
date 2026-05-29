// =============================================================================
// FILE: translations.js
// PATH: src/utils/translations.js
// VERSION: 0.0.3
// PURPOSE: Logika ładowania tłumaczeń i helpData, provider contextu (dynamicznie)
// FUNCTIONS: TranslationProvider
// DEPENDS ON: react, config.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { LANGUAGES, DEFAULT_LANGUAGE } from '../config.js';
// loggerRenderer nie jest dostępny tutaj (translations.js ładuje się przed App),
// używamy console.warn jako fallback dla brakujących kluczy.
const _warnMissingKey = (key) => console.warn(`[i18n] Brakujący klucz tłumaczenia: "${key}" — sprawdź pl.json / en.json`);
const TranslationContext = createContext(null);
// Dynamiczne zaimportowanie tłumaczeń dla danego języka
async function loadTranslations(lang) {
  try {
    const module = await import(`../locales/${lang}.json`);
    return module.default;
  } catch (err) {
    console.error(`Failed to load translations for ${lang}`, err);
    return null;
  }
}
// Dynamiczne zaimportowanie helpData dla danego języka
async function loadHelpData(lang) {
  try {
    const module = await import(`../locales/help_${lang}.json`);
    return module.default;
  } catch (err) {
    console.error(`Failed to load help for ${lang}`, err);
    return null;
  }
}
export function TranslationProvider({ children }) {
  const [locale, setLocaleState] = useState(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState({});
  const [helpData, setHelpData] = useState({});
  const [loaded, setLoaded] = useState(false);
  // Ładowanie tłumaczeń dla aktywnego języka
  useEffect(() => {
    const load = async () => {
      const data = await loadTranslations(locale);
      if (data) setTranslations(data);
      setLoaded(true);
    };
    load();
  }, [locale]);
  // Ładowanie helpData dla aktywnego języka
  useEffect(() => {
    if (!loaded) return;
    const load = async () => {
      const data = await loadHelpData(locale);
      if (data) setHelpData(data);
    };
    load();
  }, [locale, loaded]);

  // Zmiana języka (zapis do settings)
  const setLocale = useCallback(async (lang) => {
    if (!LANGUAGES.includes(lang)) {
      console.warn(`Language ${lang} not supported, falling back to ${DEFAULT_LANGUAGE}`);
      lang = DEFAULT_LANGUAGE;
    }
    setLocaleState(lang);
    if (window.electronAPI) {
      await window.electronAPI.saveSettings({ language: lang });
    }
  }, []);

  // Funkcja tłumaczenia (interpolacja parametrów)
  const t = useCallback((key, params = {}) => {
    const dict = translations;
    const parts = key.split('.');
    let val = dict;
    for (const part of parts) {
      if (val && typeof val === 'object') val = val[part];
      else return key;
    }
    if (typeof val !== 'string') {
      _warnMissingKey(key);
      return key;
    }
    return Object.keys(params).reduce(
      (str, p) => str.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p]),
      val
    );
  }, [translations]);

  return (
    <TranslationContext.Provider value={{ t, locale, setLocale, loaded, helpData }}>
      {children}
    </TranslationContext.Provider>
  );
}

export { TranslationContext };
