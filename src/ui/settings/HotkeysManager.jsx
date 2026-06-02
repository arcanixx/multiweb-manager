// =============================================================================
// FILE: HotkeysManager.jsx
// PATH: src/ui/settings/HotkeysManager.jsx
// VERSION: 0.0.3
// PURPOSE: Kontener zarządzania skrótami klawiszowymi – ładuje dane, orkiestruje logikę CRUD i renderuje podkomponenty.
// FUNCTIONS: HotkeysManager
// DEPENDS ON: react, config.js, translations.js, loggerRenderer, HotkeysList, HotkeyModal, ConfirmModal, notificationsManager.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect } from 'react';
import { isFeatureEnabled } from '../../config.js';
import { TranslationContext } from '../../utils/translations.js';
import { logDebug, logError, logInfo, logWarn } from '../../utils/loggerRenderer';
import HotkeysList from './HotkeysList';
import HotkeyModal from './HotkeyModal';
import ConfirmModal from '../modals/ConfirmModal';
import { showNotification } from '../../utils/notificationsManager.js';

// UWAGA: DEFAULT_HOTKEYS celowo pozostaje w tym pliku – jest fallbackiem ściśle
// powiązanym z logiką ładowania i resetowania komponentu HotkeysManager.
// Nie przenosić do constants.js.
const DEFAULT_HOTKEYS = [
  { id: 'hk-1', shortcut: 'Ctrl+Shift+S', name: 'Screenshot WebView', text: '', enabled: true, action: 'screenshot' },
  { id: 'hk-2', shortcut: 'Ctrl+Shift+M', name: 'Resource Monitor', text: '', enabled: true, action: 'monitor' },
  { id: 'hk-3', shortcut: 'Ctrl+Shift+1', name: 'Snippet: Email signature', text: 'Best regards,\nMaciej', enabled: true, action: 'insertText' }
];

