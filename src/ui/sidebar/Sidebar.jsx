// =============================================================================
// FILE: Sidebar.jsx
// PATH: src/ui/sidebar/Sidebar.jsx
// VERSION: 0.0.3
// PURPOSE: Główny panel nawigacyjny aplikacji – zarządza listą profili, hierarchią kategorii, narzędziami systemowymi oraz integracją z mostkiem IPC dla trwałości ustawień.
// FUNCTIONS: Sidebar
// DEPENDS ON: react, loggerRenderer.js, translations.js, icons.js, ProfileModal.jsx, CategoryModal.jsx, ContextMenu.jsx, SidebarSearch.jsx, SidebarCategory.jsx, SidebarProfileItem.jsx, SidebarTools.jsx, SidebarWorkspaces.jsx, ConfirmModal.jsx
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useEffect, useContext } from 'react';
import { logInfo, logError, logWarn, logDebug } from '../utils/loggerRenderer.js';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import ProfileModal from './ProfileModal';
import CategoryModal from './CategoryModal';
import ContextMenu from './ContextMenu';
import SidebarSearch from './SidebarSearch';
import SidebarCategory from './SidebarCategory';
import SidebarProfileItem from './SidebarProfileItem';
import SidebarTools from './SidebarTools';
import SidebarWorkspaces from './SidebarWorkspaces';
import ConfirmModal from '../modals/ConfirmModal.jsx';

// ─── Sidebar() – główny panel boczny z profile, kategoriami i narzędziami
//   @param {Object} props – właściwości komponentu
//   @param {Array} props.profiles – lista profili do wyświetlenia
//   @param {Function} props.onSelect – callback wyboru elementu
//   @param {Object} props.activeItem – aktywny element
//   @param {Function} props.onProfilesChange – callback zmiany profili
//   @param {Function} props.onOpenTaskPanel – callback otwarcia panelu zadań
//   @param {Function} props.onModalOpenChange – callback zmiany stanu modala
//   @returns {JSX.Element} – renderowany sidebar

