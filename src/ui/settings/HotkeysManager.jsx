// =============================================================================
// FILE: HotkeysManager.jsx
// PATH: src/ui/settings/HotkeysManager.jsx
// VERSION: 0.0.3
// PURPOSE: Widok zarządzania skrótami klawiszowymi – orkiestrator renderujący podkomponenty. Logika w useHotkeysManager.
// FUNCTIONS: HotkeysManager
// DEPENDS ON: react, config.js, translations.js, useHotkeysManager.js, HotkeysList, HotkeyModal, ConfirmModal
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { isFeatureEnabled } from '../../config.js';
import { TranslationContext } from '../../utils/translations.js';
import { useHotkeysManager } from '../../hooks/useHotkeysManager.js';
import HotkeysList  from './HotkeysList';
import HotkeyModal  from './HotkeyModal';
import ConfirmModal from '../modals/ConfirmModal';

// ─── HotkeysManager() – widok zarządzania skrótami klawiszowymi
export default function HotkeysManager() {
  const { t } = useContext(TranslationContext);
  const {
    hotkeys, loading,
    modalOpen, editingHotkey,
    confirmState, closeConfirm,
    handleAdd, handleEdit, handleDelete, handleSave,
    handleToggleEnabled, handleModalChange, closeModal,
  } = useHotkeysManager();

  if (!isFeatureEnabled('hotkeysManager')) return null;
  if (loading) return <div className="settings-loading-small">{t('common.loading')}</div>;

  return (
    <section className="settings-section">
      <h2>{t('hotkeys.title')}</h2>
      <p className="section-description">{t('hotkeys.description')}</p>

      <div className="hotkeys-toolbar">
        <button onClick={handleAdd} className="btn-primary">
          + {t('hotkeys.add')}
        </button>
      </div>

      <HotkeysList
        hotkeys={hotkeys}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggle={handleToggleEnabled}
      />

      <HotkeyModal
        isOpen={modalOpen}
        hotkey={editingHotkey}
        onClose={closeModal}
        onSave={handleSave}
        onChange={handleModalChange}
      />

      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={() => { confirmState.onConfirm?.(); closeConfirm(); }}
        onCancel={closeConfirm}
      />
    </section>
  );
}
