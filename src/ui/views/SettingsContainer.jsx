// =============================================================================
// FILE: SettingsContainer.jsx
// PATH: src/ui/views/SettingsContainer.jsx
// VERSION: 0.0.3
// PURPOSE: Kontener renderowania ustawień, pomocy, historii i zadań zagregowanych
// FUNCTIONS: SettingsContainer
// DEPENDS ON: react, config.js, loggerRenderer.js, Spinner.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { lazy, Suspense } from 'react';
import { isFeatureEnabled } from '../../config.js';
import { logWarn } from '../../utils/loggerRenderer.js';
import { Spinner } from './Spinner.jsx';

const Settings       = lazy(() => import('../settings/Settings'));
const Help           = lazy(() => import('../help/Help'));
const AggregatedTasks = lazy(() => import('../tasks/AggregatedTasks'));
const HistoryLog     = lazy(() => import('../history/HistoryLog'));

// ─── SettingsContainer() – renderuje odpowiedni widok ustawień/pomocy/historii
//   @param {Object} props.activeItem    – aktywny element specjalny
//   @param {Object} props.settings      – ustawienia aplikacji
//   @param {Function} props.onSaveSettings – callback zapisu ustawień
//   @returns {JSX.Element|null}
export default function SettingsContainer({ activeItem, settings, onSaveSettings }) {
  const wrap = (Component, props = {}) => (
    <Suspense fallback={<Spinner />}>
      <Component {...props} />
    </Suspense>
  );

  switch (activeItem.id) {
    case 'settings':
      return wrap(Settings, { settings, onSave: onSaveSettings });
    case 'help':
      if (!isFeatureEnabled('helpScreen')) {
        logWarn('SettingsContainer: helpScreen feature is disabled');
        return null;
      }
      return wrap(Help);
    case 'aggregatedTasks':
      return wrap(AggregatedTasks);
    case 'history':
      return wrap(HistoryLog);
    default:
      logWarn(`SettingsContainer: unknown id "${activeItem.id}"`);
      return null;
  }
}