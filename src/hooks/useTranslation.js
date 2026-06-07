// =============================================================================
// FILE: useTranslation.js
// PATH: src/hooks/useTranslation.js
// VERSION: 0.0.3
// PURPOSE: Hook React zapewniający dostęp do kontekstu tłumaczeń i danych pomocy.
// FUNCTIONS: useTranslation
// DEPENDS ON: react, translations.js, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useContext } from 'react';
import { TranslationContext } from '../utils/translations.js';
import { logInfo, logError, logWarn } from "../utils/loggerRenderer.js";

// ─── useTranslation() – hook do dostępu do tłumaczeń i helpData
//   @returns {Object} – obiekt z funkcjami tłumaczenia
//   @throws {Error} – jeśli użyty poza TranslationProvider

export function useTranslation() {
  try {
    const ctx = useContext(TranslationContext);
    if (!ctx) {
      logError("ui", "useTranslation: TranslationContext is null");
      throw new Error('useTranslation must be used within <TranslationProvider>');
    }
    logInfo("ui", "useTranslation context loaded");
    return ctx;
  } catch (err) {
    logError("ui", "useTranslation exception", err.message);
    logWarn("ui", "Wystąpił błąd podczas ładowania kontekstu tłumaczeń");
    throw err;
  }
}