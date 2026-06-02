// =============================================================================
// FILE: HotkeysManager.jsx
// PATH: src/ui/settings/HotkeysManager.jsx
// VERSION: 0.0.3
// PURPOSE: Zarządzanie skrótami klawiszowymi (globalShortcut + snippet text)
// FUNCTIONS: HotkeysManager
// DEPENDS ON: react, config.js, translations.js, loggerRenderer, ConfirmModal, Modal, notificationsManager.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect } from 'react';
import { isFeatureEnabled } from '../../config.js';
import { TranslationContext } from '../../utils/translations.js';
import { logDebug, logError, logInfo, logWarn } from '../../utils/loggerRenderer';
import ConfirmModal from '../modals/ConfirmModal';
import Modal from '../modals/Modal';
import { showNotification } from '../../utils/notificationsManager.js';

const DEFAULT_HOTKEYS = [
  { id: 'hk-1', shortcut: 'Ctrl+Shift+S', name: 'Screenshot WebView', text: '', enabled: true, action: 'screenshot' },
  { id: 'hk-2', shortcut: 'Ctrl+Shift+M', name: 'Resource Monitor', text: '', enabled: true, action: 'monitor' },
  { id: 'hk-3', shortcut: 'Ctrl+Shift+1', name: 'Snippet: Email signature', text: 'Best regards,\nMaciej', enabled: true, action: 'insertText' }
];

