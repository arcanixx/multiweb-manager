// =============================================================================
// FILE: MainLayout.jsx
// PATH: src/ui/layout/MainLayout.jsx
// VERSION: 0.0.3
// PURPOSE: Główny układ aplikacji — Sidebar + panel treści + TaskPanel + toasty + ConfirmModal
// FUNCTIONS: MainLayout, NetToast, handleOpenTaskPanel, showConfirm
// DEPENDS ON: react, Sidebar, ContentRenderer, TaskPanel, ConfirmModal, loggerRenderer, translations.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect, useContext, Suspense, lazy } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { logInfo, logDebug } from '../../utils/loggerRenderer.js';
import Sidebar from '../sidebar/Sidebar.jsx';
import { ContentRenderer } from '../views/ContentRenderer.jsx';
import ConfirmModal from '../modals/ConfirmModal.jsx';

const TaskPanel = lazy(() => import('../taskpanel/TaskPanel'));

// ─── NetToast() – powiadomienie o stanie połączenia sieciowego
//   @param {string} props.message – treść powiadomienia
//   @param {string} props.type    – 'online' | 'offline' | 'warning'
//   @returns {JSX.Element|null}
function NetToast({ message, type }) {
  if (!message) return null;
  const cls =
    type === 'online'  ? 'toast toast-success' :
    type === 'offline' ? 'toast toast-error'   :
                         'toast toast-warning';
  return <div className={cls}>{message}</div>;
}

// ─── MainLayout() – główny układ: Sidebar po lewej, ContentRenderer po prawej
//   @param {Array}    props.profiles        – lista profili
//   @param {Object}   props.activeItem      – aktywny element
//   @param {Object}   props.settings        – ustawienia aplikacji
//   @param {Function} props.onSelect        – callback wyboru elementu z Sidebaru
//   @param {Function} props.onProfilesChange – callback zmiany profili
//   @param {Function} props.onSaveSettings  – callback zapisu ustawień
//   @param {string}   props.netToast        – treść powiadomienia sieciowego
//   @param {string}   props.netToastType    – typ powiadomienia sieciowego
//   @returns {JSX.Element}
export default function MainLayout({
  profiles,
  activeItem,
  settings,
  onSelect,
  onProfilesChange,
  onSaveSettings,
  netToast,
  netToastType,
}) {
  const { t } = useContext(TranslationContext);
  const [showTaskPanel, setShowTaskPanel]   = useState(false);
  const [currentProject, setCurrentProject] = useState('');
  const [sidebarModalOpen, setSidebarModalOpen] = useState(false);
  const [confirmState, setConfirmState] = useState({
    isOpen: false, title: '', message: '', onConfirm: null,
  });

  // ─── showConfirm() – otwiera modal potwierdzenia
  const showConfirm = (title, message, onConfirm) => {
    setConfirmState({ isOpen: true, title, message, onConfirm });
  };

  // ─── handleOpenTaskPanel() – otwiera TaskPanel dla projektu / profilu
  //   @param {string|Object} profileOrProject
  const handleOpenTaskPanel = (profileOrProject) => {
    const name =
      typeof profileOrProject === 'string'
        ? profileOrProject
        : profileOrProject?.taskProject || profileOrProject?.name || 'default';
    setCurrentProject(name);
    setShowTaskPanel(true);
    logInfo('MainLayout: TaskPanel opened for', name);
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
        profiles={profiles}
        onSelect={onSelect}
        activeItem={activeItem}
        onProfilesChange={onProfilesChange}
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
            onOpenTasks={(project) => { setCurrentProject(project); setShowTaskPanel(true); }}
            sidebarModalOpen={sidebarModalOpen}
          />
        </div>
      </main>

      {/* ── TaskPanel (lazy) ─────────────────────────────────────────────── */}
      <Suspense fallback={null}>
        <TaskPanel
          projectName={currentProject}
          visible={showTaskPanel}
          onClose={() => setShowTaskPanel(false)}
          availableProjects={(settings.projects || []).map((p) => p.name)}
        />
      </Suspense>

      {/* ── Powiadomienia sieciowe ────────────────────────────────────────── */}
      <NetToast message={netToast} type={netToastType} />

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
