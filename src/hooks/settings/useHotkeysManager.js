// =============================================================================
// FILE: useHotkeysManager.js
// PATH: src/hooks/settings/useHotkeysManager.js
// VERSION: 0.0.3
// PURPOSE: Hook logiki HotkeysManager – ładowanie, CRUD skrótów, walidacja, zapis IPC
// FUNCTIONS: useHotkeysManager
// DEPENDS ON: react, translations.js, loggerRenderer.js, notificationsManager.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useEffect, useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { logDebug, logError, logInfo, logWarn } from '../../utils/loggerRenderer.js';
import { showNotification } from '../../utils/notificationsManager.js';

// UWAGA: DEFAULT_HOTKEYS celowo pozostaje tu – fallback ściśle powiązany z logiką ładowania.
const DEFAULT_HOTKEYS = [
  { id: 'hk-1', shortcut: 'Ctrl+Shift+S', name: 'Screenshot WebView',    text: '',                        enabled: true, action: 'screenshot'  },
  { id: 'hk-2', shortcut: 'Ctrl+Shift+M', name: 'Resource Monitor',      text: '',                        enabled: true, action: 'monitor'     },
  { id: 'hk-3', shortcut: 'Ctrl+Shift+1', name: 'Snippet: Email signature', text: 'Best regards,\nMaciej', enabled: true, action: 'insertText' },
];

// ─── useHotkeysManager() – logika zarządzania skrótami klawiszowymi
export function useHotkeysManager() {
  const { t } = useContext(TranslationContext);
  const [hotkeys,      setHotkeys]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [modalOpen,    setModalOpen]    = useState(false);
  const [editingHotkey, setEditingHotkey] = useState(null);
  const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  // ─── useEffect – ładowanie skrótów przy montowaniu
  useEffect(() => {
    const load = async () => {
      try {
        const saved = await window.electronAPI?.getHotkeys?.();
        if (saved?.data?.length) {
          setHotkeys(saved.data);
          logInfo('settings', 'useHotkeysManager: loaded from storage');
        } else {
          setHotkeys(DEFAULT_HOTKEYS);
          logInfo('settings', 'useHotkeysManager: using defaults');
        }
      } catch (err) {
        logError('settings', 'useHotkeysManager: load failed', err.message);
        setHotkeys(DEFAULT_HOTKEYS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ─── saveHotkeys() – zapisuje skróty do storage i rejestruje globalnie
  const saveHotkeys = async (newHotkeys) => {
    try {
      setHotkeys(newHotkeys);
      await window.electronAPI?.saveHotkeys?.(newHotkeys);
      await window.electronAPI?.registerGlobalHotkeys?.(newHotkeys);
      logInfo('settings', 'useHotkeysManager: saved and registered');
    } catch (err) {
      logError('settings', 'useHotkeysManager: save failed', err.message);
      throw err;
    }
  };

  const showConfirm = (title, message, onConfirm) => {
    logDebug('ui', 'useHotkeysManager: showing confirm');
    setConfirmState({ isOpen: true, title, message, onConfirm });
  };

  const closeConfirm = () => setConfirmState({ isOpen: false, title: '', message: '', onConfirm: null });

  const handleAdd = () => {
    setEditingHotkey({ id: `hk-${Date.now()}`, shortcut: '', name: '', text: '', enabled: true, action: 'insertText' });
    setModalOpen(true);
  };

  const handleEdit = (hotkey) => {
    setEditingHotkey({ ...hotkey });
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    showConfirm(t('hotkeys.deleteConfirmTitle'), t('hotkeys.deleteConfirmMessage'), async () => {
      try {
        await saveHotkeys(hotkeys.filter(h => h.id !== id));
        logInfo('settings', `useHotkeysManager: deleted ${id}`);
      } catch (err) {
        logError('settings', 'useHotkeysManager: delete failed', err.message);
      }
    });
  };

  const handleSave = async () => {
    if (!editingHotkey?.shortcut || !editingHotkey?.name) {
      showNotification(t('hotkeys.validationError'), 'error');
      logWarn('settings', 'useHotkeysManager: validation failed');
      return;
    }
    if (hotkeys.some(h => h.id !== editingHotkey.id && h.shortcut === editingHotkey.shortcut)) {
      showNotification(t('hotkeys.duplicateError'), 'error');
      logWarn('settings', 'useHotkeysManager: duplicate shortcut');
      return;
    }
    const exists = hotkeys.find(h => h.id === editingHotkey.id);
    const newHotkeys = exists
      ? hotkeys.map(h => h.id === editingHotkey.id ? editingHotkey : h)
      : [...hotkeys, editingHotkey];
    await saveHotkeys(newHotkeys);
    setModalOpen(false);
    setEditingHotkey(null);
  };

  const handleToggleEnabled = async (id, enabled) => {
    await saveHotkeys(hotkeys.map(h => h.id === id ? { ...h, enabled } : h));
    logInfo('settings', `useHotkeysManager: toggle ${id} → ${enabled}`);
  };

  const handleModalChange = (field, value) => setEditingHotkey(prev => ({ ...prev, [field]: value }));

  const closeModal = () => { setModalOpen(false); setEditingHotkey(null); };

  return {
    hotkeys, loading,
    modalOpen, editingHotkey,
    confirmState, closeConfirm,
    handleAdd, handleEdit, handleDelete, handleSave,
    handleToggleEnabled, handleModalChange, closeModal,
  };
}