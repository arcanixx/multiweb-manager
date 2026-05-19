// =============================================================================
// FILE: App.jsx
// PATH: src/App.jsx
// VERSION: 0.0.3
// PURPOSE: Główny komponent — Sidebar + content, lazy moduły z src/ui/*
// DEPENDS ON: ui/sidebar, hooks, logger, wszystkie moduły ui/*
// UWAGA: Nie usuwaj komentarzy opisujących flow aplikacji.
// =============================================================================

import React, { useState, useEffect, lazy, Suspense } from 'react';
import Sidebar from './ui/sidebar/Sidebar';
import { log, initLogger, setDebugMode } from './utils/logger';
import { useTranslation } from './hooks/useTranslation';

const WebViewTab = lazy(() => import('./ui/webview/WebViewTab'));
const Notepad = lazy(() => import('./ui/notepad/Notepad'));
const ProjectManager = lazy(() => import('./ui/projects/ProjectManager'));
const RemoveBgTool = lazy(() => import('./ui/tools/RemoveBgTool'));
const StringCombiner = lazy(() => import('./ui/tools/StringCombiner'));
const Terminal = lazy(() => import('./ui/terminal/Terminal'));
const Settings = lazy(() => import('./ui/settings/Settings'));
const Help = lazy(() => import('./ui/help/Help'));
const TaskPanel = lazy(() => import('./ui/taskpanel/TaskPanel'));
const AggregatedTasks = lazy(() => import('./ui/tasks/AggregatedTasks'));
const HistoryLog = lazy(() => import('./ui/history/HistoryLog'));

function Spinner() {
  return (
    <div className="flex items-center justify-center h-full text-slate-400">
      <span style={{ fontSize: 28, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
    </div>
  );
}

function NetToast({ message, type }) {
  if (!message) return null;
  const cls =
    type === 'online' ? 'toast toast-success' :
    type === 'offline' ? 'toast toast-error' :
    'toast toast-warning';
  return <div className={cls}>{message}</div>;
}

export default function App() {
  const { t, loaded } = useTranslation();
  const [activeItem, setActiveItem] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [settings, setSettings] = useState({});
  const [showTaskPanel, setShowTaskPanel] = useState(false);
  const [currentProject, setCurrentProject] = useState('');
  const [netToast, setNetToast] = useState(null);
  const [netToastType, setNetToastType] = useState('offline');

  useEffect(() => {
    initLogger().then(() => log('App: logger initialized'));

    window.electronAPI.getProfiles().then((p) => {
      setProfiles(p || []);
      log('App: profiles loaded', p?.length);
    });

    window.electronAPI.getSettings().then((s) => {
      setSettings(s || {});
      applyTheme(s?.theme || 'system');
    });

    const showToastMsg = (msg, type) => {
      setNetToast(msg);
      setNetToastType(type);
      setTimeout(() => setNetToast(null), 4000);
    };

    const handleOnline = () => showToastMsg(t('notifications.online'), 'online');
    const handleOffline = () => showToastMsg(t('notifications.offline'), 'offline');
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    window.electronAPI.onCheckBeforeQuit?.(() => {
      const ok = window.confirm(`${t('app.close_confirm')}\n${t('app.unsaved_notes')}`);
      if (ok) window.electronAPI.confirmQuit();
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (settings.theme) applyTheme(settings.theme);
  }, [settings.theme]);

  function applyTheme(theme) {
    const html = document.documentElement;
    if (theme === 'dark') html.classList.add('dark');
    else if (theme === 'light') html.classList.remove('dark');
    else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.classList.toggle('dark', prefersDark);
    }
  }

  const handleSaveSettings = async (patch) => {
    const merged = { ...settings, ...patch };
    setSettings(merged);
    await window.electronAPI.saveSettings(patch);
    setDebugMode(merged.debugMode || false);
    applyTheme(merged.theme || 'system');
  };

  const renderContent = () => {
    if (!activeItem) {
      return (
        <div className="flex flex-col items-center justify-center h-full" style={{ color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌐</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>MultiWeb Manager</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Wybierz profil lub narzędzie z lewego panelu</div>
        </div>
      );
    }

    const wrap = (Component, props = {}) => (
      <Suspense fallback={<Spinner />}>
        <Component {...props} />
      </Suspense>
    );

    if (activeItem.type === 'webview') {
      return wrap(WebViewTab, { profile: activeItem, isActive: true });
    }

    switch (activeItem.id) {
      case 'notepad':
        return wrap(Notepad);
      case 'projectManager':
        return wrap(ProjectManager, {
          onOpenTasks: (project) => {
            setCurrentProject(project);
            setShowTaskPanel(true);
          }
        });
      case 'removebg':
        return wrap(RemoveBgTool, {
          apiKey: settings.removeBgApiKey,
          plan: settings.removeBgPlan || 'free'
        });
      case 'stringCombiner':
        return wrap(StringCombiner);
      case 'terminal':
        return wrap(Terminal, { cwd: activeItem.cwd });
      case 'settings':
        return wrap(Settings, { settings, onSave: handleSaveSettings });
      case 'help':
        return wrap(Help);
      case 'aggregatedTasks':
        return wrap(AggregatedTasks);
      case 'history':
        return wrap(HistoryLog);
      default:
        return <div style={{ padding: 32 }}>Nieznane narzędzie: {activeItem.id}</div>;
    }
  };

  if (!loaded) return <Spinner />;

  return (
    <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar
        profiles={profiles}
        onSelect={setActiveItem}
        activeItem={activeItem}
        onProfilesChange={setProfiles}
      />
      <div className="flex-1 flex flex-col overflow-hidden" style={{ minWidth: 0 }}>
        {renderContent()}
      </div>
      <Suspense fallback={null}>
        <TaskPanel
          projectName={currentProject}
          visible={showTaskPanel}
          onClose={() => setShowTaskPanel(false)}
          availableProjects={(settings.projects || []).map((p) => p.name)}
        />
      </Suspense>
      <NetToast message={netToast} type={netToastType} />
    </div>
  );
}
