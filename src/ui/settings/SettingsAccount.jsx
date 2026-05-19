// =============================================================================
// FILE: SettingsAccount.jsx
// PATH: src/ui/settings/SettingsAccount.jsx
// VERSION: 0.0.3
// PURPOSE: Placeholder sekcji konta i synchronizacji w chmurze (7e — BACKLOG).
// DEPENDS ON: useTranslation.js, icons.js
// UWAGA: Nie usuwaj komentarzy — pełna implementacja w przyszłej wersji.
// =============================================================================

import React from 'react';
import { ICONS } from '../../utils/icons';
import { useTranslation } from '../../hooks/useTranslation';

export default function SettingsAccount() {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '12px 0', color: 'var(--text-secondary)', fontSize: 13 }}>
      <p style={{ marginBottom: 8 }}>
        {t('settings.account_placeholder') ||
          'Synchronizacja profili i ustawień między urządzeniami — w przygotowaniu (v0.0.4+).'}
      </p>
      <button type="button" className="btn btn-secondary" disabled title={t('settings.coming_soon') || 'Wkrótce'}>
        {ICONS.LOCK} {t('settings.sign_in') || 'Zaloguj się'}
      </button>
      <button type="button" className="btn btn-secondary" disabled style={{ marginLeft: 8 }}>
        {ICONS.EXPORT} {t('settings.sync_now') || 'Synchronizuj'}
      </button>
    </div>
  );
}
