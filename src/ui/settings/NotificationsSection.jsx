// =============================================================================
// FILE: NotificationsSection.jsx
// PATH: src/ui/settings/NotificationsSection.jsx
// VERSION: 0.0.3
// PURPOSE: Sekcja powiadomień (toasty, system, Pushbullet)
// FUNCTIONS: NotificationsSection
// DEPENDS ON: react, translations.js, loggerRenderer, icons
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

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

  

  // ─── useEffect – ładowanie ustawień przy montowaniu
  useEffect(() => {
    try {
      const saved = localStorage.getItem('system_notifications');
      setSystemNotifications(saved !== 'false');
      const savedPb = localStorage.getItem('pushbullet_api_key');
      if (savedPb) setPushbulletApiKey(savedPb);
      logInfo('NotificationsSection: settings loaded');
    } catch (err) {
      logError('NotificationsSection: failed to load settings', err);
      logWarn('Nie można załadować ustawień powiadomień');
    }
  }, []);
  
  // ─── handleSystemNotifToggle() – przełącza powiadomienia systemowe
  //   @param {Event} e – zdarzenie zmiany checkboxa
  //   @returns {void}
  const handleSystemNotifToggle = (e) => {
    try {
      const enabled = e.target.checked;
      setSystemNotifications(enabled);
      localStorage.setItem('system_notifications', enabled);
      logDebug(`System notifications: ${enabled}`);
      logInfo(`NotificationsSection: system notifications ${enabled ? 'enabled' : 'disabled'}`);
    } catch (err) {
      logError('NotificationsSection: system notifications toggle failed', err);
      logWarn('Wystąpił błąd podczas przełączania powiadomień systemowych');
    }
  };
  
  // ─── handlePushbulletSave() – zapisuje klucz API Pushbullet
  //   @returns {void}
  const handlePushbulletSave = () => {
    try {
      localStorage.setItem('pushbullet_api_key', pushbulletApiKey);
      logDebug('Pushbullet API key saved');
      logInfo('NotificationsSection: Pushbullet API key saved');
    } catch (err) {
      logError('NotificationsSection: Pushbullet save failed', err);
      logWarn('Wystąpił błąd podczas zapisu klucza API Pushbullet');
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