// ─── HotkeysManager() – zarządzanie skrótami klawiszowymi z edycją i zapisem
//   @returns {JSX.Element} – renderowany interfejs menedżera skrótów
export default function HotkeysManager() {
  const { t } = React.useContext(TranslationContext);
  const [hotkeys, setHotkeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHotkey, setEditingHotkey] = useState(null);
  const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  // ─── useEffect – ładowanie skrótów przy montowaniu
  useEffect(() => {
    // ─── loadHotkeys() – ładuję skróty z storage lub używam domyślnych
    const loadHotkeys = async () => {
      try {
        if (window.electronAPI?.getHotkeys) {
          const saved = await window.electronAPI.getHotkeys();
          if (saved.data && saved.data.length) {
            setHotkeys(saved.data);
            logInfo('HotkeysManager: loaded hotkeys from storage');
          } else {
            setHotkeys(DEFAULT_HOTKEYS);
            logInfo('HotkeysManager: using default hotkeys');
          }
        } else {
          setHotkeys(DEFAULT_HOTKEYS);
          logWarn('HotkeysManager: electronAPI.getHotkeys not available');
        }
      } catch (err) {
        logError('HotkeysManager: failed to load hotkeys', err);
        logWarn('Nie można załadować skrótów klawiszowych');
        setHotkeys(DEFAULT_HOTKEYS);
      } finally {
        setLoading(false);
      }
    };
    loadHotkeys();
  }, []);

  // ─── showConfirm() – wyświetla modal potwierdzenia
  //   @param {string} title – tytuł modala
  //   @param {string} message – treść komunikatu
  //   @param {Function} onConfirm – callback potwierdzenia
  //   @returns {void}
  const showConfirm = (title, message, onConfirm) => {
    try {
      logInfo('HotkeysManager: showing confirm modal');
      setConfirmState({ isOpen: true, title, message, onConfirm });
    } catch (err) {
      logError('HotkeysManager: show confirm failed', err);
      logWarn('Wystąpił błąd podczas wyświetlania modala potwierdzenia');
    }
  };

  // ─── saveHotkeys() – zapisuje skróty do storage i rejestruje globalnie
  //   @param {Array} newHotkeys – lista skrótów do zapisu
  //   @returns {Promise<void>}
  const saveHotkeys = async (newHotkeys) => {
    try {
      setHotkeys(newHotkeys);
      if (window.electronAPI?.saveHotkeys) {
        await window.electronAPI.saveHotkeys(newHotkeys);
        logInfo('HotkeysManager: hotkeys saved to storage');
      }
      if (window.electronAPI?.registerGlobalHotkeys) {
        await window.electronAPI.registerGlobalHotkeys(newHotkeys);
        logInfo('HotkeysManager: global hotkeys registered');
      }
    } catch (err) {
      logError('HotkeysManager: save hotkeys failed', err);
      logWarn('Wystąpił błąd podczas zapisu skrótów');
      throw err;
    }
  };

  // ─── handleAdd() – otwiera modal dodawania nowego skrótu
  //   @returns {void}
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
      logInfo('HotkeysManager: adding new hotkey');
    } catch (err) {
      logError('HotkeysManager: add hotkey failed', err);
      logWarn('Wystąpił błąd podczas dodawania skrótu');
    }
  };

  // ─── handleEdit() – otwiera modal edycji skrótu
  //   @param {Object} hotkey – edytowany skrót
  //   @returns {void}
  const handleEdit = (hotkey) => {
    try {
      setEditingHotkey({ ...hotkey });
      setModalOpen(true);
      logInfo(`HotkeysManager: editing hotkey ${hotkey.id}`);
    } catch (err) {
      logError('HotkeysManager: edit hotkey failed', err);
      logWarn('Wystąpił błąd podczas edycji skrótu');
    }
  };

  // ─── handleDelete() – usuwa skrót po potwierdzeniu
  //   @param {string} id – identyfikator skrótu do usunięcia
  //   @returns {void}
  const handleDelete = (id) => {
    showConfirm(
      t('hotkeys.deleteConfirmTitle'),
      t('hotkeys.deleteConfirmMessage'),
      async () => {
        try {
          const newHotkeys = hotkeys.filter(h => h.id !== id);
          await saveHotkeys(newHotkeys);
          logInfo(`HotkeysManager: deleted hotkey ${id}`);
        } catch (err) {
          logError('HotkeysManager: delete hotkey failed', err);
          logWarn('Wystąpił błąd podczas usuwania skrótu');
        }
      }
    );
  };

  // ─── handleSave() – zapisuje edytowany skrót z walidacją
  //   @returns {Promise<void>}
  const handleSave = async () => {
    try {
      if (!editingHotkey.shortcut || !editingHotkey.name) {
        showNotification(t('hotkeys.validationError'), 'error');
        logWarn('HotkeysManager: validation failed - missing required fields');
        return;
      }

      // Sprawdź duplikaty
      const exists = hotkeys.some(h => h.id !== editingHotkey.id && h.shortcut === editingHotkey.shortcut);
      if (exists) {
        showNotification(t('hotkeys.duplicateError'), 'error');
        logWarn('HotkeysManager: duplicate shortcut detected');
        return;
      }

      let newHotkeys;
      if (hotkeys.find(h => h.id === editingHotkey.id)) {
        newHotkeys = hotkeys.map(h => h.id === editingHotkey.id ? editingHotkey : h);
        logInfo(`HotkeysManager: updated hotkey ${editingHotkey.id}`);
      } else {
        newHotkeys = [...hotkeys, editingHotkey];
        logInfo(`HotkeysManager: added new hotkey ${editingHotkey.id}`);
      }

      await saveHotkeys(newHotkeys);
      setModalOpen(false);
      setEditingHotkey(null);
    } catch (err) {
      logError('HotkeysManager: save hotkey failed', err);
      logWarn('Wystąpił błąd podczas zapisu skrótu');
    }
  };

  // ─── handleToggleEnabled() – przełącza aktywność skrótu
  //   @param {string} id – identyfikator skrótu
  //   @param {boolean} enabled – nowy stan aktywności
  //   @returns {Promise<void>}
  const handleToggleEnabled = async (id, enabled) => {
    try {
      const newHotkeys = hotkeys.map(h => h.id === id ? { ...h, enabled } : h);
      await saveHotkeys(newHotkeys);
      logInfo(`HotkeysManager: ${enabled ? 'enabled' : 'disabled'} hotkey ${id}`);
    } catch (err) {
      logError('HotkeysManager: toggle enabled failed', err);
      logWarn('Wystąpił błąd podczas przełączania aktywności skrótu');
    }
  };

  // ─── parseShortcut() – parsowanie skrótu (placeholder dla przyszłej walidacji)
  //   @param {string} shortcut – skrót w formacie tekstowym
  //   @returns {string} – sparsowany skrót
  const parseShortcut = (shortcut) => {
    try {
      // Użytkownik wpisuje np. "Ctrl+Shift+S" – bez walidacji, przekazujemy dalej
      // W przyszłości można dodać walidację formatu
      logDebug(`HotkeysManager: parsing shortcut ${shortcut}`);
      return shortcut;
    } catch (err) {
      logError('HotkeysManager: parse shortcut failed', err);
      logWarn('Wystąpił błąd podczas parsowania skrótu');
      return '';
    }
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
                  onChange={(e) => handleToggleEnabled(hk.id, e.target.checked)}
                />
              </td>
              <td>
                <button onClick={() => handleEdit(hk)}>✏️</button>
                <button onClick={() => handleDelete(hk.id)}>🗑️</button>
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

      {/* MODAL DODAWANIA/EDYCJI */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingHotkey?.id ? t('hotkeys.edit') : t('hotkeys.add')}>
        <div className="hotkey-modal-form">
          <div className="form-group">
            <label>{t('hotkeys.name')}</label>
            <input
              type="text"
              value={editingHotkey?.name || ''}
              onChange={(e) => setEditingHotkey({ ...editingHotkey, name: e.target.value })}
              placeholder={t('hotkeys.namePlaceholder')}
            />
          </div>

          <div className="form-group">
            <label>{t('hotkeys.shortcut')}</label>
            <input
              type="text"
              value={editingHotkey?.shortcut || ''}
              onChange={(e) => setEditingHotkey({ ...editingHotkey, shortcut: e.target.value })}
              placeholder="Ctrl+Shift+S"
            />
            <span className="form-hint">{t('hotkeys.shortcutHint')}</span>
          </div>

          <div className="form-group">
            <label>{t('hotkeys.text')}</label>
            <textarea
              value={editingHotkey?.text || ''}
              onChange={(e) => setEditingHotkey({ ...editingHotkey, text: e.target.value })}
              rows={4}
              placeholder={t('hotkeys.textPlaceholder')}
            />
            <span className="form-hint">{t('hotkeys.textHint')}</span>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={editingHotkey?.enabled !== false}
                onChange={(e) => setEditingHotkey({ ...editingHotkey, enabled: e.target.checked })}
              />
              {t('hotkeys.enabled')}
            </label>
          </div>

          <div className="form-actions">
            <button onClick={() => setModalOpen(false)}>{t('common.cancel')}</button>
            <button onClick={handleSave} className="btn-primary">{t('common.save')}</button>
          </div>
        </div>
      </Modal>

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