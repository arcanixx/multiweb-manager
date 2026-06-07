// =============================================================================
// FILE: Sidebar.jsx
// PATH: src/ui/sidebar/Sidebar.jsx
// VERSION: 0.0.3
// PURPOSE: Główny panel nawigacyjny aplikacji – czysty orkiestrator. Kompozycja podkomponentów i delegacja logiki do useSidebarHandlers.
// FUNCTIONS: Sidebar
// DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js, config.js, useProfiles.js, useCategories.js, useSidebarSearch.js, useWorkspaces.js, useSidebarHandlers.js, SidebarHeader, SidebarProfileList, SidebarTools, SidebarWorkspaces, ProfileModal, CategoryModal, ConfirmModal
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useContext } from 'react';
import { logDebug } from '../../utils/loggerRenderer.js';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import { isFeatureEnabled } from '../../config.js';

// ─── Hooki danych
import { useProfiles }      from '../../hooks/useProfiles.js';
import { useCategories }    from '../../hooks/useCategories.js';
import { useSidebarSearch } from '../../hooks/sidebar/useSidebarSearch.js';
import { useWorkspaces }    from '../../hooks/useWorkspaces.js';

// ─── Hook logiki Sidebar
import { useSidebarHandlers } from '../../hooks/sidebar/useSidebarHandlers.js';

// ─── Podkomponenty
import SidebarHeader      from './SidebarHeader';
import SidebarProfileList from './SidebarProfileList';
import SidebarTools       from './SidebarTools';
import SidebarWorkspaces  from './SidebarWorkspaces';

// ─── Modale
import ProfileModal  from '../modals/ProfileModal';
import CategoryModal from '../modals/CategoryModal';
import ConfirmModal  from '../modals/ConfirmModal';

// ─── Sidebar() – orkiestrator panelu bocznego
//   @param {Function} props.onSelect           – callback wyboru elementu
//   @param {Object}   props.activeItem         – aktywny element
//   @param {Function} props.onOpenTaskPanel    – callback otwarcia panelu zadań
//   @param {Function} props.onModalOpenChange  – callback zmiany stanu modala
export default function Sidebar({ onSelect, activeItem, onOpenTaskPanel, onModalOpenChange }) {
  const { t } = useContext(TranslationContext);

  // ─── Hooki danych ───
  const { profiles, loading: profilesLoading, addProfile, updateProfile, deleteProfile, toggleFavorite } = useProfiles();
  const { categories, collapsed, toggleCollapse, addCategory, updateCategory, deleteCategory } = useCategories();
  const { search, setSearch, favorites, byCategory, globalEnabled, setGlobalEnabled, globalResults, isGlobalSearching } = useSidebarSearch(profiles);
  const { workspaces } = useWorkspaces();

  // ─── Stan lokalny UI ───
  const [toolsCollapsed, setToolsCollapsed] = useState(false);

  // ─── Logika handlerów (modale, CRUD, wyszukiwanie) ───
  const h = useSidebarHandlers({
    profiles, addProfile, updateProfile, deleteProfile, toggleFavorite,
    categories, addCategory, updateCategory, deleteCategory,
    onSelect, onOpenTaskPanel, setSearch,
    onModalOpenChange,
  });

  if (profilesLoading) {
    return <div className="sidebar-loading">{t('common.loading')}</div>;
  }

  logDebug('ui', 'Sidebar: render');

  return (
    <div style={{
      width: 'var(--sidebar-width)', minWidth: 200, maxWidth: 280,
      background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', height: '100vh', flexShrink: 0,
    }}>
      {/* ─── Nagłówek ─── */}
      <SidebarHeader
        onAddProfile={h.handleAddProfile}
        onAddCategory={h.handleAddCategory}
        searchValue={search}
        onSearchChange={setSearch}
        globalEnabled={globalEnabled}
        onGlobalToggle={() => setGlobalEnabled(v => !v)}
        globalResults={globalResults}
        isGlobalSearching={isGlobalSearching}
        onGlobalSelect={h.handleGlobalSelect}
      />

      {/* ─── App Library – punkt wejścia do biblioteki aplikacji ─── */}
      {isFeatureEnabled('appLibrary') && (
        <button
          onClick={() => onSelect({ id: 'appLibrary', type: 'special', name: t('appLibrary.title') })}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            margin: '4px 8px 0', padding: '8px 12px',
            background: activeItem?.id === 'appLibrary' ? 'var(--accent)' : 'transparent',
            color: activeItem?.id === 'appLibrary' ? 'var(--accent-text, #fff)' : 'var(--text)',
            border: '1px solid var(--border)', borderRadius: 8,
            cursor: 'pointer', width: 'calc(100% - 16px)',
            fontSize: 13, fontWeight: 500, transition: 'background 0.15s',
          }}
        >
          <span>{ICONS.APP_LIBRARY}</span>
          <span>{t('appLibrary.title')}</span>
        </button>
      )}

      {/* ─── Lista profili ─── */}
      <SidebarProfileList
        favorites={favorites}
        byCategory={byCategory}
        categories={categories}
        collapsed={collapsed}
        activeItem={activeItem}
        onSelect={onSelect}
        onToggleCollapse={toggleCollapse}
        onEditCategory={h.handleEditCategory}
        onDeleteCategory={h.handleDeleteCategory}
        onEditProfile={h.handleEditProfile}
        onToggleFavorite={h.handleToggleFavorite}
        onDeleteProfile={h.handleDeleteClick}
        onOpenTasks={onOpenTaskPanel}
      />

      {/* ─── Separator ─── */}
      <div style={{ height: 1, background: 'var(--border)', margin: '10px 4px' }} />

      {/* ─── Narzędzia specjalne ─── */}
      <div className="sidebar-category" onClick={() => setToolsCollapsed(c => !c)}>
        <span>{ICONS.SETTINGS}</span>
        <span style={{ flex: 1 }}>{t('sidebar.special')}</span>
        <span style={{ fontSize: 10 }}>{toolsCollapsed ? ICONS.CHEVRON_RIGHT : ICONS.CHEVRON_DOWN}</span>
      </div>
      {!toolsCollapsed && <SidebarTools activeItem={activeItem} onSelect={onSelect} />}

      {/* ─── Workspace'y ─── */}
      <SidebarWorkspaces
        workspaces={workspaces}
        activeWorkspace={activeItem}
        onSelect={onSelect}
      />

      {/* ─── Modale ─── */}
      {h.showProfileModal && (
        <ProfileModal
          profile={h.editingProfile}
          categories={categories}
          onSave={h.handleSaveProfile}
          onClose={h.closeProfileModal}
        />
      )}

      {h.showCategoryModal && (
        <CategoryModal
          category={h.editingCategory}
          onSave={h.handleSaveCategory}
          onClose={h.closeCategoryModal}
        />
      )}

      <ConfirmModal
        isOpen={h.showDeleteConfirm}
        title={t('confirm.deleteProfileTitle')}
        message={t('confirm.deleteProfileMessage')}
        onConfirm={() => h.handleDeleteConfirm(activeItem?.id)}
        onCancel={h.cancelDeleteConfirm}
      />
    </div>
  );
}
