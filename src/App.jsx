// =============================================================================
// FILE: App.jsx
// PATH: src/App.jsx
// VERSION: 0.0.3
// PURPOSE: Główny komponent root aplikacji React – inicjalizuje system logowania, ładuje ustawienia użytkownika, zarządza motywem graficznym (dark/light) oraz obsługuje globalne skróty klawiszowe i stan sieci.
// FUNCTIONS: App
// DEPENDS ON: react, config.js, translations.js, loggerRenderer.js, urlUtils.js, MainLayout.jsx, Spinner.jsx, SplashScreen.jsx, OnboardingScreen.jsx, ToastContainer.jsx, notificationsManager.js
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
import SplashScreen from './ui/system/SplashScreen.jsx';
import OnboardingScreen from './ui/system/OnboardingScreen.jsx';
import ToastContainer from './ui/system/ToastContainer.jsx';
import { showToast } from './utils/notificationsManager.js';

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

  const [settings,       setSettings]       = useState({});
  const [profiles,       setProfiles]       = useState([]);
  const [activeItem,     setActiveItem]     = useState(null);
  const [splashDone,     setSplashDone]     = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false); // false = czeka na sprawdzenie firstRun

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

  // ─── useEffect – inicjalizacja: logger, ustawienia, eventy sieci ──
  useEffect(() => {
    import('./ui/help/Help.jsx');
    import('./ui/notepad/Notepad.jsx');
    import('./ui/settings/Settings.jsx');

    // ─── Globalna rejestracja window.showToast ───────────────────────────────
    // Umożliwia wywołanie z miejsc bez importu modułu (TaskEditor, useWebViewActions).
    // Właściwa implementacja w notificationsManager.js → ToastContainer.
    window.showToast = showToast;

    try {
      initLogger().then(() => logInfo('ui', 'App: logger initialized'));

      window.electronAPI.getSettings().then((s) => {
        const merged = s || {};
        setSettings(merged);
        setDebugMode(merged.debugMode !== false);
        applyTheme(merged.theme || 'system');
        // firstRun: pokaż onboarding tylko przy pierwszym uruchomieniu
        if (merged.firstRun === false) setOnboardingDone(true);
        logInfo('settings', 'App: settings loaded');
      }).catch((err) => logError('settings', 'App: failed to load settings', err.message));

      window.electronAPI.getProfiles?.().then((p) => {
        const list = (p || []).map(prof => {
          const normalized = normalizeWebUrl(prof.url);
          return normalized && normalized !== prof.url ? { ...prof, url: normalized } : prof;
        });
        setProfiles(list);
        logInfo('ui', `App: profiles loaded (${list.length})`);
      }).catch((err) => logError('ui', 'App: failed to load profiles', err.message));
    } catch (err) {
      console.error('[App] Init failed:', err);
    }

    const handleOnline  = () => showToast('success', t('notifications.online'));
    const handleOffline = () => showToast('warning', t('notifications.offline'));
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

  // ─── handleOnboardingFinish() – zapisuje wybory z onboardingu i przechodzi do apki
  const handleOnboardingFinish = async ({ theme, language, privacy, selectedApps }) => {
    try {
      const patch = {
        theme, language,
        logsEnabled:   privacy.logsEnabled   ?? false,
        toastsEnabled: privacy.toastsEnabled ?? true,
        firstRun: false,
      };
      await window.electronAPI.saveSettings(patch);
      setSettings(prev => ({ ...prev, ...patch }));
      applyTheme(theme);

      // Dodaj wybrane aplikacje jako profile
      if (selectedApps?.length > 0) {
        const newProfiles = selectedApps.map(app => ({
          id: `${app.id}_${Date.now()}`,
          name: app.name, url: app.url,
          category: app.categoryId || app.id,
          type: 'webview',
        }));
        const merged = [...profiles, ...newProfiles];
        setProfiles(merged);
        await window.electronAPI.saveProfiles?.(merged);
        logInfo('ui', `OnboardingFinish: added ${newProfiles.length} profiles`);
      }
      setOnboardingDone(true);
    } catch (err) {
      logError('ui', 'handleOnboardingFinish failed', err.message);
      setOnboardingDone(true); // nie blokuj apki przy błędzie zapisu
    }
  };

  if (!loaded) return <Spinner />;

  // Splash screen
  if (!splashDone) return <SplashScreen onFinished={() => setSplashDone(true)} />;

  // Onboarding (tylko firstRun)
  if (!onboardingDone) return <OnboardingScreen onFinish={handleOnboardingFinish} />;

  return (
    <AppErrorBoundary>
      <MainLayout
        profiles={profiles}
        activeItem={activeItem}
        settings={settings}
        onSelect={setActiveItem}
        onProfilesChange={setProfiles}
        onSaveSettings={handleSaveSettings}
      />
      {/* ToastContainer poza MainLayout — nie wpływa na layout grid, nie koliduje z modalami (z-index 9000 < 20000) */}
      <ToastContainer enabled={settings.toastsEnabled !== false} />
    </AppErrorBoundary>
  );
}