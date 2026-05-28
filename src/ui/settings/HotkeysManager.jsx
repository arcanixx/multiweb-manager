// =============================================================================
// FILE: HotkeysManager.jsx
// PATH: src/ui/settings/HotkeysManager.jsx
// VERSION: 0.0.3
// PURPOSE: Zarządzanie skrótami klawiszowymi (globalShortcut + snippet text)
// FUNCTIONS: HotkeysManager
// DEPENDS ON: react, translations.js, src, ConfirmModal, Modal
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect } from 'react';
import { TranslationContext } from '../utils/translations.js';
import { logDebug, logError } from 'src/utils/loggerRenderer';
import ConfirmModal from '../modals/ConfirmModal';
import Modal from '../modals/Modal';
const DEFAULT_HOTKEYS = [
  { id: 'hk-1', shortcut: 'Ctrl+Shift+S', name: 'Screenshot WebView', text: '', enabled: true, action: 'screenshot' },
  { id: 'hk-2', shortcut: 'Ctrl+Shift+M', name: 'Resource Monitor', text: '', enabled: true, action: 'monitor' },
  { id: 'hk-3', shortcut: 'Ctrl+Shift+1', name: 'Snippet: Email signature', text: 'Best regards,\nMaciej', enabled: true, action: 'insertText' }
];
export default function HotkeysManager() {
  const { t } = React.useContext(TranslationContext);
  const [hotkeys, setHotkeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHotkey, setEditingHotkey] = useState(null);
  const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  // ŁADOWANIE
  // =========================================================================
  useEffect(() => {
    const loadHotkeys = async () => {
      try {
        if (window.electronAPI?.getHotkeys) {
          const saved = await window.electronAPI.getHotkeys();
          if (saved.data && saved.data.length) {
            setHotkeys(saved.data);
          } else {
            setHotkeys(DEFAULT_HOTKEYS);
          }
        } else {
          setHotkeys(DEFAULT_HOTKEYS);
        }
      } catch (err) {
        logError('Failed to load hotkeys', err);
        setHotkeys(DEFAULT_HOTKEYS);
      } finally {
        setLoading(false);
      }
    };
    loadHotkeys();
  }, []);
  
  // HANDLERY
  // =========================================================================
  const showConfirm = (title, message, onConfirm) => {
    setConfirmState({ isOpen: true, title, message, onConfirm });
  };
  
  const saveHotkeys = async (newHotkeys) => {
    setHotkeys(newHotkeys);
    if (window.electronAPI?.saveHotkeys) {
      await window.electronAPI.saveHotkeys(newHotkeys);
    }
    if (window.electronAPI?.registerGlobalHotkeys) {
      await window.electronAPI.registerGlobalHotkeys(newHotkeys);
    }
  };
  
  const handleAdd = () => {
    setEditingHotkey({
      id: `hk-${Date.now()}`,
      shortcut: '',
      name: '',
      text: '',
      enabled: true,
      action: 'insertText'
    });
    setModalOpen(true);
  };
  
  const handleEdit = (hotkey) => {
    setEditingHotkey({ ...hotkey });
    setModalOpen(true);
  };
  
  const handleDelete = (id) => {
    showConfirm(
      t('hotkeys.deleteConfirmTitle'),
      t('hotkeys.deleteConfirmMessage'),
      async () => {
        const newHotkeys = hotkeys.filter(h => h.id !== id);
        await saveHotkeys(newHotkeys);
      }
    );
  };
  
  const handleSave = async () => {
    if (!editingHotkey.shortcut || !editingHotkey.name) {
      alert(t('hotkeys.validationError'));
      return;
    }
    
    // Sprawdź duplikaty
    const exists = hotkeys.some(h => h.id !== editingHotkey.id && h.shortcut === editingHotkey.shortcut);
    if (exists) {
      alert(t('hotkeys.duplicateError'));
      return;
    }
    
    let newHotkeys;
    if (hotkeys.find(h => h.id === editingHotkey.id)) {
      newHotkeys = hotkeys.map(h => h.id === editingHotkey.id ? editingHotkey : h);
    } else {
      newHotkeys = [...hotkeys, editingHotkey];
    }
    
    await saveHotkeys(newHotkeys);
    setModalOpen(false);
    setEditingHotkey(null);
  };
  
  const handleToggleEnabled = async (id, enabled) => {
    const newHotkeys = hotkeys.map(h => h.id === id ? { ...h, enabled } : h);
    await saveHotkeys(newHotkeys);
  };
  
  const parseShortcut = (shortcut) => {
    // Użytkownik wpisuje np. "Ctrl+Shift+S" – bez walidacji, przekazujemy dalej
    return shortcut;
  };
  
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