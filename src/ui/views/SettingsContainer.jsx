// =============================================================================
// FILE: SettingsContainer.jsx
// PATH: src/ui/views/SettingsContainer.jsx
// VERSION: 0.0.3
// PURPOSE: Kontener renderowania widoków ustawień/pomocy/historii/zadań. Używa SETTINGS_REGISTRY zamiast switch-case — nowy widok = wpis w src/config/settingsRegistry.js, bez modyfikacji kontenera.
// FUNCTIONS: SettingsContainer
// DEPENDS ON: react, loggerRenderer.js, translations.js, Spinner.jsx, settingsRegistry.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { Suspense, useContext, useEffect } from 'react';
import { logWarn, logDebug } from '../../utils/loggerRenderer.js';
import { TranslationContext } from '../../utils/translations.js';
import { Spinner } from './Spinner.jsx';
import { getSettingsComponent } from '../../config/settingsRegistry.js';

// ─── SettingsContainer() – renderuje widok systemowy na podstawie activeItem.id z rejestru
//   Dodaj nowy widok w src/config/settingsRegistry.js — tu nie zmieniać.
//   @param {Object}   props.activeItem      – aktywny element (id, ...)
//   @param {Object}   props.settings        – ustawienia aplikacji
//   @param {Function} props.onSaveSettings  – callback zapisu ustawień
export default function SettingsContainer({ activeItem, settings, onSaveSettings }) {
  const { t } = useContext(TranslationContext);
  useEffect(() => { logDebug('ui', 'SettingsContainer mounted', activeItem?.id); }, [activeItem?.id]);

  if (!activeItem?.id) return null;

  const entry = getSettingsComponent(activeItem.id);

  if (!entry) {
    logWarn('ui', `SettingsContainer: brak wpisu w rejestrze dla id="${activeItem.id}"`);
    return (
      <div style={{ padding: 32, color: 'var(--text-muted)' }}>
        {t('settings.unknown_view')}: {activeItem.id}
      </div>
    );
  }

  if (entry.disabled) {
    logWarn('ui', `SettingsContainer: widok "${activeItem.id}" wyłączony (featureFlag=${entry.featureFlag})`);
    return null;
  }

  const Component  = entry.component;
  const extraProps = entry.getProps ? entry.getProps({ settings, onSaveSettings }) : {};

  return (
    <Suspense fallback={<Spinner />}>
      <Component {...extraProps} />
    </Suspense>
  );
}