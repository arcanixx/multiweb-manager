// =============================================================================
// FILE: src/App.jsx
// PATH: multiweb-manager/src/App.jsx
// VERSION: v1
// PURPOSE: Główny komponent aplikacji. Zarządza stanem globalnym (profiles,
//          settings, activeItem), obsługuje routing widoków, dark mode,
//          zdarzenia online/offline, ostrzeżenie przed zamknięciem.
//          Używa React.lazy() dla ciężkich komponentów (performance).
// DEPENDS ON: Sidebar, TaskPanel, useTranslation, logger, icons
//             wszystkie lazy-loaded komponenty
// =============================================================================

import React, { useState, useEffect, lazy, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import { log, initLogger, setDebugMode } from './utils/logger';
import { useTranslation } from './hooks/useTranslation';

// ─── Lazy loading ciężkich komponentów ───────────────────────────────────────
// Każdy komponent ładuje się tylko gdy jest aktywny – oszczędność pamięci RAM
const WebViewTab      = lazy(() => import('./components/WebViewTab'));
const Notepad         = lazy(() => import('./components/Notepad'));
const ProjectManager  = lazy(() => import('./components/ProjectManager'));
const RemoveBgTool    = lazy(() => import('./components/RemoveBgTool'));
const StringCombiner  = lazy(() => import('./components/StringCombiner'));
const Terminal        = lazy(() => import('./components/Terminal'));
const Settings        = lazy(() => import('./components/Settings'));
const Help            = lazy(() => import('./components/Help'));
const TaskPanel       = lazy(() => import('./components/TaskPanel'));
const AggregatedTasks = lazy(() => import('./components/AggregatedTasks'));
const HistoryLog      = lazy(() => import('./components/HistoryLog'));

// ─── Spinner fallback podczas ładowania lazy komponentów ─────────────────────
function Spinner() {
  return (
    <div className="flex items-center justify-center h-full text-slate-400">
      <span style={{ fontSize: 28, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
    </div>
  );
}

// ─── Systemowe powiadomienie o połączeniu ─────────────────────────────────────
function NetToast({ message, type }) {
  if (!message) return null;
  const bg = type === 'online' ? '#22c55e' : '#ef4444';
  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
      background: bg, color: 'white', padding: '10px 18px',
      borderRadius: 8, fontSize: 13, boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      animation: 'slideUp 0.2s ease'
    }}>
      {message}
    </div>
  );
}