export default function Sidebar({ profiles, onSelect, activeItem, onProfilesChange, onOpenTaskPanel, onModalOpenChange }) {
  const { t } = useContext(TranslationContext);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [collapsed, setCollapsed] = useState({});
  const [toolsCollapsed, setToolsCollapsed] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const modalOpen = showProfileModal || showCategoryModal;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);

  useEffect(() => onModalOpenChange?.(modalOpen), [modalOpen, onModalOpenChange]);

  // ─── useEffect – Inicjalizacja kategorii i stanu zwinięcia przy montowaniu komponentu
  useEffect(() => {
    try {
      window.electronAPI.getSettings().then(s => {
        setCategories(s.categories || []);
        setCollapsed(s.collapsedCategories || {});
        logInfo('ui', 'Sidebar: categories and collapse state initialized');
      }).catch(err => {
        logError('ui', 'Sidebar: failed to load settings', err.message);
      });
    } catch (err) {
      logError('ui', 'Sidebar: exception in settings loading', err.message);
    }
  }, []);

  // ─── saveCategories() – zapisuje kategorie i ich stan zwinięcia
  //   @param {Array} cats – lista kategorii
  //   @param {Object} cols – stan zwiniętych kategorii
  const saveCategories = (cats, cols = collapsed) => {
    try {
      setCategories(cats);
      window.electronAPI.saveSettings({ categories: cats, collapsedCategories: cols });
      logInfo('settings', 'Sidebar: categories saved');
    } catch (err) {
      logError('settings', 'Sidebar: saveCategories failed', err.message);
    }
  };

  // ─── saveProfiles() – zapisuje profile przez IPC
  //   @param {Array} newProfiles – aktualizowana lista profili
  const saveProfiles = (newProfiles) => {
    try {
      onProfilesChange(newProfiles);
      window.electronAPI.saveProfiles(newProfiles);
      logInfo('store', 'Sidebar: profiles saved');
    } catch (err) {
      logError('store', 'Sidebar: saveProfiles failed', err.message);
    }
  };

  // ─── handleAddProfile() – otwiera modal dodawania nowego profilu
  const handleAddProfile = () => {
    setEditingProfile(null);
    setShowProfileModal(true);
    logDebug('ui', 'Sidebar: opening profile modal (add)');
  };

  // ─── handleSaveProfile() – zapisuje profil (nowy lub edytowany)
  //   @param {Object} profileData – dane profilu
  const handleSaveProfile = (profileData) => {
    try {
      const exists = profiles.find(p => p.id === profileData.id);
      const newProfiles = exists
        ? profiles.map(p => p.id === profileData.id ? profileData : p)
        : [...profiles, profileData];
      
      saveProfiles(newProfiles);
      setShowProfileModal(false);
      onSelect({ ...profileData, type: 'webview' });
      
      if (!exists) {
        window.electronAPI.addHistory({ 
          profileName: profileData.name, 
          url: profileData.url 
        }).catch(err => logError('store', 'Sidebar: failed to add history entry', err.message));
      }
      
      logInfo('ui', `Sidebar: profile ${exists ? 'updated' : 'created'}`, profileData.id);
    } catch (err) {
      logError('ui', 'Sidebar: handleSaveProfile failed', err.message);
    }
  };

  // ─── toggleFavorite() – przełącza status ulubionego dla profilu
  //   @param {number} profileId – ID profilu
  const toggleFavorite = (profileId) => {
    try {
      saveProfiles(profiles.map(p => p.id === profileId ? { ...p, favorite: !p.favorite } : p));
      logDebug('ui', 'Sidebar: favorite toggled', profileId);
    } catch (err) {
      logError('ui', 'Sidebar: toggleFavorite failed', err.message);
    }
  };

  // ─── deleteProfile() – oryginalna funkcja usuwania
  const deleteProfile = (profileId) => {
    try {
      const newProfiles = profiles.filter(p => p.id !== profileId);
      saveProfiles(newProfiles);
      if (activeItem?.id === profileId) {
        onSelect(null);
      }
      logInfo('ui', `Sidebar: deleted profile ${profileId}`);
    } catch (err) {
      logError('ui', 'Sidebar: deleteProfile failed', err.message);
    }
  };

  // ─── handleDeleteClick() – otwiera modal potwierdzenia
  const handleDeleteClick = (profileId) => {
    setProfileToDelete(profileId);
    setShowDeleteConfirm(true);
    logDebug('ui', 'Sidebar: delete confirm triggered', profileId);
  };

  // ─── handleDeleteConfirm() – wykonuje usunięcie po potwierdzeniu
  const handleDeleteConfirm = () => {
    try {
      if (profileToDelete) {
        deleteProfile(profileToDelete);
      }
      setShowDeleteConfirm(false);
      setProfileToDelete(null);
    } catch (err) {
      logError('ui', 'Sidebar: handleDeleteConfirm failed', err.message);
    }
  };

  // ─── toggleCollapse() – przełącza stan zwinięcia kategorii
  //   @param {string} catId – ID kategorii
  const toggleCollapse = (catId) => {
    try {
      const newCollapsed = { ...collapsed, [catId]: !collapsed[catId] };
      setCollapsed(newCollapsed);
      saveCategories(categories, newCollapsed);
      logDebug('ui', 'Sidebar: category collapse toggled', catId);
    } catch (err) {
      logError('ui', 'Sidebar: toggleCollapse failed', err.message);
    }
  };

  // ─── handleContext() – obsługuje menu kontekstowe dla profilu
  //   @param {Event} e – zdarzenie myszy
  //   @param {Object} profile – profil dla którego otwarte menu
  const handleContext = (e, profile) => {
    try {
      e.preventDefault();
      const items = [
        { icon: ICONS.EDIT, label: t('sidebar.edit_profile'), action: () => { setEditingProfile(profile); setShowProfileModal(true); } },
        { icon: profile.favorite ? ICONS.UNPIN : ICONS.STAR, label: profile.favorite ? t('sidebar.unpin') : t('sidebar.pin'), action: () => toggleFavorite(profile.id) },
        '---',
        { icon: ICONS.TASKS, label: t('sidebar.open_tasks'), action: () => onOpenTaskPanel?.(profile) },
        '---',
        { icon: ICONS.DELETE, label: t('sidebar.delete_profile'), action: () => handleDeleteClick(profile.id), danger: true },
      ];
      setContextMenu({ x: e.clientX, y: e.clientY, items });
    } catch (err) {
      logError('ui', 'Sidebar: handleContext failed', err.message);
    }
  };

  const searchLower = search.toLowerCase();
  const filtered = profiles.filter(p => !search || p.name.toLowerCase().includes(searchLower) || (p.category || '').toLowerCase().includes(searchLower));
  const favorites = filtered.filter(p => p.favorite);
  const byCategory = {};
  filtered.filter(p => !p.favorite).forEach(p => { const cat = p.category || ''; if (!byCategory[cat]) byCategory[cat] = []; byCategory[cat].push(p); });

  // ─── renderProfile() – renderuje pojedynczy profil jako SidebarProfileItem
  //   @param {Object} p – obiekt profilu
  //   @returns {JSX.Element} – renderowany element profilu
  const renderProfile = (p) => {
    const isActive = activeItem?.id === p.id;
    return <SidebarProfileItem key={p.id} profile={p} isActive={isActive} onSelect={() => onSelect({ ...p, type: 'webview' })} onContextMenu={(e) => handleContext(e, p)} />;
  };

  return (
    <div style={{ width: 'var(--sidebar-width)', minWidth: 200, maxWidth: 280, background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', height: '100vh', flexShrink: 0 }}>
      <div style={{ padding: '12px 10px 8px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
          <button className="btn btn-primary" style={{ flex: 1, fontSize: 12 }} onClick={handleAddProfile}>{ICONS.PLUS} {t('sidebar.add_profile')}</button>
          <button className="btn-icon" onClick={() => { setEditingCategory(null); setShowCategoryModal(true); }} title={t('sidebar.add_category')}>{ICONS.FOLDER_ADD}</button>
        </div>
        <SidebarSearch value={search} onChange={setSearch} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 6px' }}>
        {favorites.length > 0 && (
          <div>
            <div className="sidebar-category">{ICONS.STAR} {t('sidebar.favorites')}</div>
            {favorites.map(renderProfile)}
          </div>
        )}

        {Object.entries(byCategory).sort(([a], [b]) => a.localeCompare(b)).map(([catName, catProfiles]) => {
          const catObj = categories.find(c => c.name === catName);
          const catId = catObj?.id || catName;
          const isCollapsed = collapsed[catId];
          return (
            <div key={catName}>
              <SidebarCategory name={catName} icon={catObj?.icon || ICONS.FOLDER} isCollapsed={isCollapsed}
                onToggle={() => toggleCollapse(catId)} onContextMenu={(e) => {
                  try {
                    e.preventDefault();
                    if (catObj) setContextMenu({ x: e.clientX, y: e.clientY, items: [
                      { icon: ICONS.EDIT, label: t('sidebar.edit_category'), action: () => { setEditingCategory(catObj); setShowCategoryModal(true); } },
                      { icon: ICONS.DELETE, label: t('sidebar.delete_category'), action: () => saveCategories(categories.filter(c => c.id !== catObj.id)), danger: true }
                    ]});
                  } catch (err) {
                    logError('ui', 'Sidebar: category context menu failed', err.message);
                  }
                }} />
              {!isCollapsed && catProfiles.map(renderProfile)}
            </div>
          );
        })}

        {byCategory['']?.length > 0 && (
          <div>
            <div className="sidebar-category">{ICONS.FOLDER} {t('sidebar.all_workspaces') || t('sidebar.all_profiles')}</div>
            {byCategory[''].map(renderProfile)}
          </div>
        )}

        <div style={{ height: 1, background: 'var(--border)', margin: '10px 4px' }} />
        <div className="sidebar-category" onClick={() => setToolsCollapsed(c => !c)}>
          <span>{ICONS.SETTINGS}</span><span style={{ flex: 1 }}>{t('sidebar.special')}</span>
          <span style={{ fontSize: 10 }}>{toolsCollapsed ? ICONS.CHEVRON_RIGHT : ICONS.CHEVRON_DOWN}</span>
        </div>
        {!toolsCollapsed && <SidebarTools activeItem={activeItem} onSelect={onSelect} />}
      </div>

      {showProfileModal && <ProfileModal profile={editingProfile} categories={categories} onSave={handleSaveProfile} onClose={() => setShowProfileModal(false)} />}
      {showCategoryModal && <CategoryModal category={editingCategory} onSave={(cat) => { const exists = categories.find(c => c.id === cat.id); saveCategories(exists ? categories.map(c => c.id === cat.id ? cat : c) : [...categories, cat]); setShowCategoryModal(false); }} onClose={() => setShowCategoryModal(false)} />}
      {contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y} items={contextMenu.items} onClose={() => setContextMenu(null)} />}

      {/* ─── MODAL POTWIERDZENIA USUNIĘCIA – NA KOŃCU PRZED ZAMYKAJĄCYM DIVEM ─── */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title={t('confirm.deleteProfileTitle')}
        message={t('confirm.deleteProfileMessage')}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setProfileToDelete(null);
        }}
      />
    </div>
  );
}