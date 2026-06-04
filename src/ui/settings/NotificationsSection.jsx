// =============================================================================
// FILE:       NotificationsSection.jsx
// PATH:       src/ui/settings/NotificationsSection.jsx
// VERSION:    0.0.3
// PURPOSE:    Sekcja powiadomień — toggles dla toastów UI (UIUX_REQ-021), powiadomień systemowych OS (UIUX_REQ-022) oraz Pushbullet.
// FUNCTIONS:  NotificationsSection
// DEPENDS ON: react, translations.js, loggerRenderer.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect } from 'react';
import { TranslationContext } from '../utils/translations.js';
import { logDebug, logInfo, logError, logWarn } from '../../utils/loggerRenderer';
import { ICONS } from '../../utils/icons';

// ─── NotificationsSection() – sekcja ustawień powiadomień (toasty UI, systemowe, Pushbullet)
//   @returns {JSX.Element}
export default function NotificationsSection() {
  const { t } = React.useContext(TranslationContext);
  const [toastsEnabled,        setToastsEnabled]        = useState(true);
  const [systemNotifications,  setSystemNotifications]  = useState(true);
  const [pushbulletApiKey,     setPushbulletApiKey]     = useState('');

  // ─── useEffect – ładowanie ustawień powiadomień przez IPC
  useEffect(() => {
    const load = async () => {
      try {
        if (window.electronAPI?.invoke) {
          const res = await window.electronAPI.invoke('settings:get');
          if (res?.ok) {
            setToastsEnabled(res.data?.toastsEnabled !== false);
            setSystemNotifications(res.data?.systemNotificationsEnabled !== false);
            setPushbulletApiKey(res.data?.pushbulletApiKey || '');
            logInfo('settings', 'NotificationsSection: settings loaded');
          }
        }
      } catch (err) {
        logError('settings', 'NotificationsSection: failed to load settings', err.message);
      }
    };
    load();
  }, []);

  // ─── handleToastsToggle() – przełącza toasty UI
  const handleToastsToggle = async (e) => {
    try {
      const enabled = e.target.checked;
      setToastsEnabled(enabled);
      await window.electronAPI?.invoke('settings:update', { toastsEnabled: enabled });
      // Powiadom ToastContainer o zmianie przez CustomEvent
      window.dispatchEvent(new CustomEvent('mwm:settings-changed', { detail: { toastsEnabled: enabled } }));
      logInfo('settings', `NotificationsSection: toastsEnabled = ${enabled}`);
    } catch (err) {
      logError('settings', 'NotificationsSection: toastsToggle failed', err.message);
    }
  };

  // ─── handleSystemNotifToggle() – przełącza powiadomienia systemowe OS
  const handleSystemNotifToggle = async (e) => {
    try {
      const enabled = e.target.checked;
      setSystemNotifications(enabled);
      await window.electronAPI?.invoke('settings:update', { systemNotificationsEnabled: enabled });
      logInfo('settings', `NotificationsSection: systemNotificationsEnabled = ${enabled}`);
    } catch (err) {
      logError('settings', 'NotificationsSection: systemNotifToggle failed', err.message);
    }
  };

  // ─── handlePushbulletSave() – zapisuje klucz API Pushbullet
  const handlePushbulletSave = async () => {
    try {
      await window.electronAPI?.invoke('settings:update', { pushbulletApiKey });
      logInfo('settings', 'NotificationsSection: Pushbullet API key saved');
    } catch (err) {
      logError('settings', 'NotificationsSection: Pushbullet save failed', err.message);
    }
  };

  return (
    <section className="settings-section">
      <h2>{ICONS.NOTIFICATION} {t('settings.notifications')}</h2>

      {/* ── Toasty UI ──────────────────────────────────────────────────────── */}
      <div className="setting-item">
        <label>
          <input type="checkbox" checked={toastsEnabled} onChange={handleToastsToggle} />
          {ICONS.BELL} {t('settings.toastsEnabled')}
        </label>
        <span className="setting-description">{t('settings.toastsEnabledDesc')}</span>
      </div>

      {/* ── Powiadomienia systemowe OS ─────────────────────────────────────── */}
      <div className="setting-item">
        <label>
          <input type="checkbox" checked={systemNotifications} onChange={handleSystemNotifToggle} />
          {ICONS.BELL} {t('settings.systemNotifications')}
        </label>
        <span className="setting-description">{t('settings.systemNotificationsDesc')}</span>
      </div>

      {/* ── Pushbullet ─────────────────────────────────────────────────────── */}
      <div className="setting-item">
        <label>{ICONS.PUSHBULLET} {t('pushbullet.pushbulletApiKey')}</label>
        <input
          type="password"
          value={pushbulletApiKey}
          onChange={(e) => setPushbulletApiKey(e.target.value)}
          placeholder="o.xxxxxxxxxxxxxxxx"
        />
        <button onClick={handlePushbulletSave}>{ICONS.SAVE} {t('common.save')}</button>
        <span className="setting-description">{t('pushbullet.pushbulletDesc')}</span>
      </div>

      <details className="pushbullet-help">
        <summary>{ICONS.INFO} {t('pushbullet.pushbulletHowTo')}</summary>
        <ol>
          <li>{t('pushbullet.pushbulletStep1')}</li>
          <li>{t('pushbullet.pushbulletStep2')}</li>
          <li>{t('pushbullet.pushbulletStep3')}</li>
        </ol>
      </details>
    </section>
  );
}

