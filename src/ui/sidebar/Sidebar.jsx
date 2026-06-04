// =============================================================================
// FILE: Sidebar.jsx
// PATH: src/ui/sidebar/Sidebar.jsx
// VERSION: 0.0.3
// PURPOSE: Główny panel nawigacyjny aplikacji – orkiestrator, deleguje logikę do hooków i podkomponentów.
// FUNCTIONS: Sidebar
// DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js, useProfiles.js, useCategories.js, useSidebarSearch.js, useWorkspaces.js, SidebarHeader, SidebarProfileList, SidebarTools, SidebarWorkspaces, ProfileModal, CategoryModal, ConfirmModal
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { logInfo, logError, logWarn, logDebug } from '../../utils/loggerRenderer.js';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';

// ─── Hooki
import { useProfiles } from '../../hooks/useProfiles.js';
import { useCategories } from '../../hooks/useCategories.js';
import { useSidebarSearch } from '../../hooks/useSidebarSearch.js';
import { useWorkspaces } from '../../hooks/useWorkspaces.js';

// ─── Podkomponenty
import SidebarHeader from './SidebarHeader';
import SidebarProfileList from './SidebarProfileList';
import SidebarTools from './SidebarTools';
import SidebarWorkspaces from './SidebarWorkspaces';

// ─── Modale (przeniesione do src/ui/modals/)
import ProfileModal from '../modals/ProfileModal';
import CategoryModal from '../modals/CategoryModal';
import ConfirmModal from '../modals/ConfirmModal';

