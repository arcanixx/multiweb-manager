// =============================================================================
// FILE: App.jsx
// PATH: src/App.jsx
// VERSION: 0.0.3
// PURPOSE: Główny komponent root aplikacji React – inicjalizuje system logowania, ładuje ustawienia użytkownika, zarządza motywem graficznym (dark/light) oraz obsługuje globalne skróty klawiszowe i stan sieci.
// FUNCTIONS: App
// DEPENDS ON: react, config.js, translations.js, loggerRenderer.js, urlUtils.js, MainLayout.jsx, Spinner.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect, useContext } from 'react';
import { isFeatureEnabled } from './config.js';
import { TranslationContext } from './utils/translations.js';
import {
  initLogger,
  setDebugMode,
  logInfo,
  logDebug,
  logError,
  logWarn,
} from './utils/loggerRenderer.js';
import { normalizeWebUrl } from './utils/urlUtils.js';
import MainLayout from './ui/layout/MainLayout.jsx';
import { Spinner } from './ui/views/Spinner.jsx';

// =============================================================================
// ─── AppErrorBoundary – przechwytuje błędy React, zapobiega białemu ekranowi
// =============================================================================
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('[AppErrorBoundary] Uncaught error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: 32, color: 'var(--text-primary, #fff)',
          background: 'var(--bg-primary, #1e1e1e)', minHeight: '100vh',
        }}>
          <h2>⚠️ Wystąpił krytyczny błąd aplikacji</h2>
          <pre style={{ fontSize: 12, opacity: 0.7, marginTop: 12 }}>
            {this.state.error?.message}
          </pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ marginTop: 16 }}
          >
            Spróbuj ponownie
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// =============================================================================
// ─── App() – ładuje dane startowe i przekazuje je do MainLayout
// =============================================================================
export default function App() {
  const { t, loaded } = useContext(TranslationContext);

  const [settings,   setSettings]   = useState({});
  const [activeItem, setActiveItem] = useState(null);
  const [netToast,      setNetToast]      = useState(null);
  const [netToastType,  setNetToastType]  = useState('offline');

  // ─── applyTheme() – ustawia klasę dark na <html> w zależności od motywu
  //   @param {string} theme – 'dark' | 'light' | 'system'
  function applyTheme(theme) {
    try {
      const html = document.documentElement;
      if (theme === 'dark') {
        html.classList.add('dark');
      } else if (theme === 'light') {
        html.classList.remove('dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        html.classList.toggle('dark', prefersDark);
      }
    } catch (err) {
      console.error('[App] applyTheme failed:', err);
    }
  }

  // ─── showToastMsg() – wyświetla chwilowe powiadomienie sieciowe
  const showToastMsg = (msg, type) => {
    setNetToast(msg);
    setNetToastType(type);
    setTimeout(() => setNetToast(null), 4000);
  };

  // ─── useEffect – inicjalizacja: logger, ustawienia, eventy sieci ──
  useEffect(() => {
    import('./ui/help/Help.jsx');
    import('./ui/notepad/Notepad.jsx');
    import('./ui/settings/Settings.jsx');

    try {
      initLogger().then(() => logInfo('ui', 'App: logger initialized'));

      window.electronAPI.getSettings().then((s) => {
        const merged = s || {};
        setSettings(merged);
        setDebugMode(merged.debugMode !== false);
        applyTheme(merged.theme || 'system');
        logInfo('settings', 'App: settings loaded');
      }).catch((err) => logError('settings', 'App: failed to load settings', err.message));
    } catch (err) {
      console.error('[App] Init failed:', err);
    }

    const handleOnline  = () => showToastMsg(t('notifications.online'),  'online');
    const handleOffline = () => showToastMsg(t('notifications.offline'), 'offline');
    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── useEffect – hotkeys (obsługa akcji z globalnych skrótów) ─────────────
  useEffect(() => {
    if (!isFeatureEnabled('hotkeysManager')) return;
    if (!window.electronAPI?.onHotkeyTrigger) return;

    const dispose = window.electronAPI.onHotkeyTrigger(async (data) => {
      logDebug('engine', `App: hotkey triggered ${data.id} (action: ${data.action})`);

      if (data.action === 'insertText' && data.text) {
        try {
          await navigator.clipboard.writeText(data.text);
        } catch (err) {
          logError('engine', 'App: failed to insert text via hotkey', err.message);
        }
      } else if (data.action === 'screenshot') {
        window.dispatchEvent(new CustomEvent('hotkey-screenshot'));
      } else if (data.action === 'monitor') {
        window.dispatchEvent(new CustomEvent('hotkey-monitor'));
      }
    });

    return () => dispose?.();
  }, []);

  // ─── useEffect – zmiana motywu przy zmianie ustawień ─────────────────────
  useEffect(() => {
    if (settings.theme) applyTheme(settings.theme);
  }, [settings.theme]);

  // ─── handleSaveSettings() – zapisuje patch ustawień, odświeża motyw + debug
  const handleSaveSettings = async (patch) => {
    try {
      const merged = { ...settings, ...patch };
      setSettings(merged);
      await window.electronAPI.saveSettings(patch);
      setDebugMode(merged.debugMode !== false);
      applyTheme(merged.theme || 'system');
      logInfo('settings', 'App: settings saved');
    } catch (err) {
      logError('settings', 'App: failed to save settings', err.message);
    }
  };

  if (!loaded) return <Spinner />;

  return (
    <AppErrorBoundary>
      <MainLayout
        activeItem={activeItem}
        settings={settings}
        onSelect={setActiveItem}
        onSaveSettings={handleSaveSettings}
        netToast={netToast}
        netToastType={netToastType}
      />
    </AppErrorBoundary>
  );
}
