// =============================================================================
// FILE: App.jsx
// PATH: src/App.jsx
// VERSION: 0.0.3
// PURPOSE: Główny komponent — Sidebar + content, lazy moduły z src/ui/*
// FUNCTIONS: App
// DEPENDS ON: icons.js, react, Sidebar, ConfirmModal, loggerRenderer, urlUtils, translations.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { ICONS } from './utils/icons.js';
import React, { useState, useEffect, lazy, Suspense, useContext } from 'react';
import Sidebar from './ui/sidebar/Sidebar';
import ConfirmModal from './ui/modals/ConfirmModal';
import { log, initLogger, setDebugMode, logDebug, logError } from './utils/loggerRenderer';
import { normalizeWebUrl } from './utils/urlUtils';
import { TranslationContext } from './utils/translations.js';

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
  const { t, loaded } = useContext(TranslationContext);
  const [activeItem, setActiveItem] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [settings, setSettings] = useState({});
  const [showTaskPanel, setShowTaskPanel] = useState(false);
  const [currentProject, setCurrentProject] = useState('');
  const [netToast, setNetToast] = useState(null);
  const [netToastType, setNetToastType] = useState('offline');
  const [sidebarModalOpen, setSidebarModalOpen] = useState(false);
  const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const showConfirm = (title, message, onConfirm) => {
    setConfirmState({ isOpen: true, title, message, onConfirm });
  };

  useEffect(() => {
    import('./ui/help/Help');
    import('./ui/notepad/Notepad');
    import('./ui/settings/Settings');
    initLogger().then(() => log('App: logger initialized'));

    window.electronAPI.getProfiles().then((p) => {
      const list = (p || []).map((prof) => {
        const normalized = normalizeWebUrl(prof.url);
        if (normalized && normalized !== prof.url) {
          return { ...prof, url: normalized };
        }
        return prof;
      });
      setProfiles(list);
      log('App: profiles loaded', list.length);
    });

    window.electronAPI.getSettings().then((s) => {
      const merged = s || {};
      setSettings(merged);
      setDebugMode(merged.debugMode !== false);
      applyTheme(merged.theme || 'system');
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
      showConfirm(
        t('app.close_confirm_title'),
        t('app.close_confirm_message'),
        () => window.electronAPI.confirmQuit()
      );
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Nasłuchiwanie hotkeyów
  useEffect(() => {
    if (!window.electronAPI?.onHotkeyTrigger) return;
    
    const dispose = window.electronAPI.onHotkeyTrigger(async (data) => {
      logDebug(`Hotkey triggered: ${data.id}`, data);
      
      if (data.action === 'insertText' && data.text) {
        try {
          await navigator.clipboard.writeText(data.text);
          // showToast – można dodać globalny system toastów
        } catch (err) {
          logError('Failed to insert text', err);
        }
      } else if (data.action === 'screenshot') {
        window.dispatchEvent(new CustomEvent('hotkey-screenshot'));
      } else if (data.action === 'monitor') {
        window.dispatchEvent(new CustomEvent('hotkey-monitor'));
      }
    });
    
    return () => dispose?.();
  }, []);

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
    setDebugMode(merged.debugMode !== false);
    applyTheme(merged.theme || 'system');
  };

  const renderContent = () => {
  if (!activeItem) {
    return (
      <div className="flex flex-col items-center justify-center h-full" style={{ color: 'var(--text-muted)' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>{ICONS.DEFAULT}</div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>{t('app.welcome_title')}</div>
        <div style={{ fontSize: 13, marginTop: 6 }}>{t('app.welcome_subtitle')}</div>
      </div>
    );
  }

    const wrap = (Component, props = {}) => (
      <Suspense fallback={<Spinner />}>
        <Component {...props} />
      </Suspense>
    );

    if (activeItem.type === 'special') {
      switch (activeItem.id) {
        case 'notepad': return wrap(Notepad);
        case 'projectManager': return wrap(ProjectManager, { onOpenTasks: (project) => { setCurrentProject(project); setShowTaskPanel(true); } });
        case 'removebg': return wrap(RemoveBgTool, { apiKey: settings.removeBgApiKey, plan: settings.removeBgPlan || 'free' });
        case 'stringCombiner': return wrap(StringCombiner);
        case 'terminal': return wrap(Terminal, { cwd: activeItem.cwd });
        case 'settings': return wrap(Settings, { settings, onSave: handleSaveSettings });
        case 'help': return wrap(Help);
        case 'aggregatedTasks': return wrap(AggregatedTasks);
        case 'history': return wrap(HistoryLog);
        default: return <div style={{ padding: 32 }}>Nieznane narzędzie: {activeItem.id}</div>;
      }
    }

    if (activeItem.type === 'webview' || activeItem.url) {
      const profile = activeItem.type === 'webview' ? activeItem : { ...activeItem, type: 'webview' };
      return wrap(WebViewTab, { profile, isActive: true, suspended: sidebarModalOpen });
    }

    return <div style={{ padding: 32 }}>Nieznany element: {activeItem.name || activeItem.id}</div>;
  };

  const handleOpenTaskPanel = (profileOrProject) => {
    const name = typeof profileOrProject === 'string' ? profileOrProject : profileOrProject?.taskProject || profileOrProject?.name || 'default';
    setCurrentProject(name);
    setShowTaskPanel(true);
    log('App: TaskPanel opened for', name);
  };

  const isWebViewActive = activeItem && (activeItem.type === 'webview' || (activeItem.url && activeItem.type !== 'special'));

  useEffect(() => {
    document.body.classList.toggle('tools-active', !isWebViewActive);
    return () => document.body.classList.remove('tools-active');
  }, [isWebViewActive]);

  if (!loaded) return <Spinner />;

  return (
    <div className="flex h-screen app-root" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar
        profiles={profiles}
        onSelect={setActiveItem}
        activeItem={activeItem}
        onProfilesChange={setProfiles}
        onOpenTaskPanel={handleOpenTaskPanel}
        onModalOpenChange={setSidebarModalOpen}
      />
      <main
        className={`main-area flex flex-col overflow-hidden ${isWebViewActive ? 'main-area--webview' : 'main-area--module'}`}
        style={{ minWidth: 0, flex: 1, minHeight: 0 }}
      >
        <div
          className="module-view"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}
          key={activeItem ? `${activeItem.type}-${activeItem.id || activeItem.name}` : 'home'}
        >
          {renderContent()}
        </div>
      </main>
      <Suspense fallback={null}>
        <TaskPanel
          projectName={currentProject}
          visible={showTaskPanel}
          onClose={() => setShowTaskPanel(false)}
          availableProjects={(settings.projects || []).map((p) => p.name)}
        />
      </Suspense>
      <NetToast message={netToast} type={netToastType} />
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={() => {
          confirmState.onConfirm?.();
          setConfirmState({ isOpen: false, title: '', message: '', onConfirm: null });
        }}
        onCancel={() => setConfirmState({ isOpen: false, title: '', message: '', onConfirm: null })}
      />
    </div>
  );
}
