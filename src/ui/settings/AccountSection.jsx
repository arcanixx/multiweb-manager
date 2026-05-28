// =============================================================================
// FILE: AccountSection.jsx
// PATH: src/ui/settings/AccountSection.jsx
// VERSION: 0.0.3
// PURPOSE: Sekcja konta użytkownika (placeholder – na później synchronizacja)
// FUNCTIONS: AccountSection
// DEPENDS ON: react, translations.js, src
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React from 'react';
import { TranslationContext } from '../utils/translations.js';
import { ICONS } from 'src/utils/icons';
export default function AccountSection() {
  const { t } = React.useContext(TranslationContext);
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
