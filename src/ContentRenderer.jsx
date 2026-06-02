// =============================================================================
// FILE: ContentRenderer.jsx
// PATH: src/ui/views/ContentRenderer.jsx
// VERSION: 0.0.3
// PURPOSE: Switcher widoków — zarządza renderowaniem odpowiedniego kontenera (WebView, Tools, Settings).
// FUNCTIONS: ContentRenderer, Spinner, wrap
// DEPENDS ON: react, ICONS, WebViewContainer, ToolsContainer, SettingsContainer
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { lazy, Suspense, useContext } from 'react';
import { ICONS } from '../../utils/icons.js';
import { TranslationContext } from '../../utils/translations.js';

const WebViewTab = lazy(() => import('../webview/WebViewTab'));
const Notepad = lazy(() => import('../notepad/Notepad'));
const ProjectManager = lazy(() => import('../projects/ProjectManager'));
const RemoveBgTool = lazy(() => import('../tools/RemoveBgTool'));
const StringCombiner = lazy(() => import('../tools/StringCombiner'));
const Terminal = lazy(() => import('../terminal/Terminal'));
const Settings = lazy(() => import('../settings/Settings'));
const Help = lazy(() => import('../help/Help'));
const AggregatedTasks = lazy(() => import('../tasks/AggregatedTasks'));
const HistoryLog = lazy(() => import('../history/HistoryLog'));

// ─── Spinner() – wskaźnik ładowania
export function Spinner() {
  return (
    <div className="flex items-center justify-center h-full text-slate-400">
      <span style={{ fontSize: 28, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
    </div>
  );
}

// ─── wrap() – pomocnik Suspense
const wrap = (Component, props = {}) => (
  <Suspense fallback={<Spinner />}>
    <Component {...props} />
  </Suspense>
);

// ─── WebViewContainer – Kontener dla profilu WebView
const WebViewContainer = ({ activeItem, sidebarModalOpen }) => {
  const profile = activeItem.type === 'webview' ? activeItem : { ...activeItem, type: 'webview' };
  return wrap(WebViewTab, { profile, isActive: true, suspended: sidebarModalOpen });
};

// ─── ToolsContainer – Kontener dla narzędzi specjalnych
const ToolsContainer = ({ activeItem, settings, onOpenTasks }) => {
  switch (activeItem.id) {
    case 'notepad': return wrap(Notepad);
    case 'projectManager': return wrap(ProjectManager, { onOpenTasks });
    case 'removebg': return wrap(RemoveBgTool, { apiKey: settings.removeBgApiKey, plan: settings.removeBgPlan || 'free' });
    case 'stringCombiner': return wrap(StringCombiner);
    case 'terminal': return wrap(Terminal, { cwd: activeItem.cwd });
    default: return null;
  }
};

// ─── SettingsContainer – Kontener dla ustawień i pomocy
const SettingsContainer = ({ activeItem, settings, onSaveSettings }) => {
  switch (activeItem.id) {
    case 'settings': return wrap(Settings, { settings, onSave: onSaveSettings });
    case 'help': return wrap(Help);
    case 'aggregatedTasks': return wrap(AggregatedTasks);
    case 'history': return wrap(HistoryLog);
    default: return null;
  }
};

export function ContentRenderer({ activeItem, settings, onSaveSettings, onOpenTasks, sidebarModalOpen }) {
  const { t } = useContext(TranslationContext);

  if (!activeItem) {
    return (
      <div className="flex flex-col items-center justify-center h-full" style={{ color: 'var(--text-muted)' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>{ICONS.DEFAULT}</div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>{t('app.welcome_title')}</div>
        <div style={{ fontSize: 13, marginTop: 6 }}>{t('app.welcome_subtitle')}</div>
      </div>
    );
  }

  // Obsługa narzędzi specjalnych (Tools)
  if (activeItem.type === 'special') {
    const isSettingsOrHelp = ['settings', 'help', 'aggregatedTasks', 'history'].includes(activeItem.id);
    
    if (isSettingsOrHelp) {
      return (
        <SettingsContainer
          activeItem={activeItem}
          settings={settings}
          onSaveSettings={onSaveSettings}
        />
      );
    }

    return (
      <ToolsContainer
        activeItem={activeItem}
        settings={settings}
        onOpenTasks={onOpenTasks}
      />
    );
  }

  // Obsługa WebView
  if (activeItem.type === 'webview' || activeItem.url) {
    return <WebViewContainer activeItem={activeItem} sidebarModalOpen={sidebarModalOpen} />;
  }

  return <div style={{ padding: 32 }}>Nieznany element: {activeItem.name || activeItem.id}</div>;
}