// =============================================================================
export default function App() {
  const { t, loaded } = useTranslation();

  // ─── Stan globalny ───────────────────────────────────────────────────────
  const [activeItem, setActiveItem]         = useState(null);      // Aktywny profil/narzędzie
  const [profiles, setProfiles]             = useState([]);         // Lista wszystkich profili
  const [settings, setSettings]             = useState({});         // Ustawienia aplikacji
  const [showTaskPanel, setShowTaskPanel]   = useState(false);      // Widoczność panelu tasków
  const [currentProject, setCurrentProject] = useState('');         // Aktywny projekt dla tasków
  const [netToast, setNetToast]             = useState(null);       // Toast online/offline
  const [netToastType, setNetToastType]     = useState('offline');

  // ─── Inicjalizacja przy starcie ──────────────────────────────────────────
  useEffect(() => {
    // Logger – inicjalizacja z settings
    initLogger().then(() => log('App: logger initialized'));

    // Ładowanie profili i ustawień z electron-store przez IPC
    window.electronAPI.getProfiles().then(p => {
      setProfiles(p || []);
      log('App: profiles loaded', p?.length);
    });

    window.electronAPI.getSettings().then(s => {
      setSettings(s || {});
      log('App: settings loaded');

      // Aplikuj dark mode przy starcie
      applyTheme(s.theme || 'system');
    });

    // ─── Zdarzenia sieciowe ───────────────────────────────────────────────
    // Nie używamy alert() – zamiast tego dyskretny toast
    const showToast = (msg, type) => {
      setNetToast(msg);
      setNetToastType(type);
      setTimeout(() => setNetToast(null), 4000);
    };

    const handleOnline  = () => { log('App: network online');  showToast(t('notifications.online'),  'online'); };
    const handleOffline = () => { log('App: network offline'); showToast(t('notifications.offline'), 'offline'); };
    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);

    // ─── Ostrzeżenie przed zamknięciem ───────────────────────────────────
    // Zamiast blokującego confirm() – można rozbudować do modalu w przyszłości
    window.electronAPI.onCheckBeforeQuit(() => {
      const ok = window.confirm(
        `${t('app.close_confirm')}\n${t('app.unsaved_notes')}`
      );
      if (ok) window.electronAPI.confirmQuit();
    });

    return () => {
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Reaktywna zmiana motywu ─────────────────────────────────────────────
  useEffect(() => {
    if (settings.theme) applyTheme(settings.theme);
  }, [settings.theme]);

  // ----------------------------------------------------------------
  // applyTheme() – dodaje/usuwa klasę 'dark' na <html>
  //   'system' → słucha prefers-color-scheme
  //   'dark'   → zawsze ciemny
  //   'light'  → zawsze jasny
  // ----------------------------------------------------------------
  function applyTheme(theme) {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else if (theme === 'light') {
      html.classList.remove('dark');
    } else {
      // system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.classList.toggle('dark', prefersDark);
    }
    log('App: theme applied:', theme);
  }

  // ----------------------------------------------------------------
  // handleSaveSettings() – zapisuje ustawienia i propaguje zmiany
  //   (debugMode, theme) do modułów
  // ----------------------------------------------------------------
  const handleSaveSettings = async (patch) => {
    const merged = { ...settings, ...patch };
    setSettings(merged);
    await window.electronAPI.saveSettings(patch);
    setDebugMode(merged.debugMode || false);
    applyTheme(merged.theme || 'system');
    log('App: settings saved');
  };

  // ----------------------------------------------------------------
  // renderContent() – zwraca komponent dla aktywnego elementu
  //   Każdy wariant owinięty Suspense dla lazy loading
  // ----------------------------------------------------------------
  const renderContent = () => {
    if (!activeItem) {
      return (
        <div className="flex flex-col items-center justify-center h-full"
             style={{ color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌐</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)' }}>
            MultiWeb Manager
          </div>
          <div style={{ fontSize: 13, marginTop: 6 }}>
            Wybierz profil lub narzędzie z lewego panelu
          </div>
        </div>
      );
    }

    const wrap = (Component, props = {}) => (
      <Suspense fallback={<Spinner />}>
        <Component {...props} />
      </Suspense>
    );

    if (activeItem.type === 'webview') {
      return wrap(WebViewTab, { profile: activeItem });
    }

    switch (activeItem.id) {
      case 'notepad':        return wrap(Notepad);
      case 'projectManager': return wrap(ProjectManager, {
        onOpenTasks: (project) => {
          setCurrentProject(project);
          setShowTaskPanel(true);
        }
      });
      case 'removebg':       return wrap(RemoveBgTool, {
        apiKey: settings.removeBgApiKey,
        plan: settings.removeBgPlan || 'free'
      });
      case 'stringCombiner': return wrap(StringCombiner);
      case 'terminal':       return wrap(Terminal, {
        cwd: activeItem.cwd || (typeof process !== 'undefined' ? process.env.HOME : undefined)
      });
      case 'settings':       return wrap(Settings, {
        settings,
        onSave: handleSaveSettings
      });
      case 'help':           return wrap(Help);
      case 'aggregatedTasks':return wrap(AggregatedTasks);
      case 'history':        return wrap(HistoryLog);
      default:
        return (
          <div style={{ padding: 32, color: 'var(--text-muted)' }}>
            Nieznane narzędzie: {activeItem.id}
          </div>
        );
    }
  };

  // Czekaj na załadowanie języka przed renderem
  if (!loaded) return <Spinner />;

  return (
    <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* ─── Sidebar – lewy panel ─── */}
      <Sidebar
        profiles={profiles}
        onSelect={setActiveItem}
        activeItem={activeItem}
        onProfilesChange={setProfiles}
      />

      {/* ─── Główna treść ─── */}
      <div className="flex-1 flex flex-col overflow-hidden"
           style={{ background: 'var(--bg-primary)', minWidth: 0 }}>
        {renderContent()}
      </div>

      {/* ─── Panel tasków – prawy panel ─── */}
      <Suspense fallback={null}>
        <TaskPanel
          projectName={currentProject}
          visible={showTaskPanel}
          onClose={() => setShowTaskPanel(false)}
          availableProjects={(settings.projects || []).map(p => p.name)}
        />
      </Suspense>

      {/* ─── Toast sieciowy ─── */}
      <NetToast message={netToast} type={netToastType} />
    </div>
  );
}
