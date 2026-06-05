// =============================================================================
// FILE: useAppInitialization.js
// PATH: src/hooks/useAppInitialization.js
// VERSION: 0.0.3
// PURPOSE: Logika startowa aplikacji (logger, settings, profile, hotkeys, theme).
// FUNCTIONS: useAppInitialization
// DEPENDS ON: react, config.js, translations.js, loggerRenderer.js, urlUtils.js, notificationsManager.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useEffect, useContext } from 'react';
import { isFeatureEnabled } from '../config.js';
import { TranslationContext } from '../utils/translations.js';
import { initLogger, setDebugMode, logInfo, logError, logDebug } from '../utils/loggerRenderer.js';
import { normalizeWebUrl } from '../utils/urlUtils.js';
import { showToast } from '../utils/notificationsManager.js';

export function useAppInitialization() {
  const { t } = useContext(TranslationContext);
  const [settings, setSettings] = useState({});
  const [profiles, setProfiles] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [splashDone, setSplashDone] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);

  function applyTheme(theme) {
    try {
      const html = document.documentElement;
      if (theme === 'dark') html.classList.add('dark');
      else if (theme === 'light') html.classList.remove('dark');
      else html.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch (err) {
      console.error('[App] applyTheme failed:', err);
    }
  }

  useEffect(() => {
    import('../ui/help/Help.jsx');
    import('../ui/notepad/Notepad.jsx');
    import('../ui/settings/Settings.jsx');
    window.showToast = showToast;

    initLogger().then(() => logInfo('ui', 'App: logger initialized'));

    window.electronAPI.getSettings().then((s) => {
      const merged = s || {};
      setSettings(merged);
      setDebugMode(merged.debugMode !== false);
      applyTheme(merged.theme || 'system');
      if (merged.firstRun === false) setOnboardingDone(true);
    }).catch((err) => logError('settings', 'App: failed to load settings', err.message));

    window.electronAPI.getProfiles?.().then((p) => {
      const list = (p || []).map(prof => {
        const normalized = normalizeWebUrl(prof.url);
        return normalized && normalized !== prof.url ? { ...prof, url: normalized } : prof;
      });
      setProfiles(list);
    }).catch((err) => logError('ui', 'App: failed to load profiles', err.message));

    const handleOnline = () => showToast('success', t('notifications.online'));
    const handleOffline = () => showToast('warning', t('notifications.offline'));
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isFeatureEnabled('hotkeysManager') || !window.electronAPI?.onHotkeyTrigger) return;
    const dispose = window.electronAPI.onHotkeyTrigger(async (data) => {
      logDebug('engine', `App: hotkey triggered ${data.id}`);
      if (data.action === 'insertText' && data.text) {
        try { await navigator.clipboard.writeText(data.text); }
        catch (err) { logError('engine', 'App: failed to insert text', err.message); }
      } else if (data.action === 'screenshot') {
        window.dispatchEvent(new CustomEvent('hotkey-screenshot'));
      }
    });
    return () => dispose?.();
  }, []);

  useEffect(() => { if (settings.theme) applyTheme(settings.theme); }, [settings.theme]);

  const handleSaveSettings = async (patch) => {
    const merged = { ...settings, ...patch };
    setSettings(merged);
    await window.electronAPI.saveSettings(patch);
    applyTheme(merged.theme || 'system');
  };

  const handleOnboardingFinish = async ({ theme, language, privacy, selectedApps }) => {
    const patch = { theme, language, logsEnabled: privacy.logsEnabled, firstRun: false };
    await window.electronAPI.saveSettings(patch);
    setSettings(prev => ({ ...prev, ...patch }));
    applyTheme(theme);
    if (selectedApps?.length > 0) {
      const newProfiles = selectedApps.map(app => ({
        id: `${app.id}_${Date.now()}`, name: app.name, url: app.url, type: 'webview'
      }));
      for (const p of newProfiles) await window.electronAPI.createProfile(p);
      setProfiles(prev => [...prev, ...newProfiles]);
    }
    setOnboardingDone(true);
  };

  return {
    settings, profiles, setProfiles, activeItem, setActiveItem,
    splashDone, setSplashDone, onboardingDone,
    handleSaveSettings, handleOnboardingFinish
  };
}