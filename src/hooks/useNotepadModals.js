// =============================================================================
// FILE: useNotepadModals.js
// PATH: src/hooks/notepad/useNotepadModals.js
// VERSION: 0.0.3
// PURPOSE: Zarządzanie stanem modali i powiadomień dla notatnika.
// FUNCTIONS: useNotepadModals
// DEPENDS ON: react
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useCallback } from 'react';

// Hook zarządzający modalem potwierdzenia i tostem.
export function useNotepadModals() {
  const [toast, setToast] = useState('');
  const [confirmModal, setConfirmModal] = useState(null); // { title, message, onConfirm, onCancel }

  // ─── showConfirm() – wyświetla modal potwierdzenia
  const showConfirm = useCallback((title, message, onConfirm) => {
    setConfirmModal({ title, message, onConfirm, onCancel: () => setConfirmModal(null) });
  }, []);

  // ─── showInlineToast() – mini feedback w toolbarze
  const showInlineToast = useCallback((msg) => {
    setToast(msg);
    const timer = setTimeout(() => setToast(''), 2000);
    return () => clearTimeout(timer);
  }, []);

  const hideConfirm = useCallback(() => {
    setConfirmModal(null);
  }, []);

  return {
    toast,
    confirmModal,
    showConfirm,
    hideConfirm,
    showInlineToast
  };
}