// ─── HotkeysManager() – zarządzanie skrótami klawiszowymi z edycją i zapisem
// @returns {JSX.Element|null} – renderowany interfejs menedżera skrótów
export default function HotkeysManager() {
  const { t } = React.useContext(TranslationContext);
  const [hotkeys, setHotkeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHotkey, setEditingHotkey] = useState(null);
  const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  // ─── useEffect – ładowanie skrótów przy montowaniu
  useEffect(() => {
    const loadHotkeys = async () => {
      try {
        if (window.electronAPI?.getHotkeys) {
          const saved = await window.electronAPI.getHotkeys();
          if (saved.data && saved.data.length) {
            setHotkeys(saved.data);
            logInfo('settings', 'HotkeysManager: loaded hotkeys from storage');
          } else {
            setHotkeys(DEFAULT_HOTKEYS);
            logInfo('settings', 'HotkeysManager: using default hotkeys');
          }
        } else {
          setHotkeys(DEFAULT_HOTKEYS);
          logWarn('settings', 'HotkeysManager: electronAPI.getHotkeys not available');
        }
      } catch (err) {
        logError('settings', 'HotkeysManager: failed to load hotkeys', err.message);
        logWarn('settings', 'Nie można załadować skrótów klawiszowych');
        setHotkeys(DEFAULT_HOTKEYS);
      } finally {
        setLoading(false);
      }
    };
    loadHotkeys();
  }, []);

  // ─── showConfirm() – wyświetla modal potwierdzenia
  const showConfirm = (title, message, onConfirm) => {
    try {
      logDebug('ui', 'HotkeysManager: showing confirm modal');
      setConfirmState({ isOpen: true, title, message, onConfirm });
    } catch (err) {
      logError('ui', 'HotkeysManager: show confirm failed', err.message);
      logWarn('settings', 'Wystąpił błąd podczas wyświetlania modala potwierdzenia');
    }
  };

  // ─── saveHotkeys() – zapisuje skróty do storage i rejestruje globalnie
  const saveHotkeys = async (newHotkeys) => {
    try {
      setHotkeys(newHotkeys);
      if (window.electronAPI?.saveHotkeys) {
        await window.electronAPI.saveHotkeys(newHotkeys);
        logInfo('settings', 'HotkeysManager: hotkeys saved to storage');
      }
      if (window.electronAPI?.registerGlobalHotkeys) {
        await window.electronAPI.registerGlobalHotkeys(newHotkeys);
        logInfo('settings', 'HotkeysManager: global hotkeys registered');
      }
    } catch (err) {
      logError('settings', 'HotkeysManager: save hotkeys failed', err.message);
      logWarn('settings', 'Wystąpił błąd podczas zapisu skrótów');
      throw err;
    }
  };

  // ─── handleAdd() – otwiera modal dodawania nowego skrótu
  const handleAdd = () => {
    try {
      setEditingHotkey({
        id: `hk-${Date.now()}`,
        shortcut: '',
        name: '',
        text: '',
        enabled: true,
        action: 'insertText'
      });
      setModalOpen(true);
      logInfo('settings', 'HotkeysManager: adding new hotkey');
    } catch (err) {
      logError('settings', 'HotkeysManager: add hotkey failed', err.message);
      logWarn('settings', 'Wystąpił błąd podczas dodawania skrótu');
    }
  };

  // ─── handleEdit() – otwiera modal edycji skrótu
  const handleEdit = (hotkey) => {
    try {
      setEditingHotkey({ ...hotkey });
      setModalOpen(true);
      logInfo('settings', `HotkeysManager: editing hotkey ${hotkey.id}`);
    } catch (err) {
      logError('settings', 'HotkeysManager: edit hotkey failed', err.message);
      logWarn('settings', 'Wystąpił błąd podczas edycji skrótu');
    }
  };

  // ─── handleDelete() – usuwa skrót po potwierdzeniu
  const handleDelete = (id) => {
    showConfirm(
      t('hotkeys.deleteConfirmTitle'),
      t('hotkeys.deleteConfirmMessage'),
      async () => {
        try {
          const newHotkeys = hotkeys.filter(h => h.id !== id);
          await saveHotkeys(newHotkeys);
          logInfo('settings', `HotkeysManager: deleted hotkey ${id}`);
        } catch (err) {
          logError('settings', 'HotkeysManager: delete hotkey failed', err.message);
          logWarn('settings', 'Wystąpił błąd podczas usuwania skrótu');
        }
      }
    );
  };

  // ─── handleSave() – zapisuje edytowany skrót z walidacją
  const handleSave = async () => {
    try {
      if (!editingHotkey.shortcut || !editingHotkey.name) {
        showNotification(t('hotkeys.validationError'), 'error');
        logWarn('settings', 'HotkeysManager: validation failed - missing required fields');
        return;
      }

      const exists = hotkeys.some(h => h.id !== editingHotkey.id && h.shortcut === editingHotkey.shortcut);
      if (exists) {
        showNotification(t('hotkeys.duplicateError'), 'error');
        logWarn('settings', 'HotkeysManager: duplicate shortcut detected');
        return;
      }

      let newHotkeys;
      if (hotkeys.find(h => h.id === editingHotkey.id)) {
        newHotkeys = hotkeys.map(h => h.id === editingHotkey.id ? editingHotkey : h);
        logInfo('settings', `HotkeysManager: updated hotkey ${editingHotkey.id}`);
      } else {
        newHotkeys = [...hotkeys, editingHotkey];
        logInfo('settings', `HotkeysManager: added new hotkey ${editingHotkey.id}`);
      }

      await saveHotkeys(newHotkeys);
      setModalOpen(false);
      setEditingHotkey(null);
    } catch (err) {
      logError('settings', 'HotkeysManager: save hotkey failed', err.message);
      logWarn('settings', 'Wystąpił błąd podczas zapisu skrótu');
    }
  };

  // ─── handleToggleEnabled() – przełącza aktywność skrótu
  const handleToggleEnabled = async (id, enabled) => {
    try {
      const newHotkeys = hotkeys.map(h => h.id === id ? { ...h, enabled } : h);
      await saveHotkeys(newHotkeys);
      logInfo('settings', `HotkeysManager: ${enabled ? 'enabled' : 'disabled'} hotkey ${id}`);
    } catch (err) {
      logError('settings', 'HotkeysManager: toggle enabled failed', err.message);
      logWarn('settings', 'Wystąpił błąd podczas przełączania aktywności skrótu');
    }
  };

  // ─── handleModalChange() – aktualizuje pole edytowanego skrótu
  const handleModalChange = (field, value) => {
    setEditingHotkey(prev => ({ ...prev, [field]: value }));
  };

  if (!isFeatureEnabled('hotkeysManager')) return null;

  if (loading) {
    return <div className="settings-loading-small">{t('common.loading')}</div>;
  }

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
        onClose={() => { setModalOpen(false); setEditingHotkey(null); }}
        onSave={handleSave}
        onChange={handleModalChange}
      />

      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={() => {
          confirmState.onConfirm?.();
          setConfirmState({ isOpen: false, title: '', message: '', onConfirm: null });
        }}
        onCancel={() => setConfirmState({ isOpen: false, title: '', message: '', onConfirm: null })}
      />
    </section>
  );
}
