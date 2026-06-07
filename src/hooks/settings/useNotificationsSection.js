// =============================================================================
// FILE: useNotificationsSection.js
// PATH: src/hooks/settings/useNotificationsSection.js
// VERSION: 0.0.3
// PURPOSE: Hook logiki sekcji powiadomień – ładowanie ustawień, handlery toastów, systemu OS i Pushbullet
// FUNCTIONS: useNotificationsSection
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useEffect } from 'react';
import { logInfo, logError } from '../../utils/loggerRenderer.js';

// ─── useNotificationsSection() – logika sekcji NotificationsSection
export function useNotificationsSection() {
  const [toastsEnabled,       setToastsEnabled]       = useState(true);
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [pushbulletApiKey,    setPushbulletApiKey]    = useState('');

  // ─── useEffect – ładowanie ustawień powiadomień przez IPC
  useEffect(() => {
    const load = async () => {
      try {
        const res = await window.electronAPI?.invoke?.('settings:get');
        if (res?.ok) {
          setToastsEnabled(res.data?.toastsEnabled !== false);
          setSystemNotifications(res.data?.systemNotificationsEnabled !== false);
          setPushbulletApiKey(res.data?.pushbulletApiKey || '');
          logInfo('settings', 'useNotificationsSection: settings loaded');
        }
      } catch (err) {
        logError('settings', 'useNotificationsSection: failed to load settings', err.message);
      }
    };
    load();
  }, []);

  // ─── handleToastsToggle() – przełącza toastsEnabled i emituje event aplikacji
  const handleToastsToggle = async (e) => {
    try {
      const enabled = e.target.checked;
      setToastsEnabled(enabled);
      await window.electronAPI?.invoke?.('settings:update', { toastsEnabled: enabled });
      window.dispatchEvent(new CustomEvent('mwm:settings-changed', { detail: { toastsEnabled: enabled } }));
      logInfo('settings', `useNotificationsSection: toastsEnabled = ${enabled}`);
    } catch (err) { logError('settings', 'useNotificationsSection: toastsToggle failed', err.message); }
  };

  // ─── handleSystemNotifToggle() – przełącza systemNotificationsEnabled i zapisuje przez IPC
  const handleSystemNotifToggle = async (e) => {
    try {
      const enabled = e.target.checked;
      setSystemNotifications(enabled);
      await window.electronAPI?.invoke?.('settings:update', { systemNotificationsEnabled: enabled });
      logInfo('settings', `useNotificationsSection: systemNotificationsEnabled = ${enabled}`);
    } catch (err) { logError('settings', 'useNotificationsSection: systemNotif failed', err.message); }
  };

  // ─── handlePushbulletSave() – zapisuje klucz API Pushbullet przez IPC
  const handlePushbulletSave = async () => {
    try {
      await window.electronAPI?.invoke?.('settings:update', { pushbulletApiKey });
      logInfo('settings', 'useNotificationsSection: Pushbullet API key saved');
    } catch (err) { logError('settings', 'useNotificationsSection: Pushbullet save failed', err.message); }
  };

  return {
    toastsEnabled, systemNotifications,
    pushbulletApiKey, setPushbulletApiKey,
    handleToastsToggle, handleSystemNotifToggle, handlePushbulletSave,
  };
}
