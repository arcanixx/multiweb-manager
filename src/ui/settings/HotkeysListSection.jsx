// =============================================================================
// FILE: HotkeysListSection.jsx
// PATH: src/ui/settings/HotkeysListSection.jsx
// VERSION: 0.0.3
// PURPOSE: Komponent tabeli wyświetlającej listę skrótów klawiszowych z akcjami edycji i usuwania.
// FUNCTIONS: HotkeysList
// DEPENDS ON: react, translations.js, icons.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';

// ─── HotkeysList() – tabela skrótów klawiszowych
// @param {Object} props
// @param {Array} props.hotkeys – lista skrótów do wyświetlenia
// @param {Function} props.onEdit – callback edycji (hotkey) => void
// @param {Function} props.onDelete – callback usuwania (id) => void
// @param {Function} props.onToggle – callback przełączania (id, enabled) => void
// @returns {JSX.Element} – renderowana tabela skrótów
export default function HotkeysList({ hotkeys, onEdit, onDelete, onToggle }) {
  const { t } = React.useContext(TranslationContext);

  return (
    <table className="hotkeys-table">
      <thead>
        <tr>
          <th>{t('hotkeys.shortcut')}</th>
          <th>{t('hotkeys.name')}</th>
          <th>{t('hotkeys.text')}</th>
          <th>{t('hotkeys.enabled')}</th>
          <th>{t('hotkeys.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {hotkeys.map(hk => (
          <tr key={hk.id} className={!hk.enabled ? 'disabled' : ''}>
            <td><code>{hk.shortcut}</code></td>
            <td>{hk.name}</td>
            <td className="hotkey-text-preview">{hk.text?.substring(0, 30) || '-'}</td>
            <td>
              <input
                type="checkbox"
                checked={hk.enabled}
                onChange={(e) => onToggle(hk.id, e.target.checked)}
              />
            </td>
            <td>
              <button onClick={() => onEdit(hk)} title={t('common.edit')}>
                {ICONS.EDIT}
              </button>
              <button onClick={() => onDelete(hk.id)} title={t('common.delete')}>
                {ICONS.DELETE}
              </button>
            </td>
          </tr>
        ))}
        {hotkeys.length === 0 && (
          <tr>
            <td colSpan="5" style={{ textAlign: 'center' }}>{t('hotkeys.noHotkeys')}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}