// ─── Sidebar() – orkiestrator panelu bocznego
// @param {Object} props
// @param {Function} props.onSelect – callback wyboru elementu
// @param {Object} props.activeItem – aktywny element
// @param {Function} props.onOpenTaskPanel – callback otwarcia panelu zadań
// @param {Function} props.onModalOpenChange – callback zmiany stanu modala
// @returns {JSX.Element} – renderowany sidebar
export default function Sidebar({ onSelect, activeItem, onOpenTaskPanel, onModalOpenChange }) {
  const { t } = useContext(TranslationContext);

  // ─── Hooki biznesowe ───
  const { profiles, loading: profilesLoading, addProfile, updateProfile, deleteProfile, toggleFavorite } = useProfiles();
  const { categories, collapsed, toggleCollapse, saveCategories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { search, setSearch, favorites, byCategory, globalEnabled, setGlobalEnabled, globalResults, isGlobalSearching } = useSidebarSearch(profiles);
  const { workspaces } = useWorkspaces();

  // ─── Stan lokalny UI ───
  const [toolsCollapsed, setToolsCollapsed] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);

  // ─── Sync modal state z parent ───
  const modalOpen = showProfileModal || showCategoryModal || showDeleteConfirm;
  useEffect(() => onModalOpenChange?.(modalOpen), [modalOpen, onModalOpenChange]);

  // ─── Handlery profili ───
  const handleAddProfile = useCallback(() => {
    setEditingProfile(null);
    setShowProfileModal(true);
    logDebug('ui', 'Sidebar: opening profile modal (add)');
  }, []);

  const handleSaveProfile = useCallback(async (profileData) => {
    try {
      const isEdit = profiles.some(p => p.id === profileData.id);
      if (isEdit) {
        await updateProfile(profileData.id, profileData);
      } else {
        await addProfile(profileData);
        window.electronAPI?.addHistory?.({
          profileName: profileData.name,
          url: profileData.url
        }).catch(err => logError('store', 'Sidebar: failed to add history entry', err.message));
      }

      // ─── Przypisanie do grupy zadań (shared TaskGroup)
      //   Jeśli profil ma taskGroupId → przypisz przez IPC
      //   Jeśli usunięto (puste) → odepnij od poprzedniej grupy
      try {
        if (profileData.taskGroupId) {
          await window.electronAPI.invoke('taskGroups:assignProfile', {
            groupId:   profileData.taskGroupId,
            profileId: profileData.id,
          });
          logInfo('ui', `Sidebar: profil ${profileData.id} przypisany do grupy ${profileData.taskGroupId}`);
        } else if (isEdit) {
          // Sprawdź czy profil miał grupę — jeśli tak, odepnij
          const prevProfile = profiles.find(p => p.id === profileData.id);
          if (prevProfile?.taskGroupId) {
            await window.electronAPI.invoke('taskGroups:unassignProfile', { profileId: profileData.id });
            logInfo('ui', `Sidebar: profil ${profileData.id} odpięty od grupy`);
          }
        }
      } catch (groupErr) {
        logError('ui', 'Sidebar: taskGroup assignment failed', groupErr.message);
      }

      setShowProfileModal(false);
      onSelect({ ...profileData, type: 'webview' });
      logInfo('ui', `Sidebar: profile ${isEdit ? 'updated' : 'created'}`, profileData.id);
    } catch (err) {
      logError('ui', 'Sidebar: handleSaveProfile failed', err.message);
    }
  }, [profiles, addProfile, updateProfile, onSelect]);

  const handleEditProfile = useCallback((profile) => {
    setEditingProfile(profile);
    setShowProfileModal(true);
  }, []);

  const handleDeleteClick = useCallback((profileId) => {
    setProfileToDelete(profileId);
    setShowDeleteConfirm(true);
    logDebug('ui', 'Sidebar: delete confirm triggered', profileId);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      if (profileToDelete) {
        await deleteProfile(profileToDelete);
        if (activeItem?.id === profileToDelete) {
          onSelect(null);
        }
      }
      setShowDeleteConfirm(false);
      setProfileToDelete(null);
    } catch (err) {
      logError('ui', 'Sidebar: handleDeleteConfirm failed', err.message);
    }
  }, [profileToDelete, deleteProfile, activeItem, onSelect]);

  const handleToggleFavorite = useCallback(async (id) => {
    await toggleFavorite(id);
  }, [toggleFavorite]);

  // ─── Handlery kategorii ───
  const handleAddCategory = useCallback(() => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  }, []);

  const handleSaveCategory = useCallback(async (cat) => {
    try {
      const exists = categories.find(c => c.id === cat.id);
      if (exists) {
        await updateCategory(cat.id, cat);
      } else {
        await addCategory(cat);
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
    } catch (err) {
      logError('ui', 'Sidebar: handleSaveCategory failed', err.message);
    }
  }, [categories, addCategory, updateCategory]);

  const handleEditCategory = useCallback((cat) => {
    setEditingCategory(cat);
    setShowCategoryModal(true);
  }, []);

  const handleDeleteCategory = useCallback(async (id) => {
    try {
      await deleteCategory(id);
    } catch (err) {
      logError('ui', 'Sidebar: handleDeleteCategory failed', err.message);
    }
  }, [deleteCategory]);

  // ─── handleGlobalSelect() – obsługa kliknięcia wyniku globalnego wyszukiwania
  //   @param {{ type: string, id: string|number, label: string }} result
  const handleGlobalSelect = useCallback((result) => {
    logDebug('ui', `Sidebar: global search result selected type=${result.type} id=${result.id}`);
    if (result.type === 'profile') {
      const profile = profiles.find(p => p.id === result.id);
      if (profile) onSelect({ ...profile, type: 'webview' });
    } else if (result.type === 'project') {
      onSelect({ id: result.id, name: result.label, type: 'special' });
    } else if (result.type === 'task') {
      onOpenTaskPanel?.(result.label);
    } else if (result.type === 'note') {
      onSelect({ id: 'notepad', type: 'special' });
    }
    setSearch('');
  }, [profiles, onSelect, onOpenTaskPanel, setSearch]);

  if (profilesLoading) {
    return <div className="sidebar-loading">{t('common.loading')}</div>;
  }

  return (
    <div style={{
      width: 'var(--sidebar-width)', minWidth: 200, maxWidth: 280,
      background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', height: '100vh', flexShrink: 0
    }}>
      {/* ─── Nagłówek ─── */}
      <SidebarHeader
        onAddProfile={handleAddProfile}
        onAddCategory={handleAddCategory}
        searchValue={search}
        onSearchChange={setSearch}
        globalEnabled={globalEnabled}
        onGlobalToggle={() => setGlobalEnabled(v => !v)}
        globalResults={globalResults}
        isGlobalSearching={isGlobalSearching}
        onGlobalSelect={handleGlobalSelect}
      />

      {/* ─── Lista profili ─── */}
      <SidebarProfileList
        favorites={favorites}
        byCategory={byCategory}
        categories={categories}
        collapsed={collapsed}
        activeItem={activeItem}
        onSelect={onSelect}
        onToggleCollapse={toggleCollapse}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
        onEditProfile={handleEditProfile}
        onToggleFavorite={handleToggleFavorite}
        onDeleteProfile={handleDeleteClick}
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
      {showProfileModal && (
        <ProfileModal
          profile={editingProfile}
          categories={categories}
          onSave={handleSaveProfile}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {showCategoryModal && (
        <CategoryModal
          category={editingCategory}
          onSave={handleSaveCategory}
          onClose={() => { setShowCategoryModal(false); setEditingCategory(null); }}
        />
      )}

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title={t('confirm.deleteProfileTitle')}
        message={t('confirm.deleteProfileMessage')}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setShowDeleteConfirm(false); setProfileToDelete(null); }}
      />
    </div>
  );
}