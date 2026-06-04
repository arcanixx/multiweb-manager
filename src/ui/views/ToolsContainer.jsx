// =============================================================================
// FILE: ToolsContainer.jsx
// PATH: src/ui/views/ToolsContainer.jsx
// VERSION: 0.0.3
// PURPOSE: Kontener renderowania narzędzi specjalnych (Notepad, ProjectManager, RemoveBg, AppLibrary itp.)
// FUNCTIONS: ToolsContainer
// DEPENDS ON: react, loggerRenderer.js, Spinner.jsx, config.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { lazy, Suspense, useEffect } from 'react';
import { logWarn, logDebug } from '../../utils/loggerRenderer.js';
import { Spinner } from './Spinner.jsx';
import { isFeatureEnabled } from '../../config.js';

const Notepad            = lazy(() => import('../notepad/Notepad'));
const ProjectManager     = lazy(() => import('../projects/ProjectManager'));
const RemoveBgTool       = lazy(() => import('../tools/RemoveBgTool'));
const StringCombiner     = lazy(() => import('../tools/StringCombiner'));
const Terminal           = lazy(() => import('../terminal/Terminal'));
const AppLibraryBrowser  = lazy(() => import('../appLibrary/AppLibraryBrowser'));

// ─── ToolsContainer() – renderuje odpowiednie narzędzie na podstawie activeItem.id
//   @param {Object} props.activeItem – aktywny element specjalny
//   @param {Object} props.settings   – ustawienia aplikacji (apiKey, plan itp.)
//   @param {Function} props.onOpenTasks – callback otwierający TaskPanel dla projektu
//   @returns {JSX.Element|null}
export default function ToolsContainer({ activeItem, settings, onOpenTasks }) {
  useEffect(() => { logDebug('ui', 'ToolsContainer mounted'); }, []);

  // ─── wrap() – zawija komponent w Suspense z fallback Spinner
  //   @param {React.ComponentType} Component – komponent do leniwego ładowania
  //   @param {Object} props – dodatkowe propsy przekazane do komponentu
  //   @returns {JSX.Element} – komponent zawijany w Suspense
  const wrap = (Component, props = {}) => (
    <Suspense fallback={<Spinner />}>
      <Component {...props} />
    </Suspense>
  );

  switch (activeItem.id) {
    case 'notepad':
      return wrap(Notepad);

    case 'projectManager':
      return wrap(ProjectManager, { onOpenTasks });

    case 'removebg':
      // ─── Guard feature flag: removeBg
      if (!isFeatureEnabled('removeBg')) {
        logWarn('ui', 'ToolsContainer: removeBg disabled via feature flag');
        return <div style={{ padding: 32 }}>Narzędzie wyłączone.</div>;
      }
      return wrap(RemoveBgTool, { apiKey: settings.removeBgApiKey, plan: settings.removeBgPlan || 'free' });

    case 'stringCombiner':
      // ─── Guard feature flag: stringCombiner
      if (!isFeatureEnabled('stringCombiner')) {
        logWarn('ui', 'ToolsContainer: stringCombiner disabled via feature flag');
        return <div style={{ padding: 32 }}>Narzędzie wyłączone.</div>;
      }
      return wrap(StringCombiner);

    case 'terminal':
      return wrap(Terminal, { cwd: activeItem.cwd });

    case 'appLibrary':
      // ─── Guard feature flag: appLibrary
      if (!isFeatureEnabled('appLibrary')) {
        logWarn('ui', 'ToolsContainer: appLibrary disabled via feature flag');
        return <div style={{ padding: 32 }}>Biblioteka aplikacji wyłączona.</div>;
      }
      return wrap(AppLibraryBrowser);

    default:
      logWarn('ui', `ToolsContainer: unknown tool id "${activeItem.id}"`);
      return <div style={{ padding: 32 }}>Nieznane narzędzie: {activeItem.id}</div>;
  }
}
