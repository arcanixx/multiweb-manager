// =============================================================================
// FILE: NotificationsSection.jsx
// PATH: src/ui/settings/NotificationsSection.jsx
// VERSION: 0.0.3
// PURPOSE: Widok sekcji powiadomień – toasty UI, powiadomienia systemowe OS, Pushbullet. Logika w useNotificationsSection.
// FUNCTIONS: NotificationsSection
// DEPENDS ON: react, translations.js, icons.js, useNotificationsSection.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import { useNotificationsSection } from '../../hooks/useNotificationsSection.js';

// ─── NotificationsSection() – sekcja ustawień powiadomień
export default function NotificationsSection() {
  const { t } = useContext(TranslationContext);
  const {
    toastsEnabled, systemNotifications,
    pushbulletApiKey, setPushbulletApiKey,
    handleToastsToggle, handleSystemNotifToggle, handlePushbulletSave,
  } = useNotificationsSection();

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
          onChange={e => setPushbulletApiKey(e.target.value)}
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
