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
export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within <TranslationProvider>');
  }
  return ctx;
}
