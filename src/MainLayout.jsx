// =============================================================================
// FILE: MainLayout.jsx
// PATH: src/ui/layout/MainLayout.jsx
// VERSION: 0.0.3
// PURPOSE: Układ główny aplikacji — zarządza Sidebarem, treścią, modalem potwierdzenia i powiadomieniami.
// FUNCTIONS: MainLayout, showConfirm, handleOpenTaskPanel
// DEPENDS ON: react, Sidebar, ContentRenderer, TaskPanel, ConfirmModal, loggerRenderer
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect, useContext, Suspense, lazy } from 'react';
import Sidebar from '../sidebar/Sidebar';
import { ContentRenderer } from '../views/ContentRenderer';
import ConfirmModal from '../modals/ConfirmModal';
import { TranslationContext } from '../../utils/translations.js';
import { logInfo as log } from '../../utils/loggerRenderer';

const TaskPanel = lazy(() => import('../taskpanel/TaskPanel'));

// ─── NetToast() – komponent powiadomień sieciowych
function NetToast({ message, type }) {
  if (!message) return null;
  const cls = type === 'online' ? 'toast toast-success' : type === 'offline' ? 'toast toast-error' : 'toast toast-warning';
  return <div className={cls}>{message}</div>;
}

export default function MainLayout({
  profiles,
  activeItem,
  settings,
  onSelect,
  onProfilesChange,
  onSaveSettings,
  netToast,
  netToastType
}) {
  const { t } = useContext(TranslationContext);
  const [showTaskPanel, setShowTaskPanel] = useState(false);
  const [currentProject, setCurrentProject] = useState('');
  const [sidebarModalOpen, setSidebarModalOpen] = useState(false);
  const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  // ─── showConfirm() – modal potwierdzenia
  const showConfirm = (title, message, onConfirm) => {
    setConfirmState({ isOpen: true, title, message, onConfirm });
  };

  // ─── handleOpenTaskPanel() – otwiera panel zadań
  const handleOpenTaskPanel = (profileOrProject) => {
    const name = typeof profileOrProject === 'string' ? profileOrProject : profileOrProject?.taskProject || profileOrProject?.name || 'default';
    setCurrentProject(name);
    setShowTaskPanel(true);
    log('MainLayout: TaskPanel opened for', name);
  };

  // Nasłuchiwanie na wyjście z aplikacji (confirm quit)
  useEffect(() => {
    if (window.electronAPI?.onCheckBeforeQuit) {
      window.electronAPI.onCheckBeforeQuit(() => {
        showConfirm(
          t('app.close_confirm_title'),
          t('app.close_confirm_message'),
          () => window.electronAPI.confirmQuit()
        );
      });
    }
  }, [t]);

  const isWebViewActive = activeItem && (activeItem.type === 'webview' || (activeItem.url && activeItem.type !== 'special'));

  useEffect(() => {
    document.body.classList.toggle('tools-active', !isWebViewActive);
    return () => document.body.classList.remove('tools-active');
  }, [isWebViewActive]);

  return (
    <div className="flex h-screen app-root" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar
        profiles={profiles}
        onSelect={onSelect}
        activeItem={activeItem}
        onProfilesChange={onProfilesChange}
        onOpenTaskPanel={handleOpenTaskPanel}
        onModalOpenChange={setSidebarModalOpen}
      />
      
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

      <Suspense fallback={null}>
        <TaskPanel
          projectName={currentProject}
          visible={showTaskPanel}
          onClose={() => setShowTaskPanel(false)}
          availableProjects={(settings.projects || []).map((p) => p.name)}
        />
      </Suspense>

      <NetToast message={netToast} type={netToastType} />
      
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
