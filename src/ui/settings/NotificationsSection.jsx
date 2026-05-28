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
import { logDebug } from '../../utils/loggerRenderer';
import { ICONS } from '../../utils/icons';
export default function NotificationsSection() {
  const { t } = React.useContext(TranslationContext);
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [pushbulletApiKey, setPushbulletApiKey] = useState('');
  useEffect(() => {
    const saved = localStorage.getItem('system_notifications');
    setSystemNotifications(saved !== 'false');
    const savedPb = localStorage.getItem('pushbullet_api_key');
    if (savedPb) setPushbulletApiKey(savedPb);
  }, []);
  const handleSystemNotifToggle = (e) => {
    const enabled = e.target.checked;
    setSystemNotifications(enabled);
    localStorage.setItem('system_notifications', enabled);
    logDebug(`System notifications: ${enabled}`);
  };
  const handlePushbulletSave = () => {
    localStorage.setItem('pushbullet_api_key', pushbulletApiKey);
    logDebug('Pushbullet API key saved');
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