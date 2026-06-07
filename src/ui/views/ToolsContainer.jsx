// =============================================================================
// FILE: ToolsContainer.jsx
// PATH: src/ui/views/ToolsContainer.jsx
// VERSION: 0.0.3
// PURPOSE: Kontener renderowania narzędzi specjalnych. Używa TOOLS_REGISTRY zamiast switch-case – nowe narzędzie = wpis w src/config/toolsRegistryConfig.js, bez modyfikacji kontenera.
// FUNCTIONS: ToolsContainer
// DEPENDS ON: react, loggerRenderer.js, translations.js, Spinner.jsx, toolsRegistryConfig.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { Suspense, useEffect, useContext } from 'react';
import { logWarn, logDebug } from '../../utils/loggerRenderer.js';
import { TranslationContext } from '../../utils/translations.js';
import { Spinner } from './Spinner.jsx';
import { getToolComponent } from '../../config/toolsRegistryConfig.js';

// ─── ToolsContainer() – renderuje narzędzie na podstawie activeItem.id z rejestru
//   Dodaj nowe narzędzie w src/config/toolsRegistryConfig.js — tu nie zmieniać.
//   @param {Object}   props.activeItem   – aktywny element (id, cwd, ...)
//   @param {Object}   props.settings     – ustawienia aplikacji
//   @param {Function} props.onOpenTasks  – callback otwierający TaskPanel
export default function ToolsContainer({ activeItem, settings, onOpenTasks }) {
  const { t } = useContext(TranslationContext);
  useEffect(() => { logDebug('ui', 'ToolsContainer mounted', activeItem?.id); }, [activeItem?.id]);

  if (!activeItem?.id) return null;

  const entry = getToolComponent(activeItem.id);

  if (!entry) {
    logWarn('ui', `ToolsContainer: brak wpisu w rejestrze dla id="${activeItem.id}"`);
    return (
      <div style={{ padding: 32, color: 'var(--text-muted)' }}>
        {t('tools.unknown_tool')}: {activeItem.id}
      </div>
    );
  }

  if (entry.disabled) {
    logWarn('ui', `ToolsContainer: narzędzie "${activeItem.id}" wyłączone (featureFlag=${entry.featureFlag})`);
    return (
      <div style={{ padding: 32, color: 'var(--text-muted)' }}>
        {t('tools.disabled')}
      </div>
    );
  }

  // ─── Buduj propsy przez getProps z kontekstem (activeItem, settings, callbacks)
  const Component = entry.component;
  const extraProps = entry.getProps ? entry.getProps({ activeItem, settings, onOpenTasks }) : {};

  return (
    <Suspense fallback={<Spinner />}>
      <Component {...extraProps} />
    </Suspense>
  );
}