// =============================================================================
// FILE:       MainLayout.jsx
// PATH:       src/ui/layout/MainLayout.jsx
// VERSION:    0.0.3
// PURPOSE:    Główny szkielet interfejsu użytkownika (Shell) – definiuje siatkę aplikacji, koordynuje nawigację boczną, obszar roboczy (ContentRenderer) oraz integruje globalne mechanizmy modalne. Logika stanu przeniesiona do useMainLayout.js.
// FUNCTIONS:  MainLayout
// DEPENDS ON: react, useMainLayout.js, Sidebar.jsx, ContentRenderer.jsx, ConfirmModal.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { Suspense, lazy } from 'react';
import { useMainLayout } from '../../hooks/useMainLayout.js';
import Sidebar from '../sidebar/Sidebar.jsx';
import { ContentRenderer } from '../views/ContentRenderer.jsx';
import ConfirmModal from '../modals/ConfirmModal.jsx';

const TaskPanel = lazy(() => import('../taskpanel/TaskPanel.jsx'));

// ─── MainLayout() – główny układ: Sidebar po lewej, ContentRenderer po prawej
//   @param {Object}   props.activeItem     – aktywny element nawigacji
//   @param {Object}   props.settings       – ustawienia aplikacji
//   @param {Function} props.onSelect       – callback wyboru elementu z Sidebaru
//   @param {Function} props.onSaveSettings – callback zapisu ustawień
//   @returns {JSX.Element}
export default function MainLayout({
  activeItem,
  settings,
  onSelect,
  onSaveSettings,
}) {
  const {
    showTaskPanel, setShowTaskPanel,
    currentGroup,  handleOpenTaskPanel,
    sidebarModalOpen, setSidebarModalOpen,
    confirmState,  hideConfirm,
    isWebViewActive,
  } = useMainLayout(activeItem);

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
            onOpenTasks={handleOpenTaskPanel}
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

      {/* ── Modal potwierdzenia (np. zamknięcie aplikacji) ───────────────── */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={() => {
          confirmState.onConfirm?.();
          hideConfirm();
        }}
        onCancel={hideConfirm}
      />
    </div>
  );
}
