// =============================================================================
// FILE: MainLayout.jsx
// PATH: src/ui/layout/MainLayout.jsx
// VERSION: 0.0.3
// PURPOSE: Główny szkielet interfejsu użytkownika (Shell) – definiuje siatkę aplikacji, koordynuje nawigację boczną, obszar roboczy (ContentRenderer) oraz integruje globalne mechanizmy modalne i powiadomienia sieciowe.
// FUNCTIONS: MainLayout
// DEPENDS ON: react, translations.js, loggerRenderer.js, Sidebar.jsx, ContentRenderer.jsx, ConfirmModal.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect, useContext, Suspense, lazy } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { logInfo, logDebug, logError } from '../../utils/loggerRenderer.js';
import Sidebar from '../sidebar/Sidebar.jsx';
import { ContentRenderer } from '../views/ContentRenderer.jsx';
import ConfirmModal from '../modals/ConfirmModal.jsx';

const TaskPanel = lazy(() => import('../taskpanel/TaskPanel.jsx'));

// ─── MainLayout() – główny układ: Sidebar po lewej, ContentRenderer po prawej
//   @param {Object}   props.activeItem      – aktywny element
//   @param {Object}   props.settings        – ustawienia aplikacji
//   @param {Function} props.onSelect        – callback wyboru elementu z Sidebaru
//   @param {Function} props.onSaveSettings  – callback zapisu ustawień
//   @returns {JSX.Element}
export default function MainLayout({
  activeItem,
  settings,
  onSelect,
  onSaveSettings,
}) {
  const { t } = useContext(TranslationContext);
  const [showTaskPanel, setShowTaskPanel]   = useState(false);
  const [currentGroup,  setCurrentGroup]    = useState({ id: null, name: '' });
  const [sidebarModalOpen, setSidebarModalOpen] = useState(false);
  const [confirmState, setConfirmState] = useState({
    isOpen: false, title: '', message: '', onConfirm: null,
  });

  // ─── showConfirm() – otwiera modal potwierdzenia
  const showConfirm = (title, message, onConfirm) => {
    try {
      setConfirmState({ isOpen: true, title, message, onConfirm });
    } catch (err) {
      logError('ui', 'MainLayout: showConfirm failed', err.message);
    }
  };

  // ─── handleOpenTaskPanel() – otwiera TaskPanel dla profilu
  //   Wywołuje taskGroups:ensureForProfile → zwraca lub tworzy grupę 1:1
  //   @param {string|Object} profileOrProject – profil (obiekt) lub nazwa grupy (string)
  const handleOpenTaskPanel = async (profileOrProject) => {
    try {
      let groupId, groupName;

      if (typeof profileOrProject === 'object' && profileOrProject?.id) {
        // Profil – wyznacz grupę przez IPC
        const res = await window.electronAPI.invoke('taskGroups:ensureForProfile', {
          profileId:   profileOrProject.id,
          profileName: profileOrProject.name || profileOrProject.id,
        });
        if (res?.ok && res.data) {
          groupId   = res.data.id;
          groupName = res.data.name;
        } else {
          // Fallback: użyj id profilu jako groupId
          groupId   = `tg_${profileOrProject.id}`;
          groupName = profileOrProject.name || 'Tasks';
          logError('ui', 'MainLayout: ensureForProfile failed, using fallback', res?.error);
        }
      } else {
        // String (legacy lub globalne otwarcie)
        const name = typeof profileOrProject === 'string' ? profileOrProject : 'default';
        groupId   = `tg_${name}`;
        groupName = name;
      }

      setCurrentGroup({ id: groupId, name: groupName });
      setShowTaskPanel(true);
      logInfo('ui', 'MainLayout: TaskPanel opened for group', groupId);
    } catch (err) {
      logError('ui', 'MainLayout: handleOpenTaskPanel failed', err.message);
    }
  };

  // Nasłuchiwanie sygnału quit z procesu głównego
  useEffect(() => {
    if (!window.electronAPI?.onCheckBeforeQuit) return;
    window.electronAPI.onCheckBeforeQuit(() => {
      showConfirm(
        t('app.close_confirm_title'),
        t('app.close_confirm_message'),
        () => window.electronAPI.confirmQuit(),
      );
    });
  }, [t]);

  // Klasa body tools-active (wyłącza animacje webview gdy moduł aktywny)
  const isWebViewActive =
    activeItem && (activeItem.type === 'webview' || (activeItem.url && activeItem.type !== 'special'));

  useEffect(() => {
    document.body.classList.toggle('tools-active', !isWebViewActive);
    return () => document.body.classList.remove('tools-active');
  }, [isWebViewActive]);

  return (
    <div className="flex h-screen app-root" style={{ background: 'var(--bg-primary)' }}>
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <Sidebar
        onSelect={onSelect}
        activeItem={activeItem}
        onOpenTaskPanel={handleOpenTaskPanel}
        onModalOpenChange={setSidebarModalOpen}
      />

      {/* ── Panel główny ─────────────────────────────────────────────────── */}
      <main
        className={`main-area flex flex-col overflow-hidden ${isWebViewActive ? 'main-area--webview' : 'main-area--module'}`}
        style={{ minWidth: 0, flex: 1, minHeight: 0 }}
      >
        <div
          className="module-view"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}
          key={activeItem ? `${activeItem.type}-${activeItem.id || activeItem.name}` : 'home'}
        >
          <ContentRenderer
            activeItem={activeItem}
            settings={settings}
            onSaveSettings={onSaveSettings}
            onOpenTasks={(profileOrProject) => handleOpenTaskPanel(profileOrProject)}
            sidebarModalOpen={sidebarModalOpen}
          />
        </div>
      </main>

      {/* ── TaskPanel (lazy) ─────────────────────────────────────────────── */}
      <Suspense fallback={null}>
        <TaskPanel
          taskGroupId={currentGroup.id}
          groupName={currentGroup.name}
          visible={showTaskPanel}
          onClose={() => setShowTaskPanel(false)}
        />
      </Suspense>

      {/* ── Modal potwierdzenia ───────────────────────────────────────────── */}
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
    </div>
  );
}
