// =============================================================================
// FILE: useTranslation.js
// PATH: src/hooks/useTranslation.js
// VERSION: 0.0.3
// PURPOSE: Hook do dostępu do tłumaczeń i helpData
// FUNCTIONS: useTranslation
// DEPENDS ON: react, translations.js
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
      logError('useTranslation: TranslationContext is null');
      throw new Error('useTranslation must be used within <TranslationProvider>');
    }
    logInfo('useTranslation: context loaded');
    return ctx;
  } catch (err) {
    logError('useTranslation exception', err);
    logWarn('Wystąpił błąd podczas ładowania kontekstu tłumaczeń');
    throw err;
  }
}
