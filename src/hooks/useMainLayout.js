// =============================================================================
// FILE: useMainLayout.js
// PATH: src/hooks/useMainLayout.js
// VERSION: 0.0.3
// PURPOSE: Hook zarządzający stanem globalnym layoutu aplikacji – TaskPanel, modal potwierdzenia oraz klasa CSS body w zależności od aktywnego widoku.
// FUNCTIONS: useMainLayout
// DEPENDS ON: react, translations.js, loggerRenderer.js, ipcChannels.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useEffect, useContext, useCallback } from 'react';
import { TranslationContext } from '../utils/translations.js';
import { logInfo, logError } from '../utils/loggerRenderer.js';
import { IPC_CHANNELS } from '../constants/ipcChannels.js';

// ─── useMainLayout() – zarządza stanem layoutu: TaskPanel, modal potwierdzenia, klasa body
//   @param {Object} activeItem – aktywny element nawigacji (z Sidebaru)
//   @returns {Object} – stan i handlery przekazywane do MainLayout
export function useMainLayout(activeItem) {
  const { t } = useContext(TranslationContext);

  // ── Stan TaskPanel ─────────────────────────────────────────────────────────
  const [showTaskPanel, setShowTaskPanel] = useState(false);
  const [currentGroup,  setCurrentGroup]  = useState({ id: null, name: '' });

  // ── Stan sidebaru (modal otwarty = blokuj interakcje tła) ──────────────────
  const [sidebarModalOpen, setSidebarModalOpen] = useState(false);

  // ── Stan modala potwierdzenia (np. zamknięcie aplikacji) ──────────────────
  const [confirmState, setConfirmState] = useState({
    isOpen: false, title: '', message: '', onConfirm: null,
  });

  // ─── showConfirm() – otwiera modal potwierdzenia z podanym tytułem, treścią i callbackiem
  //   @param {string}   title     – tytuł modala
  //   @param {string}   message   – treść pytania
  //   @param {Function} onConfirm – callback wywołany po kliknięciu "Potwierdź"
  const showConfirm = useCallback((title, message, onConfirm) => {
    try {
      setConfirmState({ isOpen: true, title, message, onConfirm });
    } catch (err) {
      logError('ui', 'useMainLayout: showConfirm failed', err.message);
    }
  }, []);

  // ─── hideConfirm() – zamyka modal potwierdzenia i czyści stan
  const hideConfirm = useCallback(() => {
    setConfirmState({ isOpen: false, title: '', message: '', onConfirm: null });
  }, []);

  // ─── handleOpenTaskPanel() – otwiera TaskPanel dla profilu lub nazwanej grupy
  //   Wywołuje taskGroups:ensureForProfile → zwraca lub tworzy grupę 1:1 z profilem
  //   @param {string|Object} profileOrProject – profil (obiekt z .id) lub nazwa grupy (string)
  const handleOpenTaskPanel = useCallback(async (profileOrProject) => {
    try {
      let groupId, groupName;

      if (typeof profileOrProject === 'object' && profileOrProject?.id) {
        // Profil – wyznacz grupę przez IPC
        const res = await window.electronAPI.invoke(IPC_CHANNELS.TASK_GROUPS.ENSURE_FOR_PROFILE, {
          profileId:   profileOrProject.id,
          profileName: profileOrProject.name || profileOrProject.id,
        });
        if (res?.ok && res.data) {
          groupId   = res.data.id;
          groupName = res.data.name;
        } else {
          // Fallback: użyj id profilu jako groupId gdy IPC zawiedzie
          groupId   = `tg_${profileOrProject.id}`;
          groupName = profileOrProject.name || 'Tasks';
          logError('ui', 'useMainLayout: ensureForProfile failed, using fallback', res?.error);
        }
      } else {
        // String (legacy lub globalne otwarcie TaskPanel)
        const name = typeof profileOrProject === 'string' ? profileOrProject : 'default';
        groupId   = `tg_${name}`;
        groupName = name;
      }

      setCurrentGroup({ id: groupId, name: groupName });
      setShowTaskPanel(true);
      logInfo('ui', 'useMainLayout: TaskPanel opened for group', groupId);
    } catch (err) {
      logError('ui', 'useMainLayout: handleOpenTaskPanel failed', err.message);
    }
  }, []);

  // ─── useEffect: nasłuchiwanie sygnału quit z procesu głównego ─────────────
  //   Otwiera modal potwierdzenia przed zamknięciem aplikacji
  useEffect(() => {
    if (!window.electronAPI?.onCheckBeforeQuit) return;
    window.electronAPI.onCheckBeforeQuit(() => {
      showConfirm(
        t('app.close_confirm_title'),
        t('app.close_confirm_message'),
        () => window.electronAPI.confirmQuit(),
      );
    });
  }, [t, showConfirm]);

  // ─── useEffect: klasa CSS body tools-active ────────────────────────────────
  //   Wyłącza animacje webview gdy aktywny jest moduł (nie webview)
  const isWebViewActive =
    activeItem && (activeItem.type === 'webview' || (activeItem.url && activeItem.type !== 'special'));

  useEffect(() => {
    document.body.classList.toggle('tools-active', !isWebViewActive);
    return () => document.body.classList.remove('tools-active');
  }, [isWebViewActive]);

  return {
    // TaskPanel
    showTaskPanel,
    setShowTaskPanel,
    currentGroup,
    handleOpenTaskPanel,
    // Sidebar modal
    sidebarModalOpen,
    setSidebarModalOpen,
    // Modal potwierdzenia
    confirmState,
    showConfirm,
    hideConfirm,
    // CSS helper
    isWebViewActive,
  };
}
