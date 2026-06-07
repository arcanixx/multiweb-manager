// =============================================================================
// FILE: useSidebarHandlers.js
// PATH: src/hooks/sidebar/useSidebarHandlers.js
// VERSION: 0.0.3
// PURPOSE: Hook orkiestrator logiki handlerów Sidebaru – zarządza stanem modali (profil, kategoria, potwierdzenie usunięcia) oraz obsługuje akcje CRUD profili, kategorii i wyników globalnego wyszukiwania.
// FUNCTIONS: useSidebarHandlers
// DEPENDS ON: react, loggerRenderer.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { logInfo, logError, logDebug } from '../../utils/loggerRenderer.js';

// ─── useSidebarHandlers() – hook logiki Sidebar; oddziela handlery od JSX orkiestratora
//   @param {Object} params
//   @param {Array}    params.profiles       – lista profili z useProfiles
//   @param {Function} params.addProfile     – z useProfiles
//   @param {Function} params.updateProfile  – z useProfiles
//   @param {Function} params.deleteProfile  – z useProfiles
//   @param {Function} params.toggleFavorite – z useProfiles
//   @param {Array}    params.categories     – lista kategorii z useCategories
//   @param {Function} params.addCategory    – z useCategories
//   @param {Function} params.updateCategory – z useCategories
//   @param {Function} params.deleteCategory – z useCategories
//   @param {Function} params.onSelect       – callback wyboru elementu (z props Sidebar)
//   @param {Function} params.onOpenTaskPanel – callback otwarcia TaskPanel (z props Sidebar)
//   @param {Function} params.setSearch      – z useSidebarSearch
//   @param {Function} params.onModalOpenChange – callback do parenta (z props Sidebar)
//   @returns {Object} – stan modali + wszystkie handlery

export function useSidebarHandlers({
  profiles, addProfile, updateProfile, deleteProfile, toggleFavorite,
  categories, addCategory, updateCategory, deleteCategory,
  onSelect, onOpenTaskPanel, setSearch,
  onModalOpenChange,
}) {
  // ─── Stan modali ───
  const [showProfileModal,  setShowProfileModal]  = useState(false);
  const [editingProfile,    setEditingProfile]    = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory,   setEditingCategory]   = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profileToDelete,   setProfileToDelete]   = useState(null);

  // ─── Sync stanu modali z parentem ───
  const modalOpen = showProfileModal || showCategoryModal || showDeleteConfirm;
  useEffect(() => {
    onModalOpenChange?.(modalOpen);
  }, [modalOpen, onModalOpenChange]);

  // ─── Handlery profili ──────────────────────────────────────────────────────

  const handleAddProfile = useCallback(() => {
    setEditingProfile(null);
    setShowProfileModal(true);
    logDebug('ui', 'Sidebar: opening profile modal (add)');
  }, []);

  const handleEditProfile = useCallback((profile) => {
    setEditingProfile(profile);
    setShowProfileModal(true);
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
          url: profileData.url,
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

  const handleDeleteClick = useCallback((profileId) => {
    setProfileToDelete(profileId);
    setShowDeleteConfirm(true);
    logDebug('ui', 'Sidebar: delete confirm triggered', profileId);
  }, []);

  const handleDeleteConfirm = useCallback(async (activeItemId) => {
    try {
      if (profileToDelete) {
        await deleteProfile(profileToDelete);
        if (activeItemId === profileToDelete) onSelect(null);
      }
      setShowDeleteConfirm(false);
      setProfileToDelete(null);
    } catch (err) {
      logError('ui', 'Sidebar: handleDeleteConfirm failed', err.message);
    }
  }, [profileToDelete, deleteProfile, onSelect]);

  const handleToggleFavorite = useCallback(async (id) => {
    await toggleFavorite(id);
  }, [toggleFavorite]);

  // ─── Handlery kategorii ────────────────────────────────────────────────────

  const handleAddCategory = useCallback(() => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  }, []);

  const handleEditCategory = useCallback((cat) => {
    setEditingCategory(cat);
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

  const handleDeleteCategory = useCallback(async (id) => {
    try {
      await deleteCategory(id);
    } catch (err) {
      logError('ui', 'Sidebar: handleDeleteCategory failed', err.message);
    }
  }, [deleteCategory]);

  // ─── Handler globalnego wyszukiwania ──────────────────────────────────────

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

  // ─── Closery modali (dla JSX) ─────────────────────────────────────────────
  const closeProfileModal  = useCallback(() => setShowProfileModal(false), []);
  const closeCategoryModal = useCallback(() => {
    setShowCategoryModal(false);
    setEditingCategory(null);
  }, []);
  const cancelDeleteConfirm = useCallback(() => {
    setShowDeleteConfirm(false);
    setProfileToDelete(null);
  }, []);

  return {
    // Stan modali
    showProfileModal, editingProfile,
    showCategoryModal, editingCategory,
    showDeleteConfirm,

    // Handlery profili
    handleAddProfile, handleEditProfile, handleSaveProfile,
    handleDeleteClick, handleDeleteConfirm, handleToggleFavorite,

    // Handlery kategorii
    handleAddCategory, handleEditCategory, handleSaveCategory, handleDeleteCategory,

    // Globalne wyszukiwanie
    handleGlobalSelect,

    // Closery modali
    closeProfileModal, closeCategoryModal, cancelDeleteConfirm,
  };
}