import React, { useState, useEffect } from 'react';
import { TranslationContext } from '../utils/translations.js';
import { logDebug, logInfo, logError, logWarn } from '../../utils/loggerRenderer';
import { ICONS } from '../../utils/icons';

// ─── NotificationsSection() – sekcja ustawień powiadomień (systemowe i Pushbullet)
//   @returns {JSX.Element} – renderowana sekcja powiadomień
export default function NotificationsSection() {
  const { t } = React.useContext(TranslationContext);
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [pushbulletApiKey, setPushbulletApiKey] = useState('');

  

  // ─── useEffect – ładowanie ustawień powiadomień z settingsStore przez IPC
  useEffect(() => {
    // ─── load() – Ładuje zapisane ustawienia powiadomień z procesu głównego przez IPC, z fallbackiem na localStorage
    const load = async () => {
      try {
        if (window.electronAPI?.invoke) {
          const res = await window.electronAPI.invoke('settings:get');
          if (res?.ok) {
            setSystemNotifications(res.data?.systemNotifications !== false);
            setPushbulletApiKey(res.data?.pushbulletApiKey || '');
            logInfo('settings', 'NotificationsSection: settings loaded from IPC');
          }
        }
      } catch (err) {
        logError('settings', 'NotificationsSection: failed to load settings', err.message);
        logWarn('settings', 'Nie można załadować ustawień powiadomień — fallback na localStorage');
        // Fallback na localStorage gdy IPC niedostępne
        const saved = localStorage.getItem('system_notifications');
        setSystemNotifications(saved !== 'false');
        const savedPb = localStorage.getItem('pushbullet_api_key');
        if (savedPb) setPushbulletApiKey(savedPb);
      }
    };
    load();
  }, []);
  
  // ─── handleSystemNotifToggle() – przełącza powiadomienia systemowe i zapisuje przez IPC
  //   @param {Event} e – zdarzenie zmiany checkboxa
  //   @returns {Promise<void>}
  const handleSystemNotifToggle = async (e) => {
    try {
      const enabled = e.target.checked;
      setSystemNotifications(enabled);
      if (window.electronAPI?.invoke) {
        await window.electronAPI.invoke('settings:update', { systemNotifications: enabled });
      }
      logInfo('settings', `NotificationsSection: system notifications ${enabled ? 'enabled' : 'disabled'}`);
    } catch (err) {
      logError('settings', 'NotificationsSection: system notifications toggle failed', err.message);
      logWarn('settings', 'Wystąpił błąd podczas przełączania powiadomień systemowych');
    }
  };
  
  // ─── handlePushbulletSave() – zapisuje klucz API Pushbullet przez IPC
  //   @returns {Promise<void>}
  const handlePushbulletSave = async () => {
    try {
      if (window.electronAPI?.invoke) {
        await window.electronAPI.invoke('settings:update', { pushbulletApiKey });
      }
      logInfo('settings', 'NotificationsSection: Pushbullet API key saved');
    } catch (err) {
      logError('settings', 'NotificationsSection: Pushbullet save failed', err.message);
      logWarn('settings', 'Wystąpił błąd podczas zapisu klucza API Pushbullet');
    }
  };
  return (
    <section className="settings-section">
      <h2>{ICONS.NOTIFICATION} {t('settings.notifications')}</h2>
      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            checked={systemNotifications}
            onChange={handleSystemNotifToggle}
          />
          {ICONS.BELL} {t('settings.systemNotifications')}
        </label>
        <span className="setting-description">{t('settings.systemNotificationsDesc')}</span>
      </div>
      <div className="setting-item">
        <label>{ICONS.PUSHBULLET} {t('pushbullet.pushbulletApiKey')}</label>
        <input
          type="password"
          value={pushbulletApiKey}
          onChange={(e) => setPushbulletApiKey(e.target.value)}
          placeholder="o.xxxxxxxxxxxxxxxx"
        />
        <button onClick={handlePushbulletSave}>{ICONS.SAVE} {t('common.save')}</button>
        <span className="setting-description">{t('pushbullet.pushbulletDesc')}</span>
      </div>

      <details className="pushbullet-help">
        <summary>{ICONS.INFO} {t('pushbullet.pushbulletHowTo')}</summary>
        <ol>
          <li>{t('pushbullet.pushbulletStep1')}</li>
          <li>{t('pushbullet.pushbulletStep2')}</li>
          <li>{t('pushbullet.pushbulletStep3')}</li>
        </ol>
      </details>
    </section>
  );
}
